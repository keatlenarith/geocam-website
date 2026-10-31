import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(".");

test("ListedCompaniesRibbon: data file exists and contains all required items and fields", () => {
  const filePath = path.join(root, "data/listed-companies.json");
  assert.equal(fs.existsSync(filePath), true, "data/listed-companies.json must exist");

  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);
  assert.equal(Array.isArray(data), true);
  assert.equal(data.length >= 7, true, "Must have at least 7 listed companies");

  const tickers = data.map((d) => d.ticker);
  assert.equal(tickers.includes("EMR"), true);
  assert.equal(tickers.includes("UM1"), true);
  assert.equal(tickers.includes("ANK"), true);
  assert.equal(tickers.some((t) => t.includes("600585")), true);
  assert.equal(tickers.includes("06655"), true);
  assert.equal(tickers.includes("SCCC"), true);
  assert.equal(tickers.includes("3918"), true);

  for (const item of data) {
    assert.ok(item.exchange, "exchange is required");
    assert.ok(item.ticker, "ticker is required");
    assert.ok(item.company_en, "company_en is required");
    assert.ok(item.company_kh, "company_kh is required");
    assert.ok(item.asset_en, "asset_en is required");
    assert.ok(item.asset_kh, "asset_kh is required");
    assert.ok(item.commodity, "commodity is required");
    assert.ok(item.status, "status is required");
    assert.ok(item.lastChecked, "lastChecked is required");
  }
});

test("ListedCompaniesRibbon: component exists, scrolls reverse, and handles disclaimer", () => {
  const compCode = fs.readFileSync(path.join(root, "src/components/site/ListedCompaniesRibbon.tsx"), "utf8");
  assert.match(compCode, /LISTED COMPANIES/);
  assert.match(compCode, /ក្រុមហ៊ុនចុះបញ្ជី/);
  assert.match(compCode, /gc-ticker-track-reverse/);
  assert.match(compCode, /Information only, not investment advice/);

  const homeCode = fs.readFileSync(path.join(root, "src/routes/index.tsx"), "utf8");
  assert.match(homeCode, /<LiveTickerRibbon \/>\s*<ListedCompaniesRibbon \/>/);

  const cssCode = fs.readFileSync(path.join(root, "src/styles.css"), "utf8");
  assert.match(cssCode, /gc-ticker-scroll-reverse/);
  assert.match(cssCode, /translateX\(-50%\)/);
  assert.match(cssCode, /prefers-reduced-motion/);
});

test("Strict check: zero Thai or Lao characters in listed companies files", () => {
  const compCode = fs.readFileSync(path.join(root, "src/components/site/ListedCompaniesRibbon.tsx"), "utf8");
  const dataCode = fs.readFileSync(path.join(root, "data/listed-companies.json"), "utf8");
  const thaiLaoRegex = /[\u0E00-\u0E7F\u0E80-\u0EFF]/;
  assert.equal(thaiLaoRegex.test(compCode), false, "No Thai or Lao in ListedCompaniesRibbon.tsx");
  assert.equal(thaiLaoRegex.test(dataCode), false, "No Thai or Lao in data/listed-companies.json");
});
