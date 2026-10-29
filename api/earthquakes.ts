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


/**
 * Sanitize raw location from TMD or regional RSS feeds.
 * Guarantees zero Thai or Lao script reaches the client.
 */
function sanitizeTmdLocation(raw: string): string {
  if (!raw) return "Regional epicenter";
  let text = raw.replace(/^Earthquake\s*/i, "").trim();

  // Extract English from parenthesis if present e.g. "ประเทศเมียนมา (Myanmar)"
  const parenMatch = text.match(/\(([^)]+)\)/);
  const englishParen = parenMatch ? parenMatch[1].trim() : null;

  // Dictionary replacements
  const rules = [
    [/(?:ทาง)?ทิศตะวันตกเฉียงใต้ของ/g, "SW of "],
    [/(?:ทาง)?ทิศตะวันตกเฉียงเหนือของ/g, "NW of "],
    [/(?:ทาง)?ทิศตะวันออกเฉียงใต้ของ/g, "SE of "],
    [/(?:ทาง)?ทิศตะวันออกเฉียงเหนือของ/g, "NE of "],
    [/(?:ทาง)?ทิศเหนือของ/g, "N of "],
    [/(?:ทาง)?ทิศใต้ของ/g, "S of "],
    [/(?:ทาง)?ทิศตะวันออกของ/g, "E of "],
    [/(?:ทาง)?ทิศตะวันตกของ/g, "W of "],
    [/นอกชายฝั่ง/g, "Off coast of "],
    [/ชายฝั่ง/g, "Coast of "],
    [/พรมแดน/g, "Border region of "],
    [/ประเทศเมียนมา|เมียนมา|พม่า|ປະເທດມຽນມາ|ມຽນມາ/g, "Myanmar"],
    [/ประเทศลาว|สปป\.ลาว|ลาว|ປະເທດລາວ|ສປປ\.ລາວ|ລາວ/g, "Laos"],
    [/ประเทศไทย|ไทย|ປະເທດໄທ|ໄທ/g, "Thailand"],
    [/ประเทศเวียดนาม|เวียดนาม|ປະເທດຫວຽດນາມ|ຫວຽດນາມ/g, "Vietnam"],
    [/ประเทศจีน|จีน|ປະເທດຈີນ|ຈີນ/g, "China"],
    [/ประเทศกัมพูชา|กัมพูชา|ປະເທດກຳປູເຈຍ|ກຳປູເຈຍ/g, "Cambodia"],
    [/ประเทศอินโดนีเซีย|อินโดนีเซีย/g, "Indonesia"],
    [/ประเทศฟิลิปปินส์|ฟิลิปปินส์/g, "Philippines"],
    [/ประเทศมาเลเซีย|มาเลเซีย/g, "Malaysia"],
    [/ประเทศอินเดีย|อินเดีย/g, "India"],
    [/หมู่เกาะอันดามัน|เกาะอันดามัน/g, "Andaman Islands"],
    [/ทะเลอันดามัน/g, "Andaman Sea"],
    [/อ่าวเบงกอล/g, "Bay of Bengal"],
    [/แขวงบ่อแก้ว|ບໍ່ແກ້ວ|บ่อแก้ว/g, "Bokeo Province, Laos"],
    [/แขวงไชยบุรี|แขวงไซยะบูลี|แขวงไชยบูลี|ໄຊຍະບູລີ|ไชยบุรี|ไซยะบูลี/g, "Xayabury Province, Laos"],
    [/แขวงหลวงพระบาง|หลวงพระบาง/g, "Luang Prabang Province, Laos"],
    [/แขวงอุดมไซ|ອຸດົມໄຊ|อุดมไซ/g, "Oudomxay Province, Laos"],
    [/แขวงพงสาลี|ຜົ້ງສາລີ|พงสาลี/g, "Phongsaly Province, Laos"],
    [/แขวงหลวงน้ำทา|ຫຼວງນ້ຳທາ|หลวงน้ำทา/g, "Luang Namtha Province, Laos"],
    [/แขวงหัวพัน|ຫົວພັນ|หัวพัน/g, "Houaphanh Province, Laos"],
    [/แขวงเวียงจันทน์|ວຽງຈັນ|เวียงจันทน์/g, "Vientiane Province, Laos"],
    [/แขวงคำม่วน|ຄຳມ່ວນ|คำม่วน/g, "Khammouane Province, Laos"],
    [/แขวงสะหวันนะเขต|ສະຫວັນນະເຂດ|สะหวันนะเขต/g, "Savannakhet Province, Laos"],
    [/แขวงจำปาศักดิ์|ຈຳປາສັກ|จำปาศักดิ์/g, "Champasak Province, Laos"],
    [/รัฐฉาน/g, "Shan State, Myanmar"],
    [/รัฐกะฉิ่น/g, "Kachin State, Myanmar"],
    [/แม่ฮ่องสอน/g, "Mae Hong Son"],
    [/เชียงใหม่/g, "Chiang Mai"],
    [/เชียงราย/g, "Chiang Rai"],
    [/ลำปาง/g, "Lampang"],
    [/ลำพูน/g, "Lamphun"],
    [/แพร่/g, "Phrae"],
    [/น่าน/g, "Nan"],
    [/พะเยา/g, "Phayao"],
    [/ตาก/g, "Tak"],
    [/พิษณุโลก/g, "Phitsanulok"],
    [/กาญจนบุรี/g, "Kanchanaburi"],
    [/ปาย/g, "Pai"],
    [/สันทราย/g, "San Sai"],
    [/แม่แตง/g, "Mae Taeng"],
    [/แม่ริม/g, "Mae Rim"],
    [/แม่สรวย/g, "Mae Suai"],
    [/เวียงป่าเป้า/g, "Wiang Pa Pao"],
    [/พาน/g, "Phan"],
    [/แม่สาย/g, "Mae Sai"],
    [/แม่จัน/g, "Mae Chan"],
    [/เชียงของ/g, "Chiang Khong"],
    [/เชียงแสน/g, "Chiang Saen"],
    [/วังเหนือ/g, "Wang Nuea"],
    [/งาว/g, "Ngao"],
    [/เวียงเหนือ/g, "Wiang Nuea"],
    [/เวียงใต้/g, "Wiang Tai"],
    [/ต\.\s*/g, "Subdistrict "],
    [/อ\.\s*/g, ", District "],
    [/จ\.\s*/g, ", Province "],
    [/แขวง|ແຂວງ/g, "Province "],
    [/เมือง|ເມືອງ/g, "District "],
  ] as const;

  for (const [pattern, rep] of rules) {
    text = text.replace(pattern, rep);
  }

  if (englishParen && text.includes(englishParen)) {
    const dupRegex = new RegExp(`\\b${englishParen}\\b\\s*\\(${englishParen}\\)`, "i");
    text = text.replace(dupRegex, englishParen);
    text = text.replace(/\(\s*\)/g, "").trim();
  }

  // Absolute sanitization: Strip 100% of any remaining Thai and Lao characters
  text = text.replace(/[\u0E00-\u0E7F\u0E80-\u0EFF]/g, "");
  text = text.replace(/,\s*,+/g, ",").replace(/\s+/g, " ").replace(/^[,;:\-\s]+|[,;:\-\s]+$/g, "").trim();

  if (text.includes("Mae Hong Son") || text.includes("Chiang Mai") || text.includes("Chiang Rai")) {
    if (!text.toLowerCase().includes("thailand")) text = `${text}, Thailand`;
  }

  return text || "Regional epicenter";
}

function parsePhivolcsTime(str: string): string | null {
  // e.g. "27 October 2026 - 05:56 PM" (Philippine Time = UTC+8)
  const parts = str.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!parts) return null;
  const months: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  };
  const d = parseInt(parts[1], 10);
  const m = months[parts[2].toLowerCase()];
  const y = parseInt(parts[3], 10);
  let h = parseInt(parts[4], 10);
  const min = parseInt(parts[5], 10);
  const ampm = parts[6].toUpperCase();
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  if (m === undefined) return null;
  const utcDate = new Date(Date.UTC(y, m, d, h - 8, min, 0));
  return utcDate.toISOString();
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
  const is6h = windowParam === "6h" || windowParam === "6hours";
  const is24h = windowParam === "24h" || windowParam === "day";
  const is7d = windowParam === "7d" || windowParam === "7days" || windowParam === "week";
  const is30d = windowParam === "30d" || windowParam === "30days" || windowParam === "month";

  const windowMs = is6h
    ? 6 * 3600 * 1000
    : is24h
    ? 24 * 3600 * 1000
    : is30d
    ? 30 * 24 * 3600 * 1000
    : 7 * 24 * 3600 * 1000;

  let usgsUrl =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  if (is6h || is24h) {
    usgsUrl =
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  } else if (is30d) {
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
    CENC: {
      provider: "CENC",
      name: "China Earthquake Networks Center (CEA / 广东省地震局)",
      status: "loading",
      officialUrl: "https://news.ceic.ac.cn/",
      lastChecked: new Date().toISOString(),
      note: "China Earthquake Administration (CEA) & Guangdong Seismological Network",
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
    JMA: {
      provider: "JMA",
      name: "Japan Meteorological Agency (気象庁)",
      status: "loading",
      officialUrl: "https://www.data.jma.go.jp/multi/quake/",
      lastChecked: new Date().toISOString(),
      note: "Official Earthquake and Seismic Intensity Information (気象庁防災情報)",
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
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

        const isReg = lat >= 5.0 && lat <= 25.0 && lon >= 92.0 && lon <= 112.0;
        const mag = f.properties.mag ?? null;

        // Keep all regional earthquakes (any magnitude)
        // Keep all global earthquakes with magnitude >= 2.0 (or >= 1.5 for 24h, >= 2.5 for 30d)
        // In 6h mode, filter by time within last 6 hours
        const sixHoursAgo = Date.now() - 6 * 3600 * 1000;
        if (is6h && f.properties.time < sixHoursAgo) continue;

        const minGlobalMag = is6h ? 1.0 : is24h ? 1.5 : is30d ? 2.5 : 2.0;
        if (!isReg && (mag === null || mag < minGlobalMag)) continue;

        const originTime = new Date(f.properties.time).toISOString();
        const dLat = (lat - 12.5657) * 111;
        const dLon = (lon - 104.991) * 111 * Math.cos((12.5657 * Math.PI) / 180);
        const distKm = Math.round(Math.sqrt(dLat * dLat + dLon * dLon));

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
          magnitude: mag,
          magnitudeType: f.properties.magType || "M",
          location: (f.properties.place || (isReg ? "Regional epicenter" : "Global epicenter")).trim(),
          reviewStatus: f.properties.status || "automatic",
          isRegional: isReg,
          distanceToCambodiaKm: distKm,
          reports: [
            {
              provider: "USGS",
              providerEventId: f.id,
              sourceUrl:
                f.properties.url ||
                `https://earthquake.usgs.gov/earthquakes/eventpage/${f.id}`,
              magnitude: mag,
              magnitudeType: f.properties.magType,
              depthKm: Number.isFinite(depth) ? depth : null,
            },
          ],
        });
        count++;
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
            location: sanitizeTmdLocation(title),
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

  // 3. Fetch China Earthquake Administration (CEA / CENC) & Guangdong Seismic Network
  try {
    const cencRes = await fetch("https://api.wolfx.jp/cenc_eqlist.json", {
      signal: AbortSignal.timeout(4000),
      headers: { "User-Agent": "GeoCam-Earthquake-Monitor/1.0" },
    });

    if (cencRes.ok) {
      const data = await cencRes.json();
      const itemKeys = Object.keys(data).filter((k) => k.startsWith("No"));
      let cencCount = 0;

      for (const k of itemKeys) {
        const it = data[k];
        if (!it || !it.time) continue;

        const lat = parseFloat(it.latitude);
        const lon = parseFloat(it.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

        const mag = it.magnitude ? parseFloat(it.magnitude) : null;
        const depth = it.depth ? parseFloat(it.depth) : null;

        const beijingIso = `${it.time.replace(" ", "T")}+08:00`;
        const originDate = new Date(beijingIso);
        if (isNaN(originDate.getTime())) continue;
        const originTime = originDate.toISOString();

        const isReg = lat >= 5.0 && lat <= 25.0 && lon >= 92.0 && lon <= 112.0;
        const dLat = (lat - 12.5657) * 111;
        const dLon = (lon - 104.991) * 111 * Math.cos((12.5657 * Math.PI) / 180);
        const distKm = Math.round(Math.sqrt(dLat * dLat + dLon * dLon));

        const isGuangdong = Boolean(it.location && it.location.includes("广东"));
        const cleanLoc = (it.location || it.placeName || "").trim();
        const locationLabel = isGuangdong
          ? `${cleanLoc} (Guangdong, China)`
          : cleanLoc || (isReg ? "Regional epicenter" : "China / Global epicenter");

        const id = `cenc-${it.EventID || `${lat.toFixed(2)}-${lon.toFixed(2)}-${originTime.slice(0, 16)}`}`;
        const sourceUrl = isGuangdong
          ? "http://www.gddzj.gov.cn/"
          : "https://news.ceic.ac.cn/";

        rawEvents.push({
          id,
          originTime,
          firstSeenAt: originTime,
          latitude: lat,
          longitude: lon,
          depthKm: Number.isFinite(depth) ? depth : null,
          magnitude: Number.isFinite(mag) ? mag : null,
          magnitudeType: "M",
          location: locationLabel,
          reviewStatus: it.type || "reviewed",
          status: it.type || "reviewed",
          url: sourceUrl,
          isRegional: isReg,
          distanceToCambodiaKm: distKm,
          reports: [
            {
              provider: "CENC",
              providerEventId: it.EventID || id,
              sourceUrl,
              magnitude: Number.isFinite(mag) ? mag : null,
              depthKm: Number.isFinite(depth) ? depth : null,
            },
          ],
        });
        cencCount++;
      }

      providerHealth.CENC.status = "available";
      providerHealth.CENC.eventCount = cencCount;
    } else {
      providerHealth.CENC.status = "unavailable";
      providerHealth.CENC.note = `Upstream HTTP ${cencRes.status}`;
    }
  } catch (err: any) {
    providerHealth.CENC.status = "delayed";
    providerHealth.CENC.note = "Upstream connection timeout or delayed";
  }

  // 4. Fetch PHIVOLCS DOST (Philippines) Official Bulletin Feed
  try {
    const phivolcsRes = await fetch("https://earthquake.phivolcs.dost.gov.ph/", {
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (phivolcsRes.ok) {
      const html = await phivolcsRes.text();
      const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let trMatch;
      let phivolcsCount = 0;

      while ((trMatch = trRegex.exec(html)) !== null) {
        const row = trMatch[1];
        if (!row.includes("href=") || !row.includes("Earthquake_Information")) continue;

        const tds: string[] = [];
        const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
        let tdMatch;
        while ((tdMatch = tdRegex.exec(row)) !== null) {
          tds.push(tdMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
        }

        if (tds.length < 6) continue;

        const [rawTime, rawLat, rawLon, rawDepth, rawMag, rawLoc] = tds;
        const originTime = parsePhivolcsTime(rawTime);
        if (!originTime) continue;

        const lat = parseFloat(rawLat);
        const lon = parseFloat(rawLon);
        const depth = parseFloat(rawDepth);
        const mag = parseFloat(rawMag);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

        // Check if event falls within requested time window
        const eventMs = new Date(originTime).getTime();
        if (Date.now() - eventMs > windowMs) continue;

        const isReg = lat >= 5.0 && lat <= 25.0 && lon >= 92.0 && lon <= 112.0;
        const dLat = (lat - 12.5657) * 111;
        const dLon = (lon - 104.991) * 111 * Math.cos((12.5657 * Math.PI) / 180);
        const distKm = Math.round(Math.sqrt(dLat * dLat + dLon * dLon));

        const linkMatch = row.match(/href=["']([^"']+)["']/i);
        const relLink = linkMatch ? linkMatch[1].replace(/\\/g, "/") : "";
        const sourceUrl = relLink
          ? `https://earthquake.phivolcs.dost.gov.ph/${relLink}`
          : "https://earthquake.phivolcs.dost.gov.ph/";

        const cleanLoc = rawLoc || "Philippines epicenter";
        const id = `phivolcs-${lat.toFixed(2)}-${lon.toFixed(2)}-${originTime.slice(0, 16)}`;

        rawEvents.push({
          id,
          originTime,
          firstSeenAt: originTime,
          latitude: lat,
          longitude: lon,
          depthKm: Number.isFinite(depth) ? depth : null,
          magnitude: Number.isFinite(mag) ? mag : null,
          magnitudeType: "M",
          location: `${cleanLoc}, Philippines`,
          reviewStatus: "reviewed",
          status: "reviewed",
          url: sourceUrl,
          isRegional: isReg,
          distanceToCambodiaKm: distKm,
          reports: [
            {
              provider: "PHIVOLCS",
              providerEventId: id,
              sourceUrl,
              magnitude: Number.isFinite(mag) ? mag : null,
              depthKm: Number.isFinite(depth) ? depth : null,
            },
          ],
        });
        phivolcsCount++;
      }

      providerHealth.PHIVOLCS.status = "available";
      providerHealth.PHIVOLCS.eventCount = phivolcsCount;
    } else {
      providerHealth.PHIVOLCS.status = "unavailable";
      providerHealth.PHIVOLCS.note = `Upstream HTTP ${phivolcsRes.status}`;
    }
  } catch (err: any) {
    console.error("[PHIVOLCS Scraper Error]:", err);
    providerHealth.PHIVOLCS.status = "delayed";
    providerHealth.PHIVOLCS.note = `Upstream error: ${err?.message || err}`;
  }

  // 5. Fetch Japan Meteorological Agency (JMA / 気象庁) Real-Time Earthquake Feed
  try {
    const jmaRes = await fetch("https://www.jma.go.jp/bosai/quake/data/list.json", {
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "GeoCam-Earthquake-Monitor/1.0" },
    });

    if (jmaRes.ok) {
      const jmaItems = await jmaRes.json();
      let jmaCount = 0;

      if (Array.isArray(jmaItems)) {
        for (const it of jmaItems) {
          if (!it || !it.cod) continue;

          // Parse ISO 6709 coordinates
          const m = it.cod.match(/^([+-][0-9.]+)([+-][0-9.]+)([+-][0-9.]+)?\//);
          if (!m) continue;

          const rawLat = m[1];
          const rawLon = m[2];
          const rawDepth = m[3];

          let lat = 0;
          const latSign = rawLat.startsWith("-") ? -1 : 1;
          const latNum = rawLat.slice(1);
          if (latNum.includes(".") && latNum.indexOf(".") === 4) {
            const deg = parseFloat(latNum.slice(0, 2));
            const min = parseFloat(latNum.slice(2));
            lat = latSign * (deg + min / 60);
          } else {
            lat = parseFloat(rawLat);
          }

          let lon = 0;
          const lonSign = rawLon.startsWith("-") ? -1 : 1;
          const lonNum = rawLon.slice(1);
          if (lonNum.includes(".") && lonNum.indexOf(".") === 5) {
            const deg = parseFloat(lonNum.slice(0, 3));
            const min = parseFloat(lonNum.slice(3));
            lon = lonSign * (deg + min / 60);
          } else {
            lon = parseFloat(rawLon);
          }

          if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

          let depthKm: number | null = null;
          if (rawDepth) {
            depthKm = Math.round(Math.abs(parseFloat(rawDepth)) / 1000);
          }

          const rawTime = it.at || it.rdt;
          if (!rawTime) continue;
          const originDate = new Date(rawTime);
          if (isNaN(originDate.getTime())) continue;
          const originTime = originDate.toISOString();

          // Filter by time window
          const eventTime = originDate.getTime();
          if (eventTime < startTime) continue;

          const mag = it.mag ? parseFloat(it.mag) : null;
          const isReg = lat >= 5.0 && lat <= 25.0 && lon >= 92.0 && lon <= 112.0;

          const dLat = (lat - 12.5657) * 111;
          const dLon = (lon - 104.991) * 111 * Math.cos((12.5657 * Math.PI) / 180);
          const distKm = Math.round(Math.sqrt(dLat * dLat + dLon * dLon));

          const placeName = (it.en_anm || it.anm || "").trim();
          const locationLabel = placeName
            ? `${placeName} (Japan / JMA)`
            : isReg
              ? "Regional epicenter (JMA)"
              : "Japan / Pacific epicenter (JMA)";

          const id = `jma-${it.eid || it.ctt || `${lat.toFixed(2)}-${lon.toFixed(2)}-${originTime.slice(0, 16)}`}`;
          const sourceUrl = "https://www.data.jma.go.jp/multi/quake/";

          rawEvents.push({
            id,
            originTime,
            firstSeenAt: originTime,
            latitude: Number(lat.toFixed(4)),
            longitude: Number(lon.toFixed(4)),
            depthKm,
            magnitude: Number.isFinite(mag) ? mag : null,
            magnitudeType: "Mj",
            location: locationLabel,
            reviewStatus: "reviewed",
            status: "reviewed",
            url: sourceUrl,
            isRegional: isReg,
            distanceToCambodiaKm: distKm,
            reports: [
              {
                provider: "JMA",
                providerEventId: it.eid || it.ctt || id,
                sourceUrl,
                magnitude: Number.isFinite(mag) ? mag : null,
                depthKm,
              },
            ],
          });
          jmaCount++;
        }
      }

      providerHealth.JMA.status = "available";
      providerHealth.JMA.eventCount = jmaCount;
    } else {
      providerHealth.JMA.status = "unavailable";
      providerHealth.JMA.note = `Upstream HTTP ${jmaRes.status}`;
    }
  } catch (err: any) {
    console.error("[JMA Fetch Error]:", err);
    providerHealth.JMA.status = "delayed";
    providerHealth.JMA.note = `Upstream error: ${err?.message || err}`;
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
