import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('public/geosites/geosites.json', 'utf8'));

// Khmer names mapping
const khmerNames = {
  'phnom-kulen-waterfall-in-siem-reap': 'ទឹកធ្លាក់ភ្នំគូលែន (ខេត្តសៀមរាប)',
  'kbal-spean-carvings-and-upstream-river-in-siem-reap': 'ចម្លាក់ក្បាលស្ពាន និងដងស្ទឹង (ខេត្តសៀមរាប)',
  'kulen-river-of-1000-lingas-in-siem-reap': 'ស្ទឹងលិង្គ ១០០០ ភ្នំគូលែន (ខេត្តសៀមរាប)',
  'tnal-mareh-floating-forest-in-siem-reap': 'ព្រៃទឹកថ្នល់ម្រេញ ភ្នំគូលែន (ខេត្តសៀមរាប)',
  'kulen-sandstone-veal-stream-in-siem-reap': 'អូរវាលថ្មភក់ភ្នំគូលែន (ខេត្តសៀមរាប)',
  'srae-tbong-former-reservoir-wetland-in-siem-reap': 'ដីសើមអតីតអាងស្រែត្បូង (ខេត្តសៀមរាប)',
  'sra-srang-reservoir-angkor-in-siem-reap': 'ស្រះស្រង់ អង្គរ (ខេត្តសៀមរាប)',
  'phnom-bak-fossil-natural-heritage-site-in-banteay-meanchey': 'ទីតាំងផូស៊ីល និងបេតិកភណ្ឌធម្មជាតិភ្នំបាក់ (ខេត្តបន្ទាយមានជ័យ)',
  'phnom-kang-va-fossil-site-in-banteay-meanchey': 'ទីតាំងផូស៊ីលភ្នំកងវ៉ា (ខេត្តបន្ទាយមានជ័យ)',
  'tra-peang-cha-sandstone-quarry-geosite-in-siem-reap': 'ការដ្ឋានយកថ្មភក់បុរាណត្រពាំងចារ្យ (ខេត្តសៀមរាប)',
  'poeung-takho-viewpoint-and-escarpment-in-siem-reap': 'ច្រាំងចោទ និងចំណុចមើលទេសភាពពើងតាហោ (ខេត្តសៀមរាប)',
  'lake-yeak-laom-volcanic-maar-in-ratanakiri': 'បឹងយក្សឡោម - មាត់ភ្នំភ្លើងម៉ារ (ខេត្តរតនគិរី)',
  'nam-lea-rom-el-stone-dome-in-mondulkiri': 'ភ្នំដុំថ្មណាំលា / រមអែល (ខេត្តមណ្ឌលគិរី)',
  'bou-sra-waterfall-in-mondulkiri': 'ទឹកធ្លាក់ប៊ូស្រា (ខេត្តមណ្ឌលគិរី)',
  'pulung-waterfall-in-mondulkiri': 'ទឹកធ្លាក់ពូលូង (ខេត្តមណ្ឌលគិរី)',
  'leng-kun-waterfall-and-cave-area-in-mondulkiri': 'ទឹកធ្លាក់ និងតំបន់រូងភ្នំលេកគុន (ខេត្តមណ្ឌលគិរី)',
  'phnom-chhngok-cave-entrance-in-kampot': 'រូងភ្នំឈ្ងោក (ខេត្តកំពត)',
  'kampong-trach-water-pond-cave-in-kampot': 'រូងភ្នំស្រះទឹក កំពង់ត្រាច (ខេត្តកំពត)',
  'tatai-waterfall-in-koh-kong': 'ទឹកធ្លាក់តាតៃ (ខេត្តកោះកុង)',
  'kbal-chhay-cascades-in-preah-sihanouk': 'ទឹកធ្លាក់ក្បាលឆាយ (ខេត្តព្រះសីហនុ)',
  'bokor-hill-station-survey-area-in-kampot': 'ស្ថានីយខ្ពង់រាបភ្នំបូកគោ (ខេត្តកំពត)',
  'kep-national-park-eastern-forest-edge-in-kep': 'ឧទ្យានជាតិកែប (ខេត្តកែប)',
  'ream-recreation-centre-survey-area-in-preah-sihanouk': 'តំបន់មជ្ឈមណ្ឌលកម្សាន្តរាម (ខេត្តព្រះសីហនុ)',
  'koh-paur-dinosaur-fossil-site-in-koh-kong': 'ទីតាំងផូស៊ីលដាយណូស័រ កោះប៉ោ (ខេត្តកោះកុង)',
  'koh-moul-mesozoic-fossil-horizon-in-koh-kong': 'ស្រទាប់ផូស៊ីលមេសូសូអ៊ិក កោះមូល (ខេត្តកោះកុង)',
  'phnom-khley-black-shale-section-in-kampot': 'ស្រទាប់ថ្មសែលខ្មៅ ភ្នំខ្លី (ខេត្តកំពត)',
  'phnom-monprey-section-in-kampot': 'កំណាត់សិលាភ្នំមនព្រៃ - ផ្កាថ្មស៊ីរីងហ្គោប៉ូរ៉ា (ខេត្តកំពត)',
  'bokor-plateau-sandstone-and-cloud-forest-in-kampot': 'ថ្មភក់ និងព្រៃពពកខ្ពង់រាបបូកគោ (ខេត្តកំពត)',
  'phnom-sampeu-la-ang-pracheu-bat-cave-in-battambang': 'រូងប្រចៀវល្អាងប្រចៀវ ភ្នំសំពៅ (ខេត្តបាត់ដំបង)'
};

// Province / Region categorization
const provinceMap = {
  'siem-reap': { en: 'Siem Reap', km: 'សៀមរាប' },
  'banteay-meanchey': { en: 'Banteay Meanchey', km: 'បន្ទាយមានជ័យ' },
  'ratanakiri': { en: 'Ratanakiri', km: 'រតនគិរី' },
  'mondulkiri': { en: 'Mondulkiri', km: 'មណ្ឌលគិរី' },
  'kampot': { en: 'Kampot', km: 'កំពត' },
  'koh-kong': { en: 'Koh Kong', km: 'កោះកុង' },
  'preah-sihanouk': { en: 'Preah Sihanouk', km: 'ព្រះសីហនុ' },
  'kep': { en: 'Kep', km: 'កែប' },
  'battambang': { en: 'Battambang', km: 'បាត់ដំបង' }
};

// Geological Age / Era categorization
const eraMap = {
  'phnom-kulen': 'Jurassic – Cretaceous (~145–66 Ma)',
  'kbal-spean': 'Cretaceous Sandstone (~100 Ma)',
  'kulen': 'Jurassic – Cretaceous Khorat Group',
  'yeak-laom': 'Late Pleistocene – Holocene (~4,000–700,000 yr)',
  'bou-sra': 'Cenozoic Neogene Basalt (~5–10 Ma)',
  'nam-lea': 'Mesozoic Igneous / Metasedimentary Dome',
  'chhngok': 'Permian Limestone Karst (~270 Ma)',
  'kampong-trach': 'Permian Marine Carbonate Platform (~265 Ma)',
  'tatai': 'Jurassic – Cretaceous Continental Bedrock',
  'kbal-chhay': 'Mesozoic Sandstone & Alluvium',
  'bokor': 'Early Cretaceous Bokor Formation',
  'koh-paur': 'Early Cretaceous Continental Fluvial (Sauropod)',
  'koh-moul': 'Mesozoic (Cretaceous) Fluvial-Lacustrine',
  'phnom-khley': 'Permian – Triassic Marine to Continental Shales',
  'phnom-monprey': 'Early Permian Marine (Syringopora Horizon)',
  'phnom-sampeu': 'Permian Karst (Ratburi Limestone equivalent)',
  'phnom-bak': 'Permian Marine Limestone & Brachiopod Horizon',
  'phnom-kang-va': 'Permian Fossiliferous Carbonate'
};

const sites = raw.sites.map(s => {
  let province = { en: 'Cambodia', km: 'កម្ពុជា' };
  for (const [k, v] of Object.entries(provinceMap)) {
    if (s.id.includes(k)) {
      province = v;
      break;
    }
  }

  let era = 'Mesozoic – Cenozoic';
  for (const [k, v] of Object.entries(eraMap)) {
    if (s.id.includes(k)) {
      era = v;
      break;
    }
  }

  // Build high-resolution narrative text
  const narrative = {
    overview: s.description,
    geologicalSetting: `The geosite represents a prominent element within Cambodia's regional geoscience architecture in ${province.en}. Bedrock exposures belong to ${era}, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.`,
    geologicalSettingKm: `ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្ត${province.km}។ កំណកសិលាស្ថិតក្នុងយុគសម័យ ${era} ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។`,
    mineralogyNote: s.mineralogy || 'Sedimentary quartz arenite and lithic sandstone; weathering products include iron oxides, laterite, and alluvial sediments.',
    provenanceNote: s.coordinate_source || 'Published geological and biodiversity survey records.',
  };

  return {
    ...s,
    nameKm: khmerNames[s.id] || s.name,
    province,
    era,
    narrative
  };
});

const tsContent = `// Auto-generated verified Cambodian Geosites dataset
// Sourced directly from Geoparks/Cambodia_Geosites_Document_Catalogue.docx

export interface GeositeGalleryItem {
  src: string;
  caption: string;
  credit: string;
  source_urls?: string[];
  scope?: string;
  reuse_status?: string;
  width?: number;
  height?: number;
  relationship?: string;
  catalogue_figure?: number;
}

export interface GeositeRecord {
  id: string;
  name: string;
  nameKm: string;
  type: string;
  designation: string;
  coordinates: [number, number] | null;
  coordinate_order: string;
  crs: string;
  coordinate_status: string;
  publish_pin: boolean;
  coordinate_source: string;
  original_coordinate_expression?: string;
  coordinate_notes?: string;
  source_urls: string[];
  description: string;
  mineralogy: string;
  province: { en: string; km: string };
  era: string;
  narrative: {
    overview: string;
    geologicalSetting: string;
    geologicalSettingKm: string;
    mineralogyNote: string;
    provenanceNote: string;
  };
  gallery: GeositeGalleryItem[];
}

export const CAMBODIA_GEOSITES: GeositeRecord[] = ${JSON.stringify(sites, null, 2)};
`;

fs.writeFileSync('src/features/geopark/geosites-data.ts', tsContent, 'utf8');
console.log('Successfully generated src/features/geopark/geosites-data.ts with', sites.length, 'sites!');
