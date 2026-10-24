import { chromium } from "playwright";
import { spawn } from "child_process";

async function main() {
  console.log("Starting Vite preview server...");
  const preview = spawn("npx.cmd", ["vite", "preview", "--port", "4174"], {
    cwd: "D:/9-Database Information/GeoCam Website/geocam-website",
    stdio: "inherit",
    shell: true,
  });

  await new Promise((r) => setTimeout(r, 2000));

  const browser = await chromium.launch({
    headless: true,
    channel: "msedge",
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log("Navigating to /geopark...");
  await page.goto("http://localhost:4174/geopark", { waitUntil: "networkidle" });

  // 1. Screenshot main page
  await page.screenshot({
    path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/geopark-explorer-30-sites.png",
  });
  console.log("Main page screenshot captured!");

  // 2. Click on Geoparks Research & Data button to open modal
  console.log("Opening Geoparks Research & Data modal...");
  const libBtn = page.getByRole("button", { name: /Geoparks Research & Data|ឯកសារស្រាវជ្រាវ Geoparks/i });
  await libBtn.click();
  await page.waitForTimeout(600);

  // Screenshot modal
  await page.screenshot({
    path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/geopark-research-library-modal.png",
  });
  console.log("Modal screenshot captured!");

  // Close modal via Escape
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // 3. Search and select Lom Phat
  console.log("Selecting Lom Phat geosite...");
  const searchInput = page.locator("input[type='text']").first();
  await searchInput.fill("Lom Phat");
  await page.waitForTimeout(800);

  // Click on Lom Phat in results list
  const lomPhatItem = page.getByText(/Lom Phat Petrified Wood|ឈើក្លាយជាថ្មលំផាត់/i).first();
  await lomPhatItem.click();
  await page.waitForTimeout(1000);

  // Screenshot Lom Phat selected with details
  await page.screenshot({
    path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/geopark-lom-phat-selected.png",
  });
  console.log("Lom Phat screenshot captured!");

  await browser.close();
  preview.kill();
  console.log("Verification finished successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
