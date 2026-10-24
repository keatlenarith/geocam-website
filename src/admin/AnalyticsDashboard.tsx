import React, { useState, useEffect } from "react";
import {
  Users,
  Eye,
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
  ShieldCheck,
  RefreshCw,
  Info,
  Globe,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import type { AnalyticsReport, MetricSummary } from "../features/analytics/types";
import { formatFriendlyDate } from "../features/analytics/analytics-core";

type TimeWindow = "today" | "7d" | "30d" | "all";

export default function AnalyticsDashboard() {
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeWindow, setActiveWindow] = useState<TimeWindow>("7d");
  const [selectedMetric, setSelectedMetric] = useState<"pageViews" | "visitors" | "sessions">("pageViews");
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await fetch("/api/analytics?t=" + Date.now(), {
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) {
        throw new Error(`Failed to load analytics: HTTP ${res.status}`);
      }
      const data: AnalyticsReport = await res.json();
      setReport(data);
    } catch (err: any) {
      console.error("Error fetching analytics:", err);
      setError(err?.message || "Failed to retrieve visitor telemetry.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getActiveMetrics = (): MetricSummary => {
    if (!report) {
      return { uniqueVisitors: 0, sessions: 0, pageViews: 0 };
    }
    switch (activeWindow) {
      case "today":
        return report.today;
      case "7d":
        return report.last7Days;
      case "30d":
        return report.last30Days;
      case "all":
        return report.allTime;
    }
  };

  const activeMetrics = getActiveMetrics();

  // Compute maximum value in daily trend to scale chart bars
  const trendPoints = report?.dailyTrend || [];
  const maxMetricValue = Math.max(
    1,
    ...trendPoints.map((p) => (selectedMetric === "pageViews" ? p.pageViews : selectedMetric === "visitors" ? p.visitors : p.sessions))
  );

  const formatTrackingStart = (isoString?: string) => {
    if (!isoString) return "October 24, 2026";
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Phnom_Penh",
      }).format(d) + " ICT";
    } catch {
      return isoString;
    }
  };

  const formatLastUpdated = (isoString?: string) => {
    if (!isoString) return "Just now";
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Phnom_Penh",
      }).format(d) + " ICT";
    } catch {
      return isoString;
    }
  };

  return (
    <div className="analytics-console-view" style={{ padding: "0 20px 40px" }}>
      {/* Top Header */}
      <div
        className="wp-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0, fontSize: "24px" }}>
            <BarChart3 size={24} style={{ color: "#38bdf8" }} />
            <span>Audience & Visitor Intelligence</span>
          </h1>
          <p style={{ margin: "4px 0 0", color: "var(--wp-text-muted)", fontSize: "13px" }}>
            Real recorded telemetry for unique visitors, browsing sessions, and route activity across GeoCam.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            className="button"
            onClick={fetchStats}
            disabled={refreshing}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--wp-surface)",
              color: "var(--wp-text)",
              border: "1px solid var(--wp-border)",
            }}
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span>{refreshing ? "Synchronizing…" : "Refresh Telemetry"}</span>
          </button>
        </div>
      </div>

      {/* Inception & Security Metadata Banner */}
      <div
        style={{
          background: "linear-gradient(90deg, rgba(36, 87, 214, 0.08) 0%, rgba(56, 189, 248, 0.05) 100%)",
          border: "1px solid rgba(56, 189, 248, 0.25)",
          borderRadius: "8px",
          padding: "14px 18px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "rgba(56, 189, 248, 0.15)",
              color: "#38bdf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--wp-text)" }}>
              Persistent Aggregate Tracking Active
            </div>
            <div style={{ fontSize: "12px", color: "var(--wp-text-muted)" }}>
              Tracking active since: <strong>{formatTrackingStart(report?.trackingStartDate)}</strong> · Real recorded data (no mock numbers)
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", color: "var(--wp-text-muted)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
            <span>Last Sync: {formatLastUpdated(report?.lastUpdated)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Globe size={14} style={{ color: "#38bdf8" }} />
            <span>Privacy-Conscious (No PII / IP Logs)</span>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div
          style={{
            background: "#fef2f2",
            borderLeft: "4px solid #ef4444",
            padding: "12px 16px",
            color: "#991b1b",
            borderRadius: "6px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* Time Window Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "6px", background: "var(--wp-surface)", padding: "4px", borderRadius: "8px", border: "1px solid var(--wp-border)" }}>
          {(
            [
              { id: "today", label: "Today" },
              { id: "7d", label: "Last 7 Days" },
              { id: "30d", label: "Last 30 Days" },
              { id: "all", label: "All-Time" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveWindow(tab.id)}
              style={{
                border: "none",
                borderRadius: "6px",
                padding: "6px 14px",
                fontSize: "13px",
                fontWeight: activeWindow === tab.id ? 700 : 500,
                background: activeWindow === tab.id ? "var(--wp-accent, #2457d6)" : "transparent",
                color: activeWindow === tab.id ? "#ffffff" : "var(--wp-text)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: "12px", color: "var(--wp-text-muted)" }}>
          Showing metrics for: <strong>{activeWindow === "today" ? "Today (UTC+7)" : activeWindow === "7d" ? "Past 7 Calendar Days" : activeWindow === "30d" ? "Past 30 Calendar Days" : "Complete Tracking History"}</strong>
        </div>
      </div>

      {/* 3 Core Metric KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* KPI 1: Unique Visitors */}
        <div
          style={{
            background: "var(--wp-surface)",
            border: "1px solid var(--wp-border)",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700, color: "var(--wp-text-muted)" }}>
                Unique Visitors
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--wp-text)", marginTop: "6px", letterSpacing: "-0.5px" }}>
                {loading ? "…" : activeMetrics.uniqueVisitors.toLocaleString()}
              </div>
            </div>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(56, 189, 248, 0.12)",
                color: "#38bdf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Users size={22} />
            </div>
          </div>
          <div
            style={{
              marginTop: "14px",
              paddingTop: "12px",
              borderTop: "1px solid var(--wp-border-subtle, rgba(255,255,255,0.06))",
              fontSize: "12px",
              color: "var(--wp-text-muted)",
              lineHeight: 1.5,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
              <Info size={14} style={{ flexShrink: 0, marginTop: "2px", color: "#38bdf8" }} />
              <span>
                <strong>Definition:</strong> Distinct anonymous browsers identified by a local persistent non-PII token. Counted once in the selected window.
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Visits / Sessions */}
        <div
          style={{
            background: "var(--wp-surface)",
            border: "1px solid var(--wp-border)",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700, color: "var(--wp-text-muted)" }}>
                Visits / Sessions
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--wp-text)", marginTop: "6px", letterSpacing: "-0.5px" }}>
                {loading ? "…" : activeMetrics.sessions.toLocaleString()}
              </div>
            </div>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(52, 211, 153, 0.12)",
                color: "#34d399",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Clock size={22} />
            </div>
          </div>
          <div
            style={{
              marginTop: "14px",
              paddingTop: "12px",
              borderTop: "1px solid var(--wp-border-subtle, rgba(255,255,255,0.06))",
              fontSize: "12px",
              color: "var(--wp-text-muted)",
              lineHeight: 1.5,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
              <Info size={14} style={{ flexShrink: 0, marginTop: "2px", color: "#34d399" }} />
              <span>
                <strong>Definition:</strong> Discrete browsing sessions delimited by 30 minutes of visitor inactivity. If a user returns after 30 minutes, a new visit is counted.
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Page Views */}
        <div
          style={{
            background: "var(--wp-surface)",
            border: "1px solid var(--wp-border)",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700, color: "var(--wp-text-muted)" }}>
                Page Views
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--wp-text)", marginTop: "6px", letterSpacing: "-0.5px" }}>
                {loading ? "…" : activeMetrics.pageViews.toLocaleString()}
              </div>
            </div>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(129, 140, 248, 0.12)",
                color: "#818cf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Eye size={22} />
            </div>
          </div>
          <div
            style={{
              marginTop: "14px",
              paddingTop: "12px",
              borderTop: "1px solid var(--wp-border-subtle, rgba(255,255,255,0.06))",
              fontSize: "12px",
              color: "var(--wp-text-muted)",
              lineHeight: 1.5,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
              <Info size={14} style={{ flexShrink: 0, marginTop: "2px", color: "#818cf8" }} />
              <span>
                <strong>Definition:</strong> Total public pages viewed across the site. Deduplicates fast reloads &lt; 5 seconds. Excludes administrative routes.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Period Comparative Summary Table */}
      <div
        style={{
          background: "var(--wp-surface)",
          border: "1px solid var(--wp-border)",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--wp-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "15px" }}>
            <Calendar size={18} style={{ color: "#38bdf8" }} />
            <span>Comparative Timeframe Summaries</span>
          </div>
          <span style={{ fontSize: "12px", color: "var(--wp-text-muted)" }}>
            Today vs. 7 Days vs. 30 Days vs. All-Time
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.03)", borderBottom: "1px solid var(--wp-border)", textAlign: "left" }}>
                <th style={{ padding: "12px 20px", fontWeight: 600, color: "var(--wp-text-muted)" }}>Metric</th>
                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--wp-text)" }}>Today</th>
                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--wp-text)" }}>Last 7 Days</th>
                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--wp-text)" }}>Last 30 Days</th>
                <th style={{ padding: "12px 20px", fontWeight: 600, color: "var(--wp-accent, #38bdf8)" }}>All-Time</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--wp-border-subtle, rgba(255,255,255,0.05))" }}>
                <td style={{ padding: "12px 20px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Users size={16} style={{ color: "#38bdf8" }} />
                  <span>Unique Visitors</span>
                </td>
                <td style={{ padding: "12px 16px", fontWeight: 700 }}>{report?.today.uniqueVisitors.toLocaleString() ?? "0"}</td>
                <td style={{ padding: "12px 16px", fontWeight: 700 }}>{report?.last7Days.uniqueVisitors.toLocaleString() ?? "0"}</td>
                <td style={{ padding: "12px 16px", fontWeight: 700 }}>{report?.last30Days.uniqueVisitors.toLocaleString() ?? "0"}</td>
                <td style={{ padding: "12px 20px", fontWeight: 700, color: "var(--wp-accent, #38bdf8)" }}>
                  {report?.allTime.uniqueVisitors.toLocaleString() ?? "0"}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--wp-border-subtle, rgba(255,255,255,0.05))" }}>
                <td style={{ padding: "12px 20px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Clock size={16} style={{ color: "#34d399" }} />
                  <span>Visits / Sessions</span>
                </td>
                <td style={{ padding: "12px 16px", fontWeight: 700 }}>{report?.today.sessions.toLocaleString() ?? "0"}</td>
                <td style={{ padding: "12px 16px", fontWeight: 700 }}>{report?.last7Days.sessions.toLocaleString() ?? "0"}</td>
                <td style={{ padding: "12px 16px", fontWeight: 700 }}>{report?.last30Days.sessions.toLocaleString() ?? "0"}</td>
                <td style={{ padding: "12px 20px", fontWeight: 700, color: "#34d399" }}>
                  {report?.allTime.sessions.toLocaleString() ?? "0"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "12px 20px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Eye size={16} style={{ color: "#818cf8" }} />
                  <span>Page Views</span>
                </td>
                <td style={{ padding: "12px 16px", fontWeight: 700 }}>{report?.today.pageViews.toLocaleString() ?? "0"}</td>
                <td style={{ padding: "12px 16px", fontWeight: 700 }}>{report?.last7Days.pageViews.toLocaleString() ?? "0"}</td>
                <td style={{ padding: "12px 16px", fontWeight: 700 }}>{report?.last30Days.pageViews.toLocaleString() ?? "0"}</td>
                <td style={{ padding: "12px 20px", fontWeight: 700, color: "#818cf8" }}>
                  {report?.allTime.pageViews.toLocaleString() ?? "0"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Daily Trend Chart & Most Viewed Pages */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {/* Daily Trend Chart Panel */}
        <div
          style={{
            background: "var(--wp-surface)",
            border: "1px solid var(--wp-border)",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "15px" }}>
              <TrendingUp size={18} style={{ color: "#38bdf8" }} />
              <span>Daily Activity Trend (30 Days)</span>
            </div>

            {/* Metric Selector for Trend */}
            <div style={{ display: "flex", gap: "4px", background: "rgba(0,0,0,0.05)", padding: "2px", borderRadius: "6px" }}>
              {(
                [
                  { id: "pageViews", label: "Page Views" },
                  { id: "visitors", label: "Visitors" },
                  { id: "sessions", label: "Sessions" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMetric(m.id)}
                  style={{
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    fontWeight: selectedMetric === m.id ? 700 : 500,
                    background: selectedMetric === m.id ? "var(--wp-surface)" : "transparent",
                    color: selectedMetric === m.id ? "var(--wp-accent, #38bdf8)" : "var(--wp-text-muted)",
                    cursor: "pointer",
                    boxShadow: selectedMetric === m.id ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Container */}
          <div style={{ marginTop: "24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                height: "170px",
                gap: "4px",
                paddingBottom: "8px",
                borderBottom: "1px solid var(--wp-border)",
              }}
            >
              {trendPoints.map((p, idx) => {
                const val = selectedMetric === "pageViews" ? p.pageViews : selectedMetric === "visitors" ? p.visitors : p.sessions;
                const heightPct = Math.max(6, Math.round((val / maxMetricValue) * 100));
                const isToday = idx === trendPoints.length - 1;

                return (
                  <div
                    key={p.date}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                      justifyContent: "flex-end",
                      position: "relative",
                    }}
                    title={`${p.date} (${p.formattedDate})\n${selectedMetric}: ${val}\nPage Views: ${p.pageViews}\nVisitors: ${p.visitors}\nSessions: ${p.sessions}`}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: `${heightPct}%`,
                        background:
                          val > 0
                            ? isToday
                              ? "linear-gradient(180deg, #38bdf8 0%, #2563eb 100%)"
                              : "linear-gradient(180deg, rgba(56, 189, 248, 0.7) 0%, rgba(37, 99, 235, 0.7) 100%)"
                            : "rgba(255, 255, 255, 0.04)",
                        borderRadius: "3px 3px 0 0",
                        transition: "all 0.2s ease",
                        minHeight: "4px",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis Date Labels */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "8px",
                fontSize: "11px",
                color: "var(--wp-text-muted)",
              }}
            >
              <span>{trendPoints[0]?.formattedDate || "30 days ago"}</span>
              <span>{trendPoints[Math.floor(trendPoints.length / 2)]?.formattedDate || "15 days ago"}</span>
              <span style={{ fontWeight: 700, color: "var(--wp-accent, #38bdf8)" }}>
                {trendPoints[trendPoints.length - 1]?.formattedDate || "Today"}
              </span>
            </div>
          </div>
        </div>

        {/* Most-Viewed Pages Panel */}
        <div
          style={{
            background: "var(--wp-surface)",
            border: "1px solid var(--wp-border)",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "15px" }}>
              <Globe size={18} style={{ color: "#38bdf8" }} />
              <span>Most-Viewed Public Routes</span>
            </div>
            <span style={{ fontSize: "12px", color: "var(--wp-text-muted)" }}>
              Ranked by recorded page views
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", maxHeight: "250px" }}>
            {(!report?.mostViewedPages || report.mostViewedPages.length === 0) ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "var(--wp-text-muted)",
                  fontSize: "13px",
                }}
              >
                No public page views recorded yet. Visit public pages to see real metrics populated.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--wp-border)", textAlign: "left" }}>
                    <th style={{ padding: "8px 6px", fontWeight: 600, width: "30px", color: "var(--wp-text-muted)" }}>#</th>
                    <th style={{ padding: "8px 10px", fontWeight: 600, color: "var(--wp-text)" }}>Route</th>
                    <th style={{ padding: "8px 10px", fontWeight: 600, textAlign: "right", color: "var(--wp-text)" }}>Views</th>
                    <th style={{ padding: "8px 10px", fontWeight: 600, width: "90px", textAlign: "right", color: "var(--wp-text-muted)" }}>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {report.mostViewedPages.slice(0, 10).map((p, idx) => (
                    <tr
                      key={p.path}
                      style={{
                        borderBottom: "1px solid var(--wp-border-subtle, rgba(255,255,255,0.04))",
                      }}
                    >
                      <td style={{ padding: "8px 6px", color: "var(--wp-text-muted)", fontWeight: 700 }}>
                        {idx + 1}
                      </td>
                      <td style={{ padding: "8px 10px", fontWeight: 600 }}>
                        <a
                          href={p.path}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "var(--wp-accent, #38bdf8)",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span>{p.path === "/" ? "/ (Homepage)" : p.path}</span>
                          <ArrowUpRight size={12} style={{ opacity: 0.6 }} />
                        </a>
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700 }}>
                        {p.views.toLocaleString()}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                          <div
                            style={{
                              width: "40px",
                              height: "6px",
                              background: "rgba(0,0,0,0.08)",
                              borderRadius: "3px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(100, Math.max(8, p.percentage))}%`,
                                height: "100%",
                                background: "#38bdf8",
                                borderRadius: "3px",
                              }}
                            />
                          </div>
                          <span style={{ fontSize: "11px", color: "var(--wp-text-muted)", minWidth: "26px" }}>
                            {p.percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Privacy, Deduplication & Storage Architecture Card */}
      <div
        style={{
          background: "var(--wp-surface)",
          border: "1px solid var(--wp-border)",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
          <ShieldCheck size={18} style={{ color: "#10b981" }} />
          <span>Privacy & Data Integrity Guarantees</span>
        </h3>
        <p style={{ margin: "0 0 12px", fontSize: "13px", color: "var(--wp-text-muted)", lineHeight: 1.6 }}>
          GeoCam analytics implements a serverless, privacy-first telemetry architecture compliant with strict scientific data ethics:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px", fontSize: "12px" }}>
          <div style={{ background: "rgba(0,0,0,0.03)", padding: "10px 14px", borderRadius: "6px" }}>
            <strong>No Personal Identifiers:</strong> Neither IP addresses, user agents, nor device fingerprints are stored. Visitors receive a pseudo-random browser token (<code style={{ fontSize: "11px" }}>geocam_vid</code>).
          </div>
          <div style={{ background: "rgba(0,0,0,0.03)", padding: "10px 14px", borderRadius: "6px" }}>
            <strong>Rapid Deduplication:</strong> Identical route views within 5 seconds are discarded to prevent inflation caused by page reloads or double clicks.
          </div>
          <div style={{ background: "rgba(0,0,0,0.03)", padding: "10px 14px", borderRadius: "6px" }}>
            <strong>Session Delimitation:</strong> Inactivity timeouts of 30 minutes accurately differentiate sustained research sessions from repeat daily check-ins.
          </div>
        </div>
      </div>
    </div>
  );
}
