import { useEffect, useState, useMemo } from "react";
import { useI18n } from "../lib/i18n";
import { Link } from "../lib/spa-router";
import { supabase } from "../lib/supabase";
import {
  postBody,
  postText,
  fetchPublishedPosts,
  safeCover,
  type Post,
} from "./posts";

export function PublishedPostCards() {
  const { lang } = useI18n();
  const [posts, setPosts] = useState<Post[]>([]),
    [error, setError] = useState(false),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    fetchPublishedPosts()
      .then((rows) => {
        if (alive) setPosts(rows.filter((row) => row.type === "news"));
      })
      .catch(() => {
        if (alive) setError(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);
  if (error)
    return (
      <p role="alert">
        {lang === "km"
          ? "មិនអាចផ្ទុកព័ត៌មានបានទេ។ សូមព្យាយាមម្ដងទៀត។"
          : "Could not load news. Please try again."}
      </p>
    );
  if (loading)
    return (
      <p role="status">{lang === "km" ? "កំពុងផ្ទុក…" : "Loading news…"}</p>
    );
  return (
    <>
      {posts.map((post) => (
        <Link
          key={post.id}
          to={"/articles/read?id=" + encodeURIComponent(post.id)}
          className="card-surface block overflow-hidden p-7 transition hover:shadow-lg"
        >
          <div className="relative mb-4 h-52 w-full overflow-hidden rounded-xl bg-slate-100">
            <img
              src={safeCover(post.cover) || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <span className="absolute top-2.5 left-2.5 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 backdrop-blur-md">
              {post.category || "Geoscience News"}
            </span>
          </div>
          <p className="text-xs font-semibold text-accent">
            {post.category} ·{" "}
            {new Date(post.createdAt).toLocaleDateString(
              lang === "km" ? "km-KH" : "en-GB",
            )}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {postText(post.titleEn, post.titleKm, lang)}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {postText(post.summaryEn, post.summaryKm, lang)}
          </p>
          <p className="mt-5 font-semibold text-accent">
            {lang === "km" ? "អានអត្ថបទ →" : "Read article →"}
          </p>
        </Link>
      ))}
    </>
  );
}

export default function PublicPostReader() {
  const { lang } = useI18n();
  const id = new URLSearchParams(location.search).get("id");
  const [post, setPost] = useState<Post | null>(null),
    [relatedPosts, setRelatedPosts] = useState<Post[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setPost(null);
    setError(false);
    if (!id) {
      setLoading(false);
      return;
    }
    supabase
      .from("geocam_post_public")
      .select("data")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error: failure }) => {
        if (!alive) return;
        if (failure) setError(true);
        else setPost((data?.data as Post) ?? null);
        setLoading(false);
      });

    // Also fetch related posts
    fetchPublishedPosts()
      .then((rows) => {
        if (alive) {
          setRelatedPosts(rows.filter((r) => r.id !== id).slice(0, 5));
        }
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [id]);

  // Extract headings from HTML body for TOC
  const headings = useMemo(() => {
    if (!post) return [];
    const html = postBody(post.bodyEn, post.bodyKm, lang);
    if (typeof DOMParser === "undefined") return [];
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const hElements = doc.querySelectorAll("h1, h2, h3");
      const list: Array<{ id: string; text: string }> = [];
      hElements.forEach((h, idx) => {
        const text = h.textContent?.trim();
        if (text) {
          list.push({ id: `heading-${idx + 1}`, text });
        }
      });
      return list;
    } catch {
      return [];
    }
  }, [post, lang]);

  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 py-10">
      <Link to="/news" className="text-accent text-sm font-semibold hover:underline inline-flex items-center gap-1 mb-6">
        ← {lang === "km" ? "ត្រឡប់ទៅព័ត៌មាន (Back to news)" : "Back to news"}
      </Link>

      {loading ? (
        <p className="mt-8" role="status">
          {lang === "km" ? "កំពុងផ្ទុក…" : "Loading article…"}
        </p>
      ) : error ? (
        <p role="alert" className="mt-8">
          {lang === "km"
            ? "មិនអាចផ្ទុកអត្ថបទបានទេ។"
            : "Could not load this article. Please try again."}
        </p>
      ) : !post ? (
        <h1 className="mt-8 text-3xl">
          {lang === "km" ? "រកមិនឃើញអត្ថបទ" : "Article not found"}
        </h1>
      ) : (
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
                href="#post-header"
                className="block text-slate-700 hover:text-blue-600 hover:underline py-1 font-medium transition"
              >
                1. {lang === "km" ? "សេចក្តីផ្តើម" : "Introduction"}
              </a>
              {headings.map((h, idx) => (
                <a
                  key={idx}
                  href={`#${h.id}`}
                  className="block text-slate-700 hover:text-blue-600 hover:underline py-1 font-medium transition line-clamp-2"
                >
                  {idx + 2}. {h.text}
                </a>
              ))}
              {headings.length === 0 && (
                <p className="text-xs text-slate-400 italic">
                  {lang === "km" ? "អត្ថបទពេញលេញ" : "Full narrative"}
                </p>
              )}
            </nav>
          </aside>

          {/* Center Column: Main Post Article */}
          <article
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 w-full overflow-hidden"
            lang={lang}
          >
            <div id="post-header" className="scroll-mt-24">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                {post.category || "Geoscience"}
              </span>
              <p className="mt-2 text-xs text-slate-500">
                {new Date(post.createdAt).toLocaleDateString(
                  lang === "km" ? "km-KH" : "en-GB",
                )}
              </p>
              <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                {postText(post.titleEn, post.titleKm, lang)}
              </h1>
              {post.summaryEn && (
                <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
                  {postText(post.summaryEn, post.summaryKm, lang)}
                </p>
              )}
            </div>

            {safeCover(post.cover) && (
              <figure className="my-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img
                  src={safeCover(post.cover)}
                  alt=""
                  className="max-h-[520px] w-full object-cover"
                />
              </figure>
            )}

            <div
              className="geocam-article-body mt-8 text-slate-800 leading-loose text-base md:text-lg"
              dangerouslySetInnerHTML={{
                __html: postBody(post.bodyEn, post.bodyKm, lang),
              }}
            />
          </article>

          {/* Right Column: Related Posts Panel */}
          <aside className="hidden xl:block sticky top-24 space-y-4 pl-2">
            <div className="pb-2 border-b border-slate-200/60">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                {lang === "km" ? "អត្ថបទពាក់ព័ន្ធ....." : "Related Post....."}
              </span>
            </div>
            <div className="space-y-3">
              {relatedPosts.map((r, rIdx) => (
                <Link
                  key={r.id}
                  to={`/articles/read?id=${encodeURIComponent(r.id)}`}
                  className="group block p-2.5 rounded-xl transition hover:bg-slate-50 border border-slate-100 bg-white shadow-2xs"
                >
                  {safeCover(r.cover) && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-slate-100 mb-2">
                      <img
                        src={safeCover(r.cover)}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute bottom-1.5 left-1.5 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                        {rIdx + 1}. {r.category || "News"}
                      </span>
                    </div>
                  )}
                  <h5 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                    {postText(r.titleEn, r.titleKm, lang)}
                  </h5>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                    {postText(r.summaryEn, r.summaryKm, lang)}
                  </p>
                </Link>
              ))}
              {relatedPosts.length === 0 && (
                <p className="text-xs text-slate-400 italic">
                  {lang === "km" ? "មិនទាន់មានអត្ថបទពាក់ព័ន្ធផ្សេងទៀតទេ" : "No other related posts"}
                </p>
              )}
            </div>
          </aside>

        </div>
      )}
    </section>
  );
}
