import test from "node:test";
import assert from "node:assert/strict";
import { researchAreas } from "../src/lib/data.ts";
import { FOCUS_TOPICS, getTopicByIdOrSlug } from "../src/features/research/focus-topics-data.ts";
import { matchesResearchArea } from "../src/lib/publication-search.ts";

test("researchAreas includes 7 core disciplines including Environmental Hydrogeology and Marine Geology", () => {
  assert.equal(researchAreas.length, 7);
  const keys = researchAreas.map((r) => r.key);
  assert.ok(keys.includes("Environmental Hydrogeology"));
  assert.ok(keys.includes("Marine Geology"));
  assert.ok(keys.includes("Tectonics"));
  assert.ok(keys.includes("Mineral deposits"));
  assert.ok(keys.includes("Geochemistry"));
  assert.ok(keys.includes("Geophysics"));
  assert.ok(keys.includes("Geohazards"));

  for (const area of researchAreas) {
    assert.ok(area.km, `Khmer label missing for ${area.key}`);
    assert.ok(area.text, `English description missing for ${area.key}`);
    assert.ok(area.textKm, `Khmer description missing for ${area.key}`);
    assert.ok(area.image, `Image path missing for ${area.key}`);
  }
});

test("FOCUS_TOPICS contains full models for Environmental Hydrogeology and Marine Geology", () => {
  assert.equal(FOCUS_TOPICS.length, 7);

  const hydro = getTopicByIdOrSlug("Environmental Hydrogeology");
  assert.ok(hydro, "Environmental Hydrogeology topic found");
  assert.equal(hydro.id, "environmental-hydrogeology");
  assert.equal(hydro.shortTitleKm, "ជលភូគព្ភសាស្ត្របរិស្ថាន");
  assert.ok(hydro.sections.length >= 7, "Environmental Hydrogeology has rich sections");
  assert.ok(hydro.sections.some((s) => s.table !== undefined), "Has hydrostratigraphy table");
  assert.ok(hydro.stats.length >= 4, "Has telemetry stats");

  const marine = getTopicByIdOrSlug("Marine Geology");
  assert.ok(marine, "Marine Geology topic found");
  assert.equal(marine.id, "marine-geology");
  assert.equal(marine.shortTitleKm, "ភូគព្ភសាស្ត្រសមុទ្រ");
  assert.ok(marine.sections.length >= 7, "Marine Geology has rich sections");
  assert.ok(marine.sections.some((s) => s.table !== undefined), "Has offshore stratigraphy table");
  assert.ok(marine.stats.length >= 4, "Has telemetry stats");
});

test("matchesResearchArea resolves publications for new disciplines", () => {
  const dummyHydroPub = {
    topic: "Environmental Hydrogeology",
    title: "Groundwater resources and arsenic mobility in Mekong alluvium",
    tags: ["hydrogeology", "aquifer", "drinking water"],
    abstract: "Study on shallow aquifer contamination.",
  };
  assert.ok(matchesResearchArea(dummyHydroPub, "Environmental Hydrogeology"));

  const dummyMarinePub = {
    topic: "Marine Geology",
    title: "Cenozoic inversion of offshore Khmer Basin in Gulf of Thailand",
    tags: ["marine", "seismic", "basin"],
    abstract: "Offshore exploration profiles.",
  };
  assert.ok(matchesResearchArea(dummyMarinePub, "Marine Geology"));
});

test("No Thai or Lao characters in focus topic definitions", () => {
  const thaiLaoRegex = /[\u0E00-\u0E7F\u0E80-\u0EFF]/;
  for (const topic of FOCUS_TOPICS) {
    const textDump = JSON.stringify(topic);
    assert.equal(
      thaiLaoRegex.test(textDump),
      false,
      `Topic ${topic.id} contains forbidden Thai or Lao characters!`
    );
  }
});
