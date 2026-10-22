import { createFileRoute, Link } from "@/lib/spa-router";
import { Container, PageHeader, meta } from "@/components/site/Chrome";
import { researchAreas, publications } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useAdmin } from "@/admin/Auth";
import { useState } from "react";
import {
  BookOpen,
  ArrowRight,
  FileText,
  Download,
  ExternalLink,
  Search,
  Sparkles,
  Edit3,
  Layers,
  Compass,
} from "lucide-react";
import { FOCUS_TOPICS } from "@/features/research/focus-topics-data";
import { matchesResearchArea } from "@/lib/publication-search";

export const Route = createFileRoute("/research")({
  head: () =>
    meta(
      "Research & Discovery",
      "Cambodia geoscience research themes, core disciplines, and highlighted peer-reviewed publications.",
    ),
  component: Research,
});

function Research() {
  const { lang } = useI18n();
  const { admin } = useAdmin();
  const [filterTopic, setFilterTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const topicsList = [
    { id: "all", labelKm: "ទាំងអស់", labelEn: "All Topics" },
    { id: "Tectonics", labelKm: "តិចតូនិក", labelEn: "Tectonics" },
    { id: "Mineral deposits", labelKm: "ជម្រកដែក", labelEn: "Mineral Deposits" },
    { id: "Geochemistry", labelKm: "គីមីភូគព្ភសាស្ត្រ", labelEn: "Geochemistry" },
    { id: "Geophysics", labelKm: "រូបភូគព្ភសាស្ត្រ", labelEn: "Geophysics" },
    { id: "Geohazards", labelKm: "មហន្តរាយ", labelEn: "Geohazards" },
    { id: "Karst & paleoclimate", labelKm: "កាស្ត និងគុហា", labelEn: "Karst & Caves" },
  ];

  const filteredPubs = publications.filter((p) => {
    const matchesFilter =
      filterTopic === "all" || matchesResearchArea(p, filterTopic);
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.abstract?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <PageHeader
        eyebrow={lang === "km" ? "ការស្រាវជ្រាវ និងរបកគំហើញ" : "Research & Discovery"}
        title={
          lang === "km"
            ? "វិស័យស្រាវជ្រាវស្នូល និងទស្សនាវដ្ដីវិទ្យាសាស្ត្រកម្ពុជា"
            : "Core Geoscience Disciplines & Scientific Publications"
        }
      />
      <Container>
        {/* Admin Bar */}
        {admin && (
          <div className="mb-6 flex justify-end" data-cms-ui="research-admin-actions">
            <Link
              to="/admin?section=pages&page=/research"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
              title="Edit research in Admin"
            >
              <Edit3 size={13} />
              <span>{lang === "km" ? "កែសម្រួលទំព័រស្រាវជ្រាវ" : "Edit Research Page"}</span>
            </Link>
          </div>
        )}

        {/* Section 1: The 5 Key Focus Areas */}
        <section className="mb-16">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Compass size={15} />
              {lang === "km" ? "វិស័យសំខាន់ៗទាំង៥" : "5 Core Geoscience Disciplines"}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              {lang === "km"
                ? "វិស័យសំខាន់ៗនៃភូគព្ភសាស្ត្រកម្ពុជា"
                : "Cambodia's Key Geoscience Disciplines"}
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-3xl">
              {lang === "km"
                ? "ពីការសិក្សារចនាសម្ព័ន្ធតិចតូនិកជម្រៅជ្រៅ រហូតដល់ជម្រកដែក គីមីទឹកក្រោមដី រូបភូគព្ភសាស្ត្រ និងការគ្រប់គ្រងមហន្តរាយធម្មជាតិ។ ចុចលើវិស័យនីមួយៗ ដើម្បីអានអត្ថបទលម្អិត។"
                : "From deep tectonic terranes to metallic ore systems, groundwater chemistry, geophysical surveying, and geohazard resilience. Click each discipline to read the full research article."}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {researchAreas.map((r, i) => {
              const topicObj = FOCUS_TOPICS.find(
                (f) => f.key.toLowerCase() === r.key.toLowerCase(),
              );
              const title = lang === "km" ? (r.km || r.key) : r.key;
              const desc = lang === "km" ? ((r as any).textKm || r.text) : r.text;
              const imgSrc = topicObj?.image || r.image;

              return (
                <Link
                  key={r.key}
                  to={"/research/topic?id=" + encodeURIComponent(r.key)}
                  className="gc-area group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div>
                    <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm">
                      <img
                        src={imgSrc}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-xs font-bold text-white shadow backdrop-blur-md">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      {desc}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                    <span>{lang === "km" ? "ស្វែងយល់បន្ថែម" : "Explore topic"}</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Section 2: Highlighted Research, Papers & Scientific Journals */}
        <section className="mb-20 pt-10 border-t border-slate-200">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <BookOpen size={15} />
                {lang === "km" ? "ការបោះពុម្ពផ្សាយ និងទស្សនាវដ្ដីវិទ្យាសាស្ត្រ" : "Scientific Publications & Journals"}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
                {lang === "km"
                  ? "ចំណងជើងការស្រាវជ្រាវ និងទស្សនាវដ្ដីសំខាន់ៗ"
                  : "Highlighted Research Papers & Journals"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {lang === "km"
                  ? "អត្ថបទស្រាវជ្រាវ និក្ខេបបទ និងទស្សនាវដ្ដីអន្តរជាតិ (Journal of Asian Earth Sciences, Geological Journal, etc.)"
                  : "Curated peer-reviewed articles from international and regional earth science journals"}
              </p>
            </div>

            <Link
              to="/publications"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition shadow-sm"
            >
              <FileText size={14} />
              <span>{lang === "km" ? "បណ្ណាល័យស្រាវជ្រាវទាំងមូល (៥០+ ឯកសារ)" : "Full Research Catalog (50+ Papers)"}</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Filter & Search Bar */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap gap-2">
              {topicsList.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilterTopic(t.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    filterTopic === t.id
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {lang === "km" ? t.labelKm : t.labelEn}
                </button>
              ))}
            </div>

            <div className="relative max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder={
                  lang === "km"
                    ? "ស្វែងរកតាមចំណងជើង ឬពាក្យគន្លឹះ..."
                    : "Search papers by title or keyword..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="field w-full pl-10 text-sm"
              />
            </div>
          </div>

          {/* Publications Grid */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredPubs.slice(0, 18).map((p) => (
              <div
                key={p.id}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-muted-foreground">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-800">
                      {p.topic}
                    </span>
                    {p.year && (
                      <span className="rounded bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-800">
                        {p.year}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                    <Link to={"/publications/view?id=" + p.id}>
                      {p.title}
                    </Link>
                  </h3>
                  {p.journal && (
                    <p className="mt-1 text-xs text-slate-500 italic line-clamp-1">
                      {p.journal}
                    </p>
                  )}
                  {p.abstract && (
                    <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {p.abstract}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <Link
                    to={"/publications/view?id=" + p.id}
                    className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                  >
                    <FileText size={12} />
                    {lang === "km" ? "មើលព័ត៌មានលម្អិត" : "View Paper"}
                  </Link>
                  {p.pdfUrl && (
                    <a
                      href={p.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                    >
                      <Download size={12} />
                      PDF
                    </a>
                  )}
                  {p.doi && (
                    <a
                      href={"https://doi.org/" + p.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-accent underline ml-auto"
                    >
                      <ExternalLink size={12} />
                      DOI
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredPubs.length === 0 && (
            <div className="text-center py-12 border rounded-xl bg-slate-50">
              <p className="text-slate-600">
                {lang === "km"
                  ? "រកមិនឃើញឯកសារត្រូវគ្នានឹងការស្វែងរករបស់អ្នកទេ។"
                  : "No publications match your filter criteria."}
              </p>
            </div>
          )}

          {/* Bottom link to full catalog */}
          <div className="mt-10 text-center">
            <Link
              to="/publications"
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <BookOpen size={16} />
              <span>
                {lang === "km"
                  ? "ស្វែងរកបណ្ណាល័យស្រាវជ្រាវទាំងមូល (៥០+ ឯកសារ)"
                  : "Explore All 50+ Publications in Catalog"}
              </span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}
