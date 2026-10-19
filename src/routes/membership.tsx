import { createFileRoute } from "@/lib/spa-router";
import { useState } from "react";
import { Container, DemoNote, PageHeader, meta } from "@/components/site/Chrome";
import { members } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/membership")({
  head: () => meta("Membership", "Apply to join GeoCam and browse the opt-in member directory."),
  component: Membership,
});

const tiers = [
  ["Student", "For enrolled geoscience students"],
  ["Professional", "Practising geoscientists and engineers"],
  ["Associate", "Educators, NGOs and interested public"],
];

function Membership() {
  const { t } = useI18n();
  const [done, setDone] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const visible = members.filter((m) => m.showInDirectory && `${m.name} ${m.field}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader eyebrow={t("membership")} title={t("joinTitle")} sub={t("joinSub")} />
      <Container>
        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map(([n, d]) => <div key={n} className="card-surface p-6"><h2 className="text-2xl font-semibold text-primary">{n}</h2><p className="mt-1 text-muted-foreground">{d}</p></div>)}
        </div>

        <section className="mt-14 grid gap-10 lg:grid-cols-2">
          <form
            className="card-surface space-y-4 p-7"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              setDone(String(f.get("name")));
              e.currentTarget.reset();
            }}
          >
            <h2 className="text-2xl font-semibold text-primary">{t("application")}</h2>
            <DemoNote>Applications are not stored in this prototype. With the backend enabled they go to <code>membership_applications</code> for admin review.</DemoNote>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="name" className="text-sm font-medium">Full name</label><input id="name" name="name" required className="field mt-1" /></div>
              <div><label htmlFor="email" className="text-sm font-medium">Email</label><input id="email" name="email" type="email" required className="field mt-1" /></div>
              <div><label htmlFor="cat" className="text-sm font-medium">Category</label><select id="cat" name="cat" className="field mt-1">{tiers.map(([n]) => <option key={n}>{n}</option>)}</select></div>
              <div><label htmlFor="aff" className="text-sm font-medium">Affiliation</label><input id="aff" name="aff" className="field mt-1" /></div>
            </div>
            <div><label htmlFor="field" className="text-sm font-medium">Field of expertise</label><input id="field" name="field" className="field mt-1" /></div>
            <label className="flex items-start gap-2 text-sm"><input type="checkbox" name="dir" className="mt-1" /> List my name, affiliation and field in the public directory (email is never shown).</label>
            <label className="flex items-start gap-2 text-sm"><input type="checkbox" required className="mt-1" /> I agree to the society’s code of conduct and privacy notice.</label>
            <button className="btn btn-accent">{t("apply")}</button>
            {done && <p role="status" className="text-sm font-semibold text-primary">Demo: application for {done} validated but NOT saved.</p>}
          </form>

          <div>
            <h2 className="text-2xl font-semibold text-primary">{t("directory")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Only members who opted in are listed. Contact details are hidden; messages are relayed by the secretariat.</p>
            <input aria-label="Search directory" className="field mt-4" placeholder={`${t("search")}…`} value={q} onChange={(e) => setQ(e.target.value)} />
            <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
              {visible.map((m) => (
                <li key={m.id} className="flex justify-between gap-4 p-4">
                  <div><p className="font-semibold">{m.name}</p><p className="text-sm text-muted-foreground">{m.affiliation}</p></div>
                  <span className="self-center rounded-full bg-sage/30 px-3 py-1 text-xs font-semibold">{m.field}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">{members.length - members.filter((m) => m.showInDirectory).length} member(s) hidden by privacy preference · sample names</p>
          </div>
        </section>
      </Container>
    </>
  );
}
