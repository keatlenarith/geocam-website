import { createFileRoute, Link } from "@/lib/spa-router";
import { Container, DemoNote, PageHeader, meta } from "@/components/site/Chrome";
import { events, publications } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard")({
  head: () => meta("Member dashboard", "GeoCam member area: membership status, events and resources (demo)."),
  component: Dashboard,
});

function Dashboard() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader eyebrow={t("dashboard")} title="Welcome back, Demo Member" />
      <Container>
        <DemoNote>Sign-in is simulated. With the backend enabled this page requires a member session.</DemoNote>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="card-surface p-6"><p className="eyebrow">Status</p><p className="mt-2 font-display text-3xl text-primary">Active</p><p className="text-sm text-muted-foreground">Professional · renews 2027-01-31</p></div>
          <div className="card-surface p-6"><p className="eyebrow">Directory</p><p className="mt-2 text-lg font-semibold">Visible</p><p className="text-sm text-muted-foreground">Name, affiliation and field only</p></div>
          <div className="card-surface p-6"><p className="eyebrow">Data access</p><p className="mt-2 text-lg font-semibold">Public + members</p><Link to="/geodata" className="text-sm font-semibold text-accent">Open GeoData →</Link></div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="card-surface p-6"><h2 className="text-xl font-semibold">{t("upcomingEvents")}</h2><ul className="mt-3 space-y-2 text-sm">{events.slice(0, 3).map((e) => <li key={e.id}>{e.date} — {e.title}</li>)}</ul></section>
          <section className="card-surface p-6"><h2 className="text-xl font-semibold">Recommended reading</h2><ul className="mt-3 space-y-2 text-sm">{publications.slice(0, 3).map((p) => <li key={p.id}>{p.title}</li>)}</ul></section>
        </div>
      </Container>
    </>
  );
}
