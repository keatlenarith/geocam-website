import { updateLinkedField, linkedEntry, rebaseDraft } from "./linked-content";
import { attachInlineText } from "./inline-text";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
export function VisualCmsProvider({ children }: { children: React.ReactNode }) {
  const { admin } = useAdmin();
  const [draft, setDraft] = useState<Store>({}),
    [published, setPublished] = useState<Store>({});
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
        const { data, error } = await supabase.rpc("geocam_update_page_field", {
          p_page: item.page,
          p_key: item.key,
          p_entry: item.entry,
        });
        if (generation.current !== epoch) return false;
        if (error) {
          setInlineStatus(
            "Unable to save changes. Retry before leaving this page.",
          );
          return false;
        }
        if (pendingInline.current.get(id) === item)
          pendingInline.current.delete(id);
        setPublished(data.published as Store);
        const merged = rebaseDraft(
          data.draft as Store,
          savedDraftRef.current,
          draftRef.current,
        );
        savedDraftRef.current = data.draft as Store;
        draftRef.current = merged;
        setDraft(merged);
        if (!pendingInline.current.size)
          setDirty(
            JSON.stringify(draftRef.current) !== JSON.stringify(data.draft),
          );
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
    setPublished(live.data.content as Store);
    if (admin) {
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
      if (current && data) setPublished(data.content as Store);
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
        // Font drafts require the dedicated Approve action in Appearance.
        const currentLive = await supabase
          .from("geocam_published")
          .select("content")
          .eq("id", "site")
          .single();
        if (currentLive.error) throw currentLive.error;
        const content = structuredClone(row.content);
        if (currentLive.data.content.__appearance)
          content.__appearance = currentLive.data.content.__appearance;
        else delete content.__appearance;
        const result = await supabase
          .from("geocam_published")
          .upsert({ ...row, content });
        if (result.error) throw result.error;
        setPublished(content);
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
    editing,
    setEditing,
  } = useCms();
  const { lang } = useI18n();
  const editable = editablePages.includes(page);
  const active = editable ? (editing ? draft : published) : emptyContent;
  const editingPage = editing && editable;
  const refresh = useRef(0);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main || !editable || page.startsWith("/admin")) return;
    const keyspace = page + "::" + lang;
    const apply = () => {
      for (const el of candidates(main)) {
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
        const entry = linkedEntry(active, page, lang, key);
        const value =
          entry?.kind === (image ? "image" : "text")
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
          if (el.getAttribute("src") !== value) el.setAttribute("src", value);
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
      const el = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-cms-key]",
      );
      if (!el || !main.contains(el)) return;
      const key = el.dataset.cmsKey!;
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
            file.size > 1500000
          ) {
            setNotice("Choose a PNG, JPEG, WebP or GIF under 1.5 MB.");
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            const entry: Entry = {
              kind: "image",
              value: String(reader.result),
            };
            setEntry(keyspace, key, entry);
            saveInline(keyspace, key, entry);
          };
          reader.readAsDataURL(file);
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
    };
  }, [page, lang, active, editingPage, busy, setEntry, saveInline]);
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main || !editingPage || busy) return;
    return attachInlineText(main, {
      commit: (key, value) => {
        setEntry(page + "::" + lang, key, { kind: "text", value });
        setEntry(page + "::" + (lang === "en" ? "km" : "en"), key, {
          kind: "text",
          value: lang === "en" ? translateText(value) || value : value,
        });
        setEntry(page, key, { kind: "text", value });
      },
      complete: (key, value) =>
        saveInline(page + "::" + lang, key, { kind: "text", value }),
    });
  }, [page, lang, editingPage, busy, setEntry, saveInline]);
  useEffect(() => {
    if (!editingPage) return;
    const navigate = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (event.target as Element).closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("href")?.startsWith("#")
      )
        return;
      if (
        (event.target as Element).closest("[data-cms-key]") &&
        anchor.closest("#main")
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      (document.activeElement as HTMLElement)?.blur();
      void flushInline().then((saved) => {
        if (saved) location.assign(anchor.href);
      });
    };
    document.addEventListener("click", navigate, true);
    return () => document.removeEventListener("click", navigate, true);
  }, [editingPage, flushInline]);
  if (!admin || !editable || page.startsWith("/admin")) return null;
  return (
    <div
      data-cms-ui
      className="fixed bottom-5 right-5 z-[2000] max-w-[calc(100vw-2rem)] rounded-xl border bg-white p-3 shadow-2xl text-sm"
    >
      <div className="flex flex-wrap gap-2">
        <a className="btn btn-outline !py-2" href="/admin/cms">
          Dashboard
        </a>
        <button
          className="btn btn-primary !py-2"
          disabled={!ready || busy}
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Finish editing" : "Visual edit"}
        </button>
        {inlineStatus.startsWith("Unable") && (
          <button
            className="btn btn-outline !py-2"
            onClick={() => void flushInline()}
          >
            Retry save
          </button>
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
        <p className="mt-2 text-xs">
          {lang === "km"
            ? "Switch to English to edit source text. Images are shared across languages."
            : "Double-click text to edit. Select, copy, cut or paste normally. Enter finishes; Shift+Enter adds a line; Esc cancels."}
        </p>
      )}
      <p className="mt-2" role="status">
        {error || notice || inlineStatus || "Administrator editing controls"}
      </p>
    </div>
  );
}
