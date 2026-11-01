import React, { useRef, useState, useEffect } from "react";
import { wrapPosterText, posterMapUrl } from "./poster-layout";
import { useAdmin } from "@/admin/Auth";
import {
  type EarthquakeEvent,
  formatLocalIctTime,
  translateEarthquakeLocation,
  getDepthClassification,
  formatDistanceToCambodia,
} from "./earthquake-data";
import { useI18n } from "@/lib/i18n";
import {
  Download,
  Copy,
  Check,
  Share2,
  X,
  ExternalLink,
  MapPin,
  Compass,
  AlertTriangle,
  Radio,
  Clock,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  generateEarthquakeFacebookStatus,
  getFacebookSettings,
} from "@/lib/facebook-service";

interface EarthquakePosterModalProps {
  event: EarthquakeEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EarthquakePosterModal: React.FC<EarthquakePosterModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  // Mount the generator only while open. The mounted child always executes the
  // same hooks, including when a card initially renders with its modal closed.
  if (!isOpen || !event) return null;
  return <EarthquakePosterContent key={event.id} event={event} onClose={onClose} />;
};

const EarthquakePosterContent: React.FC<{
  event: EarthquakeEvent;
  onClose: () => void;
}> = ({ event, onClose }) => {
  const { lang } = useI18n();
  const kh = lang === "km";
  const { admin } = useAdmin();
  const posterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [posterDataUrl, setPosterDataUrl] = useState<string>("");
  const [isReady, setIsReady] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareNotice, setShareNotice] = useState("");
  const [preparingLink, setPreparingLink] = useState(false);
  const [publishResult, setPublishResult] = useState<{error?:string;url?:string} | null>(null);
  const posterLocked = useRef(false);
  const publishInFlight = useRef(false);

  const magVal = event.magnitude !== null && event.magnitude !== undefined ? event.magnitude : null;
  const magStr = magVal !== null ? magVal.toFixed(1) : "—";
  const depthStr = event.depthKm !== null && event.depthKm !== undefined ? `${event.depthKm.toFixed(0)} km` : "Unknown";
  const depthStrKm = event.depthKm !== null && event.depthKm !== undefined ? `${event.depthKm.toFixed(0)} គ.ម` : "មិនទាន់បញ្ជាក់";

  const locEn = translateEarthquakeLocation(event.location, "en");
  const locKm = translateEarthquakeLocation(event.location, "km");

  const distEn = formatDistanceToCambodia(event.distanceToCambodiaKm, event.latitude, event.longitude, false);
  const distKm = formatDistanceToCambodia(event.distanceToCambodiaKm, event.latitude, event.longitude, true);

  const timeIct = formatLocalIctTime(event.originTime, "en", { includeDate: true });
  const provider = event.reports?.[0]?.provider || "Seismic Monitoring";

  const magBadgeColor =
    magVal === null
      ? "#64748b"
      : magVal >= 6.0
      ? "#dc2626"
      : magVal >= 5.0
      ? "#ea580c"
      : magVal >= 4.0
      ? "#d97706"
      : magVal >= 3.0
      ? "#0284c7"
      : "#475569";

  const statusQuote = generateEarthquakeFacebookStatus(
    event,
    `https://geocam.site/earthquake-monitoring?event=${encodeURIComponent(event.id)}`
  );

  // Synchronously draw vector poster canvas with fallback tiles
  useEffect(() => {
    let isCancelled = false;
    const canvas = posterCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    const renderPoster = (loadedMapImg?: HTMLImageElement, loadedLogoImg?: HTMLImageElement) => {
      if (isCancelled || posterLocked.current) return;

      // 1. Deep Space Tech Background Gradient
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#081325");
      bg.addColorStop(0.5, "#0b1b33");
      bg.addColorStop(1, "#071622");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Subtle Tech Grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Top Header Bar
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, 110);
      ctx.fillStyle = "#10b981"; // Emerald accent divider
      ctx.fillRect(0, 106, width, 4);

      // Draw Logo if loaded or draw geometric emblem
      if (loadedLogoImg && loadedLogoImg.naturalWidth > 0) {
        ctx.drawImage(loadedLogoImg, 40, 18, 74, 74);
      } else {
        ctx.fillStyle = "#0284c7";
        ctx.beginPath();
        ctx.arc(77, 55, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GC", 77, 63);
        ctx.textAlign = "left";
      }

      // Branding Headers
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 16px 'Noto Sans Khmer', sans-serif";
      ctx.fillText("GEOSCIENCES SOCIETY OF CAMBODIA · សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា", 130, 46);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 30px 'Noto Sans Khmer', sans-serif";
      ctx.fillText("SEISMOLOGICAL BULLETIN · ដំណឹងរញ្ជួយដីជាតិ", 130, 86);

      // Red LIVE Alert Badge on top-right
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.roundRect(width - 240, 32, 190, 48, 8);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 19px sans-serif";
      ctx.fillText("🚨 LIVE BULLETIN", width - 225, 63);

      // 3. Left Column: Epicenter Map Box
      const mapX = 50;
      const mapY = 140;
      const mapW = 460;
      const mapH = 430;

      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(mapX, mapY, mapW, mapH, 16);
      ctx.fill();
      ctx.stroke();

      if (loadedMapImg && loadedMapImg.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(mapX + 4, mapY + 4, mapW - 8, mapH - 8, 12);
        ctx.clip();
        ctx.drawImage(loadedMapImg, mapX + 4, mapY + 4, mapW - 8, mapH - 8);
        // The export is centered on the epicenter; add our own consistent pin.
        ctx.fillStyle = "#ef4444";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(mapX + mapW / 2, mapY + mapH / 2, 10, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "rgba(15,23,42,.8)";
        ctx.fillRect(mapX + 8, mapY + 8, mapW - 16, 20);
        ctx.fillStyle = "white";
        ctx.font = "11px sans-serif";
        ctx.fillText("© Esri World Topo Map · OpenStreetMap contributors", mapX + 14, mapY + 22);
        ctx.restore();
      } else {
        // Fallback Stylized Radar & Coordinate grid if image is offline
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(mapX + 4, mapY + 4, mapW - 8, mapH - 8, 12);
        ctx.clip();
        ctx.fillStyle = "#0f2027";
        ctx.fillRect(mapX, mapY, mapW, mapH);

        // Concentric seismic waves
        const cX = mapX + mapW / 2;
        const cY = mapY + mapH / 2;
        [60, 110, 160, 210].forEach((r, i) => {
          ctx.strokeStyle = `rgba(220, 38, 38, ${0.45 - i * 0.1})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cX, cY, r, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Center Pin
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(cX, cY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      }

      // Map coordinate bottom ribbon
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
      ctx.fillRect(mapX + 4, mapY + mapH - 52, mapW - 8, 48);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText(
        `EPICENTER: ${event.latitude.toFixed(3)}°N, ${event.longitude.toFixed(3)}°E`,
        mapX + 20,
        mapY + mapH - 22
      );

      // 4. Right Column: Key Seismic Metrics
      const dataX = 550;

      // Magnitude Display Box
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      ctx.strokeStyle = magBadgeColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(dataX, 140, 600, 110, 16);
      ctx.fill();
      ctx.stroke();

      // Magnitude Number
      ctx.fillStyle = magBadgeColor;
      ctx.font = "900 68px sans-serif";
      ctx.fillText(`M ${magStr}`, dataX + 24, 218);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 23px 'Noto Sans Khmer', sans-serif";
      ctx.fillText("Richter Scale (កម្រិតរ៉ិចទ័រ)", dataX + 240, 183);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "15px sans-serif";
      ctx.fillText(`Recorded by: ${provider} Network · Status: ${event.status || "Preliminary"}`, dataX + 240, 216);

      // Metric Rows Helper
      const drawRow = (y: number, labelEn: string, labelKm: string, value: string, icon: string, valColor = "#ffffff") => {
        ctx.fillStyle = "rgba(30, 41, 59, 0.75)";
        ctx.beginPath();
        ctx.roundRect(dataX, y, 600, 68, 12);
        ctx.fill();

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 13px 'Noto Sans Khmer', sans-serif";
        ctx.fillText(`${labelEn.toUpperCase()} · ${labelKm}`, dataX + 20, y + 25);

        ctx.fillStyle = valColor;
        let fontSize = 18;
        let lines: string[] = [];
        do {
          ctx.font = `bold ${fontSize}px 'Noto Sans Khmer', sans-serif`;
          lines = wrapPosterText(`${icon} ${value}`, 560, text => ctx.measureText(text).width);
          if (lines.length <= 2) break;
          fontSize--;
        } while (fontSize >= 10);
        lines.slice(0,2).forEach((line,index) => ctx.fillText(line, dataX + 20, y + (lines.length > 1 ? 43 : 54) + index * 21, 560));
      };

      // Row 1: Epicenter
      drawRow(265, "Location", "ទីតាំងចំណុចកណ្តាល", `${locEn} (${locKm})`, "📍");

      // Row 2: Distance from Cambodia
      drawRow(345, "Proximity to Cambodia", "ចម្ងាយពីកម្ពុជា", `${distEn} (${distKm})`, "🧭", "#facc15");

      // Row 3: Focal Depth & Date
      ctx.fillStyle = "rgba(30, 41, 59, 0.75)";
      ctx.beginPath();
      ctx.roundRect(dataX, 425, 290, 68, 12);
      ctx.fill();
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 13px 'Noto Sans Khmer', sans-serif";
      ctx.fillText("FOCAL DEPTH · ជម្រៅ", dataX + 16, 450);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px 'Noto Sans Khmer', sans-serif";
      ctx.fillText(`📏 ${depthStr} (${depthStrKm})`, dataX + 16, 479);

      // Time Box
      ctx.fillStyle = "rgba(30, 41, 59, 0.75)";
      ctx.beginPath();
      ctx.roundRect(dataX + 310, 425, 290, 68, 12);
      ctx.fill();
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 13px 'Noto Sans Khmer', sans-serif";
      ctx.fillText("TIME · ម៉ោងនៅកម្ពុជា", dataX + 326, 450);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(`⏱ ${timeIct} ICT`, dataX + 326, 479);

      // Footer Bar with Web Link & Hashtags
      ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
      ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(dataX, 505, 600, 65, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 17px sans-serif";
      ctx.fillText("🔗 geocam.site/earthquake-monitoring", dataX + 20, 542);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("#geocam #earthquake #cambodia", dataX + 335, 542);

      try {
        const url = canvas.toDataURL("image/png");
        setPosterDataUrl(url);
        setIsReady(true);
      } catch (err) {
        console.warn("Canvas toDataURL fallback:", err);
      }
    };

    // Immediate first render with pure vector graphics (no blocking on network)
    renderPoster();

    // Async progressive enhancement: load map & logo
    const mapImg = new Image();
    mapImg.crossOrigin = "anonymous";
    mapImg.src = posterMapUrl(event.latitude, event.longitude);

    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = "/geocam-logo.png";

    let loadedMap: HTMLImageElement | undefined;
    let loadedLogo: HTMLImageElement | undefined;

    mapImg.onload = () => {
      loadedMap = mapImg;
      renderPoster(loadedMap, loadedLogo);
    };
    mapImg.onerror = () => {
      // Map failed to load, keep vector radar
      renderPoster(undefined, loadedLogo);
    };

    logoImg.onload = () => {
      loadedLogo = logoImg;
      renderPoster(loadedMap, loadedLogo);
    };

    return () => {
      isCancelled = true;
    };
  }, [event]);

  const handleCopyStatus = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(statusQuote);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {}
  };

  const handleDownloadPoster = () => {
    const canvas = posterCanvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = posterDataUrl || canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `GeoCam-Earthquake-Bulletin-${event.id}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handlePublishPoster = async () => {
    if (!admin || publishInFlight.current || publishResult?.url || !posterDataUrl) return;
    publishInFlight.current = true;
    posterLocked.current = true;
    const image = posterDataUrl;
    const caption = statusQuote;
    setPublishing(true); setPublishResult(null);
    try {
      const settings = getFacebookSettings();
      if (!settings.accessToken.trim()) throw new Error("Save your working Page Access Token in Admin → Facebook Publisher first.");
      const response = await fetch("/api/facebook-publisher", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({pageId:settings.pageId,accessToken:settings.accessToken.trim(),message:caption,posterDataUrl:image,type:"earthquake"}),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Facebook could not publish this poster.");
      setPublishResult({url:result.postUrl});
    } catch (error) {
      setPublishResult({error:error instanceof Error ? error.message : "Unable to publish poster."});
      posterLocked.current = false;
    } finally { setPublishing(false); publishInFlight.current = false; }
  };

  const handleShareLink = async () => {
    if (!posterDataUrl || preparingLink) return;
    const popup = window.open("about:blank", "_blank");
    if (popup) popup.opener = null;
    setPreparingLink(true); setShareNotice(""); posterLocked.current = true;
    try {
      let url = shareUrl;
      if (!url) {
        const response = await fetch("/api/earthquake-poster", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({posterDataUrl,caption:statusQuote,eventId:event.id})});
        const result = await response.json();
        if (!response.ok || !result.url) throw new Error(result.error || "Unable to create poster link. Please retry.");
        const parsed = new URL(result.url);
        if (parsed.origin !== "https://geocam.site" || parsed.pathname !== "/api/earthquake-poster") throw new Error("Unexpected poster link.");
        url = result.url; setShareUrl(url);
      }
      if (popup) popup.location.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      setShareNotice("Your poster link is ready. It opens this exact PNG and caption, even after the earthquake leaves the live feed.");
    } catch (error) {
      popup?.close(); posterLocked.current = false;
      setShareNotice(error instanceof Error ? error.message : "Unable to create poster link. Download the PNG and copy its caption instead.");
    } finally { setPreparingLink(false); }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={kh ? "ផ្ទាំងរូបភាពដំណឹងរញ្ជួយដី" : "Earthquake bulletin poster"} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold">
              {kh ? "ផ្ទាំងរូបភាព & ដំណឹងរញ្ជួយដីសម្រាប់បង្ហោះ (Ready-to-Post Poster)" : "Ready-to-Post Earthquake Bulletin & Poster"}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close poster"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* 1. Visual Poster Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Radio size={14} className="text-rose-500 animate-pulse" />
                {kh ? "ផ្ទាំងរូបភាពជាផ្លូវការ (1200 × 630px HD Poster)" : "Official Social Poster Card (1200 × 630px HD)"}
              </span>
            </div>

            {/* Canvas used for high-res generation */}
            <canvas ref={posterCanvasRef} className="hidden" />

            {/* High-res image display */}
            <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-inner flex items-center justify-center">
              {posterDataUrl ? (
                <img
                  src={posterDataUrl}
                  alt={event.location}
              className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                  <RefreshCw className="h-6 w-6 animate-spin text-emerald-400" />
                  <span>Generating official bulletin poster...</span>
                </div>
              )}
            </div>
          </div>
          {shareNotice && <div role="status" className="rounded-lg border border-slate-600 p-3 text-sm">{shareNotice}</div>}
          {shareUrl && <div className="rounded-lg border border-emerald-600 p-3 text-sm"><a href={shareUrl} target="_blank" rel="noopener noreferrer" className="underline">Open generated poster ↗</a><label className="mt-2 block">Poster link<input aria-label="Generated poster link" readOnly value={shareUrl} onFocus={e => e.currentTarget.select()} className="mt-1 w-full rounded border border-slate-600 bg-slate-950 p-2 text-xs" /></label><button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(shareUrl);setShareNotice("Poster link copied.");}catch{setShareNotice("Select the poster link above and copy it.");}}} className="mt-2 underline">Copy poster link</button></div>}

          {/* 2. Ready-to-Paste Description Status */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {kh ? "អត្ថបទស្ថានភាពសម្រាប់ Facebook (Caption Status & Tags)" : "Ready Status Caption with Distance & Tags"}
              </span>
              <button
                type="button"
                onClick={handleCopyStatus}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition border border-slate-700"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? (kh ? "បានចម្លង!" : "Copied!") : (kh ? "ចម្លងអត្ថបទ" : "Copy Caption")}</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-300 bg-slate-900/90 p-3.5 rounded-lg border border-slate-800 leading-relaxed select-all">
              {statusQuote}
            </pre>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-800 bg-slate-950 px-5 py-4">
          {(publishing || publishResult) && <div role={publishResult?.error ? "alert" : "status"} aria-live="polite" className={`mb-3 max-h-32 overflow-y-auto rounded-lg border p-3 text-sm ${publishResult?.error ? "border-red-500 text-red-200" : "border-emerald-600 text-emerald-200"}`}>
            {publishing ? "Posting this poster and its full generated caption to GeoCam101…" : publishResult?.error || "Posted to GeoCam101 with the generated caption."}
            {publishResult?.error && <a className="ml-2 underline" href="/admin/cms?section=facebook" target="_blank" rel="noopener noreferrer">Check Page token</a>}
            {publishResult?.url && <a className="ml-2 underline" target="_blank" rel="noopener noreferrer" href={publishResult.url}>View Facebook post ↗</a>}
          </div>}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" disabled={!isReady} onClick={handleDownloadPoster} className="btn btn-outline inline-flex items-center gap-2 text-sm"><Download size={16}/>{kh ? "ទាញយករូប Poster" : "Download poster (PNG)"}</button>
            {admin ? <button type="button" aria-busy={publishing} disabled={!isReady || publishing || !!publishResult?.url} onClick={handlePublishPoster} className="btn btn-primary inline-flex items-center gap-2 text-sm font-bold">{publishing ? <RefreshCw size={16} className="animate-spin"/> : <Share2 size={16}/>} {publishing ? "Posting…" : publishResult?.url ? "Posted to GeoCam101" : "Post to GeoCam101"}</button> : <a className="btn btn-primary text-sm font-bold" href="/admin/login">Sign in to post to GeoCam101</a>}
          </div>
          <p className="mt-2 text-xs text-slate-400">The poster and generated caption are included automatically. Posting requires your saved Page token.</p>
          <details className="mt-3 text-xs text-slate-400"><summary className="cursor-pointer">More options</summary><p className="mt-2">Manual link sharing opens Facebook’s composer; paste the caption yourself.</p><button type="button" disabled={!isReady || preparingLink} onClick={handleShareLink} className="mt-2 rounded border border-slate-600 px-3 py-2">{preparingLink ? "Creating poster link…" : "Share link manually on Facebook"}</button></details>
        </div>
      </div>
    </div>
  );
};
