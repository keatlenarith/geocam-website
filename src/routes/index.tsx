import { createFileRoute, Link } from "@/lib/spa-router";
import hero from "@/assets/hero.jpg";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { events, researchAreas } from "@/lib/data";
import { getPublishedNews, type NewsItem } from "@/lib/news-service";
import { meta } from "@/components/site/Chrome";
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
};
function Home() {
  const { lang } = useI18n();
  const c = copy[lang];
  const [newsList, setNewsList] = useState<NewsItem[]>(() => getPublishedNews());

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
    window.addEventListener("geocam:news-updated", handleUpdate);
    return () => window.removeEventListener("geocam:news-updated", handleUpdate);
  }, []);

  return <div className="geocam-landing">
<section className="gc-hero relative isolate overflow-hidden"><img data-cms-id="home-hero-image" src={hero} alt="Cambodian mountainous landscape" className="gc-hero-image absolute inset-0 -z-20 h-full w-full object-cover"/><div className="gc-hero-wash absolute inset-0 -z-10"/><div className="mx-auto grid max-w-[1800px] items-center gap-10 px-5 py-24 md:min-h-[700px] lg:grid-cols-[1.15fr_.85fr] lg:py-28"><div><span className="gc-kicker gc-kicker-light"><Sparkles size={14}/>{c.pill}</span><h1 className="gc-display mt-8"><span data-cms-id="hero-line-one">{c.headingA}</span><br/><span data-cms-id="hero-line-two" className="gc-highlight">{c.headingB}</span></h1><p data-cms-id="hero-description" className="mt-7 max-w-xl text-lg leading-relaxed text-white/85">{c.subtitle}</p><div className="mt-9 flex flex-wrap gap-3"><Link to="/geodata" className="gc-button gc-button-light">{c.explore}<ArrowUpRight size={18}/></Link><Link to="/about" className="gc-button gc-button-outline">{c.discover}<ArrowRight size={18}/></Link></div><div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs font-semibold uppercase tracking-[.15em] text-white/70"><span className="flex items-center gap-2"><Globe2 size={17}/> {lang === "km" ? "ទិន្នន័យភូគព្ភសាស្ត្រ" : "GeoData"}</span><span className="flex items-center gap-2"><Mountain size={17}/> {lang === "km" ? "ឧទ្យានភូគព្ភសាស្ត្រ 3D" : "3D Geopark"}</span><span className="flex items-center gap-2"><BookOpen size={17}/> {lang === "km" ? "វចនានុក្រម" : "Lexicon"}</span></div></div><div className="hidden lg:flex justify-end"><div className="gc-hero-card"><img src="/geocam-logo.png" alt="GeoCam society emblem" className="mx-auto h-40 w-40 rounded-full object-contain drop-shadow-lg"/><p className="mt-5 text-center text-sm font-semibold tracking-[.2em] text-white/90">{lang === "km" ? <>សមាគមភូគព្ភវិទ្យាសាស្ត្រ<br/>កម្ពុជា</> : <>GEOSCIENCES SOCIETY<br/>OF CAMBODIA</>}</p><div className="gc-hero-card-line"/><p className="text-center text-sm text-white/75">{c.footerNote}</p></div></div></div></section>
<section className="gc-section mx-auto max-w-[1800px] px-5"><div className="gc-section-heading"><div><span className="gc-kicker"><Compass size={15}/> {lang === "km" ? "វេទិកា GEOCAM" : "GEOCAM PLATFORM"}</span><h2 data-cms-id="features-heading" className="gc-title">{c.featured}</h2><p data-cms-id="features-subheading" className="gc-subtitle">{c.featuredSub}</p></div></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">{features.map(({to,icon:Icon,title,desc,tone,image,alt},i)=><Link key={to} to={to} className={`gc-feature gc-tone-${tone}`}><div className="gc-feature-photo-wrap"><img data-cms-id={`feature-photo-${title}`} src={image} alt={alt} loading="lazy" className="gc-feature-photo" onError={(e)=>{e.currentTarget.style.opacity="0"}}/><span className="gc-feature-icon"><Icon size={23} strokeWidth={1.8}/></span></div><span className="gc-feature-index">0{i+1}</span><h3 className="mt-5 text-xl font-semibold">{c[title]}</h3><p className="mt-3 min-h-[68px] text-sm leading-relaxed text-slate-600">{c[desc]}</p><span className="gc-feature-arrow"><ArrowUpRight size={19}/></span></Link>)}</div></section>
<section className="gc-section mx-auto max-w-[1800px] px-5">
  <span className="gc-kicker"><Microscope size={15}/> {lang === "km" ? "វិទ្យាសាស្ត្រ និងការស្រាវជ្រាវ" : "SCIENCE & RESEARCH"}</span>
  <h2 className="gc-title mt-5">{c.areas}</h2>
  <p className="gc-subtitle">{c.areasSub}</p>
  <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
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
))}</div></div><div><div className="flex items-center justify-between"><h3 className="text-xl font-semibold">{c.events}</h3><Link to="/events" className="gc-text-link">{c.all}<ArrowUpRight size={16}/></Link></div><div className="mt-5 space-y-3">{events.filter(e=>e.status==='published').slice(0,4).map(e=><Link to="/events" key={e.id} className="gc-event"><span className="gc-event-date">{e.date.slice(8)}<small>{new Date(e.date).toLocaleString(lang==='km'?'km-KH':'en',{month:'short'})}</small></span><span><strong className="block text-sm">{lang === "km" ? ((e as any).titleKm || e.title) : e.title}</strong><span className="mt-1 block text-xs text-slate-500">{lang === "km" ? ((e as any).kindKm || e.kind) : e.kind} · {lang === "km" ? ((e as any).placeKm || e.place) : e.place}</span></span><ArrowUpRight size={16} className="ml-auto shrink-0 text-emerald-700"/></Link>)}</div></div></div></div></section>
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
