import { chromium } from "playwright/test";
import assert from "node:assert/strict";

const base = process.env.SITE_URL || "http://127.0.0.1:3001";
const api = "https://pziwobqfysoadswgnjjm.supabase.co";

const browser = await chromium.launch({ channel: "chrome", headless: true });

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
    if (path === "/rest/v1/geocam_drafts") return send({ id: "site", content: {} });
    if (path === "/rest/v1/geocam_published") return send({ id: "site", content: {} });
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
  console.log("=== Testing Manual Image Cropping with Visible Edges and Handles ===");
  const ctx = await setupContext();
  const page = await ctx.newPage();

  // 1. Visit /research/topic?id=tectonics
  console.log("Step 1: Navigating to /research/topic?id=tectonics as Admin…");
  await page.goto(`${base}/research/topic?id=tectonics`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Click "Edit Page"
  const editPageBtn = page.locator('button:has-text("Edit Page")').first();
  await editPageBtn.waitFor({ state: "visible", timeout: 5000 });
  await editPageBtn.click();
  await page.waitForTimeout(600);

  // 2. Open Crop Tool on image
  console.log("Step 2: Triggering ✂️ Crop on featured image…");
  const cropBtn = page.locator(".geocam-ctrl-crop").first();
  await cropBtn.waitFor({ state: "visible", timeout: 5000 });
  await cropBtn.click();
  await page.waitForTimeout(1000);

  // 3. Verify Crop Modal & Visible Crop Edges
  console.log("Step 3: Checking Crop Modal elements and visible edges…");
  const cropModal = page.locator('[data-crop-modal="true"]');
  await cropModal.waitFor({ state: "visible", timeout: 5000 });

  const cropBox = page.locator('[data-crop-box="true"]');
  await cropBox.waitFor({ state: "visible", timeout: 5000 });
  console.log("✓ Interactive Crop Box is visible!");

  // Verify 4 visible crop edges
  const edgeN = page.locator('[data-crop-edge="n"]');
  const edgeS = page.locator('[data-crop-edge="s"]');
  const edgeW = page.locator('[data-crop-edge="w"]');
  const edgeE = page.locator('[data-crop-edge="e"]');

  assert(await edgeN.isVisible(), "North edge bar must be visible");
  assert(await edgeS.isVisible(), "South edge bar must be visible");
  assert(await edgeW.isVisible(), "West edge bar must be visible");
  assert(await edgeE.isVisible(), "East edge bar must be visible");
  console.log("✓ All 4 visible crop edges (N, S, W, E) are present with manual resize bars.");

  // Verify 4 visible corner handles
  const handleNW = page.locator('[data-crop-handle="nw"]');
  const handleNE = page.locator('[data-crop-handle="ne"]');
  const handleSW = page.locator('[data-crop-handle="sw"]');
  const handleSE = page.locator('[data-crop-handle="se"]');

  assert(await handleNW.isVisible(), "Top-Left handle must be visible");
  assert(await handleNE.isVisible(), "Top-Right handle must be visible");
  assert(await handleSW.isVisible(), "Bottom-Left handle must be visible");
  assert(await handleSE.isVisible(), "Bottom-Right handle must be visible");
  console.log("✓ All 4 corner resize handles are present.");

  // Step 4: Test Manual Dragging of Edge & Corner
  console.log("Step 4: Testing manual edge drag to resize crop box…");
  const initialBoxRect = await cropBox.boundingBox();
  console.log("Initial crop box size:", initialBoxRect.width, "x", initialBoxRect.height);

  // Drag the right edge (East) to the left to manually narrow the crop
  const edgeEBox = await edgeE.boundingBox();
  await page.mouse.move(edgeEBox.x + edgeEBox.width / 2, edgeEBox.y + edgeEBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(edgeEBox.x - 80, edgeEBox.y, { steps: 5 });
  await page.mouse.up();
  await page.waitForTimeout(400);

  const updatedBoxRect = await cropBox.boundingBox();
  console.log("Updated crop box size after manual edge drag:", updatedBoxRect.width, "x", updatedBoxRect.height);
  assert(updatedBoxRect.width < initialBoxRect.width, "Crop box width must have decreased after dragging edge");
  console.log("✓ Manual edge drag successfully resized the crop box!");

  // Step 5: Test center move drag
  console.log("Step 5: Testing manual move inside crop box…");
  await page.mouse.move(updatedBoxRect.x + updatedBoxRect.width / 2, updatedBoxRect.y + updatedBoxRect.height / 2);
  await page.mouse.down();
  await page.mouse.move(updatedBoxRect.x + updatedBoxRect.width / 2 + 30, updatedBoxRect.y + updatedBoxRect.height / 2 + 20, { steps: 5 });
  await page.mouse.up();
  await page.waitForTimeout(400);

  const movedBoxRect = await cropBox.boundingBox();
  assert(movedBoxRect.x > updatedBoxRect.x, "Crop box position X must have moved");
  console.log("✓ Manual center drag successfully moved the crop box!");

  // Step 6: Take screenshot showing visible crop edges and manual handles
  const screenshotPath = "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/manual_crop_edges_handles.png";
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`✓ Screenshot of manual crop edges saved to ${screenshotPath}`);

  // Step 7: Apply crop
  console.log("Step 7: Applying crop…");
  const applyBtn = page.locator('button:has-text("Apply Crop")');
  await applyBtn.click();
  await page.waitForTimeout(1000);

  // Verify modal closed
  assert.equal(await cropModal.isVisible(), false, "Crop modal should close after Apply Crop");
  console.log("✓ Apply Crop succeeded and modal closed.");

  await browser.close();
  console.log("=== ALL MANUAL CROP EDGE CHECKS PASSED WITH 100% SUCCESS ===");
} catch (err) {
  console.error("Test failed:", err);
  await browser.close();
  process.exit(1);
}
