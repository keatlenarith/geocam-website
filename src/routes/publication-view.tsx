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
  Maximize2,
  Minimize2,
  RefreshCw,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function PublicationView() {
  const { lang } = useI18n();
  const km = lang === "km";
  const { admin } = useAdmin();
  const id = new URLSearchParams(location.search).get("id");

  const [pubs, setPubs] = useState<Publication[]>(() => getStoredPublications());
  const [activeViewer, setActiveViewer] = useState<"native" | "google" | "mozilla">("native");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleSync = () => setPubs(getStoredPublications());
    window.addEventListener("geocam_publications_changed", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("geocam_publications_changed", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Detect mobile device to default to cloud-rendered viewer if native object doesn't render
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
        navigator.userAgent,
      ) || (window.innerWidth < 768);
      setIsMobile(mobile);
      if (mobile) {
        // Mobile browsers cannot display application/pdf object tag inline; default to Google Docs viewer
        setActiveViewer("google");
      }
    };
    checkMobile();
  }, []);

  const p = pubs.find((x) => x.id === id);

  // Helper to build fully qualified public URL for cloud readers (Google Docs / Mozilla)
  const getFullPublicPdfUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // Standard production root
    const origin = typeof window !== "undefined" && window.location.origin.includes("localhost")
      ? "https://geocam.site"
      : (typeof window !== "undefined" ? window.location.origin : "https://geocam.site");
    return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const fullPdfUrl = p?.pdfUrl ? getFullPublicPdfUrl(p.pdfUrl) : "";
  const googleViewerUrl = fullPdfUrl
    ? `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(fullPdfUrl)}`
    : "";
  const mozillaViewerUrl = fullPdfUrl
    ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(fullPdfUrl)}`
    : "";

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

            {/* Quick Action Toolbar */}
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

            {/* Interactive Embedded Document Reader */}
            {p.pdfUrl ? (
              <div
                className={`mt-8 overflow-hidden rounded-2xl border border-slate-300 bg-slate-900 shadow-md transition-all ${
                  isFullscreen
                    ? "fixed inset-0 z-50 rounded-none border-0 h-screen w-screen p-0 m-0"
                    : "w-full"
                }`}
              >
                {/* Reader Header / Controls Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 bg-slate-800 px-4 py-2.5 text-white">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-emerald-400" />
                    <span className="text-xs sm:text-sm font-semibold truncate max-w-[200px] sm:max-w-md">
                      {km ? "កម្មវិធីអានឯកសារផ្ទាល់" : "Direct Document Reader"}: {p.title}
                    </span>
                  </div>

                  {/* Mode Selector & Fullscreen */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex rounded-lg bg-slate-900/80 p-0.5 border border-slate-700 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveViewer("native");
                          setIframeLoaded(true);
                        }}
                        className={`rounded-md px-2.5 py-1 transition ${
                          activeViewer === "native"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-slate-300 hover:text-white"
                        }`}
                        title="Native browser PDF engine"
                      >
                        {km ? "ធម្មជាតិ" : "Native"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveViewer("google");
                          setIframeLoaded(false);
                        }}
                        className={`rounded-md px-2.5 py-1 transition ${
                          activeViewer === "google"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-slate-300 hover:text-white"
                        }`}
                        title="Google Docs Cloud PDF Reader (Supports mobile & all browsers)"
                      >
                        Google Docs
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveViewer("mozilla");
                          setIframeLoaded(false);
                        }}
                        className={`rounded-md px-2.5 py-1 transition ${
                          activeViewer === "mozilla"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-slate-300 hover:text-white"
                        }`}
                        title="Mozilla PDF.js viewer"
                      >
                        PDF.js
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="inline-flex items-center justify-center rounded-lg bg-slate-700 p-1.5 text-slate-200 hover:bg-slate-600 hover:text-white transition"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reader"}
                    >
                      {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                  </div>
                </div>

                {/* PDF Container View */}
                <div
                  className={`relative w-full bg-slate-100 ${
                    isFullscreen ? "h-[calc(100vh-49px)]" : "h-[75vh] min-h-[550px]"
                  }`}
                >
                  {/* View 1: Native Object Embed (Desktop Chrome/Firefox/Edge) */}
                  {activeViewer === "native" && (
                    <object
                      data={p.pdfUrl + "#toolbar=1&navpanes=0"}
                      type="application/pdf"
                      aria-label={"PDF: " + p.title}
                      className="h-full w-full"
                    >
                      {/* Fallback displayed automatically when native PDF embed isn't supported */}
                      <div className="flex h-full flex-col items-center justify-center p-6 text-center bg-slate-50">
                        <AlertCircle className="mb-3 h-12 w-12 text-amber-500" />
                        <h3 className="text-base font-bold text-slate-800">
                          {km
                            ? "កម្មវិធីរុករករបស់អ្នកមិនអាចបង្ហាញ PDF នេះដោយផ្ទាល់ទេ"
                            : "Inline native PDF view is not supported on this browser/device"}
                        </h3>
                        <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-600">
                          {km
                            ? "ចុចប៊ូតុងខាងក្រោមដើម្បីប្តូរទៅ Google Docs Reader ឬទាញយកឯកសារ"
                            : "Click below to switch to the Google Docs Cloud Viewer or open the PDF in a new tab."}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                          <button
                            type="button"
                            onClick={() => setActiveViewer("google")}
                            className="btn btn-primary text-xs"
                          >
                            {km ? "ប្តូរទៅ Google Docs Viewer" : "Switch to Google Docs Viewer"}
                          </button>
                          <a
                            href={p.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline text-xs"
                          >
                            {km ? "បើក PDF ក្នុងផ្ទាំងថ្មី ↗" : "Open PDF in New Tab ↗"}
                          </a>
                        </div>
                      </div>
                    </object>
                  )}

                  {/* View 2: Google Docs Viewer (Universal Desktop + Mobile) */}
                  {activeViewer === "google" && (
                    <div className="relative h-full w-full bg-white">
                      {!iframeLoaded && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10">
                          <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
                          <p className="mt-3 text-xs font-semibold text-slate-600">
                            {km ? "កំពុងបើកឯកសារ PDF តាម Google Docs..." : "Loading document preview via Google Docs viewer..."}
                          </p>
                        </div>
                      )}
                      <iframe
                        src={googleViewerUrl}
                        title={"PDF: " + p.title}
                        className="h-full w-full border-0"
                        onLoad={() => setIframeLoaded(true)}
                        allow="fullscreen"
                      />
                    </div>
                  )}

                  {/* View 3: Mozilla PDF.js Viewer */}
                  {activeViewer === "mozilla" && (
                    <div className="relative h-full w-full bg-white">
                      {!iframeLoaded && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10">
                          <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
                          <p className="mt-3 text-xs font-semibold text-slate-600">
                            {km ? "កំពុងបើកឯកសារ PDF តាម PDF.js..." : "Loading document via Mozilla PDF.js viewer..."}
                          </p>
                        </div>
                      )}
                      <iframe
                        src={mozillaViewerUrl}
                        title={"PDF: " + p.title}
                        className="h-full w-full border-0"
                        onLoad={() => setIframeLoaded(true)}
                        allow="fullscreen"
                      />
                    </div>
                  )}
                </div>

                {/* Footer hints */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>
                      {km
                        ? "អាចមើលបានទាំងកុំព្យូទ័រ និងទូរសព្ទដៃ"
                        : "Universal compatibility: Works across Desktop, Tablet & Mobile"}
                    </span>
                  </div>
                  <a
                    href={p.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{km ? "ទាញយកច្បាប់ដើម (Original PDF)" : "Download Original PDF"}</span>
                    <Download size={12} />
                  </a>
                </div>
              </div>
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
