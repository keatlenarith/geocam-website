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

const CAMBODIA_CENTER = { latitude: 12.5657, longitude: 104.991 };

function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
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

function formatDistance(distKm: number, lat: number, lon: number): string {
  const rounded = Math.round(distKm);
  if (rounded < 100) return "Within Cambodia (នៅក្នុងប្រទេសកម្ពុជា)";

  const dLat = lat - CAMBODIA_CENTER.latitude;
  const dLon = lon - CAMBODIA_CENTER.longitude;
  const angle = (Math.atan2(dLon, dLat) * 180) / Math.PI;
  const normalized = (angle + 360) % 360;

  let dirEn = "North";
  let dirKm = "ទិសខាងជើង";
  if (normalized >= 337.5 || normalized < 22.5) {
    dirEn = "North";
    dirKm = "ទិសខាងជើង";
  } else if (normalized < 67.5) {
    dirEn = "Northeast";
    dirKm = "ទិសឦសាន";
  } else if (normalized < 112.5) {
    dirEn = "East";
    dirKm = "ទិសខាងកើត";
  } else if (normalized < 157.5) {
    dirEn = "Southeast";
    dirKm = "ទិសអាគ្នេយ៍";
  } else if (normalized < 202.5) {
    dirEn = "South";
    dirKm = "ទិសខាងត្បូង";
  } else if (normalized < 247.5) {
    dirEn = "Southwest";
    dirKm = "ទិសនិរតី";
  } else if (normalized < 292.5) {
    dirEn = "West";
    dirKm = "ទិសខាងលិច";
  } else {
    dirEn = "Northwest";
    dirKm = "ទិសពាយ័ព្យ";
  }

  return `~${rounded} km from Cambodia (${dirEn} / ${dirKm})`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const eventId = (req.query.id as string) || (req.query.event as string) || "";
  const userAgent = req.headers["user-agent"] || "";
  const isCrawler = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|TelegramBot|WhatsApp/i.test(
    userAgent
  );

  const targetAppUrl = `https://geocam.site/earthquake-monitoring${
    eventId ? `?event=${encodeURIComponent(eventId)}` : ""
  }`;

  // If normal browser user arrives directly at this share URL, redirect to app
  if (!isCrawler && !req.query.preview) {
    return res.redirect(302, targetAppUrl);
  }

  // Fetch event details from internal earthquake feed
  let event: any = null;
  try {
    const siteUrl = "https://geocam.site";
    const eqRes = await fetch(`${siteUrl}/api/earthquakes?window=7d`);
    if (eqRes.ok) {
      const data = await eqRes.json();
      event = (data.events || []).find((e: any) => e.id === eventId);
    }
  } catch {}

  // Fallback if event is not found in 7d feed
  const mag = event?.magnitude ? `M ${Number(event.magnitude).toFixed(1)}` : "Earthquake Alert";
  const place = event?.location || "Regional Southeast Asia";
  const depth = event?.depthKm !== null && event?.depthKm !== undefined ? `${event.depthKm} km` : "Unknown depth";

  let distanceStr = "Southeast Asia Region";
  let mapImageUrl = "https://geocam.site/images/geohazards/figure-01-regional-seismicity.png";

  if (event && event.latitude && event.longitude) {
    const dist = haversineDistanceKm(
      CAMBODIA_CENTER.latitude,
      CAMBODIA_CENTER.longitude,
      event.latitude,
      event.longitude
    );
    distanceStr = formatDistance(dist, event.latitude, event.longitude);

    // Static Map snapshot centered on epicenter
    mapImageUrl = `https://static-maps.yandex.ru/1.x/?ll=${event.longitude},${event.latitude}&z=6&l=map&size=650,400&pt=${event.longitude},${event.latitude},pm2rdm`;
  }

  const dateObj = event?.originTime ? new Date(event.originTime) : new Date();
  const timeIct = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Phnom_Penh",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dateObj);

  const title = `🚨 [BULLETIN] ${mag} - ${place} · GeoCam Cambodia`;
  const description = `${mag} Earthquake reported near ${place} (${distanceStr}) at ${timeIct} ICT. Focal depth: ${depth}. Interactive 3D seismic monitoring & tectonic fault lines on GeoCam Cambodia.`;

  // Render Open Graph & Twitter Cards HTML
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="GeoCam — Geosciences Society of Cambodia">
  <meta property="og:url" content="${targetAppUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${mapImageUrl}">
  <meta property="og:image:width" content="650">
  <meta property="og:image:height" content="400">
  <meta property="og:image:alt" content="Earthquake Epicenter Map and Fault Boundaries - ${place}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${mapImageUrl}">
  
  <!-- Automatic client redirect for humans -->
  <meta http-equiv="refresh" content="0;url=${targetAppUrl}">
  <script>window.location.replace(${JSON.stringify(targetAppUrl)});</script>
</head>
<body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; text-align: center;">
  <h2>${title}</h2>
  <p>${description}</p>
  <p><a href="${targetAppUrl}" style="color: #38bdf8;">Click here to open live 3D Earthquake Monitor & Tectonic Map ↗</a></p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).send(html);
}
