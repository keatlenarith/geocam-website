import { test } from "node:test";
import assert from "node:assert/strict";
import * as facebook from "../src/lib/facebook-service.ts";
import publisher from "../api/facebook-publisher.ts";
import {
  FACEBOOK_PAGE_ID,
  FACEBOOK_PAGE_URL,
  getDefaultFacebookSettings,
} from "../src/lib/facebook-service.ts";

test("Facebook Service has correct Page ID and URL configured", () => {
  assert.equal(FACEBOOK_PAGE_ID, "105049257586051");
  assert.equal(FACEBOOK_PAGE_URL, "https://www.facebook.com/geoscience.cambodia/");
});

test("Default settings enable auto-post for articles, events, news, and earthquakes", () => {
  const defaults = getDefaultFacebookSettings();
  assert.equal(defaults.pageId, "105049257586051");
  assert.equal(defaults.autoPostArticles, true);
  assert.equal(defaults.autoPostEvents, true);
  assert.equal(defaults.autoPostNews, true);
  assert.equal(defaults.autoPostEarthquakes, true);
  assert.equal(defaults.minEarthquakeMagnitude, 3.5);
  assert.equal(defaults.regionalEarthquakesOnly, true);
});

test("blank browser tokens fall back to the server token without exposing it", async (t) => {
  const previous = process.env.FB_PAGE_ACCESS_TOKEN;
  process.env.FB_PAGE_ACCESS_TOKEN = "server-test-secret";
  t.after(() => { if (previous === undefined) delete process.env.FB_PAGE_ACCESS_TOKEN; else process.env.FB_PAGE_ACCESS_TOKEN = previous; });
  const requests = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    requests.push({url, options});
    return {ok:true, json:async () => ({id:"105049257586051_123"})};
  });
  for (const token of [undefined, "", "   "]) {
    let payload;
    const res = {setHeader(){}, status(){return this;}, json(value){payload=value;return this;}};
    await publisher({method:"POST",body:{accessToken:token,message:"Mocked connectivity test"}}, res);
    assert.equal(payload.success, true);
    assert.equal(new URLSearchParams(requests.at(-1).options.body).get("access_token"), "server-test-secret");
    assert.equal(JSON.stringify(payload).includes("server-test-secret"), false);
  }
});

test("browser tokens still override server credentials", async (t) => {
  let sent;
  t.mock.method(globalThis,"fetch",async (_url,options) => {sent=new URLSearchParams(options.body).get("access_token");return {ok:true,json:async()=>({id:"105049257586051_456"})};});
  await publisher({method:"POST",body:{accessToken:"  browser-test-secret  ",message:"Test"}}, {setHeader(){},status(){return this;},json(){return this;}});
  assert.equal(sent,"browser-test-secret");
});

test("connection status reports server configuration without retrieving credentials", async (t) => {
  assert.equal(typeof facebook.getFacebookPublisherStatus, "function");
  t.mock.method(globalThis,"fetch",async (url,options) => {
    assert.equal(url,"/api/facebook-publisher");
    assert.equal(options.cache,"no-store");
    return {ok:true,json:async()=>({status:"active",pageId:FACEBOOK_PAGE_ID,hasServerToken:true})};
  });
  assert.deepEqual(await facebook.getFacebookPublisherStatus(), {pageId:FACEBOOK_PAGE_ID,hasServerToken:true});
});

test("unavailable status is an error rather than a missing-token result", async (t) => {
  assert.equal(typeof facebook.getFacebookPublisherStatus, "function");
  t.mock.method(globalThis,"fetch",async()=>({ok:false}));
  await assert.rejects(facebook.getFacebookPublisherStatus(), /Unable to check/);
});
