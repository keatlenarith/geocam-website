import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put, get, list } from "@vercel/blob";

const DEFAULT_PAGE_ID = "105049257586051";
const FB_STATE_BLOB = "analytics/fb_earthquake_state.json";

interface FbEarthquakeState {
  lastChecked: string;
  publishedEventIds: string[];
}

export interface EarthquakeCronEvent {
  id: string;
  originTime: string;
  latitude: number;
  longitude: number;
  depthKm: number | null;
  magnitude: number | null;
  magnitudeType: string;
  location: string;
  reviewStatus: string;
  reports?: any[];
}

/**
 * Clean Khmer translations for major regional countries and provinces
 * Guarantees 0% Thai/Lao script.
 */
function translateLocationKm(loc: string): string {
  if (!loc) return "តំបន់ក្បែរខាងកម្ពុជា";
  let t = loc.trim();
  // Regional countries
  t = t.replace(/\bMyanmar\b/gi, "មីយ៉ាន់ម៉ា");
  t = t.replace(/\bBurma\b/gi, "មីយ៉ាន់ម៉ា");
  t = t.replace(/\bLaos\b/gi, "ឡាវ");
  t = t.replace(/\bThailand\b/gi, "ថៃ");
  t = t.replace(/\bVietnam\b/gi, "វៀតណាម");
  t = t.replace(/\bChina\b/gi, "ចិន");
  t = t.replace(/\bCambodia\b/gi, "កម្ពុជា");
  t = t.replace(/\bIndonesia\b/gi, "ឥណ្ឌូនេស៊ី");
  t = t.replace(/\bPhilippines\b/gi, "ហ្វីលីពីន");
  t = t.replace(/\bMalaysia\b/gi, "ម៉ាឡេស៊ី");
  t = t.replace(/\bIndia\b/gi, "ឥណ្ឌា");
  // Provinces
  t = t.replace(/Sainyabuli|Xayabury/gi, "ខេត្តសាយ៉ាបូរី");
  t = t.replace(/Bokeo/gi, "ខេត្តបកែវ");
  t = t.replace(/Luang Prabang/gi, "ខេត្តហ្លួងព្រះបាង");
  t = t.replace(/Oudomxay/gi, "ខេត្តឧត្តមជ័យ");
  t = t.replace(/Phongsaly/gi, "ខេត្តផុងសាលី");
  t = t.replace(/Luang Namtha/gi, "ខេត្តហ្លួងណាំថា");
  t = t.replace(/Houaphanh/gi, "ខេត្តហួរផាន់");
  t = t.replace(/Vientiane/gi, "ខេត្តវៀងចន្ទន៍");
  t = t.replace(/Khammouane/gi, "ខេត្តខាំមួន");
  t = t.replace(/Savannakhet/gi, "ខេត្តសាវ៉ាន់ណាខេត្ត");
  t = t.replace(/Champasak/gi, "ខេត្តចំប៉ាសាក់");
  t = t.replace(/Shan State/gi, "រដ្ឋសាន");
  t = t.replace(/Kachin State/gi, "រដ្ឋកាឈីន");
  t = t.replace(/Chiang Mai/gi, "ឈៀងម៉ៃ");
  t = t.replace(/Chiang Rai/gi, "ឈៀងរ៉ៃ");
  t = t.replace(/Mae Hong Son/gi, "ម៉ែហុងសន");
  t = t.replace(/Andaman Sea/gi, "សមុទ្រអាន់ដាម៉ាន");
  t = t.replace(/Gulf of Thailand/gi, "ឈូងសមុទ្រថៃ");
  t = t.replace(/South China Sea/gi, "សមុទ្រចិនខាងត្បូង");
  return t;
}

function formatIctTime(isoTime: string): string {
  try {
    const d = new Date(isoTime);
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Phnom_Penh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(d);
  } catch {
    return isoTime;
  }
}

async function loadPublishedState(): Promise<FbEarthquakeState> {
  try {
    const { blobs } = await list({ prefix: FB_STATE_BLOB });
    const target = blobs.find((b) => b.pathname === FB_STATE_BLOB);
    if (target) {
      const res = await get(target.url, { access: "private" });
      const text = await new Response(res.stream).text();
      return JSON.parse(text);
    }
  } catch (err) {
    console.warn("[Cron FB State] Init fallback:", err);
  }
  return { lastChecked: new Date().toISOString(), publishedEventIds: [] };
}

async function savePublishedState(state: FbEarthquakeState): Promise<void> {
  try {
    // Keep list bounded to last 500 IDs
    if (state.publishedEventIds.length > 500) {
      state.publishedEventIds = state.publishedEventIds.slice(-500);
    }
    await put(FB_STATE_BLOB, JSON.stringify(state), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch (err) {
    console.error("[Cron FB State Save Error]", err);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow manual trigger via POST or GET (with secret header or query param)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const cronSecret = process.env.CRON_SECRET || process.env.FB_CRON_SECRET;
  const authHeader = req.headers.authorization;
  const querySecret = typeof req.query.secret === "string" ? req.query.secret : undefined;

  // Verify secret if set in production
  if (cronSecret) {
    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` ||
      querySecret === cronSecret ||
      req.headers["x-vercel-cron"] === "1";
    if (!isAuthorized) {
      return res.status(401).json({ error: "Unauthorized cron execution." });
    }
  }

  const pageId = process.env.FB_PAGE_ID || DEFAULT_PAGE_ID;
  const accessToken = process.env.FB_PAGE_ACCESS_TOKEN || req.query.token as string || "";

  // 1. Fetch current 24h earthquake data from internal endpoint or directly
  let events: EarthquakeCronEvent[] = [];
  try {
    const siteUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://geocam-website.vercel.app";
    const eqRes = await fetch(`${siteUrl}/api/earthquakes?window=24h`);
    if (eqRes.ok) {
      const data = await eqRes.json();
      events = data.events || [];
    }
  } catch (err) {
    console.error("[Cron Earthquake Fetch Error]", err);
  }

  // 2. Filter for Regional Indochina Envelope (5-25N, 92-112E) and Magnitude >= 3.5
  const eligibleEvents = events.filter((e) => {
    const inEnvelope =
      e.latitude >= 5 &&
      e.latitude <= 25 &&
      e.longitude >= 92 &&
      e.longitude <= 112;
    const mag = typeof e.magnitude === "number" ? e.magnitude : 0;
    return inEnvelope && mag >= 3.5;
  });

  const state = await loadPublishedState();
  const publishedSet = new Set(state.publishedEventIds);

  const pendingEvents = eligibleEvents.filter((e) => !publishedSet.has(e.id));
  const results: any[] = [];

  // Sort chronologically (oldest to newest among pending) so posts appear in real time sequence
  pendingEvents.sort(
    (a, b) => new Date(a.originTime).getTime() - new Date(b.originTime).getTime()
  );

  for (const event of pendingEvents) {
    const mag = Number(event.magnitude).toFixed(1);
    const depth = event.depthKm ? `${event.depthKm} km` : "10 km";
    const ictTime = formatIctTime(event.originTime);
    const locEn = event.location || "Regional epicenter";
    const locKm = translateLocationKm(locEn);

    const message = [
      `🚨 [EARTHQUAKE ALERT / ដំណឹងរញ្ជួយដី]`,
      `🔴 Magnitude: M ${mag} | កម្រិតរញ្ជួយ: ${mag} រ៉ិចទ័រ`,
      `📍 Location: ${locEn} | ទីតាំង: ${locKm}`,
      `⏱ Indochina Time / ម៉ោងនៅកម្ពុជា: ${ictTime} (ICT, UTC+7)`,
      `📏 Focal Depth / ជម្រៅចំណុចកណ្តាល: ${depth}`,
      ``,
      `Explore live 3D seismic monitoring & regional tectonic maps:`,
      `🔗 https://geocam-website.vercel.app/earthquake-monitoring?event=${encodeURIComponent(event.id)}`,
      ``,
      `#GeoCam #Earthquake #Cambodia #Seismology #USGS #GeoscienceCambodia #រញ្ជួយដី`,
    ].join("\n");

    if (accessToken) {
      try {
        const graphEndpoint = `https://graph.facebook.com/v19.0/${pageId}/feed`;
        const params = new URLSearchParams();
        params.append("message", message);
        params.append("access_token", accessToken);
        params.append(
          "link",
          `https://geocam-website.vercel.app/earthquake-monitoring?event=${encodeURIComponent(event.id)}`
        );

        const fbRes = await fetch(graphEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });
        const fbData = await fbRes.json();

        if (fbRes.ok && fbData.id) {
          publishedSet.add(event.id);
          results.push({ id: event.id, status: "published", fbId: fbData.id });
        } else {
          results.push({
            id: event.id,
            status: "error",
            error: fbData.error?.message || "Failed to publish to Facebook",
          });
        }
      } catch (postErr: any) {
        results.push({ id: event.id, status: "error", error: postErr.message });
      }
    } else {
      // Dry-run preview if server token is not yet set in environment
      results.push({
        id: event.id,
        status: "dry_run",
        notice: "Set FB_PAGE_ACCESS_TOKEN in Vercel environment to broadcast automatically.",
        preview: message,
      });
      // Mark as seen so we don't spam once token is added
      publishedSet.add(event.id);
    }
  }

  state.lastChecked = new Date().toISOString();
  state.publishedEventIds = Array.from(publishedSet);
  await savePublishedState(state);

  return res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    checkedEventsCount: events.length,
    eligibleRegionalCount: eligibleEvents.length,
    newProcessed: results.length,
    hasServerToken: Boolean(accessToken),
    results,
  });
}
