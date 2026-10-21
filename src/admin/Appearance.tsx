import { useEffect, useRef, useState } from "react";
import { Check, Save, Type } from "lucide-react";
import { useCms } from "../visual-cms/VisualCms";
import { supabase } from "../lib/supabase";
import {
  englishFonts,
  khmerFonts,
  fontCss,
  loadFontStyles,
} from "../lib/site-fonts";

const options = { english: englishFonts, khmer: khmerFonts };

export default function Appearance() {
  const { draft, published, ready, refreshContent } = useCms();
  const [english, setEnglish] = useState("times");
  const [khmer, setKhmer] = useState("noto-sans-khmer");
  const [baseline, setBaseline] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const initialized = useRef(false);
  useEffect(() => {
    loadFontStyles([english, khmer]);
  }, [english, khmer]);
  useEffect(() => {
    if (!ready || initialized.current) return;
    initialized.current = true;
    const nextEnglish = draft.__appearance?.englishFont?.value || "times";
    const nextKhmer = draft.__appearance?.khmerFont?.value || "noto-sans-khmer";
    setEnglish(nextEnglish);
    setKhmer(nextKhmer);
    setBaseline(JSON.stringify([nextEnglish, nextKhmer]));
  }, [ready, draft]);
  const dirty = JSON.stringify([english, khmer]) !== baseline;
  const appliedEnglish = published.__appearance?.englishFont?.value || "times";
  const appliedKhmer =
    published.__appearance?.khmerFont?.value || "noto-sans-khmer";
  const pending = english !== appliedEnglish || khmer !== appliedKhmer;
  async function persist(apply: boolean) {
    if (!ready || busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await supabase.rpc("geocam_update_fonts", {
        p_english: english,
        p_khmer: khmer,
        p_publish: apply,
      });
      if (result.error) throw result.error;
      await refreshContent();
      setBaseline(JSON.stringify([english, khmer]));
      setMessage(
        apply
          ? "Fonts approved and applied to the website."
          : "Font draft saved. Approve and apply when ready.",
      );
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Could not save fonts. Your selections are still here. Please retry.",
      );
    } finally {
      setBusy(false);
    }
  }
  const label = (language: "english" | "khmer", id: string) =>
    options[language].find((option) => option.id === id)?.label || id;
  return (
    <div>
      <div className="gc-admin-notice">
        <strong>Website typography</strong>
        <p>
          Choose a font for each language. The samples below preview your
          selections. Save a private draft, then choose Approve and apply fonts
          to update the website.
        </p>
      </div>
      <div className="gc-admin-page-layout">
        <section className="gc-admin-card">
          <div className="gc-admin-card-heading">
            <h2>Language fonts</h2>
            <Type size={19} />
          </div>
          <div className="gc-admin-fields">
            <div className="gc-admin-field-row">
              <label htmlFor="appearance-english">English font</label>
              <select
                id="appearance-english"
                value={english}
                disabled={!ready || busy}
                onChange={(event) => {
                  setEnglish(event.target.value);
                  setMessage("");
                }}
              >
                {options.english.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.label}
                  </option>
                ))}
              </select>
              <p className="mt-3 text-xs text-slate-500">
                Currently applied: {label("english", appliedEnglish)}
              </p>
              <div
                className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-6"
                lang="en"
                ref={(node) => {
                  node?.style.setProperty("--geocam-font-en", fontCss(english));
                  node?.style.setProperty(
                    "--geocam-font-active",
                    fontCss(english),
                  );
                }}
                style={{ fontFamily: fontCss(english) }}
              >
                <h3 className="text-3xl leading-relaxed">
                  Explore the earth. Understand Cambodia.
                </h3>
                <p className="mt-4 text-lg leading-relaxed">
                  Geological knowledge connects our community with the
                  landscapes, resources, and natural history of Cambodia.
                </p>
                <p className="mt-4 text-sm">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz · 0123456789
                </p>
              </div>
            </div>
            <div className="gc-admin-field-row">
              <label htmlFor="appearance-khmer">
                Khmer font / ពុម្ពអក្សរខ្មែរ
              </label>
              <select
                id="appearance-khmer"
                value={khmer}
                disabled={!ready || busy}
                onChange={(event) => {
                  setKhmer(event.target.value);
                  setMessage("");
                }}
              >
                {options.khmer.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.label}
                  </option>
                ))}
              </select>
              <p className="mt-3 text-xs text-slate-500">
                Currently applied: {label("khmer", appliedKhmer)}
              </p>
              <div
                className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-6"
                lang="km"
                ref={(node) => {
                  node?.style.setProperty("--geocam-font-km", fontCss(khmer));
                  node?.style.setProperty(
                    "--geocam-font-active",
                    fontCss(khmer),
                  );
                }}
                style={{ fontFamily: fontCss(khmer) }}
              >
                <h3 className="text-3xl leading-loose">
                  ស្វែងយល់ពីផែនដី។ ស្គាល់កម្ពុជាកាន់តែច្បាស់។
                </h3>
                <p className="mt-4 text-lg leading-loose">
                  ចំណេះដឹងភូគព្ភសាស្ត្រភ្ជាប់សហគមន៍របស់យើងទៅនឹងទេសភាព ធនធាន
                  និងប្រវត្តិធម្មជាតិរបស់កម្ពុជា។
                </p>
                <p className="mt-4 text-sm leading-loose">
                  ក ខ គ ឃ ង ច ឆ ជ ឈ ញ ដ ឋ ឌ ឍ ណ<br />
                  ០១២៣៤៥៦៧៨៩
                </p>
              </div>
            </div>
          </div>
        </section>
        <aside className="gc-admin-card gc-admin-publish-panel">
          <h2>Apply typography</h2>
          <p
            className={error ? "gc-admin-status is-error" : "gc-admin-status"}
            role={error ? "alert" : "status"}
            aria-live="polite"
          >
            {error ||
              message ||
              (!ready
                ? "Loading font settings…"
                : busy
                  ? "Saving fonts…"
                  : dirty
                    ? "Unsaved font selections"
                    : pending
                      ? "Draft fonts are awaiting approval"
                      : "Website fonts are up to date")}
          </p>
          <button
            className="gc-admin-button"
            disabled={!ready || busy || !dirty}
            onClick={() => void persist(false)}
          >
            <Save size={16} />
            Save draft
          </button>
          <button
            className="gc-admin-button is-primary"
            disabled={!ready || busy || (!dirty && !pending)}
            onClick={() => void persist(true)}
          >
            <Check size={16} />
            Approve and apply fonts
          </button>
          <p>
            Approval applies these two font choices across the website. Page
            content is managed separately.
          </p>
        </aside>
      </div>
    </div>
  );
}
