import JSZip from "jszip";
// Isolated browser integration tests. Auth responses are mocked here only;
// actual database authorization is checked separately in Supabase SQL.
import {chromium, expect} from 'playwright/test';
import assert from 'node:assert/strict';
const base=process.env.SITE_URL||'http://127.0.0.1:3001';
const api='https://pziwobqfysoadswgnjjm.supabase.co';
const browser=await chromium.launch({channel:'chrome',headless:true});
let draft={},published={},layers=[];let source;let delayNextInsert=false;
const user={id:'00000000-0000-4000-8000-000000000001',aud:'authenticated',role:'authenticated',email:'keatlenarith@gmail.com',email_confirmed_at:new Date().toISOString(),app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
const token=['eyJhbGciOiJIUzI1NiJ9',Buffer.from(JSON.stringify({sub:user.id,role:'authenticated',aud:'authenticated',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url'),'test-signature'].join('.');
async function context(){const ctx=await browser.newContext();await ctx.route(api+'/**',async route=>{const req=route.request(),path=new URL(req.url()).pathname;const admin=req.headers().authorization==='Bearer '+token;
  const send=(value,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(value)});
  if(path==='/auth/v1/token'){const body=req.postDataJSON();if(body.password!=='test-password-only')return send({msg:'Invalid login credentials',error_code:'invalid_credentials'},400);return send({access_token:token,token_type:'bearer',expires_in:3600,refresh_token:'test-refresh',user});}
  if(path==='/auth/v1/user')return send(user);
  if(path==='/auth/v1/logout')return route.fulfill({status:204});
  if(path==='/rest/v1/rpc/geocam_is_admin')return send(admin);
  if(path==='/rest/v1/geocam_map_layers'){
    if(req.method()==='GET')return send(layers.filter(layer=>admin||layer.status==='published'));
    if(!admin)return send({message:'permission denied'},403);
    if(req.method()==='POST'){layers.push(req.postDataJSON());if(delayNextInsert){delayNextInsert=false;await new Promise(resolve=>setTimeout(resolve,800));}return route.fulfill({status:201});}
    const id=new URL(req.url()).searchParams.get('id')?.replace('eq.','');const row=layers.find(layer=>layer.id===id);
    if(req.method()==='PATCH'){Object.assign(row,req.postDataJSON());return send({id});}
  }
  if(path.startsWith('/storage/v1/object/')){
    if(req.method()==='POST'){source=req.postDataBuffer();return send({Key:'test'});}
    return route.fulfill({status:200,contentType:'application/octet-stream',body:source});
  }
  if(path==='/rest/v1/geocam_drafts'||path==='/rest/v1/geocam_published'){
    const isDraft=path.endsWith('drafts');
    if(req.method()==='GET'){if(isDraft&&!admin)return send({message:'permission denied'},403);return send({id:'site',content:isDraft?draft:published});}
    if(!admin)return send({message:'permission denied'},403);
    const body=req.postDataJSON();if(isDraft)draft=structuredClone(body.content);else published=structuredClone(body.content);return route.fulfill({status:201});
  }
  throw Error('Unexpected Supabase request: '+path);
});return ctx;}
try{
 const ctx=await context(),page=await ctx.newPage();
 await page.goto(base+'/admin/login');await page.getByLabel('Email address').fill(user.email);await page.getByLabel('Password',{exact:true}).fill('test-password-only');await page.getByRole('button',{name:'Sign in',exact:true}).first().click();await expect(page.getByRole('link',{name:'Open dashboard'})).toBeVisible();
 await page.goto(base+'/geodata');await page.getByLabel('Upload geodata',{exact:true}).setInputFiles({name:'geology.geojson',mimeType:'application/geo+json',buffer:Buffer.from(JSON.stringify({type:'FeatureCollection',features:[{type:'Feature',properties:{name:'Uploaded feature'},geometry:{type:'Point',coordinates:[104,12]}}]}))});await expect(page.getByRole('status')).toContainText('Uploaded 1 features');
 await page.getByRole('button',{name:'ខ្មែរ',exact:true}).click();
 const remaining=[];
 for(const route of ['/geodata','/admin/cms','/admin/login','/']){
  await page.goto(base+route);await page.waitForTimeout(150);
  const text=await page.evaluate(()=>{let n;const out=[];const w=document.createTreeWalker(document.getElementById('root'),NodeFilter.SHOW_TEXT);while(n=w.nextNode()){const t=n.textContent.replace(/\s+/g,' ').trim();if(/[a-zA-Z]{3}/.test(t)&&!n.parentElement.closest('script,style,textarea,iframe'))out.push(t);}return [...new Set(out)];});remaining.push({route,text});
 }
 console.log(JSON.stringify(remaining,null,2));
}finally{await browser.close();}
