from pathlib import Path
from pypdf import PdfReader
import json,re,shutil,hashlib,csv
root=Path.cwd(); library=Path('\\\\?\\'+str(root.parent/'Cambodia_Geoscience_Research_2026-10-19'));notes=library/'04_Search_Notes'
web=json.loads((notes/'internet_catalog.json').read_text(encoding='utf-8'));local=json.loads((notes/'local_catalog.json').read_text(encoding='utf-8'))
dest=root/'public'/'research'/'documents';dest.mkdir(parents=True,exist_ok=True)
# Remap collection provenance paths without exposing workstation paths in public data.
def resolve(old):
 name=Path(old).name
 matches=[p for p in library.rglob('*') if p.is_file() and p.name==name]
 if not matches:raise RuntimeError('Missing document: '+name)
 return matches[0]
byhash={};byname={}
for folder in ['01_Local_Library','02_Internet_Full_Text']:
 for p in (library/folder).rglob('*'):
  if not p.is_file():continue
  h=hashlib.sha256(p.read_bytes()).hexdigest()
  slug=re.sub('[^a-z0-9]+','-',p.stem.lower()).strip('-')[:85] or 'geoscience-reference'
  target=dest/(slug+'-'+h[:10]+p.suffix.lower())
  if h not in byhash:shutil.copy2(p,target);byhash[h]=target
  byname[p.name]='/research/documents/'+byhash[h].name
items=[];used=set()
def topic(tags):
 s=tags.lower()
 if 'karst' in s or 'paleoclimate' in s:return 'Karst & paleoclimate'
 if 'hydro' in s or 'groundwater' in s:return 'Hydrogeology'
 if 'environment' in s or 'water geochem' in s:return 'Environmental geology'
 if 'mineral' in s:return 'Mineral deposits'
 if 'stratigraphy' in s or 'sediment' in s or 'quaternary' in s:return 'Stratigraphy & geomorphology'
 if 'tectonic' in s or 'petrology' in s:return 'Tectonics'
 return 'Geoscience references'
for w in web:
 fs=[resolve(p) for p in w['saved_files'].split(' | ') if p]
 urls=[byname[p.name] for p in fs];used.update(p.name for p in fs)
 row=dict(id=w['id'].lower(),title=w['title'],authors='',year=int(w['date'][:4]),date=w['date'],topic=topic(w['topics']),tags=w['topics'].split('; '),journal=w['journal'],abstract=w['note'],publicationType=w['publication_type'],scope=w['scope'],sourceUrl=w['url'],doi=w['doi'],origin='Internet research',metadataVerified=True)
 if urls:row['pdfUrl']=urls[0]
 if len(urls)>1:row['alternateFiles']=[{'label':'Khmer edition','url':urls[1]}]
 items.append(row)
seen=set()
for l in local:
 p=resolve(l['saved_file'])
 if p.name in used or l['sha256'] in seen:continue
 seen.add(l['sha256']);url=byname[p.name]
 title=re.sub(r'^(Paper|Papper|Thesis)[- _]+','',p.stem,flags=re.I).replace('_',' ')
 title=re.sub(r'\s+',' ',title)
 row=dict(id='local-'+l['sha256'][:12],title=title,authors='',year=None,topic=topic(l['topic'].replace('_',' ')),tags=[l['topic'].replace('_',' ')],journal='Local publication library',abstract='Collected reference. Bibliographic details should be checked in the linked document.',publicationType='Library document; bibliographic metadata unverified',scope=l['scope'].replace('_',' '),origin='Local library',metadataVerified=False)
 row['pdfUrl' if p.suffix.lower()=='.pdf' else 'fileUrl']=url
 items.append(row)
items.sort(key=lambda r:(r['year'] or 0,r.get('date',''),r['title']),reverse=True)
(root/'src/lib/research-library.json').write_text(json.dumps(items,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
exports=root/'public/research';(exports/'catalog.json').write_text(json.dumps(items,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
shutil.copy2(library/'Internet_References.ris',exports/'references.ris')
with (exports/'catalog.csv').open('w',encoding='utf-8-sig',newline='') as f:
 fields=['id','title','year','topic','journal','publicationType','scope','sourceUrl','doi','pdfUrl','fileUrl'];w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(items)
print(json.dumps({'records':len(items),'files':len(byhash),'bytes':sum(p.stat().st_size for p in byhash.values())}))
