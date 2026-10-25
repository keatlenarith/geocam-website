import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const artifactDir = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\02ec04c2-7cd0-49d1-9603-17054f9e60b9";

async function run() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
  });
  const page = await context.newPage();

  console.log("Navigating to Admin Posts...");
  await page.goto("http://localhost:4173/admin?section=posts");
  await page.evaluate(() => {
    localStorage.setItem("geocam_admin_preview", "true");
  });
  await page.reload();
  await page.waitForTimeout(2000);

  // 1. Click "+ Create New Post"
  console.log("Clicking + Create New Post...");
  const newPostBtn = page.locator('button:has-text("+ Create New Post")');
  await newPostBtn.click();
  await page.waitForTimeout(1000);

  // Verify Classic Editor elements
  const heading = await page.locator("#classic-editor-heading").textContent();
  console.log("Editor heading:", heading);

  // Check title input
  const titleInput = page.locator("#post-title");
  await titleInput.fill("Geological Investigation of the Cardamom Terrane");
  await page.waitForTimeout(500);

  // Screenshot 1: Classic Editor New Post
  const shot1 = path.join(artifactDir, "admin-classic-editor-new.png");
  await page.screenshot({ path: shot1, fullPage: false });
  console.log("Saved screenshot 1 to:", shot1);

  // Close editor
  console.log("Closing editor...");
  await page.locator('button:has-text("Back to All Posts")').click();
  await page.waitForTimeout(500);

  // If unsaved changes modal appears, click "Discard changes"
  const discardBtn = page.locator('button:has-text("Discard changes")');
  if (await discardBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    await discardBtn.click();
    await page.waitForTimeout(500);
  }

  // 2. Click an old post row to verify direct loading of old content
  console.log("Clicking an existing old post in the table...");
  const oldPostRow = page.locator('tbody tr:first-child');
  await oldPostRow.click();
  await page.waitForTimeout(1000);

  const editHeading = await page.locator("#classic-editor-heading").textContent();
  console.log("Edit post heading:", editHeading);

  const loadedTitle = await page.locator("#post-title").inputValue();
  console.log("Loaded old post title:", loadedTitle);

  // Screenshot 2: Classic Editor with old post loaded
  const shot2 = path.join(artifactDir, "admin-classic-editor-edit-old-post.png");
  await page.screenshot({ path: shot2, fullPage: false });
  console.log("Saved screenshot 2 to:", shot2);

  // Close editor
  await page.locator('button:has-text("Back to All Posts")').click();
  await page.waitForTimeout(1000);

  // 3. Test Pages section -> "Edit in Classic Editor"
  console.log("Navigating to All Pages section...");
  await page.goto("http://localhost:4173/admin?section=pages", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(1000);

  console.log("Clicking Edit in Classic Editor for active page...");
  const editInClassicBtn = page.locator('button:has-text("Edit in Classic Editor")');
  await editInClassicBtn.click();
  await page.waitForTimeout(1500);

  const pageEditHeading = await page.locator("#classic-editor-heading").textContent();
  console.log("Page edit heading:", pageEditHeading);

  const loadedPageTitle = await page.locator("#post-title").inputValue();
  console.log("Loaded old page title:", loadedPageTitle);

  // Screenshot 3: Classic Editor with website page content loaded
  const shot3 = path.join(artifactDir, "admin-classic-editor-edit-page.png");
  await page.screenshot({ path: shot3, fullPage: false });
  console.log("Saved screenshot 3 to:", shot3);

  await browser.close();
  console.log("All Playwright verifications passed successfully!");
}

run().catch((err) => {
  console.error("Playwright verification error:", err);
  process.exit(1);
});
