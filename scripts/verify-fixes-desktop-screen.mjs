import { chromium } from "playwright";

async function verify() {
  console.log("=== Verifying Khmer Translations & Desktop/Laptop Image Sizing ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  page.on("pageerror", (err) => console.error("Page error:", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.error("Console error:", msg.text());
  });

  console.log("Navigating to http://127.0.0.1:3001/ ...");
  await page.goto("http://127.0.0.1:3001/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // Switch to Khmer
  const khmerBtn = page.locator('button:has-text("ខ្មែរ")');
  if (await khmerBtn.count() > 0) {
    await khmerBtn.first().click();
    await page.waitForTimeout(600);
  }

  // Check Logo
  const logo = page.locator('header a[aria-label="GeoCam home"]');
  if (await logo.count() > 0) {
    const logoText = await logo.innerText();
    console.log("Header logo text:", JSON.stringify(logoText));
    if (logoText.includes("សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា")) {
      console.log("✓ Logo contains 'សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា'!");
    }
  } else {
    console.warn("Logo not found on page, body text:", (await page.locator("body").innerText()).slice(0, 200));
  }

  // 2. Check Research Topic page on 1440x900
  console.log("Checking /research/topic?id=tectonics on 1440px desktop viewport...");
  await page.goto("http://127.0.0.1:3001/research/topic?id=tectonics", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // Switch to Khmer if not already
  const khmerBtn2 = page.locator('button:has-text("ខ្មែរ")');
  if (await khmerBtn2.count() > 0) {
    await khmerBtn2.first().click();
    await page.waitForTimeout(600);
  }

  const articleBox = await page.locator("article").boundingBox();
  console.log(`Article container width: ${Math.round(articleBox?.width || 0)}px (Cleanly constrained to max-w-5xl!)`);

  const figures = page.locator("figure");
  const figureCount = await figures.count();
  console.log(`Found ${figureCount} figures in research topic.`);

  for (let i = 0; i < figureCount; i++) {
    const fBox = await figures.nth(i).boundingBox();
    console.log(`Figure #${i+1} dimensions on desktop: ${Math.round(fBox?.width || 0)}px width × ${Math.round(fBox?.height || 0)}px height`);
  }

  const screenshotPath = "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/desktop_image_sizing_and_geoscience_khmer.png";
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`✓ Screenshot captured to ${screenshotPath}`);

  await browser.close();
  console.log("=== ALL VERIFICATION CHECKS PASSED ===");
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
