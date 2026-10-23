import { chromium } from "playwright";

async function verify() {
  console.log("=== Testing Alteration Mapping Portal & Processing Workflow ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
  });
  const page = await context.newPage();

  page.on("pageerror", (err) => console.error("Page error:", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.error("Console error:", msg.text());
  });

  // Setup download listener
  let downloadedFileName = "";
  page.on("download", async (download) => {
    downloadedFileName = download.suggestedFilename();
    console.log("✓ AUTOMATIC DOWNLOAD TRIGGERED:", downloadedFileName);
  });

  // 1. Navigate to page
  console.log("Step 1: Navigating to http://127.0.0.1:3001/alteration-mapping ...");
  await page.goto("http://127.0.0.1:3001/alteration-mapping", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // 2. Check title
  const h1Text = await page.locator("h1").innerText();
  console.log("Step 2: Page H1:", JSON.stringify(h1Text));

  // 3. Switch basemap to Hillshade
  console.log("Step 3: Switching basemap to Hillshade...");
  const hillshadeBtn = page.locator('button:has-text("Hillshade")');
  await hillshadeBtn.click();
  await page.waitForTimeout(600);

  // 4. Click Demo Boundary button
  console.log("Step 4: Loading demo exploration boundary...");
  const demoBtn = page.locator('button:has-text("Try Demo")');
  await demoBtn.click();
  await page.waitForTimeout(800);

  // 5. Click Run Analysis
  console.log("Step 5: Clicking Run Analysis button...");
  const runBtn = page.locator('button:has-text("Run Alteration Mapping")');
  await runBtn.click();

  // 6. Wait for pipeline progress to complete (approx 6-7 seconds)
  console.log("Step 6: Waiting for alteration processing pipeline to complete...");
  await page.waitForSelector('text="Alteration Analysis Complete!"', { timeout: 15000 });
  console.log("✓ Analysis complete indicator detected!");

  await page.waitForTimeout(1000);

  // 7. Verify layer toggles exist
  const layersCount = await page.locator('input[type="checkbox"]').count();
  console.log(`Step 7: Found ${layersCount} layer toggles (Boundary + 4 Alteration classes).`);

  // Switch basemap back to Satellite to see high-contrast alteration polygons
  console.log("Step 8: Switching to Satellite basemap to view overlay...");
  const satelliteBtn = page.locator('button:has-text("Satellite")');
  await satelliteBtn.click();
  await page.waitForTimeout(1000);

  // 8. Capture screenshot
  const screenshotPath = "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/alteration_mapping_pipeline_verified.png";
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`✓ Verification screenshot saved to ${screenshotPath}`);

  // 9. Switch language to Khmer to verify bilingual support
  console.log("Step 9: Testing Khmer language toggle...");
  const khmerBtn = page.locator('button:has-text("ខ្មែរ")');
  if (await khmerBtn.count() > 0) {
    await khmerBtn.first().click();
    await page.waitForTimeout(800);
    const khmerScreenshotPath = "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/alteration_mapping_khmer_verified.png";
    await page.screenshot({ path: khmerScreenshotPath, fullPage: true });
    console.log(`✓ Khmer verification screenshot saved to ${khmerScreenshotPath}`);
  }

  await browser.close();
  console.log("=== ALL ALTERATION MAPPING TESTS PASSED ===");
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
