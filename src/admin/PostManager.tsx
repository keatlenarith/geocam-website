import { useEffect, useRef, useState } from "react";
import {
  cleanPostHtml,
  deletePost,
  fetchPostDrafts,
  newPost,
  safeCover,
  savePost,
  unpublishPost,
  type Post,
} from "./posts";

const button =
  "rounded border px-4 py-2 text-sm font-semibold disabled:opacity-50";
const field = "mt-1 w-full rounded border bg-white p-3 text-slate-900";
export default function PostManager() {
  const [posts, setPosts] = useState<Post[]>([]),
    [post, setPost] = useState<Post | null>(null),
    [baseline, setBaseline] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [pending, setPending] = useState<null | (() => void)>(null),
    [preview, setPreview] = useState(false),
    [loading, setLoading] = useState(true);
  const mounted = useRef(true),
    dialogRef = useRef<HTMLDivElement>(null),
    previousFocus = useRef<HTMLElement | null>(null);
  const dirty = !!post && JSON.stringify(post) !== baseline;
  const state = useRef({ dirty, busy, post });
  state.current = { dirty, busy, post };
  async function refresh() {
    const rows = await fetchPostDrafts();
    if (mounted.current) setPosts(rows);
  }
  useEffect(() => {
    mounted.current = true;
    refresh()
      .catch((e) => {
        if (mounted.current) setError(e.message || "Could not load posts.");
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });
    return () => {
      mounted.current = false;
    };
  }, []);
  function guard(action: () => void) {
    if (state.current.busy) return;
    if (state.current.dirty) setPending(() => action);
    else action();
  }
  useEffect(() => {
    const unload = (e: BeforeUnloadEvent) => {
      if (state.current.dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    const click = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const anchor = (e.target as Element).closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;
      if (!state.current.dirty && !state.current.busy) return;
      e.preventDefault();
      e.stopPropagation();
      if (!state.current.busy)
        setPending(() => () => window.location.assign(anchor.href));
    };
    const request = (e: Event) => {
      const action = (e as CustomEvent<{ proceed: () => void }>).detail
        ?.proceed;
      if (action) {
        e.preventDefault();
        guard(action);
      }
    };
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", click, true);
    window.addEventListener("geocam:request-navigation", request);
    return () => {
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", click, true);
      window.removeEventListener("geocam:request-navigation", request);
    };
  }, []);
  useEffect(() => {
    if (!pending) return;
    previousFocus.current = document.activeElement as HTMLElement;
    dialogRef.current?.focus();
    return () => previousFocus.current?.focus();
  }, [pending]);
  function edit(next: Post | null) {
    guard(() => {
      setPost(next);
      setBaseline(next ? JSON.stringify(next) : "");
      setPreview(false);
      setMessage("");
      setError("");
    });
  }
  async function persist(publish: boolean) {
    if (!post) return false;
    if (!post.titleEn.trim()) {
      setError("Add an English title before saving or publishing.");
      return false;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const saved = await savePost(post, publish);
      if (!mounted.current) return false;
      state.current.dirty = false;
      setPost(saved);
      setBaseline(JSON.stringify(saved));
      setPosts((rows) => [saved, ...rows.filter((row) => row.id !== saved.id)]);
      setMessage(
        publish
          ? "Post published."
          : "Draft saved. The public version changes only when you publish.",
      );
      return true;
    } catch (e) {
      if (mounted.current)
        setError(
          e instanceof Error
            ? e.message
            : "Could not save. Your edits are still here.",
        );
      return false;
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  async function remove(item: Post) {
    if (
      !window.confirm(
        `Delete “${item.titleEn || item.titleKm || "Untitled"}” and its public version?`,
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      await deletePost(item.id);
      if (mounted.current) {
        setPosts((rows) => rows.filter((row) => row.id !== item.id));
        setMessage("Post deleted.");
      }
    } catch (e) {
      if (mounted.current)
        setError(e instanceof Error ? e.message : "Could not delete post.");
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  async function unpublish() {
    if (!post) return;
    setBusy(true);
    setError("");
    try {
      await unpublishPost(post.id);
      if (mounted.current) {
        const next = { ...post, status: "draft" as const };
        setPost(next);
        setBaseline(JSON.stringify(next));
        await refresh();
        setMessage("Post unpublished.");
      }
    } catch (e) {
      if (mounted.current)
        setError(e instanceof Error ? e.message : "Could not unpublish.");
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  const update = (key: keyof Post, value: string) =>
    setPost((current) => {
      if (!current) return null;
      const next = { ...current, [key]: value };
      if (current[key] !== value) {
        if (key === "titleEn") next.titleKm = "";
        if (key === "summaryEn") next.summaryKm = "";
        if (key === "bodyEn") next.bodyKm = "";
      }
      return next;
    });
  return (
    <section className="space-y-5" aria-label="Post management">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">{post ? "Edit post" : "Posts"}</h2>
          <p className="text-sm text-slate-500">
            English is the source. Editing English clears the matching Khmer
            override. Known catalog phrases translate automatically; new prose
            needs a Khmer translation. Publishing makes a public version.
          </p>
        </div>
        <button
          className={button}
          disabled={busy}
          onClick={() => edit(newPost())}
        >
          New post
        </button>
      </div>
      {error && (
        <p role="alert" className="rounded bg-red-50 p-3 text-red-800">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="rounded bg-green-50 p-3 text-green-800">
          {message}
        </p>
      )}
      {!post ? (
        <>
          {loading ? (
            <p role="status">Loading posts…</p>
          ) : !posts.length ? (
            <p>No posts yet. Create your first post.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-3 font-semibold">
                        {item.titleEn || item.titleKm || "Untitled"}
                      </td>
                      <td>{item.type}</td>
                      <td>{item.status}</td>
                      <td>{new Date(item.updatedAt).toLocaleString()}</td>
                      <td className="space-x-3">
                        <button disabled={busy} onClick={() => edit(item)}>
                          Edit
                        </button>
                        {item.status === "published" && (
                          <a
                            href={
                              "/articles/read?id=" + encodeURIComponent(item.id)
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            View
                          </a>
                        )}
                        <button
                          className="text-red-700"
                          disabled={busy}
                          onClick={() => remove(item)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              className={button}
              disabled={busy}
              onClick={() => edit(null)}
            >
              ← All posts
            </button>
            <button
              className={button}
              disabled={busy}
              onClick={() => persist(false)}
            >
              Save draft
            </button>
            <button
              className={button + " bg-blue-700 text-white"}
              disabled={busy}
              onClick={() => persist(true)}
            >
              {busy ? "Saving…" : "Publish"}
            </button>
            <button className={button} onClick={() => setPreview(!preview)}>
              {preview ? "Edit content" : "Preview"}
            </button>
            {post.status === "published" && (
              <button
                className={button}
                disabled={busy || dirty}
                onClick={unpublish}
              >
                Unpublish
              </button>
            )}
            <span className="self-center text-sm text-slate-500">
              {dirty ? "Unsaved changes" : "Saved"} · {post.status}
            </span>
          </div>
          {preview ? (
            <article className="rounded border bg-white p-6">
              {safeCover(post.cover) && (
                <img
                  src={safeCover(post.cover)}
                  alt=""
                  className="mb-5 max-h-72"
                />
              )}
              {(["En", "Km"] as const).map((language) => (
                <div key={language} lang={language === "Km" ? "km" : "en"}>
                  <h3 className="my-3 text-2xl font-bold">
                    {post[`title${language}`]}
                  </h3>
                  <p>{post[`summary${language}`]}</p>
                  <div
                    className="geocam-article-body my-5"
                    dangerouslySetInnerHTML={{
                      __html: cleanPostHtml(post[`body${language}`]),
                    }}
                  />
                </div>
              ))}
            </article>
          ) : (
            <fieldset disabled={busy} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <label>
                  Type
                  <select
                    className={field}
                    value={post.type}
                    onChange={(e) => update("type", e.target.value)}
                  >
                    <option value="news">News</option>
                    <option value="page">Page</option>
                  </select>
                </label>
                <label>
                  Category
                  <input
                    className={field}
                    value={post.category}
                    onChange={(e) => update("category", e.target.value)}
                  />
                </label>
                <label>
                  Cover image URL
                  <input
                    type="url"
                    className={field}
                    placeholder="https://…"
                    value={post.cover}
                    onChange={(e) => update("cover", e.target.value)}
                  />
                </label>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {(["En", "Km"] as const).map((language) => (
                  <section
                    key={language}
                    className="space-y-4 rounded border bg-white p-4"
                    lang={language === "Km" ? "km" : "en"}
                  >
                    <h3 className="text-lg font-bold">
                      {language === "En" ? "English" : "Khmer / ភាសាខ្មែរ"}
                    </h3>
                    <label className="block">
                      Title
                      <input
                        className={field}
                        value={post[`title${language}`]}
                        onChange={(e) =>
                          update(`title${language}`, e.target.value)
                        }
                      />
                    </label>
                    <label className="block">
                      Summary
                      <textarea
                        className={field}
                        rows={3}
                        value={post[`summary${language}`]}
                        onChange={(e) =>
                          update(`summary${language}`, e.target.value)
                        }
                      />
                    </label>
                    <label className="block">
                      Body (HTML)
                      <textarea
                        className={field + " font-mono text-sm"}
                        rows={18}
                        value={post[`body${language}`]}
                        onChange={(e) =>
                          update(`body${language}`, e.target.value)
                        }
                        aria-describedby={"html-help-" + language}
                      />
                    </label>
                    <p
                      id={"html-help-" + language}
                      className="text-sm text-slate-500"
                    >
                      Use &lt;p&gt; for paragraphs, &lt;h2&gt; for headings,
                      &lt;strong&gt; for bold, &lt;em&gt; for italic,
                      &lt;ul&gt;&lt;li&gt; for lists, and &lt;a
                      href="https://…"&gt; for links. Select Preview to check
                      formatting.
                    </p>
                  </section>
                ))}
              </div>
            </fieldset>
          )}
        </>
      )}
      {pending && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="unsaved-title"
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
            onKeyDown={(e) => {
              if (e.key === "Escape" && !busy) setPending(null);
              if (e.key === "Tab") {
                const controls =
                  dialogRef.current?.querySelectorAll<HTMLButtonElement>(
                    "button:not(:disabled)",
                  );
                if (!controls?.length) return;
                const first = controls[0],
                  last = controls[controls.length - 1];
                if (
                  e.shiftKey &&
                  (document.activeElement === first ||
                    document.activeElement === dialogRef.current)
                ) {
                  e.preventDefault();
                  last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
          >
            <h3 id="unsaved-title" className="text-xl font-bold">
              Save your changes?
            </h3>
            {error && (
              <p role="alert" className="mt-3 text-red-800">
                {error}
              </p>
            )}
            <p className="my-4">
              Your post has unsaved changes. Save a draft before leaving,
              discard these changes, or keep editing.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                className={button + " bg-blue-700 text-white"}
                disabled={busy}
                onClick={async () => {
                  const action = pending;
                  if (await persist(false)) {
                    setPending(null);
                    action();
                  }
                }}
              >
                Save draft and leave
              </button>
              <button
                className={button}
                disabled={busy}
                onClick={() => {
                  const action = pending;
                  state.current.dirty = false;
                  setPending(null);
                  action();
                }}
              >
                Discard changes
              </button>
              <button
                className={button}
                disabled={busy}
                onClick={() => setPending(null)}
              >
                Keep editing
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
