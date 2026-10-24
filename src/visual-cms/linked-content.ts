import { translateText } from "../lib/translation";
import type { Entry, Store, TranslationStatus } from "./VisualCms";

/**
 * Updates a content field in the visual CMS store.
 * - Stores English and Khmer separately for each page, linked by the same page ID (e.g., base::en and base::km).
 * - Treats English as the source language.
 * - When English content changes: generates or suggests an updated Khmer translation using the technical glossary.
 * - Preserves manually corrected Khmer translations and requires review before replacing them (status: "Needs Review").
 * - Administrators can edit and save Khmer independently, without modifying English.
 * - Translation statuses supported: "Draft", "Needs Review", and "Approved".
 * - Applies shared layout and design changes (images, dimensions, styles) to both languages while keeping text separate.
 */
export function updateLinkedField(
  store: Store,
  page: string,
  key: string,
  entry: Entry,
): Store {
  const base = page.replace(/::(en|km)$/, "");
  const space =
    entry.kind === "image" || !page.includes("::") ? base + "::en" : page;
  const previous = store[space]?.[key];

  if (
    previous?.kind === entry.kind &&
    previous.value === entry.value &&
    previous.width === entry.width &&
    previous.height === entry.height &&
    previous.fit === entry.fit &&
    previous.style === entry.style &&
    previous.status === entry.status &&
    previous.suggestedValue === entry.suggestedValue &&
    previous.sourceValue === entry.sourceValue &&
    previous.manuallyEdited === entry.manuallyEdited
  ) {
    return store;
  }

  const next: Store = { ...store, [space]: { ...store[space], [key]: entry } };

  if (entry.kind === "image") {
    // Images are shared across languages and live strictly in ::en
    for (const other of [base, base + "::km"]) {
      if (next[other]?.[key]) {
        next[other] = { ...next[other] };
        delete next[other][key];
      }
    }
  } else if (space.endsWith("::en")) {
    // English is the source language.
    const kmSpace = base + "::km";
    const existingKm = store[kmSpace]?.[key];
    const suggestedKhmer =
      entry.value === "__removed__"
        ? "__removed__"
        : (translateText(entry.value) || entry.value);

    next[kmSpace] = { ...next[kmSpace] };

    // Shared layout and design changes apply to both languages while text remains separate
    const sharedLayout = {
      ...(entry.width !== undefined && { width: entry.width }),
      ...(entry.height !== undefined && { height: entry.height }),
      ...(entry.fit !== undefined && { fit: entry.fit }),
      ...(entry.style !== undefined && { style: entry.style }),
    };

    if (existingKm && existingKm.value) {
      // PRESERVE existing Khmer translation! Require review before replacing:
      next[kmSpace][key] = {
        ...existingKm,
        ...sharedLayout,
        status: "Needs Review",
        suggestedValue: suggestedKhmer,
        sourceValue: entry.value,
      };
    } else {
      // Auto-generated glossary suggestion for new or unreviewed translation
      next[kmSpace][key] = {
        kind: "text",
        value: suggestedKhmer,
        ...sharedLayout,
        status: "Needs Review",
        suggestedValue: suggestedKhmer,
        sourceValue: entry.value,
        manuallyEdited: false,
      };
    }

    if (next[base]?.[key]) {
      next[base] = { ...next[base] };
      delete next[base][key];
    }
  } else if (space.endsWith("::km")) {
    // Khmer edit: Administrator editing Khmer independently without modifying English text!
    next[space][key] = {
      ...entry,
      status: entry.status || "Approved",
      manuallyEdited: true,
      suggestedValue: undefined,
    };

    // Shared layout and design changes apply to both languages:
    const enSpace = base + "::en";
    if (next[enSpace]?.[key]) {
      const enExisting = next[enSpace][key];
      const hasLayoutChange =
        entry.width !== enExisting.width ||
        entry.height !== enExisting.height ||
        entry.fit !== enExisting.fit ||
        entry.style !== enExisting.style;
      if (hasLayoutChange) {
        next[enSpace] = {
          ...next[enSpace],
          [key]: {
            ...enExisting,
            ...(entry.width !== undefined && { width: entry.width }),
            ...(entry.height !== undefined && { height: entry.height }),
            ...(entry.fit !== undefined && { fit: entry.fit }),
            ...(entry.style !== undefined && { style: entry.style }),
          },
        };
      }
    }
  }

  return next;
}

/**
 * Accepts the glossary-suggested translation for a Khmer field and marks it Approved.
 */
export function acceptTranslation(
  store: Store,
  page: string,
  key: string,
): Store {
  const base = page.replace(/::(en|km)$/, "");
  const kmSpace = base + "::km";
  const current = store[kmSpace]?.[key];
  if (!current) return store;
  const newValue = current.suggestedValue || current.value;
  return {
    ...store,
    [kmSpace]: {
      ...store[kmSpace],
      [key]: {
        ...current,
        value: newValue,
        status: "Approved",
        manuallyEdited: true,
        suggestedValue: undefined,
      },
    },
  };
}

/**
 * Approves the current Khmer translation as-is, preserving it against future automatic overwrites.
 */
export function approveTranslation(
  store: Store,
  page: string,
  key: string,
): Store {
  const base = page.replace(/::(en|km)$/, "");
  const kmSpace = base + "::km";
  const current = store[kmSpace]?.[key];
  if (!current) return store;
  return {
    ...store,
    [kmSpace]: {
      ...store[kmSpace],
      [key]: {
        ...current,
        status: "Approved",
        manuallyEdited: true,
        suggestedValue: undefined,
      },
    },
  };
}

export function linkedEntry(
  store: Store,
  page: string,
  language: "en" | "km",
  key: string,
): Entry | undefined {
  const base = page.replace(/::(en|km)$/, "");
  const englishStore = store[base + "::en"] || store[base] || {};
  const localStore = store[base + "::" + language] || {};

  // 1. Direct match
  let english = englishStore[key];
  let local = localStore[key];

  // 2. Case-insensitive and alias-tolerant fallback
  if (!english && !local) {
    const keyLower = key.toLowerCase();
    const normalizeSub = (k: string) =>
      k.toLowerCase().replace(/^sub:(topic-)?/, "sub:");
    const targetNorm = normalizeSub(keyLower);

    for (const [k, v] of Object.entries(englishStore)) {
      if (k.toLowerCase() === keyLower || normalizeSub(k) === targetNorm) {
        english = v;
        break;
      }
    }
    for (const [k, v] of Object.entries(localStore)) {
      if (k.toLowerCase() === keyLower || normalizeSub(k) === targetNorm) {
        local = v;
        break;
      }
    }
  }

  if (english?.kind === "image") return english;
  if (language === "km") {
    if (local) {
      // Inherit shared layout attributes from English if not defined on Khmer
      return {
        ...local,
        width: local.width || english?.width,
        height: local.height || english?.height,
        fit: local.fit || english?.fit,
        style: local.style || english?.style,
      };
    }
    if (english?.kind === "text") {
      const translated = translateText(english.value);
      return {
        ...english,
        value: translated,
        status: "Draft",
        suggestedValue: translated,
        sourceValue: english.value,
        manuallyEdited: false,
      };
    }
    return undefined;
  }

  return english;
}

export function canonicalDbRoute(path: string): string {
  const clean = path.split("?")[0].replace(/\/+$/, "") || "/";
  if (clean === "/" || clean === "") return "/";
  if (clean.startsWith("/research")) return "/research";
  if (clean.startsWith("/news")) return "/news";
  if (clean.startsWith("/publications")) return "/publications";
  if (clean.startsWith("/articles")) return "/news";
  if (clean.startsWith("/about")) return "/about";
  if (clean.startsWith("/events")) return "/events";
  if (clean.startsWith("/membership")) return "/membership";
  if (clean.startsWith("/geodata")) return "/geodata";
  if (clean.startsWith("/environmental-monitoring")) return "/environmental-monitoring";
  if (clean.startsWith("/contact")) return "/contact";
  if (clean.startsWith("/geopark")) return "/geopark";
  if (clean.startsWith("/mining")) return "/mining";
  if (clean.startsWith("/lexicon")) return "/lexicon";
  if (clean.startsWith("/dashboard")) return "/dashboard";
  return clean;
}

/** Publish changed page fields only; Appearance approval is a separate action. */
export function pageChanges(draft: Store, published: Store) {
  const changes: Record<string, Record<string, Entry | null>> = {};
  for (const page of new Set([
    ...Object.keys(draft),
    ...Object.keys(published),
  ])) {
    if (page.startsWith("__")) continue;

    const [base, lang] = page.split("::");
    const canonicalBase = canonicalDbRoute(base);
    const targetPage = lang ? `${canonicalBase}::${lang}` : canonicalBase;

    for (const key of new Set([
      ...Object.keys(draft[page] || {}),
      ...Object.keys(published[page] || {}),
    ])) {
      const before = published[page]?.[key],
        after = draft[page]?.[key];
      if (
        before?.kind === after?.kind &&
        before?.value === after?.value &&
        before?.width === after?.width &&
        before?.height === after?.height &&
        before?.fit === after?.fit &&
        before?.style === after?.style &&
        before?.status === after?.status &&
        before?.suggestedValue === after?.suggestedValue &&
        before?.sourceValue === after?.sourceValue &&
        before?.manuallyEdited === after?.manuallyEdited
      )
        continue;
      (changes[targetPage] ||= {})[key] = after || null;
    }
  }
  return changes;
}

/** Rebase unsaved local fields over the server's atomically merged snapshot. */
export function rebaseDraft(
  server: Store,
  baseline: Store,
  local: Store,
): Store {
  const result: Store = structuredClone(server);
  for (const page of new Set([
    ...Object.keys(baseline),
    ...Object.keys(local),
  ])) {
    for (const key of new Set([
      ...Object.keys(baseline[page] || {}),
      ...Object.keys(local[page] || {}),
    ])) {
      const before = baseline[page]?.[key],
        after = local[page]?.[key];
      if (
        before?.kind === after?.kind &&
        before?.value === after?.value &&
        before?.width === after?.width &&
        before?.height === after?.height &&
        before?.fit === after?.fit &&
        before?.style === after?.style &&
        before?.status === after?.status &&
        before?.suggestedValue === after?.suggestedValue &&
        before?.sourceValue === after?.sourceValue &&
        before?.manuallyEdited === after?.manuallyEdited
      )
        continue;
      result[page] = { ...result[page] };
      if (after) result[page][key] = after;
      else delete result[page][key];
    }
  }
  return result;
}

/**
 * Strips duplicate image entries from ::km and purges bloat so payload
 * stays strictly within PostgreSQL JSON and check constraint bounds.
 */
export function sanitizeStoreForStorage(store: Store): Store {
  const result: Store = {};

  for (const [pageKey, fields] of Object.entries(store || {})) {
    if (!fields || typeof fields !== "object") continue;

    const [base, lang] = pageKey.split("::");

    for (const [key, entry] of Object.entries(fields)) {
      if (!entry || typeof entry !== "object" || !entry.value) continue;

      if (entry.kind === "image") {
        // All images live strictly in ::en
        const enPage = `${base}::en`;
        if (!result[enPage]) result[enPage] = {};
        if (!result[enPage][key]) {
          result[enPage][key] = entry;
        }
        // Do NOT store image duplicates under ::km or raw base
      } else {
        const targetPage = lang ? `${base}::${lang}` : `${base}::en`;
        if (!result[targetPage]) result[targetPage] = {};
        result[targetPage][key] = entry;
      }
    }
  }

  // Preserve global appearance settings if present
  if ((store as any)?.__appearance) {
    (result as any).__appearance = (store as any).__appearance;
  }

  return result;
}
