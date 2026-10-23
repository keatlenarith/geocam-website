import React from "react";

interface EarthquakeMiniMapProps {
  latitude: number;
  longitude: number;
  magnitude: number | null;
  location?: string;
  depthKm?: number | null;
  isRegional?: boolean;
  className?: string;
  zoom?: number;
  width?: number;
  height?: number;
  onClick?: () => void;
}

export const EarthquakeMiniMap: React.FC<EarthquakeMiniMapProps> = ({
  latitude,
  longitude,
  magnitude,
  location,
  depthKm,
  isRegional,
  className = "",
  zoom = 5,
  width = 240,
  height = 150,
  onClick,
}) => {
  // Compute Mercator Tile coordinates at target zoom
  const n = Math.pow(2, zoom);
  const centerX = ((longitude + 180) / 360) * n * 256;
  const latRad = (Math.max(-85.0511, Math.min(85.0511, latitude)) * Math.PI) / 180;
  const safeTan = Math.tan(latRad);
  const safeCos = Math.cos(latRad);
  const centerY =
    ((1 - Math.log(Math.abs(safeTan + 1 / safeCos)) / Math.PI) / 2) * n * 256;

  // Determine bounding tiles around the center
  const minTileX = Math.floor((centerX - width / 2) / 256);
  const maxTileX = Math.floor((centerX + width / 2) / 256);
  const minTileY = Math.floor((centerY - height / 2) / 256);
  const maxTileY = Math.floor((centerY + height / 2) / 256);

  const tiles: Array<{ key: string; url: string; left: number; top: number }> = [];
  for (let ty = minTileY; ty <= maxTileY; ty++) {
    for (let tx = minTileX; tx <= maxTileX; tx++) {
      const wrappedTx = ((tx % n) + n) % n;
      if (ty >= 0 && ty < n) {
        const left = tx * 256 - centerX + width / 2;
        const top = ty * 256 - centerY + height / 2;
        const url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${zoom}/${ty}/${wrappedTx}`;
        tiles.push({ key: `${zoom}-${ty}-${tx}`, url, left, top });
      }
    }
  }

  // Magnitude-based color coding
  const magVal = magnitude ?? 0;
  const pinColor =
    magVal >= 6.0
      ? "#dc2626" // crimson red
      : magVal >= 5.0
      ? "#ea580c" // dark orange
      : magVal >= 4.0
      ? "#d97706" // amber/gold
      : magVal >= 3.0
      ? "#0284c7" // cyan/sky blue
      : "#475569"; // slate

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950 shadow-md transition-all duration-200 select-none ${
        onClick ? "cursor-pointer hover:border-primary/80 hover:shadow-lg" : ""
      } ${className}`}
      style={{ width: "100%", maxWidth: `${width}px`, height: `${height}px` }}
      title={
        location
          ? `Epicenter: ${location} (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°) · Click to inspect`
          : "Epicenter mini-map"
      }
    >
      {/* Background Raster Topographic Tiles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {tiles.map((t) => (
          <img
            key={t.key}
            src={t.url}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute max-w-none transition-opacity duration-300"
            style={{
              left: `${t.left}px`,
              top: `${t.top}px`,
              width: "256px",
              height: "256px",
            }}
            onError={(e) => {
              // Graceful fallback to dark slate tile if offline or blocked
              e.currentTarget.style.display = "none";
            }}
          />
        ))}
      </div>

      {/* Subtle Grid Reticle & Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(15,23,42,0.4)_100%)]" />
      <div className="pointer-events-none absolute inset-0 border border-black/15 rounded-xl" />

      {/* Crosshairs Centered on Epicenter */}
      <div className="pointer-events-none absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2" />
      <div className="pointer-events-none absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-1/2" />

      {/* Dead-Center Epicenter Pin with Animated Ripple */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10"
      >
        {/* Pulsing ring */}
        <span
          className="absolute h-9 w-9 rounded-full animate-ping opacity-75"
          style={{ backgroundColor: pinColor }}
        />
        {/* Concentric glow ring */}
        <span
          className="absolute h-6 w-6 rounded-full opacity-60 shadow-lg"
          style={{ backgroundColor: pinColor }}
        />
        {/* Crisp solid center target beacon */}
        <span
          className="relative h-3.5 w-3.5 rounded-full border-2 border-white shadow-md flex items-center justify-center"
          style={{ backgroundColor: pinColor }}
        >
          <span className="h-1 w-1 rounded-full bg-white" />
        </span>
      </div>

      {/* Top Left: Regional or Global Badge */}
      <div className="absolute top-1.5 left-1.5 z-20">
        <span
          className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
            isRegional
              ? "bg-emerald-950/90 text-emerald-300 border border-emerald-500/30"
              : "bg-slate-900/90 text-sky-300 border border-sky-500/30"
          }`}
        >
          {isRegional ? "🇰🇭 Regional" : "🌐 Global"}
        </span>
      </div>

      {/* Top Right: Magnitude HUD */}
      <div className="absolute top-1.5 right-1.5 z-20">
        <span
          className="inline-flex items-center gap-1 rounded bg-slate-950/90 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-bold text-white border border-white/20 shadow-xs"
          style={{ borderLeftColor: pinColor, borderLeftWidth: "3px" }}
        >
          M {magnitude !== null && magnitude !== undefined ? magnitude.toFixed(1) : "—"}
        </span>
      </div>

      {/* Bottom Coordinates & Depth HUD */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 z-20 flex items-center justify-between text-[9px] font-mono text-white/95">
        <span className="rounded bg-slate-950/85 backdrop-blur-md px-1.5 py-0.5 border border-white/10 shadow-xs">
          {latitude >= 0 ? `${latitude.toFixed(2)}°N` : `${Math.abs(latitude).toFixed(2)}°S`},{" "}
          {longitude >= 0 ? `${longitude.toFixed(2)}°E` : `${Math.abs(longitude).toFixed(2)}°W`}
        </span>

        {depthKm !== null && depthKm !== undefined && (
          <span className="rounded bg-slate-950/85 backdrop-blur-md px-1.5 py-0.5 border border-white/10 shadow-xs">
            {depthKm.toFixed(0)} km depth
          </span>
        )}
      </div>

      {/* Hover click hint banner */}
      {onClick && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
          <span className="rounded-full bg-slate-950/90 px-2 py-0.5 text-[10px] font-semibold text-white shadow-md border border-white/20">
            Click to focus map ↗
          </span>
        </div>
      )}
    </div>
  );
};
