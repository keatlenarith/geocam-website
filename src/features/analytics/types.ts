export interface AnalyticsEvent {
  visitorId: string;
  sessionId: string;
  path: string;
  referrer?: string;
  timestamp?: number;
}

export interface DayAnalytics {
  date: string; // YYYY-MM-DD
  pageViews: number;
  sessions: string[]; // unique session IDs
  visitors: string[]; // unique visitor IDs
  pages: Record<string, number>; // path -> view count
  referrers?: Record<string, number>;
}

export interface AnalyticsStore {
  version: number;
  trackingStartDate: string; // ISO date string
  daily: Record<string, DayAnalytics>;
  allTimeVisitors: string[]; // all unique visitor IDs
  lastUpdated: string;
}

export interface MetricSummary {
  uniqueVisitors: number;
  sessions: number;
  pageViews: number;
}

export interface DailyTrendPoint {
  date: string; // YYYY-MM-DD
  formattedDate: string; // e.g. "Oct 24"
  pageViews: number;
  sessions: number;
  visitors: number;
}

export interface PageViewRanking {
  path: string;
  views: number;
  percentage: number;
}

export interface AnalyticsReport {
  trackingStartDate: string;
  today: MetricSummary;
  last7Days: MetricSummary;
  last30Days: MetricSummary;
  allTime: MetricSummary;
  dailyTrend: DailyTrendPoint[];
  mostViewedPages: PageViewRanking[];
  lastUpdated: string;
}
