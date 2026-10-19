type SearchablePublication = { topic: string; title: string; tags: string[]; abstract: string };

const researchTerms: Record<string, RegExp> = {
  Tectonics: /tectonic|suture|fold belt|basin|indochina/i,
  "Mineral deposits": /mineraliz|mineralis|metallogen|gold|copper|rubies|gemstone|mineral resources/i,
  Geochemistry: /geochem|arsenic|weathering|petrogenesis|isotop|zircon/i,
  Geophysics: /geophys|airborne|magnetic|paleomagn|palaeomagn|seismic|resistiv|gravity/i,
  Geohazards: /hazard|landslide|erosion|subsiden|collapse/i,
};

export function matchesResearchArea(publication: SearchablePublication, area: string | null): boolean {
  if (!area) return false;
  if (publication.topic === area) return true;
  return researchTerms[area]?.test([publication.title, publication.topic, ...publication.tags, publication.abstract].join(" ")) ?? false;
}
