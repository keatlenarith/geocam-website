import React, { useState, useEffect } from "react";
import {
  FACEBOOK_PAGE_ID,
  FACEBOOK_PAGE_URL,
  FACEBOOK_PAGE_NAME,
  getFacebookSettings,
  getFacebookPublisherStatus,
  saveFacebookSettings,
  broadcastToFacebook,
  type FacebookSettings,
  type FacebookBroadcastRecord,
} from "@/lib/facebook-service";
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Send,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  Radio,
  Calendar,
  FileText,
  Eye,
  EyeOff,
  Sliders,
  History,
} from "lucide-react";

export function FacebookManager() {
  const [settings, setSettings] = useState<FacebookSettings>(getFacebookSettings());
  const [tokenInput, setTokenInput] = useState(settings.accessToken || "");
  const [showToken, setShowToken] = useState(false);
  const [serverStatus, setServerStatus] = useState<{ pageId: string; hasServerToken: boolean } | null>(null);
  const [checkingServer, setCheckingServer] = useState(true);
  const [serverStatusError, setServerStatusError] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isPostingManual, setIsPostingManual] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualMessage, setManualMessage] = useState("");
  const [manualType, setManualType] = useState<"news" | "event" | "earthquake" | "post">("news");

  useEffect(() => {
    let active = true;
    getFacebookPublisherStatus()
      .then(status => { if (active) setServerStatus(status); })
      .catch(() => { if (active) setServerStatusError(true); })
      .finally(() => { if (active) setCheckingServer(false); });
    return () => { active = false; };
  }, []);

  const hasBrowserToken = Boolean(settings.accessToken.trim());
  const hasServerToken = Boolean(serverStatus?.hasServerToken && serverStatus.pageId === FACEBOOK_PAGE_ID);
  const tokenStatus = hasBrowserToken
    ? "Browser token configured — overrides the server token"
    : checkingServer
    ? "Checking server token configuration…"
    : serverStatusError
    ? "Unable to check server token — reload to retry"
    : serverStatus?.pageId !== FACEBOOK_PAGE_ID
    ? "Server Page ID does not match this Page — check server configuration"
    : hasServerToken
    ? "Server token configured — no browser token needed"
    : "Token missing — configure a server token or save a browser token";

  useEffect(() => {
    const current = getFacebookSettings();
    if (current.pageId === "360240070266245" || !current.pageId) {
      const fixed = saveFacebookSettings({ pageId: FACEBOOK_PAGE_ID, pageUrl: FACEBOOK_PAGE_URL });
      setSettings(fixed);
      setTokenInput(fixed.accessToken || "");
    } else {
      setSettings(current);
      setTokenInput(current.accessToken || "");
    }
  }, []);

  const handleClearLog = () => {
    const updated = saveFacebookSettings({ recentBroadcasts: [] });
    setSettings(updated);
  };

  const handleSaveToken = () => {
    const updated = saveFacebookSettings({ accessToken: tokenInput.trim() });
    setSettings(updated);
    setStatusMsg({
      type: "success",
      text: updated.accessToken
        ? "Browser token saved. Publishing permissions have not been verified."
        : "Browser token cleared. Broadcasts will use the server token if configured.",
    });
    setTimeout(() => setStatusMsg(null), 5000);
  };

  const handleToggle = (key: keyof FacebookSettings, val: boolean | number) => {
    const updated = saveFacebookSettings({ [key]: val });
    setSettings(updated);
  };

  const handleTestBroadcast = async () => {
    setIsTesting(true);
    setStatusMsg({ type: "info", text: "Connecting to Meta Graph API & broadcasting test payload..." });

    const res = await broadcastToFacebook({
      type: "test",
      title: "GeoCam System Connectivity Test",
      summary: "Official automated broadcast testing between GeoCam (https://geocam-website.vercel.app) and Facebook Page.",
      link: "/",
    });

    setIsTesting(false);
    setSettings(getFacebookSettings());

    if (res.success) {
      setStatusMsg({
        type: "success",
        text: `Successfully published test post to Facebook! Post ID: ${res.postId || "OK"}`,
      });
    } else {
      setStatusMsg({
        type: "error",
        text: res.error || "Broadcast failed. Please verify your Page Access Token.",
      });
    }
  };

  const handleManualBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualMessage.trim()) return;

    setIsPostingManual(true);
    setStatusMsg({ type: "info", text: "Publishing directly to Facebook Page..." });

    const res = await broadcastToFacebook({
      type: manualType,
      title: manualTitle.trim(),
      summary: manualMessage.trim(),
      link: "/",
    });

    setIsPostingManual(false);
    setSettings(getFacebookSettings());

    if (res.success) {
      setStatusMsg({
        type: "success",
        text: `Published successfully to Facebook Page! ${res.postUrl ? "View post link below." : ""}`,
      });
      setManualTitle("");
      setManualMessage("");
    } else {
      setStatusMsg({
        type: "error",
        text: res.error || "Failed to post to Facebook. Please check token permissions.",
      });
    }
  };

  return (
    <div className="space-y-6" style={{ maxWidth: "1100px" }}>
      {/* PAGE IDENTITY HEADER CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
              <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Target Page Configured
                </span>
                <span className="text-xs text-slate-500 font-mono">Page ID: {FACEBOOK_PAGE_ID}</span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">(Business: 360240070266245)</span>
              </div>
              <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {FACEBOOK_PAGE_NAME}
              </h2>
              <a
                href={FACEBOOK_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                {FACEBOOK_PAGE_URL} <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestBroadcast}
              disabled={isTesting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isTesting ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              <span>{isTesting ? "Testing..." : "Send Test Broadcast"}</span>
            </button>
            <a
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
            >
              <span>Visit Page</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {statusMsg && (
          <div
            className={`mt-4 rounded-xl p-3.5 text-xs font-semibold flex items-center gap-2.5 ${
              statusMsg.type === "success"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300"
                : statusMsg.type === "error"
                ? "bg-rose-50 text-rose-900 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300"
                : "bg-blue-50 text-blue-900 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : statusMsg.type === "error" ? (
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
            ) : (
              <RefreshCw size={16} className="text-blue-600 animate-spin shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ACCESS TOKEN CONFIGURATION */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <KeyRound size={18} className="text-blue-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">Meta Page Access Token</h3>
          </div>

          <p className="mt-3 text-xs text-slate-600 leading-relaxed dark:text-slate-400">
            A Page Access Token allows GeoCam to publish to your Facebook Page. Tokens can expire or be revoked. A configured token still needs valid publishing permissions.
          </p>

          <div className="mt-4 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Page Access Token (Meta Graph API)
            </label>
            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder={hasServerToken ? "Optional browser override — server token is configured" : "EAA..."}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 pr-10 text-xs font-mono text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span role="status" className="text-[11px] text-slate-500">
              {tokenStatus}
            </span>
            <button
              type="button"
              onClick={handleSaveToken}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition"
            >
              <ShieldCheck size={14} />
              <span>Save Token</span>
            </button>
          </div>

          {hasServerToken && <p className="mt-3 text-xs leading-relaxed text-slate-500">The server token stays on the server and is never copied into this field. Leave the field empty to use it. Send Test Broadcast publishes a real post to verify publishing access.</p>}

          <div className="mt-5 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
            <p className="font-bold text-slate-800 dark:text-slate-200">How to generate a permanent token:</p>
            <ol className="mt-1.5 list-decimal pl-4 space-y-1 text-[11px]">
              <li>Go to <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Meta Graph API Explorer ↗</a>.</li>
              <li>Select your app &amp; page <strong>(ID: 105049257586051)</strong>.</li>
              <li>Grant permissions: <code>pages_manage_posts</code> and <code>pages_read_engagement</code>.</li>
              <li>Generate the Access Token and paste it above.</li>
            </ol>
          </div>
        </div>

        {/* AUTOMATED PUBLISHING RULES */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Sliders size={18} className="text-emerald-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">Auto-Publishing Automation Rules</h3>
          </div>

          <div className="mt-4 space-y-4">
            {/* Articles */}
            <label className="flex items-start justify-between gap-3 cursor-pointer">
              <div>
                <span className="block text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-600" />
                  Auto-post New Posts &amp; Research Articles
                </span>
                <span className="block text-[11px] text-slate-500">
                  Automatically shares new publications with title, abstract, and link when published.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoPostArticles}
                onChange={(e) => handleToggle("autoPostArticles", e.target.checked)}
                className="mt-1 h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            {/* News */}
            <label className="flex items-start justify-between gap-3 cursor-pointer">
              <div>
                <span className="block text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Share2 size={14} className="text-purple-600" />
                  Auto-post News Feed Updates
                </span>
                <span className="block text-[11px] text-slate-500">
                  Broadcasts breaking geological news, conference dispatches, and society bulletins.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoPostNews}
                onChange={(e) => handleToggle("autoPostNews", e.target.checked)}
                className="mt-1 h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            {/* Events */}
            <label className="flex items-start justify-between gap-3 cursor-pointer">
              <div>
                <span className="block text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Calendar size={14} className="text-amber-600" />
                  Auto-post Upcoming Events
                </span>
                <span className="block text-[11px] text-slate-500">
                  Posts new conferences, seminars, field trips, and workshops with dates and venue.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoPostEvents}
                onChange={(e) => handleToggle("autoPostEvents", e.target.checked)}
                className="mt-1 h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            {/* Earthquakes */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-start justify-between gap-3 cursor-pointer">
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Radio size={14} className="text-rose-600" />
                    Auto-post Earthquake Alerts
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    Immediately broadcasts verified regional earthquakes (USGS / TMD / CENC).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoPostEarthquakes}
                  onChange={(e) => handleToggle("autoPostEarthquakes", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              {settings.autoPostEarthquakes && (
                <div className="mt-3 pl-5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Minimum Magnitude Filter:</span>
                    <select
                      value={settings.minEarthquakeMagnitude}
                      onChange={(e) => handleToggle("minEarthquakeMagnitude", parseFloat(e.target.value))}
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="3.0">M ≥ 3.0 (Minor+)</option>
                      <option value="3.5">M ≥ 3.5 (Recommended)</option>
                      <option value="4.0">M ≥ 4.0 (Moderate+)</option>
                      <option value="5.0">M ≥ 5.0 (Strong only)</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={settings.regionalEarthquakesOnly}
                      onChange={(e) => handleToggle("regionalEarthquakesOnly", e.target.checked)}
                      className="h-3.5 w-3.5 rounded-sm border-slate-300 text-blue-600"
                    />
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">
                      Regional envelope only (Cambodia &amp; Indochina: 5°N–25°N, 92°E–112°E)
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* INSTANT BROADCAST COMPOSER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <Send size={18} className="text-blue-600" />
          <h3 className="font-bold text-slate-900 dark:text-white">Instant Facebook Broadcast Composer</h3>
        </div>

        <form onSubmit={handleManualBroadcast} className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Broadcast Category:</span>
            {(["news", "event", "earthquake", "post"] as const).map((cat) => (
              <label key={cat} className="inline-flex items-center gap-1.5 text-xs cursor-pointer capitalize">
                <input
                  type="radio"
                  name="manualType"
                  value={cat}
                  checked={manualType === cat}
                  onChange={() => setManualType(cat)}
                  className="text-blue-600"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>

          <div>
            <input
              type="text"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              placeholder="Headline / Announcement Title..."
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <textarea
              rows={3}
              value={manualMessage}
              onChange={(e) => setManualMessage(e.target.value)}
              placeholder="Detailed caption / summary text to broadcast to Facebook page followers..."
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-slate-500">
              Will be published live to <strong>{FACEBOOK_PAGE_NAME}</strong> with GeoCam hashtags.
            </p>
            <button
              type="submit"
              disabled={isPostingManual}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isPostingManual ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              <span>{isPostingManual ? "Broadcasting..." : "Broadcast to Facebook Page"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* BROADCAST LOG */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <History size={18} className="text-slate-600 dark:text-slate-300" />
            <h3 className="font-bold text-slate-900 dark:text-white">Recent Broadcast Activity Log</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              {settings.recentBroadcasts?.length || 0} broadcast records
            </span>
            {settings.recentBroadcasts && settings.recentBroadcasts.length > 0 && (
              <button
                type="button"
                onClick={handleClearLog}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                Clear Log
              </button>
            )}
          </div>
        </div>

        {(!settings.recentBroadcasts || settings.recentBroadcasts.length === 0) ? (
          <p className="mt-4 text-xs text-slate-500 italic py-4 text-center">
            No broadcast activity yet. Click "Send Test Broadcast" above to test your Facebook Page connection!
          </p>
        ) : (
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {settings.recentBroadcasts.map((b) => (
              <div key={b.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                      b.type === "earthquake"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : b.type === "event"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : b.type === "news"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    }`}
                  >
                    {b.type}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{b.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(b.timestamp).toLocaleString()}
                      {b.error && <span className="text-rose-600 ml-2 font-mono">Error: {b.error}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      b.status === "success"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                    }`}
                  >
                    {b.status === "success" ? "✓ Sent" : "✗ Error"}
                  </span>
                  {b.fbPostUrl && (
                    <a
                      href={b.fbPostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
