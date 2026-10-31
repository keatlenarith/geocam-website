import test from 'node:test';
import assert from 'node:assert/strict';
import {createPosterShareHandler} from '../api/earthquake-poster.ts';
function response(){return {headers:{},code:200,setHeader(k,v){this.headers[k]=v;},status(c){this.code=c;return this;},json(v){this.body=v;return this;},send(v){this.body=v;return this;}};}
test('shared poster link preserves PNG and caption and serves actual poster Open Graph metadata',async()=>{
  const png=Buffer.alloc(24);Buffer.from('89504e470d0a1a0a','hex').copy(png);png.writeUInt32BE(1200,16);png.writeUInt32BE(630,20);
  const snapshots=new Map();let writes=0;
  const handler=createPosterShareHandler({read:async id=>snapshots.get(id)||null,write:async(id,v)=>{snapshots.set(id,v);writes++;}});
  const request={method:'POST',headers:{},body:{posterDataUrl:`data:image/png;base64,${png.toString('base64')}`,caption:'ខ្មែរ\nExact caption <script>unsafe()</script>',eventId:'event-123'}};
  const created=response();await handler(request,created);assert.equal(created.code,200);
  const id=new URL(created.body.url).searchParams.get('id');
  const image=response();await handler({method:'GET',query:{id,image:'1'}},image);assert.deepEqual(image.body,png);
  const html=response();await handler({method:'GET',query:{id}},html);
  assert.ok(html.body.includes('property="og:image"'));assert.ok(html.body.includes(`${id}&amp;image=1`));assert.ok(html.body.includes('ខ្មែរ\nExact caption &lt;script&gt;'));assert.ok(!html.body.includes('<script>unsafe()'));
  await handler(request,response());assert.equal(writes,1);
});
test('invalid PNGs and arbitrary lookup paths are rejected',async()=>{
  const handler=createPosterShareHandler({read:async()=>{throw Error('must not read');},write:async()=>{throw Error('must not write');}});
  const bad=response();await handler({method:'POST',headers:{},body:{posterDataUrl:'data:image/png;base64,aGVsbG8=',caption:'hello',eventId:'one'}},bad);assert.equal(bad.code,400);
  const lookup=response();await handler({method:'GET',query:{id:'../../secrets'}},lookup);assert.equal(lookup.code,400);
});
