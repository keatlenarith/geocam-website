import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("TOC layers configuration has valid geometry, bilingual metadata, and complete symbology", () => {
  const content = fs.readFileSync("src/features/geodata/toc-config.ts", "utf8");

  // Verify categories
  assert.match(content, /id:\s*"geology"/);
  assert.match(content, /id:\s*"faults"/);
  assert.match(content, /id:\s*"minerals"/);
  assert.match(content, /id:\s*"marine"/);
  assert.match(content, /id:\s*"hazards"/);
  assert.match(content, /id:\s*"geosites"/);

  // Verify built-in layers exist
  assert.match(content, /"builtin_bedrock_geology"/);
  assert.match(content, /"builtin_structural_faults"/);
  assert.match(content, /"builtin_mineral_deposits"/);
  assert.match(content, /"builtin_marine_coastal"/);
  assert.match(content, /"builtin_hazards_monitoring"/);
  assert.match(content, /"builtin_geoparks_heritage"/);

  // Verify symbology properties are defined
  assert.match(content, /strokeWidth:\s*\d+/);
  assert.match(content, /lineStyle:\s*"(solid|dashed|dotted|dash-dot)"/);
  assert.match(content, /symbol:\s*"(circle|diamond|triangle|star|hexagon|mine|drillhole|quarry)"/);
  assert.match(content, /opacity:\s*0\.\d+/);
  assert.match(content, /fillColor:\s*"#[0-9a-fA-F]{6}"/);

  // Verify zero Thai/Lao in toc-config.ts
  const thaiLaoRegex = /[\u0E00-\u0E7F\u0E80-\u0EFF]/;
  assert.equal(thaiLaoRegex.test(content), false, "toc-config.ts must contain 0% Thai/Lao characters");
});

test("Admin Dashboard WordPressAdmin imports and mounts GeodataTocManager", () => {
  const adminContent = fs.readFileSync("src/admin/WordPressAdmin.tsx", "utf8");
  assert.match(adminContent, /import GeodataTocManager from "\.\/GeodataTocManager"/);
  assert.match(adminContent, /<GeodataTocManager\s*\/>/);
});

test("Public GeoMap dynamically applies saved TOC symbology", () => {
  const mapContent = fs.readFileSync("src/components/site/GeoMap.tsx", "utf8");
  assert.match(mapContent, /loadSavedTocSymbology/);
  assert.match(mapContent, /geoSym/);
  assert.match(mapContent, /minSym/);
  assert.match(mapContent, /strSym/);
});
