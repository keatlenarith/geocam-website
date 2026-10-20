import {chromium,expect} from 'playwright/test';
import {readFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.SITE_URL||'http://127.0.0.1:3001';
const library=JSON.parse(await readFile('src/lib/research-library.json','utf8'));
const glossary=JSON.parse(await readFile('src/lib/lexicon-terms.json','utf8'));
const translations=Object.assign({},...await Promise.all(['public','research','tools'].map(async name=>JSON.parse(await readFile('src/lib/translations/'+name+'-km.json','utf8')))));
const keys=new Map(Object.entries(translations).map(([key,value])=>[key.replace(/\s+/g,' ').trim().toLowerCase(),value]));
for(const record of library)for(const field of ['title','abstract'])assert.ok(keys.has(record[field].replace(/\s+/g,' ').trim().toLowerCase()),record[field]);
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const ctx=await browser.newContext();await ctx.route('**/research/documents/**',route=>route.abort());
 const page=await ctx.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base+'/contact');const contactEnglish=await page.locator('h1').innerText();
 await page.getByRole('button',{name:'ខ្មែរ',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('lang','km');await expect(page.locator('h1')).not.toHaveText(contactEnglish);
 await page.goto(base+'/');await page.goto(base+'/contact');await page.getByRole('button',{name:'EN',exact:true}).click();await expect(page.locator('h1')).toHaveText(contactEnglish);
 await page.goto(base+'/publications');await expect(page.getByText('50 results',{exact:true})).toBeVisible();await page.getByRole('button',{name:'ខ្មែរ',exact:true}).click();await expect(page.getByText('លទ្ធផល 50',{exact:true})).toBeVisible();
 await expect(page.locator('select').first().locator('option[value="Hydrogeology"]')).toHaveText(glossary.terms.Hydrogeology.khmer);
 await page.locator('#q').fill('គីមីភូគព្ភ');await expect.poll(()=>page.locator('a[href^="/publications/view?"]').count()).toBeGreaterThan(0);assert.ok(await page.locator('a[href^="/publications/view?"]').count()<50);
 await page.locator('#q').fill('');await page.locator('select').first().selectOption('Hydrogeology');assert.equal(await page.locator('select').first().inputValue(),'Hydrogeology');
 await page.locator('select').first().selectOption('All');await page.locator('select').nth(2).selectOption('Sources');await expect(page.locator('a[href^="/publications/view?"]')).toHaveCount(6);
 await page.getByRole('button',{name:'EN',exact:true}).click();await expect(page.getByText('6 results',{exact:true})).toBeVisible();assert.equal(await page.locator('select').nth(2).inputValue(),'Sources');
 await page.goto(base+'/geodata');await page.getByRole('button',{name:'ខ្មែរ',exact:true}).click();const filter=page.locator('select').first();
 await expect(filter.locator('option[value="faults"]')).toContainText(glossary.terms.Fault.khmer);await expect(filter.locator('option[value="minerals"]')).toContainText(glossary.terms.Mineral.khmer);await expect(filter.locator('option[value="geosites"]')).toContainText(glossary.terms.Geosite.khmer);
 await filter.selectOption('faults');assert.equal(await filter.inputValue(),'faults');
 await mkdir('.playwright',{recursive:true});await page.screenshot({path:'.playwright/khmer-geodata.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS: all 50 research title/description translations, live lexicon terminology, Khmer search, filter values, dynamic counts, Khmer-first navigation and English round trip.');
}finally{await browser.close();}
