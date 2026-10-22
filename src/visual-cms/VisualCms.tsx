import {
  updateLinkedField,
  linkedEntry,
  rebaseDraft,
  pageChanges,
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
} from "lucide-react";
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
  "/research/topic",
  "/news/item",
  "/publications/view",
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
  const [showInsertModal, setShowInsertModal] = useState(false);
  const insertFileInputRef = useRef<HTMLInputElement>(null);
  const mainEl = typeof document !== "undefined" ? document.getElementById("main") : null;

  const [insertedBlocks, setInsertedBlocks] = useState<
    Array<{ id: string; type: string; html: string }>
  >(() => {
    try {
      const saved = active[normalizedPage + "::" + lang]?.["__inserted_blocks__"]?.value;
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      const saved = active[normalizedPage + "::" + lang]?.["__inserted_blocks__"]?.value;
      if (saved) {
        setInsertedBlocks(JSON.parse(saved));
        return;
      }
    } catch {}
    setInsertedBlocks([]);
  }, [normalizedPage, lang, active]);

  const insertBlock = (
    type: "paragraph" | "heading" | "image" | "table" | "chart" | "callout",
    customImageUrl?: string,
  ) => {
    const blockId = "block-" + Date.now();
    let blockHtml = "";

    if (type === "paragraph") {
      blockHtml = `
        <div class="my-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs geocam-editable geocam-inserted-block" data-cms-key="inserted-p-${blockId}">
          New paragraph text inserted. Double-click or select this text to edit and add your content.
        </div>
      `;
    } else if (type === "heading") {
      blockHtml = `
        <h2 class="my-4 text-2xl font-bold tracking-tight text-slate-900 geocam-editable geocam-inserted-block" data-cms-key="inserted-h2-${blockId}">
          New Section Heading
        </h2>
      `;
    } else if (type === "image") {
      const src =
        customImageUrl ||
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80";
      blockHtml = `
        <figure class="my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-md text-center geocam-inserted-block">
          <img src="${src}" alt="Inserted geological photo" class="rounded-xl w-full max-h-[480px] object-cover mx-auto geocam-editable" data-cms-key="inserted-img-${blockId}" />
          <figcaption class="text-xs text-slate-500 mt-2 text-center italic geocam-editable" data-cms-key="inserted-cap-${blockId}">Photo description and geological field notes</figcaption>
        </figure>
      `;
    } else if (type === "table") {
      blockHtml = `
        <div class="my-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm geocam-inserted-block">
          <h4 class="text-sm font-bold text-slate-900 mb-2 geocam-editable" data-cms-key="inserted-tbl-title-${blockId}">Geological Sample Inventory</h4>
          <table class="w-full text-left text-sm border-collapse border border-slate-200">
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
        <div class="my-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs geocam-inserted-block">
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
        <blockquote class="my-4 border-l-4 border-emerald-600 bg-emerald-50/70 p-4 rounded-r-xl italic text-slate-800 shadow-xs geocam-editable geocam-inserted-block" data-cms-key="inserted-quote-${blockId}">
          “Key scientific discovery or geological insight entered here...”
        </blockquote>
      `;
    }

    const nextBlocks = [...insertedBlocks, { id: blockId, type, html: blockHtml }];
    setInsertedBlocks(nextBlocks);
    setShowInsertModal(false);

    // Persist to CMS
    const key = "__inserted_blocks__";
    const entry: Entry = {
      kind: "text",
      value: JSON.stringify(nextBlocks),
    };
    setEntry(normalizedPage + "::" + lang, key, entry);
    saveInline(normalizedPage + "::" + lang, key, entry);
    setNotice("Content block inserted successfully! Click to edit text or images.");
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

            {/* Inserter Button */}
            <button
              type="button"
              onClick={() => setShowInsertModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition"
            >
              <Plus size={14} /> + Insert Content
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
                onClick={() => insertFileInputRef.current?.click()}
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
  </>
);
}
