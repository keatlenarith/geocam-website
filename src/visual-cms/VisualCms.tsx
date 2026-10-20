import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { supabase } from "../lib/supabase";
import { useAdmin } from "../admin/Auth";
import { useI18n } from "../lib/i18n";
import { khmerLabels } from "../lib/auto-khmer";
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
  const [ready, setReady] = useState(false),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [editing, setEditing] = useState(false),
    [error, setError] = useState("");
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
    setReady(false);
    setEditing(false);
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
          setDraft(data.content as Store);
          setReady(true);
        });
    return () => {
      current = false;
    };
  }, [admin]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const setEntry = (page: string, key: string, entry: Entry) => {
    if (!admin || !ready || busy) return;
    setDraft((value) => ({
      ...value,
      [page]: { ...value[page], [key]: entry },
    }));
    setDirty(true);
  };
  const write = async (publish: boolean) => {
    if (!admin || !ready || busy)
      throw Error("Administrator access and loaded drafts are required.");
    setBusy(true);
    setError("");
    try {
      const row = {
        id: "site",
        content: draft,
        updated_at: new Date().toISOString(),
      };
      const saved = await supabase.from("geocam_drafts").upsert(row);
      if (saved.error) throw saved.error;
      setDirty(false);
      if (publish) {
        const result = await supabase.from("geocam_published").upsert(row);
        if (result.error) throw result.error;
        setPublished(structuredClone(draft));
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
        save: () => write(false),
        publish: () => write(true),
        restore: (value) => {
          if (admin && ready && !busy) {
            setDraft(structuredClone(value));
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
export const editablePages = ["/", "/about", "/research", "/membership", "/contact"];
const emptyContent: Store = {};
const originals = new WeakMap<Element, string>();
export function VisualCmsLayer({ page }: { page: string }) {
  const { admin } = useAdmin();
  const {
    draft,
    published,
    ready,
    dirty,
    busy,
    error,
    setEntry,
    save,
    publish,
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
    if (!main || page.startsWith("/admin")) return;
    const keyspace = page + "::" + lang;
    const apply = () => {
      for (const el of candidates(main)) {
        const key = stableKey(el, main);
        const image =
          el.tagName === "IMG" || el.hasAttribute("data-cms-background");
        if (!originals.has(el))
          originals.set(
            el,
            image
              ? el.tagName === "IMG"
                ? el.getAttribute("src") || ""
                : getComputedStyle(el).backgroundImage
              : el.textContent || "",
          );
        const original = originals.get(el) || "";
        const entry = active[keyspace]?.[key];
        const value =
          entry?.kind === (image ? "image" : "text")
            ? entry.value
            : !image && lang === "km"
              ? khmerLabels[original.trim()] || original
              : original;
        if (el.hasAttribute("data-cms-background"))
          el.style.backgroundImage =
            entry?.kind === "image"
              ? `url(${JSON.stringify(value)})`
              : original;
        else if (el.tagName === "IMG") {
          if (el.getAttribute("src") !== value) el.setAttribute("src", value);
        } else if (el.textContent !== value) el.textContent = value;
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
      event.preventDefault();
      event.stopPropagation();
      const key = el.dataset.cmsKey!;
      if (el.tagName === "IMG" || el.hasAttribute("data-cms-background")) {
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
          reader.onload = () =>
            setEntry(keyspace, key, {
              kind: "image",
              value: String(reader.result),
            });
          reader.readAsDataURL(file);
        };
        input.click();
      } else {
        const value = prompt("Edit text:", el.textContent || "");
        if (value !== null) setEntry(keyspace, key, { kind: "text", value });
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
  }, [page, lang, active, editingPage, busy, setEntry]);
  if (!admin || !editable || page.startsWith("/admin")) return null;
  const run = async (action: () => Promise<void>, message: string) => {
    try {
      await action();
      setNotice(message);
    } catch {
      setNotice("Request failed. Check the error and retry.");
    }
  };
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
        <button
          className="btn btn-outline !py-2"
          disabled={!ready || busy}
          onClick={() =>
            run(save, "Draft saved. Visitors still see the published version.")
          }
        >
          Save draft
        </button>
        <button
          className="btn btn-primary !py-2"
          disabled={!ready || busy}
          onClick={() => {
            if (confirm("Publish this draft for all visitors?"))
              void run(publish, "Published for all visitors.");
          }}
        >
          Publish
        </button>
        <button
          className="btn btn-outline !py-2"
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </button>
      </div>
      <p className="mt-2" role="status">
        {error ||
          notice ||
          (dirty ? "Unsaved draft changes" : "Administrator editing controls")}
      </p>
    </div>
  );
}
