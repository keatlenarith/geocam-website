import { chromium } from "playwright/test";
import assert from "node:assert/strict";

const base = process.env.SITE_URL || "http://127.0.0.1:3001";
const api = "https://pziwobqfysoadswgnjjm.supabase.co";

const browser = await chromium.launch({ channel: "chrome", headless: true });

// Fetch real published content from live Supabase to simulate realistic 9.8MB database state
import { createClient } from "@supabase/supabase-js";
const liveSupabase = createClient(api, "sb_publishable_nTv_9GZCp9yfDXIasl2D7Q_JsPbHzcc");
const { data: liveData } = await liveSupabase.from("geocam_published").select("content").eq("id", "site").single();

const realDbContent = liveData?.content || {};
const initialSize = JSON.stringify(realDbContent).length;
console.log(`Live DB content size at start: ${initialSize} bytes (${(initialSize / 1024 / 1024).toFixed(2)} MB)`);

let currentDraftContent = structuredClone(realDbContent);
let currentPubContent = structuredClone(realDbContent);
let checkConstraintViolations = 0;

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
        return send({ id: "site", content: currentDraftContent });
      }
      if (req.method() === "POST") {
        const body = JSON.parse(req.postData() || "{}");
        const bodyLen = JSON.stringify(body.content || {}).length;
        console.log(`Supabase POST geocam_drafts received content length: ${bodyLen} bytes`);
        // Simulate EXACT PostgreSQL check constraint: octet_length(content::text) <= 10000000
        if (bodyLen > 10000000) {
          checkConstraintViolations++;
          return send(
            {
              code: "23514",
              message: 'new row for relation "geocam_drafts" violates check constraint "geocam_drafts_content_check"',
            },
            400,
          );
        }
        currentDraftContent = body.content || {};
        return send([body], 201);
      }
    }

    if (path === "/rest/v1/geocam_published") {
      if (req.method() === "GET") {
        return send({ id: "site", content: currentPubContent });
      }
      if (req.method() === "POST") {
        const body = JSON.parse(req.postData() || "{}");
        const bodyLen = JSON.stringify(body.content || {}).length;
        console.log(`Supabase POST geocam_published received content length: ${bodyLen} bytes`);
        if (bodyLen > 10000000) {
          return send(
            {
              code: "23514",
              message: 'new row for relation "geocam_published" violates check constraint "geocam_published_content_check"',
            },
            400,
          );
        }
        currentPubContent = body.content || {};
        return send([body], 201);
      }
    }

    if (path === "/rest/v1/rpc/geocam_update_page_field") {
      const body = JSON.parse(req.postData() || "{}");
      // Check length with simulated addition
      const simulatedLen = JSON.stringify(currentDraftContent).length + JSON.stringify(body.p_entry).length;
      if (simulatedLen > 10000000) {
        checkConstraintViolations++;
        return send(
          {
            code: "23514",
            message: 'new row for relation "geocam_drafts" violates check constraint "geocam_drafts_content_check"',
          },
          400,
        );
      }
      return send({ draft: currentDraftContent, published: currentPubContent });
    }

    if (path === "/rest/v1/rpc/geocam_publish_page_changes") {
      return send(currentPubContent);
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
  console.log("=== Testing Fix for geocam_drafts_content_check ===");
  const ctx = await setupContext();
  const page = await ctx.newPage();

  // 1. Visit /research/topic?id=tectonics as Admin
  console.log("Step 1: Navigating to /research/topic?id=tectonics as Admin…");
  await page.goto(`${base}/research/topic?id=tectonics`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Click "Edit Page"
  const editPageBtn = page.locator('button:has-text("Edit Page")').first();
  await editPageBtn.waitFor({ state: "visible", timeout: 5000 });
  await editPageBtn.click();
  await page.waitForTimeout(1000);

  // 2. Perform in-website edit (e.g. click + Insert Word or edit text)
  console.log("Step 2: Inserting a word into the page…");
  page.on("dialog", async (dialog) => {
    await dialog.accept("Geotectonic");
  });

  const insertWordBtn = page.locator('button:has-text("+ Insert Word")').first();
  await insertWordBtn.waitFor({ state: "visible", timeout: 5000 });
  await insertWordBtn.click();
  await page.waitForTimeout(1500);

  // 3. Click Publish Live
  console.log("Step 3: Clicking Publish Live…");
  const publishBtn = page.locator('button:has-text("Publish Live")').first();
  await publishBtn.waitFor({ state: "visible", timeout: 5000 });
  await publishBtn.click();
  await page.waitForTimeout(2500);

  // 4. Verify no geocam_drafts_content_check error is displayed
  const statusEl = page.locator('[role="status"]');
  const statusText = (await statusEl.textContent()) || "";
  console.log(`Status message: "${statusText.trim()}"`);

  const hasConstraintError = statusText.includes("violates check constraint") || statusText.includes("geocam_drafts_content_check");
  assert.equal(hasConstraintError, false, `Must NOT show geocam_drafts_content_check error! Got: ${statusText}`);

  const finalLen = JSON.stringify(currentDraftContent).length;
  console.log(`Final sanitized draft size: ${finalLen} bytes (${(finalLen / 1024 / 1024).toFixed(2)} MB)`);
  assert(finalLen < 10000000, `Draft size must be under 10MB! Got ${finalLen}`);

  const screenshotPath = "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/content_check_fixed_success.png";
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`✓ Screenshot saved to ${screenshotPath}`);

  await browser.close();
  console.log("=== CHECK CONSTRAINT FIX FULLY VERIFIED WITH 100% SUCCESS ===");
} catch (err) {
  console.error("Test failed:", err);
  await browser.close();
  process.exit(1);
}
