import { useEffect, useRef, useState, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
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
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri World Terrain Base",
    nameEn: "Terrain",
    nameKm: "ទម្រង់ដី",
  },
};

const DEM_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";

function renderMarkerHtml(site: GeositeRecord, isActive: boolean): string {
  if (isActive) {
    return `
      <div style="position: relative; width: 42px; height: 42px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(245, 158, 11, 0.45); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(234, 179, 8, 0.4); box-shadow: 0 0 24px #eab308;"></div>
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
  const [coords, setCoords] = useState<[number, number]|null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [pitch, setPitch] = useState(58);

  // Hologram Gallery States
  const [isHoloOpen, setIsHoloOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<GeositeGalleryItem | null>(null);

  // Selected site record
  const selectedSite = useMemo(() => {
    return CAMBODIA_GEOSITES.find((s) => s.id === selectedSiteId) || CAMBODIA_GEOSITES[0];
  }, [selectedSiteId]);

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
        s.province.en.toLowerCase().includes(q);
      return matchProv && matchQuery;
    });
  }, [selectedProvince, searchQuery]);

  // Fly to site on map
  const flyToSite = (site: GeositeRecord, openHolo = false) => {
    setSelectedSiteId(site.id);
    setActiveImageIdx(0);
    if (openHolo && site.gallery.length > 0) {
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

    m.on("load", () => {
      setReady(true);
      if (selectedSite.coordinates) {
        m.flyTo({ center: selectedSite.coordinates, zoom: 11.5, pitch: 60, speed: 0.8 });
      }
    });

    m.on("error", (e) => {
      if (e.error?.message) {
        setError("Map tiles or 3D terrain could not load. Check network connection.");
      }
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

      const popup = new maplibregl.Popup({
        offset: 18,
        closeButton: false,
        className: "geosite-custom-popup",
      }).setHTML(`
        <div style="font-family: system-ui, sans-serif; padding: 6px 8px; font-size: 12px; line-height: 1.35; max-width: 220px; color: #0f172a;">
          <div style="font-weight: 800; font-size: 13px;">${site.name}</div>
          <div style="font-size: 11px; color: #047857; font-weight: 600; margin-top: 3px;">
            ${site.province.en} (${site.province.km})
          </div>
          <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
            ${site.era} · ${site.gallery.length} photos
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
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    const source = m.getSource("background") as maplibregl.RasterTileSource | undefined;
    source?.setTiles([TILES[basemap].url]);
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
    if (!isHoloOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsHoloOpen(false);
      if (e.key === "ArrowLeft") {
        setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : selectedSite.gallery.length - 1));
      }
      if (e.key === "ArrowRight") {
        setActiveImageIdx((prev) => (prev < selectedSite.gallery.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isHoloOpen, selectedSite.gallery.length]);

  return (
    <section
      data-no-translate="true"
      data-cms-inline="true"
      className="mx-auto max-w-[1720px] px-4 py-8 md:px-8"
    >
      {/* SECTION HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700">
            <Globe size={15} />
            {kh ? "ប្រព័ន្ធព័ត៌មានភូគព្ភស្ថានកម្ពុជា · 3D Web GIS" : "Cambodia National Geosites Inventory · 3D Web GIS"}
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900 md:text-4xl">
            {kh ? "ឧទ្យានភូគព្ភសាស្ត្រ និងភូគព្ភស្ថានកម្ពុជា" : "Cambodia Geoparks & Geosites Explorer"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {kh
              ? "រុករកទិន្នន័យកូអរដោណេផ្ទៀងផ្ទាត់ និងរូបភាពហូឡូក្រាមនៃភូគព្ភស្ថានចំនួន ២៩ កន្លែងទូទាំងប្រទេសកម្ពុជា។"
              : "Interactive exploration of 29 verified Cambodian geosites, palaeontological discoveries, and volcanic maars with multi-image hologram galleries."}
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/geosites/coordinates.csv"
            download="Cambodia_Geosites_Coordinates.csv"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <Download size={14} className="text-emerald-700" />
            <span>{kh ? "ទាញយក Excel / CSV" : "Download Coordinates (CSV)"}</span>
          </a>

          <a
            href="/geosites/geosites.geojson"
            download="Cambodia_Geosites.geojson"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <Layers size={14} className="text-emerald-700" />
            <span>{kh ? "ទាញយក GeoJSON" : "Download GeoJSON"}</span>
          </a>

          <a
            href="/geosites/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-800 transition"
          >
            <BookOpen size={14} />
            <span>{kh ? "បើកឯកសារកាតាឡុកដើម ↗" : "Full Geosite Catalogue ↗"}</span>
          </a>
        </div>
      </div>

      {/* PROVINCIAL FILTER PILLS */}
      <div className="mb-4 flex flex-wrap items-center gap-2 overflow-x-auto pb-2 text-xs">
        <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
          <Filter size={13} /> {kh ? "ខេត្ត:" : "Province:"}
        </span>
        <button
          type="button"
          onClick={() => setSelectedProvince("all")}
          className={`rounded-lg px-3 py-1.5 font-bold transition ${
            selectedProvince === "all"
              ? "bg-slate-900 text-white shadow-xs"
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
            className={`rounded-lg px-3 py-1.5 font-bold transition ${
              selectedProvince === provName
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {provName} ({count})
          </button>
        ))}
      </div>

      {/* MAIN EXPLORER WORKSPACE (SIDEBAR + 3D MAP) */}
      <div className="grid gap-5 lg:grid-cols-[330px_minmax(0,1fr)]">
        {/* LEFT: Geosite Directory List with Instant Search */}
        <aside className="flex flex-col h-[620px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          {/* Search Bar */}
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={kh ? "ស្វែងរកឈ្មោះ ឬតំបន់..." : "Search geosite name or keyword..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1 mb-2">
            <span>{filteredSites.length} {kh ? "ទីតាំង" : "localities"}</span>
            <span>{kh ? "ចុចដើម្បីមើលលើផែនទី" : "Click pin to fly"}</span>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredSites.map((s) => {
              const isSelected = selectedSiteId === s.id;
              const hasCoords = s.coordinates && s.publish_pin;
              return (
                <div
                  key={s.id}
                  onClick={() => flyToSite(s)}
                  className={`rounded-xl border p-3 cursor-pointer transition text-left ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <strong className="text-xs font-bold text-slate-900 leading-snug">
                      {kh ? s.nameKm : s.name}
                    </strong>
                    {hasCoords ? (
                      <span className="shrink-0 h-2 w-2 rounded-full bg-emerald-500 mt-1 shadow-xs" />
                    ) : (
                      <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        HOLD
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold text-emerald-800 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                      {s.province.en}
                    </span>
                    <span>·</span>
                    <span className="truncate max-w-[150px]">{s.era}</span>
                  </div>

                  {s.gallery.length > 0 && (
                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <Sparkles size={12} />
                        {s.gallery.length} {kh ? "រូបភាពហូឡូក្រាម" : "images"}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          flyToSite(s, true);
                        }}
                        className="rounded px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold hover:bg-emerald-700 transition"
                      >
                        {kh ? "មើលរូប" : "Holo-View"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* RIGHT: 3D MapLibre Interactive Canvas */}
        <div className="relative flex flex-col h-[620px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
          {/* Map Top Control Bar */}
          <div className="z-10 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-950/90 px-3.5 py-2.5 text-xs text-white backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Layers size={14} className="text-emerald-400" />
                <span>Basemap:</span>
                <select
                  aria-label="Basemap"
                  value={basemap}
                  onChange={(e) => setBasemap(e.target.value as Basemap)}
                  className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-white border border-slate-700 focus:outline-none"
                >
                  <option value="satellite">Satellite (Esri Imagery)</option>
                  <option value="topo">Topographic Map</option>
                  <option value="hillshade">Hillshade DEM</option>
                  <option value="terrain">Terrain Base</option>
                </select>
              </label>

              <button
                type="button"
                onClick={() => setTerrain3D((x) => !x)}
                className={`rounded-lg px-2.5 py-1 font-bold text-xs transition border ${
                  terrain3D
                    ? "bg-emerald-700 text-white border-emerald-500 shadow-xs"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                }`}
              >
                {terrain3D ? "3D Elevation Active" : "2D Flat Map"}
              </button>

              <button
                type="button"
                onClick={() => {
                  const v = pitch > 20 ? 0 : 62;
                  setPitch(v);
                  map.current?.easeTo({ pitch: v, duration: 600 });
                }}
                className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
              >
                {pitch > 20 ? "Top View (0°)" : "3D Tilt (62°)"}
              </button>

              <button
                type="button"
                onClick={() => map.current?.flyTo({ center: [104.5, 12.5], zoom: 7.2, pitch: 58, bearing: -15 })}
                className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
              >
                Reset Cambodia
              </button>
            </div>

            {/* Quick Open Hologram Gallery Button */}
            {selectedSite.gallery.length > 0 && (
              <button
                type="button"
                onClick={() => setIsHoloOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/50 px-3 py-1 font-bold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500/30 transition text-xs"
              >
                <Sparkles size={13} className="text-cyan-300" />
                <span>{kh ? "បើកហូឡូក្រាម" : "Open Hologram"} ({selectedSite.gallery.length})</span>
              </button>
            )}
          </div>

          {/* Map Canvas */}
          <div ref={container} className="h-full w-full" aria-label="3D Geopark Interactive Map" />

          {/* Map Bottom Telemetry HUD */}
          <div className="z-10 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-950/85 px-4 py-2 font-mono text-[11px] text-slate-400 backdrop-blur-md">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Navigation size={12} />
              {coords
                ? `LAT ${coords[1].toFixed(5)}° · LON ${coords[0].toFixed(5)}° (WGS84)`
                : "Hover on map to inspect coordinates"}
            </span>
            <span className="text-slate-300">
              Selected: <strong className="text-white">{selectedSite.name}</strong>
            </span>
          </div>

          {error && (
            <div className="absolute top-14 left-4 z-20 rounded-xl bg-rose-900/90 p-3 text-xs text-rose-200 border border-rose-700">
              {error}
            </div>
          )}
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
        className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 md:p-9 shadow-sm transition-all duration-200"
      >
        {/* Narrative Top Bar */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-800">
                <MapPin size={13} />
                {selectedSite.province.en} ({selectedSite.province.km})
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-mono font-bold text-slate-700">
                {selectedSite.era}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-cyan-100 px-2.5 py-1 text-xs font-mono font-bold text-cyan-800">
                ID: {selectedSite.id}
              </span>
              {selectedSite.publish_pin ? (
                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                  Published Pin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                  Coordinate Hold (Under Survey)
                </span>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {kh ? selectedSite.nameKm : selectedSite.name}
            </h2>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              {selectedSite.name} · {selectedSite.designation}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedSite.gallery.length > 0 && (
              <button
                type="button"
                onClick={() => setIsHoloOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                <Sparkles size={15} className="text-emerald-400" />
                <span>{kh ? "បើកវិចិត្រសាលហូឡូក្រាម" : "View Hologram Gallery"} ({selectedSite.gallery.length})</span>
              </button>
            )}

            {selectedSite.coordinates && (
              <a
                href={`https://www.google.com/maps?q=${selectedSite.coordinates[1]},${selectedSite.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <Compass size={14} className="text-emerald-700" />
                <span>Google Maps ↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Narrative Core Dossier (3 Columns Grid) */}
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {/* Column 1: Geological Journey & Deep-Time Story */}
          <div className="space-y-4 md:col-span-2">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-sky-50/40 p-6 border border-emerald-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2">
                <BookOpen size={16} />
                {kh ? "ដំណើររឿងរ៉ាវភូគព្ភសាស្ត្រ (Geological Narrative)" : "Deep-Time Geological Narrative"}
              </span>

              <h3 className="text-lg font-bold text-slate-900 mb-3">
                {kh ? "ប្រវត្តិការកកើត និងទម្រង់សិលាសាស្ត្រ" : "Landscape Evolution & Geological Setting"}
              </h3>

              <p className="text-sm leading-relaxed text-slate-700">
                {selectedSite.description}
              </p>

              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                {kh ? selectedSite.narrative.geologicalSettingKm : selectedSite.narrative.geologicalSetting}
              </p>
            </div>

            {/* Mineralogy & Lithological Composition */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Mountain size={15} className="text-emerald-700" />
                {kh ? "លក្ខណៈសិលាសាស្ត្រ និងរ៉ែ (Mineralogy & Petrology)" : "Mineralogy & Lithological Characteristics"}
              </span>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {selectedSite.mineralogy || "Quartz sandstone and sedimentary alluvial bedrock."}
              </p>
              <p className="text-xs leading-relaxed text-slate-600 mt-2">
                {selectedSite.narrative.mineralogyNote}
              </p>
            </div>
          </div>

          {/* Column 2: Survey Provenance, GPS Coordinate Basis, and Technical Metadata */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Shield size={15} className="text-emerald-700" />
                {kh ? "ប្រភពទិន្នន័យ និងកូអរដោណេ" : "Survey Provenance & Coordinate Basis"}
              </span>

              <div className="text-xs space-y-3 text-slate-600">
                <div>
                  <strong className="block text-slate-800 mb-0.5 font-bold">
                    {kh ? "កូអរដោណេផ្លូវការ:" : "Spatial Position:"}
                  </strong>
                  {selectedSite.coordinates ? (
                    <span className="font-mono text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded font-bold">
                      {selectedSite.coordinates[1].toFixed(5)}° N, {selectedSite.coordinates[0].toFixed(5)}° E
                    </span>
                  ) : (
                    <span className="font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                      Position Unresolved / Hold
                    </span>
                  )}
                </div>

                <div>
                  <strong className="block text-slate-800 mb-0.5 font-bold">
                    {kh ? "ប្រភពទិន្នន័យដើម:" : "Published Source Basis:"}
                  </strong>
                  <span className="leading-snug block">
                    {selectedSite.coordinate_source}
                  </span>
                </div>

                {selectedSite.coordinate_notes && (
                  <div>
                    <strong className="block text-slate-800 mb-0.5 font-bold">
                      {kh ? "កំណត់សម្គាល់បន្ថែម:" : "Cartographic Notes:"}
                    </strong>
                    <span className="italic block leading-snug">
                      {selectedSite.coordinate_notes}
                    </span>
                  </div>
                )}

                {selectedSite.source_urls.length > 0 && (
                  <div className="pt-2 border-t border-slate-200">
                    <strong className="block text-slate-800 mb-1 font-bold">
                      {kh ? "ឯកសារយោង និងតំណភ្ជាប់:" : "Source Literature Links:"}
                    </strong>
                    {selectedSite.source_urls.map((u, i) => (
                      <a
                        key={i}
                        href={u}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline break-all block mb-1"
                      >
                        <ArrowUpRight size={11} /> {u.replace(/^https?:\/\//, "").slice(0, 38)}...
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Gallery Teaser / Mini Hologram Card */}
            {selectedSite.gallery.length > 0 && (
              <div
                onClick={() => setIsHoloOpen(true)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-cyan-500/40 bg-slate-950 p-4 shadow-md transition hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]"
              >
                <div className="flex items-center justify-between text-xs text-cyan-300 font-bold mb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-cyan-400" />
                    HOLO-ARCHIVE ({selectedSite.gallery.length})
                  </span>
                  <span className="text-[10px] font-mono uppercase text-emerald-400">READY</span>
                </div>

                <div className="relative aspect-video overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-900">
                  <img
                    src={`/geosites/${selectedSite.gallery[0].src}`}
                    alt={selectedSite.gallery[0].caption}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-2 left-2 right-2 text-[11px] font-medium text-white truncate">
                    {selectedSite.gallery[0].caption}
                  </div>
                </div>

                <p className="mt-2.5 text-center text-xs font-extrabold text-cyan-300 group-hover:text-cyan-200">
                  {kh ? "ចុចដើម្បីបើកទិដ្ឋភាពហូឡូក្រាមពេញ ↗" : "Click to Launch Hologram Gallery ↗"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =================================================================================== */}
      {/* SECTION 3: MULTIPLE IMAGE HOLOGRAM GALLERY MODAL (CYBER-HOLOGRAPHIC STYLE) */}
      {/* =================================================================================== */}
      {isHoloOpen && selectedSite.gallery.length > 0 && (
        <div
          data-no-translate="true"
          data-cms-inline="true"
          className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
        >
          {/* Holographic Window */}
          <div className="relative w-full max-w-5xl rounded-3xl border border-cyan-400/50 bg-slate-950/95 p-6 shadow-[0_0_50px_rgba(6,182,212,0.35)] text-white backdrop-blur-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Holographic Grid Background & Scanline Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent" />

            {/* Hologram Header Bar */}
            <div className="relative z-10 flex items-center justify-between border-b border-cyan-500/30 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-400">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  GEOSITE HOLO-ARCHIVE // TELEMETRY LINKED
                </div>
                <h3 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                  <span>{kh ? selectedSite.nameKm : selectedSite.name}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    {activeImageIdx + 1} / {selectedSite.gallery.length}
                  </span>
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsHoloOpen(false)}
                  className="rounded-full bg-slate-800 p-2 text-slate-300 hover:bg-rose-900/80 hover:text-white transition"
                  title="Close Hologram Gallery"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Hologram Active Viewport */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-[360px] overflow-hidden">
              {/* Main Image Stage with Hologram Bracket Glow */}
              <div className="relative max-h-[50vh] w-full flex items-center justify-center">
                {/* Holographic Cyan Corner Reticles */}
                <div className="pointer-events-none absolute -top-2 -left-2 h-6 w-6 border-t-2 border-l-2 border-cyan-400" />
                <div className="pointer-events-none absolute -top-2 -right-2 h-6 w-6 border-t-2 border-r-2 border-cyan-400" />
                <div className="pointer-events-none absolute -bottom-2 -left-2 h-6 w-6 border-b-2 border-l-2 border-cyan-400" />
                <div className="pointer-events-none absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-cyan-400" />

                <img
                  src={`/geosites/${selectedSite.gallery[activeImageIdx].src}`}
                  alt={selectedSite.gallery[activeImageIdx].caption}
                  className="max-h-[48vh] w-auto max-w-full rounded-xl object-contain shadow-[0_0_35px_rgba(6,182,212,0.3)] border border-cyan-400/30 cursor-pointer"
                  onClick={() => setLightboxImg(selectedSite.gallery[activeImageIdx])}
                />

                {/* Left / Right Carousel Controls */}
                {selectedSite.gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIdx((prev) =>
                          prev > 0 ? prev - 1 : selectedSite.gallery.length - 1
                        )
                      }
                      className="absolute left-3 rounded-full bg-slate-900/80 p-3 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition shadow-lg"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIdx((prev) =>
                          prev < selectedSite.gallery.length - 1 ? prev + 1 : 0
                        )
                      }
                      className="absolute right-3 rounded-full bg-slate-900/80 p-3 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition shadow-lg"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Hologram Caption & Scientific Credit Card */}
              <div className="mt-4 w-full rounded-2xl bg-slate-900/80 p-4 border border-cyan-500/20 text-center">
                <p className="text-sm font-semibold text-cyan-100">
                  {selectedSite.gallery[activeImageIdx].caption}
                </p>
                {selectedSite.gallery[activeImageIdx].credit && (
                  <p className="mt-1 text-xs text-slate-400 italic">
                    {selectedSite.gallery[activeImageIdx].credit}
                  </p>
                )}
              </div>
            </div>

            {/* Hologram Thumbnail Filmstrip */}
            {selectedSite.gallery.length > 1 && (
              <div className="relative z-10 mt-4 flex items-center justify-center gap-3 overflow-x-auto pb-1 border-t border-cyan-500/20 pt-3">
                {selectedSite.gallery.map((img, idx) => {
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
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImg(null)}
            className="absolute top-5 right-5 text-white p-2 rounded-full bg-slate-800 hover:bg-slate-700 font-bold"
          >
            <X size={24} />
          </button>
          <div className="max-w-6xl max-h-[90vh] flex flex-col items-center">
            <img
              src={`/geosites/${lightboxImg.src}`}
              alt={lightboxImg.caption}
              className="max-h-[82vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <p className="mt-3 text-center text-sm font-semibold text-white">
              {lightboxImg.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
