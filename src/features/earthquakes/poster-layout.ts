/** Keep Khmer combining characters together when wrapping canvas text. */
export function wrapPosterText(text: string, maxWidth: number, measure: (value: string) => number): string[] {
  const segments = new Intl.Segmenter("km", { granularity: "grapheme" }).segment(text);
  const lines: string[] = [];
  let line = "";
  for (const { segment } of segments) {
    if (segment === "\n") { lines.push(line.trim()); line = ""; continue; }
    if (line && measure(line + segment) > maxWidth) {
      const space = line.lastIndexOf(" ");
      if (space > line.length / 2) { lines.push(line.slice(0, space).trim()); line = line.slice(space + 1) + segment; }
      else { lines.push(line.trim()); line = segment; }
    } else line += segment;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

/** Same Esri World Topo basemap as the monitoring page; square Mercator pixels. */
export function posterMapUrl(latitude: number, longitude: number): string {
  const radius = 6378137;
  const lat = Math.max(-85, Math.min(85, latitude)) * Math.PI / 180;
  const x = radius * longitude * Math.PI / 180;
  const y = radius * Math.log(Math.tan(Math.PI / 4 + lat / 2));
  const resolution = 156543.033928 / 2 ** 6;
  const params = new URLSearchParams({
    bbox: [x - 225 * resolution, y - 210 * resolution, x + 225 * resolution, y + 210 * resolution].join(","),
    bboxSR: "3857", imageSR: "3857", size: "450,420", format: "png32", transparent: "false", f: "image",
  });
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/export?${params}`;
}
