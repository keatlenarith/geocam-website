import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useI18n } from "@/lib/i18n";
import { meta } from "@/components/site/Chrome";
import {
  useEarthquakes,
  type TimeWindowOption,
  type SortOrderOption,
} from "@/features/earthquakes/useEarthquakes";
import {
  formatLocalIctTime,
  REGIONAL_BOUNDS,
  type EarthquakeEvent,
} from "@/features/earthquakes/earthquake-data";
import { EarthquakeEventCard } from "@/features/earthquakes/EarthquakeEventCard";
import { EarthquakeAnnouncements } from "@/features/earthquakes/EarthquakeAnnouncements";
import {
  Activity,
  Globe2,
  RefreshCw,
  Clock,
  Filter,
  Shield,
  AlertTriangle,
  ExternalLink,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  Info,
} from "lucide-react";

// Lazy load the Map component so map libraries are only loaded when visiting this page
const EarthquakeMap = React.lazy(
  () => import("@/features/earthquakes/EarthquakeMap")
);

export const RouteMeta = () =>
  meta(
    "Earthquake Monitoring — GeoCam Cambodia",
    "Real-time reported earthquakes in Cambodia and surrounding Southeast Asian countries. Automated seismological bulletins from USGS and regional networks."
  );

export default function EarthquakeMonitoringPage() {
  const { lang } = useI18n();
  const kh = lang === "km";

  // Filter states
  const [timeWindow, setTimeWindow] = useState<TimeWindowOption>("7d");
  const [minMagnitude, setMinMagnitude] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<SortOrderOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Data fetching hook
  const {
    events,
    allEvents,
    loading,
    error,
    isStale,
    lastSuccessTime,
    providerHealth,
    summary,
    newlyArrivedEventIds,
    refresh,
  } = useEarthquakes({
    timeWindow,
    minMagnitude,
    sortOrder,
    autoRefreshIntervalMs: 60000,
  });

  // Handle URL query parameter `?event=<encoded-id>`
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const eventParam = params.get("event");
      if (eventParam) {
        setSelectedEventId(eventParam);
      }
    } catch {}
  }, []);

  // Filtered by search text in location
  const displayedEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase().trim();
    return events.filter(
      (e) =>
        e.location.toLowerCase().includes(q) ||
        (e.magnitude !== null && `m${e.magnitude}`.includes(q))
    );
  }, [events, searchQuery]);

  const listContainerRef = useRef<HTMLDivElement>(null);

  // When an event is selected, scroll smoothly to it in the list if it's off-screen
  const handleSelectEvent = (event: EarthquakeEvent) => {
    setSelectedEventId(event.id);
  };

  const handleResetFilters = () => {
    setTimeWindow("7d");
    setMinMagnitude(0);
    setSortOrder("newest");
    setSearchQuery("");
  };

  return (
    <div
      data-no-translate="true"
      data-cms-inline="true"
      className="mx-auto w-full max-w-[1800px] px-4 py-8 md:px-8 lg:px-10 text-foreground"
    >
      {/* ========================================================================= */}
      {/* SECTION 1: INTRO & LIVE SOURCE STATUS */}
      {/* ========================================================================= */}
      <div className="mb-8 rounded-3xl border border-border bg-gradient-to-br from-secondary/40 via-background to-muted/50 p-6 md:p-9 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary">
                {kh ? "ប្រព័ន្ធតាមដានរញ្ជួយដីកម្ពុជា និងតំបន់" : "Cambodia & Regional Seismological Observation"}
              </span>
            </div>

            <h1 className="mt-2.5 font-display text-3xl font-extrabold text-foreground md:text-5xl tracking-tight">
              {kh ? "ការតាមដានការរញ្ជួយដី" : "Earthquake monitoring"}
            </h1>
            <p className="mt-2 text-base md:text-lg text-slate-600 max-w-4xl leading-relaxed">
              {kh
                ? "របាយការណ៍ស្វ័យប្រវត្តិនៃការរញ្ជួយដីថ្មីៗនៅកម្ពុជា និងបណ្តាប្រទេសជុំវិញ។ ព័ត៌មានលម្អិតបឋមអាចត្រូវបានកែសម្រួលដោយស្ថាប័នផ្លូវការ។"
                : "Recent reported earthquakes in Cambodia and surrounding countries. Automatically refreshed reports. Preliminary event details may be revised."}
            </p>
          </div>

          {/* Action / Refresh Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="btn btn-outline !py-2.5 !px-4 text-xs md:text-sm font-bold shadow-2xs hover:border-primary disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              <span>{loading ? (kh ? "កំពុងផ្ទុក..." : "Refreshing...") : kh ? "ផ្ទុកទិន្នន័យឡើងវិញ" : "Manual Refresh"}</span>
            </button>

            {lastSuccessTime && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-card border border-border px-3.5 py-2 text-xs font-mono text-muted-foreground shadow-2xs">
                <Clock size={13} />
                {kh ? "ធ្វើបច្ចុប្បន្នភាព:" : "Last refresh:"}{" "}
                <strong className="text-foreground">
                  {formatLocalIctTime(lastSuccessTime.toISOString(), lang, {
                    includeDate: false,
                    includeSeconds: true,
                  })}{" "}
                  ICT
                </strong>
              </span>
            )}
          </div>
        </div>

        {/* Source Providers Actual Status Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-bold uppercase tracking-wider text-muted-foreground text-xs">
              {kh ? "ស្ថានភាពស្ថាប័នផ្ដល់ទិន្នន័យ:" : "Data Provider Feeds:"}
            </span>

            {Object.values(providerHealth).map((ph) => {
              const isAvail = ph.status === "available";
              const isDelay = ph.status === "delayed";
              return (
                <div
                  key={ph.provider}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 border ${
                    isAvail
                      ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                      : isDelay
                        ? "bg-blue-50 text-blue-900 border-blue-300"
                        : "bg-slate-100 text-slate-700 border-slate-300"
                  }`}
                  title={ph.note || ph.name}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isAvail ? "bg-emerald-500 animate-pulse" : isDelay ? "bg-blue-500" : "bg-slate-400"
                    }`}
                  />
                  <strong className="font-bold">{ph.provider}</strong>
                  <span className="text-xs opacity-80">
                    ({ph.status === "unavailable" ? "delayed / timeout" : ph.status})
                  </span>
                </div>
              );
            })}
          </div>

          <span className="text-xs font-mono text-muted-foreground">
            {REGIONAL_BOUNDS.labelEn}
          </span>
        </div>

        {isStale && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs md:text-sm text-amber-900 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-700 shrink-0" />
            <span>
              {kh
                ? "បណ្តាញ upstream កំពុងមានការពន្យារពេល។ ប្រព័ន្ធកំពុងបង្ហាញទិន្នន័យបម្រុងទុកដែលបានរក្សាទុកចុងក្រោយ។"
                : "Upstream feed response delayed. Displaying verified cached bulletin data from the last successful synchronization."}
            </span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: SUMMARY METRIC CARDS */}
      {/* ========================================================================= */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Events in Window */}
        <div className="rounded-2xl border border-border bg-card p-5.5 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Activity size={14} className="text-primary" />
            {kh ? "ព្រឹត្តិការណ៍រាយការណ៍" : "Reported Events"}
          </span>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-extrabold font-mono text-foreground">
              {summary.totalCount}
            </span>
            <span className="text-xs text-muted-foreground">
              in selected {timeWindow}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Across Cambodia & surrounding envelope
          </span>
        </div>

        {/* Metric 2: Largest Reported Magnitude */}
        <div className="rounded-2xl border border-border bg-card p-5.5 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <AlertCircle size={14} className="text-amber-600" />
            {kh ? "ទំហំអតិបរមា" : "Largest Magnitude"}
          </span>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-extrabold font-mono text-foreground">
              {summary.largestMag !== null ? `M ${summary.largestMag.toFixed(1)}` : "—"}
            </span>
            {summary.largestMag !== null && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Peak in window
              </span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {summary.largestMag ? "Highest seismological record" : "No event recorded in window"}
          </span>
        </div>

        {/* Metric 3: Latest Event Time */}
        <div className="rounded-2xl border border-border bg-card p-5.5 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock size={14} className="text-blue-600" />
            {kh ? "ព្រឹត្តិការណ៍ចុងក្រោយ" : "Latest Event Time"}
          </span>
          <div className="mt-2.5">
            <span className="text-base md:text-lg font-bold font-mono text-foreground block">
              {summary.latestEventTime
                ? `${formatLocalIctTime(summary.latestEventTime, lang, { includeDate: true })} ICT`
                : "—"}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Cambodia Local Time (UTC+7)
          </span>
        </div>

        {/* Metric 4: Monitored Region Envelope */}
        <div className="rounded-2xl border border-border bg-card p-5.5 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Globe2 size={14} className="text-emerald-600" />
            {kh ? "ដែនកំណត់ភូមិសាស្ត្រ" : "Geographic Bounds"}
          </span>
          <div className="mt-2.5">
            <strong className="text-sm md:text-base font-bold font-mono text-foreground block">
              5°–25°N, 92°–112°E
            </strong>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {kh ? "កម្ពុជា ថៃ វៀតណាម ឡាវ មីយ៉ាន់ម៉ា" : "Cambodia & regional context"}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: FILTER CONTROLS */}
      {/* ========================================================================= */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-4.5 md:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Time window & Minimum magnitude pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-muted-foreground mr-1">
            <Filter size={14} />
            <span>{kh ? "តម្រង:" : "Filters:"}</span>
          </div>

          {/* Time Window Buttons */}
          <div className="flex rounded-xl border border-border p-0.5 bg-muted/60 text-xs font-bold">
            {(["24h", "7d", "30d"] as const).map((win) => (
              <button
                key={win}
                type="button"
                onClick={() => setTimeWindow(win)}
                className={`rounded-lg px-3 py-1.5 transition ${
                  timeWindow === win
                    ? "bg-primary text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {win === "24h" ? (kh ? "២៤ ម៉ោង" : "24 Hours") : win === "7d" ? (kh ? "៧ ថ្ងៃ" : "7 Days") : kh ? "៣០ ថ្ងៃ" : "30 Days"}
              </button>
            ))}
          </div>

          {/* Minimum Magnitude Dropdown */}
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-muted/50 border border-border rounded-xl px-3 py-1.5">
            <span>{kh ? "កម្រិតអប្បបរមា:" : "Min Magnitude:"}</span>
            <select
              value={minMagnitude}
              onChange={(e) => setMinMagnitude(Number(e.target.value))}
              className="bg-transparent font-bold text-foreground focus:outline-none"
            >
              <option value={0}>{kh ? "ទាំងអស់" : "All reported"}</option>
              <option value={2}>M 2.0+</option>
              <option value={3}>M 3.0+</option>
              <option value={4}>M 4.0+</option>
              <option value={5}>M 5.0+</option>
            </select>
          </label>

          {/* Sort Order Dropdown */}
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-muted/50 border border-border rounded-xl px-3 py-1.5">
            <span>{kh ? "តម្រៀប:" : "Sort:"}</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrderOption)}
              className="bg-transparent font-bold text-foreground focus:outline-none"
            >
              <option value="newest">{kh ? "ថ្មីបំផុតមុន" : "Newest first"}</option>
              <option value="largest">{kh ? "ទំហំធំបំផុតមុន" : "Largest magnitude"}</option>
            </select>
          </label>
        </div>

        {/* Right: Search box & Reset */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={kh ? "ស្វែងរកទីតាំង..." : "Search location..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border py-1.5 pl-8 pr-3 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          {(timeWindow !== "7d" || minMagnitude !== 0 || sortOrder !== "newest" || searchQuery) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-primary hover:underline whitespace-nowrap"
            >
              {kh ? "កំណត់ឡើងវិញ" : "Reset filters"}
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: MAP & EVENT PANEL (DESKTOP 2/3 MAP, 1/3 EVENT LIST) */}
      {/* ========================================================================= */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.85fr)_minmax(360px,1.15fr)] mb-12">
        {/* LEFT: Interactive Map Canvas */}
        <div className="h-[580px] lg:h-[680px]">
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center rounded-2xl border border-border bg-slate-900 text-white font-mono text-sm">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw size={28} className="animate-spin text-primary" />
                  <span>Loading Seismological Map Canvas...</span>
                </div>
              </div>
            }
          >
            <EarthquakeMap
              events={displayedEvents}
              selectedEventId={selectedEventId}
              onSelectEvent={handleSelectEvent}
              className="h-full w-full"
            />
          </Suspense>
        </div>

        {/* RIGHT: Scrollable Event Cards List */}
        <div className="flex flex-col h-[580px] lg:h-[680px] rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {kh ? "បញ្ជីព្រឹត្តិការណ៍រញ្ជួយដី" : "Regional Event Directory"} ({displayedEvents.length})
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              Click to inspect on map
            </span>
          </div>

          <div
            ref={listContainerRef}
            className="flex-1 overflow-y-auto space-y-3 pr-1.5"
            tabIndex={0}
            aria-label="Earthquake events list"
          >
            {displayedEvents.length > 0 ? (
              displayedEvents.map((e) => (
                <EarthquakeEventCard
                  key={e.id}
                  event={e}
                  isSelected={selectedEventId === e.id}
                  isNew={newlyArrivedEventIds.has(e.id)}
                  onSelect={handleSelectEvent}
                />
              ))
            ) : (
              <div className="py-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center h-full px-4">
                <Info size={32} className="text-slate-400 mb-2" />
                <p className="font-semibold text-foreground">
                  {kh ? "មិនមានទិន្នន័យរញ្ជួយដីផ្គូផ្គងទេ" : "No Matching Earthquakes"}
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  {kh
                    ? "សូមសាកល្បងពង្រីកចន្លោះពេល ឬបន្ថយកម្រិតរញ្ជួយដីអប្បបរមា។"
                    : "Try widening the time window (e.g. 30 days) or lowering the minimum magnitude filter."}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 btn btn-outline !py-1 !px-3 !text-xs font-bold"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5: FACTUAL ANNOUNCEMENTS FEED */}
      {/* ========================================================================= */}
      <div className="mb-12">
        <EarthquakeAnnouncements
          events={events}
          loading={loading}
          isStale={isStale}
          lastSuccessTime={lastSuccessTime}
          providerHealth={providerHealth}
          maxItems={6}
          showViewAllLink={false}
          onRefresh={refresh}
        />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 6: SCIENTIFIC SOURCE NOTES & DISCLAIMER */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-border bg-muted/40 p-7 md:p-9 text-slate-700">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-primary mb-3">
          <Shield size={18} />
          <span>{kh ? "កំណត់សម្គាល់វិទ្យាសាស្ត្រ និងគោលការណ៍ទិន្នន័យ" : "Scientific Source Notes & Monitoring Governance"}</span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-foreground">
          {kh ? "ព័ត៌មានស្តីពីប្រភពទិន្នន័យ និងដែនកំណត់នៃការតាមដាន" : "Monitoring Coverage, Reporting Protocols & Data Limitations"}
        </h3>

        <div className="mt-5 grid gap-6 md:grid-cols-2 text-sm leading-relaxed text-slate-600">
          <div className="space-y-3">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">
              {kh ? "១. ដែនកំណត់ភូមិសាស្ត្រ និងបណ្តាញរញ្ជួយដី" : "1. Geographic Coverage & Seismic Networks"}
            </h4>
            <p>
              This console actively monitors the regional seismological envelope between <strong>5°–25°N and 92°–112°E</strong>, encompassing Cambodia, Thailand, Vietnam, Laos, Myanmar, parts of the Andaman Basin, and southern China. Because Cambodia has limited domestic seismic sensor stations, regional observations rely on validated international feeds from the <strong>United States Geological Survey (USGS)</strong>, the <strong>Thai Meteorological Department (TMD)</strong>, and national bulletins from the <strong>Institute of Geophysics (VAST Vietnam)</strong>.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">
              {kh ? "២. ការកែសម្រួលទិន្នន័យបឋម និងការពន្យារពេល" : "2. Preliminary Revisions & Reporting Delays"}
            </h4>
            <p>
              Bulletins originate from automated detection algorithms and are subsequently reviewed by seismologists. Reported magnitudes (such as \(M_w\), \(M_b\), or \(M_L\)), focal depths, and exact epicentral coordinates are frequently revised following manual waveform analysis. A newly reported event does not imply immediate ground shaking in Cambodia unless officially documented.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">
              {kh ? "៣. មិនមែនជាប្រព័ន្ធព្យាករណ៍ ឬប្រកាសអាសន្នបន្ទាន់" : "3. Scientific Monitoring Disclaimer"}
            </h4>
            <p>
              This public dashboard is designed for educational, research, and scientific awareness. <strong>It is NOT an earthquake prediction system or emergency early-warning siren.</strong> Earthquakes cannot be predicted in advance. For immediate emergency guidance or civil safety advisories, always refer to the National Committee for Disaster Management (NCDM) of Cambodia.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">
              {kh ? "៤. ស្ថាប័នផ្ដល់ទិន្នន័យផ្លូវការ" : "4. Official Agency Portals"}
            </h4>
            <div className="space-y-1.5 text-xs">
              <a
                href="https://earthquake.usgs.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline block"
              >
                <ArrowUpRight size={13} /> USGS Earthquake Hazards Program (United States)
              </a>
              <a
                href="https://earthquake.tmd.go.th/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline block"
              >
                <ArrowUpRight size={13} /> TMD Earthquake Observation Division (Thailand)
              </a>
              <a
                href="https://igp-vast.vn/index.php/en/earthquake-news"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline block"
              >
                <ArrowUpRight size={13} /> Institute of Geophysics — VAST (Vietnam)
              </a>
              <a
                href="https://earthquake.phivolcs.dost.gov.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline block"
              >
                <ArrowUpRight size={13} /> PHIVOLCS DOST (Philippines)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
