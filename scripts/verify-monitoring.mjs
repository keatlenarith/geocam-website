import {chromium,expect} from 'playwright/test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.env.SITE_URL||'http://127.0.0.1:3001';
const source='https://ministry-of-mines-and-energy.projects.earthengine.app/view/mining-monitoring-dashboard';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto(base+'/environmental-monitoring');
 await expect(page.getByRole('heading',{name:'Environmental Monitoring Dashboard',exact:true})).toBeVisible();
 await expect(page.getByRole('link',{name:'Open original dashboard'})).toHaveAttribute('href',source);
 await expect(page.locator('iframe')).toHaveAttribute('src',source);
 const frame=page.frameLocator('iframe');
 await expect(frame.locator('#content')).toBeVisible({timeout:45000});
 await expect.poll(async()=>((await frame.locator('#content').innerText()).trim()).length,{timeout:45000}).toBeGreaterThan(50);
 console.log('Earth Engine iframe text:',(await frame.locator('#content').innerText()).slice(0,400));
 await mkdir('.playwright',{recursive:true});await page.screenshot({path:'.playwright/environmental-monitoring.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Monitoring page must fit mobile width');
 await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('navigation',{name:'Mobile'}).getByText('Geoscience & Data',{exact:true}).click();await expect(page.getByRole('navigation',{name:'Mobile'}).getByRole('link',{name:'Environmental Monitoring',exact:true})).toHaveAttribute('href','/environmental-monitoring');
 console.log('PASS: monitoring page, live external iframe content, source link, mobile layout and navigation.');
}finally{await browser.close();}
