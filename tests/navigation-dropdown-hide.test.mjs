import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

test("Navigation: Dropdown menu closes immediately upon clicking any catalogue item", () => {
  const chromeCode = fs.readFileSync(path.join(root, "src/components/site/Chrome.tsx"), "utf8");

  // 1. Must track open dropdown state
  assert.match(chromeCode, /openGroup,\s*setOpenGroup/);

  // 2. Must define closeDropdowns handler that sets openGroup(null) and blurs active element
  assert.match(chromeCode, /const closeDropdowns = useCallback\(\(\) => \{/);
  assert.match(chromeCode, /setOpenGroup\(null\)/);
  assert.match(chromeCode, /document\.activeElement\.blur\(\)/);

  // 3. Dropdown panels are conditionally rendered based on openGroup === group.en
  assert.match(chromeCode, /const isOpen = openGroup === group\.en/);
  assert.match(chromeCode, /\{isOpen && \(\s*<div className="gc-nav-panel"/);

  // 4. Every dropdown catalogue item calls closeDropdowns() in onClick
  assert.match(chromeCode, /<Link[^>]+className="gc-nav-link"[^>]+onClick=\{\(\) => \{\s*closeDropdowns\(\);\s*\}\}/);

  // 5. Route navigation, outside clicks, and Escape key close dropdowns
  assert.match(chromeCode, /window\.addEventListener\("popstate", onPopState\)/);
  assert.match(chromeCode, /document\.addEventListener\("mousedown", onMouseDown\)/);
  assert.match(chromeCode, /document\.addEventListener\("keydown", onKeyDown\)/);
});

test("CSS: Stylesheet displays dropdown only when active and removes sticky hover overrides", () => {
  const css = fs.readFileSync(path.join(root, "src/styles.css"), "utf8");

  // Check that .gc-nav-group:hover .gc-nav-panel is removed or superseded by is-open
  assert.ok(!css.includes(".gc-nav-group:hover .gc-nav-panel"), "hover must not force gc-nav-panel display");
  assert.ok(!css.includes(".gc-nav-group:focus-within .gc-nav-panel"), "focus-within must not force gc-nav-panel display");

  // Chevron rotates only when group is-open or aria-expanded=true
  assert.ok(css.includes(".gc-nav-group.is-open .gc-chevron"), "chevron rotates on is-open");
  assert.ok(css.includes('.gc-nav-trigger[aria-expanded="true"] .gc-chevron'), "chevron rotates on aria-expanded=true");
});
