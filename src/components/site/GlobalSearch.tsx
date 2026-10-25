import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  X,
  ArrowRight,
  BookOpen,
  FileText,
  MapPin,
  Pickaxe,
  Compass,
  Layers,
  Sparkles,
  ExternalLink,
  Tag,
  CornerDownLeft,
} from "lucide-react";
import { Link } from "@/lib/spa-router";
import { useI18n } from "@/lib/i18n";
import {
  searchSite,
  type SearchCategory,
  type SearchResultItem,
} from "@/lib/site-search";

const categoryFilters: Array<{ id: SearchCategory; labelEn: string; labelKm: string }> = [
  { id: "all", labelEn: "All", labelKm: "ទាំងអស់" },
  { id: "research", labelEn: "Research", labelKm: "ការស្រាវជ្រាវ" },
  { id: "publication", labelEn: "Publications", labelKm: "ឯកសារបោះពុម្ព" },
  { id: "geodata", labelEn: "GeoData", labelKm: "ទិន្នន័យភូគព្ភសាស្ត្រ" },
  { id: "mining", labelEn: "Mining", labelKm: "វិស័យរ៉ែ" },
  { id: "geopark", labelEn: "3D Geopark", labelKm: "ឧទ្យាន 3D" },
  { id: "lexicon", labelEn: "Lexicon", labelKm: "សទ្ទានុក្រម" },
  { id: "page", labelEn: "Pages", labelKm: "ទំព័រស្ថាប័ន" },
];

const popularQueries = [
  { en: "Tectonics", km: "តិចតូនិច" },
  { en: "Copper & Gold", km: "ទង់ដែង និងមាស" },
  { en: "Groundwater", km: "ទឹកក្រោមដី" },
  { en: "Phnom Kulen", km: "ភ្នំគូលែន" },
  { en: "Earthquake", km: "ការរញ្ជួយដី" },
  { en: "Mining License", km: "អាជ្ញាបណ្ណរ៉ែ" },
  { en: "Marine Geology", km: "ភូគព្ភសាស្ត្រសមុទ្រ" },
];

function getCategoryBadgeColor(cat: SearchCategory): string {
  switch (cat) {
    case "research":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
    case "publication":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
    case "geodata":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800";
    case "mining":
      return "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
    case "geopark":
      return "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800";
    case "lexicon":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
    case "news":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
    case "event":
      return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  }
}

function getCategoryIcon(cat: SearchCategory) {
  switch (cat) {
    case "research":
      return <Compass size={14} className="shrink-0" />;
    case "publication":
      return <FileText size={14} className="shrink-0" />;
    case "geodata":
      return <Layers size={14} className="shrink-0" />;
    case "mining":
      return <Pickaxe size={14} className="shrink-0" />;
    case "geopark":
      return <MapPin size={14} className="shrink-0" />;
    case "lexicon":
      return <BookOpen size={14} className="shrink-0" />;
    default:
      return <Tag size={14} className="shrink-0" />;
  }
}

export function GlobalSearch() {
  const { lang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SearchCategory>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Compute live search results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchSite(query, { category, limit: 25, lang });
  }, [query, category, lang]);

  // Handle global shortcut (Ctrl+K, Cmd+K, or '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in another input/textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) &&
        target !== inputRef.current
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "/" && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 60);
    } else {
      setQuery("");
      setCategory("all");
    }
  }, [isOpen]);

  // Reset selected index when query or category changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, category]);

  // Arrow key navigation inside modal
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % results.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results.length > 0 && results[selectedIndex]) {
        const item = results[selectedIndex];
        navigateToItem(item.url);
      }
    }
  };

  const navigateToItem = (url: string) => {
    setIsOpen(false);
    // Use SPA client routing
    history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Navbar Search Bar / Trigger Button */}
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 rounded-full border border-slate-200/90 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-600 transition-all duration-200 hover:border-blue-400 hover:bg-white hover:text-blue-600 hover:shadow-xs focus-visible:outline-2 focus-visible:outline-blue-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-blue-500"
          title={lang === "km" ? "ស្វែងរកគេហទំព័រ (Ctrl+K)" : "Search website (Ctrl+K)"}
          aria-label={lang === "km" ? "ស្វែងរក" : "Search"}
        >
          <Search size={15} className="text-slate-500 group-hover:text-blue-600 transition" />
          <span className="hidden sm:inline-block font-medium">
            {lang === "km" ? "ស្វែងរក..." : "Search..."}
          </span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-500 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            <span className="text-[11px]">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Global Omnisearch Modal Dialog */}
      {isOpen && mounted && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center p-3 sm:p-6 md:p-12 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={lang === "km" ? "ស្វែងរកគេហទំព័រ" : "Site Search"}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 z-10 flex flex-col max-h-[85vh]">
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4 dark:border-slate-800">
              <Search size={22} className="shrink-0 text-blue-600" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={
                  lang === "km"
                    ? "វាយពាក្យគន្លឹះដើម្បីស្វែងរក... (ឧ. តិចតូនិច, រ៉ែ, ទឹកក្រោមដី, ភ្នំគូលែន)"
                    : "Search anything by keyword... (e.g. Tectonics, Copper, Groundwater, Kulen)"
                }
                className="w-full bg-transparent text-base sm:text-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden dark:text-white dark:placeholder:text-slate-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                  aria-label="Clear query"
                >
                  <X size={18} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                ESC
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2.5 border-b border-slate-100 bg-slate-50/50 scrollbar-none dark:border-slate-800 dark:bg-slate-900/40">
              {categoryFilters.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {lang === "km" ? cat.labelKm : cat.labelEn}
                  </button>
                );
              })}
            </div>

            {/* Results List / Suggestions Body */}
            <div ref={listRef} className="overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100 dark:divide-slate-800/60 flex-1">
              {/* Empty query state: Popular suggestions */}
              {!query.trim() && (
                <div className="py-6 px-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>{lang === "km" ? "ពាក្យគន្លឹះពេញនិយម" : "Popular Searches"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularQueries.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setQuery(lang === "km" ? item.km : item.en);
                          inputRef.current?.focus();
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50/60 hover:text-blue-700 transition dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
                      >
                        {lang === "km" ? item.km : item.en}
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-500 leading-relaxed dark:border-slate-800">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === "km" ? "ស្វែងរកបានទូទាំងប្រព័ន្ធ៖" : "Search covers the entire website:"}
                    </p>
                    <p>
                      {lang === "km"
                        ? "អត្ថបទស្រាវជ្រាវ (Tectonics, Hydrogeology, Marine...), ឯកសារបោះពុម្ពផ្សាយ, ផែនទីភូគព្ភសាស្ត្រ GIS, ច្បាប់និងអាជ្ញាបណ្ណរ៉ែ, ឧទ្យាន 3D, និងសទ្ទានុក្រមពាក្យបច្ចេកទេស។"
                        : "Key research disciplines (Tectonics, Hydrogeology, Marine...), publications, interactive GIS maps, mining laws & licenses, 3D Geopark sites, and bilingual lexicon terms."}
                    </p>
                  </div>
                </div>
              )}

              {/* No results state */}
              {query.trim() && results.length === 0 && (
                <div className="py-12 text-center">
                  <Search size={36} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "km" ? "រកមិនឃើញព័ត៌មានដែលត្រូវនឹង៖" : "No results found for:"}{" "}
                    <span className="text-blue-600">"{query}"</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {lang === "km"
                      ? "សូមសាកល្បងពាក្យគន្លឹះផ្សេងទៀត ឬត្រួតពិនិត្យអក្ខរាវិរុទ្ធ"
                      : "Try different keywords, shorter phrases, or checking for typos"}
                  </p>
                </div>
              )}

              {/* Live search results */}
              {results.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                const title = lang === "km" ? item.titleKm : item.titleEn;
                const subtitle = lang === "km" ? item.titleEn : item.titleKm;
                const desc = lang === "km" ? item.descriptionKm : item.descriptionEn;
                const badgeColor = getCategoryBadgeColor(item.category);
                const categoryLabel = lang === "km" ? item.categoryLabelKm : item.categoryLabelEn;

                return (
                  <div
                    key={item.id}
                    onClick={() => navigateToItem(item.url)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group cursor-pointer rounded-xl p-3 sm:p-4 transition flex items-start gap-3.5 ${
                      isSelected
                        ? "bg-blue-50/80 dark:bg-blue-950/40"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${badgeColor}`}
                      >
                        {getCategoryIcon(item.category)}
                        <span>{categoryLabel}</span>
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`text-sm sm:text-base font-bold leading-snug transition ${
                            isSelected ? "text-blue-700 dark:text-blue-400" : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {title}
                        </h4>
                        <ArrowRight
                          size={15}
                          className={`shrink-0 transition-transform ${
                            isSelected
                              ? "translate-x-1 text-blue-600 opacity-100"
                              : "opacity-0 text-slate-400"
                          }`}
                        />
                      </div>

                      {subtitle && subtitle !== title && (
                        <p className="text-xs text-slate-500 italic mt-0.5 truncate">
                          {subtitle}
                        </p>
                      )}

                      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {desc}
                      </p>

                      {item.meta && (
                        <span className="mt-1.5 inline-block text-[11px] font-medium text-slate-500">
                          {item.meta}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-white px-1 font-mono text-[10px] shadow-2xs dark:bg-slate-800">
                    ↑
                  </kbd>
                  <kbd className="rounded border bg-white px-1 font-mono text-[10px] shadow-2xs dark:bg-slate-800">
                    ↓
                  </kbd>{" "}
                  {lang === "km" ? "រុករក" : "Navigate"}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-white px-1 font-mono text-[10px] shadow-2xs dark:bg-slate-800">
                    ↵
                  </kbd>{" "}
                  {lang === "km" ? "ជ្រើសរើស" : "Select"}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-white px-1 font-mono text-[10px] shadow-2xs dark:bg-slate-800">
                    ESC
                  </kbd>{" "}
                  {lang === "km" ? "បិទ" : "Close"}
                </span>
              </div>

              {results.length > 0 && (
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {results.length} {lang === "km" ? "លទ្ធផលត្រូវគ្នា" : "matches"}
                </span>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
