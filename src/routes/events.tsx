import { createFileRoute } from "@/lib/spa-router";
import { useState } from "react";
import { Container, DemoNote, PageHeader, meta } from "@/components/site/Chrome";
import { events } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/events")({
  head: () => meta("Events", "Conferences, field trips and webinars organised by GeoCam members in Cambodia."),
  component: Events,
});

function Events() {
  const { t } = useI18n();
  const [reg, setReg] = useState<string[]>([]);
  return (
    <>
      <PageHeader eyebrow={t("events")} title={t("upcomingEvents")} />
      <Container>
        <DemoNote>Registrations are simulated in this browser session only — nothing is saved.</DemoNote>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {events.filter((e) => e.status === "published").map((e) => (
            <article key={e.id} className="card-surface flex flex-col p-6">
              <p className="eyebrow">{e.kind}</p>
              <h2 className="mt-2 text-2xl font-semibold">{e.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{e.date} · {e.place}</p>
              <button className="btn btn-primary mt-auto self-start" style={{ marginTop: "1.5rem" }} disabled={reg.includes(e.id)} onClick={() => setReg([...reg, e.id])}>
                {reg.includes(e.id) ? "Registered (demo)" : t("register")}
              </button>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
