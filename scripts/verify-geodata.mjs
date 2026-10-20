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
 const zip=new JSZip();zip.file('doc.kml',`<?xml version="1.0"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><Style id="style"><IconStyle><scale>2</scale><Icon><href>icons/dot.png</href></Icon></IconStyle><LineStyle><color>ff0000ff</color><width>4</width></LineStyle><PolyStyle><color>8000ff00</color></PolyStyle></Style><Placemark><name>Test point</name><styleUrl>#style</styleUrl><Point><coordinates>104.9,12.6,0</coordinates></Point></Placemark><Placemark><name>Test line</name><styleUrl>#style</styleUrl><LineString><coordinates>104.9,12.6 105,12.7</coordinates></LineString></Placemark><Placemark><name>Test polygon</name><styleUrl>#style</styleUrl><Polygon><outerBoundaryIs><LinearRing><coordinates>104.9,12.6 105,12.6 105,12.7 104.9,12.6</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark></Document></kml>`);zip.file('icons/dot.png',Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a7r8AAAAASUVORK5CYII=','base64'));
 const ctx=await context(),vis=await context(),page=await ctx.newPage(),visitor=await vis.newPage();
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await visitor.goto(base+'/geodata');await expect(visitor.getByLabel('Upload geodata',{exact:true})).toHaveCount(0);
 await page.goto(base+'/admin/login');await page.getByLabel('Email address').fill(user.email);await page.getByLabel('Password',{exact:true}).fill('test-password-only');await page.getByRole('button',{name:'Sign in',exact:true}).first().click();await expect(page.getByRole('link',{name:'Open dashboard'})).toBeVisible();
 await page.goto(base+'/geodata');await page.getByLabel('Upload geodata',{exact:true}).setInputFiles({name:'bad.shp',mimeType:'application/octet-stream',buffer:Buffer.from('bad')});await expect(page.getByRole('status')).toContainText('Use .kmz');
 await page.getByLabel('Upload geodata',{exact:true}).setInputFiles({name:'styled-example.kmz',mimeType:'application/vnd.google-earth.kmz',buffer:await zip.generateAsync({type:'nodebuffer'})});
 await expect(page.getByRole('status')).toContainText('Uploaded 3 features');assert.equal(layers.length,1);assert.equal(layers[0].status,'draft');
 await expect(page.locator('.leaflet-marker-icon[src^="data:image/png"]')).toBeVisible();await expect(page.locator('.leaflet-marker-icon[src^="data:image/png"]')).toHaveCSS('width','64px');
 assert.equal(layers[0].data.features.find(feature=>feature.geometry.type==='LineString').properties['stroke-width'],4);
 await visitor.reload();await expect(visitor.getByText('No uploaded layers available.')).toBeVisible();
 await page.getByLabel('Use original KML styles').uncheck();await page.getByLabel('Point symbol').selectOption('triangle');await page.getByLabel('Symbol size (pixels)').fill('40');
 await expect(page.locator('.geocam-map-symbol span')).toHaveCSS('width','40px');await expect(page.locator('.geocam-map-symbol span')).toHaveCSS('clip-path','polygon(50% 0px, 100% 100%, 0px 100%)');
 await page.getByRole('button',{name:'Save style',exact:true}).click();await expect(page.getByRole('status')).toContainText('Draft saved');
 page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Publish layer',exact:true}).click();await expect(page.getByRole('status')).toContainText('published for all visitors');
 await visitor.reload();await expect(visitor.getByText('3 features · styled-example.kmz')).toBeVisible();await expect(visitor.locator('.geocam-map-symbol span')).toHaveCSS('width','40px');await expect(visitor.getByLabel('Upload geodata',{exact:true})).toHaveCount(0);
 await page.getByLabel('Dataset category').selectOption('faults');
 const kmlBuffer=Buffer.from('<kml xmlns="http://www.opengis.net/kml/2.2"><Placemark><name>Fault</name><LineString><coordinates>104,12 105,13</coordinates></LineString></Placemark></kml>');
 await page.getByLabel('Upload geodata',{exact:true}).setInputFiles([{name:'Faults_A.kml',mimeType:'application/vnd.google-earth.kml+xml',buffer:kmlBuffer},{name:'Faults_B.kml',mimeType:'application/vnd.google-earth.kml+xml',buffer:kmlBuffer}]);
 await expect(page.getByRole('status')).toContainText('Uploaded 2 of 2 files');
 assert.equal(layers.length,3);assert.equal(layers[1].name,'Faults_A.kml');assert.equal(layers[2].name,'Faults_B.kml');assert.equal(layers[1].category,'faults');assert.notEqual(layers[1].source_path,layers[2].source_path);
 await page.getByLabel('Filter layers').selectOption('faults');await expect(page.getByText('3 features · styled-example.kmz')).toHaveCount(0);await expect(page.getByText('1 features · Faults_A.kml')).toBeVisible();
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Mobile GeoData must not overflow');
 delayNextInsert=true;
 await page.getByLabel('Upload geodata',{exact:true}).setInputFiles([{name:'Pending_A.kml',mimeType:'application/vnd.google-earth.kml+xml',buffer:kmlBuffer},{name:'Pending_B.kml',mimeType:'application/vnd.google-earth.kml+xml',buffer:kmlBuffer}]);
 await expect.poll(()=>layers.length).toBe(4);await page.getByRole('button',{name:'Sign out',exact:true}).click();await expect(page.getByLabel('Upload geodata',{exact:true})).toHaveCount(0);await new Promise(resolve=>setTimeout(resolve,1000));
 assert.equal(layers.length,4,'Batch must stop after sign-out');await expect(page.getByText('1 features · Pending_A.kml')).toHaveCount(0);
 assert.deepEqual(errors,[]);console.log('PASS: in-flight batch cancels safely after sign-out.');console.log('PASS: batch uploads, file names, categories and filtering.');console.log('PASS: KMZ embedded icon and scale, point/line/polygon import, private draft, custom triangle/size, save style, publish, and visitor map.');
}finally{await browser.close();}
