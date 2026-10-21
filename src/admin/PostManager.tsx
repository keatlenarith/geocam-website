import { useState, useEffect, useRef } from "react";
import {
  fetchNewsDrafts,
  isManagedNews,
  saveNewsItem,
  deleteNewsItem,
  togglePublishNews,
  type NewsItem,
} from "../lib/news-service";
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
} from "lucide-react";
import { translateText } from "../lib/translation";

const PHOTO_PRESETS = [
  {
    label: "🏔️ Field Training Outcrop",
    url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "🌊 Riverbank & Geohazards",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "🏛️ Annual Geoscience Forum",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "🧪 Geochemical Lab Assays",
    url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "💎 Mineral Crystals & Ores",
    url: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "🛰️ Satellite & Geophysics",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
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

export default function PostManager() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
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


  const [error,setError]=useState('');
  const [loading,setLoading]=useState(true);
  const [baseline,setBaseline]=useState('');
  const [pending,setPending]=useState<null|(()=>void)>(null);
  const mounted=useRef(true), dialog=useRef<HTMLDivElement>(null), previousFocus=useRef<HTMLElement|null>(null);
  const form=JSON.stringify([title,titleKm,tag,date,image,excerpt,excerptKm,content,contentKm,status]);
  const dirty=(isNew||!!editingItem)&&form!==baseline;
  const state=useRef({dirty,saving});state.current={dirty,saving};
  const loadData=async()=>{const rows=await fetchNewsDrafts();if(mounted.current)setItems(rows);};
  useEffect(()=>{mounted.current=true;loadData().catch(e=>{if(mounted.current)setError(e.message||'Could not load posts.');}).finally(()=>{if(mounted.current)setLoading(false);});return()=>{mounted.current=false;};},[]);
  const guard=(action:()=>void)=>{if(state.current.saving)return;if(state.current.dirty)setPending(()=>action);else action();};
  useEffect(()=>{
    const unload=(e:BeforeUnloadEvent)=>{if(state.current.dirty){e.preventDefault();e.returnValue='';}};
    const click=(e:MouseEvent)=>{if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;const a=(e.target as Element).closest?.('a[href]') as HTMLAnchorElement|null;if(!a||a.target==='_blank'||a.hasAttribute('download')||(!state.current.dirty&&!state.current.saving))return;e.preventDefault();e.stopPropagation();guard(()=>location.assign(a.href));};
    const request=(e:Event)=>{const proceed=(e as CustomEvent<{proceed:()=>void}>).detail?.proceed;if(proceed){e.preventDefault();guard(proceed);}};
    window.addEventListener('beforeunload',unload);document.addEventListener('click',click,true);window.addEventListener('geocam:request-navigation',request);
    return()=>{window.removeEventListener('beforeunload',unload);document.removeEventListener('click',click,true);window.removeEventListener('geocam:request-navigation',request);};
  },[]);
  useEffect(()=>{if(!pending)return;previousFocus.current=document.activeElement as HTMLElement;dialog.current?.focus();return()=>previousFocus.current?.focus();},[pending]);
  const close=()=>guard(()=>{setIsNew(false);setEditingItem(null);});
  const populate=(item:NewsItem,newItem:boolean)=>{setIsNew(newItem);setEditingItem(newItem?null:item);setTitle(item.title);setTitleKm(item.titleKm);setTag(item.tag);setDate(item.date);setImage(item.image);setExcerpt(item.excerpt);setExcerptKm(item.excerptKm);setContent(item.content);setContentKm(item.contentKm);setStatus(item.status);setBaseline(JSON.stringify([item.title,item.titleKm,item.tag,item.date,item.image,item.excerpt,item.excerptKm,item.content,item.contentKm,item.status]));setError('');setMessage('');};
  const openNew=()=>guard(()=>populate({id:'',title:'',titleKm:'',tag:'Education',date:new Date().toISOString().slice(0,10),image:PHOTO_PRESETS[0].url,excerpt:'',excerptKm:'',content:'',contentKm:'',status:'draft',updatedAt:''},true));
  const openEdit=(item:NewsItem)=>guard(()=>populate(item,false));
  const handleTranslateAll=()=>{if(title&&!titleKm&&translateText(title)!==title)setTitleKm(translateText(title));if(excerpt&&!excerptKm&&translateText(excerpt)!==excerpt)setExcerptKm(translateText(excerpt));if(content&&!contentKm&&translateText(content)!==content)setContentKm(translateText(content));setMessage('Known catalog phrases filled where available. New prose needs a Khmer translation; this is not a translation service.');};
  const handleSave=async(publishNow=false):Promise<boolean>=>{
    if(!title.trim()){setError('Add an English title before saving or publishing.');return false;}
    setSaving(true);state.current.saving=true;setError('');setMessage('');
    try{const saved=await saveNewsItem({id:editingItem?.id,title:title.trim(),titleKm:titleKm.trim(),tag,date,image:image.trim(),excerpt:excerpt.trim(),excerptKm:excerptKm.trim(),content:content.trim(),contentKm:contentKm.trim(),status},publishNow);if(!mounted.current)return false;state.current.dirty=false;populate(saved,false);setItems(rows=>[saved,...rows.filter(row=>row.id!==saved.id)]);setMessage(publishNow?'Post published.':'Draft saved. The public version changes only when you publish.');return true;}
    catch(failure){if(mounted.current)setError((failure as {message?:string})?.message||'Could not save. Your edits are still here.');return false;}
    finally{state.current.saving=false;if(mounted.current)setSaving(false);}
  };
  const handleDelete=async(item:NewsItem)=>{if(!window.confirm(`Delete “${item.title}” and its public version?`))return;setSaving(true);setError('');try{await deleteNewsItem(item.id);if(mounted.current){setItems(rows=>rows.filter(row=>row.id!==item.id));setMessage('Post deleted.');}}catch(e){if(mounted.current)setError((e as {message?:string})?.message||'Could not delete post.');}finally{if(mounted.current)setSaving(false);}};
  const handleTogglePublish=async(item:NewsItem)=>{setSaving(true);setError('');try{const updated=await togglePublishNews(item.id);if(mounted.current&&updated){setItems(rows=>rows.map(row=>row.id===updated.id?updated:row));setMessage(updated.status==='published'?'Post published.':'Post unpublished.');}}catch(e){if(mounted.current)setError((e as {message?:string})?.message||'Could not change publication status.');}finally{if(mounted.current)setSaving(false);}};

  // Filter items
  const filtered = items.filter((item) => {
    const matchStatus =
      statusFilter === "all" ? true : item.status === statusFilter;
    const matchTag =
      selectedTag === "All" ? true : item.tag.toLowerCase() === selectedTag.toLowerCase();
    const query = search.toLowerCase();
    const matchSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.titleKm.toLowerCase().includes(query) ||
      item.excerpt.toLowerCase().includes(query) ||
      item.tag.toLowerCase().includes(query);
    return matchStatus && matchTag && matchSearch;
  });

  const publishedCount = items.filter((i) => i.status === "published").length;
  const draftCount = items.filter((i) => i.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Latest News & Posts
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Create, edit, or publish news displayed on the GeoCam homepage "Latest news" and the news directory.
          </p>
        </div>
        <button
          disabled={saving} onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
        >
          <Plus size={16} /> + Create New Post
        </button>
      </div>

      {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-red-800">{error}</p>}
      {loading && <p role="status">Loading posts…</p>}
      {message && (
        <div role="status" className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 font-medium">
          {message}
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              statusFilter === "all"
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            All Posts ({items.length})
          </button>
          <button
            onClick={() => setStatusFilter("published")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              statusFilter === "published"
                ? "bg-emerald-600 text-white shadow"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            onClick={() => setStatusFilter("draft")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              statusFilter === "draft"
                ? "bg-amber-600 text-white shadow"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search news by title or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Filter Category:
        </span>
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setSelectedTag(c)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              selectedTag.toLowerCase() === c.toLowerCase()
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Posts Table / Cards */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
            <tr>
              <th className="p-4">Preview</th>
              <th className="p-4">Title & Details</th>
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
                  No news posts match your criteria. Click "+ Create New Post" above to add one.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 w-28">
                    <img
                      src={item.image || PHOTO_PRESETS[0].url}
                      alt=""
                      className="h-16 w-24 rounded-lg object-cover border border-slate-200 shadow-sm"
                    />
                  </td>
                  <td className="p-4 max-w-md">
                    <div className="font-bold text-slate-900 line-clamp-1">
                      {item.title}
                    </div>
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
                      disabled={saving || !isManagedNews(item.id)} onClick={() => handleTogglePublish(item)}
                      title={isManagedNews(item.id)?"Click to toggle status":"Read-only demonstration story"}
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
                      {!isManagedNews(item.id)?"Demo":item.status === "published" ? "Live" : "Draft"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                      >
                        <Edit3 size={13} /> {isManagedNews(item.id)?"Edit":"Create copy"}
                      </button>
                      <a
                        href={`/news/item?id=${encodeURIComponent(item.id)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                      >
                        <ExternalLink size={13} /> View
                      </a>
                      <button
                        aria-label={"Delete "+item.title} disabled={saving || !isManagedNews(item.id)} onClick={() => handleDelete(item)}
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div role="dialog" aria-modal="true" aria-labelledby="post-editor-title" className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 id="post-editor-title" className="text-xl font-bold text-slate-900">
                  {isNew ? "✨ Create New News Post" : "✏️ Edit News Post"}
                </h3>
                <p className="text-xs text-slate-500">
                  Save a private draft, then Publish Live to update the public news directory.
                </p>
              </div>
              <button
                disabled={saving} aria-label="Close post editor" onClick={close}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <fieldset disabled={saving} className="mt-5 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Dual Language Sync Helper */}
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                <div className="text-xs text-emerald-800">
                  English is the source. Editing English clears the matching Khmer override. Known catalog phrases can be filled; new prose needs a Khmer translation.
                </div>
                <button
                  type="button"
                  onClick={handleTranslateAll}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
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
                    aria-label="Title (English)" value={title}
                    onChange={(e) => {setTitle(e.target.value);if(e.target.value!==title)setTitleKm("");}}
                    placeholder="e.g. Field training resumes along Cardamom foothills"
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Title (Khmer)
                  </label>
                  <input
                    type="text"
                    aria-label="Title (Khmer)" value={titleKm}
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
                    aria-label="Publish Date" value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Cover Photo / Image URL
                </label>
                <div className="mt-1 flex gap-3 items-center">
                  <input
                    type="text"
                    aria-label="Cover image URL" value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
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
                    aria-label="Summary (English)" value={excerpt}
                    onChange={(e) => {setExcerpt(e.target.value);if(e.target.value!==excerpt)setExcerptKm("");}}
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
                    aria-label="Summary (Khmer)" value={excerptKm}
                    onChange={(e) => setExcerptKm(e.target.value)}
                    placeholder="សេចក្តីសង្ខេបជាភាសាខ្មែរ..."
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Full Content EN & KM */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Full Story / Article Content (English HTML)
                  </label>
                  <textarea
                    rows={5}
                    aria-label="Body (HTML) (English)" value={content}
                    onChange={(e) => {setContent(e.target.value);if(e.target.value!==content)setContentKm("");}}
                    placeholder="Use &lt;p&gt; for paragraphs, &lt;h2&gt; for headings, &lt;strong&gt; for bold and &lt;ul&gt;&lt;li&gt; for lists."
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Full Story / Article Content (Khmer)
                  </label>
                  <textarea
                    rows={5}
                    aria-label="Body (HTML) (Khmer)" value={contentKm}
                    onChange={(e) => setContentKm(e.target.value)}
                    placeholder="ខ្លឹមសារអត្ថបទពេញលេញជាភាសាខ្មែរ..."
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </fieldset>

            {error && <p role="alert" className="mt-3 text-red-800">{error}</p>}
            {message && <p role="status" className="mt-3 text-emerald-800">{message}</p>}
            {/* Modal Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600">Status:</label>
                <span className="text-xs">{status === "published" ? "Published snapshot exists" : "Draft"}</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={saving} onClick={close}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition"
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

      {pending&&<div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 p-4"><div ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="post-unsaved-title" className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl" onKeyDown={e=>{if(e.key==='Escape'&&!saving)setPending(null);if(e.key==='Tab'){const buttons=dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');if(!buttons?.length)return;const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===dialog.current)){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}}><h3 id="post-unsaved-title" className="text-xl font-bold">Save your changes?</h3><p className="my-4">Your post has unsaved changes. Save a draft before leaving, discard these changes, or keep editing.</p>{error&&<p role="alert" className="mb-3 text-red-800">{error}</p>}<div className="flex flex-wrap gap-2"><button className="rounded bg-emerald-700 p-3 text-white" disabled={saving} onClick={async()=>{const action=pending;if(await handleSave(false)){setPending(null);action();}}}>Save draft and leave</button><button className="rounded border p-3" disabled={saving} onClick={()=>{state.current.dirty=false;const action=pending;setPending(null);action();}}>Discard changes</button><button className="rounded border p-3" disabled={saving} onClick={()=>setPending(null)}>Keep editing</button></div></div></div>}
    </div>
  );
}
