import React, { useState } from "react";
import {
  type EarthquakeEvent,
  formatLocalIctTime,
  translateEarthquakeLocation,
  getDepthClassification,
  formatDistanceToCambodia,
} from "./earthquake-data";
import { shareEarthquakeToFacebook, buildFacebookShareUrl } from "@/lib/facebook-service";
import { EarthquakePosterModal } from "./EarthquakePosterModal";
import { useI18n } from "@/lib/i18n";
import { ExternalLink, Radio, Activity, Compass, Clock, Sparkles } from "lucide-react";

interface EarthquakeEventCardProps {
  event: EarthquakeEvent;
  isSelected?: boolean;
  isNew?: boolean;
  onSelect?: (event: EarthquakeEvent) => void;
}

export function getMagnitudeBadgeStyle(mag: number | null, kh: boolean = false): {
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
      label: kh ? "មិនទាន់កំណត់" : "Unrated",
    };
  }
  if (mag >= 5.5) {
    return {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-300 ring-1 ring-rose-200",
      label: kh ? "ខ្លាំង (M5.5+)" : "Significant (M5.5+)",
    };
  }
  if (mag >= 4.5) {
    return {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-300",
      label: kh ? "មធ្យម (M4.5+)" : "Moderate (M4.5+)",
    };
  }
  if (mag >= 3.0) {
    return {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-300",
      label: kh ? "ខ្សោយ (M3.0+)" : "Minor (M3.0+)",
    };
  }
  return {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    label: kh ? "តូចបំផុត (<M3.0)" : "Micro (<M3.0)",
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
  const [showPoster, setShowPoster] = useState(false);

  const badgeStyle = getMagnitudeBadgeStyle(event.magnitude, kh);
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
            <span className="text-[10px] font-semibold opacity-90">
              ({kh ? "រ៉ិចទ័រ" : "Richter"})
            </span>
            {event.magnitudeType && (
              <span className="font-mono text-[10px] font-semibold opacity-80 uppercase">
                {event.magnitudeType}
              </span>
            )}
          </span>

          {(isNew || (Date.now() - new Date(event.originTime).getTime() < 3 * 3600 * 1000)) && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-300 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-ping"></span>
              {kh ? "ផ្សាយផ្ទាល់" : "LIVE"}
            </span>
          )}

          {event.reviewStatus && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 capitalize">
              {kh
                ? (event.reviewStatus === "reviewed" ? "បានពិនិត្យ" : "ស្វ័យប្រវត្ត")
                : event.reviewStatus}
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
        {translateEarthquakeLocation(event.location, lang)}
      </h4>

      {/* Depth & Coordinates Grid */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs md:text-sm text-slate-600 border-t border-border/60 pt-2.5">
        <div>
          <span className="text-muted-foreground block text-[11px] font-medium">
            {kh ? "ជម្រៅរញ្ជួយ:" : "Hypocenter Depth:"}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
            <strong className="text-foreground font-semibold">
              {event.depthKm !== null ? `${event.depthKm.toFixed(1)} km` : "—"}
            </strong>
            {(() => {
              const depthInfo = getDepthClassification(event.depthKm, kh);
              return (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${depthInfo.badgeBg} ${depthInfo.badgeBorder}`}
                >
                  {kh ? depthInfo.labelKm : depthInfo.labelEn}
                </span>
              );
            })()}
          </div>
        </div>

        <div>
          <span className="text-muted-foreground block text-[11px] font-medium">
            {kh ? "ចម្ងាយពីកម្ពុជា:" : "Distance to Cambodia:"}
          </span>
          <span className="font-semibold text-blue-700 text-xs mt-0.5 block">
            {formatDistanceToCambodia(event.distanceToCambodiaKm, event.latitude, event.longitude, kh)}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block text-[11px] font-medium">
            {kh ? "កូអរដោនេ:" : "Coordinates:"}
          </span>
          <span className="font-mono text-slate-700 text-xs mt-0.5 block">
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

                <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPoster(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition shadow-xs"
            title="Create ready-to-post Facebook bulletin poster with map & status"
          >
            <Sparkles size={12} className="text-emerald-600" />
            <span>{kh ? "ផ្ទាំងរូបភាព Poster" : "Create Poster"}</span>
          </button>

          <a
            href={buildFacebookShareUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => shareEarthquakeToFacebook(event, e)}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-600 border border-blue-200 hover:bg-blue-100 transition shadow-xs"
            title="1-Click Share earthquake bulletin to Facebook with tags and link"
          >
            <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>{kh ? "ចែករំលែក" : "Share"}</span>
          </a>

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

      {/* Ready-to-Post Poster Modal */}
      <EarthquakePosterModal
        event={event}
        isOpen={showPoster}
        onClose={() => setShowPoster(false)}
      />
    </div>
  );
};
