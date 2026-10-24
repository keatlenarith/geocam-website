import { translateText, useDocumentTranslation } from "./translation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "km";

export const dict = {
  home: { en: "Home", km: "ទំព័រដើម" },
  about: { en: "About", km: "អំពីយើង" },
  research: { en: "Research", km: "ការស្រាវជ្រាវ" },
  publications: { en: "Publications", km: "ការបោះពុម្ពផ្សាយ" },
  events: { en: "Events", km: "ព្រឹត្តិការណ៍" },
  membership: { en: "Membership", km: "សមាជិកភាព" },
  lexicon: { en: "Lexicon", km: "វចនានុក្រមភូគព្ភវិទ្យាសាស្ត្រ" },
  geopark: { en: "3D Geopark", km: "ឧទ្យានភូគព្ភសាស្ត្រ 3D" },
  cms: { en: "Visual CMS", km: "គ្រប់គ្រងមាតិកា" },
  earthquakeMonitoring: {
    en: "Earthquake Monitoring",
    km: "ការតាមដានការរញ្ជួយដី",
  },
  mining: { en: "Mining", km: "ព័ត៌មានវិស័យរ៉ែ" },
  environmentalMonitoring: {
    en: "Environmental Monitoring",
    km: "ការតាមដានបរិស្ថាន",
  },
  geodata: { en: "GeoData", km: "ទិន្នន័យភូគព្ភវិទ្យាសាស្ត្រ" },
  news: { en: "News", km: "ព័ត៌មាន" },
  contact: { en: "Contact", km: "ទំនាក់ទំនង" },
  dashboard: { en: "Member area", km: "តំបន់សមាជិក" },
  admin: { en: "Admin", km: "អ្នកគ្រប់គ្រង" },
  orgName: {
    en: "Geosciences Society of Cambodia",
    km: "សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា",
  },
  heroTitle: {
    en: "Reading the deep history of Cambodia’s land",
    km: "ស្វែងយល់ពីប្រវត្តិដ៏ជ្រៅនៃដែនដីកម្ពុជា",
  },
  heroSub: {
    en: "An independent community of geoscientists advancing research, education and safe, sustainable use of Cambodia’s earth resources.",
    km: "សហគមន៍ឯករាជ្យនៃអ្នកភូគព្ភវិទ្យាសាស្ត្រ ដែលលើកកម្ពស់ការស្រាវជ្រាវ ការអប់រំ និងការប្រើប្រាស់ធនធានដីប្រកបដោយសុវត្ថិភាព និងចីរភាព។",
  },
  joinCta: { en: "Become a member", km: "ក្លាយជាសមាជិក" },
  exploreData: { en: "Explore GeoData", km: "ស្វែងរកទិន្នន័យ" },
  latestNews: { en: "Latest news", km: "ព័ត៌មានថ្មីៗ" },
  upcomingEvents: { en: "Upcoming events", km: "ព្រឹត្តិការណ៍ខាងមុខ" },
  ourWork: { en: "Our fields of work", km: "វិស័យការងាររបស់យើង" },
  readMore: { en: "Read more", km: "អានបន្ថែម" },
  viewAll: { en: "View all", km: "មើលទាំងអស់" },
  joinTitle: {
    en: "Join Cambodia’s geoscience community",
    km: "ចូលរួមសហគមន៍ភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា",
  },
  joinSub: {
    en: "Students, professionals and researchers — connect, publish and contribute to field knowledge.",
    km: "និស្សិត អ្នកជំនាញ និងអ្នកស្រាវជ្រាវ — ភ្ជាប់ទំនាក់ទំនង បោះពុម្ពផ្សាយ និងចូលរួមចំណែកចំណេះដឹង។",
  },
  apply: { en: "Submit application", km: "ដាក់ពាក្យស្នើសុំ" },
  send: { en: "Send message", km: "ផ្ញើសារ" },
  search: { en: "Search", km: "ស្វែងរក" },
  register: { en: "Register", km: "ចុះឈ្មោះ" },
  mission: { en: "Our mission", km: "បេសកកម្មរបស់យើង" },
  leadership: { en: "Leadership", km: "ថ្នាក់ដឹកនាំ" },
  directory: { en: "Member directory", km: "បញ្ជីសមាជិក" },
  application: { en: "Membership application", km: "ពាក្យស្នើសុំសមាជិកភាព" },
  layers: { en: "Map layers", km: "ស្រទាប់ផែនទី" },
  dataPolicy: {
    en: "Metadata & download policy",
    km: "ទិន្នន័យមេតា និងគោលការណ៍ទាញយក",
  },
  demo: { en: "Demo", km: "សាកល្បង" },
  footerTag: {
    en: "Independent, non-governmental professional society. Prototype website.",
    km: "សមាគមវិជ្ជាជីវៈឯករាជ្យ មិនមែនរដ្ឋាភិបាល។ គេហទំព័រគំរូ។",
  },
} as const;

export type TKey = keyof typeof dict;

const Ctx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => string;
}>({
  lang: "en",
  setLang: () => {},
  t: (k) => dict[k].en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useDocumentTranslation(lang);
  useEffect(() => {
    const s = localStorage.getItem("geocam-lang");
    if (s === "km" || s === "en") setLangState(s);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang === "km" ? "km" : "en";
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("geocam-lang", l);
  };
  return (
    <Ctx.Provider
      value={{
        lang,
        setLang,
        t: (k) =>
          lang === "en"
            ? dict[k].en
            : translateText(dict[k].en) === dict[k].en
              ? dict[k].km
              : translateText(dict[k].en),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useI18n = () => useContext(Ctx);
