import { chromium } from "playwright/test";
import assert from "node:assert/strict";

const base = process.env.SITE_URL || "http://127.0.0.1:3001";
const api = "https://pziwobqfysoadswgnjjm.supabase.co";

const browser = await chromium.launch({ channel: "chrome", headless: true });

let drafts = new Map();
let published = new Map();

const user = {
  id: "00000000-0000-4000-8000-000000000001",
  aud: "authenticated",
  role: "authenticated",
  email: "keatlenarith@gmail.com",
  email_confirmed_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  created_at: new Date().toISOString(),
};

const token = [
  "eyJhbGciOiJIUzI1NiJ9",
  Buffer.from(
    JSON.stringify({
      sub: user.id,
      role: "authenticated",
      aud: "authenticated",
      exp: Math.floor(Date.now() / 1000) + 3600,
    }),
  ).toString("base64url"),
  "test-signature",
].join(".");

async function setupContext() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
  await ctx.route(api + "/**", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const path = url.pathname;
    const admin = req.headers().authorization === "Bearer " + token;
    const send = (value, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(value),
      });

    if (path === "/auth/v1/token")
      return send({
        access_token: token,
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "test-refresh",
        user,
      });

    if (path === "/auth/v1/user") return send(user);
    if (path === "/rest/v1/rpc/geocam_is_admin") return send(admin);

    if (path === "/rest/v1/geocam_drafts") {
      if (req.method() === "GET") {
        return send({ id: "site", content: Object.fromEntries(drafts) });
      }
      if (req.method() === "POST") {
        const body = JSON.parse(req.postData() || "{}");
        if (body.content) {
          for (const [k, v] of Object.entries(body.content)) {
            drafts.set(k, v);
          }
        }
        return send([body], 201);
      }
    }

    if (path === "/rest/v1/geocam_published") {
      if (req.method() === "GET") {
        return send({ id: "site", content: Object.fromEntries(published) });
      }
      if (req.method() === "POST") {
        const body = JSON.parse(req.postData() || "{}");
        if (body.content) {
          for (const [k, v] of Object.entries(body.content)) {
            published.set(k, v);
          }
        }
        return send([body], 201);
      }
    }

    if (path === "/rest/v1/rpc/geocam_update_page_field") {
      const body = JSON.parse(req.postData() || "{}");
      const page = body.p_page;
      const key = body.p_key;
      const entry = body.p_entry;
      if (!drafts.has(page)) drafts.set(page, {});
      drafts.get(page)[key] = entry;
      if (!published.has(page)) published.set(page, {});
      published.get(page)[key] = entry;
      return send({ draft: Object.fromEntries(drafts), published: Object.fromEntries(published) });
    }

    if (path === "/rest/v1/rpc/geocam_publish_page_changes") {
      const body = JSON.parse(req.postData() || "{}");
      if (body.p_changes) {
        for (const [p, changes] of Object.entries(body.p_changes)) {
          if (!published.has(p)) published.set(p, {});
          const cur = published.get(p);
          for (const [k, val] of Object.entries(changes)) {
            if (val === null) delete cur[k];
            else cur[k] = val;
          }
        }
      }
      return send(Object.fromEntries(published));
    }

    return send([]);
  });

  await ctx.addInitScript(
    ({ token, user }) => {
      localStorage.setItem(
        "sb-pziwobqfysoadswgnjjm-auth-token",
        JSON.stringify({
          access_token: token,
          token_type: "bearer",
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          refresh_token: "test-refresh",
          user,
        }),
      );
    },
    { token, user },
  );

  return ctx;
}

try {
  console.log("=== Testing Image Resizing: Proportional Height & Persistence After Publish ===");
  const ctx = await setupContext();
  const page = await ctx.newPage();

  // 1. Visit /research/topic?id=tectonics
  console.log("Step 1: Navigating to /research/topic?id=tectonics as Admin…");
  await page.goto(`${base}/research/topic?id=tectonics`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Click Edit Page
  const editPageBtn = page.locator('button:has-text("Edit Page")').first();
  await editPageBtn.waitFor({ state: "visible", timeout: 5000 });
  await editPageBtn.click();
  await page.waitForTimeout(1000);

  // 2. Locate the narrow figure (Figure 15 or Figure 2)
  console.log("Step 2: Checking figure dimensions and vertical space…");
  const targetImg = page.locator('figure img[alt*="Figure 15"], figure img[alt*="រូបភាពទី ១៥"], figure img').first();
  await targetImg.waitFor({ state: "visible", timeout: 5000 });

  const initialHeight = await targetImg.evaluate((el) => el.getBoundingClientRect().height);
  const initialWidth = await targetImg.evaluate((el) => el.getBoundingClientRect().width);
  console.log(`Initial image size: ${initialWidth}px width × ${initialHeight}px height`);

  // Verify that img style height is auto (no arbitrary height stretching)
  const computedHeightStyle = await targetImg.evaluate((el) => el.style.height || getComputedStyle(el).height);
  console.log(`Initial img style.height: ${computedHeightStyle}`);

  // 3. Click 50% resize button on the image
  console.log("Step 3: Clicking 50% button on image controls bar…");
  const imgParent = targetImg.locator("..");
  const ctrlBar = page.locator(".geocam-img-controls-bar").first();
  await ctrlBar.waitFor({ state: "visible", timeout: 5000 });

  const btn50 = ctrlBar.locator(".geocam-ctrl-50");
  await btn50.click();
  await page.waitForTimeout(800);

  const widthAfter50 = await targetImg.evaluate((el) => el.getBoundingClientRect().width);
  const heightAfter50 = await targetImg.evaluate((el) => el.getBoundingClientRect().height);
  const heightStyleAfter50 = await targetImg.evaluate((el) => el.style.height);
  console.log(`After 50%: ${widthAfter50}px width × ${heightAfter50}px height, style.height='${heightStyleAfter50}'`);

  assert.equal(heightStyleAfter50, "auto", "Image style.height must be 'auto' to prevent dead vertical space!");
  assert(widthAfter50 < initialWidth, "Width must have decreased when 50% clicked");
  assert(heightAfter50 < initialHeight, "Height must have decreased proportionally (no empty vertical pillar)!");
  console.log("✓ 50% resize scaled proportionally with ZERO dead vertical space!");

  // 4. Click Publish Live
  console.log("Step 4: Publishing Live…");
  const publishLiveBtn = page.locator('button:has-text("Publish Live")').first();
  await publishLiveBtn.click();
  await page.waitForTimeout(2000);

  const statusMsg = await page.locator('[role="status"]').textContent();
  console.log(`Publish status: "${statusMsg?.trim()}"`);
  assert(statusMsg?.includes("Published live"), `Expected published live message, got ${statusMsg}`);
  console.log("✓ Resized image published successfully to database!");

  // 5. Reload the page to test persistence after publishing
  console.log("Step 5: Reloading page to verify format persists after publish…");
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // Check the image size again on fresh reload
  const reloadedImg = page.locator('figure img[alt*="Figure 15"], figure img[alt*="រូបភាពទី ១៥"], figure img').first();
  await reloadedImg.waitFor({ state: "visible", timeout: 5000 });

  const reloadedWidth = await reloadedImg.evaluate((el) => el.getBoundingClientRect().width);
  const reloadedStyleWidth = await reloadedImg.evaluate((el) => el.style.width);
  const reloadedStyleHeight = await reloadedImg.evaluate((el) => el.style.height);
  console.log(`Reloaded image: style.width='${reloadedStyleWidth}', style.height='${reloadedStyleHeight}', actual width=${reloadedWidth}px`);

  assert.equal(reloadedStyleWidth, "50%", "Persisted image width must remain '50%' after reload/publish!");
  assert.equal(reloadedStyleHeight, "auto", "Persisted image height must remain 'auto' with NO vertical space!");
  console.log("✓ FORMAT PERSISTED 100% AFTER RELOAD & PUBLISH!");

  // Take screenshot as visual proof
  const screenshotPath = "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/image_resize_persistent_no_height_gap.png";
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`✓ Screenshot saved to ${screenshotPath}`);

  await browser.close();
  console.log("=== ALL TESTS PASSED: PROPORTIONAL HEIGHT & PERSISTENCE VERIFIED ===");
} catch (err) {
  console.error("Test failed:", err);
  await browser.close();
  process.exit(1);
}
