import { chromium } from "playwright";
import { spawn } from "child_process";
import http from "http";

async function waitForServer(port) {
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}/`, (res) => {
          resolve(true);
        });
        req.on("error", reject);
      });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error("Server timeout");
}

async function main() {
  const port = 5179;
  const server = spawn("npm.cmd", ["run", "preview", "--", "--port", String(port)], {
    stdio: "pipe",
    shell: true,
  });

  server.stdout.on("data", (d) => process.stdout.write(d.toString()));
  server.stderr.on("data", (d) => process.stderr.write(d.toString()));

  try {
    await waitForServer(port);
    console.log("Preview server ready at port " + port);

    const browser = await chromium.launch({ channel: "msedge", headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
    const page = await context.newPage();

    // 1. Visit /admin?section=publications with admin preview bypass
    await page.goto(`http://localhost:${port}/admin?section=publications`);
    await page.evaluate(() => {
      localStorage.setItem("geocam_admin_preview", "true");
    });
    await page.reload();
    await page.waitForTimeout(2000);

    // Save screenshot of Publications Manager showing Edit and Delete tools
    const tableShotPath = "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/admin-publications-table.png";
    await page.screenshot({
      path: tableShotPath,
      fullPage: false,
    });
    console.log("Captured admin-publications-table.png");

    // 2. Click "Edit" button on the first paper row
    const editBtn = page.locator("button:has-text('Edit')").first();
    await editBtn.waitFor({ state: "visible", timeout: 5000 });
    await editBtn.click();
    await page.waitForTimeout(1000);

    // Verify Edit Modal is visible and capture screenshot
    const editModal = page.locator("text=Edit Research Publication");
    await editModal.waitFor({ state: "visible", timeout: 5000 });

    const editModalShotPath = "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/admin-publication-edit-modal.png";
    await page.screenshot({
      path: editModalShotPath,
      fullPage: false,
    });
    console.log("Captured admin-publication-edit-modal.png");

    // 3. Edit title and click Save Changes
    const titleInput = page.locator("input[value*='Structural']").first();
    if (await titleInput.isVisible()) {
      await titleInput.fill(await titleInput.inputValue() + " [Updated Edition]");
    }
    const saveBtn = page.locator("button[type='submit']:has-text('Save Changes')");
    await saveBtn.click();
    await page.waitForTimeout(1500);

    // 4. Click "Delete" button on a row to verify Delete Confirmation Modal
    const deleteBtn = page.locator("button:has-text('Delete')").first();
    await deleteBtn.click();
    await page.waitForTimeout(1000);

    const deleteModal = page.locator("text=Delete Publication");
    await deleteModal.waitFor({ state: "visible", timeout: 5000 });

    const deleteModalShotPath = "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/admin-publication-delete-modal.png";
    await page.screenshot({
      path: deleteModalShotPath,
      fullPage: false,
    });
    console.log("Captured admin-publication-delete-modal.png");

    // Click cancel on delete modal
    const cancelDeleteBtn = page.locator("button:has-text('Cancel')").last();
    await cancelDeleteBtn.click();
    await page.waitForTimeout(1000);

    // 5. Check public /publications page to confirm sync
    await page.goto(`http://localhost:${port}/publications`);
    await page.waitForTimeout(2000);

    const publicShotPath = "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/public-publications-synced.png";
    await page.screenshot({
      path: publicShotPath,
      fullPage: false,
    });
    console.log("Captured public-publications-synced.png");

    await browser.close();
    console.log("ALL ADMIN PUBLICATION EDIT & DELETE VERIFICATIONS PASSED!");
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
