import {chromium} from 'playwright';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const base=process.env.SITE_URL||'http://127.0.0.1:3001';
const routes=['/','/about','/contact','/membership','/research','/publications','/events','/news','/dashboard','/mining','/geodata','/geopark','/lexicon','/environmental-monitoring','/admin/login','/admin/cms','/research/topic?id=Geochemistry','/publications/view?id=unknown-reference'];
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const context=await browser.newContext();await context.addInitScript(()=>{try{localStorage.setItem('geocam-lang','km')}catch{}});
 await context.route('**/*',route=>{const url=route.request().url();if(url.startsWith(base)||url.includes('supabase.co')||url.startsWith('data:')||url.startsWith('blob:'))return route.continue();return route.abort();});
 const page=await context.newPage();const remaining=new Map();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 for(const route of routes){await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.documentElement.lang==='km');await page.waitForTimeout(120);
  const text=await page.evaluate(()=>{const out=[];const w=document.createTreeWalker(document.getElementById('root'),NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const p=n.parentElement;if(p?.closest('script,style,code,pre,textarea,[data-no-translate]'))continue;const t=n.textContent.replace(/\s+/g,' ').trim();if(/[a-zA-Z]{3}/.test(t))out.push(t);}return [...new Set(out)];});
  for(const value of text){if(!remaining.has(value))remaining.set(value,[]);remaining.get(value).push(route);}
 }
 await mkdir('.playwright',{recursive:true});await writeFile('.playwright/khmer-audit.json',JSON.stringify({errors,remaining:[...remaining].map(([text,routes])=>({text,routes}))},null,2));
 console.log('Browser errors:',errors);console.log('Latin-containing text nodes:',remaining.size);console.log([...remaining.keys()].join('\n').slice(0,16000));
}finally{await browser.close();}
