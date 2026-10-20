import L from "leaflet";
import {
  bounded,
  defaultStyle,
  safeColor,
  type MapDataset,
} from "./import-geodata";
export function renderDataset(dataset: MapDataset) {
  const settings = { ...defaultStyle, ...dataset.settings };
  return L.geoJSON(dataset.data, {
    style: (feature) => {
      const p = feature?.properties || {};
      const color = safeColor(settings.color);
      return {
        color: settings.original ? safeColor(p.stroke, color) : color,
        weight: bounded(
          settings.original ? p["stroke-width"] : settings.width,
          3,
          1,
          20,
        ),
        opacity: settings.original ? bounded(p["stroke-opacity"], 1, 0, 1) : 1,
        fillColor: settings.original
          ? safeColor(p["fill-color"] || p.fill, color)
          : color,
        fillOpacity: bounded(
          settings.original ? p["fill-opacity"] : settings.opacity,
          0.5,
          0,
          1,
        ),
      };
    },
    pointToLayer: (feature, position) => {
      const p = feature.properties || {};
      const size = bounded(
        settings.original
          ? 32 * bounded(p["icon-scale"], 1, 0.1, 4)
          : settings.size,
        24,
        4,
        128,
      );
      if (
        settings.original &&
        typeof p.icon === "string" &&
        /^(https:\/\/|data:image\/(png|jpeg|gif|webp);base64,)/i.test(p.icon)
      ) {
        return L.marker(position, {
          icon: L.icon({
            iconUrl: p.icon,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          }),
          opacity: bounded(p["icon-opacity"], 1, 0, 1),
        });
      }
      const symbol = settings.original ? "circle" : settings.symbol;
      const element = document.createElement("span");
      element.style.display = "block";
      element.style.width = size + "px";
      element.style.height = size + "px";
      element.style.backgroundColor = settings.original
        ? safeColor(p["icon-color"], safeColor(settings.color))
        : safeColor(settings.color);
      element.style.border = "1px solid white";
      element.style.boxSizing = "border-box";
      if (symbol === "circle") element.style.borderRadius = "50%";
      if (symbol === "triangle")
        element.style.clipPath = "polygon(50% 0,100% 100%,0 100%)";
      if (symbol === "star")
        element.style.clipPath =
          "polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 94%,50% 72%,21% 94%,32% 57%,2% 35%,39% 35%)";
      return L.marker(position, {
        icon: L.divIcon({
          html: element,
          className: "geocam-map-symbol",
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        }),
        opacity: settings.original ? bounded(p["icon-opacity"], 1, 0, 1) : 1,
      });
    },
    onEachFeature: (feature, layer) => {
      const content = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = String(
        feature.properties?.name || dataset.name,
      ).slice(0, 300);
      content.appendChild(title);
      if (feature.properties?.description) {
        const body = document.createElement("p");
        body.textContent = String(feature.properties.description).slice(
          0,
          2000,
        );
        content.appendChild(body);
      }
      layer.bindPopup(content);
    },
  });
}
