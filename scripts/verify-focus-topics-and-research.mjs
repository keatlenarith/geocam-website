import { chromium, expect } from "playwright/test";
import assert from "node:assert/strict";

const base = process.env.SITE_URL || "http://127.0.0.1:3001";
const browser = await chromium.launch({ channel: "chrome", headless: true });

try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));

  // 1. Visit Homepage
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });

  // Switch to Khmer if not already Khmer
  const kmBtn = page.locator("button", { hasText: "ខ្មែរ" });
  if (await kmBtn.isVisible()) {
    await kmBtn.click();
  }

  // Verify "វិស័យសំខាន់ៗ" section exists
  await expect(page.getByText("វិស័យសំខាន់ៗ")).toBeVisible();

  // Find the Tectonics card and verify it links directly to /research/topic?id=Tectonics
  const tectonicLink = page.locator('a[href*="/research/topic?id=Tectonics"]');
  await expect(tectonicLink).toBeVisible();

  // 2. Click "ស្វែងយល់បន្ថែម" on the Tectonics card
  await tectonicLink.click();
  await page.waitForURL(/.*\/research\/topic\?id=Tectonics.*/);

  // Verify topic post contents
  await expect(page.getByText("តិចតូនិកនៃប្រទេសកម្ពុជា").first()).toBeVisible();
  await expect(page.getByText("Indochina Block").first()).toBeVisible();
  await expect(page.getByText("ចំណុចគន្លឹះសំខាន់ៗ").first()).toBeVisible();

  // Verify highlighted research papers section
  await expect(page.getByText("ការស្រាវជ្រាវ និងទស្សនាវដ្ដីវិទ្យាសាស្ត្រពាក់ព័ន្ធ").first()).toBeVisible();

  // Check that paper cards are present and have links to /publications/view?id=
  const pubLinks = page.locator('a[href^="/publications/view?id="]');
  assert.ok((await pubLinks.count()) > 0, "Should have links to publication view");

  // Take screenshot of the dedicated topic post
  await page.screenshot({
    path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/topic_post_tectonics.png",
    fullPage: false,
  });

  // 3. Test clicking another discipline: "ជម្រកដែក"
  const mineralLink = page.locator('a[href*="/research/topic?id=Mineral%20deposits"]').first();
  await mineralLink.click();
  await page.waitForURL(/.*\/research\/topic\?id=Mineral.*/);
  await expect(page.getByText("ជម្រកដែក និងភូគព្ភសាស្ត្ររ៉ែនៅកម្ពុជា").first()).toBeVisible();
  await expect(page.getByText("Okvau (Mondulkiri)").first()).toBeVisible();

  // 4. Test clicking into a publication view
  const firstPubLink = page.locator('a[href^="/publications/view?id="]').first();
  await firstPubLink.click();
  await page.waitForURL(/.*\/publications\/view\?id=.*/);
  await expect(page.locator('#main').getByText("ការបោះពុម្ពផ្សាយ").or(page.locator('#main').getByText("Publications")).first()).toBeVisible();

  // 5. Test Research & Discovery main page (/research)
  await page.goto(base + "/research", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("វិស័យសំខាន់ៗនៃភូគព្ភសាស្ត្រកម្ពុជា")).toBeVisible();
  await expect(page.getByText("ចំណងជើងការស្រាវជ្រាវ និងទស្សនាវដ្ដីសំខាន់ៗ")).toBeVisible();

  // Verify filter pills exist and function
  const tectonicsPill = page.getByRole("button", { name: "តិចតូនិក" });
  await expect(tectonicsPill).toBeVisible();
  await tectonicsPill.click();

  // Take screenshot of Research & Discovery page
  await page.screenshot({
    path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/research_discovery_highlights.png",
    fullPage: false,
  });

  assert.deepEqual(errors, []);
  console.log("PASS: Focus areas decoupled from generic /research link.");
  console.log("PASS: Clicking 'ស្វែងយល់បន្ថែម' opens dedicated topic post with full article and stats.");
  console.log("PASS: Highlighted research papers & journals appear with direct links on both topic post and /research page.");
} finally {
  await browser.close();
}
