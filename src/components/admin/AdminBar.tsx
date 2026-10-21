import { useAdmin } from "@/admin/Auth";
import { useCms, editablePages, normalizeRoute } from "@/visual-cms/VisualCms";
import { supabase } from "@/lib/supabase";
import { Link } from "@/lib/spa-router";
import { useState, useEffect } from "react";
import {
  Edit3,
  Plus,
  Sparkles,
  LogOut,
} from "lucide-react";

export function AdminBar() {
  const { admin } = useAdmin();
  const { ready, busy, editing, setEditing, publish, flushInline } = useCms();
  const [currentPath, setCurrentPath] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/",
  );
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState("");

  useEffect(() => {
    const onPop = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (!admin) return null;

  const normalized = normalizeRoute(currentPath);
  const isEditable = editablePages.includes(normalized);
  const queryParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const queryId = queryParams.get("id");

  const handlePublish = async () => {
    setPublishing(true);
    setPublishStatus("Publishing…");
    try {
      await publish();
      setPublishStatus("Live!");
      setTimeout(() => setPublishStatus(""), 3000);
    } catch {
      setPublishStatus("Failed");
      setTimeout(() => setPublishStatus(""), 3000);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div
      data-cms-ui="top-admin-bar"
      className="sticky top-0 z-[1200] flex h-9 w-full items-center justify-between border-b border-slate-700 bg-slate-900 px-3 text-xs text-slate-200 shadow-md select-none"
    >
      {/* Left: Brand + Contextual Editing Tools + Quick Inserters */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
        {/* GeoCam Admin Brand */}
        <Link
          to="/admin"
          className="flex items-center gap-1.5 font-bold text-white hover:text-emerald-400 transition"
          title="Open GeoCam Admin Dashboard"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-600 font-black text-[10px] text-white">
            G
          </span>
          <span className="hidden sm:inline font-mono">GeoCam Admin</span>
        </Link>

        <span className="text-slate-600">|</span>

        {/* Dynamic Contextual Edit Button for this specific Page / Post */}
        {normalized === "/news/item" && queryId ? (
          <Link
            to={`/admin?section=posts&edit=${encodeURIComponent(queryId)}`}
            className="flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-0.5 font-semibold text-white hover:bg-emerald-500 transition shadow-sm"
            title="Edit this post in the Rich Post Editor"
          >
            <Edit3 size={12} />
            <span>Edit this Post</span>
          </Link>
        ) : normalized === "/publications/view" ? (
          <Link
            to="/admin?section=publications"
            className="flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-0.5 font-semibold text-white hover:bg-emerald-500 transition shadow-sm"
            title="Edit in Publications Manager"
          >
            <Edit3 size={12} />
            <span>Edit Publication</span>
          </Link>
        ) : normalized === "/research/topic" ? (
          <Link
            to="/admin?section=pages&page=/research"
            className="flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-0.5 font-semibold text-white hover:bg-emerald-500 transition shadow-sm"
            title="Edit Research in Admin"
          >
            <Edit3 size={12} />
            <span>Edit Research Page</span>
          </Link>
        ) : isEditable ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setEditing(!editing)}
              disabled={!ready || busy}
              className={`flex items-center gap-1 rounded px-2.5 py-0.5 font-semibold transition ${
                editing
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }`}
              title={
                editing
                  ? "Finish visual on-page editing"
                  : "Edit this page visually inline"
              }
            >
              <Edit3 size={12} />
              <span>{editing ? "Finish Editing" : "Edit Page"}</span>
            </button>
            <Link
              to={`/admin?section=pages&page=${encodeURIComponent(normalized)}`}
              className="hidden md:flex items-center gap-1 text-slate-400 hover:text-white transition px-1"
              title="Edit in Admin Pages manager"
            >
              (in Admin)
            </Link>
          </div>
        ) : (
          <Link
            to={`/admin?section=pages&page=${encodeURIComponent(normalized)}`}
            className="flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-0.5 font-semibold text-white hover:bg-emerald-500 transition shadow-sm"
          >
            <Edit3 size={12} />
            <span>Edit in Admin</span>
          </Link>
        )}

        {/* Quick "+ New" options */}
        <div className="hidden lg:flex items-center gap-2 text-slate-400">
          <span className="text-slate-600">|</span>
          <span className="text-[11px] font-semibold text-slate-400">
            Add New:
          </span>
          <Link
            to="/admin?section=posts&new=1"
            className="flex items-center gap-1 hover:text-emerald-400 transition"
            title="Create new post"
          >
            <Plus size={11} /> Post
          </Link>
          <Link
            to="/admin?section=publications"
            className="flex items-center gap-1 hover:text-emerald-400 transition"
            title="Add publication paper"
          >
            <Plus size={11} /> Paper
          </Link>
          <Link
            to="/admin?section=events"
            className="flex items-center gap-1 hover:text-emerald-400 transition"
            title="Create event"
          >
            <Plus size={11} /> Event
          </Link>
        </div>
      </div>

      {/* Right: Publish Live + Admin Panel link + Sign Out */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePublish}
          disabled={publishing || busy}
          className={`flex items-center gap-1 rounded px-2.5 py-0.5 font-bold shadow-sm transition ${
            publishStatus === "Live!"
              ? "bg-emerald-500 text-white"
              : "bg-emerald-600 text-white hover:bg-emerald-500"
          }`}
          title="Publish all site changes live to all visitors"
          aria-label="Publish changes live"
        >
          <Sparkles size={11} />
          <span>
            {publishStatus || (publishing ? "Publishing…" : "Publish Changes")}
          </span>
        </button>

        <Link
          to="/admin"
          className="hidden sm:inline font-medium text-slate-300 hover:text-white transition"
          title="Open Admin Dashboard"
        >
          Admin Panel
        </Link>

        <button
          onClick={async () => {
            await flushInline();
            await supabase.auth.signOut();
            window.location.reload();
          }}
          className="text-slate-400 hover:text-red-400 transition"
          title="Sign out of administration"
        >
          <LogOut size={12} />
        </button>
      </div>
    </div>
  );
}
