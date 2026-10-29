import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Transpile src/features/earthquakes/earthquake-data.ts
const source = readFileSync(new URL('../src/features/earthquakes/earthquake-data.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
}).outputText;

const {
  REGIONAL_BOUNDS,
  isWithinRegionalEnvelope,
  haversineDistanceKm,
  formatLocalIctTime,
  generateEventAnnouncement,
  normalizeUsgsFeature,
  parseTmdXml,
  parseCencJson,
  parseJmaCod,
  parseJmaJson,
  deduplicateEvents,
  filterEarthquakes,
  translateEarthquakeLocation,
} = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));

test('isWithinRegionalEnvelope: accepts Cambodia and surrounding region (5-25N, 92-112E), rejects distant points', () => {
  // Cambodia (Phnom Penh)
  assert.equal(isWithinRegionalEnvelope(11.55, 104.92), true);
  // Thailand (Bangkok)
  assert.equal(isWithinRegionalEnvelope(13.75, 100.50), true);
  // Vietnam (Hanoi)
  assert.equal(isWithinRegionalEnvelope(21.03, 105.85), true);
  // Myanmar (Yangon)
  assert.equal(isWithinRegionalEnvelope(16.84, 96.17), true);
  // Edge coordinates inside
  assert.equal(isWithinRegionalEnvelope(5.0, 92.0), true);
  assert.equal(isWithinRegionalEnvelope(25.0, 112.0), true);

  // Outside bounds
  assert.equal(isWithinRegionalEnvelope(4.9, 100.0), false); // too south
  assert.equal(isWithinRegionalEnvelope(25.1, 100.0), false); // too north
  assert.equal(isWithinRegionalEnvelope(15.0, 91.9), false); // too west
  assert.equal(isWithinRegionalEnvelope(15.0, 112.1), false); // too east
  assert.equal(isWithinRegionalEnvelope(35.68, 139.69), false); // Tokyo
  assert.equal(isWithinRegionalEnvelope(NaN, 100.0), false);
});

test('haversineDistanceKm: calculates great-circle distance accurately', () => {
  // Same coordinates = 0
  assert.equal(haversineDistanceKm(11.55, 104.92, 11.55, 104.92), 0);
  // Phnom Penh (11.55, 104.92) to Bangkok (13.75, 100.50) is approx 530-540 km
  const dist = haversineDistanceKm(11.55, 104.92, 13.75, 100.50);
  assert.ok(dist > 520 && dist < 550, `Expected distance ~535 km, got ${dist}`);
});

test('formatLocalIctTime: formats timestamps into Indochina Time (ICT, UTC+7)', () => {
  // 2026-10-23T00:00:00Z is 07:00 ICT on 23 Oct 2026
  const utcIso = "2026-10-23T00:00:00.000Z";
  const ictStr = formatLocalIctTime(utcIso, "en");
  assert.ok(ictStr.includes("07:00"), `Expected 07:00 ICT, got: ${ictStr}`);
  assert.ok(ictStr.includes("2026"), `Expected 2026 year, got: ${ictStr}`);

  // Invalid date fallback
  assert.equal(formatLocalIctTime("not-a-date"), "—");
});

test('generateEventAnnouncement: produces factual templates in English and Khmer without speculative text', () => {
  const event = {
    id: 'usgs-test1',
    originTime: '2026-10-23T05:30:00.000Z',
    firstSeenAt: '2026-10-23T05:35:00.000Z',
    latitude: 14.2,
    longitude: 101.5,
    depthKm: 10.0,
    magnitude: 4.2,
    location: 'central Thailand',
    reports: [{ provider: 'USGS', providerEventId: 'usgs-test1', sourceUrl: 'https://example.org' }]
  };

  const enText = generateEventAnnouncement(event, 'en');
  // Expected: M4.2 earthquake reported near central Thailand at 12:30 ICT on 23 Oct 2026. Depth: 10 km. Source: USGS.
  assert.ok(enText.startsWith('M4.2 earthquake reported near central Thailand at 12:30 ICT on 23 Oct 2026. Depth: 10 km. Source: USGS.'));

  const kmText = generateEventAnnouncement(event, 'km');
  assert.ok(kmText.includes('M4.2'));
  assert.ok(kmText.includes('Thailand') || kmText.includes('ប្រទេសថៃ'));
  assert.ok(kmText.includes('12:30 ICT'));
  assert.ok(kmText.includes('10 គ.ម'));
  assert.ok(kmText.includes('USGS'));

  // Missing depth and magnitude handling
  const partialEvent = {
    ...event,
    depthKm: null,
    magnitude: null,
    reports: [{ provider: 'TMD', providerEventId: 'tmd-1', sourceUrl: 'https://example.org' }]
  };
  const enPartial = generateEventAnnouncement(partialEvent, 'en');
  assert.ok(enPartial.includes('M—'));
  assert.ok(enPartial.includes('depth unconfirmed'));
  assert.ok(enPartial.includes('Source: TMD'));
});

test('normalizeUsgsFeature: maps GeoJSON feature to normalized event within specifications', () => {
  const feature = {
    id: 'us7000test',
    geometry: {
      type: 'Point',
      coordinates: [103.5, 12.8, 15.2] // [lon, lat, depth]
    },
    properties: {
      mag: 3.8,
      place: '45 km NW of Pursat, Cambodia',
      time: 1792740000000,
      updated: 1792740500000,
      status: 'reviewed',
      magType: 'ml',
      url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000test'
    }
  };

  const normalized = normalizeUsgsFeature(feature);
  assert.ok(normalized);
  assert.equal(normalized.id, 'usgs-us7000test');
  assert.equal(normalized.latitude, 12.8);
  assert.equal(normalized.longitude, 103.5);
  assert.equal(normalized.depthKm, 15.2);
  assert.equal(normalized.magnitude, 3.8);
  assert.equal(normalized.magnitudeType, 'ml');
  assert.equal(normalized.location, '45 km NW of Pursat, Cambodia');
  assert.equal(normalized.reviewStatus, 'reviewed');
  assert.equal(normalized.reports.length, 1);
  assert.equal(normalized.reports[0].provider, 'USGS');

  // Invalid feature test
  assert.equal(normalizeUsgsFeature(null), null);
  assert.equal(normalizeUsgsFeature({ geometry: { coordinates: [NaN, 10] }, properties: {} }), null);
});

test('parseTmdXml: parses XML items and excludes events outside regional envelope', () => {
  const xmlSample = `<?xml version="1.0" encoding="utf-8"?>
  <rss version="2.0" xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#">
    <channel>
      <title>Earthquake TMD</title>
      <item>
        <title>Earthquake Chiang Mai, Thailand (Magnitude 3.2)</title>
        <link>https://earthquake.tmd.go.th/inside.html?id=101</link>
        <description>Depth 5 km. Latitude 18.788, Longitude 98.985</description>
        <pubDate>Fri, 23 Oct 2026 04:00:00 GMT</pubDate>
        <geo:lat>18.788</geo:lat>
        <geo:long>98.985</geo:long>
      </item>
      <item>
        <title>Earthquake Japan (Magnitude 6.0)</title>
        <link>https://earthquake.tmd.go.th/inside.html?id=999</link>
        <description>Depth 50 km. Outside region</description>
        <pubDate>Fri, 23 Oct 2026 01:00:00 GMT</pubDate>
        <geo:lat>36.204</geo:lat>
        <geo:long>138.252</geo:long>
      </item>
    </channel>
  </rss>`;

  const parsed = parseTmdXml(xmlSample);
  assert.equal(parsed.length, 1, 'Only regional item should be accepted');
  assert.equal(parsed[0].magnitude, 3.2);
  assert.equal(parsed[0].depthKm, 5);
  assert.equal(parsed[0].latitude, 18.788);
  assert.equal(parsed[0].longitude, 98.985);
  assert.equal(parsed[0].reports[0].provider, 'TMD');
});

test('deduplicateEvents: merges cross-provider reports within 60 seconds and 30 km', () => {
  const usgsEvent = {
    id: 'usgs-123',
    originTime: '2026-10-23T06:00:00.000Z',
    firstSeenAt: '2026-10-23T06:02:00.000Z',
    latitude: 19.50,
    longitude: 99.80,
    depthKm: 10,
    magnitude: 4.5,
    magnitudeType: 'mb',
    location: 'northern Thailand',
    reports: [{ provider: 'USGS', providerEventId: '123', sourceUrl: 'https://usgs.gov/123' }]
  };

  // TMD event 15 seconds later and 8 km away
  const tmdEvent = {
    id: 'tmd-456',
    originTime: '2026-10-23T06:00:15.000Z',
    firstSeenAt: '2026-10-23T06:01:00.000Z',
    latitude: 19.55,
    longitude: 99.85,
    depthKm: 12,
    magnitude: 4.6,
    magnitudeType: 'ML',
    location: 'Chiang Rai region',
    reports: [{ provider: 'TMD', providerEventId: '456', sourceUrl: 'https://tmd.go.th/456' }]
  };

  // Distinct third event 2 hours later
  const separateEvent = {
    id: 'usgs-789',
    originTime: '2026-10-23T08:00:00.000Z',
    firstSeenAt: '2026-10-23T08:02:00.000Z',
    latitude: 10.5,
    longitude: 105.0,
    depthKm: 15,
    magnitude: 3.1,
    reports: [{ provider: 'USGS', providerEventId: '789', sourceUrl: 'https://usgs.gov/789' }]
  };

  const merged = deduplicateEvents([usgsEvent, tmdEvent, separateEvent]);
  assert.equal(merged.length, 2, 'Should deduplicate the 2 coincident events into 1');

  const deduplicatedPair = merged.find(e => e.reports.some(r => r.provider === 'USGS') && e.reports.some(r => r.provider === 'TMD'));
  assert.ok(deduplicatedPair, 'Deduplicated event must contain reports from both USGS and TMD');
  assert.equal(deduplicatedPair.reports.length, 2);
});

test('filterEarthquakes: filters by time window, magnitude threshold, and sort order', () => {
  const now = Date.now();
  const events = [
    {
      id: 'e1',
      originTime: new Date(now - 12 * 3600 * 1000).toISOString(), // 12h ago
      firstSeenAt: new Date(now - 12 * 3600 * 1000).toISOString(),
      latitude: 12.0,
      longitude: 104.0,
      magnitude: 2.5,
      reports: [{ provider: 'USGS', providerEventId: '1', sourceUrl: '' }]
    },
    {
      id: 'e2',
      originTime: new Date(now - 48 * 3600 * 1000).toISOString(), // 2 days ago
      firstSeenAt: new Date(now - 48 * 3600 * 1000).toISOString(),
      latitude: 14.0,
      longitude: 102.0,
      magnitude: 4.8,
      reports: [{ provider: 'USGS', providerEventId: '2', sourceUrl: '' }]
    },
    {
      id: 'e3',
      originTime: new Date(now - 10 * 24 * 3600 * 1000).toISOString(), // 10 days ago
      firstSeenAt: new Date(now - 10 * 24 * 3600 * 1000).toISOString(),
      latitude: 15.0,
      longitude: 100.0,
      magnitude: 5.5,
      reports: [{ provider: 'TMD', providerEventId: '3', sourceUrl: '' }]
    }
  ];

  // 6 hours window -> 0 events (e1 is 12h ago)
  const win6h = filterEarthquakes(events, { hoursWindow: 6, minMagnitude: 0 });
  assert.equal(win6h.length, 0);

  // 24 hours window -> only e1
  const win24h = filterEarthquakes(events, { hoursWindow: 24, minMagnitude: 0 });
  assert.equal(win24h.length, 1);
  assert.equal(win24h[0].id, 'e1');

  // 7 days window (168h) -> e1 and e2
  const win7d = filterEarthquakes(events, { hoursWindow: 168, minMagnitude: 0 });
  assert.equal(win7d.length, 2);

  // 7 days window with minMagnitude 4.0 -> only e2
  const minMag4 = filterEarthquakes(events, { hoursWindow: 168, minMagnitude: 4.0 });
  assert.equal(minMag4.length, 1);
  assert.equal(minMag4[0].id, 'e2');

  // 30 days window sorted by largest magnitude -> e3 (5.5), e2 (4.8), e1 (2.5)
  const sortedLargest = filterEarthquakes(events, { hoursWindow: 720, minMagnitude: 0, sortOrder: 'largest' });
  assert.equal(sortedLargest.length, 3);
  assert.equal(sortedLargest[0].id, 'e3');
  assert.equal(sortedLargest[1].id, 'e2');
  assert.equal(sortedLargest[2].id, 'e1');

  // Provider filter TMD -> only e3
  const tmdOnly = filterEarthquakes(events, { hoursWindow: 720, providerFilter: 'TMD' });
  assert.equal(tmdOnly.length, 1);
  assert.equal(tmdOnly[0].id, 'e3');
});

test('filterEarthquakes: handles scope (cambodia vs global) and global location search', () => {
  const now = Date.now();
  const mixedEvents = [
    {
      id: 'reg1',
      location: 'Northern Thailand',
      originTime: new Date(now - 3600 * 1000).toISOString(),
      firstSeenAt: new Date(now - 3600 * 1000).toISOString(),
      latitude: 18.5,
      longitude: 99.0,
      magnitude: 3.2,
      isRegional: true,
      distanceToCambodiaKm: 850,
      reports: [{ provider: 'USGS', providerEventId: 'reg1', sourceUrl: '' }]
    },
    {
      id: 'glob1',
      location: 'near the east coast of Honshu, Japan',
      originTime: new Date(now - 7200 * 1000).toISOString(),
      firstSeenAt: new Date(now - 7200 * 1000).toISOString(),
      latitude: 38.2,
      longitude: 142.4,
      magnitude: 6.2,
      isRegional: false,
      distanceToCambodiaKm: 4200,
      reports: [{ provider: 'USGS', providerEventId: 'glob1', sourceUrl: '' }]
    },
    {
      id: 'glob2',
      location: 'Southern California, USA',
      originTime: new Date(now - 14400 * 1000).toISOString(),
      firstSeenAt: new Date(now - 14400 * 1000).toISOString(),
      latitude: 34.0,
      longitude: -118.2,
      magnitude: 4.5,
      isRegional: false,
      distanceToCambodiaKm: 13500,
      reports: [{ provider: 'USGS', providerEventId: 'glob2', sourceUrl: '' }]
    }
  ];

  // Default cambodia scope only returns regional events
  const cambodiaScope = filterEarthquakes(mixedEvents, { hoursWindow: 168, scope: 'cambodia' });
  assert.equal(cambodiaScope.length, 1);
  assert.equal(cambodiaScope[0].id, 'reg1');

  // Global scope returns all events
  const globalScope = filterEarthquakes(mixedEvents, { hoursWindow: 168, scope: 'global' });
  assert.equal(globalScope.length, 3);

  // Search query (e.g. "Japan") searches globally even if scope was cambodia
  const searchJapan = filterEarthquakes(mixedEvents, { hoursWindow: 168, scope: 'cambodia', searchQuery: 'Japan' });
  assert.equal(searchJapan.length, 1);
  assert.equal(searchJapan[0].id, 'glob1');

  // Search query "California"
  const searchCal = filterEarthquakes(mixedEvents, { hoursWindow: 168, searchQuery: 'california' });
  assert.equal(searchCal.length, 1);
  assert.equal(searchCal[0].id, 'glob2');
});

test('parseCencJson: parses China Earthquake Networks Center (CENC/CEA) & Guangdong data with Beijing Time conversion', () => {
  const sampleData = {
    No1: {
      type: 'reviewed',
      EventID: 'GD.20261023120000',
      time: '2026-10-23 20:00:00', // Beijing Time (UTC+8) -> 12:00:00Z UTC -> 19:00:00 ICT
      location: '广东河源市源城区',
      magnitude: '3.6',
      depth: '11',
      latitude: '23.75',
      longitude: '114.65',
    },
    No2: {
      type: 'reviewed',
      EventID: 'YN.20261021195218',
      time: '2026-10-21 19:52:18', // Beijing Time (UTC+8) -> 11:52:18Z UTC
      location: '云南玉溪市元江县',
      magnitude: '3.0',
      depth: '7',
      latitude: '23.65',
      longitude: '102.25',
    }
  };

  const parsed = parseCencJson(sampleData);
  assert.equal(parsed.length, 2);

  const gdEvent = parsed.find(e => e.id.includes('GD.20261023120000'));
  assert.ok(gdEvent);
  assert.equal(gdEvent.magnitude, 3.6);
  assert.equal(gdEvent.depthKm, 11);
  assert.equal(gdEvent.latitude, 23.75);
  assert.equal(gdEvent.longitude, 114.65);
  assert.equal(gdEvent.originTime, '2026-10-23T12:00:00.000Z');
  assert.ok(gdEvent.location.includes('Guangdong, China'));
  assert.equal(gdEvent.url, 'http://www.gddzj.gov.cn/');
  assert.equal(gdEvent.reports[0].provider, 'CENC');

  const ynEvent = parsed.find(e => e.id.includes('YN.20261021195218'));
  assert.ok(ynEvent);
  assert.equal(ynEvent.isRegional, true); // (23.65N, 102.25E is within regional envelope 5-25N, 92-112E)
});

test('parseJmaJson: parses Japan Meteorological Agency earthquake items and ISO 6709 coordinates correctly', () => {
  const sampleCodStandard = parseJmaCod('+43.1+144.5-120000/');
  assert.ok(sampleCodStandard);
  assert.equal(sampleCodStandard.lat, 43.1);
  assert.equal(sampleCodStandard.lon, 144.5);
  assert.equal(sampleCodStandard.depthKm, 120);

  const sampleCodDdmm = parseJmaCod('+3543.3+14042.9-52000/');
  assert.ok(sampleCodDdmm);
  assert.equal(sampleCodDdmm.lat, 35.7217);
  assert.equal(sampleCodDdmm.lon, 140.715);
  assert.equal(sampleCodDdmm.depthKm, 52);

  const sampleJmaFeed = [
    {
      ctt: '20261029081812',
      eid: '20261029081407',
      rdt: '2026-10-29T08:18:00+09:00',
      at: '2026-10-29T08:14:00+09:00',
      anm: '釧路地方中南部',
      cod: '+43.1+144.5-120000/',
      mag: '4.4',
      en_anm: 'Central and southern Kushiro Region, Hokkaido'
    },
    {
      ctt: '20261029021003',
      eid: '20261029000759',
      rdt: '2026-10-29T02:10:00+09:00',
      at: '2026-10-29T00:07:00+09:00',
      anm: '千葉県北東部',
      cod: '+3543.3+14042.9-52000/',
      mag: '5.5',
      en_anm: 'Northeastern Chiba Prefecture'
    }
  ];

  const parsed = parseJmaJson(sampleJmaFeed);
  assert.equal(parsed.length, 2);

  const ev1 = parsed[0];
  assert.equal(ev1.magnitude, 4.4);
  assert.equal(ev1.magnitudeType, 'Mj');
  assert.equal(ev1.depthKm, 120);
  assert.equal(ev1.latitude, 43.1);
  assert.equal(ev1.longitude, 144.5);
  assert.equal(ev1.reports[0].provider, 'JMA');
  assert.ok(ev1.location.includes('Kushiro Region, Hokkaido'));
  assert.ok(ev1.location.includes('Japan / JMA'));
  assert.equal(ev1.url, 'https://www.data.jma.go.jp/multi/quake/');

  const ev2 = parsed[1];
  assert.equal(ev2.magnitude, 5.5);
  assert.equal(ev2.depthKm, 52);
  assert.equal(ev2.latitude, 35.7217);
  assert.equal(ev2.longitude, 140.715);
  assert.ok(ev2.location.includes('Northeastern Chiba Prefecture'));
});



test('translateEarthquakeLocation: eliminates 100% of Thai and Lao script and translates accurately', () => {
  const THAI_LAO_REGEX = /[\u0E00-\u0E7F\u0E80-\u0EFF]/;

  const cases = [
    {
      raw: 'ประเทศเมียนมา (Myanmar)',
      enExpected: 'Myanmar',
      kmExpectedSubstring: 'ប្រទេសមីយ៉ាន់ម៉ា',
    },
    {
      raw: 'ประเทศลาว (Laos)',
      enExpected: 'Laos',
      kmExpectedSubstring: 'ប្រទេសឡាវ',
    },
    {
      raw: 'ประเทศไทย (Thailand)',
      enExpected: 'Thailand',
      kmExpectedSubstring: 'ប្រទេសថៃ',
    },
    {
      raw: 'ต.เวียงเหนือ อ.ปาย จ.แม่ฮ่องสอน',
      enExpectedContains: 'Mae Hong Son',
      kmExpectedSubstring: 'ម៉ែហុងសន',
    },
    {
      raw: 'อ.สันทราย จ.เชียงใหม่',
      enExpectedContains: 'Chiang Mai',
      kmExpectedSubstring: 'ឈៀងម៉ៃ',
    },
    {
      raw: 'แขวงบ่อแก้ว (Bokeo)',
      enExpectedContains: 'Bokeo',
      kmExpectedSubstring: 'បកែវ',
    },
    {
      raw: 'หมู่เกาะอันดามัน (Andaman Islands)',
      enExpected: 'Andaman Islands',
      kmExpectedSubstring: 'អាន់ដាម៉ាន',
    },
    {
      raw: 'สดใสดึงดูด',
      enExpected: 'Regional epicenter',
      kmExpectedSubstring: 'ចំណុចកណ្តាលរញ្ជួយ',
    },
  ];

  for (const c of cases) {
    const en = translateEarthquakeLocation(c.raw, 'en');
    const km = translateEarthquakeLocation(c.raw, 'km');

    // STRICT INVARIANT: ZERO Thai or Lao characters permitted
    assert.equal(THAI_LAO_REGEX.test(en), false, `Expected zero Thai/Lao in EN for "${c.raw}", got: "${en}"`);
    assert.equal(THAI_LAO_REGEX.test(km), false, `Expected zero Thai/Lao in KM for "${c.raw}", got: "${km}"`);

    if (c.enExpected) {
      assert.equal(en, c.enExpected);
    }
    if (c.enExpectedContains) {
      assert.ok(en.includes(c.enExpectedContains), `Expected EN "${en}" to include "${c.enExpectedContains}"`);
    }
    if (c.kmExpectedSubstring) {
      assert.ok(km.includes(c.kmExpectedSubstring), `Expected KM "${km}" to include "${c.kmExpectedSubstring}"`);
    }
  }
});

test('generateEventAnnouncement: generates clean Khmer and English text without Thai/Lao from raw TMD inputs', () => {
  const THAI_LAO_REGEX = /[\u0E00-\u0E7F\u0E80-\u0EFF]/;

  const tmdEvent = {
    id: 'tmd-test-1',
    originTime: '2026-10-24T13:23:00.000Z',
    firstSeenAt: '2026-10-24T13:25:00.000Z',
    latitude: 20.89,
    longitude: 99.11,
    depthKm: null,
    magnitude: null,
    location: 'ประเทศเมียนมา (Myanmar)',
    reports: [{ provider: 'TMD', providerEventId: 'tmd-1', sourceUrl: 'https://earthquake.tmd.go.th/' }],
  };

  const kmText = generateEventAnnouncement(tmdEvent, 'km');
  assert.equal(THAI_LAO_REGEX.test(kmText), false, `Khmer announcement must not contain Thai script: "${kmText}"`);
  assert.ok(kmText.includes('ប្រទេសមីយ៉ាន់ម៉ា (Myanmar)'));
  assert.ok(kmText.includes('TMD'));

  const enText = generateEventAnnouncement(tmdEvent, 'en');
  assert.equal(THAI_LAO_REGEX.test(enText), false, `English announcement must not contain Thai script: "${enText}"`);
  assert.ok(enText.includes('Myanmar'));
  assert.ok(enText.includes('TMD'));
});
