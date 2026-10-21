import { useEffect, useState } from "react";
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
    return () => {
      alive = false;
    };
  }, [id]);
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-12">
      <Link to="/news" className="text-accent">
        ← {lang === "km" ? "ត្រឡប់ទៅព័ត៌មាន" : "Back to news"}
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
        <article
          className="mt-6 rounded-xl border bg-white p-6 shadow-sm md:p-12"
          lang={lang}
        >
          <p className="text-sm text-accent">
            {post.category} ·{" "}
            {new Date(post.createdAt).toLocaleDateString(
              lang === "km" ? "km-KH" : "en-GB",
            )}
          </p>
          <h1 className="mt-3 text-4xl font-bold">
            {postText(post.titleEn, post.titleKm, lang)}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {postText(post.summaryEn, post.summaryKm, lang)}
          </p>
          {safeCover(post.cover) && (
            <img
              src={safeCover(post.cover)}
              alt=""
              className="mt-6 max-h-[480px] w-full rounded object-cover"
            />
          )}
          <div
            className="geocam-article-body mt-8"
            dangerouslySetInnerHTML={{
              __html: postBody(post.bodyEn, post.bodyKm, lang),
            }}
          />
        </article>
      )}
    </section>
  );
}
