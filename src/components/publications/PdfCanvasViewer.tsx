import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  FileText,
  Search,
} from "lucide-react";

// Configure local worker to avoid any cross-origin or external worker issues
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

interface PdfCanvasViewerProps {
  pdfUrl: string;
  title: string;
  km?: boolean;
}

export default function PdfCanvasViewer({ pdfUrl, title, km = false }: PdfCanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.25);
  const [loading, setLoading] = useState<boolean>(true);
  const [rendering, setRendering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Load Document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    const loadingTask = pdfjsLib.getDocument({
      url: pdfUrl,
      cMapUrl: "https://unpkg.com/pdfjs-dist@4.10.38/cmaps/",
      cMapPacked: true,
    });

    loadingTask.promise
      .then((doc) => {
        if (!isCancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("PDF load error:", err);
        if (!isCancelled) {
          setError(err?.message || "Failed to load PDF document.");
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      try {
        loadingTask.destroy();
      } catch {}
    };
  }, [pdfUrl]);

  // Render Page on Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask: any = null;
    setRendering(true);

    pdfDoc
      .getPage(currentPage)
      .then((page: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) return;

        // Auto-scale on small screens if scale wasn't manually bumped
        let targetScale = scale;
        if (containerRef.current && window.innerWidth < 768) {
          const unscaledViewport = page.getViewport({ scale: 1 });
          const availableWidth = containerRef.current.clientWidth - 24;
          if (availableWidth > 100) {
            targetScale = Math.min(scale, Math.max(0.6, availableWidth / unscaledViewport.width));
          }
        }

        const viewport = page.getViewport({ scale: targetScale });
        const pixelRatio = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        return renderTask.promise;
      })
      .then(() => {
        setRendering(false);
      })
      .catch((err: any) => {
        if (err?.name !== "RenderingCancelledException") {
          console.error("Page render error:", err);
        }
        setRendering(false);
      });

    return () => {
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch {}
      }
    };
  }, [pdfDoc, currentPage, scale]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handleZoomIn = () => {
    setScale((s) => Math.min(3.0, +(s + 0.25).toFixed(2)));
  };

  const handleZoomOut = () => {
    setScale((s) => Math.max(0.6, +(s - 0.25).toFixed(2)));
  };

  return (
    <div
      ref={containerRef}
      className={`mt-6 overflow-hidden rounded-2xl border border-slate-300 bg-slate-900 shadow-xl transition-all ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none border-0 h-screen w-screen p-0 m-0"
          : "w-full"
      }`}
    >
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 bg-slate-800 px-4 py-3 text-white">
        {/* Document Title */}
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={18} className="text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold truncate max-w-[200px] sm:max-w-md">
            {title}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Page Navigation */}
          <div className="flex items-center rounded-lg bg-slate-900/90 border border-slate-700 px-2 py-1 text-xs">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage <= 1 || loading}
              className="p-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300"
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 font-mono font-medium text-slate-200">
              {km ? "ទំព័រ" : "Page"} {currentPage} / {totalPages || 1}
            </span>
            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || loading}
              className="p-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300"
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center rounded-lg bg-slate-900/90 border border-slate-700 px-2 py-1 text-xs">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={scale <= 0.6 || loading}
              className="p-1 text-slate-300 hover:text-white disabled:opacity-30"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <span className="px-2 font-mono text-slate-300">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={scale >= 3.0 || loading}
              className="p-1 text-slate-300 hover:text-white disabled:opacity-30"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-lg bg-slate-700 p-2 text-slate-200 hover:bg-slate-600 hover:text-white transition"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          {/* Download Original PDF */}
          <a
            href={pdfUrl}
            download
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
          >
            <Download size={13} />
            <span className="hidden sm:inline">{km ? "ទាញយក" : "Download"}</span>
          </a>
        </div>
      </div>

      {/* Reader Body Canvas Area */}
      <div
        className={`relative flex items-center justify-center overflow-auto bg-slate-950 p-4 ${
          isFullscreen ? "h-[calc(100vh-57px)]" : "min-h-[550px] max-h-[80vh]"
        }`}
      >
        {loading && (
          <div className="flex flex-col items-center justify-center p-12 text-slate-300">
            <RefreshCw className="h-8 w-8 animate-spin text-emerald-500 mb-3" />
            <p className="text-sm font-semibold">
              {km ? "កំពុងបើកឯកសារ PDF ផ្ទាល់ក្នុងគេហទំព័រ..." : "Rendering PDF directly in website..."}
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-md bg-slate-900 rounded-xl border border-rose-900/50">
            <AlertCircle className="h-10 w-10 text-rose-500 mb-3" />
            <p className="text-sm font-bold text-white">
              {km ? "មិនអាចបើកឯកសារដោយផ្ទាល់បានទេ" : "Could not render PDF directly"}
            </p>
            <p className="mt-1 text-xs text-slate-400">{error}</p>
            <div className="mt-4 flex gap-3">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-xs"
              >
                {km ? "បើក PDF ក្នុងផ្ទាំងថ្មី ↗" : "Open PDF in New Tab ↗"}
              </a>
              <a href={pdfUrl} download className="btn btn-outline text-xs">
                {km ? "ទាញយកឯកសារ" : "Download PDF"}
              </a>
            </div>
          </div>
        )}

        <div className={`relative ${loading || error ? "hidden" : "block"}`}>
          {rendering && (
            <div className="absolute top-2 right-2 rounded-md bg-slate-900/80 px-2 py-1 text-[10px] text-slate-300 backdrop-blur-xs flex items-center gap-1.5 z-10">
              <RefreshCw className="h-3 w-3 animate-spin text-emerald-400" />
              <span>{km ? "កំពុងដំណើរការ..." : "Rendering..."}</span>
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="rounded-lg shadow-2xl bg-white max-w-full block"
          />
        </div>
      </div>

      {/* Reader Bottom Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          {km ? "មើលផ្ទាល់ក្នុងគេហទំព័រ (100% In-App Direct Viewer)" : "Direct in-app reader: Fully active and visible without external apps"}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || loading}
            className="hover:text-emerald-400 disabled:opacity-30 transition"
          >
            ← {km ? "ទំព័រមុន" : "Previous"}
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || loading}
            className="hover:text-emerald-400 disabled:opacity-30 transition"
          >
            {km ? "ទំព័របន្ទាប់" : "Next"} →
          </button>
        </div>
      </div>
    </div>
  );
}
