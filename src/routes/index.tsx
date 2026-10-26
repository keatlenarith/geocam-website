import { createFileRoute, Link } from "@/lib/spa-router";
import hero from "@/assets/hero-background.webp";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect, useMemo } from "react";
import { useCms } from "@/visual-cms/VisualCms";
import { useAdmin } from "@/admin/Auth";
import { researchAreas } from "@/lib/data";
import { getStoredEvents } from "@/lib/event-service";
import { getPublishedNews, type NewsItem } from "@/lib/news-service";
import { meta } from "@/components/site/Chrome";
import { LiveTickerRibbon } from "@/components/site/LiveTickerRibbon";
import { KnowledgeBillboard } from "@/components/site/KnowledgeBillboard";
import { EarthquakeAnnouncements } from "@/features/earthquakes/EarthquakeAnnouncements";
import { useEarthquakes } from "@/features/earthquakes/useEarthquakes";
import { ArrowUpRight, ArrowRight, Layers3, Mountain, BookOpen, Microscope, Users, Globe2, Compass, Sparkles, FileText, CalendarDays, MapPinned } from "lucide-react";

export const Route = createFileRoute("/")({head:()=>meta("Geosciences Society of Cambodia","GeoCam — Cambodia's geoscience knowledge, maps, community and geological lexicon."),component:Home});

const copy = {
 en:{pill:"CAMBODIA'S GEOSCIENCE COMMUNITY",headingA:"Explore the earth",headingB:"Understand Cambodia",subtitle:"One home for geological knowledge, interactive maps, field discoveries, scientific resources, and the people shaping geoscience in Cambodia.",explore:"Explore GeoData",discover:"Discover our mission",featured:"Explore GeoCam",featuredSub:"Your gateway to Cambodia's geological knowledge and digital resources.",mining:"Cambodia Mining Portal",miningSub:"Mineral licenses, legislation and geological resource information.",maps:"Interactive maps",mapsSub:"Geological overlays, terrain, topography and satellite imagery.",park:"3D Geopark Explorer",parkSub:"Explore geosites and landscapes in immersive 3D.",lex:"Geoscience Lexicon",lexSub:"Explore English–Khmer geological terminology and definitions.",research:"Research & discovery",researchSub:"Science-led research, collaboration and field learning.",missionTag:"BUILT FOR DISCOVERY",missionTitle:"Science connects us to the land beneath our feet.",missionBody:"GeoCam brings together students, researchers and professionals to share evidence-based geological knowledge, advance education and strengthen geoscience in Cambodia.",missionLink:"Learn about GeoCam",areas:"Our areas of focus",areasSub:"From field observations to geospatial innovation.",updates:"From the community",updatesSub:"News, events and opportunities to connect.",latest:"Latest news",events:"Upcoming events",all:"View all",ctaTag:"BECOME PART OF GEOCAM",ctaTitle:"Let's explore Cambodia's geology together.",ctaSub:"Join a growing community of geoscience enthusiasts, students and professionals.",join:"Become a member",footerNote:"A geoscience platform for learning, research and collaboration."},
 km:{pill:"សហគមន៍ភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា",headingA:"ស្វែងយល់ពីផែនដី",headingB:"ស្គាល់កម្ពុជាកាន់តែច្បាស់",subtitle:"មជ្ឈមណ្ឌលចំណេះដឹងភូគព្ភវិទ្យាសាស្ត្រ ផែនទីអន្តរកម្ម ការស្រាវជ្រាវ ធនធានវិទ្យាសាស្ត្រ និងសហគមន៍អ្នកជំនាញនៅកម្ពុជា។",explore:"ស្វែងរកទិន្នន័យភូគព្ភសាស្ត្រ",discover:"ស្វែងយល់ពីបេសកកម្ម",featured:"ស្វែងយល់ពី GeoCam",featuredSub:"ច្រកចូលទៅកាន់ចំណេះដឹង និងធនធានឌីជីថលផ្នែកភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា",mining:"មជ្ឈមណ្ឌលព័ត៌មានវិស័យរ៉ែកម្ពុជា",miningSub:"អាជ្ញាបណ្ណរ៉ែ ច្បាប់ និងព័ត៌មានធនធានភូគព្ភសាស្ត្រ។",maps:"ផែនទីអន្តរកម្ម",mapsSub:"ស្រទាប់ភូគព្ភសាស្ត្រ ទីតាំងដី ផែនទីភូមិសាស្ត្រ និងរូបភាពផ្កាយរណប។",park:"ឧទ្យានភូគព្ភសាស្ត្រ 3D",parkSub:"ស្វែងយល់ពីទីតាំងភូគព្ភសាស្ត្រ និងទេសភាពបីវិមាត្រ។",lex:"សទ្ទានុក្រមភូគព្ភវិទ្យាសាស្ត្រ",lexSub:"ស្វែងរកពាក្យបច្ចេកទេស និងនិយមន័យជាភាសាអង់គ្លេស–ខ្មែរ។",research:"ការស្រាវជ្រាវ និងរបកគំហើញ",researchSub:"ការស្រាវជ្រាវ កិច្ចសហការ និងការសិក្សាតាមទីវាល។",missionTag:"ចំណេះដឹងសម្រាប់អនាគត",missionTitle:"វិទ្យាសាស្ត្រភ្ជាប់យើងទៅនឹងដែនដី",missionBody:"GeoCam ប្រមូលផ្តុំនិស្សិត អ្នកស្រាវជ្រាវ និងអ្នកជំនាញ ដើម្បីចែករំលែកចំណេះដឹងភូគព្ភវិទ្យាសាស្ត្រផ្អែកលើភស្តុតាង និងលើកកម្ពស់ការអប់រំនៅកម្ពុជា។",missionLink:"អំពី GeoCam",areas:"វិស័យសំខាន់ៗ",areasSub:"ពីការសិក្សាទីវាលទៅកាន់នវានុវត្តន៍ភូមិសាស្ត្រឌីជីថល។",updates:"ព័ត៌មានសហគមន៍",updatesSub:"ព័ត៌មាន ព្រឹត្តិការណ៍ និងឱកាសចូលរួម។",latest:"ព័ត៌មានថ្មីៗ",events:"ព្រឹត្តិការណ៍ខាងមុខ",all:"មើលទាំងអស់",ctaTag:"ចូលរួមជាមួយ GEOCAM",ctaTitle:"រួមគ្នាស្វែងយល់ពីភូគព្ភសាស្ត្រកម្ពុជា។",ctaSub:"ចូលរួមសហគមន៍និស្សិត អ្នកស្រាវជ្រាវ និងអ្នកជំនាញភូគព្ភវិទ្យាសាស្ត្រ។",join:"ក្លាយជាសមាជិក",footerNote:"វេទិកាចំណេះដឹង ការស្រាវជ្រាវ និងកិច្ចសហការភូគព្ភវិទ្យាសាស្ត្រ។"}
};
const features=[{to:"/mining",icon:FileText,title:"mining",desc:"miningSub",tone:"teal",image:"/images/cms/feature-photo-mining.jpg",alt:"Mining and mineral resources"},{to:"/geodata",icon:Layers3,title:"maps",desc:"mapsSub",tone:"teal",image:"/images/cms/feature-photo-maps.jpg",alt:"Topographic maps and geospatial data"},{to:"/geopark",icon:Mountain,title:"park",desc:"parkSub",tone:"amber",image:"/images/cms/feature-photo-park.jpg",alt:"Kampot province mountain landscape, Cambodia"},{to:"/lexicon",icon:BookOpen,title:"lex",desc:"lexSub",tone:"blue",image:"/images/cms/feature-photo-lex.jpg",alt:"Geoscience reference books"},{to:"/research",icon:Microscope,title:"research",desc:"researchSub",tone:"olive",image:"/images/cms/feature-photo-research.jpg",alt:"Researcher using scientific laboratory equipment"}] as const;
const focusImages: Record<string, {src: string; alt: string}> = {
  "Tectonics": {
    src: "/images/cms/focus-tectonics-image.jpg",
    alt: "Folded geological strata, thrust faults, and mountain rock formations"
  },
  "Mineral deposits": {
    src: "/images/cms/focus-mineral-deposits-image.jpg",
    alt: "Mineral crystals, ore specimens, and geological gemstone veins"
  },
  "Geochemistry": {
    src: "/images/cms/focus-geochemistry-image.jpg",
    alt: "Geochemical laboratory analysis, elemental assays, and sediment testing"
  },
  "Geophysics": {
    src: "/images/cms/focus-geophysics-image.jpg",
    alt: "Subsurface geophysical survey, sensing data, and magnetic sounding"
  },
  "Geohazards": {
    src: "/images/cms/focus-geohazards-image.png",
    alt: "Mountain slope stability, canyon erosion, and geological fault hazard observation"
  },
  "Environmental Hydrogeology": {
    src: "/images/cms/focus-environmental-hydrogeology-image.png",
    alt: "Groundwater aquifers, alluvial hydrogeology, arsenic geochemistry, and water resources monitoring in Cambodia"
  },
  "Marine Geology": {
    src: "/images/cms/focus-marine-geology-image.png",
    alt: "Offshore marine basins, Gulf of Thailand tectonic evolution, coastal sediment dynamics, and offshore bathymetry"
  },
};
type HomeVideo = {
  id: string;
  title: string;
  url: string;
  description: string;
  category?: string;
  categoryKm?: string;
};

const VIDEO_CATEGORIES = [
  { id: "all", labelEn: "All Videos", labelKm: "ទាំងអស់" },
  { id: "field-work", labelEn: "Field Expeditions", labelKm: "ការងារទីវាល" },
  { id: "education", labelEn: "Education & Lectures", labelKm: "ការអប់រំ និងបាឋកថា" },
  { id: "documentary", labelEn: "Documentaries", labelKm: "ភាពយន្តឯកសារ" },
  { id: "general", labelEn: "General News & Updates", labelKm: "ព័ត៌មានទូទៅ & បច្ចុប្បន្នភាព" },
] as const;

function matchVideoCategory(cat?: string): string {
  if (!cat) return "general";
  const val = cat.trim().toLowerCase();
  if (val === "field-work" || val.includes("field") || val.includes("ទីវាល")) return "field-work";
  if (val === "education" || val.includes("edu") || val.includes("lecture") || val.includes("អប់រំ") || val.includes("បាឋកថា")) return "education";
  if (val === "documentary" || val.includes("doc") || val.includes("ឯកសារ")) return "documentary";
  return "general";
}

function getVideoCategoryLabel(categoryKey: string, km: boolean): string {
  const matched = VIDEO_CATEGORIES.find(c => c.id === categoryKey);
  if (!matched) return km ? "ទូទៅ" : "General";
  return km ? matched.labelKm : matched.labelEn;
}

const defaultHomeVideos: HomeVideo[] = [
  {
    id: "geocam-playlist-one",
    title: "Geoscience playlist 1",
    url: "https://www.youtube.com/watch?v=KxH-9WQ9m3Y&list=PL5yaghDzLHa45AXB9dIRwYscgIw_GGQvw",
    description: "Explore the first collection. Use the playlist menu inside the player to choose another video.",
    category: "field-work",
    categoryKm: "ការងារទីវាល",
  },
  {
    id: "geocam-playlist-two",
    title: "Geoscience playlist 2",
    url: "https://www.youtube.com/playlist?list=PL5yaghDzLHa4D9HD6cvtARyhaDW6Vdlo1",
    description: "Explore the second collection. Use the playlist menu inside the player to choose another video.",
    category: "education",
    categoryKm: "ការអប់រំ និងបាឋកថា",
  },
];

function videoSource(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtube-nocookie.com"].includes(host)) {
      const id = host === "youtu.be" ? url.pathname.slice(1).split("/")[0]
        : url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
      const playlist = url.searchParams.get("list");
      const validPlaylist = playlist && /^[\w-]{10,100}$/.test(playlist) ? playlist : null;
      if (id && /^[\w-]{11}$/.test(id)) return { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${id}${validPlaylist ? `?list=${validPlaylist}` : ""}`, label: validPlaylist ? "YouTube playlist" : "YouTube", thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg` };
      if (validPlaylist) return { kind: "embed", src: `https://www.youtube-nocookie.com/embed/videoseries?list=${validPlaylist}`, label: "YouTube playlist", thumbnail: "" };
    }
    if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(host)) {
      const id = url.pathname.match(/^\/(?:video\/)?(\d+)(?:\/|$)/)?.[1];
      if (id) {
        const hash = url.searchParams.get("h") || url.pathname.match(/^\/\d+\/([a-zA-Z0-9]+)$/)?.[1];
        return { kind: "embed", src: `https://player.vimeo.com/video/${id}${hash ? `?h=${encodeURIComponent(hash)}` : ""}`, label: "Vimeo", thumbnail: "" };
      }
    }
    if (/\.(mp4|webm|ogv)$/i.test(url.pathname)) return { kind: "video", src: url.href, label: "Video", thumbnail: "" };
    return { kind: "link", src: url.href, label: host, thumbnail: "" };
  } catch { return null; }
}

function HomeVideoPlaylist() {
  const { lang } = useI18n();
  const km = lang === "km";
  const { admin } = useAdmin();
  const cms = useCms();
  const editable = admin && cms.editing && cms.ready && !cms.busy;
  const store = admin && cms.editing ? cms.draft : cms.published;
  let videos: HomeVideo[] = [];
  try {
    const parsed: unknown = JSON.parse(store["/::en"]?.["home-video-playlist"]?.value || JSON.stringify(defaultHomeVideos));
    if (Array.isArray(parsed)) videos = parsed.filter((v): v is HomeVideo =>
      v && typeof v.id === "string" && typeof v.title === "string" && typeof v.url === "string" && typeof v.description === "string" && !!videoSource(v.url));
  } catch { /* A malformed saved playlist leaves the rest of the homepage available. */ }
  const [selectedId, setSelectedId] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("field-work");
  const [formError, setFormError] = useState("");

  const filteredVideos = useMemo(() => {
    if (activeCategory === "all") return videos;
    return videos.filter(v => matchVideoCategory(v.category) === activeCategory);
  }, [videos, activeCategory]);

  const selected = videos.find(v => v.id === selectedId) || filteredVideos[0] || videos[0];
  const source = selected ? videoSource(selected.url) : null;
  useEffect(() => { setPlaying(false); setFailed(false); }, [selected?.id, selected?.url]);

  const update = (next: HomeVideo[]) => cms.setEntry("/::en", "home-video-playlist", {
    kind: "text", value: JSON.stringify(next), status: "Approved", manuallyEdited: true,
  });

  return <section id="geoscience-videos" aria-labelledby="home-videos-heading" className="gc-section mx-auto max-w-[1800px] px-5" data-no-translate data-cms-ui>
    <div className="gc-section-heading">
      <div>
        <span className="gc-kicker"><Globe2 size={15} /> {km ? "រៀនតាមរយៈវីដេអូ" : "WATCH & DISCOVER"}</span>
        <h2 id="home-videos-heading" className="gc-title">{km ? "វីដេអូភូគព្ភវិទ្យា" : "Geoscience Videos"}</h2>
        <p className="gc-subtitle">{km ? "ស្វែងយល់ពីផែនដី តាមរយៈវីដេអូដែលបានជ្រើសរើស។" : "A handpicked collection of discoveries, field stories and ideas about our planet."}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
          {videos.length} {km ? "បណ្តុំ" : videos.length === 1 ? "collection" : "collections"}
        </span>
      </div>
    </div>

    {/* Video Category Filter Tabs */}
    <div className="mb-4 flex flex-wrap items-center gap-2" role="tablist" aria-label={km ? "ប្រភេទវីដេអូ" : "Video categories"}>
      {VIDEO_CATEGORIES.map(cat => {
        const count = cat.id === "all" ? videos.length : videos.filter(v => matchVideoCategory(v.category) === cat.id).length;
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveCategory(cat.id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              isActive
                ? "bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-800 ring-offset-1"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>{km ? cat.labelKm : cat.labelEn}</span>
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
              isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>

    <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <div className="min-w-0">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-[#0b162f] text-white">
          {playing && selected && source && !failed ? source.kind === "embed"
            ? <iframe key={selected.id + selected.url} src={source.src} title={selected.title} className="absolute inset-0 h-full w-full border-0" allow="fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onError={() => setFailed(true)} />
            : source.kind === "video" ? <video key={selected.id + selected.url} src={source.src} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full" onError={() => setFailed(true)} /> : null
            : <div className="flex h-full w-full items-center justify-center p-8 text-center">
              {source?.thumbnail && <img src={source.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" />}
              <div className="relative max-w-lg">
                <span className="mx-auto mb-5 hidden h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 text-2xl sm:flex" aria-hidden="true">▷</span>
                <h3 className="text-xl font-semibold md:text-2xl">{selected?.title || (km ? "ការរកឃើញបន្ទាប់ ចាប់ផ្តើមនៅទីនេះ" : "Your next discovery starts here")}</h3>
                <p className="mt-3 hidden text-sm leading-relaxed text-slate-300 sm:block">{failed ? (km ? "សូមបើកវីដេអូនៅប្រភពដើម។" : "This video could not load. Watch it at the original source below.") : !selected ? (km ? "វីដេអូដែលបានជ្រើសរើសនឹងបង្ហាញនៅទីនេះ។" : "Selected geoscience videos will appear here. Choose a video from the playlist to explore.") : source?.kind === "link" ? (km ? "បើកវីដេអូនេះនៅប្រភពដើម។" : "Watch this video on its original website.") : (km ? "ចុចដើម្បីផ្ទុកកម្មវិធីចាក់វីដេអូ។" : "Load the player when you’re ready to watch.")}</p>
                {selected && source && (source.kind === "link" || failed
                  ? <a href={selected.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900">{km ? "បើកវីដេអូ" : "Open video"} ↗</a>
                  : <button type="button" onClick={() => setPlaying(true)} className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900">{km ? "ផ្ទុកវីដេអូ" : "Load video"} ▷</button>)}
              </div>
            </div>}
        </div>
        <div className="p-5 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                {getVideoCategoryLabel(matchVideoCategory(selected?.category), km)}
              </span>
              <h3 className="text-lg font-semibold text-slate-900">{selected?.title || (km ? "បញ្ជីវីដេអូ GeoCam" : "The GeoCam watchlist")}</h3>
            </div>
            {selected && <a href={selected.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-emerald-700 underline underline-offset-4">{km ? "ប្រភពដើម" : "Open original"} ↗</a>}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{selected?.description || (km ? "ជ្រើសរើសវីដេអូពីបញ្ជី។" : "Field learning, inspiring landscapes and science worth sharing.")}</p>
        </div>
      </div>
      <aside aria-label={km ? "បញ្ជីវីដេអូ" : "Video playlist"} className="min-w-0 border-t border-slate-200 bg-slate-50 lg:border-t-0 lg:border-l">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">{km ? "បញ្ជីវីដេអូ" : "Your video collections"}</h3>
            <span className="text-xs text-slate-500">{filteredVideos.length} {km ? "វីដេអូ" : "videos"}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">{km ? "ជ្រើសរើសវីដេអូដើម្បីមើល" : "Choose a collection, then browse its videos in the player"}</p>
        </div>
        <ol className="max-h-[480px] overflow-y-auto p-3">
          {filteredVideos.map((video, index) => {
            const item = videoSource(video.url)!;
            const catLabel = getVideoCategoryLabel(matchVideoCategory(video.category), km);
            return <li key={video.id} className="mb-2"><button type="button" aria-pressed={selected?.id === video.id} onClick={() => { setSelectedId(video.id); setPlaying(false); }} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${selected?.id === video.id ? "border-emerald-300 bg-white shadow-sm" : "border-transparent hover:bg-white"}`}>
              <span className="relative flex aspect-video w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-800 text-white">{item.thumbnail ? <img src={item.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" /> : <span aria-hidden="true">▷</span>}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700">{String(index + 1).padStart(2, "0")} · {item.label}</span>
                  <span className="rounded bg-slate-200/70 px-1.5 py-0.2 text-[9px] font-medium text-slate-600">{catLabel}</span>
                </span>
                <span className="mt-1 block break-words text-sm font-semibold text-slate-900">{video.title}</span>
              </span>
            </button></li>;
          })}
        </ol>
        {!filteredVideos.length && (
          <div className="p-6 text-center text-sm leading-relaxed text-slate-500">
            <p>{km ? "មិនមានវីដេអូនៅក្នុងប្រភេទនេះទេ។" : "No videos found in this category."}</p>
            {activeCategory !== "all" && (
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="mt-2 text-xs font-semibold text-emerald-700 underline"
              >
                {km ? "បង្ហាញវីដេអូទាំងអស់" : "Show all videos"}
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
    {editable && <details className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5" data-no-cms>
      <summary className="cursor-pointer font-semibold text-emerald-900">{km ? "គ្រប់គ្រងបញ្ជីវីដេអូ" : "Manage video playlist"}</summary>
      <p className="mt-3 text-sm text-slate-600">{km ? "បន្ថែមតំណ ហើយប្រើ Save និង Publish ក្នុងរបារកែសម្រួល។" : "Add your links here, then use the editor’s Save and Publish controls to share the playlist with visitors."}</p>
      <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={event => {
        event.preventDefault();
        if (!title.trim() || !videoSource(url.trim())) { setFormError(km ? "សូមបញ្ចូលចំណងជើង និងតំណ HTTPS ត្រឹមត្រូវ។" : "Enter a title and a valid HTTPS video link."); return; }
        if (videos.some(video => video.url === url.trim())) { setFormError(km ? "តំណនេះមានក្នុងបញ្ជីរួចហើយ។" : "This link is already in the playlist."); return; }
        const matchedCat = VIDEO_CATEGORIES.find(c => c.id === category) || VIDEO_CATEGORIES[1];
        const next: HomeVideo = {
          id: crypto.randomUUID(),
          title: title.trim(),
          url: url.trim(),
          description: description.trim(),
          category: matchedCat.labelEn,
          categoryKm: matchedCat.labelKm,
        };
        update([...videos, next]); setSelectedId(next.id); setTitle(""); setUrl(""); setDescription(""); setFormError("");
      }}>
        <label className="text-sm font-semibold">{km ? "ចំណងជើង" : "Video title"}<input required maxLength={180} value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal" /></label>
        <label className="text-sm font-semibold">{km ? "តំណវីដេអូ" : "Video link (HTTPS)"}<input type="url" required maxLength={2048} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal" /></label>
        <label className="text-sm font-semibold">{km ? "ប្រភេទវីដេអូ" : "Category"}
          <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal">
            {VIDEO_CATEGORIES.filter(c => c.id !== "all").map(c => (
              <option key={c.id} value={c.id}>{km ? c.labelKm : c.labelEn}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold md:col-span-2">{km ? "ការពិពណ៌នា" : "Description (optional)"}<textarea maxLength={1000} value={description} onChange={e => setDescription(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal" /></label>
        {formError && <p role="alert" className="text-sm text-red-700 md:col-span-2">{formError}</p>}
        <button type="submit" className="justify-self-start rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white">{km ? "បន្ថែមក្នុងបញ្ជី" : "Add to playlist"}</button>
      </form>
      <ul className="mt-5 space-y-2">{videos.map((video, index) => <li key={video.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 text-sm"><span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">{getVideoCategoryLabel(matchVideoCategory(video.category), km)}</span><span className="mr-auto break-words font-semibold">{video.title}</span><button type="button" disabled={index === 0} className="rounded border px-3 py-2 disabled:opacity-30" aria-label={`Move ${video.title} up`} onClick={() => { const next = [...videos]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; update(next); }}>↑</button><button type="button" disabled={index === videos.length - 1} className="rounded border px-3 py-2 disabled:opacity-30" aria-label={`Move ${video.title} down`} onClick={() => { const next = [...videos]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; update(next); }}>↓</button><button type="button" className="rounded border border-red-200 px-3 py-2 text-red-700" onClick={() => update(videos.filter(v => v.id !== video.id))}>{km ? "លុប" : "Remove"}</button></li>)}</ul>
    </details>}
  </section>;
}

function Home() {
  const { lang } = useI18n();
  const c = copy[lang];
  const [newsList, setNewsList] = useState<NewsItem[]>(() => getPublishedNews());
  const [homeEvents, setHomeEvents] = useState(() => getStoredEvents());

  const {
    events: earthquakeEvents,
    loading: earthquakeLoading,
    isStale: earthquakeStale,
    lastSuccessTime: earthquakeRefreshTime,
    providerHealth: earthquakeProviders,
    refresh: refreshEarthquakes,
  } = useEarthquakes({ timeWindow: "7d" });

  useEffect(() => {
    const handleUpdate = () => setNewsList(getPublishedNews());
    const handleEventsSync = () => setHomeEvents(getStoredEvents());
    window.addEventListener("geocam_events_changed", handleEventsSync);
    window.addEventListener("storage", handleEventsSync);
    window.addEventListener("geocam:news-updated", handleUpdate);
    return () => {
      window.removeEventListener("geocam:news-updated", handleUpdate);
      window.removeEventListener("geocam_events_changed", handleEventsSync);
      window.removeEventListener("storage", handleEventsSync);
    };
  }, []);

  return <div className="geocam-landing">
    <LiveTickerRibbon />
<section className="gc-hero relative isolate overflow-hidden">
  <video
    data-cms-id="home-hero-video"
    autoPlay
    loop
    muted
    playsInline
    poster="/hero-poster.jpg"
    className="gc-hero-image absolute inset-0 -z-20 h-full w-full object-cover"
  >
    <source src="/hero-background.mp4" type="video/mp4" />
    <img
      data-cms-id="home-hero-image"
      src={hero}
      alt="Cambodian mountainous landscape"
      className="h-full w-full object-cover"
    />
  </video>
  <div className="gc-hero-wash absolute inset-0 -z-10"/><div className="mx-auto grid max-w-[1800px] items-center gap-10 px-5 py-24 md:min-h-[700px] lg:grid-cols-[1.15fr_.85fr] lg:py-28"><div><span className="gc-kicker gc-kicker-light"><Sparkles size={14}/>{c.pill}</span><h1 className="gc-display mt-8"><span data-cms-id="hero-line-one">{c.headingA}</span><br/><span data-cms-id="hero-line-two" className="gc-highlight">{c.headingB}</span></h1><p data-cms-id="hero-description" className="mt-7 max-w-xl text-lg leading-relaxed text-white/85">{c.subtitle}</p><div className="mt-9 flex flex-wrap gap-3"><Link to="/geodata" className="gc-button gc-button-light">{c.explore}<ArrowUpRight size={18}/></Link><Link to="/about" className="gc-button gc-button-outline">{c.discover}<ArrowRight size={18}/></Link></div><div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs font-semibold uppercase tracking-[.15em] text-white/70"><span className="flex items-center gap-2"><Globe2 size={17}/> {lang === "km" ? "ទិន្នន័យភូគព្ភសាស្ត្រ" : "GeoData"}</span><span className="flex items-center gap-2"><Mountain size={17}/> {lang === "km" ? "ឧទ្យានភូគព្ភសាស្ត្រ 3D" : "3D Geopark"}</span><span className="flex items-center gap-2"><BookOpen size={17}/> {lang === "km" ? "វចនានុក្រម" : "Lexicon"}</span></div></div><div className="hidden lg:flex justify-end"><div className="gc-hero-card"><img src="/geocam-logo.png" alt="GeoCam society emblem" className="mx-auto h-40 w-40 rounded-full object-contain drop-shadow-lg"/><p className="mt-5 text-center text-sm font-semibold tracking-[.2em] text-white/90">{lang === "km" ? <>សមាគមភូគព្ភវិទ្យាសាស្ត្រ<br/>កម្ពុជា</> : <>GEOSCIENCES SOCIETY<br/>OF CAMBODIA</>}</p><div className="gc-hero-card-line"/><p className="text-center text-sm text-white/75">{c.footerNote}</p></div></div></div></section>
<section className="gc-section mx-auto max-w-[1800px] px-5"><div className="gc-section-heading"><div><span className="gc-kicker"><Compass size={15}/> {lang === "km" ? "វេទិកា GEOCAM" : "GEOCAM PLATFORM"}</span><h2 data-cms-id="features-heading" className="gc-title">{c.featured}</h2><p data-cms-id="features-subheading" className="gc-subtitle">{c.featuredSub}</p></div></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">{features.map(({to,icon:Icon,title,desc,tone,image,alt},i)=><Link key={to} to={to} className={`gc-feature gc-tone-${tone}`}><div className="gc-feature-photo-wrap"><img data-cms-id={`feature-photo-${title}`} src={image} alt={alt} loading="lazy" className="gc-feature-photo" onError={(e)=>{e.currentTarget.style.opacity="0"}}/><span className="gc-feature-icon"><Icon size={23} strokeWidth={1.8}/></span></div><span className="gc-feature-index">0{i+1}</span><h3 className="mt-5 text-xl font-semibold">{c[title]}</h3><p className="mt-3 min-h-[68px] text-sm leading-relaxed text-slate-600">{c[desc]}</p><span className="gc-feature-arrow"><ArrowUpRight size={19}/></span></Link>)}</div></section>
<KnowledgeBillboard />
<section className="gc-section mx-auto max-w-[1800px] px-5">
  <span className="gc-kicker"><Microscope size={15}/> {lang === "km" ? "វិទ្យាសាស្ត្រ និងការស្រាវជ្រាវ" : "SCIENCE & RESEARCH"}</span>
  <h2 className="gc-title mt-5">{c.areas}</h2>
  <p className="gc-subtitle">{c.areasSub}</p>
  <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {researchAreas.map((r,i)=>{
      const imgSrc = focusImages[r.key]?.src || r.image;
      const title = lang === 'km' ? (r.km || r.key) : r.key;
      const desc = lang === 'km' ? ((r as any).textKm || r.text) : r.text;
      return (
        <Link key={r.key} to={"/research/topic?id=" + encodeURIComponent(r.key)} className="gc-area group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
          <div>
            <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm">
              <img
                data-cms-id={`focus-${r.key.toLowerCase().replace(/\s+/g,"-")}-image`}
                src={imgSrc}
                alt={focusImages[r.key]?.alt || r.key}
                loading="lazy"
                width={600}
                height={450}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-2.5 right-2.5 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-xs font-bold text-white shadow backdrop-blur-md">
                0{i+1}
              </span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              {title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
              {desc}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            <span>{lang === 'km' ? 'ស្វែងយល់បន្ថែម' : 'Explore topic'}</span>
            <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </Link>
      );
    })}
  </div>
</section>
<HomeVideoPlaylist />
<section className="gc-section gc-updates"><div className="mx-auto max-w-[1800px] px-5"><span className="gc-kicker"><CalendarDays size={15}/> {lang === "km" ? "សហគមន៍" : "COMMUNITY"}</span><h2 className="gc-title mt-5">{c.updates}</h2><p className="gc-subtitle">{c.updatesSub}</p><div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]"><div><div className="flex items-center justify-between"><h3 className="text-xl font-semibold">{c.latest}</h3><Link to="/news" className="gc-text-link">{c.all}<ArrowUpRight size={16}/></Link></div><div className="mt-5 grid gap-4 md:grid-cols-2">{newsList.slice(0, 4).map(n => (
  <Link to={"/news/item?id=" + encodeURIComponent(n.id)} key={n.id} className="gc-news-card group block overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg bg-slate-100">
      <img
        data-cms-id={`news-cover-${n.id}`}
        src={n.image || "/images/cms/mission-image.jpg"}
        alt={lang === 'km' && n.titleKm ? n.titleKm : n.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = "/images/cms/mission-image.jpg";
        }}
      />
      <span className="absolute top-2.5 left-2.5 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 backdrop-blur-md">
        {n.tag}
      </span>
    </div>
    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{n.tag} · {n.date}</span>
    <h4 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
      {lang === 'km' && n.titleKm ? n.titleKm : n.title}
    </h4>
    <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
      {lang === 'km' && n.excerptKm ? n.excerptKm : n.excerpt}
    </p>
    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-emerald-700">
      <span>{lang === 'km' ? 'អានព័ត៌មាន' : 'Read story'}</span>
      <ArrowUpRight size={16} />
    </div>
  </Link>
))}</div></div><div><div className="flex items-center justify-between"><h3 className="text-xl font-semibold">{c.events}</h3><Link to="/events" className="gc-text-link">{c.all}<ArrowUpRight size={16}/></Link></div><div className="mt-5 space-y-3">{homeEvents.filter(e=>e.status==='published').slice(0,4).map(e=><Link to="/events" key={e.id} className="gc-event"><span className="gc-event-date">{e.date.slice(8)}<small>{new Date(e.date).toLocaleString(lang==='km'?'km-KH':'en',{month:'short'})}</small></span><span><strong className="block text-sm">{lang === "km" ? ((e as any).titleKm || e.title) : e.title}</strong><span className="mt-1 block text-xs text-slate-500">{lang === "km" ? ((e as any).kindKm || e.kind) : e.kind} · {lang === "km" ? ((e as any).placeKm || e.place) : e.place}</span></span><ArrowUpRight size={16} className="ml-auto shrink-0 text-emerald-700"/></Link>)}</div></div></div></div></section>
      {/* Live Regional Earthquake Bulletins (Positioned below Upcoming Events) */}
      <section className="mx-auto max-w-[1800px] px-5 py-8 md:py-10">
        <EarthquakeAnnouncements
          events={earthquakeEvents}
          loading={earthquakeLoading}
          isStale={earthquakeStale}
          lastSuccessTime={earthquakeRefreshTime}
          providerHealth={earthquakeProviders}
          maxItems={3}
          showViewAllLink={true}
          onRefresh={refreshEarthquakes}
          isHomepage={true}
        />
      </section>
<section className="mx-auto max-w-[1800px] px-5 pb-24"><div className="gc-final"><div><span className="gc-kicker gc-kicker-light"><Users size={15}/>{c.ctaTag}</span><h2 data-cms-id="cta-title" className="mt-5 max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">{c.ctaTitle}</h2><p data-cms-id="cta-subtitle" className="mt-5 max-w-xl text-white/80">{c.ctaSub}</p></div><Link to="/membership" className="gc-button gc-button-light">{c.join}<ArrowUpRight size={18}/></Link></div></section>
</div>}
