import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

// Self-contained serverless client: browser TS files are not runtime modules.
const supabase = createClient(
  "https://pziwobqfysoadswgnjjm.supabase.co",
  "sb_publishable_nTv_9GZCp9yfDXIasl2D7Q_JsPbHzcc",
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
);

type Poster = { image: string; caption: string; eventId: string };
type Storage = { read: (id: string) => Promise<Poster | null>; write: (id: string, poster: Poster) => Promise<void> };
const origin = "https://geocam.site";
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]!));
const recentUploads = new Map<string, { count: number; expires: number }>();

export function createPosterShareHandler(storage: Storage) {
  return async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (req.method === "POST") {
      res.setHeader("Cache-Control", "no-store");
      const { posterDataUrl, caption, eventId } = req.body || {};
      if (typeof posterDataUrl !== "string" || posterDataUrl.length > 4000000 || !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(posterDataUrl) || typeof caption !== "string" || !caption.trim() || caption.length > 12000 || typeof eventId !== "string" || !eventId || eventId.length > 300) {
        return res.status(400).json({ error: "A PNG poster, event ID and caption are required (maximum 3 MB)." });
      }
      const image = posterDataUrl.slice("data:image/png;base64,".length);
      const bytes = Buffer.from(image, "base64");
      if (bytes.length < 24 || !bytes.subarray(0,8).equals(Buffer.from("89504e470d0a1a0a","hex")) || bytes.readUInt32BE(16) !== 1200 || bytes.readUInt32BE(20) !== 630) {
        return res.status(400).json({ error: "The poster must be a 1200 × 630 PNG." });
      }
      const id = createHash("sha256").update(bytes).update(caption).update(eventId).digest("hex");
      try {
        // Content-addressed snapshots are reused; no dependency on live feeds.
        if (!await storage.read(id)) {
          const ip = String(req.headers["x-forwarded-for"] || "unknown").split(",")[0];
          const now = Date.now();
          for (const [key, limit] of recentUploads) if (limit.expires < now) recentUploads.delete(key);
          const limit = recentUploads.get(ip) || {count:0,expires:now+3600000};
          if (limit.count >= 20) return res.status(429).json({error:"Too many new poster links. Please try again later."});
          recentUploads.set(ip,{...limit,count:limit.count+1});
          await storage.write(id, {image,caption,eventId});
        }
        return res.status(200).json({url:`${origin}/api/earthquake-poster?id=${id}`,imageUrl:`${origin}/api/earthquake-poster?id=${id}&image=1`});
      } catch {
        return res.status(503).json({error:"Poster link storage is unavailable. You can still download the PNG and copy its caption."});
      }
    }
    if (req.method !== "GET") return res.status(405).json({error:"Use GET or POST."});
    const id = typeof req.query.id === "string" ? req.query.id : "";
    if (!/^[a-f0-9]{64}$/.test(id)) return res.status(400).send("Invalid poster link.");
    try {
      const poster = await storage.read(id);
      if (!poster) return res.status(404).send("Poster not found.");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      if (req.query.image === "1") {
        res.setHeader("Content-Type", "image/png");
        return res.status(200).send(Buffer.from(poster.image,"base64"));
      }
      const url = `${origin}/api/earthquake-poster?id=${id}`;
      const imageUrl = `${url}&image=1`;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'");
      return res.status(200).send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>GeoCam Earthquake Poster</title><meta property="og:type" content="article"><meta property="og:title" content="GeoCam Earthquake Poster"><meta property="og:url" content="${escapeHtml(url)}"><meta property="og:image" content="${escapeHtml(imageUrl)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:description" content="${escapeHtml(poster.caption.slice(0,400))}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${escapeHtml(imageUrl)}"><style>body{margin:0;background:#0b162f;color:#f1f5f9;font:16px/1.7 system-ui,sans-serif}main{max-width:1100px;margin:40px auto;padding:20px}img{width:100%;height:auto;border-radius:16px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;background:#15213b;padding:24px;border-radius:12px}a{color:#7dd3fc;margin-right:20px}</style></head><body><main><h1>GeoCam Earthquake Poster</h1><img src="${escapeHtml(imageUrl)}" alt="Generated earthquake bulletin poster" width="1200" height="630"><p><a href="${escapeHtml(imageUrl)}" download="GeoCam-Earthquake-Poster.png">Download exact PNG</a><a href="${origin}/earthquake-monitoring?event=${encodeURIComponent(poster.eventId)}">Related earthquake</a><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener noreferrer">Share this poster on Facebook</a></p><pre>${escapeHtml(poster.caption)}</pre></main></body></html>`);
    } catch { return res.status(503).send("Poster temporarily unavailable. Please retry."); }
  };
}

export default createPosterShareHandler({
  async read(id) {
    const {data,error} = await supabase.rpc("geocam_get_shared_poster",{p_id:id});
    if (error) throw new Error("Unable to read poster snapshot");
    return data;
  },
  async write(id, poster) {
    const {error} = await supabase.rpc("geocam_save_shared_poster",{p_id:id,p_image:poster.image,p_caption:poster.caption,p_event_id:poster.eventId});
    if (error) throw new Error("Unable to store poster snapshot");
  },
});
