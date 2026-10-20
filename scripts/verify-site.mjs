import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const base = process.env.SITE_URL || "http://127.0.0.1:3000";
const records = JSON.parse(
  readFileSync(
    new URL("../src/lib/research-library.json", import.meta.url),
    "utf8",
  ),
);
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto(base + "/publications");
  await page.getByText("50 results", { exact: true }).waitFor();
  assert.equal(await page.locator("[data-cms-ui]").count(), 0);
  assert.equal(await page.locator('a[href^="/admin"]').count(), 0);
  await page.getByLabel("Search publications").fill("karst");
  const filteredCount = await page
    .locator('a[href^="/publications/view?"]')
    .count();
  assert.ok(filteredCount > 0 && filteredCount < 50);
  await page
    .getByLabel("Search publications")
    .fill("not-a-real-research-title-987");
  await page.getByText("No matching references", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByLabel("Year", { exact: true }).selectOption("2026");
  assert.equal(
    await page.locator('a[href^="/publications/view?"]').count(),
    records.filter((p) => p.year === 2026).length,
  );
  await page.getByLabel("Year", { exact: true }).selectOption("All");
  await page.getByLabel("Availability").selectOption("Sources");
  assert.equal(
    await page.locator('a[href^="/publications/view?"]').count(),
    records.filter((p) => !p.pdfUrl && !p.fileUrl).length,
  );
  const pdf = records.find((p) => p.pdfUrl);
  await page.goto(base + "/publications/view?id=" + pdf.id);
  await page.getByRole("link", { name: "Download PDF", exact: true }).waitFor();
  assert.equal(
    await page.locator("object").getAttribute("data"),
    pdf.pdfUrl + "#toolbar=1",
  );
  const source = records.find((p) => !p.pdfUrl && !p.fileUrl);
  await page.goto(base + "/publications/view?id=" + source.id);
  await page
    .getByRole("heading", { name: "Read at the original source" })
    .waitFor();
  await page.goto(base + "/publications/view?id=unknown-reference");
  await page.getByRole("heading", { name: "Publication not found" }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/publications");
  await page.getByText("50 results", { exact: true }).waitFor();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    "Mobile layout overflows",
  );
  const urls = new Set(
    records
      .flatMap((p) => [
        p.pdfUrl,
        p.fileUrl,
        ...(p.alternateFiles || []).map((f) => f.url),
      ])
      .filter(Boolean),
  );
  for (const url of urls) {
    const response = await page.request.head(base + url);
    assert.equal(response.status(), 200, url);
    if (url.endsWith(".pdf"))
      assert.ok(
        response.headers()["content-type"].includes("application/pdf"),
        url,
      );
  }
  for (const route of ["/admin", "/admin/cms"]) {
    await page.goto(base + route);
    await page.getByRole("heading", { name: "Administrator access required", exact: true }).waitFor();
    assert.equal(await page.locator("[data-cms-ui]").count(), 0);
  }
  assert.deepEqual(errors, []);
  console.log(
    `Verified search, year/access filters, empty state, PDF/source pages, missing records, mobile layout, and ${urls.size} document URLs.`,
  );
} finally {
  await browser.close();
}
