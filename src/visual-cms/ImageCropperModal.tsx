import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Check,
  Crop,
  RotateCcw,
  Move,
  Maximize2,
  Sliders,
  CheckCircle2,
} from "lucide-react";

interface ImageCropperModalProps {
  imageSrc?: string;
  imageUrl?: string;
  onApplyCrop?: (croppedDataUrl: string) => void;
  onCrop?: (croppedDataUrl: string) => void;
  onClose: () => void;
  title?: string;
}

type AspectRatio = "free" | "16:9" | "4:3" | "1:1" | "3:2";

interface CropRect {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width: number; // percentage 0 - 100
  height: number; // percentage 0 - 100
}

type DragAction =
  | "move"
  | "nw"
  | "ne"
  | "sw"
  | "se"
  | "n"
  | "s"
  | "w"
  | "e"
  | null;

export function ImageCropperModal({
  imageSrc,
  imageUrl,
  onApplyCrop,
  onCrop,
  onClose,
  title = "Crop & Adjust Image",
}: ImageCropperModalProps) {
  const effectiveSrc = imageSrc || imageUrl || "";
  const [aspect, setAspect] = useState<AspectRatio>("free");
  const [naturalSize, setNaturalSize] = useState({ w: 800, h: 600 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Crop rectangle in percentages (0 to 100)
  const [crop, setCrop] = useState<CropRect>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });

  const stageRef = useRef<HTMLDivElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Drag state
  const draggingAction = useRef<DragAction>(null);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartCrop = useRef<CropRect>({ x: 10, y: 10, width: 80, height: 80 });

  // Compute numerical aspect ratio (w / h)
  const getTargetRatio = useCallback((): number | null => {
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
        return null;
    }
  }, [aspect]);

  // Load natural image dimensions & set initial crop
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = img.naturalWidth || 800;
      const h = img.naturalHeight || 600;
      imageObjRef.current = img;
      setNaturalSize({ w, h });
      setImageLoaded(true);

      // Default crop: 85% with 16:9 or full bounds
      setCrop({
        x: 7.5,
        y: 7.5,
        width: 85,
        height: 85,
      });
    };
    img.src = effectiveSrc;
  }, [effectiveSrc]);

  // Auto-fit crop when aspect ratio preset changes
  const applyAspectPreset = (newAspect: AspectRatio) => {
    setAspect(newAspect);
    if (newAspect === "free") return;

    let targetWOverH = 1;
    if (newAspect === "16:9") targetWOverH = 16 / 9;
    else if (newAspect === "4:3") targetWOverH = 4 / 3;
    else if (newAspect === "1:1") targetWOverH = 1;
    else if (newAspect === "3:2") targetWOverH = 3 / 2;

    const imgAspect = naturalSize.w / (naturalSize.h || 1);

    let newWidth = 85;
    let newHeight = 85;

    if (imgAspect > targetWOverH) {
      // Image is wider than target ratio
      newHeight = 85;
      newWidth = (newHeight * targetWOverH) / imgAspect;
    } else {
      // Image is taller than target ratio
      newWidth = 85;
      newHeight = (newWidth * imgAspect) / targetWOverH;
    }

    newWidth = Math.min(100, Math.max(10, newWidth));
    newHeight = Math.min(100, Math.max(10, newHeight));

    const newX = Math.max(0, (100 - newWidth) / 2);
    const newY = Math.max(0, (100 - newHeight) / 2);

    setCrop({
      x: Math.round(newX * 10) / 10,
      y: Math.round(newY * 10) / 10,
      width: Math.round(newWidth * 10) / 10,
      height: Math.round(newHeight * 10) / 10,
    });
  };

  const resetCrop = () => {
    setAspect("free");
    setCrop({
      x: 5,
      y: 5,
      width: 90,
      height: 90,
    });
  };

  // Start dragging action (move or handle resize)
  const onStartDrag = (
    e: React.MouseEvent | React.TouchEvent,
    action: DragAction,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    draggingAction.current = action;
    dragStartPos.current = { x: clientX, y: clientY };
    dragStartCrop.current = { ...crop };
  };

  // Global mousemove and mouseup listeners for smooth dragging
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const action = draggingAction.current;
      const stage = stageRef.current;
      if (!action || !stage) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const rect = stage.getBoundingClientRect();
      const stageW = rect.width || 1;
      const stageH = rect.height || 1;

      // Delta in percentage (0 to 100)
      const dx = ((clientX - dragStartPos.current.x) / stageW) * 100;
      const dy = ((clientY - dragStartPos.current.y) / stageH) * 100;

      const orig = dragStartCrop.current;
      const minSize = 5; // Minimum 5% width/height
      const targetRatio = getTargetRatio();
      const imgAspect = naturalSize.w / (naturalSize.h || 1);

      if (action === "move") {
        let nextX = orig.x + dx;
        let nextY = orig.y + dy;

        nextX = Math.max(0, Math.min(100 - orig.width, nextX));
        nextY = Math.max(0, Math.min(100 - orig.height, nextY));

        setCrop((prev) => ({
          ...prev,
          x: nextX,
          y: nextY,
        }));
        return;
      }

      // Edge and corner resizing
      let nextX = orig.x;
      let nextY = orig.y;
      let nextW = orig.width;
      let nextH = orig.height;

      // 1. East / West adjustment
      if (action.includes("e")) {
        nextW = Math.max(minSize, Math.min(100 - orig.x, orig.width + dx));
      } else if (action.includes("w")) {
        const potentialW = orig.width - dx;
        if (potentialW >= minSize && orig.x + dx >= 0) {
          nextX = orig.x + dx;
          nextW = potentialW;
        }
      }

      // 2. North / South adjustment
      if (action.includes("s")) {
        nextH = Math.max(minSize, Math.min(100 - orig.y, orig.height + dy));
      } else if (action.includes("n")) {
        const potentialH = orig.height - dy;
        if (potentialH >= minSize && orig.y + dy >= 0) {
          nextY = orig.y + dy;
          nextH = potentialH;
        }
      }

      // 3. Aspect ratio constraint if locked
      if (targetRatio !== null) {
        if (action === "e" || action === "w") {
          nextH = (nextW * imgAspect) / targetRatio;
          if (nextY + nextH > 100) {
            nextH = 100 - nextY;
            nextW = (nextH * targetRatio) / imgAspect;
          }
        } else if (action === "n" || action === "s") {
          nextW = (nextH * targetRatio) / imgAspect;
          if (nextX + nextW > 100) {
            nextW = 100 - nextX;
            nextH = (nextW * imgAspect) / targetRatio;
          }
        } else if (action.includes("e") || action.includes("w")) {
          // Corner handles: derive height from width
          nextH = (nextW * imgAspect) / targetRatio;
          if (action.includes("n")) {
            nextY = orig.y + orig.height - nextH;
          }
          if (nextY < 0) {
            nextY = 0;
            nextH = orig.y + orig.height;
            nextW = (nextH * targetRatio) / imgAspect;
            if (action.includes("w")) nextX = orig.x + orig.width - nextW;
          } else if (nextY + nextH > 100) {
            nextH = 100 - nextY;
            nextW = (nextH * targetRatio) / imgAspect;
            if (action.includes("w")) nextX = orig.x + orig.width - nextW;
          }
        }
      }

      // Final bounding guardrails
      nextX = Math.max(0, Math.min(100 - minSize, nextX));
      nextY = Math.max(0, Math.min(100 - minSize, nextY));
      nextW = Math.max(minSize, Math.min(100 - nextX, nextW));
      nextH = Math.max(minSize, Math.min(100 - nextY, nextH));

      setCrop({
        x: nextX,
        y: nextY,
        width: nextW,
        height: nextH,
      });
    };

    const handleEnd = () => {
      draggingAction.current = null;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [getTargetRatio, naturalSize]);

  // Export cropped image at full natural fidelity
  const handleApply = () => {
    const img = imageObjRef.current;
    if (!img) return;

    try {
      const exportCanvas = document.createElement("canvas");
      const cropX = Math.max(0, Math.round((crop.x / 100) * naturalSize.w));
      const cropY = Math.max(0, Math.round((crop.y / 100) * naturalSize.h));
      const cropW = Math.min(
        naturalSize.w - cropX,
        Math.max(1, Math.round((crop.width / 100) * naturalSize.w)),
      );
      const cropH = Math.min(
        naturalSize.h - cropY,
        Math.max(1, Math.round((crop.height / 100) * naturalSize.h)),
      );

      exportCanvas.width = cropW;
      exportCanvas.height = cropH;

      const ctx = exportCanvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D canvas context");

      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      const dataUrl = exportCanvas.toDataURL("image/jpeg", 0.92);
      if (onApplyCrop) onApplyCrop(dataUrl);
      else if (onCrop) onCrop(dataUrl);
    } catch (err) {
      console.error("Crop export error:", err);
      alert("Failed to export cropped image.");
    }
  };

  // Pixel resolution readout of cropped region
  const cropPixelW = Math.round((crop.width / 100) * naturalSize.w);
  const cropPixelH = Math.round((crop.height / 100) * naturalSize.h);

  return (
    <div
      data-crop-modal="true"
      className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-sm select-none"
    >
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700 p-5 sm:p-6 shadow-2xl text-white flex flex-col max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Crop size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400">
                Drag crop edges and corners to adjust manually. Drag center to move.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* =========================================================================
            INTERACTIVE CROP STAGE (Shows full photo + visible edges & handles)
           ========================================================================= */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-center min-h-[300px] max-h-[460px] p-2">
          {imageLoaded ? (
            <div
              ref={stageRef}
              className="relative inline-block max-w-full max-h-[440px] select-none"
              style={{
                aspectRatio: `${naturalSize.w} / ${naturalSize.h}`,
              }}
            >
              {/* Full background image */}
              <img
                src={effectiveSrc}
                alt="Crop preview"
                className="block max-w-full max-h-[440px] w-auto h-auto object-contain pointer-events-none rounded-xl"
                draggable={false}
              />

              {/* Four dark shrouds around the crop box */}
              {/* Top shroud */}
              <div
                className="absolute left-0 right-0 top-0 bg-black/60 pointer-events-none transition-[height] duration-75"
                style={{ height: `${crop.y}%` }}
              />
              {/* Bottom shroud */}
              <div
                className="absolute left-0 right-0 bottom-0 bg-black/60 pointer-events-none transition-[height] duration-75"
                style={{ height: `${100 - (crop.y + crop.height)}%` }}
              />
              {/* Left shroud */}
              <div
                className="absolute left-0 bg-black/60 pointer-events-none transition-[top,bottom,width] duration-75"
                style={{
                  top: `${crop.y}%`,
                  bottom: `${100 - (crop.y + crop.height)}%`,
                  width: `${crop.x}%`,
                }}
              />
              {/* Right shroud */}
              <div
                className="absolute right-0 bg-black/60 pointer-events-none transition-[top,bottom,width] duration-75"
                style={{
                  top: `${crop.y}%`,
                  bottom: `${100 - (crop.y + crop.height)}%`,
                  width: `${100 - (crop.x + crop.width)}%`,
                }}
              />

              {/* ===================================================================
                  THE INTERACTIVE CROP BOX WITH VISIBLE EDGES & HANDLES
                 =================================================================== */}
              <div
                data-crop-box="true"
                className="absolute border-2 border-white cursor-move touch-none group"
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`,
                  boxShadow:
                    "0 0 0 1px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.4)",
                }}
                onMouseDown={(e) => onStartDrag(e, "move")}
                onTouchStart={(e) => onStartDrag(e, "move")}
              >
                {/* Rule of Thirds guidelines inside crop box */}
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-60">
                  <div className="border-r border-b border-dashed border-white/40" />
                  <div className="border-r border-b border-dashed border-white/40" />
                  <div className="border-b border-dashed border-white/40" />
                  <div className="border-r border-b border-dashed border-white/40" />
                  <div className="border-r border-b border-dashed border-white/40" />
                  <div className="border-b border-dashed border-white/40" />
                  <div className="border-r border-dashed border-white/40" />
                  <div className="border-r border-dashed border-white/40" />
                  <div />
                </div>

                {/* Resolution badge floating at top-left of crop box */}
                <div className="absolute top-1.5 left-1.5 z-20 pointer-events-none bg-slate-900/90 text-emerald-300 font-mono text-[10px] px-1.5 py-0.5 rounded shadow-sm border border-slate-700/80">
                  {cropPixelW} × {cropPixelH} px
                </div>

                {/* VISIBLE CROP EDGES (Manual Resize Edge Bars) */}
                {/* Top Edge */}
                <div
                  data-crop-edge="n"
                  className="absolute -top-1.5 left-2 right-2 h-3 cursor-ns-resize z-10 flex items-center justify-center"
                  onMouseDown={(e) => onStartDrag(e, "n")}
                  onTouchStart={(e) => onStartDrag(e, "n")}
                >
                  <div className="h-1 w-10 bg-emerald-400 rounded-full shadow-sm hover:h-1.5 transition-all" />
                </div>
                {/* Bottom Edge */}
                <div
                  data-crop-edge="s"
                  className="absolute -bottom-1.5 left-2 right-2 h-3 cursor-ns-resize z-10 flex items-center justify-center"
                  onMouseDown={(e) => onStartDrag(e, "s")}
                  onTouchStart={(e) => onStartDrag(e, "s")}
                >
                  <div className="h-1 w-10 bg-emerald-400 rounded-full shadow-sm hover:h-1.5 transition-all" />
                </div>
                {/* Left Edge */}
                <div
                  data-crop-edge="w"
                  className="absolute -left-1.5 top-2 bottom-2 w-3 cursor-ew-resize z-10 flex items-center justify-center"
                  onMouseDown={(e) => onStartDrag(e, "w")}
                  onTouchStart={(e) => onStartDrag(e, "w")}
                >
                  <div className="w-1 h-10 bg-emerald-400 rounded-full shadow-sm hover:w-1.5 transition-all" />
                </div>
                {/* Right Edge */}
                <div
                  data-crop-edge="e"
                  className="absolute -right-1.5 top-2 bottom-2 w-3 cursor-ew-resize z-10 flex items-center justify-center"
                  onMouseDown={(e) => onStartDrag(e, "e")}
                  onTouchStart={(e) => onStartDrag(e, "e")}
                >
                  <div className="w-1 h-10 bg-emerald-400 rounded-full shadow-sm hover:w-1.5 transition-all" />
                </div>

                {/* 4 VISIBLE CORNER HANDLES (High-contrast square brackets) */}
                {/* Top-Left */}
                <div
                  data-crop-handle="nw"
                  className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-emerald-500 rounded-xs cursor-nwse-resize z-20 shadow-md hover:scale-125 transition-transform"
                  onMouseDown={(e) => onStartDrag(e, "nw")}
                  onTouchStart={(e) => onStartDrag(e, "nw")}
                />
                {/* Top-Right */}
                <div
                  data-crop-handle="ne"
                  className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-emerald-500 rounded-xs cursor-nesw-resize z-20 shadow-md hover:scale-125 transition-transform"
                  onMouseDown={(e) => onStartDrag(e, "ne")}
                  onTouchStart={(e) => onStartDrag(e, "ne")}
                />
                {/* Bottom-Left */}
                <div
                  data-crop-handle="sw"
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-emerald-500 rounded-xs cursor-nesw-resize z-20 shadow-md hover:scale-125 transition-transform"
                  onMouseDown={(e) => onStartDrag(e, "sw")}
                  onTouchStart={(e) => onStartDrag(e, "sw")}
                />
                {/* Bottom-Right */}
                <div
                  data-crop-handle="se"
                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-emerald-500 rounded-xs cursor-nwse-resize z-20 shadow-md hover:scale-125 transition-transform"
                  onMouseDown={(e) => onStartDrag(e, "se")}
                  onTouchStart={(e) => onStartDrag(e, "se")}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <span className="text-xs">Loading image...</span>
            </div>
          )}
        </div>

        {/* Aspect Ratio Presets & Manual Quick Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Sliders size={13} /> Ratio:
            </span>
            {(
              [
                { id: "free", label: "Free (Manual)" },
                { id: "16:9", label: "16:9" },
                { id: "4:3", label: "4:3" },
                { id: "1:1", label: "1:1 (Square)" },
                { id: "3:2", label: "3:2" },
              ] as const
            ).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => applyAspectPreset(r.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  aspect === r.id
                    ? "bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-400"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetCrop}
              title="Reset crop box to full extent"
              className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              <RotateCcw size={12} /> Reset Box
            </button>
          </div>
        </div>

        {/* Footer info & Action buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3">
          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span>
              Original: <strong className="text-slate-300">{naturalSize.w} × {naturalSize.h}px</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span>
              Cropped Output: <strong className="text-emerald-400 font-mono">{cropPixelW} × {cropPixelH}px</strong>
            </span>
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
