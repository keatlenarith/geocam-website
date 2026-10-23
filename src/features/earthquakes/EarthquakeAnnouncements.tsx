import React from "react";
import { useI18n } from "@/lib/i18n";
import { Link } from "@/lib/spa-router";
import {
  type EarthquakeEvent,
  type ProviderHealth,
  type ProviderName,
  generateEventAnnouncement,
  formatLocalIctTime,
} from "./earthquake-data";
import {
  Radio,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  RefreshCw,
  ExternalLink,
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
  className = "",
  isHomepage = false,
}) => {
  const { lang } = useI18n();
  const kh = lang === "km";

  const displayedEvents = events.slice(0, maxItems);

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
              {kh ? "ប្រព័ន្ធតាមដានការរញ្ជួយដីក្នុងតំបន់" : "Regional Earthquake Monitoring"}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-foreground mt-1 tracking-tight">
            {kh ? "សេចក្តីជូនដំណឹង និងព្រឹត្តិការណ៍រញ្ជួយដីថ្មីៗ" : "Latest Regional Earthquake Bulletins"}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            {kh
              ? "របាយការណ៍ស្វ័យប្រវត្តិតាមពេលវេលាជាក់ស្តែងពី USGS និងបណ្តាញរញ្ជួយដីក្នុងតំបន់ (កម្ពុជា ថៃ វៀតណាម ឡាវ មីយ៉ាន់ម៉ា)។"
              : "Live automated bulletins from USGS & regional seismological monitoring networks for Cambodia and neighboring territories."}
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1 text-xs font-bold text-foreground hover:bg-muted transition disabled:opacity-50"
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

      {/* Announcements List */}
      <div className="mt-6 space-y-3.5">
        {loading && events.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
            <RefreshCw size={22} className="animate-spin text-primary" />
            <span>{kh ? "កំពុងទាញយកទិន្នន័យរញ្ជួយដី..." : "Retrieving latest regional earthquake feeds..."}</span>
          </div>
        ) : displayedEvents.length > 0 ? (
          displayedEvents.map((event) => {
            const announcementText = generateEventAnnouncement(event, lang);
            const mag = event.magnitude !== null ? event.magnitude.toFixed(1) : "—";
            const isSignificant = (event.magnitude ?? 0) >= 4.5;

            return (
              <Link
                key={event.id}
                to={`/earthquake-monitoring?event=${encodeURIComponent(event.id)}`}
                className={`group flex items-start justify-between gap-4 rounded-xl border p-4 transition-all hover:border-primary/50 hover:bg-secondary/20 ${
                  isSignificant
                    ? "border-amber-200 bg-amber-50/30"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Magnitude Box */}
                  <div
                    className={`shrink-0 flex flex-col items-center justify-center rounded-xl px-2.5 py-1.5 border text-center ${
                      isSignificant
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : "bg-blue-50 text-blue-900 border-blue-200"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                      MAG
                    </span>
                    <strong className="text-base font-extrabold font-mono">
                      {mag}
                    </strong>
                  </div>

                  {/* Announcement Text */}
                  <div>
                    <p className="text-sm md:text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {announcementText}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                      <span>{event.location}</span>
                      <span>·</span>
                      <span>
                        {event.depthKm !== null ? `Depth ${event.depthKm.toFixed(0)} km` : "Depth unconfirmed"}
                      </span>
                      <span>·</span>
                      <span>
                        {event.latitude.toFixed(2)}°N, {event.longitude.toFixed(2)}°E
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pt-1 text-muted-foreground group-hover:text-primary transition-colors">
                  <ArrowUpRight size={18} />
                </div>
              </Link>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            {kh
              ? "មិនមានព្រឹត្តិការណ៍រញ្ជួយដីត្រូវបានរាយការណ៍ក្នុងចន្លោះពេលដែលបានជ្រើសរើសឡើយ។"
              : "No reported earthquakes detected in the selected time window for Cambodia & region."}
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
        <span className="font-mono text-[11px]">
          Envelope: 5°–25°N, 92°–112°E
        </span>
      </div>
    </div>
  );
};
