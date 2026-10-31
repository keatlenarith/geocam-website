import React from "react";
import { useI18n } from "@/lib/i18n";
import { Link } from "@/lib/spa-router";
import {
  type EarthquakeEvent,
  type ProviderHealth,
  type ProviderName,
  generateEventAnnouncement,
  formatLocalIctTime,
  translateEarthquakeLocation,
  getDepthClassification,
  formatDistanceToCambodia,
} from "./earthquake-data";
import { shareEarthquakeToFacebook, buildFacebookShareUrl } from "@/lib/facebook-service";
import { EarthquakeMiniMap } from "./EarthquakeMiniMap";
import {
  Radio,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  RefreshCw,
  ExternalLink,
  MapPin,
  Compass,
  Layers,
  ChevronRight,
} from "lucide-react";

interface EarthquakeAnnouncementsProps {
  events: EarthquakeEvent[];
  loading?: boolean;
  isStale?: boolean;
  lastSuccessTime?: Date | null;
  providerHealth?: Record<ProviderName, ProviderHealth>;
  maxItems?: number;
  showViewAllLink?: boolean;
  onRefresh?: () => void;
  onSelectEvent?: (event: EarthquakeEvent) => void;
  className?: string;
  isHomepage?: boolean;
}

export const EarthquakeAnnouncements: React.FC<EarthquakeAnnouncementsProps> = ({
  events,
  loading = false,
  isStale = false,
  lastSuccessTime,
  providerHealth,
  maxItems = 3,
  showViewAllLink = true,
  onRefresh,
  onSelectEvent,
  className = "",
  isHomepage = false,
}) => {
  const { lang } = useI18n();
  const kh = lang === "km";

  const displayedEvents = events.slice(0, maxItems);

  // Helper for human-readable relative time
  const getRelativeTime = (isoTime: string): string => {
    try {
      const diffMs = Date.now() - new Date(isoTime).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return kh ? "ទើបតែឥឡូវនេះ" : "just now";
      if (diffMins < 60) return kh ? `${diffMins} នាទីមុន` : `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return kh ? `${diffHours} ម៉ោងមុន` : `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return kh ? `${diffDays} ថ្ងៃមុន` : `${diffDays}d ago`;
    } catch {
      return "";
    }
  };

  return (
    <div
      data-no-translate="true"
      data-cms-inline="true"
      className={`rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {kh ? "ប្រព័ន្ធតាមដានការរញ្ជួយដីស្វ័យប្រវត្តិ" : "Automated Earthquake Seismological Feed"}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-foreground mt-1 tracking-tight">
            {kh ? "សេចក្តីជូនដំណឹង និងព្រឹត្តិការណ៍រញ្ជួយដីថ្មីៗ" : "Latest Earthquake Announcements & Bulletins"}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            {kh
              ? "របាយការណ៍ស្វ័យប្រវត្តិតាមពេលវេលាជាក់ស្តែងពី USGS និងបណ្តាញរញ្ជួយដី (កម្ពុជា តំបន់ជុំវិញ និងទូទាំងពិភពលោក)។"
              : "Live automated bulletins from USGS & regional networks for Cambodia, surrounding nations, and global seismicity."}
          </p>
        </div>

        {/* Status Chips & Refresh */}
        <div className="flex flex-wrap items-center gap-2.5">
          {lastSuccessTime && (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
              <Clock size={12} />
              {kh ? "បានធ្វើបច្ចុប្បន្នភាព:" : "Updated:"}{" "}
              {formatLocalIctTime(lastSuccessTime.toISOString(), lang, {
                includeDate: false,
                includeSeconds: true,
              })}{" "}
              ICT
            </span>
          )}

          {isStale && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
              {kh ? "ទិន្នន័យបណ្តោះអាសន្ន" : "Cached data"}
            </span>
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1 text-xs font-bold text-foreground hover:bg-muted transition disabled:opacity-50 cursor-pointer"
              title="Refresh bulletins"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>{kh ? "ផ្ទុកឡើងវិញ" : "Refresh"}</span>
            </button>
          )}

          {showViewAllLink && (
            <Link
              to="/earthquake-monitoring"
              className="btn btn-primary !py-1.5 !px-3.5 !text-xs !font-bold"
            >
              <span>{kh ? "មើលផែនទីតាមដានពេញ ↗" : "Full Monitoring Console ↗"}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Provider Status Indicators */}
      {providerHealth && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
            {kh ? "ស្ថានភាពប្រភព:" : "Sources:"}
          </span>
          {Object.values(providerHealth).map((ph) => {
            const isAvail = ph.status === "available";
            const isDelay = ph.status === "delayed";
            return (
              <span
                key={ph.provider}
                title={ph.note || ph.name}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${
                  isAvail
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : isDelay
                      ? "bg-blue-50 text-blue-800 border-blue-200"
                      : "bg-slate-100 text-slate-600 border-slate-300"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isAvail ? "bg-emerald-500" : isDelay ? "bg-blue-500" : "bg-slate-400"
                  }`}
                />
                <strong className="font-bold">{ph.provider}</strong>
                <span className="capitalize opacity-80 text-[10px]">
                  {ph.status === "unavailable" ? "delayed / timeout" : ph.status}
                </span>
              </span>
            );
          })}
        </div>
      )}

      {/* Announcements List with Epicenter Mini-Maps */}
      <div className="mt-6 space-y-4">
        {loading && events.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
            <RefreshCw size={24} className="animate-spin text-primary" />
            <span>{kh ? "កំពុងទាញយកទិន្នន័យរញ្ជួយដី..." : "Retrieving latest earthquake feeds & bulletins..."}</span>
          </div>
        ) : displayedEvents.length > 0 ? (
          displayedEvents.map((event) => {
            const announcementText = generateEventAnnouncement(event, lang);
            const mag = event.magnitude !== null ? event.magnitude.toFixed(1) : "—";
            const isSignificant = (event.magnitude ?? 0) >= 5.0;
            const isModerate = (event.magnitude ?? 0) >= 4.0;
            const relTime = getRelativeTime(event.originTime);

            const cardContent = (
              <div
                className={`group flex flex-col md:flex-row items-stretch gap-4 rounded-xl border p-4 transition-all hover:border-primary/50 hover:bg-secondary/15 ${
                  isSignificant
                    ? "border-rose-300/80 bg-rose-50/20 shadow-xs"
                    : isModerate
                    ? "border-amber-200 bg-amber-50/20"
                    : "border-border bg-card"
                }`}
              >
                {/* 1. Epicenter Mini Map */}
                <div className="w-full md:w-[220px] shrink-0 flex items-center justify-center">
                  <EarthquakeMiniMap
                    latitude={event.latitude}
                    longitude={event.longitude}
                    magnitude={event.magnitude}
                    location={translateEarthquakeLocation(event.location, lang)}
                    depthKm={event.depthKm}
                    isRegional={event.isRegional}
                    zoom={event.isRegional ? 5 : 4}
                    width={220}
                    height={140}
                    className="w-full h-[140px] shadow-sm"
                  />
                </div>

                {/* 2. Structured Details & Narrative */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    {/* Top Row: Badges, Origin Time, Relative Time */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {/* Magnitude Pill */}
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-black font-mono tracking-tight shadow-2xs ${
                            isSignificant
                              ? "bg-rose-600 text-white"
                              : isModerate
                              ? "bg-amber-600 text-white"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          M {mag} {event.magnitudeType ? event.magnitudeType.toUpperCase() : ""}
                          <span className="text-[10px] opacity-90 font-sans font-bold">
                            ({kh ? "រ៉ិចទ័រ" : "Richter"})
                          </span>
                        </span>

                        {/* Region Tag */}
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            event.isRegional
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-slate-100 text-slate-700 border border-slate-300"
                          }`}
                        >
                          {event.isRegional
                            ? kh
                              ? "🇰🇭 តំបន់កម្ពុជា"
                              : "🇰🇭 Cambodia Region"
                            : kh
                            ? "🌐 សកល"
                            : "🌐 Global Event"}
                        </span>

                        {/* Provider Tag */}
                        <span className="text-[10px] font-mono font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {event.reports[0]?.provider || "USGS"}
                        </span>
                      </div>

                      {/* Origin Time ICT */}
                      <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                        <Clock size={11} />
                        {formatLocalIctTime(event.originTime, lang, { includeDate: true })}{" "}
                        ICT
                        {relTime && <span className="text-primary font-sans font-semibold">({relTime})</span>}
                      </span>
                    </div>

                    {/* Announcement Narrative */}
                    <h4 className="text-sm md:text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {announcementText}
                    </h4>

                    {/* Technical Telemetry Grid */}
                    <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-muted/40 p-2.5 rounded-lg border border-border/60">
                      <div>
                        <span className="block text-[10px] text-muted-foreground font-sans font-semibold uppercase">
                          {kh ? "ជម្រៅរំញ័រ" : "Focal Depth"}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <strong className="text-foreground">
                            {event.depthKm !== null ? `${event.depthKm.toFixed(1)} km` : "—"}
                          </strong>
                          {(() => {
                            const dInfo = getDepthClassification(event.depthKm, kh);
                            return (
                              <span
                                className={`text-[9px] font-sans font-bold px-1 py-0.2 rounded border ${dInfo.badgeBg} ${dInfo.badgeBorder}`}
                              >
                                {kh ? dInfo.labelKm : dInfo.labelEn}
                              </span>
                            );
                          })()}
                        </div>
                      </div>

                      <div>
                        <span className="block text-[10px] text-muted-foreground font-sans font-semibold uppercase">
                          {kh ? "កូអរដោនេ" : "Coordinates"}
                        </span>
                        <strong className="text-foreground">
                          {event.latitude >= 0 ? `${event.latitude.toFixed(2)}°N` : `${Math.abs(event.latitude).toFixed(2)}°S`},{" "}
                          {event.longitude >= 0 ? `${event.longitude.toFixed(2)}°E` : `${Math.abs(event.longitude).toFixed(2)}°W`}
                        </strong>
                      </div>

                      <div>
                        <span className="block text-[10px] text-muted-foreground font-sans font-semibold uppercase">
                          {kh ? "ចម្ងាយពីកម្ពុជា" : "From Cambodia"}
                        </span>
                        <strong className="text-foreground">
                          {formatDistanceToCambodia(
                            event.distanceToCambodiaKm,
                            event.latitude,
                            event.longitude,
                            kh
                          )}
                        </strong>
                      </div>

                      <div>
                        <span className="block text-[10px] text-muted-foreground font-sans font-semibold uppercase">
                          {kh ? "ស្ថានភាពត្រួតពិនិត្យ" : "Review Status"}
                        </span>
                        <span
                          className={`font-semibold capitalize text-[11px] ${
                            event.status === "reviewed"
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }`}
                        >
                          {kh
                            ? (event.status === "reviewed" ? "បានពិនិត្យរួច" : "បឋម")
                            : (event.status || "preliminary")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin size={11} className="text-primary" />
                      <span>{translateEarthquakeLocation(event.location, lang)}</span>
                    </span>

                    <div className="flex items-center gap-3">
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

                      {event.url && (
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-primary transition"
                          title="Official source bulletin"
                        >
                          <span>{kh ? "ព្រឹត្តិបត្រផ្លូវការ" : "Official Bulletin"}</span>
                          <ExternalLink size={11} />
                        </a>
                      )}

                      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                        <span>{kh ? "មើលលើផែនទី" : "Inspect On Map"}</span>
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );

            // If we have an onSelectEvent handler (e.g. inside /earthquake-monitoring), click to focus map
            if (onSelectEvent) {
              return (
                <div
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className="cursor-pointer"
                >
                  {cardContent}
                </div>
              );
            }

            // Otherwise, link to dedicated page with event ID
            return (
              <Link
                key={event.id}
                to={`/earthquake-monitoring?event=${encodeURIComponent(event.id)}`}
                className="block"
              >
                {cardContent}
              </Link>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            {kh
              ? "មិនមានព្រឹត្តិការណ៍រញ្ជួយដីត្រូវបានរាយការណ៍ក្នុងចន្លោះពេលដែលបានជ្រើសរើសឡើយ។"
              : "No reported earthquakes detected in the selected time window. Try expanding the time filter or minimum magnitude."}
          </div>
        )}
      </div>

      {/* Scientific Disclaimer Footer */}
      <div className="mt-6 pt-4 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="leading-relaxed">
          {kh
            ? "⚠️ របាយការណ៍ត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយស្វ័យប្រវត្តិ។ ព័ត៌មានលម្អិតបឋមអាចត្រូវបានកែសម្រួលដោយស្ថាប័នភូគព្ភសាស្ត្រផ្លូវការ។"
            : "⚠️ Automatically refreshed reports. Preliminary event details may be revised by official monitoring agencies."}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground/90">
          {kh
            ? "លំនាំដើម៖ កម្ពុជា និងតំបន់ (5°–25°N, 92°–112°E) · អាចស្វែងរកទូទាំងពិភពលោក"
            : "Default: Cambodia & Regional Envelope (5°–25°N, 92°–112°E) · Global search enabled"}
        </span>
      </div>
    </div>
  );
};
