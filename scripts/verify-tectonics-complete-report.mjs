import { chromium } from "playwright/test";
import assert from "node:assert/strict";

const base = process.env.SITE_URL || "http://127.0.0.1:3001";
const browser = await chromium.launch({ channel: "chrome", headless: true });

try {
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 1100 } });
  const page = await ctx.newPage();

  // 1. Check Home page Tectonics Card
  console.log("1. Checking Home page Tectonics Card...");
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const tectonicsCard = page.locator('a[href*="/research/topic?id="]').first();
  await tectonicsCard.waitFor({ state: "visible" });
  console.log("✓ Tectonics card on Home page visible");

  // 2. Navigate to Tectonics Topic Page
  console.log("2. Navigating to Tectonics Topic Page...");
  await page.goto(base + "/research/topic?id=tectonics", { waitUntil: "networkidle" });

  // Verify Title and Lead
  const heading = page.locator("h1").first();
  await heading.waitFor({ state: "visible" });
  const headingText = await heading.textContent();
  console.log("✓ Heading:", headingText);
  assert.ok(
    headingText.includes("Tectonic Evolution of Southeast Asia") ||
    headingText.includes("ការវិវត្តចលនាតិចតូនិច"),
    "Heading matches report title"
  );

  // Verify Hero Map (Metcalfe 2017 image1.png)
  const heroImg = page.locator("figure img").first();
  const heroSrc = await heroImg.getAttribute("src");
  console.log("✓ Hero image:", heroSrc);
  assert.ok(heroSrc.includes("image1.png"), "Hero image is Metcalfe 2017 map");

  // Verify all sections and figures
  console.log("3. Verifying all sections and illustrated figures...");
  const sections = await page.locator("section").all();
  console.log(`✓ Rendered ${sections.length} article sections`);
  assert.ok(sections.length >= 10, "Has all sections from report");

  // Log all image sources on the page
  const allImgSrcs = await page.locator("img").evaluateAll((imgs) => imgs.map((i) => i.src));
  console.log("All page image sources:", allImgSrcs);

  // Verify Figure 12 (image2.png)
  assert.ok(allImgSrcs.some((s) => s.includes("image2.png")), "Figure 12 in page image sources");

  // Verify Figure 2 (image3.png)
  assert.ok(allImgSrcs.some((s) => s.includes("image3.png")), "Figure 2 in page image sources");

  // Verify Figure 3 Outcrops (image4.png)
  assert.ok(allImgSrcs.some((s) => s.includes("image4.png")), "Figure 3 Outcrops in page image sources");

  // Verify Figure 15 (image5.png)
  assert.ok(allImgSrcs.some((s) => s.includes("image5.png")), "Figure 15 in page image sources");

  // Verify Figure 14 (image6.png)
  assert.ok(allImgSrcs.some((s) => s.includes("image6.png")), "Figure 14 in page image sources");

  // Verify Table 1 Parts 1 & 2 (image7.png and image8.png)
  assert.ok(allImgSrcs.some((s) => s.includes("image7.png")), "Table 1 Part 1 in page image sources");
  assert.ok(allImgSrcs.some((s) => s.includes("image8.png")), "Table 1 Part 2 in page image sources");
  console.log("✓ All 8 report figures and tables successfully verified in DOM");

  // Capture Screenshot of complete Tectonics Report Page
  const artifactScreenshot = "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/tectonics_complete_illustrated_report.png";
  await page.screenshot({ path: artifactScreenshot, fullPage: false });
  console.log("✓ Saved screenshot:", artifactScreenshot);

  // Scroll down and capture sections with outcrops and tables
  await page.evaluate(() => window.scrollBy(0, 1800));
  await page.waitForTimeout(500);
  const artifactScreenshot2 = "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/tectonics_outcrops_and_geochronology.png";
  await page.screenshot({ path: artifactScreenshot2, fullPage: false });
  console.log("✓ Saved screenshot:", artifactScreenshot2);

  // Switch to Khmer and verify bilingual rendering
  console.log("4. Verifying Khmer language mode...");
  const langToggle = page.locator('button:has-text("ភាសាខ្មែរ"), button:has-text("KH"), button:has-text("ខ្មែរ")').first();
  if (await langToggle.isVisible()) {
    await langToggle.click();
    await page.waitForTimeout(400);
    const khmerHeading = await page.locator("h1").first().textContent();
    console.log("✓ Khmer Heading:", khmerHeading);
    assert.ok(khmerHeading.includes("តិចតូនិច"), "Khmer heading renders correctly");
  }

  console.log("ALL TECTONICS REPORT VERIFICATIONS PASSED!");
} finally {
  await browser.close();
}
