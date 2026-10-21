import { translateText } from "../lib/translation";
import type { Entry, Store } from "./VisualCms";

/** English is the source; Khmer overrides are translations, never English content. */
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
  if (previous?.kind === entry.kind && previous.value === entry.value)
    return store;
  const next: Store = { ...store, [space]: { ...store[space], [key]: entry } };
  if (entry.kind === "image") {
    for (const other of [base, base + "::km"]) {
      next[other] = { ...next[other] };
      delete next[other][key];
    }
  } else if (space.endsWith("::en")) {
    next[base + "::km"] = { ...next[base + "::km"] };
    delete next[base + "::km"][key];
    if (next[base]?.[key]) {
      next[base] = { ...next[base] };
      delete next[base][key];
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
  const english = store[base + "::en"]?.[key] || store[base]?.[key];
  if (english?.kind === "image") return english;
  const local = store[base + "::" + language]?.[key];
  if (local) return local;
  return english?.kind === "text" && language === "km"
    ? { ...english, value: translateText(english.value) }
    : english;
}

/** Publish changed page fields only; Appearance approval is a separate action. */
export function pageChanges(draft: Store, published: Store) {
  const changes: Record<string, Record<string, Entry | null>> = {};
  for (const page of new Set([
    ...Object.keys(draft),
    ...Object.keys(published),
  ])) {
    if (page.startsWith("__")) continue;
    for (const key of new Set([
      ...Object.keys(draft[page] || {}),
      ...Object.keys(published[page] || {}),
    ])) {
      const before = published[page]?.[key],
        after = draft[page]?.[key];
      if (before?.kind === after?.kind && before?.value === after?.value)
        continue;
      (changes[page] ||= {})[key] = after || null;
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
      if (before?.kind === after?.kind && before?.value === after?.value)
        continue;
      result[page] = { ...result[page] };
      if (after) result[page][key] = after;
      else delete result[page][key];
    }
  }
  return result;
}
