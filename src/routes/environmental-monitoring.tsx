import { useRef, useState } from "react";
import { ExternalLink, Maximize2, RefreshCw, Leaf } from "lucide-react";
import { useI18n } from "../lib/i18n";

export const monitoringApp =
  "https://ministry-of-mines-and-energy.projects.earthengine.app/view/mining-monitoring-dashboard";
export default function EnvironmentalMonitoring() {
  const { lang } = useI18n();
  const kh = lang === "km";
  const frame = useRef<HTMLIFrameElement>(null);
  const [version, setVersion] = useState(0);
  const [notice, setNotice] = useState("");
  const fullscreen = async () => {
    try {
      await frame.current?.requestFullscreen();
    } catch {
      setNotice(
        "Full screen is unavailable in this browser. Use Open original dashboard.",
      );
    }
  };
  return (
    <section className="mx-auto w-full max-w-[1800px] px-4 py-10 lg:px-10">
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 md:p-9">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-emerald-800">
          <Leaf size={17} />
          Google Earth Engine
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
          {kh ? "ផ្ទាំងតាមដានបរិស្ថាន" : "Environmental Monitoring Dashboard"}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          {kh
            ? "ប្រើប្រាស់កម្មវិធីតាមដានវិស័យរ៉ែដោយផ្ទាល់ពី Google Earth Engine។"
            : "Explore the live Mining Monitoring Dashboard in Google Earth Engine. Use the tools inside the dashboard to interact with its maps and monitoring results."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={monitoringApp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <ExternalLink size={16} />
            {kh ? "បើកកម្មវិធីដើម" : "Open original dashboard"}
          </a>
          <button className="btn btn-outline" onClick={fullscreen}>
            <Maximize2 size={16} />
            {kh ? "ពេញអេក្រង់" : "Full screen"}
          </button>
          <button
            className="btn btn-outline"
            onClick={() => setVersion((value) => value + 1)}
          >
            <RefreshCw size={16} />
            {kh ? "ផ្ទុកផ្ទាំងតាមដានឡើងវិញ" : "Reload dashboard"}
          </button>
          <a href="/geodata" className="btn btn-outline">
            GeoData layers
          </a>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/50 px-5 py-3 text-xs">
          <span className="flex items-center gap-2 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            {kh ? "ការតាមដានវិស័យរ៉ែ · កម្មវិធី Earth Engine" : "Mining monitoring · Earth Engine app"}
          </span>
          <span>
            {kh ? "បង្ហោះដោយ ministry-of-mines-and-energy.projects.earthengine.app" : "Hosted by ministry-of-mines-and-energy.projects.earthengine.app"}
          </span>
        </div>
        <iframe
          ref={frame}
          key={version}
          src={monitoringApp}
          title="Environmental Monitoring Dashboard — Mining Monitoring Google Earth Engine app"
          className="block h-[78vh] min-h-[600px] w-full bg-white"
          allow="fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      {notice && (
        <p role="status" className="mt-4 text-sm">
          {notice}
        </p>
      )}
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {kh
          ? "ទំព័រនេះបង្ហាញកម្មវិធី Earth Engine ដើម។ សំណុំទិន្នន័យ ការវិភាគ លក្ខខណ្ឌចូលប្រើ និងភាពអាចរកបានរបស់កម្មវិធី ត្រូវបានគ្រប់គ្រងដោយម្ចាស់កម្មវិធី។ ប្រសិនបើផ្ទាំងបង្កប់មិនដំណើរការ សូមប្រើ «បើកកម្មវិធីដើម»។"
          : "This page displays the original Earth Engine app. Its datasets, analysis, access requirements and availability are managed by the app owner. If the embedded dashboard does not load, use Open original dashboard."}
      </p>
    </section>
  );
}
