import { translateText } from "../lib/translation";
import type { Entry, Store } from "./VisualCms";

/**
 * Universal EN <-> KM Content & Image Synchronization Engine:
 * - Any image/photo changed on ANY page in ANY language automatically updates BOTH languages (overall change).
 * - Text updates in English automatically update Khmer, and vice-versa, so both versions stay unified.
 */
export function updateLinkedField(
  store: Store,
  page: string,
  key: string,
  entry: Entry,
): Store {
  const previous = store[page]?.[key];
  if (previous?.kind === entry.kind && previous.value === entry.value)
    return store;

  const base = page.replace(/::(en|km)$/, "");
  const next: Store = { ...store, [page]: { ...store[page], [key]: entry } };

  if (entry.kind === "image") {
    // RULE: Images are universal! Sync across base, English, and Khmer!
    next[base] = { ...next[base], [key]: entry };
    next[base + "::en"] = { ...next[base + "::en"], [key]: entry };
    next[base + "::km"] = { ...next[base + "::km"], [key]: entry };
  } else {
    // Text: update current language AND ensure overall availability across both versions
    next[page] = { ...next[page], [key]: entry };
    next[base] = { ...next[base], [key]: entry };

    if (page.endsWith("::en") || page === base) {
      next[base + "::en"] = { ...next[base + "::en"], [key]: entry };
      const kmTranslation = translateText(entry.value);
      next[base + "::km"] = {
        ...next[base + "::km"],
        [key]: { kind: "text", value: kmTranslation || entry.value },
      };
    } else if (page.endsWith("::km")) {
      next[base + "::km"] = { ...next[base + "::km"], [key]: entry };
      // Also update base and English so changes are overall!
      next[base + "::en"] = {
        ...next[base + "::en"],
        [key]: { kind: "text", value: entry.value },
      };
    }
  }

  return next;
}

export function linkedEntry(
  store: Store,
  page: string,
  language: "en" | "km",
  key: string,
): Entry | undefined {
  const base = page.replace(/::(en|km)$/, "");

  // Priority 1: Images are always universal across all languages!
  const img =
    store[base + "::" + language]?.[key]?.kind === "image"
      ? store[base + "::" + language]?.[key]
      : store[base + "::en"]?.[key]?.kind === "image"
        ? store[base + "::en"]?.[key]
        : store[base + "::km"]?.[key]?.kind === "image"
          ? store[base + "::km"]?.[key]
          : store[base]?.[key]?.kind === "image"
            ? store[base]?.[key]
            : undefined;
  if (img) return img;

  // Priority 2: Direct language-specific override
  const local = store[base + "::" + language]?.[key];
  if (local?.value) return local;

  // Priority 3: Cross-language override (if changed in other language, reflect overall!)
  const otherLang = language === "en" ? "km" : "en";
  const other = store[base + "::" + otherLang]?.[key] || store[base]?.[key];
  if (other?.kind === "text" && other.value) {
    if (language === "km" && otherLang === "en") {
      const translated = translateText(other.value);
      return { kind: "text", value: translated || other.value };
    }
    return other;
  }

  return undefined;
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
      if (before?.kind === after?.kind && before?.value === after?.value)
        continue;
      result[page] = { ...result[page] };
      if (after) result[page][key] = after;
      else delete result[page][key];
    }
  }
  return result;
}
