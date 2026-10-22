import L from "leaflet";
import {
  bounded,
  defaultStyle,
  safeColor,
  safeLineStyle,
  safeSymbol,
  type MapDataset,
} from "./import-geodata";
export function renderDataset(dataset: MapDataset) {
  const settings = { ...defaultStyle, ...dataset.settings };
  return L.geoJSON(dataset.data, {
    style: (feature) => {
      const p = feature?.properties || {};
      const color = safeColor(settings.color);
      const fillColor = safeColor(settings.fillColor, color);
      const lineStyle = safeLineStyle(settings.lineStyle, "solid");
      let dashArray: string | undefined;
      if (!settings.original) {
        if (lineStyle === "dashed") dashArray = "6, 6";
        else if (lineStyle === "dotted") dashArray = "2, 5";
        else if (lineStyle === "dash-dot") dashArray = "8, 4, 2, 4";
      }
      return {
        color: settings.original ? safeColor(p.stroke, color) : color,
        weight: bounded(
          settings.original ? p["stroke-width"] : settings.width,
          3,
          1,
          20,
        ),
        opacity: settings.original ? bounded(p["stroke-opacity"], 1, 0, 1) : 1,
        dashArray,
        fillColor: settings.original
          ? safeColor(p["fill-color"] || p.fill, fillColor)
          : fillColor,
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
      const symbol = settings.original ? "circle" : safeSymbol(settings.symbol);
      const element = document.createElement("span");
      element.style.display = "block";
      element.style.width = size + "px";
      element.style.height = size + "px";
      element.style.backgroundColor = settings.original
        ? safeColor(p["icon-color"], safeColor(settings.color))
        : safeColor(settings.color);
      element.style.border = "1px solid white";
      element.style.boxSizing = "border-box";
      if (symbol === "circle") {
        element.style.borderRadius = "50%";
      } else if (symbol === "triangle") {
        element.style.clipPath = "polygon(50% 0,100% 100%,0 100%)";
      } else if (symbol === "star") {
        element.style.clipPath =
          "polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 94%,50% 72%,21% 94%,32% 57%,2% 35%,39% 35%)";
      } else if (symbol === "diamond") {
        element.style.clipPath = "polygon(50% 0,100% 50%,50% 100%,0 50%)";
      } else if (symbol === "hexagon") {
        element.style.clipPath =
          "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)";
      } else if (symbol === "cross") {
        element.style.clipPath =
          "polygon(35% 0,65% 0,65% 35%,100% 35%,100% 65%,65% 65%,65% 100%,35% 100%,35% 65%,0 65%,0 35%,35% 35%)";
      } else if (symbol === "pin") {
        element.style.borderRadius = "50% 50% 50% 0";
        element.style.transform = "rotate(-45deg)";
        element.style.position = "relative";
        const dot = document.createElement("span");
        dot.style.position = "absolute";
        dot.style.top = "50%";
        dot.style.left = "50%";
        dot.style.transform = "translate(-50%, -50%)";
        dot.style.width = Math.max(3, Math.round(size * 0.35)) + "px";
        dot.style.height = Math.max(3, Math.round(size * 0.35)) + "px";
        dot.style.borderRadius = "50%";
        dot.style.backgroundColor = "#ffffff";
        element.appendChild(dot);
      } else if (symbol === "drillhole") {
        element.style.borderRadius = "50%";
        element.style.position = "relative";
        const dot = document.createElement("span");
        dot.style.position = "absolute";
        dot.style.top = "50%";
        dot.style.left = "50%";
        dot.style.transform = "translate(-50%, -50%)";
        dot.style.width = Math.max(4, Math.round(size * 0.38)) + "px";
        dot.style.height = Math.max(4, Math.round(size * 0.38)) + "px";
        dot.style.borderRadius = "50%";
        dot.style.backgroundColor = "#ffffff";
        element.appendChild(dot);
      } else if (
        symbol === "mine" ||
        symbol === "quarry" ||
        symbol === "strike-dip"
      ) {
        element.style.borderRadius = "4px";
        element.style.position = "relative";
        const iconSpan = document.createElement("span");
        iconSpan.style.position = "absolute";
        iconSpan.style.inset = "0";
        iconSpan.style.display = "flex";
        iconSpan.style.alignItems = "center";
        iconSpan.style.justifyContent = "center";
        const iconSize = Math.max(10, Math.round(size * 0.75));
        if (symbol === "mine") {
          iconSpan.innerHTML = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4l6 6"/><path d="M17 1l6 6"/><path d="M3 21l9-9"/><path d="M2 13l9 9"/></svg>`;
        } else if (symbol === "quarry") {
          iconSpan.innerHTML = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="3,3"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>`;
        } else {
          iconSpan.innerHTML = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="12" x2="12" y2="21"/></svg>`;
        }
        element.appendChild(iconSpan);
      }
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
