import React, { useState, useEffect, useRef } from "react";
import { type EarthquakeEvent } from "./earthquake-data";
import { type TimeWindowOption } from "./useEarthquakes";
import { useI18n } from "@/lib/i18n";
import { Radio, Volume2, VolumeX, RefreshCw, ExternalLink, Zap } from "lucide-react";

interface EarthquakeLiveStreamProps {
  events: EarthquakeEvent[];
  selectedEventId?: string | null;
  onSelectEvent?: (event: EarthquakeEvent) => void;
  timeWindow: TimeWindowOption;
  onTimeWindowChange: (w: TimeWindowOption) => void;
  loading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export const EarthquakeLiveStream: React.FC<EarthquakeLiveStreamProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
  timeWindow,
  onTimeWindowChange,
  loading = false,
  onRefresh,
  className = "",
}) => {
  const { lang } = useI18n();
  const kh = lang === "km";

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const prevCountRef = useRef(events.length);

  // Play subtle web audio chime on new detected earthquake
  const playLiveChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  };

  // Watch for new incoming events during session
  useEffect(() => {
    if (events.length > prevCountRef.current) {
      playLiveChime();
    }
    prevCountRef.current = events.length;
  }, [events.length]);

  // 60-second countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          return 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // When manual refresh happens, reset countdown
  useEffect(() => {
    if (loading) {
      setSecondsLeft(60);
    }
  }, [loading]);

  // Compute live recent events sorted strictly newest first
  const recentEvents = [...events]
    .sort(
      (a, b) =>
        new Date(b.originTime).getTime() - new Date(a.originTime).getTime()
    )
    .slice(0, 15);

  const getRelativeTime = (isoTime: string) => {
    const diff = Math.max(0, Date.now() - new Date(isoTime).getTime());
    const m = Math.floor(diff / 60000);
    if (m < 1) return kh ? "ទើបតែឥឡូវ" : "just now";
    if (m < 60) return kh ? `${m} នាទីមុន` : `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return kh ? `${h} ម៉ោងមុន` : `${h}h ago`;
    const d = Math.floor(h / 24);
    return kh ? `${d} ថ្ងៃមុន` : `${d}d ago`;
  };

  const getMagColor = (mag: number | null) => {
    if (mag === null) return "bg-slate-500 text-white";
    if (mag >= 6.0) return "bg-rose-700 text-white border-rose-800";
    if (mag >= 5.0) return "bg-red-600 text-white border-red-700";
    if (mag >= 4.0) return "bg-amber-600 text-white border-amber-700";
    if (mag >= 3.0) return "bg-yellow-500 text-slate-900 border-yellow-600";
    return "bg-emerald-600 text-white border-emerald-700";
  };

  return (
    <div
      className={`rounded-2xl border border-border bg-card p-4 md:p-5 shadow-xs ${className}`}
    >
      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
        {/* Live Status Badge */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-600"></span>
          </span>
          <span className="text-xs md:text-sm font-extrabold uppercase tracking-wider text-rose-700">
            {kh ? "ការផ្សាយផ្ទាល់រញ្ជួយដី" : "LIVE SEISMIC STREAM"}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            <Zap size={11} className="text-amber-500" />
            {kh ? `ធ្វើបច្ចុប្បន្នភាពស្វ័យប្រវត្តិ ${secondsLeft}s` : `Auto-sync in ${secondsLeft}s`}
          </span>
        </div>

        {/* Categories: 6h, 24h, 7days, 30days */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold uppercase text-muted-foreground mr-1">
            {kh ? "ចន្លោះពេល:" : "Window:"}
          </span>
          <div className="flex rounded-xl border border-border p-0.5 bg-muted/60 text-xs font-bold">
            {(
              [
                { id: "6h", en: "6h", km: "៦ ម៉ោង" },
                { id: "24h", en: "24h", km: "២៤ ម៉ោង" },
                { id: "7d", en: "7 Days", km: "៧ ថ្ងៃ" },
                { id: "30d", en: "30 Days", km: "៣០ ថ្ងៃ" },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onTimeWindowChange(cat.id)}
                className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
                  timeWindow === cat.id
                    ? "bg-primary text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {kh ? cat.km : cat.en}
              </button>
            ))}
          </div>

          {/* Sound Notification Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={
              soundEnabled
                ? kh
                  ? "បិទសំឡេងរោទិ៍រញ្ជួយដី"
                  : "Mute live seismic chime"
                : kh
                ? "បើកសំឡេងរោទិ៍ពេលមានរញ្ជួយដីថ្មី"
                : "Enable audio chime on new earthquake"
            }
            className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
              soundEnabled
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span className="hidden md:inline">
              {soundEnabled ? (kh ? "សំឡេង: បើក" : "Audio ON") : kh ? "សំឡេង" : "Sound"}
            </span>
          </button>

          {/* Refresh button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            </button>
          )}

          {/* Source Attribution Link */}
          <a
            href="https://earthquakemap.live/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline ml-1"
          >
            <span>{kh ? "ប្រភព: EarthquakeMap.live & USGS" : "Feed: EarthquakeMap.live & USGS"}</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Running Live Event Ticker Marquee */}
      <div className="mt-3 overflow-x-auto pb-1 scrollbar-thin">
        <div className="flex items-center gap-2.5 min-w-max">
          <span className="flex items-center gap-1 text-xs font-bold uppercase text-muted-foreground pr-2 border-r border-border shrink-0">
            <Radio size={13} className="text-rose-600 animate-pulse" />
            <span>{kh ? "ព្រឹត្តិការណ៍ចុងក្រោយ:" : "Latest Events:"}</span>
          </span>

          {recentEvents.length > 0 ? (
            recentEvents.map((ev) => {
              const isSelected = ev.id === selectedEventId;
              const isVeryRecent =
                Date.now() - new Date(ev.originTime).getTime() < 3 * 3600 * 1000;

              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => onSelectEvent?.(ev)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition cursor-pointer shrink-0 ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/40 font-bold"
                      : "border-border/80 bg-background hover:border-primary/40 hover:bg-muted/60"
                  }`}
                >
                  <span
                    className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-black uppercase border ${getMagColor(
                      ev.magnitude
                    )}`}
                  >
                    M {ev.magnitude !== null ? ev.magnitude.toFixed(1) : "?"}
                  </span>

                  <span className="max-w-[200px] truncate font-medium text-foreground">
                    {ev.location}
                  </span>

                  <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                    {getRelativeTime(ev.originTime)}
                  </span>

                  {isVeryRecent && (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-rose-600 animate-ping" />
                  )}
                </button>
              );
            })
          ) : (
            <span className="text-xs text-muted-foreground">
              {kh ? "មិនមានព្រឹត្តិការណ៍ក្នុងចន្លោះពេលនេះទេ" : "No seismic events reported in this window"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
