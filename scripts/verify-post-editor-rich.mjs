import { chromium, expect } from "playwright/test";
import assert from "node:assert/strict";

const base = process.env.SITE_URL || "http://127.0.0.1:3001";
const api = "https://pziwobqfysoadswgnjjm.supabase.co";

const browser = await chromium.launch({ channel: "chrome", headless: true });

const drafts = new Map();
const published = new Map();

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

    throw Error("Unexpected Supabase request: " + path);
  });
  return ctx;
}

try {
  const adminCtx = await setupContext();
  const page = await adminCtx.newPage();

  await page.goto(base + "/admin/login", { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email address").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill("test-password-only");
  await page.getByRole("button", { name: "Sign in", exact: true }).first().click();
  await page.getByRole("link", { name: "Open dashboard" }).click();
  await page.locator(".wp-menu-item").filter({ hasText: /^Posts/ }).click();

  // 1. Check all posts now have an "Edit" button (no "Create copy")
  const copyButtons = page.getByRole("button", { name: "Create copy" });
  await expect(copyButtons).toHaveCount(0);

  // 2. Click "Edit" on a seed post
  const firstPostRow = page.getByRole("row").filter({ hasText: "Field school returns to the Cardamom foothills" });
  await expect(firstPostRow).toBeVisible();
  const editBtn = firstPostRow.getByRole("button", { name: "Edit", exact: true });
  await expect(editBtn).toBeVisible();
  await editBtn.click();

  // 3. Verify dialog opened in Edit mode with title loaded
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: /Edit News Post/ })).toBeVisible();
  await expect(page.getByLabel("Title (English)", { exact: true })).toHaveValue("Field school returns to the Cardamom foothills");

  // 4. Test Table insertion
  await page.getByRole("button", { name: "+ Table", exact: true }).first().click();
  const inserterModal = page.locator(".fixed.z-\\[1200\\]");
  await expect(inserterModal).toBeVisible();
  await inserterModal.getByRole("button", { name: "Insert Table" }).first().click();
  await expect(inserterModal).toHaveCount(0);
  await expect(page.getByLabel("Body (HTML) (English)", { exact: true })).toContainText("GC-2026-001");

  // 5. Test Chart insertion
  await page.getByRole("button", { name: "+ Graph / Chart", exact: true }).first().click();
  await expect(inserterModal).toBeVisible();
  await inserterModal.getByRole("button", { name: "Insert Chart" }).first().click();
  await expect(inserterModal).toHaveCount(0);
  await expect(page.getByLabel("Body (HTML) (English)", { exact: true })).toContainText("Mineralogical Composition Assay");

  // 6. Test Live Preview toggle
  await page.getByRole("button", { name: "Live Preview", exact: true }).first().click();
  const preview = page.locator(".geocam-article-body");
  await expect(preview).toBeVisible();
  await expect(preview.locator("table")).toBeVisible();
  await expect(preview.locator("text=Mineralogical Composition Assay")).toBeVisible();

  // Capture screenshot of rich editor in preview mode
  await page.screenshot({
    path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/admin_post_rich_editor_verified.png",
    fullPage: false,
  });

  // Switch back to HTML tab
  await page.getByRole("button", { name: "HTML", exact: true }).first().click();
  await expect(page.getByLabel("Body (HTML) (English)", { exact: true })).toBeVisible();

  // 7. Publish Live
  await page.getByRole("button", { name: "Publish Live", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("Post published");

  console.log("PASS: Rich post editor (Edit button on demo items, table insertion, chart insertion, live preview, publish live) verified 100%!");
} finally {
  await browser.close();
}
