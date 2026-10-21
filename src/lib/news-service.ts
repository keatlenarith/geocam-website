import { supabase } from "./supabase";
import { translateText } from "./translation";

export type NewsItem = {
  id: string;
  title: string;
  titleKm: string;
  date: string;
  excerpt: string;
  excerptKm: string;
  content: string;
  contentKm: string;
  tag: string;
  image: string;
  status: "published" | "draft";
  updatedAt: string;
};

export const defaultSeedNews: NewsItem[] = [
  {
    id: "n1",
    title: "Field training resumes along Cardamom foothills",
    titleKm: "សាលាវាលត្រឡប់មកជើងភ្នំក្រវាញវិញ",
    date: "2026-09-28",
    tag: "Education",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    excerpt: "Students mapped sandstone sequences and laterite profiles during a week-long training camp in western Cambodia.",
    excerptKm: "និស្សិតបានគូសផែនទីលំដាប់លំដោយថ្មខ្សាច់ និងកម្រងដីបាយក្រៀមក្នុងអំឡុងពេលជំរំការងារវាលមួយសប្តាហ៍នៅភាគខាងលិចប្រទេសកម្ពុជា។",
    content: "Students and geoscientists participated in intensive geological fieldwork along the Cardamom foothills. Over seven days, participants mapped sandstone sequences, documented fold orientations, and examined laterite profiles. This training strengthens local field geology expertise and documentation in western Cambodia.",
    contentKm: "និស្សិត និងអ្នកជំនាញភូគព្ភសាស្ត្របានចូលរួមក្នុងកិច្ចការងារវាលភូគព្ភសាស្ត្រយ៉ាងស៊ីជម្រៅនៅតាមជើងភ្នំក្រវាញ។ ក្នុងរយៈពេលប្រាំពីរថ្ងៃ និស្សិតបានគូសផែនទីលំដាប់លំដោយថ្មខ្សាច់ កត់ត្រាទិសដៅផ្នត់ និងពិនិត្យកម្រងដីបាយក្រៀម។",
    status: "published",
    updatedAt: "2026-09-28T10:00:00.000Z",
  },
  {
    id: "n2",
    title: "Mekong riverbank erosion workshop",
    titleKm: "សិក្ខាសាលាស្តីពីការហូរច្រោះច្រាំងទន្លេមេគង្គ",
    date: "2026-09-10",
    tag: "Geohazards",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    excerpt: "Members discussed real-time monitoring methods for riverbank collapse dynamics, slope stability, and community awareness.",
    excerptKm: "សមាជិកបានពិភាក្សាអំពីវិធីសាស្ត្រតាមដានពេលវេលាជាក់ស្តែងសម្រាប់ការដួលរលំច្រាំងទន្លេ ស្ថេរភាពជម្រាល និងការយល់ដឹងសហគមន៍។",
    content: "GeoCam brought together hydrology and geology researchers to evaluate slope stability and monitoring techniques along vulnerable stretches of the Mekong and Tonle Sap rivers. Community leaders were briefed on warning signs of sudden riverbank failure.",
    contentKm: "GeoCam បានប្រមូលផ្តុំអ្នកស្រាវជ្រាវជលសាស្ត្រ និងភូគព្ភសាស្ត្រដើម្បីវាយតម្លៃស្ថេរភាពជម្រាល និងបច្ចេកទេសតាមដាននៅតាមបណ្តោយទន្លេមេគង្គ និងទន្លេសាប។",
    status: "published",
    updatedAt: "2026-09-10T10:00:00.000Z",
  },
  {
    id: "n3",
    title: "Call for abstracts: Annual Geoscience Forum 2027",
    titleKm: "ការអំពាវនាវសេចក្តីសង្ខេប៖ វេទិកាភូគព្ភវិទ្យាប្រចាំឆ្នាំ ២០២៧",
    date: "2026-08-22",
    tag: "Society",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    excerpt: "Submit research on Indochina tectonics, mineral exploration, environmental geology and remote sensing.",
    excerptKm: "សូមដាក់ស្នើការស្រាវជ្រាវអំពីចលនាតិចតូនិចនៅឥណ្ឌូចិន ការស្វែងរុករករ៉ែ ភូគព្ភសាស្ត្របរិស្ថាន និងការចាប់សញ្ញាពីចម្ងាយ។",
    content: "Submissions are open for oral and poster presentations across all geoscience disciplines. Researchers from Cambodia and across Southeast Asia are encouraged to share evidence-based field findings for the Indochina geological synthesis.",
    contentKm: "ការដាក់ពាក្យស្នើសុំត្រូវបានបើកសម្រាប់បទបង្ហាញផ្ទាល់មាត់ និងផ្ទាំងរូបភាពលើគ្រប់ផ្នែកនៃវិទ្យាសាស្ត្រផែនដី។ អ្នកស្រាវជ្រាវមកពីកម្ពុជា និងទូទាំងអាស៊ីអាគ្នេយ៍ត្រូវបានលើកទឹកចិត្តឱ្យចែករំលែកលទ្ធផលការងារវាល។",
    status: "published",
    updatedAt: "2026-08-22T10:00:00.000Z",
  },
  {
    id: "n4",
    title: "Groundwater arsenic outreach brief",
    titleKm: "សេចក្តីសង្ខេបបឋម៖ អាសេនិចក្នុងទឹកក្រោមដី",
    date: "2026-10-05",
    tag: "Geochemistry",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    excerpt: "Hydrogeological study on floodplain aquifer arsenic variations and safe water wells in Kandal and Prey Veng provinces.",
    excerptKm: "ការសិក្សាជលភូគព្ភសាស្ត្រអំពីបម្រែបម្រួលអាសេនិចក្នុងស្រទាប់ទឹកក្រោមដីនៃវាលទំនាបលិចទឹក និងអណ្តូងទឹកសុវត្ថិភាពនៅខេត្តកណ្តាល និងព្រៃវែង។",
    content: "New hydrogeochemical sampling in Mekong floodplain aquifers highlights spatial variations in dissolved arsenic concentrations, underscoring the critical need for continuous community water testing.",
    contentKm: "ការយកសំណាកគំរូជលភូគីមីថ្មីៗក្នុងស្រទាប់ផ្ទុកទឹកវាលទំនាបលិចទឹកទន្លេមេគង្គ បានបង្ហាញពីបម្រែបម្រួលនៃកំហាប់អាសេនិចរលាយ ដោយបញ្ជាក់ពីតម្រូវការបន្ទាន់សម្រាប់ការធ្វើតេស្តទឹកសហគមន៍ជាប្រចាំ។",
    status: "published",
    updatedAt: "2026-10-05T10:00:00.000Z",
  },
];

const STORAGE_KEY = "geocam_managed_news_v3";

export function loadStoredNews(): NewsItem[] {
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.error("Could not load stored news:", e);
  }
  return defaultSeedNews;
}

export function saveStoredNews(items: NewsItem[]): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent("geocam:news-updated", { detail: items }));
    }
  } catch (e) {
    console.error("Could not persist stored news:", e);
  }
}

export function getAllNews(): NewsItem[] {
  return loadStoredNews();
}

export function getPublishedNews(): NewsItem[] {
  return loadStoredNews().filter((n) => n.status === "published");
}

export function getNewsById(id: string): NewsItem | undefined {
  return loadStoredNews().find((n) => n.id === id);
}

export async function saveNewsItem(input: Partial<NewsItem>, publishNow = false): Promise<NewsItem> {
  const current = loadStoredNews();
  const now = new Date().toISOString();
  let saved: NewsItem;

  const targetId = input.id;
  const existingIdx = targetId ? current.findIndex((n) => n.id === targetId) : -1;
  const finalStatus = publishNow ? "published" : (input.status || "draft");

  if (existingIdx !== -1) {
    const existing = current[existingIdx];
    saved = {
      ...existing,
      title: input.title !== undefined ? input.title.trim() : existing.title,
      titleKm: input.titleKm !== undefined ? input.titleKm.trim() : existing.titleKm,
      date: input.date || existing.date,
      tag: input.tag || existing.tag,
      image: input.image || existing.image,
      excerpt: input.excerpt !== undefined ? input.excerpt.trim() : existing.excerpt,
      excerptKm: input.excerptKm !== undefined ? input.excerptKm.trim() : existing.excerptKm,
      content: input.content !== undefined ? input.content.trim() : existing.content,
      contentKm: input.contentKm !== undefined ? input.contentKm.trim() : existing.contentKm,
      status: input.status || existing.status,
      updatedAt: now,
    };
    current[existingIdx] = saved;
  } else {
    const title = (input.title || "Untitled News").trim();
    const excerpt = (input.excerpt || "").trim();
    const content = (input.content || excerpt).trim();
    saved = {
      id: targetId || `news-${Date.now()}`,
      title,
      titleKm: (input.titleKm || translateText(title)).trim(),
      date: input.date || now.slice(0, 10),
      tag: input.tag || "Education",
      image: input.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
      excerpt,
      excerptKm: (input.excerptKm || translateText(excerpt)).trim(),
      content,
      contentKm: (input.contentKm || translateText(content)).trim(),
      status: input.status || "published",
      updatedAt: now,
    };
    current.unshift(saved);
  }

  saveStoredNews(current);

  // Sync to Supabase if available
  try {
    if (saved.status === "published") {
      await supabase
        .from("geocam_post_public")
        .upsert({
          id: saved.id,
          data: {
            id: saved.id,
            type: "news",
            titleEn: saved.title,
            titleKm: saved.titleKm,
            summaryEn: saved.excerpt,
            summaryKm: saved.excerptKm,
            bodyEn: saved.content,
            bodyKm: saved.contentKm,
            cover: saved.image,
            category: saved.tag,
            createdAt: saved.date,
            updatedAt: saved.updatedAt,
            status: "published",
          },
          updated_at: saved.updatedAt,
        });
    }
  } catch (err) {
    console.warn("Supabase post sync skipped:", err);
  }

  return saved;
}

export async function deleteNewsItem(id: string): Promise<void> {
  const current = loadStoredNews().filter((n) => n.id !== id);
  saveStoredNews(current);
  try {
    await supabase.from("geocam_post_public").delete().eq("id", id);
  } catch (err) {
    console.warn("Supabase delete sync skipped:", err);
  }
}

export async function togglePublishNews(id: string): Promise<NewsItem | null> {
  const current = loadStoredNews();
  const index = current.findIndex((n) => n.id === id);
  if (index === -1) return null;
  const item = current[index];
  const nextStatus = item.status === "published" ? "draft" : "published";
  item.status = nextStatus;
  item.updatedAt = new Date().toISOString();
  current[index] = item;
  saveStoredNews(current);

  try {
    if (nextStatus === "published") {
      await supabase.from("geocam_post_public").upsert({
        id: item.id,
        data: {
          id: item.id,
          type: "news",
          titleEn: item.title,
          titleKm: item.titleKm,
          summaryEn: item.excerpt,
          summaryKm: item.excerptKm,
          bodyEn: item.content,
          bodyKm: item.contentKm,
          cover: item.image,
          category: item.tag,
          createdAt: item.date,
          updatedAt: item.updatedAt,
          status: "published",
        },
        updated_at: item.updatedAt,
      });
    } else {
      await supabase.from("geocam_post_public").delete().eq("id", id);
    }
  } catch (err) {
    console.warn("Supabase toggle status sync skipped:", err);
  }

  return item;
}

// Compatibility helpers
export const isManagedNews = (_id: string) => true;

export async function fetchPublicNews(): Promise<NewsItem[]> {
  return getPublishedNews();
}

export async function fetchNewsDrafts(): Promise<NewsItem[]> {
  return getAllNews();
}
