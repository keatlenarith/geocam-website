import React from "react";
import { Link } from "@/lib/spa-router";
import { useI18n } from "@/lib/i18n";
import { BookOpen, Sparkles, Clock, ArrowRight, Layers, Compass } from "lucide-react";

interface BillboardPost {
  id: string;
  categoryEn: string;
  categoryKm: string;
  titleEn: string;
  titleKm: string;
  excerptEn: string;
  excerptKm: string;
  readTime: string;
  image: string;
  tagEn: string;
  tagKm: string;
}

const billboardPosts: BillboardPost[] = [
  {
    id: "bk-rocks",
    categoryEn: "Rocks & Minerals",
    categoryKm: "ថ្ម និងខនិជ",
    titleEn: "Classification of Rocks in Cambodia: Igneous, Sedimentary & Metamorphic",
    titleKm: "ចំណាត់ថ្នាក់ថ្មនៅកម្ពុជា៖ ថ្មម៉ាក់ម៉ា ថ្មកម្ទេចកំណ និងថ្មប្រែរូប",
    excerptEn: "A foundational guide to identifying granite intrusions, sandstone plateaus, limestone karst, and schist belts across Cambodia's provinces.",
    excerptKm: "មគ្គុទ្ទេសក៍មូលដ្ឋានសម្រាប់កំណត់អត្តសញ្ញាណថ្មក្រានីត ខ្ពង់រាបថ្មភក់ កាស្ត៍ថ្មកំបោរ និងខ្សែក្រវាត់ថ្មសៀសនៅទូទាំងខេត្តនានាក្នុងប្រទេសកម្ពុជា។",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    tagEn: "Featured Guide",
    tagKm: "មគ្គុទ្ទេសក៍ពិសេស",
  },
  {
    id: "bk-history",
    categoryEn: "General Geology",
    categoryKm: "ភូគព្ភសាស្ត្រទូទៅ",
    titleEn: "Introduction to Cambodia's Geological History & Rock Formations",
    titleKm: "សេចក្តីផ្តើមអំពីប្រវត្តិភូគព្ភសាស្ត្រ និងសណ្ឋានសិលានៅកម្ពុជា",
    excerptEn: "Explore the ancient basement of Indochina, Paleozoic marine sedimentation, Mesozoic continental sandstone plateaus, and Cenozoic basalt volcanism.",
    excerptKm: "ស្វែងយល់អំពីខឿនបុរាណឥណ្ឌូចិន កំណកកករសមុទ្រយុគបុរាណសត្វ ខ្ពង់រាបថ្មភក់ដីគោកយុគកណ្តាលសត្វ និងបន្ទុះភ្នំភ្លើងបាសាល់យុគថ្មី។",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    tagEn: "Core Foundation",
    tagKm: "មូលដ្ឋានគ្រឹះ",
  },
  {
    id: "bk-hydro",
    categoryEn: "Groundwater",
    categoryKm: "ទឹកក្រោមដី",
    titleEn: "Hydrogeology Basics: How Aquifers Function in the Lower Mekong Basin",
    titleKm: "មូលដ្ឋានគ្រឹះវារីភូគព្ភសាស្ត្រ៖ ដំណើរការនៃស្រទាប់ផ្ទុកទឹកនៅអាងទន្លេមេគង្គក្រោម",
    excerptEn: "Understand unconfined alluvial aquifers, recharge dynamics, seasonal water-table fluctuations, and natural groundwater filtration.",
    excerptKm: "ស្វែងយល់អំពីស្រទាប់ផ្ទុកទឹកល្បាប់ជ្រាយ ថាមវន្តនៃការជ្រាបបំពេញទឹកឡើងវិញ ការប្រែប្រួលកម្រិតទឹកតាមរដូវ និងការច្រោះទឹកក្រោមដីតាមធម្មជាតិ។",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    tagEn: "Environmental Insight",
    tagKm: "បរិស្ថាន និងធនធានទឹក",
  },
];

export function KnowledgeBillboard() {
  const { lang } = useI18n();

  return (
    <section className="relative overflow-hidden py-12 md:py-16 bg-gradient-to-b from-[#0b162f] via-[#101f42] to-[#0d1833] text-white">
      {/* Decorative backdrop glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-[800px] bg-blue-600/15 blur-3xl pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-[1800px] px-5 xl:px-10">
        {/* Billboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-cyan-300 border border-blue-400/30">
              <Sparkles size={13} className="text-cyan-400" />
              <span>{lang === "km" ? "ចំណេះដឹងមូលដ្ឋានពិសេស" : "FEATURED BASIC KNOWLEDGE"}</span>
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {lang === "km" ? "មគ្គុទ្ទេសក៍សិក្សាភូគព្ភសាស្ត្រកម្ពុជា" : "Essential Cambodian Geoscience Guides"}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
              {lang === "km"
                ? "ស្វែងយល់ពីប្រព័ន្ធថ្ម ដំណើរការភូគព្ភសាស្ត្រ និងធនធានផែនដី តាមរយៈអត្ថបទពន្យល់ងាយយល់ និងមានរូបភាពស្តង់ដារ"
                : "Explore rock classifications, geological processes, and earth resources through accessible guides illustrated with Cambodian field observations."}
            </p>
          </div>

          <Link
            to="/basic-knowledge"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition shadow-sm group shrink-0"
          >
            <span>{lang === "km" ? "មើលចំណេះដឹងទាំងអស់" : "Explore All Basic Knowledge"}</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Billboard Showcase Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {billboardPosts.map((post) => {
            const title = lang === "km" ? post.titleKm : post.titleEn;
            const excerpt = lang === "km" ? post.excerptKm : post.excerptEn;
            const cat = lang === "km" ? post.categoryKm : post.categoryEn;
            const tag = lang === "km" ? post.tagKm : post.tagEn;

            return (
              <article
                key={post.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/60 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div>
                  {/* Photo with Tag */}
                  <Link
                    to={`/basic-knowledge?id=${post.id}`}
                    className="relative block aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-800 mb-4 cursor-pointer"
                  >
                    <img
                      src={post.image}
                      alt={title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                    <span className="absolute top-2.5 left-2.5 rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold text-cyan-300 backdrop-blur-md border border-slate-700">
                      {tag}
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 rounded-full bg-blue-600/80 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
                      {cat}
                    </span>
                  </Link>

                  {/* Header Details */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <Clock size={12} className="text-cyan-400" />
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition leading-snug">
                    <Link to={`/basic-knowledge?id=${post.id}`}>{title}</Link>
                  </h3>

                  <p className="mt-2 text-xs text-slate-300/85 line-clamp-3 leading-relaxed">
                    {excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <Link
                    to={`/basic-knowledge?id=${post.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:text-cyan-300"
                  >
                    <span>{lang === "km" ? "អានមគ្គុទ្ទេសក៍នេះ" : "Read Full Guide"}</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
