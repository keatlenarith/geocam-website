import { events as seedEvents, type EventItem } from "./data.ts";

export const EVENTS_STORAGE_KEY = "geocam_events_roster";

export function getStoredEvents(): EventItem[] {
  if (typeof window === "undefined") {
    return seedEvents;
  }
  try {
    const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to read events from localStorage:", err);
  }
  return seedEvents;
}

export function saveStoredEvents(items: EventItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent("geocam_events_changed", { detail: items }),
    );
  } catch (err) {
    console.error("Failed to save events to localStorage:", err);
  }
}

export function resetStoredEvents(): EventItem[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(EVENTS_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent("geocam_events_changed", { detail: seedEvents }),
    );
  }
  return seedEvents;
}

export function addEvent(event: EventItem): EventItem[] {
  const current = getStoredEvents();
  const next = [event, ...current];
  saveStoredEvents(next);
  return next;
}

export function updateEvent(
  id: string,
  updatedFields: Partial<EventItem>,
): EventItem[] {
  const current = getStoredEvents();
  const next = current.map((e) => {
    if (e.id === id) {
      return { ...e, ...updatedFields };
    }
    return e;
  });
  saveStoredEvents(next);
  return next;
}

export function deleteEvent(id: string): EventItem[] {
  const current = getStoredEvents();
  const next = current.filter((e) => e.id !== id);
  saveStoredEvents(next);
  return next;
}
