import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("publication-service operations: get, add, update, delete, reset", async () => {
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
    getStoredPublications,
    addPublication,
    updatePublication,
    deletePublication,
    resetStoredPublications,
    PAPERS_STORAGE_KEY,
  } = await import("../src/lib/publication-service.ts");

  // 1. Initial read returns baseline research library
  const initial = getStoredPublications();
  assert.ok(Array.isArray(initial));
  assert.ok(initial.length >= 45, "Should have 45+ seed publications");

  // 2. Add paper
  const newPaper = {
    id: "test-pub-123",
    title: "Marine and Environmental Hydrogeology of Gulf of Thailand",
    authors: "Sok K., Keo M.",
    year: 2026,
    topic: "Marine Geology",
    journal: "Cambodia Geosciences Journal",
    abstract: "Test abstract for publication management.",
    publicationType: "Journal Article",
    scope: "National",
    origin: "GeoCam Library",
    metadataVerified: true,
    tags: ["Marine Geology", "Cambodia"],
  };

  const afterAdd = addPublication(newPaper);
  assert.equal(afterAdd[0].id, "test-pub-123");
  assert.equal(afterAdd.length, initial.length + 1);
  assert.ok(storage.has(PAPERS_STORAGE_KEY));

  // 3. Update paper
  const afterUpdate = updatePublication("test-pub-123", {
    title: "Updated Hydrogeology of Gulf of Thailand Basin",
    year: 2027,
    doi: "10.1016/j.test.2026.01",
  });
  const updatedItem = afterUpdate.find((p) => p.id === "test-pub-123");
  assert.ok(updatedItem);
  assert.equal(updatedItem.title, "Updated Hydrogeology of Gulf of Thailand Basin");
  assert.equal(updatedItem.year, 2027);
  assert.equal(updatedItem.doi, "10.1016/j.test.2026.01");

  // 4. Delete paper
  const afterDelete = deletePublication("test-pub-123");
  assert.equal(afterDelete.length, initial.length);
  assert.equal(afterDelete.find((p) => p.id === "test-pub-123"), undefined);

  // 5. Reset to defaults
  const afterReset = resetStoredPublications();
  assert.equal(afterReset.length, initial.length);
  assert.ok(!storage.has(PAPERS_STORAGE_KEY));
});

test("WordPressAdmin includes Edit and Delete tools, modals, and publication categories", () => {
  const adminCode = readFileSync(
    new URL("../src/admin/WordPressAdmin.tsx", import.meta.url),
    "utf8"
  );

  // Verify Edit and Delete tools in table actions
  assert.ok(adminCode.includes("handleStartEdit"), "Must have handleStartEdit");
  assert.ok(adminCode.includes("handleSaveEdit"), "Must have handleSaveEdit");
  assert.ok(adminCode.includes("setPaperToDelete"), "Must have setPaperToDelete");
  assert.ok(adminCode.includes("handleExecuteDelete"), "Must have handleExecuteDelete");
  assert.ok(adminCode.includes("setShowResetConfirm"), "Must have setShowResetConfirm");
  assert.ok(adminCode.includes("handleExecuteReset"), "Must have handleExecuteReset");

  // Verify UI buttons in actions
  assert.ok(adminCode.includes("<Edit size={12} />"), "Must render Edit button with icon");
  assert.ok(adminCode.includes("<Trash2 size={12} />"), "Must render Delete button with icon");
  assert.ok(adminCode.includes("Reset to Defaults"), "Must render Reset to Defaults button");

  // Verify Edit Modal exists
  assert.ok(adminCode.includes("Edit Research Publication"), "Must have edit modal title");
  assert.ok(adminCode.includes("Save Changes"), "Must have Save Changes button");

  // Verify Delete Confirmation Modal exists
  assert.ok(adminCode.includes("Delete Publication"), "Must have delete modal title");
  assert.ok(adminCode.includes("Delete Permanently"), "Must have Delete Permanently button");

  // Verify newly added focus categories in publicationCategories
  assert.ok(adminCode.includes('"Environmental Hydrogeology"'), "Must include Environmental Hydrogeology");
  assert.ok(adminCode.includes('"Marine Geology"'), "Must include Marine Geology");

  // Verify 0% Thai/Lao characters
  const thaiLaoRegex = /[\u0E00-\u0E7F\u0E80-\u0EFF]/;
  assert.ok(!thaiLaoRegex.test(adminCode), "Must have 0% Thai or Lao characters");
});

test("public routes sync with stored publications", () => {
  const pubsRoute = readFileSync(
    new URL("../src/routes/publications.tsx", import.meta.url),
    "utf8"
  );
  assert.ok(pubsRoute.includes("getStoredPublications"), "Public publications route must import getStoredPublications");
  assert.ok(pubsRoute.includes("geocam_publications_changed"), "Public publications route must listen to geocam_publications_changed");

  const viewRoute = readFileSync(
    new URL("../src/routes/publication-view.tsx", import.meta.url),
    "utf8"
  );
  assert.ok(viewRoute.includes("getStoredPublications"), "Publication view route must import getStoredPublications");
  assert.ok(viewRoute.includes("edit="), "Publication view route must link to admin with edit parameter");
});
