import {
  translateEarthquakeLocation,
  formatDistanceToCambodia,
} from "../features/earthquakes/earthquake-data.ts";
import type { EarthquakeEvent } from "../features/earthquakes/earthquake-data.ts";

/**
 * Facebook Integration & Auto-Publisher Service for GeoCam
 * Connected Page: Geosciences Society of Cambodia (ID: 105049257586051)
 * URL: https://www.facebook.com/geoscience.cambodia/
 */

export const FACEBOOK_PAGE_ID = "105049257586051";
export const FACEBOOK_PAGE_URL = "https://www.facebook.com/geoscience.cambodia/";
export const FACEBOOK_PAGE_NAME = "Geosciences Society of Cambodia · GeoCam (GeoCam101)";

export interface FacebookSettings {
  pageId: string;
  pageUrl: string;
  pageName: string;
  accessToken: string;
  autoPostArticles: boolean;
  autoPostEvents: boolean;
  autoPostNews: boolean;
  autoPostEarthquakes: boolean;
  minEarthquakeMagnitude: number;
  regionalEarthquakesOnly: boolean;
  recentBroadcasts: FacebookBroadcastRecord[];
}

export interface FacebookBroadcastRecord {
  id: string;
  type: "post" | "event" | "news" | "earthquake" | "test";
  title: string;
  timestamp: string;
  status: "success" | "pending" | "error" | "mock_published";
  fbPostId?: string;
  fbPostUrl?: string;
  error?: string;
}

const STORAGE_KEY = "geocam_facebook_settings";

/**
 * Resolve canonical production origin (prefers geocam.site, falls back to window.location.origin)
 */
export function getCanonicalSiteOrigin(): string {
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    if (origin.includes("geocam.site") || origin.includes("geocam-website.vercel.app")) {
      return origin;
    }
  }
  return "https://geocam.site";
}

/**
 * Generate formatted bilingual bulletin description status for Facebook sharing
 */
export function generateEarthquakeFacebookStatus(
  event: EarthquakeEvent,
  targetUrl: string,
): string {
  const mag =
    event.magnitude !== null && event.magnitude !== undefined
      ? event.magnitude.toFixed(1)
      : "—";

  const depthKm =
    event.depthKm !== null && event.depthKm !== undefined
      ? `${event.depthKm.toFixed(0)} km`
      : "Unknown";

  const depthKmKh =
    event.depthKm !== null && event.depthKm !== undefined
      ? `${event.depthKm.toFixed(0)} គ.ម`
      : "មិនទាន់បញ្ជាក់";

  const dateObj = new Date(event.originTime);
  const timeIct = !isNaN(dateObj.getTime())
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Phnom_Penh",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(dateObj)
    : "Recent";

  const locEn = translateEarthquakeLocation(event.location, "en");
  const locKm = translateEarthquakeLocation(event.location, "km");
  const provider = event.reports?.[0]?.provider || "Seismic Monitoring";

  const distEn = formatDistanceToCambodia(
    event.distanceToCambodiaKm,
    event.latitude,
    event.longitude,
    false,
  );
  const distKm = formatDistanceToCambodia(
    event.distanceToCambodiaKm,
    event.latitude,
    event.longitude,
    true,
  );
  const distLine = distEn && distEn !== "—" ? `${distEn} (${distKm})` : "";

  const lines = [
    `🚨 [EARTHQUAKE BULLETIN / ដំណឹងរញ្ជួយដី]`,
    `🔴 Magnitude / កម្រិតរញ្ជួយ: M ${mag} (Richter)`,
    `📍 Epicenter / ទីតាំង: ${locEn}${locKm !== locEn ? ` / ${locKm}` : ""}`,
    distLine ? `🧭 Proximity / ចម្ងាយពីកម្ពុជា: ${distLine}` : "",
    `⏱ Time / ម៉ោងនៅកម្ពុជា: ${timeIct} ICT (UTC+7)`,
    `📏 Focal Depth / ជម្រៅ: ${depthKm} (${depthKmKh})`,
    `📡 Source Network / ប្រភព: ${provider}`,
    ``,
    `Explore live interactive 3D seismic monitoring & regional tectonic maps:`,
    `🔗 ${targetUrl}`,
    ``,
    `#geocam #earthquake #seismology #cambodia #geohazard #រញ្ជួយដី`,
  ].filter(Boolean);

  return lines.join("\n");
}

/**
 * Build Facebook sharer URL pointing to dedicated open graph metadata endpoint
 */
export function buildFacebookShareUrl(event: EarthquakeEvent): string {
  const origin = getCanonicalSiteOrigin();
  const directShareUrl = `${origin}/api/earthquake-share?id=${encodeURIComponent(event.id)}`;
  const appEventUrl = `${origin}/earthquake-monitoring?event=${encodeURIComponent(event.id)}`;
  const quoteText = generateEarthquakeFacebookStatus(event, appEventUrl);

  const params = new URLSearchParams();
  params.set("u", directShareUrl);
  params.set("quote", quoteText);
  params.set("hashtag", "#geocam");

  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

/**
 * 1-Click Share handler with native Web Share API fallback and clipboard convenience
 */
export async function shareEarthquakeToFacebook(
  event: EarthquakeEvent,
  e?: React.MouseEvent | MouseEvent,
): Promise<void> {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }

  const origin = getCanonicalSiteOrigin();
  const eventUrl = `${origin}/earthquake-monitoring?event=${encodeURIComponent(event.id)}`;
  const quote = generateEarthquakeFacebookStatus(event, eventUrl);
  const shareUrl = buildFacebookShareUrl(event);

  // Copy bulletin description to clipboard so the user can easily paste if desired
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(quote);
    }
  } catch {}

  // Open Facebook Sharer in a standard centered popup window
  const width = 640;
  const height = 680;
  const left = window.screenLeft !== undefined ? window.screenLeft + (window.outerWidth - width) / 2 : 100;
  const top = window.screenTop !== undefined ? window.screenTop + (window.outerHeight - height) / 2 : 100;

  const win = window.open(
    shareUrl,
    "FacebookShare",
    `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`,
  );

  if (!win || win.closed || typeof win.closed === "undefined") {
    // Popup blocked: open in normal new tab
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }
}

export function getFacebookSettings(): FacebookSettings {
  if (typeof window === "undefined") {
    return getDefaultFacebookSettings();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultFacebookSettings();
    const parsed = JSON.parse(raw);

    // Auto-migrate old Business Portfolio ID to actual Page ID
    if (parsed.pageId === "360240070266245" || !parsed.pageId) {
      parsed.pageId = FACEBOOK_PAGE_ID;
      parsed.pageUrl = FACEBOOK_PAGE_URL;
      parsed.pageName = FACEBOOK_PAGE_NAME;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, pageId: FACEBOOK_PAGE_ID, pageUrl: FACEBOOK_PAGE_URL }));
      } catch {}
    }
    return {
      ...getDefaultFacebookSettings(),
      ...parsed,
      pageId: parsed.pageId || FACEBOOK_PAGE_ID,
      pageUrl: parsed.pageUrl || FACEBOOK_PAGE_URL,
      pageName: parsed.pageName || FACEBOOK_PAGE_NAME,
    };
  } catch {
    return getDefaultFacebookSettings();
  }
}

export function saveFacebookSettings(settings: Partial<FacebookSettings>): FacebookSettings {
  const current = getFacebookSettings();
  const updated: FacebookSettings = {
    ...current,
    ...settings,
    pageId: settings.pageId || current.pageId || FACEBOOK_PAGE_ID,
    pageUrl: settings.pageUrl || current.pageUrl || FACEBOOK_PAGE_URL,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save Facebook settings to localStorage:", err);
  }
  return updated;
}

export function getDefaultFacebookSettings(): FacebookSettings {
  return {
    pageId: FACEBOOK_PAGE_ID,
    pageUrl: FACEBOOK_PAGE_URL,
    pageName: FACEBOOK_PAGE_NAME,
    accessToken: "",
    autoPostArticles: true,
    autoPostEvents: true,
    autoPostNews: true,
    autoPostEarthquakes: true,
    minEarthquakeMagnitude: 3.5,
    regionalEarthquakesOnly: true,
    recentBroadcasts: [],
  };
}

export interface PublishPayload {
  title: string;
  titleKm?: string;
  summary: string;
  summaryKm?: string;
  link?: string;
  imageUrl?: string;
  type: "post" | "event" | "news" | "earthquake" | "test";
  meta?: Record<string, any>;
}

export async function broadcastToFacebook(payload: PublishPayload): Promise<{
  success: boolean;
  postId?: string;
  postUrl?: string;
  message?: string;
  error?: string;
}> {
  const settings = getFacebookSettings();
  const recordId = `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  // Construct formatted bilingual Facebook caption
  let message = "";
  const siteUrl = getCanonicalSiteOrigin();
  const targetLink = payload.link
    ? payload.link.startsWith("http")
      ? payload.link
      : `${siteUrl}${payload.link}`
    : siteUrl;

  if (payload.type === "earthquake") {
    const mag = payload.meta?.mag ? Number(payload.meta.mag).toFixed(1) : "3.5";
    const depth = payload.meta?.depth || 10;
    const time = payload.meta?.timeIct || new Date().toLocaleString("en-GB", { timeZone: "Asia/Phnom_Penh" });
    const rawLocation = payload.meta?.place || payload.title;
    const locKm = translateEarthquakeLocation(rawLocation, "km");
    const locEn = translateEarthquakeLocation(rawLocation, "en");

    message = [
      `🚨 [EARTHQUAKE ALERT / ដំណឹងរញ្ជួយដី]`,
      `🔴 Magnitude: M ${mag} | កម្រិតរញ្ជួយ: ${mag} រ៉ិចទ័រ`,
      `📍 Location: ${locEn} | ទីតាំង: ${locKm}`,
      `⏱ Indochina Time / ម៉ោងនៅកម្ពុជា: ${time} (ICT, UTC+7)`,
      `📏 Focal Depth / ជម្រៅចំណុចកណ្តាល: ${depth} km`,
      ``,
      `Explore live 3D seismic monitoring & regional tectonic maps:`,
      `🔗 ${targetLink}`,
      ``,
      `#GeoCam #Earthquake #Cambodia #Seismology #USGS #GeoscienceCambodia #រញ្ជួយដី`,
    ].join("\n");
  } else if (payload.type === "event") {
    message = [
      `📅 [UPCOMING GEOSCIENCE EVENT / ព្រឹត្តិការណ៍ភូគព្ភសាស្ត្រ]`,
      `⭐ ${payload.title}`,
      payload.titleKm ? `🇰🇭 ${payload.titleKm}` : "",
      ``,
      payload.summary,
      payload.summaryKm ? `\n${payload.summaryKm}` : "",
      ``,
      payload.meta?.date ? `🗓 Date / កាលបរិច្ឆេទ: ${payload.meta.date}` : "",
      payload.meta?.location ? `📍 Venue / ទីតាំង: ${payload.meta.location}` : "",
      ``,
      `View full agenda & register:`,
      `🔗 ${targetLink}`,
      ``,
      `#GeoCam #Geoscience #Cambodia #Conference #Geology`,
    ]
      .filter(Boolean)
      .join("\n");
  } else if (payload.type === "news") {
    message = [
      `📰 [GEOSCIENCE NEWS / ព័ត៌មានភូគព្ភសាស្ត្រ]`,
      `📢 ${payload.title}`,
      payload.titleKm ? `🇰🇭 ${payload.titleKm}` : "",
      ``,
      payload.summary,
      payload.summaryKm ? `\n${payload.summaryKm}` : "",
      ``,
      `Read full report:`,
      `🔗 ${targetLink}`,
      ``,
      `#GeoCam #CambodiaGeology #EarthScience #GeoscienceNews`,
    ]
      .filter(Boolean)
      .join("\n");
  } else {
    // Standard publication / research post
    message = [
      `🔬 [NEW PUBLICATION & RESEARCH / អត្ថបទស្រាវជ្រាវថ្មី]`,
      `📌 ${payload.title}`,
      payload.titleKm ? `🇰🇭 ${payload.titleKm}` : "",
      ``,
      payload.summary,
      payload.summaryKm ? `\n${payload.summaryKm}` : "",
      ``,
      `Access full publication, spatial datasets & downloads:`,
      `🔗 ${targetLink}`,
      ``,
      `#GeoCam #CambodiaGeology #Geoscience #Research #Geopark #Mining`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  try {
    const res = await fetch("/api/facebook-publisher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageId: settings.pageId,
        accessToken: settings.accessToken,
        message,
        link: targetLink,
        imageUrl: payload.imageUrl,
        type: payload.type,
        title: payload.title,
      }),
    });

    const data = await res.json();

    const record: FacebookBroadcastRecord = {
      id: recordId,
      type: payload.type,
      title: payload.title,
      timestamp: new Date().toISOString(),
      status: data.success ? "success" : "error",
      fbPostId: data.postId,
      fbPostUrl: data.postUrl || `https://www.facebook.com/${settings.pageId}`,
      error: data.error,
    };

    // Save to broadcast history (keep latest 30)
    const history = [record, ...(settings.recentBroadcasts || [])].slice(0, 30);
    saveFacebookSettings({ recentBroadcasts: history });

    return {
      success: data.success,
      postId: data.postId,
      postUrl: data.postUrl,
      message: data.message,
      error: data.error,
    };
  } catch (err: any) {
    const errorMsg = err?.message || "Failed to reach Facebook Publisher API";
    const record: FacebookBroadcastRecord = {
      id: recordId,
      type: payload.type,
      title: payload.title,
      timestamp: new Date().toISOString(),
      status: "error",
      error: errorMsg,
    };
    const history = [record, ...(settings.recentBroadcasts || [])].slice(0, 30);
    saveFacebookSettings({ recentBroadcasts: history });

    return {
      success: false,
      error: errorMsg,
    };
  }
}
