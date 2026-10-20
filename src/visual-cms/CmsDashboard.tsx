import { useState } from "react";
import { editablePages, useCms } from "./VisualCms";
import { supabase } from "../lib/supabase";
const paths = editablePages;
export function CmsDashboard() {
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
    restore,
  } = useCms();
  const [message, setMessage] = useState("");
  const run = async (action: () => Promise<void>, message: string) => {
    try {
      await action();
      setMessage(message);
    } catch {
      setMessage("The request failed. Check the error and retry.");
    }
  };
  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <p className="eyebrow">GeoCam administration</p>
      <h1 className="mt-3 text-4xl font-bold">Content dashboard</h1>
      <p className="my-5">
        Open a page, choose Visual edit, and click text or an image. Save draft
        keeps changes private. Publish makes them visible to all visitors. Edit
        English and Khmer separately using the site language switch.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          className="btn btn-outline"
          disabled={!ready || busy}
          onClick={() => run(save, "Draft saved.")}
        >
          Save draft
        </button>
        <button
          className="btn btn-primary"
          disabled={!ready || busy}
          onClick={() => {
            if (confirm("Publish this draft for all visitors?"))
              void run(publish, "Published for all visitors.");
          }}
        >
          Publish website changes
        </button>
        <button
          className="btn btn-outline"
          disabled={!ready || busy}
          onClick={() => {
            if (confirm("Replace the draft with the last published content?")) {
              restore(published);
              setMessage(
                "Published content restored to the draft. Save to keep it.",
              );
            }
          }}
        >
          Restore published version
        </button>
        <button
          className="btn btn-outline"
          onClick={async () => {
            await supabase.auth.signOut();
            location.assign("/admin/login");
          }}
        >
          Sign out
        </button>
      </div>
      <p className="my-4" role="status">
        {error ||
          message ||
          (!ready
            ? "Loading drafts…"
            : dirty
              ? "Unsaved changes"
              : "Drafts loaded")}
      </p>
      <a className="btn btn-primary mt-6" href="/geodata">
        Upload and manage geodata
      </a>
      <h2 className="mt-8 text-2xl font-bold">Edit a page</h2>
      <div className="my-5 flex flex-wrap gap-3">
        {paths.map((path) => (
          <a className="btn btn-outline" key={path} href={path}>
            {path === "/" ? "Home" : path.slice(1)}
          </a>
        ))}
      </div>
      <h2 className="mt-8 text-2xl font-bold">Draft content</h2>
      {Object.entries(draft).flatMap(([page, entries]) =>
        Object.entries(entries).map(([key, entry]) => (
          <label key={page + key} className="my-4 block rounded-lg border p-4">
            <span className="mb-2 block text-sm">
              {page} · {key}
            </span>
            {entry.kind === "text" ? (
              <textarea
                className="field min-h-24 w-full"
                disabled={busy}
                value={entry.value}
                onChange={(event) =>
                  setEntry(page, key, {
                    kind: "text",
                    value: event.target.value,
                  })
                }
              />
            ) : (
              <img
                className="max-h-32"
                src={entry.value}
                alt="Draft page image"
              />
            )}
          </label>
        )),
      )}
    </section>
  );
}
