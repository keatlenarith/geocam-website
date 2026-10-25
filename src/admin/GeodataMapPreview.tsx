import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { TocLayerItem } from "../features/geodata/toc-config";
import type { BaseMapKey } from "../components/site/GeoMap";
import { toUtm48N } from "../lib/utm";
import {
  Layers,
  Maximize2,
  Minimize2,
  RotateCcw,
  Compass,
} from "lucide-react";

const BASEMAPS: Record<
  BaseMapKey,
  { url: string; attribution: string; maxNativeZoom: number; labelEn: string; labelKm: string }
> = {
  topo: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles © Esri — World Topographic Map",
    maxNativeZoom: 19,
    labelEn: "Topographic",
    labelKm: "ភូមិសាស្ត្រ",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles © Esri — World Imagery",
    maxNativeZoom: 19,
    labelEn: "Satellite",
    labelKm: "ផ្កាយរណប",
  },
  hillshade: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles © Esri — World Hillshade",
    maxNativeZoom: 16,
    labelEn: "Hillshade",
    labelKm: "ស្រមោលដី",
  },
  dem: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles © Esri — World Terrain Base",
    maxNativeZoom: 13,
    labelEn: "Terrain Relief",
    labelKm: "ទម្រង់ដី",
  },
};

interface GeodataMapPreviewProps {
  layers: TocLayerItem[];
  lang?: "en" | "km";
  selectedLayerId?: string | null;
  onSelectLayer?: (layerId: string) => void;
}

export default function GeodataMapPreview({
  layers,
  lang = "en",
  selectedLayerId,
  onSelectLayer,
}: GeodataMapPreviewProps) {
  const km = lang === "km";
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const vectorLayersGroupRef = useRef<L.LayerGroup | null>(null);

  const [baseMap, setBaseMap] = useState<BaseMapKey>("topo");
  const [clickedCoord, setClickedCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [12.5, 104.9],
      zoom: 7,
      minZoom: 5,
      maxZoom: 18,
      zoomControl: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    const cfg = BASEMAPS[baseMap];
    const baseLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxNativeZoom: cfg.maxNativeZoom,
      maxZoom: 19,
    }).addTo(map);
    baseTileLayerRef.current = baseLayer;

    const vectorGroup = L.layerGroup().addTo(map);
    vectorLayersGroupRef.current = vectorGroup;

    map.on("click", (e) => {
      setClickedCoord({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      baseTileLayerRef.current = null;
      vectorLayersGroupRef.current = null;
    };
  }, []);

  // Handle Basemap Change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const cfg = BASEMAPS[baseMap];
    const nextBaseLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxNativeZoom: cfg.maxNativeZoom,
      maxZoom: 19,
    });

    nextBaseLayer.addTo(map);
    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }
    nextBaseLayer.bringToBack();
    baseTileLayerRef.current = nextBaseLayer;
  }, [baseMap]);

  // Handle Layer & Symbology updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = vectorLayersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // Iterate through layers and render visible ones
    layers.forEach((layer) => {
      if (!layer.symbology.visible || !layer.geojson) return;

      const sym = layer.symbology;
      const isSelected = selectedLayerId === layer.id;

      let dashArray: string | undefined;
      if (sym.lineStyle === "dashed") dashArray = "6, 6";
      else if (sym.lineStyle === "dotted") dashArray = "2, 5";
      else if (sym.lineStyle === "dash-dot") dashArray = "8, 4, 2, 4";

      const geoJsonLayer = L.geoJSON(layer.geojson, {
        style: () => {
          return {
            color: isSelected ? "#38bdf8" : sym.color,
            weight: isSelected ? Math.max(sym.strokeWidth + 2, 4) : sym.strokeWidth,
            opacity: 1,
            fillColor: sym.fillColor || sym.color,
            fillOpacity: sym.opacity,
            dashArray,
          };
        },
        pointToLayer: (feature, latlng) => {
          const size = sym.symbolSize || 20;
          const markerColor = isSelected ? "#38bdf8" : sym.color;
          const markerFill = sym.fillColor || sym.color;

          // Build custom SVG/HTML element for symbol
          const el = document.createElement("div");
          el.className = "geocam-toc-map-marker";
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.display = "flex";
          el.style.alignItems = "center";
          el.style.justifyContent = "center";
          el.style.boxSizing = "border-box";
          el.style.transition = "transform 0.15s ease";

          if (sym.symbol === "circle") {
            el.style.borderRadius = "50%";
            el.style.backgroundColor = markerFill;
            el.style.border = `${sym.strokeWidth}px solid ${markerColor}`;
            el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.4)";
          } else if (sym.symbol === "diamond") {
            el.style.width = `${size * 0.85}px`;
            el.style.height = `${size * 0.85}px`;
            el.style.backgroundColor = markerFill;
            el.style.border = `${sym.strokeWidth}px solid ${markerColor}`;
            el.style.transform = "rotate(45deg)";
            el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.4)";
          } else if (sym.symbol === "square") {
            el.style.borderRadius = "3px";
            el.style.backgroundColor = markerFill;
            el.style.border = `${sym.strokeWidth}px solid ${markerColor}`;
            el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.4)";
          } else if (sym.symbol === "triangle") {
            el.style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
            el.style.backgroundColor = markerColor;
          } else if (sym.symbol === "star") {
            el.style.clipPath =
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
            el.style.backgroundColor = markerColor;
          } else if (sym.symbol === "hexagon") {
            el.style.clipPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
            el.style.backgroundColor = markerFill;
            el.style.border = `${sym.strokeWidth}px solid ${markerColor}`;
          } else if (sym.symbol === "cross") {
            el.style.clipPath =
              "polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)";
            el.style.backgroundColor = markerColor;
          } else if (sym.symbol === "mine") {
            el.style.borderRadius = "4px";
            el.style.backgroundColor = markerColor;
            el.style.color = "#ffffff";
            el.innerHTML = `<svg width="${Math.round(size * 0.7)}" height="${Math.round(size * 0.7)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 4l6 6"/><path d="M17 1l6 6"/><path d="M3 21l9-9"/><path d="M2 13l9 9"/></svg>`;
          } else if (sym.symbol === "drillhole") {
            el.style.borderRadius = "50%";
            el.style.backgroundColor = markerFill;
            el.style.border = `${sym.strokeWidth}px solid ${markerColor}`;
            const dot = document.createElement("span");
            dot.style.width = `${Math.max(4, Math.round(size * 0.35))}px`;
            dot.style.height = `${Math.max(4, Math.round(size * 0.35))}px`;
            dot.style.borderRadius = "50%";
            dot.style.backgroundColor = markerColor;
            el.appendChild(dot);
          } else if (sym.symbol === "quarry") {
            el.style.borderRadius = "4px";
            el.style.backgroundColor = markerColor;
            el.style.color = "#ffffff";
            el.innerHTML = `<svg width="${Math.round(size * 0.7)}" height="${Math.round(size * 0.7)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="3,3"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>`;
          } else {
            // Pin or default
            el.style.borderRadius = "50%";
            el.style.backgroundColor = markerFill;
            el.style.border = `${sym.strokeWidth}px solid ${markerColor}`;
          }

          const icon = L.divIcon({
            html: el,
            className: "geocam-div-icon",
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });

          return L.marker(latlng, { icon });
        },
        onEachFeature: (feature, featureLayer) => {
          const p = feature.properties || {};
          const title = (km && p.nameKm ? p.nameKm : p.name) || (km ? layer.nameKm : layer.nameEn);

          const popupContent = document.createElement("div");
          popupContent.className = "text-xs space-y-1.5 p-1 max-w-[240px]";
          popupContent.innerHTML = `
            <div class="font-bold text-sm text-slate-900 border-b pb-1 mb-1">${title}</div>
            <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">${km ? layer.nameKm : layer.nameEn}</div>
            ${p.formation ? `<div class="text-slate-700"><strong>${km ? "ស្រទាប់:" : "Formation:"}</strong> ${p.formation}</div>` : ""}
            ${p.commodity ? `<div class="text-amber-800 font-medium"><strong>${km ? "សារធាតុរ៉ែ:" : "Commodity:"}</strong> ${p.commodity}</div>` : ""}
            ${p.depositType ? `<div class="text-slate-600"><strong>${km ? "ប្រភេទជម្រក:" : "Type:"}</strong> ${p.depositType}</div>` : ""}
            ${p.type ? `<div class="text-red-700"><strong>${km ? "ប្រភេទ:" : "Structure:"}</strong> ${p.type}</div>` : ""}
            ${p.sensor ? `<div class="text-cyan-800"><strong>${km ? "ឧបករណ៍:" : "Sensor:"}</strong> ${p.sensor}</div>` : ""}
            ${p.magnitude ? `<div class="text-rose-800 font-bold"><strong>${km ? "ទំហំរំញ័រ:" : "Magnitude:"}</strong> ${p.magnitude}</div>` : ""}
            ${p.depth ? `<div class="text-slate-600"><strong>${km ? "ជម្រៅ:" : "Depth:"}</strong> ${p.depth}</div>` : ""}
            ${p.geology ? `<div class="text-slate-600">${p.geology}</div>` : ""}
          `;

          featureLayer.bindPopup(popupContent);

          featureLayer.on("click", () => {
            if (onSelectLayer) onSelectLayer(layer.id);
          });
        },
      });

      group.addLayer(geoJsonLayer);
    });
  }, [layers, selectedLayerId, km, onSelectLayer]);

  // Zoom to Cambodia Bounds
  const handleResetView = () => {
    mapInstanceRef.current?.setView([12.5, 104.9], 7);
  };

  // Zoom to all visible layer bounds
  const handleFitVisibleBounds = () => {
    const map = mapInstanceRef.current;
    const group = vectorLayersGroupRef.current;
    if (!map || !group) return;

    const layersList = group.getLayers();
    if (!layersList.length) {
      handleResetView();
      return;
    }

    const bounds = L.latLngBounds([]);
    layersList.forEach((l: any) => {
      if (typeof l.getBounds === "function") {
        const b = l.getBounds();
        if (b.isValid()) bounds.extend(b);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    } else {
      handleResetView();
    }
  };

  const utm = clickedCoord ? toUtm48N(clickedCoord.lat, clickedCoord.lng) : null;
  const visibleLayers = layers.filter((l) => l.symbology.visible);

  return (
    <div
      className={`relative flex flex-col rounded-xl overflow-hidden border border-[var(--wp-border)] bg-[var(--wp-bg-card)] transition-all ${
        isFullscreen ? "fixed inset-4 z-[999] shadow-2xl" : "h-[620px] w-full"
      }`}
    >
      {/* Top Map Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[var(--wp-bg-surface)] border-b border-[var(--wp-border)] text-xs z-10">
        <div className="flex items-center gap-1.5">
          <Layers size={15} className="text-cyan-400" />
          <span className="font-semibold text-[var(--wp-text-primary)]">
            {km ? "ទិដ្ឋភាពផែនទីផ្ទាល់ (GIS Preview)" : "Live GIS Map Preview"}
          </span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {visibleLayers.length} / {layers.length} {km ? "ស្រទាប់បង្ហាញ" : "visible"}
          </span>
        </div>

        {/* Basemap buttons */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[var(--wp-text-muted)] mr-1">
            {km ? "ផែនទីគោល:" : "Base:"}
          </span>
          {(Object.keys(BASEMAPS) as BaseMapKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setBaseMap(key)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                baseMap === key
                  ? "bg-cyan-500 text-slate-900 font-bold shadow-sm"
                  : "bg-[var(--wp-bg-base)] text-[var(--wp-text-secondary)] hover:text-white border border-[var(--wp-border)]"
              }`}
            >
              {km ? BASEMAPS[key].labelKm : BASEMAPS[key].labelEn}
            </button>
          ))}
        </div>

        {/* Tools */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            title={km ? "ពង្រីកលើស្រទាប់ទាំងអស់" : "Fit visible layers"}
            onClick={handleFitVisibleBounds}
            className="p-1.5 rounded bg-[var(--wp-bg-base)] text-[var(--wp-text-secondary)] hover:text-white border border-[var(--wp-border)]"
          >
            <Compass size={14} />
          </button>
          <button
            type="button"
            title={km ? "កំណត់ទិដ្ឋភាពកម្ពុជាឡើងវិញ" : "Reset Cambodia center"}
            onClick={handleResetView}
            className="p-1.5 rounded bg-[var(--wp-bg-base)] text-[var(--wp-text-secondary)] hover:text-white border border-[var(--wp-border)]"
          >
            <RotateCcw size={14} />
          </button>
          <button
            type="button"
            title={isFullscreen ? (km ? "បង្រួមធម្មតា" : "Exit full screen") : (km ? "ពង្រីកពេញអេក្រង់" : "Full screen")}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded bg-[var(--wp-bg-base)] text-[var(--wp-text-secondary)] hover:text-white border border-[var(--wp-border)]"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="flex-1 w-full relative z-0" />

      {/* Dynamic Map Legend Overlay */}
      {showLegend && visibleLayers.length > 0 && (
        <div className="absolute bottom-10 right-3 z-[400] max-w-[260px] max-h-[220px] overflow-y-auto rounded-lg border border-[var(--wp-border)] bg-[var(--wp-bg-surface)]/95 backdrop-blur-sm p-2.5 shadow-xl text-xs space-y-1.5">
          <div className="flex items-center justify-between border-b border-[var(--wp-border)] pb-1 mb-1.5">
            <span className="font-bold text-[11px] uppercase tracking-wider text-[var(--wp-text-primary)]">
              {km ? "កំណត់សម្គាល់ផែនទី (Legend)" : "Map Legend"}
            </span>
            <button
              type="button"
              onClick={() => setShowLegend(false)}
              className="text-[10px] text-[var(--wp-text-muted)] hover:text-white"
            >
              ✕
            </button>
          </div>
          {visibleLayers.map((l) => (
            <div
              key={l.id}
              onClick={() => onSelectLayer && onSelectLayer(l.id)}
              className={`flex items-center gap-2 py-0.5 px-1 rounded cursor-pointer transition-colors ${
                selectedLayerId === l.id ? "bg-cyan-500/20 text-cyan-300 font-semibold" : "hover:bg-white/5"
              }`}
            >
              {/* Swatch */}
              {l.geometryType === "Polygon" && (
                <span
                  className="w-3.5 h-3.5 rounded-sm border shrink-0"
                  style={{
                    backgroundColor: l.symbology.fillColor || l.symbology.color,
                    borderColor: l.symbology.color,
                    opacity: l.symbology.opacity,
                  }}
                />
              )}
              {l.geometryType === "LineString" && (
                <span
                  className="w-5 shrink-0 inline-block"
                  style={{
                    height: `${Math.min(l.symbology.strokeWidth, 4)}px`,
                    backgroundColor: l.symbology.lineStyle === "solid" ? l.symbology.color : "transparent",
                    borderTop:
                      l.symbology.lineStyle === "dashed"
                        ? `2px dashed ${l.symbology.color}`
                        : l.symbology.lineStyle === "dotted"
                        ? `2px dotted ${l.symbology.color}`
                        : `2px solid ${l.symbology.color}`,
                  }}
                />
              )}
              {l.geometryType === "Point" && (
                <span
                  className="w-3.5 h-3.5 shrink-0 rounded-full border border-white"
                  style={{
                    backgroundColor: l.symbology.fillColor || l.symbology.color,
                  }}
                />
              )}
              <span className="truncate text-[11px]">{km ? l.nameKm : l.nameEn}</span>
            </div>
          ))}
        </div>
      )}

      {/* Legend Toggle button if closed */}
      {!showLegend && visibleLayers.length > 0 && (
        <button
          type="button"
          onClick={() => setShowLegend(true)}
          className="absolute bottom-10 right-3 z-[400] px-2.5 py-1 rounded bg-[var(--wp-bg-surface)] text-[var(--wp-text-primary)] border border-[var(--wp-border)] shadow-md text-xs font-semibold hover:border-cyan-400"
        >
          {km ? "បង្ហាញ Legend" : "Show Legend"}
        </button>
      )}

      {/* Bottom Coordinates & Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[var(--wp-bg-surface)] border-t border-[var(--wp-border)] text-[11px] text-[var(--wp-text-muted)] z-10">
        <div>
          {clickedCoord && utm ? (
            <span className="font-mono text-cyan-400">
              {clickedCoord.lat.toFixed(5)}° N, {clickedCoord.lng.toFixed(5)}° E · UTM 48N {utm.easting.toFixed(0)}m E, {utm.northing.toFixed(0)}m N
            </span>
          ) : (
            <span>{km ? "ចុចលើផែនទីដើម្បីពិនិត្យកូអរដោនេ (WGS84 / UTM 48N)" : "Click map to inspect coordinates (WGS84 / UTM 48N)"}</span>
          )}
        </div>
        <div>
          <a
            href="/geodata"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            {km ? "បើកទំព័រផែនទីសាធារណៈ /geodata ↗" : "Open public /geodata view ↗"}
          </a>
        </div>
      </div>
    </div>
  );
}
