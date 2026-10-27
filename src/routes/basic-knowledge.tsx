import React, { useState, useEffect, useMemo } from "react";
import { Container, PageHeader } from "@/components/site/Chrome";
import { Link } from "@/lib/spa-router";
import { useI18n } from "@/lib/i18n";
import { useAdmin } from "@/admin/Auth";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Search,
  Sparkles,
  Layers,
  Clock,
  Calendar,
  Edit,
  PlusCircle,
  FileText,
  CheckCircle2,
  Share2,
  Compass,
  Bookmark,
  ExternalLink,
  Download,
} from "lucide-react";
import {
  BASIC_KNOWLEDGE_ARTICLES,
  getKnowledgeArticleByIdOrSlug,
  type KnowledgeArticle,
} from "@/lib/basic-knowledge-data";
import { supabase } from "@/lib/supabase";
import { postBody, postText, safeCover, type Post } from "@/admin/posts";

const categoryTabs = [
  { id: "all", en: "All Topics", km: "ប្រធានបទទាំងអស់" },
  { id: "General Geology", en: "General Geology", km: "ភូគព្ភសាស្ត្រទូទៅ" },
  { id: "Rocks & Minerals", en: "Rocks & Minerals", km: "ថ្ម និងខនិជ" },
  { id: "Structural Geology", en: "Structural Geology", km: "ភូគព្ភសាស្ត្ររចនាសម្ព័ន្ធ" },
  { id: "Groundwater", en: "Groundwater", km: "ទឹកក្រោមដី" },
  { id: "Mining & Resources", en: "Mining & Resources", km: "ធនធានរ៉ែ" },
];

export default function BasicKnowledge() {
  const { lang } = useI18n();
  const { admin } = useAdmin();

  // Check URL query parameters for exact article id or slug
  const [currentUrl, setCurrentUrl] = useState(
    () => location.pathname + location.search
  );

  useEffect(() => {
    const onPop = () => setCurrentUrl(location.pathname + location.search);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [currentUrl]
  );
  const articleId =
    searchParams.get("id") ||
    searchParams.get("slug") ||
    searchParams.get("post") ||
    searchParams.get("article");

  // Dynamic user-published posts from Supabase
  const [supabasePost, setSupabasePost] = useState<Post | null>(null);
  const [loadingSupabase, setLoadingSupabase] = useState(false);
  const [publicPosts, setPublicPosts] = useState<Post[]>([]);

  // Load public posts that belong to Basic Knowledge or Geoscience categories
  useEffect(() => {
    let alive = true;
    Promise.resolve(
      supabase
        .from("geocam_post_public")
        .select("data")
        .order("updated_at", { ascending: false })
    )
      .then(({ data }) => {
        if (!alive || !data) return;
        const posts = (data ?? []).map((row) => row.data as Post);
        setPublicPosts(posts);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // If articleId is provided, check if it's a curated article or Supabase post
  const curatedArticle = useMemo(() => {
    if (!articleId) return undefined;
    return getKnowledgeArticleByIdOrSlug(articleId);
  }, [articleId]);

  useEffect(() => {
    if (!articleId || curatedArticle) {
      setSupabasePost(null);
      return;
    }
    let alive = true;
    setLoadingSupabase(true);
    Promise.resolve(
      supabase
        .from("geocam_post_public")
        .select("data")
        .eq("id", articleId)
        .maybeSingle()
    )
      .then(({ data }) => {
        if (!alive) return;
        if (data?.data) {
          setSupabasePost(data.data as Post);
        } else {
          setSupabasePost(null);
        }
      })
      .catch(() => {
        if (alive) setSupabasePost(null);
      })
      .finally(() => {
        if (alive) setLoadingSupabase(false);
      });
    return () => {
      alive = false;
    };
  }, [articleId, curatedArticle]);

  // Catalog State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Combined catalog list (curated articles + published Supabase posts)
  const combinedArticles = useMemo(() => {
    // Convert relevant Supabase posts into knowledge article format
    const extraArticles: KnowledgeArticle[] = publicPosts
      .filter((p) => {
        const cat = (p.category || "").toLowerCase();
        return (
          cat.includes("basic") ||
          cat.includes("knowledge") ||
          cat.includes("geology") ||
          cat.includes("rock") ||
          cat.includes("mineral") ||
          cat.includes("groundwater") ||
          cat.includes("hydrogeology") ||
          cat.includes("tectonic")
        );
      })
      .map((p) => ({
        id: p.id,
        slug: p.id,
        category: p.category || "General Geology",
        categoryKm: p.category || "ភូគព្ភសាស្ត្រទូទៅ",
        titleEn: p.titleEn || "Untitled Knowledge Post",
        titleKm: p.titleKm || p.titleEn || "អត្ថបទចំណេះដឹង",
        excerptEn: p.summaryEn || "",
        excerptKm: p.summaryKm || p.summaryEn || "",
        readTime: "5 min read",
        image: safeCover(p.cover) || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
        date: p.createdAt ? p.createdAt.slice(0, 10) : "2026-10-25",
        authorEn: "GeoCam Contributor",
        authorKm: "អ្នកចូលរួមចំណែក GeoCam",
        tagEn: "Community Post",
        tagKm: "អត្ថបទសហគមន៍",
        sections: [
          {
            id: "content",
            headingEn: "Article Content",
            headingKm: "ខ្លឹមសារអត្ថបទ",
            contentEn: p.bodyEn || p.summaryEn || "",
            contentKm: p.bodyKm || p.summaryKm || p.bodyEn || "",
          },
        ],
        takeawaysEn: [],
        takeawaysKm: [],
        relatedIds: ["bk-rocks", "bk-history"],
      }));

    // Avoid duplicates
    const existingIds = new Set(BASIC_KNOWLEDGE_ARTICLES.map((a) => a.id));
    const filteredExtra = extraArticles.filter((a) => !existingIds.has(a.id));

    return [...BASIC_KNOWLEDGE_ARTICLES, ...filteredExtra];
  }, [publicPosts]);

  const filteredArticles = useMemo(() => {
    return combinedArticles.filter((article) => {
      const matchCat =
        selectedCategory === "all" || article.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        [
          article.titleEn,
          article.titleKm,
          article.excerptEn,
          article.excerptKm,
          article.category,
          article.categoryKm,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim());
      return matchCat && matchQuery;
    });
  }, [combinedArticles, selectedCategory, searchQuery]);

  // ==========================================
  // VIEW 1: EXACT POST VIEW (When ?id= is given)
  // ==========================================
  if (articleId) {
    if (loadingSupabase) {
      return (
        <Container>
          <div className="flex min-h-[50vh] flex-col items-center justify-center p-12 text-slate-500">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent mb-4" />
            <p className="text-sm font-medium">
              {lang === "km" ? "កំពុងផ្ទុកអត្ថបទចំណេះដឹង…" : "Loading knowledge guide…"}
            </p>
          </div>
        </Container>
      );
    }

    // Render Curated Article
    if (curatedArticle) {
      const title = lang === "km" ? curatedArticle.titleKm : curatedArticle.titleEn;
      const excerpt = lang === "km" ? curatedArticle.excerptKm : curatedArticle.excerptEn;
      const cat = lang === "km" ? curatedArticle.categoryKm : curatedArticle.category;
      const author = lang === "km" ? curatedArticle.authorKm : curatedArticle.authorEn;
      const tag = lang === "km" ? curatedArticle.tagKm : curatedArticle.tagEn;

      // Related articles for right sidebar
      const relatedArticles = curatedArticle.relatedIds
        .map((id) => getKnowledgeArticleByIdOrSlug(id))
        .filter((a): a is KnowledgeArticle => Boolean(a));

      return (
        <>
          <PageHeader
            eyebrow={lang === "km" ? "ចំណេះដឹងមូលដ្ឋានភូគព្ភសាស្ត្រ" : "Geoscience Basic Knowledge"}
            title={title}
          />

          <Container>
            {/* Top Navigation & Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/80">
              <Link
                to="/basic-knowledge"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm transition group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                <span>{lang === "km" ? "ត្រឡប់ទៅបញ្ជីចំណេះដឹងមូលដ្ឋាន" : "Back to Basic Knowledge"}</span>
              </Link>

              <div className="flex items-center gap-2.5">
                {admin && (
                  <Link
                    to={`/admin?tab=posts&edit=${encodeURIComponent(curatedArticle.id)}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-700 transition"
                  >
                    <Edit size={13} />
                    <span>{lang === "km" ? "កែសម្រួលអត្ថបទ" : "Edit Post"}</span>
                  </Link>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                  <Bookmark size={12} />
                  <span>{tag}</span>
                </span>
              </div>
            </div>

            {/* 3-Column Reading Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_280px] gap-8 items-start mb-16">
              
              {/* LEFT COLUMN: Frameless Table of Contents */}
              <aside className="hidden lg:block sticky top-24 space-y-4 text-sm pr-2">
                <div className="pb-2 border-b border-slate-200/60">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    {lang === "km" ? "មាតិកា៖" : "Content:"}
                  </span>
                </div>
                <nav className="space-y-1.5" aria-label="Table of contents">
                  <a
                    href="#sec-intro"
                    className="block text-slate-700 hover:text-blue-600 hover:underline py-1 font-medium transition"
                  >
                    1. {lang === "km" ? "សេចក្តីផ្តើម" : "Introduction"}
                  </a>
                  {curatedArticle.sections.map((sec, idx) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="block text-slate-700 hover:text-blue-600 hover:underline py-1 font-medium transition line-clamp-2"
                    >
                      {idx + 2}. {lang === "km" ? sec.headingKm : sec.headingEn}
                    </a>
                  ))}
                  {curatedArticle.takeawaysEn.length > 0 && (
                    <a
                      href="#sec-takeaways"
                      className="block text-slate-700 hover:text-blue-600 hover:underline py-1 font-medium transition"
                    >
                      {curatedArticle.sections.length + 2}. {lang === "km" ? "ចំណុចសំខាន់ៗ" : "Key Takeaways"}
                    </a>
                  )}
                </nav>
              </aside>

              {/* CENTER COLUMN: Full Article Canvas */}
              <article className="min-w-0 space-y-8">
                {/* Meta Header */}
                <div id="sec-intro" className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 font-bold text-blue-700">
                      {cat}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {curatedArticle.readTime}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {curatedArticle.date}
                    </span>
                    <span>·</span>
                    <span>{author}</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {title}
                  </h1>

                  {/* Excerpt Lead Box */}
                  <div className="rounded-2xl border-l-4 border-blue-600 bg-blue-50/70 p-5 text-slate-800 text-sm sm:text-base leading-relaxed">
                    <p className="font-medium">{excerpt}</p>
                  </div>
                </div>

                {/* Hero Cover Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-md">
                  <img
                    src={curatedArticle.image}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                </div>

                {/* PDF Report Download Box */}
                {curatedArticle.document && (
                  <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50/90 to-indigo-50/80 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                          <FileText size={12} /> PDF Report
                        </span>
                        <span className="text-xs font-mono font-bold text-blue-800">
                          {curatedArticle.document.size}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                        {lang === "km"
                          ? curatedArticle.document.titleKm
                          : curatedArticle.document.titleEn}
                      </h3>
                      {(curatedArticle.document.descriptionKm ||
                        curatedArticle.document.descriptionEn) && (
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {lang === "km"
                            ? curatedArticle.document.descriptionKm
                            : curatedArticle.document.descriptionEn}
                        </p>
                      )}
                    </div>

                    <a
                      href={curatedArticle.document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={curatedArticle.document.filename}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition active:scale-95"
                    >
                      <Download size={16} />
                      <span>{lang === "km" ? "ទាញយកឯកសារ PDF" : "Download PDF Atlas"}</span>
                    </a>
                  </div>
                )}

                {/* Narrative Sections */}
                <div className="space-y-8 text-slate-800 text-sm sm:text-base leading-relaxed">
                  {curatedArticle.sections.map((sec) => {
                    const heading = lang === "km" ? sec.headingKm : sec.headingEn;
                    const content = lang === "km" ? sec.contentKm : sec.contentEn;
                    const bullets = lang === "km" ? sec.bulletsKm : sec.bulletsEn;
                    const callout = lang === "km" ? sec.calloutKm : sec.calloutEn;

                    return (
                      <section key={sec.id} id={sec.id} className="space-y-4 pt-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                          {heading}
                        </h2>

                        <p className="text-slate-700 leading-relaxed">{content}</p>

                        {bullets && bullets.length > 0 && (
                          <ul className="space-y-2 pl-5 list-disc text-slate-700">
                            {bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        )}

                        {callout && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs sm:text-sm text-amber-900">
                            <span className="font-bold block mb-1">
                              {lang === "km" ? "💡 ចំណាំសំខាន់៖" : "💡 Field Insight:"}
                            </span>
                            {callout}
                          </div>
                        )}

                        {sec.image && (
                          <figure className="my-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 sm:p-3 text-center">
                            <img
                              src={sec.image}
                              alt={lang === "km" ? sec.imageCaptionKm || "" : sec.imageCaptionEn || ""}
                              className="w-full max-h-[500px] object-contain rounded-xl bg-white mx-auto"
                              loading="lazy"
                            />
                            {(sec.imageCaptionKm || sec.imageCaptionEn) && (
                              <figcaption className="mt-2 text-xs text-slate-600 italic px-2">
                                {lang === "km" ? sec.imageCaptionKm : sec.imageCaptionEn}
                              </figcaption>
                            )}
                          </figure>
                        )}
                      </section>
                    );
                  })}
                </div>

                {/* Key Takeaways */}
                {curatedArticle.takeawaysEn.length > 0 && (
                  <section
                    id="sec-takeaways"
                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 space-y-4"
                  >
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-emerald-600" />
                      <span>{lang === "km" ? "ចំណុចសំខាន់ៗដែលត្រូវចងចាំ" : "Key Takeaways"}</span>
                    </h3>

                    <ul className="space-y-2.5">
                      {(lang === "km" ? curatedArticle.takeawaysKm : curatedArticle.takeawaysEn).map(
                        (item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </section>
                )}

                {/* Bottom Navigation */}
                <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <Link
                    to="/basic-knowledge"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                  >
                    <ArrowLeft size={14} />
                    <span>{lang === "km" ? "ត្រឡប់ទៅបញ្ជីចំណេះដឹងទាំងអស់" : "Back to All Knowledge Guides"}</span>
                  </Link>

                  <span className="text-xs text-slate-400">
                    GeoCam Cambodia Geoscience Knowledge Base
                  </span>
                </div>
              </article>

              {/* RIGHT COLUMN: Sticky Related Posts Panel */}
              <aside className="sticky top-24 space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                    <BookOpen size={16} className="text-blue-600" />
                    <h4 className="font-bold text-sm text-slate-900">
                      {lang === "km" ? "អត្ថបទដែលទាក់ទង" : "Related Posts"}
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {relatedArticles.map((rel) => {
                      const relTitle = lang === "km" ? rel.titleKm : rel.titleEn;
                      return (
                        <Link
                          key={rel.id}
                          to={`/basic-knowledge?id=${rel.id}`}
                          className="group block space-y-2 rounded-xl p-2 transition hover:bg-slate-50"
                        >
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-slate-100">
                            <img
                              src={rel.image}
                              alt={relTitle}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                            <span className="absolute bottom-1.5 left-1.5 rounded-sm bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                              {lang === "km" ? rel.categoryKm : rel.category}
                            </span>
                          </div>

                          <h5 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                            {relTitle}
                          </h5>

                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock size={10} /> {rel.readTime}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </aside>

            </div>
          </Container>
        </>
      );
    }

    // Render Supabase User-Published Post
    if (supabasePost) {
      const title = postText(supabasePost.titleEn, supabasePost.titleKm, lang);
      const summary = postText(supabasePost.summaryEn, supabasePost.summaryKm, lang);
      const bodyHtml = postBody(supabasePost.bodyEn, supabasePost.bodyKm, lang);

      return (
        <>
          <PageHeader
            eyebrow={lang === "km" ? "ចំណេះដឹងមូលដ្ឋានភូគព្ភសាស្ត្រ" : "Geoscience Basic Knowledge"}
            title={title}
          />

          <Container>
            {/* Top Navigation & Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/80">
              <Link
                to="/basic-knowledge"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm transition group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                <span>{lang === "km" ? "ត្រឡប់ទៅបញ្ជីចំណេះដឹងមូលដ្ឋាន" : "Back to Basic Knowledge"}</span>
              </Link>

              {admin && (
                <Link
                  to={`/admin?tab=posts&edit=${encodeURIComponent(supabasePost.id)}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-700 transition"
                >
                  <Edit size={13} />
                  <span>{lang === "km" ? "កែសម្រួលអត្ថបទ" : "Edit Post"}</span>
                </Link>
              )}
            </div>

            {/* 3-Column Reading Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_280px] gap-8 items-start mb-16">
              
              {/* LEFT COLUMN: Table of Contents */}
              <aside className="hidden lg:block sticky top-24 space-y-4 text-sm pr-2">
                <div className="pb-2 border-b border-slate-200/60">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    {lang === "km" ? "មាតិកា៖" : "Content:"}
                  </span>
                </div>
                <nav className="space-y-1.5" aria-label="Table of contents">
                  <a
                    href="#post-top"
                    className="block text-slate-700 hover:text-blue-600 hover:underline py-1 font-medium transition"
                  >
                    1. {lang === "km" ? "សេចក្តីផ្តើម" : "Introduction"}
                  </a>
                  <a
                    href="#post-body"
                    className="block text-slate-700 hover:text-blue-600 hover:underline py-1 font-medium transition"
                  >
                    2. {lang === "km" ? "ខ្លឹមសារអត្ថបទ" : "Full Content"}
                  </a>
                </nav>
              </aside>

              {/* CENTER COLUMN: Full Article Canvas */}
              <article className="min-w-0 space-y-8">
                <div id="post-top" className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 font-bold text-blue-700">
                      {supabasePost.category || "Basic Knowledge"}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />{" "}
                      {new Date(supabasePost.createdAt).toLocaleDateString(
                        lang === "km" ? "km-KH" : "en-GB"
                      )}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {title}
                  </h1>

                  {summary && (
                    <div className="rounded-2xl border-l-4 border-blue-600 bg-blue-50/70 p-5 text-slate-800 text-sm sm:text-base leading-relaxed">
                      <p className="font-medium">{summary}</p>
                    </div>
                  )}
                </div>

                {supabasePost.cover && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-md">
                    <img
                      src={safeCover(supabasePost.cover)}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div
                  id="post-body"
                  className="prose prose-slate max-w-none text-slate-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />

                <div className="pt-8 border-t border-slate-200">
                  <Link
                    to="/basic-knowledge"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                  >
                    <ArrowLeft size={14} />
                    <span>{lang === "km" ? "ត្រឡប់ទៅបញ្ជីចំណេះដឹងទាំងអស់" : "Back to All Knowledge Guides"}</span>
                  </Link>
                </div>
              </article>

              {/* RIGHT COLUMN: Other Guides */}
              <aside className="sticky top-24 space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                    <BookOpen size={16} className="text-blue-600" />
                    <h4 className="font-bold text-sm text-slate-900">
                      {lang === "km" ? "អត្ថបទដែលទាក់ទង" : "Related Posts"}
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {BASIC_KNOWLEDGE_ARTICLES.slice(0, 3).map((rel) => {
                      const relTitle = lang === "km" ? rel.titleKm : rel.titleEn;
                      return (
                        <Link
                          key={rel.id}
                          to={`/basic-knowledge?id=${rel.id}`}
                          className="group block space-y-2 rounded-xl p-2 transition hover:bg-slate-50"
                        >
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-slate-100">
                            <img
                              src={rel.image}
                              alt={relTitle}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          </div>
                          <h5 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                            {relTitle}
                          </h5>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </aside>

            </div>
          </Container>
        </>
      );
    }

    // Article Not Found
    return (
      <Container>
        <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center my-12">
          <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {lang === "km" ? "រកមិនឃើញអត្ថបទដែលអ្នកចង់អាន" : "Knowledge Guide Not Found"}
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            {lang === "km"
              ? "អត្ថបទនេះប្រហែលជាត្រូវបានផ្លាស់ប្តូរទីតាំង ឬមិនទាន់ត្រូវបានផ្សព្វផ្សាយនៅឡើយទេ។"
              : "The requested article could not be located. It may have been relocated or unpublished."}
          </p>
          <Link
            to="/basic-knowledge"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
          >
            <ArrowLeft size={14} />
            <span>{lang === "km" ? "ត្រឡប់ទៅបញ្ជីចំណេះដឹងមូលដ្ឋាន" : "Back to Basic Knowledge Directory"}</span>
          </Link>
        </div>
      </Container>
    );
  }

  // ==========================================
  // VIEW 2: CATALOG DIRECTORY (When no ?id=)
  // ==========================================
  return (
    <>
      <PageHeader
        eyebrow={lang === "km" ? "ចំណេះដឹង និងការស្រាវជ្រាវ" : "Knowledge & Research"}
        title={lang === "km" ? "ចំណេះដឹងមូលដ្ឋានភូគព្ភសាស្ត្រ" : "Geoscience Basic Knowledge"}
        sub={
          lang === "km"
            ? "មគ្គុទ្ទេសក៍សិក្សា និងការយល់ដឹងជាមូលដ្ឋានអំពីភូគព្ភសាស្ត្រ ធនធានរ៉ែ ថ្ម ទឹកក្រោមដី និងបរិស្ថានផែនដីនៃប្រទេសកម្ពុជា។"
            : "Foundational guides, field insights, and core educational topics covering Cambodia's geology, mineral systems, rock classifications, and earth systems."
        }
      />

      <Container>
        {/* Admin Quick Action Button */}
        {admin && (
          <div className="mb-6 flex justify-end">
            <Link
              to="/admin?tab=posts&new=1&category=Basic%20Knowledge"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <PlusCircle size={15} />
              <span>{lang === "km" ? "បង្កើតអត្ថបទចំណេះដឹងថ្មី" : "Create New Knowledge Post"}</span>
            </Link>
          </div>
        )}

        {/* Search & Category Filter Toolbar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "km" ? "ស្វែងរកអត្ថបទ..." : "Search articles..."}
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-800 shadow-2xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categoryTabs.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/70"
                  }`}
                >
                  {lang === "km" ? cat.km : cat.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-xs font-semibold text-slate-500 mb-6">
          {lang === "km" ? "បង្ហាញលទ្ធផល៖" : "Showing"}{" "}
          <span className="text-blue-600 font-bold">{filteredArticles.length}</span>{" "}
          {lang === "km" ? "អត្ថបទ" : "articles"}
        </p>

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {filteredArticles.map((article) => {
            const title = lang === "km" ? article.titleKm : article.titleEn;
            const excerpt = lang === "km" ? article.excerptKm : article.excerptEn;
            const cat = lang === "km" ? article.categoryKm : article.category;
            const articleUrl = `/basic-knowledge?id=${article.id}`;

            return (
              <article
                key={article.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  {/* Thumbnail */}
                  <Link
                    to={articleUrl}
                    className="relative block aspect-[16/10] w-full overflow-hidden bg-slate-100"
                  >
                    <img
                      src={article.image}
                      alt={title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
                      {cat}
                    </span>
                  </Link>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {article.readTime}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {article.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                      <Link to={articleUrl}>{title}</Link>
                    </h3>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="border-t border-slate-100 p-5 pt-3">
                  <Link
                    to={articleUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700"
                  >
                    <span>{lang === "km" ? "អានអត្ថបទលម្អិត" : "Read full article"}</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredArticles.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center my-8">
            <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
            <h4 className="text-base font-bold text-slate-700">
              {lang === "km" ? "រកមិនឃើញអត្ថបទដែលត្រូវគ្នា" : "No articles found"}
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              {lang === "km"
                ? "សូមសាកល្បងជ្រើសរើសប្រភេទផ្សេង ឬស្វែងរកពាក្យផ្សេង"
                : "Try selecting a different category or clearing search query."}
            </p>
          </div>
        )}
      </Container>
    </>
  );
}
