import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FACEBOOK_PAGE_ID,
  FACEBOOK_PAGE_URL,
  getDefaultFacebookSettings,
} from "../src/lib/facebook-service.ts";

test("Facebook Service has correct Page ID and URL configured", () => {
  assert.equal(FACEBOOK_PAGE_ID, "360240070266245");
  assert.equal(FACEBOOK_PAGE_URL, "https://www.facebook.com/geoscience.cambodia/");
});

test("Default settings enable auto-post for articles, events, news, and earthquakes", () => {
  const defaults = getDefaultFacebookSettings();
  assert.equal(defaults.pageId, "360240070266245");
  assert.equal(defaults.autoPostArticles, true);
  assert.equal(defaults.autoPostEvents, true);
  assert.equal(defaults.autoPostNews, true);
  assert.equal(defaults.autoPostEarthquakes, true);
  assert.equal(defaults.minEarthquakeMagnitude, 3.5);
  assert.equal(defaults.regionalEarthquakesOnly, true);
});
