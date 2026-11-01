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

test("poster publishing uploads the exact PNG bytes with the unchanged caption", async (t) => {
  const png = Buffer.from('89504e470d0a1a0a0000000d49484452000004b000000276', 'hex');
  const caption = 'ដំណឹងរញ្ជួយដី\nExact caption #GeoCam';
  const requests=[];let result;
  t.mock.method(globalThis,'fetch',async(url,options)=>{requests.push({url,body:options.body});return {ok:true,json:async()=>({id:requests.length===1?'photo123':'105049257586051_post123'})};});
  await publisher({method:'POST',body:{accessToken:'page-test-token',posterDataUrl:`data:image/png;base64,${png.toString('base64')}`,message:caption}}, {setHeader(){},status(){return this;},json(value){result=value;}});
  assert.equal(requests.length,2);
  assert.match(requests[0].url,/\/photos$/);assert.ok(requests[0].body instanceof FormData);
  assert.equal(requests[0].body.get('caption'),caption);
  assert.equal(requests[0].body.get('published'),'false');
  assert.deepEqual(Buffer.from(await requests[0].body.get('source').arrayBuffer()),png);
  assert.match(requests[1].url,/\/feed$/);
  const post=new URLSearchParams(requests[1].body);
  assert.equal(post.get('message'),caption);
  assert.deepEqual(JSON.parse(post.get('attached_media[0]')),{media_fbid:'photo123'});
  assert.equal(result.postId,'105049257586051_post123');
});

test("poster upload cannot use server credentials without a supplied Page token",async(t)=>{
  let fetched=false,result;
  t.mock.method(globalThis,'fetch',async()=>{fetched=true;return {ok:true,json:async()=>({id:'unexpected'})};});
  await publisher({method:'POST',body:{posterDataUrl:'data:image/png;base64,aGVsbG8=',message:'Test'}},{setHeader(){},status(){return this;},json(v){result=v;}});
  assert.equal(fetched,false);assert.equal(result.success,false);
});

test("blank poster captions are rejected before uploading",async(t)=>{
  let result;
  t.mock.method(globalThis,'fetch',async()=>{throw Error('Must not upload a captionless poster');});
  await publisher({method:'POST',body:{accessToken:'mock-token',posterDataUrl:'data:image/png;base64,aGVsbG8=',message:'   '}},{setHeader(){},status(){return this;},json(v){result=v;}});
  assert.equal(result.success,false);assert.match(result.error,/caption is empty/);
});

test("a failed feed publish is not reported as a successfully published poster",async(t)=>{
  let requests=0,result;
  const png=Buffer.from('89504e470d0a1a0a','hex');
  t.mock.method(globalThis,'fetch',async()=>{requests++;return requests===1?{ok:true,json:async()=>({id:'unpublished-photo'})}:{ok:false,json:async()=>({error:{code:200,message:'Missing posting permission'}})};});
  await publisher({method:'POST',body:{accessToken:'mock-token',posterDataUrl:`data:image/png;base64,${png.toString('base64')}`,message:'Full generated caption'}},{setHeader(){},status(){return this;},json(v){result=v;}});
  assert.equal(requests,2);assert.equal(result.success,false);assert.equal(result.postUrl,undefined);
});
