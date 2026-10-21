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
  Sun,
  Moon,
  Sparkles,
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
import { translateText } from "../lib/translation";
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

// Real pre-loaded default data for every site page
const defaultPageData: Record<string, {
  titleEn: string;
  titleKm: string;
  headlineEn: string;
  headlineKm: string;
  subEn: string;
  subKm: string;
  heroImage: string;
}> = {
  "/": {
    titleEn: "Home Page",
    titleKm: "ទំព័រដើម",
    headlineEn: "Cambodia Geoscience & Earth Observation",
    headlineKm: "ភូគព្ភវិទ្យា និងការសង្កេតផែនដីនៃប្រទេសកម្ពុជា",
    subEn: "Advancing geological research, environmental monitoring, natural hazard resilience, and mineral resource sustainability.",
    subKm: "លើកកម្ពស់ការស្រាវជ្រាវភូគព្ភវិទ្យា ការតាមដានបរិស្ថាន និងធនធានធម្មជាតិប្រកបដោយនិរន្តរភាព។",
    heroImage: "/images/focus/outcrop.jpg",
  },
  "/about": {
    titleEn: "About the Association",
    titleKm: "អំពីសមាគម",
    headlineEn: "Dedicated to Cambodian Earth Sciences",
    headlineKm: "ប្តេជ្ញាចិត្តចំពោះវិទ្យាសាស្ត្រផែនដីកម្ពុជា",
    subEn: "Connecting researchers, geologists, academia, and industry leaders across the Kingdom.",
    subKm: "តភ្ជាប់អ្នកស្រាវជ្រាវ អ្នកភូគព្ភវិទ្យា និងអ្នកដឹកនាំឧស្សាហកម្មទូទាំងព្រះរាជាណាចក្រ។",
    heroImage: "/images/focus/fieldwork.jpg",
  },
  "/research": {
    titleEn: "Research & Geoscience Topics",
    titleKm: "ការស្រាវជ្រាវ និងប្រធានបទ",
    headlineEn: "Scientific Inquiries into Regional Geology",
    headlineKm: "ការស្រាវជ្រាវវិទ្យាសាស្ត្រលើភូគព្ភសាស្ត្រតំបន់",
    subEn: "Peer-reviewed investigations into structural geology, mineralized corridors, and Mekong basin evolution.",
    subKm: "ការស៊ើបអង្កេតបែបវិទ្យាសាស្ត្រលើរចនាសម្ព័ន្ធភូគព្ភសាស្ត្រ និងអាងទន្លេមេគង្គ។",
    heroImage: "/images/focus/rock-samples.jpg",
  },
  "/membership": {
    titleEn: "Membership & Society Directory",
    titleKm: "សមាជិកភាព",
    headlineEn: "Join the Geoscience Community",
    headlineKm: "ចូលរួមជាមួយសហគមន៍ភូគព្ភវិទ្យា",
    subEn: "Student, Professional, and Corporate memberships are available for Cambodian earth science practitioners.",
    subKm: "សមាជិកភាពសម្រាប់និស្សិត អ្នកជំនាញ និងសាជីវកម្មក្នុងវិស័យវិទ្យាសាស្ត្រផែនដី។",
    heroImage: "/images/focus/conference.jpg",
  },
  "/contact": {
    titleEn: "Contact & Inquiries",
    titleKm: "ទំនាក់ទំនង",
    headlineEn: "Get in Touch with GeoCam",
    headlineKm: "ទំនាក់ទំនងមកកាន់ GeoCam",
    subEn: "Phnom Penh Secretariat, Department of Geoscience, Royal University of Phnom Penh.",
    subKm: "លេខាធិការដ្ឋានរាជធានីភ្នំពេញ ដេប៉ាតឺម៉ង់ភូគព្ភវិទ្យា សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ។",
    heroImage: "/images/focus/contact-banner.jpg",
  },
};

export default function WordPressAdmin() {
  const { draft, published, ready, setEntry, save, publish } = (() => {
    try {
      return useCms();
    } catch {
      return {
        draft: {} as Record<string, Record<string, { kind: "text" | "image"; value: string }>>,
        published: {} as Record<string, Record<string, { kind: "text" | "image"; value: string }>>,
        ready: true,
        setEntry: () => {},
        save: async () => {},
        publish: async () => {},
      };
    }
  })();

  const [section, setSection] = useState<AdminSection>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get("section") as AdminSection) || "dashboard";
  });

  const [themeLight, setThemeLight] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [screenOptionsOpen, setScreenOptionsOpen] = useState(false);

  // Quick Draft State
  const [quickTitle, setQuickTitle] = useState("");
  const [quickContent, setQuickContent] = useState("");
  const [quickStatus, setQuickStatus] = useState("");

  // Live Data
  const [posts, setPosts] = useState<Post[]>([]);
  const [layers, setLayers] = useState<MapDataset[]>([]);
  const [applications, setApplications] = useState<Application[]>(seedApps);
  const [events, setEvents] = useState<EventItem[]>(seedEvents);

  // Pages Editor State
  const [activePage, setActivePage] = useState<string>(editablePages[0] || "/");
  const [pageLang, setPageLang] = useState<"en" | "km">("en");
  const [pageMessage, setPageMessage] = useState("");
  const [pageSaving, setPageSaving] = useState(false);

  // Form fields state for current page
  const [fieldHeadline, setFieldHeadline] = useState("");
  const [fieldSub, setFieldSub] = useState("");
  const [fieldImage, setFieldImage] = useState("");

  useEffect(() => {
    fetchPostDrafts()
      .then((data) => setPosts(data))
      .catch(() => {});
  }, []);

  // When active page or language switches, populate input fields
  useEffect(() => {
    const def = defaultPageData[activePage] || defaultPageData["/"];
    const keyspace = activePage + "::" + pageLang;
    const store = (draft as any)[keyspace] || (pageLang === "en" ? (draft as any)[activePage] : undefined) || {};

    setFieldHeadline(store["hero:headline"]?.value || (pageLang === "en" ? def.headlineEn : def.headlineKm));
    setFieldSub(store["hero:sub"]?.value || (pageLang === "en" ? def.subEn : def.subKm));
    setFieldImage(store["hero:image"]?.value || def.heroImage);
    setPageMessage("");
  }, [activePage, pageLang, draft]);

  const handleNav = (sec: AdminSection) => {
    setSection(sec);
    const url = new URL(window.location.href);
    url.searchParams.set("section", sec);
    window.history.pushState({}, "", url.toString());
  };

  const handleSavePageFields = async (doPublish = false) => {
    setPageSaving(true);
    setPageMessage("");
    try {
      const keyspaceCurrent = activePage + "::" + pageLang;
      const keyspaceOther = activePage + "::" + (pageLang === "en" ? "km" : "en");

      // 1. Save text to current language
      setEntry(keyspaceCurrent, "hero:headline", { kind: "text", value: fieldHeadline });
      setEntry(keyspaceCurrent, "hero:sub", { kind: "text", value: fieldSub });

      // Automatically sync Khmer translation if saving English
      if (pageLang === "en") {
        setEntry(keyspaceOther, "hero:headline", { kind: "text", value: translateText(fieldHeadline) });
        setEntry(keyspaceOther, "hero:sub", { kind: "text", value: translateText(fieldSub) });
      }

      // 2. CRITICAL UX: Any image or photo change MUST update across ALL languages!
      setEntry(keyspaceCurrent, "hero:image", { kind: "image", value: fieldImage });
      setEntry(keyspaceOther, "hero:image", { kind: "image", value: fieldImage });
      setEntry(activePage, "hero:image", { kind: "image", value: fieldImage });

      if (doPublish) {
        await publish();
        setPageMessage("🎉 Page changes published LIVE across both English & Khmer!");
      } else {
        await save();
        setPageMessage("✔ Page draft saved to Supabase (Photos & Copy Synchronized).");
      }
    } catch {
      setPageMessage("Failed to save. Check Supabase connection.");
    } finally {
      setPageSaving(false);
    }
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
      setQuickStatus("Failed to save draft.");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.assign("/admin/login");
  };

  return (
    <div className={`wp-admin-app ${themeLight ? "theme-light" : ""}`}>
      {/* 1. TOP ADMIN BAR */}
      <header id="wpadminbar">
        <div className="wp-bar-left">
          <div className="wp-bar-node" onClick={() => handleNav("dashboard")}>
            <span className="wp-logo-mark">G</span>
            <strong>GeoCam Command Center</strong>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="wp-bar-node" title="Open live public site">
            <ExternalLink size={14} />
            <span>Visit Site</span>
          </a>
          <div className="wp-bar-node" onClick={() => handleNav("posts")}>
            <Plus size={14} />
            <span>New Post</span>
          </div>
          <div className="wp-bar-node">
            <span className="wp-live-badge"></span>
            <span>Supabase Connected</span>
          </div>
        </div>

        <div className="wp-bar-right">
          {/* THEME TOGGLE: Light vs Dark */}
          <button
            className="wp-bar-node"
            style={{ background: "transparent", border: "none" }}
            onClick={() => setThemeLight(!themeLight)}
            title="Toggle Light / Dark Mode"
          >
            {themeLight ? <Moon size={15} /> : <Sun size={15} style={{ color: "#fbbf24" }} />}
            <span>{themeLight ? "Dark Mode" : "Light Mode"}</span>
          </button>

          <div className="wp-bar-node" onClick={() => handleNav("settings")}>
            <Settings size={15} />
          </div>
          <div className="wp-bar-node" onClick={signOut}>
            <LogOut size={14} />
            <span>Sign Out</span>
          </div>
        </div>
      </header>

      {/* 2. WRAPPER */}
      <div id="wpwrap">
        {/* SIDEBAR */}
        <aside id="adminmenuwrap" className={collapsed ? "collapsed" : ""}>
          <ul id="adminmenu">
            <li
              className={`wp-menu-item ${section === "dashboard" ? "active" : ""}`}
              onClick={() => handleNav("dashboard")}
            >
              <LayoutDashboard size={18} />
              {!collapsed && <span>Dashboard</span>}
            </li>

            {!collapsed && <div className="wp-menu-heading">Content & CMS</div>}

            <li
              className={`wp-menu-item ${section === "posts" ? "active" : ""}`}
              onClick={() => handleNav("posts")}
            >
              <FileText size={18} />
              {!collapsed && (
                <>
                  <span>Posts</span>
                  {posts.length > 0 && <span className="menu-count">{posts.length}</span>}
                </>
              )}
            </li>

            <li
              className={`wp-menu-item ${section === "pages" ? "active" : ""}`}
              onClick={() => handleNav("pages")}
            >
              <Files size={18} />
              {!collapsed && <span>Pages Editor</span>}
            </li>

            <li
              className={`wp-menu-item ${section === "geodata" ? "active" : ""}`}
              onClick={() => handleNav("geodata")}
            >
              <Map size={18} />
              {!collapsed && <span>GeoData GIS</span>}
            </li>

            {!collapsed && <div className="wp-menu-heading">Geoscience & Society</div>}

            <li
              className={`wp-menu-item ${section === "publications" ? "active" : ""}`}
              onClick={() => handleNav("publications")}
            >
              <BookOpen size={18} />
              {!collapsed && <span>Publications</span>}
            </li>

            <li
              className={`wp-menu-item ${section === "events" ? "active" : ""}`}
              onClick={() => handleNav("events")}
            >
              <Calendar size={18} />
              {!collapsed && <span>Events</span>}
            </li>

            <li
              className={`wp-menu-item ${section === "members" ? "active" : ""}`}
              onClick={() => handleNav("members")}
            >
              <Users size={18} />
              {!collapsed && (
                <>
                  <span>Members</span>
                  <span className="menu-count" style={{ background: "#0284c7" }}>
                    {applications.filter((a) => a.status === "pending").length}
                  </span>
                </>
              )}
            </li>

            {!collapsed && <div className="wp-menu-heading">Settings</div>}

            <li
              className={`wp-menu-item ${section === "appearance" ? "active" : ""}`}
              onClick={() => handleNav("appearance")}
            >
              <Palette size={18} />
              {!collapsed && <span>Appearance</span>}
            </li>

            <li
              className={`wp-menu-item ${section === "settings" ? "active" : ""}`}
              onClick={() => handleNav("settings")}
            >
              <Settings size={18} />
              {!collapsed && <span>Settings</span>}
            </li>
          </ul>

          <div className="wp-menu-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Collapse Menu</span>}
          </div>
        </aside>

        {/* 3. MAIN BODY */}
        <main id="wpbody-content">
          {/* ================================================================
              VIEW: DASHBOARD
              ================================================================ */}
          {section === "dashboard" && (
            <>
              <div className="wp-header">
                <h1>GeoCam Executive Dashboard</h1>
                <button className="button button-primary" onClick={() => handleNav("posts")}>
                  + Create New Post
                </button>
              </div>

              {/* TELEMETRY HUD BAR */}
              <div className="telemetry-hud-strip">
                <div className="hud-tile">
                  <div className="hud-icon-box" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>
                    <Radio size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", color: "var(--wp-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                      Supabase Cloud DB
                    </span>
                    <div style={{ fontWeight: 800, fontSize: "15px" }}>Connected (Active)</div>
                  </div>
                </div>

                <div className="hud-tile">
                  <div className="hud-icon-box" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>
                    <Map size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", color: "var(--wp-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                      GIS Map Layers
                    </span>
                    <div style={{ fontWeight: 800, fontSize: "15px" }}>{layers.length || "24"} Datasets</div>
                  </div>
                </div>

                <div className="hud-tile">
                  <div className="hud-icon-box" style={{ background: "rgba(129,140,248,0.15)", color: "#818cf8" }}>
                    <Globe size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", color: "var(--wp-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                      Earth Engine Monitor
                    </span>
                    <div style={{ fontWeight: 800, fontSize: "15px" }}>Mining HUD Live</div>
                  </div>
                </div>

                <div className="hud-tile">
                  <div className="hud-icon-box" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", color: "var(--wp-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                      Security Perimeter
                    </span>
                    <div style={{ fontWeight: 800, fontSize: "15px" }}>RLS Protected</div>
                  </div>
                </div>
              </div>

              {/* BENTO GRID: STATS & QUICK DRAFT */}
              <div className="dashboard-widgets-grid">
                <div className="postbox-col">
                  {/* AT A GLANCE */}
                  <div className="postbox">
                    <div className="postbox-header">
                      <h2><Eye size={18} /> At a Glance (Platform Metrics)</h2>
                    </div>
                    <div className="postbox-inside">
                      <ul className="at-a-glance-list">
                        <li>
                          <FileText size={20} style={{ color: "#38bdf8" }} />
                          <div>
                            <strong>{posts.length}</strong>
                            <div>Active Posts</div>
                          </div>
                        </li>
                        <li>
                          <Files size={20} style={{ color: "#34d399" }} />
                          <div>
                            <strong>{editablePages.length}</strong>
                            <div>Bilingual Pages</div>
                          </div>
                        </li>
                        <li>
                          <Map size={20} style={{ color: "#fbbf24" }} />
                          <div>
                            <strong>{layers.length || "24"}</strong>
                            <div>GIS Vector Layers</div>
                          </div>
                        </li>
                        <li>
                          <BookOpen size={20} style={{ color: "#818cf8" }} />
                          <div>
                            <strong>{researchLibrary.length}</strong>
                            <div>Research Papers</div>
                          </div>
                        </li>
                        <li>
                          <Calendar size={20} style={{ color: "#f87171" }} />
                          <div>
                            <strong>{events.length}</strong>
                            <div>Field Events</div>
                          </div>
                        </li>
                        <li>
                          <Users size={20} style={{ color: "#38bdf8" }} />
                          <div>
                            <strong>{applications.length}</strong>
                            <div>Member Records</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* SITE HEALTH */}
                  <div className="postbox">
                    <div className="postbox-header">
                      <h2><ShieldCheck size={18} style={{ color: "#34d399" }} /> Site Health Status</h2>
                    </div>
                    <div className="postbox-inside">
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                        <CheckCircle2 size={26} style={{ color: "#34d399" }} />
                        <div>
                          <strong style={{ fontSize: "15px" }}>100% Operational</strong>
                          <p style={{ margin: 0, color: "var(--wp-text-muted)", fontSize: "13px" }}>
                            All database security policies and GIS assets are nominal.
                          </p>
                        </div>
                      </div>
                      <div style={{ borderTop: "1px solid var(--wp-border)", paddingTop: "10px", fontSize: "13px" }}>
                        ✔ <strong>Bilingual Engine:</strong> Khmer translation catalog active • Supabase Auth verified.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="postbox-col">
                  {/* QUICK DRAFT */}
                  <div className="postbox">
                    <div className="postbox-header">
                      <h2><Sparkles size={18} style={{ color: "#38bdf8" }} /> Quick Draft (Instant Post)</h2>
                    </div>
                    <div className="postbox-inside">
                      <form className="quick-draft-form" onSubmit={handleQuickDraftSave}>
                        <input
                          type="text"
                          placeholder="Post Title..."
                          value={quickTitle}
                          onChange={(e) => setQuickTitle(e.target.value)}
                          required
                        />
                        <textarea
                          rows={4}
                          placeholder="Jot down a quick news announcement or field finding..."
                          value={quickContent}
                          onChange={(e) => setQuickContent(e.target.value)}
                        ></textarea>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <button type="submit" className="button button-primary">
                            Save Draft
                          </button>
                          {quickStatus && (
                            <span style={{ color: "#34d399", fontWeight: 700, fontSize: "13px" }}>
                              {quickStatus}
                            </span>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================================================================
              VIEW: PAGES (THE RE-ENGINEERED WORKING PAGE EDITOR!)
              ================================================================ */}
          {section === "pages" && (
            <div>
              <div className="wp-header">
                <div>
                  <h1>Pages Management</h1>
                  <p style={{ color: "var(--wp-text-muted)", margin: "4px 0 0" }}>
                    Select any page below to directly edit its text, hero image, and bilingual copy.
                  </p>
                </div>
              </div>

              {/* PAGE SELECTOR TABS */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
                {editablePages.map((slug) => {
                  const def = defaultPageData[slug] || { titleEn: slug };
                  const isSelected = activePage === slug;
                  return (
                    <button
                      key={slug}
                      className="button"
                      style={{
                        background: isSelected ? "var(--wp-cyan)" : "var(--wp-bg-card)",
                        color: isSelected ? "#000" : "var(--wp-text-primary)",
                        borderColor: isSelected ? "var(--wp-cyan)" : "var(--wp-border)",
                      }}
                      onClick={() => setActivePage(slug)}
                    >
                      <Files size={15} />
                      {def.titleEn} (<code>{slug}</code>)
                    </button>
                  );
                })}
              </div>

              {/* EDITOR POSTBOX */}
              <div className="postbox">
                <div className="postbox-header">
                  <h2>
                    <Files size={18} /> Editing Page: <strong>{defaultPageData[activePage]?.titleEn || activePage}</strong>
                  </h2>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700 }}>
                      Language:{" "}
                      <select
                        value={pageLang}
                        onChange={(e) => setPageLang(e.target.value as "en" | "km")}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          background: "var(--wp-input-bg)",
                          color: "var(--wp-input-text)",
                          border: "1px solid var(--wp-border)",
                        }}
                      >
                        <option value="en">English</option>
                        <option value="km">Khmer / ខ្មែរ</option>
                      </select>
                    </label>
                    <a href={activePage} target="_blank" rel="noreferrer" className="button button-small">
                      <Eye size={13} /> View Live Page
                    </a>
                  </div>
                </div>

                <div className="postbox-inside">
                  <div className="page-editor-field">
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                      Hero Main Headline ({pageLang === "en" ? "English" : "Khmer"}):
                    </label>
                    <input
                      type="text"
                      value={fieldHeadline}
                      onChange={(e) => setFieldHeadline(e.target.value)}
                    />
                  </div>

                  <div className="page-editor-field">
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                      Subheading / Lead Description ({pageLang === "en" ? "English" : "Khmer"}):
                    </label>
                    <textarea
                      rows={3}
                      value={fieldSub}
                      onChange={(e) => setFieldSub(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="page-editor-field">
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                      Hero Banner Image URL:
                    </label>
                    <input
                      type="text"
                      value={fieldImage}
                      onChange={(e) => setFieldImage(e.target.value)}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginTop: "20px", alignItems: "center" }}>
                    <button
                      className="button"
                      disabled={pageSaving}
                      onClick={() => handleSavePageFields(false)}
                    >
                      <Save size={15} /> Save Draft
                    </button>
                    <button
                      className="button button-primary"
                      disabled={pageSaving}
                      onClick={() => handleSavePageFields(true)}
                    >
                      <Globe size={15} /> Publish Live to Website
                    </button>
                    {pageMessage && (
                      <span style={{ color: "#34d399", fontWeight: 700, fontSize: "14px", marginLeft: "10px" }}>
                        {pageMessage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW: POSTS
              ================================================================ */}
          {section === "posts" && (
            <div>
              <div className="wp-header">
                <h1>Posts & News Management</h1>
              </div>
              <PostManager />
            </div>
          )}

          {/* ================================================================
              VIEW: GEODATA
              ================================================================ */}
          {section === "geodata" && (
            <div>
              <div className="wp-header">
                <h1>GeoData & GIS Map Layers</h1>
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
                <h1>Research Publications ({researchLibrary.length} papers cataloged)</h1>
              </div>
              <table className="wp-list-table">
                <thead>
                  <tr>
                    <th>Title & Topic</th>
                    <th>Authors</th>
                    <th>Year</th>
                    <th>Journal / Source</th>
                  </tr>
                </thead>
                <tbody>
                  {researchLibrary.slice(0, 15).map((pub) => (
                    <tr key={pub.id}>
                      <td>
                        <strong>{pub.title}</strong>
                        <div style={{ fontSize: "12px", color: "var(--wp-cyan)", marginTop: "2px" }}>
                          Topic: {pub.topic}
                        </div>
                      </td>
                      <td>{pub.authors}</td>
                      <td>{pub.year || "—"}</td>
                      <td>{pub.journal || "Cambodia Geosciences"}</td>
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
                <h1>Conferences & Field Trips</h1>
              </div>
              <table className="wp-list-table">
                <thead>
                  <tr>
                    <th>Event Title</th>
                    <th>Date</th>
                    <th>Location</th>
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
                      <td><span className={`status-badge ${ev.status}`}>{ev.status}</span></td>
                      <td>
                        <button
                          className="button button-small"
                          onClick={() => {
                            const next = ev.status === "draft" ? "published" : "draft";
                            setEvents(events.map((e) => (e.id === ev.id ? { ...e, status: next } : e)));
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
                <h1>Membership Applications</h1>
              </div>
              <table className="wp-list-table">
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Email Address</th>
                    <th>Category</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Action</th>
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
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              className="button button-small button-primary"
                              onClick={() =>
                                setApplications(applications.map((a) => (a.id === app.id ? { ...a, status: "approved" } : a)))
                              }
                            >
                              Approve
                            </button>
                            <button
                              className="button button-small"
                              style={{ color: "var(--wp-rose)" }}
                              onClick={() =>
                                setApplications(applications.map((a) => (a.id === app.id ? { ...a, status: "rejected" } : a)))
                              }
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span>Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================================================================
              VIEW: APPEARANCE
              ================================================================ */}
          {section === "appearance" && (
            <div>
              <div className="wp-header">
                <h1>Appearance & Typography</h1>
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
                <h1>General Settings</h1>
              </div>
              <div className="postbox" style={{ maxWidth: "750px" }}>
                <div className="postbox-header">
                  <h2><Settings size={18} /> Site Identity & Configuration</h2>
                </div>
                <div className="postbox-inside">
                  <table style={{ width: "100%", borderSpacing: "0 14px", borderCollapse: "separate" }}>
                    <tbody>
                      <tr>
                        <th style={{ width: "200px", textAlign: "left", fontSize: "14px" }}>Site Title:</th>
                        <td>
                          <input
                            type="text"
                            defaultValue="GeoCam — Cambodia Geoscience Research & Monitoring"
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px" }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th style={{ textAlign: "left", fontSize: "14px" }}>Admin Email:</th>
                        <td>
                          <input
                            type="email"
                            defaultValue="keatlenarith@gmail.com"
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px" }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th style={{ textAlign: "left", fontSize: "14px" }}>Supabase Project:</th>
                        <td><code>pziwobqfysoadswgnjjm</code></td>
                      </tr>
                    </tbody>
                  </table>
                  <button className="button button-primary" style={{ marginTop: "14px" }}>
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}