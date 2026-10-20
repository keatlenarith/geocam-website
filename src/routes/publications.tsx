import { translateText } from "../lib/translation";
import { createFileRoute, Link } from "@/lib/spa-router";
import { useMemo, useState } from "react";
import { Container, PageHeader, meta } from "@/components/site/Chrome";
import { publications, topics } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
export const Route = createFileRoute("/publications")({
  head: () =>
    meta(
      "Publications",
      "Cambodian geology, tectonics, mineralization, groundwater and karst research.",
    ),
  component: Pubs,
});
function Pubs() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("All");
  const [year, setYear] = useState("All");
  const [access, setAccess] = useState("All");
  const years = [
    ...new Set(
      publications.map((p) => p.year).filter((y): y is number => y !== null),
    ),
  ].sort((a, b) => b - a);
  const list = useMemo(
    () =>
      publications.filter(
        (p) =>
          (topic === "All" || p.topic === topic) &&
          (year === "All" ||
            (year === "Unverified"
              ? p.year === null
              : String(p.year) === year)) &&
          (access === "All" ||
            (access === "Documents"
              ? !!(p.pdfUrl || p.fileUrl)
              : !(p.pdfUrl || p.fileUrl))) &&
          `${p.title} ${translateText(p.title)} ${p.authors} ${p.abstract} ${translateText(p.abstract)} ${p.journal} ${p.tags.join(" ")} ${p.tags.map(translateText).join(" ")}`
            .toLowerCase()
            .includes(q.trim().toLowerCase()),
      ),
    [q, topic, year, access],
  );
  return (
    <>
      <PageHeader
        eyebrow="Research library"
        title={t("publications")}
        sub="Explore Cambodian geology, mineral resources, tectonics, groundwater, karst and the environment."
      />
      <Container>
        <div className="card-surface p-6">
          <p className="font-semibold">
            {publications.length} references · 45 collected documents · Updated
            19 October 2026
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Journal articles, regional references, technical guides and
            preprints. Source links are provided where a PDF was unavailable.
            Check local documents marked unverified for full citation details.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-accent">
            <a href="/research/catalog.csv" download>
              Download catalog (CSV)
            </a>
            <a href="/research/references.ris" download>
              Export internet citations (RIS)
            </a>
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_210px_150px_170px]">
          <label className="sr-only" htmlFor="q">
            Search publications
          </label>
          <input
            id="q"
            className="field"
            placeholder="Search title, journal or subject…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            aria-label="Topic"
            className="field"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="All">All topics</option>
            {topics.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            aria-label="Year"
            className="field"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="All">All years</option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
            <option value="Unverified">Year unverified</option>
          </select>
          <select
            aria-label="Availability"
            className="field"
            value={access}
            onChange={(e) => setAccess(e.target.value)}
          >
            <option value="All">All references</option>
            <option value="Documents">Documents available</option>
            <option value="Sources">Source links only</option>
          </select>
        </div>
        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          {`${list.length} results`}
        </p>
        <div className="mt-4 space-y-4">
          {list.map((p) => (
            <Link
              key={p.id}
              to={"/publications/view?id=" + encodeURIComponent(p.id)}
              className="card-surface block [overflow-wrap:anywhere] p-6 transition hover:shadow-lg focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <p className="text-xs font-semibold text-accent">
                {p.topic} · {p.year ?? "Year unverified"} · {p.journal}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{p.title}</h2>
              {p.authors && (
                <p className="text-sm text-muted-foreground">{p.authors}</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {p.publicationType} · {p.scope}
              </p>
              <p className="mt-3 text-sm">{p.abstract}</p>
              <p className="mt-4 font-semibold text-accent">
                {p.pdfUrl
                  ? "Read PDF →"
                  : p.fileUrl
                    ? "Open document →"
                    : "View publication source →"}
              </p>
            </Link>
          ))}
          {!list.length && (
            <div className="card-surface p-8 text-center">
              <h2 className="text-xl font-semibold">No matching references</h2>
              <p className="mt-2">
                Try another search term or clear the filters.
              </p>
              <button
                className="btn btn-outline mt-4"
                onClick={() => {
                  setQ("");
                  setTopic("All");
                  setYear("All");
                  setAccess("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
