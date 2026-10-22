import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Files,
  Map,
  LogOut,
  ExternalLink,
  Eye,
  Save,
  Globe,
  Palette,
} from "lucide-react";
import { editablePages, useCms } from "./VisualCms";
import { supabase } from "../lib/supabase";
import PostManager from "../admin/PostManager";
import Appearance from "../admin/Appearance";
import LayerManager from "../features/geodata/LayerManager";
import type { MapDataset } from "../features/geodata/import-geodata";
import "../admin/admin.css";

const pageName = (path: string) =>
  path === "/"
    ? "Home"
    : path
        .slice(1)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
const sections = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "posts", name: "Posts", icon: FileText },
  { id: "pages", name: "Pages", icon: Files },
  { id: "geodata", name: "GeoData", icon: Map },
  { id: "appearance", name: "Appearance", icon: Palette },
];
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
  const requested =
    new URLSearchParams(location.search).get("section") || "dashboard";
  const section = sections.some((item) => item.id === requested)
    ? requested
    : "dashboard";
  const [page, setPage] = useState(editablePages[0]);
  const [language, setLanguage] = useState("en");
  const [message, setMessage] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [layers, setLayers] = useState<MapDataset[]>([]);
  const keyspace = page + "::" + language;
  const entries = Object.entries(
    draft[keyspace] || (language === "en" ? draft[page] : undefined) || {},
  );
  const countFields = (store: typeof draft) =>
    Object.values(store).reduce(
      (count, entries) => count + Object.keys(entries).length,
      0,
    );
  const run = async (action: () => Promise<void>, success: string) => {
    setMessage("");
    try {
      await action();
      setMessage(success);
    } catch {
      setMessage("The request failed. Check the error and retry.");
    }
  };
  const signOut = () => {
    const proceed = async () => {
      await supabase.auth.signOut();
      location.assign("/admin/login");
    };
    const event = new CustomEvent("geocam:request-navigation", {
      cancelable: true,
      detail: { proceed },
    });
    window.dispatchEvent(event);
    if (!event.defaultPrevented) void proceed();
  };
  return (
    <div className="gc-admin" data-cms-ui>
      <header className="gc-admin-topbar">
        <a href="/admin/cms" className="gc-admin-brand">
          <span className="gc-admin-mark">G</span> GeoCam{" "}
          <span className="gc-admin-brand-label">Administration</span>
        </a>
        <div className="gc-admin-top-actions">
          <a href="/">
            <ExternalLink size={15} /> Visit site
          </a>
          <button onClick={signOut}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </header>
      <aside className="gc-admin-sidebar">
        <button
          className="gc-admin-menu-toggle"
          aria-expanded={mobileNav}
          onClick={() => setMobileNav(!mobileNav)}
        >
          Menu <span>{mobileNav ? "−" : "+"}</span>
        </button>
        <nav aria-label="Administration" className={mobileNav ? "is-open" : ""}>
          <p className="gc-admin-nav-label">WORKSPACE</p>
          {sections.map(({ id, name, icon: Icon }) => (
            <a
              key={id}
              href={`/admin/cms?section=${id}`}
              aria-current={section === id ? "page" : undefined}
            >
              <Icon size={19} />
              {name}
            </a>
          ))}
          <p className="gc-admin-nav-label gc-admin-nav-divider">
            CONNECTED RESOURCES
          </p>
          <a href="/research">
            <FileText size={18} />
            Research Library
            <ExternalLink size={13} className="gc-admin-nav-external" />
          </a>
          <a href="/environmental-monitoring">
            <Globe size={18} />
            Environmental Monitoring
            <ExternalLink size={13} className="gc-admin-nav-external" />
          </a>
        </nav>
        <div className="gc-admin-sidebar-footer">
          <span className="gc-admin-online" /> Administrator workspace
        </div>
      </aside>
      <main className="gc-admin-main">
        <div className="gc-admin-heading">
          <div>
            <p className="gc-admin-eyebrow">GEOCAM / CONTENT MANAGEMENT</p>
            <h1>{sections.find((item) => item.id === section)?.name}</h1>
            <p>
              {section === "dashboard"
                ? "Your website, content, and geoscience data in one place."
                : section === "pages"
                  ? "Manage English and Khmer page content."
                  : section === "posts"
                    ? "Create and manage website posts."
                    : section === "appearance"
                      ? "Choose and approve website fonts."
                      : "Upload, organize, and publish map layers."}
            </p>
          </div>
          <a
            className="gc-admin-button"
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            <Eye size={16} />
            View website
          </a>
        </div>
        {section === "posts" && <PostManager />}
        {section === "appearance" && <Appearance />}
        {section === "dashboard" && (
          <>
            <div className="gc-admin-stats">
              {[
                {
                  label: "Editable pages",
                  value: editablePages.length,
                  detail: "English and Khmer content",
                },
                {
                  label: "Draft page fields",
                  value: ready ? countFields(draft) : "—",
                  detail: "Fields in the saved editing workspace",
                },
                {
                  label: "Published page fields",
                  value: countFields(published),
                  detail: "Content available to visitors",
                },
              ].map((stat) => (
                <article
                  className="gc-admin-card gc-admin-stat"
                  key={stat.label}
                >
                  <p>{stat.label}</p>
                  <strong>{stat.value}</strong>
                  <span>{stat.detail}</span>
                </article>
              ))}
            </div>
            <div className="gc-admin-overview-grid">
              <section className="gc-admin-card">
                <div className="gc-admin-card-heading">
                  <h2>Start creating</h2>
                  <span>CONTENT</span>
                </div>
                <a
                  className="gc-admin-action-row"
                  href="/admin/cms?section=posts"
                >
                  <FileText />
                  <div>
                    <strong>Manage posts</strong>
                    <p>Write, preview, and publish website posts.</p>
                  </div>
                  <span>→</span>
                </a>
                <a
                  className="gc-admin-action-row"
                  href="/admin/cms?section=pages"
                >
                  <Files />
                  <div>
                    <strong>Edit website pages</strong>
                    <p>Review page fields and publish your changes.</p>
                  </div>
                  <span>→</span>
                </a>
                <a
                  className="gc-admin-action-row"
                  href="/admin/cms?section=geodata"
                >
                  <Map />
                  <div>
                    <strong>Manage GeoData</strong>
                    <p>Upload and organize geoscience map layers.</p>
                  </div>
                  <span>→</span>
                </a>
              </section>
              <section className="gc-admin-card gc-admin-publishing">
                <div className="gc-admin-card-heading">
                  <h2>Publishing guide</h2>
                  <Globe size={19} />
                </div>
                <h3>Choose how you edit</h3>
                <p>
                  Changes in the Pages dashboard stay private until you choose{" "}
                  <strong>Publish website changes</strong>. Use{" "}
                  <strong>Save draft</strong> to keep work for later.
                </p>
                <p>
                  Visual edits made directly on public pages publish
                  automatically. English is the source for Khmer text. Images
                  are shared across languages.
                </p>
                <a href="/admin/cms?section=pages" className="gc-admin-button">
                  Open page editor →
                </a>
              </section>
            </div>
            {error && (
              <p className="gc-admin-notice is-error" role="alert">
                {error}
              </p>
            )}
          </>
        )}
        {section === "pages" && (
          <>
            <div className="gc-admin-card gc-admin-page-toolbar">
              <div className="gc-admin-selectors">
                <label>
                  Page
                  <select
                    value={page}
                    onChange={(event) => {
                      setPage(event.target.value);
                      setMessage("");
                    }}
                  >
                    {editablePages.map((path) => (
                      <option key={path} value={path}>
                        {pageName(path)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Language
                  <select
                    value={language}
                    onChange={(event) => {
                      setLanguage(event.target.value);
                      setMessage("");
                    }}
                  >
                    <option value="en">English</option>
                    <option value="km">Khmer / ខ្មែរ</option>
                  </select>
                </label>
              </div>
              <a
                className="gc-admin-button"
                href={page}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={15} />
                Preview page
              </a>
            </div>
            <div className="gc-admin-notice">
              <strong>Page drafts require publishing.</strong> Save draft keeps
              these edits private. Publish website changes publishes the
              complete page draft across all pages and languages. Direct visual
              editing on the public website publishes automatically.
            </div>
            <div className="gc-admin-page-layout">
              <section className="gc-admin-card">
                <div className="gc-admin-card-heading">
                  <h2>{pageName(page)} content</h2>
                  <span>{entries.length} FIELDS</span>
                </div>
                {!ready ? (
                  <p className="gc-admin-empty">
                    {error
                      ? "Page drafts could not be loaded."
                      : "Loading page content…"}
                  </p>
                ) : entries.length === 0 ? (
                  <div className="gc-admin-empty">
                    <Files size={30} />
                    <h3>No saved overrides for this page</h3>
                    <p>
                      Open the page and use its visual editor to edit existing
                      content. Saved page fields will appear here.
                    </p>
                    <a className="gc-admin-button" href={page}>
                      Open {pageName(page)}
                    </a>
                  </div>
                ) : (
                  <div className="gc-admin-fields">
                    {entries.map(([key, entry], index) => {
                      const explicit = !key.includes(":") && !key.includes("/");
                      const label = explicit
                        ? key
                            .replace(/[-_]/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())
                        : entry.kind === "image"
                          ? `Page image ${index + 1}`
                          : entry.value
                              .replace(/<[^>]*>/g, "")
                              .trim()
                              .slice(0, 90) || `Text field ${index + 1}`;
                      return (
                        <div className="gc-admin-field-row" key={key}>
                          <label htmlFor={`page-field-${index}`}>{label}</label>
                          {entry.kind === "image" && (
                            <img
                              className="gc-admin-image-preview"
                              src={entry.value}
                              alt={label}
                            />
                          )}{" "}
                          {entry.kind === "text" ? (
                            <textarea
                              id={`page-field-${index}`}
                              disabled={!ready || busy}
                              value={entry.value}
                              onChange={(event) =>
                                setEntry(
                                  draft[keyspace]
                                    ? keyspace
                                    : language === "en" && draft[page]
                                      ? page
                                      : keyspace,
                                  key,
                                  { kind: "text", value: event.target.value },
                                )
                              }
                            />
                          ) : (
                            <input
                              id={`page-field-${index}`}
                              type="url"
                              aria-label={`${label} URL`}
                              disabled={busy}
                              value={entry.value}
                              onChange={(event) =>
                                setEntry(
                                  draft[keyspace]
                                    ? keyspace
                                    : language === "en" && draft[page]
                                      ? page
                                      : keyspace,
                                  key,
                                  { kind: "image", value: event.target.value },
                                )
                              }
                            />
                          )}
                          <details>
                            <summary>Field reference</summary>
                            <code>{key}</code>
                          </details>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
              <aside className="gc-admin-card gc-admin-publish-panel">
                <h2>Publish</h2>
                <p
                  role="status"
                  aria-live="polite"
                  className={
                    error ? "gc-admin-status is-error" : "gc-admin-status"
                  }
                >
                  {error ||
                    message ||
                    (!ready
                      ? "Loading drafts…"
                      : busy
                        ? "Saving changes…"
                        : dirty
                          ? "Unsaved page changes"
                          : "Page drafts loaded")}
                </p>
                <button
                  className="gc-admin-button"
                  disabled={!ready || busy || !dirty}
                  onClick={() =>
                    void run(save, "Page draft saved. Publish when ready.")
                  }
                >
                  <Save size={16} />
                  Save draft
                </button>
                <button
                  className="gc-admin-button is-primary"
                  disabled={!ready || busy}
                  onClick={() => {
                    if (
                      confirm(
                        "Publish all website page drafts for every visitor?",
                      )
                    )
                      void run(publish, "Website page changes published.");
                  }}
                >
                  <Globe size={16} />
                  Publish website changes
                </button>
                <p>Publishing updates every page and language in this draft.</p>
                <button
                  className="gc-admin-text-button"
                  disabled={!ready || busy}
                  onClick={() => {
                    if (
                      confirm(
                        "Replace all page drafts with the last published content? Unsaved page edits will be replaced.",
                      )
                    ) {
                      restore(published);
                      setMessage(
                        "Published content restored to the draft. Save to keep it.",
                      );
                    }
                  }}
                >
                  Restore published version
                </button>
              </aside>
            </div>
          </>
        )}
        {section === "geodata" && (
          <>
            <div className="gc-admin-notice">
              <strong>Map layer library</strong>
              <p>
                Upload GeoJSON, KML, or KMZ files up to 20 MB each. Parsed
                layers must be under 10 MB. Use WGS84 coordinates for GeoJSON.
                Layers are uploaded as private drafts; publish them when ready.
              </p>
              <a
                className="gc-admin-button"
                href="/geodata"
                target="_blank"
                rel="noreferrer"
              >
                <Map size={16} />
                Open map preview
              </a>
            </div>
            <div className="gc-admin-geodata">
              <LayerManager onLayers={setLayers} />
            </div>
            <p className="gc-admin-footnote">
              {layers.length} layers in the current library view. Preview
              styling and visible layers on the GeoData map.
            </p>
          </>
        )}
        <footer className="gc-admin-footer">
          GeoCam <span>Geoscience Association of Cambodia</span>
        </footer>
      </main>
    </div>
  );
}
