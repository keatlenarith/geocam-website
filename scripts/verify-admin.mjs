// Isolated browser integration tests. Auth responses are mocked here only;
// actual database authorization is checked separately in Supabase SQL.
import {chromium, expect} from 'playwright/test';
import assert from 'node:assert/strict';
const base=process.env.SITE_URL||'http://127.0.0.1:3001';
const api='https://pziwobqfysoadswgnjjm.supabase.co';
const browser=await chromium.launch({channel:'chrome',headless:true});
let draft={},published={};
const user={id:'00000000-0000-4000-8000-000000000001',aud:'authenticated',role:'authenticated',email:'keatlenarith@gmail.com',email_confirmed_at:new Date().toISOString(),app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
const token=['eyJhbGciOiJIUzI1NiJ9',Buffer.from(JSON.stringify({sub:user.id,role:'authenticated',aud:'authenticated',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url'),'test-signature'].join('.');
async function context(){const ctx=await browser.newContext();await ctx.route(api+'/**',async route=>{const req=route.request(),path=new URL(req.url()).pathname;const admin=req.headers().authorization==='Bearer '+token;
  const send=(value,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(value)});
  if(path==='/auth/v1/token'){const body=req.postDataJSON();if(body.password!=='test-password-only')return send({msg:'Invalid login credentials',error_code:'invalid_credentials'},400);return send({access_token:token,token_type:'bearer',expires_in:3600,refresh_token:'test-refresh',user});}
  if(path==='/auth/v1/user')return send(user);
  if(path==='/auth/v1/logout')return route.fulfill({status:204});
  if(path==='/rest/v1/rpc/geocam_is_admin')return send(admin);
  if(path==='/rest/v1/geocam_drafts'||path==='/rest/v1/geocam_published'){
    const isDraft=path.endsWith('drafts');
    if(req.method()==='GET'){if(isDraft&&!admin)return send({message:'permission denied'},403);return send({id:'site',content:isDraft?draft:published});}
    if(!admin)return send({message:'permission denied'},403);
    const body=req.postDataJSON();if(isDraft)draft=structuredClone(body.content);else published=structuredClone(body.content);return route.fulfill({status:201});
  }
  throw Error('Unexpected Supabase request: '+path);
});return ctx;}
try{
 const adminContext=await context(),visitorContext=await context();const page=await adminContext.newPage(),visitor=await visitorContext.newPage();
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await visitor.goto(base,{waitUntil:'domcontentloaded'});await expect(visitor.locator('[data-cms-ui]')).toHaveCount(0);
 const original=await visitor.locator('[data-cms-id="hero-line-one"]').textContent();
 await page.goto(base+'/admin/cms',{waitUntil:'domcontentloaded'});await expect(page.getByRole('heading',{name:'Administrator access required'})).toBeVisible();
 await page.goto(base+'/admin/login',{waitUntil:'domcontentloaded'});await page.getByLabel('Email address').fill(user.email);await page.getByLabel('Password',{exact:true}).fill('incorrect');await page.getByRole('button',{name:'Sign in',exact:true}).first().click();await expect(page.getByRole('status')).toContainText('Invalid login credentials');
 await page.getByLabel('Password',{exact:true}).fill('test-password-only');await page.getByRole('button',{name:'Sign in',exact:true}).first().click();await page.getByRole('link',{name:'Open dashboard'}).click();await page.waitForLoadState('domcontentloaded');await expect(page.getByRole('heading',{name:'Content dashboard'})).toBeVisible();
 await page.getByRole('link',{name:'Home',exact:true}).last().click();await page.getByRole('button',{name:'Visual edit',exact:true}).click();
 const editable=page.locator('[data-cms-id="hero-line-one"]');
 await editable.click();await expect(editable).not.toHaveAttribute('contenteditable','plaintext-only');
 await editable.dblclick();await expect(editable).toHaveAttribute('contenteditable','plaintext-only');
 await adminContext.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});
 await editable.press('Control+A');await editable.press('Control+C');assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),original);
 await editable.press('Control+X');await expect(editable).toHaveText('');await editable.press('Control+V');await expect(editable).toHaveText(original);
 await editable.fill('Cancelled text');await editable.press('Escape');await expect(editable).toHaveText(original);await expect(editable).not.toHaveAttribute('contenteditable','plaintext-only');
 await editable.dblclick();await editable.fill('');await editable.press('Enter');await expect(editable).toHaveText('');await editable.dblclick();
 await page.evaluate(()=>{const data=new DataTransfer();data.setData('text/plain','<b>Pasted as text</b>');data.setData('text/html','<img src=x onerror="window.geocamPasteUnsafe=true">');document.activeElement.dispatchEvent(new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:data}));});
 await expect(editable).toHaveText('<b>Pasted as text</b>');assert.equal(await editable.locator('img,b,script').count(),0);assert.equal(await page.evaluate(()=>window.geocamPasteUnsafe),undefined);
 await editable.fill('Private draft integration test');await expect(page.locator('[data-cms-id="hero-line-one"]')).toHaveText('Private draft integration test');
 await page.getByRole('button',{name:'Save draft',exact:true}).click();await expect(page.getByRole('status')).toContainText('Draft saved');
 assert.ok(Object.keys(draft).length>0);assert.deepEqual(published,{});
 await visitor.reload();await expect(visitor.locator('[data-cms-id="hero-line-one"]')).toHaveText(original);
 page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Publish',exact:true}).click();await expect(page.getByRole('status')).toContainText('Published for all visitors');
 await visitor.reload();await expect(visitor.locator('[data-cms-id="hero-line-one"]')).toHaveText('Private draft integration test');await expect(visitor.locator('[data-cms-ui]')).toHaveCount(0);
 await page.getByRole('button',{name:'Sign out',exact:true}).click();await expect(page.locator('[data-cms-ui]')).toHaveCount(0);
 assert.deepEqual(errors,[]);console.log('PASS: visitor gate, invalid login, admin login, private draft, publish visible in independent visitor browser, and sign-out.');
}finally{await browser.close();}
