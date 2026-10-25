import { Container, PageHeader } from "@/components/site/Chrome";
import { Link } from "@/lib/spa-router";
import { publications } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useAdmin } from "@/admin/Auth";
import {
  Edit3,
  BookOpen,
  FileText,
  Download,
  ExternalLink,
  ArrowRight,
  Compass,
  CheckCircle2,
  Sparkles,
  Layers,
  Eye,
} from "lucide-react";
import { matchesResearchArea } from "@/lib/publication-search";
import {
  FOCUS_TOPICS,
  getTopicByIdOrSlug,
} from "@/features/research/focus-topics-data";

export default function ResearchTopic() {
  const { lang } = useI18n();
  const { admin } = useAdmin();

  let id = new URLSearchParams(location.search).get("id");
  if (!id && location.pathname.startsWith("/research/")) {
    const segment = location.pathname.replace("/research/", "").replace(/\/$/, "");
    if (segment && segment !== "topic") {
      id = segment;
    }
  }

  const focus = getTopicByIdOrSlug(id || "Tectonics") || FOCUS_TOPICS[0];

  // Specific highlighted papers for this topic
  const specificPapers = publications.filter((p) =>
    focus.relatedPaperIds.includes(p.id),
  );
  const keywordMatches = publications.filter(
    (p) =>
      matchesResearchArea(p, focus.key) &&
      !specificPapers.some((sp) => sp.id === p.id),
  );
  const related = [...specificPapers, ...keywordMatches];

  // Other topics
  const otherTopics = FOCUS_TOPICS.filter((t) => t.id !== focus.id);

  return (
    <>
      <PageHeader
        eyebrow={lang === "km" ? "វិស័យស្រាវជ្រាវសំខាន់ៗ" : "Key Research Disciplines"}
        title={lang === "km" ? focus.titleKm : focus.titleEn}
      />
      <Container>
        {/* Navigation bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            to="/research"
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold text-sm transition"
          >
            ← {lang === "km" ? "ត្រឡប់ទៅទំព័រការស្រាវជ្រាវ (Research & Discovery)" : "Back to Research & Discovery"}
          </Link>

          {admin && (
            <div data-cms-ui="research-admin-actions">
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
        </div>

                {/* 3-Column Reading Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_270px] gap-8 items-start">
          {/* Left Column: Frameless Table of Contents (Content: 1... 2... 3...) */}
          <aside className="hidden lg:block sticky top-24 space-y-4 text-sm pr-2">
            <div className="pb-2 border-b border-slate-200/60">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                {lang === "km" ? "មាតិកា៖" : "Content:"}
              </span>
            </div>
            <nav className="space-y-1.5" aria-label="Table of contents">
              <a
                href="#overview"
                className="block text-slate-700 hover:text-emerald-700 hover:underline py-1 font-medium transition"
              >
                1. {lang === "km" ? "ទិដ្ឋភាពទូទៅ និងសណ្ឋាន" : "Overview & Setting"}
              </a>
              <a
                href="#takeaways"
                className="block text-slate-700 hover:text-emerald-700 hover:underline py-1 font-medium transition"
              >
                2. {lang === "km" ? "ចំណុចគន្លឹះសំខាន់ៗ" : "Core Takeaways"}
              </a>
              {focus.sections.map((sec, sIdx) => (
                <a
                  key={sIdx}
                  href={`#section-${sIdx + 1}`}
                  className="block text-slate-700 hover:text-emerald-700 hover:underline py-1 font-medium transition line-clamp-2"
                >
                  {sIdx + 3}. {lang === "km" ? sec.titleKm : sec.titleEn}
                </a>
              ))}
              <a
                href="#literature"
                className="block text-slate-700 hover:text-emerald-700 hover:underline py-1 font-medium transition"
              >
                {focus.sections.length + 3}. {lang === "km" ? "ឯកសារ និងទស្សនាវដ្ដី" : "Peer-Reviewed Literature"}
              </a>
              {focus.sources && focus.sources.length > 0 && (
                <a
                  href="#sources"
                  className="block text-slate-700 hover:text-emerald-700 hover:underline py-1 font-medium transition"
                >
                  {focus.sections.length + 4}. {lang === "km" ? "ប្រភពឯកសារយោង" : "Sources & Provenance"}
                </a>
              )}
            </nav>
          </aside>

          {/* Center Column: Main Post Article */}
          <article className="card-surface mx-auto max-w-4xl p-4 sm:p-6 md:p-10 shadow-sm rounded-2xl border border-slate-200 w-full overflow-hidden">
          {/* Header metadata */}
          <div id="overview" className="border-b border-slate-200 pb-6 mb-8 scroll-mt-24">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <Compass size={13} />
                {lang === "km" ? focus.shortTitleKm : focus.shortTitleEn}
              </span>
              <span className="text-xs text-muted-foreground">
                {lang === "km" ? "សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា" : "Geosciences Society of Cambodia"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight break-words">
              {lang === "km" ? focus.titleKm : focus.titleEn}
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
              {lang === "km" ? focus.leadKm : focus.leadEn}
            </p>

            {/* Quick stats grid */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {focus.stats.map((s, idx) => (
                <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 sm:p-3.5 min-w-0">
                  <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                    {lang === "km" ? s.labelKm : s.labelEn}
                  </span>
                  <strong className="mt-1 block text-sm md:text-base font-bold text-emerald-800 break-words">
                    {s.value}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Image - 3-Image Standard */}
          <figure className="geocam-figure mb-10 mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/70 p-2 sm:p-3 shadow-xs text-center">
            <div className="geocam-img-box w-full overflow-hidden rounded-xl bg-white shadow-xs flex items-center justify-center">
              <img
                src={focus.image}
                alt={focus.imageAlt}
                className="w-full max-w-full h-auto max-h-[60vh] object-contain mx-auto block"
                loading="eager"
              />
            </div>
            <figcaption className="mt-2.5 text-xs text-center text-slate-600 italic px-2 leading-relaxed">
              {lang === "km" ? focus.captionKm : focus.captionEn}
            </figcaption>
          </figure>

          {/* Key Takeaways Callout */}
          <div id="takeaways" className="mb-10 rounded-xl border-l-4 border-l-emerald-600 bg-emerald-50/60 p-5 md:p-6 border border-emerald-100 scroll-mt-24">
            <h3 className="flex items-center gap-2 text-base font-bold text-emerald-900">
              <Sparkles size={18} className="text-emerald-700" />
              {lang === "km" ? "ចំណុចគន្លឹះសំខាន់ៗ" : "Core Scientific Takeaways"}
            </h3>
            <ul className="mt-3 space-y-2 text-sm md:text-base text-emerald-950">
              {(lang === "km" ? focus.keyHighlightsKm : focus.keyHighlightsEn).map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-1 text-emerald-600 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Article Sections */}
          <div className="space-y-8 text-slate-800 leading-relaxed text-base md:text-lg">
            {focus.sections.map((section, idx) => (
              <section key={idx} id={`section-${idx + 1}`} className="border-b border-slate-100 pb-8 last:border-b-0 scroll-mt-24">
                <h2 className="text-2xl md:text-2xl font-bold text-slate-900 mb-4">
                  {lang === "km" ? section.titleKm : section.titleEn}
                </h2>
                <div className="space-y-4">
                  {(lang === "km" ? section.bodyKm : section.bodyEn).map((p, pIdx) => (
                    <p key={pIdx} className="leading-loose text-slate-700">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Optional Section Image - 3-Image Standard */}
                {section.image && (
                  <figure className="geocam-figure my-6 mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/70 p-2 sm:p-3 shadow-xs text-center">
                    <div className="geocam-img-box w-full overflow-hidden rounded-xl bg-white shadow-xs flex items-center justify-center">
                      <img
                        src={section.image}
                        alt={lang === "km" ? section.imageCaptionKm || "" : section.imageCaptionEn || ""}
                        className="w-full max-w-full h-auto max-h-[60vh] object-contain mx-auto block"
                        loading="lazy"
                      />
                    </div>
                    {(section.imageCaptionKm || section.imageCaptionEn) && (
                      <figcaption className="mt-2.5 text-xs text-center text-slate-600 italic px-2 leading-relaxed">
                        {lang === "km" ? section.imageCaptionKm : section.imageCaptionEn}
                      </figcaption>
                    )}
                  </figure>
                )}

                {/* Optional Multiple Section Images - 3-Image Standard */}
                {section.images &&
                  section.images.map((imgItem, imgIdx) => (
                    <figure
                      key={imgIdx}
                      className="geocam-figure my-6 mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/70 p-2 sm:p-3 shadow-xs text-center"
                    >
                      <div className="geocam-img-box w-full overflow-hidden rounded-xl bg-white shadow-xs flex items-center justify-center">
                        <img
                          src={imgItem.url}
                          alt={lang === "km" ? imgItem.captionKm || "" : imgItem.captionEn || ""}
                          className="w-full max-w-full h-auto max-h-[60vh] object-contain mx-auto block"
                          loading="lazy"
                        />
                      </div>
                      {(imgItem.captionKm || imgItem.captionEn) && (
                        <figcaption className="mt-2.5 text-xs text-center text-slate-600 italic px-2 leading-relaxed">
                          {lang === "km" ? imgItem.captionKm : imgItem.captionEn}
                        </figcaption>
                      )}
                    </figure>
                  ))}

                {/* Optional Structured Table */}
                {section.table && (
                  <div className="my-6 w-full max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
                    {(section.table.captionKm || section.table.captionEn) && (
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-semibold text-slate-800 text-sm">
                        {lang === "km" && section.table.captionKm ? section.table.captionKm : section.table.captionEn}
                      </div>
                    )}
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-100/80 text-slate-900 border-b border-slate-200 text-xs uppercase font-semibold">
                        <tr>
                          {(lang === "km" && section.table.headersKm ? section.table.headersKm : section.table.headersEn).map(
                            (h, hIdx) => (
                              <th key={hIdx} className="px-4 py-3">{h}</th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(lang === "km" && section.table.rowsKm ? section.table.rowsKm : section.table.rowsEn).map(
                          (row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/80 transition">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-4 py-3 text-slate-700 font-medium">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                    {(section.table.footnoteKm || section.table.footnoteEn) && (
                      <div className="p-3 text-xs text-slate-500 bg-slate-50/60 border-t border-slate-200 italic">
                        {lang === "km" && section.table.footnoteKm ? section.table.footnoteKm : section.table.footnoteEn}
                      </div>
                    )}
                  </div>
                )}

                {/* Optional Bullets */}
                {((lang === "km" ? section.bulletsKm : section.bulletsEn) || []).length > 0 && (
                  <ul className="mt-4 space-y-2 list-disc list-inside pl-2 text-slate-700 text-sm md:text-base">
                    {(lang === "km" ? section.bulletsKm : section.bulletsEn)!.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Optional Callout */}
                {(lang === "km" ? section.calloutKm : section.calloutEn) && (
                  <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm md:text-base text-slate-800 italic">
                    {lang === "km" ? section.calloutKm : section.calloutEn}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Highlighted Research Papers & Journals Section */}
          <div id="literature" className="mt-12 pt-8 border-t-2 border-slate-200 scroll-mt-24">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <BookOpen size={14} />
                  {lang === "km" ? "ឯកសារ និងទស្សនាវដ្ដីវិទ្យាសាស្ត្រ" : "Peer-Reviewed Literature"}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {lang === "km"
                    ? "ការស្រាវជ្រាវ និងទស្សនាវដ្ដីវិទ្យាសាស្ត្រពាក់ព័ន្ធ"
                    : "Highlighted Research Papers & Journals"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {lang === "km"
                    ? "ឯកសារស្រាវជ្រាវ និក្ខេបបទ និងទស្សនាវដ្ដីវិទ្យាសាស្ត្រស្តីពី " + focus.shortTitleKm + " នៃប្រទេសកម្ពុជា"
                    : "Published peer-reviewed literature, monographs, and field proceedings related to " + focus.shortTitleEn}
                </p>
              </div>

              <Link
                to="/publications"
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
              >
                {lang === "km" ? "មើលបណ្ណាល័យទាំងមូល →" : "View full catalog →"}
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {related.map((p) => (
                <div
                  key={p.id}
                  className="group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between w-full min-w-0"
                >
                  <div>
                    {/* Visual figure / paper thumbnail */}
                    {p.image ? (
                      <Link
                        to={"/publications/view?id=" + p.id}
                        className="block relative aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-slate-100"
                      >
                        <img
                          src={p.image}
                          alt={p.title}
                          className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow">
                            <Eye size={13} />
                            {lang === "km" ? "មើលរូបភាព / ឯកសារ" : "Preview Paper / Figure"}
                          </span>
                        </div>
                        <span className="absolute top-2.5 left-2.5 rounded-md bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 text-[11px] font-medium text-white shadow-xs">
                          {p.topic}
                        </span>
                        {p.year && (
                          <span className="absolute top-2.5 right-2.5 rounded-md bg-emerald-700/85 backdrop-blur-xs px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                            {p.year}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <div className="h-2 bg-gradient-to-r from-emerald-600 to-teal-600" />
                    )}

                    <div className="p-5">
                      {!p.image && (
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mb-2">
                          <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-800">
                            {p.topic}
                          </span>
                          {p.year && (
                            <span className="rounded bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-800">
                              {p.year}
                            </span>
                          )}
                        </div>
                      )}
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug break-words [overflow-wrap:anywhere]">
                        <Link to={"/publications/view?id=" + p.id}>
                          {p.title}
                        </Link>
                      </h4>
                      {p.journal && (
                        <p className="mt-1.5 text-xs text-slate-500 italic flex items-center gap-1.5">
                          <BookOpen size={12} className="shrink-0 text-emerald-600" />
                          <span>{p.journal}</span>
                        </p>
                      )}
                      {p.abstract && (
                        <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {p.abstract}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <Link
                      to={"/publications/view?id=" + p.id}
                      className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                    >
                      <FileText size={12} />
                      {lang === "km" ? "ព័ត៌មានលម្អិត" : "Details"}
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
              {related.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {lang === "km" ? "មិនទាន់មានឯកសារពាក់ព័ន្ធនៅឡើយទេ។" : "No related publications found."}
                </p>
              )}
            </div>
          </div>
          {/* Dedicated Sources & Scientific References */}
          {focus.sources && focus.sources.length > 0 && (
            <div className="mt-12 pt-8 border-t-2 border-slate-200">
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <FileText size={14} />
                  {lang === "km" ? "ឯកសារយោង និងប្រភពទិន្នន័យ" : "Sources & Scientific Provenance"}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {lang === "km" ? "ប្រភពឯកសារយោងវិទ្យាសាស្ត្រ (Sources)" : "Scientific Sources & Literature Cited"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {lang === "km"
                    ? "បញ្ជីឯកសារយោង ទិន្នន័យ FDSN និងកាតាឡុកភូគព្ភសាស្ត្រដែលត្រូវបានដកស្រង់ក្នុងរបាយការណ៍នេះ"
                    : "Official catalogues, FDSN earthquake services, geological GIS layers, and PSHA models referenced in this assessment."}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 divide-y divide-slate-200/70">
                {focus.sources.map((src) => (
                  <div key={src.id} className="py-3 first:pt-1 last:pb-1 flex items-start gap-3">
                    <span className="font-mono font-bold text-emerald-800 text-xs bg-emerald-100/80 px-2 py-0.5 rounded shrink-0">
                      {src.id}
                    </span>
                    <div className="text-xs md:text-sm text-slate-700 leading-relaxed">
                      <span>{src.text}</span>
                      {src.url && (
                        <div className="mt-1">
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 hover:underline font-medium break-all"
                          >
                            <span>{src.url}</span>
                            <ExternalLink size={12} className="shrink-0" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

          {/* Right Column: Related Posts Panel */}
          <aside className="hidden xl:block sticky top-24 space-y-4 pl-2">
            <div className="pb-2 border-b border-slate-200/60">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                {lang === "km" ? "អត្ថបទពាក់ព័ន្ធ....." : "Related Post....."}
              </span>
            </div>
            <div className="space-y-3">
              {otherTopics.slice(0, 5).map((item, oIdx) => (
                <Link
                  key={item.id}
                  to={`/research/topic?id=${encodeURIComponent(item.key)}`}
                  className="group block p-2.5 rounded-xl transition hover:bg-slate-50 border border-slate-100 bg-white shadow-2xs"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-slate-100 mb-2">
                    <img
                      src={item.image}
                      alt={item.titleEn}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute bottom-1.5 left-1.5 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                      {oIdx + 1}. {lang === "km" ? item.shortTitleKm : item.shortTitleEn}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-2 leading-snug">
                    {lang === "km" ? item.titleKm : item.titleEn}
                  </h5>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                    {lang === "km" ? item.leadKm : item.leadEn}
                  </p>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        {/* Explore Other Key Disciplines Navigation */}
        <section className="mt-12 mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {lang === "km" ? "ស្វែងយល់បន្ថែម" : "Continue Reading"}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
                {lang === "km" ? "វិស័យសំខាន់ៗផ្សេងទៀតនៃភូគព្ភវិទ្យាសាស្ត្រ" : "Other Key Research Disciplines"}
              </h3>
            </div>
            <Link
              to="/research"
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              {lang === "km" ? "មើលទាំងអស់" : "View all"} <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherTopics.map((item) => (
              <Link
                key={item.id}
                to={"/research/topic?id=" + encodeURIComponent(item.key)}
                className="group block overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100 mb-3">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {lang === "km" ? item.titleKm : item.titleEn}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {lang === "km" ? item.leadKm : item.leadEn}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <span>{lang === "km" ? "ស្វែងយល់បន្ថែម" : "Explore topic"}</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
