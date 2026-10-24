import { translateText } from "@/lib/translation";
import { createFileRoute, Link } from "@/lib/spa-router";
import { Container, PageHeader, meta } from "@/components/site/Chrome";
import {
  getPublishedNews,
  fetchPublicNews,
  isManagedNews,
  type NewsItem,
} from "@/lib/news-service";
import { postText, safeCover } from "@/admin/posts";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { ArrowUpRight, Search, Filter } from "lucide-react";

export const Route = createFileRoute("/news")({
  head: () => meta("News", "GeoCam news and geological updates"),
  component: News,
});

function News() {
  const { t, lang } = useI18n();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let alive = true;
    fetchPublicNews()
      .then((rows) => {
        if (alive) setItems(rows);
      })
      .catch(() => {
        if (alive) setError("Could not load news. Please try again.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    const handleUpdate = () => {
      if (alive) setItems(getPublishedNews());
    };
    window.addEventListener("geocam:news-updated", handleUpdate);
    return () => {
      alive = false;
      window.removeEventListener("geocam:news-updated", handleUpdate);
    };
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.tag || "General"))),
  ];

  const filtered = items.filter((item) => {
    const matchCat =
      activeCategory === "All" ||
      item.tag.toLowerCase() === activeCategory.toLowerCase();
    const query = search.toLowerCase();
    const matchSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      (item.titleKm && item.titleKm.toLowerCase().includes(query)) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(query)) ||
      (item.excerptKm && item.excerptKm.toLowerCase().includes(query));
    return matchCat && matchSearch;
  });

  return (
    <>
      <PageHeader
        eyebrow={
          lang === "km" ? "ព័ត៌មាន & សេចក្តីប្រកាស" : "News & Announcements"
        }
        title={
          lang === "km"
            ? "ព័ត៌មានភូគព្ភវិទ្យាសាស្ត្រចុងក្រោយ"
            : "Latest Geoscience News"
        }
      />
      <Container>
        {error && (
          <p role="alert" className="mb-4 rounded bg-red-50 p-4 text-red-800">
            {error}
          </p>
        )}
        {loading && <p role="status">{lang === "km" ? "កំពុងផ្ទុកព័ត៌មាន…" : "Loading news…"}</p>}
        {/* Search & Category Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === "km" ? "ប្រភេទ:" : "Category:"}
            </span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                  activeCategory === c
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {c === "All" ? (lang === "km" ? "ទាំងអស់" : "All") : (lang === "km" ? (c === "General" ? "ទូទៅ" : translateText(c)) : c)}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search
              size={15}
              className="absolute left-3 top-2.5 text-slate-400"
            />
            <input
              type="text"
              placeholder={
                lang === "km" ? "ស្វែងរកព័ត៌មាន..." : "Search news & stories..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* News Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.length === 0 ? (
            <div className="col-span-2 rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
              {lang === "km"
                ? "មិនមានព័ត៌មានដែលត្រូវគ្នានឹងការស្វែងរករបស់អ្នកទេ។"
                : "No news stories found matching your filter."}
            </div>
          ) : (
            filtered.map((n) => {
              const displayTitle = postText(n.title, n.titleKm, lang);
              const displayExcerpt = postText(n.excerpt, n.excerptKm, lang);
              return (
                <Link
                  key={n.id}
                  to={"/news/item?id=" + encodeURIComponent(n.id)}
                  className="card-surface group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-emerald-600"
                >
                  <div>
                    <div className="relative mb-5 h-56 w-full overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={
                          safeCover(n.image) ||
                          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={displayTitle}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
                        {lang === "km" ? translateText(n.tag) : n.tag}
                      </span>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                      {lang === "km" ? translateText(n.tag) : n.tag} · {n.date}
                      {!isManagedNews(n.id) && (lang === "km" ? " · គំរូសាកល្បង" : " · DEMO")}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {displayTitle}
                    </h2>
                    <p className="mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {displayExcerpt}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                    <span>
                      {lang === "km" ? "អានអត្ថបទពេញលេញ" : "Read full article"}
                    </span>
                    <ArrowUpRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </Container>
    </>
  );
}
