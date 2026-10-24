import React, { useState, useEffect } from "react";
import { Users, Eye } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface VisitorStats {
  uniqueVisitors: number;
  pageViews: number;
  todayVisitors: number;
}

export function VisitorCounter({ className = "" }: { className?: string }) {
  const { lang } = useI18n();
  const kh = lang === "km";

  const [stats, setStats] = useState<VisitorStats | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/analytics")
      .then((res) => {
        if (!res.ok) throw new Error("Status " + res.status);
        return res.json();
      })
      .then((data) => {
        if (isMounted && data) {
          setStats({
            uniqueVisitors: data.allTime?.uniqueVisitors ?? 0,
            pageViews: data.allTime?.pageViews ?? 0,
            todayVisitors: data.today?.uniqueVisitors ?? 0,
          });
        }
      })
      .catch(() => {
        // Graceful non-blocking fallback
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!stats) return null;

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 text-xs font-mono opacity-85 ${className}`}
      aria-label="Visitor count"
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-on-dark/20 bg-white/10 px-3 py-1 shadow-2xs">
        <Users size={13} className="text-emerald-400" aria-hidden="true" />
        <span>{kh ? "អ្នកទស្សនា:" : "Visitors:"}</span>
        <strong className="text-white font-bold">
          {stats.uniqueVisitors.toLocaleString()}
        </strong>
      </span>

      <span className="inline-flex items-center gap-1.5 rounded-full border border-on-dark/20 bg-white/10 px-3 py-1 shadow-2xs">
        <Eye size={13} className="text-sky-400" aria-hidden="true" />
        <span>{kh ? "ការចូលមើល:" : "Pageviews:"}</span>
        <strong className="text-white font-bold">
          {stats.pageViews.toLocaleString()}
        </strong>
      </span>

      <span className="inline-flex items-center gap-1.5 rounded-full border border-on-dark/20 bg-white/10 px-3 py-1 shadow-2xs">
        <span
          className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"
          aria-hidden="true"
        />
        <span>{kh ? "ថ្ងៃនេះ:" : "Today:"}</span>
        <strong className="text-white font-bold">
          {stats.todayVisitors.toLocaleString()}
        </strong>
      </span>
    </div>
  );
}
