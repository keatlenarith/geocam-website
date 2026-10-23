import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

const source=readFileSync(new URL('../src/visual-cms/linked-content.ts',import.meta.url),'utf8').replace(/import \{ translateText \} from "[^\"]+";/,'const translateText = value => value;');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {updateLinkedField,linkedEntry,pageChanges,rebaseDraft}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const text=value=>({kind:'text',value});

test('English edits invalidate matching Khmer without replacing English with Khmer',()=>{
 const before={'/::en':{title:text('Original')},'/::km':{title:text('Old translation'),other:text('Keep')}};
 const changed=updateLinkedField(before,'/::en','title',text('Updated'));
 assert.equal(changed['/::km'].title,undefined);assert.deepEqual(changed['/::km'].other,text('Keep'));
 const translated=updateLinkedField(changed,'/::km','title',text('New translation'));
 assert.deepEqual(translated['/::en'].title,text('Updated'));
 assert.equal(updateLinkedField(before,'/::en','title',text('Original')),before);
});
test('Images use one English source in both languages; empty text remains intentionally empty',()=>{
 const image={kind:'image',value:'https://example.org/geology.png'};
 const changed=updateLinkedField({'/::km':{photo:{kind:'image',value:'old'}}},'/::km','photo',image);
 assert.equal(changed['/::km'].photo,undefined);
 assert.deepEqual(linkedEntry(changed,'/','en','photo'),image);assert.deepEqual(linkedEntry(changed,'/','km','photo'),image);
 assert.deepEqual(linkedEntry({'/::en':{title:text('')}},'/','en','title'),text(''));
});
test('Page patches exclude unapproved typography and preserve unrelated concurrent fields',()=>{
 const live={'/::en':{title:text('Live'),removed:text('Old')},__appearance:{englishFont:text('arial')}};
 const draft={'/::en':{title:text('Revised')},__appearance:{englishFont:text('georgia')}};
 assert.deepEqual(pageChanges(draft,live),{'/::en':{title:text('Revised'),removed:null}});
 const baseline={'/::en':{title:text('Live')}};
 const local={'/::en':{title:text('Local draft')}};
 const server={'/::en':{title:text('Live'),newer:text('Other editor')}};
 assert.deepEqual(rebaseDraft(server,baseline,local),{'/::en':{title:text('Local draft'),newer:text('Other editor')}});
});
test('Subroutes strictly isolate their content and do not bleed into or inherit from unprefixed keys',()=>{
 const tectonicImage={kind:'image',value:'https://example.org/tectonic-map.png'};
 const store={
  '/research::en':{
   'div:0/article:0/figure:0/img:0':tectonicImage,
   'sub:topic-tectonics:div:0/article:0/figure:0/img:0':tectonicImage
  }
 };
 // Geochemistry subroute query must NOT inherit the unprefixed tectonicImage
 assert.equal(linkedEntry(store,'/research','en','sub:topic-geochemistry:div:0/article:0/figure:0/img:0'),undefined);
 // Mineral deposits subroute query must NOT inherit the unprefixed tectonicImage
 assert.equal(linkedEntry(store,'/research','en','sub:topic-mineral-deposits:div:0/article:0/figure:0/img:0'),undefined);
 // Tectonics query gets its own image
 assert.deepEqual(linkedEntry(store,'/research','en','sub:topic-tectonics:div:0/article:0/figure:0/img:0'),tectonicImage);
});
