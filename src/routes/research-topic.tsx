import { Container, PageHeader } from "@/components/site/Chrome";
import { Link } from "@/lib/spa-router";
import { researchAreas, publications } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useAdmin } from "@/admin/Auth";
import { Edit3 } from "lucide-react";
import { matchesResearchArea } from "@/lib/publication-search";
export default function ResearchTopic() {
  const { lang } = useI18n();
  const { admin } = useAdmin();
  const key = new URLSearchParams(location.search).get("id");
  const area = researchAreas.find((a) => a.key === key);
  const related = publications.filter((p) => matchesResearchArea(p, key));
  return (
    <>
      <PageHeader
        eyebrow={lang === "km" ? "ការស្រាវជ្រាវ" : "Research"}
        title={area ? (lang === "km" ? area.km : area.key) : "Topic not found"}
      />
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <Link to="/research" className="text-accent font-semibold text-sm">
            ← {lang === "km" ? "ត្រឡប់" : "Back to research"}
          </Link>

          {admin && (
            <div data-cms-ui="research-admin-actions">
              <Link
                to="/admin?section=pages&page=/research"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                title="Edit research in Admin"
              >
                <Edit3 size={13} />
                <span>{lang === "km" ? "កែសម្រួលផ្នែកស្រាវជ្រាវ" : "Edit Research Page"}</span>
              </Link>
            </div>
          )}
        </div>
        {area && (
          <article className="card-surface mt-6 p-8">
            <h2 className="text-2xl font-semibold">
              {lang === "km" ? "សេចក្តីពិពណ៌នា" : "Overview"}
            </h2>
            <p className="mt-5 text-lg leading-loose">{area.text}</p>
            <h3 className="mt-9 text-xl font-semibold">
              {lang === "km"
                ? "ការបោះពុម្ពផ្សាយពាក់ព័ន្ធ"
                : "Related publications"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {lang === "km"
                ? "ឯកសារស្រាវជ្រាវដែលបានប្រមូល។"
                : "References from the collected geoscience research library."}
            </p>
            <div className="mt-4 space-y-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  className="block rounded-xl border p-4 text-accent hover:bg-slate-50"
                  to={"/publications/view?id=" + p.id}
                >
                  {p.title} →
                </Link>
              ))}
              {related.length === 0 && <p>No related publications yet.</p>}
            </div>
          </article>
        )}
      </Container>
    </>
  );
}
