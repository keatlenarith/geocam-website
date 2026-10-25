import { useState, useEffect, useMemo, useRef } from "react";
import {
  TOC_CATEGORIES,
  DEFAULT_TOC_LAYERS,
  loadSavedTocSymbology,
  saveTocSymbology,
  resetTocSymbology,
  type TocLayerItem,
  type LayerSymbology,
} from "../features/geodata/toc-config";
import {
  AVAILABLE_SYMBOLS,
  AVAILABLE_LINE_STYLES,
  type MapSymbol,
  type LineStyle,
  importGeodata,
  type MapDataset,
  defaultStyle,
} from "../features/geodata/import-geodata";
import { useAdmin } from "./Auth";
import { supabase } from "../lib/supabase";
import GeodataMapPreview from "./GeodataMapPreview";
import {
  Eye,
  EyeOff,
  Sliders,
  RotateCcw,
  Save,
  Search,
  UploadCloud,
  ChevronDown,
  ChevronRight,
  Layers,
  Sparkles,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  MapPin,
  Maximize2,
} from "lucide-react";

export default function GeodataTocManager() {
  const { admin } = useAdmin();
  const [lang, setLang] = useState<"en" | "km">("km");
  const km = lang === "km";

  // Layers list
  const [layers, setLayers] = useState<TocLayerItem[]>(() => {
    const saved = loadSavedTocSymbology();
    return DEFAULT_TOC_LAYERS.map((l) => {
      const override = saved[l.id];
      return override ? { ...l, symbology: { ...l.symbology, ...override } } : l;
    });
  });

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    DEFAULT_TOC_LAYERS[0]?.id || null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Status and notification banner
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<TocLayerItem["category"]>("geology");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom uploaded layers from Supabase geocam_map_layers
  useEffect(() => {
    let active = true;
    const fetchCustomLayers = async () => {
      try {
        const { data, error } = await supabase
          .from("geocam_map_layers")
          .select("*")
          .order("created_at");

        if (error || !data || !active) return;

        const saved = loadSavedTocSymbology();
        const customItems: TocLayerItem[] = data.map((d: MapDataset) => {
          const override = saved[d.id];
          const sym: LayerSymbology = {
            visible: true,
            opacity: d.settings?.opacity ?? 0.5,
            color: d.settings?.color || "#2563eb",
            fillColor: d.settings?.fillColor || d.settings?.color || "#2563eb",
            strokeWidth: d.settings?.width || 3,
            lineStyle: (d.settings?.lineStyle as LineStyle) || "solid",
            symbol: (d.settings?.symbol as MapSymbol) || "circle",
            symbolSize: d.settings?.size || 24,
            original: d.settings?.original ?? false,
            ...(override || {}),
          };

          // Infer geometry type from first feature
          const firstGeom = d.data?.features?.[0]?.geometry?.type || "Polygon";
          const geometryType =
            firstGeom === "Point" || firstGeom === "MultiPoint"
              ? "Point"
              : firstGeom === "LineString" || firstGeom === "MultiLineString"
              ? "LineString"
              : "Polygon";

          return {
            id: d.id,
            nameEn: d.name,
            nameKm: d.name,
            category: (d.category as TocLayerItem["category"]) || "other",
            geometryType,
            featureCount: d.data?.features?.length || 0,
            descriptionEn: `Custom uploaded dataset (${d.filename || "GeoJSON"})`,
            descriptionKm: `ទិន្នន័យបានបញ្ចូលដោយអ្នកប្រើប្រាស់ (${d.filename || "GeoJSON"})`,
            isBuiltin: false,
            sourceDatasetId: d.id,
            symbology: sym,
            geojson: d.data,
          };
        });

        if (customItems.length > 0 && active) {
          setLayers((prev) => {
            const existingIds = new Set(customItems.map((c) => c.id));
            const filteredPrev = prev.filter((p) => p.isBuiltin || !existingIds.has(p.id));
            return [...filteredPrev, ...customItems];
          });
        }
      } catch {
        // Continue with builtins
      }
    };

    void fetchCustomLayers();
    return () => {
      active = false;
    };
  }, []);

  // Selected Layer
  const selectedLayer = useMemo(
    () => layers.find((l) => l.id === selectedLayerId) || null,
    [layers, selectedLayerId],
  );

  // Filtered Layers
  const filteredLayers = useMemo(() => {
    return layers.filter((layer) => {
      const matchesCategory = categoryFilter === "all" || layer.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        layer.nameEn.toLowerCase().includes(q) ||
        layer.nameKm.toLowerCase().includes(q) ||
        layer.descriptionEn.toLowerCase().includes(q) ||
        layer.descriptionKm.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [layers, categoryFilter, searchQuery]);

  // Grouped by Category
  const layersByCategory = useMemo(() => {
    const map = new Map<string, TocLayerItem[]>();
    filteredLayers.forEach((l) => {
      const list = map.get(l.category) || [];
      list.push(l);
      map.set(l.category, list);
    });
    return map;
  }, [filteredLayers]);

  // Toggle Visibility for a single layer
  const handleToggleVisibility = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLayers((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, symbology: { ...l.symbology, visible: !l.symbology.visible } }
          : l,
      ),
    );
  };

  // Toggle Category Group Visibility
  const handleToggleCategory = (catId: string, makeVisible: boolean) => {
    setLayers((prev) =>
      prev.map((l) =>
        l.category === catId
          ? { ...l, symbology: { ...l.symbology, visible: makeVisible } }
          : l,
      ),
    );
  };

  // Show All / Hide All
  const handleToggleAll = (visible: boolean) => {
    setLayers((prev) =>
      prev.map((l) => ({
        ...l,
        symbology: { ...l.symbology, visible },
      })),
    );
    setStatusMsg({
      type: "info",
      text: visible
        ? km
          ? "បានបើកបង្ហាញស្រទាប់ផែនទីទាំងអស់"
          : "All layers set to visible"
        : km
        ? "បានលាក់ស្រទាប់ផែនទីទាំងអស់"
        : "All layers hidden",
    });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  // Update Symbology property
  const handleUpdateSymbology = (id: string, patch: Partial<LayerSymbology>) => {
    setLayers((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, symbology: { ...l.symbology, ...patch } } : l,
      ),
    );
  };

  // Save all settings to localStorage and notify system
  const handleSaveAll = () => {
    setIsSaving(true);
    try {
      const overrides: Record<string, Partial<LayerSymbology>> = {};
      layers.forEach((l) => {
        overrides[l.id] = l.symbology;
      });
      saveTocSymbology(overrides);

      // If custom layer, optionally sync to Supabase
      layers
        .filter((l) => !l.isBuiltin && l.sourceDatasetId)
        .forEach((l) => {
          void supabase
            .from("geocam_map_layers")
            .update({
              settings: {
                ...defaultStyle,
                color: l.symbology.color,
                fillColor: l.symbology.fillColor,
                opacity: l.symbology.opacity,
                width: l.symbology.strokeWidth,
                lineStyle: l.symbology.lineStyle,
                symbol: l.symbology.symbol,
                size: l.symbology.symbolSize,
                original: l.symbology.original ?? false,
              },
            })
            .eq("id", l.sourceDatasetId);
        });

      setStatusMsg({
        type: "success",
        text: km
          ? "បានរក្សាទុកការកំណត់រូបសញ្ញា (Symbology) និងស្ថានភាពបង្ហាញជោគជ័យ! ផែនទីសាធារណៈត្រូវបានធ្វើបច្ចុប្បន្នភាពភ្លាមៗ។"
          : "TOC Symbology and visibility configuration saved successfully! Public maps are now synced.",
      });
      setTimeout(() => setStatusMsg(null), 5000);
    } catch {
      setStatusMsg({
        type: "error",
        text: km ? "បរាជ័យក្នុងការរក្សាទុក។ សូមសាកល្បងម្ដងទៀត។" : "Failed to save symbology settings.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to Factory Symbology
  const handleResetDefaults = () => {
    if (
      !confirm(
        km
          ? "តើអ្នកប្រាកដជាចង់កំណត់រូបសញ្ញា និងពណ៌ទាំងអស់ទៅជាតម្លៃដើមរបស់ប្រព័ន្ធវិញឬទេ?"
          : "Are you sure you want to reset all layer symbology to system defaults?",
      )
    )
      return;

    resetTocSymbology();
    setLayers(DEFAULT_TOC_LAYERS);
    setSelectedLayerId(DEFAULT_TOC_LAYERS[0]?.id || null);
    setStatusMsg({
      type: "info",
      text: km ? "បានកំណត់រូបសញ្ញាដើមឡើងវិញដោយជោគជ័យ។" : "Layer symbology reset to defaults.",
    });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Move layer order (reorder in TOC & Map stack)
  const handleMoveLayer = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= layers.length) return;

    setLayers((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Upload GeoJSON / KML / KMZ file
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const file = files[0];
    setIsUploading(true);
    setStatusMsg({
      type: "info",
      text: km ? `កំពុងដំណើរការអានទិន្នន័យ ${file.name}…` : `Parsing ${file.name}…`,
    });

    try {
      const parsed = await importGeodata(file);
      const id = crypto.randomUUID();
      const path = `${id}/${file.name.replace(/[^a-z\d._-]/gi, "_")}`;

      // Upload file to Supabase Storage if authenticated
      if (admin) {
        try {
          await supabase.storage
            .from("geocam-geodata")
            .upload(path, file, { contentType: "application/octet-stream" });
        } catch {
          // Continue local
        }
      }

      // Infer geometry type
      const firstGeom = parsed.data?.features?.[0]?.geometry?.type || "Polygon";
      const geometryType =
        firstGeom === "Point" || firstGeom === "MultiPoint"
          ? "Point"
          : firstGeom === "LineString" || firstGeom === "MultiLineString"
          ? "LineString"
          : "Polygon";

      const newLayerItem: TocLayerItem = {
        id,
        nameEn: file.name.replace(/\.[^/.]+$/, ""),
        nameKm: file.name.replace(/\.[^/.]+$/, ""),
        category: uploadCategory,
        geometryType,
        featureCount: parsed.data.features.length,
        descriptionEn: `Uploaded dataset: ${file.name}`,
        descriptionKm: `ទិន្នន័យបញ្ចូល៖ ${file.name}`,
        isBuiltin: false,
        sourceDatasetId: id,
        symbology: {
          visible: true,
          opacity: 0.5,
          color: "#0284c7",
          fillColor: "#38bdf8",
          strokeWidth: 3,
          lineStyle: "solid",
          symbol: "circle",
          symbolSize: 24,
          original: false,
        },
        geojson: parsed.data,
      };

      // Add to state
      setLayers((prev) => [newLayerItem, ...prev]);
      setSelectedLayerId(newLayerItem.id);
      setShowUploadModal(false);

      // Save to Supabase DB if admin
      if (admin) {
        await supabase.from("geocam_map_layers").insert({
          id,
          name: newLayerItem.nameEn,
          category: uploadCategory,
          filename: file.name,
          source_path: path,
          data: parsed.data,
          settings: { ...defaultStyle },
          status: "published",
        });
      }

      setStatusMsg({
        type: "success",
        text: km
          ? `បានបញ្ចូលស្រទាប់ ${file.name} ចំនួន ${parsed.data.features.length} features ទៅក្នុងមាតិកាផែនទីជោគជ័យ!`
          : `Successfully imported ${file.name} with ${parsed.data.features.length} features into TOC!`,
      });
      setTimeout(() => setStatusMsg(null), 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setStatusMsg({
        type: "error",
        text: km ? `បរាជ័យក្នុងការបញ្ចូល៖ ${msg}` : `Import failed: ${msg}`,
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Download layer as GeoJSON
  const handleDownloadLayerGeoJson = (layer: TocLayerItem) => {
    if (!layer.geojson) return;
    const blob = new Blob([JSON.stringify(layer.geojson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layer.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Delete custom uploaded layer
  const handleDeleteCustomLayer = async (layer: TocLayerItem) => {
    if (
      !confirm(
        km
          ? `តើអ្នកប្រាកដជាចង់លុបស្រទាប់ "${layer.nameKm}" នេះចេញពីប្រព័ន្ធឬទេ?`
          : `Delete layer "${layer.nameEn}" from system?`,
      )
    )
      return;

    setLayers((prev) => prev.filter((l) => l.id !== layer.id));
    if (selectedLayerId === layer.id) {
      setSelectedLayerId(layers.find((l) => l.id !== layer.id)?.id || null);
    }

    if (admin && layer.sourceDatasetId) {
      try {
        await supabase.from("geocam_map_layers").delete().eq("id", layer.sourceDatasetId);
      } catch {
        // continue
      }
    }

    setStatusMsg({
      type: "info",
      text: km ? "បានលុបស្រទាប់ដោយជោគជ័យ។" : "Layer removed successfully.",
    });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const visibleCount = layers.filter((l) => l.symbology.visible).length;

  return (
    <div className="space-y-6">
      {/* 1. Executive TOC Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-[var(--wp-border)] bg-[var(--wp-bg-surface)] shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="text-cyan-400" size={26} />
            <h1 className="text-xl md:text-2xl font-bold text-[var(--wp-text-primary)]">
              {km
                ? "មាតិកាទិន្នន័យផែនទី & កំណត់រូបសញ្ញា (TOC & Symbology Manager)"
                : "Geodata Table of Contents & Symbology Manager"}
            </h1>
          </div>
          <p className="mt-1 text-xs md:text-sm text-[var(--wp-text-muted)]">
            {km
              ? "គ្រប់គ្រងស្រទាប់ភូគព្ភសាស្ត្រ បើក/លាក់ (Show/Hide) រៀបលំដាប់ថ្នាក់ និងកំណត់លក្ខណៈរូបសញ្ញា (ពណ៌ គំនូសព្រំ និងទំហំ) សម្រាប់ផែនទីកម្ពុជា។"
              : "Easily manage, show, hide, reorder, and configure rich geological symbology properties for Cambodia GIS layers."}
          </p>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => setLang(lang === "km" ? "en" : "km")}
            className="px-3 py-1.5 rounded-lg border border-[var(--wp-border)] bg-[var(--wp-bg-card)] hover:border-cyan-400 text-xs font-semibold text-[var(--wp-text-secondary)] transition-colors"
          >
            🌐 {lang === "km" ? "ភាសាខ្មែរ (KM)" : "English (EN)"}
          </button>

          {/* Reset to Defaults */}
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--wp-border)] bg-[var(--wp-bg-card)] hover:border-amber-400 text-xs font-semibold text-[var(--wp-text-secondary)] hover:text-amber-400 transition-colors"
            title={km ? "កំណត់រូបសញ្ញាដើមឡើងវិញ" : "Reset all symbology to defaults"}
          >
            <RotateCcw size={14} />
            {km ? "កំណត់ដើម" : "Reset Defaults"}
          </button>

          {/* Upload Dataset */}
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-semibold text-cyan-400 transition-colors"
          >
            <UploadCloud size={15} />
            {km ? "បញ្ចូលទិន្នន័យ (Upload)" : "Import Geodata"}
          </button>

          {/* Save Configuration */}
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all"
          >
            <Save size={15} />
            {isSaving ? (km ? "កំពុងរក្សាទុក…" : "Saving…") : km ? "រក្សាទុកការកំណត់" : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Status Notification Banner */}
      {statusMsg && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center justify-between p-3.5 rounded-xl border text-xs md:text-sm transition-all ${
            statusMsg.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
              : statusMsg.type === "error"
              ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
              : "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertTriangle size={18} />
            )}
            <span>{statusMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMsg(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Key Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg border border-[var(--wp-border)] bg-[var(--wp-bg-card)]">
          <span className="text-[11px] font-semibold text-[var(--wp-text-muted)] uppercase tracking-wider block">
            {km ? "ស្រទាប់សរុប (Total Layers)" : "Total Layers"}
          </span>
          <span className="text-xl font-bold text-[var(--wp-text-primary)]">{layers.length}</span>
        </div>
        <div className="p-3 rounded-lg border border-[var(--wp-border)] bg-[var(--wp-bg-card)]">
          <span className="text-[11px] font-semibold text-[var(--wp-text-muted)] uppercase tracking-wider block">
            {km ? "ស្រទាប់កំពុងបង្ហាញ (Visible)" : "Visible Layers"}
          </span>
          <span className="text-xl font-bold text-cyan-400">{visibleCount}</span>
        </div>
        <div className="p-3 rounded-lg border border-[var(--wp-border)] bg-[var(--wp-bg-card)]">
          <span className="text-[11px] font-semibold text-[var(--wp-text-muted)] uppercase tracking-wider block">
            {km ? "ស្រទាប់លាក់ (Hidden)" : "Hidden Layers"}
          </span>
          <span className="text-xl font-bold text-slate-400">{layers.length - visibleCount}</span>
        </div>
        <div className="p-3 rounded-lg border border-[var(--wp-border)] bg-[var(--wp-bg-card)]">
          <span className="text-[11px] font-semibold text-[var(--wp-text-muted)] uppercase tracking-wider block">
            {km ? "ទិន្នន័យបញ្ចូល (Custom)" : "Custom Layers"}
          </span>
          <span className="text-xl font-bold text-amber-400">
            {layers.filter((l) => !l.isBuiltin).length}
          </span>
        </div>
      </div>

      {/* 3. Main Split Workspace: Left TOC & Symbology Panel, Right Interactive GIS Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: TOC Layer Tree & Symbology Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-[var(--wp-border)] bg-[var(--wp-bg-surface)] p-4 shadow-sm">
            {/* Search and Quick Filters */}
            <div className="space-y-3 pb-3 border-b border-[var(--wp-border)]">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--wp-text-muted)]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={km ? "ស្វែងរកស្រទាប់ផែនទី…" : "Search layers by name…"}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--wp-input-border)] bg-[var(--wp-input-bg)] text-xs text-[var(--wp-input-text)] focus:outline-none focus:border-cyan-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--wp-text-muted)] hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category dropdown & Quick Show/Hide All */}
              <div className="flex items-center justify-between gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="flex-1 py-1 px-2 rounded-lg border border-[var(--wp-input-border)] bg-[var(--wp-input-bg)] text-xs text-[var(--wp-input-text)]"
                >
                  <option value="all">
                    {km ? `គ្រប់ប្រភេទទាំងអស់ (${layers.length})` : `All Categories (${layers.length})`}
                  </option>
                  {TOC_CATEGORIES.map((cat) => {
                    const count = layers.filter((l) => l.category === cat.id).length;
                    return (
                      <option key={cat.id} value={cat.id}>
                        {km ? cat.labelKm : cat.labelEn} ({count})
                      </option>
                    );
                  })}
                </select>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleAll(true)}
                    className="p-1.5 rounded hover:bg-[var(--wp-bg-card)] text-cyan-400 text-xs font-semibold flex items-center gap-1"
                    title={km ? "បង្ហាញទាំងអស់" : "Show all layers"}
                  >
                    <Eye size={14} />
                    <span className="hidden sm:inline">{km ? "បង្ហាញ" : "All"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleAll(false)}
                    className="p-1.5 rounded hover:bg-[var(--wp-bg-card)] text-slate-400 text-xs font-semibold flex items-center gap-1"
                    title={km ? "លាក់ទាំងអស់" : "Hide all layers"}
                  >
                    <EyeOff size={14} />
                    <span className="hidden sm:inline">{km ? "លាក់" : "Hide"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* TOC Layer Categories & Items Tree */}
            <div className="mt-3 space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {TOC_CATEGORIES.map((cat) => {
                const groupLayers = layersByCategory.get(cat.id);
                if (!groupLayers || groupLayers.length === 0) return null;

                const isCollapsed = !!collapsedCategories[cat.id];
                const catAllVisible = groupLayers.every((l) => l.symbology.visible);

                return (
                  <div
                    key={cat.id}
                    className="rounded-lg border border-[var(--wp-border)] bg-[var(--wp-bg-card)] overflow-hidden"
                  >
                    {/* Category Header */}
                    <div
                      onClick={() =>
                        setCollapsedCategories((prev) => ({
                          ...prev,
                          [cat.id]: !prev[cat.id],
                        }))
                      }
                      className="flex items-center justify-between px-3 py-2 bg-[var(--wp-bg-surface)] cursor-pointer hover:bg-white/5 transition-colors select-none"
                    >
                      <div className="flex items-center gap-2">
                        {isCollapsed ? (
                          <ChevronRight size={14} className="text-[var(--wp-text-muted)]" />
                        ) : (
                          <ChevronDown size={14} className="text-[var(--wp-text-muted)]" />
                        )}
                        <span className="font-bold text-xs text-[var(--wp-text-primary)]">
                          {km ? cat.labelKm : cat.labelEn}
                        </span>
                        <span className={`px-1.5 py-0.2 text-[10px] rounded-full border ${cat.badgeColor}`}>
                          {groupLayers.length}
                        </span>
                      </div>

                      {/* Quick Category Visibility Toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCategory(cat.id, !catAllVisible);
                        }}
                        className={`p-1 rounded text-xs transition-colors ${
                          catAllVisible
                            ? "text-cyan-400 hover:text-cyan-300"
                            : "text-[var(--wp-text-muted)] hover:text-white"
                        }`}
                        title={
                          catAllVisible
                            ? km
                              ? "លាក់ប្រភេទនេះទាំងមូល"
                              : "Hide all in group"
                            : km
                            ? "បង្ហាញប្រភេទនេះទាំងមូល"
                            : "Show all in group"
                        }
                      >
                        {catAllVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    </div>

                    {/* Layer Items in this Category */}
                    {!isCollapsed && (
                      <div className="divide-y divide-[var(--wp-border)]">
                        {groupLayers.map((layer, idx) => {
                          const isSelected = selectedLayerId === layer.id;
                          const isVis = layer.symbology.visible;

                          return (
                            <div
                              key={layer.id}
                              onClick={() => setSelectedLayerId(layer.id)}
                              className={`p-2.5 transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-cyan-500/10 border-l-4 border-l-cyan-400"
                                  : "hover:bg-white/5"
                              } ${!isVis ? "opacity-60" : ""}`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  {/* Eye Show / Hide button */}
                                  <button
                                    type="button"
                                    onClick={(e) => handleToggleVisibility(layer.id, e)}
                                    className={`p-1 rounded transition-colors shrink-0 ${
                                      isVis
                                        ? "text-cyan-400 hover:bg-cyan-500/20"
                                        : "text-[var(--wp-text-muted)] hover:bg-white/10"
                                    }`}
                                    title={
                                      isVis
                                        ? km
                                          ? "ចុចដើម្បីលាក់ស្រទាប់នេះ"
                                          : "Click to hide layer"
                                        : km
                                        ? "ចុចដើម្បីបង្ហាញស្រទាប់នេះ"
                                        : "Click to show layer"
                                    }
                                  >
                                    {isVis ? <Eye size={15} /> : <EyeOff size={15} />}
                                  </button>

                                  {/* Live Symbology Swatch Badge */}
                                  <div className="shrink-0">
                                    {layer.geometryType === "Polygon" && (
                                      <span
                                        className="inline-block w-4 h-4 rounded-sm border shadow-sm"
                                        style={{
                                          backgroundColor:
                                            layer.symbology.fillColor || layer.symbology.color,
                                          borderColor: layer.symbology.color,
                                          borderWidth: `${Math.min(layer.symbology.strokeWidth, 2)}px`,
                                          opacity: layer.symbology.opacity,
                                        }}
                                      />
                                    )}
                                    {layer.geometryType === "LineString" && (
                                      <span
                                        className="inline-block w-5 h-2"
                                        style={{
                                          borderTop:
                                            layer.symbology.lineStyle === "dashed"
                                              ? `3px dashed ${layer.symbology.color}`
                                              : layer.symbology.lineStyle === "dotted"
                                              ? `3px dotted ${layer.symbology.color}`
                                              : `3px solid ${layer.symbology.color}`,
                                        }}
                                      />
                                    )}
                                    {layer.geometryType === "Point" && (
                                      <span
                                        className="inline-block w-4 h-4 rounded-full border border-white shadow-sm"
                                        style={{
                                          backgroundColor:
                                            layer.symbology.fillColor || layer.symbology.color,
                                        }}
                                      />
                                    )}
                                  </div>

                                  {/* Layer Title and feature badge */}
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold text-[var(--wp-text-primary)] truncate">
                                      {km ? layer.nameKm : layer.nameEn}
                                    </div>
                                    <div className="text-[11px] text-[var(--wp-text-muted)] flex items-center gap-1.5 truncate">
                                      <span>{layer.featureCount} features</span>
                                      <span>·</span>
                                      <span className="capitalize">{layer.geometryType}</span>
                                      {!layer.isBuiltin && (
                                        <span className="px-1 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300">
                                          User
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Reorder & Quick Action Tools */}
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveLayer(idx, "up");
                                    }}
                                    disabled={idx === 0}
                                    className="p-1 rounded text-[var(--wp-text-muted)] hover:text-white disabled:opacity-20"
                                    title={km ? "រំកិលឡើងលើ" : "Move up"}
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveLayer(idx, "down");
                                    }}
                                    disabled={idx === groupLayers.length - 1}
                                    className="p-1 rounded text-[var(--wp-text-muted)] hover:text-white disabled:opacity-20"
                                    title={km ? "រំកិលចុះក្រោម" : "Move down"}
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedLayerId(layer.id);
                                    }}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                      isSelected
                                        ? "bg-cyan-500 text-slate-900 border-cyan-400 font-bold"
                                        : "border-[var(--wp-border)] text-[var(--wp-text-secondary)] hover:border-cyan-400"
                                    }`}
                                  >
                                    <Sliders size={11} className="inline mr-1" />
                                    {km ? "រូបសញ្ញា" : "Style"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredLayers.length === 0 && (
                <div className="p-8 text-center text-xs text-[var(--wp-text-muted)]">
                  {km ? "រកមិនឃើញស្រទាប់ដែលត្រូវនឹងការស្វែងរកទេ។" : "No layers match search criteria."}
                </div>
              )}
            </div>
          </div>

          {/* 4. Symbology Properties Inspector Card */}
          {selectedLayer && (
            <div className="rounded-xl border-2 border-cyan-500/40 bg-[var(--wp-bg-surface)] p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--wp-border)] pb-2">
                <div className="flex items-center gap-2">
                  <Sliders size={18} className="text-cyan-400" />
                  <h2 className="text-sm font-bold text-[var(--wp-text-primary)]">
                    {km ? "លក្ខណៈរូបសញ្ញា (Symbology Properties)" : "Symbology Properties"}
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 truncate max-w-[150px]">
                  {km ? selectedLayer.nameKm : selectedLayer.nameEn}
                </span>
              </div>

              {/* 1-Click Geological Presets */}
              <div className="rounded-lg border border-[var(--wp-border)] bg-[var(--wp-bg-card)] p-2.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--wp-text-secondary)] flex items-center gap-1">
                    <Sparkles size={13} className="text-amber-400" />
                    {km ? "ក្បាច់រូបសញ្ញាគំរូ 1-Click Presets" : "1-Click Geological Presets"}
                  </span>
                  <span className="text-[10px] text-[var(--wp-text-muted)]">Quick styles</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateSymbology(selectedLayer.id, {
                        color: "#eab308",
                        fillColor: "#fef08a",
                        symbol: "diamond",
                        symbolSize: 26,
                        strokeWidth: 2,
                        opacity: 0.6,
                        lineStyle: "solid",
                      })
                    }
                    className="p-1.5 rounded border border-[var(--wp-border)] bg-[var(--wp-bg-surface)] hover:border-amber-400 text-[11px] font-medium flex items-center gap-1.5 text-left"
                  >
                    <span>⛏️</span>
                    <span className="truncate">{km ? "រ៉ែមាស / លោហៈ" : "Mineral / Ore"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateSymbology(selectedLayer.id, {
                        color: "#0284c7",
                        fillColor: "#e0f2fe",
                        symbol: "drillhole",
                        symbolSize: 24,
                        strokeWidth: 2,
                        opacity: 0.7,
                        lineStyle: "solid",
                      })
                    }
                    className="p-1.5 rounded border border-[var(--wp-border)] bg-[var(--wp-bg-surface)] hover:border-cyan-400 text-[11px] font-medium flex items-center gap-1.5 text-left"
                  >
                    <span>🕳️</span>
                    <span className="truncate">{km ? "អណ្តូងខួង / ទឹក" : "Borehole / Well"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateSymbology(selectedLayer.id, {
                        color: "#dc2626",
                        fillColor: "#fca5a5",
                        strokeWidth: 3,
                        lineStyle: "dashed",
                        opacity: 0.9,
                      })
                    }
                    className="p-1.5 rounded border border-[var(--wp-border)] bg-[var(--wp-bg-surface)] hover:border-red-400 text-[11px] font-medium flex items-center gap-1.5 text-left"
                  >
                    <span>⚡</span>
                    <span className="truncate">{km ? "បន្ទាត់ប្រេះស្រាំ" : "Active Fault"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateSymbology(selectedLayer.id, {
                        color: "#059669",
                        fillColor: "#a7f3d0",
                        symbol: "hexagon",
                        symbolSize: 26,
                        strokeWidth: 2,
                        opacity: 0.5,
                        lineStyle: "solid",
                      })
                    }
                    className="p-1.5 rounded border border-[var(--wp-border)] bg-[var(--wp-bg-surface)] hover:border-emerald-400 text-[11px] font-medium flex items-center gap-1.5 text-left"
                  >
                    <span>🔷</span>
                    <span className="truncate">{km ? "ឧទ្យាន / កាស្ត" : "Geosite / Karst"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateSymbology(selectedLayer.id, {
                        color: "#ea580c",
                        fillColor: "#ffedd5",
                        symbol: "triangle",
                        symbolSize: 26,
                        strokeWidth: 2,
                        opacity: 0.7,
                        lineStyle: "dash-dot",
                      })
                    }
                    className="p-1.5 rounded border border-[var(--wp-border)] bg-[var(--wp-bg-surface)] hover:border-orange-400 text-[11px] font-medium flex items-center gap-1.5 text-left"
                  >
                    <span>⚠️</span>
                    <span className="truncate">{km ? "គ្រោះធម្មជាតិ" : "Hazard Zone"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateSymbology(selectedLayer.id, {
                        color: "#c98a5a",
                        fillColor: "#c98a5a",
                        opacity: 0.45,
                        strokeWidth: 2,
                        lineStyle: "solid",
                      })
                    }
                    className="p-1.5 rounded border border-[var(--wp-border)] bg-[var(--wp-bg-surface)] hover:border-amber-600 text-[11px] font-medium flex items-center gap-1.5 text-left"
                  >
                    <span>🪨</span>
                    <span className="truncate">{km ? "ស្រទាប់ថ្មគ្រឹះ" : "Bedrock Unit"}</span>
                  </button>
                </div>
              </div>

              {/* Color Pickers & Swatches */}
              <div className="grid grid-cols-2 gap-3">
                {/* Stroke / Border Color */}
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--wp-text-secondary)] mb-1">
                    {km ? "ពណ៌បន្ទាត់ / ព្រំដែន (Stroke)" : "Stroke / Line Color"}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedLayer.symbology.color}
                      onChange={(e) =>
                        handleUpdateSymbology(selectedLayer.id, { color: e.target.value })
                      }
                      className="w-8 h-8 rounded border border-[var(--wp-input-border)] bg-transparent cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={selectedLayer.symbology.color}
                      onChange={(e) =>
                        handleUpdateSymbology(selectedLayer.id, { color: e.target.value })
                      }
                      className="flex-1 py-1 px-2 rounded border border-[var(--wp-input-border)] bg-[var(--wp-input-bg)] text-xs font-mono text-[var(--wp-input-text)]"
                    />
                  </div>
                </div>

                {/* Fill Color */}
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--wp-text-secondary)] mb-1">
                    {km ? "ពណ៌ផ្ទៃក្នុង (Fill Color)" : "Fill Color"}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedLayer.symbology.fillColor || selectedLayer.symbology.color}
                      onChange={(e) =>
                        handleUpdateSymbology(selectedLayer.id, { fillColor: e.target.value })
                      }
                      className="w-8 h-8 rounded border border-[var(--wp-input-border)] bg-transparent cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={selectedLayer.symbology.fillColor || selectedLayer.symbology.color}
                      onChange={(e) =>
                        handleUpdateSymbology(selectedLayer.id, { fillColor: e.target.value })
                      }
                      className="flex-1 py-1 px-2 rounded border border-[var(--wp-input-border)] bg-[var(--wp-input-bg)] text-xs font-mono text-[var(--wp-input-text)]"
                    />
                  </div>
                </div>
              </div>

              {/* Stroke Width & Opacity */}
              <div className="grid grid-cols-2 gap-3">
                {/* Stroke Width */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-[var(--wp-text-secondary)]">
                      {km ? "កម្រាស់បន្ទាត់ (Width)" : "Stroke Width"}
                    </label>
                    <span className="text-[11px] font-mono text-cyan-400">
                      {selectedLayer.symbology.strokeWidth} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={selectedLayer.symbology.strokeWidth}
                    onChange={(e) =>
                      handleUpdateSymbology(selectedLayer.id, {
                        strokeWidth: Number(e.target.value),
                      })
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Opacity */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-[var(--wp-text-secondary)]">
                      {km ? "កម្រិតស្រាល/ច្បាស់ (Opacity)" : "Fill Opacity"}
                    </label>
                    <span className="text-[11px] font-mono text-cyan-400">
                      {Math.round(selectedLayer.symbology.opacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={1}
                    step={0.05}
                    value={selectedLayer.symbology.opacity}
                    onChange={(e) =>
                      handleUpdateSymbology(selectedLayer.id, {
                        opacity: Number(e.target.value),
                      })
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>

              {/* Line Style & Point Symbol Selectors */}
              <div className="grid grid-cols-2 gap-3">
                {/* Line Style */}
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--wp-text-secondary)] mb-1">
                    {km ? "ម៉ូតបន្ទាត់ (Line Style)" : "Line Style / Pattern"}
                  </label>
                  <select
                    value={selectedLayer.symbology.lineStyle}
                    onChange={(e) =>
                      handleUpdateSymbology(selectedLayer.id, {
                        lineStyle: e.target.value as LineStyle,
                      })
                    }
                    className="w-full py-1.5 px-2 rounded border border-[var(--wp-input-border)] bg-[var(--wp-input-bg)] text-xs text-[var(--wp-input-text)]"
                  >
                    <option value="solid">{km ? "បន្ទាត់ជាប់ (Solid ───)" : "Solid (───)"}</option>
                    <option value="dashed">{km ? "បន្ទាត់ដាច់ៗ (Dashed - - -)" : "Dashed (- - -)"}</option>
                    <option value="dotted">{km ? "បន្ទាត់ចុចៗ (Dotted ···)" : "Dotted (···)"}</option>
                    <option value="dash-dot">{km ? "បន្ទាត់ដាច់លាយចុច (Dash-Dot —·—)" : "Dash-Dot (—·—)"}</option>
                  </select>
                </div>

                {/* Point Marker Symbol */}
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--wp-text-secondary)] mb-1">
                    {km ? "សញ្ញាចំណុច (Point Marker)" : "Point Symbol"}
                  </label>
                  <select
                    value={selectedLayer.symbology.symbol}
                    onChange={(e) =>
                      handleUpdateSymbology(selectedLayer.id, {
                        symbol: e.target.value as MapSymbol,
                      })
                    }
                    className="w-full py-1.5 px-2 rounded border border-[var(--wp-input-border)] bg-[var(--wp-input-bg)] text-xs text-[var(--wp-input-text)]"
                  >
                    <option value="circle">Circle (រង្វង់មូល)</option>
                    <option value="diamond">Diamond (ពេជ្រ / រ៉ែ)</option>
                    <option value="mine">Mine (ចបជីក / អណ្តូងរ៉ែ)</option>
                    <option value="drillhole">Drillhole (រន្ធខួង / គោលដៅ)</option>
                    <option value="quarry">Quarry (ការដ្ឋានថ្ម)</option>
                    <option value="triangle">Triangle (ត្រីកោណ / គ្រោះថ្នាក់)</option>
                    <option value="star">Star (ផ្កាយ / បេតិកភណ្ឌ)</option>
                    <option value="hexagon">Hexagon (ឆកោន / អាជ្ញាបណ្ណ)</option>
                    <option value="cross">Cross (កាកបាទ / សំណាក)</option>
                    <option value="pin">Pin (ម្ជុលទីតាំង)</option>
                    <option value="strike-dip">Strike-Dip (រចនាសម្ព័ន្ធ)</option>
                  </select>
                </div>
              </div>

              {/* Marker Size */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-[var(--wp-text-secondary)]">
                    {km ? "ទំហំរូបសញ្ញាចំណុច (Marker Size)" : "Marker Symbol Size"}
                  </label>
                  <span className="text-[11px] font-mono text-cyan-400">
                    {selectedLayer.symbology.symbolSize} px
                  </span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={48}
                  value={selectedLayer.symbology.symbolSize}
                  onChange={(e) =>
                    handleUpdateSymbology(selectedLayer.id, {
                      symbolSize: Number(e.target.value),
                    })
                  }
                  className="w-full accent-cyan-400"
                />
              </div>

              {/* Action Strip for selected layer */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--wp-border)] text-xs">
                <button
                  type="button"
                  onClick={() => handleDownloadLayerGeoJson(selectedLayer)}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <Download size={13} />
                  {km ? "ទាញយក GeoJSON" : "Export GeoJSON"}
                </button>

                {!selectedLayer.isBuiltin && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCustomLayer(selectedLayer)}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
                  >
                    <Trash2 size={13} />
                    {km ? "លុបស្រទាប់នេះ" : "Delete layer"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live GIS Leaflet Map Preview (7 cols) */}
        <div className="lg:col-span-7">
          <GeodataMapPreview
            layers={layers}
            lang={lang}
            selectedLayerId={selectedLayerId}
            onSelectLayer={(id) => setSelectedLayerId(id)}
          />

          {/* Map Guide Note */}
          <div className="mt-3 p-3 rounded-lg border border-[var(--wp-border)] bg-[var(--wp-bg-card)] text-xs text-[var(--wp-text-muted)] space-y-1">
            <div className="font-semibold text-[var(--wp-text-secondary)] flex items-center gap-1.5">
              <span>💡</span>
              {km
                ? "ព័ត៌មានជំនួយសម្រាប់ការគ្រប់គ្រងស្រទាប់ (TOC Tips):"
                : "Table of Contents Usage Tips:"}
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1">
              <li>
                {km
                  ? "ការផ្លាស់ប្តូរពណ៌ គំនូសព្រំ ឬការបើក/លាក់ (Show/Hide) នឹងបង្ហាញភ្លាមៗនៅលើផែនទីខាងលើ (Real-time preview)។"
                  : "All visibility toggles and symbology changes update the live Leaflet map immediately."}
              </li>
              <li>
                {km
                  ? "ចុចប៊ូតុង «រក្សាទុកការកំណត់» ដើម្បីបញ្ជូនការកែប្រែទៅកាន់ទំព័រផែនទីសាធារណៈ /geodata។"
                  : "Click 'Save Settings' to apply customizations across the public /geodata interactive map."}
              </li>
              <li>
                {km
                  ? "គាំទ្រការបញ្ចូលឯកសារ GeoJSON, KML, និង KMZ (ទំហំរហូតដល់ 20MB ក្នុងប្រព័ន្ធកូអរដោនេ WGS84)។"
                  : "Supports importing custom GeoJSON, KML, and KMZ files (up to 20MB in WGS84 coordinates)."}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Upload Dataset Modal Dialog */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--wp-border)] bg-[var(--wp-bg-surface)] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--wp-border)] pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud size={22} className="text-cyan-400" />
                <h3 className="text-base font-bold text-[var(--wp-text-primary)]">
                  {km ? "បញ្ចូលទិន្នន័យស្រទាប់ផែនទីថ្មី (Import Geodata)" : "Import Geodata Dataset"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-sm text-[var(--wp-text-muted)] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--wp-text-secondary)] mb-1">
                  {km ? "ជ្រើសរើសប្រភេទស្រទាប់ (Dataset Category):" : "Dataset Category:"}
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) =>
                    setUploadCategory(e.target.value as TocLayerItem["category"])
                  }
                  className="w-full py-2 px-3 rounded-lg border border-[var(--wp-input-border)] bg-[var(--wp-input-bg)] text-xs text-[var(--wp-input-text)]"
                >
                  {TOC_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {km ? cat.labelKm : cat.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!isUploading) void handleFileUpload(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-xl p-8 text-center bg-cyan-500/5 cursor-pointer transition-colors space-y-2"
              >
                <UploadCloud size={36} className="mx-auto text-cyan-400" />
                <div className="text-xs font-semibold text-[var(--wp-text-primary)]">
                  {km
                    ? "ចុចទីនេះ ឬអូសទម្លាក់ឯកសារទិន្នន័យ (GeoJSON, KML, KMZ)"
                    : "Click to choose or drag & drop GeoJSON, KML, or KMZ"}
                </div>
                <p className="text-[11px] text-[var(--wp-text-muted)]">
                  {km
                    ? "ទំហំអតិបរមា 20 MB · ប្រព័ន្ធកូអរដោនេ WGS84 (EPSG:4326)"
                    : "Up to 20 MB · WGS84 coordinate reference system (EPSG:4326)"}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".geojson,.json,.kml,.kmz"
                  onChange={(e) => void handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--wp-border)]">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-lg border border-[var(--wp-border)] hover:bg-white/5 text-xs font-semibold text-[var(--wp-text-secondary)]"
              >
                {km ? "បោះបង់" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
