import { useEffect, useRef, useState, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";
import "maplibre-gl/dist/maplibre-gl.css";

// Configure MapLibre Worker URL to prevent worker 404 in Vite
try {
  maplibregl.setWorkerUrl(maplibreWorkerUrl);
} catch {}
import { useI18n } from "@/lib/i18n";
import {
  CAMBODIA_GEOSITES,
  type GeositeRecord,
  type GeositeGalleryItem,
} from "./geosites-data";
import {
  MapPin,
  Layers,
  Mountain,
  Satellite,
  Compass,
  Eye,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Sparkles,
  Globe,
  Filter,
  Search,
  Shield,
  BookOpen,
  Navigation,
  ArrowUpRight,
  FileText,
  FolderArchive,
  FolderOpen,
  FileDown,
} from "lucide-react";

type Basemap = "satellite" | "topo" | "hillshade" | "terrain";

const TILES: Record<Basemap, { url: string; attribution: string; nameEn: string; nameKm: string }> = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri World Imagery",
    nameEn: "Satellite",
    nameKm: "ផ្កាយរណប",
  },
  topo: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri World Topographic Map",
    nameEn: "Topographic",
    nameKm: "ដីគោក / ភូមិសាស្ត្រ",
  },
  hillshade: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri World Hillshade",
    nameEn: "Hillshade",
    nameKm: "ស្រមោលកម្ពស់ដី (DEM)",
  },
  terrain: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri World Shaded Relief",
    nameEn: "Shaded Relief",
    nameKm: "ទម្រង់ដី / ចំណោតភ្នំ",
  },
};

const DEM_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";

export type FigureCategoryType = "natural_photo" | "map" | "fossil" | "thin_section" | "section";

export interface ClassifiedFigure {
  item: GeositeGalleryItem;
  category: {
    type: FigureCategoryType;
    labelEn: string;
    labelKm: string;
    badgeColor: string;
  };
}

export function getFigureClassification(item: GeositeGalleryItem): ClassifiedFigure {
  const c = ((item.caption || "") + " " + (item.scope || "") + " " + (item.src || "")).toLowerCase();

  // 1. Thin section / Photomicrograph / Petrology
  if (
    c.includes("thin section") ||
    c.includes("photomicrograph") ||
    c.includes("maceral") ||
    c.includes("microscopic") ||
    item.src.includes("figure-34")
  ) {
    return {
      item,
      category: {
        type: "thin_section",
        labelEn: "Thin Section / Photomicrograph",
        labelKm: "ចំណិតស្តើងសិលា (Thin Section)",
        badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      },
    };
  }

  // 2. Palaeontological Fossil Specimen
  if (
    c.includes("fossil") ||
    c.includes("fibula") ||
    c.includes("sauropod") ||
    c.includes("turtle") ||
    c.includes("entoplastron") ||
    c.includes("bone") ||
    c.includes("specimen") ||
    item.src.includes("figure-44") ||
    item.src.includes("figure-46") ||
    item.src.includes("figure-47")
  ) {
    return {
      item,
      category: {
        type: "fossil",
        labelEn: "Palaeontological Fossil Specimen",
        labelKm: "សំណាកផូស៊ីល (Fossil Specimen)",
        badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      },
    };
  }

  // 3. Stratigraphic column / measured section
  if (
    c.includes("stratigraphic") ||
    c.includes("measured section") ||
    c.includes("column") ||
    item.src.includes("figure-05") ||
    item.src.includes("figure-35")
  ) {
    return {
      item,
      category: {
        type: "section",
        labelEn: "Stratigraphic Column & Bedding Section",
        labelKm: "ទម្រង់ស្រទាប់សិលា (Stratigraphic Column)",
        badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
      },
    };
  }

  // 4. Geological & Archaeological Maps
  if (
    c.includes("map") ||
    c.includes("location") ||
    c.includes("lidar") ||
    c.includes("geographical position") ||
    item.src.includes("figure-01") ||
    item.src.includes("figure-02") ||
    item.src.includes("figure-04") ||
    item.src.includes("figure-06") ||
    item.src.includes("figure-26") ||
    item.src.includes("figure-28") ||
    item.src.includes("figure-32") ||
    item.src.includes("figure-45")
  ) {
    return {
      item,
      category: {
        type: "map",
        labelEn: "Geological & Topographic Map",
        labelKm: "ផែនទីភូគព្ភសាស្ត្រ និងទីតាំង",
        badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      },
    };
  }

  // 5. Natural Scenery & Field Photograph
  return {
    item,
    category: {
      type: "natural_photo",
      labelEn: "Natural Landscape & Scenery",
      labelKm: "រូបភាពទេសភាពធម្មជាតិ",
      badgeColor: "bg-cyan-100 text-cyan-900 border-cyan-300",
    },
  };
}

function renderMarkerHtml(site: GeositeRecord, isActive: boolean): string {
  if (isActive) {
    return `
      <div style="position: relative; width: 44px; height: 44px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(245, 158, 11, 0.45); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(234, 179, 8, 0.45); box-shadow: 0 0 25px #eab308;"></div>
        <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background: #eab308; border: 3px solid #ffffff; box-shadow: 0 3px 12px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;">
          <div style="width: 7px; height: 7px; border-radius: 50%; background: #ffffff;"></div>
        </div>
      </div>
    `;
  }
  return `
    <div style="position: relative; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(16, 185, 129, 0.35); animation: pulse 2s infinite;"></div>
      <div style="position: absolute; inset: 4px; border-radius: 50%; background: rgba(6, 182, 212, 0.45); box-shadow: 0 0 15px #06b6d4;"></div>
      <div style="position: relative; width: 16px; height: 16px; border-radius: 50%; background: #10b981; border: 2.5px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.45);"></div>
    </div>
  `;
}

export default function GeoparkExplorer() {
  const { lang } = useI18n();
  const kh = lang === "km";

  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const markerMap = useRef<Map<string, { marker: maplibregl.Marker; el: HTMLElement }>>(new Map());
  const narrativeRef = useRef<HTMLDivElement>(null);

  // States
  const [basemap, setBasemap] = useState<Basemap>("satellite");
  const [terrain3D, setTerrain3D] = useState(true);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("phnom-kulen-waterfall-in-siem-reap");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [ready, setReady] = useState(false);
  const [pitch, setPitch] = useState(58);

  // Hologram Gallery States
  const [isHoloOpen, setIsHoloOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<GeositeGalleryItem | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Selected site record
  const selectedSite = useMemo(() => {
    return CAMBODIA_GEOSITES.find((s) => s.id === selectedSiteId) || CAMBODIA_GEOSITES[0];
  }, [selectedSiteId]);

  // Gallery classification for selected site
  const classifiedGallery = useMemo(() => {
    return selectedSite.gallery.map(getFigureClassification);
  }, [selectedSite]);

  // Natural photos exclusively for Hologram Gallery
  const naturalPhotos = useMemo(() => {
    return classifiedGallery
      .filter((f) => f.category.type === "natural_photo")
      .map((f) => f.item);
  }, [classifiedGallery]);

  // Scientific figures (maps, fossils, thin sections, stratigraphy) for Narrative Description
  const scientificFigures = useMemo(() => {
    return classifiedGallery.filter((f) => f.category.type !== "natural_photo");
  }, [classifiedGallery]);

  // Unique list of provinces with counts
  const provinces = useMemo(() => {
    const counts: Record<string, number> = {};
    CAMBODIA_GEOSITES.forEach((s) => {
      const p = s.province.en;
      counts[p] = (counts[p] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  // Filtered sites
  const filteredSites = useMemo(() => {
    return CAMBODIA_GEOSITES.filter((s) => {
      const matchProv = selectedProvince === "all" || s.province.en === selectedProvince;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.nameKm.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.mineralogy.toLowerCase().includes(q) ||
        s.era.toLowerCase().includes(q) ||
        s.province.en.toLowerCase().includes(q);
      return matchProv && matchQuery;
    });
  }, [selectedProvince, searchQuery]);

  // Fly to site on map
  const flyToSite = (site: GeositeRecord, openHolo = false) => {
    setSelectedSiteId(site.id);
    setActiveImageIdx(0);
    if (openHolo) {
      setIsHoloOpen(true);
    }
    if (site.coordinates && map.current) {
      map.current.flyTo({
        center: site.coordinates,
        zoom: 12.8,
        pitch: 62,
        speed: 1.1,
      });
    }
  };

  // Initialize MapLibre GL Map
  useEffect(() => {
    if (!container.current || map.current) return;

    const m = new maplibregl.Map({
      container: container.current,
      center: [104.5, 12.5], // Centered over Cambodia
      zoom: 7.2,
      pitch: 58,
      bearing: -15,
      maxPitch: 85,
      style: {
        version: 8,
        sources: {
          background: {
            type: "raster",
            tiles: [TILES.satellite.url],
            tileSize: 256,
            attribution: TILES.satellite.attribution,
          },
          dem: {
            type: "raster-dem",
            tiles: [DEM_URL],
            tileSize: 256,
            encoding: "terrarium",
            maxzoom: 14,
          },
        },
        layers: [{ id: "basemap", type: "raster", source: "background" }],
        terrain: { source: "dem", exaggeration: 1.5 },
      },
    });

    map.current = m;
    m.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

    const handleReady = () => {
      setReady(true);
      if (selectedSite.coordinates) {
        m.flyTo({ center: selectedSite.coordinates, zoom: 11.5, pitch: 60, speed: 0.8 });
      }
    };

    m.on("load", handleReady);
    m.on("style.load", handleReady);

    // Handle map errors non-blockingly (avoiding false "connection lost" banners on transient tile events)
    m.on("error", (e) => {
      console.warn("MapLibre tile notice:", e?.error?.message || e);
    });

    m.on("mousemove", (e) => setCoords([e.lngLat.lng, e.lngLat.lat]));

    // Render Markers for all sites with coordinates
    markers.current.forEach((x) => x.remove());
    markers.current = [];
    markerMap.current.clear();

    CAMBODIA_GEOSITES.forEach((site) => {
      if (!site.coordinates || !site.publish_pin) return;

      const el = document.createElement("div");
      el.className = "geosite-beacon-marker";
      el.title = `${site.name} (${site.gallery.length} images)`;
      el.setAttribute("aria-label", site.name);
      el.style.cursor = "pointer";

      const isCurrent = site.id === selectedSiteId;
      el.innerHTML = renderMarkerHtml(site, isCurrent);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        flyToSite(site, false);
        narrativeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      const naturalCount = site.gallery.filter((g) => getFigureClassification(g).category.type === "natural_photo").length;
      const scientificCount = site.gallery.length - naturalCount;

      const popup = new maplibregl.Popup({
        offset: 20,
        closeButton: false,
        className: "geosite-custom-popup",
      }).setHTML(`
        <div style="font-family: system-ui, sans-serif; padding: 6px 9px; font-size: 13px; line-height: 1.4; max-width: 240px; color: #0f172a;">
          <div style="font-weight: 800; font-size: 14px;">${site.name}</div>
          <div style="font-size: 12px; color: #047857; font-weight: 600; margin-top: 3px;">
            ${site.province.en} (${site.province.km})
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            ${naturalCount} natural photos · ${scientificCount} maps/fossils
          </div>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(site.coordinates)
        .setPopup(popup)
        .addTo(m);

      el.addEventListener("mouseenter", () => marker.togglePopup());
      el.addEventListener("mouseleave", () => {
        if (marker.getPopup().isOpen()) marker.togglePopup();
      });

      markers.current.push(marker);
      markerMap.current.set(site.id, { marker, el });
    });

    return () => {
      markers.current.forEach((x) => x.remove());
      markers.current = [];
      markerMap.current.clear();
      m.remove();
      map.current = null;
    };
  }, []);

  // Update marker visual highlight whenever selectedSiteId changes
  useEffect(() => {
    markerMap.current.forEach(({ el }, id) => {
      const site = CAMBODIA_GEOSITES.find((s) => s.id === id);
      if (!site) return;
      const isCurrent = id === selectedSiteId;
      el.innerHTML = renderMarkerHtml(site, isCurrent);
      el.style.zIndex = isCurrent ? "50" : "1";
    });
  }, [selectedSiteId]);

  // Update Basemap Layer
  const currentBasemapRef = useRef<Basemap>(basemap);
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    if (currentBasemapRef.current === basemap && m.getSource("background")) return;

    try {
      if (m.getLayer("basemap")) {
        m.removeLayer("basemap");
      }
      if (m.getSource("background")) {
        m.removeSource("background");
      }

      m.addSource("background", {
        type: "raster",
        tiles: [TILES[basemap].url],
        tileSize: 256,
        attribution: TILES[basemap].attribution,
      });

      const layers = m.getStyle()?.layers || [];
      const firstNonBasemap = layers.find((l) => l.id !== "basemap")?.id;

      m.addLayer(
        {
          id: "basemap",
          type: "raster",
          source: "background",
        },
        firstNonBasemap
      );
      currentBasemapRef.current = basemap;
    } catch (err) {
      console.warn("Failed to switch basemap:", err);
    }
  }, [basemap, ready]);

  // Update 3D Terrain
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    try {
      m.setTerrain(terrain3D ? { source: "dem", exaggeration: 1.5 } : null);
    } catch {}
  }, [terrain3D, ready]);

  // Keyboard navigation for Hologram Gallery
  useEffect(() => {
    const handleDocsKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDocsOpen(false);
    };
    window.addEventListener("keydown", handleDocsKey);
    return () => window.removeEventListener("keydown", handleDocsKey);
  }, []);

  useEffect(() => {
    if (!isHoloOpen || naturalPhotos.length === 0) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsHoloOpen(false);
      if (e.key === "ArrowLeft") {
        setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : naturalPhotos.length - 1));
      }
      if (e.key === "ArrowRight") {
        setActiveImageIdx((prev) => (prev < naturalPhotos.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isHoloOpen, naturalPhotos.length]);

  return (
    <section
      data-no-translate="true"
      data-cms-inline="true"
      className="mx-auto max-w-[1720px] px-4 py-8 md:px-8 text-slate-800"
    >
      {/* SECTION HEADER */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-5 border-b border-slate-200 pb-6">
        <div>
          <span className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-emerald-700">
            <Globe size={18} />
            {kh ? "ប្រព័ន្ធព័ត៌មានភូគព្ភស្ថានកម្ពុជា · 3D Web GIS" : "Cambodia National Geosites Inventory · 3D Web GIS"}
          </span>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900 md:text-5xl tracking-tight">
            {kh ? "ឧទ្យានភូគព្ភសាស្ត្រ និងភូគព្ភស្ថានកម្ពុជា" : "Cambodia Geoparks & Geosites Explorer"}
          </h1>
          <p className="mt-2 text-base md:text-lg text-slate-600 leading-relaxed max-w-4xl">
            {kh ? `រុករកទិន្នន័យកូអរដោណេផ្ទៀងផ្ទាត់ រូបភាពទេសភាពធម្មជាតិហូឡូក្រាម និងផ្ទាំងវិទ្យាសាស្ត្រ (ផែនទីភូគព្ភសាស្ត្រ សំណាកផូស៊ីល និងចំណិតស្តើងសិលា) នៃភូគព្ភស្ថានចំនួន ${CAMBODIA_GEOSITES.length} កន្លែងទូទាំងប្រទេសកម្ពុជា។` : `Interactive exploration of ${CAMBODIA_GEOSITES.length} verified Cambodian geosites. View natural landscape photography in modern hologram style, and examine scientific plates (geological maps, fossil specimens, thin sections, and stratigraphic columns) in the geological dossier.`}
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/geosites/coordinates.csv"
            download="Cambodia_Geosites_Coordinates.csv"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            <Download size={16} className="text-emerald-700" />
            <span>{kh ? "ទាញយក Excel / CSV" : "Download Coordinates (CSV)"}</span>
          </a>

          <a
            href="/geosites/geosites.geojson"
            download="Cambodia_Geosites.geojson"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            <Layers size={16} className="text-emerald-700" />
            <span>{kh ? "ទាញយក GeoJSON" : "Download GeoJSON"}</span>
          </a>

          <button
            type="button"
            onClick={() => setIsDocsOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-900 shadow-xs hover:bg-emerald-100 transition"
          >
            <FolderArchive size={16} className="text-emerald-700" />
            <span>{kh ? "ឯកសារស្រាវជ្រាវ Geoparks" : "Geoparks Research & Data"}</span>
          </button>

          <a
            href="/geosites/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-emerald-800 transition"
          >
            <BookOpen size={16} />
            <span>{kh ? "បើកឯកសារកាតាឡុកដើម ↗" : "Full Geosite Catalogue ↗"}</span>
          </a>
        </div>
      </div>

      {/* PROVINCIAL FILTER PILLS */}
      <div className="mb-6 flex flex-wrap items-center gap-2.5 overflow-x-auto pb-2 text-sm">
        <span className="font-extrabold text-slate-600 mr-1 flex items-center gap-1.5 text-sm">
          <Filter size={15} /> {kh ? "ខេត្ត:" : "Province:"}
        </span>
        <button
          type="button"
          onClick={() => setSelectedProvince("all")}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
            selectedProvince === "all"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {kh ? "ទាំងអស់" : "All"} ({CAMBODIA_GEOSITES.length})
        </button>
        {provinces.map(([provName, count]) => (
          <button
            key={provName}
            type="button"
            onClick={() => setSelectedProvince(provName)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              selectedProvince === provName
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {provName} ({count})
          </button>
        ))}
      </div>

      {/* MAIN EXPLORER WORKSPACE (SIDEBAR + 3D MAP) */}
      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        {/* LEFT: Geosite Directory List with Instant Search */}
        <aside className="flex flex-col h-[680px] rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          {/* Search Bar */}
          <div className="relative mb-3.5">
            <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={kh ? "ស្វែងរកឈ្មោះ តំបន់ ឬប្រភេទថ្ម..." : "Search geosite name, rock type, or keyword..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-9 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3 text-sm text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs md:text-sm text-slate-500 font-semibold px-1 mb-3">
            <span>{filteredSites.length} {kh ? "ទីតាំងភូគព្ភស្ថាន" : "localities found"}</span>
            <span>{kh ? "ចុចដើម្បីហោះទៅទីតាំង" : "Click card to fly"}</span>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1.5">
            {filteredSites.map((s) => {
              const isSelected = selectedSiteId === s.id;
              const hasCoords = s.coordinates && s.publish_pin;
              const sNatural = s.gallery.filter((g) => getFigureClassification(g).category.type === "natural_photo");
              const sScientific = s.gallery.filter((g) => getFigureClassification(g).category.type !== "natural_photo");

              return (
                <div
                  key={s.id}
                  onClick={() => flyToSite(s)}
                  className={`rounded-xl border p-4 cursor-pointer transition text-left ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/80 shadow-sm ring-1 ring-emerald-500"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <strong className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                      {kh ? s.nameKm : s.name}
                    </strong>
                    {hasCoords ? (
                      <span className="shrink-0 h-2.5 w-2.5 rounded-full bg-emerald-500 mt-1 shadow-xs" title="Published coordinate pin" />
                    ) : (
                      <span className="shrink-0 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                        HOLD
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs md:text-sm text-slate-600">
                    <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {s.province.en}
                    </span>
                    <span>·</span>
                    <span className="truncate max-w-[200px] text-slate-500">{s.era}</span>
                  </div>

                  {/* Photo & Scientific Figures Badges */}
                  <div className="mt-3 flex flex-wrap items-center justify-between border-t border-slate-100 pt-2.5 text-xs gap-2">
                    <div className="flex items-center gap-2">
                      {sNatural.length > 0 && (
                        <span className="flex items-center gap-1 text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                          <Sparkles size={12} className="text-cyan-600" />
                          {sNatural.length} {kh ? "រូបធម្មជាតិ" : "photos"}
                        </span>
                      )}
                      {sScientific.length > 0 && (
                        <span className="flex items-center gap-1 text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          <BookOpen size={12} className="text-purple-600" />
                          {sScientific.length} {kh ? "ផ្ទាំងវិទ្យាសាស្ត្រ" : "scientific"}
                        </span>
                      )}
                    </div>

                    {sNatural.length > 0 ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          flyToSite(s, true);
                        }}
                        className="rounded-lg px-2.5 py-1 bg-slate-900 text-cyan-300 text-xs font-extrabold hover:bg-cyan-600 hover:text-white transition shadow-xs"
                      >
                        {kh ? "មើលរូបហូឡូ" : "Holo-View"}
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 italic">
                        {kh ? "ឯកសារវិទ្យាសាស្ត្រ" : "Dossier figures"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* RIGHT: 3D MapLibre Interactive Canvas */}
        <div className="relative flex flex-col h-[680px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
          {/* Map Top Control Bar */}
          <div className="z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/90 px-4 py-3 text-xs md:text-sm text-white backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-2.5">
              <label className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Layers size={16} className="text-emerald-400" />
                <span>Basemap:</span>
                <select
                  aria-label="Basemap"
                  value={basemap}
                  onChange={(e) => setBasemap(e.target.value as Basemap)}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs md:text-sm text-white border border-slate-700 focus:outline-none"
                >
                  <option value="satellite">{kh ? "រូបភាពផ្កាយរណប" : "Satellite (Esri Imagery)"}</option>
                  <option value="topo">{kh ? "ផែនទីភូមិសាស្ត្រ" : "Topographic Map"}</option>
                  <option value="hillshade">{kh ? "ស្រមោលកម្ពស់ដី (DEM)" : "Hillshade DEM"}</option>
                  <option value="terrain">{kh ? "ទម្រង់ដី" : "Terrain Base"}</option>
                </select>
              </label>

              <button
                type="button"
                onClick={() => setTerrain3D((x) => !x)}
                className={`rounded-lg px-3 py-1.5 font-bold text-xs md:text-sm transition border ${
                  terrain3D
                    ? "bg-emerald-700 text-white border-emerald-500 shadow-xs"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                }`}
              >
                {terrain3D ? (kh ? "កម្ពស់ 3D សកម្ម" : "3D Elevation Active") : (kh ? "ផែនទីរាបស្មើ 2D" : "2D Flat Map")}
              </button>

              <button
                type="button"
                onClick={() => {
                  const v = pitch > 20 ? 0 : 62;
                  setPitch(v);
                  map.current?.easeTo({ pitch: v, duration: 600 });
                }}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs md:text-sm text-slate-300 border border-slate-700 hover:bg-slate-700 transition font-medium"
              >
                {pitch > 20 ? (kh ? "ទិដ្ឋភាពពីលើ (0°)" : "Top View (0°)") : (kh ? "ទិដ្ឋភាពទេរ 3D (62°)" : "3D Tilt (62°)")}
              </button>

              <button
                type="button"
                onClick={() => map.current?.flyTo({ center: [104.5, 12.5], zoom: 7.2, pitch: 58, bearing: -15 })}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs md:text-sm text-slate-300 border border-slate-700 hover:bg-slate-700 transition font-medium"
              >
                {kh ? "មើលកម្ពុជាទាំងមូល" : "Reset Cambodia"}
              </button>
            </div>

            {/* Quick Button to Launch Hologram Gallery */}
            {naturalPhotos.length > 0 && (
              <button
                type="button"
                onClick={() => setIsHoloOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 px-3 py-1.5 text-xs md:text-sm font-extrabold text-white shadow-md hover:from-cyan-500 hover:to-emerald-500 transition"
              >
                <Sparkles size={14} className="text-cyan-200" />
                <span>{kh ? "បើករូបហូឡូក្រាម" : "Open Hologram"} ({naturalPhotos.length})</span>
              </button>
            )}
          </div>

          {/* Map Canvas */}
          <div ref={container} className="h-full w-full" aria-label="3D Geopark Interactive Map" />

          {/* Map Bottom Telemetry HUD */}
          <div className="z-10 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-950/90 px-5 py-2.5 font-mono text-xs md:text-sm text-slate-300 backdrop-blur-md">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Navigation size={14} />
              {coords
                ? `LAT ${coords[1].toFixed(5)}° · LON ${coords[0].toFixed(5)}° (WGS84)`
                : "Hover on map to inspect coordinates"}
            </span>
            <span className="text-slate-300">
              Selected: <strong className="text-white font-bold">{selectedSite.name}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* =================================================================================== */}
      {/* SECTION 2: DEEP-TIME GEOLOGICAL NARRATIVE (INFORMATION UNDER THE MAP) */}
      {/* =================================================================================== */}
      <div
        ref={narrativeRef}
        key={selectedSite.id}
        data-no-translate="true"
        data-cms-inline="true"
        className="mt-14 rounded-3xl border border-slate-200 bg-white p-7 md:p-10 shadow-sm transition-all duration-200"
      >
        {/* Narrative Top Bar */}
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-slate-100 pb-7">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-1 text-sm font-extrabold text-emerald-900 border border-emerald-200">
                <MapPin size={15} />
                {selectedSite.province.en} ({selectedSite.province.km})
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1 text-sm font-mono font-bold text-slate-800 border border-slate-200">
                {selectedSite.era}
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl bg-cyan-100 px-3 py-1 text-sm font-mono font-bold text-cyan-900 border border-cyan-200">
                ID: {selectedSite.id}
              </span>
              {selectedSite.publish_pin ? (
                <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-300 px-3 py-1 text-xs md:text-sm font-bold text-emerald-800">
                  ✓ Published Pin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-xl bg-amber-50 border border-amber-300 px-3 py-1 text-xs md:text-sm font-bold text-amber-900">
                  Coordinate Hold (Under Survey)
                </span>
              )}
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {kh ? selectedSite.nameKm : selectedSite.name}
            </h2>
            <p className="text-base md:text-lg font-semibold text-slate-600 mt-2">
              {selectedSite.name} · {selectedSite.designation}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {naturalPhotos.length > 0 && (
              <button
                type="button"
                onClick={() => setIsHoloOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-extrabold text-cyan-300 shadow-md hover:bg-cyan-700 hover:text-white transition"
              >
                <Sparkles size={16} className="text-cyan-400" />
                <span>{kh ? "បើកវិចិត្រសាលហូឡូក្រាម" : "View Hologram Gallery"} ({naturalPhotos.length} {kh ? "រូបធម្មជាតិ" : "photos"})</span>
              </button>
            )}

            {scientificFigures.length > 0 && (
              <a
                href="#scientific-plates"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-50 border border-purple-300 px-4 py-3 text-sm font-bold text-purple-900 hover:bg-purple-100 transition shadow-2xs"
              >
                <BookOpen size={16} className="text-purple-700" />
                <span>{kh ? "មើលផែនទី និងសំណាក" : "Scientific Plates"} ({scientificFigures.length})</span>
              </a>
            )}

            {selectedSite.coordinates && (
              <a
                href={`https://www.google.com/maps?q=${selectedSite.coordinates[1]},${selectedSite.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
              >
                <Compass size={16} className="text-emerald-700" />
                <span>Google Maps ↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Narrative Core Dossier (3 Columns Grid) */}
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {/* Column 1: Geological Journey & Deep-Time Story */}
          <div className="space-y-6 md:col-span-2">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-sky-50/40 p-7 md:p-8 border border-emerald-100">
              <span className="text-sm font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-2 mb-3">
                <BookOpen size={18} />
                {kh ? "ដំណើររឿងរ៉ាវភូគព្ភសាស្ត្រ (Geological Narrative)" : "Deep-Time Geological Narrative"}
              </span>

              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
                {kh ? "ប្រវត្តិការកកើត និងទម្រង់សិលាសាស្ត្រ" : "Landscape Evolution & Geological Setting"}
              </h3>

              <p className="text-base md:text-lg leading-relaxed text-slate-800 font-normal">
                {selectedSite.description}
              </p>

              <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-800 font-normal">
                {kh ? selectedSite.narrative.geologicalSettingKm : selectedSite.narrative.geologicalSetting}
              </p>
            </div>

            {/* Mineralogy & Lithological Composition */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 space-y-3">
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Mountain size={18} className="text-emerald-700" />
                {kh ? "លក្ខណៈសិលាសាស្ត្រ និងរ៉ែ (Mineralogy & Petrology)" : "Mineralogy & Lithological Characteristics"}
              </span>
              <p className="text-base md:text-lg font-bold text-slate-900 mt-1">
                {selectedSite.mineralogy || "Quartz sandstone and sedimentary alluvial bedrock."}
              </p>
              <p className="text-sm md:text-base leading-relaxed text-slate-700 mt-2">
                {selectedSite.narrative.mineralogyNote}
              </p>
            </div>
          </div>

          {/* Column 2: Survey Provenance, GPS Coordinate Basis, and Technical Metadata */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 md:p-7 space-y-4">
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Shield size={18} className="text-emerald-700" />
                {kh ? "ប្រភពទិន្នន័យ និងកូអរដោណេ" : "Survey Provenance & Coordinate Basis"}
              </span>

              <div className="text-sm md:text-base space-y-3.5 text-slate-700">
                <div>
                  <strong className="block text-slate-900 mb-1 font-bold text-sm">
                    {kh ? "កូអរដោណេផ្លូវការ:" : "Spatial Position:"}
                  </strong>
                  {selectedSite.coordinates ? (
                    <span className="font-mono text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-lg font-bold text-sm md:text-base">
                      {selectedSite.coordinates[1].toFixed(5)}° N, {selectedSite.coordinates[0].toFixed(5)}° E
                    </span>
                  ) : (
                    <span className="font-mono text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg font-bold text-sm">
                      Position Unresolved / Hold
                    </span>
                  )}
                </div>

                <div>
                  <strong className="block text-slate-900 mb-1 font-bold text-sm">
                    {kh ? "ប្រភពទិន្នន័យដើម:" : "Published Source Basis:"}
                  </strong>
                  <span className="leading-snug block text-xs md:text-sm text-slate-600">
                    {selectedSite.coordinate_source}
                  </span>
                </div>

                {selectedSite.coordinate_notes && (
                  <div>
                    <strong className="block text-slate-900 mb-1 font-bold text-sm">
                      {kh ? "កំណត់សម្គាល់បន្ថែម:" : "Cartographic Notes:"}
                    </strong>
                    <span className="italic block leading-snug text-xs md:text-sm text-slate-600">
                      {selectedSite.coordinate_notes}
                    </span>
                  </div>
                )}

                {selectedSite.source_urls.length > 0 && (
                  <div className="pt-3 border-t border-slate-200">
                    <strong className="block text-slate-900 mb-1.5 font-bold text-sm">
                      {kh ? "ឯកសារយោង និងតំណភ្ជាប់:" : "Source Literature Links:"}
                    </strong>
                    {selectedSite.source_urls.map((u, i) => (
                      <a
                        key={i}
                        href={u}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs md:text-sm text-emerald-700 hover:underline break-all block mb-1 font-medium"
                      >
                        <ArrowUpRight size={13} /> {u.replace(/^https?:\/\//, "").slice(0, 36)}...
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Gallery Teaser / Mini Hologram Card (Shows first natural photo) */}
            {naturalPhotos.length > 0 ? (
              <div
                onClick={() => setIsHoloOpen(true)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-cyan-500/40 bg-slate-950 p-5 shadow-md transition hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]"
              >
                <div className="flex items-center justify-between text-xs md:text-sm text-cyan-300 font-bold mb-2.5">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={16} className="text-cyan-400" />
                    SCENIC HOLO-ARCHIVE ({naturalPhotos.length})
                  </span>
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold">READY</span>
                </div>

                <div className="relative aspect-video overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-900">
                  <img
                    src={`/geosites/${naturalPhotos[0].src}`}
                    alt={naturalPhotos[0].caption}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs font-semibold text-white truncate">
                    {naturalPhotos[0].caption}
                  </div>
                </div>

                <p className="mt-3 text-center text-xs md:text-sm font-extrabold text-cyan-300 group-hover:text-cyan-200">
                  {kh ? "ចុចដើម្បីបើកទិដ្ឋភាពហូឡូក្រាមពេញ ↗" : "Click to Launch Hologram Gallery ↗"}
                </p>
              </div>
            ) : scientificFigures.length > 0 ? (
              <div
                onClick={() => {
                  const el = document.getElementById("scientific-plates");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-purple-400/40 bg-slate-950 p-5 shadow-md transition hover:border-purple-300"
              >
                <div className="flex items-center justify-between text-xs md:text-sm text-purple-300 font-bold mb-2.5">
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={16} className="text-purple-400" />
                    SCIENTIFIC PLATES ({scientificFigures.length})
                  </span>
                  <span className="text-xs font-mono uppercase text-purple-400 font-bold">MAPS/FOSSILS</span>
                </div>

                <div className="relative aspect-video overflow-hidden rounded-xl border border-purple-500/20 bg-slate-900">
                  <img
                    src={`/geosites/${scientificFigures[0].item.src}`}
                    alt={scientificFigures[0].item.caption}
                    className="h-full w-full object-contain p-1 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs font-semibold text-white truncate">
                    {scientificFigures[0].item.caption}
                  </div>
                </div>

                <p className="mt-3 text-center text-xs md:text-sm font-extrabold text-purple-300 group-hover:text-purple-200">
                  {kh ? "ចុចដើម្បីពិនិត្យផ្ទាំងផែនទីខាងក្រោម ↓" : "Inspect Scientific Plates Below ↓"}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCIENTIFIC PLATES: MAPS, FOSSILS, THIN SECTIONS & STRATIGRAPHIC COLUMNS */}
        {/* ========================================================================= */}
        {scientificFigures.length > 0 && (
          <div id="scientific-plates" className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 md:p-9">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-7">
              <div>
                <div className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-purple-800">
                  <BookOpen size={18} className="text-purple-700" />
                  {kh ? "ឯកសារ និងទិន្នន័យភូគព្ភសាស្ត្រស៊ីជម្រៅ" : "Scientific Geological Plates & Cartography"}
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
                  {kh ? "ផែនទីភូគព្ភសាស្ត្រ សំណាកផូស៊ីល ចំណិតស្តើង និងស្រទាប់សិលា" : "Geological Maps, Fossil Horizons, Thin Sections & Stratigraphic Sections"}
                </h3>
                <p className="text-sm md:text-base text-slate-600 mt-1 max-w-4xl leading-relaxed">
                  {kh
                    ? `ផ្ទាំងវិទ្យាសាស្ត្រ និងផែនទីចំនួន ${scientificFigures.length} ផ្ទាំង ស្រង់ចេញពីការស្រាវជ្រាវបោះពុម្ពផ្លូវការសម្រាប់ទីតាំងនេះ។`
                    : `Peer-reviewed scientific figures, regional geological maps, fossil specimens, and petrographic thin sections published for this specific Cambodian locality.`}
                </p>
              </div>
              <span className="rounded-full bg-purple-100 px-4 py-1.5 text-xs md:text-sm font-extrabold text-purple-900 border border-purple-300">
                {scientificFigures.length} Scientific Plates
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {scientificFigures.map((fig, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden hover:shadow-md transition duration-200"
                >
                  {/* Category Badge Header */}
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${fig.category.badgeColor}`}>
                      {kh ? fig.category.labelKm : fig.category.labelEn}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">Fig {idx + 1}</span>
                  </div>

                  {/* High-res Image Preview */}
                  <div
                    onClick={() => setLightboxImg(fig.item)}
                    className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center"
                    title="Click to inspect full-resolution figure"
                  >
                    <img
                      src={`/geosites/${fig.item.src}`}
                      alt={fig.item.caption}
                      className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="rounded-xl bg-black/80 px-3.5 py-2 text-xs md:text-sm font-bold text-white shadow-md flex items-center gap-1.5 backdrop-blur-sm">
                        <Maximize2 size={15} /> {kh ? "ពង្រីកមើលច្បាស់" : "Click to Enlarge"}
                      </span>
                    </div>
                  </div>

                  {/* Caption & Citations */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-3 text-left">
                    <div>
                      <p className="text-sm md:text-base font-semibold text-slate-900 leading-snug">
                        {fig.item.caption}
                      </p>
                      {fig.item.credit && (
                        <p className="text-xs md:text-sm text-slate-500 mt-2 italic leading-relaxed">
                          {fig.item.credit}
                        </p>
                      )}
                    </div>

                    {fig.item.source_urls && fig.item.source_urls.length > 0 && (
                      <div className="pt-2.5 border-t border-slate-100">
                        <a
                          href={fig.item.source_urls[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-purple-700 hover:text-purple-900 hover:underline"
                        >
                          <ExternalLink size={13} /> {kh ? "អានឯកសារដើម ↗" : "Source Literature ↗"}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =================================================================================== */}
      {/* SECTION 3: MULTIPLE IMAGE HOLOGRAM GALLERY MODAL (CYBER-HOLOGRAPHIC STYLE) */}
      {/* =================================================================================== */}
      {isHoloOpen && (
        <div
          data-no-translate="true"
          data-cms-inline="true"
          className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          {/* Holographic Window */}
          <div className="relative w-full max-w-5xl rounded-3xl border border-cyan-400/50 bg-slate-950/95 p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.35)] text-white backdrop-blur-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Holographic Grid Background & Scanline Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent" />

            {/* Hologram Header Bar */}
            <div className="relative z-10 flex items-center justify-between border-b border-cyan-500/30 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs md:text-sm font-mono font-bold tracking-widest text-cyan-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                  GEOSITE NATURAL SCENERY HOLO-ARCHIVE // FIELD IMAGERY
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-white mt-1.5 flex items-center gap-3 flex-wrap">
                  <span>{kh ? selectedSite.nameKm : selectedSite.name}</span>
                  {naturalPhotos.length > 0 && (
                    <span className="text-xs md:text-sm font-mono font-bold px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      {activeImageIdx + 1} / {naturalPhotos.length} {kh ? "រូបភាពធម្មជាតិ" : "Scenic Photos"}
                    </span>
                  )}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsHoloOpen(false)}
                  className="rounded-full bg-slate-800 p-2 text-slate-300 hover:bg-rose-900/80 hover:text-white transition"
                  title="Close Hologram Gallery"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Hologram Active Viewport */}
            {naturalPhotos.length > 0 ? (
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-[360px] overflow-hidden">
                {/* Main Image Stage with Hologram Bracket Glow */}
                <div className="relative max-h-[50vh] w-full flex items-center justify-center">
                  <div className="pointer-events-none absolute -top-2 -left-2 h-6 w-6 border-t-2 border-l-2 border-cyan-400" />
                  <div className="pointer-events-none absolute -top-2 -right-2 h-6 w-6 border-t-2 border-r-2 border-cyan-400" />
                  <div className="pointer-events-none absolute -bottom-2 -left-2 h-6 w-6 border-b-2 border-l-2 border-cyan-400" />
                  <div className="pointer-events-none absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-cyan-400" />

                  <img
                    src={`/geosites/${naturalPhotos[activeImageIdx]?.src}`}
                    alt={naturalPhotos[activeImageIdx]?.caption}
                    className="max-h-[48vh] w-auto max-w-full rounded-xl object-contain shadow-[0_0_35px_rgba(6,182,212,0.3)] border border-cyan-400/30 cursor-pointer"
                    onClick={() => setLightboxImg(naturalPhotos[activeImageIdx])}
                  />

                  {/* Left / Right Carousel Controls */}
                  {naturalPhotos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveImageIdx((prev) =>
                            prev > 0 ? prev - 1 : naturalPhotos.length - 1
                          )
                        }
                        className="absolute left-3 rounded-full bg-slate-900/85 p-3 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition shadow-lg"
                      >
                        <ChevronLeft size={22} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveImageIdx((prev) =>
                            prev < naturalPhotos.length - 1 ? prev + 1 : 0
                          )
                        }
                        className="absolute right-3 rounded-full bg-slate-900/85 p-3 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition shadow-lg"
                      >
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}
                </div>

                {/* Hologram Caption & Scientific Credit Card */}
                <div className="mt-4 w-full rounded-2xl bg-slate-900/85 p-4 border border-cyan-500/20 text-center">
                  <p className="text-sm md:text-base font-semibold text-cyan-100">
                    {naturalPhotos[activeImageIdx]?.caption}
                  </p>
                  {naturalPhotos[activeImageIdx]?.credit && (
                    <p className="mt-1.5 text-xs text-slate-400 italic">
                      {naturalPhotos[activeImageIdx]?.credit}
                    </p>
                  )}
                </div>

                {/* Hologram Thumbnail Filmstrip */}
                {naturalPhotos.length > 1 && (
                  <div className="relative z-10 mt-4 flex items-center justify-center gap-3 overflow-x-auto pb-1 border-t border-cyan-500/20 pt-3">
                    {naturalPhotos.map((img, idx) => {
                      const isActive = idx === activeImageIdx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIdx(idx)}
                          className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition ${
                            isActive
                              ? "border-cyan-400 shadow-[0_0_15px_#22d3ee] scale-105"
                              : "border-slate-700 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={`/geosites/${img.src}`}
                            alt={img.caption}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="max-w-lg rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-8 shadow-xl">
                  <Sparkles size={40} className="text-cyan-400 mx-auto mb-3 animate-pulse" />
                  <h4 className="text-lg md:text-xl font-extrabold text-white mb-2">
                    {kh ? "មិនមានរូបភាពទេសភាពធម្មជាតិក្នុងកាតាឡុកទេ" : "No Natural Field Photos In Catalogue"}
                  </h4>
                  <p className="text-sm md:text-base text-cyan-200/80 leading-relaxed mb-6">
                    {kh
                      ? "ទីតាំងភូគព្ភស្ថាននេះត្រូវបានចងក្រងជាចម្បងជាមួយផែនទីភូគព្ភសាស្ត្រ ចំណិតស្តើងសិលា និងសំណាកផូស៊ីល។ សូមពិនិត្យមើលផ្ទាំងវិទ្យាសាស្ត្រក្នុងឯកសារខាងក្រោមផែនទី។"
                      : "This locality is documented with peer-reviewed geological maps, thin sections, and fossil specimens. Please inspect the Scientific Plates in the dossier below the map."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsHoloOpen(false);
                      const el = document.getElementById("scientific-plates");
                      el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-xs md:text-sm font-extrabold text-slate-950 hover:bg-cyan-300 transition shadow-lg"
                  >
                    <BookOpen size={16} />
                    <span>{kh ? "ពិនិត្យមើលផ្ទាំងផែនទី និងសំណាកផូស៊ីល ↓" : "View Scientific Plates & Maps Below ↓"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxImg && (
        <div
          data-no-translate="true"
          data-cms-inline="true"
          className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          onClick={() => setLightboxImg(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImg(null)}
            className="absolute top-5 right-5 text-white p-3 rounded-full bg-slate-800 hover:bg-rose-900 font-bold transition shadow-lg"
          >
            <X size={24} />
          </button>
          <div
            className="max-w-6xl max-h-[92vh] flex flex-col items-center bg-slate-950/80 p-4 rounded-3xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`/geosites/${lightboxImg.src}`}
              alt={lightboxImg.caption}
              className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <p className="mt-3.5 text-center text-sm md:text-base font-semibold text-white max-w-4xl px-4 leading-relaxed">
              {lightboxImg.caption}
            </p>
            {lightboxImg.credit && (
              <p className="mt-1 text-center text-xs text-slate-400 italic max-w-3xl px-4">
                {lightboxImg.credit}
              </p>
            )}
          </div>
        </div>
      )}

      {/* GEOPARKS RESEARCH DOCUMENTS & DATA MODAL */}
      {isDocsOpen && (
        <div
          data-no-translate="true"
          data-cms-inline="true"
          className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsDocsOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 text-slate-100 p-6 md:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsDocsOpen(false)}
              className="absolute top-5 right-5 text-slate-400 p-2.5 rounded-full hover:bg-slate-800 hover:text-white transition"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-400 border border-emerald-500/30">
                <FolderArchive size={28} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  {kh ? "បណ្ណសារ និងទិន្នន័យស្រាវជ្រាវ" : "Official Scientific Repository"}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                  {kh ? "ឯកសារស្រាវជ្រាវ និងទិន្នន័យភូគព្ភស្ថានកម្ពុជា" : "Cambodia Geoparks Research Documents & Data"}
                </h2>
              </div>
            </div>

            <p className="mt-3 text-sm md:text-base text-slate-300 leading-relaxed">
              {kh
                ? "រាល់ឯកសារស្រាវជ្រាវ កាតាឡុកបេតិកភណ្ឌ របាយការណ៍បឋម និងរូបភាពទីវាលទាំងអស់ត្រូវបានរក្សាទុកដោយផ្ទាល់នៅក្នុងថតវេបសាយ (public/geoparks/) ដើម្បីសម្រួលដល់ការសិក្សាស្រាវជ្រាវ និងការទាញយកទិន្នន័យដោយសេរី។"
                : "All research monographs, heritage catalogues, scientific reports, and field photographs are stored directly inside the website repository (/geoparks/) for open geological research, education, and geospatial analysis."}
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Document 1: Catalogue */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col justify-between hover:border-emerald-500/50 transition">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
                      <FileText size={13} /> DOCX · 56.2 MB
                    </span>
                    <span className="text-xs text-slate-400">National Catalogue</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-white leading-snug">
                    {kh ? "កាតាឡុកភូគព្ភស្ថានកម្ពុជា" : "Cambodia Geosites Document Catalogue"}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    {kh
                      ? "ឯកសារចងក្រងភូគព្ភស្ថានទូទាំងប្រទេសកម្ពុជា រួមមានភ្នំគូលែន បាត់ដំបង កំពត កោះកុង ជាមួយរូបភាពទីវាល និងកំណត់ត្រាភូគព្ភសាស្ត្រលម្អិត។"
                      : "Comprehensive geological heritage catalogue documenting geosites across Cambodia with stratigraphic columns, outcrop surveys, and field photographs."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">/geoparks/Cambodia_Geosites_Document_Catalogue.docx</span>
                  <a
                    href="/geoparks/Cambodia_Geosites_Document_Catalogue.docx"
                    download="Cambodia_Geosites_Document_Catalogue.docx"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
                  >
                    <Download size={13} />
                    <span>{kh ? "ទាញយក" : "Download"}</span>
                  </a>
                </div>
              </div>

              {/* Document 2: Lom Phat Report PDF */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col justify-between hover:border-emerald-500/50 transition">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-300 border border-rose-500/30">
                      <FileText size={13} /> PDF · 1.99 MB
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">ITC & MoE Report</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-white leading-snug">
                    {kh ? "របាយការណ៍ឈើក្លាយជាថ្ម លំផាត់ រតនគិរី (PDF)" : "Lom Phat Petrified Wood Report (PDF)"}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    {kh
                      ? "របាយការណ៍ផ្លូវការ៖ បរិស្ថានកំណកកកើត និងការកំណត់អត្តសញ្ញាណដើមឈើក្លាយជាថ្ម នៅស្រុកលំផាត់ ខេត្តរតនគិរី ដោយនិស្សិត ITC និងនាយកដ្ឋានឧទ្យានបេតិកភណ្ឌ ក្រសួងបរិស្ថាន។"
                      : "Official research report: Depositional Environment and Petrified wood Identification at Lom Phat district, Ratanakiri (ITC & Dept. of Heritage Park, Ministry of Environment)."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">/geoparks/Internship report_1.pdf</span>
                  <div className="flex items-center gap-2">
                    <a
                      href="/geoparks/Internship report_1.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
                    >
                      <Eye size={13} />
                      <span>{kh ? "មើល" : "View"}</span>
                    </a>
                    <a
                      href="/geoparks/Internship report_1.pdf"
                      download="Internship report_1.pdf"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
                    >
                      <Download size={13} />
                      <span>{kh ? "ទាញយក" : "Download"}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Document 3: Lom Phat Monograph Full DOCX */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col justify-between hover:border-emerald-500/50 transition">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-500/20 px-2.5 py-1 text-xs font-bold text-purple-300 border border-purple-500/30">
                      <FileText size={13} /> DOCX · 29.5 MB
                    </span>
                    <span className="text-xs text-purple-300 font-semibold">Full Monograph</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-white leading-snug">
                    {kh ? "អត្ថបទស្រាវជ្រាវពេញលេញ ឈើក្លាយជាថ្មលំផាត់" : "Lom Phat Petrified Wood Full Study"}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    {kh
                      ? "កំណែស្រាវជ្រាវពេញលេញ មានចំណិតស្តើងមីក្រូទស្សន៍កោសិកាឈើស្រល់បុរាណ Agathis (Araucariaceae), ស្រទាប់ដីកកកុញ និងរូបភាពកំណាយផ្ទាល់។"
                      : "Complete research study containing high-resolution thin sections of tracheid bordered pits, radial sections, cross fields, and geological logging in Lom Phat."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">/geoparks/Internship report_PROGRESS.docx</span>
                  <a
                    href="/geoparks/Internship report_PROGRESS.docx"
                    download="Internship report_PROGRESS.docx"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
                  >
                    <Download size={13} />
                    <span>{kh ? "ទាញយក" : "Download"}</span>
                  </a>
                </div>
              </div>

              {/* Document 4: Ancient Stone Quarry Photo */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col justify-between hover:border-emerald-500/50 transition">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
                      <Eye size={13} /> JPG · 642 KB
                    </span>
                    <span className="text-xs text-amber-300 font-semibold">High-Res Outcrop</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-white leading-snug">
                    {kh ? "រូបភាពទីវាល រណ្តៅយកថ្មបុរាណភ្នំគូលែន" : "Ancient Angkor Sandstone Quarry Photo"}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    {kh
                      ? "រូបភាពទីវាលកម្រិតច្បាស់ខ្ពស់នៃរណ្តៅយកថ្មភក់បុរាណត្រពាំងចារនៅលើភ្នំគូលែន បង្ហាញស្លាកស្នាមកាប់ថ្មសម្រាប់សាងសង់ប្រាសាទអង្គរ។"
                      : "Original high-resolution outcrop photo of the Tra Peang Cha ancient sandstone quarry on Phnom Kulen, showing extraction beds and block separation trenches."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">/geoparks/Ancient stone quarry.jpg</span>
                  <div className="flex items-center gap-2">
                    <a
                      href="/geoparks/Ancient stone quarry.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
                    >
                      <Eye size={13} />
                      <span>{kh ? "មើល" : "View"}</span>
                    </a>
                    <a
                      href="/geoparks/Ancient stone quarry.jpg"
                      download="Ancient stone quarry.jpg"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
                    >
                      <Download size={13} />
                      <span>{kh ? "ទាញយក" : "Download"}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Document 5: GIS CSV */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col justify-between hover:border-emerald-500/50 transition">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                      <FileDown size={13} /> CSV · 4.6 KB
                    </span>
                    <span className="text-xs text-slate-400 font-mono">30 Geosites</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-white leading-snug">
                    {kh ? "តារាងកូអរដោណេភូគព្ភស្ថាន (CSV)" : "Geosites Coordinates Table (CSV)"}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    {kh
                      ? "ទិន្នន័យកូអរដោណេភូមិសាស្ត្រ WGS84, តំបន់ UTM, រយៈកម្ពស់, និងចំណាត់ថ្នាក់ភូគព្ភសាស្ត្រនៃភូគព្ភស្ថានទាំង ៣០ កន្លែង។"
                      : "Tabular dataset containing WGS84 lat/long, UTM coordinates, elevations, and geological classifications for all 30 Cambodian geosites."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">/geosites/coordinates.csv</span>
                  <a
                    href="/geosites/coordinates.csv"
                    download="Cambodia_Geosites_Coordinates.csv"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
                  >
                    <Download size={13} />
                    <span>{kh ? "ទាញយក CSV" : "Download CSV"}</span>
                  </a>
                </div>
              </div>

              {/* Document 6: GeoJSON */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col justify-between hover:border-emerald-500/50 transition">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-cyan-500/20 px-2.5 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                      <Layers size={13} /> GeoJSON · 16.5 KB
                    </span>
                    <span className="text-xs text-slate-400 font-mono">GIS Spatial Layer</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-white leading-snug">
                    {kh ? "ស្រទាប់ផែនទីឌីជីថល (GeoJSON)" : "Spatial Vector Layer (GeoJSON)"}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    {kh
                      ? "ទម្រង់ទិន្នន័យផែនទីស្ដង់ដារសម្រាប់បើកលើ QGIS, ArcGIS, MapLibre ឬប្រព័ន្ធ GIS ផ្សេងៗ។"
                      : "Standard spatial layer ready for direct import into QGIS, ArcGIS, Google Earth, and Web GIS mapping applications."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">/geosites/geosites.geojson</span>
                  <a
                    href="/geosites/geosites.geojson"
                    download="Cambodia_Geosites.geojson"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
                  >
                    <Download size={13} />
                    <span>{kh ? "ទាញយក GeoJSON" : "Download GeoJSON"}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
