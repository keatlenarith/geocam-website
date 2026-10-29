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
import { EarthquakeLiveStream } from "@/features/earthquakes/EarthquakeLiveStream";
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
  MapPin,
} from "lucide-react";

// Lazy load the Map component so map libraries are only loaded when visiting this page
const EarthquakeMap = React.lazy(
  () => import("@/features/earthquakes/EarthquakeMap")
);

export const RouteMeta = () =>
  meta(
    "Earthquake Monitoring — GeoCam Cambodia",
    "Real-time reported earthquakes in Cambodia, surrounding Southeast Asian countries, and globally. Automated seismological bulletins from USGS and regional networks."
  );

export default function EarthquakeMonitoringPage() {
  const { lang } = useI18n();
  const kh = lang === "km";

  // Filter states
  const [scope, setScope] = useState<"cambodia" | "global">("cambodia");
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
    scope,
    searchQuery,
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
    setScope("cambodia");
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
                {kh ? "ប្រព័ន្ធតាមដានរញ្ជួយដីកម្ពុជា និងពិភពលោក" : "Seismological Observation Console · Cambodia & Global"}
              </span>
            </div>

            <h1 className="mt-2.5 font-display text-3xl font-extrabold text-foreground md:text-5xl tracking-tight">
              {kh ? "ការតាមដានការរញ្ជួយដី" : "Earthquake monitoring"}
            </h1>
            <p className="mt-2 text-base md:text-lg text-slate-600 max-w-4xl leading-relaxed">
              {kh
                ? "របាយការណ៍ស្វ័យប្រវត្តិនៃការរញ្ជួយដីថ្មីៗនៅកម្ពុជា បណ្តាប្រទេសជុំវិញ និងទូទាំងពិភពលោក។ លំនាំដើមបង្ហាញតំបន់កម្ពុជា ប៉ុន្តែអ្នកអាចរំកិលផែនទី ឬស្វែងរកទីតាំងណាមួយលើពិភពលោក។"
                : "Recent reported earthquakes in Cambodia, surrounding countries, and globally. Default view is centered on Cambodia, with full global search and free interactive map exploration."}
            </p>
          </div>

          {/* Action / Refresh Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {lastSuccessTime && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-xl shadow-2xs">
                <Clock size={13} className="text-primary" />
                <span>{kh ? "បានធ្វើបច្ចុប្បន្នភាព:" : "Last refresh:"}</span>
                <strong>
                  {formatLocalIctTime(lastSuccessTime.toISOString(), lang, {
                    includeDate: false,
                    includeSeconds: true,
                  })}{" "}
                  ICT
                </strong>
              </span>
            )}

            <button
              type="button"
              onClick={() => refresh()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs md:text-sm font-bold text-white shadow-xs hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>{loading ? (kh ? "កំពុងផ្ទុក..." : "Refreshing...") : kh ? "ធ្វើបច្ចុប្បន្នភាព" : "Manual Refresh"}</span>
            </button>
          </div>
        </div>

        {/* Live Provider Availability Status Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
              {kh ? "ប្រភពទិន្នន័យផ្លូវការ:" : "Monitored Providers:"}
            </span>
            {Object.values(providerHealth).map((ph) => {
              const isAvail = ph.status === "available";
              const isDelay = ph.status === "delayed";
              return (
                <span
                  key={ph.provider}
                  title={ph.note || ph.name}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
                    isAvail
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : isDelay
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : "bg-slate-100 text-slate-600 border-slate-300"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isAvail ? "bg-emerald-500" : isDelay ? "bg-blue-500" : "bg-slate-400"
                    }`}
                  />
                  <strong>{ph.provider}</strong>
                  <span className="capitalize text-[11px] opacity-80">
                    ({ph.status === "unavailable" ? "delayed / timeout" : ph.status})
                  </span>
                </span>
              );
            })}
          </div>

          <div className="text-xs text-muted-foreground italic">
            {kh
              ? "ទិន្នន័យត្រូវបានធ្វើបច្ចុប្បន្នភាពស្វ័យប្រវត្តិ។ ព័ត៌មានលម្អិតបឋមអាចត្រូវបានកែសម្រួល។"
              : "Automatically refreshed reports. Preliminary event details may be revised."}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: SUMMARY METRIC CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Metric 1: Reported Events Count */}
        <div className="rounded-2xl border border-border bg-card p-5.5 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Activity size={14} className="text-primary" />
            {kh ? "ចំនួនព្រឹត្តិការណ៍" : "Reported Events"}
          </span>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-extrabold font-mono text-foreground">
              {summary.totalCount}
            </span>
            <span className="text-xs text-muted-foreground">
              {kh ? `ក្នុងរយៈពេល ${timeWindow} ដែលបានជ្រើសរើស` : `in selected ${timeWindow}`}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {scope === "cambodia" && !searchQuery
              ? kh
                ? "ក្នុងតំបន់កម្ពុជា និងប្រទេសជិតខាង"
                : "Cambodia & regional envelope"
              : kh
              ? "ទូទាំងពិភពលោក"
              : "Global / Worldwide catalogue"}
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
                {kh ? "កម្រិតខ្ពស់បំផុតក្នុងចន្លោះពេល" : "Peak in window"}
              </span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {summary.largestMag ? (kh ? "កំណត់ត្រារញ្ជួយដីកម្រិតខ្ពស់បំផុត" : "Highest seismological record") : (kh ? "មិនមានទិន្នន័យក្នុងចន្លោះពេល" : "No event recorded in window")}
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
            {kh ? "ម៉ោងនៅកម្ពុជា (UTC+7)" : "Cambodia Local Time (UTC+7)"}
          </span>
        </div>

        {/* Metric 4: Geographic Scope & Bounds */}
        <div className="rounded-2xl border border-border bg-card p-5.5 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Globe2 size={14} className="text-emerald-600" />
            {kh ? "ដែនកំណត់ភូមិសាស្ត្រ" : "Geographic Scope"}
          </span>
          <div className="mt-2.5">
            <strong className="text-sm md:text-base font-bold font-mono text-foreground block">
              {scope === "cambodia" && !searchQuery
                ? "5°–25°N, 92°–112°E"
                : (kh ? "🌐 ទូទាំងពិភពលោក" : "🌐 Worldwide (Global)")}
            </strong>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {scope === "cambodia" && !searchQuery
              ? kh
                ? "កម្ពុជា ថៃ វៀតណាម ឡាវ មីយ៉ាន់ម៉ា"
                : "Cambodia & regional context"
              : kh
              ? "ទិន្នន័យរញ្ជួយដីទូទាំងពិភពលោក"
              : "Global seismicity from USGS network"}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: FILTER CONTROLS */}
      {/* ========================================================================= */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-4.5 md:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Scope, Time window & Minimum magnitude pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-muted-foreground mr-1">
            <Filter size={14} />
            <span>{kh ? "តម្រង:" : "Filters:"}</span>
          </div>

          {/* Scope Toggle: Cambodia & Region vs Global */}
          <div className="flex rounded-xl border border-border p-0.5 bg-muted/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => setScope("cambodia")}
              className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
                scope === "cambodia"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {kh ? "🇰🇭 កម្ពុជា និងតំបន់ (លំនាំដើម)" : "🇰🇭 Cambodia & Region (Default)"}
            </button>
            <button
              type="button"
              onClick={() => setScope("global")}
              className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
                scope === "global"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {kh ? "🌐 ទូទាំងពិភពលោក" : "🌐 Global / Worldwide"}
            </button>
          </div>

          {/* Time Window Buttons: 6h, 24h, 7days, 30days */}
          <div className="flex rounded-xl border border-border p-0.5 bg-muted/60 text-xs font-bold">
            {(
              [
                { id: "6h", en: "6h", km: "៦ ម៉ោង" },
                { id: "24h", en: "24h", km: "២៤ ម៉ោង" },
                { id: "7d", en: "7 Days", km: "៧ ថ្ងៃ" },
                { id: "30d", en: "30 Days", km: "៣០ ថ្ងៃ" },
              ] as const
            ).map((win) => (
              <button
                key={win.id}
                type="button"
                onClick={() => setTimeWindow(win.id)}
                className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
                  timeWindow === win.id
                    ? "bg-primary text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {kh ? win.km : win.en}
              </button>
            ))}
          </div>

          {/* Minimum Magnitude Dropdown */}
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-muted/50 border border-border rounded-xl px-3 py-1.5">
            <span>{kh ? "កម្រិតអប្បបរមា:" : "Min Magnitude:"}</span>
            <select
              value={minMagnitude}
              onChange={(e) => setMinMagnitude(Number(e.target.value))}
              className="bg-transparent font-bold text-foreground focus:outline-none cursor-pointer"
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
              className="bg-transparent font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="newest">{kh ? "ថ្មីបំផុតមុន" : "Newest first"}</option>
              <option value="largest">{kh ? "ទំហំធំបំផុតមុន" : "Largest magnitude"}</option>
            </select>
          </label>
        </div>

        {/* Right: Search box & Reset */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={kh ? "ស្វែងរកទីតាំងលើពិភពលោក (ឧ. Japan, Myanmar)..." : "Search worldwide (e.g. Japan, Myanmar)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border py-1.5 pl-8 pr-3 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          {(timeWindow !== "7d" || minMagnitude !== 0 || sortOrder !== "newest" || searchQuery || scope !== "cambodia") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-primary hover:underline whitespace-nowrap cursor-pointer"
            >
              {kh ? "កំណត់ឡើងវិញ" : "Reset filters"}
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LIVE EVENT STREAM & RUNNING SEISMIC TICKER (earthquakemap.live format) */}
      {/* ========================================================================= */}
      <div className="mb-6">
        <EarthquakeLiveStream
          events={events}
          selectedEventId={selectedEventId}
          onSelectEvent={handleSelectEvent}
          timeWindow={timeWindow}
          onTimeWindowChange={setTimeWindow}
          loading={loading}
          onRefresh={refresh}
        />
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
                  <span>{kh ? "កំពុងផ្ទុកផ្ទាំងផែនទីរញ្ជួយដី..." : "Loading Seismological Map Canvas..."}</span>
                </div>
              </div>
            }
          >
            <EarthquakeMap
              events={events}
              selectedEventId={selectedEventId}
              onSelectEvent={handleSelectEvent}
              scope={scope}
              onScopeChange={setScope}
              className="h-full w-full"
            />
          </Suspense>
        </div>

        {/* RIGHT: Scrollable Event Cards List */}
        <div className="flex flex-col h-[580px] lg:h-[680px] rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {kh ? "បញ្ជីព្រឹត្តិការណ៍រញ្ជួយដី" : "Earthquake Directory"} ({events.length})
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              {kh ? "ចុចដើម្បីពិនិត្យលើផែនទី" : "Click to inspect on map"}
            </span>
          </div>

          <div
            ref={listContainerRef}
            className="flex-1 overflow-y-auto space-y-3 pr-1.5"
            tabIndex={0}
            aria-label="Earthquake events list"
          >
            {events.length > 0 ? (
              events.map((e) => (
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
                    ? "សូមសាកល្បងប្តូរទៅជាទូទាំងពិភពលោក (Global) ឬពង្រីកចន្លោះពេល។"
                    : "Try switching to Global view, widening the time window, or clearing your search."}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 btn btn-outline !py-1 !px-3 !text-xs font-bold"
                >
                  {kh ? "កំណត់ឡើងវិញ" : "Reset filters"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5: FACTUAL ANNOUNCEMENTS FEED (WITH MINI MAPS & FULL DETAILS) */}
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
          onSelectEvent={handleSelectEvent}
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
            {kh ? (
              <p>
                ប្រព័ន្ធតាមដាននេះកំណត់លំនាំដើមលើតំបន់ភូគព្ភសាស្ត្ររញ្ជួយដីចន្លោះ <strong>5°–25°N និង 92°–112°E</strong> ដែលគ្របដណ្តប់ប្រទេសកម្ពុជា ថៃ វៀតណាម ឡាវ មីយ៉ាន់ម៉ា ផ្នែកខ្លះនៃអាងសមុទ្រអាន់ដាម៉ាន និងភាគខាងត្បូងប្រទេសចិន។ អ្នកប្រើប្រាស់អាចជ្រើសរើស <strong>ទូទាំងពិភពលោក</strong> ឬស្វែងរកទីតាំងណាមួយលើពិភពលោក ដើម្បីស្វែងយល់ពីការរញ្ជួយដីអន្តរជាតិ។ ការសង្កេតក្នុងតំបន់ផ្អែកលើប្រភពទិន្នន័យផ្លូវការដែលបានផ្ទៀងផ្ទាត់ពី <strong>ការស្ទង់ភូគព្ភសាស្ត្រសហរដ្ឋអាមេរិក (USGS)</strong>, <strong>ទីភ្នាក់ងារឧតុនិយមជប៉ុន (JMA)</strong>, <strong>នាយកដ្ឋានឧតុនិយមថៃ (TMD)</strong>, <strong>បណ្តាញតាមដានរញ្ជួយដីចិន (CENC/CEA)</strong> និងព្រឹត្តិបត្រពីស្ថានីយអង្កេតក្នុងតំបន់។
              </p>
            ) : (
              <p>
                This console defaults to the regional seismological envelope between <strong>5°–25°N and 92°–112°E</strong>, encompassing Cambodia, Thailand, Vietnam, Laos, Myanmar, parts of the Andaman Basin, and southern China. Users can freely toggle <strong>Global / Worldwide</strong> or search any location globally to discover international earthquakes. Regional observations rely on validated feeds from the <strong>United States Geological Survey (USGS)</strong>, the <strong>Thai Meteorological Department (TMD)</strong>, and bulletins from regional seismological observatories.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">
              {kh ? "២. ការកែសម្រួលទិន្នន័យបឋម និងការពន្យារពេល" : "2. Preliminary Revisions & Reporting Delays"}
            </h4>
            {kh ? (
              <p>
                ព្រឹត្តិបត្រព័ត៌មានមានប្រភពចេញពីក្បួនដោះស្រាយស្វ័យប្រវត្តិ ហើយត្រូវបានពិនិត្យផ្ទៀងផ្ទាត់ឡើងវិញដោយអ្នកភូគព្ភសាស្ត្រជំនាញ។ ទំហំរំញ័រដែលបានរាយការណ៍ (ដូចជា \(M_w\), \(M_b\) ឬ \(M_L\)) ជម្រៅរំញ័រ និងកូអរដោនេផ្ចិតរញ្ជួយដីជាក់លាក់ អាចត្រូវបានកែសម្រួលជាញឹកញាប់បន្ទាប់ពីការវិភាគទម្រង់រលកដោយដៃ។ ការរាយការណ៍ព្រឹត្តិការណ៍ថ្មី មិនមានន័យថាមានការរញ្ជួយដីដល់កម្ពុជាភ្លាមៗឡើយ លុះត្រាតែមានការបញ្ជាក់ជាផ្លូវការ។
              </p>
            ) : (
              <p>
                Bulletins originate from automated detection algorithms and are subsequently reviewed by seismologists. Reported magnitudes (such as \(M_w\), \(M_b\), or \(M_L\)), focal depths, and exact epicentral coordinates are frequently revised following manual waveform analysis. A newly reported event does not imply immediate ground shaking in Cambodia unless officially documented.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">
              {kh ? "៣. មិនមែនជាប្រព័ន្ធព្យាករណ៍ ឬប្រកាសអាសន្នបន្ទាន់" : "3. Scientific Monitoring Disclaimer"}
            </h4>
            {kh ? (
              <p>
                ផ្ទាំងព័ត៌មានសាធារណៈនេះត្រូវបានរៀបចំឡើងសម្រាប់ការអប់រំ ការស្រាវជ្រាវ និងការយល់ដឹងផ្នែកវិទ្យាសាស្ត្រ។ <strong>នេះមិនមែនជាប្រព័ន្ធព្យាករណ៍ការរញ្ជួយដី ឬប្រព័ន្ធប្រកាសអាសន្នគ្រោះអាសន្នឡើយ។</strong> ការរញ្ជួយដីមិនអាចទាយទុកជាមុនបានទេ។ សម្រាប់ការណែនាំបន្ទាន់ ឬសេចក្តីជូនដំណឹងសុវត្ថិភាពសាធារណៈ សូមយោងតាមគណៈកម្មាធិការជាតិគ្រប់គ្រងគ្រោះមហន្តរាយ (NCDM) នៃព្រះរាជាណាចក្រកម្ពុជាជានិច្ច។
              </p>
            ) : (
              <p>
                This public dashboard is designed for educational, research, and scientific awareness. <strong>It is NOT an earthquake prediction system or emergency early-warning siren.</strong> Earthquakes cannot be predicted in advance. For immediate emergency guidance or civil safety advisories, always refer to the National Committee for Disaster Management (NCDM) of Cambodia.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">
              {kh ? "៤. ស្ថាប័នផ្ដល់ទិន្នន័យផ្លូវការ" : "4. Official Agency Portals"}
            </h4>
            <div className="space-y-1.5 text-xs">
              <a
                href="https://earthquakemap.live/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline block"
              >
                <ArrowUpRight size={13} /> {kh ? "Earthquake Map Live — ផែនទីតាមដានរញ្ជួយដីផ្ទាល់ (earthquakemap.live)" : "Earthquake Map Live — Track Earthquakes Today & Near Me (earthquakemap.live)"}
              </a>
              <a
                href="https://earthquake.usgs.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline block"
              >
                <ArrowUpRight size={13} /> {kh ? "កម្មវិធីគ្រោះថ្នាក់រញ្ជួយដី USGS (សហរដ្ឋអាមេរិក)" : "USGS Earthquake Hazards Program (United States)"}
              </a>
              <a
                href="https://news.ceic.ac.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline block"
              >
                <ArrowUpRight size={13} /> {kh ? "មជ្ឈមណ្ឌលបណ្តាញរញ្ជួយដីចិន — CENC / CEA (中国地震台网中心)" : "China Earthquake Networks Center — CENC / CEA (中国地震台网中心)"}
              </a>
              <a
                href="http://www.gddzj.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline block"
              >
                <ArrowUpRight size={13} /> {kh ? "រដ្ឋបាលរញ្ជួយដីក្វាងទុង (广东省地震局 · GDNET)" : "Guangdong Earthquake Administration (广东省地震局 · GDNET)"}
              </a>
              <a
                href="https://earthquake.tmd.go.th/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline block"
              >
                <ArrowUpRight size={13} /> {kh ? "ផ្នែកអង្កេតការរញ្ជួយដី TMD (ប្រទេសថៃ)" : "TMD Earthquake Observation Division (Thailand)"}
              </a>
              <a
                href="https://igp-vast.vn/index.php/en/earthquake-news"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline block"
              >
                <ArrowUpRight size={13} /> {kh ? "វិទ្យាស្ថានភូគព្ភរូបវិទ្យា — VAST (ប្រទេសវៀតណាម)" : "Institute of Geophysics — VAST (Vietnam)"}
              </a>
              <a
                href="https://earthquake.phivolcs.dost.gov.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline block"
              >
                <ArrowUpRight size={13} /> {kh ? "PHIVOLCS DOST (ប្រទេសហ្វីលីពីន)" : "PHIVOLCS DOST (Philippines)"}
              </a>
              <a
                href="https://www.data.jma.go.jp/multi/quake/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline block"
              >
                <ArrowUpRight size={13} /> {kh ? "ទីភ្នាក់ងារឧតុនិយមជប៉ុន — JMA (気象庁地震情報)" : "Japan Meteorological Agency — JMA (気象庁地震情報)"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
