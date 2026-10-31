import { Container, PageHeader } from "@/components/site/Chrome";
import { Link } from "@/lib/spa-router";
import { useState, useEffect } from "react";
import type { Publication } from "@/lib/data";
import { getStoredPublications } from "@/lib/publication-service";
import { useI18n } from "@/lib/i18n";
import { useAdmin } from "@/admin/Auth";
import {
  Edit3,
  PlusCircle,
  Eye,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  AlertCircle,
} from "lucide-react";
import PdfCanvasViewer from "@/components/publications/PdfCanvasViewer";

export default function PublicationView() {
  const { lang } = useI18n();
  const km = lang === "km";
  const { admin } = useAdmin();
  const id = new URLSearchParams(location.search).get("id");

  const [pubs, setPubs] = useState<Publication[]>(() => getStoredPublications());

  useEffect(() => {
    const handleSync = () => setPubs(getStoredPublications());
    window.addEventListener("geocam_publications_changed", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("geocam_publications_changed", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const p = pubs.find((x) => x.id === id);

  return (
    <>
      <PageHeader
        eyebrow={km ? "ការបោះពុម្ពផ្សាយ" : "Publications"}
        title={p?.title || "Publication not found"}
      />
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <Link to="/publications" className="text-accent font-semibold text-sm">
            ← {km ? "ត្រឡប់ទៅបញ្ជី" : "Back to publications"}
          </Link>

          {admin && p && (
            <div
              data-cms-ui="pub-admin-actions"
              className="flex flex-wrap items-center gap-2"
            >
              <Link
                to={`/admin?section=publications&edit=${encodeURIComponent(p.id)}&search=${encodeURIComponent(p.title)}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                title="Edit this publication in Admin"
              >
                <Edit3 size={13} />
                <span>{km ? "កែសម្រួលការបោះពុម្ពផ្សាយ" : "Edit Publication"}</span>
              </Link>
              <Link
                to="/admin?section=publications"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <PlusCircle size={13} />
                <span>{km ? "បន្ថែមថ្មី" : "+ Add Paper"}</span>
              </Link>
            </div>
          )}
        </div>

        {p ? (
          <section className="card-surface mt-6 p-5 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                {p.topic}
              </span>
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {p.year ?? "Year unverified"}
              </span>
              {p.journal && (
                <span className="text-xs font-medium text-slate-600 italic flex items-center gap-1">
                  <BookOpen size={12} className="text-emerald-600 shrink-0" />
                  {p.journal}
                </span>
              )}
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {p.publicationType} · {p.scope}
            </p>
            {p.authors && (
              <p className="mt-2 text-sm text-slate-800 font-medium">{p.authors}</p>
            )}

            {/* Document / Paper Figure Preview - 3-Image Standard */}
            {p.image && (
              <figure className="geocam-figure my-6 mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/70 p-2 sm:p-3 shadow-xs text-center">
                <a
                  href={p.pdfUrl || p.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="geocam-img-box block group relative w-full overflow-hidden rounded-xl bg-white shadow-xs"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full max-w-full h-auto max-h-[60vh] object-contain rounded-xl mx-auto block transition group-hover:opacity-95"
                  />
                  <div className="mt-2 text-center text-xs text-slate-600 italic flex items-center justify-center gap-1.5 pb-1">
                    <Eye size={13} className="text-emerald-600" />
                    <span>
                      {km
                        ? "រូបភាព/គម្របដកស្រង់ចេញពីឯកសារស្រាវជ្រាវ (ចុចដើម្បីពង្រីក ឬទាញយក PDF)"
                        : "Figure / page preview from published paper (Click to view full size or open PDF)"}
                    </span>
                  </div>
                </a>
              </figure>
            )}

            {/* Abstract */}
            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/60 p-4 sm:p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2">
                <FileText size={14} className="text-emerald-700" />
                {km ? "សេចក្ដីសង្ខេបស្រាវជ្រាវ (Abstract)" : "Abstract & Summary"}
              </h2>
              <p className="text-sm leading-relaxed text-slate-700">
                {p.abstract || "Peer-reviewed Cambodian geological research publication."}
              </p>
            </div>

            {p.doi && (
              <p className="mt-3 text-sm">
                DOI:{" "}
                <a
                  className="text-accent underline font-mono text-xs"
                  href={"https://doi.org/" + p.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.doi}
                </a>
              </p>
            )}

            {/* Action Toolbar */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {p.pdfUrl && (
                <>
                  <a
                    className="btn btn-primary inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
                    href={p.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{km ? "បើក PDF ផ្ទាំងថ្មី ↗" : "Open PDF in New Tab ↗"}</span>
                  </a>
                  <a
                    className="btn btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
                    href={p.pdfUrl}
                    download
                  >
                    <Download size={14} />
                    <span>{km ? "ទាញយក PDF" : "Download PDF"}</span>
                  </a>
                </>
              )}
              {p.fileUrl && (
                <a
                  className="btn btn-primary inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
                  href={p.fileUrl}
                  download
                >
                  <Download size={14} />
                  <span>{km ? "ទាញយកឯកសារ" : "Download document"}</span>
                </a>
              )}
              {p.sourceUrl && (
                <a
                  className="btn btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
                  href={p.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={14} />
                  <span>{km ? "គេហទំព័រប្រភពបោះពុម្ព ↗" : "Publisher / Repository ↗"}</span>
                </a>
              )}
              {p.alternateFiles?.map((file) => (
                <a
                  key={file.url}
                  className="btn btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={14} />
                  <span>{file.label} ↗</span>
                </a>
              ))}
            </div>

            {/* 100% Native In-Website Direct PDF Canvas Reader */}
            {p.pdfUrl ? (
              <PdfCanvasViewer pdfUrl={p.pdfUrl} title={p.title} km={km} />
            ) : (
              /* Non-PDF / External Journal Link Card */
              <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-emerald-50/30 p-6 sm:p-8 shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-emerald-100 p-3 text-emerald-800 shrink-0">
                    <BookOpen size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      {p.fileUrl
                        ? (km ? "ឯកសារមានសម្រាប់ទាញយក" : "Document Available for Download")
                        : (km ? "អត្ថបទទស្សនាវដ្ដីវិទ្យាសាស្ត្រ (ទាមទារការបើកតាមប្រភពដើម)" : "Peer-Reviewed Journal Publication (Open at Original Source)")}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {p.fileUrl
                        ? (km
                            ? "ឯកសារនេះត្រូវបានរក្សាទុកជាទម្រង់ឯកសារស្រាវជ្រាវ។ សូមចុចប៊ូតុងទាញយកដើម្បីបើកអាន។"
                            : "This document is stored as a research document format. Click the download button above to view.")
                        : (km
                            ? "អត្ថបទនេះត្រូវបានចុះផ្សាយជាផ្លូវការនៅក្នុងទស្សនាវដ្ដីវិទ្យាសាស្ត្រអន្តរជាតិ ដែលការពារសិទ្ធិដោយអ្នកបោះពុម្ពផ្សាយ (Elsevier, Springer, Geological Journal)។ អ្នកអាចអានអត្ថបទពេញ ឬសេចក្ដីសង្ខេបនៅលើគេហទំព័ររបស់ទស្សនាវដ្ដីតាមរយៈតំណភ្ជាប់ខាងក្រោម។"
                            : "This article is officially indexed in an international scientific journal protected by publisher access policies (Elsevier, Springer, Geological Journal). You can access the full paper, citations, and figures directly on the journal's official repository.")}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {p.sourceUrl && (
                        <a
                          href={p.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary inline-flex items-center gap-2 text-sm font-semibold"
                        >
                          <ExternalLink size={16} />
                          <span>{km ? "ចូលអាននៅទស្សនាវដ្ដីដើម (Read on Journal Site) ↗" : "Read on Journal Site ↗"}</span>
                        </a>
                      )}
                      {p.doi && (
                        <a
                          href={"https://doi.org/" + p.doi}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline inline-flex items-center gap-2 text-sm font-semibold"
                        >
                          <BookOpen size={16} />
                          <span>DOI: {p.doi} ↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        ) : (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs">
            <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <h2 className="text-lg font-bold text-slate-800">
              {km ? "រកមិនឃើញការបោះពុម្ពផ្សាយនេះទេ" : "Publication Not Found"}
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
              {km
                ? "ឯកសារស្រាវជ្រាវនេះមិនមាននៅក្នុងប្រព័ន្ធ ឬត្រូវបានដកចេញ។ សូមត្រឡប់ទៅកាន់បណ្ណាល័យដើម្បីស្វែងរកឯកសារផ្សេងទៀត។"
                : "This reference could not be found. Please return to the library to browse available publications."}
            </p>
            <Link to="/publications" className="btn btn-primary mt-5 inline-flex items-center gap-2 text-sm">
              ← {km ? "ត្រឡប់ទៅបណ្ណាល័យស្រាវជ្រាវ" : "Return to Research Library"}
            </Link>
          </div>
        )}
      </Container>
    </>
  );
}
