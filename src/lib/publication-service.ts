import type { Publication } from "./data";
import researchLibrary from "./research-library.json" with { type: "json" };

export const PAPERS_STORAGE_KEY = "geocam_papers_library";
export const CUSTOM_PAPERS_STORAGE_KEY = "geocam_custom_papers";

export function getStoredPublications(): Publication[] {
  if (typeof window === "undefined") {
    return researchLibrary as Publication[];
  }
  try {
    const saved = localStorage.getItem(PAPERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    const custom = localStorage.getItem(CUSTOM_PAPERS_STORAGE_KEY);
    if (custom) {
      const parsedCustom = JSON.parse(custom);
      if (Array.isArray(parsedCustom)) {
        return [...parsedCustom, ...(researchLibrary as Publication[])];
      }
    }
  } catch (err) {
    console.warn("Failed to read publications from localStorage:", err);
  }
  return researchLibrary as Publication[];
}

export function saveStoredPublications(papers: Publication[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(papers));
    window.dispatchEvent(
      new CustomEvent("geocam_publications_changed", { detail: papers }),
    );
  } catch (err) {
    console.error("Failed to save publications to localStorage:", err);
  }
}

export function resetStoredPublications(): Publication[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PAPERS_STORAGE_KEY);
    localStorage.removeItem(CUSTOM_PAPERS_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent("geocam_publications_changed", {
        detail: researchLibrary,
      }),
    );
  }
  return researchLibrary as Publication[];
}

export function updatePublication(
  id: string,
  updatedFields: Partial<Publication>,
): Publication[] {
  const current = getStoredPublications();
  const next = current.map((p) => {
    if (p.id === id) {
      return { ...p, ...updatedFields };
    }
    return p;
  });
  saveStoredPublications(next);
  return next;
}

export function deletePublication(id: string): Publication[] {
  const current = getStoredPublications();
  const next = current.filter((p) => p.id !== id);
  saveStoredPublications(next);
  return next;
}

export function addPublication(paper: Publication): Publication[] {
  const current = getStoredPublications();
  const next = [paper, ...current];
  saveStoredPublications(next);
  return next;
}
