/**
 * GeoCam Earthquake Monitoring Data Layer
 * Models, validation, filtering, source normalization, deduplication, and factual announcement formatting.
 */

export type ProviderName = "USGS" | "TMD" | "VIETNAM" | "PHIVOLCS";
export type ProviderStatus = "available" | "unavailable" | "loading" | "delayed";

export interface EarthquakeReport {
  provider: ProviderName;
  providerEventId: string;
  sourceUrl: string;
  magnitude?: number | null;
  magnitudeType?: string;
  depthKm?: number | null;
}

export interface EarthquakeEvent {
  id: string; // Stable GeoCam identifier
  originTime: string; // ISO 8601 UTC
  firstSeenAt: string; // Stable receipt time (not reset on every fetch)
  updatedAt?: string;
  latitude: number;
  longitude: number;
  depthKm: number | null;
  magnitude: number | null;
  magnitudeType?: string;
  location: string;
  reviewStatus?: string;
  reports: EarthquakeReport[];
}

export interface ProviderHealth {
  provider: ProviderName;
  name: string;
  status: ProviderStatus;
  officialUrl: string;
  lastChecked?: string;
  note?: string;
  eventCount?: number;
}

/**
 * Regional Bounding Box for Cambodia & Region:
 * Latitude: 5°N to 25°N
 * Longitude: 92°E to 112°E
 */
export const REGIONAL_BOUNDS = {
  minLat: 5.0,
  maxLat: 25.0,
  minLon: 92.0,
  maxLon: 112.0,
  labelEn: "Cambodia & region (5°–25°N, 92°–112°E)",
  labelKm: "កម្ពុជា និងតំបន់ជុំវិញ (5°–25°N, 92°–112°E)",
};

/**
 * Check if coordinates fall within the regional envelope
 */
export function isWithinRegionalEnvelope(lat: number, lon: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= REGIONAL_BOUNDS.minLat &&
    lat <= REGIONAL_BOUNDS.maxLat &&
    lon >= REGIONAL_BOUNDS.minLon &&
    lon <= REGIONAL_BOUNDS.maxLon
  );
}

/**
 * Haversine formula to compute great-circle distance in kilometers
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format timestamp to ICT (Indochina Time, UTC+7, Asia/Phnom_Penh)
 */
export function formatLocalIctTime(
  isoUtc: string,
  lang: "en" | "km" = "en",
  options?: { includeDate?: boolean; includeSeconds?: boolean }
): string {
  try {
    const date = new Date(isoUtc);
    if (isNaN(date.getTime())) return "—";

    const opts: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Phnom_Penh",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    if (options?.includeSeconds) {
      opts.second = "2-digit";
    }

    if (options?.includeDate !== false) {
      opts.year = "numeric";
      opts.month = "short";
      opts.day = "numeric";
    }

    return new Intl.DateTimeFormat(lang === "km" ? "km-KH" : "en-GB", opts).format(date);
  } catch {
    return isoUtc;
  }
}

/**
 * Generate factual, standardized announcement messages.
 * Template:
 * EN: M{magnitude} earthquake reported near {location} at {time} ICT on {date}. Depth: {depth} km. Source: {provider}.
 * KM: ការរញ្ជួយដីកម្រិត M{magnitude} ត្រូវបានរាយការណ៍នៅជិត {location} នៅម៉ោង {time} ICT ថ្ងៃទី {date}។ ជម្រៅ៖ {depth} គ.ម។ ប្រភព៖ {provider}។
 */
export function generateEventAnnouncement(
  event: EarthquakeEvent,
  lang: "en" | "km" = "en"
): string {
  const magStr =
    event.magnitude !== null && event.magnitude !== undefined
      ? event.magnitude.toFixed(1)
      : "—";

  const providerNames = event.reports.map((r) => r.provider).join(" / ") || "USGS";

  const depthStr =
    event.depthKm !== null && event.depthKm !== undefined
      ? `${event.depthKm.toFixed(0)} km`
      : "depth unconfirmed";

  const depthStrKm =
    event.depthKm !== null && event.depthKm !== undefined
      ? `${event.depthKm.toFixed(0)} គ.ម`
      : "ជម្រៅមិនទាន់បញ្ជាក់";

  const date = new Date(event.originTime);
  const timeIct = isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Phnom_Penh",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);

  const dateIct = isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Phnom_Penh",
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);

  const dateIctKm = isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("km-KH", {
        timeZone: "Asia/Phnom_Penh",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);

  if (lang === "km") {
    return `ការរញ្ជួយដីកម្រិត M${magStr} ត្រូវបានរាយការណ៍នៅជិត ${event.location} នៅម៉ោង ${timeIct} ICT ថ្ងៃទី ${dateIctKm}។ ជម្រៅ៖ ${depthStrKm}។ ប្រភព៖ ${providerNames}។`;
  }

  return `M${magStr} earthquake reported near ${event.location} at ${timeIct} ICT on ${dateIct}. Depth: ${depthStr}. Source: ${providerNames}.`;
}

/**
 * Normalize USGS GeoJSON feature into normalized EarthquakeEvent
 */
export function normalizeUsgsFeature(feature: any): EarthquakeEvent | null {
  if (!feature || !feature.geometry || !feature.properties) return null;
  const [lon, lat, depth] = feature.geometry.coordinates || [];

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const originTime = feature.properties.time
    ? new Date(feature.properties.time).toISOString()
    : new Date().toISOString();

  const id = `usgs-${feature.id || Math.abs(lat + lon)}`;

  return {
    id,
    originTime,
    firstSeenAt: originTime,
    updatedAt: feature.properties.updated ? new Date(feature.properties.updated).toISOString() : undefined,
    latitude: lat,
    longitude: lon,
    depthKm: Number.isFinite(depth) ? depth : null,
    magnitude: Number.isFinite(feature.properties.mag) ? feature.properties.mag : null,
    magnitudeType: feature.properties.magType || "M",
    location: (feature.properties.place || "Regional epicenter").trim(),
    reviewStatus: feature.properties.status || "automatic",
    reports: [
      {
        provider: "USGS",
        providerEventId: feature.id,
        sourceUrl: feature.properties.url || `https://earthquake.usgs.gov/earthquakes/eventpage/${feature.id}`,
        magnitude: feature.properties.mag,
        magnitudeType: feature.properties.magType,
        depthKm: Number.isFinite(depth) ? depth : null,
      },
    ],
  };
}

/**
 * Parse TMD RSS XML item or text (robust against missing tags)
 */
export function parseTmdXml(xmlText: string): EarthquakeEvent[] {
  const events: EarthquakeEvent[] = [];
  if (!xmlText || typeof xmlText !== "string") return events;

  // Simple and regex-based RSS item parser (browser and node safe without DOM parser dependency)
  const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/gi) || [];

  for (const itemXml of itemMatches) {
    try {
      const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/i);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
      const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/i);
      const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
      const latMatch = itemXml.match(/<geo:lat>([\s\S]*?)<\/geo:lat>/i) || itemXml.match(/latitude[:\s]+([0-9.-]+)/i);
      const lonMatch = itemXml.match(/<geo:long>([\s\S]*?)<\/geo:long>/i) || itemXml.match(/longitude[:\s]+([0-9.-]+)/i);

      const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";
      const desc = descMatch ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";
      const link = linkMatch ? linkMatch[1].trim() : "https://earthquake.tmd.go.th/";
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : "";

      let lat = latMatch ? parseFloat(latMatch[1]) : NaN;
      let lon = lonMatch ? parseFloat(lonMatch[1]) : NaN;

      // Extract magnitude from title or description (e.g. "Magnitude 3.5" or "ขนาด 3.5")
      let mag: number | null = null;
      const magMatch = (title + " " + desc).match(/magnitude[:\s]+([0-9.]+)/i) || (title + " " + desc).match(/ขนาด\s*([0-9.]+)/i);
      if (magMatch) mag = parseFloat(magMatch[1]);

      // Extract depth if present (e.g. "Depth 10 km" or "ลึก 10 กม.")
      let depth: number | null = null;
      const depthMatch = (title + " " + desc).match(/depth[:\s]+([0-9.]+)/i) || (title + " " + desc).match(/ลึก\s*([0-9.]+)/i);
      if (depthMatch) depth = parseFloat(depthMatch[1]);

      let originTime = new Date().toISOString();
      if (pubDate) {
        const d = new Date(pubDate);
        if (!isNaN(d.getTime())) originTime = d.toISOString();
      }

      if (Number.isFinite(lat) && Number.isFinite(lon) && isWithinRegionalEnvelope(lat, lon)) {
        const cleanTitle = title.replace(/^Earthquake\s*/i, "").trim() || "Regional epicenter";
        const id = `tmd-${lat.toFixed(3)}-${lon.toFixed(3)}-${originTime.slice(0, 16)}`;

        events.push({
          id,
          originTime,
          firstSeenAt: originTime,
          latitude: lat,
          longitude: lon,
          depthKm: depth,
          magnitude: mag,
          magnitudeType: "mb",
          location: cleanTitle,
          reviewStatus: "preliminary",
          reports: [
            {
              provider: "TMD",
              providerEventId: id,
              sourceUrl: link,
              magnitude: mag,
              depthKm: depth,
            },
          ],
        });
      }
    } catch {
      // Continue parsing remaining items
    }
  }

  return events;
}

/**
 * Deduplicate events across providers.
 * Tolerance: Origin time within 60 seconds AND epicenter distance < 30 km.
 * When matching, merges reports array and retains preferred display values.
 */
export function deduplicateEvents(events: EarthquakeEvent[]): EarthquakeEvent[] {
  const sorted = [...events].sort(
    (a, b) => new Date(b.originTime).getTime() - new Date(a.originTime).getTime()
  );

  const deduplicated: EarthquakeEvent[] = [];

  for (const candidate of sorted) {
    const candidateTime = new Date(candidate.originTime).getTime();

    const existingMatch = deduplicated.find((existing) => {
      const existingTime = new Date(existing.originTime).getTime();
      const timeDiffSeconds = Math.abs(candidateTime - existingTime) / 1000;
      if (timeDiffSeconds > 60) return false;

      const distKm = haversineDistanceKm(
        existing.latitude,
        existing.longitude,
        candidate.latitude,
        candidate.longitude
      );
      return distKm <= 30;
    });

    if (existingMatch) {
      // Merge candidate report into existing match without creating duplicate report entries
      for (const rep of candidate.reports) {
        if (!existingMatch.reports.some((r) => r.provider === rep.provider && r.providerEventId === rep.providerEventId)) {
          existingMatch.reports.push(rep);
        }
      }
      // If existing had null depth or magnitude, backfill from candidate
      if (existingMatch.depthKm === null && candidate.depthKm !== null) {
        existingMatch.depthKm = candidate.depthKm;
      }
      if (existingMatch.magnitude === null && candidate.magnitude !== null) {
        existingMatch.magnitude = candidate.magnitude;
      }
    } else {
      deduplicated.push({ ...candidate, reports: [...candidate.reports] });
    }
  }

  return deduplicated;
}

/**
 * Filter events by time window (hours) and minimum magnitude
 */
export function filterEarthquakes(
  events: EarthquakeEvent[],
  options: {
    hoursWindow?: number; // 24, 168 (7d), 720 (30d)
    minMagnitude?: number; // 0, 2, 3, 4, 5
    sortOrder?: "newest" | "largest";
    providerFilter?: string; // "all", "USGS", "TMD"
  }
): EarthquakeEvent[] {
  const now = Date.now();
  const windowMs = (options.hoursWindow ?? 168) * 3600 * 1000;
  const minMag = options.minMagnitude ?? 0;

  return events
    .filter((e) => {
      // Time window check
      const eventTime = new Date(e.originTime).getTime();
      if (now - eventTime > windowMs) return false;

      // Minimum magnitude check (treat null as 0 if minMag is 0, otherwise filter out)
      const mag = e.magnitude ?? 0;
      if (mag < minMag) return false;

      // Regional bounds check
      if (!isWithinRegionalEnvelope(e.latitude, e.longitude)) return false;

      // Provider filter check
      if (options.providerFilter && options.providerFilter !== "all") {
        if (!e.reports.some((r) => r.provider === options.providerFilter)) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (options.sortOrder === "largest") {
        const magA = a.magnitude ?? -999;
        const magB = b.magnitude ?? -999;
        if (magB !== magA) return magB - magA;
      }
      return new Date(b.originTime).getTime() - new Date(a.originTime).getTime();
    });
}
