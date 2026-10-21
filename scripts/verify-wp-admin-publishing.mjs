import { chromium, expect } from "playwright/test";

const base = process.env.SITE_URL || "http://127.0.0.1:3001";
const api = "https://pziwobqfysoadswgnjjm.supabase.co";

const browser = await chromium.launch({ channel: "chrome", headless: true });

const user = {
  id: "00000000-0000-4000-8000-000000000001",
  aud: "authenticated",
  role: "authenticated",
  email: "keatlenarith@gmail.com",
  email_confirmed_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  created_at: new Date().toISOString(),
};

const token = [
  "eyJhbGciOiJIUzI1NiJ9",
  Buffer.from(
    JSON.stringify({
      sub: user.id,
      role: "authenticated",
      aud: "authenticated",
      exp: Math.floor(Date.now() / 1000) + 3600,
    }),
  ).toString("base64url"),
  "test-signature",
].join(".");

const ctx = await browser.newContext();
await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) => route.abort());
await ctx.route(api + "/**", async (route) => {
  const req = route.request();
  const url = new URL(req.url());
  const path = url.pathname;
  const admin = req.headers().authorization === "Bearer " + token;
  const send = (value, status = 200) =>
    route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(value),
    });

  if (path === "/auth/v1/token")
    return send({
      access_token: token,
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: "test-refresh",
      user,
    });

  if (path === "/auth/v1/user") return send(user);
  if (path === "/rest/v1/rpc/geocam_is_admin") return send(admin);
  if (path === "/rest/v1/geocam_drafts" || path === "/rest/v1/geocam_published")
    return send({ id: "site", content: {} });
  if (path === "/rest/v1/rpc/geocam_publish_page_changes")
    return send({});

  return send({});
});

try {
  const page = await ctx.newPage();
  await page.goto(base + "/admin/login", { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email address").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill("test-password-only");
  await page.getByRole("button", { name: "Sign in", exact: true }).first().click();
  await page.getByRole("link", { name: "Open dashboard" }).click();
  await page.waitForLoadState("domcontentloaded");

  // 1. Verify Top Bar Buttons
  const topBarPublishBtn = page.locator('#wpadminbar button', { hasText: 'Publish Website Live' });
  await expect(topBarPublishBtn).toBeVisible();

  const topBarSaveBtn = page.locator('#wpadminbar button', { hasText: 'Save All Changes' });
  await expect(topBarSaveBtn).toBeVisible();

  // 2. Verify Dashboard Header Buttons
  const headerPublishBtn = page.locator('.wp-header button', { hasText: 'Publish Website Live' });
  await expect(headerPublishBtn).toBeVisible();

  const headerSaveBtn = page.locator('.wp-header button', { hasText: 'Save All Changes' });
  await expect(headerSaveBtn).toBeVisible();

  // 3. Verify Dashboard Widget
  const publishWidget = page.locator('.postbox', { hasText: 'Website Publishing & Status' });
  await expect(publishWidget).toBeVisible();

  // 4. Test clicking Publish Website Live
  await topBarPublishBtn.click();
  await expect(page.locator('.wp-notice-banner', { hasText: 'Website published live!' })).toBeVisible();

  // 5. Capture screenshot of the upgraded wp-admin dashboard with Publishing tools
  await page.screenshot({
    path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/wp_admin_publishing_buttons.png",
    fullPage: false,
  });

  console.log("PASS: wp-admin publishing and save all changes buttons verified successfully!");
} finally {
  await browser.close();
}
