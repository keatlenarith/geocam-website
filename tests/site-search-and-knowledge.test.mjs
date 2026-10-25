import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

test("Site Search: buildSearchIndex and searchSite finds relevant items across whole website", async () => {
  const searchModule = await import("../src/lib/site-search.ts");
  const { searchSite, buildSearchIndex } = searchModule;

  const index = buildSearchIndex();
  assert.ok(index.length >= 50, `Expected at least 50 searchable items, got ${index.length}`);

  // 1. Keyword search for Tectonics
  const tectonicsResults = searchSite("Tectonics");
  assert.ok(tectonicsResults.length > 0, "Expected results for 'Tectonics'");
  assert.ok(
    tectonicsResults.some((r) => r.titleEn.toLowerCase().includes("tectonic") || r.category === "research"),
    "Expected research topic in Tectonics results"
  );

  // 2. Similar word / fuzzy search (e.g. typo 'tecton' or 'earthquak')
  const fuzzyResults = searchSite("earthquak");
  assert.ok(fuzzyResults.length > 0, "Expected fuzzy match for 'earthquak'");
  assert.ok(
    fuzzyResults.some((r) => r.titleEn.toLowerCase().includes("earthquake")),
    "Expected earthquake item in fuzzy results"
  );

  // 3. Khmer keyword search (e.g. 'រ៉ែ' or 'ទឹកក្រោមដី')
  const khmerResults = searchSite("ទឹកក្រោមដី");
  assert.ok(khmerResults.length > 0, "Expected results for Khmer keyword 'ទឹកក្រោមដី'");
  assert.ok(
    khmerResults.some((r) => r.titleKm.includes("ទឹកក្រោមដី") || r.descriptionKm.includes("ទឹកក្រោមដី")),
    "Expected hydrogeology item matching 'ទឹកក្រោមដី'"
  );

  // 4. Mining keyword search
  const miningResults = searchSite("copper exploration");
  assert.ok(miningResults.length > 0, "Expected results for 'copper exploration'");
  assert.ok(
    miningResults.some((r) => r.category === "mining" || r.category === "research"),
    "Expected mining or research category for copper exploration"
  );

  // 5. Lexicon search
  const lexiconResults = searchSite("Fault");
  assert.ok(lexiconResults.length > 0, "Expected lexicon result for 'Fault'");
  assert.ok(
    lexiconResults.some((r) => r.category === "lexicon"),
    "Expected lexicon category item for 'Fault'"
  );
});

test("Basic Knowledge: Page exists and is registered in Chrome navbar and main router", () => {
  const mainCode = fs.readFileSync(path.join(root, "src/main.tsx"), "utf8");
  assert.match(mainCode, /import BasicKnowledge from "\.\/routes\/basic-knowledge"/);
  assert.match(mainCode, /"\/basic-knowledge":\s*BasicKnowledge/);

  const chromeCode = fs.readFileSync(path.join(root, "src/components/site/Chrome.tsx"), "utf8");
  assert.match(chromeCode, /\/basic-knowledge/);
  assert.match(chromeCode, /basicKnowledge/);

  const basicKnowledgeCode = fs.readFileSync(path.join(root, "src/routes/basic-knowledge.tsx"), "utf8");
  assert.ok(basicKnowledgeCode.includes("Geoscience Basic Knowledge"), "English title in basic-knowledge");
  assert.ok(basicKnowledgeCode.includes("ចំណេះដឹងមូលដ្ឋានភូគព្ភសាស្ត្រ"), "Khmer title in basic-knowledge");
});

test("Article Reading Layout: Frameless TOC on left and Related Posts on right", () => {
  const researchTopicCode = fs.readFileSync(path.join(root, "src/routes/research-topic.tsx"), "utf8");

  // Left TOC
  assert.match(researchTopicCode, /<aside className="hidden lg:block sticky top-24 space-y-4 text-sm pr-2">/);
  assert.match(researchTopicCode, /Content:/);
  assert.match(researchTopicCode, /មាតិកា៖/);

  // Right Related Posts Panel
  assert.match(researchTopicCode, /<aside className="hidden xl:block sticky top-24 space-y-4 pl-2">/);
  assert.match(researchTopicCode, /Related Post\.\.\.\.\./);
  assert.match(researchTopicCode, /អត្ថបទពាក់ព័ន្ធ\.\.\.\.\./);

  // PublicPosts also equipped with 3 columns
  const publicPostsCode = fs.readFileSync(path.join(root, "src/admin/PublicPosts.tsx"), "utf8");
  assert.match(publicPostsCode, /grid-cols-1 lg:grid-cols-\[220px_minmax\(0,1fr\)\] xl:grid-cols-\[240px_minmax\(0,1fr\)_270px\]/);
  assert.match(publicPostsCode, /Content:/);
  assert.match(publicPostsCode, /Related Post\.\.\.\.\./);
});


test("Live Ticker & Knowledge Billboard: Rendered on home page with earthquakes, basic knowledge and events", () => {
  const indexCode = fs.readFileSync(path.join(root, "src/routes/index.tsx"), "utf8");
  assert.match(indexCode, /import \{ LiveTickerRibbon \} from "@/);
  assert.match(indexCode, /import \{ KnowledgeBillboard \} from "@/);
  assert.match(indexCode, /<LiveTickerRibbon \/>/);
  assert.match(indexCode, /<KnowledgeBillboard \/>/);

  const tickerCode = fs.readFileSync(path.join(root, "src/components/site/LiveTickerRibbon.tsx"), "utf8");
  assert.match(tickerCode, /LIVE TICKER/);
  assert.match(tickerCode, /បច្ចុប្បន្នភាព/);
  assert.match(tickerCode, /BASIC KNOWLEDGE/);
  assert.match(tickerCode, /ចំណេះដឹងមូលដ្ឋាន/);
  assert.match(tickerCode, /\/earthquake-monitoring/);
  assert.match(tickerCode, /\/basic-knowledge/);
  assert.match(tickerCode, /\/events/);

  const billboardCode = fs.readFileSync(path.join(root, "src/components/site/KnowledgeBillboard.tsx"), "utf8");
  assert.match(billboardCode, /FEATURED BASIC KNOWLEDGE/);
  assert.match(billboardCode, /ចំណេះដឹងមូលដ្ឋានពិសេស/);
  assert.match(billboardCode, /\/basic-knowledge/);

  const css = fs.readFileSync(path.join(root, "src/styles.css"), "utf8");
  assert.match(css, /gc-ticker-track/);
  assert.match(css, /gc-ticker-scroll/);
});
