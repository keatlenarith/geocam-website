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
    if (path.startsWith("/rest/v1/rpc/")) return send(true);

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

    if (path === "/rest/v1/site_content") {
      return send([]);
    }

    throw Error("Unexpected Supabase request: " + path);
  });
  return ctx;
}

try {
  const adminCtx = await setupContext();
  const page = await adminCtx.newPage();
  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text());
  });

  // Sign in as Admin
  await page.goto(base + "/admin/login", { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email address").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill("test-password-only");
  await page.getByRole("button", { name: "Sign in", exact: true }).first().click();
  await page.getByRole("link", { name: "Open dashboard" }).click();

  // =========================================================================
  // METHOD 1: IN DASHBOARD (/admin?section=posts)
  // =========================================================================
  console.log("Verifying Method 1: Dashboard Unified Content Hub...");
  await page.locator(".wp-menu-item").filter({ hasText: /^Posts/ }).click();

  // Check Category Tabs exist
  await expect(page.getByRole("button", { name: /All Content/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /News & Stories/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Research Focus Topics/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Website Pages/ })).toBeVisible();

  // Filter to Research Focus Topics tab
  await page.getByRole("button", { name: /Research Focus Topics/ }).click();
  const topicRow = page.getByRole("row").filter({ hasText: /Tectonics of Cambodia/ });
  await expect(topicRow).toBeVisible();

  // Click Edit on the Tectonics Research Topic
  await topicRow.getByRole("button", { name: "Edit" }).click();

  // Verify authentic Website Post Canvas modal opened
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: /Edit Research Topic/ })).toBeVisible();
  await expect(page.getByLabel("Title (English)", { exact: true })).toHaveValue(/Tectonics of Cambodia/);

  // Verify rich post canvas elements: Cover photo, Excerpt callout, Toolbar
  await expect(dialog.locator("article")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "+ Table" }).first()).toBeVisible();
  await expect(dialog.getByRole("button", { name: "+ Graph / Chart" }).first()).toBeVisible();
  await expect(dialog.getByRole("button", { name: "+ Photo" }).first()).toBeVisible();

  // Switch to Live Preview to view rendered post canvas
  await page.getByRole("button", { name: "Live Preview", exact: true }).first().click();
  const articleBody = dialog.locator(".geocam-article-body");
  await expect(articleBody).toBeVisible();

  // Screenshot of Dashboard Authentic Post Canvas Editor
  await page.screenshot({
    path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/method1_dashboard_post_canvas_editor.png",
    fullPage: false,
  });
  console.log("Captured screenshot: method1_dashboard_post_canvas_editor.png");

  // Close editor dialog
  await dialog.getByRole("button", { name: "Cancel" }).click();
  await expect(dialog).toHaveCount(0);

  // Filter to Website Pages tab
  await page.getByRole("button", { name: /Website Pages/ }).click();
  const pageRow = page.getByRole("row").filter({ hasText: /About GeoCam/ });
  await expect(pageRow).toBeVisible();

  // =========================================================================
  // METHOD 2: DIRECTLY IN WEBSITE (VisualCms on-page live editing)
  // =========================================================================
  console.log("Verifying Method 2: In-Website Visual Editing with WordPress Toolbar & Inserter...");
  await page.goto(base + "/about", { waitUntil: "domcontentloaded" });

  // Floating CMS controls in bottom-right
  const visualEditBtn = page.getByRole("button", { name: "Visual edit" });
  await expect(visualEditBtn).toBeVisible();
  await visualEditBtn.click();

  // Verify top-docked WordPress toolbar is displayed
  const topToolbar = page.locator('[data-cms-ui="website-wordpress-toolbar"]');
  await expect(topToolbar).toBeVisible();
  await expect(topToolbar.getByText("WordPress Visual Editor")).toBeVisible();

  // Check formatting tools: H2, H3, B, I, U, List, Quote, Link
  await expect(topToolbar.getByRole("button", { name: "H2", exact: true })).toBeVisible();
  await expect(topToolbar.getByRole("button", { name: "H3", exact: true })).toBeVisible();
  await expect(topToolbar.getByRole("button", { name: "B", exact: true })).toBeVisible();
  await expect(topToolbar.getByRole("button", { name: "I", exact: true })).toBeVisible();
  await expect(topToolbar.getByRole("button", { name: "U", exact: true })).toBeVisible();
  await expect(topToolbar.getByRole("button", { name: /List/ })).toBeVisible();
  await expect(topToolbar.getByRole("button", { name: /Quote/ })).toBeVisible();
  await expect(topToolbar.getByRole("button", { name: /Link/ })).toBeVisible();

  // Check the "+ Insert Content" button
  const insertContentBtn = topToolbar.getByRole("button", { name: "+ Insert Content" });
  await expect(insertContentBtn).toBeVisible();
  await insertContentBtn.click();

  // Verify Inserter modal with block options
  const insertModal = page.locator(".fixed.z-\\[3000\\]");
  await expect(insertModal).toBeVisible();
  await expect(insertModal.getByText("New Paragraph")).toBeVisible();
  await expect(insertModal.getByText("New Heading")).toBeVisible();
  await expect(insertModal.getByText("Photo / Image")).toBeVisible();
  await expect(insertModal.getByText("Data Table")).toBeVisible();
  await expect(insertModal.getByText("Geological Chart")).toBeVisible();
  await expect(insertModal.getByText("Callout Quote")).toBeVisible();

  // Click to insert a Data Table block
  await insertModal.getByRole("button", { name: /Data Table/ }).click();
  await expect(insertModal).toHaveCount(0);

  // Check that the table block has been added to the page and is editable
  const insertedTable = page.locator("#geocam-inserted-blocks-container");
  await expect(insertedTable).toBeVisible();
  await expect(insertedTable.getByText("Geological Sample Inventory")).toBeVisible();

  // Screenshot of In-Website WordPress Editor with Top Toolbar and inserted Table
  await page.screenshot({
    path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/method2_in_website_wordpress_editing.png",
    fullPage: false,
  });
  console.log("Captured screenshot: method2_in_website_wordpress_editing.png");

  console.log("ALL TESTS PASSED: Both Method 1 (Dashboard authentic post canvas) and Method 2 (In-Website WordPress editor with toolbar & block inserter) verified 100%!");
} finally {
  await browser.close();
}
