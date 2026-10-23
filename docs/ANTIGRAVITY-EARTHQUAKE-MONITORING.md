# GeoCam — Earthquake monitoring

Implementation brief for Antigravity · 23 October 2026

## Request

Create a new public page named **Earthquake monitoring** at `/earthquake-monitoring`. Display recent reported earthquakes in Cambodia and surrounding countries, with an interactive map and short announcements. Show the announcements on both this page and the homepage.

Use a modern, futuristic dashboard interface while keeping the same colors, typography, header, and footer as the current homepage. Build within the existing GeoCam application.

This document is an implementation handoff. The feature has not been implemented by this document. Source choices and defaults below are recommendations unless explicitly identified as user requirements.

## Existing project

- Working checkout: `D:\9-Database Information\GeoCam Website\geocam-website`.
- React 19, TypeScript, Vite, Tailwind CSS, Lucide icons; Leaflet and MapLibre are already installed.
- Routing: `src/main.tsx` uses an explicit `pages` mapping. Adding a route file alone does not register a page.
- Navigation: `src/components/site/Chrome.tsx`; add the page under **Geoscience & Data**, including mobile navigation.
- Homepage: `src/routes/index.tsx`.
- Styling: `src/styles.css`.
- Language context: `src/lib/i18n.tsx`; follow existing English/Khmer conventions.
- Read `docs/ANTIGRAVITY-HANDOFF.md` before changes. Preserve its authentication, publishing, translation, and CMS contracts.
- Preserve unrelated work and check the current checkout state before editing. Do not work in the separate publishing-safeguards checkout for this UI task.

## Visual direction

Use a scientific observation console: a strong title, compact status indicators, fine grid lines, rounded panels, subtle gradients, and a large map. The result should feel precise and contemporary, with clear reading hierarchy.

The stylesheet contains older green styles followed by blue overrides. Match the **current computed homepage appearance**, not an obsolete theme declaration. Existing blue overrides include:

| Role | Existing color |
| --- | --- |
| Primary action | `#2457d6` |
| Hero navy | `#142a51` |
| Body text | `#1d2b42` |
| Highlight | `#b6d2ff` |
| Soft section background | `#f5f7fc` |
| Panel background | `#ffffff` |
| Border | `#e1e6ef` |

Reuse existing semantic tokens where suitable. Scope added styles to the earthquake components. Verify against the actual homepage because theme overrides may change before implementation. Do not add an unrelated neon palette or change global branding.

Use magnitude labels and marker sizes alongside any warning colors. Color alone must not convey event magnitude or status. Avoid perpetual flashing; respect reduced-motion preferences.

## Page layout

### 1. Intro and source status

- Title: **Earthquake monitoring**.
- Subtitle: “Recent reported earthquakes in Cambodia and surrounding countries.”
- Small regional-monitoring label, last successful refresh time, and manual refresh button.
- State clearly: “Automatically refreshed reports. Preliminary event details may be revised.”
- Indicate each provider's actual state: loading, available, delayed, or unavailable.
- A successful request with no matching events is different from a failed request.

### 2. Summary cards

Show the number of events in the selected time window, the largest reported magnitude, and the latest event time. All cards must use the same geographic/time filters as the map and list. Use an em dash for missing values. Do not describe event counts as risk scores.

### 3. Map and event panel

Desktop: map takes roughly two-thirds of the row, event panel one-third. Mobile: stack the map and event list; keep controls reachable without horizontal scrolling.

- Center initial view on Cambodia with neighboring countries visible.
- Recommended initial regional envelope: latitude 5–25°N, longitude 92–112°E. Label it “Cambodia & region”; this includes wider regional context, not only countries bordering Cambodia.
- Render magnitude-sized epicenter markers with a visible legend and clear selected state.
- Clicking a marker selects its event card; selecting a card centers the map and opens event details.
- Popup/card: magnitude and magnitude type if supplied, source location name, local time, depth, coordinates, provider, review status if supplied, and original bulletin link.
- Maintain readable geographic context and map attribution. Use an approved basemap consistent with existing map usage and provider terms.
- Provide a usable textual list even when map tiles fail.
- Lazy-load the map on the dedicated page; the homepage announcement component must not download the map library.

### 4. Filters

- Time window: 24 hours, 7 days, 30 days; default 7 days.
- Minimum magnitude: all reported, 2+, 3+, 4+, 5+.
- Source selection where implemented.
- Sort newest first, with an optional largest magnitude sort.
- Provide reset filters and a clear empty state.
- Do not offer a period as complete if a source's recent feed does not cover it. Either fetch supported history, disable the unsupported choice for that source, or explicitly label partial coverage.
- Do not label an event as “in Cambodia” using a rough bounding rectangle. Use a verified boundary dataset for country classification, or display the provider location text and neutral regional label.

### 5. Event announcements

Show a “Latest earthquake updates” feed on this page. Generate short, factual messages from normalized provider fields, rather than using an AI text-generation service.

Template:

> M{magnitude} earthquake reported near {location} at {time} ICT on {date}. Depth: {depth} km. Source: {provider}.

Omit unavailable fields gracefully. Preserve source magnitude type and do not infer damage, felt intensity, or tsunami danger from magnitude or depth alone. Do not claim that a nearby event was felt in Cambodia unless an official report says so.

Clearly distinguish the earthquake origin time from when GeoCam first received the report. Mark newly received events as “New” for a short, consistent period; do not mark every historical event new on initial page load. Revised reports update the existing item instead of creating another announcement.

### 6. Source notes

Explain geographic coverage, reporting delays, preliminary revisions, and any partial source availability. Attribute each provider and link to its official service. Present the page as monitoring of reported events, not earthquake prediction or an emergency early-warning system.

## Homepage integration

Add a compact **Earthquake monitoring** section after the hero and before the existing platform cards, adjusting spacing to match the homepage.

- Show up to three newest regional announcements and a link to `/earthquake-monitoring`.
- Include last successful refresh and source availability.
- Clicking an announcement opens the monitoring page with that event selected, using a URL query such as `?event=<encoded-id>`.
- Use the same data layer, event identities, and message formatter as the dedicated page.
- Preserve existing community news and upcoming events. These live announcements do not need to become permanent CMS News articles.
- Show an honest loading, empty, stale, or unavailable state; never insert fabricated earthquakes to fill space.

## Sources and access strategy

### Thailand: Thai Meteorological Department (TMD)

Recommended regional provider. Its official listings include Thailand and regional events such as Myanmar, Laos, and Vietnam.

- Monitoring: https://earthquake.tmd.go.th/
- Official feed directory: https://earthquake.tmd.go.th/rss.html
- Published geographic RSS feed: https://earthquake.tmd.go.th/feed/rss_tmd.xml
- Published local RSS feed: https://earthquake.tmd.go.th/feed/rss_inside.xml

Before implementation, retrieve actual XML and verify field names, coordinates, depth, timestamps, identifiers, update behavior, feed coverage, attribution requirements, and browser CORS. The feed directory and regional listing were checked during preparation; the XML contents and cross-origin browser access have not been validated. Do not invent a JSON API.

Use the time-zone information actually supplied by the feed. TMD local time is UTC+7, matching Cambodia, but never assume every date field is local time.

### USGS: complementary global coverage

- GeoJSON documentation: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
- Seven-day feed: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
- Thirty-day feed: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson
- Catalog query documentation: https://earthquake.usgs.gov/fdsnws/event/1/

Use documented GeoJSON feeds where practical, filter by the regional envelope, and normalize timestamps and coordinates. USGS documents minute updates for these feeds. Do not imply that the catalog captures every small regional earthquake.

### Vietnam: candidate supplementary source

Official bulletin listing: https://igp-vast.vn/index.php/en/earthquake-news

The listing publishes earthquake reports, but a dependable automated feed has not been confirmed. Investigate only official published interfaces and usage conditions. Include a source link initially; enable automated ingestion only after verifying a stable supported retrieval method. Do not make Vietnam scraping a prerequisite for releasing the working TMD/USGS integration.

### PHIVOLCS

https://earthquake.phivolcs.dost.gov.ph/

Its public bulletins focus on Philippine events. It is not the recommended primary provider for Cambodia. An optional official reference link is sufficient for this scope.

### Access architecture

Prefer **a shared cached feed endpoint** that fetches supported providers server-side and returns normalized events to both UI surfaces. This avoids relying on browser access to regional RSS and prevents every visitor from repeatedly requesting each upstream source.

Inspect the deployment and existing backend before selecting the endpoint implementation. Vite's development proxy alone is not a production backend. If browser CORS permits direct requests, a shared client cache can support a simpler deployment, with explicit limits. If TMD requires server access, implement and document the appropriate deployed endpoint; do not use an anonymous public CORS proxy.

Keep providers independent: if TMD is unavailable, show available USGS data and label TMD unavailable. Never attribute USGS data to TMD or report a failed provider as having zero earthquakes. Honor documented rate limits and provider terms.

Recommended refresh: once per 60 seconds while the page is visible, with timeout, bounded backoff, request cancellation, and no overlapping requests. Pause polling when hidden and refresh when returning. Preserve cached data after transient failure and show its age. Do not display a “Live” success badge solely because a timer is running.

## Normalization and deduplication

Recommended normalized fields:

```ts
type EarthquakeEvent = {
  id: string;                 // stable GeoCam identifier
  originTime: string;         // ISO 8601 UTC
  firstSeenAt: string;        // stable receipt time, not reset on each fetch
  updatedAt?: string;
  latitude: number;
  longitude: number;
  depthKm: number | null;
  magnitude: number | null;
  magnitudeType?: string;
  location: string;
  reviewStatus?: string;
  reports: Array<{
    provider: "TMD" | "USGS" | "VIETNAM";
    providerEventId: string;
    sourceUrl: string;
  }>;
};
```

Validate responses, finite coordinates, timestamp parsing, and nullable magnitudes. Accept numeric zero; do not treat it as missing. GeoJSON coordinates are longitude, latitude, depth. Display all visitor-facing event times in `Asia/Phnom_Penh` (ICT, UTC+7).

Deduplicate provider records by stable source identifiers first. Cross-provider matching must be conservative: nearby time and epicenter are candidate signals, not proof. Proposed initial matching tolerances are 60 seconds and 30 km; validate against actual overlapping reports and avoid merging distinct aftershocks. Preserve source provenance and differing reported values in event details. Document the preferred display-value rule instead of averaging magnitudes of different types.

Treat feed text as untrusted: render plain text, avoid injected upstream HTML, and validate official outbound URLs. A new source revision must retain the same public event link.

## Suggested code organization

- `src/routes/earthquake-monitoring.tsx`: page composition.
- `src/features/earthquakes/EarthquakeMap.tsx`: lazily loaded map.
- `src/features/earthquakes/EarthquakeAnnouncements.tsx`: reusable page/home feed.
- `src/features/earthquakes/EarthquakeEventCard.tsx`: accessible event details.
- `src/features/earthquakes/useEarthquakes.ts`: shared query/cache integration.
- `src/features/earthquakes/earthquake-data.ts`: models, validation, filtering, source normalization, and message generation.
- Production feed endpoint and cache in the backend appropriate to the verified hosting setup.

These filenames are suggestions. Reuse established project conventions and existing query/cache infrastructure where suitable. Do not add a new framework or AI dependency.

Only stable editorial headings should be CMS-editable. Do not capture live event lists, statistics, status timestamps, map controls, or provider data as static CMS content. Preserve existing publishing and authentication boundaries.

## Accessibility and localization

- English and Khmer UI labels using the existing language selector and fonts.
- Keep official place names when a reliable translation is unavailable.
- Keyboard-operable filters, refresh, event selection, and links; visible focus states.
- Screen-reader status announcements for meaningful new updates, without re-reading the entire list every minute.
- Sufficient contrast, readable labels, reduced-motion support, and no horizontal overflow at 375 px.
- List and map selections remain understandable without animation or color alone.

## Verification and delivery

Run the existing checks:

```sh
npm run check
npm test
npm run build
```

Add focused tests for source parsing/time zones, regional filtering, missing values, duplicate/revised events, and announcement formatting. Test realistic provider fixtures plus failed, malformed, and empty responses.

Verify in a browser on desktop and mobile:

1. Direct navigation and header/mobile links open `/earthquake-monitoring`.
2. Map markers and event cards select one another correctly; homepage links select the intended event.
3. Homepage and page use consistent events, source attribution, and local times.
4. A newly received event appears once; a revision updates it; initial history is not all marked new.
5. Filters update map, list, and statistics consistently, and unsupported history is disclosed.
6. One source failing preserves working sources; stale data shows age; all-source failure is never shown as “no earthquakes.”
7. Refresh, visibility changes, unmount, and retries do not leak timers or create overlapping requests.
8. Production feed access works on the actual hosting environment, not just localhost.
9. The page matches the current homepage palette, supports Khmer, and preserves existing homepage/news behavior.

Deliver a working implementation, screenshots of desktop/mobile page and homepage section, test results, and a short note identifying enabled sources, remaining coverage limits, and any deployment configuration required. Do not claim an unconfigured endpoint or unverified provider is working. Do not deploy or publish merely because this handoff exists; follow the user's actual deployment authorization.
