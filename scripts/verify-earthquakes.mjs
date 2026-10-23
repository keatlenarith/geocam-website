import { chromium, expect } from 'playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.env.SITE_URL || 'http://localhost:3000';
const artifactDir = 'C:/Users/USER/.gemini/antigravity/brain/02ec04c2-7cd0-49d1-9603-17054f9e60b9';

const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  console.log('1. Navigating to /earthquake-monitoring...');
  await page.goto(base + '/earthquake-monitoring', { waitUntil: 'domcontentloaded' });

  // Check header
  await expect(page.getByRole('heading', { name: 'Earthquake monitoring', level: 1 })).toBeVisible();
  console.log('✔ Header confirmed');

  // Check regional label
  await expect(page.getByText('Cambodia & region', { exact: false }).first()).toBeVisible();
  console.log('✔ Regional bounding envelope label confirmed');

  // Check provider indicators
  await expect(page.getByText('USGS', { exact: true }).first()).toBeVisible();
  console.log('✔ USGS indicator confirmed');

  // Wait for data to load
  await page.waitForTimeout(2000);

  // Check summary cards
  await expect(page.getByText('Reported Events', { exact: true })).toBeVisible();
  await expect(page.getByText('Largest Magnitude', { exact: true })).toBeVisible();
  await expect(page.getByText('Latest Event Time', { exact: true })).toBeVisible();
  console.log('✔ Metric cards confirmed');

  // Check announcements section
  await expect(page.getByText('Latest Regional Earthquake Bulletins', { exact: false }).first()).toBeVisible();
  console.log('✔ Announcements feed confirmed');

  // Check event list and map
  const eventCards = page.locator('article');
  const count = await eventCards.count();
  console.log(`✔ Event cards rendered: ${count}`);

  // Capture desktop screenshot
  const desktopScreenshot = `${artifactDir}/earthquake_monitoring_desktop.png`;
  await page.screenshot({ path: desktopScreenshot, fullPage: false });
  console.log(`✔ Saved desktop screenshot to ${desktopScreenshot}`);

  // Test filter switching: 30 days
  const thirtyDayBtn = page.getByRole('button', { name: '30 Days', exact: true });
  await thirtyDayBtn.click();
  await page.waitForTimeout(500);
  console.log('✔ 30-day filter clicked');

  // Test mobile responsiveness
  console.log('2. Checking mobile layout (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  const fitsMobile = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  assert.ok(fitsMobile, 'Earthquake monitoring page must not cause horizontal scrolling on mobile');
  console.log('✔ Mobile viewport width verified (no horizontal overflow)');

  // Verify mobile navigation
  const menuButton = page.getByRole('button', { name: 'Menu', exact: true });
  if (await menuButton.isVisible()) {
    await menuButton.click();
    await page.getByRole('navigation', { name: 'Mobile' }).getByText('Geoscience & Data', { exact: true }).click();
    const navLink = page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Earthquake Monitoring', exact: true });
    await expect(navLink).toHaveAttribute('href', '/earthquake-monitoring');
    console.log('✔ Mobile navigation link under Geoscience & Data confirmed');
  }

  // Capture mobile screenshot
  const mobileScreenshot = `${artifactDir}/earthquake_monitoring_mobile.png`;
  await page.screenshot({ path: mobileScreenshot, fullPage: false });
  console.log(`✔ Saved mobile screenshot to ${mobileScreenshot}`);

  // Reset viewport and check homepage integration
  console.log('3. Checking Homepage integration at / ...');
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Check homepage earthquake section
  const hpSection = page.locator('section').filter({ hasText: 'Regional Earthquake Monitoring' });
  await expect(hpSection.first()).toBeVisible();
  console.log('✔ Homepage earthquake section confirmed');

  const hpLink = page.getByRole('link', { name: /Full Monitoring Console/i });
  await expect(hpLink).toHaveAttribute('href', '/earthquake-monitoring');
  console.log('✔ Homepage link to full monitoring console confirmed');

  const hpScreenshot = `${artifactDir}/earthquake_homepage_section.png`;
  await page.screenshot({ path: hpScreenshot, fullPage: false });
  console.log(`✔ Saved homepage screenshot to ${hpScreenshot}`);

  console.log('ALL PLAYWRIGHT VERIFICATION CHECKS PASSED SUCCESSFULLY!');
} finally {
  await browser.close();
}
