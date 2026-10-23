import React from "react";
import {
  type EarthquakeEvent,
  formatLocalIctTime,
} from "./earthquake-data";
import { useI18n } from "@/lib/i18n";
import { ExternalLink, Radio, Activity, Compass, Clock } from "lucide-react";

interface EarthquakeEventCardProps {
  event: EarthquakeEvent;
  isSelected?: boolean;
  isNew?: boolean;
  onSelect?: (event: EarthquakeEvent) => void;
}

export function getMagnitudeBadgeStyle(mag: number | null): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  if (mag === null || mag === undefined) {
    return {
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-300",
      label: "Unrated",
    };
  }
  if (mag >= 5.5) {
    return {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-300 ring-1 ring-rose-200",
      label: "Significant (M5.5+)",
    };
  }
  if (mag >= 4.5) {
    return {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-300",
      label: "Moderate (M4.5+)",
    };
  }
  if (mag >= 3.0) {
    return {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-300",
      label: "Minor (M3.0+)",
    };
  }
  return {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    label: "Micro (<M3.0)",
  };
}

export const EarthquakeEventCard: React.FC<EarthquakeEventCardProps> = ({
  event,
  isSelected = false,
  isNew = false,
  onSelect,
}) => {
  const { lang } = useI18n();
  const kh = lang === "km";

  const badgeStyle = getMagnitudeBadgeStyle(event.magnitude);
  const magDisplay = event.magnitude !== null ? event.magnitude.toFixed(1) : "—";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(event);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      onClick={() => onSelect?.(event)}
      onKeyDown={handleKeyDown}
      className={`group relative rounded-2xl border p-4.5 transition-all text-left cursor-pointer outline-none ${
        isSelected
          ? "border-primary bg-secondary/40 shadow-sm ring-2 ring-primary/30"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted/40 hover:shadow-2xs"
      }`}
    >
      {/* Header: Magnitude & Time */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs md:text-sm font-extrabold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
          >
            <Activity size={14} />
            M {magDisplay}
            {event.magnitudeType && (
              <span className="font-mono text-[10px] font-semibold opacity-80 uppercase">
                {event.magnitudeType}
              </span>
            )}
          </span>

          {isNew && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
              {kh ? "ថ្មី" : "New"}
            </span>
          )}

          {event.reviewStatus && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 capitalize">
              {event.reviewStatus}
            </span>
          )}
        </div>

        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap flex items-center gap-1">
          <Clock size={12} />
          {formatLocalIctTime(event.originTime, lang, { includeDate: true })}
        </span>
      </div>

      {/* Location Name */}
      <h4 className="mt-3 text-base md:text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
        {event.location}
      </h4>

      {/* Depth & Coordinates Grid */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:text-sm text-slate-600 border-t border-border/60 pt-2.5">
        <div>
          <span className="text-muted-foreground block text-[11px] font-medium">
            {kh ? "ជម្រៅរញ្ជួយ:" : "Hypocenter Depth:"}
          </span>
          <strong className="text-foreground font-semibold">
            {event.depthKm !== null ? `${event.depthKm.toFixed(0)} km` : "—"}
          </strong>
        </div>

        <div>
          <span className="text-muted-foreground block text-[11px] font-medium">
            {kh ? "កូអរដោណេ:" : "Coordinates:"}
          </span>
          <span className="font-mono text-slate-700 text-xs">
            {event.latitude.toFixed(3)}°N, {event.longitude.toFixed(3)}°E
          </span>
        </div>
      </div>

      {/* Providers & Outbound Reports */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-muted-foreground font-medium">
            {kh ? "ប្រភព:" : "Sources:"}
          </span>
          {event.reports.map((r, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200"
            >
              {r.provider}
            </span>
          ))}
        </div>

        {event.reports[0]?.sourceUrl && (
          <a
            href={event.reports[0].sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
          >
            <span>{kh ? "របាយការណ៍ផ្លូវការ ↗" : "Official Bulletin ↗"}</span>
          </a>
        )}
      </div>
    </div>
  );
};
