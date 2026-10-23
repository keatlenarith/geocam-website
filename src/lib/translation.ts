import { useLayoutEffect } from "react";
import publicText from "./translations/public-km.json";
import toolsText from "./translations/tools-km.json";
import workflowText from "./translations/workflow-km.json";
import researchText from "./translations/research-km.json";
import lexicon from "./lexicon-terms.json";
import { khmerLabels } from "./auto-khmer";

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
const glossary = Object.fromEntries(
  Object.entries(lexicon.terms).map(([english, entry]) => [
    english,
    entry.khmer,
  ]),
);
const catalog: Record<string, string> = {
  ...khmerLabels,
  ...publicText,
  ...toolsText,
  ...researchText,
  ...workflowText,
  ...glossary,
};
const pluralTerms: Record<string, string> = {
  Geosciences: glossary.Geoscience,
  Faults: glossary.Fault,
  Minerals: glossary.Mineral,
  Geosites: glossary.Geosite,
};
Object.assign(catalog, pluralTerms);
const lookup = new Map(
  Object.entries(catalog).map(([key, value]) => [
    normalize(key).toLowerCase(),
    value,
  ]),
);
const backend: Record<string, string> = {
  "Loading page…": "កំពុងផ្ទុកទំព័រ…",
  "GeoCam | Geosciences Society of Cambodia":
    "GeoCam | សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា",
  Jan: "មករា",
  Feb: "កុម្ភៈ",
  Mar: "មីនា",
  Apr: "មេសា",
  May: "ឧសភា",
  Jun: "មិថុនា",
  Jul: "កក្កដា",
  Aug: "សីហា",
  Sep: "កញ្ញា",
  Oct: "តុលា",
  Nov: "វិច្ឆិកា",
  Dec: "ធ្នូ",
  "All categories (": "គ្រប់ប្រភេទ (",
  "features ·": "វត្ថុភូមិសាស្ត្រ ·",
  layers: "ស្រទាប់",
  results: "លទ្ធផល",
  "references · 45 collected documents · Updated 19 October 2026":
    "ឯកសារយោង · ឯកសារប្រមូលបាន ៤៥ · បានធ្វើបច្ចុប្បន្នភាពថ្ងៃទី ១៩ ខែតុលា ឆ្នាំ២០២៦",
  "member(s) hidden by privacy preference · sample names":
    "សមាជិកត្រូវបានលាក់តាមការកំណត់ឯកជនភាព · ឈ្មោះគំរូ",
  "· DEMO": "· គំរូសាកល្បង",
  "រូបភាពគំរូ — អាចប្តូរបានក្នុង Visual Edit":
    "រូបភាពគំរូ — អាចប្ដូរបានក្នុងមុខងារកែសម្រួលដោយផ្ទាល់",
  "បំពេញទម្រង់ដើម្បីបើកកម្មវិធីអ៊ីមែលរបស់អ្នក។ សូមចុច Send នៅក្នុងកម្មវិធីអ៊ីមែលដើម្បីផ្ញើសារ។":
    "បំពេញទម្រង់ដើម្បីបើកកម្មវិធីអ៊ីមែលរបស់អ្នក។ សូមចុច «ផ្ញើ» នៅក្នុងកម្មវិធីអ៊ីមែលដើម្បីផ្ញើសារ។",
  "Invalid login credentials": "អាសយដ្ឋានអ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ។",
  "Email not confirmed": "សូមបញ្ជាក់អាសយដ្ឋានអ៊ីមែលរបស់អ្នកមុនពេលចូល។",
  "User already registered":
    "អាសយដ្ឋានអ៊ីមែលនេះបានចុះឈ្មោះរួចហើយ។ សូមចូល ឬកំណត់ពាក្យសម្ងាត់ឡើងវិញ។",
  "Email rate limit exceeded":
    "ការផ្ញើអ៊ីមែលបានដល់កម្រិតកំណត់។ សូមរង់ចាំបន្តិច ហើយសាកល្បងម្ដងទៀត។",
  "Double-click text to edit. Select, copy, cut or paste normally. Enter finishes; Shift+Enter adds a line; Esc cancels.":
    "ចុចពីរដងលើអត្ថបទដើម្បីកែសម្រួល។ អ្នកអាចជ្រើសរើស ចម្លង កាត់ និងបិទភ្ជាប់ដូចធម្មតា។ ចុច Enter ដើម្បីបញ្ចប់, Shift+Enter ដើម្បីបន្ថែមបន្ទាត់ និង Esc ដើម្បីបោះបង់។",
  "Double-click to add text": "ចុចពីរដងដើម្បីបន្ថែមអត្ថបទ",
  "Edit page text": "កែសម្រួលអត្ថបទទំព័រ",
};
for (const [key, value] of Object.entries(backend))
  lookup.set(key.toLowerCase(), value);

function dynamic(text: string): string | undefined {
  let m: RegExpMatchArray | null;
  if ((m = text.match(/^(\d+) results?$/i))) return `លទ្ធផល ${m[1]}`;
  if ((m = text.match(/^(\d+) layers?$/i))) return `ស្រទាប់ ${m[1]}`;
  if ((m = text.match(/^(\d+) features? · (.+)$/i)))
    return `វត្ថុភូមិសាស្ត្រ ${m[1]} · ${m[2]}`;
  if ((m = text.match(/^All categories \((\d+)\)$/i)))
    return `គ្រប់ប្រភេទ (${m[1]})`;
  if ((m = text.match(/^(.+) \((\d+)\)$/))) {
    const label = lookup.get(m[1].toLowerCase());
    if (label) return `${label} (${m[2]})`;
  }
  if ((m = text.match(/^File (\d+) of (\d+): (.+)$/i)))
    return `ឯកសារទី ${m[1]} នៃ ${m[2]}៖ ${m[3]}`;
  if (
    (m = text.match(
      /^Uploaded (\d+) features as a private draft\. Check the map, then publish\.\s*(.*)$/i,
    ))
  )
    return `បានផ្ទុកវត្ថុភូមិសាស្ត្រ ${m[1]} ជាសេចក្ដីព្រាងឯកជន។ សូមពិនិត្យផែនទី រួចផ្សព្វផ្សាយ។ ${m[2] ? translateText(m[2]) : ""}`.trim();
  if (
    (m = text.match(
      /^Uploaded (\d+) of (\d+) files as separate private draft layers\.\s*(.*)$/i,
    ))
  )
    return `បានផ្ទុកឯកសារ ${m[1]} នៃ ${m[2]} ជាស្រទាប់សេចក្ដីព្រាងឯកជនដាច់ដោយឡែក។ ${m[3] ? translateText(m[3]) : ""}`.trim();
  if (
    (m = text.match(
      /^Failed: (.+)\. Check their format and size before retrying\.$/,
    ))
  )
    return `ឯកសារបរាជ័យ៖ ${m[1]}។ សូមពិនិត្យទ្រង់ទ្រាយ និងទំហំមុនពេលសាកល្បងម្ដងទៀត។`;
  if ((m = text.match(/^(.+) · Draft$/))) return `${m[1]} · សេចក្ដីព្រាង`;
  if ((m = text.match(/^(\d+) edited elements \(draft\)$/)))
    return `ធាតុដែលបានកែសម្រួល ${m[1]} (សេចក្ដីព្រាង)`;
  if (
    (m = text.match(
      /^© (\d{4}) GeoCam prototype · Sample content only · No official endorsements implied$/,
    ))
  )
    return `© ${m[1]} GeoCam · គេហទំព័រគំរូ · មាតិកាគំរូប៉ុណ្ណោះ · មិនសំដៅលើការទទួលស្គាល់ជាផ្លូវការទេ`;
  if ((m = text.match(/^(\d+)\s*(references?|documents?|publications?)$/i)))
    return `${translateText(m[2])} ${m[1]}`;
  if (
    (m = text.match(
      /^For security purposes, you can only request this after (\d+) seconds\.?$/i,
    ))
  )
    return `ដើម្បីសុវត្ថិភាព សូមរង់ចាំ ${m[1]} វិនាទី មុនពេលស្នើសុំម្ដងទៀត។`;
  if ((m = text.match(/^(.+?)\s*·\s*(.+)$/))) {
    const left = translateText(m[1]),
      right = translateText(m[2]);
    if (left !== m[1] || right !== m[2]) return `${left} · ${right}`;
  }
  return undefined;
}
export function translateText(value: string): string {
  // Also correct older Khmer society names retained in saved CMS text.
  value = value.replace(/សមាគមភូគព្ភ(?:វិទ្យា(?!សាស្ត្រ)|សាស្ត្រ)/g, "សមាគម" + glossary.Geoscience);
  const text = normalize(value);
  if (!text) return value;
  const translated = lookup.get(text.toLowerCase()) || dynamic(text);
  return translated ? value.replace(value.trim(), translated) : value;
}

type RecordValue = { source: string; rendered: string };
const textSources = new WeakMap<Text, RecordValue>();
const attributeSources = new WeakMap<Element, Map<string, RecordValue>>();
let titleSource: RecordValue | undefined;
export function sourceText(element: Element): string {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let result = "";
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node as Text;
    const record = textSources.get(text);
    result +=
      record && text.data === record.rendered ? record.source : text.data;
  }
  return result;
}
const skipped =
  "script,style,textarea,code,pre,[data-no-translate],[data-cms-inline],.leaflet-control-attribution,.maplibregl-ctrl-attrib,iframe";
export function useDocumentTranslation(lang: "en" | "km") {
  useLayoutEffect(() => {
    const nativeConfirm = window.confirm,
      nativeAlert = window.alert,
      nativePrompt = window.prompt;
    const message = (value?: string) =>
      lang === "km" && typeof value === "string" ? translateText(value) : value;
    const translatedConfirm = (value?: string) =>
      nativeConfirm.call(window, message(value));
    const translatedAlert = (value?: string) =>
      nativeAlert.call(window, message(value));
    const translatedPrompt = (value?: string, initial?: string) =>
      nativePrompt.call(window, message(value), initial);
    window.confirm = translatedConfirm;
    window.alert = translatedAlert;
    window.prompt = translatedPrompt;
    let queued = false;
    let closed = false;
    const apply = () => {
      queued = false;
      if (closed) return;
      const root = document.getElementById("root");
      if (!root) return;
      if (!titleSource || document.title !== titleSource.rendered)
        titleSource = { source: document.title, rendered: document.title };
      const title =
        lang === "km" ? translateText(titleSource.source) : titleSource.source;
      titleSource.rendered = title;
      if (document.title !== title) document.title = title;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node as Text;
        const parent = text.parentElement;
        if (
          !parent ||
          parent.closest(skipped) ||
          parent.closest("[data-cms-key]")
        )
          continue;
        const current = text.data;
        let record = textSources.get(text);
        if (!record || current !== record.rendered)
          record = { source: current, rendered: current };
        if (parent.tagName === "OPTION" && !parent.hasAttribute("value"))
          parent.setAttribute("value", record.source);
        const next =
          lang === "km" ? translateText(record.source) : record.source;
        record.rendered = next;
        textSources.set(text, record);
        if (text.data !== next) text.data = next;
      }
      root
        .querySelectorAll<HTMLElement>(
          "[placeholder],[aria-label],[title],img[alt]",
        )
        .forEach((el) => {
          if (el.closest(skipped)) return;
          const records =
            attributeSources.get(el) || new Map<string, RecordValue>();
          for (const name of ["placeholder", "aria-label", "title", "alt"]) {
            const current = el.getAttribute(name);
            if (current === null) continue;
            let record = records.get(name);
            if (!record || current !== record.rendered)
              record = { source: current, rendered: current };
            const next =
              lang === "km" ? translateText(record.source) : record.source;
            record.rendered = next;
            records.set(name, record);
            if (current !== next) el.setAttribute(name, next);
          }
          attributeSources.set(el, records);
        });
    };
    apply();
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      queueMicrotask(apply);
    });
    const root = document.getElementById("root");
    if (root)
      observer.observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["placeholder", "aria-label", "title", "alt"],
      });
    return () => {
      closed = true;
      observer.disconnect();
      if (window.confirm === translatedConfirm) window.confirm = nativeConfirm;
      if (window.alert === translatedAlert) window.alert = nativeAlert;
      if (window.prompt === translatedPrompt) window.prompt = nativePrompt;
    };
  }, [lang]);
}
