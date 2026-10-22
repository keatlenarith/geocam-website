import researchLibrary from "./research-library.json";
// Publication records come from the collected research library.
// Other news, members and events remain prototype/demo data.

export type Article = {
  id: string;
  title: string;
  titleKm?: string;
  date: string;
  excerpt: string;
  status: "draft" | "published";
  tag: string;
  image?: string;
};
export type EventItem = {
  id: string;
  title: string;
  date: string;
  place: string;
  kind: string;
  status: "draft" | "published";
};
export type Publication = {
  id: string;
  title: string;
  authors: string;
  year: number | null;
  topic: string;
  journal: string;
  abstract: string;
  pdfUrl?: string;
  fileUrl?: string;
  sourceUrl?: string;
  doi?: string;
  publicationType: string;
  scope: string;
  origin: string;
  metadataVerified: boolean;
  tags: string[];
  alternateFiles?: { label: string; url: string }[];
};
export type Member = {
  id: string;
  name: string;
  affiliation: string;
  field: string;
  showInDirectory: boolean;
  email: string;
};
export type Application = {
  id: string;
  name: string;
  email: string;
  category: string;
  submitted: string;
  status: "pending" | "approved" | "rejected";
};

export const topics = [...new Set(researchLibrary.map((p) => p.topic))].sort();

export const news: Article[] = [
  {
    id: "n1",
    title: "Field school returns to the Cardamom foothills",
    titleKm: "សាលាវាលត្រឡប់មកជើងភ្នំក្រវាញវិញ",
    date: "2026-09-28",
    excerpt:
      "Students mapped sandstone sequences and laterite profiles during a week-long training camp in western Cambodia.",
    status: "published",
    tag: "Education",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "n2",
    title: "Workshop on riverbank erosion along the Mekong",
    titleKm: "សិក្ខាសាលាស្តីពីការហូរច្រោះច្រាំងទន្លេមេគង្គ",
    date: "2026-09-10",
    excerpt:
      "Members discussed real-time monitoring methods for riverbank collapse dynamics, slope stability, and community awareness.",
    status: "published",
    tag: "Geohazards",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "n3",
    title: "Call for abstracts: Annual Geoscience Forum 2027",
    titleKm: "ការអំពាវនាវសេចក្តីសង្ខេប៖ វេទិកាភូគព្ភវិទ្យាប្រចាំឆ្នាំ ២០២៧",
    date: "2026-08-22",
    excerpt:
      "Submit research on Indochina tectonics, mineral exploration, environmental geology and remote sensing.",
    status: "published",
    tag: "Society",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "n4",
    title: "Groundwater arsenic & aquifer monitoring survey",
    titleKm: "ការសិក្សាស្រាវជ្រាវកម្រិតអាសេនិចក្នុងទឹកក្រោមដី និងស្រទាប់ទឹក",
    date: "2026-10-05",
    excerpt:
      "Hydrogeological study assesses seasonal arsenic variations, floodplain aquifer protection, and community water testing initiatives.",
    status: "published",
    tag: "Geochemistry",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "n5",
    title: "Regional mineral mapping & satellite spectroscopy",
    titleKm: "ការធ្វើផែនទីរ៉ែក្នុងតំបន់ និងការវិភាគវិសាលគមផ្កាយរណប",
    date: "2026-10-18",
    excerpt:
      "Multispectral satellite imagery identifies hydrothermal alteration zones, bedrock structural lineaments, and prospective geological corridors.",
    status: "published",
    tag: "Mining",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  },
];

export const events: EventItem[] = [
  {
    id: "e1",
    title: "Annual Geoscience Forum 2027",
    date: "2027-02-18",
    place: "Phnom Penh (venue TBC)",
    kind: "Conference",
    status: "published",
  },
  {
    id: "e2",
    title: "Laterite & weathering profiles field trip",
    date: "2026-11-21",
    place: "Kampong Thom Province",
    kind: "Field trip",
    status: "published",
  },
  {
    id: "e3",
    title: "Webinar: Intro to QGIS for geologists",
    date: "2026-11-05",
    place: "Online",
    kind: "Webinar",
    status: "published",
  },
  {
    id: "e4",
    title: "Student poster evening",
    date: "2026-12-12",
    place: "Phnom Penh",
    kind: "Meetup",
    status: "draft",
  },
];

export const publications: Publication[] = researchLibrary;

export const members: Member[] = [
  {
    id: "m1",
    name: "Dara Sok",
    affiliation: "University (sample)",
    field: "Structural geology",
    showInDirectory: true,
    email: "dara@example.org",
  },
  {
    id: "m2",
    name: "Sophea Kim",
    affiliation: "Consultancy (sample)",
    field: "Economic geology",
    showInDirectory: true,
    email: "sophea@example.org",
  },
  {
    id: "m3",
    name: "Private member",
    affiliation: "—",
    field: "Hydrogeology",
    showInDirectory: false,
    email: "hidden@example.org",
  },
  {
    id: "m4",
    name: "Vannak Ny",
    affiliation: "Research institute (sample)",
    field: "Geophysics",
    showInDirectory: true,
    email: "vannak@example.org",
  },
  {
    id: "m5",
    name: "Lina Chea",
    affiliation: "NGO (sample)",
    field: "Geohazards",
    showInDirectory: true,
    email: "lina@example.org",
  },
];

export const applications: Application[] = [
  {
    id: "a1",
    name: "Rithy Chan",
    email: "rithy@example.org",
    category: "Professional",
    submitted: "2026-10-09",
    status: "pending",
  },
  {
    id: "a2",
    name: "Malis Heng",
    email: "malis@example.org",
    category: "Student",
    submitted: "2026-10-12",
    status: "pending",
  },
  {
    id: "a3",
    name: "Kosal Lim",
    email: "kosal@example.org",
    category: "Associate",
    submitted: "2026-10-14",
    status: "pending",
  },
];

export const researchAreas = [
  {
    key: "Tectonics",
    km: "តិចតូនិក",
    text: "Cambodia sits within the Indochina block. Members study Paleozoic–Mesozoic suturing, Cenozoic fault reactivation and basin evolution around the Tonle Sap and Mekong.",
    textKm: "កម្ពុជាស្ថិតនៅក្នុងប្លុកឥណ្ឌូចិន។ សមាជិកសិក្សាអំពីការភ្ជាប់ប្លុកនៅប៉ាឡេអូសូអ៊ិក-មេសូសូអ៊ិក ការកម្រើកឡើងវិញនៃបំណាក់សិលានៅសេណូសូអ៊ិក និងការវិវត្តរចនាសម្ព័ន្ធបឹងទន្លេសាប និងទន្លេមេគង្គ។",
    image: "/images/cms/focus-tectonics-image.jpg",
  },
  {
    key: "Mineral deposits",
    km: "ជម្រកដែក",
    text: "Research on gold, base metals, gemstones, bauxite and industrial minerals — with emphasis on responsible, transparent exploration science.",
    textKm: "ការស្រាវជ្រាវរ៉ែមាស លោហៈមូលដ្ឋាន ត្បូង បុកស៊ីត និងរ៉ែឧស្សាហកម្ម ដោយផ្ដោតលើវិទ្យាសាស្ត្រស្វែងរុករកប្រកបដោយការទទួលខុសត្រូវ និងសក្ដានុពល។",
    image: "/images/cms/focus-mineral-deposits-image.jpg",
  },
  {
    key: "Geochemistry",
    km: "គីមីភូគព្ភសាស្ត្រ",
    text: "Groundwater quality, arsenic in floodplain aquifers, soil and laterite geochemistry, and isotopic dating of igneous suites.",
    textKm: "គុណភាពទឹកក្រោមដី អាសេនិចក្នុងស្រទាប់ផ្ទុកទឹកនៃវាលទំនាបបឹងទន្លេសាប គីមីភូគព្ភសាស្ត្រដី និងការកំណត់អាយុប្រភពសិលាមាក់ម៉ាដោយអ៊ីសូតូប។",
    image: "/images/cms/focus-geochemistry-image.jpg",
  },
  {
    key: "Geophysics",
    km: "រូបភូគព្ភសាស្ត្រ",
    text: "Gravity, magnetics, resistivity and passive seismic methods for basin, groundwater and engineering investigations.",
    textKm: "វិធីសាស្ត្ររំញ័រ ម៉ាញេទិច អគ្គិសនី និងរ៉ាដាដីសម្រាប់រុករករ៉ែ ទឹកក្រោមដី និងវិស្វកម្ម។",
    image: "/images/cms/focus-geophysics-image.jpg",
  },
  {
    key: "Geohazards",
    km: "មហន្តរាយ ភូគព្ភសាស្ត្រ",
    text: "Riverbank erosion, landslides in upland areas, subsidence, flooding interactions and community-oriented risk communication.",
    textKm: "ការស្រាវជ្រាវការបាក់ដី ការបាក់ដីនៅតំបន់ខ្ពង់រាប ការស្រុតដី អន្តរកម្មទឹកជំនន់ និងការផ្សព្វផ្សាយហានិភ័យភ្នំភ្លើងសហគមន៍។",
    image: "/images/cms/focus-geohazards-image.png",
  },
];
