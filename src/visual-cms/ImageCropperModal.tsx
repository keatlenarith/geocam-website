import React, { useState, useRef, useEffect } from "react";
import { X, Check, Crop, ZoomIn, ZoomOut, RotateCcw, Image as ImageIcon } from "lucide-react";

interface ImageCropperModalProps {
  imageSrc?: string;
  imageUrl?: string;
  onApplyCrop?: (croppedDataUrl: string) => void;
  onCrop?: (croppedDataUrl: string) => void;
  onClose: () => void;
  title?: string;
}

type AspectRatio = "free" | "16:9" | "4:3" | "1:1" | "3:2";

export function ImageCropperModal({
  imageSrc,
  imageUrl,
  onApplyCrop,
  onCrop,
  onClose,
  title = "Crop & Adjust Image",
}: ImageCropperModalProps) {
  const effectiveSrc = imageSrc || imageUrl || "";
  const [aspect, setAspect] = useState<AspectRatio>("16:9");
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0); // in percent (-50 to 50)
  const [panY, setPanY] = useState(0); // in percent (-50 to 50)
  const [naturalSize, setNaturalSize] = useState({ w: 800, h: 600 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Load natural image dimensions
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageObjRef.current = img;
      setNaturalSize({ w: img.naturalWidth || 800, h: img.naturalHeight || 600 });
      drawPreview();
    };
    img.src = effectiveSrc;
  }, [effectiveSrc]);

  // Compute target aspect ratio ratio value
  const getRatio = (): number => {
    switch (aspect) {
      case "16:9":
        return 16 / 9;
      case "4:3":
        return 4 / 3;
      case "1:1":
        return 1;
      case "3:2":
        return 3 / 2;
      case "free":
      default:
        return naturalSize.w / (naturalSize.h || 1);
    }
  };

  // Redraw canvas preview
  const drawPreview = () => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ratio = getRatio();
    const canvasW = 600;
    const canvasH = Math.round(canvasW / ratio);

    canvas.width = canvasW;
    canvas.height = canvasH;

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Calculate source rect with zoom and pan
    const scale = Math.max(1, zoom);
    const srcW = naturalSize.w / scale;
    const srcH = naturalSize.h / scale;

    const maxShiftX = (naturalSize.w - srcW) / 2;
    const maxShiftY = (naturalSize.h - srcH) / 2;

    const shiftX = (panX / 50) * maxShiftX;
    const shiftY = (panY / 50) * maxShiftY;

    const srcX = Math.max(0, Math.min(naturalSize.w - srcW, (naturalSize.w - srcW) / 2 + shiftX));
    const srcY = Math.max(0, Math.min(naturalSize.h - srcH, (naturalSize.h - srcH) / 2 + shiftY));

    // Draw cropped region into preview canvas
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvasW, canvasH);

    // Draw Rule of Thirds guidelines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    // Vertical thirds
    ctx.moveTo(canvasW / 3, 0);
    ctx.lineTo(canvasW / 3, canvasH);
    ctx.moveTo((canvasW * 2) / 3, 0);
    ctx.lineTo((canvasW * 2) / 3, canvasH);
    // Horizontal thirds
    ctx.moveTo(0, canvasH / 3);
    ctx.lineTo(canvasW, canvasH / 3);
    ctx.moveTo(0, (canvasH * 2) / 3);
    ctx.lineTo(canvasW, (canvasH * 2) / 3);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  useEffect(() => {
    drawPreview();
  }, [aspect, zoom, panX, panY, naturalSize]);

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      if (onApplyCrop) onApplyCrop(dataUrl);
      else if (onCrop) onCrop(dataUrl);
    } catch {
      alert("Failed to export cropped image.");
    }
  };

  const resetAdjustments = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setAspect("16:9");
  };

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 p-5 sm:p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Crop className="text-emerald-400" size={20} />
            <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Canvas Preview Area */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-center min-h-[260px] max-h-[380px] p-2">
          <canvas
            ref={canvasRef}
            className="max-h-[360px] max-w-full rounded-xl object-contain shadow-md"
          />
        </div>

        {/* Aspect Ratio Presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1">Aspect Ratio:</span>
          {(["16:9", "4:3", "1:1", "3:2", "free"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setAspect(r)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                aspect === r
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
          <button
            type="button"
            onClick={resetAdjustments}
            title="Reset crop adjustments"
            className="ml-auto flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        {/* Sliders: Zoom & Pan */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3 border-t border-slate-800/80 pt-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-semibold mb-1">
              <span>Zoom Scale</span>
              <span>{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-semibold mb-1">
              <span>Pan X (Horizontal)</span>
              <span>{panX}%</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={panX}
              onChange={(e) => setPanX(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-semibold mb-1">
              <span>Pan Y (Vertical)</span>
              <span>{panY}%</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={panY}
              onChange={(e) => setPanY(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3">
          <div className="text-[11px] text-slate-400">
            Original: {naturalSize.w} × {naturalSize.h}px
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition"
            >
              <Check size={14} /> Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
