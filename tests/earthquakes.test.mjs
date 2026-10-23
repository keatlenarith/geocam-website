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
  deduplicateEvents,
  filterEarthquakes,
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
  assert.ok(kmText.includes('central Thailand'));
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
