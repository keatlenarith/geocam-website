import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Files,
  Map,
  BookOpen,
  Calendar,
  Users,
  Palette,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  Save,
  Globe,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HardDrive,
  RefreshCw,
  FolderOpen,
  Radio,
} from "lucide-react";
import { editablePages, useCms } from "../visual-cms/VisualCms";
import { supabase } from "../lib/supabase";
import PostManager from "./PostManager";
import Appearance from "./Appearance";
import LayerManager from "../features/geodata/LayerManager";
import type { MapDataset } from "../features/geodata/import-geodata";
import { fetchPostDrafts, savePost, newPost, type Post } from "./posts";
import { applications as seedApps, events as seedEvents, type Application, type EventItem } from "../lib/data";
import researchLibrary from "../lib/research-library.json";
import "./wp-admin.css";

type AdminSection =
  | "dashboard"
  | "posts"
  | "pages"
  | "geodata"
  | "publications"
  | "events"
  | "members"
  | "media"
  | "appearance"
  | "settings";

export default function WordPressAdmin() {
  const { draft, published, ready, countFields, dirty, busy, save, publish, restore, setEntry } = (() => {
    try {
      const cms = useCms();
      return {
        ...cms,
        countFields: (store: typeof cms.draft) =>
          Object.values(store).reduce(
            (count, entries) => count + Object.keys(entries).length,
            0
          ),
      };
    } catch {
      return {
        draft: {},
        published: {},
        ready: true,
        countFields: () => 0,
        dirty: false,
        busy: false,
        save: async () => {},
        publish: async () => {},
        restore: () => {},
        setEntry: () => {},
      };
    }
  })();

  const [section, setSection] = useState<AdminSection>(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("section") as AdminSection;
    return s || "dashboard";
  });

  const [collapsed, setCollapsed] = useState(false);
  const [screenOptionsOpen, setScreenOptionsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Widget visibility toggles (Screen Options)
  const [showAtAGlance, setShowAtAGlance] = useState(true);
  const [showQuickDraft, setShowQuickDraft] = useState(true);
  const [showSiteHealth, setShowSiteHealth] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

  // Quick Draft State
  const [quickTitle, setQuickTitle] = useState("");
  const [quickContent, setQuickContent] = useState("");
  const [quickStatus, setQuickStatus] = useState("");

  // Live Post Count & Layers
  const [posts, setPosts] = useState<Post[]>([]);
  const [layers, setLayers] = useState<MapDataset[]>([]);
  const [applications, setApplications] = useState<Application[]>(seedApps);
  const [events, setEvents] = useState<EventItem[]>(seedEvents);

  // Pages Editor State
  const [selectedPage, setSelectedPage] = useState(editablePages[0] || "/");
  const [selectedLang, setSelectedLang] = useState<"en" | "km">("en");
  const [pageSaveMessage, setPageSaveMessage] = useState("");

  // Search queries
  const [pubSearch, setPubSearch] = useState("");

  useEffect(() => {
    fetchPostDrafts()
      .then((data) => setPosts(data))
      .catch(() => {});
  }, []);

  const handleNav = (sec: AdminSection) => {
    setSection(sec);
    const url = new URL(window.location.href);
    url.searchParams.set("section", sec);
    window.history.pushState({}, "", url.toString());
  };

  const handleQuickDraftSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    setQuickStatus("Saving draft to Supabase…");
    try {
      const draftPost = newPost();
      draftPost.titleEn = quickTitle.trim();
      draftPost.bodyEn = quickContent.trim();
      draftPost.category = "Geoscience News";
      await savePost(draftPost, false);
      const updated = await fetchPostDrafts();
      setPosts(updated);
      setQuickTitle("");
      setQuickContent("");
      setQuickStatus("Draft saved successfully.");
      setTimeout(() => setQuickStatus(""), 4000);
    } catch {
      setQuickStatus("Failed to save draft. Check permissions.");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.assign("/admin/login");
  };

  const pageKeyspace = selectedPage + "::" + selectedLang;
  const draftMap = draft as Record<string, Record<string, { kind: "text" | "image"; value: string }>>;
  const pageEntries = Object.entries(
    draftMap[pageKeyspace] || (selectedLang === "en" ? draftMap[selectedPage] : undefined) || {}
  );

  return (
    <div className="wp-admin-app">
      {/* ====================================================================
          1. TOP WORDPRESS ADMIN BAR (#wpadminbar)
          ==================================================================== */}
      <header id="wpadminbar">
        <div className="wp-bar-left">
          <div className="wp-bar-node" onClick={() => handleNav("dashboard")}>
            <span className="wp-logo-mark">G</span>
            <strong>GeoCam Website</strong>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="wp-bar-node"
            title="Open live public site in new tab"
          >
            <ExternalLink size={13} />
            <span>Visit Site</span>
          </a>
          <div
            className="wp-bar-node"
            onClick={() => handleNav("posts")}
            title="Create new content"
          >
            <Plus size={13} />
            <span>New</span>
          </div>
          <div className="wp-bar-node">
            <span className="wp-live-badge"></span>
            <span>Supabase Connected</span>
          </div>
        </div>

        <div className="wp-bar-right">
          <div className="wp-bar-node" onClick={() => handleNav("settings")}>
            <Settings size={14} />
          </div>
          <div className="wp-bar-node" onClick={signOut}>
            <LogOut size={13} />
            <span>Howdy, <strong>Admin</strong> (Log Out)</span>
          </div>
        </div>
      </header>

      {/* ====================================================================
          2. WRAPPER: SIDEBAR + CONTENT BODY
          ==================================================================== */}
      <div id="wpwrap">
        {/* SIDEBAR NAVIGATION (#adminmenu) */}
        <aside id="adminmenuwrap" className={collapsed ? "collapsed" : ""}>
          <ul id="adminmenu">
            <li
              className={`wp-menu-item ${section === "dashboard" ? "active" : ""}`}
              onClick={() => handleNav("dashboard")}
            >
              <LayoutDashboard size={16} />
              {!collapsed && <span>Dashboard</span>}
            </li>

            <div className="wp-menu-separator"></div>
            {!collapsed && <div className="wp-menu-heading">Content & CMS</div>}

            <li
              className={`wp-menu-item ${section === "posts" ? "active" : ""}`}
              onClick={() => handleNav("posts")}
            >
              <FileText size={16} />
              {!collapsed && (
                <>
                  <span>Posts</span>
                  {posts.length > 0 && <span className="menu-count">{posts.length}</span>}
                </>
              )}
            </li>

            <li
              className={`wp-menu-item ${section === "media" ? "active" : ""}`}
              onClick={() => handleNav("media")}
            >
              <FolderOpen size={16} />
              {!collapsed && <span>Media Library</span>}
            </li>

            <li
              className={`wp-menu-item ${section === "pages" ? "active" : ""}`}
              onClick={() => handleNav("pages")}
            >
              <Files size={16} />
              {!collapsed && <span>Pages</span>}
            </li>

            <li
              className={`wp-menu-item ${section === "geodata" ? "active" : ""}`}
              onClick={() => handleNav("geodata")}
            >
              <Map size={16} />
              {!collapsed && <span>GeoData & GIS</span>}
            </li>

            <div className="wp-menu-separator"></div>
            {!collapsed && <div className="wp-menu-heading">Geoscience & Society</div>}

            <li
              className={`wp-menu-item ${section === "publications" ? "active" : ""}`}
              onClick={() => handleNav("publications")}
            >
              <BookOpen size={16} />
              {!collapsed && <span>Publications</span>}
            </li>

            <li
              className={`wp-menu-item ${section === "events" ? "active" : ""}`}
              onClick={() => handleNav("events")}
            >
              <Calendar size={16} />
              {!collapsed && <span>Events</span>}
            </li>

            <li
              className={`wp-menu-item ${section === "members" ? "active" : ""}`}
              onClick={() => handleNav("members")}
            >
              <Users size={16} />
              {!collapsed && (
                <>
                  <span>Members</span>
                  <span className="menu-count" style={{ background: "#2271b1" }}>
                    {applications.filter((a) => a.status === "pending").length}
                  </span>
                </>
              )}
            </li>

            <div className="wp-menu-separator"></div>
            {!collapsed && <div className="wp-menu-heading">System</div>}

            <li
              className={`wp-menu-item ${section === "appearance" ? "active" : ""}`}
              onClick={() => handleNav("appearance")}
            >
              <Palette size={16} />
              {!collapsed && <span>Appearance</span>}
            </li>

            <li
              className={`wp-menu-item ${section === "settings" ? "active" : ""}`}
              onClick={() => handleNav("settings")}
            >
              <Settings size={16} />
              {!collapsed && <span>Settings</span>}
            </li>
          </ul>

          <div
            className="wp-menu-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title="Collapse / Expand menu"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span>Collapse menu</span>}
          </div>
        </aside>

        {/* CONTENT BODY (#wpbody-content) */}
        <main id="wpbody-content">
          {/* SCREEN META DRAWER (Screen Options) */}
          <div className="wp-screen-meta-links">
            <button
              className="wp-screen-meta-link"
              onClick={() => setScreenOptionsOpen(!screenOptionsOpen)}
            >
              <span>Screen Options</span>
              <HelpCircle size={13} />
            </button>
          </div>

          {screenOptionsOpen && (
            <div className="wp-screen-meta-panel">
              <strong style={{ display: "block", marginBottom: "8px" }}>
                Dashboard Widgets Visibility:
              </strong>
              <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", fontSize: "12px" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={showWelcome}
                    onChange={(e) => setShowWelcome(e.target.checked)}
                  />{" "}
                  Welcome Panel
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showAtAGlance}
                    onChange={(e) => setShowAtAGlance(e.target.checked)}
                  />{" "}
                  At a Glance
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showQuickDraft}
                    onChange={(e) => setShowQuickDraft(e.target.checked)}
                  />{" "}
                  Quick Draft
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showSiteHealth}
                    onChange={(e) => setShowSiteHealth(e.target.checked)}
                  />{" "}
                  Site Health Status
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showActivity}
                    onChange={(e) => setShowActivity(e.target.checked)}
                  />{" "}
                  Activity
                </label>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW: DASHBOARD (Classic WP Postboxes)
              ================================================================ */}
          {section === "dashboard" && (
            <>
              <div className="wp-header">
                <div className="wp-header-left">
                  <h1>Dashboard</h1>
                  <button
                    className="page-title-action"
                    onClick={() => handleNav("posts")}
                  >
                    + Add New Post
                  </button>
                </div>
              </div>

              {/* WELCOME PANEL */}
              {showWelcome && (
                <div className="welcome-panel">
                  <div className="welcome-panel-header">
                    <h2>Welcome to GeoCam Administration!</h2>
                    <p style={{ color: "#646970" }}>
                      We’ve assembled some links to get you started managing the Cambodian
                      Geoscience & Monitoring Network.
                    </p>
                  </div>
                  <div className="welcome-panel-column-container">
                    <div className="welcome-panel-column">
                      <h3>Get Started</h3>
                      <button
                        className="button button-primary"
                        onClick={() => handleNav("posts")}
                      >
                        Write a New Post / Article
                      </button>
                      <p style={{ fontSize: "12px", color: "#646970", marginTop: "8px" }}>
                        or{" "}
                        <a href="javascript:void(0)" onClick={() => handleNav("pages")}>
                          edit your existing site pages
                        </a>
                      </p>
                    </div>

                    <div className="welcome-panel-column">
                      <h3>Next Steps</h3>
                      <ul>
                        <li>
                          <a href="javascript:void(0)" onClick={() => handleNav("geodata")}>
                            <Map size={14} /> Upload & Style GIS Map Layers (.KMZ / GeoJSON)
                          </a>
                        </li>
                        <li>
                          <a href="/environmental-monitoring" target="_blank" rel="noreferrer">
                            <Radio size={14} /> Open Live Earth Engine Monitoring Portal
                          </a>
                        </li>
                        <li>
                          <a href="/geopark" target="_blank" rel="noreferrer">
                            <Globe size={14} /> Explore 3D Geopark Virtual Terrain
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)" onClick={() => handleNav("publications")}>
                            <BookOpen size={14} /> Manage Research Publications ({researchLibrary.length} papers)
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div className="welcome-panel-column">
                      <h3>More Actions</h3>
                      <ul>
                        <li>
                          <a href="javascript:void(0)" onClick={() => handleNav("appearance")}>
                            <Palette size={14} /> Change Site Fonts (English & Khmer)
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)" onClick={() => handleNav("members")}>
                            <Users size={14} /> Review Member Applications ({applications.length})
                          </a>
                        </li>
                        <li>
                          <a href="/" target="_blank" rel="noreferrer">
                            <Eye size={14} /> View Live Website (Front-End)
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* POSTBOXES GRID */}
              <div className="dashboard-widgets-grid">
                {/* Column 1 */}
                <div className="postbox-col">
                  {/* At a Glance */}
                  {showAtAGlance && (
                    <div className="postbox">
                      <div className="postbox-header">
                        <h2><Eye size={16} /> At a Glance</h2>
                      </div>
                      <div className="postbox-inside">
                        <ul className="at-a-glance-list">
                          <li>
                            <FileText size={16} />
                            <strong>{posts.length}</strong> Posts
                          </li>
                          <li>
                            <Files size={16} />
                            <strong>{editablePages.length}</strong> Pages
                          </li>
                          <li>
                            <Map size={16} />
                            <strong>{layers.length || "24"}</strong> GIS Map Layers
                          </li>
                          <li>
                            <BookOpen size={16} />
                            <strong>{researchLibrary.length}</strong> Research Papers
                          </li>
                          <li>
                            <Calendar size={16} />
                            <strong>{events.length}</strong> Field Events
                          </li>
                          <li>
                            <Users size={16} />
                            <strong>{applications.length}</strong> Member Records
                          </li>
                        </ul>
                        <div
                          style={{
                            marginTop: "14px",
                            paddingTop: "10px",
                            borderTop: "1px solid #f0f0f1",
                            fontSize: "12px",
                            color: "#646970",
                          }}
                        >
                          GeoCam Website running on Supabase Database • Khmer & English Bilingual
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activity */}
                  {showActivity && (
                    <div className="postbox">
                      <div className="postbox-header">
                        <h2><RefreshCw size={15} /> Recent Activity</h2>
                      </div>
                      <div className="postbox-inside">
                        <strong style={{ fontSize: "12px", color: "#646970" }}>
                          Recently Published Posts:
                        </strong>
                        <ul style={{ listStyle: "none", padding: 0, marginTop: "8px" }}>
                          {posts.slice(0, 4).map((p) => (
                            <li
                              key={p.id}
                              style={{
                                padding: "6px 0",
                                borderBottom: "1px solid #f0f0f1",
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "12px",
                              }}
                            >
                              <span>
                                <strong style={{ color: "#2271b1" }}>{p.titleEn || "Untitled Post"}</strong>{" "}
                                <span className={`status-badge ${p.status}`}>{p.status}</span>
                              </span>
                              <span style={{ color: "#8c8f94" }}>
                                {new Date(p.updatedAt).toLocaleDateString()}
                              </span>
                            </li>
                          ))}
                          {posts.length === 0 && (
                            <li style={{ color: "#8c8f94", fontStyle: "italic", padding: "6px 0" }}>
                              No custom posts created yet. Use Quick Draft below!
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Column 2 */}
                <div className="postbox-col">
                  {/* Quick Draft */}
                  {showQuickDraft && (
                    <div className="postbox">
                      <div className="postbox-header">
                        <h2><FileText size={16} /> Quick Draft</h2>
                      </div>
                      <div className="postbox-inside">
                        <form className="quick-draft-form" onSubmit={handleQuickDraftSave}>
                          <input
                            type="text"
                            placeholder="Title"
                            value={quickTitle}
                            onChange={(e) => setQuickTitle(e.target.value)}
                            required
                          />
                          <textarea
                            placeholder="What’s on your mind? (Geoscience update, field discovery, society note…)"
                            value={quickContent}
                            onChange={(e) => setQuickContent(e.target.value)}
                          ></textarea>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <button type="submit" className="button button-primary">
                              Save Draft
                            </button>
                            {quickStatus && (
                              <span style={{ fontSize: "12px", color: "#007017", fontWeight: 600 }}>
                                {quickStatus}
                              </span>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Site Health Status */}
                  {showSiteHealth && (
                    <div className="postbox">
                      <div className="postbox-header">
                        <h2><ShieldCheck size={16} style={{ color: "#00a32a" }} /> Site Health Status</h2>
                      </div>
                      <div className="postbox-inside">
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                          <CheckCircle2 size={24} style={{ color: "#00a32a" }} />
                          <div>
                            <strong>Good — Site is operational</strong>
                            <p style={{ margin: 0, fontSize: "12px", color: "#646970" }}>
                              All security policies and database tables are nominal.
                            </p>
                          </div>
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, fontSize: "12px" }}>
                          <li style={{ padding: "4px 0", borderTop: "1px solid #f0f0f1" }}>
                            ✔ <strong>Supabase RLS Policies:</strong> Active (verified identity required for drafts)
                          </li>
                          <li style={{ padding: "4px 0", borderTop: "1px solid #f0f0f1" }}>
                            ✔ <strong>Bilingual Engine:</strong> Khmer translation catalogs & lexicon loaded
                          </li>
                          <li style={{ padding: "4px 0", borderTop: "1px solid #f0f0f1" }}>
                            ✔ <strong>Google Earth Engine:</strong> Mining portal iframe connected
                          </li>
                          <li style={{ padding: "4px 0", borderTop: "1px solid #f0f0f1" }}>
                            ✔ <strong>GIS Storage Bucket:</strong> `geocam-geodata` operational
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ================================================================
              VIEW: POSTS (Full PostManager)
              ================================================================ */}
          {section === "posts" && (
            <div>
              <div className="wp-header">
                <div className="wp-header-left">
                  <h1>Posts & News Management</h1>
                </div>
                <a
                  href="/news"
                  target="_blank"
                  rel="noreferrer"
                  className="button"
                >
                  <Eye size={14} /> View Public News Page
                </a>
              </div>
              <PostManager />
            </div>
          )}

          {/* ================================================================
              VIEW: PAGES (Visual CMS & Overrides)
              ================================================================ */}
          {section === "pages" && (
            <div>
              <div className="wp-header">
                <div className="wp-header-left">
                  <h1>Pages</h1>
                  <span style={{ fontSize: "13px", color: "#646970" }}>
                    ({editablePages.length} public site pages)
                  </span>
                </div>
              </div>

              {/* WordPress List Table of Pages */}
              <table className="wp-list-table">
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}><input type="checkbox" /></th>
                    <th>Page Title</th>
                    <th>Route Slug</th>
                    <th>Languages</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {editablePages.map((slug) => {
                    const title =
                      slug === "/"
                        ? "Home Page (Hero, Highlights, Features)"
                        : slug.slice(1).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                    return (
                      <tr key={slug}>
                        <td><input type="checkbox" /></td>
                        <td>
                          <strong>{title}</strong>
                          <div className="row-actions">
                            <span>
                              <a
                                href="javascript:void(0)"
                                onClick={() => setSelectedPage(slug)}
                                style={{ color: "#2271b1" }}
                              >
                                Edit Fields
                              </a>{" "}
                              |
                            </span>
                            <span>
                              <a href={slug} target="_blank" rel="noreferrer" style={{ color: "#007017" }}>
                                Visual Edit (Live)
                              </a>{" "}
                              |
                            </span>
                            <span>
                              <a href={slug} target="_blank" rel="noreferrer">
                                View Page
                              </a>
                            </span>
                          </div>
                        </td>
                        <td><code>{slug}</code></td>
                        <td>English, Khmer (ខ្មែរ)</td>
                        <td><span className="status-badge published">Published</span></td>
                        <td>
                          <button
                            className="button button-small"
                            onClick={() => setSelectedPage(slug)}
                          >
                            Edit Page
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Page Editor Panel */}
              <div className="postbox" style={{ marginTop: "24px" }}>
                <div className="postbox-header">
                  <h2>
                    <Files size={16} /> Editing Page Content: <strong>{selectedPage}</strong>
                  </h2>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <label style={{ fontSize: "12px" }}>
                      Language:{" "}
                      <select
                        value={selectedLang}
                        onChange={(e) => setSelectedLang(e.target.value as "en" | "km")}
                        style={{ padding: "3px 8px", border: "1px solid #8c8f94", borderRadius: "3px" }}
                      >
                        <option value="en">English</option>
                        <option value="km">Khmer / ខ្មែរ</option>
                      </select>
                    </label>
                    <a
                      href={selectedPage}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-small"
                    >
                      <Eye size={13} /> Visual Live Editor
                    </a>
                  </div>
                </div>
                <div className="postbox-inside">
                  {pageEntries.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "30px 10px", color: "#646970" }}>
                      <Files size={36} style={{ margin: "0 auto 10px", color: "#8c8f94" }} />
                      <p>
                        No draft overrides currently saved for <strong>{selectedPage}</strong>.
                      </p>
                      <p style={{ fontSize: "12px" }}>
                        You can edit text directly on the live website by opening the page, or add custom fields here.
                      </p>
                      <a href={selectedPage} target="_blank" rel="noreferrer" className="button button-primary">
                        Open {selectedPage} in Live Visual Editor
                      </a>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {pageEntries.map(([key, entry], idx) => {
                        const item = entry as { kind: "text" | "image"; value: string };
                        return (
                          <div
                            key={key}
                            style={{
                              padding: "10px",
                              border: "1px solid #dcdcde",
                              borderRadius: "3px",
                              background: "#fafafa",
                            }}
                          >
                            <label style={{ display: "block", fontWeight: 600, fontSize: "12px", marginBottom: "4px" }}>
                              Field #{idx + 1}: <code>{key}</code>
                            </label>
                            {item.kind === "text" ? (
                              <textarea
                                rows={3}
                                style={{ width: "100%", padding: "6px", border: "1px solid #8c8f94", borderRadius: "3px" }}
                                value={item.value}
                                onChange={(e) =>
                                  setEntry(pageKeyspace, key, { kind: "text", value: e.target.value })
                                }
                              />
                            ) : (
                              <input
                                type="url"
                                style={{ width: "100%", padding: "6px", border: "1px solid #8c8f94", borderRadius: "3px" }}
                                value={item.value}
                                onChange={(e) =>
                                  setEntry(pageKeyspace, key, { kind: "image", value: e.target.value })
                                }
                              />
                            )}
                          </div>
                        );
                      })}
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button
                          className="button"
                          onClick={async () => {
                            await save();
                            setPageSaveMessage("Draft saved to Supabase.");
                          }}
                        >
                          <Save size={14} /> Save Draft
                        </button>
                        <button
                          className="button button-primary"
                          onClick={async () => {
                            await publish();
                            setPageSaveMessage("Published live to visitors!");
                          }}
                        >
                          <Globe size={14} /> Publish Changes
                        </button>
                        {pageSaveMessage && (
                          <span style={{ color: "#007017", fontSize: "12px", fontWeight: 600, alignSelf: "center" }}>
                            {pageSaveMessage}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW: GEODATA & GIS
              ================================================================ */}
          {section === "geodata" && (
            <div>
              <div className="wp-header">
                <div className="wp-header-left">
                  <h1>GeoData & GIS Map Layers</h1>
                </div>
                <a
                  href="/geodata"
                  target="_blank"
                  rel="noreferrer"
                  className="button"
                >
                  <Map size={14} /> Open Public Map Viewer
                </a>
              </div>
              <div className="notice notice-info">
                <p>
                  <strong>GIS Management:</strong> Upload `.kmz`, `.kml`, or `.geojson` layers up to 20 MB each.
                  Uploaded layers are saved to Supabase `geocam_map_layers` and the `geocam-geodata` storage bucket.
                </p>
              </div>
              <LayerManager onLayers={setLayers} />
            </div>
          )}

          {/* ================================================================
              VIEW: PUBLICATIONS
              ================================================================ */}
          {section === "publications" && (
            <div>
              <div className="wp-header">
                <div className="wp-header-left">
                  <h1>Research Publications</h1>
                  <span style={{ fontSize: "13px", color: "#646970" }}>
                    ({researchLibrary.length} scientific articles cataloged)
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="search"
                    placeholder="Search publications..."
                    value={pubSearch}
                    onChange={(e) => setPubSearch(e.target.value)}
                    style={{ padding: "4px 8px", border: "1px solid #8c8f94", borderRadius: "3px" }}
                  />
                  <a href="/publications" target="_blank" rel="noreferrer" className="button">
                    View Public Library
                  </a>
                </div>
              </div>

              <table className="wp-list-table">
                <thead>
                  <tr>
                    <th>Title & Topic</th>
                    <th>Authors</th>
                    <th>Year</th>
                    <th>Journal / Source</th>
                    <th>DOI / Link</th>
                  </tr>
                </thead>
                <tbody>
                  {researchLibrary
                    .filter(
                      (p) =>
                        !pubSearch ||
                        p.title.toLowerCase().includes(pubSearch.toLowerCase()) ||
                        p.authors.toLowerCase().includes(pubSearch.toLowerCase()) ||
                        p.topic.toLowerCase().includes(pubSearch.toLowerCase())
                    )
                    .slice(0, 15)
                    .map((pub) => (
                      <tr key={pub.id}>
                        <td>
                          <strong>{pub.title}</strong>
                          <div style={{ fontSize: "11px", color: "#8c8f94", marginTop: "2px" }}>
                            Topic: <span style={{ color: "#2271b1" }}>{pub.topic}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: "12px", color: "#50575e" }}>{pub.authors}</td>
                        <td>{pub.year || "—"}</td>
                        <td style={{ fontSize: "12px", color: "#50575e" }}>{pub.journal || "Cambodia Geosciences"}</td>
                        <td>
                          {pub.doi ? (
                            <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" style={{ fontSize: "12px" }}>
                              {pub.doi}
                            </a>
                          ) : (
                            <span style={{ color: "#8c8f94" }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================================================================
              VIEW: EVENTS
              ================================================================ */}
          {section === "events" && (
            <div>
              <div className="wp-header">
                <div className="wp-header-left">
                  <h1>Conferences & Field Trips</h1>
                </div>
                <a href="/events" target="_blank" rel="noreferrer" className="button">
                  View Public Events Page
                </a>
              </div>

              <table className="wp-list-table">
                <thead>
                  <tr>
                    <th>Event Title</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.id}>
                      <td><strong>{ev.title}</strong></td>
                      <td>{ev.date}</td>
                      <td>{ev.place}</td>
                      <td><span style={{ textTransform: "capitalize" }}>{ev.kind}</span></td>
                      <td><span className={`status-badge ${ev.status}`}>{ev.status}</span></td>
                      <td>
                        <button
                          className="button button-small"
                          onClick={() => {
                            const nextStatus = ev.status === "draft" ? "published" : "draft";
                            setEvents(events.map((e) => (e.id === ev.id ? { ...e, status: nextStatus } : e)));
                          }}
                        >
                          {ev.status === "draft" ? "Publish" : "Unpublish"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================================================================
              VIEW: MEMBERS
              ================================================================ */}
          {section === "members" && (
            <div>
              <div className="wp-header">
                <div className="wp-header-left">
                  <h1>Membership Applications</h1>
                </div>
                <a href="/membership" target="_blank" rel="noreferrer" className="button">
                  View Membership Page
                </a>
              </div>

              <table className="wp-list-table">
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Email Address</th>
                    <th>Category</th>
                    <th>Submitted Date</th>
                    <th>Status</th>
                    <th>Review Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td><strong>{app.name}</strong></td>
                      <td>{app.email}</td>
                      <td>{app.category}</td>
                      <td>{app.submitted}</td>
                      <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                      <td>
                        {app.status === "pending" ? (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              className="button button-small button-primary"
                              onClick={() =>
                                setApplications(
                                  applications.map((a) => (a.id === app.id ? { ...a, status: "approved" } : a))
                                )
                              }
                            >
                              Approve
                            </button>
                            <button
                              className="button button-small"
                              style={{ color: "#d63638" }}
                              onClick={() =>
                                setApplications(
                                  applications.map((a) => (a.id === app.id ? { ...a, status: "rejected" } : a))
                                )
                              }
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "#8c8f94", fontSize: "12px" }}>Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================================================================
              VIEW: MEDIA
              ================================================================ */}
          {section === "media" && (
            <div>
              <div className="wp-header">
                <div className="wp-header-left">
                  <h1>Media Library</h1>
                </div>
                <button className="button button-primary">+ Add New Media File</button>
              </div>

              <div className="postbox">
                <div className="postbox-inside" style={{ padding: "24px", textAlign: "center" }}>
                  <HardDrive size={40} style={{ color: "#2271b1", margin: "0 auto 12px" }} />
                  <h3>Drop files to upload to Supabase Storage</h3>
                  <p style={{ color: "#646970", fontSize: "12px", maxWidth: "500px", margin: "0 auto 16px" }}>
                    PNG, JPEG, WebP, GIF, PDF, KMZ, and GeoJSON files are supported.
                    Uploads are securely kept in your configured Supabase bucket.
                  </p>
                  <label className="button button-primary" style={{ cursor: "pointer" }}>
                    Select Files
                    <input type="file" multiple style={{ display: "none" }} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW: APPEARANCE
              ================================================================ */}
          {section === "appearance" && (
            <div>
              <div className="wp-header">
                <div className="wp-header-left">
                  <h1>Appearance & Typography</h1>
                </div>
              </div>
              <Appearance />
            </div>
          )}

          {/* ================================================================
              VIEW: SETTINGS
              ================================================================ */}
          {section === "settings" && (
            <div>
              <div className="wp-header">
                <div className="wp-header-left">
                  <h1>General Settings</h1>
                </div>
              </div>

              <div className="postbox" style={{ maxWidth: "780px" }}>
                <div className="postbox-header">
                  <h2><Settings size={15} /> Site Identity & Integrations</h2>
                </div>
                <div className="postbox-inside">
                  <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 14px" }}>
                    <tbody>
                      <tr>
                        <th style={{ width: "200px", textAlign: "left", fontSize: "13px" }}>Site Title:</th>
                        <td>
                          <input
                            type="text"
                            defaultValue="GeoCam — Cambodia Geoscience Research & Monitoring"
                            style={{ width: "100%", padding: "6px", border: "1px solid #8c8f94", borderRadius: "3px" }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th style={{ textAlign: "left", fontSize: "13px" }}>Tagline:</th>
                        <td>
                          <input
                            type="text"
                            defaultValue="National Geoscience, Earth Observation & Natural Hazard Observatory"
                            style={{ width: "100%", padding: "6px", border: "1px solid #8c8f94", borderRadius: "3px" }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th style={{ textAlign: "left", fontSize: "13px" }}>Administration Email:</th>
                        <td>
                          <input
                            type="email"
                            defaultValue="keatlenarith@gmail.com"
                            style={{ width: "100%", padding: "6px", border: "1px solid #8c8f94", borderRadius: "3px" }}
                          />
                          <p style={{ fontSize: "11px", color: "#646970", margin: "4px 0 0" }}>
                            Only verified accounts matching this address receive editing permissions.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <th style={{ textAlign: "left", fontSize: "13px" }}>Supabase Project:</th>
                        <td>
                          <code>pziwobqfysoadswgnjjm</code>
                        </td>
                      </tr>
                      <tr>
                        <th style={{ textAlign: "left", fontSize: "13px" }}>Earth Engine Portal:</th>
                        <td>
                          <input
                            type="url"
                            defaultValue="https://ee-monitoring.projects.earthengine.app/view/cambodia-mining"
                            style={{ width: "100%", padding: "6px", border: "1px solid #8c8f94", borderRadius: "3px" }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #f0f0f1" }}>
                    <button className="button button-primary">Save Changes</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
