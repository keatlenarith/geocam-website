import DOMPurify from "dompurify";
import { supabase } from "../lib/supabase";
import { translateText } from "../lib/translation";

export type Post = {
  id: string;
  type: "news" | "page";
  titleEn: string;
  titleKm: string;
  summaryEn: string;
  summaryKm: string;
  bodyEn: string;
  bodyKm: string;
  cover: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published";
};
export const cleanPostHtml = (html: string) =>
  DOMPurify.sanitize(html, { USE_PROFILES: { html: true, svg: true } });
export const safeCover = (url: string) =>
  /^https?:\/\//i.test(url) || /^\/(?!\/)/.test(url) ? url : "";
export const postText = (english: string, khmer: string, lang: string) =>
  lang === "km" ? khmer || translateText(english) : english;
export function postBody(english: string, khmer: string, lang: string) {
  const clean = cleanPostHtml(
    lang === "km" ? khmer || english : english,
  );
  if (lang !== "km" || khmer) return clean;
  // Translate text nodes only, preserving safe markup, links and image URLs.
  const template = document.createElement("template");
  template.innerHTML = clean;
  const walker = document.createTreeWalker(
    template.content,
    NodeFilter.SHOW_TEXT,
  );
  let node: Node | null;
  while ((node = walker.nextNode()))
    if (node.textContent?.trim())
      node.textContent = translateText(node.textContent);
  return cleanPostHtml(template.innerHTML);
}
export function newPost(): Post {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    type: "news",
    titleEn: "",
    titleKm: "",
    summaryEn: "",
    summaryKm: "",
    bodyEn: "",
    bodyKm: "",
    cover: "",
    category: "",
    createdAt: now,
    updatedAt: now,
    status: "draft",
  };
}
export async function fetchPostDrafts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("geocam_post_drafts")
    .select("data")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => row.data as Post);
}
export async function fetchPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("geocam_post_public")
    .select("data")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => row.data as Post);
}
export async function savePost(post: Post, publish: boolean): Promise<Post> {
  if (!post.titleEn.trim()) throw new Error("Add an English title before saving or publishing.");
  const saved = {
    ...post,
    bodyEn: cleanPostHtml(post.bodyEn),
    bodyKm: cleanPostHtml(post.bodyKm),
    updatedAt: new Date().toISOString(),
    status: publish ? ("published" as const) : post.status,
  };
  const draft = publish ? { ...saved, status: post.status } : saved;
  const { error } = await supabase
    .from("geocam_post_drafts")
    .upsert({ id: saved.id, data: draft, updated_at: saved.updatedAt });
  if (error) throw error;
  if (publish) {
    const { error: publicationError } = await supabase
      .from("geocam_post_public")
      .upsert({ id: saved.id, data: saved, updated_at: saved.updatedAt });
    if (publicationError) throw publicationError;
    const { error: statusError } = await supabase
      .from("geocam_post_drafts")
      .update({ data: saved })
      .eq("id", saved.id);
    if (statusError) throw statusError;
  }
  return saved;
}
export async function unpublishPost(id: string) {
  const { error } = await supabase
    .from("geocam_post_public")
    .delete()
    .eq("id", id);
  if (error) throw error;
  const { data, error: readError } = await supabase
    .from("geocam_post_drafts")
    .select("data")
    .eq("id", id)
    .single();
  if (readError) throw readError;
  const draft = {
    ...(data.data as Post),
    status: "draft",
    updatedAt: new Date().toISOString(),
  };
  const { error: writeError } = await supabase
    .from("geocam_post_drafts")
    .update({ data: draft, updated_at: draft.updatedAt })
    .eq("id", id);
  if (writeError) throw writeError;
}
export async function deletePost(id: string) {
  const { error } = await supabase
    .from("geocam_post_public")
    .delete()
    .eq("id", id);
  if (error) throw error;
  const { error: draftError } = await supabase
    .from("geocam_post_drafts")
    .delete()
    .eq("id", id);
  if (draftError) throw draftError;
}
