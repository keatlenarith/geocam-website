import { translateText } from "../lib/translation";
import type { Entry, Store } from "./VisualCms";

/**
 * Universal EN <-> KM Content & Image Synchronization Engine:
 * - Any image/photo changed on ANY page in ANY language automatically updates BOTH languages.
 * - Text updates in English automatically update Khmer unless manually customized.
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
  } else if (page.endsWith("::en") || page === base) {
    next[base + "::en"] = { ...next[base + "::en"], [key]: entry };
    next[base] = { ...next[base], [key]: entry };
    // Synchronize Khmer translation automatically
    const kmKey = base + "::km";
    next[kmKey] = {
      ...next[kmKey],
      [key]: { kind: "text", value: translateText(entry.value) },
    };
  } else if (page.endsWith("::km")) {
    next[base + "::km"] = { ...next[base + "::km"], [key]: entry };
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

  // Priority 1: If an image exists in either language or base, use it across both!
  const img =
    store[base + "::" + language]?.[key]?.kind === "image"
      ? store[base + "::" + language]?.[key]
      : store[base + "::en"]?.[key]?.kind === "image"
        ? store[base + "::en"]?.[key]
        : store[base]?.[key]?.kind === "image"
          ? store[base]?.[key]
          : undefined;
  if (img) return img;

  // Priority 2: Direct language-specific override
  const local = store[base + "::" + language]?.[key];
  if (local) return local;

  // Priority 3: Fallback with auto-translation
  const english = store[base + "::en"]?.[key] || store[base]?.[key];
  if (english?.kind === "text") {
    return language === "km"
      ? { kind: "text", value: translateText(english.value) }
      : english;
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
