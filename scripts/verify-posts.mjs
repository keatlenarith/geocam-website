// Browser integration contract with isolated mocked Supabase storage and auth.
// These checks exercise the real dashboard and visitor UI; they do not prove RLS.
import {chromium,expect} from 'playwright/test';
import assert from 'node:assert/strict';
const base=process.env.SITE_URL||'http://127.0.0.1:3001';
const api='https://pziwobqfysoadswgnjjm.supabase.co';
const browser=await chromium.launch({channel:'chrome',headless:true});
const drafts=new Map(),published=new Map();let failSave=false,signouts=0;
const user={id:'00000000-0000-4000-8000-000000000001',aud:'authenticated',role:'authenticated',email:'keatlenarith@gmail.com',email_confirmed_at:new Date().toISOString(),app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
const token=['eyJhbGciOiJIUzI1NiJ9',Buffer.from(JSON.stringify({sub:user.id,role:'authenticated',aud:'authenticated',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url'),'test-signature'].join('.');
async function context(){const ctx=await browser.newContext();await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,route=>route.abort());await ctx.route(api+'/**',async route=>{const req=route.request(),url=new URL(req.url()),path=url.pathname,admin=req.headers().authorization==='Bearer '+token;const send=(value,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(value)});
 if(path==='/auth/v1/token')return send({access_token:token,token_type:'bearer',expires_in:3600,refresh_token:'test-refresh',user});
 if(path==='/auth/v1/user')return send(user);
 if(path==='/auth/v1/logout'){signouts++;return route.fulfill({status:204});}
 if(path==='/rest/v1/rpc/geocam_is_admin')return send(admin);
 if(path==='/rest/v1/geocam_drafts'||path==='/rest/v1/geocam_published')return send({id:'site',content:{}});
 if(path==='/rest/v1/geocam_post_drafts'||path==='/rest/v1/geocam_post_public'){
  const privateTable=path.endsWith('drafts'),table=privateTable?drafts:published,id=url.searchParams.get('id')?.replace(/^eq\./,'');
  if((privateTable||req.method()!=='GET')&&!admin)return send({message:'permission denied'},403);
  if(req.method()==='GET'){const rows=id?[table.get(id)].filter(Boolean):[...table.values()];return send(req.headers().accept?.includes('object+json')?rows[0]??null:rows);}
  if(failSave&&privateTable)return send({message:'Simulated save failure'},500);
  if(req.method()==='DELETE'){table.delete(id);return route.fulfill({status:204});}
  const body=req.postDataJSON();if(req.method()==='PATCH'){table.set(id,{...table.get(id),...structuredClone(body)});return route.fulfill({status:204});}
  table.set(body.id,structuredClone(body));return route.fulfill({status:201});
 }
 throw Error('Unexpected Supabase request: '+path);
 });return ctx;}
try{
 const admin=await context(),publicContext=await context(),page=await admin.newPage(),visitor=await publicContext.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base+'/admin/login',{waitUntil:'domcontentloaded'});await page.getByLabel('Email address').fill(user.email);await page.getByLabel('Password',{exact:true}).fill('test-password-only');await page.getByRole('button',{name:'Sign in',exact:true}).first().click();await page.getByRole('link',{name:'Open dashboard'}).click();await page.getByRole('link',{name:'Posts',exact:true}).click();
 await page.getByRole('button',{name:'New post',exact:true}).click();const english=page.locator('section[lang="en"]');const khmer=page.locator('section[lang="km"]');
 await khmer.getByLabel('Title',{exact:true}).fill('ចំណងជើង');await page.getByRole('button',{name:'Save draft',exact:true}).click();await expect(page.getByRole('alert')).toContainText('Add an English title');assert.equal(drafts.size,0);await english.getByLabel('Title',{exact:true}).fill('Integration live post');await english.getByLabel('Summary',{exact:true}).fill('Public summary version one');await english.getByLabel(/^Body \(HTML\)/).fill('<p>Public body version one</p><script>window.unsafePost=true</script>');
 await page.getByRole('button',{name:'Save draft',exact:true}).click();await expect(page.getByRole('status')).toContainText('Draft saved');assert.equal(drafts.size,1);assert.equal(published.size,0);const id=[...drafts.keys()][0];
 await visitor.goto(base+'/news',{waitUntil:'domcontentloaded'});await expect(visitor.getByRole('heading',{name:'Integration live post',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Publish',exact:true}).click();await expect(page.getByRole('status')).toContainText('Post published');assert.equal(published.size,1);await visitor.reload();await visitor.getByRole('heading',{name:'Integration live post',exact:true}).click();await expect(visitor.locator('article')).toContainText('Public body version one');assert.equal(await visitor.locator('article script').count(),0);assert.equal(await visitor.evaluate(()=>window.unsafePost),undefined);
 await khmer.getByLabel('Title',{exact:true}).fill('ចំណងជើងចាស់');await english.getByLabel('Title',{exact:true}).fill('Integration private revision');await expect(khmer.getByLabel('Title',{exact:true})).toHaveValue('');await english.getByLabel(/^Body \(HTML\)/).fill('<p>Private revision body</p>');await page.getByRole('button',{name:'Save draft',exact:true}).click();await expect(page.getByRole('status')).toContainText('Draft saved');await visitor.reload();await expect(visitor.locator('article')).toContainText('Public body version one');await expect(visitor.getByRole('heading',{name:'Integration live post',exact:true})).toBeVisible();assert.equal(published.get(id).data.titleEn,'Integration live post');
 await english.getByLabel('Title',{exact:true}).fill('Guard unsaved');assert.equal(await page.evaluate(()=>{const event=new Event('beforeunload',{cancelable:true});window.dispatchEvent(event);return event.defaultPrevented;}),true);await page.getByRole('link',{name:'Pages',exact:true}).click();const modal=page.getByRole('dialog',{name:'Save your changes?'});await expect(modal).toBeVisible();await modal.getByRole('button',{name:'Keep editing',exact:true}).click();await expect(english.getByLabel('Title',{exact:true})).toHaveValue('Guard unsaved');
 await page.getByRole('link',{name:'Pages',exact:true}).click();failSave=true;await modal.getByRole('button',{name:'Save draft and leave',exact:true}).click();await expect(modal.getByRole('alert')).toContainText('Could not save. Your edits are still here.');await expect(modal).toBeVisible();assert.ok(page.url().includes('section=posts'));failSave=false;await modal.getByRole('button',{name:'Save draft and leave',exact:true}).click();await expect(page).toHaveURL(/section=pages/);assert.equal(drafts.get(id).data.titleEn,'Guard unsaved');
 await page.getByRole('link',{name:'Posts',exact:true}).click();await page.getByRole('button',{name:'Edit',exact:true}).click();await english.getByLabel('Title',{exact:true}).fill('Discard me');await page.getByRole('link',{name:'Pages',exact:true}).click();await modal.getByRole('button',{name:'Discard changes',exact:true}).click();await expect(page).toHaveURL(/section=pages/);assert.equal(drafts.get(id).data.titleEn,'Guard unsaved');
 await page.getByRole('link',{name:'Posts',exact:true}).click();await page.getByRole('button',{name:'Edit',exact:true}).click();await english.getByLabel('Title',{exact:true}).fill('Signout guard');await page.getByRole('button',{name:'Sign out',exact:true}).click();await expect(modal).toBeVisible();assert.equal(signouts,0);await modal.getByRole('button',{name:'Keep editing',exact:true}).click();assert.equal(signouts,0);await page.getByRole('button',{name:'Sign out',exact:true}).click();await modal.getByRole('button',{name:'Discard changes',exact:true}).click();await expect(page).toHaveURL(/admin\/login/);assert.equal(signouts,1);
 await visitor.goto(base+'/about',{waitUntil:'domcontentloaded'});assert.equal(await visitor.evaluate(()=>{const event=new Event('beforeunload',{cancelable:true});window.dispatchEvent(event);return event.defaultPrevented;}),false);assert.deepEqual(errors,[]);
 console.log('PASS: post draft privacy, publication, sanitized reader, live snapshot isolation, English invalidation, save/discard/keep guards, failed-save preservation, sign-out guard, ordinary-page exit.');
}finally{await browser.close();}




