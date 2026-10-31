import React, { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";
import "maplibre-gl/dist/maplibre-gl.css";

// Configure MapLibre Worker URL to prevent worker 404 in Vite
try {
  maplibregl.setWorkerUrl(maplibreWorkerUrl);
} catch {}
import {
  type EarthquakeEvent,
  formatLocalIctTime,
  translateEarthquakeLocation,
  getDepthClassification,
  formatDistanceToCambodia,
} from "./earthquake-data";
import { buildFacebookShareUrl, generateEarthquakeFacebookStatus } from "@/lib/facebook-service";
import { useI18n } from "@/lib/i18n";
import { Layers, Navigation, Compass, Globe2, ExternalLink } from "lucide-react";

interface EarthquakeMapProps {
  events: EarthquakeEvent[];
  selectedEventId?: string | null;
  onSelectEvent?: (event: EarthquakeEvent) => void;
  scope?: "cambodia" | "global";
  onScopeChange?: (scope: "cambodia" | "global") => void;
  className?: string;
}

type BasemapType = "topo" | "satellite" | "terrain";

const BASEMAP_TILES: Record<
  BasemapType,
  { url: string; attribution: string; nameEn: string; nameKm: string }
> = {
  topo: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri World Topo Map, OpenStreetMap contributors",
    nameEn: "Topographic",
    nameKm: "ភូមិសាស្ត្រ (Topo)",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri World Imagery",
    nameEn: "Satellite",
    nameKm: "ផ្កាយរណប",
  },
  terrain: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri World Shaded Relief",
    nameEn: "Terrain Relief",
    nameKm: "ទម្រង់ដី",
  },
};

function getMarkerVisuals(mag: number | null, isSelected: boolean) {
  let size = 20;
  let bg = "#3b82f6"; // Blue
  let border = "#1d4ed8";
  let textColor = "#ffffff";

  if (mag !== null && mag !== undefined) {
    if (mag >= 5.5) {
      size = 38;
      bg = "#dc2626"; // Crimson
      border = "#ffffff";
    } else if (mag >= 4.5) {
      size = 30;
      bg = "#ea580c"; // Orange
      border = "#ffffff";
    } else if (mag >= 3.0) {
      size = 24;
      bg = "#f59e0b"; // Amber
      border = "#ffffff";
    } else {
      size = 18;
      bg = "#2563eb"; // Blue
      border = "#ffffff";
    }
  }

  if (isSelected) {
    size = Math.max(size + 8, 32);
    border = "#ffffff";
  }

  return { size, bg, border, textColor };
}

function renderMarkerHtml(event: EarthquakeEvent, isSelected: boolean): string {
  const { size, bg, border } = getMarkerVisuals(event.magnitude, isSelected);
  const magText =
    event.magnitude !== null && event.magnitude !== undefined
      ? event.magnitude.toFixed(1)
      : "?";

  const isRecentLive =
    Date.now() - new Date(event.originTime).getTime() < 3 * 3600 * 1000;

  if (isSelected) {
    return `
      <div style="position: relative; width: ${size + 16}px; height: ${size + 16}px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: -12px; border-radius: 50%; border: 2.5px solid ${bg}; animation: live-seismic-pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>
        <div style="position: absolute; inset: -4px; border-radius: 50%; border: 2px solid ${bg}; animation: live-seismic-pulse-delayed 2s cubic-bezier(0, 0, 0.2, 1) 0.65s infinite; pointer-events: none;"></div>
        <div style="position: absolute; inset: 0; border-radius: 50%; background: ${bg}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; inset: 3px; border-radius: 50%; background: ${bg}; opacity: 0.3; box-shadow: 0 0 18px ${bg};"></div>
        <div style="position: relative; width: ${size}px; height: ${size}px; border-radius: 50%; background: ${bg}; border: 3px solid ${border}; box-shadow: 0 4px 14px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif; font-weight: 800; font-size: ${size >= 28 ? 12 : 10}px; color: #ffffff;">
          ${magText}
        </div>
      </div>
    `;
  }

  if (isRecentLive) {
    return `
      <div style="position: relative; width: ${size + 12}px; height: ${size + 12}px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: -8px; border-radius: 50%; border: 2px solid ${bg}; animation: live-seismic-pulse 2.2s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>
        <div style="position: absolute; inset: -2px; border-radius: 50%; border: 1.5px solid ${bg}; animation: live-seismic-pulse-delayed 2.2s cubic-bezier(0, 0, 0.2, 1) 0.75s infinite; pointer-events: none;"></div>
        <div style="position: absolute; inset: 0; border-radius: 50%; background: ${bg}; opacity: 0.25; animation: pulse 2.5s infinite;"></div>
        <div style="position: relative; width: ${size}px; height: ${size}px; border-radius: 50%; background: ${bg}; border: 2.5px solid ${border}; box-shadow: 0 2px 8px rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif; font-weight: 800; font-size: ${size >= 28 ? 11 : 9}px; color: #ffffff;">
          ${magText}
        </div>
      </div>
    `;
  }

  return `
    <div style="position: relative; width: ${size + 8}px; height: ${size + 8}px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; inset: 0; border-radius: 50%; background: ${bg}; opacity: 0.2; animation: pulse 2.5s infinite;"></div>
      <div style="position: relative; width: ${size}px; height: ${size}px; border-radius: 50%; background: ${bg}; border: 2.5px solid ${border}; box-shadow: 0 2px 8px rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif; font-weight: 800; font-size: ${size >= 28 ? 11 : 9}px; color: #ffffff;">
        ${magText}
      </div>
    </div>
  `;
}

export default function EarthquakeMap({
  events,
  selectedEventId,
  onSelectEvent,
  scope = "cambodia",
  onScopeChange,
  className = "",
}: EarthquakeMapProps) {
  const { lang } = useI18n();
  const kh = lang === "km";

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, { marker: maplibregl.Marker; el: HTMLElement }>>(
    new Map()
  );

  const [basemap, setBasemap] = useState<BasemapType>("topo");
  const [showPlates, setShowPlates] = useState<boolean>(true);
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize MapLibre GL - Default centered on Cambodia with global zoom capacity
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const m = new maplibregl.Map({
      container: mapContainer.current,
      center: [104.5, 13.0], // Centered on Cambodia & surrounding region
      zoom: 5.2,
      minZoom: 1.5, // Allow full global zoom out
      maxZoom: 16,
      style: {
        version: 8,
        sources: {
          basemap: {
            type: "raster",
            tiles: [BASEMAP_TILES.topo.url],
            tileSize: 256,
            attribution: BASEMAP_TILES.topo.attribution,
          },
        },
        layers: [
          {
            id: "basemap-layer",
            type: "raster",
            source: "basemap",
          },
        ],
      },
    });

    mapRef.current = m;
    m.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

    m.on("load", () => {
      // Add Tectonic Plate Boundaries Source & Specialized Symbology Layers
      try {
        if (!m.getSource("tectonic-plates")) {
          m.addSource("tectonic-plates", {
            type: "geojson",
            data: "/data/plate_boundaries.geojson",
          });

          // 1. SUBDUCTION ZONES (Trenches): Deep Red/Crimson with hachured dashed effect
          m.addLayer({
            id: "plate-subduction-glow",
            type: "line",
            source: "tectonic-plates",
            filter: ["==", ["get", "category"], "subduction"],
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#ef4444",
              "line-width": 6,
              "line-opacity": 0.4,
              "line-blur": 3,
            },
          });
          m.addLayer({
            id: "plate-subduction-core",
            type: "line",
            source: "tectonic-plates",
            filter: ["==", ["get", "category"], "subduction"],
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#dc2626", // Deep Red
              "line-width": 3.2,
              "line-opacity": 0.95,
            },
          });
          m.addLayer({
            id: "plate-subduction-teeth",
            type: "line",
            source: "tectonic-plates",
            filter: ["==", ["get", "category"], "subduction"],
            layout: { "line-join": "miter", "line-cap": "butt" },
            paint: {
              "line-color": "#ffffff",
              "line-width": 1.5,
              "line-dasharray": [1, 2],
              "line-opacity": 0.9,
            },
          });

          // 2. CONVERGENT / COLLISION BOUNDARIES: Purple/Magenta
          m.addLayer({
            id: "plate-convergent-glow",
            type: "line",
            source: "tectonic-plates",
            filter: ["==", ["get", "category"], "convergent"],
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#c084fc",
              "line-width": 5,
              "line-opacity": 0.35,
              "line-blur": 2,
            },
          });
          m.addLayer({
            id: "plate-convergent-core",
            type: "line",
            source: "tectonic-plates",
            filter: ["==", ["get", "category"], "convergent"],
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#9333ea", // Vibrant Purple
              "line-width": 2.5,
              "line-opacity": 0.95,
            },
          });

          // 3. DIVERGENT / SPREADING RIDGES / RIFTS: Cyan/Blue double-rail track
          m.addLayer({
            id: "plate-divergent-glow",
            type: "line",
            source: "tectonic-plates",
            filter: ["==", ["get", "category"], "divergent"],
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#38bdf8",
              "line-width": 5,
              "line-opacity": 0.35,
              "line-blur": 2,
            },
          });
          m.addLayer({
            id: "plate-divergent-core",
            type: "line",
            source: "tectonic-plates",
            filter: ["==", ["get", "category"], "divergent"],
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#0284c7", // Deep Ocean Cyan
              "line-width": 2.2,
              "line-dasharray": [4, 1.5], // International double/dashed ridge symbol
              "line-opacity": 0.95,
            },
          });

          // 4. TRANSFORM FAULTS / STRIKE-SLIP: Amber/Gold dashed
          m.addLayer({
            id: "plate-transform-glow",
            type: "line",
            source: "tectonic-plates",
            filter: ["==", ["get", "category"], "transform"],
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#fcd34d",
              "line-width": 4,
              "line-opacity": 0.3,
              "line-blur": 2,
            },
          });
          m.addLayer({
            id: "plate-transform-core",
            type: "line",
            source: "tectonic-plates",
            filter: ["==", ["get", "category"], "transform"],
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#d97706", // Amber / Gold
              "line-width": 2,
              "line-dasharray": [2, 2], // International transform fault dashed symbol
              "line-opacity": 0.95,
            },
          });

          // Interactive Click on Plate Boundary
          const plateLayerIds = [
            "plate-subduction-core",
            "plate-convergent-core",
            "plate-divergent-core",
            "plate-transform-core",
          ];

          plateLayerIds.forEach((layerId) => {
            m.on("mouseenter", layerId, () => {
              m.getCanvas().style.cursor = "pointer";
            });
            m.on("mouseleave", layerId, () => {
              m.getCanvas().style.cursor = "";
            });
            m.on("click", layerId, (e) => {
              const feat = e.features?.[0];
              if (!feat) return;
              const props = feat.properties || {};
              const name = props.boundary || "Plate Boundary";
              const typeEn = props.typeLabelEn || props.category || "Tectonic Boundary";
              const typeKm = props.typeLabelKm || "ព្រំប្រទល់ផ្លាកតិចតូនិក";
              const cls = props.class || "";

              new maplibregl.Popup({ offset: 12, closeButton: true, maxWidth: "280px" })
                .setLngLat(e.lngLat)
                .setHTML(
                  `<div style="font-family: inherit; font-size: 12px; padding: 4px; color: #0f172a;">
                    <div style="font-weight: 800; font-size: 13px; color: #1e293b; margin-bottom: 2px;">
                      ${name} (${cls})
                    </div>
                    <div style="font-weight: 700; color: #0369a1; margin-bottom: 4px;">
                      ${typeEn}
                    </div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4;">
                      ${typeKm}
                    </div>
                  </div>`
                )
                .addTo(m);
            });
          });
        }
      } catch (err) {
        console.warn("Failed to load plate boundaries on init:", err);
      }

      setMapReady(true);
    });

    m.on("error", (e) => {
      console.warn("MapLibre tile notice:", e?.error?.message || e);
    });

    m.on("mousemove", (e) => {
      setCoords([e.lngLat.lng, e.lngLat.lat]);
    });

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current.clear();
      m.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Basemap Tiles
  const currentBasemapRef = useRef<BasemapType>(basemap);
  useEffect(() => {
    const m = mapRef.current;
    if (!m || !mapReady) return;
    if (currentBasemapRef.current === basemap && m.getSource("basemap")) return;

    try {
      if (m.getLayer("basemap-layer")) {
        m.removeLayer("basemap-layer");
      }
      if (m.getSource("basemap")) {
        m.removeSource("basemap");
      }

      m.addSource("basemap", {
        type: "raster",
        tiles: [BASEMAP_TILES[basemap].url],
        tileSize: 256,
        attribution: BASEMAP_TILES[basemap].attribution,
      });

      const layers = m.getStyle()?.layers || [];
      const firstNonBasemap = layers.find((l) => l.id !== "basemap-layer")?.id;

      m.addLayer(
        {
          id: "basemap-layer",
          type: "raster",
          source: "basemap",
        },
        firstNonBasemap
      );
      currentBasemapRef.current = basemap;
    } catch (err) {
      console.warn("Failed to switch basemap:", err);
    }
  }, [basemap, mapReady]);

  // Toggle Tectonic Plate Boundaries Visibility
  useEffect(() => {
    const m = mapRef.current;
    if (!m || !mapReady) return;

    try {
      const visibility = showPlates ? "visible" : "none";
      const allPlateLayers = [
        "plate-subduction-glow",
        "plate-subduction-core",
        "plate-subduction-teeth",
        "plate-convergent-glow",
        "plate-convergent-core",
        "plate-divergent-glow",
        "plate-divergent-core",
        "plate-transform-glow",
        "plate-transform-core",
      ];
      allPlateLayers.forEach((layerId) => {
        if (m.getLayer(layerId)) {
          m.setLayoutProperty(layerId, "visibility", visibility);
        }
      });
    } catch (err) {
      console.warn("Failed to toggle plate boundaries:", err);
    }
  }, [showPlates, mapReady]);

  // Render and update markers whenever events list or selectedEventId changes
  useEffect(() => {
    const m = mapRef.current;
    if (!m || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current.clear();

    events.forEach((event) => {
      const isSelected = event.id === selectedEventId;
      const el = document.createElement("div");
      el.className = "earthquake-map-marker";
      el.innerHTML = renderMarkerHtml(event, isSelected);
      el.style.zIndex = isSelected ? "100" : "1";

      const distanceText = formatDistanceToCambodia(
        event.distanceToCambodiaKm,
        event.latitude,
        event.longitude,
        kh
      );

      const regionBadge = event.isRegional
        ? `<span style="font-size: 10px; background: #ecfdf5; color: #047857; padding: 2px 6px; border-radius: 4px; font-weight: 700; border: 1px solid #a7f3d0;">🇰🇭 Regional</span>`
        : `<span style="font-size: 10px; background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; font-weight: 700; border: 1px solid #cbd5e1;">🌐 Global</span>`;

      const depthInfo = getDepthClassification(event.depthKm, kh);
      const depthLabel = kh ? depthInfo.labelKm : depthInfo.labelEn;
      const depthBadgeBg = depthInfo.category === "shallow" ? "#ecfdf5" : depthInfo.category === "intermediate" ? "#fffbeb" : depthInfo.category === "deep" ? "#faf5ff" : "#f1f5f9";
      const depthBadgeColor = depthInfo.category === "shallow" ? "#047857" : depthInfo.category === "intermediate" ? "#b45309" : depthInfo.category === "deep" ? "#7e22ce" : "#475569";
      const depthBadgeBorder = depthInfo.category === "shallow" ? "#a7f3d0" : depthInfo.category === "intermediate" ? "#fde68a" : depthInfo.category === "deep" ? "#e9d5ff" : "#cbd5e1";

      const popup = new maplibregl.Popup({
        offset: 18,
        closeButton: true,
        closeOnClick: false,
        className: "earthquake-info-popup",
      }).setHTML(`
        <div style="font-family: system-ui, sans-serif; padding: 6px 10px; font-size: 13px; line-height: 1.4; color: #1e293b; max-width: 280px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <strong style="font-size: 15px; color: #0f172a;">M ${event.magnitude !== null ? event.magnitude.toFixed(1) : "—"}</strong>
              <span style="font-size: 11px; font-weight: 700; color: #475569;">(${kh ? "រ៉ិចទ័រ" : "Richter"})</span>
              ${regionBadge}
            </div>
            <span style="font-size: 11px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${event.reports[0]?.provider || "USGS"}</span>
          </div>
          <div style="font-weight: 600; color: #0f172a; margin-bottom: 5px;">${translateEarthquakeLocation(event.location, lang)}</div>
          
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; font-size: 11px; color: #475569; margin-bottom: 4px; background: #f8fafc; padding: 4px 6px; border-radius: 4px; border: 1px solid #e2e8f0;">
            <span>${kh ? "ជម្រៅ:" : "Depth:"} <strong>${event.depthKm !== null ? `${event.depthKm.toFixed(1)} km` : "—"}</strong></span>
            <span style="font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 4px; background: ${depthBadgeBg}; color: ${depthBadgeColor}; border: 1px solid ${depthBadgeBorder};">
              ${depthLabel}
            </span>
          </div>

          ${
            distanceText
              ? `<div style="font-size: 11px; color: #2563eb; font-weight: 600; margin-bottom: 2px;">${distanceText}</div>`
              : ""
          }
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            Time: <strong>${formatLocalIctTime(event.originTime, lang, { includeDate: true })} ICT</strong>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 11px; border-top: 1px solid #f1f5f9; padding-top: 6px;">
            <a href="${buildFacebookShareUrl(event)}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: #1877f2; text-decoration: none; padding: 3px 8px; border-radius: 4px; background: #eff6ff; border: 1px solid #bfdbfe;" title="Share bulletin to Facebook with full details and hashtags">
              <svg style="width: 12px; height: 12px; fill: currentColor;" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span>${kh ? "ចែករំលែកលើហ្វេសប៊ុក" : "Share on Facebook"}</span>
            </a>
            ${
              event.url
                ? `<a href="${event.url}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 600; font-size: 11px;">Bulletin ↗</a>`
                : ""
            }
          </div>
        </div>
      `);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectEvent?.(event);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([event.longitude, event.latitude])
        .setPopup(popup)
        .addTo(m);

      if (isSelected) {
        marker.togglePopup();
      }

      markersRef.current.set(event.id, { marker, el });
    });
  }, [events, selectedEventId, mapReady, lang, onSelectEvent, kh]);

  // Center/Fly to selected event on map
  useEffect(() => {
    const m = mapRef.current;
    if (!m || !selectedEventId || !mapReady) return;

    const target = events.find((e) => e.id === selectedEventId);
    if (target) {
      m.flyTo({
        center: [target.longitude, target.latitude],
        zoom: Math.max(m.getZoom(), 7.0),
        speed: 1.1,
      });

      const markerData = markersRef.current.get(selectedEventId);
      if (markerData && !markerData.marker.getPopup().isOpen()) {
        markerData.marker.togglePopup();
      }
    }
  }, [selectedEventId, events, mapReady]);

  // Handle fly to Cambodia Center
  const handleFlyToCambodia = () => {
    if (onScopeChange) onScopeChange("cambodia");
    mapRef.current?.flyTo({
      center: [104.5, 13.0],
      zoom: 5.2,
      pitch: 0,
      bearing: 0,
      speed: 1.2,
    });
  };

  // Handle fly to Global View
  const handleFlyToGlobal = () => {
    if (onScopeChange) onScopeChange("global");
    mapRef.current?.flyTo({
      center: [104.5, 20.0],
      zoom: 2.0,
      pitch: 0,
      bearing: 0,
      speed: 1.2,
    });
  };

  return (
    <div
      data-no-translate="true"
      data-cms-inline="true"
      className={`relative flex flex-col rounded-2xl overflow-hidden border border-border bg-slate-950 shadow-md ${className}`}
    >
      {/* Top Map Control Bar */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/90 px-4 py-2.5 text-xs text-white backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          {/* Basemap Selector */}
          <label className="flex items-center gap-1.5 font-semibold text-slate-300 mr-1">
            <Layers size={14} className="text-primary" />
            <span>{kh ? "ផែនទីគោល:" : "Basemap:"}</span>
            <select
              aria-label="Basemap"
              value={basemap}
              onChange={(e) => setBasemap(e.target.value as BasemapType)}
              className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-white border border-slate-700 focus:outline-none"
            >
              <option value="topo">{kh ? "ផែនទីភូមិសាស្ត្រ" : "Topographic Map"}</option>
              <option value="satellite">{kh ? "រូបភាពផ្កាយរណប" : "Satellite Imagery"}</option>
              <option value="terrain">{kh ? "ទម្រង់ដី" : "Terrain Relief"}</option>
            </select>
          </label>

          {/* Plate Boundary Layer Toggle */}
          <button
            type="button"
            onClick={() => setShowPlates((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border transition ${
              showPlates
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
            }`}
            title="Toggle Tectonic Plate Boundaries (បន្ទាត់ព្រំប្រទល់ផ្លាកតិចតូនិក)"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                showPlates ? "bg-amber-400 animate-pulse" : "bg-slate-500"
              }`}
            />
            <span>{kh ? "ព្រំប្រទល់ផ្លាកតិចតូនិក" : "Plate Boundaries"}</span>
          </button>

          {/* Quick Scope Views */}
          <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={handleFlyToCambodia}
              className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
                scope === "cambodia"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
              title="Reset view to Cambodia & Region"
            >
              {kh ? "🇰🇭 កម្ពុជា និងតំបន់ (លំនាំដើម)" : "🇰🇭 Cambodia & Region (Default)"}
            </button>
            <button
              type="button"
              onClick={handleFlyToGlobal}
              className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
                scope === "global"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
              title="Zoom out to worldwide view"
            >
              {kh ? "🌐 ទូទាំងពិភពលោក" : "🌐 Global / Worldwide"}
            </button>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          {kh
            ? `បង្ហាញចំណុចរញ្ជួយដីចំនួន ${events.length}`
            : `Showing ${events.length} epicenters on map`}
        </span>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainer} className="h-full w-full min-h-[500px]" />

      {/* Map Legend (Magnitude & Marker Sizes) */}
      <div className="absolute bottom-10 left-3 z-10 rounded-xl border border-slate-800/90 bg-slate-950/85 p-3 text-[11px] text-white shadow-lg backdrop-blur-md max-w-[220px]">
        <strong className="block font-bold text-slate-300 mb-2 uppercase tracking-wider text-[10px]">
          {kh ? "កំណត់សម្គាល់ទំហំរំញ័រ" : "Magnitude Legend"}
        </strong>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-rose-600 border border-white flex items-center justify-center text-[8px] font-extrabold" />
            <span>{kh ? "M 5.5+ ខ្លាំង" : "M 5.5+ Significant"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-amber-500 border border-white flex items-center justify-center text-[8px] font-extrabold" />
            <span>{kh ? "M 4.5 – 5.4 មធ្យម" : "M 4.5 – 5.4 Moderate"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-500 border border-white flex items-center justify-center text-[7px] font-extrabold" />
            <span>{kh ? "M 3.0 – 4.4 ខ្សោយ" : "M 3.0 – 4.4 Minor"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 border border-white" />
            <span>{kh ? "< M 3.0 តូចបំផុត" : "< M 3.0 Micro"}</span>
          </div>
          {showPlates && (
            <div className="pt-2 mt-2 border-t border-slate-800 space-y-1.5">
              <strong className="block font-bold text-slate-300 uppercase tracking-wider text-[9px]">
                {kh ? "និមិត្តសញ្ញាផ្លាកតិចតូនិក (អន្តរជាតិ)" : "Tectonic Boundaries (Intl.)"}
              </strong>
              {/* Subduction Zone */}
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-4 rounded-full bg-red-600 shadow-[0_0_6px_rgba(239,68,68,0.8)] border-b border-white" />
                <span className="text-[10px] text-red-300 font-medium">
                  {kh ? "តំបន់ទ្រុឌខ្លួន (Subduction / Trench)" : "Subduction Zone (Trench)"}
                </span>
              </div>
              {/* Convergent / Collision */}
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-4 rounded-full bg-purple-600 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                <span className="text-[10px] text-purple-300 font-medium">
                  {kh ? "បុកទង្គិច (Convergent / Collision)" : "Convergent / Collision"}
                </span>
              </div>
              {/* Divergent / Spreading Ridge */}
              <div className="flex items-center gap-2">
                <span className="h-1 w-4 rounded-sm bg-sky-500 border-dashed border-t border-white" />
                <span className="text-[10px] text-sky-300 font-medium">
                  {kh ? "រំកិលចេញ (Divergent / Ridge / Rift)" : "Divergent / Spreading Ridge"}
                </span>
              </div>
              {/* Transform Fault */}
              <div className="flex items-center gap-2">
                <span className="h-1 w-4 rounded-sm border-t-2 border-dashed border-amber-400" />
                <span className="text-[10px] text-amber-300 font-medium">
                  {kh ? "កំហុសប្លាស់ទីផ្តេក (Transform Fault)" : "Transform Fault (Strike-Slip)"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Coordinates & Navigation Telemetry */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-950/90 px-4 py-2 font-mono text-xs text-slate-400 backdrop-blur-md">
        <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
          <Navigation size={13} />
          {coords
            ? `LAT ${coords[1].toFixed(4)}° · LON ${coords[0].toFixed(4)}°`
            : (kh ? "រំកិល ឬស្វែងរកទីតាំងទូទាំងពិភពលោក · លំនាំដើម៖ កម្ពុជា និងតំបន់" : "Pan or search anywhere globally · Default: Cambodia & Region")}
        </span>
        <span className="text-slate-400 text-[11px]">
          {kh ? "ទិន្នន័យ៖ បណ្តាញទូទាំងពិភពលោក USGS / TMD" : "Data: USGS Global Feed / TMD Feeds"}
        </span>
      </div>
    </div>
  );
}
