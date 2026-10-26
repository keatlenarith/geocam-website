import React, { useState, useEffect } from "react";
import {
  Activity,
  BarChart2,
  Eye,
  Users,
  Calendar,
  ShieldCheck,
  X,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { AnalyticsReport } from "@/features/analytics/types";

export function VisitorCounter({ className = "" }: { className?: string }) {
  const { lang } = useI18n();
  const kh = lang === "km";

  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/analytics?t=" + Date.now())
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data: AnalyticsReport) => {
        if (isMounted && data) {
          setReport(data);
        }
      })
      .catch(() => {
        // Non-blocking fallback
      });

    const handleUpdate = () => {
      fetch("/api/analytics?t=" + Date.now())
        .then((r) => r.json())
        .then((d) => {
          if (isMounted && d) setReport(d);
        })
        .catch(() => {});
    };

    window.addEventListener("geocam:analytics-updated", handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("geocam:analytics-updated", handleUpdate);
    };
  }, []);

  if (!report) return null;

  const allTimeViews = report.allTime?.pageViews ?? 0;
  const allTimeVisits = report.allTime?.sessions ?? 0;
  const todayViews = report.today?.pageViews ?? 0;
  const todayVisits = report.today?.sessions ?? 0;

  // Maximum value for daily trend bar scaling
  const maxDailyViews = Math.max(
    1,
    ...(report.dailyTrend || []).map((d) => d.pageViews)
  );

  return (
    <>
      {/* Footer Traffic Status Bar */}
      <div
        className={`flex flex-wrap items-center gap-2 text-xs font-mono opacity-90 ${className}`}
        aria-label="Website traffic statistics"
      >
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-400 mr-1">
          <Activity size={14} className="animate-pulse" />
          <span>{kh ? "ចរាចរណ៍គេហទំព័រ:" : "Site Traffic:"}</span>
        </div>

        {/* ចំនួនបូកយោង (All-Time Cumulative) */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-on-dark/20 bg-white/10 px-3 py-1 shadow-2xs">
          <Eye size={13} className="text-sky-400" aria-hidden="true" />
          <span>{kh ? "ចំនួនបូកយោង:" : "Cumulative:"}</span>
          <strong className="text-white font-bold">
            {allTimeViews.toLocaleString()}
          </strong>
        </span>

        {/* ចំនួនប្រចាំថ្ងៃ (Daily Today) */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-on-dark/20 bg-white/10 px-3 py-1 shadow-2xs">
          <span
            className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"
            aria-hidden="true"
          />
          <span>{kh ? "ចំនួនប្រចាំថ្ងៃ:" : "Daily (Today):"}</span>
          <strong className="text-white font-bold">
            {todayViews.toLocaleString()}
          </strong>
        </span>

        {/* ការទស្សនាសរុប (Visits) */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-on-dark/20 bg-white/10 px-3 py-1 shadow-2xs">
          <Users size={13} className="text-emerald-400" aria-hidden="true" />
          <span>{kh ? "ការទស្សនា:" : "Visits:"}</span>
          <strong className="text-white font-bold">
            {allTimeVisits.toLocaleString()}
          </strong>
        </span>

        {/* View Full Traffic Breakdown Button */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-emerald-300 hover:bg-emerald-500/25 transition cursor-pointer"
          title={kh ? "មើលស្ថិតិចរាចរណ៍លម្អិត" : "View website traffic overview"}
        >
          <BarChart2 size={12} />
          <span>{kh ? "ស្ថិតិចរាចរណ៍ ↗" : "Traffic Overview ↗"}</span>
        </button>
      </div>

      {/* Aggregate Traffic Modal (Zero Personal Data) */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="traffic-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 md:p-8 text-foreground shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {kh ? "ស្ថិតិចរាចរណ៍គេហទំព័រ" : "GeoCam Website Traffic"}
                  </span>
                </div>
                <h3
                  id="traffic-modal-title"
                  className="mt-1 text-2xl font-display font-extrabold text-foreground"
                >
                  {kh ? "ទិន្នន័យចរាចរណ៍គេហទំព័រ" : "Public Website Traffic Statistics"}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {kh
                    ? "ស្ថិតិចរាចរណ៍សរុបជាក់ស្តែង · គ្មានការប្រមូលព័ត៌មានផ្ទាល់ខ្លួន"
                    : "Real recorded aggregate traffic volume · Strictly anonymous, no personal data"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted transition cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* 4 Summary Traffic Cards */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-border bg-muted/40 p-3.5 text-center">
                <span className="text-[11px] font-bold uppercase text-muted-foreground block">
                  {kh ? "ចំនួនប្រចាំថ្ងៃ (ថ្ងៃនេះ)" : "Daily (Today)"}
                </span>
                <span className="text-2xl font-extrabold font-mono text-primary block mt-1">
                  {todayViews.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {todayVisits.toLocaleString()} {kh ? "ការទស្សនា" : "visits"}
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/40 p-3.5 text-center">
                <span className="text-[11px] font-bold uppercase text-muted-foreground block">
                  {kh ? "៧ ថ្ងៃចុងក្រោយ" : "Last 7 Days"}
                </span>
                <span className="text-2xl font-extrabold font-mono text-foreground block mt-1">
                  {(report.last7Days?.pageViews ?? 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {(report.last7Days?.sessions ?? 0).toLocaleString()} {kh ? "ការទស្សនា" : "visits"}
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/40 p-3.5 text-center">
                <span className="text-[11px] font-bold uppercase text-muted-foreground block">
                  {kh ? "៣០ ថ្ងៃចុងក្រោយ" : "Last 30 Days"}
                </span>
                <span className="text-2xl font-extrabold font-mono text-foreground block mt-1">
                  {(report.last30Days?.pageViews ?? 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {(report.last30Days?.sessions ?? 0).toLocaleString()} {kh ? "ការទស្សនា" : "visits"}
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-emerald-500/10 border-emerald-500/20 p-3.5 text-center">
                <span className="text-[11px] font-bold uppercase text-emerald-700 block">
                  {kh ? "ចំនួនបូកយោង (សរុប)" : "Cumulative (All Time)"}
                </span>
                <span className="text-2xl font-extrabold font-mono text-emerald-700 block mt-1">
                  {allTimeViews.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-800">
                  {allTimeVisits.toLocaleString()} {kh ? "ការទស្សនា" : "visits"}
                </span>
              </div>
            </div>

            {/* Daily Traffic Trend (Past 14 Days) */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-4.5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-primary" />
                  {kh ? "និន្នាការចរាចរណ៍ប្រចាំថ្ងៃ" : "Daily Traffic Trend (Views)"}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {kh ? "១៤ ថ្ងៃចុងក្រោយ" : "Past 14 days"}
                </span>
              </div>

              <div className="flex items-end gap-1.5 h-28 pt-4 border-b border-border/80">
                {(report.dailyTrend || []).slice(-14).map((d) => {
                  const heightPercent = Math.max(
                    6,
                    Math.round((d.pageViews / maxDailyViews) * 100)
                  );
                  return (
                    <div
                      key={d.date}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                      title={`${d.formattedDate}: ${d.pageViews} views (${d.sessions} visits)`}
                    >
                      <span className="text-[9px] font-mono opacity-0 group-hover:opacity-100 transition text-primary font-bold">
                        {d.pageViews}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          d.pageViews > 0
                            ? "bg-primary group-hover:bg-primary/80"
                            : "bg-muted-foreground/20"
                        }`}
                      />
                      <span className="text-[9px] font-mono text-muted-foreground truncate w-full text-center">
                        {d.formattedDate.split(" ")[1] || d.formattedDate}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Visited Public Pages */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-4.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
                <BarChart2 size={14} className="text-sky-600" />
                {kh ? "ទំព័រដែលមានចរាចរណ៍ខ្ពស់បំផុត" : "Top Visited Public Pages"}
              </span>

              <div className="space-y-2">
                {(report.mostViewedPages || []).slice(0, 5).map((p) => (
                  <div key={p.path} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-medium truncate max-w-[300px]">
                        {p.path}
                      </span>
                      <span className="font-mono text-muted-foreground">
                        {p.views.toLocaleString()} {kh ? "មើល" : "views"} ({p.percentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        style={{ width: `${Math.max(4, p.percentage)}%` }}
                        className="h-full rounded-full bg-sky-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Notice Banner */}
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-900">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>{kh ? "ការការពារភាពឯកជន ១០០%" : "100% Privacy Guarantee"}</strong>:{" "}
                <span>
                  {kh
                    ? "របាយការណ៍នេះបង្ហាញតែទំហំចរាចរណ៍គេហទំព័រសរុបប៉ុណ្ណោះ។ គ្មានព័ត៌មានផ្ទាល់ខ្លួន អាសយដ្ឋាន IP ឬអត្តសញ្ញាណបុគ្គលណាមួយត្រូវបានប្រមូល ឬរក្សាទុកឡើយ។"
                    : "This traffic telemetry records public aggregate volume only. No personal data, IP addresses, cookies, or individual identities are ever tracked or stored."}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
