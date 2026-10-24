import { translateText } from "@/lib/translation";
import { Container, PageHeader } from "@/components/site/Chrome";
import { Link } from "@/lib/spa-router";
import { useEffect, useState } from "react";
import { postText, postBody, safeCover } from "@/admin/posts";
import {
  getNewsById,
  isManagedNews,
  type NewsItem as NewsData,
} from "@/lib/news-service";
import { useI18n } from "@/lib/i18n";
import { useAdmin } from "@/admin/Auth";
import { ArrowLeft, Calendar, Tag, Share2, Edit3, PlusCircle, LayoutDashboard } from "lucide-react";

export default function NewsItem() {
  const { lang } = useI18n();
  const { admin } = useAdmin();
  const id = new URLSearchParams(location.search).get("id") || "";
  const [article, setArticle] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setArticle(null);
    setError("");
    getNewsById(id)
      .then((item) => {
        if (alive) setArticle(item ?? null);
      })
      .catch(() => {
        if (alive) setError("Could not load this article. Please try again.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  const title = article
    ? postText(article.title, article.titleKm, lang)
    : lang === "km"
      ? "រកមិនឃើញអត្ថបទ"
      : "Article not found";

  const excerpt = article
    ? postText(article.excerpt, article.excerptKm, lang)
    : "";

  const content = article
    ? postBody(article.content || article.excerpt, article.contentKm, lang)
    : "";

  return (
    <>
      <PageHeader
        eyebrow={lang === "km" ? "ព័ត៌មានភូគព្ភវិទ្យាសាស្ត្រ" : "Geoscience News"}
        title={title}
      />
      <Container>
        <div className="mx-auto max-w-4xl py-4">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition mb-6"
          >
            <ArrowLeft size={16} />
            <span>
              {lang === "km"
                ? "ត្រឡប់ទៅកាន់ព័ត៌មានទាំងអស់"
                : "Back to all news"}
            </span>
          </Link>

          {loading ? (
            <p role="status">{lang === "km" ? "កំពុងផ្ទុកអត្ថបទ…" : "Loading article…"}</p>
          ) : error ? (
            <p role="alert" className="rounded bg-red-50 p-4 text-red-800">
              {error}
            </p>
          ) : !article ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <h2 className="text-xl font-bold text-slate-800">
                {lang === "km"
                  ? "រកមិនឃើញអត្ថបទព័ត៌មាននេះទេ"
                  : "Story Not Found"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {lang === "km"
                  ? "អត្ថបទនេះប្រហែលជាត្រូវបានលុប ឬផ្លាស់ប្តូរទីតាំង។"
                  : "This article may have been removed or unpublished."}
              </p>
              <Link
                to="/news"
                className="mt-6 inline-block rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white"
              >
                {lang === "km" ? "មើលព័ត៌មានផ្សេងទៀត" : "Browse other stories"}
              </Link>
            </div>
          ) : (
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
              {/* Meta bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-500 pb-6 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">
                    <Tag size={12} /> {lang === "km" ? translateText(article.tag) : article.tag}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} /> {article.date}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span>
                    {isManagedNews(article.id)
                      ? (lang === "km" ? "ប្រព័ន្ធផ្សព្វផ្សាយសមាគម GeoCam" : "GeoCam Society Media")
                      : (lang === "km" ? "គំរូសាកល្បង · អត្ថបទបង្ហាញគំរូ" : "DEMO · Demonstration story")}
                  </span>
                </div>

                {admin && (
                  <div
                    data-cms-ui="post-meta-admin-tools"
                    className="flex flex-wrap items-center gap-2"
                  >
                    <Link
                      to={`/admin?section=posts&edit=${encodeURIComponent(article.id)}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                      title="Edit this post in GeoCam Admin"
                    >
                      <Edit3 size={13} />
                      <span>{lang === "km" ? "កែសម្រួលអត្ថបទនេះ" : "Edit this Post"}</span>
                    </Link>
                    <Link
                      to="/admin?section=posts&new=1"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      title="Create new post"
                    >
                      <PlusCircle size={13} />
                      <span>{lang === "km" ? "សរសេរថ្មី" : "+ New"}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Main Title */}
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl leading-tight">
                {title}
              </h1>

              {/* Cover Photo */}
              {safeCover(article.image) && (
                <div className="mt-8 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                  <img
                    src={safeCover(article.image)}
                    alt={title}
                    className="max-h-[500px] w-full object-cover"
                  />
                </div>
              )}

              {/* Summary / Excerpt Callout */}
              {excerpt && (
                <div className="mt-8 rounded-xl border-l-4 border-emerald-600 bg-emerald-50/60 p-5 text-base font-medium leading-relaxed text-slate-800">
                  {excerpt}
                </div>
              )}

              {/* Full Content Body */}
              <div
                className="geocam-article-body mt-8 space-y-4 whitespace-normal text-lg leading-relaxed text-slate-700 font-normal"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {/* Bottom Admin Callout */}
              {admin && (
                <div
                  data-cms-ui="post-bottom-admin-panel"
                  className="mt-12 rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                      <Edit3 size={15} />
                      <span>{lang === "km" ? "ផ្ទាំងកែសម្រួលសម្រាប់អ្នកគ្រប់គ្រង" : "Administrator Post Controls"}</span>
                    </h4>
                    <p className="text-xs text-emerald-700 mt-1">
                      {lang === "km"
                        ? "អ្នកអាចកែប្រែចំណងជើង រូបថត តារាង ដ្យាក្រាម និងខ្លឹមសារបានគ្រប់ពេលវេលា។"
                        : "You can edit title, content, cover photo, datasets, and charts at any time."}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Link
                      to={`/admin?section=posts&edit=${encodeURIComponent(article.id)}`}
                      className="flex-1 sm:flex-none text-center rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition"
                    >
                      {lang === "km" ? "កែសម្រួលអត្ថបទនេះឥឡូវនេះ" : "Edit this Post Now"}
                    </Link>
                    <Link
                      to="/admin?section=posts"
                      className="flex-1 sm:flex-none text-center rounded-lg border border-emerald-300 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition"
                    >
                      {lang === "km" ? "គ្រប់គ្រងអត្ថបទទាំងអស់" : "All Posts"}
                    </Link>
                  </div>
                </div>
              )}
            </article>
          )}
        </div>
      </Container>
    </>
  );
}
