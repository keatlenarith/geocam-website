import { chromium } from "playwright";
import { spawn } from "child_process";

async function main() {
  console.log("Starting preview server...");
  const preview = spawn("npx.cmd", ["vite", "preview", "--port", "4176"], {
    cwd: "D:/9-Database Information/GeoCam Website/geocam-website",
    stdio: "inherit",
    shell: true,
  });

  await new Promise((r) => setTimeout(r, 2000));

  const browser = await chromium.launch({
    headless: true,
    channel: "msedge",
  });

  const api = "https://pziwobqfysoadswgnjjm.supabase.co";
  const user = {
    id: "00000000-0000-4000-8000-000000000001",
    aud: "authenticated",
    role: "authenticated",
    email: "keatlenarith@gmail.com",
  };
  const token = [
    "eyJhbGciOiJIUzI1NiJ9",
    Buffer.from(JSON.stringify({ sub: user.id, role: "authenticated", aud: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url"),
    "test-signature",
  ].join(".");

  const ctx = await browser.newContext();

  await ctx.route(api + "/**", async (route) => {
    const req = route.request();
    const p = new URL(req.url()).pathname;
    const send = (val, status = 200) =>
      route.fulfill({ status, contentType: "application/json", body: JSON.stringify(val) });

    if (p === "/auth/v1/token") {
      return send({ access_token: token, token_type: "bearer", expires_in: 3600, refresh_token: "test-refresh", user });
    }
    if (p === "/auth/v1/user") return send(user);
    if (p === "/rest/v1/rpc/geocam_is_admin") return send(true);
    if (p === "/rest/v1/geocam_post_drafts" || p === "/rest/v1/geocam_post_public") return send([]);
    if (p === "/rest/v1/geocam_drafts" || p === "/rest/v1/geocam_published") return send({});
    return send({});
  });

  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // Pre-seed auth token in localStorage
  await page.goto("http://localhost:4176/about");
  await page.evaluate(({ token, user }) => {
    localStorage.setItem(
      "sb-pziwobqfysoadswgnjjm-auth-token",
      JSON.stringify({ access_token: token, token_type: "bearer", expires_in: 3600, refresh_token: "test-refresh", user })
    );
  }, { token, user });

  console.log("Navigating to /admin?section=facebook with auth token...");
  await page.goto("http://localhost:4176/admin?section=facebook", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Take screenshot of the Facebook Auto-Publisher dashboard
  await page.screenshot({
    path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/facebook-auto-publisher-admin.png",
  });
  console.log("Screenshot of Facebook Auto-Publisher captured!");

  // Click on "Send Test Broadcast"
  const testBtn = page.getByRole("button", { name: /Send Test Broadcast/i });
  if (await testBtn.count() > 0) {
    console.log("Clicking Send Test Broadcast...");
    await testBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/facebook-auto-publisher-test-result.png",
    });
  }

  await browser.close();
  preview.kill();
  console.log("Verification completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
