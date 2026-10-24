/**
 * Facebook Integration & Auto-Publisher Service for GeoCam
 * Connected Page: Geosciences Society of Cambodia (ID: 360240070266245)
 * URL: https://www.facebook.com/geoscience.cambodia/
 */

export const FACEBOOK_PAGE_ID = "360240070266245";
export const FACEBOOK_PAGE_URL = "https://www.facebook.com/geoscience.cambodia/";
export const FACEBOOK_PAGE_NAME = "Geosciences Society of Cambodia · GeoCam";

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

export function getFacebookSettings(): FacebookSettings {
  if (typeof window === "undefined") {
    return getDefaultFacebookSettings();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultFacebookSettings();
    const parsed = JSON.parse(raw);
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
  type: "post" | "event" | "news" | "earthquake" | "test";
  title: string;
  titleKm?: string;
  summary: string;
  summaryKm?: string;
  link?: string;
  imageUrl?: string;
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
  const siteUrl = "https://geocam-website.vercel.app";
  const targetLink = payload.link
    ? payload.link.startsWith("http")
      ? payload.link
      : `${siteUrl}${payload.link}`
    : siteUrl;

  if (payload.type === "earthquake") {
    const mag = payload.meta?.mag ? Number(payload.meta.mag).toFixed(1) : "3.5";
    const depth = payload.meta?.depth || 10;
    const time = payload.meta?.timeIct || new Date().toLocaleString("en-GB", { timeZone: "Asia/Phnom_Penh" });
    const location = payload.meta?.place || payload.title;

    message = [
      `🚨 [EARTHQUAKE ALERT / ដំណឹងរញ្ជួយដី]`,
      `🔴 Magnitude: M ${mag} | កម្រិតរញ្ជួយ: ${mag} រ៉ិចទ័រ`,
      `📍 Location / ទីតាំង: ${location}`,
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
      `#GeoCam #Geoscience #CambodiaEvent #Geology #Mining #Geopark`,
    ]
      .filter(Boolean)
      .join("\n");
  } else if (payload.type === "news") {
    message = [
      `📰 [LATEST NEWS FEED / ព័ត៌មានទាន់ហេតុការណ៍]`,
      `📢 ${payload.title}`,
      payload.titleKm ? `🇰🇭 ${payload.titleKm}` : "",
      ``,
      payload.summary,
      payload.summaryKm ? `\n${payload.summaryKm}` : "",
      ``,
      `Read full report on GeoCam:`,
      `🔗 ${targetLink}`,
      ``,
      `#GeoCam #GeologyNews #Cambodia #EarthSciences #GeoscienceCambodia`,
    ]
      .filter(Boolean)
      .join("\n");
  } else {
    // Article / General Post / Test
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
