import { Container, PageHeader } from "@/components/site/Chrome";
import { Link } from "@/lib/spa-router";
import { researchAreas, publications } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
export default function ResearchTopic() {
  const { lang } = useI18n();
  const key = new URLSearchParams(location.search).get("id");
  const area = researchAreas.find((a) => a.key === key);
  const related = publications.filter((p) => p.topic === key);
  return (
    <>
      <PageHeader
        eyebrow={lang === "km" ? "ការស្រាវជ្រាវ" : "Research"}
        title={area ? (lang === "km" ? area.km : area.key) : "Topic not found"}
      />
      <Container>
        <Link to="/research" className="text-accent">
          ← {lang === "km" ? "ត្រឡប់" : "Back to research"}
        </Link>
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
