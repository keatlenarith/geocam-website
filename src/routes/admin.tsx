import { createFileRoute } from "@/lib/spa-router";
import { useState } from "react";
import { Container, DemoNote, PageHeader, meta } from "@/components/site/Chrome";
import { applications as seedApps, events as seedEvents, news as seedNews, type Application } from "@/lib/data";

export const Route = createFileRoute("/admin")({
  head: () => meta("Admin CMS", "GeoCam content management: articles, events and membership approvals (demo)."),
  component: Admin,
});

type Tab = "articles" | "events" | "members" | "audit";

function Admin() {
  const [tab, setTab] = useState<Tab>("articles");
  const [arts, setArts] = useState(() => seedNews.map((n) => ({ ...n })));
  const [evs, setEvs] = useState(() => seedEvents.map((e) => ({ ...e })));
  const [apps, setApps] = useState<Application[]>(() => seedApps.map((a) => ({ ...a })));
  const [log, setLog] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const audit = (s: string) => setLog((l) => [`${new Date().toLocaleTimeString()} — ${s}`, ...l]);

  const Pill = ({ s }: { s: string }) => (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s === "published" || s === "approved" ? "bg-sage/40" : s === "rejected" ? "bg-destructive/20" : "bg-warning/30"}`}>{s}</span>
  );

  return (
    <>
      <PageHeader eyebrow="Admin" title="Content management" sub="Draft → review → publish workflow, and membership approvals." />
      <Container>
        <DemoNote>Admin actions change local state in this browser tab only and reset on reload. Nothing persists.</DemoNote>
        <div role="tablist" className="mt-6 flex flex-wrap gap-2">
          {(["articles", "events", "members", "audit"] as Tab[]).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`btn ${tab === t ? "btn-primary" : "btn-outline"} capitalize`}>{t}</button>
          ))}
        </div>

        <div className="card-surface mt-6 p-6">
          {tab === "articles" && (
            <>
              <form className="mb-6 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!title) return; setArts([{ id: crypto.randomUUID(), title, date: new Date().toISOString().slice(0, 10), excerpt: "", status: "draft", tag: "Society" }, ...arts]); audit(`Created draft "${title}"`); setTitle(""); }}>
                <input aria-label="New article title" className="field" placeholder="New article title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <button className="btn btn-accent shrink-0">Create draft</button>
              </form>
              <ul className="divide-y divide-border">
                {arts.map((a) => (
                  <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div><p className="font-semibold">{a.title}</p><p className="text-xs text-muted-foreground">{a.date}</p></div>
                    <div className="flex items-center gap-2"><Pill s={a.status} />
                      <button className="btn btn-outline !py-1 text-xs" onClick={() => { const s = a.status === "draft" ? "published" : "draft"; setArts(arts.map((x) => x.id === a.id ? { ...x, status: s } : x)); audit(`${s === "published" ? "Published" : "Unpublished"} "${a.title}"`); }}>
                        {a.status === "draft" ? "Publish" : "Unpublish"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          {tab === "events" && (
            <ul className="divide-y divide-border">
              {evs.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div><p className="font-semibold">{e.title}</p><p className="text-xs text-muted-foreground">{e.date} · {e.place}</p></div>
                  <div className="flex items-center gap-2"><Pill s={e.status} />
                    <button className="btn btn-outline !py-1 text-xs" onClick={() => { const s = e.status === "draft" ? "published" : "draft"; setEvs(evs.map((x) => x.id === e.id ? { ...x, status: s } : x)); audit(`Event "${e.title}" → ${s}`); }}>
                      {e.status === "draft" ? "Publish" : "Unpublish"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {tab === "members" && (
            <ul className="divide-y divide-border">
              {apps.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div><p className="font-semibold">{a.name} <span className="text-xs text-muted-foreground">· {a.category}</span></p><p className="text-xs text-muted-foreground">{a.email} · submitted {a.submitted}</p></div>
                  <div className="flex items-center gap-2"><Pill s={a.status} />
                    {a.status === "pending" && (<>
                      <button className="btn btn-primary !py-1 text-xs" onClick={() => { setApps(apps.map((x) => x.id === a.id ? { ...x, status: "approved" } : x)); audit(`Approved ${a.name}`); }}>Approve</button>
                      <button className="btn btn-outline !py-1 text-xs" onClick={() => { setApps(apps.map((x) => x.id === a.id ? { ...x, status: "rejected" } : x)); audit(`Rejected ${a.name}`); }}>Reject</button>
                    </>)}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {tab === "audit" && (log.length ? <ul className="space-y-1 font-mono text-xs">{log.map((l, i) => <li key={i}>{l}</li>)}</ul> : <p className="text-sm text-muted-foreground">No actions yet in this session.</p>)}
        </div>
      </Container>
    </>
  );
}
