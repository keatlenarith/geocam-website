import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.env.SITE_URL || 'http://localhost:3001';
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  await mkdir('.playwright/screenshots', { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('Testing Bilingual Roundtrip & Visuals on:', base);

  // Helper to click language toggle
  const switchToKm = async () => {
    await page.locator('header button').filter({ hasText: /^KH$/ }).first().click();
    await page.waitForFunction(() => document.documentElement.lang === 'km');
    await page.waitForTimeout(400);
  };
  const switchToEn = async () => {
    await page.locator('header button').filter({ hasText: /^EN$/ }).first().click();
    await page.waitForFunction(() => document.documentElement.lang === 'en');
    await page.waitForTimeout(400);
  };

  // 1. Visit Home in EN
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '.playwright/screenshots/01-home-en.png', fullPage: false });
  console.log('01: Home EN captured');

  // Switch to KH
  await switchToKm();
  await page.screenshot({ path: '.playwright/screenshots/02-home-km.png', fullPage: false });
  console.log('02: Home KM captured');

  // Verify Khmer attributes & text
  const langAttr = await page.locator('html').getAttribute('lang');
  assert.equal(langAttr, 'km');
  const heroKicker = await page.locator('text=វេទិកា GEOCAM').count();
  console.log('Hero Khmer kicker found count:', heroKicker);

  // Switch back to EN
  await switchToEn();
  const langAttrEn = await page.locator('html').getAttribute('lang');
  assert.equal(langAttrEn, 'en');
  await page.screenshot({ path: '.playwright/screenshots/03-home-roundtrip-en.png', fullPage: false });
  console.log('03: Home roundtrip EN verified');

  // 2. Earthquake Monitoring Page
  await page.goto(base + '/earthquake-monitoring', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '.playwright/screenshots/04-earthquake-en.png', fullPage: false });

  await switchToKm();
  await page.screenshot({ path: '.playwright/screenshots/05-earthquake-km.png', fullPage: false });
  console.log('05: Earthquake Monitoring KM captured');

  // Switch back to EN
  await switchToEn();
  await page.screenshot({ path: '.playwright/screenshots/06-earthquake-roundtrip-en.png', fullPage: false });

  // 3. News Page & Item
  await page.goto(base + '/news', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '.playwright/screenshots/07-news-en.png', fullPage: false });

  await switchToKm();
  await page.screenshot({ path: '.playwright/screenshots/08-news-km.png', fullPage: false });
  console.log('08: News KM captured');

  // Click first news article
  const firstNewsLink = page.locator('a[href^="/news/"]').first();
  if (await firstNewsLink.count() > 0) {
    await firstNewsLink.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: '.playwright/screenshots/09-news-item-km.png', fullPage: false });
    console.log('09: News item KM captured');
    
    // Switch to EN on news item
    await switchToEn();
    await page.screenshot({ path: '.playwright/screenshots/10-news-item-en.png', fullPage: false });
    console.log('10: News item EN roundtrip captured');
  }

  // 4. Geodata Page
  await page.goto(base + '/geodata', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await switchToKm();
  await page.screenshot({ path: '.playwright/screenshots/11-geodata-km.png', fullPage: false });
  console.log('11: Geodata KM captured');

  await switchToEn();
  await page.screenshot({ path: '.playwright/screenshots/12-geodata-en.png', fullPage: false });
  console.log('12: Geodata EN captured');

  // 5. Check pure EN mode for leftover Khmer characters (excluding language toggle buttons)
  const khmerInEnCheck = await page.evaluate(() => {
    const khmerRegex = /[\u1780-\u17FF]/;
    const issues = [];
    const walker = document.createTreeWalker(document.getElementById('root'), NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const p = n.parentElement;
      if (p?.closest('button, select, [data-no-translate]')) continue;
      const text = n.textContent.trim();
      if (khmerRegex.test(text)) {
        issues.push({ tag: p.tagName, text: text.slice(0, 100) });
      }
    }
    return issues;
  });

  console.log('Leftover Khmer on Geodata EN page count:', khmerInEnCheck.length);
  assert.equal(khmerInEnCheck.length, 0);

  console.log('ALL BILINGUAL SWITCHING TESTS COMPLETED SUCCESSFULLY!');
} finally {
  await browser.close();
}
