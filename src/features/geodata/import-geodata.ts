import type { DatasetCategory } from "./categories";
import JSZip from "jszip";
import { kml } from "@tmcw/togeojson";
import type { FeatureCollection, Geometry } from "geojson";
export const MAX_UPLOAD = 20 * 1024 * 1024;
export type MapStyle = {
  original: boolean;
  symbol: "circle" | "square" | "triangle" | "star";
  size: number;
  color: string;
  width: number;
  opacity: number;
};
export const defaultStyle: MapStyle = {
  original: true,
  symbol: "circle",
  size: 24,
  color: "#2563eb",
  width: 3,
  opacity: 0.5,
};
export type MapDataset = {
  category?: DatasetCategory;
  id: string;
  name: string;
  filename: string;
  source_path: string;
  data: FeatureCollection;
  settings: MapStyle;
  status: "draft" | "published";
};
export function safeColor(value: unknown, fallback = "#2563eb") {
  return typeof value === "string" && /^#[\da-f]{6}$/i.test(value)
    ? value
    : fallback;
}
export function bounded(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback;
}

// Inspect the ZIP directory before decompression; reject ZIP64 and oversized archives.
function checkZip(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  let end = -1;
  for (
    let i = buffer.byteLength - 22;
    i >= Math.max(0, buffer.byteLength - 65557);
    i--
  )
    if (view.getUint32(i, true) === 0x06054b50) {
      end = i;
      break;
    }
  if (end < 0) throw Error("Invalid KMZ archive.");
  const count = view.getUint16(end + 10, true);
  let pos = view.getUint32(end + 16, true),
    total = 0;
  if (count === 65535 || count > 1000 || pos === 0xffffffff)
    throw Error("KMZ has too many files or uses ZIP64.");
  for (let i = 0; i < count; i++) {
    if (
      pos + 46 > buffer.byteLength ||
      view.getUint32(pos, true) !== 0x02014b50
    )
      throw Error("Invalid KMZ directory.");
    const size = view.getUint32(pos + 24, true);
    total += size;
    if (size === 0xffffffff || total > 50 * 1024 * 1024)
      throw Error("KMZ expands beyond the 50 MB limit.");
    pos +=
      46 +
      view.getUint16(pos + 28, true) +
      view.getUint16(pos + 30, true) +
      view.getUint16(pos + 32, true);
  }
}
function validateGeometry(geometry: Geometry) {
  if (geometry.type === "GeometryCollection") {
    geometry.geometries.forEach(validateGeometry);
    return;
  }
  if (
    ![
      "Point",
      "MultiPoint",
      "LineString",
      "MultiLineString",
      "Polygon",
      "MultiPolygon",
    ].includes(geometry.type)
  )
    throw Error("Unsupported geometry type.");
  let count = 0;
  const coordinates = (value: unknown): void => {
    if (!Array.isArray(value) || !value.length)
      throw Error("Empty or invalid geometry.");
    if (typeof value[0] === "number") {
      if (
        value.length < 2 ||
        !value.every((n) => typeof n === "number" && Number.isFinite(n)) ||
        Math.abs(value[0]) > 180 ||
        Math.abs(value[1]) > 90
      )
        throw Error(
          "Coordinates must be WGS84 longitude/latitude, not UTM metres.",
        );
      if (++count > 500000) throw Error("A feature has too many coordinates.");
    } else value.forEach(coordinates);
  };
  coordinates(geometry.coordinates);
}
export async function importGeodata(
  file: File,
): Promise<{ data: FeatureCollection; warnings: string[] }> {
  if (file.size > MAX_UPLOAD) throw Error("Maximum upload size is 20 MB.");
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!["kmz", "kml", "geojson", "json"].includes(extension || ""))
    throw Error("Use .kmz, .kml or .geojson.");
  const warnings: string[] = [];
  let data: FeatureCollection;
  let zip: JSZip | undefined;
  let kmlPath = "";
  if (extension === "kmz" || extension === "kml") {
    let xml: string;
    if (extension === "kmz") {
      const buffer = await file.arrayBuffer();
      checkZip(buffer);
      zip = await JSZip.loadAsync(buffer);
      const entries = Object.keys(zip.files).filter(
        (path) => /\.kml$/i.test(path) && !zip!.files[path].dir,
      );
      const root = entries.find((path) => path.toLowerCase() === "doc.kml");
      if (!root && entries.length !== 1)
        throw Error(
          "KMZ needs one main KML document, preferably doc.kml at the archive root.",
        );
      kmlPath = root || entries[0];
      xml = await zip.file(kmlPath)!.async("string");
    } else xml = await file.text();
    if (/<!DOCTYPE|<!ENTITY/i.test(xml))
      throw Error("KML with DTD or entity declarations is not supported.");
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    if (
      doc.getElementsByTagName("parsererror").length ||
      doc.documentElement.localName !== "kml"
    )
      throw Error("Invalid KML document.");
    if (doc.getElementsByTagName("NetworkLink").length)
      warnings.push(
        "Network links are not fetched. Export linked features into the KMZ first.",
      );
    if (
      doc.getElementsByTagName("GroundOverlay").length ||
      doc.getElementsByTagName("Model").length
    )
      warnings.push(
        "Raster overlays and 3D models are not imported; only vector features are displayed.",
      );
    data = kml(doc) as FeatureCollection;
  } else {
    const input = JSON.parse(await file.text());
    if (input.crs)
      throw Error(
        "Export GeoJSON in WGS84 longitude/latitude without a custom CRS.",
      );
    data =
      input.type === "Feature"
        ? { type: "FeatureCollection", features: [input] }
        : input;
  }
  if (data.type !== "FeatureCollection" || !Array.isArray(data.features))
    throw Error("Use a GeoJSON FeatureCollection or Feature.");
  data.features = data.features.filter(
    (feature) =>
      feature.geometry &&
      feature.properties?.["@geometry-type"] !== "groundoverlay",
  );
  if (!data.features.length) throw Error("No supported vector features found.");
  if (data.features.length > 20000)
    throw Error("Limit each layer to 20,000 features. Split larger datasets.");
  const icons = new Map<string, string>();
  let serializedBytes = 0;
  for (const feature of data.features) {
    if (feature.type !== "Feature" || !feature.geometry)
      throw Error("Invalid feature.");
    validateGeometry(feature.geometry);
    const p = feature.properties || {};
    const output: Record<string, unknown> = {};
    for (const key of [
      "name",
      "description",
      "stroke",
      "stroke-width",
      "stroke-opacity",
      "fill",
      "fill-color",
      "fill-opacity",
      "icon-color",
      "icon-opacity",
      "icon-scale",
    ])
      if (typeof p[key] === "string" || typeof p[key] === "number")
        output[key] = p[key];
    if (typeof p.icon === "string") {
      const href = p.icon;
      if (icons.has(href)) output.icon = icons.get(href);
      else if (zip && !/^[a-z]+:/i.test(href)) {
        const normalized = new URL(
          href,
          "https://kmz.invalid/" + kmlPath,
        ).pathname.slice(1);
        const asset = zip.file(decodeURIComponent(normalized));
        const ext = normalized.split(".").pop()?.toLowerCase();
        const mime = (
          {
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            webp: "image/webp",
          } as Record<string, string>
        )[ext || ""];
        if (asset && mime) {
          const bytes = await asset.async("uint8array");
          if (bytes.byteLength <= 256000) {
            const value = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = () => reject(Error("Unable to read icon."));
              reader.readAsDataURL(
                new Blob([bytes as BlobPart], { type: mime }),
              );
            });
            icons.set(href, value);
            output.icon = value;
          } else
            warnings.push(
              "An icon over 250 KB was replaced with a default symbol.",
            );
        } else
          warnings.push(
            "An icon was missing or unsupported and was replaced with a default symbol.",
          );
      } else if (/^https:\/\//i.test(href)) {
        output.icon = href;
      }
    }
    feature.properties = output;
    serializedBytes += new Blob([JSON.stringify(feature)]).size;
    if (serializedBytes > 8 * 1024 * 1024)
      throw Error(
        "Parsed layer exceeds 8 MB. Simplify geometry or split the dataset.",
      );
  }
  if (new Blob([JSON.stringify(data)]).size > 8 * 1024 * 1024)
    throw Error(
      "Parsed layer exceeds 8 MB. Simplify geometry or split the dataset.",
    );
  return { data, warnings: [...new Set(warnings)] };
}
