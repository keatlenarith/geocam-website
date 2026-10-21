import {
  updateLinkedField,
  linkedEntry,
  rebaseDraft,
  pageChanges,
} from "./linked-content";
import { attachInlineText } from "./inline-text";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from "react";
import { supabase } from "../lib/supabase";
import { useAdmin } from "../admin/Auth";
import { useI18n } from "../lib/i18n";
import { translateText, sourceText } from "../lib/translation";
import { stableKey, candidates } from "./dom-keys";
export type Entry = { kind: "text" | "image"; value: string };
export type Store = Record<string, Record<string, Entry>>;
type CMS = {
  draft: Store;
  published: Store;
  ready: boolean;
  dirty: boolean;
  busy: boolean;
  error: string;
  editing: boolean;
  setEditing: (b: boolean) => void;
  setEntry: (page: string, key: string, entry: Entry) => void;
  saveInline: (page: string, key: string, entry: Entry) => void;
  flushInline: () => Promise<boolean>;
  inlineStatus: string;
  clearPendingInline: () => void;
  refreshContent: () => Promise<void>;
  save: () => Promise<void>;
  publish: () => Promise<void>;
  restore: (value: Store) => void;
  version: number;
};
const Context = createContext<CMS | null>(null);
export function useCms() {
  const value = useContext(Context);
  if (!value) throw Error("CMS provider required");
  return value;
}
const PUBLISHED_CACHE_KEY = "geocam_published_site_content";

function getCachedPublished(): Store {
  try {
    const raw =
      typeof window !== "undefined"
        ? localStorage.getItem(PUBLISHED_CACHE_KEY)
        : null;
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function setCachedPublished(store: Store) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(PUBLISHED_CACHE_KEY, JSON.stringify(store));
    }
  } catch {}
}

export function VisualCmsProvider({ children }: { children: React.ReactNode }) {
  const { admin } = useAdmin();
  const [draft, setDraft] = useState<Store>({}),
    [published, setPublished] = useState<Store>(getCachedPublished);
  const draftRef = useRef<Store>({});
  const savedDraftRef = useRef<Store>({});
  const pendingInline = useRef(
    new Map<string, { page: string; key: string; entry: Entry }>(),
  );
  const runningInline = useRef<Promise<boolean> | null>(null);
  const generation = useRef(0);
  const [inlineStatus, setInlineStatus] = useState("");
  const [ready, setReady] = useState(false),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [editing, setEditing] = useState(false),
    [error, setError] = useState("");
  const flushInline = useCallback((): Promise<boolean> => {
    if (runningInline.current) return runningInline.current;
    const epoch = generation.current;
    const work = async () => {
      while (pendingInline.current.size) {
        const [id, item] = pendingInline.current.entries().next().value!;
        setInlineStatus("Saving changes…");

        // Canonical keyspace for images is always English
        const targetPage =
          item.entry.kind === "image"
            ? item.page.replace(/::(en|km)$/, "") + "::en"
            : item.page;

        let savedOk = false;
        let serverData: any = null;

        try {
          const { data, error } = await supabase.rpc("geocam_update_page_field", {
            p_page: targetPage,
            p_key: item.key,
            p_entry: item.entry,
          });

          if (generation.current !== epoch) return false;

          if (!error && data) {
            savedOk = true;
            serverData = data;
          } else if (error) {
            console.warn("geocam_update_page_field notice:", error.message || error);
            // If statement timeout or query cancellation occurs on large storage,
            // fall back immediately to fast atomic publication!
            const isTimeout =
              error.code === "57014" ||
              error.message?.toLowerCase().includes("timeout") ||
              error.message?.toLowerCase().includes("canceling statement");

            if (isTimeout) {
              setInlineStatus("Saving changes…");
              const base = targetPage.replace(/::(en|km)$/, "");
              const atomicChanges: Record<string, Record<string, Entry | null>> = {
                [targetPage]: { [item.key]: item.entry },
              };
              if (item.entry.kind === "image") {
                atomicChanges[base + "::km"] = { [item.key]: null };
              }
              const fallback = await supabase.rpc(
                "geocam_publish_page_changes",
                { p_changes: atomicChanges },
              );
              if (!fallback.error && fallback.data) {
                savedOk = true;
                setPublished(fallback.data as Store);
                setCachedPublished(fallback.data as Store);
              }
            }

            if (!savedOk) {
              if (
                error.code === "42501" ||
                error.message?.includes("Administrator access")
              ) {
                setInlineStatus(
                  "Administrator session expired. Please sign in again.",
                );
              } else {
                setInlineStatus(
                  "Unable to save changes. " +
                    (error.message ? `(${error.message}) ` : "") +
                    "Retry before leaving this page.",
                );
              }
              return false;
            }
          }
        } catch (err) {
          console.warn("Exception during save:", err);
          return false;
        }

        if (savedOk) {
          if (pendingInline.current.get(id) === item)
            pendingInline.current.delete(id);

          if (serverData) {
            setPublished(serverData.published as Store);
            const merged = rebaseDraft(
              serverData.draft as Store,
              savedDraftRef.current,
              draftRef.current,
            );
            savedDraftRef.current = serverData.draft as Store;
            draftRef.current = merged;
            setDraft(merged);
            if (!pendingInline.current.size)
              setDirty(
                JSON.stringify(draftRef.current) !==
                  JSON.stringify(serverData.draft),
              );
          }
        }
      }
      setInlineStatus("Changes saved automatically.");
      return true;
    };
    const promise = work().catch(() => {
      setInlineStatus(
        "Unable to save changes. Retry before leaving this page.",
      );
      return false;
    });
    runningInline.current = promise;
    void promise.finally(() => {
      if (runningInline.current === promise) runningInline.current = null;
    });
    return promise;
  }, []);
  const saveInline = useCallback(
    (page: string, key: string, entry: Entry) => {
      if (!admin || !ready) return;
      pendingInline.current.set(page + "\n" + key, { page, key, entry });
      void flushInline();
    },
    [admin, ready, flushInline],
  );
  const refreshContent = async () => {
    const live = await supabase
      .from("geocam_published")
      .select("content")
      .eq("id", "site")
      .single();
    if (live.error) throw live.error;
    const content = live.data.content as Store;
    setPublished(content);

    if (admin && content) {
      // Auto-prune duplicate ::km images that bloat PostgreSQL storage
      const pruneChanges: Record<string, Record<string, null>> = {};
      let needsPrune = false;
      for (const [pageKey, entries] of Object.entries(content)) {
        if (pageKey.endsWith("::km") && typeof entries === "object" && entries !== null) {
          for (const [fieldKey, fieldEntry] of Object.entries(entries)) {
            if (fieldEntry?.kind === "image") {
              if (!pruneChanges[pageKey]) pruneChanges[pageKey] = {};
              pruneChanges[pageKey][fieldKey] = null;
              needsPrune = true;
            }
          }
        }
      }
      if (needsPrune) {
        try {
          const res = await supabase.rpc("geocam_publish_page_changes", {
            p_changes: pruneChanges,
          });
          if (!res.error && res.data) {
            setPublished(res.data as Store);
            setCachedPublished(res.data as Store);
          }
        } catch {}
      }

      const saved = await supabase
        .from("geocam_drafts")
        .select("content")
        .eq("id", "site")
        .single();
      if (saved.error) throw saved.error;
      const merged = rebaseDraft(
        saved.data.content as Store,
        savedDraftRef.current,
        draftRef.current,
      );
      // Appearance has its own explicit save action; use its latest server values.
      merged.__appearance = saved.data.content.__appearance;
      savedDraftRef.current = saved.data.content as Store;
      draftRef.current = merged;
      setDraft(merged);
    }
  };
  useEffect(() => {
    let current = true;
    const load = async () => {
      const { data } = await supabase
        .from("geocam_published")
        .select("content")
        .eq("id", "site")
        .single();
      if (current && data?.content) {
        setPublished(data.content as Store);
        setCachedPublished(data.content as Store);
      }
    };
    void load();
    window.addEventListener("focus", load);
    return () => {
      current = false;
      window.removeEventListener("focus", load);
    };
  }, []);
  useEffect(() => {
    let current = true;
    generation.current++;
    pendingInline.current.clear();
    runningInline.current = null;
    setInlineStatus("");
    setReady(false);
    setEditing(false);
    draftRef.current = {};
    savedDraftRef.current = {};
    setDraft({});
    setDirty(false);
    setError("");
    if (admin)
      void supabase
        .from("geocam_drafts")
        .select("content")
        .eq("id", "site")
        .single()
        .then(({ data, error }) => {
          if (!current) return;
          if (error) {
            setError("Unable to load drafts. Reload before editing.");
            return;
          }
          draftRef.current = data.content as Store;
          savedDraftRef.current = data.content as Store;
          setDraft(data.content as Store);
          setReady(true);
        });
    return () => {
      current = false;
    };
  }, [admin]);
  const setEntry = useCallback(
    (page: string, key: string, entry: Entry) => {
      if (!admin || !ready || busy) return;
      const next = updateLinkedField(draftRef.current, page, key, entry);
      if (next === draftRef.current) return;
      draftRef.current = next;
      setDraft(next);
      setDirty(true);
    },
    [admin, ready, busy],
  );
  const write = async (publish: boolean) => {
    if (!admin || !ready || busy)
      throw Error("Administrator access and loaded drafts are required.");
    setBusy(true);
    setError("");
    try {
      const row = {
        id: "site",
        content: structuredClone(draftRef.current),
        updated_at: new Date().toISOString(),
      };
      const saved = await supabase.from("geocam_drafts").upsert(row);
      if (saved.error) throw saved.error;
      savedDraftRef.current = structuredClone(row.content);
      setDirty(false);
      if (publish) {
        // Atomic field patches preserve concurrent font approvals and unrelated edits.
        const result = await supabase.rpc("geocam_publish_page_changes", {
          p_changes: pageChanges(row.content, published),
        });
        if (result.error) throw result.error;
        setPublished(result.data as Store);
        setCachedPublished(result.data as Store);
        pendingInline.current.clear();
        setInlineStatus("Changes saved automatically.");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save. Please retry.";
      setError(message);
      throw Error(message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Context.Provider
      value={{
        draft,
        published,
        ready,
        dirty,
        busy,
        error,
        editing: admin && ready && editing,
        setEditing,
        setEntry,
        saveInline,
        flushInline,
        inlineStatus,
        clearPendingInline: () => {
          pendingInline.current.clear();
          setInlineStatus("");
        },
        refreshContent,
        save: () => write(false),
        publish: () => write(true),
        restore: (value) => {
          if (admin && ready && !busy) {
            draftRef.current = structuredClone(value);
            setDraft(draftRef.current);
            setDirty(true);
          }
        },
        version: 0,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const editablePages = [
  "/",
  "/about",
  "/research",
  "/publications",
  "/events",
  "/membership",
  "/geodata",
  "/environmental-monitoring",
  "/news",
  "/contact",
  "/geopark",
  "/mining",
  "/lexicon",
  "/dashboard",
];
const emptyContent: Store = {};
const originals = new WeakMap<
  Element,
  { en?: string; km?: string; rendered?: string }
>();
export const normalizeRoute = (path: string) => {
  const clean = path.split("?")[0].replace(/\/+$/, "");
  return clean || "/";
};

export const EMPTY_IMAGE_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

function optimizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxDim = 1000;
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
      resolve(canvas.toDataURL(mime, 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    };
    img.src = url;
  });
}

export function VisualCmsLayer({ page }: { page: string }) {
  const { admin } = useAdmin();
  const {
    draft,
    published,
    ready,
    busy,
    error,
    setEntry,
    saveInline,
    flushInline,
    inlineStatus,
    clearPendingInline,
    publish,
    editing,
    setEditing,
  } = useCms();
  const { lang } = useI18n();
  const normalizedPage = normalizeRoute(page);
  const editable = editablePages.includes(normalizedPage);
  const active = editable ? (editing ? draft : published) : emptyContent;
  const editingPage = editing && editable;
  const refresh = useRef(0);
  const [notice, setNotice] = useState("");
  useLayoutEffect(() => {
    const main = document.getElementById("main");
    if (!main || !editable || page.startsWith("/admin")) return;
    const keyspace = normalizedPage + "::" + lang;
    const apply = () => {
      for (const el of candidates(main)) {
        // Data-driven views must not freeze result counts or bind edits to a
        // different record after a filter changes. Only stable named fields.
        if (
          !["/", "/about", "/research", "/membership", "/contact"].includes(
            normalizedPage,
          ) &&
          !el.hasAttribute("data-cms-id")
        )
          continue;
        if (el.hasAttribute("data-cms-inline")) continue;
        const key = stableKey(el, main);
        const image =
          el.tagName === "IMG" || el.hasAttribute("data-cms-background");
        const record = originals.get(el) || {};
        const source = image
          ? el.tagName === "IMG"
            ? el.getAttribute("src") || ""
            : getComputedStyle(el).backgroundImage
          : sourceText(el);
        if (record.en === undefined && !/[\u1780-\u17ff]/.test(source))
          record.en = source;
        if (record[lang] === undefined)
          record[lang] =
            source === record.rendered && record.en !== undefined
              ? record.en
              : source;
        originals.set(el, record);
        const original = record[lang] || "";
        const entry = linkedEntry(active, normalizedPage, lang, key);
        const isObsoleteSvg =
          entry?.kind === "image" &&
          typeof entry.value === "string" &&
          entry.value.includes("/images/focus/") &&
          entry.value.endsWith(".svg");
        const value =
          !isObsoleteSvg && entry?.kind === (image ? "image" : "text")
            ? entry.value
            : !image && lang === "km"
              ? translateText(original)
              : original;
        if (el.hasAttribute("data-cms-background"))
          el.style.backgroundImage =
            entry?.kind === "image"
              ? `url(${JSON.stringify(value)})`
              : original;
        else if (el.tagName === "IMG") {
          const isRemoved =
            entry?.kind === "image" &&
            (!entry.value || entry.value === EMPTY_IMAGE_PLACEHOLDER);
          const displayValue = isRemoved
            ? "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23f1f5f9'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%2364748b'>+ Click to add image</text></svg>"
            : value;
          if (el.getAttribute("src") !== displayValue) el.setAttribute("src", displayValue);
          if (editingPage) {
            const parent = el.parentElement;
            if (parent && !parent.querySelector(`.geocam-img-remove-btn[data-key="${key}"]`)) {
              if (getComputedStyle(parent).position === "static") {
                parent.style.position = "relative";
              }
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = "geocam-img-remove-btn";
              btn.dataset.key = key;
              btn.title = "Remove photo";
              btn.textContent = "✕ Remove";
              parent.appendChild(btn);
            }
          }
        } else if (el.textContent !== value) el.textContent = value;
        record.rendered = value;
        el.dataset.cmsKey = key;
        el.classList.toggle("geocam-editable", editingPage);
      }
    };
    apply();
    const observer = new MutationObserver(() => {
      if (refresh.current) return;
      refresh.current = requestAnimationFrame(() => {
        refresh.current = 0;
        apply();
      });
    });
    observer.observe(main, { childList: true, subtree: true });
    const click = (event: MouseEvent) => {
      if (!editingPage || busy) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const removeBtn = target.closest<HTMLElement>(".geocam-img-remove-btn");
      if (removeBtn) {
        event.preventDefault();
        event.stopPropagation();
        const key = removeBtn.dataset.key;
        if (key) {
          const entry: Entry = {
            kind: "image",
            value: EMPTY_IMAGE_PLACEHOLDER,
          };
          const imageSpace = normalizedPage + "::en";
          setEntry(imageSpace, key, entry);
          saveInline(imageSpace, key, entry);
          setNotice("Photo removed. Click the placeholder to upload a new one.");
        }
        return;
      }

      const el = target.closest<HTMLElement>(
        "[data-cms-key], [data-cms-id], img, [data-cms-background]",
      );
      if (!el || !main.contains(el)) return;
      const key = el.dataset.cmsKey || el.getAttribute("data-cms-id") || stableKey(el, main);
      if (el.tagName === "IMG" || el.hasAttribute("data-cms-background")) {
        event.preventDefault();
        event.stopPropagation();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png,image/jpeg,image/webp,image/gif";
        input.onchange = () => {
          const file = input.files?.[0];
          if (!file) return;
          if (
            !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
              file.type,
            ) ||
            file.size > 2500000
          ) {
            setNotice("Choose a PNG, JPEG, WebP or GIF under 2.5 MB.");
            return;
          }
          optimizeImage(file)
            .then((dataUrl) => {
              const entry: Entry = {
                kind: "image",
                value: dataUrl,
              };
              const imageSpace = normalizedPage + "::en";
              setEntry(imageSpace, key, entry);
              saveInline(imageSpace, key, entry);
              setNotice(
                "Photo updated! Click 'Publish Live' to publish to all visitors.",
              );
            })
            .catch(() => {
              setNotice("Unable to read image file.");
            });
        };
        input.click();
      }
    };
    main.addEventListener("click", click, true);
    return () => {
      observer.disconnect();
      if (refresh.current) {
        cancelAnimationFrame(refresh.current);
        refresh.current = 0;
      }
      main.removeEventListener("click", click, true);
      main
        .querySelectorAll(".geocam-editable")
        .forEach((el) => el.classList.remove("geocam-editable"));
      main
        .querySelectorAll(".geocam-img-remove-btn")
        .forEach((el) => el.remove());
    };
  }, [normalizedPage, lang, active, editingPage, busy, setEntry, saveInline]);
  useLayoutEffect(() => {
    const main = document.getElementById("main");
    if (!main || !editingPage || busy) return;
    return attachInlineText(main, {
      commit: (key, value) => {
        setNotice("");
        setEntry(normalizedPage + "::" + lang, key, { kind: "text", value });
        setEntry(normalizedPage + "::" + (lang === "en" ? "km" : "en"), key, {
          kind: "text",
          value: lang === "en" ? translateText(value) || value : value,
        });
        setEntry(normalizedPage, key, { kind: "text", value });
      },
      complete: (key, value) =>
        saveInline(normalizedPage + "::" + lang, key, { kind: "text", value }),
    });
  }, [normalizedPage, lang, editingPage, busy, setEntry, saveInline]);
  useEffect(() => {
    if (!editingPage) return;
    // Navigation lock: while editing mode is active, prevent all link clicks and double clicks from navigating away.
    const lockNavigation = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      if (target.closest("[data-cms-ui]")) return;

      const isEditable = target.closest(
        "[data-cms-key], [data-cms-id], img, [data-cms-background], .geocam-editable, .geocam-img-remove-btn",
      );
      const anchor = target.closest("a[href]");
      if (anchor) {
        event.preventDefault();
        if (isEditable) {
          return;
        }
        event.stopPropagation();
        (document.activeElement as HTMLElement)?.blur();
        setNotice(
          "Editing mode active: Link navigation is locked. Click 'Finish editing' to browse other pages.",
        );
      }
    };
    const blockDblClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      if (target.closest("[data-cms-ui]")) return;
      if (
        target.closest(
          "[data-cms-key], [data-cms-id], img, .geocam-editable, .geocam-img-remove-btn",
        )
      )
        return;
      const anchor = target.closest("a[href]");
      if (anchor) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", lockNavigation, true);
    document.addEventListener("auxclick", lockNavigation, true);
    document.addEventListener("dblclick", blockDblClick, true);
    return () => {
      document.removeEventListener("click", lockNavigation, true);
      document.removeEventListener("auxclick", lockNavigation, true);
      document.removeEventListener("dblclick", blockDblClick, true);
    };
  }, [editingPage]);
  if (!admin || page.startsWith("/admin") || page.startsWith("/wp-admin")) return null;

  const queryParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const queryId = queryParams.get("id");
  const isNewsItem = normalizedPage === "/news/item";
  const isPubView = normalizedPage === "/publications/view";
  const isResearchTopic = normalizedPage === "/research/topic";

  return (
    <div
      data-cms-ui
      className="fixed bottom-5 right-5 z-[2000] max-w-[calc(100vw-2rem)] rounded-xl border bg-white p-3 shadow-2xl text-sm"
    >
      <div className="flex flex-wrap items-center gap-2">
        <a
          className="btn btn-outline !py-2"
          href="/admin/cms"
          onClick={async (e) => {
            (document.activeElement as HTMLElement)?.blur();
            const ok = await flushInline();
            if (!ok && !window.confirm("Some changes could not be saved. Open Dashboard anyway?")) {
              e.preventDefault();
            }
          }}
        >
          Dashboard
        </a>

        {editable ? (
          <>
            <button
              className={`btn !py-2 font-semibold ${editing ? "btn-secondary bg-slate-800 text-white" : "btn-primary"}`}
              disabled={!ready || busy}
              onClick={() => {
                (document.activeElement as HTMLElement)?.blur();
                setNotice("");
                setEditing(!editing);
              }}
            >
              {editing ? "Finish editing" : "Visual edit"}
            </button>
            {editingPage && (
              <button
                className="btn !py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                disabled={!ready || busy}
                onClick={async () => {
                  (document.activeElement as HTMLElement)?.blur();
                  setNotice("Publishing changes live to website…");
                  try {
                    await publish();
                    clearPendingInline();
                    setNotice("Published live! All visitors see these changes now.");
                  } catch (err) {
                    setNotice(
                      err instanceof Error
                        ? err.message
                        : "Publication failed. Please retry.",
                    );
                  }
                }}
              >
                Publish Live
              </button>
            )}
          </>
        ) : isNewsItem ? (
          <>
            {queryId ? (
              <a
                className="btn !py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                href={`/admin?section=posts&edit=${encodeURIComponent(queryId)}`}
              >
                ✏️ Edit this Post
              </a>
            ) : null}
            <a
              className="btn btn-outline !py-2"
              href="/admin?section=posts&new=1"
            >
              + New Post
            </a>
            <button
              className="btn !py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              disabled={!ready || busy}
              onClick={async () => {
                (document.activeElement as HTMLElement)?.blur();
                setNotice("Publishing changes live to website…");
                try {
                  await publish();
                  clearPendingInline();
                  setNotice("Published live! All visitors see these changes now.");
                } catch (err) {
                  setNotice(
                    err instanceof Error
                      ? err.message
                      : "Publication failed. Please retry.",
                  );
                }
              }}
            >
              Publish Live
            </button>
          </>
        ) : isPubView ? (
          <>
            <a
              className="btn !py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              href="/admin?section=publications"
            >
              ✏️ Edit in Admin
            </a>
            <a
              className="btn btn-outline !py-2"
              href="/admin?section=publications"
            >
              + New Paper
            </a>
          </>
        ) : isResearchTopic ? (
          <>
            <a
              className="btn !py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              href="/admin?section=pages&page=/research"
            >
              ✏️ Edit Research
            </a>
          </>
        ) : (
          <>
            <a
              className="btn !py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              href={`/admin?section=pages&page=${encodeURIComponent(normalizedPage)}`}
            >
              ✏️ Edit in Admin
            </a>
          </>
        )}

        {inlineStatus.startsWith("Unable") && (
          <>
            <button
              className="btn btn-outline !py-2 text-red-600 border-red-300 hover:bg-red-50"
              onClick={async () => {
                const { data } = await supabase.auth.getSession();
                if (!data.session) {
                  setNotice("Session expired. Please sign in again.");
                  return;
                }
                const success = await flushInline();
                if (!success) {
                  try {
                    await publish();
                    clearPendingInline();
                    setNotice("Published live! All changes saved successfully.");
                  } catch (err) {
                    console.error("Publish fallback error:", err);
                  }
                }
              }}
            >
              Retry save
            </button>
            <button
              className="btn btn-ghost !py-2 text-xs text-muted-foreground hover:text-foreground"
              title="Dismiss error message"
              onClick={() => {
                clearPendingInline();
                setNotice("");
              }}
            >
              Dismiss
            </button>
          </>
        )}
        <button
          className="btn btn-outline !py-2"
          onClick={async () => {
            (document.activeElement as HTMLElement)?.blur();
            if (await flushInline()) await supabase.auth.signOut();
          }}
        >
          Sign out
        </button>
      </div>
      {editingPage && (
        <p className="mt-2 text-xs text-muted-foreground">
          {lang === "km"
            ? "Switch to English to edit source text. Images are shared across languages."
            : "Double-click text to edit. Click images to replace. Enter finishes; Shift+Enter adds line; Esc cancels. Links are locked."}
        </p>
      )}
      <p className="mt-2 text-xs font-medium" role="status">
        {inlineStatus ? (
          <span
            className={
              inlineStatus.startsWith("Unable")
                ? "text-red-600 font-semibold"
                : inlineStatus.startsWith("Saving")
                  ? "text-amber-600"
                  : "text-emerald-700"
            }
          >
            {inlineStatus}
          </span>
        ) : notice ? (
          <span
            className={
              notice.startsWith("Published")
                ? "text-emerald-700 font-bold"
                : notice.startsWith("Editing")
                  ? "text-amber-700"
                  : "text-blue-700"
            }
          >
            {notice}
          </span>
        ) : error ? (
          <span className="text-red-600">{error}</span>
        ) : (
          <span className="text-slate-500">Administrator editing controls</span>
        )}
      </p>
    </div>
  );
}
