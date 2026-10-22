import JSZip from "jszip";
import { chromium, expect } from "playwright/test";
import assert from "node:assert/strict";

const base = process.env.SITE_URL || "http://127.0.0.1:3001";
const api = "https://pziwobqfysoadswgnjjm.supabase.co";
const browser = await chromium.launch({ channel: "chrome", headless: true });

let draft = {},
  published = {},
  layers = [];
let source;

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

async function context() {
  const ctx = await browser.newContext();
  await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, (route) =>
    route.abort(),
  );
  await ctx.route(api + "/**", async (route) => {
    const req = route.request(),
      path = new URL(req.url()).pathname;
    const admin = req.headers().authorization === "Bearer " + token;
    const send = (value, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(value),
      });

    if (path === "/auth/v1/token") {
      return send({
        access_token: token,
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "test-refresh",
        user,
      });
    }
    if (path === "/auth/v1/user") return send(user);
    if (path === "/auth/v1/logout") return route.fulfill({ status: 204 });
    if (path === "/rest/v1/rpc/geocam_is_admin") return send(admin);
    if (path === "/rest/v1/geocam_map_layers") {
      if (req.method() === "GET")
        return send(layers.filter((layer) => admin || layer.status === "published"));
      if (!admin) return send({ message: "permission denied" }, 403);
      if (req.method() === "POST") {
        layers.push(req.postDataJSON());
        return route.fulfill({ status: 201 });
      }
      const id = new URL(req.url()).searchParams.get("id")?.replace("eq.", "");
      const row = layers.find((layer) => layer.id === id);
      if (req.method() === "PATCH") {
        Object.assign(row, req.postDataJSON());
        return send({ id });
      }
    }
    if (path.startsWith("/storage/v1/object/")) {
      if (req.method() === "POST") {
        source = req.postDataBuffer();
        return send({ Key: "test" });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/octet-stream",
        body: source,
      });
    }
    if (path === "/rest/v1/geocam_drafts" || path === "/rest/v1/geocam_published") {
      const isDraft = path.endsWith("drafts");
      if (req.method() === "GET") {
        if (isDraft && !admin) return send({ message: "permission denied" }, 403);
        return send({ id: "site", content: isDraft ? draft : published });
      }
      if (!admin) return send({ message: "permission denied" }, 403);
      const body = req.postDataJSON();
      if (isDraft) draft = structuredClone(body.content);
      else published = structuredClone(body.content);
      return route.fulfill({ status: 201 });
    }
    throw Error("Unexpected Supabase request: " + path);
  });
  return ctx;
}

try {
  const ctx = await context();
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));

  // 1. Sign in as admin
  await page.goto(base + "/admin/login", { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email address").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill("test-password-only");
  await page.getByRole("button", { name: "Sign in", exact: true }).first().click();
  await expect(page.getByRole("link", { name: "Open dashboard" })).toBeVisible();

  // 2. Go to geodata page
  await page.goto(base + "/geodata", { waitUntil: "domcontentloaded" });
  await expect(page.getByLabel("Upload geodata", { exact: true })).toBeVisible();

  // Check UI guidance mentions 10 MB parsed layer
  await expect(page.getByText("up to 10 MB parsed layer")).toBeVisible();

  // 3. Test GeoJSON with QGIS-style standard WGS84 CRS header
  const validQgisGeoJson = {
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: [
      {
        type: "Feature",
        properties: { name: "Borehole BH-01", description: "Target exploration well" },
        geometry: { type: "Point", coordinates: [104.9, 12.5] },
      },
      {
        type: "Feature",
        properties: { name: "Main Fault Zone", description: "Active shear corridor" },
        geometry: {
          type: "LineString",
          coordinates: [
            [104.8, 12.4],
            [105.1, 12.7],
          ],
        },
      },
    ],
  };

  await page.getByLabel("Upload geodata", { exact: true }).setInputFiles({
    name: "geocambodia_exploration.geojson",
    mimeType: "application/geo+json",
    buffer: Buffer.from(JSON.stringify(validQgisGeoJson)),
  });

  await expect(page.locator("#main").getByRole("status")).toContainText(
    "Uploaded 2 features as a private draft",
  );
  assert.equal(layers.length, 1);
  assert.equal(layers[0].filename, "geocambodia_exploration.geojson");

  // 4. Test Special Symbology Presets in UI
  await page.getByLabel("Use original KML styles").uncheck();

  // Click Quick Preset: "⛏️ Mineral / Ore"
  await page.getByRole("button", { name: "⛏️ Mineral / Ore" }).click();
  await expect(page.getByLabel("Point symbol")).toHaveValue("diamond");

  // Click Quick Preset: "🕳️ Borehole / Well"
  await page.getByRole("button", { name: "🕳️ Borehole / Well" }).click();
  await expect(page.getByLabel("Point symbol")).toHaveValue("drillhole");

  // Click Quick Preset: "⚡ Active Fault"
  await page.getByRole("button", { name: "⚡ Active Fault" }).click();
  await expect(page.getByLabel("Line style / pattern")).toHaveValue("dashed");

  // Select custom special symbol: "mine"
  await page.getByLabel("Point symbol").selectOption("mine");
  await page.getByLabel("Symbol size (pixels)").fill("36");
  await page.getByLabel("Line style / pattern").selectOption("dash-dot");
  await page.getByLabel("Line width (pixels)").fill("5");

  // Verify preview is present
  await expect(page.getByText("Preview:")).toBeVisible();

  // Save the custom style
  await page.getByRole("button", { name: "Save style", exact: true }).click();
  await expect(page.locator("#main").getByRole("status")).toContainText("Draft saved");

  assert.equal(layers[0].settings.symbol, "mine");
  assert.equal(layers[0].settings.lineStyle, "dash-dot");
  assert.equal(layers[0].settings.size, 36);
  assert.equal(layers[0].settings.width, 5);

  // 5. Test 10 MB layer rejection if oversized (> 10 MB)
  // Generate a mock oversized GeoJSON feature array exceeding 10 MB
  const largeFeatures = [];
  const coordsChunk = Array.from({ length: 400 }, (_, i) => [104 + (i * 0.001), 12 + (i * 0.001)]);
  for (let f = 0; f < 300; f++) {
    largeFeatures.push({
      type: "Feature",
      properties: { name: `Poly_${f}`, description: "x".repeat(35000) },
      geometry: { type: "LineString", coordinates: coordsChunk },
    });
  }
  const oversizedData = JSON.stringify({
    type: "FeatureCollection",
    features: largeFeatures,
  });
  assert.ok(Buffer.byteLength(oversizedData) > 10 * 1024 * 1024, "Data must exceed 10 MB to test boundary");

  await page.getByLabel("Upload geodata", { exact: true }).setInputFiles({
    name: "oversized_geodata.geojson",
    mimeType: "application/geo+json",
    buffer: Buffer.from(oversizedData),
  });

  await expect(page.locator("#main").getByRole("status")).toContainText(
    "Parsed layer exceeds 10 MB. Simplify geometry or split the dataset.",
  );

  // Take screenshot of the special symbology panel and map
  await page.screenshot({
    path: "C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9/geodata_special_symbology_10mb.png",
    fullPage: false,
  });

  assert.deepEqual(errors, []);
  console.log("PASS: 10 MB limit verified and enforced.");
  console.log("PASS: QGIS WGS84 CRS GeoJSON uploads cleanly.");
  console.log("PASS: Special symbology presets (mine, drillhole, fault, diamond) and line styles (dashed, dash-dot) verified.");
} finally {
  await browser.close();
}
