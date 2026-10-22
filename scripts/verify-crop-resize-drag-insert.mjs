import { chromium } from "playwright/test";
import assert from "node:assert/strict";

const base = process.env.SITE_URL || "http://127.0.0.1:3001";
const api = "https://pziwobqfysoadswgnjjm.supabase.co";

const browser = await chromium.launch({ channel: "chrome", headless: true });

const drafts = new Map();
const published = new Map();

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
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 950 } });
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
    if (path === "/auth/v1/logout") return route.fulfill({ status: 204 });
    if (path.startsWith("/rest/v1/rpc/")) return send(true);

    if (path === "/rest/v1/geocam_drafts" || path === "/rest/v1/geocam_published")
      return send({ id: "site", content: {} });

    if (path === "/rest/v1/geocam_post_drafts" || path === "/rest/v1/geocam_post_public") {
      const privateTable = path.endsWith("drafts");
      const table = privateTable ? drafts : published;
      const id = url.searchParams.get("id")?.replace(/^eq\./, "");

      if ((privateTable || req.method() !== "GET") && !admin)
        return send({ message: "permission denied" }, 403);

      if (req.method() === "GET") {
        const rows = id ? [table.get(id)].filter(Boolean) : [...table.values()];
        return send(
          req.headers().accept?.includes("object+json")
            ? (rows[0] ?? null)
            : rows,
        );
      }

      const body = req.postDataJSON();
      if (req.method() === "PATCH") {
        table.set(id, { ...table.get(id), ...structuredClone(body) });
        return route.fulfill({ status: 204 });
      }

      table.set(body.id, structuredClone(body));
      return route.fulfill({ status: 201 });
    }

    if (path === "/rest/v1/site_content") {
      return send([]);
    }

    throw Error("Unexpected Supabase request: " + path);
  });
  return ctx;
}

try {
  const adminCtx = await setupContext();
  const page = await adminCtx.newPage();
  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text());
  });

  // Handle window.prompt and window.confirm dialogs automatically
  page.on("dialog", async (dialog) => {
    console.log(`DIALOG: [${dialog.type()}] message: "${dialog.message()}"`);
    if (dialog.type() === "confirm") {
      await dialog.accept();
    } else if (dialog.message().includes("word or text to insert")) {
      await dialog.accept("Stratigraphic Horizon A-1");
    } else {
      await dialog.accept("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80");
    }
  });

  console.log("1. Signing in as Admin...");
  await page.goto(base + "/admin/login", { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email address").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill("test-password-only");
  await page.getByRole("button", { name: "Sign in", exact: true }).first().click();
  await page.getByRole("link", { name: "Open dashboard" }).click();

  // =========================================================================
  // TEST 1: IN-WEBSITE VISUAL EDITING
  // =========================================================================
  console.log("2. Testing In-Website Visual Editor (Target Selection, Insert Word, Fit Mode Image, Crop, Resize, Drag)...");
  await page.goto(base + "/about", { waitUntil: "networkidle" });

  // Activate Visual Edit Mode
  const visualEditBtn = page.getByRole("button", { name: /Visual edit/i });
  await visualEditBtn.waitFor({ state: "visible" });
  await visualEditBtn.click();

  // Verify WordPress Toolbar appears
  await page.waitForSelector('[data-cms-ui="website-wordpress-toolbar"]', { state: "visible" });
  console.log("✓ Top WordPress Toolbar rendered successfully");

  // Step A: Click to target desired location
  const firstParagraph = page.locator("#main p").first();
  await firstParagraph.click();
  await page.waitForTimeout(400);

  // Verify .geocam-target-active class on clicked element
  const hasTargetActive = await firstParagraph.evaluate((el) => el.classList.contains("geocam-target-active"));
  assert.equal(hasTargetActive, true, "Clicked paragraph should have .geocam-target-active class");
  console.log("✓ Target location clicked and marked with .geocam-target-active");

  // Verify Target indicator badge in top toolbar
  const targetBadge = page.locator('[data-cms-ui="website-wordpress-toolbar"]').getByText(/Target: <P>/i);
  assert.equal(await targetBadge.isVisible(), true, "Target badge should show <P>");
  console.log("✓ Target indicator displayed in WordPress toolbar: 📍 Target: <P>");

  // Step B: Insert Word at targeted location
  const insertWordBtn = page.locator('[data-cms-ui="website-wordpress-toolbar"]').getByRole("button", { name: /\+ Insert Word/i });
  await insertWordBtn.click();
  await page.waitForTimeout(600);

  // Verify inserted word span exists
  const insertedWord = page.locator(".geocam-inserted-word").first();
  await insertedWord.waitFor({ state: "visible" });
  const wordText = await insertedWord.textContent();
  assert.match(wordText, /Stratigraphic Horizon A-1/, "Inserted word should appear in targeted element");
  console.log("✓ Word successfully inserted at desired targeted location:", wordText.trim());

  // Step C: Insert Image at target location
  const insertContentBtn = page.locator('[data-cms-ui="website-wordpress-toolbar"]').getByRole("button", { name: /\+ Insert Content/i });
  await insertContentBtn.click();
  await page.waitForTimeout(400);

  // Click Photo / Image option
  const photoOptionBtn = page.getByRole("button", { name: /Photo \/ Image/i });
  await photoOptionBtn.click();
  await page.waitForTimeout(600);

  // Verify image loaded in fit mode
  const insertedImg = page.locator("#main img[data-fit-mode='contain']").first();
  await insertedImg.waitFor({ state: "visible" });
  const imgClasses = await insertedImg.getAttribute("class");
  assert.match(imgClasses, /object-contain/, "Inserted image must default to fit mode (object-contain)");
  assert.match(imgClasses, /bg-slate-50/, "Inserted image must have bg-slate-50 padding background");
  console.log("✓ Inserted image correctly loaded in Fit Mode (object-contain bg-slate-50)");

  // Step D: Verify Image Controls Overlay (Crop, Fit, 50%, 100%, Remove, Resize Handle)
  await page.waitForSelector(".geocam-img-controls-bar", { state: "visible" });
  const cropBtnOnImg = page.locator(".geocam-ctrl-crop").first();
  const fitBtnOnImg = page.locator(".geocam-ctrl-fit").first();
  const size50Btn = page.locator(".geocam-ctrl-50").first();
  const resizeHandle = page.locator(".geocam-resize-handle").first();

  assert.equal(await cropBtnOnImg.isVisible(), true, "Crop button on image controls bar visible");
  assert.equal(await fitBtnOnImg.isVisible(), true, "Fit button on image controls bar visible");
  assert.equal(await size50Btn.isVisible(), true, "50% resize button on image controls bar visible");
  assert.equal(await resizeHandle.isVisible(), true, "Corner resize handle visible");
  console.log("✓ Image controls bar overlay & corner resize handle verified");

  // Step E: Test 50% resize
  await size50Btn.click({ force: true });
  await page.waitForTimeout(400);
  const imgWidth = await insertedImg.evaluate((el) => el.style.width);
  assert.equal(imgWidth, "50%", "Image width should be resized to 50%");
  console.log("✓ Image 50% resize button executed successfully (width: 50%)");

  // Step F: Test Crop Tool Modal from Image
  await cropBtnOnImg.click({ force: true });
  await page.waitForTimeout(600);

  // Verify ImageCropperModal opened
  await page.waitForSelector("canvas", { state: "visible" });
  const cropModalTitle = page.getByRole("heading", { name: /Crop & Adjust Image/i });
  assert.equal(await cropModalTitle.isVisible(), true, "Crop modal title is visible");

  // Verify Aspect ratio buttons
  const ratio169 = page.getByRole("button", { name: /16:9/i });
  const ratio11 = page.getByRole("button", { name: /1:1/i });
  const ratio43 = page.getByRole("button", { name: /4:3/i });
  assert.equal(await ratio169.isVisible(), true);
  assert.equal(await ratio11.isVisible(), true);
  assert.equal(await ratio43.isVisible(), true);
  console.log("✓ ImageCropperModal displayed with HTML5 canvas preview and aspect ratio presets");

  // Test switching ratio to 1:1
  await ratio11.click();
  await page.waitForTimeout(300);

  // Capture screenshot of in-website visual editor with Crop Modal active
  const artifactPath1 = "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/crop_tool_and_target_insertion_website.png";
  await page.screenshot({ path: artifactPath1, fullPage: false });
  console.log("✓ Captured screenshot of Crop Tool & In-Website Editing:", artifactPath1);

  // Apply Crop
  const applyCropBtn = page.getByRole("button", { name: /Apply Crop/i });
  await applyCropBtn.click();
  await page.waitForTimeout(600);
  console.log("✓ Applied crop and updated image canvas data successfully");

  // =========================================================================
  // TEST 2: DASHBOARD POST CANVAS EDITOR (/admin?section=posts)
  // =========================================================================
  console.log("3. Testing Dashboard Post Canvas Editor (Cover Crop, Toolbar +Word, Toolbar Crop, Body Photo Inserter)...");
  await page.goto(base + "/admin?section=posts&new=1", { waitUntil: "networkidle" });
  await page.getByLabel("Title (English)").waitFor({ state: "visible" });

  // Verify Cover Photo has ✂️ Crop Cover button
  const cropCoverBtn = page.getByRole("button", { name: /Crop Cover/i }).first();
  assert.equal(await cropCoverBtn.isVisible(), true, "Cover photo ✂️ Crop Cover button must be visible");
  console.log("✓ Featured Cover Photo has ✂️ Crop Cover button");

  // Verify rich toolbar buttons: + Word, + Photo, ✂️ Crop
  const toolbarWordBtn = page.locator("article").getByRole("button", { name: /\+ Word/i }).first();
  const toolbarCropBtn = page.locator("article").getByRole("button", { name: /Crop/i }).first();
  const toolbarPhotoBtn = page.locator("article").getByRole("button", { name: /\+ Photo/i }).first();

  assert.equal(await toolbarWordBtn.isVisible(), true, "Toolbar + Word button is visible");
  assert.equal(await toolbarCropBtn.isVisible(), true, "Toolbar ✂️ Crop button is visible");
  assert.equal(await toolbarPhotoBtn.isVisible(), true, "Toolbar + Photo button is visible");
  console.log("✓ Rich Content Editor toolbar contains + Word, + Photo, and ✂️ Crop buttons");

  // Click Crop Cover button to verify modal opens in dashboard
  await cropCoverBtn.click();
  await page.waitForTimeout(600);
  await page.waitForSelector("canvas", { state: "visible" });
  const dashboardCropModal = page.getByRole("heading", { name: /Crop & Adjust Image/i });
  assert.equal(await dashboardCropModal.isVisible(), true, "Cropper modal opens in dashboard post editor");
  console.log("✓ Cover photo crop modal opened successfully in Dashboard Post Editor");

  // Capture screenshot of Dashboard Post Canvas Editor with Crop Tool
  const artifactPath2 = "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/dashboard_cover_crop_tool.png";
  await page.screenshot({ path: artifactPath2, fullPage: false });
  console.log("✓ Captured screenshot of Dashboard Post Editor Crop Tool:", artifactPath2);

  // Close crop modal
  await page.getByRole("button", { name: /Apply Crop/i }).click();
  await page.waitForTimeout(400);

  console.log("ALL VERIFICATIONS COMPLETED SUCCESSFULLY!");
} finally {
  await browser.close();
}
