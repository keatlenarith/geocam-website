import { sanitizePath } from "./analytics-core";

const VISITOR_ID_KEY = "geocam_vid";
const SESSION_ID_KEY = "geocam_sid";
const SESSION_EXP_KEY = "geocam_sid_exp";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity

/**
 * Returns a persistent anonymous visitor ID stored in localStorage.
 * Format: v_<random>_<timestamp>
 */
export function getOrCreateVisitorId(): string {
  try {
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid || !vid.startsWith("v_")) {
      vid = "v_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    return vid;
  } catch {
    return "v_anon_" + Math.random().toString(36).slice(2, 10);
  }
}

/**
 * Returns an anonymous session ID stored in sessionStorage with a 30-minute idle sliding expiration.
 * Format: s_<random>_<timestamp>
 */
export function getOrCreateSessionId(): string {
  try {
    const now = Date.now();
    const expStr = sessionStorage.getItem(SESSION_EXP_KEY);
    const exp = expStr ? parseInt(expStr, 10) : 0;
    let sid = sessionStorage.getItem(SESSION_ID_KEY);

    if (!sid || !sid.startsWith("s_") || now > exp) {
      sid = "s_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      sessionStorage.setItem(SESSION_ID_KEY, sid);
    }

    // Refresh sliding expiration
    sessionStorage.setItem(SESSION_EXP_KEY, (now + SESSION_TIMEOUT_MS).toString());
    return sid;
  } catch {
    return "s_anon_" + Math.random().toString(36).slice(2, 10);
  }
}

let lastTrackedPath = "";
let lastTrackedTime = 0;

/**
 * Sends a pageview event to the analytics backend.
 * Automatically deduplicates fast reloads (< 5 seconds on same route).
 */
export function trackPageView(customPath?: string) {
  if (typeof window === "undefined") return;

  const rawPath = customPath || window.location.pathname;
  const path = sanitizePath(rawPath);

  // Exclude admin pages from visitor tracking
  if (path.startsWith("/admin") || path.startsWith("/wp-admin")) {
    return;
  }

  // Deduplicate rapid reloads or duplicate events within 5 seconds
  const now = Date.now();
  if (path === lastTrackedPath && now - lastTrackedTime < 5000) {
    return;
  }

  lastTrackedPath = path;
  lastTrackedTime = now;

  const visitorId = getOrCreateVisitorId();
  const sessionId = getOrCreateSessionId();
  const referrer = document.referrer ? document.referrer.slice(0, 200) : undefined;

  const payload = JSON.stringify({
    visitorId,
    sessionId,
    path,
    referrer,
    timestamp: now,
  });

  const endpoint = "/api/analytics";

  if (typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([payload], { type: "application/json" });
      const queued = navigator.sendBeacon(endpoint, blob);
      if (queued) return;
    } catch {
      // Fallback to fetch
    }
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // Analytics failures must never interrupt user experience
  });
}

/**
 * Initializes automatic pageview listeners on route changes.
 */
let isInitialized = false;

export function initAnalyticsTracker() {
  if (typeof window === "undefined" || isInitialized) return;
  isInitialized = true;

  // Track initial page view
  trackPageView();

  // Listen to popstate
  window.addEventListener("popstate", () => {
    trackPageView();
  });

  // Intercept pushState and replaceState to track SPA client-side navigations
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    setTimeout(() => trackPageView(), 0);
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    setTimeout(() => trackPageView(), 0);
  };
}
