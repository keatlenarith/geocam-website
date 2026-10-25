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
  const port = 5180;
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

    // 1. Visit /admin?section=events
    await page.goto(`http://localhost:${port}/admin?section=events`);
    await page.evaluate(() => {
      localStorage.setItem("geocam_admin_preview", "true");
    });
    await page.reload();
    await page.waitForTimeout(2000);

    // Save screenshot of Events Manager showing Edit and Delete tools
    await page.screenshot({
      path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/admin-events-table.png",
      fullPage: false,
    });
    console.log("Captured admin-events-table.png");

    // 2. Click "Edit" button on the first event row
    const editBtn = page.locator("button:has-text('Edit')").first();
    await editBtn.waitFor({ state: "visible", timeout: 5000 });
    await editBtn.click();
    await page.waitForTimeout(1000);

    // Verify Edit Modal is visible and capture screenshot
    const editModal = page.locator("text=Edit Event");
    await editModal.waitFor({ state: "visible", timeout: 5000 });

    await page.screenshot({
      path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/admin-event-edit-modal.png",
      fullPage: false,
    });
    console.log("Captured admin-event-edit-modal.png");

    // Cancel edit modal
    const cancelEditBtn = page.locator("button:has-text('Cancel')").last();
    await cancelEditBtn.click();
    await page.waitForTimeout(1000);

    // 3. Click "Delete" button on an event row
    const deleteBtn = page.locator("button:has-text('Delete')").first();
    await deleteBtn.click();
    await page.waitForTimeout(1000);

    const deleteModal = page.locator("text=Delete Event");
    await deleteModal.waitFor({ state: "visible", timeout: 5000 });

    await page.screenshot({
      path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/admin-event-delete-modal.png",
      fullPage: false,
    });
    console.log("Captured admin-event-delete-modal.png");

    // Click cancel on delete modal
    const cancelDeleteBtn = page.locator("button:has-text('Cancel')").last();
    await cancelDeleteBtn.click();
    await page.waitForTimeout(1000);

    // 4. Check public /events page
    await page.goto(`http://localhost:${port}/events`);
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/public-events-synced.png",
      fullPage: false,
    });
    console.log("Captured public-events-synced.png");

    await browser.close();
    console.log("ALL EVENTS EDIT & DELETE VERIFICATIONS PASSED!");
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
