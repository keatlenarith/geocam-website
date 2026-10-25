import React, { useMemo } from "react";
import { Link } from "@/lib/spa-router";
import { useI18n } from "@/lib/i18n";
import { useEarthquakes } from "@/features/earthquakes/useEarthquakes";
import { translateEarthquakeLocation } from "@/features/earthquakes/earthquake-data";
import { getStoredEvents } from "@/lib/event-service";
import {
  Activity,
  Zap,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  Radio,
  FileText,
} from "lucide-react";

interface TickerItem {
  id: string;
  type: "earthquake" | "knowledge" | "event" | "research";
  badgeEn: string;
  badgeKm: string;
  badgeColor: string;
  titleEn: string;
  titleKm: string;
  metricEn?: string;
  metricKm?: string;
  url: string;
}

export function LiveTickerRibbon() {
  const { lang } = useI18n();
  const { events: earthquakes } = useEarthquakes({ timeWindow: "7d", limit: 6 } as any);
  const siteEvents = useMemo(() => getStoredEvents().slice(0, 3), []);

  const tickerItems = useMemo(() => {
    const list: TickerItem[] = [];

    // 1. Live Earthquakes (like Forex tickers!)
    if (earthquakes && earthquakes.length > 0) {
      earthquakes.slice(0, 5).forEach((eq) => {
        const mag = eq.magnitude !== null ? eq.magnitude.toFixed(1) : "?";
        const locEn = translateEarthquakeLocation(eq.location, "en");
        const locKm = translateEarthquakeLocation(eq.location, "km");
        const dist = eq.distanceToCambodiaKm ? Math.round(eq.distanceToCambodiaKm) : null;
        
        let color = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
        if (eq.magnitude && eq.magnitude >= 5.0) {
          color = "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse";
        } else if (eq.magnitude && eq.magnitude >= 4.0) {
          color = "bg-amber-500/20 text-amber-300 border-amber-500/40";
        }

        list.push({
          id: `eq-${eq.id}`,
          type: "earthquake",
          badgeEn: `⚡ M ${mag}`,
          badgeKm: `⚡ M ${mag}`,
          badgeColor: color,
          titleEn: `${locEn}${dist ? ` (${dist} km from Cambodia)` : ""}`,
          titleKm: `${locKm}${dist ? ` (${dist} គ.ម ពីកម្ពុជា)` : ""}`,
          metricEn: eq.depthKm ? `Depth: ${Math.round(eq.depthKm)}km` : undefined,
          metricKm: eq.depthKm ? `ជម្រៅ៖ ${Math.round(eq.depthKm)}គ.ម` : undefined,
          url: "/earthquake-monitoring",
        });
      });
    }

    // 2. New Basic Knowledge Posts (Highlighted billboard)
    list.push({
      id: "bk-rocks",
      type: "knowledge",
      badgeEn: "📚 BASIC KNOWLEDGE",
      badgeKm: "📚 ចំណេះដឹងមូលដ្ឋាន",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      titleEn: "Classification of Rocks in Cambodia: Igneous, Sedimentary & Metamorphic",
      titleKm: "ចំណាត់ថ្នាក់ថ្មនៅកម្ពុជា៖ ថ្មម៉ាក់ម៉ា ថ្មកម្ទេចកំណ និងថ្មប្រែរូប",
      metricEn: "New Guide",
      metricKm: "មគ្គុទ្ទេសក៍ថ្មី",
      url: "/basic-knowledge?id=bk-rocks",
    });

    list.push({
      id: "bk-history",
      type: "knowledge",
      badgeEn: "📚 BASIC KNOWLEDGE",
      badgeKm: "📚 ចំណេះដឹងមូលដ្ឋាន",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      titleEn: "Introduction to Cambodia's Geological History & Rock Formations",
      titleKm: "សេចក្តីផ្តើមអំពីប្រវត្តិភូគព្ភសាស្ត្រ និងសណ្ឋានសិលានៅកម្ពុជា",
      metricEn: "Featured",
      metricKm: "ពិសេស",
      url: "/basic-knowledge?id=bk-history",
    });

    list.push({
      id: "bk-hydro",
      type: "knowledge",
      badgeEn: "📚 BASIC KNOWLEDGE",
      badgeKm: "📚 ចំណេះដឹងមូលដ្ឋាន",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      titleEn: "Hydrogeology Basics: How Aquifers Function in the Lower Mekong Basin",
      titleKm: "មូលដ្ឋានគ្រឹះវារីភូគព្ភសាស្ត្រ៖ ដំណើរការនៃស្រទាប់ផ្ទុកទឹកនៅអាងទន្លេមេគង្គក្រោម",
      metricEn: "Trending",
      metricKm: "ពេញនិយម",
      url: "/basic-knowledge?id=bk-hydro",
    });

    // 3. New Events & Conferences
    siteEvents.forEach((ev) => {
      list.push({
        id: `ev-${ev.id}`,
        type: "event",
        badgeEn: "📅 EVENT",
        badgeKm: "📅 ព្រឹត្តិការណ៍",
        badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
        titleEn: ev.title,
        titleKm: ev.titleKm || ev.title,
        metricEn: ev.date || undefined,
        metricKm: ev.date || undefined,
        url: "/events",
      });
    });

    // 4. Key Research Topic
    list.push({
      id: "res-tectonics",
      type: "research",
      badgeEn: "🔬 RESEARCH",
      badgeKm: "🔬 ការស្រាវជ្រាវ",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      titleEn: "Tectonic Evolution of Southeast Asia & Geological Framework of Cambodia",
      titleKm: "ការវិវត្តតិចតូនិចនៃអាស៊ីអាគ្នេយ៍ និងក្របខ័ណ្ឌភូគព្ភសាស្ត្រកម្ពុជា",
      metricEn: "Indosinian Arc",
      metricKm: "ធ្នូកោះឥណ្ឌូស៊ីនៀ",
      url: "/research/topic?id=Tectonics",
    });

    return list;
  }, [earthquakes, siteEvents]);

  // Duplicate items for continuous seamless loop
  const duplicatedItems = useMemo(() => {
    return [...tickerItems, ...tickerItems];
  }, [tickerItems]);

  return (
    <div
      className="relative z-20 w-full overflow-hidden border-y border-slate-800 bg-[#091124] text-white shadow-inner"
      role="region"
      aria-label={lang === "km" ? "ព័ត៌មានបន្តផ្ទាល់" : "Live Ticker"}
    >
      <div className="flex items-center">
        {/* Left Fixed Ticker Label */}
        <div className="relative z-10 flex shrink-0 items-center gap-2 border-r border-slate-800/80 bg-[#0b162f] px-4 py-2.5 shadow-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-200">
            {lang === "km" ? "បច្ចុប្បន្នភាព" : "LIVE TICKER"}
          </span>
        </div>

        {/* Scrolling Marquee Ribbon */}
        <div className="gc-ticker-container flex-1 overflow-hidden py-2">
          <div className="gc-ticker-track flex items-center gap-6">
            {duplicatedItems.map((item, idx) => {
              const title = lang === "km" ? item.titleKm : item.titleEn;
              const badge = lang === "km" ? item.badgeKm : item.badgeEn;
              const metric = lang === "km" ? item.metricKm : item.metricEn;

              return (
                <Link
                  key={`${item.id}-${idx}`}
                  to={item.url}
                  className="group inline-flex shrink-0 items-center gap-2.5 rounded-lg px-2.5 py-1 text-xs transition duration-150 hover:bg-slate-800/60"
                >
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide ${item.badgeColor}`}
                  >
                    {badge}
                  </span>

                  <span className="font-medium text-slate-200 transition group-hover:text-cyan-300">
                    {title}
                  </span>

                  {metric && (
                    <span className="font-mono text-[11px] font-semibold text-slate-400">
                      [{metric}]
                    </span>
                  )}

                  <span className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-cyan-400">
                    →
                  </span>

                  <span className="mx-1 text-slate-700" aria-hidden="true">
                    |
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
