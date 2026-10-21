// Real browser UI with isolated mocked authentication/storage. Google font files
// are blocked: computed CSS families prove configuration, not downloaded metrics.
import {chromium,expect} from 'playwright/test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.env.SITE_URL||'http://127.0.0.1:3001',api='https://pziwobqfysoadswgnjjm.supabase.co';
const browser=await chromium.launch({channel:'chrome',headless:true});
let draft={'/::en':{staged:{kind:'text',value:'Unapproved page change'}}},published={'/::en':{staged:{kind:'text',value:'Public page content'}}};const calls=[];
const user={id:'00000000-0000-4000-8000-000000000001',aud:'authenticated',role:'authenticated',email:'keatlenarith@gmail.com',email_confirmed_at:new Date().toISOString(),app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
const token=['eyJhbGciOiJIUzI1NiJ9',Buffer.from(JSON.stringify({sub:user.id,role:'authenticated',aud:'authenticated',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url'),'test-signature'].join('.');
async function context(){const ctx=await browser.newContext();await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,route=>route.abort());await ctx.route(api+'/**',async route=>{const req=route.request(),path=new URL(req.url()).pathname,admin=req.headers().authorization==='Bearer '+token;const send=(value,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(value)});
 if(path==='/auth/v1/token')return send({access_token:token,token_type:'bearer',expires_in:3600,refresh_token:'test-refresh',user});if(path==='/auth/v1/user')return send(user);if(path==='/rest/v1/rpc/geocam_is_admin')return send(admin);
 if(path==='/rest/v1/geocam_drafts'||path==='/rest/v1/geocam_published'){assert.equal(req.method(),'GET','Font saves must use scoped RPC, not whole-site writes');return send({id:'site',content:path.endsWith('drafts')?draft:published});}
 if(path==='/rest/v1/rpc/geocam_update_fonts'){assert.ok(admin);const params=req.postDataJSON();assert.deepEqual(Object.keys(params).sort(),['p_english','p_khmer','p_publish']);calls.push(params);const appearance={englishFont:{kind:'text',value:params.p_english},khmerFont:{kind:'text',value:params.p_khmer}};draft={...draft,__appearance:structuredClone(appearance)};if(params.p_publish)published={...published,__appearance:structuredClone(appearance)};return send({draft,published});}
 throw Error('Unexpected Supabase request: '+path);
 });return ctx;}
async function families(page){return page.evaluate(()=>Object.fromEntries(['body','header','h1','button'].map(selector=>[selector,getComputedStyle(document.querySelector(selector)).fontFamily])));}
async function fontIs(page,font){await expect.poll(async()=>Object.values(await families(page)).every(value=>value.toLowerCase().includes(font.toLowerCase()))).toBe(true);}
try{
 const admin=await context(),publicContext=await context(),page=await admin.newPage(),visitor=await publicContext.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));visitor.on('pageerror',e=>errors.push(e.message));
 await visitor.goto(base,{waitUntil:'domcontentloaded'});await fontIs(visitor,'Times New Roman');
 await page.goto(base+'/admin/login',{waitUntil:'domcontentloaded'});await page.getByLabel('Email address').fill(user.email);await page.getByLabel('Password',{exact:true}).fill('test-password-only');await page.getByRole('button',{name:'Sign in',exact:true}).first().click();await page.getByRole('link',{name:'Open dashboard'}).click();await page.getByRole('link',{name:'Appearance',exact:true}).click();
 const english=page.getByLabel('English font',{exact:true}),khmer=page.getByLabel('Khmer font / ពុម្ពអក្សរខ្មែរ',{exact:true});await expect(english).toHaveValue('times');await english.selectOption('arial');await khmer.selectOption('battambang');
 await expect.poll(()=>page.locator('div[lang="en"] > h3').evaluate(el=>getComputedStyle(el).fontFamily)).toContain('Arial');await visitor.reload();await fontIs(visitor,'Times New Roman');
 await page.getByRole('button',{name:'Save draft',exact:true}).click();await expect(page.getByRole('status')).toContainText('Font draft saved');assert.equal(calls.length,1);assert.equal(calls[0].p_publish,false);assert.equal(published.__appearance,undefined);await visitor.reload();await fontIs(visitor,'Times New Roman');
 await page.reload();await expect(english).toHaveValue('arial');await expect(khmer).toHaveValue('battambang');await page.getByRole('button',{name:'Approve and apply fonts',exact:true}).click();await expect(page.getByRole('status')).toContainText('Fonts approved');assert.equal(calls[1].p_publish,true);assert.equal(published['/::en'].staged.value,'Public page content');assert.equal(draft['/::en'].staged.value,'Unapproved page change');
 await visitor.reload();await fontIs(visitor,'Arial');await visitor.getByRole('button',{name:'ខ្មែរ',exact:true}).click();await fontIs(visitor,'Battambang');await visitor.reload();await fontIs(visitor,'Battambang');
 await english.selectOption('georgia');await khmer.selectOption('siemreap');await visitor.reload();await fontIs(visitor,'Battambang');assert.equal(published.__appearance.englishFont.value,'arial');assert.equal(published.__appearance.khmerFont.value,'battambang');
 // Save the preview draft to leave a clean form for the mobile screenshot.
 await page.getByRole('button',{name:'Save draft',exact:true}).click();await expect(page.getByRole('status')).toContainText('Font draft saved');await page.setViewportSize({width:390,height:844});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);await mkdir('.playwright',{recursive:true});await page.screenshot({path:'.playwright/appearance-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS: default Times, private font draft, explicit approval, independent visitor Arial/Battambang across body/header/h1/button, reload persistence, preview isolation, scoped font RPC, mobile no overflow.');
}finally{await browser.close();}
