import React, { useRef, useState, useEffect } from "react";
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
} from "lucide-react";
import {
  buildFacebookShareUrl,
  shareEarthquakeToFacebook,
  generateEarthquakeFacebookStatus,
  getCanonicalSiteOrigin,
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
  const { lang } = useI18n();
  const kh = lang === "km";
  const posterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [posterDataUrl, setPosterDataUrl] = useState<string>("");

  if (!isOpen || !event) return null;

  const magVal = event.magnitude !== null && event.magnitude !== undefined ? event.magnitude : null;
  const magStr = magVal !== null ? magVal.toFixed(1) : "—";
  const depthStr = event.depthKm !== null && event.depthKm !== undefined ? `${event.depthKm.toFixed(0)} km` : "Unknown";
  const depthStrKm = event.depthKm !== null && event.depthKm !== undefined ? `${event.depthKm.toFixed(0)} គ.ម` : "មិនទាន់បញ្ជាក់";

  const locEn = translateEarthquakeLocation(event.location, "en");
  const locKm = translateEarthquakeLocation(event.location, "km");

  const distEn = formatDistanceToCambodia(event.distanceToCambodiaKm, event.latitude, event.longitude, false);
  const distKm = formatDistanceToCambodia(event.distanceToCambodiaKm, event.latitude, event.longitude, true);

  const timeIct = formatLocalIctTime(event.originTime, "en", { includeDate: true });
  const timeIctKm = formatLocalIctTime(event.originTime, "km", { includeDate: true });

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

  // Render high-res 1200x630 Facebook Poster Image onto Canvas
  useEffect(() => {
    const canvas = posterCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient (Dark Navy to Deep Teal)
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#081325");
    bgGradient.addColorStop(0.5, "#0d1f38");
    bgGradient.addColorStop(1, "#071720");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle Grid lines
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

    // Top Header Banner
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, 110);
    ctx.fillStyle = "#10b981"; // Emerald accent line
    ctx.fillRect(0, 106, width, 4);

    // Organization Branding Header
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px 'Noto Sans Khmer', sans-serif";
    ctx.fillText("GEOSCIENCES SOCIETY OF CAMBODIA · សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា", 130, 48);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px 'Noto Sans Khmer', sans-serif";
    ctx.fillText("SEISMOLOGICAL BULLETIN · ដំណឹងរញ្ជួយដីជាតិ", 130, 88);

    // Red LIVE Alert Badge on top-right
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.roundRect(width - 240, 32, 190, 48, 8);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("🚨 LIVE BULLETIN", width - 225, 63);

    // Left Column: Map Snapshot Box
    const mapX = 50;
    const mapY = 140;
    const mapW = 460;
    const mapH = 430;

    // Draw Map Frame
    ctx.fillStyle = "#1e293b";
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(mapX, mapY, mapW, mapH, 16);
    ctx.fill();
    ctx.stroke();

    // Load and draw Static Map Image
    const mapImg = new Image();
    mapImg.crossOrigin = "anonymous";
    mapImg.src = `https://static-maps.yandex.ru/1.x/?ll=${event.longitude},${event.latitude}&z=6&l=map&size=450,420&pt=${event.longitude},${event.latitude},pm2rdm`;

    mapImg.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(mapX + 5, mapY + 5, mapW - 10, mapH - 10, 12);
      ctx.clip();
      ctx.drawImage(mapImg, mapX + 5, mapY + 5, mapW - 10, mapH - 10);

      // Coordinate banner over map
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.fillRect(mapX + 5, mapY + mapH - 50, mapW - 10, 45);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(
        `LAT: ${event.latitude.toFixed(3)}° · LON: ${event.longitude.toFixed(3)}°`,
        mapX + 20,
        mapY + mapH - 22
      );
      ctx.restore();

      setPosterDataUrl(canvas.toDataURL("image/png"));
    };

    // Right Column: Key Metrics & Data
    const dataX = 550;

    // Magnitude Display Box
    ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
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
    ctx.font = "bold 24px 'Noto Sans Khmer', sans-serif";
    ctx.fillText("Richter Scale (កម្រិតរ៉ិចទ័រ)", dataX + 240, 185);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.fillText(`Recorded by: ${provider} Network · Status: ${event.status || "Preliminary"}`, dataX + 240, 218);

    // Location & Proximity Box
    const drawRow = (y: number, labelEn: string, labelKm: string, value: string, icon: string, valColor = "#ffffff") => {
      ctx.fillStyle = "rgba(30, 41, 59, 0.7)";
      ctx.beginPath();
      ctx.roundRect(dataX, y, 600, 68, 12);
      ctx.fill();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 13px 'Noto Sans Khmer', sans-serif";
      ctx.fillText(`${labelEn.toUpperCase()} · ${labelKm}`, dataX + 20, y + 25);

      ctx.fillStyle = valColor;
      ctx.font = "bold 20px 'Noto Sans Khmer', sans-serif";
      ctx.fillText(`${icon} ${value}`, dataX + 20, y + 54);
    };

    // Row 1: Epicenter
    drawRow(265, "Location", "ទីតាំងចំណុចកណ្តាល", `${locEn} (${locKm})`, "📍");

    // Row 2: Distance from Cambodia
    drawRow(345, "Proximity to Cambodia", "ចម្ងាយពីកម្ពុជា", `${distEn} (${distKm})`, "🧭", "#facc15");

    // Row 3: Focal Depth & Date
    ctx.fillStyle = "rgba(30, 41, 59, 0.7)";
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
    ctx.fillStyle = "rgba(30, 41, 59, 0.7)";
    ctx.beginPath();
    ctx.roundRect(dataX + 310, 425, 290, 68, 12);
    ctx.fill();
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 13px 'Noto Sans Khmer', sans-serif";
    ctx.fillText("TIME · ម៉ោងនៅកម្ពុជា", dataX + 326, 450);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 17px sans-serif";
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
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("🔗 geocam.site/earthquake-monitoring", dataX + 20, 542);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("#geocam #earthquake #cambodia", dataX + 340, 542);

    // Draw GeoCam Logo Icon in top-left
    const logoImg = new Image();
    logoImg.src = "/geocam-logo.png";
    logoImg.onload = () => {
      ctx.drawImage(logoImg, 45, 15, 75, 75);
      setPosterDataUrl(canvas.toDataURL("image/png"));
    };

    setPosterDataUrl(canvas.toDataURL("image/png"));
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
    setDownloading(true);
    const canvas = posterCanvasRef.current;
    if (!canvas) {
      setDownloading(false);
      return;
    }
    const link = document.createElement("a");
    link.download = `GeoCam-Earthquake-Bulletin-${event.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setDownloading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
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
              <button
                type="button"
                onClick={handleDownloadPoster}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-xs"
              >
                <Download size={14} />
                <span>{kh ? "ទាញយករូបភាព (Save Image)" : "Download HD Poster"}</span>
              </button>
            </div>

            {/* Hidden Canvas used for high-res generation */}
            <canvas ref={posterCanvasRef} className="hidden" />

            {/* High-res image display */}
            <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-inner">
              {posterDataUrl ? (
                <img
                  src={posterDataUrl}
                  alt={event.location}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500 text-sm">
                  Generating official bulletin poster...
                </div>
              )}
            </div>
          </div>

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

        {/* Modal Action Buttons Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-950 px-5 py-3.5">
          <button
            type="button"
            onClick={handleDownloadPoster}
            className="btn btn-outline inline-flex items-center gap-2 text-xs sm:text-sm font-semibold"
          >
            <Download size={16} />
            <span>{kh ? "ទាញយករូប Poster" : "Download Poster (PNG)"}</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyStatus}
              className="btn btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
            >
              {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
              <span>{copied ? (kh ? "បានចម្លងរួច" : "Copied") : (kh ? "ចម្លង Caption" : "Copy Status")}</span>
            </button>

            <a
              href={buildFacebookShareUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => shareEarthquakeToFacebook(event, e)}
              className="btn btn-primary inline-flex items-center gap-2 text-xs sm:text-sm font-bold bg-[#1877f2] hover:bg-[#166fe5] text-white border-0"
            >
              <Share2 size={16} />
              <span>{kh ? "បង្ហោះទៅ Facebook ↗" : "Post to Facebook ↗"}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
