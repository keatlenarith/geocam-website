import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("event-service operations: get, add, update, delete, reset", async () => {
  // Mock localStorage and window in node environment
  const storage = new Map();
  globalThis.localStorage = {
    getItem: (k) => storage.get(k) ?? null,
    setItem: (k, v) => storage.set(k, String(v)),
    removeItem: (k) => storage.delete(k),
    clear: () => storage.clear(),
  };
  let dispatchedEvents = [];
  globalThis.window = {
    dispatchEvent: (ev) => dispatchedEvents.push(ev),
  };
  globalThis.CustomEvent = class CustomEvent {
    constructor(type, init) {
      this.type = type;
      this.detail = init?.detail;
    }
  };

  const {
    getStoredEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    resetStoredEvents,
    EVENTS_STORAGE_KEY,
  } = await import("../src/lib/event-service.ts");

  // 1. Initial read returns baseline seed events
  const initial = getStoredEvents();
  assert.ok(Array.isArray(initial));
  assert.ok(initial.length >= 4, "Should have baseline seed events");

  // 2. Add event
  const newEv = {
    id: "test-ev-1",
    title: "Mekong Delta Hydrogeology Field Excursion",
    titleKm: "ដំណើរសិក្សាទីវាលជលភូគព្ភសាស្ត្រទំនាបទន្លេមេគង្គ",
    date: "2027-03-15",
    place: "Kandal & Prey Veng",
    placeKm: "ខេត្តកណ្តាល និងព្រៃវែង",
    kind: "Field trip",
    kindKm: "ការងារទីវាល",
    status: "published",
  };

  const afterAdd = addEvent(newEv);
  assert.equal(afterAdd[0].id, "test-ev-1");
  assert.equal(afterAdd.length, initial.length + 1);
  assert.ok(storage.has(EVENTS_STORAGE_KEY));

  // 3. Update event
  const afterUpdate = updateEvent("test-ev-1", {
    title: "Updated Mekong Delta & Coastal Hydrogeology Excursion",
    date: "2027-03-20",
    place: "Kandal, Prey Veng & Kampot",
  });
  const updatedItem = afterUpdate.find((e) => e.id === "test-ev-1");
  assert.ok(updatedItem);
  assert.equal(updatedItem.title, "Updated Mekong Delta & Coastal Hydrogeology Excursion");
  assert.equal(updatedItem.date, "2027-03-20");
  assert.equal(updatedItem.place, "Kandal, Prey Veng & Kampot");

  // 4. Delete event
  const afterDelete = deleteEvent("test-ev-1");
  assert.equal(afterDelete.length, initial.length);
  assert.equal(afterDelete.find((e) => e.id === "test-ev-1"), undefined);

  // 5. Reset to defaults
  const afterReset = resetStoredEvents();
  assert.equal(afterReset.length, initial.length);
  assert.ok(!storage.has(EVENTS_STORAGE_KEY));
});

test("WordPressAdmin includes Events Edit and Delete tools, modals, and actions", () => {
  const adminCode = readFileSync(
    new URL("../src/admin/WordPressAdmin.tsx", import.meta.url),
    "utf8"
  );

  // Verify Event handlers in WordPressAdmin
  assert.ok(adminCode.includes("handleStartEditEvent"), "Must have handleStartEditEvent");
  assert.ok(adminCode.includes("handleSaveEditEvent"), "Must have handleSaveEditEvent");
  assert.ok(adminCode.includes("setEventToDelete"), "Must have setEventToDelete");
  assert.ok(adminCode.includes("handleExecuteDeleteEvent"), "Must have handleExecuteDeleteEvent");
  assert.ok(adminCode.includes("setShowResetEventsConfirm"), "Must have setShowResetEventsConfirm");
  assert.ok(adminCode.includes("handleExecuteResetEvents"), "Must have handleExecuteResetEvents");

  // Verify UI buttons in Events table actions
  assert.ok(adminCode.includes("handleStartEditEvent(ev)"), "Must bind Edit button to handleStartEditEvent");
  assert.ok(adminCode.includes("setEventToDelete(ev)"), "Must bind Delete button to setEventToDelete");
  assert.ok(adminCode.includes("setShowResetEventsConfirm(true)"), "Must bind Reset to Defaults button");

  // Verify Edit Event Modal exists
  assert.ok(adminCode.includes("Edit Event / កែប្រែព័ត៌មានព្រឹត្តិការណ៍"), "Must have edit event modal title");
  assert.ok(adminCode.includes("handleSaveEditEvent"), "Must have Save Changes handler");

  // Verify Delete Event Confirmation Modal exists
  assert.ok(adminCode.includes("Delete Event / លុបព្រឹត្តិការណ៍"), "Must have delete event modal title");
  assert.ok(adminCode.includes("handleExecuteDeleteEvent"), "Must have Delete Permanently handler");

  // Verify 0% Thai/Lao characters
  const thaiLaoRegex = /[\u0E00-\u0E7F\u0E80-\u0EFF]/;
  assert.ok(!thaiLaoRegex.test(adminCode), "Must have 0% Thai or Lao characters");
});

test("public routes sync with stored events", () => {
  const eventsRoute = readFileSync(
    new URL("../src/routes/events.tsx", import.meta.url),
    "utf8"
  );
  assert.ok(eventsRoute.includes("getStoredEvents"), "Events route must import getStoredEvents");
  assert.ok(eventsRoute.includes("geocam_events_changed"), "Events route must listen to geocam_events_changed");

  const homeRoute = readFileSync(
    new URL("../src/routes/index.tsx", import.meta.url),
    "utf8"
  );
  assert.ok(homeRoute.includes("getStoredEvents"), "Home route must import getStoredEvents");
  assert.ok(homeRoute.includes("geocam_events_changed"), "Home route must listen to geocam_events_changed");

  const dashRoute = readFileSync(
    new URL("../src/routes/dashboard.tsx", import.meta.url),
    "utf8"
  );
  assert.ok(dashRoute.includes("getStoredEvents"), "Dashboard route must import getStoredEvents");
});
