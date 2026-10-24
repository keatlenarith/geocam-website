import { Container, PageHeader } from "@/components/site/Chrome";
import { Link } from "@/lib/spa-router";
import { publications } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useAdmin } from "@/admin/Auth";
import { Edit3, PlusCircle, Eye, BookOpen, Download, ExternalLink } from "lucide-react";
export default function PublicationView() {
  const { lang } = useI18n();
  const { admin } = useAdmin();
  const id = new URLSearchParams(location.search).get("id");
  const p = publications.find((x) => x.id === id);
  return (
    <>
      <PageHeader
        eyebrow={lang === "km" ? "ការបោះពុម្ពផ្សាយ" : "Publications"}
        title={p?.title || "Publication not found"}
      />
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <Link to="/publications" className="text-accent font-semibold text-sm">
            ← {lang === "km" ? "ត្រឡប់ទៅបញ្ជី" : "Back to publications"}
          </Link>

          {admin && p && (
            <div
              data-cms-ui="pub-admin-actions"
              className="flex flex-wrap items-center gap-2"
            >
              <Link
                to={`/admin?section=publications&search=${encodeURIComponent(p.title)}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                title="Edit this publication in Admin"
              >
                <Edit3 size={13} />
                <span>{lang === "km" ? "កែសម្រួលការបោះពុម្ពផ្សាយ" : "Edit Publication"}</span>
              </Link>
              <Link
                to="/admin?section=publications"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <PlusCircle size={13} />
                <span>{lang === "km" ? "បន្ថែមថ្មី" : "+ Add Paper"}</span>
              </Link>
            </div>
          )}
        </div>
        {p ? (
          <section className="card-surface mt-6 p-5 md:p-8">
            <p className="text-sm text-accent">
              {p.topic} · {p.year ?? "Year unverified"} · {p.journal}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {p.publicationType} · {p.scope}
            </p>
            {p.authors && <p className="mt-2 text-slate-800 font-medium">{p.authors}</p>}

            {/* Document / Paper Figure Preview */}
            {p.image && (
              <figure className="my-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 p-3 shadow-xs">
                <a
                  href={p.pdfUrl || p.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="max-h-[550px] w-full object-contain rounded-lg mx-auto bg-white transition group-hover:opacity-95 shadow-xs"
                  />
                  <div className="mt-2 text-center text-xs text-slate-600 italic flex items-center justify-center gap-1.5">
                    <Eye size={13} className="text-emerald-600" />
                    <span>
                      {lang === "km"
                        ? "រូបភាព/គម្របដកស្រង់ចេញពីឯកសារស្រាវជ្រាវ (ចុចដើម្បីពង្រីក ឬទាញយក PDF)"
                        : "Figure / page preview from published paper (Click to view full size or open PDF)"}
                    </span>
                  </div>
                </a>
              </figure>
            )}
            <p className="mt-4 leading-relaxed">{p.abstract}</p>
            {p.doi && (
              <p className="mt-3 text-sm">
                DOI:{" "}
                <a
                  className="text-accent underline"
                  href={"https://doi.org/" + p.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.doi}
                </a>
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {p.pdfUrl && (
                <>
                  <a
                    className="btn btn-primary"
                    href={p.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open PDF ↗
                  </a>
                  <a className="btn btn-outline" href={p.pdfUrl} download>
                    Download PDF
                  </a>
                </>
              )}
              {p.fileUrl && (
                <a className="btn btn-primary" href={p.fileUrl} download>
                  Download document
                </a>
              )}
              {p.sourceUrl && (
                <a
                  className="btn btn-outline"
                  href={p.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Publisher / repository ↗
                </a>
              )}
              {p.alternateFiles?.map((file) => (
                <a
                  key={file.url}
                  className="btn btn-outline"
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.label} ↗
                </a>
              ))}
            </div>
            {p.pdfUrl ? (
              <object
                data={p.pdfUrl + "#toolbar=1"}
                type="application/pdf"
                aria-label={"PDF: " + p.title}
                className="mt-6 h-[75vh] min-h-[500px] w-full rounded-xl border"
              >
                <p className="p-6">
                  Your browser cannot display this PDF inline.{" "}
                  <a className="text-accent underline" href={p.pdfUrl}>
                    Open or download the PDF
                  </a>
                  .
                </p>
              </object>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed p-8">
                <h2 className="text-xl font-semibold">
                  {p.fileUrl
                    ? "Document available for download"
                    : "Read at the original source"}
                </h2>
                <p className="mt-3 text-muted-foreground">
                  {p.fileUrl
                    ? "Use the download button to open this document in a compatible application."
                    : "A local PDF was not available when this reference was collected. Follow the publisher or repository link to check access."}
                </p>
              </div>
            )}
          </section>
        ) : (
          <p className="mt-6">
            This reference could not be found. Return to the library to browse
            available publications.
          </p>
        )}
      </Container>
    </>
  );
}
