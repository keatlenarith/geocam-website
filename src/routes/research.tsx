import { createFileRoute, Link } from "@/lib/spa-router";
import { Container, PageHeader, meta } from "@/components/site/Chrome";
import { researchAreas } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
export const Route = createFileRoute("/research")({ head: () => meta("Research", "GeoCam research themes"), component: Research });
function Research(){const {t,lang}=useI18n();return <><PageHeader eyebrow={t('research')} title={t('ourWork')}/><Container><div className="space-y-6">{researchAreas.map((r,i)=><Link key={r.key} to={'/research/topic?id='+encodeURIComponent(r.key)} className="card-surface grid gap-6 p-8 md:grid-cols-[120px_1fr] transition hover:shadow-lg focus-visible:outline-2 focus-visible:outline-blue-600"><span className="font-display text-6xl text-accent">0{i+1}</span><div><h2 className="text-3xl font-semibold text-primary">{lang==='km'?r.km:r.key}</h2><p className="mt-3 max-w-3xl text-lg text-muted-foreground">{r.text}</p><p className="mt-4 font-semibold text-accent">{lang==='km'?'មើលព័ត៌មានលម្អិត →':'Explore topic →'}</p></div></Link>)}</div></Container></>}
