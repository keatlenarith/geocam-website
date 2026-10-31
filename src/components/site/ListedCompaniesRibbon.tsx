import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";
import listedCompaniesData from "../../../data/listed-companies.json" with { type: "json" };
import { ExternalLink, X, Building2, MapPin, Layers, Calendar, AlertCircle } from "lucide-react";

export interface ListedCompany {
  exchange: string;
  ticker: string;
  company_en: string;
  company_kh: string;
  asset_en: string;
  asset_kh: string;
  province: string;
  commodity: string;
  status: "producing" | "exploration" | "development" | "historical";
  note?: string;
  sourceUrl?: string;
  lastChecked: string;
  unverified?: boolean;
}

export function ListedCompaniesRibbon() {
  const { lang } = useI18n();
  const kh = lang === "km";
  const [selectedCompany, setSelectedCompany] = useState<ListedCompany | null>(null);

  const companies = listedCompaniesData as ListedCompany[];
  // Duplicate items for continuous seamless loop
  const duplicatedItems = [...companies, ...companies];

  const getStatusDot = (status: ListedCompany["status"]) => {
    switch (status) {
      case "producing":
        return {
          color: "bg-emerald-500",
          titleEn: "Producing / Active",
          titleKm: "កំពុងដំណើរការផលិតកម្ម",
        };
      case "development":
      case "exploration":
        return {
          color: "bg-amber-500",
          titleEn: "Development / Exploration",
          titleKm: "កំពុងអភិវឌ្ឍន៍ / រុករក",
        };
      case "historical":
      default:
        return {
          color: "bg-slate-400",
          titleEn: "Historical / Inactive",
          titleKm: "ប្រវត្តិ / អសកម្ម",
        };
    }
  };

  const getExchangeBadgeStyle = (exchange: string) => {
    if (exchange.includes("ASX")) {
      return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    }
    if (exchange.includes("TSXV")) {
      return "bg-sky-500/20 text-sky-300 border-sky-500/40";
    }
    if (exchange.includes("HKEX")) {
      return "bg-rose-500/20 text-rose-300 border-rose-500/40";
    }
    if (exchange.includes("SSE")) {
      return "bg-red-500/20 text-red-300 border-red-500/40";
    }
    if (exchange.includes("SET")) {
      return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    }
    return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
  };

  return (
    <>
      <div
        className="relative z-20 w-full overflow-hidden border-b border-slate-800 bg-[#091124] text-white shadow-inner"
        role="region"
        aria-label={kh ? "ក្រុមហ៊ុនចុះបញ្ជី" : "Listed Companies"}
      >
        <div className="flex items-center">
          {/* Left Fixed Label with Amber Dot */}
          <div className="relative z-10 flex shrink-0 items-center gap-2 border-r border-slate-800/80 bg-[#0b162f] px-4 py-2.5 shadow-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            </span>
            <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-slate-200">
              {kh ? "ក្រុមហ៊ុនចុះបញ្ជី" : "LISTED COMPANIES"}
            </span>
          </div>

          {/* Scrolling Marquee Ribbon - LEFT to RIGHT (Seamless loop) */}
          <div
            className="gc-ticker-container flex-1 overflow-hidden py-2"
            tabIndex={0}
            aria-live="off"
          >
            <div className="gc-ticker-track-reverse flex items-center gap-6">
              {duplicatedItems.map((item, idx) => {
                const companyName = kh ? item.company_kh : item.company_en;
                const assetDesc = kh ? item.asset_kh : item.asset_en;
                const statusDot = getStatusDot(item.status);

                return (
                  <button
                    key={`${item.ticker}-${idx}`}
                    type="button"
                    onClick={() => setSelectedCompany(item)}
                    className="group inline-flex shrink-0 items-center gap-2.5 rounded-lg px-2.5 py-1 text-xs transition duration-150 hover:bg-slate-800/60 focus:outline-hidden focus:ring-1 focus:ring-amber-400 text-left cursor-pointer"
                    title={kh ? "ចុចដើម្បីមើលព័ត៌មានលម្អិត" : "Click to view company details"}
                  >
                    {/* EXCHANGE pill badge */}
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide ${getExchangeBadgeStyle(
                        item.exchange
                      )}`}
                    >
                      {item.exchange}
                    </span>

                    {/* TICKER */}
                    <span className="font-mono font-bold text-amber-300 tracking-wider">
                      {item.ticker}
                    </span>

                    {/* Company - Asset, Province */}
                    <span className="font-medium text-slate-200 transition group-hover:text-amber-300">
                      {companyName} - {assetDesc}
                      {item.province ? `, ${item.province}` : ""}
                    </span>

                    {/* Status Dot */}
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${statusDot.color}`}
                      title={kh ? statusDot.titleKm : statusDot.titleEn}
                    />

                    {/* Optional small tag e.g. [Unverified] */}
                    {item.unverified && (
                      <span className="font-mono text-[11px] font-semibold text-slate-400">
                        [{kh ? "មិនទាន់ផ្ទៀងផ្ទាត់" : "Unverified"}]
                      </span>
                    )}

                    {/* Arrow */}
                    <span className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-amber-400">
                      →
                    </span>

                    <span className="mx-1 text-slate-700" aria-hidden="true">
                      |
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal / Card */}
      {selectedCompany && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedCompany(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Building2 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[11px] font-bold border ${getExchangeBadgeStyle(
                        selectedCompany.exchange
                      )}`}
                    >
                      {selectedCompany.exchange}: {selectedCompany.ticker}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        selectedCompany.status === "producing"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-amber-950 text-amber-300 border border-amber-800"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${getStatusDot(selectedCompany.status).color}`}
                      />
                      <span>
                        {kh
                          ? getStatusDot(selectedCompany.status).titleKm
                          : getStatusDot(selectedCompany.status).titleEn}
                      </span>
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    {kh ? selectedCompany.company_kh : selectedCompany.company_en}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Details Grid */}
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400">
                  {kh ? "ទ្រព្យសកម្ម និងគម្រោង" : "Asset & Projects"}
                </span>
                <p className="mt-0.5 font-medium text-slate-200">
                  {kh ? selectedCompany.asset_kh : selectedCompany.asset_en}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1">
                    <MapPin size={12} className="text-slate-500" />
                    {kh ? "ខេត្ត / ទីតាំង" : "Province / Location"}
                  </span>
                  <p className="mt-0.5 text-slate-200 font-medium">
                    {selectedCompany.province || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1">
                    <Layers size={12} className="text-slate-500" />
                    {kh ? "ធនធាន / រ៉ែ" : "Commodity / Resource"}
                  </span>
                  <p className="mt-0.5 text-slate-200 font-medium">
                    {selectedCompany.commodity}
                  </p>
                </div>
              </div>

              {selectedCompany.note && (
                <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800/80">
                  <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
                    {kh ? "កំណត់សម្គាល់" : "Notes"}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedCompany.note}
                  </p>
                </div>
              )}

              {/* Source & Last Checked */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  <span>
                    {kh ? "បានត្រួតពិនិត្យចុងក្រោយ៖ " : "Last checked: "}
                    {selectedCompany.lastChecked}
                  </span>
                </span>
                {selectedCompany.sourceUrl && (
                  <a
                    href={selectedCompany.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:underline font-semibold"
                  >
                    <span>{kh ? "ប្រភពផ្លូវការ" : "Official Source"}</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>

            {/* Mandatory Disclaimer */}
            <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <span>
                {kh
                  ? "ព័ត៌មានសម្រាប់តែជាឯកសារយោងប៉ុណ្ណោះ មិនមែនជាការណែនាំវិនិយោគទេ។ សូមផ្ទៀងផ្ទាត់ជាមួយផ្សារមូលបត្រផ្លូវការ។"
                  : "Information only, not investment advice. Verify with the exchange."}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
