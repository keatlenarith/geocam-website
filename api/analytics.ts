import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put, get, list } from "@vercel/blob";
import {
  createEmptyStore,
  recordEvent,
  computeAnalyticsReport,
} from "../src/features/analytics/analytics-core.ts";
import type { AnalyticsStore, AnalyticsEvent } from "../src/features/analytics/types.ts";

const BLOB_FILE_NAME = "analytics/v1_data.json";

// In-memory cache for fast response and resilience
let memoryStore: AnalyticsStore | null = null;
let lastLoadTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

async function loadStoreFromBlob(): Promise<AnalyticsStore> {
  const now = Date.now();
  if (memoryStore && now - lastLoadTime < CACHE_TTL_MS) {
    return memoryStore;
  }

  try {
    const { blobs } = await list({ prefix: BLOB_FILE_NAME });
    const targetBlob = blobs.find((b) => b.pathname === BLOB_FILE_NAME);

    if (targetBlob) {
      const res = await get(targetBlob.url, { access: "private" });
      const text = await new Response(res.stream).text();
      const parsed = JSON.parse(text) as AnalyticsStore;
      memoryStore = parsed;
      lastLoadTime = now;
      return memoryStore;
    }
  } catch (err) {
    console.warn("Failed to load analytics from blob, using fallback:", err);
  }

  if (!memoryStore) {
    // Tracking starts on Oct 24, 2026
    memoryStore = createEmptyStore(new Date().toISOString());
    lastLoadTime = now;
  }
  return memoryStore;
}

let savePromise: Promise<void> | null = null;
let pendingSave = false;

async function persistStoreToBlob(store: AnalyticsStore): Promise<void> {
  memoryStore = store;
  pendingSave = true;

  if (savePromise) return;

  savePromise = (async () => {
    while (pendingSave) {
      pendingSave = false;
      try {
        await put(BLOB_FILE_NAME, JSON.stringify(store), {
          access: "private",
          addRandomSuffix: false,
        });
      } catch (err) {
        console.error("Failed to persist analytics to blob:", err);
      }
    }
    savePromise = null;
  })();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Security headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const store = await loadStoreFromBlob();

    if (req.method === "GET") {
      // Disallow caching for live admin queries
      res.setHeader("Cache-Control", "no-store, max-age=0");
      const report = computeAnalyticsReport(store);
      return res.status(200).json(report);
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { visitorId, sessionId, path, referrer } = (body || {}) as AnalyticsEvent;

      if (!visitorId || !sessionId || !path) {
        return res.status(400).json({ error: "Missing required fields: visitorId, sessionId, path" });
      }

      // Skip tracking admin routes to maintain clean public data
      if (path.startsWith("/admin") || path.startsWith("/wp-admin")) {
        return res.status(200).json({ status: "skipped_admin" });
      }

      // Skip well-known bots & scrapers
      const userAgent = req.headers["user-agent"] || "";
      if (/bot|crawl|spider|slurp|facebookexternalhit|bingpreview/i.test(userAgent)) {
        return res.status(200).json({ status: "skipped_bot" });
      }

      const updatedStore = recordEvent(store, {
        visitorId: String(visitorId).slice(0, 64),
        sessionId: String(sessionId).slice(0, 64),
        path: String(path).slice(0, 120),
        referrer: referrer ? String(referrer).slice(0, 200) : undefined,
      });

      await persistStoreToBlob(updatedStore);

      return res.status(200).json({ status: "recorded" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    console.error("Analytics handler error:", err);
    return res.status(500).json({ error: "Internal server error", message: err?.message });
  }
}
