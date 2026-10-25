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
  const port = 5178;
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
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // 1. Visit /admin?section=geodata with admin preview bypass
    await page.goto(`http://localhost:${port}/admin?section=geodata`);
    await page.evaluate(() => {
      localStorage.setItem("geocam_admin_preview", "true");
    });
    await page.reload();
    await page.waitForTimeout(2000);

    // Save screenshot of Geodata TOC Manager
    await page.screenshot({
      path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/admin-geodata-toc-desktop.png",
      fullPage: false,
    });
    console.log("Captured admin-geodata-toc-desktop.png");

    // 2. Click a symbology preset and inspect changes
    const mineralPreset = page.locator("button:has-text('Mineral / Ore'), button:has-text('រ៉ែមាស')").first();
    if (await mineralPreset.isVisible()) {
      await mineralPreset.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/admin-geodata-toc-preset-clicked.png",
        fullPage: false,
      });
      console.log("Captured admin-geodata-toc-preset-clicked.png");
    }

    // 3. Visit public /geodata
    await page.goto(`http://localhost:${port}/geodata`);
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/public-geodata-map.png",
      fullPage: false,
    });
    console.log("Captured public-geodata-map.png");

    await browser.close();
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
