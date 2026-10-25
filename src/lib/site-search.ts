import { FOCUS_TOPICS } from "../features/research/focus-topics-data.ts";
import { publications, events } from "./data.ts";
import { CAMBODIA_GEOSITES } from "../features/geopark/geosites-data.ts";
import { BASIC_KNOWLEDGE_ARTICLES } from "./basic-knowledge-data.ts";
import lexiconData from "./lexicon-terms.json" with { type: "json" };

export type SearchCategory =
  | "all"
  | "research"
  | "publication"
  | "geodata"
  | "mining"
  | "geopark"
  | "lexicon"
  | "news"
  | "event"
  | "page";

export interface SearchResultItem {
  id: string;
  category: SearchCategory;
  categoryLabelEn: string;
  categoryLabelKm: string;
  titleEn: string;
  titleKm: string;
  descriptionEn: string;
  descriptionKm: string;
  url: string;
  tags?: string[];
  meta?: string;
  score?: number;
}

// Mining portal entries
const miningRecords: Array<{
  id: string;
  en: string;
  km: string;
  description: string;
  descriptionKm: string;
  url: string;
  tags: string[];
}> = [
  {
    id: "prospecting",
    en: "Prospecting Permit",
    km: "លិខិតអនុញ្ញាតសិក្សាស្រាវជ្រាវបឋម",
    description: "Preliminary prospecting; six months, with one three-month renewal indicated on the Ministry's page.",
    descriptionKm: "ការសិក្សាស្រាវជ្រាវបឋម រយៈពេល៦ខែ និងអាចបន្តម្តងទៀត៣ខែ តាមព័ត៌មានផ្សព្វផ្សាយរបស់ក្រសួង។",
    url: "/mining",
    tags: ["mining", "permit", "prospecting", "mme", "mineral"],
  },
  {
    id: "exploration",
    en: "Exploration License",
    km: "អាជ្ញាបណ្ណស្វែងរុករករ៉ែ",
    description: "Exploration areas up to 200 km²; initial three-year term with up to two two-year extensions.",
    descriptionKm: "ផ្ទៃដីរហូតដល់២០០ គ.ម² អាណត្តិដំបូង៣ឆ្នាំ និងអាចបន្តពីរលើក លើកនីមួយៗ ២ឆ្នាំ។",
    url: "/mining",
    tags: ["mining", "license", "exploration", "mme", "copper", "gold", "bauxite"],
  },
  {
    id: "industrial",
    en: "Industrial Mining License",
    km: "អាជ្ញាបណ្ណអាជីវកម្មរ៉ែឧស្សាហកម្ម",
    description: "Initial period up to 21 years, with up to two renewals of 10 years each.",
    descriptionKm: "អាណត្តិដំបូងរហូតដល់២១ឆ្នាំ និងអាចបន្តរហូតដល់២លើក លើកនីមួយៗ ១០ឆ្នាំ។",
    url: "/mining",
    tags: ["industrial", "mining", "mine development", "production"],
  },
  {
    id: "quarry",
    en: "Open-Pit and Quarry Mining License",
    km: "អាជ្ញាបណ្ណអាជីវកម្មរ៉ែរណ្តៅ និងថ្ម",
    description: "Covers construction minerals, quarry stone, industrial minerals and construction sand.",
    descriptionKm: "គ្របដណ្តប់រ៉ែសំណង់ ថ្មសំណង់ រ៉ែឧស្សាហកម្ម និងខ្សាច់សំណង់។",
    url: "/mining",
    tags: ["quarry", "sand", "stone", "limestone", "construction"],
  },
  {
    id: "artisanal",
    en: "Artisanal Mining License",
    km: "អាជ្ញាបណ្ណរ៉ែសិប្បកម្ម",
    description: "Published criteria include Cambodian nationals, a maximum one-hectare area and a five-metre depth limit.",
    descriptionKm: "លក្ខខណ្ឌផ្សព្វផ្សាយរួមមានសញ្ជាតិខ្មែរ ផ្ទៃដីអតិបរមា១ហិកតា និងជម្រៅ៥ម៉ែត្រ។",
    url: "/mining",
    tags: ["artisanal", "small scale", "gold panning"],
  },
  {
    id: "gemstone",
    en: "Gemstone Mining License",
    km: "អាជ្ញាបណ្ណអាជីវកម្មត្បូង",
    description: "Licensing for precious, semi-precious and ornamental stones in Pailin, Ratanakiri, and Cardamom.",
    descriptionKm: "អាជ្ញាបណ្ណសម្រាប់ត្បូងមានតម្លៃ ត្បូងពាក់កណ្តាលមានតម្លៃ និងថ្មលម្អ នៅប៉ៃលិន រតនគិរី និងក្រវាញ។",
    url: "/mining",
    tags: ["gemstone", "sapphire", "ruby", "zircon", "pailin", "ratanakiri"],
  },
  {
    id: "minerals-map",
    en: "Mineral Resources of Cambodia",
    km: "ធនធានរ៉ែនៅកម្ពុជា",
    description: "Metallic minerals (gold, copper, iron, bauxite), industrial minerals (silica sand, limestone, kaolin), and gemstone belts.",
    descriptionKm: "រ៉ែលោហៈ (មាស ទង់ដែង ដែក បុកស៊ីត) រ៉ែឧស្សាហកម្ម (ខ្សាច់ស៊ីលីកា ថ្មកំបោរ កាអូលីន) និងខ្សែក្រវាត់ត្បូង។",
    url: "/mining",
    tags: ["gold", "copper", "bauxite", "iron", "silica", "limestone", "resources"],
  },
  {
    id: "legislation",
    en: "Mining Legislation and Regulations",
    km: "ច្បាប់ និងបទប្បញ្ញត្តិវិស័យរ៉ែ",
    description: "Law on Mineral Resources Management and Exploitation, National Policy on Mineral Resources 2018-2028, and Prakas.",
    descriptionKm: "ច្បាប់ស្តីពីការគ្រប់គ្រង និងការធ្វើអាជីវកម្មធនធានរ៉ែ គោលនយោបាយជាតិស្តីពីធនធានរ៉ែ ២០១៨-២០២៨ និងប្រកាស។",
    url: "/mining",
    tags: ["law", "legislation", "policy", "royalties", "regulation"],
  },
];

// Core pages
const sitePages: SearchResultItem[] = [
  {
    id: "page-about",
    category: "page",
    categoryLabelEn: "Organization",
    categoryLabelKm: "អំពីស្ថាប័ន",
    titleEn: "About GeoCam — Geosciences Society of Cambodia",
    titleKm: "អំពី GeoCam — សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា",
    descriptionEn: "Mission, vision, leadership, and scientific charter advancing Cambodia's geological knowledge and education.",
    descriptionKm: "បេសកកម្ម ចក្ខុវិស័យ ថ្នាក់ដឹកនាំ និងធម្មនុញ្ញវិទ្យាសាស្ត្រ ដើម្បីលើកកម្ពស់ចំណេះដឹង និងការអប់រំភូគព្ភសាស្ត្រនៅកម្ពុជា។",
    url: "/about",
    tags: ["about", "mission", "vision", "leadership", "president", "board"],
  },
  {
    id: "page-research",
    category: "page",
    categoryLabelEn: "Research",
    categoryLabelKm: "ការស្រាវជ្រាវ",
    titleEn: "Research & Discovery Hub",
    titleKm: "មជ្ឈមណ្ឌលស្រាវជ្រាវ និងការរកឃើញ",
    descriptionEn: "Explore Cambodia's key geological disciplines, tectonic evolution, mineral deposits, hydrogeology, and marine geology.",
    descriptionKm: "ស្វែងយល់ពីវិស័យភូគព្ភវិទ្យាសំខាន់ៗ ការវិវត្តតិចតូនិច ជម្រករ៉ែ វារីភូគព្ភសាស្ត្រ និងភូគព្ភសាស្ត្រសមុទ្រ។",
    url: "/research",
    tags: ["research", "discovery", "disciplines", "topics", "geology"],
  },
  {
    id: "page-publications",
    category: "page",
    categoryLabelEn: "Publications",
    categoryLabelKm: "ឯកសារបោះពុម្ពផ្សាយ",
    titleEn: "Scientific Publications & Journals Library",
    titleKm: "បណ្ណាល័យឯកសារ និងទស្សនាវដ្ដីវិទ្យាសាស្ត្រ",
    descriptionEn: "Comprehensive searchable database of peer-reviewed papers, conference proceedings, geological monographs, and DOIs.",
    descriptionKm: "បណ្ណាល័យស្វែងរកឯកសារស្រាវជ្រាវ ទស្សនាវដ្ដីវិទ្យាសាស្ត្រ កម្រងអត្ថបទសន្និសីទ និងឯកសារ PDF។",
    url: "/publications",
    tags: ["papers", "journals", "pdf", "doi", "peer-reviewed", "library"],
  },
  {
    id: "page-geodata",
    category: "page",
    categoryLabelEn: "GeoData",
    categoryLabelKm: "ទិន្នន័យភូគព្ភសាស្ត្រ",
    titleEn: "Interactive GeoData Portal & GIS Map",
    titleKm: "ផែនទីទិន្នន័យភូគព្ភសាស្ត្រ និងប្រព័ន្ធព័ត៌មានភូមិសាស្ត្រ (GIS)",
    descriptionEn: "Interactive digital geological map with Table of Contents (TOC) layers, faults, mineral occurrences, boreholes, and satellite strata.",
    descriptionKm: "ផែនទីភូគព្ភសាស្ត្រឌីជីថលអន្តរកម្ម រួមមានស្រទាប់ TOC បំណាក់ស្រុត ទីតាំងរ៉ែ អណ្តូងខួង និងរូបភាពផ្កាយរណប។",
    url: "/geodata",
    tags: ["geodata", "gis", "map", "toc", "layers", "faults", "symbology", "satellite"],
  },
  {
    id: "page-environmental",
    category: "page",
    categoryLabelEn: "Monitoring",
    categoryLabelKm: "ការតាមដាន",
    titleEn: "Environmental Monitoring & Groundwater Quality",
    titleKm: "ការតាមដានបរិស្ថាន និងគុណភាពទឹកក្រោមដី",
    descriptionEn: "Real-time groundwater monitoring, arsenic risk assessment in Mekong/Tonle Sap floodplains, and ecological indicators.",
    descriptionKm: "ការតាមដានទឹកក្រោមដី ការវាយតម្លៃហានិភ័យជាតិអាសេនិចនៅតំបន់វាលទំនាបមេគង្គ/បឹងទន្លេសាប និងសូចនាករបរិស្ថាន។",
    url: "/environmental-monitoring",
    tags: ["environment", "monitoring", "groundwater", "arsenic", "water quality", "mekong", "tonle sap"],
  },
  {
    id: "page-earthquake",
    category: "page",
    categoryLabelEn: "Monitoring",
    categoryLabelKm: "ការតាមដាន",
    titleEn: "Earthquake Monitoring & Seismic Risk",
    titleKm: "ការតាមដានការរញ្ជួយដី និងហានិភ័យរញ្ជួយដី",
    descriptionEn: "Live regional seismic feeds (USGS, TMD, CENC), historical seismicity, fault rupture assessment, and Indochina envelope.",
    descriptionKm: "ទិន្នន័យរញ្ជួយដីបន្តផ្ទាល់ក្នុងតំបន់ (USGS, TMD, CENC) ប្រវត្តិរញ្ជួយដី និងការវាយតម្លៃបំណាក់សកម្មនៅឥណ្ឌូចិន។",
    url: "/earthquake-monitoring",
    tags: ["earthquake", "seismic", "usgs", "tremor", "magnitude", "faults", "monitoring"],
  },
  {
    id: "page-geopark",
    category: "page",
    categoryLabelEn: "Geopark",
    categoryLabelKm: "ឧទ្យានភូគព្ភសាស្ត្រ",
    titleEn: "Cambodia 3D Geopark Explorer & Virtual Tours",
    titleKm: "ឧទ្យានភូគព្ភសាស្ត្រ 3D និងដំណើរកម្សាន្តនិម្មិត",
    descriptionEn: "Discover Cambodia's unique geosites: Phnom Kulen, Yeak Laom volcanic lake, Cardamom caves, and basalt plateaus in interactive 3D.",
    descriptionKm: "ស្វែងយល់ពីស្ថានីយភូគព្ភសាស្ត្រពិសេសៗ៖ ភ្នំគូលែន បឹងយក្សឡោម រូងភ្នំក្រវាញ និងខ្ពង់រាបបាសាល់ជា 3D។",
    url: "/geopark",
    tags: ["geopark", "3d", "geosites", "kulen", "yeak laom", "volcano", "caves", "waterfalls"],
  },
  {
    id: "page-mining",
    category: "page",
    categoryLabelEn: "Mining",
    categoryLabelKm: "វិស័យរ៉ែ",
    titleEn: "Mining Sector Knowledge & Licensing Guide",
    titleKm: "ព័ត៌មានវិស័យរ៉ែ និងមគ្គុទ្ទេសក៍អាជ្ញាបណ្ណ",
    descriptionEn: "Official Ministry regulations, mining licenses, mineral resource occurrences, and administrative procedures.",
    descriptionKm: "បទប្បញ្ញត្តិផ្លូវការរបស់ក្រសួងរ៉ែ និងថាមពល អាជ្ញាបណ្ណធនធានរ៉ែ និងនីតិវិធីរដ្ឋបាល។",
    url: "/mining",
    tags: ["mining", "licenses", "mme", "regulations", "permits", "laws"],
  },
  {
    id: "page-lexicon",
    category: "page",
    categoryLabelEn: "Lexicon",
    categoryLabelKm: "សទ្ទានុក្រម",
    titleEn: "Bilingual Geoscience Lexicon & Dictionary",
    titleKm: "សទ្ទានុក្រមភូគព្ភសាស្ត្រពីរភាសា (អង់គ្លេស-ខ្មែរ)",
    descriptionEn: "Authoritative English-to-Khmer terminological database for geological, geochemical, geophysical, and mining terms.",
    descriptionKm: "វចនានុក្រមពាក្យបច្ចេកទេសភូគព្ភសាស្ត្រ គីមីភូគព្ភសាស្ត្រ រូបវិទ្យា និងរ៉ែជាភាសាខ្មែរ និងអង់គ្លេស។",
    url: "/lexicon",
    tags: ["lexicon", "dictionary", "terms", "vocabulary", "khmer", "english", "definitions"],
  },
  {
    id: "page-news",
    category: "page",
    categoryLabelEn: "News",
    categoryLabelKm: "ព័ត៌មាន",
    titleEn: "News, Updates & Field Dispatches",
    titleKm: "ព័ត៌មាន សេចក្តីជូនដំណឹង និងបេសកកម្មចុះវាល",
    descriptionEn: "Latest announcements, field expeditions, scientific discoveries, and GeoCam community dispatches.",
    descriptionKm: "សេចក្តីជូនដំណឹងថ្មីៗ របាយការណ៍បេសកកម្មចុះវាល និងការរកឃើញវិទ្យាសាស្ត្ររបស់សមាគម។",
    url: "/news",
    tags: ["news", "updates", "fieldwork", "announcements"],
  },
  {
    id: "page-events",
    category: "page",
    categoryLabelEn: "Events",
    categoryLabelKm: "ព្រឹត្តិការណ៍",
    titleEn: "Geoscience Events, Conferences & Workshops",
    titleKm: "ព្រឹត្តិការណ៍ សន្និសីទ និងសិក្ខាសាលាភូគព្ភសាស្ត្រ",
    descriptionEn: "Upcoming academic symposiums, international conferences, field trip excursions, and training seminars.",
    descriptionKm: "សន្និសីទសិក្សាស្រាវជ្រាវ សិក្ខាសាលាបណ្តុះបណ្តាល និងដំណើរសិក្សាស្វែងយល់ភូគព្ភសាស្ត្រ។",
    url: "/events",
    tags: ["events", "conferences", "workshops", "seminars", "symposium"],
  },
  {
    id: "page-membership",
    category: "page",
    categoryLabelEn: "Membership",
    categoryLabelKm: "សមាជិកភាព",
    titleEn: "Membership Registration & Members Directory",
    titleKm: "ការចុះឈ្មោះសមាជិកភាព និងបញ្ជីរាយនាមសមាជិក",
    descriptionEn: "Join the Geosciences Society of Cambodia. Individual, student, academic, and corporate membership tiers and public directory.",
    descriptionKm: "ចូលរួមជាសមាជិកសមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា។ ស្វែងរកបញ្ជីឈ្មោះសមាជិក និងអ្នកជំនាញភូគព្ភសាស្ត្រ។",
    url: "/membership",
    tags: ["membership", "members", "directory", "join", "register", "professionals"],
  },
  {
    id: "page-contact",
    category: "page",
    categoryLabelEn: "Contact",
    categoryLabelKm: "ទំនាក់ទំនង",
    titleEn: "Contact GeoCam Secretariat",
    titleKm: "ទំនាក់ទំនងលេខាធិការដ្ឋាន GeoCam",
    descriptionEn: "Get in touch with the Geosciences Society of Cambodia in Phnom Penh, inquiries, research collaboration, and emails.",
    descriptionKm: "ទំនាក់ទំនងមកកាន់សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា នៅរាជធានីភ្នំពេញ សម្រាប់កិច្ចសហការ និងព័ត៌មានផ្សេងៗ។",
    url: "/contact",
    tags: ["contact", "email", "address", "phone", "phnom penh", "mme"],
  },
];

// Helper: Build the global search index
let cachedIndex: SearchResultItem[] | null = null;

export function buildSearchIndex(): SearchResultItem[] {
  if (cachedIndex) return cachedIndex;

  const items: SearchResultItem[] = [];

  // 1. Pages
  items.push(...sitePages);

  // 2. Focus Research Topics
  for (const topic of FOCUS_TOPICS) {
    items.push({
      id: "research-" + topic.id,
      category: "research",
      categoryLabelEn: "Research Discipline",
      categoryLabelKm: "វិស័យស្រាវជ្រាវ",
      titleEn: topic.titleEn,
      titleKm: topic.titleKm,
      descriptionEn: topic.leadEn + " " + topic.keyHighlightsEn.join(". "),
      descriptionKm: topic.leadKm + " " + topic.keyHighlightsKm.join(". "),
      url: "/research/topic?id=" + encodeURIComponent(topic.key),
      tags: [topic.key.toLowerCase(), topic.id.toLowerCase(), "research", "discipline", "geology"],
    });

    // Also index individual sections inside the topic for granular discovery!
    for (const sec of topic.sections) {
      items.push({
        id: "section-" + topic.id + "-" + sec.titleEn.slice(0, 20),
        category: "research",
        categoryLabelEn: topic.shortTitleEn,
        categoryLabelKm: topic.shortTitleKm,
        titleEn: sec.titleEn + " (" + topic.shortTitleEn + ")",
        titleKm: sec.titleKm + " (" + topic.shortTitleKm + ")",
        descriptionEn: sec.bodyEn.slice(0, 2).join(" "),
        descriptionKm: sec.bodyKm.slice(0, 2).join(" "),
        url: "/research/topic?id=" + encodeURIComponent(topic.key),
        tags: [topic.key.toLowerCase(), "geology", "section"],
      });
    }
  }

  // 3. Publications & Papers
  for (const pub of publications) {
    items.push({
      id: "pub-" + pub.id,
      category: "publication",
      categoryLabelEn: "Publication",
      categoryLabelKm: "ឯកសារបោះពុម្ពផ្សាយ",
      titleEn: pub.title,
      titleKm: pub.title,
      descriptionEn: (pub.authors ? pub.authors + ". " : "") + (pub.journal ? pub.journal + " (" + pub.year + "). " : "") + (pub.abstract || ""),
      descriptionKm: (pub.authors ? pub.authors + ". " : "") + (pub.journal ? pub.journal + " (" + pub.year + "). " : "") + (pub.abstract || ""),
      url: "/publications/view?id=" + pub.id,
      tags: [pub.topic.toLowerCase(), String(pub.year || ""), ...(pub.tags || []), "paper", "doi"],
      meta: String(pub.year || "") + (pub.journal ? " · " + pub.journal : ""),
    });
  }

  // 4. Geosites (3D Geopark)
  for (const site of CAMBODIA_GEOSITES) {
    items.push({
      id: "geosite-" + site.id,
      category: "geopark",
      categoryLabelEn: "3D Geosite",
      categoryLabelKm: "ស្ថានីយភូគព្ភសាស្ត្រ 3D",
      titleEn: site.name,
      titleKm: site.nameKm || site.name,
      descriptionEn: site.description || site.narrative.overview,
      descriptionKm: site.narrative.geologicalSettingKm || site.description,
      url: "/geopark",
      tags: [site.type.toLowerCase(), site.province.en.toLowerCase(), site.province.km, "geosite", "geopark", "waterfall", "volcano"],
      meta: site.province.en + " · " + site.type,
    });
  }

  // 5. Mining Records
  for (const m of miningRecords) {
    items.push({
      id: "mining-" + m.id,
      category: "mining",
      categoryLabelEn: "Mining Sector",
      categoryLabelKm: "វិស័យរ៉ែ",
      titleEn: m.en,
      titleKm: m.km,
      descriptionEn: m.description,
      descriptionKm: m.descriptionKm,
      url: m.url,
      tags: m.tags,
    });
  }

  // 6. Lexicon Terms
  const termsMap = (lexiconData as { terms: Record<string, { khmer: string; key: string }> }).terms || {};
  for (const [enTerm, val] of Object.entries(termsMap)) {
    items.push({
      id: "lex-" + val.key,
      category: "lexicon",
      categoryLabelEn: "Lexicon Term",
      categoryLabelKm: "ពាក្យបច្ចេកទេស",
      titleEn: enTerm,
      titleKm: val.khmer,
      descriptionEn: `Bilingual geological term: ${enTerm} in English is "${val.khmer}" in Khmer.`,
      descriptionKm: `ពាក្យបច្ចេកទេសភូគព្ភសាស្ត្រពីរភាសា៖ ${val.khmer} (អង់គ្លេស៖ ${enTerm})។`,
      url: "/lexicon",
      tags: ["lexicon", "definition", "term", "glossary"],
    });
  }

  // 7. Events
  for (const ev of events) {
    items.push({
      id: "event-" + ev.id,
      category: "event",
      categoryLabelEn: "Event",
      categoryLabelKm: "ព្រឹត្តិការណ៍",
      titleEn: ev.title,
      titleKm: ev.titleKm || ev.title,
      descriptionEn: (ev.place || "") + " · " + (ev.kind || ""),
      descriptionKm: (ev.placeKm || ev.place || "") + " · " + (ev.kindKm || ev.kind || ""),
      url: "/events",
      tags: ["event", "symposium", "conference", "workshop"],
      meta: ev.date || "",
    });
  }

  // 8. Basic Knowledge Articles (Direct link to exact post!)
  for (const bk of BASIC_KNOWLEDGE_ARTICLES) {
    items.push({
      id: "bk-" + bk.id,
      category: "research",
      categoryLabelEn: "Basic Knowledge",
      categoryLabelKm: "ចំណេះដឹងមូលដ្ឋាន",
      titleEn: bk.titleEn,
      titleKm: bk.titleKm,
      descriptionEn: bk.excerptEn,
      descriptionKm: bk.excerptKm,
      url: "/basic-knowledge?id=" + bk.id,
      tags: ["basic knowledge", "guide", bk.category.toLowerCase(), "education", "geology"],
      meta: bk.category + " · " + bk.readTime,
    });
  }

  cachedIndex = items;
  return items;
}

// Normalized text for fast, fuzzy comparison
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width spaces
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Levenshtein distance for fuzzy typo matching
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1] ? row[j - 1] : Math.min(row[j - 1], prev, row[j]) + 1;
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

// Check if two tokens are similar (handles minor typos / plurals / word endings)
function isSimilarWord(queryToken: string, targetWord: string): boolean {
  if (targetWord.includes(queryToken) || queryToken.includes(targetWord)) return true;
  if (queryToken.length < 4 || targetWord.length < 4) return false;
  const maxDistance = queryToken.length > 6 ? 2 : 1;
  return levenshtein(queryToken, targetWord) <= maxDistance;
}

export function searchSite(
  query: string,
  options: {
    category?: SearchCategory;
    limit?: number;
    lang?: "en" | "km";
  } = {}
): SearchResultItem[] {
  const qClean = normalize(query);
  if (!qClean) return [];

  const tokens = qClean.split(" ").filter((t) => t.length > 0);
  if (tokens.length === 0) return [];

  const index = buildSearchIndex();
  const categoryFilter = options.category && options.category !== "all" ? options.category : null;
  const limit = options.limit || 30;

  const results: Array<{ item: SearchResultItem; score: number }> = [];

  for (const item of index) {
    if (categoryFilter && item.category !== categoryFilter) continue;

    const normTitleEn = normalize(item.titleEn);
    const normTitleKm = normalize(item.titleKm);
    const normDescEn = normalize(item.descriptionEn);
    const normDescKm = normalize(item.descriptionKm);
    const normTags = (item.tags || []).map(normalize).join(" ");

    let score = 0;
    let matchedTokensCount = 0;

    // Check exact whole query match
    if (normTitleEn === qClean || normTitleKm === qClean) {
      score += 200;
    } else if (normTitleEn.startsWith(qClean) || normTitleKm.startsWith(qClean)) {
      score += 120;
    } else if (normTitleEn.includes(qClean) || normTitleKm.includes(qClean)) {
      score += 90;
    } else if (normDescEn.includes(qClean) || normDescKm.includes(qClean)) {
      score += 60;
    } else if (normTags.includes(qClean)) {
      score += 50;
    }

    // Token-level scoring
    const allTitleWords = (normTitleEn + " " + normTitleKm).split(" ");
    const allDescWords = (normDescEn + " " + normDescKm).split(" ");

    for (const token of tokens) {
      let tokenMatched = false;

      // 1. Direct substring in title
      if (normTitleEn.includes(token) || normTitleKm.includes(token)) {
        score += 40;
        tokenMatched = true;
      }
      // 2. Similar word in title (fuzzy match)
      else if (allTitleWords.some((w) => isSimilarWord(token, w))) {
        score += 30;
        tokenMatched = true;
      }

      // 3. Direct substring in description
      if (normDescEn.includes(token) || normDescKm.includes(token)) {
        score += 20;
        tokenMatched = true;
      }
      // 4. Similar word in description (fuzzy match)
      else if (allDescWords.some((w) => isSimilarWord(token, w))) {
        score += 15;
        tokenMatched = true;
      }

      // 5. In tags
      if (normTags.includes(token)) {
        score += 25;
        tokenMatched = true;
      }

      if (tokenMatched) {
        matchedTokensCount++;
      }
    }

    // If multi-token query, reward items matching all tokens
    if (tokens.length > 1 && matchedTokensCount === tokens.length) {
      score += 50;
    }

    if (score > 0) {
      results.push({ item: { ...item, score }, score });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit).map((r) => r.item);
}
