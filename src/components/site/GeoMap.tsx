import type { MapDataset } from "../../features/geodata/import-geodata";
import { renderDataset } from "../../features/geodata/render-layer";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type BaseMapKey = "dem" | "topo" | "hillshade" | "satellite";

export type LayerKey = "geology" | "minerals" | "structures";

// ILLUSTRATIVE ONLY — hand-drawn generalized shapes for demonstration. Not survey data.
const geology: { name: string; color: string; coords: [number, number][] }[] = [
  {
    name: "Illustrative: Mesozoic sandstone uplands",
    color: "#c98a5a",
    coords: [
      [12.9, 102.6],
      [12.4, 103.9],
      [11.2, 104.0],
      [10.9, 103.2],
      [11.6, 102.6],
    ],
  },
  {
    name: "Illustrative: Quaternary alluvium (Mekong–Tonle Sap)",
    color: "#d9c58f",
    coords: [
      [13.3, 103.6],
      [12.6, 104.6],
      [11.4, 105.3],
      [10.6, 105.0],
      [11.3, 104.4],
      [12.6, 103.6],
    ],
  },
  {
    name: "Illustrative: Cenozoic basalt plateau",
    color: "#6b7f5a",
    coords: [
      [14.1, 106.6],
      [13.9, 107.4],
      [12.6, 107.5],
      [12.4, 106.8],
    ],
  },
];
const minerals: { name: string; at: [number, number] }[] = [
  { name: "Illustrative occurrence A", at: [13.8, 107.0] },
  { name: "Illustrative occurrence B", at: [12.2, 106.4] },
  { name: "Illustrative occurrence C", at: [11.6, 103.5] },
  { name: "Illustrative occurrence D", at: [14.2, 104.8] },
];
const structures: { name: string; coords: [number, number][] }[] = [
  {
    name: "Illustrative lineament 1",
    coords: [
      [14.3, 103.0],
      [12.0, 105.6],
    ],
  },
  {
    name: "Illustrative lineament 2",
    coords: [
      [13.6, 105.9],
      [11.4, 107.0],
    ],
  },
];

const BASEMAPS: Record<
  BaseMapKey,
  { url: string; attribution: string; maxNativeZoom: number }
> = {
  // Terrain imagery is a visual representation of relief, not a numeric DEM download.
  dem: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles © Esri — World Terrain Base",
    maxNativeZoom: 13,
  },
  topo: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles © Esri — World Topographic Map",
    maxNativeZoom: 19,
  },
  hillshade: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles © Esri — World Hillshade",
    maxNativeZoom: 16,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles © Esri — World Imagery",
    maxNativeZoom: 19,
  },
};

export default function GeoMap({
  datasets,
  active,
  baseMap,
  onPick,
}: {
  datasets: MapDataset[];
  active: Record<LayerKey, boolean>;
  baseMap: BaseMapKey;
  onPick: (lat: number, lon: number) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const groups = useRef<Record<LayerKey, L.LayerGroup> | null>(null);
  const baseLayer = useRef<L.TileLayer | null>(null);
  const pick = useRef(onPick);
  pick.current = onPick;

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, {
      center: [12.6, 104.9],
      zoom: 7,
      crs: L.CRS.EPSG3857,
    });
    const cfg = BASEMAPS[baseMap];
    baseLayer.current = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxNativeZoom: cfg.maxNativeZoom,
      maxZoom: 19,
    }).addTo(m);
    const g = {
      geology: L.layerGroup(
        geology.map((p) =>
          L.polygon(p.coords, {
            color: p.color,
            fillOpacity: 0.45,
            weight: 1,
          }).bindPopup(p.name),
        ),
      ),
      minerals: L.layerGroup(
        minerals.map((p) =>
          L.circleMarker(p.at, {
            radius: 7,
            color: "#7a3b1d",
            fillColor: "#e07a4a",
            fillOpacity: 0.9,
          }).bindPopup(p.name),
        ),
      ),
      structures: L.layerGroup(
        structures.map((s) =>
          L.polyline(s.coords, {
            color: "#1f3d2b",
            weight: 3,
            dashArray: "8 6",
          }).bindPopup(s.name),
        ),
      ),
    };
    groups.current = g;
    m.on("click", (e) => pick.current(e.latlng.lat, e.latlng.lng));
    map.current = m;
    return () => {
      m.remove();
      map.current = null;
      baseLayer.current = null;
    };
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const cfg = BASEMAPS[baseMap];
    const next = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxNativeZoom: cfg.maxNativeZoom,
      maxZoom: 19,
    });
    next.addTo(m);
    if (baseLayer.current) m.removeLayer(baseLayer.current);
    next.bringToBack();
    baseLayer.current = next;
  }, [baseMap]);

  useEffect(() => {
    const m = map.current,
      g = groups.current;
    if (!m || !g) return;
    (Object.keys(g) as LayerKey[]).forEach((k) =>
      active[k] ? g[k].addTo(m) : g[k].remove(),
    );
  }, [active]);

  const fitted = useRef(new Set<string>());
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const rendered = datasets.map((dataset) => renderDataset(dataset).addTo(m));
    const added = datasets.filter((dataset) => !fitted.current.has(dataset.id));
    if (added.length) {
      const bounds = L.latLngBounds([]);
      datasets.forEach((dataset, index) => {
        if (!fitted.current.has(dataset.id)) {
          const b = rendered[index].getBounds();
          if (b.isValid()) bounds.extend(b);
          fitted.current.add(dataset.id);
        }
      });
      if (bounds.isValid())
        m.fitBounds(bounds, { padding: [20, 20], maxZoom: 14 });
    }
    return () => {
      rendered.forEach((layer) => layer.remove());
    };
  }, [datasets]);

  return (
    <div
      ref={el}
      className="h-[520px] w-full rounded-xl border border-border"
      role="application"
      aria-label="Interactive map of Cambodia and uploaded geodata"
    />
  );
}
