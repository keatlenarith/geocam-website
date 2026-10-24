import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.env.SITE_URL || 'http://localhost:3001';
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  await mkdir('.playwright/screenshots', { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('Testing Live Earthquake Stream & Categories on:', base);

  // 1. Visit Earthquake Monitoring in EN
  await page.goto(base + '/earthquake-monitoring', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Verify Live Seismic Stream element
  const liveStreamBadge = await page.locator('text=LIVE SEISMIC STREAM').count();
  console.log('Live Seismic Stream header count:', liveStreamBadge);
  assert.ok(liveStreamBadge > 0, 'Must have LIVE SEISMIC STREAM badge');

  // Verify category buttons exist: 6h, 24h, 7 Days, 30 Days
  const btn6h = page.locator('button', { hasText: /^6h$/ }).first();
  const btn24h = page.locator('button', { hasText: /^24h$/ }).first();
  const btn7d = page.locator('button', { hasText: /^7 Days$/ }).first();
  const btn30d = page.locator('button', { hasText: /^30 Days$/ }).first();

  assert.ok(await btn6h.count() > 0, 'Must have 6h button');
  assert.ok(await btn24h.count() > 0, 'Must have 24h button');
  assert.ok(await btn7d.count() > 0, 'Must have 7 Days button');
  assert.ok(await btn30d.count() > 0, 'Must have 30 Days button');

  // Capture screenshot of default 7d view with live ticker
  await page.screenshot({ path: '.playwright/screenshots/live-eq-7d-en.png', fullPage: false });
  console.log('Captured live-eq-7d-en.png');

  // Click 6h category
  await btn6h.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: '.playwright/screenshots/live-eq-6h-en.png', fullPage: false });
  console.log('Captured live-eq-6h-en.png');

  // Click 24h category
  await btn24h.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: '.playwright/screenshots/live-eq-24h-en.png', fullPage: false });
  console.log('Captured live-eq-24h-en.png');

  // Click 30d category
  await btn30d.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: '.playwright/screenshots/live-eq-30d-en.png', fullPage: false });
  console.log('Captured live-eq-30d-en.png');

  // Switch to Khmer
  await page.locator('header button').filter({ hasText: /^KH$/ }).first().click();
  await page.waitForFunction(() => document.documentElement.lang === 'km');
  await page.waitForTimeout(600);

  // Verify Khmer live banner & categories
  const khmerLiveBadge = await page.locator('text=ការផ្សាយផ្ទាល់រញ្ជួយដី').count();
  console.log('Khmer Live stream badge count:', khmerLiveBadge);
  assert.ok(khmerLiveBadge > 0, 'Must have Khmer live stream badge');

  const khBtn6h = page.locator('button', { hasText: /^៦ ម៉ោង$/ }).first();
  const khBtn24h = page.locator('button', { hasText: /^២៤ ម៉ោង$/ }).first();
  const khBtn7d = page.locator('button', { hasText: /^៧ ថ្ងៃ$/ }).first();
  const khBtn30d = page.locator('button', { hasText: /^៣០ ថ្ងៃ$/ }).first();

  assert.ok(await khBtn6h.count() > 0, 'Must have ៦ ម៉ោង button');
  assert.ok(await khBtn24h.count() > 0, 'Must have ២៤ ម៉ោង button');
  assert.ok(await khBtn7d.count() > 0, 'Must have ៧ ថ្ងៃ button');
  assert.ok(await khBtn30d.count() > 0, 'Must have ៣០ ថ្ងៃ button');

  // Capture screenshot of Khmer live stream
  await page.screenshot({ path: '.playwright/screenshots/live-eq-stream-km.png', fullPage: false });
  console.log('Captured live-eq-stream-km.png');

  console.log('PASS: All Live Event & Category tests passed successfully!');
} finally {
  await browser.close();
}
