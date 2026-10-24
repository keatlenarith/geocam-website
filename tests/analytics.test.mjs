import test from "node:test";
import assert from "node:assert/strict";
import {
  createEmptyStore,
  recordEvent,
  computeAnalyticsReport,
  sanitizePath,
  getIctDateString,
} from "../src/features/analytics/analytics-core.ts";

test("sanitizePath: normalizes and cleans route paths", () => {
  assert.equal(sanitizePath("/"), "/");
  assert.equal(sanitizePath("/earthquake-monitoring?event=123#map"), "/earthquake-monitoring");
  assert.equal(sanitizePath("research///topic/"), "/research/topic");
  assert.equal(sanitizePath(""), "/");
});

test("recordEvent: tracks unique visitors, sessions, and pageviews correctly", () => {
  let store = createEmptyStore("2026-10-24T00:00:00.000Z");

  const date1 = new Date("2026-10-24T08:00:00+07:00");
  // Visitor A visits homepage
  store = recordEvent(
    store,
    { visitorId: "v_alice", sessionId: "s_alice_1", path: "/" },
    date1
  );

  // Visitor A visits earthquake monitoring in same session
  store = recordEvent(
    store,
    { visitorId: "v_alice", sessionId: "s_alice_1", path: "/earthquake-monitoring" },
    date1
  );

  // Visitor B visits homepage in a different session
  store = recordEvent(
    store,
    { visitorId: "v_bob", sessionId: "s_bob_1", path: "/" },
    date1
  );

  const report = computeAnalyticsReport(store, date1);

  // Today metrics:
  // 2 unique visitors (Alice, Bob)
  // 2 sessions (s_alice_1, s_bob_1)
  // 3 page views (2 Alice, 1 Bob)
  assert.equal(report.today.uniqueVisitors, 2);
  assert.equal(report.today.sessions, 2);
  assert.equal(report.today.pageViews, 3);

  // All time should match today because only 1 day has elapsed
  assert.equal(report.allTime.uniqueVisitors, 2);
  assert.equal(report.allTime.sessions, 2);
  assert.equal(report.allTime.pageViews, 3);

  // Most-viewed pages:
  // "/" had 2 views (67%)
  // "/earthquake-monitoring" had 1 view (33%)
  assert.equal(report.mostViewedPages[0].path, "/");
  assert.equal(report.mostViewedPages[0].views, 2);
  assert.equal(report.mostViewedPages[1].path, "/earthquake-monitoring");
  assert.equal(report.mostViewedPages[1].views, 1);
});

test("aggregateDays: deduplicates repeat visitors across multi-day windows", () => {
  let store = createEmptyStore("2026-10-20T00:00:00.000Z");

  const day1 = new Date("2026-10-23T10:00:00+07:00");
  const day2 = new Date("2026-10-24T10:00:00+07:00");

  // Day 1: Alice visits
  store = recordEvent(store, { visitorId: "v_alice", sessionId: "s_1", path: "/about" }, day1);

  // Day 2: Alice visits again with a new session, Bob visits too
  store = recordEvent(store, { visitorId: "v_alice", sessionId: "s_2", path: "/geopark" }, day2);
  store = recordEvent(store, { visitorId: "v_bob", sessionId: "s_3", path: "/geopark" }, day2);

  const report = computeAnalyticsReport(store, day2);

  // Day 2 (Today): 2 visitors, 2 sessions, 2 views
  assert.equal(report.today.uniqueVisitors, 2);
  assert.equal(report.today.sessions, 2);
  assert.equal(report.today.pageViews, 2);

  // 7-day window: Alice is deduplicated across the two days!
  // Distinct visitors: 2 (Alice, Bob)
  // Distinct sessions: 3 (s_1, s_2, s_3)
  // Total page views: 3
  assert.equal(report.last7Days.uniqueVisitors, 2);
  assert.equal(report.last7Days.sessions, 3);
  assert.equal(report.last7Days.pageViews, 3);
});

test("dailyTrend: outputs past 30 days including zero-traffic days", () => {
  let store = createEmptyStore("2026-10-24T00:00:00.000Z");
  const now = new Date("2026-10-24T12:00:00+07:00");

  store = recordEvent(store, { visitorId: "v_1", sessionId: "s_1", path: "/" }, now);

  const report = computeAnalyticsReport(store, now);
  assert.equal(report.dailyTrend.length, 30);
  assert.equal(report.dailyTrend[29].date, getIctDateString(now));
  assert.equal(report.dailyTrend[29].pageViews, 1);
  assert.equal(report.dailyTrend[0].pageViews, 0);
});
