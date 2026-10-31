import test from 'node:test';
import assert from 'node:assert/strict';
import {wrapPosterText, posterMapUrl} from '../src/features/earthquakes/poster-layout.ts';
test('proximity wraps English and Khmer inside the measured width',()=>{
  const input='~389 km from Cambodia (Northeast) (~389 km ពីកម្ពុជា (ទិសឦសាន))';
  const measure=s=>Array.from(new Intl.Segmenter('km',{granularity:'grapheme'}).segment(s)).length*10;
  const lines=wrapPosterText(input,350,measure);
  assert.ok(lines.length>1);assert.ok(lines.every(line=>measure(line)<=350));
  assert.equal(lines.join('').replace(/\s/g,''),input.replace(/\s/g,''));
});
test('poster uses the same Esri topographic basemap with centered projected bounds',()=>{
  const url=new URL(posterMapUrl(14.731,107.816));
  assert.equal(url.hostname,'server.arcgisonline.com');assert.match(url.pathname,/World_Topo_Map/);
  assert.equal(url.searchParams.get('bboxSR'),'3857');assert.equal(url.searchParams.get('size'),'450,420');
});
