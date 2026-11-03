import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// Self-contained serverless client: browser TS files are not runtime modules.
const supabase = createClient(
  "https://pziwobqfysoadswgnjjm.supabase.co",
  "sb_publishable_nTv_9GZCp9yfDXIasl2D7Q_JsPbHzcc",
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
);

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));

function extractImageFromHtml(html: string): string {
  if (!html) return "";
  const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const fullTag = match[0].toLowerCase();
    const src = match[1] ? match[1].trim() : "";
    if (!src) continue;
    if (fullTag.includes('width="0"') || fullTag.includes("width='0'") || fullTag.includes('height="0"') || fullTag.includes("height='0'")) {
      continue;
    }
    const s = src.toLowerCase();
    if (
      s.includes("blank.gif") ||
      s.includes("pixel.gif") ||
      s.includes("servedbyadbutler") ||
      s.includes("adbutler") ||
      s.includes("1x1") ||
      s.includes("spacer.gif") ||
      s.startsWith("data:image/gif;base64,r0lgodlhaqaba")
    ) {
      continue;
    }
    return src;
  }
  return "";
}

function resolveCoverImage(cover: string | undefined, contentHtml: string | undefined, origin: string): string {
  const contentImg = extractImageFromHtml(contentHtml || "");
  const isPlaceholder = (url: string) =>
    !url ||
    url.includes("photo-1544620347-c4fd4a3d5957") ||
    url.toLowerCase().includes("blank.gif") ||
    url.toLowerCase().includes("servedbyadbutler");

  let picked = cover;
  if (!picked || isPlaceholder(picked)) {
    if (contentImg) picked = contentImg;
  }

  if (!picked || isPlaceholder(picked)) {
    picked = `${origin}/images/cms/mission-image.jpg`;
  }

  // If picked is a relative path, prefix origin
  if (picked.startsWith("/")) {
    picked = `${origin}${picked}`;
  }

  return picked;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  const host = req.headers["x-forwarded-host"] || req.headers.host || "geocam-website.vercel.app";
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const origin = `${proto}://${host}`;

  const id = typeof req.query.id === "string" ? req.query.id : "";
  const type = typeof req.query.type === "string" ? req.query.type : "news";

  // If requesting raw image (e.g. for base64 images that social networks cannot directly embed)
  if (req.query.image === "1" && id) {
    try {
      const { data } = await supabase.from("geocam_post_public").select("data").eq("id", id).maybeSingle();
      const post = data?.data;
      if (post) {
        const rawCover = resolveCoverImage(post.cover, post.bodyEn || post.bodyKm, origin);
        if (rawCover.startsWith("data:image/")) {
          const match = rawCover.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
          if (match) {
            const mime = match[1] === "jpeg" ? "image/jpeg" : match[1] === "png" ? "image/png" : `image/${match[1]}`;
            const buf = Buffer.from(match[2], "base64");
            res.setHeader("Content-Type", mime);
            res.setHeader("Cache-Control", "public, max-age=86400");
            return res.status(200).send(buf);
          }
        }
      }
    } catch {}
  }

  // Lookup target post in database
  let title = "GeoCam | Geosciences Society of Cambodia";
  let description = "Cambodia Geoscience Research, 3D Web GIS Geoparks & National Seismic Monitoring";
  let targetUrl = `${origin}/news`;
  let imageUrl = `${origin}/images/cms/mission-image.jpg`;

  if (id) {
    try {
      const { data } = await supabase.from("geocam_post_public").select("data").eq("id", id).maybeSingle();
      const post = data?.data;
      if (post) {
        title = post.titleEn || post.titleKm || title;
        description = post.summaryEn || post.summaryKm || (post.bodyEn || "").replace(/<[^>]+>/g, "").slice(0, 260) || description;
        targetUrl = `${origin}/news/item?id=${encodeURIComponent(id)}`;
        const resolved = resolveCoverImage(post.cover, post.bodyEn || post.bodyKm, origin);
        if (resolved.startsWith("data:image/")) {
          imageUrl = `${origin}/api/share?id=${encodeURIComponent(id)}&image=1`;
        } else {
          imageUrl = resolved;
        }
      } else if (type === "basic-knowledge" || id.startsWith("bk-")) {
        targetUrl = `${origin}/basic-knowledge?id=${encodeURIComponent(id)}`;
      }
    } catch {}
  }

  const userAgent = String(req.headers["user-agent"] || "").toLowerCase();
  const isSocialCrawler =
    userAgent.includes("facebookexternalhit") ||
    userAgent.includes("facebot") ||
    userAgent.includes("twitterbot") ||
    userAgent.includes("linkedinbot") ||
    userAgent.includes("slackbot") ||
    userAgent.includes("telegrambot") ||
    userAgent.includes("whatsapp") ||
    userAgent.includes("pinterest") ||
    userAgent.includes("googlebot");

  const fullTitle = `${title} · GeoCam`;
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="GeoCam — Geosciences Society of Cambodia">
  <meta property="og:url" content="${escapeHtml(targetUrl)}">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:alt" content="${escapeHtml(title)}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">

  ${
    !isSocialCrawler
      ? `<meta http-equiv="refresh" content="0;url=${escapeHtml(targetUrl)}">
  <script>window.location.replace(${JSON.stringify(targetUrl)});</script>`
      : ""
  }
</head>
<body style="font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; text-align: center;">
  <h2>${escapeHtml(fullTitle)}</h2>
  <p>${escapeHtml(description)}</p>
  <p><a href="${escapeHtml(targetUrl)}" style="color: #38bdf8;">Click here to read article on GeoCam ↗</a></p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).send(html);
}
