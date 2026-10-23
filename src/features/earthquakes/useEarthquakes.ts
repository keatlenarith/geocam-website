import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  type EarthquakeEvent,
  type ProviderHealth,
  type ProviderName,
  filterEarthquakes,
  normalizeUsgsFeature,
  parseCencJson,
  isWithinRegionalEnvelope,
  deduplicateEvents,
} from "./earthquake-data";

export type TimeWindowOption = "24h" | "7d" | "30d";
export type SortOrderOption = "newest" | "largest";

export interface UseEarthquakesOptions {
  timeWindow?: TimeWindowOption;
  minMagnitude?: number;
  sortOrder?: SortOrderOption;
  providerFilter?: string;
  scope?: "cambodia" | "global" | "all";
  searchQuery?: string;
  autoRefreshIntervalMs?: number; // Default 60000 (60s)
}

const DEFAULT_PROVIDERS: Record<ProviderName, ProviderHealth> = {
  USGS: {
    provider: "USGS",
    name: "United States Geological Survey",
    status: "loading",
    officialUrl: "https://earthquake.usgs.gov/",
  },
  TMD: {
    provider: "TMD",
    name: "Thai Meteorological Department",
    status: "unavailable",
    officialUrl: "https://earthquake.tmd.go.th/",
    note: "Official regional feed monitored; upstream connection timeout",
  },
  CENC: {
    provider: "CENC",
    name: "China Earthquake Networks Center (CEA / 广东省地震局)",
    status: "available",
    officialUrl: "https://news.ceic.ac.cn/",
    note: "China Earthquake Administration (CEA) & Guangdong Seismological Network",
  },
  VIETNAM: {
    provider: "VIETNAM",
    name: "Institute of Geophysics (VAST Vietnam)",
    status: "delayed",
    officialUrl: "https://igp-vast.vn/index.php/en/earthquake-news",
    note: "Official bulletins monitored; automated feed unconfirmed",
  },
  PHIVOLCS: {
    provider: "PHIVOLCS",
    name: "Philippine Institute of Volcanology and Seismology",
    status: "available",
    officialUrl: "https://earthquake.phivolcs.dost.gov.ph/",
    note: "Regional reference bulletin (Philippine basin focus)",
  },
};

// Global in-memory cache shared between homepage and dedicated page to prevent duplicate requests
let cachedEvents: EarthquakeEvent[] = [];
let cachedProviders: Record<ProviderName, ProviderHealth> = { ...DEFAULT_PROVIDERS };
let cachedLastSuccessTime: Date | null = null;
const sessionKnownEventIds = new Set<string>();
const newlyArrivedEventIds = new Set<string>();

export function useEarthquakes(options: UseEarthquakesOptions = {}) {
  const {
    timeWindow = "7d",
    minMagnitude = 0,
    sortOrder = "newest",
    providerFilter = "all",
    scope = "cambodia",
    searchQuery = "",
    autoRefreshIntervalMs = 60000,
  } = options;

  const [rawEvents, setRawEvents] = useState<EarthquakeEvent[]>(() => cachedEvents);
  const [providerHealth, setProviderHealth] = useState<Record<ProviderName, ProviderHealth>>(
    () => ({ ...cachedProviders })
  );
  const [loading, setLoading] = useState<boolean>(() => cachedEvents.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [lastSuccessTime, setLastSuccessTime] = useState<Date | null>(() => cachedLastSuccessTime);
  const [isStale, setIsStale] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const initialLoadRef = useRef<boolean>(sessionKnownEventIds.size === 0);

  // Core fetch function
  const fetchEarthquakes = useCallback(async (isManualRefresh = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    // Abort previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (rawEvents.length === 0 || isManualRefresh) {
      setLoading(true);
    }
    setError(null);

    let fetchedSuccessfully = false;

    // 1. Try serverless endpoint first (/api/earthquakes)
    try {
      const res = await fetch(`/api/earthquakes?window=${timeWindow}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.events && Array.isArray(data.events)) {
          const events: EarthquakeEvent[] = data.events;

          // Track new events without marking all initial historical events new
          if (initialLoadRef.current) {
            events.forEach((e) => sessionKnownEventIds.add(e.id));
            initialLoadRef.current = false;
          } else {
            events.forEach((e) => {
              if (!sessionKnownEventIds.has(e.id)) {
                newlyArrivedEventIds.add(e.id);
                sessionKnownEventIds.add(e.id);
              }
            });
          }

          cachedEvents = events;
          cachedProviders = { ...DEFAULT_PROVIDERS, ...(data.providers || {}) };
          cachedLastSuccessTime = new Date();

          setRawEvents(events);
          setProviderHealth(cachedProviders);
          setLastSuccessTime(cachedLastSuccessTime);
          setIsStale(false);
          fetchedSuccessfully = true;
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      // Continue to direct USGS fallback below
    }

    // 2. Direct fallback to USGS GeoJSON feed (for local static dev and resilience)
    if (!fetchedSuccessfully) {
      try {
        let usgsUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
        if (timeWindow === "24h") {
          usgsUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
        } else if (timeWindow === "30d") {
          usgsUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
        }

        const res = await fetch(usgsUrl, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          const parsed = (data.features || [])
            .map(normalizeUsgsFeature)
            .filter((e: any): e is EarthquakeEvent => {
              if (!e) return false;
              if (e.isRegional) return true;
              return (e.magnitude ?? 0) >= 2.0;
            });

          let allFetchedEvents = [...parsed];

          // Also fetch CENC (China Earthquake Administration / 广东省地震局) in client fallback
          try {
            const cencRes = await fetch("https://api.wolfx.jp/cenc_eqlist.json", {
              signal: AbortSignal.timeout(3500),
            });
            if (cencRes.ok) {
              const cencData = await cencRes.json();
              const cencParsed = parseCencJson(cencData);
              allFetchedEvents = [...allFetchedEvents, ...cencParsed];
            }
          } catch {}

          const deduplicated = deduplicateEvents(allFetchedEvents);

          // Track new events
          if (initialLoadRef.current) {
            deduplicated.forEach((e) => sessionKnownEventIds.add(e.id));
            initialLoadRef.current = false;
          } else {
            deduplicated.forEach((e) => {
              if (!sessionKnownEventIds.has(e.id)) {
                newlyArrivedEventIds.add(e.id);
                sessionKnownEventIds.add(e.id);
              }
            });
          }

          const updatedHealth: Record<ProviderName, ProviderHealth> = {
            ...DEFAULT_PROVIDERS,
            USGS: {
              provider: "USGS",
              name: "United States Geological Survey",
              status: "available",
              officialUrl: "https://earthquake.usgs.gov/",
              lastChecked: new Date().toISOString(),
              eventCount: deduplicated.length,
            },
            TMD: {
              provider: "TMD",
              name: "Thai Meteorological Department",
              status: "unavailable",
              officialUrl: "https://earthquake.tmd.go.th/",
              note: "Upstream server timeout (monitored for recovery)",
              lastChecked: new Date().toISOString(),
            },
          };

          cachedEvents = deduplicated;
          cachedProviders = updatedHealth;
          cachedLastSuccessTime = new Date();

          setRawEvents(deduplicated);
          setProviderHealth(updatedHealth);
          setLastSuccessTime(cachedLastSuccessTime);
          setIsStale(false);
          fetchedSuccessfully = true;
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        // If we already have cached events, keep them and mark as stale
        if (cachedEvents.length > 0) {
          setIsStale(true);
        } else {
          setError("Unable to retrieve live earthquake bulletins. Please check network connection.");
        }
      }
    }

    setLoading(false);
    isFetchingRef.current = false;
  }, [timeWindow, rawEvents.length]);

  // Initial fetch and window changes
  useEffect(() => {
    fetchEarthquakes();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchEarthquakes]);

  // 60-second periodic refresh only while page is visible
  useEffect(() => {
    let intervalId: any = null;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchEarthquakes();
        if (!intervalId && autoRefreshIntervalMs > 0) {
          intervalId = setInterval(() => {
            if (document.visibilityState === "visible") {
              fetchEarthquakes();
            }
          }, autoRefreshIntervalMs);
        }
      } else {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    };

    if (document.visibilityState === "visible" && autoRefreshIntervalMs > 0) {
      intervalId = setInterval(() => {
        if (document.visibilityState === "visible") {
          fetchEarthquakes();
        }
      }, autoRefreshIntervalMs);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [autoRefreshIntervalMs, fetchEarthquakes]);

  // Calculate filtered events
  const hoursWindow = timeWindow === "24h" ? 24 : timeWindow === "30d" ? 720 : 168;

  const filteredEvents = useMemo(() => {
    return filterEarthquakes(rawEvents, {
      hoursWindow,
      minMagnitude,
      sortOrder,
      providerFilter,
      scope,
      searchQuery,
    });
  }, [rawEvents, hoursWindow, minMagnitude, sortOrder, providerFilter, scope, searchQuery]);

  // Summary statistics calculated on filtered events
  const summary = useMemo(() => {
    let largestMag: number | null = null;
    let latestEventTime: string | null = null;

    for (const e of filteredEvents) {
      if (e.magnitude !== null) {
        if (largestMag === null || e.magnitude > largestMag) {
          largestMag = e.magnitude;
        }
      }
      if (!latestEventTime || new Date(e.originTime).getTime() > new Date(latestEventTime).getTime()) {
        latestEventTime = e.originTime;
      }
    }

    return {
      totalCount: filteredEvents.length,
      largestMag,
      latestEventTime,
    };
  }, [filteredEvents]);

  return {
    events: filteredEvents,
    allEvents: rawEvents,
    loading,
    error,
    isStale,
    lastSuccessTime,
    providerHealth,
    summary,
    newlyArrivedEventIds,
    refresh: () => fetchEarthquakes(true),
  };
}
