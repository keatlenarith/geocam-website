// Isolated browser integration tests. Auth responses are mocked here only;
// actual database authorization is checked separately in Supabase SQL.
import {chromium, expect} from 'playwright/test';
import assert from 'node:assert/strict';
const base=process.env.SITE_URL||'http://127.0.0.1:3001';
const api='https://pziwobqfysoadswgnjjm.supabase.co';
const browser=await chromium.launch({channel:'chrome',headless:true});
let draft={'/::km':{'hero-line-one':{kind:'text',value:'Existing Khmer translation'}},__appearance:{englishFont:{kind:'text',value:'georgia'},khmerFont:{kind:'text',value:'battambang'}}},published=structuredClone(draft);published.__appearance.englishFont.value='arial';
const publicationCalls=[];
const user={id:'00000000-0000-4000-8000-000000000001',aud:'authenticated',role:'authenticated',email:'keatlenarith@gmail.com',email_confirmed_at:new Date().toISOString(),app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
const token=['eyJhbGciOiJIUzI1NiJ9',Buffer.from(JSON.stringify({sub:user.id,role:'authenticated',aud:'authenticated',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url'),'test-signature'].join('.');
async function context(){const ctx=await browser.newContext();await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,route=>route.abort());await ctx.route(api+'/**',async route=>{const req=route.request(),path=new URL(req.url()).pathname;const admin=req.headers().authorization==='Bearer '+token;
  const send=(value,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(value)});
  if(path==='/auth/v1/token'){const body=req.postDataJSON();if(body.password!=='test-password-only')return send({msg:'Invalid login credentials',error_code:'invalid_credentials'},400);return send({access_token:token,token_type:'bearer',expires_in:3600,refresh_token:'test-refresh',user});}
  if(path==='/auth/v1/user')return send(user);
  if(path==='/auth/v1/logout')return route.fulfill({status:204});
  if(path==='/rest/v1/rpc/geocam_is_admin')return send(admin);
  if(path==='/rest/v1/rpc/geocam_publish_page_changes'){
    assert.ok(admin);const params=req.postDataJSON();assert.deepEqual(Object.keys(params),['p_changes']);assert.equal(params.p_changes.__appearance,undefined);publicationCalls.push(params.p_changes);
    for(const [space,entries] of Object.entries(params.p_changes)){assert.ok(!space.startsWith('__'));published[space]={...published[space]};for(const [key,entry] of Object.entries(entries)){if(entry===null)delete published[space][key];else published[space][key]=structuredClone(entry);}}
    return send(published);
  }
  if(path==='/rest/v1/rpc/geocam_update_page_field'){
    if(!admin)return send({message:'permission denied'},403);
    const {p_page:space,p_key:key,p_entry:entry}=req.postDataJSON();
    const base=space.replace(/::(en|km)$/,'');
    for(const store of [draft,published]) {
      store[space]={...store[space],[key]:entry};
      if(entry.kind==='image'){store[base+'::en']={...store[base+'::en'],[key]:entry};if(store[base+'::km'])delete store[base+'::km'][key];}
      else if(space.endsWith('::en')&&store[base+'::km'])delete store[base+'::km'][key];
    }
    return send({draft,published});
  }
  if(path==='/rest/v1/geocam_post_drafts'||path==='/rest/v1/geocam_post_public')return send([]);
 if(path==='/rest/v1/geocam_drafts'||path==='/rest/v1/geocam_published'){
    const isDraft=path.endsWith('drafts');
    if(req.method()==='GET'){if(isDraft&&!admin)return send({message:'permission denied'},403);return send({id:'site',content:isDraft?draft:published});}
    if(!admin)return send({message:'permission denied'},403);
    const body=req.postDataJSON();if(isDraft)draft=structuredClone(body.content);else throw Error('Page publication must use atomic scoped RPC');return route.fulfill({status:201});
  }
  throw Error('Unexpected Supabase request: '+path);
});return ctx;}
try{
 const adminContext=await context(),visitorContext=await context();const page=await adminContext.newPage(),visitor=await visitorContext.newPage();
 const errors=[];const dialogs=[];page.on('pageerror',error=>errors.push(error.message));page.on('dialog',dialog=>{dialogs.push(dialog.type());void dialog.dismiss();});
 await visitor.goto(base,{waitUntil:'domcontentloaded'});await expect(visitor.locator('[data-cms-ui]')).toHaveCount(0);
 const original=await visitor.locator('[data-cms-id="hero-line-one"]').textContent();
 await page.goto(base+'/admin/cms',{waitUntil:'domcontentloaded'});await expect(page.getByRole('heading',{name:'Administrator access required'})).toBeVisible();
 await page.goto(base+'/admin/cms?admin_preview=true',{waitUntil:'domcontentloaded'});await expect(page.getByRole('heading',{name:'Administrator access required'})).toBeVisible();
 await page.goto(base+'/admin/login',{waitUntil:'domcontentloaded'});await page.getByLabel('Email address').fill(user.email);await page.getByLabel('Password',{exact:true}).fill('incorrect');await page.getByRole('button',{name:'Sign in',exact:true}).first().click();await expect(page.getByRole('status')).toContainText('Invalid login credentials');
 await page.getByLabel('Password',{exact:true}).fill('test-password-only');await page.getByRole('button',{name:'Sign in',exact:true}).first().click();await page.getByRole('link',{name:'Open dashboard'}).click();await page.waitForLoadState('domcontentloaded');await expect(page.locator('#adminmenu .wp-menu-item.active')).toContainText('Dashboard');
 await page.goto(base,{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Visual edit',exact:true}).click();
 const editable=page.locator('[data-cms-id="hero-line-one"]');
 await editable.click();await expect(editable).not.toHaveAttribute('contenteditable','plaintext-only');assert.equal(draft['/::km']['hero-line-one'].value,'Existing Khmer translation');
 await editable.dblclick();await expect(editable).toHaveAttribute('contenteditable','plaintext-only');
 await adminContext.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});
 await editable.press('Control+A');await editable.press('Control+C');assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),original);
 await editable.press('Control+X');await expect(editable).toHaveText('');await editable.press('Control+V');await expect(editable).toHaveText(original);
 await editable.fill('Cancelled text');await editable.press('Escape');await expect(editable).toHaveText(original);await expect(editable).not.toHaveAttribute('contenteditable','plaintext-only');assert.equal(draft['/::km']['hero-line-one'].value,'Existing Khmer translation');
 await editable.dblclick();await editable.fill('');await editable.press('Enter');await expect(editable).toHaveText('');await editable.dblclick();
 await page.evaluate(()=>{const data=new DataTransfer();data.setData('text/plain','<b>Pasted as text</b>');data.setData('text/html','<img src=x onerror="window.geocamPasteUnsafe=true">');document.activeElement.dispatchEvent(new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:data}));});
 await expect(editable).toHaveText('<b>Pasted as text</b>');assert.equal(await editable.locator('img,b,script').count(),0);assert.equal(await page.evaluate(()=>window.geocamPasteUnsafe),undefined);
 await editable.fill('Private draft integration test');await expect(page.locator('[data-cms-id="hero-line-one"]')).toHaveText('Private draft integration test');
 await editable.press('Enter');await expect(page.getByRole('status')).toContainText('Changes saved automatically.');
 assert.equal(published['/::en']['hero-line-one'].value,'Private draft integration test');
 await visitor.reload();await expect(visitor.locator('[data-cms-id="hero-line-one"]')).toHaveText('Private draft integration test');await expect(visitor.locator('[data-cms-ui]')).toHaveCount(0);
 assert.equal(published['/::km']?.['hero-line-one'],undefined);
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=','base64');
 const chooser=page.waitForEvent('filechooser');await page.locator('[data-cms-id="mission-image"]').click();await (await chooser).setFiles({name:'geology.png',mimeType:'image/png',buffer:png});
 await expect.poll(()=>published['/::en']?.['mission-image']?.value.startsWith('data:image/png')).toBe(true);
 assert.equal(published['/::km']?.['mission-image'],undefined);
 await visitor.reload();await expect(visitor.locator('[data-cms-id="mission-image"]')).toHaveAttribute('src',published['/::en']['mission-image'].value);
 await visitor.getByRole('button',{name:'ខ្មែរ',exact:true}).click();await expect(visitor.locator('[data-cms-id="mission-image"]')).toHaveAttribute('src',published['/::en']['mission-image'].value);await expect(visitor.locator('[data-cms-id="hero-line-one"]')).not.toHaveText('Existing Khmer translation');await visitor.reload();await expect(visitor.locator('[data-cms-id="mission-image"]')).toHaveAttribute('src',published['/::en']['mission-image'].value);await visitor.getByRole('button',{name:'EN',exact:true}).click();
 assert.equal(await page.getByRole('button',{name:/^Save draft$/i}).count(),0);
 await page.getByRole('link',{name:'Dashboard',exact:true}).click();await page.waitForLoadState('domcontentloaded');
 await page.locator('#adminmenu .wp-menu-item').filter({hasText:/^All Pages/}).click();
 const field=page.locator('.page-editor-field input').first();await field.fill('Staged dashboard change');
 await page.getByRole('button',{name:/^Save draft$/i}).click();await expect(page.getByText('Page draft saved.',{exact:false})).toBeVisible();
 await visitor.reload();await expect(visitor.locator('[data-cms-id="hero-line-one"]')).toHaveText('Private draft integration test');
 // Simulate a font approval in another administrator session after this page loaded.
 published.__appearance.englishFont.value='lora';
 await page.getByRole('button',{name:'Publish Overall Changes Live',exact:true}).click();await expect(page.getByText('Overall change published LIVE',{exact:false})).toBeVisible();assert.equal(publicationCalls.length,1);assert.ok(publicationCalls[0]['/::en']['hero-line-one']);assert.equal(published['/::en'].headline,undefined);assert.equal(published['/::en'].subheading,undefined);assert.equal(published.__appearance.englishFont.value,'lora','Page publication must preserve concurrently approved fonts');
 await visitor.reload();await expect(visitor.locator('[data-cms-id="hero-line-one"]')).toHaveText('Staged dashboard change');
 await field.fill('Unsaved page form can leave quietly');await page.locator('#adminmenu .wp-menu-item').filter({hasText:/^Dashboard$/}).click();await expect(page.locator('#adminmenu .wp-menu-item.active')).toContainText('Dashboard');assert.equal(published['/::en']['hero-line-one'].value,'Staged dashboard change');
 await page.locator('#wpadminbar .wp-bar-node').filter({hasText:/^Sign Out$/}).click();await expect(page).toHaveURL(/admin\/login/);
 assert.deepEqual(dialogs,[],'Normal page editing, publication and navigation must not prompt on exit');assert.deepEqual(errors,[]);console.log('PASS: visitor and preview-query gates, admin login, inline autosave, shared English/Khmer image persistence, private page drafts, atomic page publication preserving approved fonts, real page keys, quiet unsaved-page navigation, and sign-out.');
}finally{await browser.close();}
