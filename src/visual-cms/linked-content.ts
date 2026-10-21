import { translateText } from "../lib/translation";
import type { Entry, Store } from "./VisualCms";

/** English owns text; an image has the same value in both languages. */
export function updateLinkedField(
  store: Store,
  page: string,
  key: string,
  entry: Entry,
): Store {
  const previous = store[page]?.[key];
  if (previous?.kind === entry.kind && previous.value === entry.value)
    return store;
  const next = { ...store, [page]: { ...store[page], [key]: entry } };
  const base = page.replace(/::(en|km)$/, "");
  if (entry.kind === "image") {
    next[base + "::en"] = { ...next[base + "::en"], [key]: entry };
    next[base + "::km"] = { ...next[base + "::km"] };
    delete next[base + "::km"][key];
  } else if (page.endsWith("::en")) {
    const space = base + "::km";
    next[space] = { ...next[space] };
    delete next[space][key];
  }
  return next;
}

export function linkedEntry(
  store: Store,
  page: string,
  language: "en" | "km",
  key: string,
): Entry | undefined {
  const english = store[page + "::en"]?.[key];
  const local = store[page + "::" + language]?.[key];
  if (english?.kind === "image") return english;
  if (local) return local;
  return english?.kind === "text" && language === "km"
    ? { kind: "text", value: translateText(english.value) }
    : english;
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
