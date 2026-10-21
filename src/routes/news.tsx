import { createFileRoute, Link } from "@/lib/spa-router";
import {
  Container,
  PageHeader,
  DemoNote,
  meta,
} from "@/components/site/Chrome";
import { news } from "@/lib/data";
import { PublishedPostCards } from "@/admin/PublicPosts";
import { useI18n } from "@/lib/i18n";
export const Route = createFileRoute("/news")({
  head: () => meta("News", "GeoCam news and updates"),
  component: News,
});
function News() {
  const { t, lang } = useI18n();
  return (
    <>
      <PageHeader eyebrow={t("news")} title={t("latestNews")} />
      <Container>
        <PublishedPostCards />
        <DemoNote>
          {lang === "km"
            ? "អត្ថបទខាងក្រោមជាទិន្នន័យគំរូ មិនមែនព័ត៌មានពិតទេ។"
            : "These are demonstration stories, not verified real-world news."}
        </DemoNote>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {news
            .filter((n) => n.status === "published")
            .map((n) => (
              <Link
                key={n.id}
                to={"/news/item?id=" + encodeURIComponent(n.id)}
                className="card-surface group block overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <div className="relative mb-5 h-52 w-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={n.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"}
                    alt={lang === "km" && n.titleKm ? n.titleKm : n.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md">
                    {n.tag}
                  </span>
                </div>
                <p className="text-xs font-semibold text-accent">
                  {n.tag} · {n.date}
                </p>
                <h2 className="mt-2 text-2xl font-bold group-hover:text-blue-600 transition-colors">
                  {lang === "km" && n.titleKm ? n.titleKm : n.title}
                </h2>
                <p className="mt-3 text-muted-foreground line-clamp-3 leading-relaxed">{n.excerpt}</p>
                <p className="mt-5 font-semibold text-accent">
                  {lang === "km" ? "អានអត្ថបទ →" : "Read article →"}
                </p>
              </Link>
            ))}
        </div>
      </Container>
    </>
  );
}
