import { news as seedNews } from "./data";
import {
  fetchPostDrafts,
  fetchPublishedPosts,
  savePost,
  deletePost,
  unpublishPost,
  cleanPostHtml,
  safeCover,
  type Post,
} from "../admin/posts";

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
// Existing prototype records remain visibly marked, read-only demonstrations.
export const defaultSeedNews: NewsItem[] = seedNews
  .filter((item) => item.status === "published")
  .map((item) => ({
    ...item,
    titleKm: item.titleKm || "",
    excerptKm: "",
    content: item.excerpt,
    contentKm: "",
    image: item.image || "",
    updatedAt: item.date,
  }));
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isManagedNews = (id: string) => uuid.test(id);

export const SEED_UUID_MAP: Record<string, string> = {
  n1: "00000000-0000-4000-9000-000000000001",
  n2: "00000000-0000-4000-9000-000000000002",
  n3: "00000000-0000-4000-9000-000000000003",
  n4: "00000000-0000-4000-9000-000000000004",
};

let publicCache: NewsItem[] = [],
  draftCache: NewsItem[] = [];
let loaded = false,
  pending: Promise<NewsItem[]> | null = null;
const announce = () => window.dispatchEvent(new Event("geocam:news-updated"));
function fromPost(post: Post): NewsItem {
  return {
    id: post.id,
    title: post.titleEn || "",
    titleKm: post.titleKm || "",
    excerpt: post.summaryEn || "",
    excerptKm: post.summaryKm || "",
    content: post.bodyEn || "",
    contentKm: post.bodyKm || "",
    image: safeCover(post.cover || ""),
    tag: post.category || "News",
    date: post.createdAt.slice(0, 10),
    updatedAt: post.updatedAt,
    status: post.status,
  };
}
function toPost(item: NewsItem): Post {
  return {
    id: item.id,
    type: "news",
    titleEn: item.title,
    titleKm: item.titleKm,
    summaryEn: item.excerpt,
    summaryKm: item.excerptKm,
    bodyEn: cleanPostHtml(item.content),
    bodyKm: cleanPostHtml(item.contentKm),
    cover: safeCover(item.image),
    category: item.tag,
    createdAt: item.date,
    updatedAt: item.updatedAt,
    status: item.status,
  };
}
function getFilteredSeeds(managedList: NewsItem[]): NewsItem[] {
  const managedIds = new Set(managedList.map((m) => m.id));
  const managedTitles = new Set(managedList.map((m) => m.title.trim().toLowerCase()));
  return defaultSeedNews.filter(
    (s) =>
      !managedIds.has(s.id) &&
      !managedIds.has(SEED_UUID_MAP[s.id]) &&
      !managedTitles.has(s.title.trim().toLowerCase()),
  );
}

export async function fetchNewsDrafts(): Promise<NewsItem[]> {
  draftCache = (await fetchPostDrafts())
    .filter((post) => post.type === "news")
    .map(fromPost);
  return [...draftCache, ...getFilteredSeeds(draftCache)];
}
export async function fetchPublicNews(): Promise<NewsItem[]> {
  if (pending) return pending;
  pending = fetchPublishedPosts()
    .then((posts) => {
      publicCache = posts.filter((post) => post.type === "news").map(fromPost);
      loaded = true;
      announce();
      return [...publicCache, ...getFilteredSeeds(publicCache)];
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}
// Existing homepage subscribers rerender after the public database query. This
// compatibility cache is memory-only; it never reads browser publication data.
export function getPublishedNews(): NewsItem[] {
  if (!loaded && !pending) void fetchPublicNews().catch(() => {});
  return [...publicCache, ...getFilteredSeeds(publicCache)];
}
export function getAllNews(): NewsItem[] {
  return [...draftCache, ...getFilteredSeeds(draftCache)];
}
export const loadStoredNews = getPublishedNews;
export async function getNewsById(id: string): Promise<NewsItem | undefined> {
  const all = await fetchPublicNews();
  return all.find((item) => item.id === id || SEED_UUID_MAP[item.id] === id);
}
export async function saveNewsItem(
  input: Partial<NewsItem>,
  publish = false,
): Promise<NewsItem> {
  if (!input.title?.trim())
    throw new Error("Add an English title before saving or publishing.");

  let targetId = input.id;
  if (targetId && !isManagedNews(targetId)) {
    targetId = SEED_UUID_MAP[targetId] || crypto.randomUUID();
  }
  if (!targetId) {
    targetId = crypto.randomUUID();
  }

  const existing = draftCache.find((item) => item.id === targetId);
  const now = new Date().toISOString();
  const item: NewsItem = {
    id: targetId,
    title: input.title.trim(),
    titleKm: input.titleKm || "",
    excerpt: input.excerpt || "",
    excerptKm: input.excerptKm || "",
    content: input.content || "",
    contentKm: input.contentKm || "",
    image: safeCover(input.image || ""),
    tag: input.tag || "News",
    date: input.date || now.slice(0, 10),
    status: existing?.status || "draft",
    updatedAt: now,
  };
  // The editor clears translations on English typing. Also reject a stale saved
  // override when a caller changes English without providing a replacement.
  if (existing) {
    for (const [english, khmer] of [
      ["title", "titleKm"],
      ["excerpt", "excerptKm"],
      ["content", "contentKm"],
    ] as const) {
      if (
        item[english] !== existing[english] &&
        item[khmer] === existing[khmer]
      )
        item[khmer] = "";
    }
  }
  const saved = fromPost(await savePost(toPost(item), publish));
  draftCache = [saved, ...draftCache.filter((row) => row.id !== saved.id)];
  if (publish) {
    publicCache = [saved, ...publicCache.filter((row) => row.id !== saved.id)];
    announce();
  }
  return saved;
}
export async function deleteNewsItem(id: string): Promise<void> {
  if (!isManagedNews(id)) {
    const idx = defaultSeedNews.findIndex((s) => s.id === id || SEED_UUID_MAP[s.id] === id);
    if (idx !== -1) defaultSeedNews.splice(idx, 1);
    announce();
    return;
  }
  await deletePost(id);
  draftCache = draftCache.filter((item) => item.id !== id);
  publicCache = publicCache.filter((item) => item.id !== id);
  announce();
}
export async function togglePublishNews(id: string): Promise<NewsItem | null> {
  if (!isManagedNews(id)) {
    const seed = defaultSeedNews.find((s) => s.id === id || SEED_UUID_MAP[s.id] === id);
    if (!seed) return null;
    const mapped: NewsItem = {
      ...seed,
      id: SEED_UUID_MAP[seed.id] || crypto.randomUUID(),
    };
    return saveNewsItem(mapped, true);
  }
  const item = draftCache.find((row) => row.id === id);
  if (!item) return null;
  if (item.status === "published") {
    await unpublishPost(id);
    const next = { ...item, status: "draft" as const };
    draftCache = draftCache.map((row) => (row.id === id ? next : row));
    publicCache = publicCache.filter((row) => row.id !== id);
    announce();
    return next;
  }
  return saveNewsItem(item, true);
}
