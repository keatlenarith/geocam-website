import { createFileRoute, Link } from "@/lib/spa-router";
import { useState, useEffect } from "react";
import { Container, DemoNote, PageHeader, meta } from "@/components/site/Chrome";
import { getStoredEvents } from "@/lib/event-service";
import { getStoredPublications } from "@/lib/publication-service";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard")({
  head: () => meta("Member dashboard", "GeoCam member area: membership status, events and resources (demo)."),
  component: Dashboard,
});

function Dashboard() {
  const { t, lang } = useI18n();
  const km = lang === "km";
  const [eventList, setEventList] = useState(() => getStoredEvents());
  const [pubList, setPubList] = useState(() => getStoredPublications());

  useEffect(() => {
    const syncE = () => setEventList(getStoredEvents());
    const syncP = () => setPubList(getStoredPublications());
    window.addEventListener("geocam_events_changed", syncE);
    window.addEventListener("geocam_publications_changed", syncP);
    window.addEventListener("storage", () => {
      syncE();
      syncP();
    });
    return () => {
      window.removeEventListener("geocam_events_changed", syncE);
      window.removeEventListener("geocam_publications_changed", syncP);
    };
  }, []);

  return (
    <>
      <PageHeader
        eyebrow={t("dashboard")}
        title={km ? "សូមស្វាគមន៍មកវិញ សមាជិកគំរូ" : "Welcome back, Demo Member"}
      />
      <Container>
        <DemoNote>
          {km
            ? "ការចូលប្រើត្រូវបានក្លែងធ្វើ។ ពេលភ្ជាប់ប្រព័ន្ធខាងក្រោយ ទំព័រនេះតម្រូវឱ្យមានសម័យសមាជិកពិតប្រាកដ។"
            : "Sign-in is simulated. With the backend enabled this page requires a member session."}
        </DemoNote>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="card-surface p-6">
            <h2 className="text-xl font-semibold">
              {km ? "កម្រិតសមាជិក" : "Membership tier"}
            </h2>
            <p className="mt-2 text-2xl font-bold text-accent">Student</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {km ? "សុពលភាពដល់ខែធ្នូ ឆ្នាំ២០២៧" : "Valid through Dec 2027"}
            </p>
          </div>
          <div className="card-surface p-6">
            <h2 className="text-xl font-semibold">
              {km ? "ឯកសារដែលបានរក្សាទុក" : "Saved documents"}
            </h2>
            <p className="mt-2 text-2xl font-bold text-accent">
              {pubList.length > 0 ? "5" : "0"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {km
                ? "ចំណាំក្នុងបណ្ណាល័យស្រាវជ្រាវ"
                : "Bookmarked in research library"}
            </p>
          </div>
          <div className="card-surface p-6">
            <h2 className="text-xl font-semibold">
              {km ? "ក្រុមការងារ" : "Working groups"}
            </h2>
            <p className="mt-2 text-2xl font-bold text-accent">2</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tectonics, Hydrogeology
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="card-surface p-6">
            <h2 className="text-xl font-semibold">{t("upcomingEvents")}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {eventList.slice(0, 3).map((e) => (
                <li key={e.id}>
                  {e.date} — {km ? (e.titleKm || e.title) : e.title}
                </li>
              ))}
            </ul>
          </section>
          <section className="card-surface p-6">
            <h2 className="text-xl font-semibold">
              {km ? "ការអានដែលណែនាំ" : "Recommended reading"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {pubList.slice(0, 3).map((p) => (
                <li key={p.id}>{p.title}</li>
              ))}
            </ul>
          </section>
        </div>
      </Container>
    </>
  );
}
