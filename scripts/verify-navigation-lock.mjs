import {chromium, expect} from 'playwright/test';
import assert from 'node:assert/strict';

const base = process.env.SITE_URL || 'http://127.0.0.1:3001';
const api = 'https://pziwobqfysoadswgnjjm.supabase.co';
const browser = await chromium.launch({channel: 'chrome', headless: true});

let draft = {
  '/::en': {'hero-line-one': {kind: 'text', value: 'Original English'}},
  '/::km': {'hero-line-one': {kind: 'text', value: 'Original Khmer'}},
};
let published = structuredClone(draft);
let publicationCount = 0;

const user = {
  id: '00000000-0000-4000-8000-000000000001',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'keatlenarith@gmail.com',
  email_confirmed_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  created_at: new Date().toISOString(),
};

const token = [
  'eyJhbGciOiJIUzI1NiJ9',
  Buffer.from(JSON.stringify({sub: user.id, role: 'authenticated', aud: 'authenticated', exp: Math.floor(Date.now() / 1000) + 3600})).toString('base64url'),
  'test-signature',
].join('.');

async function createContext() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, route => route.abort());
  await ctx.route(api + '/**', async route => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    const admin = req.headers().authorization === 'Bearer ' + token;
    const send = (value, status = 200) => route.fulfill({status, contentType: 'application/json', body: JSON.stringify(value)});

    if (path === '/auth/v1/token') return send({access_token: token, token_type: 'bearer', expires_in: 3600, refresh_token: 'test-refresh', user});
    if (path === '/auth/v1/user') return send(user);
    if (path === '/auth/v1/logout') return route.fulfill({status: 204});
    if (path === '/rest/v1/rpc/geocam_is_admin') return send(admin);
    if (path === '/rest/v1/rpc/geocam_publish_page_changes') {
      publicationCount++;
      const params = req.postDataJSON();
      for (const [space, entries] of Object.entries(params.p_changes)) {
        published[space] = {...published[space]};
        for (const [key, entry] of Object.entries(entries)) {
          if (entry === null) delete published[space][key];
          else published[space][key] = structuredClone(entry);
        }
      }
      return send(published);
    }
    if (path === '/rest/v1/rpc/geocam_update_page_field') {
      const {p_page: space, p_key: key, p_entry: entry} = req.postDataJSON();
      draft[space] = {...draft[space], [key]: entry};
      published[space] = {...published[space], [key]: entry};
      return send({draft, published});
    }
    if (path === '/rest/v1/geocam_drafts' || path === '/rest/v1/geocam_published') {
      const isDraft = path.endsWith('drafts');
      if (req.method() === 'GET') return send({id: 'site', content: isDraft ? draft : published});
      draft = structuredClone(req.postDataJSON().content);
      return route.fulfill({status: 201});
    }
    return send({});
  });
  return ctx;
}

try {
  const adminCtx = await createContext();
  const visitorCtx = await createContext();
  const page = await adminCtx.newPage();
  const visitor = await visitorCtx.newPage();

  // 1. Sign in as admin
  await page.goto(base + '/admin/login', {waitUntil: 'domcontentloaded'});
  await page.getByLabel('Email address').fill(user.email);
  await page.getByLabel('Password', {exact: true}).fill('test-password-only');
  await page.getByRole('button', {name: 'Sign in', exact: true}).first().click();
  await page.getByRole('link', {name: 'Open dashboard'}).click();
  await page.waitForLoadState('domcontentloaded');

  // 2. Open Homepage and check Visual Edit is available
  await page.goto(base + '/', {waitUntil: 'domcontentloaded'});
  const visualEditBtn = page.getByRole('button', {name: 'Visual edit', exact: true});
  await expect(visualEditBtn).toBeVisible();

  // 3. Activate Visual Edit mode
  await visualEditBtn.click();
  await expect(page.getByRole('button', {name: 'Finish editing', exact: true})).toBeVisible();
  await expect(page.getByRole('button', {name: 'Publish Live', exact: true})).toBeVisible();

  // 4. TEST ISSUE 1: Navigation lock on click
  // Try clicking any visible link (e.g. Footer About link or quick links)
  const footerAbout = page.locator('footer a[href="/about"]').first();
  await footerAbout.scrollIntoViewIfNeeded();
  await footerAbout.click();
  // URL MUST STAY ON "/" (no navigation)
  await page.waitForTimeout(300);
  assert.equal(new URL(page.url()).pathname, '/');
  // Notice MUST indicate navigation lock
  await expect(page.getByRole('status')).toContainText('Link navigation is locked');

  // 5. TEST ISSUE 1: Navigation lock on double-click
  await footerAbout.dblclick();
  await page.waitForTimeout(300);
  assert.equal(new URL(page.url()).pathname, '/');

  // 6. TEST ISSUE 3: Easy edit and Publish Live
  const editableField = page.locator('[data-cms-id="hero-line-one"]');
  await editableField.dblclick();
  await editableField.fill('Newly Published Hero Title');
  await editableField.press('Enter');
  await expect(page.getByRole('status')).toContainText('Changes saved automatically.');

  // Click Publish Live
  await page.getByRole('button', {name: 'Publish Live', exact: true}).click();
  await expect(page.getByRole('status')).toContainText('Published live!');

  // Visitor verifies the new live content
  await visitor.goto(base + '/', {waitUntil: 'domcontentloaded'});
  await expect(visitor.locator('[data-cms-id="hero-line-one"]')).toHaveText('Newly Published Hero Title');

  // 7. TEST Finish editing: Unlocks navigation
  await page.getByRole('button', {name: 'Finish editing', exact: true}).click();
  await expect(page.getByRole('button', {name: 'Visual edit', exact: true})).toBeVisible();

  // Now click About link -> Navigation should work normally!
  const unlockedAbout = page.locator('footer a[href="/about"]').first();
  await unlockedAbout.scrollIntoViewIfNeeded();
  await unlockedAbout.click();
  await page.waitForLoadState('domcontentloaded');
  assert.equal(new URL(page.url()).pathname, '/about');

  console.log('PASS: Issue 1 (Navigation lock during visual editing) and Issue 3 (Easy edit and Publish Live button) verified successfully!');
} finally {
  await browser.close();
}
