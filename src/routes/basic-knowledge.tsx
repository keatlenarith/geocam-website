import { useState, useMemo } from "react";
import { Container, PageHeader } from "@/components/site/Chrome";
import { Link } from "@/lib/spa-router";
import { useI18n } from "@/lib/i18n";
import { useAdmin } from "@/admin/Auth";
import {
  BookOpen,
  Compass,
  ArrowRight,
  Search,
  Sparkles,
  Layers,
  Clock,
  Calendar,
  Edit,
  PlusCircle,
  FileText,
} from "lucide-react";

interface KnowledgeArticle {
  id: string;
  category: string;
  categoryKm: string;
  titleEn: string;
  titleKm: string;
  excerptEn: string;
  excerptKm: string;
  readTime: string;
  image: string;
  slug: string;
  date: string;
}

const sampleArticles: KnowledgeArticle[] = [
  {
    id: "bk-1",
    category: "General Geology",
    categoryKm: "ភូគព្ភសាស្ត្រទូទៅ",
    titleEn: "Introduction to Cambodia's Geological History & Rock Formations",
    titleKm: "សេចក្តីផ្តើមអំពីប្រវត្តិភូគព្ភសាស្ត្រ និងសណ្ឋានសិលានៅកម្ពុជា",
    excerptEn: "Explore the ancient basement of Indochina, Paleozoic marine sedimentation, Mesozoic continental sandstone plateaus, and Cenozoic basalt volcanism.",
    excerptKm: "ស្វែងយល់អំពីខឿនបុរាណឥណ្ឌូចិន កំណកកករសមុទ្រយុគបុរាណសត្វ ខ្ពង់រាបថ្មភក់ដីគោកយុគកណ្តាលសត្វ និងបន្ទុះភ្នំភ្លើងបាសាល់យុគថ្មី។",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    slug: "geological-history-cambodia",
    date: "2026-10-20",
  },
  {
    id: "bk-2",
    category: "Rocks & Minerals",
    categoryKm: "ថ្ម និងខនិជ",
    titleEn: "Classification of Rocks in Cambodia: Igneous, Sedimentary & Metamorphic",
    titleKm: "ចំណាត់ថ្នាក់ថ្មនៅកម្ពុជា៖ ថ្មម៉ាក់ម៉ា ថ្មកម្ទេចកំណ និងថ្មប្រែរូប",
    excerptEn: "A foundational guide to identifying granite intrusions, sandstone plateaus, limestone karst, and schist belts across Cambodia's provinces.",
    excerptKm: "មគ្គុទ្ទេសក៍មូលដ្ឋានសម្រាប់កំណត់អត្តសញ្ញាណថ្មក្រានីត ខ្ពង់រាបថ្មភក់ កាស្ត៍ថ្មកំបោរ និងខ្សែក្រវាត់ថ្មសៀសនៅទូទាំងខេត្តនានាក្នុងប្រទេសកម្ពុជា។",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    slug: "classification-rocks-cambodia",
    date: "2026-10-18",
  },
  {
    id: "bk-3",
    category: "Groundwater",
    categoryKm: "ទឹកក្រោមដី",
    titleEn: "Hydrogeology Basics: How Aquifers Function in the Lower Mekong Basin",
    titleKm: "មូលដ្ឋានគ្រឹះវារីភូគព្ភសាស្ត្រ៖ ដំណើរការនៃស្រទាប់ផ្ទុកទឹកនៅអាងទន្លេមេគង្គក្រោម",
    excerptEn: "Understand unconfined alluvial aquifers, recharge dynamics, seasonal water-table fluctuations, and natural groundwater filtration.",
    excerptKm: "ស្វែងយល់អំពីស្រទាប់ផ្ទុកទឹកល្បាប់ជ្រាយ ថាមវន្តនៃការជ្រាបបំពេញទឹកឡើងវិញ ការប្រែប្រួលកម្រិតទឹកតាមរដូវ និងការច្រោះទឹកក្រោមដីតាមធម្មជាតិ។",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    slug: "hydrogeology-basics-aquifers",
    date: "2026-10-15",
  },
  {
    id: "bk-4",
    category: "Mining & Resources",
    categoryKm: "ធនធានរ៉ែ",
    titleEn: "Understanding Mineral Exploration: From Outcrop Sampling to Resource Estimation",
    titleKm: "ស្វែងយល់ពីការរុករករ៉ែ៖ ចាប់ពីការយកសំណាកថ្ម ដល់ការប៉ាន់ប្រមាណបរិមាណធនធាន",
    excerptEn: "How geologists discover mineral deposits: geochemical stream sediment sampling, trenching, geophysical anomaly mapping, and core drilling.",
    excerptKm: "របៀបដែលអ្នកភូគព្ភវិទូស្វែងរកជម្រករ៉ែ៖ ការយកសំណាកល្បាប់ស្ទឹង ការជីកលេណដ្ឋាន ការគូសផែនទីភាពមិនប្រក្រតីនៃរូបវិទ្យា និងការខួងស្រង់ស្នូលថ្ម។",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80",
    slug: "mineral-exploration-basics",
    date: "2026-10-12",
  },
  {
    id: "bk-5",
    category: "Structural Geology",
    categoryKm: "ភូគព្ភសាស្ត្ររចនាសម្ព័ន្ធ",
    titleEn: "Faults, Folds, and Joints: Geological Structures Explained with Cambodian Outcrops",
    titleKm: "បំណាក់ ផ្នត់ និងប្រេះស្រាំ៖ ការពន្យល់អំពីរចនាសម្ព័ន្ធភូគព្ភសាស្ត្រជាមួយផ្ទាំងថ្មនៅកម្ពុជា",
    excerptEn: "Visual guide to strike-slip faults, anticlines, synclines, and tectonic deformation observed in the Kampot Fold Belt and Cardamom ranges.",
    excerptKm: "មគ្គុទ្ទេសក៍រូបភាពអំពីបំណាក់រអិលផ្តេក ផ្នត់ប៉ោង ផ្នត់ផត និងបម្រែបម្រួលរចនាសម្ព័ន្ធតិចតូនិចនៅខ្សែក្រវាត់ផ្នត់កំពត និងជួរភ្នំក្រវាញ។",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    slug: "faults-folds-joints-basics",
    date: "2026-10-08",
  },
  {
    id: "bk-6",
    category: "General Geology",
    categoryKm: "ភូគព្ភសាស្ត្រទូទៅ",
    titleEn: "Volcanism in Cambodia: Ratanakiri Lava Plateaus and Quaternary Basalt",
    titleKm: "បន្ទុះភ្នំភ្លើងនៅកម្ពុជា៖ ខ្ពង់រាបកម្អែរតនគិរី និងថ្មបាសាល់សម័យទីបួន",
    excerptEn: "Discover the fiery past of northeastern Cambodia, volcanic crater lakes such as Boeng Yeak Laom, and gemstone-bearing gem-gravel layers.",
    excerptKm: "ស្វែងយល់ពីប្រវត្តិភ្នំភ្លើងនៅភាគឦសានប្រទេសកម្ពុជា បឹងមាត់ភ្នំភ្លើងដូចជាបឹងយក្សឡោម និងស្រទាប់ក្រួសកំណកត្បូង។",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    slug: "volcanism-cambodia-basalt",
    date: "2026-10-05",
  },
];

const categoryTabs = [
  { id: "all", en: "All Topics", km: "ប្រធានបទទាំងអស់" },
  { id: "General Geology", en: "General Geology", km: "ភូគព្ភសាស្ត្រទូទៅ" },
  { id: "Rocks & Minerals", en: "Rocks & Minerals", km: "ថ្ម និងខនិជ" },
  { id: "Structural Geology", en: "Structural Geology", km: "ភូគព្ភសាស្ត្ររចនាសម្ព័ន្ធ" },
  { id: "Groundwater", en: "Groundwater", km: "ទឹកក្រោមដី" },
  { id: "Mining & Resources", en: "Mining & Resources", km: "ធនធានរ៉ែ" },
];

export default function BasicKnowledge() {
  const { lang } = useI18n();
  const { admin } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return sampleArticles.filter((article) => {
      const matchCat =
        selectedCategory === "all" || article.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        [
          article.titleEn,
          article.titleKm,
          article.excerptEn,
          article.excerptKm,
          article.category,
          article.categoryKm,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <PageHeader
        eyebrow={lang === "km" ? "ចំណេះដឹង និងការស្រាវជ្រាវ" : "Knowledge & Research"}
        title={lang === "km" ? "ចំណេះដឹងមូលដ្ឋានភូគព្ភសាស្ត្រ" : "Geoscience Basic Knowledge"}
        sub={
          lang === "km"
            ? "មគ្គុទ្ទេសក៍សិក្សា និងការយល់ដឹងជាមូលដ្ឋានអំពីភូគព្ភសាស្ត្រ ធនធានរ៉ែ ថ្ម ទឹកក្រោមដី និងបរិស្ថានផែនដីនៃប្រទេសកម្ពុជា។"
            : "Foundational guides, field insights, and core educational topics covering Cambodia's geology, mineral systems, rock classifications, and earth systems."
        }
      />

      <Container>
        {/* Admin Quick Action Button */}
        {admin && (
          <div className="mb-6 flex justify-end">
            <Link
              to="/admin?tab=posts&new=1&category=Basic%20Knowledge"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <PlusCircle size={15} />
              <span>{lang === "km" ? "បង្កើតអត្ថបទចំណេះដឹងថ្មី" : "Create New Knowledge Post"}</span>
            </Link>
          </div>
        )}

        {/* Search & Category Filter Toolbar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "km" ? "ស្វែងរកអត្ថបទ..." : "Search articles..."}
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-800 shadow-2xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categoryTabs.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/70"
                  }`}
                >
                  {lang === "km" ? cat.km : cat.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-xs font-semibold text-slate-500 mb-6">
          {lang === "km" ? "បង្ហាញលទ្ធផល៖" : "Showing"}{" "}
          <span className="text-blue-600 font-bold">{filteredArticles.length}</span>{" "}
          {lang === "km" ? "អត្ថបទ" : "articles"}
        </p>

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {filteredArticles.map((article) => {
            const title = lang === "km" ? article.titleKm : article.titleEn;
            const excerpt = lang === "km" ? article.excerptKm : article.excerptEn;
            const cat = lang === "km" ? article.categoryKm : article.category;

            return (
              <article
                key={article.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  {/* Thumbnail */}
                  <Link
                    to={`/research/topic?id=Tectonics`}
                    className="relative block aspect-[16/10] w-full overflow-hidden bg-slate-100"
                  >
                    <img
                      src={article.image}
                      alt={title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
                      {cat}
                    </span>
                  </Link>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {article.readTime}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {article.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                      <Link to={`/research/topic?id=Tectonics`}>{title}</Link>
                    </h3>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="border-t border-slate-100 p-5 pt-3">
                  <Link
                    to={`/research/topic?id=Tectonics`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700"
                  >
                    <span>{lang === "km" ? "អានអត្ថបទលម្អិត" : "Read full article"}</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredArticles.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center my-8">
            <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
            <h4 className="text-base font-bold text-slate-700">
              {lang === "km" ? "រកមិនឃើញអត្ថបទដែលត្រូវគ្នា" : "No articles found"}
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              {lang === "km" ? "សូមសាកល្បងជ្រើសរើសប្រភេទផ្សេង ឬស្វែងរកពាក្យផ្សេង" : "Try selecting a different category or clearing search query."}
            </p>
          </div>
        )}
      </Container>
    </>
  );
}
