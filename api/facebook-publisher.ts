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
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      status: "active",
      pageId: process.env.FB_PAGE_ID || DEFAULT_PAGE_ID,
      pageUrl: "https://www.facebook.com/geoscience.cambodia/",
      hasServerToken: Boolean(process.env.FB_PAGE_ACCESS_TOKEN?.trim()),
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const {
    pageId: rawPageId,
    accessToken: browserAccessToken,
    message,
    link,
    imageUrl,
    type,
    title,
    posterDataUrl,
  } = req.body || {};

  // An empty browser field means use the server credential, not disable it.
  const accessToken =
    (typeof browserAccessToken === "string" ? browserAccessToken.trim() : "") ||
    process.env.FB_PAGE_ACCESS_TOKEN?.trim();

  // Auto-correct: 360240070266245 is the Business Portfolio ID; the actual Page ID is 105049257586051 (GeoCam101)
  let pageId = rawPageId || process.env.FB_PAGE_ID || DEFAULT_PAGE_ID;
  if (pageId === "360240070266245" || !pageId) {
    pageId = "105049257586051";
  }

  // Photo publishing uses the caller's Page credential, never anonymous access
  // to the server credential. The poster is sent directly to Meta, not hosted.
  if (posterDataUrl !== undefined && !(typeof browserAccessToken === "string" && browserAccessToken.trim())) {
    return res.status(400).json({success:false,needToken:true,error:"Save a valid Page Access Token in Facebook Publisher before publishing a poster."});
  }
  let posterBytes: Buffer | undefined;
  if (posterDataUrl !== undefined) {
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({success:false,error:"The generated poster caption is empty. Reopen the poster and try again."});
    }
    if (typeof posterDataUrl !== "string" || !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(posterDataUrl) || posterDataUrl.length > 4000000) {
      return res.status(400).json({success:false,error:"Poster must be a PNG under 3 MB."});
    }
    posterBytes = Buffer.from(posterDataUrl.slice("data:image/png;base64,".length), "base64");
    if (!posterBytes.subarray(0,8).equals(Buffer.from("89504e470d0a1a0a","hex"))) {
      return res.status(400).json({success:false,error:"Invalid PNG poster."});
    }
  }

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
    const graphEndpoint = posterBytes
      ? `https://graph.facebook.com/v26.0/${pageId}/photos`
      : `https://graph.facebook.com/v19.0/${pageId}/feed`;

    const params = new URLSearchParams();
    params.append("message", message || title);
    params.append("access_token", accessToken);
    if (link) {
      params.append("link", link);
    }

    let photoForm: FormData | undefined;
    if (posterBytes) {
      photoForm = new FormData();
      photoForm.append("access_token", accessToken!);
      photoForm.append("caption", message);
      // Upload without creating a separate captionless public photo story.
      photoForm.append("published", "false");
      photoForm.append("source", new Blob([new Uint8Array(posterBytes)], {type:"image/png"}), "geocam-earthquake-poster.png");
    }
    let fbRes = await fetch(graphEndpoint, {
      method: "POST",
      headers: photoForm ? undefined : {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: photoForm || params.toString(),
    });

    let fbData = await fbRes.json();

    if (!fbRes.ok || fbData.error) {
      let fbErrMsg =
        fbData.error?.message ||
        `Facebook Graph API error (code: ${fbData.error?.code || fbRes.status})`;
      console.error("[Facebook Publisher Error]", fbData.error);

      // Enhance actionable diagnosis for common Meta OAuth issues
      if (fbData.error?.code === 190) {
        fbErrMsg = `Token Expired (OAuth 190): ${fbErrMsg}. Please renew your Page Access Token or clear it to use the server token.`;
      } else if (fbData.error?.code === 200) {
        fbErrMsg = `Permission / Token Mismatch (Error 200): Requires a Page Access Token for Page ID ${pageId} with 'pages_manage_posts' and 'pages_read_engagement' permissions. If you used a User Token from Graph API Explorer, switch the dropdown to your Page Token.`;
      }

      return res.status(200).json({
        success: false,
        error: fbErrMsg,
        details: fbData.error,
        needToken: fbData.error?.code === 190, // OAuthException / invalid or expired token
      });
    }

    if (photoForm) {
      if (typeof fbData.id !== "string" || !fbData.id) {
        return res.status(502).json({success:false,error:"Facebook did not return an uploaded photo ID. Nothing was published."});
      }
      // The feed's message is the visible status. A photo caption alone is not
      // a reliable substitute for a post message across Facebook surfaces.
      const photoPost = new URLSearchParams();
      photoPost.append("access_token",accessToken!);
      photoPost.append("message",message);
      photoPost.append("published","true");
      photoPost.append("attached_media[0]",JSON.stringify({media_fbid:fbData.id}));
      fbRes = await fetch(`https://graph.facebook.com/v26.0/${pageId}/feed`,{
        method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:photoPost.toString(),
      });
      fbData = await fbRes.json();
      if (!fbRes.ok || fbData.error) {
        return res.status(200).json({success:false,error:fbData.error?.message || "Facebook uploaded the photo but could not publish the post and caption.",needToken:fbData.error?.code===190});
      }
    }
    const postId = fbData.post_id || fbData.id;
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
