import type {
  AnalyticsEvent,
  AnalyticsStore,
  AnalyticsReport,
  MetricSummary,
  DailyTrendPoint,
  PageViewRanking,
  DayAnalytics,
} from "./types";

/**
 * Returns YYYY-MM-DD in Indochina Time (ICT, UTC+7), matching Cambodia.
 */
export function getIctDateString(d = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Phnom_Penh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

/**
 * Formats a YYYY-MM-DD date into a friendly label like "Oct 24"
 */
export function formatFriendlyDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Creates an empty initial analytics store.
 */
export function createEmptyStore(startDate = new Date().toISOString()): AnalyticsStore {
  return {
    version: 1,
    trackingStartDate: startDate,
    daily: {},
    allTimeVisitors: [],
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Normalizes a path, stripping hash and query params, keeping canonical routes.
 */
export function sanitizePath(rawPath: string): string {
  if (!rawPath) return "/";
  let clean = rawPath.split("?")[0].split("#")[0].trim();
  if (!clean.startsWith("/")) clean = "/" + clean;
  // Collapse multiple slashes
  clean = clean.replace(/\/+/g, "/");
  if (clean.length > 1 && clean.endsWith("/")) {
    clean = clean.slice(0, -1);
  }
  return clean.slice(0, 120);
}

/**
 * Records an incoming analytics event into the store.
 */
export function recordEvent(
  store: AnalyticsStore,
  event: AnalyticsEvent,
  now = new Date()
): AnalyticsStore {
  const cleanPath = sanitizePath(event.path);
  const dateStr = getIctDateString(now);
  const nowIso = now.toISOString();

  const currentDaily: DayAnalytics = store.daily[dateStr] || {
    date: dateStr,
    pageViews: 0,
    sessions: [],
    visitors: [],
    pages: {},
    referrers: {},
  };

  // 1. Increment page views
  const updatedPageViews = currentDaily.pageViews + 1;

  // 2. Add session if not already in today's sessions
  const sessionsSet = new Set(currentDaily.sessions);
  if (event.sessionId) {
    sessionsSet.add(event.sessionId);
  }

  // 3. Add visitor if not already in today's visitors
  const visitorsSet = new Set(currentDaily.visitors);
  if (event.visitorId) {
    visitorsSet.add(event.visitorId);
  }

  // 4. Increment page count
  const updatedPages = { ...currentDaily.pages };
  updatedPages[cleanPath] = (updatedPages[cleanPath] || 0) + 1;

  // 5. Optional referrer tracking (domain only)
  const updatedReferrers = { ...(currentDaily.referrers || {}) };
  if (event.referrer) {
    try {
      const refUrl = new URL(event.referrer);
      const host = refUrl.hostname;
      if (host && !host.includes("localhost") && !host.includes("geocam")) {
        updatedReferrers[host] = (updatedReferrers[host] || 0) + 1;
      }
    } catch {
      // ignore malformed referrer
    }
  }

  // 6. Update all-time unique visitors
  const allTimeSet = new Set(store.allTimeVisitors);
  if (event.visitorId) {
    allTimeSet.add(event.visitorId);
  }

  return {
    ...store,
    daily: {
      ...store.daily,
      [dateStr]: {
        date: dateStr,
        pageViews: updatedPageViews,
        sessions: Array.from(sessionsSet),
        visitors: Array.from(visitorsSet),
        pages: updatedPages,
        referrers: updatedReferrers,
      },
    },
    allTimeVisitors: Array.from(allTimeSet),
    lastUpdated: nowIso,
  };
}

/**
 * Computes window aggregates (Unique Visitors, Sessions, Page Views)
 * across an array of DayAnalytics.
 */
function aggregateDays(days: DayAnalytics[]): MetricSummary {
  const visitorsSet = new Set<string>();
  const sessionsSet = new Set<string>();
  let pageViews = 0;

  for (const day of days) {
    pageViews += day.pageViews || 0;
    for (const v of day.visitors || []) {
      visitorsSet.add(v);
    }
    for (const s of day.sessions || []) {
      sessionsSet.add(s);
    }
  }

  return {
    uniqueVisitors: visitorsSet.size,
    sessions: sessionsSet.size,
    pageViews,
  };
}

/**
 * Generates an array of YYYY-MM-DD date strings for the past N days up to referenceDate.
 */
function getDateRange(referenceDate: Date, numDays: number): string[] {
  const dates: string[] = [];
  const ref = new Date(referenceDate);
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(ref);
    d.setDate(ref.getDate() - i);
    dates.push(getIctDateString(d));
  }
  return dates;
}

/**
 * Computes the complete AnalyticsReport from the stored data.
 */
export function computeAnalyticsReport(
  store: AnalyticsStore,
  referenceDate = new Date()
): AnalyticsReport {
  const todayStr = getIctDateString(referenceDate);
  const todayDay = store.daily[todayStr] || {
    date: todayStr,
    pageViews: 0,
    sessions: [],
    visitors: [],
    pages: {},
  };

  const todayMetrics: MetricSummary = {
    uniqueVisitors: todayDay.visitors?.length || 0,
    sessions: todayDay.sessions?.length || 0,
    pageViews: todayDay.pageViews || 0,
  };

  // Last 7 days and 30 days ranges
  const past7Dates = getDateRange(referenceDate, 7);
  const past30Dates = getDateRange(referenceDate, 30);

  const past7Days = past7Dates.map((d) => store.daily[d]).filter(Boolean) as DayAnalytics[];
  const past30Days = past30Dates.map((d) => store.daily[d]).filter(Boolean) as DayAnalytics[];
  const allDays = Object.values(store.daily);

  const last7DaysMetrics = aggregateDays(past7Days);
  const last30DaysMetrics = aggregateDays(past30Days);
  const allTimeMetrics = aggregateDays(allDays);

  // If store has allTimeVisitors tracked, ensure allTime reflects maximum distinct count
  if (store.allTimeVisitors?.length > allTimeMetrics.uniqueVisitors) {
    allTimeMetrics.uniqueVisitors = store.allTimeVisitors.length;
  }

  // Daily Trend for the past 30 days
  const dailyTrend: DailyTrendPoint[] = past30Dates.map((dateStr) => {
    const day = store.daily[dateStr];
    return {
      date: dateStr,
      formattedDate: formatFriendlyDate(dateStr),
      pageViews: day?.pageViews || 0,
      sessions: day?.sessions?.length || 0,
      visitors: day?.visitors?.length || 0,
    };
  });

  // Most-viewed pages ranking
  const pageTotals: Record<string, number> = {};
  let totalViews = 0;

  for (const day of allDays) {
    if (day.pages) {
      for (const [p, count] of Object.entries(day.pages)) {
        pageTotals[p] = (pageTotals[p] || 0) + count;
        totalViews += count;
      }
    }
  }

  const mostViewedPages: PageViewRanking[] = Object.entries(pageTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([path, views]) => ({
      path,
      views,
      percentage: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0,
    }));

  return {
    trackingStartDate: store.trackingStartDate || new Date().toISOString(),
    today: todayMetrics,
    last7Days: last7DaysMetrics,
    last30Days: last30DaysMetrics,
    allTime: allTimeMetrics,
    dailyTrend,
    mostViewedPages,
    lastUpdated: store.lastUpdated || new Date().toISOString(),
  };
}
