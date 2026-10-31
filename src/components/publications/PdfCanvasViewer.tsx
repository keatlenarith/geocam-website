import React, { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  RefreshCw,
  AlertCircle,
  FileText,
  ChevronUp,
  ChevronDown,
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

interface PageItemProps {
  pageNumber: number;
  pdfDoc: any;
  scale: number;
  containerWidth: number;
}

// Individual Continuous Page Component with Lazy / Visible Rendering
const ContinuousPdfPage = React.memo(function ContinuousPdfPage({
  pageNumber,
  pdfDoc,
  scale,
  containerWidth,
}: PageItemProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pageContainerRef = useRef<HTMLDivElement | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 600,
    height: 850,
  });

  // IntersectionObserver to only render canvas when scrolled into or near viewport
  useEffect(() => {
    const el = pageContainerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            // Keep memory optimal on very long documents
            setIsVisible(false);
          }
        });
      },
      { rootMargin: "600px 0px 600px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fetch initial unrendered dimensions so container reserves proper scroll height
  useEffect(() => {
    if (!pdfDoc) return;
    let active = true;

    pdfDoc.getPage(pageNumber).then((page: any) => {
      if (!active) return;
      const unscaled = page.getViewport({ scale: 1 });
      let targetScale = scale;
      if (containerWidth > 100 && containerWidth < 768) {
        targetScale = Math.min(scale, Math.max(0.6, (containerWidth - 32) / unscaled.width));
      }
      const vp = page.getViewport({ scale: targetScale });
      setDimensions({ width: Math.floor(vp.width), height: Math.floor(vp.height) });
    });

    return () => {
      active = false;
    };
  }, [pdfDoc, pageNumber, scale, containerWidth]);

  // Render to canvas when visible in viewport
  useEffect(() => {
    if (!pdfDoc || !isVisible || !canvasRef.current) return;

    let renderTask: any = null;
    let active = true;

    pdfDoc.getPage(pageNumber).then((page: any) => {
      if (!active || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      let targetScale = scale;
      if (containerWidth > 100 && containerWidth < 768) {
        const unscaled = page.getViewport({ scale: 1 });
        targetScale = Math.min(scale, Math.max(0.6, (containerWidth - 32) / unscaled.width));
      }

      const viewport = page.getViewport({ scale: targetScale });
      const pixelRatio = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      renderTask = page.render({
        canvasContext: context,
        viewport,
      });

      return renderTask.promise.then(() => {
        if (active) setIsRendered(true);
      });
    }).catch((err: any) => {
      if (err?.name !== "RenderingCancelledException") {
        console.warn(`Render error on page ${pageNumber}:`, err);
      }
    });

    return () => {
      active = false;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch {}
      }
    };
  }, [pdfDoc, pageNumber, scale, isVisible, containerWidth]);

  return (
    <div
      ref={pageContainerRef}
      id={`pdf-page-${pageNumber}`}
      className="relative my-4 flex flex-col items-center justify-center transition-all"
      style={{ minHeight: `${dimensions.height}px`, minWidth: `${dimensions.width}px` }}
    >
      <div className="relative rounded-lg bg-white shadow-2xl overflow-hidden border border-slate-700/50">
        {(!isVisible || !isRendered) && (
          <div
            className="flex flex-col items-center justify-center bg-slate-800/40 text-slate-400"
            style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
          >
            <RefreshCw className="h-6 w-6 animate-spin text-emerald-400 mb-2 opacity-60" />
            <span className="text-xs font-mono">Page {pageNumber}</span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className={`${isVisible && isRendered ? "block" : "hidden"} bg-white`}
        />
      </div>

      <span className="mt-2 select-none text-[11px] font-medium text-slate-400">
        - {pageNumber} -
      </span>
    </div>
  );
});

export default function PdfCanvasViewer({ pdfUrl, title, km = false }: PdfCanvasViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentVisiblePage, setCurrentVisiblePage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.25);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  // Resize listener
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Load Document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);
    setCurrentVisiblePage(1);

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

  // Track scroll position to update current page indicator
  const handleScroll = useCallback(() => {
    const scrollContainer = scrollAreaRef.current;
    if (!scrollContainer || totalPages === 0) return;

    const scrollTop = scrollContainer.scrollTop;
    const containerMid = scrollTop + scrollContainer.clientHeight / 3;

    for (let i = 1; i <= totalPages; i++) {
      const pageEl = document.getElementById(`pdf-page-${i}`);
      if (pageEl) {
        const top = pageEl.offsetTop;
        const bottom = top + pageEl.clientHeight;
        if (containerMid >= top && containerMid <= bottom) {
          setCurrentVisiblePage(i);
          break;
        }
      }
    }
  }, [totalPages]);

  const scrollToPage = (pageNum: number) => {
    const target = Math.max(1, Math.min(totalPages, pageNum));
    const pageEl = document.getElementById(`pdf-page-${target}`);
    if (pageEl && scrollAreaRef.current) {
      pageEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
      {/* Sticky Top Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 bg-slate-800 px-4 py-3 text-white sticky top-0 z-20">
        {/* Document Title */}
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={18} className="text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold truncate max-w-[200px] sm:max-w-md">
            {title}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scroll Page Indicator & Quick Jump */}
          <div className="flex items-center rounded-lg bg-slate-900/90 border border-slate-700 px-2 py-1 text-xs">
            <button
              type="button"
              onClick={() => scrollToPage(currentVisiblePage - 1)}
              disabled={currentVisiblePage <= 1 || loading}
              className="p-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300"
              title="Scroll Up"
            >
              <ChevronUp size={16} />
            </button>
            <span className="px-2 font-mono font-medium text-slate-200">
              {km ? "ទំព័រ" : "Page"} {currentVisiblePage} / {totalPages || 1}
            </span>
            <button
              type="button"
              onClick={() => scrollToPage(currentVisiblePage + 1)}
              disabled={currentVisiblePage >= totalPages || loading}
              className="p-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300"
              title="Scroll Down"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Continuous Zoom Controls */}
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

      {/* Continuous Vertical Scroll Area */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className={`relative overflow-y-auto overflow-x-hidden bg-slate-950 p-2 sm:p-6 scroll-smooth ${
          isFullscreen ? "h-[calc(100vh-57px)]" : "h-[80vh] min-h-[600px]"
        }`}
      >
        {loading && (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <RefreshCw className="h-9 w-9 animate-spin text-emerald-500 mb-3" />
            <p className="text-sm font-semibold">
              {km ? "កំពុងរៀបចំឯកសារ PDF សម្រាប់រមូរអានផ្ទាល់..." : "Preparing continuous document scroll..."}
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-12 bg-slate-900 rounded-xl border border-rose-900/50">
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

        {/* All pages rendered sequentially in a continuous vertical column */}
        {!loading && !error && pdfDoc && (
          <div className="flex flex-col items-center w-full">
            {Array.from({ length: totalPages }, (_, idx) => (
              <ContinuousPdfPage
                key={`page-${idx + 1}`}
                pageNumber={idx + 1}
                pdfDoc={pdfDoc}
                scale={scale}
                containerWidth={containerWidth}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reader Bottom Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          {km
            ? "រមូរចុះក្រោមដើម្បីអានទំព័របន្ទាប់ដោយផ្ទាល់ (Continuous Vertical Scroll)"
            : "Scroll down freely with your mouse wheel, trackpad, or finger to read all pages continuously"}
        </span>
        <span className="font-mono text-slate-300">
          {currentVisiblePage} / {totalPages} {km ? "ទំព័រ" : "pages"}
        </span>
      </div>
    </div>
  );
}
