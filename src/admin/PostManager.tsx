import { useState, useEffect, useRef } from "react";
import {
  fetchNewsDrafts,
  isManagedNews,
  saveNewsItem,
  deleteNewsItem,
  togglePublishNews,
  SEED_UUID_MAP,
  type NewsItem,
} from "../lib/news-service";
import { cleanPostHtml } from "./posts";
import { FOCUS_TOPICS, type FocusTopic } from "../features/research/focus-topics-data";
import { defaultPageData } from "./page-data";
import { supabase } from "../lib/supabase";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Globe,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Calendar,
  Tag,
  FileText,
  Upload,
  BarChart2,
  Table as TableIcon,
  Eye,
  Code,
  Heading2,
  Bold,
  Italic,
  List,
  Quote,
  Link as LinkIcon,
  Layers,
  BookOpen,
  Crop,
} from "lucide-react";
import { translateText } from "../lib/translation";
import { ImageCropperModal } from "../visual-cms/ImageCropperModal";

export type ContentKind = "news" | "topic" | "page";

export interface UnifiedContentItem {
  id: string;
  kind: ContentKind;
  title: string;
  titleKm: string;
  tag: string;
  date: string;
  image: string;
  excerpt: string;
  excerptKm: string;
  content: string;
  contentKm: string;
  status: "published" | "draft";
  updatedAt?: string;
  route?: string;
  topicKey?: string;
}

const PHOTO_PRESETS = [
  {
    label: "🏔️ Field Training Outcrop",
    url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    caption: "Geological field mapping and outcrop observation in western Cambodia.",
  },
  {
    label: "🌊 Riverbank & Geohazards",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    caption: "Fluvial sediment dynamics and riverbank erosion survey.",
  },
  {
    label: "🏛️ Annual Geoscience Forum",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    caption: "Delegates and researchers at the Cambodian Geoscience Conference.",
  },
  {
    label: "🧪 Geochemical Lab Assays",
    url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    caption: "Spectrometry and laboratory geochemical assay analysis.",
  },
  {
    label: "💎 Mineral Crystals & Ores",
    url: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80",
    caption: "Crystalline mineral specimens collected during geological reconnaissance.",
  },
  {
    label: "🛰️ Satellite & Geophysics",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    caption: "Multispectral remote sensing and satellite terrain analysis.",
  },
];

const CATEGORIES = [
  "Education",
  "Geohazards",
  "Society",
  "Geochemistry",
  "Tectonics",
  "Mining",
  "Fieldwork",
  "Core Pages",
  "Science & Maps",
  "Tools & Portals",
];

const TABLE_TEMPLATES = [
  {
    name: "Geological Sample Dataset",
    desc: "Structured sample inventory with locations, lithology, and assay notes",
    html: `<div class="overflow-x-auto my-6">
  <table class="w-full text-left text-sm border-collapse border border-slate-200">
    <thead>
      <tr class="bg-slate-100 border-b border-slate-200">
        <th class="p-3 font-semibold text-slate-700">Sample ID</th>
        <th class="p-3 font-semibold text-slate-700">Formation / Location</th>
        <th class="p-3 font-semibold text-slate-700">Lithology</th>
        <th class="p-3 font-semibold text-slate-700">Age / Stratigraphy</th>
        <th class="p-3 font-semibold text-slate-700">Assay / Findings</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-slate-100 hover:bg-slate-50">
        <td class="p-3 font-mono text-xs">GC-2026-001</td>
        <td class="p-3">Cardamom Range, Pursat</td>
        <td class="p-3">Meta-sandstone / Quartzite</td>
        <td class="p-3">Upper Triassic</td>
        <td class="p-3 text-emerald-700 font-medium">Au 1.42 g/t; Cu 0.18%</td>
      </tr>
      <tr class="border-b border-slate-100 hover:bg-slate-50">
        <td class="p-3 font-mono text-xs">GC-2026-002</td>
        <td class="p-3">Kampot Karst Plateau</td>
        <td class="p-3">Micritic Limestone</td>
        <td class="p-3">Permian (Sisophon Fmt)</td>
        <td class="p-3 text-slate-600">CaCO3 94.2%; Mg 1.1%</td>
      </tr>
      <tr class="border-b border-slate-100 hover:bg-slate-50">
        <td class="p-3 font-mono text-xs">GC-2026-003</td>
        <td class="p-3">Ratanakiri Volcanic Field</td>
        <td class="p-3">Alkali Basalt (Gem-bearing)</td>
        <td class="p-3">Pleistocene</td>
        <td class="p-3 text-emerald-700 font-medium">Zircon & Corundum megacrysts</td>
      </tr>
    </tbody>
  </table>
</div>`,
  },
  {
    name: "Lithostratigraphic Summary Table",
    desc: "Summary table of Cambodian geological units, lithologies, and regional sutures",
    html: `<div class="overflow-x-auto my-6">
  <table class="w-full text-left text-sm border-collapse border border-slate-200">
    <thead>
      <tr class="bg-emerald-50 border-b border-emerald-200 text-emerald-950">
        <th class="p-3 font-bold">Era / Period</th>
        <th class="p-3 font-bold">Lithostratigraphic Unit</th>
        <th class="p-3 font-bold">Dominant Rock Types</th>
        <th class="p-3 font-bold">Tectonic Environment</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-slate-100">
        <td class="p-3 font-semibold text-slate-900">Quaternary (0–2.6 Ma)</td>
        <td class="p-3">Alluvium &amp; Young Basalts</td>
        <td class="p-3">Silt, sand, flood basalts</td>
        <td class="p-3">Mekong Delta subsidence</td>
      </tr>
      <tr class="border-b border-slate-100">
        <td class="p-3 font-semibold text-slate-900">Cretaceous (66–145 Ma)</td>
        <td class="p-3">Cardamome &amp; Dangrek Sandstones</td>
        <td class="p-3">Red continental sandstones</td>
        <td class="p-3">Intracontinental sag basin</td>
      </tr>
      <tr class="border-b border-slate-100">
        <td class="p-3 font-semibold text-slate-900">Permo-Triassic (200–299 Ma)</td>
        <td class="p-3">Sisophon / Kampot Carbonates</td>
        <td class="p-3">Platform reef limestones</td>
        <td class="p-3">Indosinian collisional suture</td>
      </tr>
    </tbody>
  </table>
</div>`,
  },
];

const CHART_TEMPLATES = [
  {
    name: "Mineral Composition Assay (Horizontal Bars)",
    desc: "Clean, responsive CSS bar chart comparing geological ore grades and minerals",
    html: `<div class="my-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
  <h4 class="text-sm font-bold text-slate-900 mb-1">Mineralogical Composition Assay</h4>
  <p class="text-xs text-slate-500 mb-4">Quantitative X-ray fluorescence (XRF) whole-rock proportions (%)</p>
  <div class="space-y-3">
    <div>
      <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
        <span>Silica (SiO2)</span>
        <span>64.8%</span>
      </div>
      <div class="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <div class="h-full rounded-full bg-emerald-600" style="width: 64.8%"></div>
      </div>
    </div>
    <div>
      <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
        <span>Alumina (Al2O3)</span>
        <span>15.2%</span>
      </div>
      <div class="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <div class="h-full rounded-full bg-teal-500" style="width: 15.2%"></div>
      </div>
    </div>
    <div>
      <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
        <span>Iron Oxides (Fe2O3)</span>
        <span>8.4%</span>
      </div>
      <div class="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <div class="h-full rounded-full bg-amber-500" style="width: 8.4%"></div>
      </div>
    </div>
    <div>
      <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
        <span>Calcium &amp; Magnesium (CaO + MgO)</span>
        <span>6.1%</span>
      </div>
      <div class="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <div class="h-full rounded-full bg-indigo-500" style="width: 6.1%"></div>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    name: "Sediment Grain Size Distribution",
    desc: "Fluvial sediment particle distribution graph for riverbank & Mekong surveys",
    html: `<div class="my-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
  <h4 class="text-sm font-bold text-slate-900 mb-1">Fluvial Sediment Particle Size Analysis</h4>
  <p class="text-xs text-slate-500 mb-4">Mekong River Lower Reach core depth 4.5m</p>
  <div class="grid grid-cols-4 gap-2 text-center">
    <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
      <div class="text-2xl font-black text-emerald-700">42%</div>
      <div class="text-xs font-semibold text-slate-700 mt-1">Fine Sand</div>
      <div class="text-[10px] text-slate-400">0.063–0.2 mm</div>
    </div>
    <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
      <div class="text-2xl font-black text-teal-700">31%</div>
      <div class="text-xs font-semibold text-slate-700 mt-1">Silt</div>
      <div class="text-[10px] text-slate-400">0.002–0.063 mm</div>
    </div>
    <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
      <div class="text-2xl font-black text-indigo-700">18%</div>
      <div class="text-xs font-semibold text-slate-700 mt-1">Medium Sand</div>
      <div class="text-[10px] text-slate-400">0.2–0.6 mm</div>
    </div>
    <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
      <div class="text-2xl font-black text-amber-700">9%</div>
      <div class="text-xs font-semibold text-slate-700 mt-1">Clay</div>
      <div class="text-[10px] text-slate-400">&lt;0.002 mm</div>
    </div>
  </div>
</div>`,
  },
];

function topicToUnifiedItem(topic: FocusTopic): UnifiedContentItem {
  const contentEn = `
<h2>${topic.titleEn}</h2>
<p class="lead text-lg font-medium text-slate-700">${topic.leadEn}</p>
<div class="my-6 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
  <h4 class="font-bold text-emerald-950 mb-2">Key Geological Highlights:</h4>
  <ul class="list-disc pl-5 space-y-1 text-slate-700">
    ${topic.keyHighlightsEn.map((h) => `<li>${h}</li>`).join("\n    ")}
  </ul>
</div>
${topic.sections
  .map(
    (s) => `
<h3>${s.titleEn}</h3>
${s.bodyEn.map((b) => `<p>${b}</p>`).join("\n")}
${s.bulletsEn ? `<ul class="list-disc pl-5 my-2 space-y-1">${s.bulletsEn.map((b) => `<li>${b}</li>`).join("\n")}</ul>` : ""}
${s.calloutEn ? `<blockquote class="border-l-4 border-emerald-600 bg-emerald-50/50 p-4 rounded-r-lg my-4 italic">${s.calloutEn}</blockquote>` : ""}
`,
  )
  .join("\n")}
`.trim();

  const contentKm = `
<h2>${topic.titleKm}</h2>
<p class="lead text-lg font-medium text-slate-700">${topic.leadKm}</p>
<div class="my-6 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
  <h4 class="font-bold text-emerald-950 mb-2">ចំណុចគន្លឹះសំខាន់ៗ:</h4>
  <ul class="list-disc pl-5 space-y-1 text-slate-700">
    ${topic.keyHighlightsKm.map((h) => `<li>${h}</li>`).join("\n    ")}
  </ul>
</div>
${topic.sections
  .map(
    (s) => `
<h3>${s.titleKm}</h3>
${s.bodyKm.map((b) => `<p>${b}</p>`).join("\n")}
${s.bulletsKm ? `<ul class="list-disc pl-5 my-2 space-y-1">${s.bulletsKm.map((b) => `<li>${b}</li>`).join("\n")}</ul>` : ""}
${s.calloutKm ? `<blockquote class="border-l-4 border-emerald-600 bg-emerald-50/50 p-4 rounded-r-lg my-4 italic">${s.calloutKm}</blockquote>` : ""}
`,
  )
  .join("\n")}
`.trim();

  return {
    id: `topic-${topic.slug}`,
    kind: "topic",
    title: topic.titleEn,
    titleKm: topic.titleKm,
    tag: topic.shortTitleEn,
    date: "2026-04-15",
    image: topic.image,
    excerpt: topic.leadEn,
    excerptKm: topic.leadKm,
    content: contentEn,
    contentKm: contentKm,
    status: "published",
    route: `/research/topic?id=${encodeURIComponent(topic.key)}`,
    topicKey: topic.key,
  };
}

function pageToUnifiedItem(route: string, data: (typeof defaultPageData)[string]): UnifiedContentItem {
  const contentEn = `
<h2>${data.headlineEn}</h2>
<p class="lead text-lg font-medium text-slate-700">${data.subEn}</p>
<p>Official page content for <strong>${data.titleEn}</strong>. Update typography, descriptions, and hero imagery.</p>
`.trim();

  const contentKm = `
<h2>${data.headlineKm}</h2>
<p class="lead text-lg font-medium text-slate-700">${data.subKm}</p>
<p>ខ្លឹមសារទំព័រផ្លូវការសម្រាប់ <strong>${data.titleKm}</strong>។ កែសម្រួលចំណងជើង អត្ថបទ និងរូបភាពតំណាង។</p>
`.trim();

  return {
    id: `page-${route.replace(/[\/\-_]/g, "_") || "home"}`,
    kind: "page",
    title: `${data.titleEn} (${route})`,
    titleKm: data.titleKm,
    tag: data.category,
    date: "2026-04-01",
    image: data.heroImage,
    excerpt: `${data.headlineEn} — ${data.subEn}`,
    excerptKm: `${data.headlineKm} — ${data.subKm}`,
    content: contentEn,
    contentKm: contentKm,
    status: "published",
    route,
  };
}

function newsToUnifiedItem(item: NewsItem): UnifiedContentItem {
  return {
    id: item.id,
    kind: "news",
    title: item.title,
    titleKm: item.titleKm,
    tag: item.tag,
    date: item.date,
    image: item.image,
    excerpt: item.excerpt,
    excerptKm: item.excerptKm,
    content: item.content,
    contentKm: item.contentKm,
    status: item.status,
    updatedAt: item.updatedAt,
    route: `/news/item?id=${encodeURIComponent(item.id)}`,
  };
}

function insertHtmlAtCursor(
  textarea: HTMLTextAreaElement | null,
  before: string,
  after: string = "",
  placeholder: string = "",
  currentValue: string,
  setter: (val: string) => void,
) {
  if (!textarea) {
    setter(currentValue + before + placeholder + after);
    return;
  }
  const start = textarea.selectionStart ?? currentValue.length;
  const end = textarea.selectionEnd ?? currentValue.length;
  const selected = currentValue.substring(start, end) || placeholder;
  const nextValue =
    currentValue.substring(0, start) +
    before +
    selected +
    after +
    currentValue.substring(end);
  setter(nextValue);
  setTimeout(() => {
    textarea.focus();
    const cursor = start + before.length + selected.length;
    textarea.setSelectionRange(cursor, cursor);
  }, 0);
}

function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(String(e.target?.result));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = String(e.target?.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PostManager() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [topicOverrides, setTopicOverrides] = useState<Record<string, Partial<UnifiedContentItem>>>({});
  const [pageOverrides, setPageOverrides] = useState<Record<string, Partial<UnifiedContentItem>>>({});
  
  // Category tabs: All, News, Topics, Pages
  const [activeTab, setActiveTab] = useState<"all" | "news" | "topics" | "pages">("all");
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const [editingItem, setEditingItem] = useState<UnifiedContentItem | null>(null);
  const [editingKind, setEditingKind] = useState<ContentKind>("news");
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Editor Form Fields
  const [title, setTitle] = useState("");
  const [titleKm, setTitleKm] = useState("");
  const [tag, setTag] = useState("Education");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [excerptKm, setExcerptKm] = useState("");
  const [content, setContent] = useState("");
  const [contentKm, setContentKm] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");

  // Rich editor view mode state (code vs preview)
  const [viewModeEn, setViewModeEn] = useState<"code" | "preview">("code");
  const [viewModeKm, setViewModeKm] = useState<"code" | "preview">("code");

  // Active popover modals for image / chart / table insertion
  const [activeInserter, setActiveInserter] = useState<{
    target: "content" | "contentKm";
    type: "photo" | "chart" | "table";
  } | null>(null);

  // Active crop modal state
  const [cropperModal, setCropperModal] = useState<{
    imageUrl: string;
    onApply: (cropped: string) => void;
  } | null>(null);

  // Custom photo picker state
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [photoCaptionInput, setPhotoCaptionInput] = useState("");
  const [photoAltInput, setPhotoAltInput] = useState("");

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const contentKmTextareaRef = useRef<HTMLTextAreaElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const bodyFileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [baseline, setBaseline] = useState("");
  const [pending, setPending] = useState<null | (() => void)>(null);
  const mounted = useRef(true),
    dialog = useRef<HTMLDivElement>(null),
    previousFocus = useRef<HTMLElement | null>(null);

  const form = JSON.stringify([
    title,
    titleKm,
    tag,
    date,
    image,
    excerpt,
    excerptKm,
    content,
    contentKm,
    status,
  ]);
  const dirty = (isNew || !!editingItem) && form !== baseline;
  const state = useRef({ dirty, saving });
  state.current = { dirty, saving };

  // Build unified items array combining News, Focus Topics, and Website Pages
  const unifiedItems: UnifiedContentItem[] = [
    // 1. News Posts
    ...newsItems.map(newsToUnifiedItem),
    // 2. 5 Research Focus Topics
    ...FOCUS_TOPICS.map((topic) => {
      const base = topicToUnifiedItem(topic);
      const over = topicOverrides[base.id] || {};
      return { ...base, ...over };
    }),
    // 3. 14 Website Pages
    ...Object.entries(defaultPageData).map(([route, pData]) => {
      const base = pageToUnifiedItem(route, pData);
      const over = pageOverrides[base.id] || {};
      return { ...base, ...over };
    }),
  ];

  const loadData = async () => {
    const rows = await fetchNewsDrafts();
    if (mounted.current) {
      setNewsItems(rows);
      try {
        const params = new URLSearchParams(window.location.search);
        const editId = params.get("edit");
        const isNewParam = params.get("new");
        if (editId) {
          const match = rows.find(
            (r) =>
              r.id === editId ||
              SEED_UUID_MAP[r.id] === editId ||
              Object.entries(SEED_UUID_MAP).some(
                ([k, v]) => (v === r.id || k === r.id) && (k === editId || v === editId),
              ),
          );
          if (match) {
            openEdit(newsToUnifiedItem(match));
          } else {
            // Check if it's a focus topic or page
            const topicMatch = FOCUS_TOPICS.find((t) => t.id === editId || t.slug === editId || `topic-${t.slug}` === editId);
            if (topicMatch) {
              openEdit(topicToUnifiedItem(topicMatch));
            }
          }
        } else if (isNewParam === "1" || isNewParam === "true") {
          openNew();
        }
      } catch {}
    }
  };

  useEffect(() => {
    mounted.current = true;
    loadData()
      .catch((e) => {
        if (mounted.current) setError(e.message || "Could not load content.");
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });
    return () => {
      mounted.current = false;
    };
  }, []);

  const guard = (action: () => void) => {
    if (state.current.saving) return;
    if (state.current.dirty) setPending(() => action);
    else action();
  };

  useEffect(() => {
    const unload = (e: BeforeUnloadEvent) => {
      if (state.current.dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    const click = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = (e.target as Element).closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (
        !a ||
        a.target === "_blank" ||
        a.hasAttribute("download") ||
        (!state.current.dirty && !state.current.saving)
      )
        return;
      e.preventDefault();
      e.stopPropagation();
      guard(() => location.assign(a.href));
    };
    const request = (e: Event) => {
      const proceed = (e as CustomEvent<{ proceed: () => void }>).detail
        ?.proceed;
      if (proceed) {
        e.preventDefault();
        guard(proceed);
      }
    };
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", click, true);
    window.addEventListener("geocam:request-navigation", request);
    return () => {
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", click, true);
      window.removeEventListener("geocam:request-navigation", request);
    };
  }, []);

  useEffect(() => {
    if (!pending) return;
    previousFocus.current = document.activeElement as HTMLElement;
    dialog.current?.focus();
    return () => previousFocus.current?.focus();
  }, [pending]);

  const close = () =>
    guard(() => {
      setIsNew(false);
      setEditingItem(null);
      setActiveInserter(null);
      setViewModeEn("code");
      setViewModeKm("code");
      try {
        const u = new URL(window.location.href);
        if (u.searchParams.has("edit") || u.searchParams.has("new")) {
          u.searchParams.delete("edit");
          u.searchParams.delete("new");
          window.history.replaceState({}, "", u.toString());
        }
      } catch {}
    });

  const populate = (item: UnifiedContentItem, newItem: boolean) => {
    setIsNew(newItem);
    setEditingItem(newItem ? null : item);
    setEditingKind(item.kind);
    setTitle(item.title);
    setTitleKm(item.titleKm);
    setTag(item.tag);
    setDate(item.date);
    setImage(item.image);
    setExcerpt(item.excerpt);
    setExcerptKm(item.excerptKm);
    setContent(item.content);
    setContentKm(item.contentKm);
    setStatus(item.status);
    setViewModeEn("code");
    setViewModeKm("code");
    setActiveInserter(null);
    setBaseline(
      JSON.stringify([
        item.title,
        item.titleKm,
        item.tag,
        item.date,
        item.image,
        item.excerpt,
        item.excerptKm,
        item.content,
        item.contentKm,
        item.status,
      ]),
    );
    setError("");
    setMessage("");
  };

  const openNew = () =>
    guard(() =>
      populate(
        {
          id: "",
          kind: "news",
          title: "",
          titleKm: "",
          tag: "Education",
          date: new Date().toISOString().slice(0, 10),
          image: PHOTO_PRESETS[0].url,
          excerpt: "",
          excerptKm: "",
          content: "",
          contentKm: "",
          status: "draft",
          updatedAt: "",
        },
        true,
      ),
    );

  const openEdit = (item: UnifiedContentItem) =>
    guard(() => {
      if (item.kind === "news") {
        const targetId = isManagedNews(item.id)
          ? item.id
          : SEED_UUID_MAP[item.id] || crypto.randomUUID();
        populate({ ...item, id: targetId }, false);
      } else {
        populate(item, false);
      }
    });

  const handleTranslateAll = () => {
    if (title && !titleKm && translateText(title) !== title)
      setTitleKm(translateText(title));
    if (excerpt && !excerptKm && translateText(excerpt) !== excerpt)
      setExcerptKm(translateText(excerpt));
    if (content && !contentKm && translateText(content) !== content)
      setContentKm(translateText(content));
    setMessage(
      "Known catalog phrases filled where available. New prose needs a Khmer translation; this is not a translation service.",
    );
  };

  const handleSave = async (publishNow = false): Promise<boolean> => {
    if (!title.trim()) {
      setError("Add an English title before saving or publishing.");
      return false;
    }
    setSaving(true);
    state.current.saving = true;
    setError("");
    setMessage("");
    try {
      if (editingKind === "news") {
        const saved = await saveNewsItem(
          {
            id: editingItem?.id,
            title: title.trim(),
            titleKm: titleKm.trim(),
            tag,
            date,
            image: image.trim(),
            excerpt: excerpt.trim(),
            excerptKm: excerptKm.trim(),
            content: content.trim(),
            contentKm: contentKm.trim(),
            status,
          },
          publishNow,
        );
        if (!mounted.current) return false;
        state.current.dirty = false;
        const unifiedSaved = newsToUnifiedItem(saved);
        populate(unifiedSaved, false);
        setNewsItems((rows) => [
          saved,
          ...rows.filter(
            (row) =>
              row.id !== saved.id &&
              row.id !== editingItem?.id &&
              SEED_UUID_MAP[row.id] !== saved.id,
          ),
        ]);
      } else if (editingKind === "topic") {
        // Save topic override
        const id = editingItem?.id || "topic-custom";
        const updatedItem: UnifiedContentItem = {
          id,
          kind: "topic",
          title: title.trim(),
          titleKm: titleKm.trim(),
          tag,
          date,
          image: image.trim(),
          excerpt: excerpt.trim(),
          excerptKm: excerptKm.trim(),
          content: content.trim(),
          contentKm: contentKm.trim(),
          status: publishNow ? "published" : status,
          route: editingItem?.route,
          topicKey: editingItem?.topicKey,
        };
        setTopicOverrides((prev) => ({ ...prev, [id]: updatedItem }));
        state.current.dirty = false;
        populate(updatedItem, false);
        // Persist to Supabase drafts / site content
        try {
          await supabase.from("site_content").upsert({
            id: `topic_${id}`,
            data: updatedItem,
            updated_at: new Date().toISOString(),
          });
        } catch {}
      } else if (editingKind === "page") {
        // Save page override
        const id = editingItem?.id || "page-custom";
        const updatedItem: UnifiedContentItem = {
          id,
          kind: "page",
          title: title.trim(),
          titleKm: titleKm.trim(),
          tag,
          date,
          image: image.trim(),
          excerpt: excerpt.trim(),
          excerptKm: excerptKm.trim(),
          content: content.trim(),
          contentKm: contentKm.trim(),
          status: publishNow ? "published" : status,
          route: editingItem?.route,
        };
        setPageOverrides((prev) => ({ ...prev, [id]: updatedItem }));
        state.current.dirty = false;
        populate(updatedItem, false);
        // Persist to Supabase drafts
        try {
          await supabase.from("site_content").upsert({
            id: `page_${id}`,
            data: updatedItem,
            updated_at: new Date().toISOString(),
          });
        } catch {}
      }

      setMessage(
        publishNow
          ? "Post published."
          : "Draft saved. The public version changes only when you publish.",
      );
      return true;
    } catch (failure) {
      if (mounted.current)
        setError(
          (failure as { message?: string })?.message ||
            "Could not save. Your edits are still here.",
        );
      return false;
    } finally {
      state.current.saving = false;
      if (mounted.current) setSaving(false);
    }
  };

  const handleDelete = async (item: UnifiedContentItem) => {
    if (item.kind !== "news") {
      alert("Core website pages and research focus topics cannot be permanently deleted.");
      return;
    }
    if (!window.confirm(`Delete “${item.title}” and its public version?`))
      return;
    setSaving(true);
    setError("");
    try {
      await deleteNewsItem(item.id);
      if (mounted.current) {
        setNewsItems((rows) =>
          rows.filter(
            (row) =>
              row.id !== item.id &&
              SEED_UUID_MAP[row.id] !== item.id &&
              row.id !== SEED_UUID_MAP[item.id],
          ),
        );
        setMessage("Post deleted.");
      }
    } catch (e) {
      if (mounted.current)
        setError(
          (e as { message?: string })?.message || "Could not delete post.",
        );
    } finally {
      if (mounted.current) setSaving(false);
    }
  };

  const handleTogglePublish = async (item: UnifiedContentItem) => {
    if (item.kind !== "news") {
      // Toggle published in override
      if (item.kind === "topic") {
        setTopicOverrides((prev) => ({
          ...prev,
          [item.id]: {
            ...prev[item.id],
            status: item.status === "published" ? "draft" : "published",
          },
        }));
      } else {
        setPageOverrides((prev) => ({
          ...prev,
          [item.id]: {
            ...prev[item.id],
            status: item.status === "published" ? "draft" : "published",
          },
        }));
      }
      setMessage(
        item.status === "published" ? "Post unpublished." : "Post published.",
      );
      return;
    }

    setSaving(true);
    setError("");
    try {
      const updated = await togglePublishNews(item.id);
      if (mounted.current && updated) {
        setNewsItems((rows) =>
          rows.map((row) =>
            row.id === updated.id ||
            row.id === item.id ||
            SEED_UUID_MAP[row.id] === updated.id
              ? updated
              : row,
          ),
        );
        setMessage(
          updated.status === "published"
            ? "Post published."
            : "Post unpublished.",
        );
      }
    } catch (e) {
      if (mounted.current)
        setError(
          (e as { message?: string })?.message ||
            "Could not change publication status.",
        );
    } finally {
      if (mounted.current) setSaving(false);
    }
  };

  const handleCoverFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      setImage(compressed);
      setMessage("Cover photo loaded.");
    } catch (err) {
      setError("Failed to read image file.");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const handleInsertUploadedPhoto = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !activeInserter) return;
    try {
      const compressed = await compressImageFile(file);
      const isKm = activeInserter.target === "contentKm";
      const textarea = isKm
        ? contentKmTextareaRef.current
        : contentTextareaRef.current;
      const val = isKm ? contentKm : content;
      const setter = isKm ? setContentKm : setContent;
      const figureHtml = `\n<figure class="geocam-figure my-6 mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs text-center">\n  <div class="geocam-img-box w-full overflow-hidden rounded-xl bg-white shadow-xs flex items-center justify-center">\n    <img src="${compressed}" alt="${photoAltInput || "Geological photo"}" class="w-full max-w-full h-auto max-h-[480px] object-contain rounded-xl mx-auto block" />\n  </div>\n  <figcaption class="mt-2.5 text-xs text-center text-slate-600 italic px-2 leading-relaxed">${photoCaptionInput || "Photo caption"}</figcaption>\n</figure>\n`;
      insertHtmlAtCursor(textarea, figureHtml, "", "", val, setter);
      setActiveInserter(null);
      setPhotoUrlInput("");
      setPhotoCaptionInput("");
      setPhotoAltInput("");
    } catch (err) {
      setError("Failed to upload image.");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const handleInsertCustomPhoto = () => {
    if (!activeInserter || !photoUrlInput.trim()) return;
    const isKm = activeInserter.target === "contentKm";
    const textarea = isKm
      ? contentKmTextareaRef.current
      : contentTextareaRef.current;
    const val = isKm ? contentKm : content;
    const setter = isKm ? setContentKm : setContent;
    const figureHtml = `\n<figure class="geocam-figure my-6 mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs text-center">\n  <div class="geocam-img-box w-full overflow-hidden rounded-xl bg-white shadow-xs flex items-center justify-center">\n    <img src="${photoUrlInput.trim()}" alt="${photoAltInput.trim() || "Article image"}" class="w-full max-w-full h-auto max-h-[480px] object-contain rounded-xl mx-auto block" />\n  </div>\n  <figcaption class="mt-2.5 text-xs text-center text-slate-600 italic px-2 leading-relaxed">${photoCaptionInput.trim() || "Figure caption"}</figcaption>\n</figure>\n`;
    insertHtmlAtCursor(textarea, figureHtml, "", "", val, setter);
    setActiveInserter(null);
    setPhotoUrlInput("");
    setPhotoCaptionInput("");
    setPhotoAltInput("");
  };

  const handleInsertPresetPhoto = (preset: (typeof PHOTO_PRESETS)[0]) => {
    if (!activeInserter) return;
    const isKm = activeInserter.target === "contentKm";
    const textarea = isKm
      ? contentKmTextareaRef.current
      : contentTextareaRef.current;
    const val = isKm ? contentKm : content;
    const setter = isKm ? setContentKm : setContent;
    const figureHtml = `\n<figure class="geocam-figure my-6 mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs text-center">\n  <div class="geocam-img-box w-full overflow-hidden rounded-xl bg-white shadow-xs flex items-center justify-center">\n    <img src="${preset.url}" alt="${preset.label}" class="w-full max-w-full h-auto max-h-[480px] object-contain rounded-xl mx-auto block" />\n  </div>\n  <figcaption class="mt-2.5 text-xs text-center text-slate-600 italic px-2 leading-relaxed">${preset.caption}</figcaption>\n</figure>\n`;
    insertHtmlAtCursor(textarea, figureHtml, "", "", val, setter);
    setActiveInserter(null);
  };

  const handleInsertChart = (chart: (typeof CHART_TEMPLATES)[0]) => {
    if (!activeInserter) return;
    const isKm = activeInserter.target === "contentKm";
    const textarea = isKm
      ? contentKmTextareaRef.current
      : contentTextareaRef.current;
    const val = isKm ? contentKm : content;
    const setter = isKm ? setContentKm : setContent;
    insertHtmlAtCursor(textarea, `\n${chart.html}\n`, "", "", val, setter);
    setActiveInserter(null);
  };

  const handleInsertTable = (tbl: (typeof TABLE_TEMPLATES)[0]) => {
    if (!activeInserter) return;
    const isKm = activeInserter.target === "contentKm";
    const textarea = isKm
      ? contentKmTextareaRef.current
      : contentTextareaRef.current;
    const val = isKm ? contentKm : content;
    const setter = isKm ? setContentKm : setContent;
    insertHtmlAtCursor(textarea, `\n${tbl.html}\n`, "", "", val, setter);
    setActiveInserter(null);
  };

  // Filter items by category tab, search, selected tag, status
  const filtered = unifiedItems.filter((item) => {
    // Tab filter
    if (activeTab === "news" && item.kind !== "news") return false;
    if (activeTab === "topics" && item.kind !== "topic") return false;
    if (activeTab === "pages" && item.kind !== "page") return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.titleKm.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Tag filter
    if (selectedTag !== "All" && item.tag !== selectedTag) return false;

    // Status filter
    if (statusFilter !== "all" && item.status !== statusFilter) return false;

    return true;
  });

  const newsCount = unifiedItems.filter((i) => i.kind === "news").length;
  const topicsCount = unifiedItems.filter((i) => i.kind === "topic").length;
  const pagesCount = unifiedItems.filter((i) => i.kind === "page").length;

  // Render WordPress rich toolbar above textarea
  const renderEditorToolbar = (target: "content" | "contentKm") => {
    const isKm = target === "contentKm";
    const textarea = isKm
      ? contentKmTextareaRef.current
      : contentTextareaRef.current;
    const val = isKm ? contentKm : content;
    const setter = isKm ? setContentKm : setContent;
    const mode = isKm ? viewModeKm : viewModeEn;
    const setMode = isKm ? setViewModeKm : setViewModeEn;

    return (
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-100/90 px-3 py-2 text-xs">
        {/* Formatting controls */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            title="Heading 2 (H2)"
            onClick={() =>
              insertHtmlAtCursor(
                textarea,
                "<h2>",
                "</h2>",
                "Section Heading",
                val,
                setter,
              )
            }
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            <Heading2 size={13} /> H2
          </button>
          <button
            type="button"
            title="Heading 3 (H3)"
            onClick={() =>
              insertHtmlAtCursor(
                textarea,
                "<h3>",
                "</h3>",
                "Subheading",
                val,
                setter,
              )
            }
            className="rounded px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            H3
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            title="Bold text"
            onClick={() =>
              insertHtmlAtCursor(
                textarea,
                "<strong>",
                "</strong>",
                "bold text",
                val,
                setter,
              )
            }
            className="rounded p-1 text-slate-700 hover:bg-slate-200"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            title="Italic text"
            onClick={() =>
              insertHtmlAtCursor(
                textarea,
                "<em>",
                "</em>",
                "italic text",
                val,
                setter,
              )
            }
            className="rounded p-1 text-slate-700 hover:bg-slate-200"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            title="Bullet list"
            onClick={() =>
              insertHtmlAtCursor(
                textarea,
                "\n<ul>\n  <li>",
                "</li>\n  <li>Second item</li>\n</ul>\n",
                "First item",
                val,
                setter,
              )
            }
            className="rounded p-1 text-slate-700 hover:bg-slate-200"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            title="Blockquote"
            onClick={() =>
              insertHtmlAtCursor(
                textarea,
                '\n<blockquote class="border-l-4 border-emerald-600 bg-emerald-50/50 p-4 rounded-r-lg my-4 italic text-slate-800">\n  ',
                "\n</blockquote>\n",
                "Quote or important insight here...",
                val,
                setter,
              )
            }
            className="rounded p-1 text-slate-700 hover:bg-slate-200"
          >
            <Quote size={14} />
          </button>
          <button
            type="button"
            title="Link"
            onClick={() =>
              insertHtmlAtCursor(
                textarea,
                '<a href="https://example.com" class="text-emerald-700 underline font-semibold">',
                "</a>",
                "Link text",
                val,
                setter,
              )
            }
            className="rounded p-1 text-slate-700 hover:bg-slate-200"
          >
            <LinkIcon size={14} />
          </button>
          <span className="text-slate-300">|</span>

          {/* Rich insertion buttons */}
          <button
            type="button"
            onClick={() => {
              const word = window.prompt("Enter word or text to insert at cursor:");
              if (word) {
                insertHtmlAtCursor(textarea, `<span>${word}</span>`, "", "", val, setter);
              }
            }}
            className="flex items-center gap-1 rounded bg-white px-2 py-1 text-xs font-semibold text-sky-800 border border-sky-200 shadow-xs hover:bg-sky-50"
            title="Insert word at cursor position"
          >
            <Plus size={12} /> + Word
          </button>
          <button
            type="button"
            onClick={() => setActiveInserter({ target, type: "photo" })}
            className="flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200 shadow-xs hover:bg-emerald-50"
          >
            <ImageIcon size={13} /> + Photo
          </button>
          <button
            type="button"
            onClick={() => {
              const match = val.match(/<img[^>]+src="([^">]+)"/);
              const initialUrl = match ? match[1] : image || PHOTO_PRESETS[0].url;
              const url = window.prompt("Enter or confirm image URL to crop:", initialUrl);
              if (url) {
                setCropperModal({
                  imageUrl: url,
                  onApply: (cropped) => {
                    if (match && val.includes(match[1])) {
                      setter(val.replace(match[1], cropped));
                    } else {
                      insertHtmlAtCursor(
                        textarea,
                        `\n<figure class="geocam-figure my-6 mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs text-center">\n  <div class="geocam-img-box w-full overflow-hidden rounded-xl bg-white shadow-xs flex items-center justify-center">\n    <img src="${cropped}" alt="Cropped figure" class="w-full max-w-full h-auto max-h-[480px] object-contain rounded-xl mx-auto block" />\n  </div>\n</figure>\n`,
                        "",
                        "",
                        val,
                        setter,
                      );
                    }
                  },
                });
              }
            }}
            className="flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-semibold text-violet-800 border border-violet-200 shadow-xs hover:bg-violet-50"
            title="Crop image in article"
          >
            <Crop size={13} /> ✂️ Crop
          </button>
          <button
            type="button"
            onClick={() => setActiveInserter({ target, type: "chart" })}
            className="flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-semibold text-teal-800 border border-teal-200 shadow-xs hover:bg-teal-50"
          >
            <BarChart2 size={13} /> + Graph / Chart
          </button>
          <button
            type="button"
            onClick={() => setActiveInserter({ target, type: "table" })}
            className="flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-semibold text-indigo-800 border border-indigo-200 shadow-xs hover:bg-indigo-50"
          >
            <TableIcon size={13} /> + Table
          </button>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center rounded-md border border-slate-200 bg-white p-0.5 shadow-xs">
          <button
            type="button"
            onClick={() => setMode("code")}
            className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition ${
              mode === "code"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code size={12} /> HTML
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition ${
              mode === "preview"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye size={12} /> Live Preview
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Hidden file inputs for direct image uploads */}
      <input
        type="file"
        ref={coverFileInputRef}
        onChange={handleCoverFileUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={bodyFileInputRef}
        onChange={handleInsertUploadedPhoto}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header & New Post Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            📰 All Website Content &amp; Posts
          </h2>
          <p className="text-sm text-slate-500">
            Unified content management for News, Research Focus Topics, and Website Pages with authentic live post editing.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
        >
          <Plus size={16} /> + Create New Post
        </button>
      </div>

      {/* Global alert messages */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error}
        </div>
      )}
      {message && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {message}
        </div>
      )}

      {/* Content Category Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
            activeTab === "all"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Layers size={16} /> All Content ({unifiedItems.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("news")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
            activeTab === "news"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <FileText size={16} /> News &amp; Stories ({newsCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("topics")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
            activeTab === "topics"
              ? "bg-teal-700 text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <BookOpen size={16} /> Research Focus Topics ({topicsCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pages")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
            activeTab === "pages"
              ? "bg-indigo-700 text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Globe size={16} /> Website Pages ({pagesCount})
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search content by title, route, or summary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
            <Filter size={14} />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-transparent font-medium focus:outline-none"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {(["all", "published", "draft"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                  statusFilter === s
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Unified Content Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="p-4">Cover</th>
              <th className="p-4">Title &amp; Summary</th>
              <th className="p-4">Type / Category</th>
              <th className="p-4">Date / Route</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  {loading
                    ? "Loading content..."
                    : "No content matches your criteria. Click \"+ Create New Post\" above to add one."}
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 w-28">
                    <img
                      src={item.image || PHOTO_PRESETS[0].url}
                      alt=""
                      className="h-16 w-24 rounded-lg object-cover border border-slate-200 shadow-xs"
                    />
                  </td>
                  <td className="p-4 max-w-md">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 line-clamp-1">
                      {item.title}
                    </div>
                    {item.titleKm && (
                      <div className="text-xs text-slate-500 line-clamp-1 font-medium">
                        {item.titleKm}
                      </div>
                    )}
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {item.excerpt || "No summary provided."}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        item.kind === "news"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.kind === "topic"
                            ? "bg-teal-100 text-teal-800"
                            : "bg-indigo-100 text-indigo-800"
                      }`}>
                        {item.kind === "news" ? "News" : item.kind === "topic" ? "Research Topic" : "Page"}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">{item.tag}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-600">
                    <div className="font-mono">{item.date}</div>
                    {item.route && (
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-[140px]">
                        {item.route}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        item.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          item.status === "published"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {item.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.route && (
                        <a
                          href={item.route}
                          target="_blank"
                          rel="noreferrer"
                          title="View on live website"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      {item.kind === "news" && (
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          title="Delete post"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          AUTHENTIC WEBSITE POST CANVAS MODAL
          Matches the exact design and interface of a live post on the website
         ========================================================================= */}
      {(isNew || editingItem) && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-xs">
          <div
            ref={dialog}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-editor-title"
            className="w-full max-w-5xl rounded-3xl bg-slate-50 p-4 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Modal Top Control Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <h3
                  id="post-editor-title"
                  className="text-lg font-bold text-slate-900 flex items-center gap-2"
                >
                  {isNew
                    ? "Create New Post"
                    : `Edit ${editingKind === "news" ? "News Post" : editingKind === "topic" ? "Research Topic" : "Website Page"}: ${title || "Untitled"}`}
                </h3>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  {editingKind.toUpperCase()}
                </span>
              </div>
              <button
                disabled={saving}
                aria-label="Close post editor"
                onClick={close}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Post Content Canvas */}
            <fieldset
              disabled={saving}
              className="space-y-4 max-h-[76vh] overflow-y-auto pr-2"
            >
              {/* Dual Language Helper Pill */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                <div className="text-xs text-emerald-900">
                  Dual-language support: English is the primary source; Khmer override is rendered for Khmer language visitors.
                </div>
                <button
                  type="button"
                  onClick={handleTranslateAll}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
                >
                  <Sparkles size={14} /> Fill known Khmer phrases
                </button>
              </div>

              {/* The Live Post Container (WYSIWYG Authenticity) */}
              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
                
                {/* 1. Live Hero Image with 1-Click Replace Overlay */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Featured Cover Photo
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setCropperModal({
                            imageUrl: image || PHOTO_PRESETS[0].url,
                            onApply: (c) => setImage(c),
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-800"
                      >
                        <Crop size={13} /> ✂️ Crop Cover
                      </button>
                      <button
                        type="button"
                        onClick={() => coverFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        <Upload size={13} /> Upload Local Image
                      </button>
                    </div>
                  </div>

                  <div className="relative group overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    <img
                      src={image || PHOTO_PRESETS[0].url}
                      alt="Cover Preview"
                      className="w-full max-h-[320px] object-cover transition group-hover:brightness-95"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCropperModal({
                            imageUrl: image || PHOTO_PRESETS[0].url,
                            onApply: (c) => setImage(c),
                          })
                        }
                        className="rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-violet-700 transition"
                      >
                        ✂️ Crop Cover
                      </button>
                      <button
                        type="button"
                        onClick={() => coverFileInputRef.current?.click()}
                        className="rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-md hover:bg-slate-50 transition"
                      >
                        📷 Change Cover Photo
                      </button>
                    </div>
                  </div>

                  {/* Image URL input and quick presets */}
                  <div className="flex gap-2 items-center pt-1">
                    <input
                      type="text"
                      aria-label="Cover image URL"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.unsplash.com/... or upload local image"
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400">Presets:</span>
                    {PHOTO_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setImage(p.url)}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700 hover:bg-slate-100"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Metadata Bar: Tag & Publish Date */}
                <div className="grid gap-4 sm:grid-cols-2 border-y border-slate-100 py-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Category / Tag
                    </label>
                    <div className="mt-1 flex gap-2">
                      <select
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className="rounded-lg border border-slate-300 bg-white p-2 text-xs focus:border-emerald-500 focus:outline-none"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        placeholder="Custom tag..."
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                      >
                      </input>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      aria-label="Publish Date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Post Title Headline (H1 Style in Live Post Canvas) */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Title (English) *
                    </label>
                    <input
                      type="text"
                      aria-label="Title (English)"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (e.target.value !== title) setTitleKm("");
                      }}
                      placeholder="e.g. Field school returns to the Cardamom foothills"
                      className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-lg font-bold text-slate-900 focus:border-emerald-500 focus:outline-none shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Title (Khmer)
                    </label>
                    <input
                      type="text"
                      aria-label="Title (Khmer)"
                      value={titleKm}
                      onChange={(e) => setTitleKm(e.target.value)}
                      placeholder="ចំណងជើងជាភាសាខ្មែរ"
                      className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-base font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4. Article Excerpt (Leading Quote Callout Style) */}
                <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/60 p-4 space-y-3">
                  <div className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    Article Summary / Excerpt Callout
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase">
                        Summary (English)
                      </label>
                      <textarea
                        rows={3}
                        aria-label="Summary (English)"
                        value={excerpt}
                        onChange={(e) => {
                          setExcerpt(e.target.value);
                          if (e.target.value !== excerpt) setExcerptKm("");
                        }}
                        placeholder="Short summary displayed on top callout and cards..."
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase">
                        Summary (Khmer)
                      </label>
                      <textarea
                        rows={3}
                        aria-label="Summary (Khmer)"
                        value={excerptKm}
                        onChange={(e) => setExcerptKm(e.target.value)}
                        placeholder="សេចក្តីសង្ខេបជាភាសាខ្មែរ..."
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Full Post Story Content (English) with WordPress Toolbar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Full Story / Article Content (English HTML)
                    </label>
                    <span className="text-xs text-slate-400">
                      Use toolbar buttons below to insert tables, charts, or images
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-300 focus-within:border-emerald-500">
                    {renderEditorToolbar("content")}
                    {viewModeEn === "code" ? (
                      <textarea
                        ref={contentTextareaRef}
                        rows={10}
                        aria-label="Body (HTML) (English)"
                        value={content}
                        onChange={(e) => {
                          setContent(e.target.value);
                          if (e.target.value !== content) setContentKm("");
                        }}
                        placeholder="Write your article body here. Click '+ Photo', '+ Graph / Chart', or '+ Table' above to insert rich elements."
                        className="w-full p-4 font-mono text-sm leading-relaxed focus:outline-none min-h-[220px]"
                      />
                    ) : (
                      <div
                        className="geocam-article-body prose prose-slate max-w-none p-6 bg-white min-h-[220px] max-h-[420px] overflow-y-auto"
                        dangerouslySetInnerHTML={{
                          __html:
                            cleanPostHtml(content) ||
                            '<p class="italic text-slate-400">No content entered yet. Switch to HTML tab to write.</p>',
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* 6. Full Post Story Content (Khmer) with WordPress Toolbar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Full Story / Article Content (Khmer)
                    </label>
                    <span className="text-xs text-slate-400">
                      ខ្លឹមសារជាភាសាខ្មែរ
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-300 focus-within:border-emerald-500">
                    {renderEditorToolbar("contentKm")}
                    {viewModeKm === "code" ? (
                      <textarea
                        ref={contentKmTextareaRef}
                        rows={8}
                        aria-label="Body (HTML) (Khmer)"
                        value={contentKm}
                        onChange={(e) => setContentKm(e.target.value)}
                        placeholder="ខ្លឹមសារអត្ថបទពេញលេញជាភាសាខ្មែរ..."
                        className="w-full p-4 font-mono text-sm leading-relaxed focus:outline-none min-h-[180px]"
                      />
                    ) : (
                      <div
                        className="geocam-article-body prose prose-slate max-w-none p-6 bg-white min-h-[180px] max-h-[380px] overflow-y-auto"
                        dangerouslySetInnerHTML={{
                          __html:
                            cleanPostHtml(contentKm) ||
                            '<p class="italic text-slate-400">មិនទាន់មានខ្លឹមសារខ្មែរនៅឡើយទេ។</p>',
                        }}
                      />
                    )}
                  </div>
                </div>

              </article>
            </fieldset>

            {error && (
              <p role="alert" className="mt-3 text-red-800 text-sm">
                {error}
              </p>
            )}
            {message && (
              <p role="status" className="mt-3 text-emerald-800 text-sm">
                {message}
              </p>
            )}

            {/* Modal Footer with Publishing Actions */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600">
                  Status:
                </label>
                <span className="text-xs font-medium">
                  {status === "published"
                    ? "Published (Public to website visitors)"
                    : "Draft (Saved in administrative workspace)"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={close}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-xs hover:bg-slate-50 transition"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave(true)}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition"
                >
                  <CheckCircle2 size={16} /> Publish Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inserter Popup Modals for Photo / Chart / Table */}
      {activeInserter && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {activeInserter.type === "photo" && (
                  <>
                    <ImageIcon className="text-emerald-700" size={18} /> Insert
                    Photo / Image
                  </>
                )}
                {activeInserter.type === "chart" && (
                  <>
                    <BarChart2 className="text-teal-700" size={18} /> Insert
                    Geological Graph or Chart
                  </>
                )}
                {activeInserter.type === "table" && (
                  <>
                    <TableIcon className="text-indigo-700" size={18} /> Insert
                    Data Table
                  </>
                )}
              </h4>
              <button
                type="button"
                onClick={() => setActiveInserter(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Photo Inserter Body */}
            {activeInserter.type === "photo" && (
              <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Option 1: Upload from computer
                  </label>
                  <button
                    type="button"
                    onClick={() => bodyFileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 p-4 text-sm font-semibold text-emerald-800 hover:bg-emerald-100/70 transition"
                  >
                    <Upload size={16} /> Choose Image File from Device
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                    Option 2: Geological Outcrop Presets (1-Click)
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {PHOTO_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handleInsertPresetPhoto(p)}
                        className="group flex flex-col items-center overflow-hidden rounded-lg border border-slate-200 text-left hover:border-emerald-500 hover:shadow-xs transition"
                      >
                        <img
                          src={p.url}
                          alt=""
                          className="h-16 w-full object-cover group-hover:scale-105 transition"
                        />
                        <span className="p-1.5 text-[11px] font-medium text-slate-700 line-clamp-1">
                          {p.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-700">
                    Option 3: Custom Image URL &amp; Caption
                  </label>
                  <input
                    type="text"
                    placeholder="Image URL (https://...)"
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Caption text (optional)"
                      value={photoCaptionInput}
                      onChange={(e) => setPhotoCaptionInput(e.target.value)}
                      className="rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Alt description (optional)"
                      value={photoAltInput}
                      onChange={(e) => setPhotoAltInput(e.target.value)}
                      className="rounded-lg border border-slate-300 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={!photoUrlInput.trim()}
                      onClick={() =>
                        setCropperModal({
                          imageUrl: photoUrlInput.trim(),
                          onApply: (cropped) => setPhotoUrlInput(cropped),
                        })
                      }
                      className="rounded-lg border border-violet-300 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100 disabled:opacity-50 transition"
                      title="Crop photo before inserting"
                    >
                      ✂️ Crop Photo
                    </button>
                    <button
                      type="button"
                      disabled={!photoUrlInput.trim()}
                      onClick={handleInsertCustomPhoto}
                      className="flex-1 rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white disabled:opacity-50 hover:bg-emerald-700 transition"
                    >
                      Insert Image from URL
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chart Inserter Body */}
            {activeInserter.type === "chart" && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-500">
                  Select a chart template to insert clean, responsive visual data into your story:
                </p>
                <div className="space-y-2">
                  {CHART_TEMPLATES.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:border-teal-400 hover:bg-teal-50/30 transition"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-800">
                          {c.name}
                        </div>
                        <div className="text-xs text-slate-500">{c.desc}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInsertChart(c)}
                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition"
                      >
                        Insert Chart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Table Inserter Body */}
            {activeInserter.type === "table" && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-500">
                  Select a structured table template to display scientific measurements or inventories:
                </p>
                <div className="space-y-2">
                  {TABLE_TEMPLATES.map((t) => (
                    <div
                      key={t.name}
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:border-indigo-400 hover:bg-indigo-50/30 transition"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-800">
                          {t.name}
                        </div>
                        <div className="text-xs text-slate-500">{t.desc}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInsertTable(t)}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
                      >
                        Insert Table
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveInserter(null)}
                className="rounded-lg border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved changes confirmation dialog */}
      {pending && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 p-4">
          <div
            ref={dialog}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-unsaved-title"
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
            onKeyDown={(e) => {
              if (e.key === "Escape" && !saving) setPending(null);
              if (e.key === "Tab") {
                const buttons =
                  dialog.current?.querySelectorAll<HTMLButtonElement>(
                    "button:not(:disabled)",
                  );
                if (!buttons?.length) return;
                const first = buttons[0],
                  last = buttons[buttons.length - 1];
                if (
                  e.shiftKey &&
                  (document.activeElement === first ||
                    document.activeElement === dialog.current)
                ) {
                  e.preventDefault();
                  last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
          >
            <h3 id="post-unsaved-title" className="text-xl font-bold">
              Save your changes?
            </h3>
            <p className="my-4">
              Your content has unsaved changes. Save a draft before leaving,
              discard these changes, or keep editing.
            </p>
            {error && (
              <p role="alert" className="mb-3 text-red-800">
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded bg-emerald-700 p-3 text-white"
                disabled={saving}
                onClick={async () => {
                  const action = pending;
                  if (await handleSave(false)) {
                    setPending(null);
                    action();
                  }
                }}
              >
                Save draft and leave
              </button>
              <button
                className="rounded border p-3"
                disabled={saving}
                onClick={() => {
                  state.current.dirty = false;
                  const action = pending;
                  setPending(null);
                  action();
                }}
              >
                Discard changes
              </button>
              <button
                className="rounded border p-3"
                disabled={saving}
                onClick={() => setPending(null)}
              >
                Keep editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Crop Tool Modal */}
      {cropperModal && (
        <ImageCropperModal
          imageUrl={cropperModal.imageUrl}
          onClose={() => setCropperModal(null)}
          onCrop={(cropped) => {
            cropperModal.onApply(cropped);
            setCropperModal(null);
            setMessage("Image cropped successfully!");
          }}
        />
      )}
    </div>
  );
}
