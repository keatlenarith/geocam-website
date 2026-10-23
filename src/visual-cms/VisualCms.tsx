import {
  updateLinkedField,
  linkedEntry,
  rebaseDraft,
  pageChanges,
  canonicalDbRoute,
  sanitizeStoreForStorage,
} from "./linked-content";
import { attachInlineText } from "./inline-text";
import { createPortal } from "react-dom";
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
import { ImageCropperModal } from "./ImageCropperModal";
import {
  Plus,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline,
  List,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  BarChart2,
  FileText,
  CheckCircle2,
  X,
  Upload,
  Crop,
  Move,
  Maximize2,
  Minimize2,
} from "lucide-react";
export type Entry = {
  kind: "text" | "image";
  value: string;
  width?: string;
  height?: string;
  fit?: string;
  style?: string;
};
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

export function compressDataUrl(
  dataUrl: string,
  maxDim = 1000,
  quality = 0.82,
): Promise<string> {
  if (
    typeof window === "undefined" ||
    !dataUrl ||
    !dataUrl.startsWith("data:image/") ||
    dataUrl.length < 180000 // Skip if already compact
  ) {
    return Promise.resolve(dataUrl);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
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
      if (!ctx) return resolve(dataUrl);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL("image/jpeg", quality);
      resolve(compressed.length < dataUrl.length ? compressed : dataUrl);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export async function compressStoreImages(store: Store): Promise<Store> {
  const result: Store = structuredClone(store);
  for (const page of Object.keys(result)) {
    for (const key of Object.keys(result[page] || {})) {
      const entry = result[page][key];
      if (
        entry?.kind === "image" &&
        entry.value?.startsWith("data:image/") &&
        entry.value.length > 180000
      ) {
        const compressed = await compressDataUrl(entry.value);
        result[page][key] = { ...entry, value: compressed };
      }
    }
  }
  return result;
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

        // Canonical keyspace: map any subroute to one of the 14 allowed DB roots
        const pageWithoutLang = item.page.replace(/::(en|km)$/, "");
        const langMatch = item.page.match(/::(en|km)$/);
        const langSuffix = langMatch ? langMatch[0] : "::en";
        const canonicalBase = canonicalDbRoute(pageWithoutLang);
        const targetPage =
          item.entry.kind === "image"
            ? `${canonicalBase}::en`
            : `${canonicalBase}${langSuffix}`;

        let targetKey = item.key;
        if (pageWithoutLang !== canonicalBase && !targetKey.startsWith("sub:")) {
          const subPart = pageWithoutLang
            .slice(canonicalBase.length)
            .replace(/^\/+/, "")
            .replace(/\//g, "-");
          targetKey = `sub:${subPart}:${targetKey}`;
        }

        let savedOk = false;
        let serverData: any = null;

        try {
          if (
            item.entry.kind === "image" &&
            item.entry.value?.startsWith("data:image/") &&
            item.entry.value.length > 180000
          ) {
            item.entry.value = await compressDataUrl(item.entry.value);
          }

          const { data, error } = await supabase.rpc("geocam_update_page_field", {
            p_page: targetPage,
            p_key: targetKey,
            p_entry: item.entry,
          });

          if (generation.current !== epoch) return false;

          if (!error && data) {
            savedOk = true;
            serverData = data;
          } else if (error) {
            console.warn("geocam_update_page_field notice:", error.message || error);
            const isAuthError =
              error.code === "42501" ||
              error.message?.includes("Administrator access");

            if (!isAuthError) {
              // 1. Try atomic publishing via geocam_publish_page_changes (RPC)
              try {
                const patch = { [targetPage]: { [targetKey]: item.entry } };
                const pubRpc = await supabase.rpc("geocam_publish_page_changes", {
                  p_changes: patch,
                });
                if (!pubRpc.error && pubRpc.data) {
                  savedOk = true;
                  serverData = { draft: pubRpc.data, published: pubRpc.data };
                  setPublished(pubRpc.data as Store);
                  setCachedPublished(pubRpc.data as Store);
                }
              } catch {}

              // 2. Direct table fallback if RPC was not available or table had bloat
              if (!savedOk) {
                try {
                  const [draftRes, pubRes] = await Promise.all([
                    supabase.from("geocam_drafts").select("content").eq("id", "site").single(),
                    supabase.from("geocam_published").select("content").eq("id", "site").single(),
                  ]);
                  let curDraft = structuredClone((draftRes.data?.content || draftRef.current || {}) as Store);
                  let curPub = structuredClone((pubRes.data?.content || published || {}) as Store);

                  if (!curDraft[targetPage]) curDraft[targetPage] = {};
                  curDraft[targetPage][targetKey] = item.entry;

                  if (!curPub[targetPage]) curPub[targetPage] = {};
                  curPub[targetPage][targetKey] = item.entry;

                  if (item.entry.kind === "image") {
                    const enPage = canonicalBase + "::en";
                    if (!curDraft[enPage]) curDraft[enPage] = {};
                    curDraft[enPage][targetKey] = item.entry;
                    if (curDraft[canonicalBase + "::km"]) delete curDraft[canonicalBase + "::km"][targetKey];

                    if (!curPub[enPage]) curPub[enPage] = {};
                    curPub[enPage][targetKey] = item.entry;
                    if (curPub[canonicalBase + "::km"]) delete curPub[canonicalBase + "::km"][targetKey];
                  }

                  // SANITIZE & PURGE BLOAT: Strip all duplicate ::km images and shrink heavy data URLs
                  curDraft = sanitizeStoreForStorage(curDraft);
                  curPub = sanitizeStoreForStorage(curPub);

                  if (JSON.stringify(curDraft).length > 4000000) {
                    curDraft = await compressStoreImages(curDraft);
                  }
                  if (JSON.stringify(curPub).length > 4000000) {
                    curPub = await compressStoreImages(curPub);
                  }

                  const now = new Date().toISOString();
                  const [dUp, pUp] = await Promise.all([
                    supabase.from("geocam_drafts").upsert({ id: "site", content: curDraft, updated_at: now }),
                    supabase.from("geocam_published").upsert({ id: "site", content: curPub, updated_at: now }),
                  ]);

                  if (!dUp.error && !pUp.error) {
                    savedOk = true;
                    serverData = { draft: curDraft, published: curPub };
                    setPublished(curPub);
                    setCachedPublished(curPub);
                  } else {
                    console.error("Direct fallback error:", dUp.error || pUp.error);
                  }
                } catch (fallbackErr) {
                  console.warn("Direct update fallback error:", fallbackErr);
                }
              }
            }

            if (!savedOk) {
              if (isAuthError) {
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
      merged.__appearance = saved.data?.content?.__appearance;
      savedDraftRef.current = (saved.data?.content as Store) || {};
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
            console.warn("Notice: could not load geocam_drafts:", error.message || error);
            // Non-blocking fallback: initialize draft directly from published or cached
            const fallback = structuredClone(published || getCachedPublished() || {});
            draftRef.current = fallback;
            savedDraftRef.current = fallback;
            setDraft(fallback);
            setReady(true);
            return;
          }
          let loaded = (data?.content as Store) || structuredClone(published || getCachedPublished() || {});

          // Detect if database content has storage bloat (e.g. duplicate ::km images)
          const hasKmImages = Object.keys(loaded).some(
            (p) =>
              p.endsWith("::km") &&
              Object.values(loaded[p] || {}).some((e) => e?.kind === "image"),
          );
          if (hasKmImages || JSON.stringify(loaded).length > 6000000) {
            void (async () => {
              try {
                let sanitized = sanitizeStoreForStorage(loaded);
                if (JSON.stringify(sanitized).length > 4000000) {
                  sanitized = await compressStoreImages(sanitized);
                }
                const now = new Date().toISOString();
                const [dRes, pRes] = await Promise.all([
                  supabase.from("geocam_drafts").upsert({ id: "site", content: sanitized, updated_at: now }),
                  supabase.from("geocam_published").upsert({ id: "site", content: sanitized, updated_at: now }),
                ]);
                if (!dRes.error && !pRes.error) {
                  draftRef.current = sanitized;
                  savedDraftRef.current = sanitized;
                  setDraft(sanitized);
                  setPublished(sanitized);
                  setCachedPublished(sanitized);
                }
              } catch (e) {
                console.warn("Storage auto-prune background notice:", e);
              }
            })();
          }

          draftRef.current = loaded;
          savedDraftRef.current = loaded;
          setDraft(loaded);
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
    if (!admin || busy)
      throw Error("Administrator access is required.");
    if (!ready) {
      draftRef.current = structuredClone(published || getCachedPublished() || {});
      setReady(true);
    }
    setBusy(true);
    setError("");
    try {
      let cleanDraft = sanitizeStoreForStorage(draftRef.current);
      if (JSON.stringify(cleanDraft).length > 4000000) {
        cleanDraft = await compressStoreImages(cleanDraft);
      }
      draftRef.current = cleanDraft;

      const row = {
        id: "site",
        content: cleanDraft,
        updated_at: new Date().toISOString(),
      };

      // Save draft (non-fatal if drafts table has timeout/constraint)
      let draftSaved = false;
      try {
        const saved = await supabase.from("geocam_drafts").upsert(row);
        if (!saved.error) {
          draftSaved = true;
          savedDraftRef.current = structuredClone(row.content);
        } else {
          console.warn("Draft upsert notice:", saved.error.message || saved.error);
        }
      } catch (dErr) {
        console.warn("Draft upsert warning:", dErr);
      }

      if (draftSaved) {
        setDirty(false);
      }

      if (publish) {
        let publishedData: Store | null = null;
        try {
          const changes = pageChanges(row.content, published);
          if (Object.keys(changes).length > 0) {
            const result = await supabase.rpc("geocam_publish_page_changes", {
              p_changes: changes,
            });
            if (!result.error && result.data) {
              publishedData = result.data as Store;
            } else if (result.error) {
              console.warn("geocam_publish_page_changes notice:", result.error.message || result.error);
            }
          } else {
            publishedData = structuredClone(row.content);
          }
        } catch (rpcErr) {
          console.warn("geocam_publish_page_changes notice:", rpcErr);
        }

        // Direct upsert fallback if RPC failed or had error
        if (!publishedData) {
          const pubRes = await supabase.from("geocam_published").upsert(row);
          if (pubRes.error) {
            console.error("geocam_published upsert fallback error:", pubRes.error);
            throw pubRes.error;
          }
          publishedData = row.content as Store;
        }

        setPublished(publishedData);
        setCachedPublished(publishedData);
        savedDraftRef.current = structuredClone(row.content);
        setDirty(false);
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
  "/research/topic",
  "/news/item",
  "/publications/view",
  "/articles/read",
  "/research/tectonics",
  "/research/mineral-deposits",
  "/research/geochemistry",
  "/research/geophysics",
  "/research/geohazards",
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

export function getSubrouteInfo(path: string) {
  const cleanPath = normalizeRoute(path);
  const canonicalRoute = canonicalDbRoute(cleanPath);
  let prefix = "";
  if (cleanPath !== canonicalRoute) {
    const search = typeof window !== "undefined" ? window.location.search : "";
    const params = new URLSearchParams(search);
    const id = params.get("id") || params.get("topic") || params.get("slug") || "";
    const subPart = cleanPath
      .slice(canonicalRoute.length)
      .replace(/^\/+/, "")
      .replace(/\//g, "-");
    const subIdentifier = id ? `${subPart}-${id}` : subPart;
    prefix = `sub:${subIdentifier}:`;
  }
  return { canonicalRoute, prefix, cleanPath };
}

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
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);
      // High-efficiency JPEG at quality 0.82 prevents giant PNG data URLs that exceed 10MB database limits
      resolve(canvas.toDataURL("image/jpeg", 0.82));
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
  const { canonicalRoute, prefix, cleanPath } = getSubrouteInfo(page);
  const blocksKey = prefix ? `${prefix}__inserted_blocks__` : "__inserted_blocks__";
  const editable =
    editablePages.includes(normalizedPage) ||
    normalizedPage.startsWith("/research") ||
    normalizedPage.startsWith("/news") ||
    normalizedPage.startsWith("/publications");
  const active = editable ? (editing ? draft : published) : emptyContent;
  const editingPage = editing && editable;
  const refresh = useRef(0);
  const [notice, setNotice] = useState("");
  const [showInsertModal, setShowInsertModal] = useState(false);
  const insertFileInputRef = useRef<HTMLInputElement>(null);
  const mainEl = typeof document !== "undefined" ? document.getElementById("main") : null;

  const getLinked = (rawKey: string): Entry | undefined => {
    const prefixedKey =
      prefix && !rawKey.startsWith("sub:") ? `${prefix}${rawKey}` : rawKey;
    return (
      linkedEntry(active, canonicalRoute, lang, prefixedKey) ||
      linkedEntry(active, cleanPath, lang, prefixedKey) ||
      linkedEntry(active, cleanPath, lang, rawKey) ||
      linkedEntry(active, canonicalRoute, lang, rawKey)
    );
  };

  const persistEntry = (rawKey: string, entry: Entry) => {
    const prefixedKey =
      prefix && !rawKey.startsWith("sub:") ? `${prefix}${rawKey}` : rawKey;
    const targetSpace =
      entry.kind === "image" ? `${canonicalRoute}::en` : `${canonicalRoute}::${lang}`;
    setEntry(targetSpace, prefixedKey, entry);
    saveInline(targetSpace, prefixedKey, entry);
    if (cleanPath !== canonicalRoute) {
      const directSpace =
        entry.kind === "image" ? `${cleanPath}::en` : `${cleanPath}::${lang}`;
      setEntry(directSpace, rawKey, entry);
    }
  };

  // Selected target location for insertion
  const [targetLocation, setTargetLocation] = useState<{
    key: string;
    tagName: string;
    preview: string;
  } | null>(null);

  // Active crop modal state
  const [croppingImage, setCroppingImage] = useState<{
    key: string;
    src: string;
  } | null>(null);

  // Dragging block ID for displacement
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  const [insertedBlocks, setInsertedBlocks] = useState<
    Array<{ id: string; type: string; html: string }>
  >(() => {
    try {
      const saved =
        active[canonicalRoute + "::" + lang]?.[blocksKey]?.value ||
        active[cleanPath + "::" + lang]?.["__inserted_blocks__"]?.value;
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      const saved =
        active[canonicalRoute + "::" + lang]?.[blocksKey]?.value ||
        active[cleanPath + "::" + lang]?.["__inserted_blocks__"]?.value;
      if (saved) {
        setInsertedBlocks(JSON.parse(saved));
        return;
      }
    } catch {}
    setInsertedBlocks([]);
  }, [canonicalRoute, cleanPath, blocksKey, lang, active]);

  const insertBlock = (
    type: "paragraph" | "heading" | "image" | "table" | "chart" | "callout",
    customImageUrl?: string,
  ) => {
    const blockId = "block-" + Date.now();
    let blockHtml = "";

    if (type === "paragraph") {
      blockHtml = `
        <div class="my-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs geocam-editable geocam-inserted-block geocam-draggable-block" draggable="true" data-block-id="${blockId}" data-cms-key="inserted-p-${blockId}">
          New paragraph text inserted. Double-click or select this text to edit and add your content.
        </div>
      `;
    } else if (type === "heading") {
      blockHtml = `
        <h2 class="my-4 text-2xl font-bold tracking-tight text-slate-900 geocam-editable geocam-inserted-block geocam-draggable-block" draggable="true" data-block-id="${blockId}" data-cms-key="inserted-h2-${blockId}">
          New Section Heading
        </h2>
      `;
    } else if (type === "image") {
      const src =
        customImageUrl ||
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80";
      // Uncapped image expansion (object-fit: contain, no arbitrary height cap, fully resizable)
      blockHtml = `
        <figure class="my-6 overflow-visible rounded-2xl border border-slate-200 bg-slate-50/60 p-3 shadow-md text-center geocam-inserted-block geocam-draggable-block" draggable="true" data-block-id="${blockId}">
          <div class="geocam-img-wrapper" style="max-width: none; display: inline-block;">
            <img src="${src}" alt="Inserted geological photo" class="rounded-xl object-contain bg-slate-50 mx-auto geocam-editable" style="object-fit: contain; width: 100%; height: auto; max-width: none; max-height: none;" data-cms-key="inserted-img-${blockId}" data-fit-mode="contain" />
          </div>
          <figcaption class="text-xs text-slate-500 mt-2 text-center italic geocam-editable" data-cms-key="inserted-cap-${blockId}">Photo description and geological field notes</figcaption>
        </figure>
      `;
    } else if (type === "table") {
      blockHtml = `
        <div class="my-6 geocam-table-wrapper rounded-2xl border border-slate-200 bg-white p-4 shadow-sm geocam-inserted-block geocam-draggable-block" draggable="true" data-block-id="${blockId}" style="overflow-x: auto; position: relative;">
          <h4 class="text-sm font-bold text-slate-900 mb-2 geocam-editable" data-cms-key="inserted-tbl-title-${blockId}">Geological Sample Inventory</h4>
          <table class="w-full text-left text-sm border-collapse border border-slate-200" style="max-width: none;">
            <thead>
              <tr class="bg-slate-100 border-b border-slate-200">
                <th class="p-3 font-semibold text-slate-700">Sample ID</th>
                <th class="p-3 font-semibold text-slate-700">Location / Formation</th>
                <th class="p-3 font-semibold text-slate-700">Lithology</th>
                <th class="p-3 font-semibold text-slate-700">Assay Findings</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-100 hover:bg-slate-50">
                <td class="p-3 font-mono text-xs">GC-NEW-01</td>
                <td class="p-3">Cardamome Range</td>
                <td class="p-3">Quartzite / Sandstone</td>
                <td class="p-3 text-emerald-700 font-medium">Au 1.2 g/t</td>
              </tr>
              <tr class="border-b border-slate-100 hover:bg-slate-50">
                <td class="p-3 font-mono text-xs">GC-NEW-02</td>
                <td class="p-3">Kampot Karst</td>
                <td class="p-3">Limestone</td>
                <td class="p-3">CaCO3 95.1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (type === "chart") {
      blockHtml = `
        <div class="my-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs geocam-inserted-block geocam-draggable-block" draggable="true" data-block-id="${blockId}">
          <h4 class="text-sm font-bold text-slate-900 mb-1 geocam-editable" data-cms-key="inserted-chart-title-${blockId}">Mineralogical Composition Assay</h4>
          <p class="text-xs text-slate-500 mb-4 geocam-editable" data-cms-key="inserted-chart-sub-${blockId}">Quantitative whole-rock XRF proportions (%)</p>
          <div class="space-y-3">
            <div>
              <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Silica (SiO2)</span>
                <span>65%</span>
              </div>
              <div class="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div class="h-full rounded-full bg-emerald-600" style="width: 65%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Alumina (Al2O3)</span>
                <span>18%</span>
              </div>
              <div class="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div class="h-full rounded-full bg-teal-500" style="width: 18%"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (type === "callout") {
      blockHtml = `
        <blockquote class="my-4 border-l-4 border-emerald-600 bg-emerald-50/70 p-4 rounded-r-xl italic text-slate-800 shadow-xs geocam-editable geocam-inserted-block geocam-draggable-block" draggable="true" data-block-id="${blockId}" data-cms-key="inserted-quote-${blockId}">
          “Key scientific discovery or geological insight entered here...”
        </blockquote>
      `;
    }

    // Determine insertion position based on desired target location
    let nextBlocks: Array<{ id: string; type: string; html: string }>;
    if (targetLocation) {
      const targetIdx = insertedBlocks.findIndex(
        (b) => b.id === targetLocation.key || b.html.includes(targetLocation.key),
      );
      if (targetIdx >= 0) {
        nextBlocks = [
          ...insertedBlocks.slice(0, targetIdx + 1),
          { id: blockId, type, html: blockHtml },
          ...insertedBlocks.slice(targetIdx + 1),
        ];
      } else {
        nextBlocks = [{ id: blockId, type, html: blockHtml }, ...insertedBlocks];
      }

      // Also insert directly after target element if in the live DOM
      const targetDomEl = document.querySelector<HTMLElement>(
        `[data-cms-key="${targetLocation.key}"], .geocam-target-active`,
      );
      if (targetDomEl && targetDomEl.parentElement) {
        const temp = document.createElement("div");
        temp.innerHTML = blockHtml;
        const insertedDomEl = temp.firstElementChild;
        if (insertedDomEl) {
          targetDomEl.insertAdjacentElement("afterend", insertedDomEl);
        }
      }
    } else {
      nextBlocks = [...insertedBlocks, { id: blockId, type, html: blockHtml }];
    }

    setInsertedBlocks(nextBlocks);
    setShowInsertModal(false);

    // Persist to CMS
    const entry: Entry = {
      kind: "text",
      value: JSON.stringify(nextBlocks),
    };
    setEntry(canonicalRoute + "::" + lang, blocksKey, entry);
    saveInline(canonicalRoute + "::" + lang, blocksKey, entry);
    if (cleanPath !== canonicalRoute) {
      setEntry(cleanPath + "::" + lang, "__inserted_blocks__", entry);
    }
    setNotice(
      targetLocation
        ? `Content inserted at chosen location <${targetLocation.tagName}>!`
        : "Content block inserted successfully! Click to edit text or images.",
    );
  };

  const insertWord = () => {
    const word = window.prompt("Enter word or text to insert at chosen location:");
    if (!word || !word.trim()) return;

    if (targetLocation) {
      const targetDomEl = document.querySelector<HTMLElement>(
        `[data-cms-key="${targetLocation.key}"], .geocam-target-active`,
      );
      if (targetDomEl) {
        const span = document.createElement("span");
        span.className =
          "geocam-inserted-word geocam-editable font-medium text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 mx-1 inline-block";
        span.textContent = word.trim();
        span.contentEditable = "true";

        if (targetDomEl.tagName === "IMG" || targetDomEl.tagName === "FIGURE") {
          targetDomEl.insertAdjacentElement("afterend", span);
        } else {
          targetDomEl.appendChild(span);
        }

        const key = targetLocation.key;
        const html = targetDomEl.innerHTML;
        persistEntry(key, { kind: "text", value: html });
        setNotice(`Inserted "${word.trim()}" at desired location <${targetLocation.tagName}>!`);
        return;
      }
    }

    const ok = document.execCommand("insertText", false, word.trim());
    if (!ok) {
      insertBlock("paragraph");
      setNotice(`Inserted "${word.trim()}" into new content block.`);
    } else {
      setNotice(`Inserted "${word.trim()}" at cursor position.`);
    }
  };

  const handleInsertedImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await optimizeImage(file);
      insertBlock("image", dataUrl);
    } catch {
      setNotice("Failed to load image file.");
    } finally {
      if (e.target) e.target.value = "";
    }
  };
  useLayoutEffect(() => {
    const main = document.getElementById("main");
    if (!main || !editable || page.startsWith("/admin")) return;
    const keyspace = normalizedPage + "::" + lang;
    const apply = () => {
      for (const el of candidates(main)) {
        // Data-driven views must not freeze result counts or bind edits to a
        // different record after a filter changes. Only stable named fields.
        if (
          !editablePages.includes(normalizedPage) &&
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
        const entry = getLinked(key);
        const isObsoleteSvg =
          entry?.kind === "image" &&
          typeof entry.value === "string" &&
          entry.value.includes("/images/focus/") &&
          entry.value.endsWith(".svg");
        const value =
          !isObsoleteSvg && entry?.kind === (image ? "image" : "text")
            ? !image && lang === "km" ? translateText(entry.value) : entry.value
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

          // Apply saved width, height, and fitMode so the edited size persists for all visitors!
          if (entry?.kind === "image") {
            if (entry.width) {
              (el as HTMLImageElement).style.width = entry.width;
              (el as HTMLImageElement).style.maxWidth = "none";
              (el as HTMLImageElement).style.display = "block";
              (el as HTMLImageElement).style.margin = "0 auto";
            }
            if (entry.height && entry.height !== "auto") {
              (el as HTMLImageElement).style.height = entry.height;
              (el as HTMLImageElement).style.maxHeight = "none";
            } else {
              // ALWAYS default to height: auto so there is ZERO vertical dead space!
              (el as HTMLImageElement).style.height = "auto";
              (el as HTMLImageElement).style.maxHeight = "none";
            }
            if (entry.fit) {
              (el as HTMLImageElement).style.objectFit = entry.fit;
              el.setAttribute("data-fit-mode", entry.fit);
            }
          } else {
            (el as HTMLImageElement).style.height = "auto";
            (el as HTMLImageElement).style.maxHeight = "none";
          }
          if (editingPage) {
            const parent = el.parentElement;
            if (parent && !parent.querySelector(`.geocam-img-controls-bar[data-key="${key}"]`)) {
              if (getComputedStyle(parent).position === "static") {
                parent.style.position = "relative";
              }
              const bar = document.createElement("div");
              bar.className = "geocam-img-controls-bar";
              bar.dataset.key = key;

              // 1. Crop button
              const cropBtn = document.createElement("button");
              cropBtn.type = "button";
              cropBtn.className = "geocam-ctrl-crop";
              cropBtn.innerHTML = "✂️ Crop";
              cropBtn.title = "Crop image with ratio presets";
              bar.appendChild(cropBtn);

              // 2. Fit mode toggle button
              const fitBtn = document.createElement("button");
              fitBtn.type = "button";
              fitBtn.className = "geocam-ctrl-fit";
              const isContain =
                el.getAttribute("data-fit-mode") === "contain" ||
                el.style.objectFit === "contain";
              fitBtn.innerHTML = isContain ? "🖼️ Fit (Contain)" : "🖼️ Cover";
              fitBtn.title = "Toggle Fit Mode (Contain vs Cover)";
              bar.appendChild(fitBtn);

              // 3. 50% resize preset
              const size50Btn = document.createElement("button");
              size50Btn.type = "button";
              size50Btn.className = "geocam-ctrl-50";
              size50Btn.innerHTML = "50%";
              size50Btn.title = "Resize to 50% width";
              bar.appendChild(size50Btn);

              // 4. 100% resize preset
              const size100Btn = document.createElement("button");
              size100Btn.type = "button";
              size100Btn.className = "geocam-ctrl-100";
              size100Btn.innerHTML = "100%";
              size100Btn.title = "Resize to 100% width";
              bar.appendChild(size100Btn);

              // 4b. 150% resize preset
              const size150Btn = document.createElement("button");
              size150Btn.type = "button";
              size150Btn.className = "geocam-ctrl-150";
              size150Btn.innerHTML = "150%";
              size150Btn.title = "Expand to 150% width (Uncapped)";
              bar.appendChild(size150Btn);

              // 4c. 200% resize preset
              const size200Btn = document.createElement("button");
              size200Btn.type = "button";
              size200Btn.className = "geocam-ctrl-200";
              size200Btn.innerHTML = "200%";
              size200Btn.title = "Expand to 200% width (Uncapped)";
              bar.appendChild(size200Btn);

              // 4d. Free / Max resize preset (ពង្រីកពេញចិត្ត)
              const sizeFreeBtn = document.createElement("button");
              sizeFreeBtn.type = "button";
              sizeFreeBtn.className = "geocam-ctrl-free";
              sizeFreeBtn.innerHTML = "Free / Max";
              sizeFreeBtn.title = "Uncapped full-extent size (ពង្រីកពេញចិត្ត)";
              bar.appendChild(sizeFreeBtn);

              // 5. Remove button
              const removeBtn = document.createElement("button");
              removeBtn.type = "button";
              removeBtn.className = "geocam-ctrl-remove";
              removeBtn.dataset.key = key;
              removeBtn.title = "Remove photo";
              removeBtn.innerHTML = "✕ Remove";
              bar.appendChild(removeBtn);

              parent.appendChild(bar);

              // 6. Corner resize handle
              if (!parent.querySelector(`.geocam-resize-handle[data-key="${key}"]`)) {
                const handle = document.createElement("div");
                handle.className = "geocam-resize-handle";
                handle.dataset.key = key;
                handle.title = "Drag corner to resize image to whatever size you prefer (no limit)";
                parent.appendChild(handle);
              }
            }
          }
        } else if (el.textContent !== value) el.textContent = value;
        record.rendered = value;
        el.dataset.cmsKey = key;
        el.classList.toggle("geocam-editable", editingPage);
      }

      // Attach table controls and drag handle for all tables
      if (editingPage) {
        const tables = main.querySelectorAll<HTMLTableElement>("table");
        tables.forEach((tbl) => {
          let wrap = tbl.closest<HTMLElement>(".geocam-table-wrapper");
          if (!wrap) {
            const parent = tbl.parentElement;
            if (parent && !parent.querySelector(".geocam-table-controls-bar")) {
              wrap = parent;
              wrap.classList.add("geocam-table-wrapper");
            }
          }
          if (wrap && !wrap.querySelector(".geocam-table-controls-bar")) {
            if (getComputedStyle(wrap).position === "static") {
              wrap.style.position = "relative";
            }
            wrap.style.overflowX = "auto";
            const tblBar = document.createElement("div");
            tblBar.className = "geocam-table-controls-bar";
            tblBar.innerHTML = `
              <span style="font-size:10px;font-weight:700;color:#94a3b8;margin-right:2px;">Table:</span>
              <button type="button" class="geocam-tbl-100" title="Default 100% width">100%</button>
              <button type="button" class="geocam-tbl-125" title="Wide 125% width">125%</button>
              <button type="button" class="geocam-tbl-150" title="Extra Wide 150% width">150%</button>
              <button type="button" class="geocam-tbl-200" title="Expansive 200% width">200%</button>
              <button type="button" class="geocam-tbl-free" title="Free / Uncapped width (ពង្រីកពេញចិត្ត)">Free / Max</button>
            `;
            wrap.appendChild(tblBar);

            if (!wrap.querySelector(".geocam-table-resize-handle")) {
              const handle = document.createElement("div");
              handle.className = "geocam-table-resize-handle";
              handle.title = "Drag right edge to expand table width to whatever size you prefer (no limit)";
              wrap.appendChild(handle);
            }
          }
        });
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

      // 1. Controls bar interaction
      const ctrlBar = target.closest<HTMLElement>(".geocam-img-controls-bar");
      if (ctrlBar) {
        event.preventDefault();
        event.stopPropagation();
        const key = ctrlBar.dataset.key || "";
        const img = ctrlBar.parentElement?.querySelector("img");

        // A. Crop tool
        if (target.closest(".geocam-ctrl-crop")) {
          const currentSrc = img?.getAttribute("src") || "";
          if (currentSrc) {
            setCroppingImage({ key, src: currentSrc });
          }
          return;
        }

        // B. Fit Mode toggle
        if (target.closest(".geocam-ctrl-fit")) {
          if (img) {
            const isCurrentlyContain =
              img.style.objectFit === "contain" ||
              img.getAttribute("data-fit-mode") === "contain";
            const newFit = isCurrentlyContain ? "cover" : "contain";
            img.style.objectFit = newFit;
            img.setAttribute("data-fit-mode", newFit);
            img.style.height = "auto";
            target.innerHTML = newFit === "contain" ? "🖼️ Fit (Contain)" : "🖼️ Cover";
            const currentSrc = img.getAttribute("src") || "";
            const currentWidth = img.style.width || "100%";
            persistEntry(key, {
              kind: "image",
              value: currentSrc,
              width: currentWidth,
              height: "auto",
              fit: newFit,
            });
            setNotice(`Image mode set to ${newFit} and saved.`);
          }
          return;
        }

        // C. 50% Size
        if (target.closest(".geocam-ctrl-50")) {
          if (img) {
            img.style.width = "50%";
            img.style.maxWidth = "none";
            img.style.maxHeight = "none";
            img.style.height = "auto";
            img.style.margin = "0 auto";
            img.style.display = "block";
            const currentSrc = img.getAttribute("src") || "";
            const currentFit = img.getAttribute("data-fit-mode") || "contain";
            persistEntry(key, {
              kind: "image",
              value: currentSrc,
              width: "50%",
              height: "auto",
              fit: currentFit,
            });
            setNotice("Image resized to 50% width and saved.");
          }
          return;
        }

        // D. 100% Size
        if (target.closest(".geocam-ctrl-100")) {
          if (img) {
            img.style.width = "100%";
            img.style.maxWidth = "none";
            img.style.maxHeight = "none";
            img.style.height = "auto";
            img.style.margin = "0 auto";
            img.style.display = "block";
            const currentSrc = img.getAttribute("src") || "";
            const currentFit = img.getAttribute("data-fit-mode") || "contain";
            persistEntry(key, {
              kind: "image",
              value: currentSrc,
              width: "100%",
              height: "auto",
              fit: currentFit,
            });
            setNotice("Image resized to 100% width and saved.");
          }
          return;
        }

        // D2. 150% Size
        if (target.closest(".geocam-ctrl-150")) {
          if (img) {
            img.style.width = "150%";
            img.style.maxWidth = "none";
            img.style.maxHeight = "none";
            img.style.height = "auto";
            img.style.margin = "0 auto";
            img.style.display = "block";
            const p = img.closest(".geocam-img-wrapper, figure, .geocam-inserted-block");
            if (p instanceof HTMLElement) {
              p.style.overflow = "visible";
              p.style.maxWidth = "none";
            }
            const currentSrc = img.getAttribute("src") || "";
            const currentFit = img.getAttribute("data-fit-mode") || "contain";
            persistEntry(key, {
              kind: "image",
              value: currentSrc,
              width: "150%",
              height: "auto",
              fit: currentFit,
            });
            setNotice("Image expanded to 150% width and saved.");
          }
          return;
        }

        // D3. 200% Size
        if (target.closest(".geocam-ctrl-200")) {
          if (img) {
            img.style.width = "200%";
            img.style.maxWidth = "none";
            img.style.maxHeight = "none";
            img.style.height = "auto";
            img.style.margin = "0 auto";
            img.style.display = "block";
            const p = img.closest(".geocam-img-wrapper, figure, .geocam-inserted-block");
            if (p instanceof HTMLElement) {
              p.style.overflow = "visible";
              p.style.maxWidth = "none";
            }
            const currentSrc = img.getAttribute("src") || "";
            const currentFit = img.getAttribute("data-fit-mode") || "contain";
            persistEntry(key, {
              kind: "image",
              value: currentSrc,
              width: "200%",
              height: "auto",
              fit: currentFit,
            });
            setNotice("Image expanded to 200% width and saved.");
          }
          return;
        }

        // D4. Free / Max Size (ពង្រីកពេញចិត្ត)
        if (target.closest(".geocam-ctrl-free")) {
          if (img) {
            img.style.width = "auto";
            img.style.maxWidth = "none";
            img.style.maxHeight = "none";
            img.style.height = "auto";
            img.style.margin = "0 auto";
            img.style.display = "block";
            const p = img.closest(".geocam-img-wrapper, figure, .geocam-inserted-block");
            if (p instanceof HTMLElement) {
              p.style.overflow = "visible";
              p.style.maxWidth = "none";
            }
            const currentSrc = img.getAttribute("src") || "";
            const currentFit = img.getAttribute("data-fit-mode") || "contain";
            persistEntry(key, {
              kind: "image",
              value: currentSrc,
              width: "auto",
              height: "auto",
              fit: currentFit,
            });
            setNotice("Image set to full uncapped size (Free / Max) and saved.");
          }
          return;
        }

        // E. Remove button
        if (
          target.closest(".geocam-ctrl-remove") ||
          target.closest(".geocam-img-remove-btn")
        ) {
          const entry: Entry = {
            kind: "image",
            value: EMPTY_IMAGE_PLACEHOLDER,
          };
          persistEntry(key, entry);
          setNotice("Photo removed. Click placeholder or upload to change.");
          return;
        }
        return;
      }

      // 1B. Table controls bar interaction (Uncapped table sizing)
      const tblBar = target.closest<HTMLElement>(".geocam-table-controls-bar");
      if (tblBar) {
        event.preventDefault();
        event.stopPropagation();
        const wrap = tblBar.parentElement;
        const tbl = wrap?.querySelector("table");
        if (tbl) {
          if (target.closest(".geocam-tbl-100")) {
            tbl.style.width = "100%";
            tbl.style.minWidth = "100%";
            tbl.style.maxWidth = "none";
            setNotice("Table width set to 100%.");
          } else if (target.closest(".geocam-tbl-125")) {
            tbl.style.width = "125%";
            tbl.style.minWidth = "125%";
            tbl.style.maxWidth = "none";
            setNotice("Table expanded to 125% width.");
          } else if (target.closest(".geocam-tbl-150")) {
            tbl.style.width = "150%";
            tbl.style.minWidth = "150%";
            tbl.style.maxWidth = "none";
            setNotice("Table expanded to 150% width.");
          } else if (target.closest(".geocam-tbl-200")) {
            tbl.style.width = "200%";
            tbl.style.minWidth = "200%";
            tbl.style.maxWidth = "none";
            setNotice("Table expanded to 200% width.");
          } else if (target.closest(".geocam-tbl-free")) {
            tbl.style.width = "max-content";
            tbl.style.minWidth = "100%";
            tbl.style.maxWidth = "none";
            setNotice("Table expanded to full natural extent (Free / Max).");
          }
        }
        return;
      }

      // 2. Corner resize handle click
      if (
        target.closest(".geocam-resize-handle") ||
        target.closest(".geocam-table-resize-handle")
      ) {
        return;
      }

      // 3. Selection of Desired Target Location on any clicked element
      if (!target.closest("[data-cms-ui]")) {
        const targetBlock =
          target.closest<HTMLElement>(
            "p, h1, h2, h3, h4, figure, table, blockquote, div.geocam-editable, div.geocam-inserted-block, section, article",
          ) || target;

        if (targetBlock && main.contains(targetBlock)) {
          main.querySelectorAll(".geocam-target-active").forEach((el) => {
            el.classList.remove("geocam-target-active");
          });
          targetBlock.classList.add("geocam-target-active");
          const targetKey =
            targetBlock.dataset.cmsKey ||
            targetBlock.getAttribute("data-cms-id") ||
            stableKey(targetBlock, main);
          setTargetLocation({
            key: targetKey,
            tagName: targetBlock.tagName.toUpperCase(),
            preview: (targetBlock.textContent || "").trim().slice(0, 30),
          });
          setNotice(
            `Target selected: <${targetBlock.tagName.toUpperCase()}>. Click "+ Insert Word" or "+ Insert Content" to insert here.`,
          );
        }
      }

      // 4. Fallback image replacement upload
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
              persistEntry(key, entry);
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

    // 5. Corner resize handle mousedown listener (Uncapped image resizing)
    const onMouseDownResize = (e: MouseEvent) => {
      const handle = (e.target as HTMLElement)?.closest<HTMLElement>(".geocam-resize-handle");
      if (!handle) return;
      e.preventDefault();
      e.stopPropagation();

      const img = handle.parentElement?.querySelector("img");
      if (!img) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = img.getBoundingClientRect().width;
      const startHeight = img.getBoundingClientRect().height;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        // Resize width smoothly with no upper bounds
        const newWidth = Math.max(80, Math.round(startWidth + deltaX));
        img.style.width = `${newWidth}px`;
        img.style.maxWidth = "none";
        // Always maintain height: auto to ensure ZERO dead vertical space!
        img.style.height = "auto";
        img.style.maxHeight = "none";
        img.style.margin = "0 auto";
        img.style.display = "block";

        const parent = img.closest(".geocam-img-wrapper, figure, .geocam-inserted-block");
        if (parent instanceof HTMLElement) {
          parent.style.overflow = "visible";
          parent.style.maxWidth = "none";
          parent.style.height = "auto";
        }
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        const key = handle.dataset.key;
        if (key && img) {
          const currentSrc = img.getAttribute("src") || "";
          const currentFit = img.getAttribute("data-fit-mode") || "contain";
          persistEntry(key, {
            kind: "image",
            value: currentSrc,
            width: img.style.width,
            height: "auto",
            fit: currentFit,
          });
          setNotice(`Image resized to ${img.style.width} (proportional, zero height gaps) and saved.`);
        }
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    // 5B. Table resize handle mousedown listener (Uncapped table resizing)
    const onMouseDownTableResize = (e: MouseEvent) => {
      const handle = (e.target as HTMLElement)?.closest<HTMLElement>(".geocam-table-resize-handle");
      if (!handle) return;
      e.preventDefault();
      e.stopPropagation();

      const wrap = handle.parentElement;
      const tbl = wrap?.querySelector("table");
      if (!tbl) return;

      const startX = e.clientX;
      const startWidth = tbl.getBoundingClientRect().width;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        // No upper limit - user can expand table width to whatever size they prefer
        const newWidth = Math.max(200, Math.round(startWidth + deltaX));
        tbl.style.width = `${newWidth}px`;
        tbl.style.minWidth = `${newWidth}px`;
        tbl.style.maxWidth = "none";
        if (wrap) wrap.style.overflowX = "auto";
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        setNotice(`Table expanded to ${tbl.style.width}.`);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    // 6. Block drag and drop to displace
    const onDragStart = (e: DragEvent) => {
      const block = (e.target as HTMLElement)?.closest<HTMLElement>(".geocam-draggable-block");
      if (!block) return;
      const id = block.dataset.blockId;
      if (!id) return;
      setDraggedBlockId(id);
      block.classList.add("geocam-block-dragging");
      e.dataTransfer?.setData("text/plain", id);
    };

    const onDragOver = (e: DragEvent) => {
      const block = (e.target as HTMLElement)?.closest<HTMLElement>(".geocam-draggable-block");
      if (!block) return;
      e.preventDefault();
      const rect = block.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if (e.clientY < mid) {
        block.classList.add("geocam-drop-target-above");
        block.classList.remove("geocam-drop-target-below");
      } else {
        block.classList.add("geocam-drop-target-below");
        block.classList.remove("geocam-drop-target-above");
      }
    };

    const onDragLeave = (e: DragEvent) => {
      const block = (e.target as HTMLElement)?.closest<HTMLElement>(".geocam-draggable-block");
      if (!block) return;
      block.classList.remove("geocam-drop-target-above", "geocam-drop-target-below");
    };

    const onDrop = (e: DragEvent) => {
      const targetBlock = (e.target as HTMLElement)?.closest<HTMLElement>(".geocam-draggable-block");
      if (!targetBlock) return;
      e.preventDefault();
      targetBlock.classList.remove("geocam-drop-target-above", "geocam-drop-target-below");
      const srcId = e.dataTransfer?.getData("text/plain") || draggedBlockId;
      const targetId = targetBlock.dataset.blockId;
      if (!srcId || !targetId || srcId === targetId) return;

      setInsertedBlocks((prev) => {
        const fromIdx = prev.findIndex((b) => b.id === srcId);
        const toIdx = prev.findIndex((b) => b.id === targetId);
        if (fromIdx === -1 || toIdx === -1) return prev;
        const reordered = [...prev];
        const [moved] = reordered.splice(fromIdx, 1);
        reordered.splice(toIdx, 0, moved);

        const entry: Entry = { kind: "text", value: JSON.stringify(reordered) };
        setEntry(canonicalRoute + "::" + lang, blocksKey, entry);
        saveInline(canonicalRoute + "::" + lang, blocksKey, entry);
        if (cleanPath !== canonicalRoute) {
          setEntry(cleanPath + "::" + lang, "__inserted_blocks__", entry);
        }
        return reordered;
      });
      setNotice("Block position displaced successfully!");
    };

    const onDragEnd = () => {
      main
        .querySelectorAll(
          ".geocam-block-dragging, .geocam-drop-target-above, .geocam-drop-target-below",
        )
        .forEach((el) =>
          el.classList.remove(
            "geocam-block-dragging",
            "geocam-drop-target-above",
            "geocam-drop-target-below",
          ),
        );
      setDraggedBlockId(null);
    };

    main.addEventListener("click", click, true);
    main.addEventListener("mousedown", onMouseDownResize, true);
    main.addEventListener("mousedown", onMouseDownTableResize, true);
    main.addEventListener("dragstart", onDragStart);
    main.addEventListener("dragover", onDragOver);
    main.addEventListener("dragleave", onDragLeave);
    main.addEventListener("drop", onDrop);
    main.addEventListener("dragend", onDragEnd);

    return () => {
      observer.disconnect();
      if (refresh.current) {
        cancelAnimationFrame(refresh.current);
        refresh.current = 0;
      }
      main.removeEventListener("click", click, true);
      main.removeEventListener("mousedown", onMouseDownResize, true);
      main.removeEventListener("mousedown", onMouseDownTableResize, true);
      main.removeEventListener("dragstart", onDragStart);
      main.removeEventListener("dragover", onDragOver);
      main.removeEventListener("dragleave", onDragLeave);
      main.removeEventListener("drop", onDrop);
      main.removeEventListener("dragend", onDragEnd);
      main
        .querySelectorAll(".geocam-editable")
        .forEach((el) => el.classList.remove("geocam-editable"));
      main
        .querySelectorAll(".geocam-target-active")
        .forEach((el) => el.classList.remove("geocam-target-active"));
      main
        .querySelectorAll(
          ".geocam-img-controls-bar, .geocam-resize-handle, .geocam-img-remove-btn, .geocam-table-controls-bar, .geocam-table-resize-handle",
        )
        .forEach((el) => el.remove());
    };
  }, [canonicalRoute, cleanPath, prefix, blocksKey, normalizedPage, lang, active, editingPage, busy, setEntry, saveInline]);
  useLayoutEffect(() => {
    const main = document.getElementById("main");
    if (!main || !editingPage || busy) return;
    return attachInlineText(main, {
      commit: (rawKey, value) => {
        setNotice("");
        const prefixedKey =
          prefix && !rawKey.startsWith("sub:") ? `${prefix}${rawKey}` : rawKey;
        setEntry(canonicalRoute + "::" + lang, prefixedKey, { kind: "text", value });
        setEntry(canonicalRoute + "::" + (lang === "en" ? "km" : "en"), prefixedKey, {
          kind: "text",
          value: lang === "en" ? translateText(value) || value : value,
        });
        if (cleanPath !== canonicalRoute) {
          setEntry(cleanPath + "::" + lang, rawKey, { kind: "text", value });
        }
      },
      complete: (rawKey, value) => {
        const prefixedKey =
          prefix && !rawKey.startsWith("sub:") ? `${prefix}${rawKey}` : rawKey;
        saveInline(canonicalRoute + "::" + lang, prefixedKey, { kind: "text", value });
      },
    });
  }, [canonicalRoute, cleanPath, prefix, normalizedPage, lang, editingPage, busy, setEntry, saveInline]);
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
    <>
      {/* Hidden file input for block image upload */}
      <input
        type="file"
        ref={insertFileInputRef}
        onChange={handleInsertedImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* =========================================================================
          TOP-DOCKED WORDPRESS EDITING TOOLBAR
          Activates in visual edit mode across all pages
         ========================================================================= */}
      {editingPage && (
        <div
          data-cms-ui="website-wordpress-toolbar"
          className="fixed top-0 left-0 right-0 z-[2500] bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-700/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl"
        >
          {/* Left: Brand Badge & Formatting Controls */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-2 bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              WordPress Visual Editor
            </div>

            <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

            {/* Text formatting tools */}
            <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                title="Heading 2"
                onClick={() => {
                  document.execCommand("formatBlock", false, "<h2>");
                  setNotice("Heading 2 formatted.");
                }}
                className="px-2 py-1 hover:bg-slate-700 rounded font-bold text-slate-200 transition"
              >
                H2
              </button>
              <button
                type="button"
                title="Heading 3"
                onClick={() => {
                  document.execCommand("formatBlock", false, "<h3>");
                  setNotice("Heading 3 formatted.");
                }}
                className="px-2 py-1 hover:bg-slate-700 rounded font-bold text-slate-200 transition"
              >
                H3
              </button>
              <button
                type="button"
                title="Bold (Ctrl+B)"
                onClick={() => {
                  document.execCommand("bold");
                  setNotice("Bold applied.");
                }}
                className="px-2 py-1 hover:bg-slate-700 rounded font-bold text-slate-200 transition"
              >
                B
              </button>
              <button
                type="button"
                title="Italic (Ctrl+I)"
                onClick={() => {
                  document.execCommand("italic");
                  setNotice("Italic applied.");
                }}
                className="px-2 py-1 hover:bg-slate-700 rounded italic font-serif text-slate-200 transition"
              >
                I
              </button>
              <button
                type="button"
                title="Underline (Ctrl+U)"
                onClick={() => {
                  document.execCommand("underline");
                  setNotice("Underline applied.");
                }}
                className="px-2 py-1 hover:bg-slate-700 rounded underline text-slate-200 transition"
              >
                U
              </button>
              <button
                type="button"
                title="Bullet List"
                onClick={() => {
                  document.execCommand("insertUnorderedList");
                  setNotice("Bullet list created.");
                }}
                className="px-2 py-1 hover:bg-slate-700 rounded text-slate-200 transition"
              >
                • List
              </button>
              <button
                type="button"
                title="Quote Block"
                onClick={() => {
                  document.execCommand("formatBlock", false, "<blockquote>");
                  setNotice("Quote block created.");
                }}
                className="px-2 py-1 hover:bg-slate-700 rounded italic text-slate-200 transition"
              >
                ” Quote
              </button>
              <button
                type="button"
                title="Add Link"
                onClick={() => {
                  const url = window.prompt("Enter link URL (e.g., https://...):");
                  if (url) {
                    document.execCommand("createLink", false, url);
                    setNotice("Link inserted.");
                  }
                }}
                className="px-2 py-1 hover:bg-slate-700 rounded text-slate-200 transition"
              >
                🔗 Link
              </button>
            </div>

            {/* Target Location Badge Indicator */}
            {targetLocation ? (
              <div className="flex items-center gap-1.5 bg-blue-900/60 text-blue-200 border border-blue-500/50 px-2.5 py-1 rounded-lg text-xs font-mono">
                <span>📍 Target: &lt;{targetLocation.tagName}&gt;</span>
                <span className="text-[10px] text-blue-300/80 max-w-[120px] truncate hidden md:inline">
                  "{targetLocation.preview}"
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTargetLocation(null);
                    document
                      .querySelectorAll(".geocam-target-active")
                      .forEach((el) => el.classList.remove("geocam-target-active"));
                  }}
                  className="ml-1 text-blue-300 hover:text-white"
                  title="Clear target location"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="hidden xl:flex items-center gap-1 text-[11px] text-slate-400 italic">
                <span>💡 Click any spot on page to choose insertion target</span>
              </div>
            )}

            {/* Insert Word Button */}
            <button
              type="button"
              onClick={insertWord}
              className="flex items-center gap-1 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition"
              title="Insert word or text phrase at chosen location"
            >
              <Plus size={13} /> + Insert Word
            </button>

            {/* Inserter Button */}
            <button
              type="button"
              onClick={() => setShowInsertModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition"
            >
              <Plus size={14} /> + Insert Content
            </button>

            {/* Crop Tool Button */}
            <button
              type="button"
              onClick={() => {
                let imgToCrop: { key: string; src: string } | null = null;
                if (targetLocation) {
                  const targetEl = document.querySelector(
                    `[data-cms-key="${targetLocation.key}"], .geocam-target-active`,
                  );
                  const img =
                    targetEl?.tagName === "IMG"
                      ? (targetEl as HTMLImageElement)
                      : targetEl?.querySelector("img");
                  if (img && img.src) {
                    imgToCrop = { key: targetLocation.key, src: img.src };
                  }
                }
                if (!imgToCrop) {
                  const firstImg = document.querySelector(
                    "#main img",
                  ) as HTMLImageElement | null;
                  if (firstImg && firstImg.src) {
                    imgToCrop = {
                      key: firstImg.dataset.cmsKey || "main-img",
                      src: firstImg.src,
                    };
                  }
                }
                if (imgToCrop) {
                  setCroppingImage(imgToCrop);
                } else {
                  const url = window.prompt("Enter image URL to crop:");
                  if (url) setCroppingImage({ key: "custom-crop", src: url });
                }
              }}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition"
              title="Open Crop Tool"
            >
              <Crop size={13} /> ✂️ Crop Image
            </button>
          </div>

          {/* Right: Status and Publish Actions */}
          <div className="flex items-center gap-2 text-xs">
            {inlineStatus && <span className="text-emerald-400 font-medium">{inlineStatus}</span>}
            {notice && <span className="text-amber-300 font-medium">{notice}</span>}

            <a
              href="/admin"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 font-medium transition"
            >
              Dashboard
            </a>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 font-medium transition"
            >
              Done Editing
            </button>
            <button
              type="button"
              onClick={async () => {
                setNotice("Publishing changes live to website…");
                try {
                  await publish();
                  clearPendingInline();
                  setNotice("Published live! All visitors see these changes now.");
                } catch (err) {
                  setNotice("Publication failed. Please retry.");
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition"
            >
              <CheckCircle2 size={14} /> Publish Live
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          BLOCK INSERTER POPUP MODAL
         ========================================================================= */}
      {showInsertModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="text-emerald-600" size={20} /> Insert Content Block into Page
              </h4>
              <button
                type="button"
                onClick={() => setShowInsertModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => insertBlock("paragraph")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-center transition group"
              >
                <div className="p-3 rounded-full bg-slate-100 text-slate-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <FileText size={20} />
                </div>
                <span className="text-xs font-bold text-slate-800">New Paragraph</span>
                <span className="text-[11px] text-slate-400">Regular prose text block</span>
              </button>

              <button
                type="button"
                onClick={() => insertBlock("heading")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-center transition group"
              >
                <div className="p-3 rounded-full bg-slate-100 text-slate-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Heading2 size={20} />
                </div>
                <span className="text-xs font-bold text-slate-800">New Heading</span>
                <span className="text-[11px] text-slate-400">H2 / H3 section title</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const choice = window.confirm(
                    "Click OK to insert default geological photo in Fit Mode, or Cancel to choose local image file from device.",
                  );
                  if (choice) {
                    insertBlock("image");
                  } else {
                    insertFileInputRef.current?.click();
                  }
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-center transition group"
              >
                <div className="p-3 rounded-full bg-slate-100 text-slate-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <ImageIcon size={20} />
                </div>
                <span className="text-xs font-bold text-slate-800">Photo / Image</span>
                <span className="text-[11px] text-slate-400">Upload or choose photo</span>
              </button>

              <button
                type="button"
                onClick={() => insertBlock("table")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-center transition group"
              >
                <div className="p-3 rounded-full bg-slate-100 text-slate-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <TableIcon size={20} />
                </div>
                <span className="text-xs font-bold text-slate-800">Data Table</span>
                <span className="text-[11px] text-slate-400">Structured geological table</span>
              </button>

              <button
                type="button"
                onClick={() => insertBlock("chart")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-center transition group"
              >
                <div className="p-3 rounded-full bg-slate-100 text-slate-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <BarChart2 size={20} />
                </div>
                <span className="text-xs font-bold text-slate-800">Geological Chart</span>
                <span className="text-[11px] text-slate-400">Mineral composition chart</span>
              </button>

              <button
                type="button"
                onClick={() => insertBlock("callout")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-center transition group"
              >
                <div className="p-3 rounded-full bg-slate-100 text-slate-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Quote size={20} />
                </div>
                <span className="text-xs font-bold text-slate-800">Callout Quote</span>
                <span className="text-[11px] text-slate-400">Highlighted insights quote</span>
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInsertModal(false)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

    {mainEl && (editingPage || insertedBlocks.length > 0) && createPortal(
      <div id="geocam-inserted-blocks-container" className="w-full max-w-5xl mx-auto my-8 px-4 space-y-6">
        {insertedBlocks.map((b) => (
          <div
            key={b.id}
            className="geocam-inserted-block-wrapper"
            dangerouslySetInnerHTML={{ __html: b.html }}
          />
        ))}
      </div>,
      mainEl
    )}

    {/* Interactive Crop Tool Modal */}
    {croppingImage && (
      <ImageCropperModal
        imageUrl={croppingImage.src}
        onClose={() => setCroppingImage(null)}
        onCrop={(croppedDataUrl) => {
          const rawKey = croppingImage.key;
          const entry: Entry = { kind: "image", value: croppedDataUrl };
          persistEntry(rawKey, entry);

          // Update insertedBlocks if this image belonged to an inserted block
          setInsertedBlocks((prev) => {
            const updated = prev.map((b) => {
              if (b.html.includes(rawKey) || b.html.includes(croppingImage.src)) {
                return {
                  ...b,
                  html: b.html.replace(/src="[^"]+"/, `src="${croppedDataUrl}"`),
                };
              }
              return b;
            });
            const bEntry: Entry = { kind: "text", value: JSON.stringify(updated) };
            setEntry(canonicalRoute + "::" + lang, blocksKey, bEntry);
            saveInline(canonicalRoute + "::" + lang, blocksKey, bEntry);
            if (cleanPath !== canonicalRoute) {
              setEntry(cleanPath + "::" + lang, "__inserted_blocks__", bEntry);
            }
            return updated;
          });

          // Also update any live img matching key or src in current DOM
          document
            .querySelectorAll(
              `img[data-cms-key="${rawKey}"], .geocam-target-active img, img.geocam-target-active`,
            )
            .forEach((img) => {
              (img as HTMLImageElement).src = croppedDataUrl;
            });

          setNotice("Cropped image applied and saved successfully!");
          setCroppingImage(null);
        }}
      />
    )}
  </>
);
}
