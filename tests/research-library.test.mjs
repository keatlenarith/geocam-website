import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const records = () =>
  JSON.parse(
    readFileSync(
      new URL("../src/lib/research-library.json", import.meta.url),
      "utf8",
    ),
  );

test("research catalog contains real records with unique identifiers and no private paths", () => {
  const items = records();
  assert.ok(items.length >= 45);
  assert.equal(new Set(items.map((p) => p.id)).size, items.length);
  assert.ok(!JSON.stringify(items).match(/[A-Z]:\\/));
  assert.ok(
    items.every(
      (p) =>
        p.title &&
        p.topic &&
        p.publicationType &&
        !p.title.includes("(sample)"),
    ),
  );
  assert.ok(items.some((p) => p.year === 2026 && p.sourceUrl));
  assert.ok(items.some((p) => /preprint/i.test(p.publicationType)));
});

test("every advertised document exists and every link-only record has a source", () => {
  for (const item of records()) {
    assert.ok(item.pdfUrl || item.fileUrl || item.sourceUrl, item.title);
    for (const url of [item.pdfUrl, item.fileUrl].filter(Boolean)) {
      assert.ok(url.startsWith("/research/"));
      assert.ok(existsSync(new URL("../public" + url, import.meta.url)), url);
    }
    if (item.sourceUrl) assert.ok(item.sourceUrl.startsWith("https://"));
  }
});
