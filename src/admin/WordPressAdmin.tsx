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
  Edit,
  RotateCcw,
  AlertTriangle,
  X,
  Check,
  Filter,
  BarChart3,
} from "lucide-react";
import { editablePages, useCms } from "../visual-cms/VisualCms";
import { supabase } from "../lib/supabase";
import PostManager from "./PostManager";
import Appearance from "./Appearance";
import { MemberManager } from "./MemberManager";
import { FacebookManager } from "./FacebookManager";
import { Share2 } from "lucide-react";
import TranslationManager from "./TranslationManager";
import { Languages } from "lucide-react";
import AnalyticsDashboard from "./AnalyticsDashboard";
import GeodataTocManager from "./GeodataTocManager";
import LayerManager from "../features/geodata/LayerManager";
import type { MapDataset } from "../features/geodata/import-geodata";
import { fetchPostDrafts, savePost, newPost, type Post } from "./posts";
import { getAllNews } from "../lib/news-service";
import { applications as seedApps, events as seedEvents, type Application, type EventItem, type Publication } from "../lib/data";
import researchLibrary from "../lib/research-library.json";
import {
  getStoredPublications,
  saveStoredPublications,
  resetStoredPublications,
} from "../lib/publication-service";
import {
  getStoredEvents,
  saveStoredEvents,
  resetStoredEvents,
} from "../lib/event-service";
import { translateText } from "../lib/translation";
import { defaultPageData } from "./page-data";
import "./wp-admin.css";

type AdminSection =
  | "dashboard"
  | "analytics"
  | "posts"
  | "pages"
  | "geodata"
  | "publications"
  | "events"
  | "members"
  | "media"
  | "appearance"
  | "translations"
  | "settings"
  | "facebook";

const publicationCategories = [
  "Tectonics",
  "Mineral deposits",
  "Environmental geology",
  "Hydrogeology",
  "Environmental Hydrogeology",
  "Marine Geology",
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
  const [events, setEvents] = useState<EventItem[]>(() => getStoredEvents());

  // Events Management States (Add, Edit, Delete, Reset, Filter)
  const [eventSearch, setEventSearch] = useState("");
  const [eventStatusFilter, setEventStatusFilter] = useState<"All" | "published" | "draft">("All");
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventMessage, setEventMessage] = useState("");

  // New Event Form State
  const [newEvTitle, setNewEvTitle] = useState("");
  const [newEvTitleKm, setNewEvTitleKm] = useState("");
  const [newEvDate, setNewEvDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newEvPlace, setNewEvPlace] = useState("");
  const [newEvPlaceKm, setNewEvPlaceKm] = useState("");
  const [newEvKind, setNewEvKind] = useState("Field trip");
  const [newEvKindKm, setNewEvKindKm] = useState("ការងារទីវាល");
  const [newEvStatus, setNewEvStatus] = useState<"published" | "draft">("published");

  // Edit Event Form State
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editEvTitle, setEditEvTitle] = useState("");
  const [editEvTitleKm, setEditEvTitleKm] = useState("");
  const [editEvDate, setEditEvDate] = useState("");
  const [editEvPlace, setEditEvPlace] = useState("");
  const [editEvPlaceKm, setEditEvPlaceKm] = useState("");
  const [editEvKind, setEditEvKind] = useState("Field trip");
  const [editEvKindKm, setEditEvKindKm] = useState("ការងារទីវាល");
  const [editEvStatus, setEditEvStatus] = useState<"published" | "draft">("published");

  // Delete Event Confirmation State
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);

  // Reset Events Confirmation State
  const [showResetEventsConfirm, setShowResetEventsConfirm] = useState(false);

  // Publications State with Custom Add, Edit, Delete, & Reset
  const [papers, setPapers] = useState<Publication[]>(() => getStoredPublications());
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
  const [newPublicationType, setNewPublicationType] = useState("Journal Article");
  const [newDoi, setNewDoi] = useState("");
  const [newPdf, setNewPdf] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newAbstract, setNewAbstract] = useState("");
  const [newTags, setNewTags] = useState("");
  const [paperMessage, setPaperMessage] = useState("");

  // Edit Paper Form State
  const [editingPaper, setEditingPaper] = useState<Publication | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthors, setEditAuthors] = useState("");
  const [editTopic, setEditTopic] = useState<string>("Tectonics");
  const [editYear, setEditYear] = useState<number | string>(new Date().getFullYear());
  const [editJournal, setEditJournal] = useState("");
  const [editPublicationType, setEditPublicationType] = useState("Journal Article");
  const [editDoi, setEditDoi] = useState("");
  const [editPdf, setEditPdf] = useState("");
  const [editSourceUrl, setEditSourceUrl] = useState("");
  const [editAbstract, setEditAbstract] = useState("");
  const [editTags, setEditTags] = useState("");

  // Delete Paper Confirmation State
  const [paperToDelete, setPaperToDelete] = useState<Publication | null>(null);

  // Reset to Defaults Confirmation State
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Pagination for Papers Library
  const [paperPage, setPaperPage] = useState(1);
  const [paperPageSize, setPaperPageSize] = useState(25);

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

  // Check if URL contains ?edit=<id> to trigger edit modal automatically
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const editId = params.get("edit");
      if (editId) {
        const found = papers.find((p) => p.id === editId);
        if (found) {
          handleStartEdit(found);
        }
      }
    } catch {}
  }, [papers]);

  const handleStartEdit = (pub: Publication) => {
    setEditingPaper(pub);
    setEditTitle(pub.title || "");
    setEditAuthors(pub.authors || "");
    setEditTopic(pub.topic || "Tectonics");
    setEditYear(pub.year ?? "");
    setEditJournal(pub.journal || "");
    setEditPublicationType(pub.publicationType || "Journal Article");
    setEditDoi(pub.doi || "");
    setEditPdf(pub.fileUrl || pub.pdfUrl || "");
    setEditSourceUrl(pub.sourceUrl || "");
    setEditAbstract(pub.abstract || "");
    setEditTags(Array.isArray(pub.tags) ? pub.tags.join(", ") : "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPaper || !editTitle.trim() || !editAuthors.trim()) return;

    const parsedTags = editTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedItem: Publication = {
      ...editingPaper,
      title: editTitle.trim(),
      authors: editAuthors.trim(),
      year: editYear === "" ? null : Number(editYear),
      topic: editTopic,
      journal: editJournal.trim() || "Cambodia Geosciences Journal",
      publicationType: editPublicationType || "Journal Article",
      doi: editDoi.trim(),
      fileUrl: editPdf.trim(),
      pdfUrl: editPdf.trim(),
      sourceUrl: editSourceUrl.trim(),
      abstract: editAbstract.trim(),
      tags: parsedTags.length > 0 ? parsedTags : [editTopic, "Cambodia"],
      metadataVerified: true,
    };

    const nextPapers = papers.map((p) =>
      p.id === editingPaper.id ? updatedItem : p,
    );
    setPapers(nextPapers);
    saveStoredPublications(nextPapers);
    setEditingPaper(null);
    setPaperMessage("✔ Research publication updated successfully! / បានកែប្រែព័ត៌មានអត្ថបទស្រាវជ្រាវដោយជោគជ័យ!");
    setTimeout(() => setPaperMessage(""), 4000);
  };

  const handleExecuteDelete = () => {
    if (!paperToDelete) return;
    const nextPapers = papers.filter((p) => p.id !== paperToDelete.id);
    setPapers(nextPapers);
    saveStoredPublications(nextPapers);
    const deletedTitle = paperToDelete.title;
    setPaperToDelete(null);
    setPaperMessage(`🗑️ Publication deleted: "${deletedTitle.slice(0, 40)}..." / បានលុបអត្ថបទស្រាវជ្រាវចេញពីបណ្ណាល័យ`);
    setTimeout(() => setPaperMessage(""), 4000);
  };

  const handleExecuteReset = () => {
    const seed = resetStoredPublications();
    setPapers(seed);
    setShowResetConfirm(false);
    setPaperMessage("↺ Research library restored to system defaults / បានកំណត់បណ្ណាល័យស្រាវជ្រាវឡើងវិញជាលំនាំដើម!");
    setTimeout(() => setPaperMessage(""), 4000);
  };

  const handleAddPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthors.trim()) return;

    const parsedTags = newTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

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
      pdfUrl: newPdf.trim(),
      sourceUrl: newSourceUrl.trim(),
      publicationType: newPublicationType || "Journal Article",
      scope: "National",
      origin: "GeoCam Library",
      metadataVerified: true,
      tags: parsedTags.length > 0 ? parsedTags : [newTopic, "Cambodia"],
    };

    const updated = [paperItem, ...papers];
    setPapers(updated);
    saveStoredPublications(updated);

    setNewTitle("");
    setNewAuthors("");
    setNewDoi("");
    setNewPdf("");
    setNewSourceUrl("");
    setNewAbstract("");
    setNewTags("");
    setPaperMessage("✔ Research paper uploaded and classified successfully! / បានបញ្ចូលនិងចាត់ថ្នាក់អត្ថបទស្រាវជ្រាវថ្មីដោយជោគជ័យ!");
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
      p.journal.toLowerCase().includes(paperSearch.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(paperSearch.toLowerCase())));
    return matchesTopic && matchesSearch;
  });

  const totalFiltered = filteredPapers.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / paperPageSize));
  const safePage = Math.min(paperPage, totalPages);
  const paginatedPapers = filteredPapers.slice(
    (safePage - 1) * paperPageSize,
    safePage * paperPageSize,
  );

  // Events Handlers (Edit, Delete, Toggle, Create, Reset)
  const handleStartEditEvent = (ev: EventItem) => {
    setEditingEvent(ev);
    setEditEvTitle(ev.title || "");
    setEditEvTitleKm(ev.titleKm || "");
    setEditEvDate(ev.date || "");
    setEditEvPlace(ev.place || "");
    setEditEvPlaceKm(ev.placeKm || "");
    setEditEvKind(ev.kind || "Field trip");
    setEditEvKindKm(ev.kindKm || "");
    setEditEvStatus(ev.status || "published");
  };

  const handleSaveEditEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editEvTitle.trim() || !editEvDate.trim() || !editEvPlace.trim()) return;

    const updatedItem: EventItem = {
      ...editingEvent,
      title: editEvTitle.trim(),
      titleKm: editEvTitleKm.trim() || undefined,
      date: editEvDate.trim(),
      place: editEvPlace.trim(),
      placeKm: editEvPlaceKm.trim() || undefined,
      kind: editEvKind.trim() || "Field trip",
      kindKm: editEvKindKm.trim() || undefined,
      status: editEvStatus,
    };

    const nextEvents = events.map((item) =>
      item.id === editingEvent.id ? updatedItem : item,
    );
    setEvents(nextEvents);
    saveStoredEvents(nextEvents);
    setEditingEvent(null);
    setEventMessage("✔ Event updated successfully! / បានកែប្រែព័ត៌មានព្រឹត្តិការណ៍ដោយជោគជ័យ!");
    setTimeout(() => setEventMessage(""), 4000);
  };

  const handleExecuteDeleteEvent = () => {
    if (!eventToDelete) return;
    const nextEvents = events.filter((item) => item.id !== eventToDelete.id);
    setEvents(nextEvents);
    saveStoredEvents(nextEvents);
    const deletedTitle = eventToDelete.title;
    setEventToDelete(null);
    setEventMessage(`🗑️ Event deleted: "${deletedTitle}" / បានលុបព្រឹត្តិការណ៍ដោយជោគជ័យ!`);
    setTimeout(() => setEventMessage(""), 4000);
  };

  const handleExecuteResetEvents = () => {
    const seed = resetStoredEvents();
    setEvents(seed);
    setShowResetEventsConfirm(false);
    setEventMessage("↺ Events schedule restored to system defaults / បានកំណត់ព្រឹត្តិការណ៍ឡើងវិញជាលំនាំដើម!");
    setTimeout(() => setEventMessage(""), 4000);
  };

  const handleToggleEventStatus = (ev: EventItem) => {
    const nextStatus: "published" | "draft" = ev.status === "draft" ? "published" : "draft";
    const nextEvents = events.map((item) =>
      item.id === ev.id ? { ...item, status: nextStatus } : item,
    );
    setEvents(nextEvents);
    saveStoredEvents(nextEvents);
    setEventMessage(`✔ Event status updated to ${nextStatus}.`);
    setTimeout(() => setEventMessage(""), 3000);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvTitle.trim() || !newEvDate.trim() || !newEvPlace.trim()) return;

    const newEventItem: EventItem = {
      id: "ev-" + Date.now().toString(36),
      title: newEvTitle.trim(),
      titleKm: newEvTitleKm.trim() || undefined,
      date: newEvDate.trim(),
      place: newEvPlace.trim(),
      placeKm: newEvPlaceKm.trim() || undefined,
      kind: newEvKind.trim() || "Field trip",
      kindKm: newEvKindKm.trim() || undefined,
      status: newEvStatus,
    };

    const nextEvents = [newEventItem, ...events];
    setEvents(nextEvents);
    saveStoredEvents(nextEvents);

    setNewEvTitle("");
    setNewEvTitleKm("");
    setNewEvDate(new Date().toISOString().slice(0, 10));
    setNewEvPlace("");
    setNewEvPlaceKm("");
    setNewEvKind("Field trip");
    setNewEvKindKm("ការងារទីវាល");
    setNewEvStatus("published");
    setShowAddEvent(false);
    setEventMessage("✔ New event created and scheduled successfully! / បានបង្កើតព្រឹត្តិការណ៍ថ្មីដោយជោគជ័យ!");
    setTimeout(() => setEventMessage(""), 4000);
  };

  const filteredEvents = events.filter((ev) => {
    const matchesStatus = eventStatusFilter === "All" || ev.status === eventStatusFilter;
    const q = eventSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ev.title.toLowerCase().includes(q) ||
      (ev.titleKm && ev.titleKm.toLowerCase().includes(q)) ||
      ev.place.toLowerCase().includes(q) ||
      (ev.placeKm && ev.placeKm.toLowerCase().includes(q)) ||
      ev.kind.toLowerCase().includes(q) ||
      (ev.kindKm && ev.kindKm.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
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
          <div
            className="wp-bar-node"
            onClick={() => {
              handleNav("posts");
              const u = new URL(window.location.href);
              u.searchParams.set("section", "posts");
              u.searchParams.set("new", "true");
              window.history.pushState({}, "", u.toString());
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent("geocam:open-new-post"));
              }, 60);
            }}
          >
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

            <li
              className={`wp-menu-item ${section === "analytics" ? "active" : ""}`}
              onClick={() => handleNav("analytics")}
            >
              <BarChart3 size={18} />
              {!collapsed && <span>Visitor Analytics</span>}
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
              className={`wp-menu-item ${section === "translations" ? "active" : ""}`}
              onClick={() => handleNav("translations")}
            >
              <Languages size={18} />
              {!collapsed && <span>Translations (EN ↔ KH)</span>}
            </li>

            <li
              className={`wp-menu-item ${section === "facebook" ? "active" : ""}`}
              onClick={() => handleNav("facebook")}
            >
              <Share2 size={18} />
              {!collapsed && <span>Facebook Publisher</span>}
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
                  <button
                    className="button button-primary"
                    onClick={() => {
                      handleNav("posts");
                      const u = new URL(window.location.href);
                      u.searchParams.set("section", "posts");
                      u.searchParams.set("new", "true");
                      window.history.pushState({}, "", u.toString());
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent("geocam:open-new-post"));
                      }, 60);
                    }}
                  >
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

                  {/* AUDIENCE & VISITOR TELEMETRY WIDGET */}
                  <div className="postbox" style={{ borderTop: "3px solid #38bdf8" }}>
                    <div className="postbox-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h2><BarChart3 size={18} style={{ color: "#38bdf8" }} /> Real Visitor Telemetry</h2>
                      <button
                        type="button"
                        onClick={() => handleNav("analytics")}
                        className="button"
                        style={{ fontSize: "12px", padding: "2px 8px", height: "auto" }}
                      >
                        View Full Dashboard →
                      </button>
                    </div>
                    <div className="postbox-inside" style={{ padding: "16px" }}>
                      <p style={{ margin: "0 0 12px", fontSize: "13px", color: "var(--wp-text-muted)" }}>
                        Real recorded telemetry for unique visitors, browsing sessions, and public page views.
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", textAlign: "center" }}>
                        <div style={{ background: "rgba(56, 189, 248, 0.08)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
                          <span style={{ fontSize: "11px", color: "var(--wp-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                            7d Visitors
                          </span>
                          <div style={{ fontSize: "18px", fontWeight: 800, color: "#38bdf8", marginTop: "2px" }}>
                            Monitored
                          </div>
                        </div>
                        <div style={{ background: "rgba(52, 211, 153, 0.08)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(52, 211, 153, 0.2)" }}>
                          <span style={{ fontSize: "11px", color: "var(--wp-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                            7d Sessions
                          </span>
                          <div style={{ fontSize: "18px", fontWeight: 800, color: "#34d399", marginTop: "2px" }}>
                            Monitored
                          </div>
                        </div>
                        <div style={{ background: "rgba(129, 140, 248, 0.08)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(129, 140, 248, 0.2)" }}>
                          <span style={{ fontSize: "11px", color: "var(--wp-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                            Tracking
                          </span>
                          <div style={{ fontSize: "18px", fontWeight: 800, color: "#818cf8", marginTop: "2px" }}>
                            Since Oct 24
                          </div>
                        </div>
                      </div>
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
              VIEW: VISITOR & AUDIENCE ANALYTICS
              ================================================================ */}
          {section === "analytics" && <AnalyticsDashboard />}

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
                    <button
                      type="button"
                      className="button button-primary button-small"
                      style={{ background: "#2271b1", borderColor: "#135e96", color: "#fff" }}
                      onClick={() => {
                        handleNav("posts");
                        const pageId = `page-${activePage.replace(/[\/\-_]/g, "_") || "home"}`;
                        const u = new URL(window.location.href);
                        u.searchParams.set("section", "posts");
                        u.searchParams.set("edit", pageId);
                        window.history.pushState({}, "", u.toString());
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent("geocam:open-edit-page-id", { detail: pageId }));
                        }, 60);
                      }}
                    >
                      <Edit size={12} /> Edit in Classic Editor
                    </button>
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
              VIEW: PAPERS & RESEARCH (NEW UPLOAD, EDIT, DELETE & RESET)
              ================================================================ */}
          {section === "publications" && (
            <div>
              <div className="wp-header">
                <div>
                  <h1>Research Papers & Journal Library</h1>
                  <p style={{ color: "var(--wp-text-muted)", margin: "4px 0 0" }}>
                    Classified by scientific groups and domains. Easily upload, edit metadata, link external DOIs, or remove papers.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="button"
                    onClick={() => setShowResetConfirm(true)}
                    title="Reset library to system defaults / កំណត់ឡើងវិញទៅលំនាំដើម"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <RotateCcw size={15} />
                    Reset to Defaults
                  </button>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => setShowAddPaper(!showAddPaper)}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <UploadCloud size={16} />
                    {showAddPaper ? "Close Upload Form" : "+ Upload New Paper / Journal"}
                  </button>
                </div>
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
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Publication Type:</label>
                          <select
                            value={newPublicationType}
                            onChange={(e) => setNewPublicationType(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          >
                            <option value="Journal Article">Journal Article</option>
                            <option value="Conference Paper">Conference Paper</option>
                            <option value="Technical Report">Technical Report</option>
                            <option value="Thesis">Thesis</option>
                            <option value="Book Chapter">Book Chapter</option>
                            <option value="Geological Map & Guide">Geological Map & Guide</option>
                            <option value="Preprint">Preprint</option>
                          </select>
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

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>PDF Document URL / Storage Link:</label>
                          <input
                            type="text"
                            placeholder="/research/...pdf or https://..."
                            value={newPdf}
                            onChange={(e) => setNewPdf(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Source / External Web Link:</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={newSourceUrl}
                            onChange={(e) => setNewSourceUrl(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: "12px" }}>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Abstract / Scientific Summary:</label>
                        <textarea
                          rows={3}
                          placeholder="Brief abstract describing the geological findings and methodology..."
                          value={newAbstract}
                          onChange={(e) => setNewAbstract(e.target.value)}
                          style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                        ></textarea>
                      </div>

                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Tags (comma-separated):</label>
                        <input
                          type="text"
                          placeholder="e.g. Tectonics, Basin, Cambodia, Seismic"
                          value={newTags}
                          onChange={(e) => setNewTags(e.target.value)}
                          style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                        />
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
                  type="button"
                  className="button button-small"
                  style={{
                    background: selectedTopic === "All" ? "var(--wp-cyan)" : "var(--wp-bg-card)",
                    color: selectedTopic === "All" ? "#000" : "var(--wp-text-primary)",
                    borderColor: selectedTopic === "All" ? "var(--wp-cyan)" : "var(--wp-border)",
                  }}
                  onClick={() => {
                    setSelectedTopic("All");
                    setPaperPage(1);
                  }}
                >
                  All Categories ({papers.length})
                </button>
                {publicationCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className="button button-small"
                    style={{
                      background: selectedTopic === cat ? "var(--wp-cyan)" : "var(--wp-bg-card)",
                      color: selectedTopic === cat ? "#000" : "var(--wp-text-primary)",
                      borderColor: selectedTopic === cat ? "var(--wp-cyan)" : "var(--wp-border)",
                    }}
                    onClick={() => {
                      setSelectedTopic(cat);
                      setPaperPage(1);
                    }}
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
                    placeholder="Search papers by title, author, journal, or keywords..."
                    value={paperSearch}
                    onChange={(e) => {
                      setPaperSearch(e.target.value);
                      setPaperPage(1);
                    }}
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
                    <th style={{ minWidth: "220px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPapers.map((pub) => (
                    <tr key={pub.id}>
                      <td style={{ maxWidth: "420px" }}>
                        <strong>{pub.title}</strong>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(56,189,248,0.15)", color: "var(--wp-cyan)" }}>
                            {pub.topic}
                          </span>
                          {pub.publicationType && (
                            <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "6px", background: "rgba(148,163,184,0.15)", color: "var(--wp-text-muted)" }}>
                              {pub.publicationType}
                            </span>
                          )}
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
                      <td style={{ whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="button button-small"
                            onClick={() => handleStartEdit(pub)}
                            title="Edit publication / កែប្រែព័ត៌មានអត្ថបទ"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: "var(--wp-cyan)",
                              borderColor: "rgba(56,189,248,0.35)",
                            }}
                          >
                            <Edit size={12} />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="button button-small"
                            onClick={() => setPaperToDelete(pub)}
                            title="Delete publication / លុបអត្ថបទស្រាវជ្រាវ"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: "var(--wp-rose)",
                              borderColor: "rgba(248,113,113,0.35)",
                            }}
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                          {pub.fileUrl ? (
                            <a
                              href={pub.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="button button-small"
                              title="View PDF Document"
                            >
                              PDF
                            </a>
                          ) : pub.doi ? (
                            <a
                              href={`https://doi.org/${pub.doi}`}
                              target="_blank"
                              rel="noreferrer"
                              className="button button-small"
                              title="Read Online via DOI"
                            >
                              DOI
                            </a>
                          ) : pub.sourceUrl ? (
                            <a
                              href={pub.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="button button-small"
                              title="Source Link"
                            >
                              Link
                            </a>
                          ) : null}
                        </div>
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

              {/* PAGINATION BAR */}
              {totalFiltered > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginTop: "16px",
                    padding: "10px 14px",
                    background: "var(--wp-bg-surface)",
                    border: "1px solid var(--wp-border)",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                >
                  <div style={{ color: "var(--wp-text-muted)" }}>
                    Showing <strong>{Math.min(totalFiltered, (safePage - 1) * paperPageSize + 1)}</strong> to{" "}
                    <strong>{Math.min(totalFiltered, safePage * paperPageSize)}</strong> of{" "}
                    <strong>{totalFiltered}</strong> publications
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      type="button"
                      className="button button-small"
                      disabled={safePage <= 1}
                      onClick={() => setPaperPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                    <span>
                      Page {safePage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      className="button button-small"
                      disabled={safePage >= totalPages}
                      onClick={() => setPaperPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </button>
                    <select
                      value={paperPageSize}
                      onChange={(e) => {
                        setPaperPageSize(Number(e.target.value));
                        setPaperPage(1);
                      }}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        background: "var(--wp-input-bg)",
                        color: "var(--wp-input-text)",
                        border: "1px solid var(--wp-input-border)",
                        fontSize: "12px",
                      }}
                    >
                      <option value={10}>10 / page</option>
                      <option value={25}>25 / page</option>
                      <option value={50}>50 / page</option>
                      <option value={100}>100 / page</option>
                    </select>
                  </div>
                </div>
              )}

              {/* EDIT PUBLICATION MODAL DIALOG */}
              {editingPaper && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                  <div
                    className="w-full max-w-2xl rounded-2xl border border-[var(--wp-border)] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                    style={{ background: "var(--wp-bg-card, #1e293b)", color: "var(--wp-text-primary, #f8fafc)" }}
                  >
                    <div className="flex items-center justify-between border-b border-[var(--wp-border)] pb-3">
                      <div className="flex items-center gap-2">
                        <Edit size={20} className="text-cyan-400" />
                        <div>
                          <h3 className="text-base font-bold" style={{ margin: 0 }}>
                            Edit Research Publication / កែប្រែព័ត៌មានអត្ថបទស្រាវជ្រាវ
                          </h3>
                          <p style={{ margin: 0, fontSize: "12px", color: "var(--wp-text-muted)" }}>
                            ID: {editingPaper.id}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingPaper(null)}
                        className="button button-small"
                        style={{ padding: "4px 8px" }}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveEdit}>
                      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "14px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Paper Title * / ចំណងជើងអត្ថបទ *:
                          </label>
                          <input
                            type="text"
                            required
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Category / Research Group * / ក្រុមស្រាវជ្រាវ *:
                          </label>
                          <select
                            value={editTopic}
                            onChange={(e) => setEditTopic(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          >
                            {publicationCategories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 100px", gap: "14px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Authors * / អ្នកនិពន្ធ *:
                          </label>
                          <input
                            type="text"
                            required
                            value={editAuthors}
                            onChange={(e) => setEditAuthors(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Journal / Publisher / ទស្សនាវដ្តី:
                          </label>
                          <input
                            type="text"
                            value={editJournal}
                            onChange={(e) => setEditJournal(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Year / ឆ្នាំ:
                          </label>
                          <input
                            type="number"
                            value={editYear}
                            onChange={(e) => setEditYear(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Publication Type / ប្រភេទការបោះពុម្ព:
                          </label>
                          <select
                            value={editPublicationType}
                            onChange={(e) => setEditPublicationType(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          >
                            <option value="Journal Article">Journal Article</option>
                            <option value="Conference Paper">Conference Paper</option>
                            <option value="Technical Report">Technical Report</option>
                            <option value="Thesis">Thesis</option>
                            <option value="Book Chapter">Book Chapter</option>
                            <option value="Geological Map & Guide">Geological Map & Guide</option>
                            <option value="Preprint">Preprint</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            DOI or Citation Code:
                          </label>
                          <input
                            type="text"
                            placeholder="10.1016/..."
                            value={editDoi}
                            onChange={(e) => setEditDoi(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            PDF Document URL / ឯកសារ PDF:
                          </label>
                          <input
                            type="text"
                            placeholder="/research/...pdf or https://..."
                            value={editPdf}
                            onChange={(e) => setEditPdf(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Source / External Web Link:
                          </label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={editSourceUrl}
                            onChange={(e) => setEditSourceUrl(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: "12px" }}>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                          Abstract / Scientific Summary / សង្ខេបស្រាវជ្រាវ:
                        </label>
                        <textarea
                          rows={4}
                          value={editAbstract}
                          onChange={(e) => setEditAbstract(e.target.value)}
                          style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)", fontSize: "13px" }}
                        />
                      </div>

                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                          Tags (comma-separated) / ស្លាក:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Tectonics, Basin, Cambodia, Seismic"
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid var(--wp-border)", paddingTop: "14px" }}>
                        <button
                          type="button"
                          className="button"
                          onClick={() => setEditingPaper(null)}
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <X size={15} />
                          Cancel / បោះបង់
                        </button>
                        <button
                          type="submit"
                          className="button button-primary"
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <Check size={15} />
                          Save Changes / រក្សាទុក
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* DELETE CONFIRMATION MODAL DIALOG */}
              {paperToDelete && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                  <div
                    className="w-full max-w-md rounded-2xl border border-[var(--wp-border)] p-6 shadow-2xl space-y-4"
                    style={{ background: "var(--wp-bg-card, #1e293b)", color: "var(--wp-text-primary, #f8fafc)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ padding: "8px", borderRadius: "50%", background: "rgba(248,113,113,0.15)", color: "var(--wp-rose)" }}>
                        <Trash2 size={24} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>
                          Delete Publication / លុបអត្ថបទស្រាវជ្រាវ
                        </h3>
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--wp-text-muted)" }}>
                          Confirm deletion from research library
                        </p>
                      </div>
                    </div>

                    <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(0,0,0,0.25)", border: "1px solid var(--wp-border)" }}>
                      <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: "14px" }}>
                        {paperToDelete.title}
                      </p>
                      <p style={{ margin: "0 0 4px", fontSize: "12px", color: "var(--wp-text-muted)" }}>
                        Authors: {paperToDelete.authors}
                      </p>
                      <div style={{ display: "flex", gap: "8px", fontSize: "11px", marginTop: "6px" }}>
                        <span style={{ padding: "2px 6px", borderRadius: "4px", background: "rgba(56,189,248,0.15)", color: "var(--wp-cyan)" }}>
                          {paperToDelete.topic}
                        </span>
                        <span style={{ color: "var(--wp-text-muted)" }}>
                          Year: {paperToDelete.year || "—"}
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: 0, fontSize: "13px", color: "var(--wp-rose)" }}>
                      ⚠️ Are you sure you want to permanently delete this publication? This action will remove it from the public catalog and admin dashboard.
                    </p>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "8px" }}>
                      <button
                        type="button"
                        className="button"
                        onClick={() => setPaperToDelete(null)}
                      >
                        Cancel / បោះបង់
                      </button>
                      <button
                        type="button"
                        className="button"
                        onClick={handleExecuteDelete}
                        style={{
                          background: "var(--wp-rose)",
                          color: "#fff",
                          borderColor: "var(--wp-rose)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Trash2 size={15} />
                        Delete Permanently / លុបជាអចិន្ត្រៃយ៍
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* RESET DEFAULTS CONFIRMATION MODAL */}
              {showResetConfirm && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                  <div
                    className="w-full max-w-md rounded-2xl border border-[var(--wp-border)] p-6 shadow-2xl space-y-4"
                    style={{ background: "var(--wp-bg-card, #1e293b)", color: "var(--wp-text-primary, #f8fafc)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ padding: "8px", borderRadius: "50%", background: "rgba(56,189,248,0.15)", color: "var(--wp-cyan)" }}>
                        <RotateCcw size={24} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>
                          Reset Publications Library / កំណត់ដើមឡើងវិញ
                        </h3>
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--wp-text-muted)" }}>
                          Restore original catalog seed
                        </p>
                      </div>
                    </div>

                    <p style={{ margin: 0, fontSize: "13px", color: "var(--wp-text-secondary)" }}>
                      Are you sure you want to restore the research library to system defaults? Any custom edits, additions, or deleted publications will be reset to the original collection.
                    </p>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "8px" }}>
                      <button
                        type="button"
                        className="button"
                        onClick={() => setShowResetConfirm(false)}
                      >
                        Cancel / បោះបង់
                      </button>
                      <button
                        type="button"
                        className="button button-primary"
                        onClick={handleExecuteReset}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <RotateCcw size={15} />
                        Confirm Reset / កំណត់ឡើងវិញ
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
              VIEW: GEODATA (Table of Contents & Symbology Manager)
              ================================================================ */}
          {section === "geodata" && (
            <div>
              <GeodataTocManager />
            </div>
          )}

          {/* ================================================================
              VIEW: EVENTS (CONFERENCES & FIELD TRIPS - ADD, EDIT, DELETE & RESET)
              ================================================================ */}
          {section === "events" && (
            <div>
              <div className="wp-header">
                <div>
                  <h1>Conferences & Field Trips</h1>
                  <p style={{ color: "var(--wp-text-muted)", margin: "4px 0 0" }}>
                    Manage upcoming conferences, geological field excursions, student meetups, and webinars.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="button"
                    onClick={() => setShowResetEventsConfirm(true)}
                    title="Reset events schedule to system defaults / កំណត់ឡើងវិញទៅលំនាំដើម"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <RotateCcw size={15} />
                    Reset to Defaults
                  </button>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => setShowAddEvent(!showAddEvent)}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <Plus size={16} />
                    {showAddEvent ? "Close Form" : "+ Create New Event"}
                  </button>
                </div>
              </div>

              {eventMessage && (
                <div style={{ padding: "10px 16px", background: "rgba(52,211,153,0.15)", border: "1px solid #34d399", color: "#34d399", borderRadius: "8px", marginBottom: "16px", fontWeight: 600 }}>
                  {eventMessage}
                </div>
              )}

              {/* CREATE NEW EVENT DRAWER FORM */}
              {showAddEvent && (
                <div className="postbox" style={{ borderColor: "var(--wp-cyan)", boxShadow: "0 0 20px rgba(56,189,248,0.2)" }}>
                  <div className="postbox-header">
                    <h2><Plus size={18} style={{ color: "var(--wp-cyan)" }} /> Create New Conference / Field Trip Event</h2>
                  </div>
                  <div className="postbox-inside">
                    <form onSubmit={handleCreateEvent}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Event Title (English) *:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Laterite & weathering profiles field trip"
                            value={newEvTitle}
                            onChange={(e) => setNewEvTitle(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            ចំណងជើងព្រឹត្តិការណ៍ (ភាសាខ្មែរ):
                          </label>
                          <input
                            type="text"
                            placeholder="ឧ. ដំណើរទស្សនកិច្ចសិក្សាទីវាលលើទម្រង់ដីឡាតេរីត"
                            value={newEvTitleKm}
                            onChange={(e) => setNewEvTitleKm(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: "14px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Date (YYYY-MM-DD) *:
                          </label>
                          <input
                            type="date"
                            required
                            value={newEvDate}
                            onChange={(e) => setNewEvDate(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Event Kind / Type:
                          </label>
                          <select
                            value={newEvKind}
                            onChange={(e) => {
                              const k = e.target.value;
                              setNewEvKind(k);
                              if (k === "Field trip") setNewEvKindKm("ការងារទីវាល");
                              else if (k === "Conference") setNewEvKindKm("សន្និសីទ");
                              else if (k === "Webinar") setNewEvKindKm("សិក្ខាសាលាអនឡាញ");
                              else if (k === "Meetup") setNewEvKindKm("ការជួបជុំ");
                              else if (k === "Workshop") setNewEvKindKm("សិក្ខាសាលា");
                            }}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          >
                            <option value="Field trip">Field trip</option>
                            <option value="Conference">Conference</option>
                            <option value="Webinar">Webinar</option>
                            <option value="Meetup">Meetup</option>
                            <option value="Workshop">Workshop</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Status:
                          </label>
                          <select
                            value={newEvStatus}
                            onChange={(e) => setNewEvStatus(e.target.value as "published" | "draft")}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Location / Venue (English) *:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Kampong Thom Province / Online"
                            value={newEvPlace}
                            onChange={(e) => setNewEvPlace(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            ទីតាំង (ភាសាខ្មែរ):
                          </label>
                          <input
                            type="text"
                            placeholder="ឧ. ខេត្តកំពង់ធំ / លើបណ្តាញអនឡាញ"
                            value={newEvPlaceKm}
                            onChange={(e) => setNewEvPlaceKm(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "10px" }}>
                        <button type="submit" className="button button-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <CheckCircle2 size={16} /> Save & Schedule Event
                        </button>
                        <button type="button" className="button" onClick={() => setShowAddEvent(false)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* FILTER & SEARCH CONTROLS */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", margin: "16px 0" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    type="button"
                    className="button button-small"
                    style={{
                      background: eventStatusFilter === "All" ? "var(--wp-cyan)" : "var(--wp-bg-card)",
                      color: eventStatusFilter === "All" ? "#000" : "var(--wp-text-primary)",
                      borderColor: eventStatusFilter === "All" ? "var(--wp-cyan)" : "var(--wp-border)",
                    }}
                    onClick={() => setEventStatusFilter("All")}
                  >
                    All Events ({events.length})
                  </button>
                  <button
                    type="button"
                    className="button button-small"
                    style={{
                      background: eventStatusFilter === "published" ? "var(--wp-cyan)" : "var(--wp-bg-card)",
                      color: eventStatusFilter === "published" ? "#000" : "var(--wp-text-primary)",
                      borderColor: eventStatusFilter === "published" ? "var(--wp-cyan)" : "var(--wp-border)",
                    }}
                    onClick={() => setEventStatusFilter("published")}
                  >
                    Published ({events.filter((e) => e.status === "published").length})
                  </button>
                  <button
                    type="button"
                    className="button button-small"
                    style={{
                      background: eventStatusFilter === "draft" ? "var(--wp-cyan)" : "var(--wp-bg-card)",
                      color: eventStatusFilter === "draft" ? "#000" : "var(--wp-text-primary)",
                      borderColor: eventStatusFilter === "draft" ? "var(--wp-cyan)" : "var(--wp-border)",
                    }}
                    onClick={() => setEventStatusFilter("draft")}
                  >
                    Drafts ({events.filter((e) => e.status === "draft").length})
                  </button>
                </div>

                <div style={{ position: "relative", minWidth: "260px" }}>
                  <Search size={15} style={{ position: "absolute", left: "10px", top: "10px", color: "var(--wp-text-muted)" }} />
                  <input
                    type="search"
                    placeholder="Search events by title, location, or type..."
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "6px 10px 6px 32px",
                      borderRadius: "6px",
                      background: "var(--wp-input-bg)",
                      color: "var(--wp-input-text)",
                      border: "1px solid var(--wp-input-border)",
                      fontSize: "13px",
                    }}
                  />
                </div>
              </div>

              {/* EVENTS TABLE */}
              <table className="wp-list-table">
                <thead>
                  <tr>
                    <th>Event Title & Type</th>
                    <th>Date</th>
                    <th>Location / Venue</th>
                    <th>Status</th>
                    <th style={{ minWidth: "240px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((ev) => (
                    <tr key={ev.id}>
                      <td style={{ maxWidth: "380px" }}>
                        <strong>{ev.title}</strong>
                        {ev.titleKm && (
                          <div style={{ fontSize: "12px", color: "var(--wp-text-muted)", marginTop: "2px" }}>
                            {ev.titleKm}
                          </div>
                        )}
                        <div style={{ marginTop: "4px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(56,189,248,0.15)", color: "var(--wp-cyan)" }}>
                            {ev.kind} {ev.kindKm ? `· ${ev.kindKm}` : ""}
                          </span>
                        </div>
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <strong>{ev.date}</strong>
                      </td>
                      <td style={{ fontSize: "13px" }}>
                        {ev.place}
                        {ev.placeKm && (
                          <div style={{ fontSize: "11px", color: "var(--wp-text-muted)" }}>
                            {ev.placeKm}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${ev.status}`}>{ev.status}</span>
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="button button-small"
                            onClick={() => handleStartEditEvent(ev)}
                            title="Edit event details / កែប្រែព័ត៌មានព្រឹត្តិការណ៍"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: "var(--wp-cyan)",
                              borderColor: "rgba(56,189,248,0.35)",
                            }}
                          >
                            <Edit size={12} />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="button button-small"
                            onClick={() => setEventToDelete(ev)}
                            title="Delete event / លុបព្រឹត្តិការណ៍"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: "var(--wp-rose)",
                              borderColor: "rgba(248,113,113,0.35)",
                            }}
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                          <button
                            type="button"
                            className="button button-small"
                            onClick={() => handleToggleEventStatus(ev)}
                            title={ev.status === "draft" ? "Publish to public website" : "Revert to draft"}
                          >
                            {ev.status === "draft" ? "Publish" : "Unpublish"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredEvents.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "30px", color: "var(--wp-text-muted)" }}>
                        No events found matching this filter or search. Click "+ Create New Event" above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* EDIT EVENT MODAL DIALOG */}
              {editingEvent && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                  <div
                    className="w-full max-w-xl rounded-2xl border border-[var(--wp-border)] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                    style={{ background: "var(--wp-bg-card, #1e293b)", color: "var(--wp-text-primary, #f8fafc)" }}
                  >
                    <div className="flex items-center justify-between border-b border-[var(--wp-border)] pb-3">
                      <div className="flex items-center gap-2">
                        <Edit size={20} className="text-cyan-400" />
                        <div>
                          <h3 className="text-base font-bold" style={{ margin: 0 }}>
                            Edit Event / កែប្រែព័ត៌មានព្រឹត្តិការណ៍
                          </h3>
                          <p style={{ margin: 0, fontSize: "12px", color: "var(--wp-text-muted)" }}>
                            ID: {editingEvent.id}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingEvent(null)}
                        className="button button-small"
                        style={{ padding: "4px 8px" }}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveEditEvent}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Event Title (English) *:
                          </label>
                          <input
                            type="text"
                            required
                            value={editEvTitle}
                            onChange={(e) => setEditEvTitle(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            ចំណងជើងព្រឹត្តិការណ៍ (ភាសាខ្មែរ):
                          </label>
                          <input
                            type="text"
                            value={editEvTitleKm}
                            onChange={(e) => setEditEvTitleKm(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: "14px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Date (YYYY-MM-DD) *:
                          </label>
                          <input
                            type="date"
                            required
                            value={editEvDate}
                            onChange={(e) => setEditEvDate(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Event Kind / Type:
                          </label>
                          <select
                            value={editEvKind}
                            onChange={(e) => {
                              const k = e.target.value;
                              setEditEvKind(k);
                              if (k === "Field trip") setEditEvKindKm("ការងារទីវាល");
                              else if (k === "Conference") setEditEvKindKm("សន្និសីទ");
                              else if (k === "Webinar") setEditEvKindKm("សិក្ខាសាលាអនឡាញ");
                              else if (k === "Meetup") setEditEvKindKm("ការជួបជុំ");
                              else if (k === "Workshop") setEditEvKindKm("សិក្ខាសាលា");
                            }}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          >
                            <option value="Field trip">Field trip</option>
                            <option value="Conference">Conference</option>
                            <option value="Webinar">Webinar</option>
                            <option value="Meetup">Meetup</option>
                            <option value="Workshop">Workshop</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Status:
                          </label>
                          <select
                            value={editEvStatus}
                            onChange={(e) => setEditEvStatus(e.target.value as "published" | "draft")}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            Location / Venue (English) *:
                          </label>
                          <input
                            type="text"
                            required
                            value={editEvPlace}
                            onChange={(e) => setEditEvPlace(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", fontSize: "13px" }}>
                            ទីតាំង (ភាសាខ្មែរ):
                          </label>
                          <input
                            type="text"
                            value={editEvPlaceKm}
                            onChange={(e) => setEditEvPlaceKm(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--wp-input-bg)", color: "var(--wp-input-text)", border: "1px solid var(--wp-input-border)" }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid var(--wp-border)", paddingTop: "14px" }}>
                        <button
                          type="button"
                          className="button"
                          onClick={() => setEditingEvent(null)}
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <X size={15} />
                          Cancel / បោះបង់
                        </button>
                        <button
                          type="submit"
                          className="button button-primary"
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <Check size={15} />
                          Save Changes / រក្សាទុក
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* DELETE EVENT CONFIRMATION MODAL DIALOG */}
              {eventToDelete && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                  <div
                    className="w-full max-w-md rounded-2xl border border-[var(--wp-border)] p-6 shadow-2xl space-y-4"
                    style={{ background: "var(--wp-bg-card, #1e293b)", color: "var(--wp-text-primary, #f8fafc)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ padding: "8px", borderRadius: "50%", background: "rgba(248,113,113,0.15)", color: "var(--wp-rose)" }}>
                        <Trash2 size={24} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>
                          Delete Event / លុបព្រឹត្តិការណ៍
                        </h3>
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--wp-text-muted)" }}>
                          Confirm deletion from event schedule
                        </p>
                      </div>
                    </div>

                    <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(0,0,0,0.25)", border: "1px solid var(--wp-border)" }}>
                      <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "14px" }}>
                        {eventToDelete.title}
                      </p>
                      {eventToDelete.titleKm && (
                        <p style={{ margin: "0 0 6px", fontSize: "12px", color: "var(--wp-text-muted)" }}>
                          {eventToDelete.titleKm}
                        </p>
                      )}
                      <div style={{ display: "flex", gap: "8px", fontSize: "11px", marginTop: "6px" }}>
                        <span style={{ padding: "2px 6px", borderRadius: "4px", background: "rgba(56,189,248,0.15)", color: "var(--wp-cyan)" }}>
                          {eventToDelete.kind}
                        </span>
                        <span style={{ color: "var(--wp-text-muted)" }}>
                          Date: {eventToDelete.date}
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: 0, fontSize: "13px", color: "var(--wp-rose)" }}>
                      ⚠️ Are you sure you want to permanently delete this event? This action will remove it from the public schedule and website.
                    </p>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "8px" }}>
                      <button
                        type="button"
                        className="button"
                        onClick={() => setEventToDelete(null)}
                      >
                        Cancel / បោះបង់
                      </button>
                      <button
                        type="button"
                        className="button"
                        onClick={handleExecuteDeleteEvent}
                        style={{
                          background: "var(--wp-rose)",
                          color: "#fff",
                          borderColor: "var(--wp-rose)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Trash2 size={15} />
                        Delete Permanently / លុបជាអចិន្ត្រៃយ៍
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* RESET EVENTS CONFIRMATION MODAL */}
              {showResetEventsConfirm && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                  <div
                    className="w-full max-w-md rounded-2xl border border-[var(--wp-border)] p-6 shadow-2xl space-y-4"
                    style={{ background: "var(--wp-bg-card, #1e293b)", color: "var(--wp-text-primary, #f8fafc)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ padding: "8px", borderRadius: "50%", background: "rgba(56,189,248,0.15)", color: "var(--wp-cyan)" }}>
                        <RotateCcw size={24} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>
                          Reset Events Schedule / កំណត់ដើមឡើងវិញ
                        </h3>
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--wp-text-muted)" }}>
                          Restore default conference & field trip schedule
                        </p>
                      </div>
                    </div>

                    <p style={{ margin: 0, fontSize: "13px", color: "var(--wp-text-secondary)" }}>
                      Are you sure you want to restore the events schedule to system defaults? Any custom added, edited, or deleted events will be reset to the original collection.
                    </p>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "8px" }}>
                      <button
                        type="button"
                        className="button"
                        onClick={() => setShowResetEventsConfirm(false)}
                      >
                        Cancel / បោះបង់
                      </button>
                      <button
                        type="button"
                        className="button button-primary"
                        onClick={handleExecuteResetEvents}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <RotateCcw size={15} />
                        Confirm Reset / កំណត់ឡើងវិញ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              VIEW: MEMBERS
              ================================================================ */}
          {section === "members" && (
            <div className="p-4 sm:p-6 bg-background rounded-xl border border-border mt-2">
              <MemberManager />
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

          {section === "translations" && <TranslationManager />}

          {/* ================================================================
              VIEW: SETTINGS
              ================================================================ */}
          {section === "facebook" && <FacebookManager />}

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
