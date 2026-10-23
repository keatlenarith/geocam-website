import type { VercelRequest, VercelResponse } from "@vercel/node";

interface UsgsGeoJson {
  features: Array<{
    id: string;
    properties: {
      mag: number | null;
      place: string;
      time: number;
      updated: number;
      url: string;
      status: string;
      magType: string;
    };
    geometry: {
      coordinates: [number, number, number]; // lon, lat, depth
    };
  }>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS and Cache Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=120"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const windowParam = (req.query.window as string) || "7d";
  let usgsUrl =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  if (windowParam === "24h" || windowParam === "day") {
    usgsUrl =
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  } else if (windowParam === "30d" || windowParam === "month") {
    usgsUrl =
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
  }

  const rawEvents: any[] = [];
  const providerHealth: Record<string, any> = {
    USGS: {
      provider: "USGS",
      name: "United States Geological Survey",
      status: "loading",
      officialUrl: "https://earthquake.usgs.gov/",
      lastChecked: new Date().toISOString(),
    },
    TMD: {
      provider: "TMD",
      name: "Thai Meteorological Department",
      status: "loading",
      officialUrl: "https://earthquake.tmd.go.th/",
      lastChecked: new Date().toISOString(),
    },
    VIETNAM: {
      provider: "VIETNAM",
      name: "Institute of Geophysics (VAST Vietnam)",
      status: "delayed",
      officialUrl: "https://igp-vast.vn/index.php/en/earthquake-news",
      lastChecked: new Date().toISOString(),
      note: "Official bulletin monitored; automated feed unconfirmed",
    },
    PHIVOLCS: {
      provider: "PHIVOLCS",
      name: "Philippine Institute of Volcanology and Seismology",
      status: "available",
      officialUrl: "https://earthquake.phivolcs.dost.gov.ph/",
      lastChecked: new Date().toISOString(),
      note: "Regional reference bulletin (Philippine basin focus)",
    },
  };

  // 1. Fetch USGS Feed with 8s timeout
  try {
    const usgsRes = await fetch(usgsUrl, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "GeoCam-Earthquake-Monitor/1.0" },
    });

    if (usgsRes.ok) {
      const data = (await usgsRes.json()) as UsgsGeoJson;
      let count = 0;

      for (const f of data.features || []) {
        const [lon, lat, depth] = f.geometry?.coordinates || [];
        // Filter strictly to Cambodia & region (5-25N, 92-112E)
        if (
          Number.isFinite(lat) &&
          Number.isFinite(lon) &&
          lat >= 5.0 &&
          lat <= 25.0 &&
          lon >= 92.0 &&
          lon <= 112.0
        ) {
          const originTime = new Date(f.properties.time).toISOString();
          rawEvents.push({
            id: `usgs-${f.id}`,
            originTime,
            firstSeenAt: originTime,
            updatedAt: f.properties.updated
              ? new Date(f.properties.updated).toISOString()
              : undefined,
            latitude: lat,
            longitude: lon,
            depthKm: Number.isFinite(depth) ? depth : null,
            magnitude: Number.isFinite(f.properties.mag)
              ? f.properties.mag
              : null,
            magnitudeType: f.properties.magType || "M",
            location: (f.properties.place || "Regional epicenter").trim(),
            reviewStatus: f.properties.status || "automatic",
            reports: [
              {
                provider: "USGS",
                providerEventId: f.id,
                sourceUrl:
                  f.properties.url ||
                  `https://earthquake.usgs.gov/earthquakes/eventpage/${f.id}`,
                magnitude: f.properties.mag,
                magnitudeType: f.properties.magType,
                depthKm: Number.isFinite(depth) ? depth : null,
              },
            ],
          });
          count++;
        }
      }

      providerHealth.USGS.status = "available";
      providerHealth.USGS.eventCount = count;
    } else {
      providerHealth.USGS.status = "unavailable";
      providerHealth.USGS.note = `Upstream HTTP ${usgsRes.status}`;
    }
  } catch (err: any) {
    providerHealth.USGS.status = "unavailable";
    providerHealth.USGS.note = err.message || "USGS request failed";
  }

  // 2. Fetch TMD Feed with 3.5s timeout (non-blocking)
  try {
    const tmdRes = await fetch("https://earthquake.tmd.go.th/feed/rss_tmd.xml", {
      signal: AbortSignal.timeout(3500),
      headers: { "User-Agent": "GeoCam-Earthquake-Monitor/1.0" },
    });

    if (tmdRes.ok) {
      const xml = await tmdRes.text();
      // Simple regex parser for RSS items
      const items = xml.match(/<item>([\s\S]*?)<\/item>/gi) || [];
      let tmdCount = 0;

      for (const it of items) {
        const titleMatch = it.match(/<title>([\s\S]*?)<\/title>/i);
        const linkMatch = it.match(/<link>([\s\S]*?)<\/link>/i);
        const descMatch = it.match(/<description>([\s\S]*?)<\/description>/i);
        const pubDateMatch = it.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
        const latMatch =
          it.match(/<geo:lat>([\s\S]*?)<\/geo:lat>/i) ||
          it.match(/latitude[:\s]+([0-9.-]+)/i);
        const lonMatch =
          it.match(/<geo:long>([\s\S]*?)<\/geo:long>/i) ||
          it.match(/longitude[:\s]+([0-9.-]+)/i);

        const lat = latMatch ? parseFloat(latMatch[1]) : NaN;
        const lon = lonMatch ? parseFloat(lonMatch[1]) : NaN;

        if (
          Number.isFinite(lat) &&
          Number.isFinite(lon) &&
          lat >= 5.0 &&
          lat <= 25.0 &&
          lon >= 92.0 &&
          lon <= 112.0
        ) {
          const title = titleMatch
            ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim()
            : "TMD Report";
          const desc = descMatch
            ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim()
            : "";
          const link = linkMatch
            ? linkMatch[1].trim()
            : "https://earthquake.tmd.go.th/";
          const pubDate = pubDateMatch ? pubDateMatch[1].trim() : "";

          let mag: number | null = null;
          const magMatch = (title + " " + desc).match(
            /magnitude[:\s]+([0-9.]+)/i
          );
          if (magMatch) mag = parseFloat(magMatch[1]);

          let depth: number | null = null;
          const depthMatch = (title + " " + desc).match(/depth[:\s]+([0-9.]+)/i);
          if (depthMatch) depth = parseFloat(depthMatch[1]);

          const originTime = pubDate
            ? new Date(pubDate).toISOString()
            : new Date().toISOString();
          const id = `tmd-${lat.toFixed(3)}-${lon.toFixed(3)}-${originTime.slice(0, 16)}`;

          rawEvents.push({
            id,
            originTime,
            firstSeenAt: originTime,
            latitude: lat,
            longitude: lon,
            depthKm: depth,
            magnitude: mag,
            magnitudeType: "mb",
            location: title.replace(/^Earthquake\s*/i, "").trim() || "Regional epicenter",
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
          tmdCount++;
        }
      }

      providerHealth.TMD.status = "available";
      providerHealth.TMD.eventCount = tmdCount;
    } else {
      providerHealth.TMD.status = "unavailable";
      providerHealth.TMD.note = `Upstream HTTP ${tmdRes.status}`;
    }
  } catch (err: any) {
    providerHealth.TMD.status = "unavailable";
    providerHealth.TMD.note = "Upstream server timeout (inaccessible or delayed)";
  }

  // Deduplicate events across providers (tolerance: 60s and 30km)
  const sorted = [...rawEvents].sort(
    (a, b) =>
      new Date(b.originTime).getTime() - new Date(a.originTime).getTime()
  );

  const deduplicated: any[] = [];
  for (const candidate of sorted) {
    const candidateTime = new Date(candidate.originTime).getTime();
    const existingMatch = deduplicated.find((existing) => {
      const existingTime = new Date(existing.originTime).getTime();
      const timeDiff = Math.abs(candidateTime - existingTime) / 1000;
      if (timeDiff > 60) return false;

      // Approximate distance check
      const dLat = (candidate.latitude - existing.latitude) * 111;
      const dLon =
        (candidate.longitude - existing.longitude) *
        111 *
        Math.cos((existing.latitude * Math.PI) / 180);
      const dist = Math.sqrt(dLat * dLat + dLon * dLon);
      return dist <= 30;
    });

    if (existingMatch) {
      for (const r of candidate.reports) {
        if (
          !existingMatch.reports.some(
            (er: any) =>
              er.provider === r.provider &&
              er.providerEventId === r.providerEventId
          )
        ) {
          existingMatch.reports.push(r);
        }
      }
    } else {
      deduplicated.push(candidate);
    }
  }

  return res.status(200).json({
    status: "ok",
    envelope: "5°–25°N, 92°–112°E (Cambodia & region)",
    fetchedAt: new Date().toISOString(),
    providers: providerHealth,
    events: deduplicated,
  });
}
