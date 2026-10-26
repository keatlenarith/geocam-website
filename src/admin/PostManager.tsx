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
  broadcastToFacebook,
  getFacebookSettings,
} from "../lib/facebook-service";
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
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Camera,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Unlink,
  Grid,
  Strikethrough,
  Minus,
  RotateCcw,
  RotateCw,
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
  "General News",
  "Education",
  "Geohazards",
  "Society",
  "Geochemistry",
  "Tectonics",
  "Mining",
  "Marine Geology",
  "Environmental Hydrogeology",
  "Fieldwork",
  "Core Pages",
  "Science & Maps",
  "Tools & Portals",
];

const CATEGORY_KM_MAP: Record<string, string> = {
  "General News": "ព័ត៌មានទូទៅ",
  Education: "ការអប់រំ",
  Geohazards: "គ្រោះភូគព្ភសាស្ត្រ",
  Society: "សង្គម",
  Geochemistry: "គីមីភូគព្ភសាស្ត្រ",
  Tectonics: "តិចតូនិច",
  Mining: "រ៉ែ",
  "Marine Geology": "ភូគព្ភសាស្ត្រសមុទ្រ",
  "Environmental Hydrogeology": "បរិស្ថានវារីភូគព្ភសាស្ត្រ",
  Fieldwork: "ការងារទីវាល",
  "Core Pages": "ទំព័រគោល",
  "Science & Maps": "វិទ្យាសាស្ត្រ និងផែនទី",
  "Tools & Portals": "ឧបករណ៍ និងច្រកទ្វារ",
};

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

  // WordPress Classic Editor States
  const [editorMode, setEditorMode] = useState<"visual" | "text">("visual");
  const [activeLang, setActiveLang] = useState<"en" | "km">("en");
  const [kitchenSink, setKitchenSink] = useState(true);
  const [customSlug, setCustomSlug] = useState("");
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [postFormat, setPostFormat] = useState<
    "standard" | "aside" | "image" | "video" | "quote" | "link" | "gallery"
  >("standard");
  const [categoryTab, setCategoryTab] = useState<"all" | "most-used">("all");
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingVisibility, setIsEditingVisibility] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [showExcerptBox, setShowExcerptBox] = useState(true);
  const [saveTimestamp, setSaveTimestamp] = useState("");
  const [publishToFb, setPublishToFb] = useState(() => {
    try {
      return getFacebookSettings().autoPostArticles;
    } catch {
      return true;
    }
  });

  const contentVisualRef = useRef<HTMLDivElement>(null);

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
            const topicMatch = FOCUS_TOPICS.find(
              (t) =>
                t.id === editId ||
                t.slug === editId ||
                `topic-${t.slug}` === editId,
            );
            if (topicMatch) {
              openEdit(topicToUnifiedItem(topicMatch));
            } else {
              const pageEntry = Object.entries(defaultPageData).find(([route]) => {
                const pid = `page-${route.replace(/[\/\-_]/g, "_") || "home"}`;
                return (
                  pid === editId ||
                  route === editId ||
                  route === `/${editId}` ||
                  `page-${route}` === editId
                );
              });
              if (pageEntry) {
                openEdit(pageToUnifiedItem(pageEntry[0], pageEntry[1]));
              }
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
    setActiveLang("en");
    setEditorMode("visual");
    setCustomSlug(
      item.route
        ? item.route.replace(/^\/(news|research|pages)\//, "").replace(/^\//, "")
        : "",
    );
    setIsEditingSlug(false);
    setIsEditingStatus(false);
    setIsEditingVisibility(false);
    setIsEditingDate(false);
    setSaveTimestamp(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );
    if (contentVisualRef.current) {
      contentVisualRef.current.innerHTML = item.content || "<p><br></p>";
    }
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

  useEffect(() => {
    if (editorMode === "visual" && contentVisualRef.current) {
      const val = activeLang === "en" ? content : contentKm;
      if (contentVisualRef.current.innerHTML !== val) {
        contentVisualRef.current.innerHTML = val || "<p><br></p>";
      }
    }
  }, [editorMode, activeLang, editingItem, isNew]);

  useEffect(() => {
    const handleOpenNewPost = () => openNew();
    const handleOpenEditPageId = (e: Event) => {
      const pageId = (e as CustomEvent<string>).detail;
      const found = unifiedItems.find((item) => item.id === pageId);
      if (found) {
        openEdit(found);
      } else {
        const pageEntry = Object.entries(defaultPageData).find(([route]) => {
          const pid = `page-${route.replace(/[\/\-_]/g, "_") || "home"}`;
          return (
            pid === pageId ||
            route === pageId ||
            route === `/${pageId}` ||
            `page-${route}` === pageId
          );
        });
        if (pageEntry) {
          openEdit(pageToUnifiedItem(pageEntry[0], pageEntry[1]));
        }
      }
    };
    window.addEventListener("geocam:open-new-post", handleOpenNewPost);
    window.addEventListener("geocam:open-edit-page-id", handleOpenEditPageId);
    return () => {
      window.removeEventListener("geocam:open-new-post", handleOpenNewPost);
      window.removeEventListener("geocam:open-edit-page-id", handleOpenEditPageId);
    };
  }, [unifiedItems]);

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

      setSaveTimestamp(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );

      // Trigger automatic Facebook Page Broadcast if publishNow is true and enabled
      let fbNotice = "";
      if (publishNow && publishToFb && editingKind === "news") {
        try {
          const fbRes = await broadcastToFacebook({
            type: "news",
            title: title.trim(),
            titleKm: titleKm.trim() || undefined,
            summary: excerpt.trim() || content.slice(0, 200).trim(),
            summaryKm: excerptKm.trim() || contentKm.slice(0, 200).trim() || undefined,
            imageUrl: image.trim() || undefined,
            link: `/news/item?id=${encodeURIComponent(editingItem?.id || title.trim())}`,
          });
          if (fbRes.success) {
            fbNotice = " · 📢 Published to Facebook Page!";
          } else if (fbRes.error) {
            fbNotice = ` · ⚠️ Facebook: ${fbRes.error}`;
          }
        } catch (fbErr: any) {
          fbNotice = ` · ⚠️ Facebook broadcast failed: ${fbErr?.message || "Check settings"}`;
        }
      }

      setMessage(
        publishNow
          ? `Post published.${fbNotice}`
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

  const autoSlug = title
    ? title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    : "new-post";

  const getWordCount = (html: string) => {
    if (!html) return 0;
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  };

  const handleVisualInput = () => {
    if (!contentVisualRef.current) return;
    const val = contentVisualRef.current.innerHTML;
    if (activeLang === "en") {
      setContent(val);
    } else {
      setContentKm(val);
    }
  };

  const handleSwitchLang = (lang: "en" | "km") => {
    setActiveLang(lang);
    if (editorMode === "visual" && contentVisualRef.current) {
      contentVisualRef.current.innerHTML =
        (lang === "en" ? content : contentKm) || "<p><br></p>";
    }
  };

  const handleSwitchEditorMode = (mode: "visual" | "text") => {
    if (mode === "visual" && editorMode === "text" && contentVisualRef.current) {
      contentVisualRef.current.innerHTML =
        (activeLang === "en" ? content : contentKm) || "<p><br></p>";
    }
    setEditorMode(mode);
  };

  const handleCropInArticle = () => {
    const currentVal = activeLang === "en" ? content : contentKm;
    const match = currentVal.match(/<img[^>]+src="([^">]+)"/);
    const initialUrl = match ? match[1] : image || PHOTO_PRESETS[0].url;
    const url = window.prompt("Enter or confirm image URL to crop:", initialUrl);
    if (url) {
      setCropperModal({
        imageUrl: url,
        onApply: (cropped) => {
          if (match && currentVal.includes(match[1])) {
            const nextVal = currentVal.replace(match[1], cropped);
            if (activeLang === "en") setContent(nextVal);
            else setContentKm(nextVal);
            if (editorMode === "visual" && contentVisualRef.current) {
              contentVisualRef.current.innerHTML = nextVal;
            }
          } else {
            handleToolbarAction("insertImage", cropped);
          }
        },
      });
    }
  };

  const handleToolbarAction = (action: string, arg?: string) => {
    if (editorMode === "visual") {
      contentVisualRef.current?.focus();
      switch (action) {
        case "bold":
          document.execCommand("bold");
          break;
        case "italic":
          document.execCommand("italic");
          break;
        case "bulletList":
          document.execCommand("insertUnorderedList");
          break;
        case "orderedList":
          document.execCommand("insertOrderedList");
          break;
        case "blockquote":
          document.execCommand("formatBlock", false, "<blockquote>");
          break;
        case "alignLeft":
          document.execCommand("justifyLeft");
          break;
        case "alignCenter":
          document.execCommand("justifyCenter");
          break;
        case "alignRight":
          document.execCommand("justifyRight");
          break;
        case "link": {
          const url = window.prompt("Enter link URL:", "https://");
          if (url) document.execCommand("createLink", false, url);
          break;
        }
        case "unlink":
          document.execCommand("unlink");
          break;
        case "readMore":
        case "horizontalRule":
          document.execCommand("insertHorizontalRule");
          break;
        case "strikeThrough":
          document.execCommand("strikeThrough");
          break;
        case "foreColor":
          if (arg) document.execCommand("foreColor", false, arg);
          break;
        case "removeFormat":
          document.execCommand("removeFormat");
          break;
        case "insertText":
          if (arg) document.execCommand("insertText", false, arg);
          break;
        case "insertImage":
          if (arg) document.execCommand("insertImage", false, arg);
          break;
        case "outdent":
          document.execCommand("outdent");
          break;
        case "indent":
          document.execCommand("indent");
          break;
        case "undo":
          document.execCommand("undo");
          break;
        case "redo":
          document.execCommand("redo");
          break;
        default:
          break;
      }
      handleVisualInput();
    } else {
      // Text mode
      const isKm = activeLang === "km";
      const textarea = isKm
        ? contentKmTextareaRef.current
        : contentTextareaRef.current;
      const val = isKm ? contentKm : content;
      const setter = isKm ? setContentKm : setContent;
      switch (action) {
        case "bold":
          insertHtmlAtCursor(textarea, "<strong>", "</strong>", "bold text", val, setter);
          break;
        case "italic":
          insertHtmlAtCursor(textarea, "<em>", "</em>", "italic text", val, setter);
          break;
        case "bulletList":
          insertHtmlAtCursor(textarea, "\n<ul>\n  <li>", "</li>\n  <li>Second item</li>\n</ul>\n", "First item", val, setter);
          break;
        case "orderedList":
          insertHtmlAtCursor(textarea, "\n<ol>\n  <li>", "</li>\n  <li>Second item</li>\n</ol>\n", "First item", val, setter);
          break;
        case "blockquote":
          insertHtmlAtCursor(textarea, '\n<blockquote class="border-l-4 border-[#2271b1] bg-[#f6f7f7] p-4 rounded-r-lg my-4 italic text-[#32373c]">\n  ', "\n</blockquote>\n", "Quote here...", val, setter);
          break;
        case "alignLeft":
          insertHtmlAtCursor(textarea, '<div style="text-align: left;">', "</div>", "Left aligned text", val, setter);
          break;
        case "alignCenter":
          insertHtmlAtCursor(textarea, '<div style="text-align: center;">', "</div>", "Center aligned text", val, setter);
          break;
        case "alignRight":
          insertHtmlAtCursor(textarea, '<div style="text-align: right;">', "</div>", "Right aligned text", val, setter);
          break;
        case "link": {
          const url = window.prompt("Enter link URL:", "https://");
          if (url) insertHtmlAtCursor(textarea, `<a href="${url}" class="text-[#2271b1] underline">`, "</a>", "link text", val, setter);
          break;
        }
        case "readMore":
          insertHtmlAtCursor(textarea, "\n<!--more-->\n", "", "", val, setter);
          break;
        case "horizontalRule":
          insertHtmlAtCursor(textarea, "\n<hr />\n", "", "", val, setter);
          break;
        case "strikeThrough":
          insertHtmlAtCursor(textarea, "<del>", "</del>", "strikethrough text", val, setter);
          break;
        case "foreColor":
          if (arg) insertHtmlAtCursor(textarea, `<span style="color: ${arg};">`, "</span>", "colored text", val, setter);
          break;
        case "insertText":
          if (arg) insertHtmlAtCursor(textarea, arg, "", "", val, setter);
          break;
        case "insertImage":
          if (arg) insertHtmlAtCursor(textarea, `<img src="${arg}" alt="" />`, "", "", val, setter);
          break;
        default:
          break;
      }
    }
  };

  const handleFormatSelect = (tag: string) => {
    if (editorMode === "visual") {
      contentVisualRef.current?.focus();
      document.execCommand("formatBlock", false, `<${tag}>`);
      handleVisualInput();
    } else {
      const isKm = activeLang === "km";
      const textarea = isKm
        ? contentKmTextareaRef.current
        : contentTextareaRef.current;
      const val = isKm ? contentKm : content;
      const setter = isKm ? setContentKm : setContent;
      insertHtmlAtCursor(textarea, `<${tag}>`, `</${tag}>`, "Heading text", val, setter);
    }
  };

  const renderClassicToolbar = () => {
    return (
      <div className="border-b border-[#dcdcde] bg-[#f6f7f7] p-1.5 space-y-1">
        {/* Row 1 */}
        <div className="flex flex-wrap items-center gap-0.5 text-[#50575e]">
          {/* Format Select */}
          <select
            aria-label="Block format"
            onChange={(e) => handleFormatSelect(e.target.value)}
            className="h-[26px] rounded-xs border border-[#ccd0d4] bg-white px-2 text-xs text-[#2c3338] shadow-xs focus:border-[#2271b1] focus:outline-none mr-1"
            defaultValue="p"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
            <option value="pre">Preformatted</option>
          </select>

          <span className="text-[#dcdcde] mx-0.5">|</span>

          {/* Bold */}
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onClick={() => handleToolbarAction("bold")}
            className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-xs font-bold text-[#32373c] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
          >
            <strong>B</strong>
          </button>

          {/* Italic */}
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onClick={() => handleToolbarAction("italic")}
            className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-xs italic font-serif text-[#32373c] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
          >
            <em>I</em>
          </button>

          {/* Bulleted list */}
          <button
            type="button"
            title="Bulleted list"
            onClick={() => handleToolbarAction("bulletList")}
            className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
          >
            <List size={14} />
          </button>

          {/* Numbered list */}
          <button
            type="button"
            title="Numbered list"
            onClick={() => handleToolbarAction("orderedList")}
            className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
          >
            <ListOrdered size={14} />
          </button>

          {/* Blockquote */}
          <button
            type="button"
            title="Blockquote"
            onClick={() => handleToolbarAction("blockquote")}
            className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
          >
            <Quote size={14} />
          </button>

          {/* Align Left */}
          <button
            type="button"
            title="Align Left"
            onClick={() => handleToolbarAction("alignLeft")}
            className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
          >
            <AlignLeft size={14} />
          </button>

          {/* Align Center */}
          <button
            type="button"
            title="Align Center"
            onClick={() => handleToolbarAction("alignCenter")}
            className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
          >
            <AlignCenter size={14} />
          </button>

          {/* Align Right */}
          <button
            type="button"
            title="Align Right"
            onClick={() => handleToolbarAction("alignRight")}
            className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
          >
            <AlignRight size={14} />
          </button>

          {/* Link */}
          <button
            type="button"
            title="Insert/edit link (Ctrl+K)"
            onClick={() => handleToolbarAction("link")}
            className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
          >
            <LinkIcon size={14} />
          </button>

          {/* Unlink */}
          <button
            type="button"
            title="Remove link"
            onClick={() => handleToolbarAction("unlink")}
            className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
          >
            <Unlink size={14} />
          </button>

          {/* Insert Read More Tag */}
          <button
            type="button"
            title="Insert Read More tag"
            onClick={() => handleToolbarAction("readMore")}
            className="h-[26px] px-1.5 inline-flex items-center justify-center rounded-xs text-[10px] font-mono font-bold text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
          >
            --MORE--
          </button>

          {/* Kitchen Sink / Toolbar Toggle */}
          <button
            type="button"
            title="Toolbar Toggle (Kitchen Sink)"
            onClick={() => setKitchenSink(!kitchenSink)}
            className={`h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs transition ${
              kitchenSink
                ? "bg-[#e2e4e7] border border-[#ccd0d4] text-[#1d2327]"
                : "text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
            }`}
          >
            <Grid size={14} />
          </button>
        </div>

        {/* Row 2 (Kitchen Sink) */}
        {kitchenSink && (
          <div className="flex flex-wrap items-center gap-0.5 text-[#50575e] pt-0.5 border-t border-[#e2e4e7]">
            {/* Strikethrough */}
            <button
              type="button"
              title="Strikethrough"
              onClick={() => handleToolbarAction("strikeThrough")}
              className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
            >
              <Strikethrough size={14} />
            </button>

            {/* Horizontal Line */}
            <button
              type="button"
              title="Horizontal line"
              onClick={() => handleToolbarAction("horizontalRule")}
              className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
            >
              <Minus size={14} />
            </button>

            {/* Text Color */}
            <button
              type="button"
              title="Text color"
              onClick={() => {
                const c = window.prompt(
                  "Enter text color (e.g. #0284c7, #059669, #dc2626, #1d2327):",
                  "#0284c7",
                );
                if (c) handleToolbarAction("foreColor", c);
              }}
              className="h-[26px] px-1.5 inline-flex items-center justify-center gap-0.5 rounded-xs text-xs font-bold text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
            >
              <span className="text-red-600 font-serif font-black text-sm">A</span>
              <ChevronDown size={10} />
            </button>

            {/* Clear Formatting */}
            <button
              type="button"
              title="Clear formatting"
              onClick={() => handleToolbarAction("removeFormat")}
              className="h-[26px] px-1 inline-flex items-center justify-center rounded-xs text-xs font-serif text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
            >
              Tₓ
            </button>

            {/* Special Character */}
            <button
              type="button"
              title="Special character"
              onClick={() => {
                const sym = window.prompt(
                  "Choose or type symbol (°C, ±, ², ³, μm, Ω, λ, ≈):",
                  "°C",
                );
                if (sym) handleToolbarAction("insertText", sym);
              }}
              className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-xs font-bold text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
            >
              Ω
            </button>

            {/* Decrease Indent */}
            <button
              type="button"
              title="Decrease indent"
              onClick={() => handleToolbarAction("outdent")}
              className="h-[26px] px-1 inline-flex items-center justify-center rounded-xs text-xs text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
            >
              ⇤
            </button>

            {/* Increase Indent */}
            <button
              type="button"
              title="Increase indent"
              onClick={() => handleToolbarAction("indent")}
              className="h-[26px] px-1 inline-flex items-center justify-center rounded-xs text-xs text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
            >
              ⇥
            </button>

            {/* Undo */}
            <button
              type="button"
              title="Undo (Ctrl+Z)"
              onClick={() => handleToolbarAction("undo")}
              className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
            >
              <RotateCcw size={13} />
            </button>

            {/* Redo */}
            <button
              type="button"
              title="Redo (Ctrl+Y)"
              onClick={() => handleToolbarAction("redo")}
              className="h-[26px] w-[26px] inline-flex items-center justify-center rounded-xs text-[#50575e] hover:bg-[#e2e4e7] hover:border hover:border-[#ccd0d4]"
            >
              <RotateCw size={13} />
            </button>

            <span className="text-[#dcdcde] mx-0.5">|</span>

            {/* Insert Table */}
            <button
              type="button"
              title="Insert Data Table"
              onClick={() =>
                setActiveInserter({
                  target: activeLang === "en" ? "content" : "contentKm",
                  type: "table",
                })
              }
              className="h-[26px] px-2 inline-flex items-center gap-1 rounded-xs text-[11px] font-semibold text-[#1d2327] bg-white border border-[#ccd0d4] shadow-xs hover:bg-[#f0f0f1]"
            >
              <TableIcon size={12} className="text-[#4f46e5]" /> Table
            </button>

            {/* Insert Chart */}
            <button
              type="button"
              title="Insert Geological Chart"
              onClick={() =>
                setActiveInserter({
                  target: activeLang === "en" ? "content" : "contentKm",
                  type: "chart",
                })
              }
              className="h-[26px] px-2 inline-flex items-center gap-1 rounded-xs text-[11px] font-semibold text-[#1d2327] bg-white border border-[#ccd0d4] shadow-xs hover:bg-[#f0f0f1]"
            >
              <BarChart2 size={12} className="text-[#0d9488]" /> Chart
            </button>

            {/* Crop image in article */}
            <button
              type="button"
              title="Crop Image"
              onClick={handleCropInArticle}
              className="h-[26px] px-2 inline-flex items-center gap-1 rounded-xs text-[11px] font-semibold text-[#1d2327] bg-white border border-[#ccd0d4] shadow-xs hover:bg-[#f0f0f1]"
            >
              <Crop size={12} className="text-[#7c3aed]" /> Crop
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderPublishBox = () => (
    <div className="rounded-xs border border-[#ccd0d4] bg-white shadow-xs">
      <div className="border-b border-[#ccd0d4] bg-[#f6f7f7] px-3.5 py-2 font-bold text-xs uppercase tracking-wider text-[#1d2327]">
        Publish
      </div>
      <div className="p-3.5 space-y-3 text-xs text-[#50575e]">
        {/* Action buttons */}
        <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f1]">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="rounded-xs border border-[#ccd0d4] bg-[#f6f7f7] px-3 py-1 font-semibold text-[#2c3338] shadow-xs hover:bg-white"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => {
              if (editingItem?.route) {
                window.open(editingItem.route, "_blank");
              } else if (editingKind === "news" && editingItem?.id) {
                window.open(`/news/${editingItem.id}`, "_blank");
              } else {
                alert("Preview: Save draft or publish to preview on the live website.");
              }
            }}
            className="rounded-xs border border-[#ccd0d4] bg-[#f6f7f7] px-3 py-1 font-semibold text-[#2c3338] shadow-xs hover:bg-white"
          >
            Preview
          </button>
        </div>

        {/* Status row */}
        <div>
          <div className="flex items-center gap-1">
            <span>Status:</span>
            <strong className="text-[#1d2327]">
              {status === "published" ? "Published" : "Draft"}
            </strong>
            <button
              type="button"
              onClick={() => setIsEditingStatus(!isEditingStatus)}
              className="ml-1 text-[#2271b1] hover:underline font-semibold"
            >
              {isEditingStatus ? "Close" : "Edit"}
            </button>
          </div>
          {isEditingStatus && (
            <div className="mt-2 flex items-center gap-2 pt-1 border-t border-[#f0f0f1]">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                className="rounded-xs border border-[#ccd0d4] bg-white p-1 text-xs"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <button
                type="button"
                onClick={() => setIsEditingStatus(false)}
                className="rounded-xs border border-[#ccd0d4] bg-[#f6f7f7] px-2 py-0.5 text-xs font-semibold"
              >
                OK
              </button>
            </div>
          )}
        </div>

        {/* Visibility row */}
        <div>
          <div className="flex items-center gap-1">
            <span>Visibility:</span>
            <strong className="text-[#1d2327] capitalize">{visibility}</strong>
            <button
              type="button"
              onClick={() => setIsEditingVisibility(!isEditingVisibility)}
              className="ml-1 text-[#2271b1] hover:underline font-semibold"
            >
              {isEditingVisibility ? "Close" : "Edit"}
            </button>
          </div>
          {isEditingVisibility && (
            <div className="mt-2 space-y-1 pt-1 border-t border-[#f0f0f1]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="post-visibility"
                  checked={visibility === "public"}
                  onChange={() => setVisibility("public")}
                />
                <span>Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="post-visibility"
                  checked={visibility === "private"}
                  onChange={() => setVisibility("private")}
                />
                <span>Private</span>
              </label>
              <button
                type="button"
                onClick={() => setIsEditingVisibility(false)}
                className="mt-1 rounded-xs border border-[#ccd0d4] bg-[#f6f7f7] px-2 py-0.5 text-xs font-semibold"
              >
                OK
              </button>
            </div>
          )}
        </div>

        {/* Publish date row */}
        <div>
          <div className="flex items-center gap-1">
            <span>Publish:</span>
            <strong className="text-[#1d2327]">{date || "immediately"}</strong>
            <button
              type="button"
              onClick={() => setIsEditingDate(!isEditingDate)}
              className="ml-1 text-[#2271b1] hover:underline font-semibold"
            >
              {isEditingDate ? "Close" : "Edit"}
            </button>
          </div>
          {isEditingDate && (
            <div className="mt-2 flex items-center gap-2 pt-1 border-t border-[#f0f0f1]">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xs border border-[#ccd0d4] p-1 text-xs"
              />
              <button
                type="button"
                onClick={() => setIsEditingDate(false)}
                className="rounded-xs border border-[#ccd0d4] bg-[#f6f7f7] px-2 py-0.5 text-xs font-semibold"
              >
                OK
              </button>
            </div>
          )}
        </div>
        {/* Facebook Page Auto-Broadcast Option */}
        {editingKind === "news" && (
          <div className="pt-2 border-t border-[#f0f0f1]">
            <label className="flex items-start gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={publishToFb}
                onChange={(e) => setPublishToFb(e.target.checked)}
                className="mt-0.5 rounded-xs border-[#ccd0d4] text-[#2271b1] focus:ring-0"
              />
              <span className="leading-snug text-[#50575e]">
                Auto-publish to Facebook Page (<strong>GeoCam</strong>)
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Major publishing actions footer */}
      <div className="flex items-center justify-between border-t border-[#dcdcde] bg-[#f6f7f7] p-3">
        {editingItem && editingItem.kind === "news" ? (
          <button
            type="button"
            onClick={async () => {
              await handleDelete(editingItem);
              close();
            }}
            className="text-[#b32d2e] hover:underline text-xs font-semibold"
          >
            Move to Trash
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave(true)}
          className="rounded-xs bg-[#2271b1] hover:bg-[#135e96] border border-[#135e96] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition"
        >
          {isNew || status === "draft" ? "Publish" : "Update"}
        </button>
      </div>
    </div>
  );

  const renderFormatBox = () => (
    <div className="rounded-xs border border-[#ccd0d4] bg-white shadow-xs">
      <div className="border-b border-[#ccd0d4] bg-[#f6f7f7] px-3.5 py-2 font-bold text-xs uppercase tracking-wider text-[#1d2327]">
        Format
      </div>
      <div className="p-3.5 space-y-2 text-xs text-[#50575e]">
        {[
          { id: "standard", label: "Standard" },
          { id: "aside", label: "Aside" },
          { id: "image", label: "Image" },
          { id: "video", label: "Video" },
          { id: "quote", label: "Quote" },
          { id: "link", label: "Link" },
          { id: "gallery", label: "Gallery" },
        ].map((fmt) => (
          <label key={fmt.id} className="flex items-center gap-2 cursor-pointer hover:text-[#1d2327]">
            <input
              type="radio"
              name="post-format"
              checked={postFormat === fmt.id}
              onChange={() => setPostFormat(fmt.id as any)}
            />
            <span>{fmt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderCategoriesBox = () => {
    const allAvailableTags = Array.from(new Set([...CATEGORIES, ...customCategories]));
    return (
      <div className="rounded-xs border border-[#ccd0d4] bg-white shadow-xs">
        <div className="border-b border-[#ccd0d4] bg-[#f6f7f7] px-3.5 py-2 font-bold text-xs uppercase tracking-wider text-[#1d2327]">
          Categories
        </div>
        <div className="p-3.5 space-y-3">
          {/* Tabs */}
          <div className="flex border-b border-[#ccd0d4] text-xs">
            <button
              type="button"
              onClick={() => setCategoryTab("all")}
              className={`px-3 py-1 -mb-px font-bold ${
                categoryTab === "all"
                  ? "border-t border-l border-r border-[#ccd0d4] bg-white text-[#1d2327]"
                  : "text-[#50575e] hover:text-[#1d2327]"
              }`}
            >
              All Categories
            </button>
            <button
              type="button"
              onClick={() => setCategoryTab("most-used")}
              className={`px-3 py-1 -mb-px font-bold ${
                categoryTab === "most-used"
                  ? "border-t border-l border-r border-[#ccd0d4] bg-white text-[#1d2327]"
                  : "text-[#50575e] hover:text-[#1d2327]"
              }`}
            >
              Most Used
            </button>
          </div>

          {/* Checkbox list */}
          <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 text-xs text-[#50575e]">
            {allAvailableTags.map((c) => {
              const isChecked = tag === c;
              const kmLabel = CATEGORY_KM_MAP[c];
              return (
                <label key={c} className="flex items-center gap-2 cursor-pointer hover:text-[#1d2327]">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setTag(c)}
                  />
                  <span>
                    {c} {kmLabel ? <span className="text-[#8c8f94] text-[11px]">({kmLabel})</span> : null}
                  </span>
                </label>
              );
            })}
          </div>

          {/* + Add New Category */}
          <div className="pt-2 border-t border-[#f0f0f1]">
            {!showNewCategory ? (
              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                className="text-xs text-[#2271b1] hover:underline font-semibold"
              >
                + Add New Category
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  placeholder="New Category Name"
                  className="w-full rounded-xs border border-[#ccd0d4] p-1.5 text-xs text-[#1d2327] focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = newCategoryInput.trim();
                      if (trimmed) {
                        setCustomCategories((prev) => [...prev, trimmed]);
                        setTag(trimmed);
                        setNewCategoryInput("");
                        setShowNewCategory(false);
                      }
                    }}
                    className="rounded-xs border border-[#ccd0d4] bg-[#f6f7f7] px-3 py-1 text-xs font-semibold text-[#1d2327] hover:bg-white"
                  >
                    Add Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(false)}
                    className="text-xs text-[#646970] hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFeaturedImageBox = () => (
    <div className="rounded-xs border border-[#ccd0d4] bg-white shadow-xs">
      <div className="border-b border-[#ccd0d4] bg-[#f6f7f7] px-3.5 py-2 font-bold text-xs uppercase tracking-wider text-[#1d2327]">
        Featured Image
      </div>
      <div className="p-3.5 space-y-3">
        {image ? (
          <div>
            <div className="relative group overflow-hidden rounded-xs border border-[#ccd0d4] bg-[#f0f0f1]">
              <img
                src={image}
                alt="Featured"
                className="w-full h-36 object-cover"
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCropperModal({
                    imageUrl: image,
                    onApply: (cropped) => setImage(cropped),
                  })
                }
                className="text-xs text-[#7c3aed] hover:underline font-semibold inline-flex items-center gap-1"
              >
                <Crop size={12} /> ✂️ Crop Cover
              </button>
              <span className="text-[#ccd0d4]">|</span>
              <button
                type="button"
                onClick={() => coverFileInputRef.current?.click()}
                className="text-xs text-[#059669] hover:underline font-semibold inline-flex items-center gap-1"
              >
                <Upload size={12} /> Upload New
              </button>
              <span className="text-[#ccd0d4]">|</span>
              <button
                type="button"
                onClick={() => setImage("")}
                className="text-xs text-[#b32d2e] hover:underline font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => coverFileInputRef.current?.click()}
              className="text-xs text-[#2271b1] hover:underline font-semibold block mb-2"
            >
              Set featured image (Upload from device)
            </button>
          </div>
        )}

        {/* Preset geological outcrop selector */}
        <div className="pt-2 border-t border-[#f0f0f1]">
          <span className="block text-[11px] font-bold text-[#646970] mb-1.5 uppercase">
            Or Select Geological Outcrop:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {PHOTO_PRESETS.slice(0, 6).map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setImage(p.url)}
                title={p.label}
                className="overflow-hidden rounded-xs border border-[#ccd0d4] hover:border-[#2271b1] transition"
              >
                <img src={p.url} alt={p.label} className="w-full h-10 object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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
                  {c} {CATEGORY_KM_MAP[c] ? `(${CATEGORY_KM_MAP[c]})` : ""}
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
                <tr
                  key={item.id}
                  onClick={() => openEdit(item)}
                  className="hover:bg-sky-50/70 transition cursor-pointer group"
                  title="Click to directly edit this post in the Classic Editor"
                >
                  <td className="p-4 w-28">
                    <img
                      src={item.image || PHOTO_PRESETS[0].url}
                      alt=""
                      className="h-16 w-24 rounded-lg object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition"
                    />
                  </td>
                  <td className="p-4 max-w-md">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 group-hover:text-blue-700 transition line-clamp-1">
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
                          onClick={(e) => e.stopPropagation()}
                          title="View on live website"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(item);
                        }}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      {item.kind === "news" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                          }}
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
          AUTHENTIC WORDPRESS CLASSIC EDITOR VIEW
          Exact layout matching user's uploaded Classic Editor screenshot
         ========================================================================= */}
      {(isNew || editingItem) && (
        <div
          ref={dialog}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="classic-editor-heading"
          className="wp-classic-editor-overlay fixed inset-0 z-[1000] overflow-y-auto bg-[#f1f1f1] text-[#32373c] p-3 sm:p-6"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
          }}
        >
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Top Navigation & Breadcrumb Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#ccd0d4]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={close}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xs border border-[#ccd0d4] bg-white px-3 py-1.5 text-xs font-semibold text-[#2c3338] shadow-xs hover:bg-[#f6f7f7] transition"
                >
                  <ArrowLeft size={14} /> Back to All Posts &amp; Pages
                </button>
                <h1
                  id="classic-editor-heading"
                  className="text-xl sm:text-2xl font-bold text-[#1d2327]"
                >
                  {isNew
                    ? "Add New Post"
                    : `Edit ${editingKind === "news" ? "Post" : editingKind === "topic" ? "Research Topic" : "Page"}: ${title || "Untitled"}`}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {!isNew && (
                  <button
                    type="button"
                    onClick={openNew}
                    className="inline-flex items-center gap-1 rounded-xs border border-[#2271b1] bg-white px-3 py-1.5 text-xs font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white transition"
                  >
                    <Plus size={13} /> Add New
                  </button>
                )}
                <button
                  type="button"
                  onClick={close}
                  className="rounded p-1.5 text-[#646970] hover:bg-[#dcdcde] hover:text-[#1d2327] transition"
                  title="Close Editor"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Admin Notice Messages */}
            {message && (
              <div className="border-l-4 border-[#00a32a] bg-white p-3 shadow-xs text-xs font-semibold text-[#1d2327] flex items-center justify-between">
                <span>{message}</span>
                {editingItem?.route && (
                  <a
                    href={editingItem.route}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2271b1] hover:underline ml-2"
                  >
                    View post &rarr;
                  </a>
                )}
              </div>
            )}
            {error && (
              <div className="border-l-4 border-[#d63638] bg-white p-3 shadow-xs text-xs font-semibold text-[#d63638]">
                {error}
              </div>
            )}

            {/* Main WordPress Classic 2-Column Grid */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              
              {/* LEFT COLUMN: Main Post Canvas (~72% width) */}
              <div className="w-full lg:flex-1 min-w-0 space-y-4">
                
                {/* 1. Large Post Title Input */}
                <div>
                  <input
                    type="text"
                    id="post-title"
                    value={activeLang === "en" ? title : titleKm}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (activeLang === "en") {
                        setTitle(v);
                        if (v !== title) setTitleKm("");
                      } else {
                        setTitleKm(v);
                      }
                    }}
                    placeholder="Enter title here"
                    className="w-full rounded-xs border border-[#ddd] bg-white px-3 py-2 text-lg sm:text-xl font-semibold text-[#32373c] shadow-[inset_0_1px_2px_rgba(0,0,0,0.07)] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                  />
                </div>

                {/* 2. Permalink Slug Line */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#50575e] bg-white/70 p-2 rounded-xs border border-[#e2e4e7]">
                  <span className="font-semibold text-[#1d2327]">Permalink:</span>
                  <span className="font-mono text-[#50575e]">
                    https://geocam-website.vercel.app/{editingKind === "news" ? "news" : editingKind === "topic" ? "research" : "page"}/
                    <strong className="text-[#1d2327]">{customSlug || autoSlug}</strong>/
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingSlug(!isEditingSlug)}
                    className="rounded-xs border border-[#ccd0d4] bg-[#f6f7f7] px-2 py-0.5 font-semibold text-[#2271b1] hover:bg-white text-[11px]"
                  >
                    {isEditingSlug ? "Done" : "Edit"}
                  </button>
                  {editingItem?.route && (
                    <a
                      href={editingItem.route}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xs border border-[#ccd0d4] bg-[#f6f7f7] px-2 py-0.5 font-semibold text-[#2271b1] hover:bg-white text-[11px] inline-flex items-center gap-1"
                    >
                      <Eye size={11} /> View Post
                    </a>
                  )}
                  {isEditingSlug && (
                    <div className="w-full mt-1 flex gap-2">
                      <input
                        type="text"
                        value={customSlug || autoSlug}
                        onChange={(e) =>
                          setCustomSlug(
                            e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
                          )
                        }
                        className="w-full rounded-xs border border-[#ccd0d4] bg-white p-1 text-xs font-mono"
                        placeholder="custom-slug"
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingSlug(false)}
                        className="rounded-xs border border-[#ccd0d4] bg-[#f6f7f7] px-2 text-xs font-semibold"
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Bilingual Language Switcher Pill */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xs border border-[#ccd0d4] bg-[#eef2f5] p-1.5 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSwitchLang("en")}
                      className={`flex items-center gap-1.5 rounded-xs px-3 py-1 font-bold transition ${
                        activeLang === "en"
                          ? "bg-white text-[#1d2327] shadow-xs border border-[#ccd0d4]"
                          : "text-[#50575e] hover:text-[#1d2327]"
                      }`}
                    >
                      🇬🇧 English Source (Primary)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchLang("km")}
                      className={`flex items-center gap-1.5 rounded-xs px-3 py-1 font-bold transition ${
                        activeLang === "km"
                          ? "bg-white text-[#1d2327] shadow-xs border border-[#ccd0d4]"
                          : "text-[#50575e] hover:text-[#1d2327]"
                      }`}
                    >
                      🇰🇭 Khmer Translation (ខ្លឹមសារខ្មែរ)
                      {titleKm ? " ✓" : ""}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleTranslateAll}
                    className="inline-flex items-center gap-1 rounded-xs bg-[#0073aa] px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs hover:bg-[#005a87] transition"
                  >
                    <Sparkles size={12} /> Fill Known Khmer Phrases
                  </button>
                </div>

                {/* 4. Media Button Row & Editor Switcher Tabs */}
                <div className="flex items-end justify-between gap-2 pt-1">
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveInserter({
                          target: activeLang === "en" ? "content" : "contentKm",
                          type: "photo",
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-t-xs border border-[#ccd0d4] bg-[#f6f7f7] px-3 py-1.5 text-xs font-bold text-[#2c3338] shadow-xs hover:bg-white transition"
                    >
                      <Camera size={14} className="text-[#50575e]" /> Add Media
                    </button>
                  </div>

                  {/* Tabs: Visual and Text */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSwitchEditorMode("visual")}
                      className={`rounded-t-xs px-3.5 py-1.5 text-xs font-bold transition ${
                        editorMode === "visual"
                          ? "bg-white text-[#1d2327] border-t border-l border-r border-[#ccd0d4] pb-2 -mb-px z-10"
                          : "bg-[#ebebeb] text-[#50575e] border border-[#ccd0d4] hover:bg-white"
                      }`}
                    >
                      Visual
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchEditorMode("text")}
                      className={`rounded-t-xs px-3.5 py-1.5 text-xs font-bold transition ${
                        editorMode === "text"
                          ? "bg-white text-[#1d2327] border-t border-l border-r border-[#ccd0d4] pb-2 -mb-px z-10"
                          : "bg-[#ebebeb] text-[#50575e] border border-[#ccd0d4] hover:bg-white"
                      }`}
                    >
                      Text
                    </button>
                  </div>
                </div>

                {/* 5. Classic TinyMCE Editor Box */}
                <div className="overflow-hidden rounded-xs border border-[#ccd0d4] bg-white shadow-xs">
                  {/* Classic TinyMCE Toolbar (Red-boxed in user screenshot) */}
                  {renderClassicToolbar()}

                  {/* Content Area */}
                  {editorMode === "visual" ? (
                    <div
                      ref={contentVisualRef}
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onInput={handleVisualInput}
                      onBlur={handleVisualInput}
                      className="geocam-classic-editor-canvas min-h-[420px] max-h-[640px] overflow-y-auto p-5 text-[#1d2327] focus:outline-none"
                      style={{
                        fontFamily: 'Georgia, "Times New Roman", Times, serif',
                        fontSize: "16px",
                        lineHeight: "1.7",
                      }}
                    />
                  ) : (
                    <textarea
                      ref={activeLang === "en" ? contentTextareaRef : contentKmTextareaRef}
                      value={activeLang === "en" ? content : contentKm}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (activeLang === "en") {
                          setContent(val);
                          if (val !== content) setContentKm("");
                        } else {
                          setContentKm(val);
                        }
                      }}
                      rows={18}
                      className="w-full min-h-[420px] p-4 font-mono text-[13px] leading-relaxed text-[#1d2327] focus:outline-none border-0"
                      placeholder="Write your article in HTML code or switch to Visual mode above..."
                    />
                  )}

                  {/* Word Count and Status Bar */}
                  <div className="flex items-center justify-between border-t border-[#dcdcde] bg-[#f6f7f7] px-3 py-1.5 text-xs text-[#50575e]">
                    <div className="font-sans">
                      Word count: <strong>{getWordCount(activeLang === "en" ? content : contentKm)}</strong>
                    </div>
                    <div className="font-sans text-[11px] text-[#646970]">
                      {saveTimestamp ? `Draft saved at ${saveTimestamp}` : `Status: ${status}`}
                    </div>
                  </div>
                </div>

                {/* 6. Excerpt Postbox (Collapsible) */}
                <div className="rounded-xs border border-[#ccd0d4] bg-white shadow-xs">
                  <div
                    onClick={() => setShowExcerptBox(!showExcerptBox)}
                    className="flex items-center justify-between border-b border-[#ccd0d4] bg-[#f6f7f7] px-3.5 py-2 cursor-pointer select-none hover:bg-[#edf0f2]"
                  >
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1d2327]">
                      Excerpt
                    </h3>
                    <span className="text-[#50575e]">
                      {showExcerptBox ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </div>
                  {showExcerptBox && (
                    <div className="p-3.5 space-y-3">
                      <p className="text-xs text-[#646970]">
                        Excerpts are optional hand-crafted summaries of your content that can be used in your theme.
                      </p>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#50575e] mb-1">
                          Summary (English)
                        </label>
                        <textarea
                          rows={3}
                          value={excerpt}
                          onChange={(e) => {
                            setExcerpt(e.target.value);
                            if (e.target.value !== excerpt) setExcerptKm("");
                          }}
                          placeholder="Brief summary in English..."
                          className="w-full rounded-xs border border-[#ccd0d4] p-2 text-xs text-[#1d2327] focus:border-[#2271b1] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#50575e] mb-1">
                          Summary (Khmer)
                        </label>
                        <textarea
                          rows={3}
                          value={excerptKm}
                          onChange={(e) => setExcerptKm(e.target.value)}
                          placeholder="សេចក្តីសង្ខេបជាភាសាខ្មែរ..."
                          className="w-full rounded-xs border border-[#ccd0d4] p-2 text-xs text-[#1d2327] focus:border-[#2271b1] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDEBAR: Meta Boxes (~28% width) */}
              <div className="w-full lg:w-[300px] flex-shrink-0 space-y-5">
                {renderPublishBox()}
                {renderFormatBox()}
                {renderCategoriesBox()}
                {renderFeaturedImageBox()}
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
