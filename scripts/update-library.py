from pathlib import Path
p=Path('src/lib/data.ts');s=p.read_text(encoding='utf-8');s='import researchLibrary from "./research-library.json";\n'+s
s=s.replace('// All content below is SAMPLE / DEMO data for the prototype. No real publications,\n// officials, endorsements or government datasets are represented.','// Publication records come from the collected research library.\n// Other news, members and events remain prototype/demo data.')
s=s.replace('year: number; topic: string; journal: string; abstract: string; pdfUrl?: string','year: number | null; topic: string; journal: string; abstract: string; pdfUrl?: string; fileUrl?: string; sourceUrl?: string; doi?: string; publicationType: string; scope: string; origin: string; metadataVerified: boolean; tags: string[]; alternateFiles?: { label: string; url: string }[]')
a=s.index('export const topics =');b=s.index('\n',a);s=s[:a]+'export const topics = [...new Set(researchLibrary.map(p => p.topic))].sort();'+s[b:]
a=s.index('export const publications: Publication[] = [');b=s.index('\n];',a)+3;s=s[:a]+'export const publications: Publication[] = researchLibrary;'+s[b:];p.write_text(s,encoding='utf-8')
p=Path('src/routes/research-topic.tsx');s=p.read_text(encoding='utf-8').replace('The linked records below are samples.','References from the collected geoscience research library.').replace('ឯកសារខាងក្រោមជាគំរូ។','ឯកសារស្រាវជ្រាវដែលបានប្រមូល។');p.write_text(s,encoding='utf-8')
p=Path('package.json');import json;d=json.loads(p.read_text());d['scripts']['test']='node --test tests/*.test.mjs';p.write_text(json.dumps(d,indent=2)+'\n')
Path('.gitignore').write_text('node_modules/\ndist/\n.env\n.env.*\n!.env.example\n*.log\n.playwright/\n')
