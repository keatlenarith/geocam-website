import { chromium, expect } from "playwright/test";
import assert from "node:assert/strict";

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

const drafts = new Map();
const published = new Map();

async function setupContext() {
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

    if (path === "/auth/v1/logout") return route.fulfill({ status: 204 });

    if (path === "/rest/v1/rpc/geocam_is_admin") return send(admin);

    if (path === "/rest/v1/geocam_drafts" || path === "/rest/v1/geocam_published")
      return send({ id: "site", content: {} });

    if (path === "/rest/v1/geocam_post_drafts" || path === "/rest/v1/geocam_post_public") {
      const privateTable = path.endsWith("drafts");
      const table = privateTable ? drafts : published;
      const id = url.searchParams.get("id")?.replace(/^eq\./, "");

      if ((privateTable || req.method() !== "GET") && !admin)
        return send({ message: "permission denied" }, 403);

      if (req.method() === "GET") {
        const rows = id ? [table.get(id)].filter(Boolean) : [...table.values()];
        return send(
          req.headers().accept?.includes("object+json")
            ? (rows[0] ?? null)
            : rows,
        );
      }

      const body = req.postDataJSON();
      if (req.method() === "PATCH") {
        table.set(id, { ...table.get(id), ...structuredClone(body) });
        return route.fulfill({ status: 204 });
      }

      table.set(body.id, structuredClone(body));
      return route.fulfill({ status: 201 });
    }

    return send({});
  });
  return ctx;
}

try {
  const visitorCtx = await setupContext();
  const adminCtx = await setupContext();

  const visitor = await visitorCtx.newPage();
  const page = await adminCtx.newPage();

  // ==========================================
  // PART 1: VISITOR PRIVACY (No editing tools visible)
  // ==========================================
  const testRoutes = [
    "/",
    "/news",
    "/news/item?id=n1",
    "/publications",
    "/publications/view?id=web01",
    "/research/topic?id=Geochemistry",
  ];

  for (const r of testRoutes) {
    await visitor.goto(base + r, { waitUntil: "domcontentloaded" });
    const cmsUi = visitor.locator("[data-cms-ui]");
    await expect(cmsUi).toHaveCount(0);
  }
  console.log("PASS: Visitor sees 0 [data-cms-ui] across all pages and post levels.");

  // ==========================================
  // PART 2: ADMIN SIGN IN
  // ==========================================
  await page.goto(base + "/admin/login", { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email address").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill("test-password-only");
  await page.getByRole("button", { name: "Sign in", exact: true }).first().click();
  await page.getByRole("link", { name: "Open dashboard" }).click();
  await page.waitForLoadState("domcontentloaded");

  // ==========================================
  // PART 3: HOMEPAGE (Top Admin Bar & Visual Layer)
  // ==========================================
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-cms-ui="top-admin-bar"]')).toBeVisible();
  await expect(page.locator('[data-cms-ui="top-admin-bar"] a', { hasText: "GeoCam Admin" })).toBeVisible();
  await expect(page.locator('[data-cms-ui="top-admin-bar"]', { hasText: "Edit Page" })).toBeVisible();
  await expect(page.locator(".fixed.bottom-5.right-5")).toBeVisible();

  // ==========================================
  // PART 4: NEWS POST LEVEL (/news/item?id=n1)
  // ==========================================
  await page.goto(base + "/news/item?id=n1", { waitUntil: "domcontentloaded" });

  // Top Admin Bar has contextual "Edit this Post"
  const topEditPost = page.locator('[data-cms-ui="top-admin-bar"] a', { hasText: "Edit this Post" });
  await expect(topEditPost).toBeVisible();
  await expect(topEditPost).toHaveAttribute("href", "/admin?section=posts&edit=n1");

  // On-page meta header has "Edit this Post"
  const metaEditPost = page.locator('[data-cms-ui="post-meta-admin-tools"] a', { hasText: "Edit this Post" });
  await expect(metaEditPost).toBeVisible();

  // Bottom of article has Admin Post Controls
  const bottomAdminPanel = page.locator('[data-cms-ui="post-bottom-admin-panel"]');
  await expect(bottomAdminPanel).toBeVisible();
  await expect(bottomAdminPanel.getByRole("link", { name: "Edit this Post Now" })).toBeVisible();

  // Floating toolbar has "Edit this Post"
  const floatingEditPost = page.locator('.fixed.bottom-5.right-5 a', { hasText: "Edit this Post" });
  await expect(floatingEditPost).toBeVisible();

  // Capture screenshot of post level with all editing tools
  await page.screenshot({
    path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/universal_editing_tools_post_level.png",
    fullPage: false,
  });

  // ==========================================
  // PART 5: CLICKING "Edit this Post" AUTO-OPENS DRAWER
  // ==========================================
  await metaEditPost.click();
  await page.waitForLoadState("domcontentloaded");
  await expect(page).toHaveURL(/section=posts/);
  await expect(page).toHaveURL(/edit=n1/);

  // The rich post editor dialog should be automatically open with this post loaded!
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: /Edit News Post/ })).toBeVisible();
  await expect(page.getByLabel("Title (English)", { exact: true })).toHaveValue("Field school returns to the Cardamom foothills");

  // Close the drawer
  await page.getByRole("button", { name: "Close post editor" }).click();
  await expect(dialog).toHaveCount(0);

  // ==========================================
  // PART 6: PUBLICATION LEVEL (/publications/view)
  // ==========================================
  await page.goto(base + "/publications/view?id=web01", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-cms-ui="top-admin-bar"]')).toBeVisible();
  await expect(page.locator('[data-cms-ui="top-admin-bar"] a', { hasText: "Edit Publication" })).toBeVisible();
  await expect(page.locator('[data-cms-ui="pub-admin-actions"] a', { hasText: "Edit Publication" })).toBeVisible();
  await expect(page.locator('.fixed.bottom-5.right-5 a', { hasText: "Edit in Admin" })).toBeVisible();

  // ==========================================
  // PART 7: RESEARCH TOPIC LEVEL (/research/topic)
  // ==========================================
  await page.goto(base + "/research/topic?id=Geochemistry", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-cms-ui="top-admin-bar"]')).toBeVisible();
  await expect(page.locator('[data-cms-ui="top-admin-bar"] a', { hasText: "Edit Research Page" })).toBeVisible();
  await expect(page.locator('[data-cms-ui="research-admin-actions"] a', { hasText: "Edit Research Page" })).toBeVisible();
  await expect(page.locator('.fixed.bottom-5.right-5 a', { hasText: "Edit Research" })).toBeVisible();

  // Capture screenshot of research topic level
  await page.screenshot({
    path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/universal_editing_tools_research_level.png",
    fullPage: false,
  });

  console.log("PASS: Universal editing tools verified across all pages, detail views, and post levels with auto-drawer open!");
} finally {
  await browser.close();
}
