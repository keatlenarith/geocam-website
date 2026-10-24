import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const libPath = path.resolve('src/lib/research-library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));
const outDir = path.resolve('public/images/publications');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Special page configs for papers with standout figures
const specialPages = {
  'web05': 3, // Figure 1: Tectonic divisions & mineralized belts of Cambodia
  'local-59a1797c08dd': 1, // Cover of Atlas of Mineral Resources of Cambodia
  'local-66f8249914c1': 1, // Cover of ESCAP Mineral Resources
  'local-8bebe58c338a': 1, // Gem corundum / ruby study
  'web14': 1, // ITC Eraget 2023 Cover
  'local-01750a847849': 1, // Mining Industry Report
  'web03': 1, // Laang Spean 100ka
  'web06': 1, // Mt Aoral Granite Geochronology
  'web07': 1, // Koh Moul Turtle Remains Stratigraphy
  'web09': 1, // Cambodian Cave Guidelines
  'web11': 1, // Last Glacial Maximum Laang Spean
  'web12': 1, // Prek Te Artisanal Mining Water Quality
  'local-213a3ea527c1': 1, // Kampot Fold Belt Cenozoic deformation
  'local-a338bebe6468': 1, // Cardamom Mts Paleomagnetism
  'local-fc48e0cb2be7': 1, // Palaeozoic & Mesozoic Tectonic Evolution
  'local-0b8d77d428bb': 1, // Quaternary of Cambodia
  'local-7d51b8053457': 1, // Udchachon et al. Suture in Cambodia
  'local-ff24c3346575': 1, // Two Magmatic Events in Southern Indochina
  'local-ecc9e413afdb': 1, // Tin Metallogenesis
  'local-c1465040ef54': 1, // Tethyan Metallogenesis
  'local-d8ad564a0e4c': 1, // Zircon Xenocrysts Basalts
};

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1200, height: 1600 } });
  const page = await context.newPage();

  console.log(`Starting publication figure extraction for ${lib.length} items...`);
  let successCount = 0;

  for (let i = 0; i < lib.length; i++) {
    const pub = lib[i];
    const docRelPath = pub.fileUrl || pub.pdfUrl;

    if (!docRelPath || !docRelPath.endsWith('.pdf')) {
      continue;
    }

    const localDocPath = path.resolve('public', docRelPath.replace(/^\//, ''));
    if (!fs.existsSync(localDocPath)) {
      console.warn(`[SKIP] Missing document for ${pub.id}: ${localDocPath}`);
      continue;
    }

    const pageNum = specialPages[pub.id] || 1;
    const fileUrl = pathToFileURL(localDocPath).href + `#page=${pageNum}`;
    const outPngPath = path.join(outDir, `${pub.id}.png`);

    try {
      await page.goto(fileUrl, { waitUntil: 'load', timeout: 15000 });
      // Allow PDF viewer time to render text & canvas
      await page.waitForTimeout(3000);

      // Crop inner page content cleanly (avoiding Edge viewer toolbars)
      await page.screenshot({
        path: outPngPath,
        clip: { x: 130, y: 38, width: 940, height: 750 }
      });

      pub.image = `/images/publications/${pub.id}.png`;
      console.log(`[OK] Generated figure for ${pub.id} (${pub.title.slice(0, 35)}...)`);
      successCount++;
    } catch (err) {
      console.error(`[ERR] Failed rendering ${pub.id}:`, err.message);
    }
  }

  await browser.close();
  console.log(`Finished extraction: ${successCount} figures generated.`);

  // Save updated research library
  fs.writeFileSync(libPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
  console.log('Updated src/lib/research-library.json with image references.');
}

main().catch(console.error);
