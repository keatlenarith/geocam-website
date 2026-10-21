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
} from "lucide-react";
import { translateText } from "../lib/translation";

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
        <td class="p-3 font-mono text-xs font-bold text-emerald-800">GC-2026-001</td>
        <td class="p-3">Cardamom Range</td>
        <td class="p-3">Sandstone / Conglomerate</td>
        <td class="p-3">Jurassic-Cretaceous</td>
        <td class="p-3">High silica content (78%)</td>
      </tr>
      <tr class="border-b border-slate-100 hover:bg-slate-50">
        <td class="p-3 font-mono text-xs font-bold text-emerald-800">GC-2026-002</td>
        <td class="p-3">Kampot Karst</td>
        <td class="p-3">Massive Limestone</td>
        <td class="p-3">Permian</td>
        <td class="p-3">High purity CaCO₃ (&gt;95%)</td>
      </tr>
      <tr class="border-b border-slate-100 hover:bg-slate-50">
        <td class="p-3 font-mono text-xs font-bold text-emerald-800">GC-2026-003</td>
        <td class="p-3">Mekong Terrace</td>
        <td class="p-3">Alluvial Silt / Clay</td>
        <td class="p-3">Quaternary</td>
        <td class="p-3">Heavy mineral traces</td>
      </tr>
    </tbody>
  </table>
</div>`,
  },
  {
    name: "Standard 3x3 Table",
    desc: "General parameter comparison table",
    html: `<div class="overflow-x-auto my-6">
  <table class="w-full text-left text-sm border-collapse border border-slate-200">
    <thead>
      <tr class="bg-slate-100 border-b border-slate-200">
        <th class="p-3 font-semibold text-slate-700">Parameter</th>
        <th class="p-3 font-semibold text-slate-700">Measured Value</th>
        <th class="p-3 font-semibold text-slate-700">Standard / Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-slate-100 hover:bg-slate-50">
        <td class="p-3 font-medium">Bulk Density (g/cm³)</td>
        <td class="p-3">2.65</td>
        <td class="p-3 text-slate-500">Standard quartz average</td>
      </tr>
      <tr class="border-b border-slate-100 hover:bg-slate-50">
        <td class="p-3 font-medium">Compressive Strength</td>
        <td class="p-3">142 MPa</td>
        <td class="p-3 text-slate-500">Laboratory load test ASTM-D7012</td>
      </tr>
    </tbody>
  </table>
</div>`,
  },
];

const CHART_TEMPLATES = [
  {
    name: "Mineral Assay Bar Chart",
    desc: "Responsive bar chart showing mineral composition percentages",
    html: `<div class="my-6 rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
  <h4 class="font-bold text-slate-900 mb-3 text-sm">Mineralogical Composition Assay (%)</h4>
  <div class="space-y-2.5 text-xs">
    <div>
      <div class="flex justify-between font-medium mb-1"><span>Quartz (SiO₂)</span><span>45%</span></div>
      <div class="w-full bg-slate-200 rounded-full h-3"><div class="bg-emerald-600 h-3 rounded-full" style="width: 45%"></div></div>
    </div>
    <div>
      <div class="flex justify-between font-medium mb-1"><span>Feldspar (Plagioclase/Orthoclase)</span><span>30%</span></div>
      <div class="w-full bg-slate-200 rounded-full h-3"><div class="bg-teal-600 h-3 rounded-full" style="width: 30%"></div></div>
    </div>
    <div>
      <div class="flex justify-between font-medium mb-1"><span>Mica / Biotite</span><span>15%</span></div>
      <div class="w-full bg-slate-200 rounded-full h-3"><div class="bg-amber-600 h-3 rounded-full" style="width: 15%"></div></div>
    </div>
    <div>
      <div class="flex justify-between font-medium mb-1"><span>Other Accessory Minerals</span><span>10%</span></div>
      <div class="w-full bg-slate-200 rounded-full h-3"><div class="bg-slate-500 h-3 rounded-full" style="width: 10%"></div></div>
    </div>
  </div>
</div>`,
  },
  {
    name: "Stratigraphic Cross-Section (SVG)",
    desc: "SVG vector diagram showing geological strata layers and depths",
    html: `<figure class="my-6">
  <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h4 class="font-bold text-slate-800 text-sm mb-3">Stratigraphic Cross-Section Profile</h4>
    <svg viewBox="0 0 600 200" class="w-full h-auto min-w-[500px]" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="580" height="35" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" rx="4"/>
      <text x="30" y="42" font-size="12" font-weight="bold" fill="#92400e">Quaternary Alluvium &amp; Soil (0 - 15m)</text>
      <rect x="10" y="60" width="580" height="45" fill="#fed7aa" stroke="#ea580c" stroke-width="1.5" rx="4"/>
      <text x="30" y="87" font-size="12" font-weight="bold" fill="#9a3412">Cretaceous Sandstone &amp; Siltstone (15 - 60m)</text>
      <rect x="10" y="110" width="580" height="45" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5" rx="4"/>
      <text x="30" y="137" font-size="12" font-weight="bold" fill="#334155">Permian Karst Limestone (60 - 120m)</text>
      <rect x="10" y="160" width="580" height="30" fill="#cbd5e1" stroke="#475569" stroke-width="1.5" rx="4"/>
      <text x="30" y="180" font-size="12" font-weight="bold" fill="#1e293b">Precambrian Crystalline Basement (&gt;120m)</text>
    </svg>
  </div>
  <figcaption class="text-xs text-slate-500 mt-2 text-center italic">Figure: Simplified regional stratigraphic profile across survey corridor.</figcaption>
</figure>`,
  },
  {
    name: "Seismic & Hazard Metric Card",
    desc: "Key metrics card displaying magnitude, focal depth, fault zone, and status",
    html: `<div class="my-6 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
  <div class="bg-white p-3 rounded-lg border border-slate-100 shadow-sm text-center">
    <div class="text-xs text-slate-500 font-semibold uppercase">Magnitude</div>
    <div class="text-2xl font-extrabold text-emerald-700 mt-1">4.2 Mw</div>
  </div>
  <div class="bg-white p-3 rounded-lg border border-slate-100 shadow-sm text-center">
    <div class="text-xs text-slate-500 font-semibold uppercase">Focal Depth</div>
    <div class="text-2xl font-extrabold text-slate-800 mt-1">12.4 km</div>
  </div>
  <div class="bg-white p-3 rounded-lg border border-slate-100 shadow-sm text-center">
    <div class="text-xs text-slate-500 font-semibold uppercase">Active Fault</div>
    <div class="text-lg font-bold text-slate-800 mt-2">Mae Ping Ext.</div>
  </div>
  <div class="bg-white p-3 rounded-lg border border-slate-100 shadow-sm text-center">
    <div class="text-xs text-slate-500 font-semibold uppercase">Alert Level</div>
    <div class="text-lg font-bold text-emerald-600 mt-2">Green / Normal</div>
  </div>
</div>`,
  },
];

async function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 900;
        let { width, height } = img;
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(e.target?.result as string);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/webp", 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function insertHtmlAtCursor(
  textarea: HTMLTextAreaElement | null,
  before: string,
  after = "",
  defaultText = "",
  currentValue: string,
  setter: (val: string) => void,
) {
  if (!textarea) {
    setter(
      currentValue
        ? `${currentValue}\n\n${before}${defaultText}${after}`
        : `${before}${defaultText}${after}`,
    );
    return;
  }
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = currentValue.slice(start, end) || defaultText;
  const next =
    currentValue.slice(0, start) +
    before +
    selected +
    after +
    currentValue.slice(end);
  setter(next);
  setTimeout(() => {
    textarea.focus();
    const cursor = start + before.length + selected.length;
    textarea.setSelectionRange(cursor, cursor);
  }, 0);
}

export default function PostManager() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // Form state
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

  const loadData = async () => {
    const rows = await fetchNewsDrafts();
    if (mounted.current) {
      setItems(rows);
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
            openEdit(match);
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
        if (mounted.current) setError(e.message || "Could not load posts.");
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

  const populate = (item: NewsItem, newItem: boolean) => {
    setIsNew(newItem);
    setEditingItem(newItem ? null : item);
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

  const openEdit = (item: NewsItem) =>
    guard(() => {
      const targetId = isManagedNews(item.id)
        ? item.id
        : SEED_UUID_MAP[item.id] || crypto.randomUUID();
      populate({ ...item, id: targetId }, false);
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
      populate(saved, false);
      setItems((rows) => [
        saved,
        ...rows.filter(
          (row) =>
            row.id !== saved.id &&
            row.id !== editingItem?.id &&
            SEED_UUID_MAP[row.id] !== saved.id,
        ),
      ]);
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

  const handleDelete = async (item: NewsItem) => {
    if (!window.confirm(`Delete “${item.title}” and its public version?`))
      return;
    setSaving(true);
    setError("");
    try {
      await deleteNewsItem(item.id);
      if (mounted.current) {
        setItems((rows) =>
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

  const handleTogglePublish = async (item: NewsItem) => {
    setSaving(true);
    setError("");
    try {
      const updated = await togglePublishNews(item.id);
      if (mounted.current && updated) {
        setItems((rows) =>
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
      const figureHtml = `\n<figure class="my-6">\n  <img src="${compressed}" alt="${photoAltInput || "Geological photo"}" class="rounded-xl w-full max-h-[480px] object-cover shadow-md" />\n  <figcaption class="text-xs text-slate-500 mt-2 text-center italic">${photoCaptionInput || "Photo caption"}</figcaption>\n</figure>\n`;
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
    const figureHtml = `\n<figure class="my-6">\n  <img src="${photoUrlInput.trim()}" alt="${photoAltInput.trim() || "Article image"}" class="rounded-xl w-full max-h-[480px] object-cover shadow-md" />\n  <figcaption class="text-xs text-slate-500 mt-2 text-center italic">${photoCaptionInput.trim() || "Figure caption"}</figcaption>\n</figure>\n`;
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
    const figureHtml = `\n<figure class="my-6">\n  <img src="${preset.url}" alt="${preset.label}" class="rounded-xl w-full max-h-[480px] object-cover shadow-md" />\n  <figcaption class="text-xs text-slate-500 mt-2 text-center italic">${preset.caption}</figcaption>\n</figure>\n`;
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

  // Filter items
  const filtered = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      (item.titleKm && item.titleKm.includes(search));
    const matchesTag = selectedTag === "All" || item.tag === selectedTag;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesTag && matchesStatus;
  });

  // Reusable rich editor toolbar
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
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-lg border-b border-slate-200 bg-slate-50 px-3 py-2">
        {/* Formatting actions */}
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
                "\n<blockquote class=\"border-l-4 border-emerald-600 bg-emerald-50/50 p-4 rounded-r-lg my-4 italic text-slate-800\">\n  ",
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
            onClick={() => setActiveInserter({ target, type: "photo" })}
            className="flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200 shadow-xs hover:bg-emerald-50"
          >
            <ImageIcon size={13} /> + Photo
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            📰 Posts &amp; News Management
          </h2>
          <p className="text-sm text-slate-500">
            Publish geological announcements, field trip updates, research
            findings, and articles.
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

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search posts by title or summary..."
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

      {/* Posts Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="p-4">Cover</th>
              <th className="p-4">Title &amp; Summary</th>
              <th className="p-4">Category</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  {loading
                    ? "Loading posts..."
                    : "No news posts match your criteria. Click \"+ Create New Post\" above to add one."}
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
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="font-bold text-slate-900 hover:text-emerald-700 transition line-clamp-1 text-left cursor-pointer"
                      title="Click to edit post"
                    >
                      {item.title}
                    </button>
                    {item.titleKm && (
                      <div className="text-xs text-emerald-700 line-clamp-1 mt-0.5">
                        {item.titleKm}
                      </div>
                    )}
                    <div className="mt-1 text-xs text-slate-500 line-clamp-1">
                      {item.excerpt}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {item.tag}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="p-4">
                    <button
                      disabled={saving}
                      onClick={() => handleTogglePublish(item)}
                      title="Click to toggle publication status"
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold transition ${
                        item.status === "published"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          item.status === "published"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {item.status === "published" ? "Live" : "Draft"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      <a
                        href={`/news/item?id=${encodeURIComponent(item.id)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                      >
                        <ExternalLink size={13} /> View
                      </a>
                      <button
                        aria-label={"Delete " + item.title}
                        disabled={saving}
                        onClick={() => handleDelete(item)}
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Drawer Modal */}
      {(isNew || editingItem) && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-editor-title"
            className="relative w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3
                  id="post-editor-title"
                  className="text-xl font-bold text-slate-900"
                >
                  {isNew
                    ? "✨ Create New News Post"
                    : `✏️ Edit News Post: ${title || "Untitled"}`}
                </h3>
                <p className="text-xs text-slate-500">
                  Save a private draft, or Publish Live to immediately update
                  the public website and news directory.
                </p>
              </div>
              <button
                disabled={saving}
                aria-label="Close post editor"
                onClick={close}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <fieldset
              disabled={saving}
              className="mt-5 space-y-4 max-h-[72vh] overflow-y-auto pr-2"
            >
              {/* Dual Language Sync Helper */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                <div className="text-xs text-emerald-800">
                  English is the primary source. Editing English clears the
                  matching Khmer override. You can translate catalog terms or
                  write native Khmer prose.
                </div>
                <button
                  type="button"
                  onClick={handleTranslateAll}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
                >
                  <Sparkles size={14} /> Fill known Khmer phrases
                </button>
              </div>

              {/* Title EN & KM */}
              <div className="grid gap-4 sm:grid-cols-2">
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
                    placeholder="e.g. Geological fieldwork resumes along Cardamom foothills"
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
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
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Date */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Category / Tag
                  </label>
                  <div className="mt-1 flex gap-2">
                    <select
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
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
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                    />
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
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Cover Photo / Image URL
                  </label>
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <Upload size={12} /> Upload from device
                  </button>
                </div>
                <div className="mt-1 flex gap-3 items-center">
                  <input
                    type="text"
                    aria-label="Cover image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or upload local image"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      className="h-10 w-16 rounded-md object-cover border border-slate-200"
                    />
                  )}
                </div>

                {/* Photo Presets */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400">
                    Quick Geological Presets:
                  </span>
                  {PHOTO_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setImage(p.url)}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700 hover:bg-slate-100"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Excerpt EN & KM */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Excerpt / Card Summary (English)
                  </label>
                  <textarea
                    rows={3}
                    aria-label="Summary (English)"
                    value={excerpt}
                    onChange={(e) => {
                      setExcerpt(e.target.value);
                      if (e.target.value !== excerpt) setExcerptKm("");
                    }}
                    placeholder="Short summary displayed on homepage card..."
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Excerpt / Card Summary (Khmer)
                  </label>
                  <textarea
                    rows={3}
                    aria-label="Summary (Khmer)"
                    value={excerptKm}
                    onChange={(e) => setExcerptKm(e.target.value)}
                    placeholder="សេចក្តីសង្ខេបជាភាសាខ្មែរ..."
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Full Content EN (with rich inserters & preview) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Full Story / Article Content (English HTML)
                  </label>
                  <span className="text-xs text-slate-400">
                    Insert photos, charts, and tables using toolbar below
                  </span>
                </div>
                <div className="overflow-hidden rounded-lg border border-slate-300 focus-within:border-emerald-500">
                  {renderEditorToolbar("content")}
                  {viewModeEn === "code" ? (
                    <textarea
                      ref={contentTextareaRef}
                      rows={8}
                      aria-label="Body (HTML) (English)"
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                        if (e.target.value !== content) setContentKm("");
                      }}
                      placeholder="Write your article body here. Click '+ Photo', '+ Graph / Chart', or '+ Table' above to insert rich elements."
                      className="w-full p-3 font-mono text-sm leading-relaxed focus:outline-none min-h-[180px]"
                    />
                  ) : (
                    <div
                      className="geocam-article-body p-4 bg-slate-50/50 min-h-[180px] max-h-[360px] overflow-y-auto"
                      dangerouslySetInnerHTML={{
                        __html:
                          cleanPostHtml(content) ||
                          '<p class="italic text-slate-400">No content entered yet. Switch to HTML tab to write.</p>',
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Full Content KM (with rich inserters & preview) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Full Story / Article Content (Khmer)
                  </label>
                  <span className="text-xs text-slate-400">
                    ខ្លឹមសារជាភាសាខ្មែរ
                  </span>
                </div>
                <div className="overflow-hidden rounded-lg border border-slate-300 focus-within:border-emerald-500">
                  {renderEditorToolbar("contentKm")}
                  {viewModeKm === "code" ? (
                    <textarea
                      ref={contentKmTextareaRef}
                      rows={6}
                      aria-label="Body (HTML) (Khmer)"
                      value={contentKm}
                      onChange={(e) => setContentKm(e.target.value)}
                      placeholder="ខ្លឹមសារអត្ថបទពេញលេញជាភាសាខ្មែរ..."
                      className="w-full p-3 font-mono text-sm leading-relaxed focus:outline-none min-h-[150px]"
                    />
                  ) : (
                    <div
                      className="geocam-article-body p-4 bg-slate-50/50 min-h-[150px] max-h-[300px] overflow-y-auto"
                      dangerouslySetInnerHTML={{
                        __html:
                          cleanPostHtml(contentKm) ||
                          '<p class="italic text-slate-400">មិនទាន់មានខ្លឹមសារខ្មែរនៅឡើយទេ។</p>',
                      }}
                    />
                  )}
                </div>
              </div>
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

            {/* Modal Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600">
                  Status:
                </label>
                <span className="text-xs font-medium">
                  {status === "published"
                    ? "Published snapshot exists (Public)"
                    : "Draft (Private)"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={close}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-xs hover:bg-slate-50 transition"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave(true)}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition"
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
                  <button
                    type="button"
                    disabled={!photoUrlInput.trim()}
                    onClick={handleInsertCustomPhoto}
                    className="w-full rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white disabled:opacity-50 hover:bg-emerald-700 transition"
                  >
                    Insert Image from URL
                  </button>
                </div>
              </div>
            )}

            {/* Chart Inserter Body */}
            {activeInserter.type === "chart" && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-500">
                  Select a chart template to insert clean, responsive visual data
                  into your story:
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
                  Select a structured table template to display scientific
                  measurements or inventories:
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
              Your post has unsaved changes. Save a draft before leaving,
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
    </div>
  );
}
