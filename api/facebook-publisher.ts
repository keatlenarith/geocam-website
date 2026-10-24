import type { VercelRequest, VercelResponse } from "@vercel/node";

const DEFAULT_PAGE_ID = "105049257586051";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      status: "active",
      pageId: process.env.FB_PAGE_ID || DEFAULT_PAGE_ID,
      pageUrl: "https://www.facebook.com/GeoCam101/",
      hasServerToken: Boolean(process.env.FB_PAGE_ACCESS_TOKEN),
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const {
    pageId = process.env.FB_PAGE_ID || DEFAULT_PAGE_ID,
    accessToken = process.env.FB_PAGE_ACCESS_TOKEN,
    message,
    link,
    imageUrl,
    type,
    title,
  } = req.body || {};

  if (!message && !title) {
    return res.status(400).json({
      success: false,
      error: "Post message or title is required.",
    });
  }

  // If no Page Access Token is provided yet
  if (!accessToken) {
    return res.status(200).json({
      success: false,
      needToken: true,
      error:
        "Facebook Page Access Token is not set. Go to Admin > Settings > Facebook Auto-Publisher to save your Page Access Token.",
      preview: {
        pageId,
        type: type || "post",
        message: message || title,
        link,
      },
    });
  }

  try {
    // Meta Graph API Endpoint for Page Feed
    const graphEndpoint = `https://graph.facebook.com/v19.0/${pageId}/feed`;

    const params = new URLSearchParams();
    params.append("message", message || title);
    params.append("access_token", accessToken);
    if (link) {
      params.append("link", link);
    }

    const fbRes = await fetch(graphEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const fbData = await fbRes.json();

    if (!fbRes.ok || fbData.error) {
      const fbErrMsg =
        fbData.error?.message ||
        `Facebook Graph API error (code: ${fbData.error?.code || fbRes.status})`;
      console.error("[Facebook Publisher Error]", fbData.error);

      return res.status(200).json({
        success: false,
        error: fbErrMsg,
        details: fbData.error,
        needToken: fbData.error?.code === 190, // OAuthException / invalid or expired token
      });
    }

    const postId = fbData.id;
    // Construct readable post link
    const postUrl = postId.includes("_")
      ? `https://www.facebook.com/${pageId}/posts/${postId.split("_")[1]}`
      : `https://www.facebook.com/${postId}`;

    return res.status(200).json({
      success: true,
      postId,
      postUrl,
      message: "Published to Facebook Page successfully!",
    });
  } catch (err: any) {
    console.error("[Facebook Publisher Exception]", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Internal server error contacting Facebook Graph API",
    });
  }
}
