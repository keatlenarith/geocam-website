import assert from "node:assert/strict";
import { chromium } from "playwright";

// Run against a local Vite dev server. Every external image request is blocked
// deliberately: poster generation and downloads must work without the map host.
const origin = process.argv[2] || "http://localhost:3012";
const browser = await chromium.launch({
  headless: true,
  channel: "chrome",
});
try {
  const page = await browser.newPage({ acceptDownloads: true });
  const errors = [];
  let publishedPoster;
  let sharedPoster;
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/poster-regression-check", route => route.fulfill({
    contentType: "text/html", body: '<!doctype html><html><body><div id="test"></div></body></html>',
  }));
  await page.route("https://server.arcgisonline.com/**", route => route.abort());
  await page.route("**/src/admin/Auth.tsx", route => route.fulfill({contentType:"text/javascript",body:"export function useAdmin() { return { admin: true }; }"}));
  await page.route("**/api/facebook-publisher", route => {
    publishedPoster = route.request().postDataJSON();
    return route.fulfill({contentType:"application/json",body:JSON.stringify({success:true,postUrl:"https://www.facebook.com/105049257586051/posts/mock-poster"})});
  });
  await page.route("**/api/earthquake-poster",route=>{sharedPoster=route.request().postDataJSON();return route.fulfill({contentType:"application/json",body:JSON.stringify({url:`https://geocam.site/api/earthquake-poster?id=${'a'.repeat(64)}`})});});
  await page.route("**/geocam-logo.png", route => route.abort());
  await page.goto(`${origin}/poster-regression-check`);
  await page.evaluate(async () => {
    localStorage.setItem("geocam_facebook_settings", JSON.stringify({pageId:"105049257586051",accessToken:"mock-page-token"}));
    const refresh = await import("/@react-refresh");
    refresh.default.injectIntoGlobalHook(window);
    window.$RefreshReg$ = () => {};
    window.$RefreshSig$ = () => type => type;
    window.__vite_plugin_react_preamble_installed__ = true;
    await import("/src/styles.css");
    const mainSource = await (await fetch("/src/main.tsx")).text();
    const reactPath = mainSource.match(/from ["']([^"']*\/react\.js[^"']*)["']/)?.[1];
    const domPath = mainSource.match(/from ["']([^"']*\/react-dom_client\.js[^"']*)["']/)?.[1];
    if (!reactPath || !domPath) throw new Error("Cannot resolve the app's React module instances");
    const react = await import(reactPath);
    const React = react.default || react;
    const dom = await import(domPath);
    const { EarthquakePosterModal } = await import("/src/features/earthquakes/EarthquakePosterModal.tsx");
    const event = { id: "poster-regression-one", latitude: 16, longitude: 100,
      originTime: "2026-10-31T06:00:00Z", firstSeenAt: "2026-10-31T06:01:00Z",
      magnitude: 4.2, depthKm: 12, location: "Thailand", reports: [] };
    function Harness() {
      const [open, setOpen] = React.useState(false);
      const [current, setCurrent] = React.useState(event);
      return React.createElement(React.Fragment, null,
        React.createElement("button", { onClick: () => setOpen(true) }, "Open poster test"),
        React.createElement("button", { onClick: () => setCurrent({ ...event, id: "poster-regression-two", magnitude: 5.1 }) }, "Switch event test"),
        React.createElement(EarthquakePosterModal, { event: current, isOpen: open, onClose: () => setOpen(false) }));
    }
    (dom.createRoot || dom.default.createRoot)(document.getElementById("test")).render(React.createElement(Harness));
  });
  await page.waitForTimeout(200);
  assert.deepEqual(errors, [], "Test harness must mount before the open transition");
  await page.getByRole("button", { name: "Open poster test" }).click();
  await page.waitForTimeout(300);
  assert.deepEqual(errors, [], "Opening a previously closed modal must not crash React");
  await page.getByText("Ready-to-Post Earthquake Bulletin & Poster", { exact: true }).waitFor();
  await page.waitForFunction(() => document.querySelector('img[src^="data:image/png"]')?.naturalWidth === 1200);
  const firstImage = await page.locator('img[src^="data:image/png"]').getAttribute("src");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download poster (PNG)", exact: true }).click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), "GeoCam-Earthquake-Bulletin-poster-regression-one.png");
  const stream = await download.createReadStream();
  const chunks = []; for await (const chunk of stream) chunks.push(chunk);
  const png = Buffer.concat(chunks);
  assert.equal(png.subarray(1, 4).toString(), "PNG");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  const caption = await page.locator("pre").innerText();
  await page.evaluate(()=>{
    Object.defineProperty(navigator,"canShare",{configurable:true,value:()=>true});
    window.nativeShareCalls=0;
    Object.defineProperty(navigator,"share",{configurable:true,value:()=>{window.nativeShareCalls++;return Promise.reject(new DOMException("Blocked by browser","NotAllowedError"));}});
    window.open=()=>null;
  });
  assert.equal(await page.evaluate(()=>window.nativeShareCalls),0,"Never open the broken Windows share sheet");
  assert.equal(await page.getByRole("button",{name:"Share link manually on Facebook",exact:true}).isVisible(),false,"Manual sharing stays collapsed");
  await page.getByText("More options",{exact:true}).click();
  await page.getByRole("button",{name:"Share link manually on Facebook",exact:true}).click();
  await page.getByRole("link",{name:"Open generated poster ↗"}).waitFor();
  assert.equal(sharedPoster.posterDataUrl,firstImage);
  assert.equal(sharedPoster.caption,caption);
  assert.match(await page.getByRole("link",{name:"Open generated poster ↗"}).getAttribute("href"),/\/api\/earthquake-poster\?id=/);
  await page.getByRole("button", {name:"Post to GeoCam101",exact:true}).click();
  await page.getByRole("link", {name:"View Facebook post ↗"}).waitFor();
  assert.equal(await page.getByRole("button",{name:"Confirm publish",exact:true}).count(),0,"Direct Page publishing must not open another confirmation step");
  assert.equal(publishedPoster.posterDataUrl, firstImage, "Publish the displayed PNG without regenerating it");
  assert.equal(publishedPoster.message, caption, "Caption must be unchanged");
  // Simulate a parent prop update while the modal intentionally blocks the page.
  await page.getByRole("button", { name: "Switch event test" }).evaluate(button=>button.click());
  await page.waitForFunction(old => document.querySelector('img[src^="data:image/png"]')?.src !== old, firstImage);
  await page.evaluate(()=>{const value=JSON.parse(localStorage.getItem('geocam_facebook_settings'));value.accessToken='';localStorage.setItem('geocam_facebook_settings',JSON.stringify(value));});
  await page.getByRole('button',{name:'Post to GeoCam101',exact:true}).click();
  const visibleError=page.getByRole('alert').filter({hasText:'Page Access Token'});
  await visibleError.waitFor({timeout:3000});
  assert.ok(await visibleError.evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'Publishing errors must stay visible next to the action buttons');
  await page.getByRole("button", { name: "Close poster" }).click();
  await page.getByRole("button", { name: "Open poster test" }).click();
  await page.getByRole("button", { name: "Download poster (PNG)", exact: true }).waitFor();
  assert.deepEqual(errors, [], "Switching events and reopening must not crash React");
  console.log("PASS: opening, PNG download, in-page sharing without OS dialogs, exact poster share link, confirmed Page publish, switching and reopening (all remote actions mocked).");
} finally {
  await browser.close();
}
