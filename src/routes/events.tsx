import { createFileRoute } from "@/lib/spa-router";
import { useState, useEffect } from "react";
import { Container, DemoNote, PageHeader, meta } from "@/components/site/Chrome";
import type { EventItem } from "@/lib/data";
import { getStoredEvents } from "@/lib/event-service";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/events")({
  head: () => meta("Events", "Conferences, field trips and webinars organised by GeoCam members in Cambodia."),
  component: Events,
});

function Events() {
  const { t, lang } = useI18n();
  const km = lang === "km";
  const [items, setItems] = useState<EventItem[]>(() => getStoredEvents());

  useEffect(() => {
    const handleSync = () => setItems(getStoredEvents());
    window.addEventListener("geocam_events_changed", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("geocam_events_changed", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const [reg, setReg] = useState<string[]>([]);
  return (
    <>
      <PageHeader eyebrow={t("events")} title={t("upcomingEvents")} />
      <Container>
        <DemoNote>
          {km
            ? "ការចុះឈ្មោះត្រូវបានក្លែងធ្វើក្នុងសម័យកម្មវិធីរុករកនេះតែប៉ុណ្ណោះ — គ្មានអ្វីត្រូវបានរក្សាទុកទេ។"
            : "Registrations are simulated in this browser session only — nothing is saved."}
        </DemoNote>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {items.filter((e) => e.status === "published").map((e) => (
            <article key={e.id} className="card-surface flex flex-col p-6">
              <p className="eyebrow">{km ? (e.kindKm || e.kind) : e.kind}</p>
              <h2 className="mt-2 text-2xl font-semibold">{km ? (e.titleKm || e.title) : e.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{e.date} · {km ? (e.placeKm || e.place) : e.place}</p>
              <button className="btn btn-primary mt-auto self-start" style={{ marginTop: "1.5rem" }} disabled={reg.includes(e.id)} onClick={() => setReg([...reg, e.id])}>
                {reg.includes(e.id) ? (km ? "បានចុះឈ្មោះ (គំរូ)" : "Registered (demo)") : t("register")}
              </button>
            </article>
          ))}
          {items.filter((e) => e.status === "published").length === 0 && (
            <div className="card-surface p-8 text-center col-span-3">
              <h2 className="text-xl font-semibold">{km ? "មិនមានព្រឹត្តិការណ៍នាពេលខាងមុខទេ" : "No upcoming events scheduled"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {km ? "សូមពិនិត្យមើលឡើងវិញនៅពេលក្រោយ។" : "Please check back later for new conferences and field excursions."}
              </p>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
