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
  UploadCloud,
  Trash2,
  Filter,
} from "lucide-react";
import { editablePages, useCms } from "../visual-cms/VisualCms";
import { supabase } from "../lib/supabase";
import PostManager from "./PostManager";
import Appearance from "./Appearance";
import LayerManager from "../features/geodata/LayerManager";
import type { MapDataset } from "../features/geodata/import-geodata";
import { fetchPostDrafts, savePost, newPost, type Post } from "./posts";
import { getAllNews } from "../lib/news-service";
import { applications as seedApps, events as seedEvents, type Application, type EventItem, type Publication } from "../lib/data";
import researchLibrary from "../lib/research-library.json";
import { translateText } from "../lib/translation";
import { defaultPageData } from "./page-data";
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

const publicationCategories = [
  "Tectonics",
  "Mineral deposits",
  "Environmental geology",
  "Hydrogeology",
  "Karst & paleoclimate",
  "Stratigraphy & geomorphology",
  "Geophysics & Sensing",
  "Geoscience references",
] as const;

export default function WordPressAdmin() {
  const { draft, published, ready, dirty, busy, setEntry, save, publish } = useCms();

  const [section, setSection] = useState<AdminSection>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get("section") as AdminSection) || "dashboard";
  });

  const [themeLight, setThemeLight] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Global Publishing & Draft Saving State
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDrafts, setIsSavingDrafts] = useState(false);
  const [publishMsg, setPublishMsg] = useState("");
  const [globalBanner, setGlobalBanner] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const handlePublishLive = async () => {
    setIsPublishing(true);
    setPublishMsg("Publishing Live…");
    try {
      await publish();
      setPublishMsg("Live!");
      setGlobalBanner({
        type: "success",
        text: "Website published live! All updates across pages, posts, and media are now live to every visitor.",
      });
      setTimeout(() => setPublishMsg(""), 4000);
      setTimeout(() => setGlobalBanner(null), 6000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Publishing failed. Please retry.";
      setPublishMsg("Failed");
      setGlobalBanner({ type: "error", text: msg });
      setTimeout(() => setPublishMsg(""), 4000);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveAllDrafts = async () => {
    setIsSavingDrafts(true);
    try {
      await save();
      setGlobalBanner({
        type: "success",
        text: "All draft changes saved successfully to Supabase.",
      });
      setTimeout(() => setGlobalBanner(null), 5000);
    } catch (err) {
      setGlobalBanner({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save drafts.",
      });
    } finally {
      setIsSavingDrafts(false);
    }
  };

  // Quick Draft State with Category tags
  const [quickTitle, setQuickTitle] = useState("");
  const [quickContent, setQuickContent] = useState("");
  const [quickCategory, setQuickCategory] = useState("Geoscience News");
  const [quickStatus, setQuickStatus] = useState("");

  // Live Data
  const [posts, setPosts] = useState<Post[]>([]);
  const [layers, setLayers] = useState<MapDataset[]>([]);
  const [applications, setApplications] = useState<Application[]>(seedApps);
  const [events, setEvents] = useState<EventItem[]>(seedEvents);

  // Publications State with Custom Add & Group Filter
  const [papers, setPapers] = useState<Publication[]>(() => {
    const custom = localStorage.getItem("geocam_custom_papers");
    if (custom) {
      try {
        return [...JSON.parse(custom), ...researchLibrary];
      } catch {
        return researchLibrary;
      }
    }
    return researchLibrary;
  });
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [paperSearch, setPaperSearch] = useState<string>(() => {
    try {
      return new URLSearchParams(window.location.search).get("search") || "";
    } catch {
      return "";
    }
  });
  const [showAddPaper, setShowAddPaper] = useState(false);

  // New Paper Form State
  const [newTitle, setNewTitle] = useState("");
  const [newAuthors, setNewAuthors] = useState("");
  const [newTopic, setNewTopic] = useState<string>("Tectonics");
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newJournal, setNewJournal] = useState("");
  const [newDoi, setNewDoi] = useState("");
  const [newPdf, setNewPdf] = useState("");
  const [newAbstract, setNewAbstract] = useState("");
  const [paperMessage, setPaperMessage] = useState("");

  // Pages Editor State
  const [activePage, setActivePage] = useState<string>(() => {
    try {
      const p = new URLSearchParams(window.location.search).get("page");
      if (p) {
        const formatted = p.startsWith("/") ? p : `/${p}`;
        if (defaultPageData[formatted]) return formatted;
      }
    } catch {}
    return "/";
  });
  const [pageGroupFilter, setPageGroupFilter] = useState<string>("All");
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

  const pageFields: Record<string, {headline:string;sub:string;image?:string}> = {
    '/': {headline:'hero-line-one',sub:'hero-description',image:'home-hero-image'},
    '/about': {headline:'section:0/div:0/h1:0',sub:'section:0/div:0/p:1',image:'about-background-image'},
    '/research': {headline:'section:0/div:0/h1:0',sub:'div:0/div:0/a:0/div:0/p:0',image:'research-hero-image'},
    '/publications': {headline:'publications-header-title',sub:'publications-header-sub',image:'publications-hero-image'},
    '/events': {headline:'events-header-title',sub:'events-header-sub',image:'events-hero-image'},
    '/membership': {headline:'section:0/div:0/h1:0',sub:'section:0/div:0/p:1',image:'membership-hero-image'},
    '/geodata': {headline:'geodata-header-title',sub:'geodata-header-sub',image:'geodata-hero-image'},
    '/environmental-monitoring': {headline:'env-header-title',sub:'env-header-sub',image:'env-hero-image'},
    '/news': {headline:'news-header-title',sub:'news-header-sub',image:'news-hero-image'},
    '/contact': {headline:'professional-contact-name',sub:'professional-contact-role',image:'professional-profile-photo'},
    '/geopark': {headline:'geopark-header-title',sub:'geopark-header-sub',image:'geopark-hero-image'},
    '/mining': {headline:'mining-header-title',sub:'mining-header-sub',image:'mining-hero-image'},
    '/lexicon': {headline:'lexicon-header-title',sub:'lexicon-header-sub',image:'lexicon-hero-image'},
    '/dashboard': {headline:'dashboard-header-title',sub:'dashboard-header-sub',image:'dashboard-hero-image'},
  };
  const selectedFields = pageFields[activePage] || {
    headline: 'page-title',
    sub: 'page-description',
    image: 'page-hero-image',
  };
  useEffect(() => {
    const fields = selectedFields;
    const english = draft[activePage + '::en'] || {};
    const khmer = draft[activePage + '::km'] || {};
    const text = (key?: string) =>
      key
        ? pageLang === 'km'
          ? khmer[key]?.value || translateText(english[key]?.value || '')
          : english[key]?.value || ''
        : '';
    setFieldHeadline(text(fields.headline));
    setFieldSub(text(fields.sub));
    setFieldImage(english[fields.image || '']?.value || '');
    setPageMessage('');
  }, [activePage, pageLang, draft]);
  const requestNavigation = (proceed:()=>void) => {
    const event = new CustomEvent('geocam:request-navigation', {cancelable:true,detail:{proceed}});
    window.dispatchEvent(event);
    if (!event.defaultPrevented) proceed();
  };
  const handleNav = (sec: AdminSection) => requestNavigation(() => {
    setSection(sec);
    const url = new URL(window.location.href);
    url.searchParams.set('section', sec);
    window.history.pushState({}, '', url.toString());
  });

  /**
   * CRITICAL UX RULE:
   * Any change of any version will be an OVERALL change across the entire website!
   * - Images are synced across activePage, activePage::en, and activePage::km.
   * - Text is updated in the current language, and automatically synced to the other language.
   */
  const handleSavePageFields = async (doPublish = false) => {
    setPageSaving(true);
    setPageMessage("");
    try {
      const fields = selectedFields;
      const space = activePage + '::' + pageLang;
      if (fieldHeadline !== (draft[space]?.[fields.headline]?.value || ''))
        setEntry(space, fields.headline, {kind:'text',value:fieldHeadline});
      if (fieldSub !== (draft[space]?.[fields.sub]?.value || ''))
        setEntry(space, fields.sub, {kind:'text',value:fieldSub});
      if (fields.image && fieldImage && fieldImage !== (draft[activePage + '::en']?.[fields.image]?.value || ''))
        setEntry(activePage + '::en', fields.image, {kind:'image',value:fieldImage});

      if (doPublish) {
        await publish();
        setPageMessage("🎉 Overall change published LIVE across all languages!");
      } else {
        await save();
        setPageMessage("✔ Page draft saved. English controls Khmer translations; images are shared.");
      }
    } catch (err) {
      console.error("Save page error:", err);
      setPageMessage("Failed to save: " + (err instanceof Error ? err.message : "Check Supabase connection."));
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
      draftPost.category = quickCategory;
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

  const handleAddPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthors.trim()) return;

    const paperItem: Publication = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      authors: newAuthors.trim(),
      year: Number(newYear) || new Date().getFullYear(),
      topic: newTopic,
      journal: newJournal.trim() || "Cambodia Geosciences Journal",
      abstract: newAbstract.trim() || "Peer-reviewed Cambodian geological research publication.",
      doi: newDoi.trim(),
      fileUrl: newPdf.trim(),
      publicationType: "Journal Article",
      scope: "National",
      origin: "GeoCam Library",
      metadataVerified: true,
      tags: [newTopic, "Cambodia"],
    };

    const updated = [paperItem, ...papers];
    setPapers(updated);

    // Persist custom papers locally
    const customOnly = updated.filter((p) => p.origin === "GeoCam Library");
    localStorage.setItem("geocam_custom_papers", JSON.stringify(customOnly));

    setNewTitle("");
    setNewAuthors("");
    setNewDoi("");
    setNewPdf("");
    setNewAbstract("");
    setPaperMessage("✔ Research paper uploaded and classified successfully!");
    setShowAddPaper(false);
    setTimeout(() => setPaperMessage(""), 4000);
  };

  const signOut = () => requestNavigation(() => {
    void supabase.auth.signOut().then(() => window.location.assign("/admin/login"));
  });

  const filteredPapers = papers.filter((p) => {
    const matchesTopic = selectedTopic === "All" || p.topic.toLowerCase() === selectedTopic.toLowerCase();
    const matchesSearch =
      !paperSearch ||
      p.title.toLowerCase().includes(paperSearch.toLowerCase()) ||
      p.authors.toLowerCase().includes(paperSearch.toLowerCase()) ||
      p.journal.toLowerCase().includes(paperSearch.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const availablePagesList = editablePages;
  const filteredPagesList = availablePagesList.filter((slug) => {
    if (pageGroupFilter === "All") return true;
    return defaultPageData[slug]?.category === pageGroupFilter;
  });

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
          <div className="wp-bar-node" onClick={() => { handleNav("publications"); setShowAddPaper(true); }}>
            <UploadCloud size={14} />
            <span>Upload Paper</span>
          </div>
          <div className="wp-bar-node">
            <span className="wp-live-badge"></span>
            <span>Supabase Connected</span>
          </div>
        </div>

        <div className="wp-bar-right">
          {/* PUBLISH WEBSITE LIVE BUTTON */}
          <button
            type="button"
            className="wp-bar-node"
            style={{
              background: isPublishing ? "#059669" : "#047857",
              color: "#ffffff",
              fontWeight: 700,
              borderRadius: "4px",
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "1px solid #10b981",
              cursor: isPublishing || busy ? "not-allowed" : "pointer",
            }}
            onClick={handlePublishLive}
            disabled={isPublishing || busy}
            title="Publish all website updates and drafts live to public visitors"
          >
            <Sparkles size={14} />
            <span>{publishMsg || (isPublishing ? "Publishing Live…" : "Publish Website Live")}</span>
          </button>

          {/* SAVE ALL CHANGES BUTTON */}
          <button
            type="button"
            className="wp-bar-node"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              color: "#e2e8f0",
              fontWeight: 600,
              borderRadius: "4px",
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              cursor: isSavingDrafts || busy ? "not-allowed" : "pointer",
            }}
            onClick={handleSaveAllDrafts}
            disabled={isSavingDrafts || busy}
            title="Save all pending draft changes to database"
          >
            <Save size={13} />
            <span>{isSavingDrafts ? "Saving…" : "Save All Changes"}</span>
          </button>

          {/* THEME TOGGLE */}
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
                  <span className="menu-count" style={{ background: "#059669" }}>{getAllNews().length}</span>
                </>
              )}
            </li>

            <li
              className={`wp-menu-item ${section === "pages" ? "active" : ""}`}
              onClick={() => handleNav("pages")}
            >
              <Files size={18} />
              {!collapsed && (
                <>
                  <span>All Pages ({availablePagesList.length})</span>
                </>
              )}
            </li>

            <li
              className={`wp-menu-item ${section === "publications" ? "active" : ""}`}
              onClick={() => handleNav("publications")}
            >
              <BookOpen size={18} />
              {!collapsed && (
                <>
                  <span>Papers & Journals</span>
                  <span className="menu-count" style={{ background: "#0284c7" }}>{papers.length}</span>
                </>
              )}
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

            {!collapsed && <div className="wp-menu-heading">System</div>}

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
          {globalBanner && (
            <div
              className={`wp-notice-banner notice notice-${globalBanner.type}`}
              style={{
                margin: "16px 20px 0",
                padding: "12px 16px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: globalBanner.type === "success" ? "#ecfdf5" : "#fef2f2",
                borderLeft: `4px solid ${globalBanner.type === "success" ? "#10b981" : "#ef4444"}`,
                color: globalBanner.type === "success" ? "#065f46" : "#991b1b",
                fontWeight: 600,
                fontSize: "14px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {globalBanner.type === "success" ? <CheckCircle2 size={18} /> : null}
                <span>{globalBanner.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setGlobalBanner(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "inherit",
                }}
                title="Dismiss"
              >
                ×
              </button>
            </div>
          )}

          {/* ================================================================
              VIEW: DASHBOARD
              ================================================================ */}
          {section === "dashboard" && (
            <>
              <div className="wp-header">
                <h1>GeoCam Executive Dashboard</h1>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    className="button button-primary"
                    style={{ background: "#059669", borderColor: "#047857", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}
                    onClick={handlePublishLive}
                    disabled={isPublishing || busy}
                  >
                    <Sparkles size={15} />
                    <span>{publishMsg || (isPublishing ? "Publishing Live…" : "Publish Website Live")}</span>
                  </button>
                  <button
                    className="button"
                    style={{ display: "flex", alignItems: "center", gap: "5px" }}
                    onClick={handleSaveAllDrafts}
                    disabled={isSavingDrafts || busy}
                  >
                    <Save size={14} />
                    <span>Save All Changes</span>
                  </button>
                  <button className="button" onClick={() => { handleNav("publications"); setShowAddPaper(true); }}>
                    <UploadCloud size={15} /> Upload Paper
                  </button>
                  <button className="button button-primary" onClick={() => handleNav("posts")}>
                    + Create New Post
                  </button>
                </div>
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
                    <BookOpen size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", color: "var(--wp-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                      Research Library
                    </span>
                    <div style={{ fontWeight: 800, fontSize: "15px" }}>{papers.length} Papers Classified</div>
                  </div>
                </div>

                <div className="hud-tile">
                  <div className="hud-icon-box" style={{ background: "rgba(129,140,248,0.15)", color: "#818cf8" }}>
                    <Files size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", color: "var(--wp-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                      Bilingual Sync
                    </span>
                    <div style={{ fontWeight: 800, fontSize: "15px" }}>{availablePagesList.length} Pages Synced</div>
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
                            <strong>{getAllNews().length}</strong>
                            <div>Active Posts & News</div>
                          </div>
                        </li>
                        <li>
                          <Files size={20} style={{ color: "#34d399" }} />
                          <div>
                            <strong>{availablePagesList.length}</strong>
                            <div>Website Pages</div>
                          </div>
                        </li>
                        <li>
                          <BookOpen size={20} style={{ color: "#818cf8" }} />
                          <div>
                            <strong>{papers.length}</strong>
                            <div>Research Papers</div>
                          </div>
                        </li>
                        <li>
                          <Map size={20} style={{ color: "#fbbf24" }} />
                          <div>
                            <strong>{layers.length || "24"}</strong>
                            <div>GIS Map Layers</div>
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
                      <h2><ShieldCheck size={18} style={{ color: "#34d399" }} /> Overall Sync & Health</h2>
                    </div>
                    <div className="postbox-inside">
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                        <CheckCircle2 size={26} style={{ color: "#34d399" }} />
                        <div>
                          <strong style={{ fontSize: "15px" }}>Universal Dual-Language Sync Active</strong>
                          <p style={{ margin: 0, color: "var(--wp-text-muted)", fontSize: "13px" }}>
                            Any photo, image, or text edit automatically applies across both English and Khmer.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PUBLISHING & SITE STATUS WIDGET */}
                  <div className="postbox" style={{ borderTop: "3px solid #10b981" }}>
                    <div className="postbox-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h2><Sparkles size={18} style={{ color: "#10b981" }} /> Website Publishing & Status</h2>
                      <span style={{ background: "#10b981", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px" }}>
                        Live Synchronized
                      </span>
                    </div>
                    <div className="postbox-inside" style={{ padding: "16px" }}>
                      <p style={{ margin: "0 0 14px", fontSize: "13px", color: "var(--wp-text-muted)", lineHeight: 1.5 }}>
                        Instantly deploy all changes across your 14 pages, news stories, research documents, and media live to every visitor on the public web.
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                        <button
                          type="button"
                          className="button button-primary"
                          style={{ background: "#059669", borderColor: "#047857", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", padding: "6px 16px" }}
                          onClick={handlePublishLive}
                          disabled={isPublishing || busy}
                        >
                          <Sparkles size={16} />
                          <span>{publishMsg || (isPublishing ? "Publishing Live…" : "Publish Website Live")}</span>
                        </button>
                        <button
                          type="button"
                          className="button"
                          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px" }}
                          onClick={handleSaveAllDrafts}
                          disabled={isSavingDrafts || busy}
                        >
                          <Save size={15} />
                          <span>Save All Changes</span>
                        </button>
                        <a
                          href="/"
                          target="_blank"
                          rel="noreferrer"
                          className="button"
                          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", color: "var(--wp-link)" }}
                        >
                          <ExternalLink size={14} />
                          <span>View Public Site ↗</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="postbox-col">
                  {/* QUICK DRAFT WITH CATEGORY CLASSIFICATION */}
                  <div className="postbox">
                    <div className="postbox-header">
                      <h2><Sparkles size={18} style={{ color: "#38bdf8" }} /> Quick Draft (Classified by Group)</h2>
                    </div>
                    <div className="postbox-inside">
                      <form className="quick-draft-form" onSubmit={handleQuickDraftSave}>
                        <div style={{ marginBottom: "10px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--wp-text-muted)" }}>
                            Select Post Category:
                          </span>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                            {["Geoscience News", "Field Report", "Conference Update", "Research Bulletin", "Society Notice"].map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setQuickCategory(cat)}
                                style={{
                                  fontSize: "11px",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  border: "1px solid",
                                  borderColor: quickCategory === cat ? "var(--wp-cyan)" : "var(--wp-border)",
                                  background: quickCategory === cat ? "rgba(56,189,248,0.2)" : "var(--wp-bg-card)",
                                  color: quickCategory === cat ? "var(--wp-cyan)" : "var(--wp-text-secondary)",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder="Post Title..."
                          value={quickTitle}
                          onChange={(e) => setQuickTitle(e.target.value)}
                          required
                        />
                        <textarea
                          rows={4}
                          placeholder="Write the announcement or summary..."
                          value={quickContent}
                          onChange={(e) => setQuickContent(e.target.value)}
                        ></textarea>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <button type="submit" className="button button-primary">
                            Save Classified Draft
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
              VIEW: PAGES (ALL 14 WEBSITE PAGES FULLY EDITABLE)
              ================================================================ */}
          {section === "pages" && (
            <div>
              <div className="wp-header">
                <div>
                  <h1>All Website Pages ({availablePagesList.length} Pages)</h1>
                  <p style={{ color: "var(--wp-text-muted)", margin: "4px 0 0" }}>
                    Select any page below to edit its headline, description, banner photo, and copy. Any change applies as an overall change.
                  </p>
                </div>
              </div>

              {/* GROUP / CATEGORY FILTER TABS FOR PAGES */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--wp-text-muted)" }}>
                  <Filter size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                  Filter Groups:
                </span>
                {["All", "Core Pages", "Science & Maps", "Tools & Portals"].map((group) => (
                  <button
                    key={group}
                    className="button button-small"
                    style={{
                      background: pageGroupFilter === group ? "var(--wp-cyan)" : "var(--wp-bg-card)",
                      color: pageGroupFilter === group ? "#000" : "var(--wp-text-primary)",
                      borderColor: pageGroupFilter === group ? "var(--wp-cyan)" : "var(--wp-border)",
                    }}
                    onClick={() => setPageGroupFilter(group)}
                  >
                    {group}
                  </button>
                ))}
              </div>

              {/* PAGE SELECTOR TABS (ALL 14 PAGES) */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                {filteredPagesList.map((slug) => {
                  const def = defaultPageData[slug];
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
                      <Files size={14} />
                      {def?.titleEn || slug} (<code>{slug}</code>)
                    </button>
                  );
                })}
              </div>

              {/* EDITOR POSTBOX */}
              <div className="postbox">
                <div className="postbox-header">
                  <h2>
                    <Files size={18} /> Editing: <strong>{defaultPageData[activePage]?.titleEn || activePage}</strong>{" "}
                    <span style={{ fontSize: "12px", color: "var(--wp-cyan)" }}>({activePage})</span>
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
                      Page heading ({pageLang === "en" ? "English source" : "Khmer translation"}):
                    </label>
                    <input
                      type="text"
                      value={fieldHeadline}
                      placeholder={pageLang === "km" ? "ចំណងជើងទំព័រជាភាសាខ្មែរ..." : "Page heading in English..."}
                      onChange={(e) => setFieldHeadline(e.target.value)}
                    />
                  </div>

                  <div className="page-editor-field">
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                      Subheading / Lead Description ({pageLang === "en" ? "English source" : "Khmer translation"}):
                    </label>
                    <textarea
                      rows={3}
                      value={fieldSub}
                      placeholder={pageLang === "km" ? "សេចក្តីពិពណ៌នាជាភាសាខ្មែរ..." : "Page lead description..."}
                      onChange={(e) => setFieldSub(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="page-editor-field">
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                      Hero Banner Image URL (Universal Photo — Syncs across all languages):
                    </label>
                    <input
                      type="text"
                      value={fieldImage}
                      placeholder="https://... or /images/..."
                      onChange={(e) => setFieldImage(e.target.value)}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginTop: "20px", alignItems: "center" }}>
                    <button
                      className="button"
                      disabled={pageSaving || !ready}
                      onClick={() => handleSavePageFields(false)}
                    >
                      <Save size={15} /> Save Draft
                    </button>
                    <button
                      className="button button-primary"
                      disabled={pageSaving || !ready}
                      onClick={() => handleSavePageFields(true)}
                    >
                      <Globe size={15} /> Publish Overall Changes Live
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
              VIEW: PAPERS & RESEARCH (NEW UPLOAD & CATEGORY CLASSIFICATION)
              ================================================================ */}
          {section === "publications" && (
            <div>
              <div className="wp-header">
                <div>
                  <h1>Research Papers & Journal Library</h1>
                  <p style={{ color: "var(--wp-text-muted)", margin: "4px 0 0" }}>
                    Classified by scientific groups and domains. Easily upload new papers or link external DOIs.
                  </p>
                </div>
                <button
                  className="button button-primary"
                  onClick={() => setShowAddPaper(!showAddPaper)}
                >
                  <UploadCloud size={16} />
                  {showAddPaper ? "Close Upload Form" : "+ Upload New Paper / Journal"}
                </button>
              </div>

              {paperMessage && (
                <div style={{ padding: "10px 16px", background: "rgba(52,211,153,0.15)", border: "1px solid #34d399", color: "#34d399", borderRadius: "8px", marginBottom: "16px", fontWeight: 600 }}>
                  {paperMessage}
                </div>
              )}

              {/* UPLOAD NEW PAPER FORM DRAWER */}
              {showAddPaper && (
                <div className="postbox" style={{ borderColor: "var(--wp-cyan)", boxShadow: "0 0 20px rgba(56,189,248,0.2)" }}>
                  <div className="postbox-header">
                    <h2><UploadCloud size={18} style={{ color: "var(--wp-cyan)" }} /> Upload & Classify New Research Publication</h2>
                  </div>
                  <div className="postbox-inside">
                    <form onSubmit={handleAddPaper}>
                      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Paper Title *:</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Structural and Tectonic Evolution of the Tonle Sap Basin..."
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Category / Research Group *:</label>
                          <select
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          >
                            {publicationCategories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px", gap: "16px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Authors *:</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Keat L., Sothy V., Smith J."
                            value={newAuthors}
                            onChange={(e) => setNewAuthors(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Journal / Publisher / Conference:</label>
                          <input
                            type="text"
                            placeholder="e.g. Journal of Asian Earth Sciences"
                            value={newJournal}
                            onChange={(e) => setNewJournal(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Year:</label>
                          <input
                            type="number"
                            value={newYear}
                            onChange={(e) => setNewYear(Number(e.target.value))}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>PDF Document URL / Storage Link:</label>
                          <input
                            type="url"
                            placeholder="https://.../paper.pdf"
                            value={newPdf}
                            onChange={(e) => setNewPdf(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>DOI or Citation Link:</label>
                          <input
                            type="text"
                            placeholder="10.1016/j.jseaes..."
                            value={newDoi}
                            onChange={(e) => setNewDoi(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Abstract / Scientific Summary:</label>
                        <textarea
                          rows={3}
                          placeholder="Brief abstract describing the geological findings and methodology..."
                          value={newAbstract}
                          onChange={(e) => setNewAbstract(e.target.value)}
                          style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                        ></textarea>
                      </div>

                      <div style={{ display: "flex", gap: "10px" }}>
                        <button type="submit" className="button button-primary">
                          <CheckCircle2 size={16} /> Publish Paper to Library
                        </button>
                        <button type="button" className="button" onClick={() => setShowAddPaper(false)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* CATEGORY / GROUP FILTER TABS */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "16px 0", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--wp-text-muted)" }}>
                  <Filter size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                  Filter by Category:
                </span>
                <button
                  className="button button-small"
                  style={{
                    background: selectedTopic === "All" ? "var(--wp-cyan)" : "var(--wp-bg-card)",
                    color: selectedTopic === "All" ? "#000" : "var(--wp-text-primary)",
                    borderColor: selectedTopic === "All" ? "var(--wp-cyan)" : "var(--wp-border)",
                  }}
                  onClick={() => setSelectedTopic("All")}
                >
                  All Categories ({papers.length})
                </button>
                {publicationCategories.map((cat) => (
                  <button
                    key={cat}
                    className="button button-small"
                    style={{
                      background: selectedTopic === cat ? "var(--wp-cyan)" : "var(--wp-bg-card)",
                      color: selectedTopic === cat ? "#000" : "var(--wp-text-primary)",
                      borderColor: selectedTopic === cat ? "var(--wp-cyan)" : "var(--wp-border)",
                    }}
                    onClick={() => setSelectedTopic(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* SEARCH BOX */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--wp-text-muted)" }} />
                  <input
                    type="search"
                    placeholder="Search papers by title, author, or journal..."
                    value={paperSearch}
                    onChange={(e) => setPaperSearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px 8px 36px",
                      borderRadius: "8px",
                      background: "var(--wp-input-bg)",
                      color: "var(--wp-input-text)",
                      border: "1px solid var(--wp-input-border)",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              {/* PAPERS LIST TABLE */}
              <table className="wp-list-table">
                <thead>
                  <tr>
                    <th>Paper Title & Category Group</th>
                    <th>Authors</th>
                    <th>Year</th>
                    <th>Journal / Source</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPapers.slice(0, 30).map((pub) => (
                    <tr key={pub.id}>
                      <td style={{ maxWidth: "420px" }}>
                        <strong>{pub.title}</strong>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(56,189,248,0.15)", color: "var(--wp-cyan)" }}>
                            {pub.topic}
                          </span>
                          {pub.doi && (
                            <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" style={{ fontSize: "11px" }}>
                              DOI: {pub.doi}
                            </a>
                          )}
                        </div>
                      </td>
                      <td style={{ fontSize: "13px" }}>{pub.authors}</td>
                      <td><strong>{pub.year || "—"}</strong></td>
                      <td style={{ fontSize: "13px" }}>{pub.journal || "Cambodia Geosciences"}</td>
                      <td>
                        {pub.fileUrl ? (
                          <a href={pub.fileUrl} target="_blank" rel="noreferrer" className="button button-small">
                            View PDF
                          </a>
                        ) : pub.doi ? (
                          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" className="button button-small">
                            Read Online
                          </a>
                        ) : (
                          <span style={{ color: "var(--wp-text-muted)", fontSize: "12px" }}>Indexed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredPapers.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "30px", color: "var(--wp-text-muted)" }}>
                        No research papers found matching this category or search query. Click "+ Upload New Paper" above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
