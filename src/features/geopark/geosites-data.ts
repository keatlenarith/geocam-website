// Auto-generated verified Cambodian Geosites dataset
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

export const CAMBODIA_GEOSITES: GeositeRecord[] = [
  {
    "id": "phnom-kulen-waterfall-in-siem-reap",
    "name": "Phnom Kulen waterfall in Siem Reap",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.107,
      13.5685
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Calculated midpoint of published survey coordinate range. Source: Kosterin & Smith 2020, p.111, Locality 8.",
    "original_coordinate_expression": "Original coordinate expression: 13.568–569 N; 104.106–108 E.",
    "coordinate_notes": "Area reference, not exact waterfall lip or entrance.",
    "source_urls": [
      "https://dragonflyfund.org/en/idf-report-154-2020-english/"
    ],
    "description": "Bedded sandstone forms the ledge and waterfall on Phnom Kulen. The plateau links sedimentary geology, forest water catchments and cultural heritage. The marker represents the surveyed waterfall area.",
    "mineralogy": "Sandstone; quartz-rich sandstone documented regionally",
    "gallery": [
      {
        "src": "images/figure-10-1.webp",
        "caption": "Figure 10. Phnom Kulen waterfall under contrasting water conditions.",
        "credit": "Source: Kosterin & Smith (2020), Odonata of Phnom Kulen Mts, IDF-Report 154, 99–184, Figure 6, PDF page 104. Credit: Oleg E. Kosterin; Kosterin & Smith 2020, Figure 6.",
        "source_urls": [
          "https://dragonflyfund.org/en/idf-report-154-2020-english/"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 426,
        "height": 602,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 10
      },
      {
        "src": "images/figure-55-1.webp",
        "caption": "Figure 55. The Kulen waterfall, the plateau’s main visitor attraction for swimming and picnics.",
        "credit": "Source: Ministry of Environment (2017), Phnom Kulen National Park Management Program 2018–2027, back cover photograph [D46].",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1350,
        "height": 1800,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 55
      },
      {
        "src": "images/figure-04-1.webp",
        "caption": "Figure 4. Published geological map and sandstone sampling sites in Kulen.",
        "credit": "Source: Choon et al. (2022), Techno-Science Research Journal 10(2), 8–16, Figure 1, PDF page 2. Credit: Choon et al. 2022, Figure 1.",
        "source_urls": [
          "https://techno-srj.itc.edu.kh/public/journal/document/2.pdf"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 681,
        "height": 477,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 4
      },
      {
        "src": "images/figure-01-1.webp",
        "caption": "Figure 1. Published archaeological map of Greater Angkor and Phnom Kulen.",
        "credit": "Source: Chevance et al. (2019), Antiquity 93, 1303–1321, Figure 1, PDF page 2. Credit: Chevance et al. 2019, Figure 1; CC BY 4.0.",
        "source_urls": [
          "https://doi.org/10.15184/aqy.2019.133"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1135,
        "height": 766,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 1
      }
    ],
    "nameKm": "ទឹកធ្លាក់ភ្នំគូលែន (ខេត្តសៀមរាប)",
    "province": {
      "en": "Siem Reap",
      "km": "សៀមរាប"
    },
    "era": "Jurassic – Cretaceous (~145–66 Ma)",
    "narrative": {
      "overview": "Bedded sandstone forms the ledge and waterfall on Phnom Kulen. The plateau links sedimentary geology, forest water catchments and cultural heritage. The marker represents the surveyed waterfall area.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Siem Reap. Bedrock exposures belong to Jurassic – Cretaceous (~145–66 Ma), recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តសៀមរាប។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Jurassic – Cretaceous (~145–66 Ma) ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Sandstone; quartz-rich sandstone documented regionally",
      "provenanceNote": "Basis: Calculated midpoint of published survey coordinate range. Source: Kosterin & Smith 2020, p.111, Locality 8."
    }
  },
  {
    "id": "kbal-spean-carvings-and-upstream-river-in-siem-reap",
    "name": "Kbal Spean carvings and upstream river in Siem Reap",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.015,
      13.689
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Calculated midpoint of published survey coordinate range. Source: Kosterin & Smith 2020, p.109, Locality 4.",
    "original_coordinate_expression": "Original coordinate expression: 13.686–692 N; 104.013–017 E.",
    "coordinate_notes": "Survey reach midpoint; downstream waterfall is a separate reach.",
    "source_urls": [
      "https://dragonflyfund.org/en/idf-report-154-2020-english/"
    ],
    "description": "Angkorian carvings occupy a sandstone riverbed at Kbal Spean. Flowing water, exposed bedding and forest habitat connect the geological landscape with sacred water heritage. This pin is the midpoint of a surveyed river reach.",
    "mineralogy": "Sandstone; no site-specific mineral analysis supplied",
    "gallery": [
      {
        "src": "images/figure-14-1.webp",
        "caption": "Figure 14. Sandstone riverbed carvings at Kbal Spean.",
        "credit": "Source: Kosterin & Smith (2020), Odonata of Phnom Kulen Mts, IDF-Report 154, 99–184, Figure 12, PDF page 108. Credit: Oleg E. Kosterin; Kosterin & Smith 2020, Figure 12.",
        "source_urls": [
          "https://dragonflyfund.org/en/idf-report-154-2020-english/"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 668,
        "height": 471,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 14
      },
      {
        "src": "images/figure-15-1.webp",
        "caption": "Figure 15. Forest river upstream of the Kbal Spean carvings.",
        "credit": "Source: Kosterin & Smith (2020), Odonata of Phnom Kulen Mts, IDF-Report 154, 99–184, Figure 14, PDF page 110. Credit: Oleg E. Kosterin; Kosterin & Smith 2020, Figure 14.",
        "source_urls": [
          "https://dragonflyfund.org/en/idf-report-154-2020-english/"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 666,
        "height": 974,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 15
      },
      {
        "src": "images/figure-01-1.webp",
        "caption": "Figure 1. Published archaeological map of Greater Angkor and Phnom Kulen.",
        "credit": "Source: Chevance et al. (2019), Antiquity 93, 1303–1321, Figure 1, PDF page 2. Credit: Chevance et al. 2019, Figure 1; CC BY 4.0.",
        "source_urls": [
          "https://doi.org/10.15184/aqy.2019.133"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1135,
        "height": 766,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 1
      },
      {
        "src": "images/figure-02-1.webp",
        "caption": "Figure 2. Mahendraparvata archaeological map over lidar hillshade.",
        "credit": "Source: Chevance et al. (2019), Antiquity 93, 1303–1321, Figure 4, PDF page 8. Credit: Chevance et al. 2019, Figure 4; CC BY 4.0.",
        "source_urls": [
          "https://doi.org/10.15184/aqy.2019.133"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 761,
        "height": 866,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 2
      }
    ],
    "nameKm": "ចម្លាក់ក្បាលស្ពាន និងដងស្ទឹង (ខេត្តសៀមរាប)",
    "province": {
      "en": "Siem Reap",
      "km": "សៀមរាប"
    },
    "era": "Cretaceous Sandstone (~100 Ma)",
    "narrative": {
      "overview": "Angkorian carvings occupy a sandstone riverbed at Kbal Spean. Flowing water, exposed bedding and forest habitat connect the geological landscape with sacred water heritage. This pin is the midpoint of a surveyed river reach.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Siem Reap. Bedrock exposures belong to Cretaceous Sandstone (~100 Ma), recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តសៀមរាប។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Cretaceous Sandstone (~100 Ma) ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Sandstone; no site-specific mineral analysis supplied",
      "provenanceNote": "Basis: Calculated midpoint of published survey coordinate range. Source: Kosterin & Smith 2020, p.109, Locality 4."
    }
  },
  {
    "id": "kulen-river-of-1000-lingas-in-siem-reap",
    "name": "Kulen River of 1000 Lingas in Siem Reap",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.1035,
      13.566
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Calculated midpoint of published survey coordinate range. Source: Kosterin & Smith 2020, p.111, Locality 7.",
    "original_coordinate_expression": "Original coordinate expression: 13.565–567 N; 104.102–105 E.",
    "coordinate_notes": "Distinct from Kbal Spean.",
    "source_urls": [
      "https://dragonflyfund.org/en/idf-report-154-2020-english/"
    ],
    "description": "Lingas carved into sandstone record the cultural use of the Kulen riverbed. This locality is separate from Kbal Spean and provides a link between bedrock, water and religious heritage.",
    "mineralogy": "Sandstone",
    "gallery": [
      {
        "src": "images/figure-12-1.webp",
        "caption": "Figure 12. Linga carvings in the sandstone bed of the Kulen river.",
        "credit": "Source: Kosterin & Smith (2020), Odonata of Phnom Kulen Mts, IDF-Report 154, 99–184, Figure 8, PDF page 106. Credit: Oleg E. Kosterin; Kosterin & Smith 2020, Figure 8.",
        "source_urls": [
          "https://dragonflyfund.org/en/idf-report-154-2020-english/"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 668,
        "height": 445,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 12
      },
      {
        "src": "images/figure-04-1.webp",
        "caption": "Figure 4. Published geological map and sandstone sampling sites in Kulen.",
        "credit": "Source: Choon et al. (2022), Techno-Science Research Journal 10(2), 8–16, Figure 1, PDF page 2. Credit: Choon et al. 2022, Figure 1.",
        "source_urls": [
          "https://techno-srj.itc.edu.kh/public/journal/document/2.pdf"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 681,
        "height": 477,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 4
      },
      {
        "src": "images/figure-01-1.webp",
        "caption": "Figure 1. Published archaeological map of Greater Angkor and Phnom Kulen.",
        "credit": "Source: Chevance et al. (2019), Antiquity 93, 1303–1321, Figure 1, PDF page 2. Credit: Chevance et al. 2019, Figure 1; CC BY 4.0.",
        "source_urls": [
          "https://doi.org/10.15184/aqy.2019.133"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1135,
        "height": 766,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 1
      }
    ],
    "nameKm": "ស្ទឹងលិង្គ ១០០០ ភ្នំគូលែន (ខេត្តសៀមរាប)",
    "province": {
      "en": "Siem Reap",
      "km": "សៀមរាប"
    },
    "era": "Jurassic – Cretaceous Khorat Group",
    "narrative": {
      "overview": "Lingas carved into sandstone record the cultural use of the Kulen riverbed. This locality is separate from Kbal Spean and provides a link between bedrock, water and religious heritage.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Siem Reap. Bedrock exposures belong to Jurassic – Cretaceous Khorat Group, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តសៀមរាប។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Jurassic – Cretaceous Khorat Group ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Sandstone",
      "provenanceNote": "Basis: Calculated midpoint of published survey coordinate range. Source: Kosterin & Smith 2020, p.111, Locality 7."
    }
  },
  {
    "id": "tnal-mareh-floating-forest-in-siem-reap",
    "name": "Tnal Mareh floating forest in Siem Reap",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.1585,
      13.529
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Calculated midpoint of published survey coordinate range. Source: Kosterin & Smith 2020, p.118, Locality 17.",
    "original_coordinate_expression": "Original coordinate expression: 13.528–530 N; 104.157–160 E.",
    "coordinate_notes": "Research locality; not verified as a public visitor attraction.",
    "source_urls": [
      "https://dragonflyfund.org/en/idf-report-154-2020-english/"
    ],
    "description": "Swamp forest at Tnal Mareh illustrates how drainage and standing water shape the Kulen landscape. The published photograph documents pneumatophores and wetland vegetation; the coordinate is a research locality.",
    "mineralogy": "Sandstone plateau context; no local mineral analysis",
    "gallery": [
      {
        "src": "images/figure-11-1.webp",
        "caption": "Figure 11. Swamp forest and pneumatophores at Tnal Mareh, Kulen.",
        "credit": "Source: Kosterin & Smith (2020), Odonata of Phnom Kulen Mts, IDF-Report 154, 99–184, Figure 7, PDF page 105. Credit: Oleg E. Kosterin; Kosterin & Smith 2020, Figure 7.",
        "source_urls": [
          "https://dragonflyfund.org/en/idf-report-154-2020-english/"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 665,
        "height": 497,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 11
      },
      {
        "src": "images/figure-04-1.webp",
        "caption": "Figure 4. Published geological map and sandstone sampling sites in Kulen.",
        "credit": "Source: Choon et al. (2022), Techno-Science Research Journal 10(2), 8–16, Figure 1, PDF page 2. Credit: Choon et al. 2022, Figure 1.",
        "source_urls": [
          "https://techno-srj.itc.edu.kh/public/journal/document/2.pdf"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 681,
        "height": 477,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 4
      },
      {
        "src": "images/figure-01-1.webp",
        "caption": "Figure 1. Published archaeological map of Greater Angkor and Phnom Kulen.",
        "credit": "Source: Chevance et al. (2019), Antiquity 93, 1303–1321, Figure 1, PDF page 2. Credit: Chevance et al. 2019, Figure 1; CC BY 4.0.",
        "source_urls": [
          "https://doi.org/10.15184/aqy.2019.133"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1135,
        "height": 766,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 1
      }
    ],
    "nameKm": "ព្រៃទឹកថ្នល់ម្រេញ ភ្នំគូលែន (ខេត្តសៀមរាប)",
    "province": {
      "en": "Siem Reap",
      "km": "សៀមរាប"
    },
    "era": "Mesozoic – Cenozoic",
    "narrative": {
      "overview": "Swamp forest at Tnal Mareh illustrates how drainage and standing water shape the Kulen landscape. The published photograph documents pneumatophores and wetland vegetation; the coordinate is a research locality.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Siem Reap. Bedrock exposures belong to Mesozoic – Cenozoic, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តសៀមរាប។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Mesozoic – Cenozoic ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Sandstone plateau context; no local mineral analysis",
      "provenanceNote": "Basis: Calculated midpoint of published survey coordinate range. Source: Kosterin & Smith 2020, p.118, Locality 17."
    }
  },
  {
    "id": "kulen-sandstone-veal-stream-in-siem-reap",
    "name": "Kulen sandstone veal stream in Siem Reap",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.12,
      13.5235
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Calculated midpoint of published survey coordinate range. Source: Kosterin & Smith 2020, pp.115–118, Locality 13.",
    "original_coordinate_expression": "Original coordinate expression: 13.523–524 N; 104.119–121 E.",
    "coordinate_notes": "Research locality; local guide and access confirmation needed.",
    "source_urls": [
      "https://dragonflyfund.org/en/idf-report-154-2020-english/"
    ],
    "description": "An exposed sandstone streambed crosses an open veal landscape on Kulen. The locality offers a view of bedrock, surface drainage and vegetation on the plateau.",
    "mineralogy": "Sandstone; quartz arenite and sub-litharenite reported in Kulen studies",
    "gallery": [
      {
        "src": "images/figure-16-1.webp",
        "caption": "Figure 16. Exposed sandstone streambed and open veal landscape on Kulen.",
        "credit": "Source: Kosterin & Smith (2020), Odonata of Phnom Kulen Mts, IDF-Report 154, 99–184, Figure 22, PDF page 117. Credit: Oleg E. Kosterin; Kosterin & Smith 2020, Figure 22.",
        "source_urls": [
          "https://dragonflyfund.org/en/idf-report-154-2020-english/"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 668,
        "height": 308,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 16
      },
      {
        "src": "images/figure-04-1.webp",
        "caption": "Figure 4. Published geological map and sandstone sampling sites in Kulen.",
        "credit": "Source: Choon et al. (2022), Techno-Science Research Journal 10(2), 8–16, Figure 1, PDF page 2. Credit: Choon et al. 2022, Figure 1.",
        "source_urls": [
          "https://techno-srj.itc.edu.kh/public/journal/document/2.pdf"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 681,
        "height": 477,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 4
      },
      {
        "src": "images/figure-05-1.webp",
        "caption": "Figure 5. Kulen Takhok measured section and outcrop photographs.",
        "credit": "Source: Choon et al. (2022), Techno-Science Research Journal 10(2), 8–16, Figure 2, PDF page 3. Credit: Choon et al. 2022, Figure 2.",
        "source_urls": [
          "https://techno-srj.itc.edu.kh/public/journal/document/2.pdf"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1441,
        "height": 1015,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 5
      }
    ],
    "nameKm": "អូរវាលថ្មភក់ភ្នំគូលែន (ខេត្តសៀមរាប)",
    "province": {
      "en": "Siem Reap",
      "km": "សៀមរាប"
    },
    "era": "Jurassic – Cretaceous Khorat Group",
    "narrative": {
      "overview": "An exposed sandstone streambed crosses an open veal landscape on Kulen. The locality offers a view of bedrock, surface drainage and vegetation on the plateau.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Siem Reap. Bedrock exposures belong to Jurassic – Cretaceous Khorat Group, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តសៀមរាប។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Jurassic – Cretaceous Khorat Group ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Sandstone; quartz arenite and sub-litharenite reported in Kulen studies",
      "provenanceNote": "Basis: Calculated midpoint of published survey coordinate range. Source: Kosterin & Smith 2020, pp.115–118, Locality 13."
    }
  },
  {
    "id": "srae-tbong-former-reservoir-wetland-in-siem-reap",
    "name": "Srae Tbong former reservoir wetland in Siem Reap",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.1578,
      13.5237
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Calculated midpoint of published survey coordinate range. Source: Kosterin & Smith 2020, p.118, Locality 15.",
    "original_coordinate_expression": "Original coordinate expression: 13.5234–5240 N; 104.1574–1582 E.",
    "coordinate_notes": "Reference point within the surveyed eastern margin.",
    "source_urls": [
      "https://dragonflyfund.org/en/idf-report-154-2020-english/"
    ],
    "description": "Wetland at the former Srae Tbong reservoir connects historic water management with modern wetland habitat. The marker lies within the surveyed eastern margin.",
    "mineralogy": "Sandstone plateau context; wetland sediments not analysed here",
    "gallery": [
      {
        "src": "images/figure-17-1.webp",
        "caption": "Figure 17. Wetland in the former Srae Tbong reservoir, Kulen.",
        "credit": "Source: Kosterin & Smith (2020), Odonata of Phnom Kulen Mts, IDF-Report 154, 99–184, Figure 23, PDF page 117. Credit: Oleg E. Kosterin; Kosterin & Smith 2020, Figure 23.",
        "source_urls": [
          "https://dragonflyfund.org/en/idf-report-154-2020-english/"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 667,
        "height": 445,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 17
      },
      {
        "src": "images/figure-01-1.webp",
        "caption": "Figure 1. Published archaeological map of Greater Angkor and Phnom Kulen.",
        "credit": "Source: Chevance et al. (2019), Antiquity 93, 1303–1321, Figure 1, PDF page 2. Credit: Chevance et al. 2019, Figure 1; CC BY 4.0.",
        "source_urls": [
          "https://doi.org/10.15184/aqy.2019.133"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1135,
        "height": 766,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 1
      },
      {
        "src": "images/figure-02-1.webp",
        "caption": "Figure 2. Mahendraparvata archaeological map over lidar hillshade.",
        "credit": "Source: Chevance et al. (2019), Antiquity 93, 1303–1321, Figure 4, PDF page 8. Credit: Chevance et al. 2019, Figure 4; CC BY 4.0.",
        "source_urls": [
          "https://doi.org/10.15184/aqy.2019.133"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 761,
        "height": 866,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 2
      }
    ],
    "nameKm": "ដីសើមអតីតអាងស្រែត្បូង (ខេត្តសៀមរាប)",
    "province": {
      "en": "Siem Reap",
      "km": "សៀមរាប"
    },
    "era": "Mesozoic – Cenozoic",
    "narrative": {
      "overview": "Wetland at the former Srae Tbong reservoir connects historic water management with modern wetland habitat. The marker lies within the surveyed eastern margin.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Siem Reap. Bedrock exposures belong to Mesozoic – Cenozoic, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តសៀមរាប។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Mesozoic – Cenozoic ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Sandstone plateau context; wetland sediments not analysed here",
      "provenanceNote": "Basis: Calculated midpoint of published survey coordinate range. Source: Kosterin & Smith 2020, p.118, Locality 15."
    }
  },
  {
    "id": "sra-srang-reservoir-angkor-in-siem-reap",
    "name": "Sra Srang reservoir, Angkor in Siem Reap",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      103.9035,
      13.43
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Calculated midpoint of published survey coordinate range. Source: Kosterin 2020, Miscellaneous faunal data, p.188, SR3.",
    "original_coordinate_expression": "Original coordinate expression: 13.429–431 N; 103.903–904 E.",
    "coordinate_notes": "Cultural water heritage reference point.",
    "source_urls": [
      "https://dragonflyfund.org/en/idf-report-154-2020-english/"
    ],
    "description": "Sra Srang is a cultural water-heritage locality in the Angkor landscape. Its reservoir setting helps explain the relationship between terrain, water storage and the archaeological city.",
    "mineralogy": "Regional sandstone and laterite construction context",
    "gallery": [
      {
        "src": "images/figure-01-1.webp",
        "caption": "Figure 1. Published archaeological map of Greater Angkor and Phnom Kulen.",
        "credit": "Source: Chevance et al. (2019), Antiquity 93, 1303–1321, Figure 1, PDF page 2. Credit: Chevance et al. 2019, Figure 1; CC BY 4.0.",
        "source_urls": [
          "https://doi.org/10.15184/aqy.2019.133"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1135,
        "height": 766,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 1
      },
      {
        "src": "images/figure-02-1.webp",
        "caption": "Figure 2. Mahendraparvata archaeological map over lidar hillshade.",
        "credit": "Source: Chevance et al. (2019), Antiquity 93, 1303–1321, Figure 4, PDF page 8. Credit: Chevance et al. 2019, Figure 4; CC BY 4.0.",
        "source_urls": [
          "https://doi.org/10.15184/aqy.2019.133"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 761,
        "height": 866,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 2
      }
    ],
    "nameKm": "ស្រះស្រង់ អង្គរ (ខេត្តសៀមរាប)",
    "province": {
      "en": "Siem Reap",
      "km": "សៀមរាប"
    },
    "era": "Mesozoic – Cenozoic",
    "narrative": {
      "overview": "Sra Srang is a cultural water-heritage locality in the Angkor landscape. Its reservoir setting helps explain the relationship between terrain, water storage and the archaeological city.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Siem Reap. Bedrock exposures belong to Mesozoic – Cenozoic, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តសៀមរាប។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Mesozoic – Cenozoic ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Regional sandstone and laterite construction context",
      "provenanceNote": "Basis: Calculated midpoint of published survey coordinate range. Source: Kosterin 2020, Miscellaneous faunal data, p.188, SR3."
    }
  },
  {
    "id": "phnom-bak-fossil-natural-heritage-site-in-banteay-meanchey",
    "name": "Phnom Bak fossil / natural heritage site in Banteay Meanchey",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": null,
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "unresolved",
    "publish_pin": false,
    "coordinate_source": "Basis: Unresolved location identity. Source: Sub-decree 71 annex contains official map and coordinate table.",
    "original_coordinate_expression": "",
    "coordinate_notes": "Multiple nearby Phnom Bak hill/peak records disagree; use official annex to identify the protected fossil site before placing a public pin.",
    "source_urls": [
      "https://data.opendevelopmentcambodia.net/dataset/sub-decree-no-71-on-establishment-of-phnom-bak-natural-heritage-site"
    ],
    "description": "Phnom Bak is a reported marine-fossil and natural-heritage locality near Sisophon. The exact protected fossil site must be identified from the official annex before a public map point is assigned.",
    "mineralogy": "Reported fossiliferous limestone; specimen and horizon verification needed",
    "gallery": [
      {
        "src": "images/phnom-bak-1.png",
        "caption": "Phnom Bak: tree-lined approach and steps beneath the rocky hill.",
        "credit": "User-supplied photograph; photographer not identified in the supplied image.",
        "source_urls": [],
        "scope": "Phnom Bak locality identified by user",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 700,
        "height": 450,
        "relationship": "site image supplied by user"
      },
      {
        "src": "images/phnom-bak-2.png",
        "caption": "Phnom Bak: view across the water toward a wooded hill.",
        "credit": "User-supplied photograph; photographer not identified in the supplied image.",
        "source_urls": [],
        "scope": "Phnom Bak locality identified by user",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 700,
        "height": 450,
        "relationship": "site image supplied by user"
      },
      {
        "src": "images/phnom-bak-3.png",
        "caption": "Phnom Bak: exposed cliffs and vegetation.",
        "credit": "User-supplied photograph; photographer not identified in the supplied image.",
        "source_urls": [],
        "scope": "Phnom Bak locality identified by user",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 700,
        "height": 450,
        "relationship": "site image supplied by user"
      }
    ],
    "nameKm": "ទីតាំងផូស៊ីល និងបេតិកភណ្ឌធម្មជាតិភ្នំបាក់ (ខេត្តបន្ទាយមានជ័យ)",
    "province": {
      "en": "Banteay Meanchey",
      "km": "បន្ទាយមានជ័យ"
    },
    "era": "Permian Marine Limestone & Brachiopod Horizon",
    "narrative": {
      "overview": "Phnom Bak is a reported marine-fossil and natural-heritage locality near Sisophon. The exact protected fossil site must be identified from the official annex before a public map point is assigned.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Banteay Meanchey. Bedrock exposures belong to Permian Marine Limestone & Brachiopod Horizon, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តបន្ទាយមានជ័យ។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Permian Marine Limestone & Brachiopod Horizon ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Reported fossiliferous limestone; specimen and horizon verification needed",
      "provenanceNote": "Basis: Unresolved location identity. Source: Sub-decree 71 annex contains official map and coordinate table."
    }
  },
  {
    "id": "phnom-kang-va-fossil-site-in-banteay-meanchey",
    "name": "Phnom Kang Va fossil site in Banteay Meanchey",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": null,
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "unresolved",
    "publish_pin": false,
    "coordinate_source": "Basis: Exact fossil hill / exposure not verified. Source: Fossils at Kang Va mountain.",
    "original_coordinate_expression": "",
    "coordinate_notes": "Do not substitute Kang Va village or reservoir coordinates for the fossil exposure.",
    "source_urls": [
      "https://ams.com.kh/khmercivilization/detail/5311"
    ],
    "description": "Phnom Kang Va is a reported marine-fossil locality near Serey Sophorn. Village or reservoir coordinates cannot identify the fossil exposure; the hill and fossil horizon remain to be located.",
    "mineralogy": "Reported fossiliferous limestone; taxonomy and age require verification",
    "gallery": [
      {
        "src": "images/phnom-kang-va-1.png",
        "caption": "Phnom Kang Va: aerial view of wooded hills and the surrounding landscape.",
        "credit": "User-supplied photograph; photographer not identified in the supplied image.",
        "source_urls": [],
        "scope": "Phnom Kang Va locality identified by user",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 739,
        "height": 415,
        "relationship": "site image supplied by user"
      },
      {
        "src": "images/phnom-kang-va-2.png",
        "caption": "Phnom Kang Va: layered rock exposure beneath woodland.",
        "credit": "User-supplied photograph; photographer not identified in the supplied image.",
        "source_urls": [],
        "scope": "Phnom Kang Va locality identified by user",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 720,
        "height": 405,
        "relationship": "site image supplied by user"
      },
      {
        "src": "images/phnom-kang-va-3.png",
        "caption": "Phnom Kang Va: rock passage with a gated entrance.",
        "credit": "User-supplied photograph; photographer not identified in the supplied image.",
        "source_urls": [],
        "scope": "Phnom Kang Va locality identified by user",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 720,
        "height": 405,
        "relationship": "site image supplied by user"
      }
    ],
    "nameKm": "ទីតាំងផូស៊ីលភ្នំកងវ៉ា (ខេត្តបន្ទាយមានជ័យ)",
    "province": {
      "en": "Banteay Meanchey",
      "km": "បន្ទាយមានជ័យ"
    },
    "era": "Permian Fossiliferous Carbonate",
    "narrative": {
      "overview": "Phnom Kang Va is a reported marine-fossil locality near Serey Sophorn. Village or reservoir coordinates cannot identify the fossil exposure; the hill and fossil horizon remain to be located.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Banteay Meanchey. Bedrock exposures belong to Permian Fossiliferous Carbonate, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តបន្ទាយមានជ័យ។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Permian Fossiliferous Carbonate ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Reported fossiliferous limestone; taxonomy and age require verification",
      "provenanceNote": "Basis: Exact fossil hill / exposure not verified. Source: Fossils at Kang Va mountain."
    }
  },
  {
    "id": "tra-peang-cha-sandstone-quarry-geosite-in-siem-reap",
    "name": "Tra Peang Cha Sandstone Quarry Geosite in Siem Reap",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.112,
      13.578
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Published geosite inventory. Source: ITC Kulen Geopark Assessment 2026.",
    "original_coordinate_expression": "Original coordinate expression: Tra Peang Cha, Phnom Kulen.",
    "coordinate_notes": "Ancient Angkorian sandstone quarry outcrop with visible block extraction marks and tool channels.",
    "source_urls": [
      "https://www.itc.edu.kh"
    ],
    "description": "Ancient quarry traces at Tra Peang Cha link Kulen sandstone with Angkorian building stone. The catalogue describes extraction marks and tool channels; regional maps place the site in the candidate Kulen study area.",
    "mineralogy": "Quartz-rich sandstone; regional quartz arenite and sub-litharenite",
    "gallery": [
      {
        "src": "images/figure-30-1.webp",
        "caption": "Sandstone quarry photograph grouped under catalogue Figure 30; exact quarry identity requires confirmation.",
        "credit": "Source: Eng et al. (2025/2026), Assessing Geodiversity in the Kulen Area, ITC Faculty of Geo-resources and Geotechnical Engineering, Slide 12. Credit: ITC GGG Geoteam.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1280,
        "height": 960,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 30
      },
      {
        "src": "images/figure-26-1.webp",
        "caption": "Figure 26. Published geosite inventory map of the Kulen candidate geopark area (23 geosites).",
        "credit": "Source: Eng et al. (2025/2026), Assessing Geodiversity in the Kulen Area, Siem Reap Province, Cambodia: A Potential Geopark Candidate, ITC Faculty of Geo-resources and Geotechnical Engineering, Slide 8. Credit: ITC GGG Geoteam.",
        "source_urls": [
          "https://www.itc.edu.kh"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1280,
        "height": 905,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 26
      },
      {
        "src": "images/figure-04-1.webp",
        "caption": "Figure 4. Published geological map and sandstone sampling sites in Kulen.",
        "credit": "Source: Choon et al. (2022), Techno-Science Research Journal 10(2), 8–16, Figure 1, PDF page 2. Credit: Choon et al. 2022, Figure 1.",
        "source_urls": [
          "https://techno-srj.itc.edu.kh/public/journal/document/2.pdf"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 681,
        "height": 477,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 4
      },
      {
        "src": "images/figure-01-1.webp",
        "caption": "Figure 1. Published archaeological map of Greater Angkor and Phnom Kulen.",
        "credit": "Source: Chevance et al. (2019), Antiquity 93, 1303–1321, Figure 1, PDF page 2. Credit: Chevance et al. 2019, Figure 1; CC BY 4.0.",
        "source_urls": [
          "https://doi.org/10.15184/aqy.2019.133"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1135,
        "height": 766,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 1
      }
    ],
    "nameKm": "ការដ្ឋានយកថ្មភក់បុរាណត្រពាំងចារ្យ (ខេត្តសៀមរាប)",
    "province": {
      "en": "Siem Reap",
      "km": "សៀមរាប"
    },
    "era": "Mesozoic – Cenozoic",
    "narrative": {
      "overview": "Ancient quarry traces at Tra Peang Cha link Kulen sandstone with Angkorian building stone. The catalogue describes extraction marks and tool channels; regional maps place the site in the candidate Kulen study area.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Siem Reap. Bedrock exposures belong to Mesozoic – Cenozoic, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តសៀមរាប។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Mesozoic – Cenozoic ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Quartz-rich sandstone; regional quartz arenite and sub-litharenite",
      "provenanceNote": "Basis: Published geosite inventory. Source: ITC Kulen Geopark Assessment 2026."
    }
  },
  {
    "id": "poeung-takho-viewpoint-and-escarpment-in-siem-reap",
    "name": "Poeung Takho Viewpoint and Escarpment in Siem Reap",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.095,
      13.553
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Published geosite inventory. Source: ITC Kulen Geopark Assessment 2026.",
    "original_coordinate_expression": "Original coordinate expression: Poeung Takho, Phnom Kulen.",
    "coordinate_notes": "Panoramic cliff viewpoint exposing thick beds of Jurassic-Cretaceous quartz arenite.",
    "source_urls": [
      "https://www.itc.edu.kh"
    ],
    "description": "Poeung Takho is an escarpment viewpoint on the Kulen sandstone plateau. Thick sandstone beds and the contrast between plateau and plain support landscape interpretation.",
    "mineralogy": "Quartz arenite reported in the catalogue; regional sandstone evidence",
    "gallery": [
      {
        "src": "images/figure-28-1.webp",
        "caption": "Figure 28. Published map of scenic viewing spots across the Kulen sandstone escarpment (4 viewing spots).",
        "credit": "Source: Eng et al. (2025/2026), Assessing Geodiversity in the Kulen Area, ITC Faculty of Geo-resources and Geotechnical Engineering, Slide 10. Credit: ITC GGG Geoteam.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1280,
        "height": 905,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 28
      },
      {
        "src": "images/figure-05-1.webp",
        "caption": "Figure 5. Kulen Takhok measured section and outcrop photographs.",
        "credit": "Source: Choon et al. (2022), Techno-Science Research Journal 10(2), 8–16, Figure 2, PDF page 3. Credit: Choon et al. 2022, Figure 2.",
        "source_urls": [
          "https://techno-srj.itc.edu.kh/public/journal/document/2.pdf"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1441,
        "height": 1015,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 5
      },
      {
        "src": "images/figure-04-1.webp",
        "caption": "Figure 4. Published geological map and sandstone sampling sites in Kulen.",
        "credit": "Source: Choon et al. (2022), Techno-Science Research Journal 10(2), 8–16, Figure 1, PDF page 2. Credit: Choon et al. 2022, Figure 1.",
        "source_urls": [
          "https://techno-srj.itc.edu.kh/public/journal/document/2.pdf"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 681,
        "height": 477,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 4
      },
      {
        "src": "images/figure-01-1.webp",
        "caption": "Figure 1. Published archaeological map of Greater Angkor and Phnom Kulen.",
        "credit": "Source: Chevance et al. (2019), Antiquity 93, 1303–1321, Figure 1, PDF page 2. Credit: Chevance et al. 2019, Figure 1; CC BY 4.0.",
        "source_urls": [
          "https://doi.org/10.15184/aqy.2019.133"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1135,
        "height": 766,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 1
      }
    ],
    "nameKm": "ច្រាំងចោទ និងចំណុចមើលទេសភាពពើងតាហោ (ខេត្តសៀមរាប)",
    "province": {
      "en": "Siem Reap",
      "km": "សៀមរាប"
    },
    "era": "Mesozoic – Cenozoic",
    "narrative": {
      "overview": "Poeung Takho is an escarpment viewpoint on the Kulen sandstone plateau. Thick sandstone beds and the contrast between plateau and plain support landscape interpretation.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Siem Reap. Bedrock exposures belong to Mesozoic – Cenozoic, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តសៀមរាប។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Mesozoic – Cenozoic ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Quartz arenite reported in the catalogue; regional sandstone evidence",
      "provenanceNote": "Basis: Published geosite inventory. Source: ITC Kulen Geopark Assessment 2026."
    }
  },
  {
    "id": "lake-yeak-laom-volcanic-maar-in-ratanakiri",
    "name": "Lake Yeak Laom Volcanic Maar in Ratanakiri",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      107.018,
      13.725
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Official national geopark register. Source: Cambodia CCOP Country Report 2018.",
    "original_coordinate_expression": "Original coordinate expression: 13.725 N, 107.018 E.",
    "coordinate_notes": "Near-circular 4,000-year-old basaltic volcanic maar crater lake of high cultural and geomorphological significance.",
    "source_urls": [
      "http://www.ccop.asia"
    ],
    "description": "Lake Yeak Laom is a near-circular volcanic crater lake in Ratanakiri. Its basin, surrounding forest and Tampuen cultural heritage connect volcanic landforms with community stewardship. A precise crater age is not assigned here.",
    "mineralogy": "Regional basalt and zircon context; no lake-specific mineral analysis",
    "gallery": [
      {
        "src": "images/figure-49-2.webp",
        "caption": "Lake Yeak Laom aerial photograph grouped under catalogue Figure 49; individual image credit follows catalogue attribution.",
        "credit": "Source: General Department of Mineral Resources (GDMR), Country Report of Cambodia, CCOP Annual Session 2018. Credit: GDMR.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 684,
        "height": 449,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 49
      },
      {
        "src": "images/figure-51-1.webp",
        "caption": "Figure 51. Katieng waterfall cascading over columnar jointed Neogene plateau basalt, Ratanakiri Province.",
        "credit": "Source: General Department of Mineral Resources (GDMR), Country Report of Cambodia, CCOP Annual Session 2018. Credit: GDMR.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 620,
        "height": 400,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 51
      }
    ],
    "nameKm": "បឹងយក្សឡោម - មាត់ភ្នំភ្លើងម៉ារ (ខេត្តរតនគិរី)",
    "province": {
      "en": "Ratanakiri",
      "km": "រតនគិរី"
    },
    "era": "Late Pleistocene – Holocene (~4,000–700,000 yr)",
    "narrative": {
      "overview": "Lake Yeak Laom is a near-circular volcanic crater lake in Ratanakiri. Its basin, surrounding forest and Tampuen cultural heritage connect volcanic landforms with community stewardship. A precise crater age is not assigned here.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Ratanakiri. Bedrock exposures belong to Late Pleistocene – Holocene (~4,000–700,000 yr), recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តរតនគិរី។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Late Pleistocene – Holocene (~4,000–700,000 yr) ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Regional basalt and zircon context; no lake-specific mineral analysis",
      "provenanceNote": "Basis: Official national geopark register. Source: Cambodia CCOP Country Report 2018."
    }
  },
  {
    "id": "nam-lea-rom-el-stone-dome-in-mondulkiri",
    "name": "Nam Lea / Rom El stone dome in Mondulkiri",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      107.53572,
      12.53797
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Published local-operator marker. Source: Rom El (Nam Lear) Stone Mountain.",
    "original_coordinate_expression": "Original coordinate expression: 12.53797, 107.53572.",
    "coordinate_notes": "Dome marker, not sanctuary centroid. No verified site-specific rock identification or age from the reviewed papers.",
    "source_urls": [
      "https://naturelodgecambodia.com/Mondulkiri_maps.html"
    ],
    "description": "Nam Lea, also called Nam Lear or Rom El, is a bare rock dome rising above the Mondulkiri forest. Its rock type, age and origin remain unresolved in the reviewed studies. Regional basalt imagery is contextual evidence, not a photograph or identification of the dome.",
    "mineralogy": "Unresolved; do not label the dome basalt without site-specific evidence",
    "gallery": [
      {
        "src": "images/figure-06-1.webp",
        "caption": "Figure 6. Regional basalt map with Bou Sra, Dakdam, Ka Chanh and Cha Ong waterfall photographs.",
        "credit": "Source: Seng et al. (2024), Techno-Science Research Journal 12 Special Issue, 126–133, Figure 1, PDF page 2. Credit: Seng et al. 2024, Figure 1; map panel adapted by original authors from their reference 10.",
        "source_urls": [
          "https://techno-srj.itc.edu.kh/public/journal/document/Special%20Issue-Eraget%202023.pdf"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 537,
        "height": 982,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 6
      }
    ],
    "nameKm": "ភ្នំដុំថ្មណាំលា / រមអែល (ខេត្តមណ្ឌលគិរី)",
    "province": {
      "en": "Mondulkiri",
      "km": "មណ្ឌលគិរី"
    },
    "era": "Mesozoic Igneous / Metasedimentary Dome",
    "narrative": {
      "overview": "Nam Lea, also called Nam Lear or Rom El, is a bare rock dome rising above the Mondulkiri forest. Its rock type, age and origin remain unresolved in the reviewed studies. Regional basalt imagery is contextual evidence, not a photograph or identification of the dome.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Mondulkiri. Bedrock exposures belong to Mesozoic Igneous / Metasedimentary Dome, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តមណ្ឌលគិរី។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Mesozoic Igneous / Metasedimentary Dome ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Unresolved; do not label the dome basalt without site-specific evidence",
      "provenanceNote": "Basis: Published local-operator marker. Source: Rom El (Nam Lear) Stone Mountain."
    }
  },
  {
    "id": "bou-sra-waterfall-in-mondulkiri",
    "name": "Bou Sra waterfall in Mondulkiri",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      107.4183,
      12.56702
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Published local-operator marker. Source: Bu Sra Waterfall.",
    "original_coordinate_expression": "Original coordinate expression: 12.56702, 107.4183.",
    "coordinate_notes": "Seng et al. 2024 Figure 1B provides published site photograph; marker accuracy not surveyed here.",
    "source_urls": [
      "https://naturelodgecambodia.com/Mondulkiri_maps.html"
    ],
    "description": "Bou Sra waterfall descends over volcanic rock in the Mondulkiri landscape. The regional publication includes Bou Sra in panel B alongside other northeastern waterfalls and a basalt map.",
    "mineralogy": "Basalt reported regionally; no site-specific mineral inventory",
    "gallery": [
      {
        "src": "images/figure-06-1.webp",
        "caption": "Figure 6. Regional basalt map with Bou Sra, Dakdam, Ka Chanh and Cha Ong waterfall photographs.",
        "credit": "Source: Seng et al. (2024), Techno-Science Research Journal 12 Special Issue, 126–133, Figure 1, PDF page 2. Credit: Seng et al. 2024, Figure 1; map panel adapted by original authors from their reference 10.",
        "source_urls": [
          "https://techno-srj.itc.edu.kh/public/journal/document/Special%20Issue-Eraget%202023.pdf"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 537,
        "height": 982,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 6
      }
    ],
    "nameKm": "ទឹកធ្លាក់ប៊ូស្រា (ខេត្តមណ្ឌលគិរី)",
    "province": {
      "en": "Mondulkiri",
      "km": "មណ្ឌលគិរី"
    },
    "era": "Cenozoic Neogene Basalt (~5–10 Ma)",
    "narrative": {
      "overview": "Bou Sra waterfall descends over volcanic rock in the Mondulkiri landscape. The regional publication includes Bou Sra in panel B alongside other northeastern waterfalls and a basalt map.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Mondulkiri. Bedrock exposures belong to Cenozoic Neogene Basalt (~5–10 Ma), recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តមណ្ឌលគិរី។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Cenozoic Neogene Basalt (~5–10 Ma) ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Basalt reported regionally; no site-specific mineral inventory",
      "provenanceNote": "Basis: Published local-operator marker. Source: Bu Sra Waterfall."
    }
  },
  {
    "id": "pulung-waterfall-in-mondulkiri",
    "name": "Pulung waterfall in Mondulkiri",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      107.2792,
      12.50563
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Published local-operator marker. Source: Pulung Waterfall.",
    "original_coordinate_expression": "Original coordinate expression: 12.50563, 107.2792.",
    "coordinate_notes": "",
    "source_urls": [
      "https://naturelodgecambodia.com/Mondulkiri_maps.html"
    ],
    "description": "Pulung is a waterfall locality identified by a published Mondulkiri operator map. The catalogue supplies a location lead but no site-specific geological description or verified photograph.",
    "mineralogy": "Unresolved; field identification required",
    "gallery": [],
    "nameKm": "ទឹកធ្លាក់ពូលូង (ខេត្តមណ្ឌលគិរី)",
    "province": {
      "en": "Mondulkiri",
      "km": "មណ្ឌលគិរី"
    },
    "era": "Mesozoic – Cenozoic",
    "narrative": {
      "overview": "Pulung is a waterfall locality identified by a published Mondulkiri operator map. The catalogue supplies a location lead but no site-specific geological description or verified photograph.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Mondulkiri. Bedrock exposures belong to Mesozoic – Cenozoic, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តមណ្ឌលគិរី។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Mesozoic – Cenozoic ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Unresolved; field identification required",
      "provenanceNote": "Basis: Published local-operator marker. Source: Pulung Waterfall."
    }
  },
  {
    "id": "leng-kun-waterfall-and-cave-area-in-mondulkiri",
    "name": "Leng Kun waterfall and cave area in Mondulkiri",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      107.12796,
      12.37787
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Published local-operator marker. Source: Leng Kun Waterfall and Bat Cave.",
    "original_coordinate_expression": "Original coordinate expression: 12.37787, 107.12796.",
    "coordinate_notes": "Public access and specific cave entrance require local confirmation.",
    "source_urls": [
      "https://naturelodgecambodia.com/Mondulkiri_maps.html"
    ],
    "description": "Leng Kun is recorded as a waterfall and cave area in Mondulkiri. The supplied marker identifies the area rather than a surveyed cave entrance; local confirmation is needed for access and interpretation.",
    "mineralogy": "Unresolved; cave host rock not established in the catalogue",
    "gallery": [],
    "nameKm": "ទឹកធ្លាក់ និងតំបន់រូងភ្នំលេកគុន (ខេត្តមណ្ឌលគិរី)",
    "province": {
      "en": "Mondulkiri",
      "km": "មណ្ឌលគិរី"
    },
    "era": "Mesozoic – Cenozoic",
    "narrative": {
      "overview": "Leng Kun is recorded as a waterfall and cave area in Mondulkiri. The supplied marker identifies the area rather than a surveyed cave entrance; local confirmation is needed for access and interpretation.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Mondulkiri. Bedrock exposures belong to Mesozoic – Cenozoic, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តមណ្ឌលគិរី។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Mesozoic – Cenozoic ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Unresolved; cave host rock not established in the catalogue",
      "provenanceNote": "Basis: Published local-operator marker. Source: Leng Kun Waterfall and Bat Cave."
    }
  },
  {
    "id": "phnom-chhngok-cave-entrance-in-kampot",
    "name": "Phnom Chhngok cave entrance in Kampot",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.26964,
      10.64224
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: OpenStreetMap cave entrance via Mapcarta. Source: OSM node 3971467859.",
    "original_coordinate_expression": "Original coordinate expression: 10.64224 N; 104.26964 E.",
    "coordinate_notes": "Coordinate data: © OpenStreetMap contributors, ODbL. Cave spelling varies: Chhnork / Chhngauk.",
    "source_urls": [
      "https://mapcarta.com/N3971467859"
    ],
    "description": "A limestone cave at Phnom Chhngok contains a pre-Angkorian brick shrine among natural cave formations. The locality connects carbonate dissolution, underground space and religious heritage. Regional karst photographs are context rather than verified photographs of this entrance.",
    "mineralogy": "Limestone; carbonate cave formations; no analytical mineral list",
    "gallery": [
      {
        "src": "images/figure-24-1.webp",
        "caption": "Figure 24. Isolated limestone karst hill in Kampot Province.",
        "credit": "Source: Furey / Fauna & Flora (©2025; released 2026), Cambodian Caves: Guidelines for Sustainable Development and Management, Photograph, printed p. 8, PDF page 7. Credit: Nehru Pry; Fauna & Flora, Cambodian Caves.",
        "source_urls": [
          "https://www.fauna-flora.org/publications/cambodian-caves-guidelines-for-sustainable-development-and-management/"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1800,
        "height": 1280,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 24
      },
      {
        "src": "images/user-image-4.png",
        "caption": "Karst hill and surrounding fields; supplied as replacement regional context for Figure 25.",
        "credit": "Visible credit: © 2024 Kep-Cambodia.com.",
        "source_urls": [],
        "scope": "Regional context; exact hill or cave identity not supplied",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 687,
        "height": 446,
        "relationship": "replacement regional context",
        "user_attachment_number": 4
      },
      {
        "src": "images/user-image-5.png",
        "caption": "Karst landscape among fields and a pond; supplied as replacement regional context for Figure 25.",
        "credit": "User-supplied photograph; photographer not identified in the supplied image.",
        "source_urls": [],
        "scope": "Regional context; exact hill or cave identity not supplied",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 399,
        "height": 501,
        "relationship": "replacement regional context",
        "user_attachment_number": 5
      },
      {
        "src": "images/user-image-6.png",
        "caption": "Cave pool and rock formations; supplied as replacement regional context for Figure 25.",
        "credit": "User-supplied photograph; photographer not identified in the supplied image.",
        "source_urls": [],
        "scope": "Regional context; exact hill or cave identity not supplied",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 620,
        "height": 400,
        "relationship": "replacement regional context",
        "user_attachment_number": 6
      }
    ],
    "nameKm": "រូងភ្នំឈ្ងោក (ខេត្តកំពត)",
    "province": {
      "en": "Kampot",
      "km": "កំពត"
    },
    "era": "Permian Limestone Karst (~270 Ma)",
    "narrative": {
      "overview": "A limestone cave at Phnom Chhngok contains a pre-Angkorian brick shrine among natural cave formations. The locality connects carbonate dissolution, underground space and religious heritage. Regional karst photographs are context rather than verified photographs of this entrance.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Kampot. Bedrock exposures belong to Permian Limestone Karst (~270 Ma), recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តកំពត។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Permian Limestone Karst (~270 Ma) ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Limestone; carbonate cave formations; no analytical mineral list",
      "provenanceNote": "Basis: OpenStreetMap cave entrance via Mapcarta. Source: OSM node 3971467859."
    }
  },
  {
    "id": "kampong-trach-water-pond-cave-in-kampot",
    "name": "Kampong Trach Water Pond Cave in Kampot",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.47122,
      10.57993
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: OpenStreetMap cave entrance via Mapcarta. Source: OSM node 5047121248.",
    "original_coordinate_expression": "Original coordinate expression: 10.57993 N; 104.47122 E.",
    "coordinate_notes": "Specific named cave, not the whole karst complex. Coordinate data: © OpenStreetMap contributors, ODbL.",
    "source_urls": [
      "https://mapcarta.com/N5047121248"
    ],
    "description": "Water Pond Cave is a specific entrance in the Kampong Trach karst, rather than a point representing the entire complex. The surrounding limestone landscape records cave development by dissolution and supports cultural and biodiversity interpretation.",
    "mineralogy": "Limestone; no site-specific mineral analysis",
    "gallery": [
      {
        "src": "images/figure-24-1.webp",
        "caption": "Figure 24. Isolated limestone karst hill in Kampot Province.",
        "credit": "Source: Furey / Fauna & Flora (©2025; released 2026), Cambodian Caves: Guidelines for Sustainable Development and Management, Photograph, printed p. 8, PDF page 7. Credit: Nehru Pry; Fauna & Flora, Cambodian Caves.",
        "source_urls": [
          "https://www.fauna-flora.org/publications/cambodian-caves-guidelines-for-sustainable-development-and-management/"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1800,
        "height": 1280,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 24
      },
      {
        "src": "images/user-image-4.png",
        "caption": "Karst hill and surrounding fields; supplied as replacement regional context for Figure 25.",
        "credit": "Visible credit: © 2024 Kep-Cambodia.com.",
        "source_urls": [],
        "scope": "Regional context; exact hill or cave identity not supplied",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 687,
        "height": 446,
        "relationship": "replacement regional context",
        "user_attachment_number": 4
      },
      {
        "src": "images/user-image-5.png",
        "caption": "Karst landscape among fields and a pond; supplied as replacement regional context for Figure 25.",
        "credit": "User-supplied photograph; photographer not identified in the supplied image.",
        "source_urls": [],
        "scope": "Regional context; exact hill or cave identity not supplied",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 399,
        "height": 501,
        "relationship": "replacement regional context",
        "user_attachment_number": 5
      },
      {
        "src": "images/user-image-6.png",
        "caption": "Cave pool and rock formations; supplied as replacement regional context for Figure 25.",
        "credit": "User-supplied photograph; photographer not identified in the supplied image.",
        "source_urls": [],
        "scope": "Regional context; exact hill or cave identity not supplied",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 620,
        "height": 400,
        "relationship": "replacement regional context",
        "user_attachment_number": 6
      }
    ],
    "nameKm": "រូងភ្នំស្រះទឹក កំពង់ត្រាច (ខេត្តកំពត)",
    "province": {
      "en": "Kampot",
      "km": "កំពត"
    },
    "era": "Permian Marine Carbonate Platform (~265 Ma)",
    "narrative": {
      "overview": "Water Pond Cave is a specific entrance in the Kampong Trach karst, rather than a point representing the entire complex. The surrounding limestone landscape records cave development by dissolution and supports cultural and biodiversity interpretation.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Kampot. Bedrock exposures belong to Permian Marine Carbonate Platform (~265 Ma), recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តកំពត។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Permian Marine Carbonate Platform (~265 Ma) ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Limestone; no site-specific mineral analysis",
      "provenanceNote": "Basis: OpenStreetMap cave entrance via Mapcarta. Source: OSM node 5047121248."
    }
  },
  {
    "id": "tatai-waterfall-in-koh-kong",
    "name": "Tatai waterfall in Koh Kong",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      103.095833,
      11.586944
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Converted published DMS coordinate. Source: Kosterin 2010, p.53.",
    "original_coordinate_expression": "Original coordinate expression: 11°35′13″ N; 103°05′45″ E.",
    "coordinate_notes": "Research point differs by about 150 m from current OSM waterfall marker; use as site vicinity until checked.",
    "source_urls": [
      "https://dragonflyfund.org/en/idf-report-29-2010-english/"
    ],
    "description": "The Tatai River drops across broad exposed bedrock ledges in Koh Kong. Published waterfall and river photographs document the historical landscape; the research coordinate identifies the vicinity rather than an exact modern visitor entrance.",
    "mineralogy": "Bedrock exposed; lithology not established by the photograph alone",
    "gallery": [
      {
        "src": "images/figure-20-1.webp",
        "caption": "Figure 20. Tatai waterfall over exposed bedrock.",
        "credit": "Source: Kosterin (2010), IDF-Report 29, 1–75, Figure 12, PDF page 21. Credit: Oleg E. Kosterin; Kosterin 2010, Figure 12.",
        "source_urls": [
          "https://dragonflyfund.org/en/idf-report-29-2010-english/"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 966,
        "height": 644,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 20
      },
      {
        "src": "images/figure-21-1.webp",
        "caption": "Figure 21. Tatai river landscapes at Phnom Doung bridge.",
        "credit": "Source: Kosterin (2010), IDF-Report 29, 1–75, Figure 16, PDF page 26. Credit: Oleg E. Kosterin; Kosterin 2010, Figure 16.",
        "source_urls": [
          "https://dragonflyfund.org/en/idf-report-29-2010-english/"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 966,
        "height": 1345,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 21
      }
    ],
    "nameKm": "ទឹកធ្លាក់តាតៃ (ខេត្តកោះកុង)",
    "province": {
      "en": "Koh Kong",
      "km": "កោះកុង"
    },
    "era": "Jurassic – Cretaceous Continental Bedrock",
    "narrative": {
      "overview": "The Tatai River drops across broad exposed bedrock ledges in Koh Kong. Published waterfall and river photographs document the historical landscape; the research coordinate identifies the vicinity rather than an exact modern visitor entrance.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Koh Kong. Bedrock exposures belong to Jurassic – Cretaceous Continental Bedrock, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តកោះកុង។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Jurassic – Cretaceous Continental Bedrock ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Bedrock exposed; lithology not established by the photograph alone",
      "provenanceNote": "Basis: Converted published DMS coordinate. Source: Kosterin 2010, p.53."
    }
  },
  {
    "id": "kbal-chhay-cascades-in-preah-sihanouk",
    "name": "Kbal Chhay cascades in Preah Sihanouk",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      103.608611,
      10.675694
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Calculated midpoint of published DMS coordinate range. Source: Kosterin 2010, p.55.",
    "original_coordinate_expression": "Original coordinate expression: 10°40′29–36″ N; 103°36′30–32″ E.",
    "coordinate_notes": "Survey reach midpoint; not a car park.",
    "source_urls": [
      "https://dragonflyfund.org/en/idf-report-29-2010-english/"
    ],
    "description": "Kbal Chhay is a cascade landscape near Sihanoukville. A published photograph records the rock ledges and flowing water. The marker is the midpoint of a historical surveyed reach.",
    "mineralogy": "Exposed bedrock; site-specific lithology not confirmed",
    "gallery": [
      {
        "src": "images/figure-22-1.webp",
        "caption": "Figure 22. Kbal Chhay cascades near Sihanoukville.",
        "credit": "Source: Kosterin (2010), IDF-Report 29, 1–75, Figure 27, PDF page 37. Credit: Oleg E. Kosterin; Kosterin 2010, Figure 27.",
        "source_urls": [
          "https://dragonflyfund.org/en/idf-report-29-2010-english/"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 966,
        "height": 680,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 22
      }
    ],
    "nameKm": "ទឹកធ្លាក់ក្បាលឆាយ (ខេត្តព្រះសីហនុ)",
    "province": {
      "en": "Preah Sihanouk",
      "km": "ព្រះសីហនុ"
    },
    "era": "Mesozoic Sandstone & Alluvium",
    "narrative": {
      "overview": "Kbal Chhay is a cascade landscape near Sihanoukville. A published photograph records the rock ledges and flowing water. The marker is the midpoint of a historical surveyed reach.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Preah Sihanouk. Bedrock exposures belong to Mesozoic Sandstone & Alluvium, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តព្រះសីហនុ។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Mesozoic Sandstone & Alluvium ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Exposed bedrock; site-specific lithology not confirmed",
      "provenanceNote": "Basis: Calculated midpoint of published DMS coordinate range. Source: Kosterin 2010, p.55."
    }
  },
  {
    "id": "bokor-hill-station-survey-area-in-kampot",
    "name": "Bokor hill station survey area in Kampot",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.024444,
      10.626944
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Calculated midpoint of published DMS coordinate range. Source: Kosterin 2010, p.56.",
    "original_coordinate_expression": "Original coordinate expression: 10°37′19–55″ N; 104°01′18–38″ E.",
    "coordinate_notes": "Historical survey area midpoint; not summit, hotel or park gate.",
    "source_urls": [
      "https://dragonflyfund.org/en/idf-report-29-2010-english/"
    ],
    "description": "The historic Bokor hill-station area lies on a sandstone plateau above the coast. The gallery combines a 2010 landscape view with regional escarpment and forest evidence. This marker is a survey-area midpoint, not a summit or hotel entrance.",
    "mineralogy": "Quartz-rich sandstone; regional quartz arenite",
    "gallery": [
      {
        "src": "images/figure-23-1.webp",
        "caption": "Figure 23. Bokor hill station landscape photographed in 2010.",
        "credit": "Source: Kosterin (2010), IDF-Report 29, 1–75, Figure 31, PDF page 42. Credit: Oleg E. Kosterin; Kosterin 2010, Figure 31.",
        "source_urls": [
          "https://dragonflyfund.org/en/idf-report-29-2010-english/"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 966,
        "height": 667,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 23
      },
      {
        "src": "images/figure-36-1.webp",
        "caption": "Figure 36. South-facing sandstone escarpment of the Bokor Plateau looking out to the Gulf of Thailand, with Phu Quoc Island (Vietnam) in the distance, March 2001.",
        "credit": "Source: Rundel & Middleton (2017), Cambodian Journal of Natural History 2017(1), 17–37, Figure 1. Credit: © Rasoul Sharifi.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 472,
        "height": 620,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 36
      },
      {
        "src": "images/figure-37-1.webp",
        "caption": "Figure 37. Stunted forest of the Bokor Plateau with emergent trees of Dacrydium elatum, March 2001.",
        "credit": "Source: Rundel & Middleton (2017), Cambodian Journal of Natural History 2017(1), 17–37, Figure 2. Credit: © Philip Rundel.",
        "source_urls": [
          "https://cdn.angkordatabase.asia/libs/docs/2017-floraoftheBokorPlateau.pdf"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 473,
        "height": 340,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 37
      },
      {
        "src": "images/figure-38-1.webp",
        "caption": "Figure 38. Transition from montane wet evergreen forest to stunted forest near Popokvil Waterfall on the Bokor Plateau, March 2001.",
        "credit": "Source: Rundel & Middleton (2017), Cambodian Journal of Natural History 2017(1), 17–37, Figure 3. Credit: © Rasoul Sharifi.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 473,
        "height": 620,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 38
      }
    ],
    "nameKm": "ស្ថានីយខ្ពង់រាបភ្នំបូកគោ (ខេត្តកំពត)",
    "province": {
      "en": "Kampot",
      "km": "កំពត"
    },
    "era": "Early Cretaceous Bokor Formation",
    "narrative": {
      "overview": "The historic Bokor hill-station area lies on a sandstone plateau above the coast. The gallery combines a 2010 landscape view with regional escarpment and forest evidence. This marker is a survey-area midpoint, not a summit or hotel entrance.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Kampot. Bedrock exposures belong to Early Cretaceous Bokor Formation, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តកំពត។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Early Cretaceous Bokor Formation ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Quartz-rich sandstone; regional quartz arenite",
      "provenanceNote": "Basis: Calculated midpoint of published DMS coordinate range. Source: Kosterin 2010, p.56."
    }
  },
  {
    "id": "kep-national-park-eastern-forest-edge-in-kep",
    "name": "Kep National Park eastern forest edge in Kep",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.303611,
      10.490278
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Converted published DMS coordinate. Source: Kosterin 2010, p.56.",
    "original_coordinate_expression": "Original coordinate expression: 10°29′25″ N; 104°18′13″ E.",
    "coordinate_notes": "Historical biodiversity sampling locality; not park headquarters.",
    "source_urls": [
      "https://dragonflyfund.org/en/idf-report-29-2010-english/"
    ],
    "description": "This point marks a historical biodiversity sampling locality at the eastern forest edge of Kep National Park. It represents coastal forest context and is not the park headquarters or a surveyed geological exposure.",
    "mineralogy": "No site-specific geological or mineral analysis supplied",
    "gallery": [],
    "nameKm": "ឧទ្យានជាតិកែប (ខេត្តកែប)",
    "province": {
      "en": "Kep",
      "km": "កែប"
    },
    "era": "Mesozoic – Cenozoic",
    "narrative": {
      "overview": "This point marks a historical biodiversity sampling locality at the eastern forest edge of Kep National Park. It represents coastal forest context and is not the park headquarters or a surveyed geological exposure.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Kep. Bedrock exposures belong to Mesozoic – Cenozoic, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តកែប។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Mesozoic – Cenozoic ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "No site-specific geological or mineral analysis supplied",
      "provenanceNote": "Basis: Converted published DMS coordinate. Source: Kosterin 2010, p.56."
    }
  },
  {
    "id": "ream-recreation-centre-survey-area-in-preah-sihanouk",
    "name": "Ream recreation centre survey area in Preah Sihanouk",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      103.617222,
      10.515833
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Converted published DMS coordinate. Source: Kosterin 2010, p.55.",
    "original_coordinate_expression": "Original coordinate expression: 10°30′57″ N; 103°37′02″ E.",
    "coordinate_notes": "Historical survey location from 2010; confirm current access and landscape.",
    "source_urls": [
      "https://dragonflyfund.org/en/idf-report-29-2010-english/"
    ],
    "description": "The Ream recreation-centre point is a historical coastal biodiversity survey locality. It provides a reference for the wider coastal landscape; its modern access and surroundings require confirmation.",
    "mineralogy": "No site-specific lithology or mineral analysis supplied",
    "gallery": [],
    "nameKm": "តំបន់មជ្ឈមណ្ឌលកម្សាន្តរាម (ខេត្តព្រះសីហនុ)",
    "province": {
      "en": "Preah Sihanouk",
      "km": "ព្រះសីហនុ"
    },
    "era": "Mesozoic – Cenozoic",
    "narrative": {
      "overview": "The Ream recreation-centre point is a historical coastal biodiversity survey locality. It provides a reference for the wider coastal landscape; its modern access and surroundings require confirmation.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Preah Sihanouk. Bedrock exposures belong to Mesozoic – Cenozoic, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តព្រះសីហនុ។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Mesozoic – Cenozoic ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "No site-specific lithology or mineral analysis supplied",
      "provenanceNote": "Basis: Converted published DMS coordinate. Source: Kosterin 2010, p.55."
    }
  },
  {
    "id": "koh-paur-dinosaur-fossil-site-in-koh-kong",
    "name": "Koh Paur Dinosaur Fossil Site in Koh Kong",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      103.0245,
      11.5368
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Published discovery site coordinates and island location. Source: Lim et al. 2023.",
    "original_coordinate_expression": "Original coordinate expression: Koh Paur island, Koh Kong Province.",
    "coordinate_notes": "Discovery locality of Cambodia’s first dinosaur (Lower Cretaceous sauropod fibula MOEC-1).",
    "source_urls": [
      "https://doi.org/10.3390/fossils1010006"
    ],
    "description": "Koh Paur preserves a sauropod fibula from continental Lower Cretaceous sandstone. Published figures show the fossil in its host rock and cross-bedded sandstone, linking sedimentary environments with Cambodia’s dinosaur record.",
    "mineralogy": "Sandstone of the Grès Supérieurs; fossil bone MOEC-1",
    "gallery": [
      {
        "src": "images/figure-40-1.webp",
        "caption": "Figure 40. Cross-bedded sandstone in the lower part of the Grès Supérieurs on Koh Paur Island, Koh Kong Province.",
        "credit": "Source: Buffetaut et al. (2024), Fossil-bearing non-marine Mesozoic formations of south-western Cambodia, Proceedings of GEOSEA 2024, Khon Kaen, 55–63, Figure 1. Credit: Buffetaut et al. 2024.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1194,
        "height": 482,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 40
      },
      {
        "src": "images/figure-44-1.webp",
        "caption": "Figure 44. Sauropod dinosaur fibula in situ in greyish-brown sandstone of the lower part of the Grès Supérieurs at Koh Paur Island, Koh Kong Province.",
        "credit": "Source: Buffetaut et al. (2024), Fossil-bearing non-marine Mesozoic formations of south-western Cambodia, Proceedings of GEOSEA 2024, Khon Kaen, 55–63, Figure 5. Credit: Buffetaut et al. 2024.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 624,
        "height": 243,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 44
      }
    ],
    "nameKm": "ទីតាំងផូស៊ីលដាយណូស័រ កោះប៉ោ (ខេត្តកោះកុង)",
    "province": {
      "en": "Koh Kong",
      "km": "កោះកុង"
    },
    "era": "Early Cretaceous Continental Fluvial (Sauropod)",
    "narrative": {
      "overview": "Koh Paur preserves a sauropod fibula from continental Lower Cretaceous sandstone. Published figures show the fossil in its host rock and cross-bedded sandstone, linking sedimentary environments with Cambodia’s dinosaur record.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Koh Kong. Bedrock exposures belong to Early Cretaceous Continental Fluvial (Sauropod), recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តកោះកុង។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Early Cretaceous Continental Fluvial (Sauropod) ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Sandstone of the Grès Supérieurs; fossil bone MOEC-1",
      "provenanceNote": "Basis: Published discovery site coordinates and island location. Source: Lim et al. 2023."
    }
  },
  {
    "id": "koh-moul-mesozoic-fossil-horizon-in-koh-kong",
    "name": "Koh Moul Mesozoic Fossil Horizon in Koh Kong",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      103.008,
      11.712
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "coordinate_conflict_hold",
    "publish_pin": false,
    "coordinate_source": "Basis: Published geological survey locality. Source: Buffetaut et al. 2024.",
    "original_coordinate_expression": "Original coordinate expression: Koh Moul island, Koh Kong Province.",
    "coordinate_notes": "Continental Mesozoic sandstone exposures yielding fossil freshwater turtles and fossil wood. HOLD: Tong et al. 2026 describes Koh Moul about 30 km south of Koh Kong and Koh Paur about 30 km north of Koh Moul. Catalogue latitude 11.712 is north of its Koh Paur latitude 11.5368. https://doi.org/10.3390/d18050249",
    "source_urls": [
      "https://www.researchgate.net/publication/379404387_Fossil-bearing_non-marine_Mesozoic_formations_of_south-western_Cambodia"
    ],
    "description": "Intertidal beds at Koh Moul preserve turtle remains and fossil wood. Published specimen plates and the site map support palaeontological interpretation. The catalogue coordinate conflicts with the published geographic description and is withheld from the upload layer.",
    "mineralogy": "Sandstone, siltstone and mudstone; fossil turtle and conifer-type wood",
    "gallery": [
      {
        "src": "images/figure-45-1.webp",
        "caption": "Figure 45. (A) Geographical position of Koh Moul in south-western Cambodia; (B) location of the fossil site on Koh Moul; (C) conifer-type fossil wood (tracheidoxyl); (D) turtle bridge peripherals (MOEC-4) before preparation; (E, F) beach outcrop of the fossil site at low tide. Scale bar = 5 cm.",
        "credit": "Source: Tong et al. (2026), Turtle remains from Koh Moul (SW Cambodia) and their stratigraphical implications, Diversity 18(5), 249, Figure 1. Credit: Tong et al. 2026 (CC BY 4.0).",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1223,
        "height": 1469,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 45
      },
      {
        "src": "images/figure-46-1.webp",
        "caption": "Figure 46. Turtle shell fragments in cross-section in greenish-grey sandstone in the lower part of the Grès Supérieurs, Koh Moul Island, Koh Kong Province. Scale bar = 10 mm.",
        "credit": "Source: Buffetaut et al. (2024), Proceedings of GEOSEA 2024, Khon Kaen, 55–63, Figure 6. Credit: Buffetaut et al. 2024.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 527,
        "height": 337,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 46
      },
      {
        "src": "images/figure-47-1.webp",
        "caption": "Figure 47. Turtle specimens from Koh Moul: (A, B) entoplastron (MOEC-2) in ventral and dorsal views; (C–E) bridge peripherals (MOEC-4) in dorsal, ventral and anterior views; (F, G) costal fragment (MOEC-3) and close-up of its ornamentation. Red arrows indicate scars. Scale bar = 5 cm.",
        "credit": "Source: Tong et al. (2026), Turtle remains from Koh Moul (SW Cambodia) and their stratigraphical implications, Diversity 18(5), 249, Figure 2. Credit: Tong et al. 2026 (CC BY 4.0).",
        "source_urls": [
          "https://doi.org/10.3390/d18050249"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1223,
        "height": 1367,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 47
      }
    ],
    "nameKm": "ស្រទាប់ផូស៊ីលមេសូសូអ៊ិក កោះមូល (ខេត្តកោះកុង)",
    "province": {
      "en": "Koh Kong",
      "km": "កោះកុង"
    },
    "era": "Mesozoic (Cretaceous) Fluvial-Lacustrine",
    "narrative": {
      "overview": "Intertidal beds at Koh Moul preserve turtle remains and fossil wood. Published specimen plates and the site map support palaeontological interpretation. The catalogue coordinate conflicts with the published geographic description and is withheld from the upload layer.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Koh Kong. Bedrock exposures belong to Mesozoic (Cretaceous) Fluvial-Lacustrine, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តកោះកុង។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Mesozoic (Cretaceous) Fluvial-Lacustrine ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Sandstone, siltstone and mudstone; fossil turtle and conifer-type wood",
      "provenanceNote": "Basis: Published geological survey locality. Source: Buffetaut et al. 2024."
    }
  },
  {
    "id": "phnom-khley-black-shale-section-in-kampot",
    "name": "Phnom Khley Black Shale Section in Kampot",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.385,
      10.612
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Published measured section. Source: Heng et al. 2022.",
    "original_coordinate_expression": "Original coordinate expression: Phnom Khley, Kampot Province.",
    "coordinate_notes": "100 m long by 50 m high section of interbedded sandstone and organic black shale in Bokor Formation.",
    "source_urls": [
      "https://doi.org/10.11648/j.ogce.20221004.11"
    ],
    "description": "At Phnom Khley, black shale occurs between sandstone beds of the Bokor Formation. Organic microscopy and measured sections document the sedimentary succession; the multi-site figures include other Kampot sections.",
    "mineralogy": "Alginite and bituminite are organic macerals; pyrite is a mineral reported in the study",
    "gallery": [
      {
        "src": "images/figure-32-1.webp",
        "caption": "Figure 32. Published study location map of black shale outcrops in Kampot Province, southern Cambodia.",
        "credit": "Source: Heng et al. (2022), International Journal of Oil, Gas and Coal Engineering 10(4), 90–96, Figure 1. Credit: Heng et al. 2022.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1141,
        "height": 807,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 32
      },
      {
        "src": "images/figure-33-1.webp",
        "caption": "Figure 33. Outcrop photographs of Bokor Formation shale, interbedded sandstones, and marine invertebrate fossils.",
        "credit": "Source: Heng et al. (2022), International Journal of Oil, Gas and Coal Engineering 10(4), 90–96, Figure 2. Credit: Heng et al. 2022.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 746,
        "height": 771,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 33
      },
      {
        "src": "images/figure-34-1.webp",
        "caption": "Figure 34. Photomicrographs of shale macerals in the Bokor Formation taken under reflected white light.",
        "credit": "Source: Heng et al. (2022), International Journal of Oil, Gas and Coal Engineering 10(4), 90–96, Figure 4. Credit: Heng et al. 2022.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 572,
        "height": 788,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 34
      },
      {
        "src": "images/figure-35-1.webp",
        "caption": "Figure 35. Stratigraphic columns of the Bokor Formation outcrop sections in Kampot Province: (A) Phnom Khley, (B) Phnom Chakrey and (C) Phnom Monprey. Red stars mark the stratigraphic positions of the analysed samples.",
        "credit": "Source: Heng et al. (2022), International Journal of Oil, Gas and Coal Engineering 10(4), 90–96, Figure 3. Credit: Heng et al. 2022.",
        "source_urls": [
          "https://doi.org/10.11648/j.ogce.20221004.11"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1344,
        "height": 936,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 35
      }
    ],
    "nameKm": "ស្រទាប់ថ្មសែលខ្មៅ ភ្នំខ្លី (ខេត្តកំពត)",
    "province": {
      "en": "Kampot",
      "km": "កំពត"
    },
    "era": "Permian – Triassic Marine to Continental Shales",
    "narrative": {
      "overview": "At Phnom Khley, black shale occurs between sandstone beds of the Bokor Formation. Organic microscopy and measured sections document the sedimentary succession; the multi-site figures include other Kampot sections.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Kampot. Bedrock exposures belong to Permian – Triassic Marine to Continental Shales, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តកំពត។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Permian – Triassic Marine to Continental Shales ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Alginite and bituminite are organic macerals; pyrite is a mineral reported in the study",
      "provenanceNote": "Basis: Published measured section. Source: Heng et al. 2022."
    }
  },
  {
    "id": "phnom-monprey-section-in-kampot",
    "name": "Phnom Monprey Section in Kampot",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.421,
      10.635
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Published outcrop section. Source: Heng et al. 2022.",
    "original_coordinate_expression": "Original coordinate expression: Phnom Monprey, Kampot Province.",
    "coordinate_notes": "Dark grey limestone and shale section preserving fossil Syringopora tabulate corals.",
    "source_urls": [
      "https://doi.org/10.11648/j.ogce.20221004.11"
    ],
    "description": "The Phnom Monprey section contains limestone and shale with reported Syringopora corals. Published outcrop photographs, stratigraphic columns and organic microscopy connect marine fossils with the Bokor Formation study.",
    "mineralogy": "Limestone and shale; organic macerals reported in the source study",
    "gallery": [
      {
        "src": "images/figure-32-1.webp",
        "caption": "Figure 32. Published study location map of black shale outcrops in Kampot Province, southern Cambodia.",
        "credit": "Source: Heng et al. (2022), International Journal of Oil, Gas and Coal Engineering 10(4), 90–96, Figure 1. Credit: Heng et al. 2022.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1141,
        "height": 807,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 32
      },
      {
        "src": "images/figure-33-1.webp",
        "caption": "Figure 33. Outcrop photographs of Bokor Formation shale, interbedded sandstones, and marine invertebrate fossils.",
        "credit": "Source: Heng et al. (2022), International Journal of Oil, Gas and Coal Engineering 10(4), 90–96, Figure 2. Credit: Heng et al. 2022.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 746,
        "height": 771,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 33
      },
      {
        "src": "images/figure-34-1.webp",
        "caption": "Figure 34. Photomicrographs of shale macerals in the Bokor Formation taken under reflected white light.",
        "credit": "Source: Heng et al. (2022), International Journal of Oil, Gas and Coal Engineering 10(4), 90–96, Figure 4. Credit: Heng et al. 2022.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 572,
        "height": 788,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 34
      },
      {
        "src": "images/figure-35-1.webp",
        "caption": "Figure 35. Stratigraphic columns of the Bokor Formation outcrop sections in Kampot Province: (A) Phnom Khley, (B) Phnom Chakrey and (C) Phnom Monprey. Red stars mark the stratigraphic positions of the analysed samples.",
        "credit": "Source: Heng et al. (2022), International Journal of Oil, Gas and Coal Engineering 10(4), 90–96, Figure 3. Credit: Heng et al. 2022.",
        "source_urls": [
          "https://doi.org/10.11648/j.ogce.20221004.11"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 1344,
        "height": 936,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 35
      }
    ],
    "nameKm": "កំណាត់សិលាភ្នំមនព្រៃ - ផ្កាថ្មស៊ីរីងហ្គោប៉ូរ៉ា (ខេត្តកំពត)",
    "province": {
      "en": "Kampot",
      "km": "កំពត"
    },
    "era": "Early Permian Marine (Syringopora Horizon)",
    "narrative": {
      "overview": "The Phnom Monprey section contains limestone and shale with reported Syringopora corals. Published outcrop photographs, stratigraphic columns and organic microscopy connect marine fossils with the Bokor Formation study.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Kampot. Bedrock exposures belong to Early Permian Marine (Syringopora Horizon), recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តកំពត។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Early Permian Marine (Syringopora Horizon) ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Limestone and shale; organic macerals reported in the source study",
      "provenanceNote": "Basis: Published outcrop section. Source: Heng et al. 2022."
    }
  },
  {
    "id": "bokor-plateau-sandstone-and-cloud-forest-in-kampot",
    "name": "Bokor Plateau Sandstone and Cloud Forest in Kampot",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      104.025,
      10.627
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "indicative_source_position",
    "publish_pin": true,
    "coordinate_source": "Basis: Published botanical and geomorphological survey midpoint. Source: Rundel & Middleton 2017.",
    "original_coordinate_expression": "Original coordinate expression: Bokor Plateau, Preah Monivong National Park.",
    "coordinate_notes": "High-altitude (~1,000 m) quartz sandstone plateau with stunted cloud forest and 22 endemic plant species.",
    "source_urls": [
      "https://cdn.angkordatabase.asia/libs/docs/2017-floraoftheBokorPlateau.pdf"
    ],
    "description": "The Bokor sandstone plateau supports stunted forest, wetland and sphagnum bog habitats. Nutrient-poor sandy substrates and drainage help explain the vegetation mosaic. The gallery includes historical escarpment and forest photographs.",
    "mineralogy": "Quartz-rich sandstone; sandy weathering products",
    "gallery": [
      {
        "src": "images/figure-36-1.webp",
        "caption": "Figure 36. South-facing sandstone escarpment of the Bokor Plateau looking out to the Gulf of Thailand, with Phu Quoc Island (Vietnam) in the distance, March 2001.",
        "credit": "Source: Rundel & Middleton (2017), Cambodian Journal of Natural History 2017(1), 17–37, Figure 1. Credit: © Rasoul Sharifi.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 472,
        "height": 620,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 36
      },
      {
        "src": "images/figure-37-1.webp",
        "caption": "Figure 37. Stunted forest of the Bokor Plateau with emergent trees of Dacrydium elatum, March 2001.",
        "credit": "Source: Rundel & Middleton (2017), Cambodian Journal of Natural History 2017(1), 17–37, Figure 2. Credit: © Philip Rundel.",
        "source_urls": [
          "https://cdn.angkordatabase.asia/libs/docs/2017-floraoftheBokorPlateau.pdf"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 473,
        "height": 340,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 37
      },
      {
        "src": "images/figure-38-1.webp",
        "caption": "Figure 38. Transition from montane wet evergreen forest to stunted forest near Popokvil Waterfall on the Bokor Plateau, March 2001.",
        "credit": "Source: Rundel & Middleton (2017), Cambodian Journal of Natural History 2017(1), 17–37, Figure 3. Credit: © Rasoul Sharifi.",
        "source_urls": [],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 473,
        "height": 620,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 38
      },
      {
        "src": "images/figure-39-1.webp",
        "caption": "Figure 39. Sphagnum bog and seasonally waterlogged wetland on white sandy soil in poorly drained areas of the Bokor Plateau, March 2001.",
        "credit": "Source: Rundel & Middleton (2017), Cambodian Journal of Natural History 2017(1), 17–37, Figure 4. Credit: © Rasoul Sharifi.",
        "source_urls": [
          "https://cdn.angkordatabase.asia/libs/docs/2017-floraoftheBokorPlateau.pdf"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 469,
        "height": 341,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 39
      },
      {
        "src": "images/figure-23-1.webp",
        "caption": "Figure 23. Bokor hill station landscape photographed in 2010.",
        "credit": "Source: Kosterin (2010), IDF-Report 29, 1–75, Figure 31, PDF page 42. Credit: Oleg E. Kosterin; Kosterin 2010, Figure 31.",
        "source_urls": [
          "https://dragonflyfund.org/en/idf-report-29-2010-english/"
        ],
        "scope": "Published figure; may include regional context or multiple sites",
        "reuse_status": "User confirmed all catalogue images free to use on 2026-10-23",
        "width": 966,
        "height": 667,
        "relationship": "site or regional context as stated in caption",
        "catalogue_figure": 23
      }
    ],
    "nameKm": "ថ្មភក់ និងព្រៃពពកខ្ពង់រាបបូកគោ (ខេត្តកំពត)",
    "province": {
      "en": "Kampot",
      "km": "កំពត"
    },
    "era": "Early Cretaceous Bokor Formation",
    "narrative": {
      "overview": "The Bokor sandstone plateau supports stunted forest, wetland and sphagnum bog habitats. Nutrient-poor sandy substrates and drainage help explain the vegetation mosaic. The gallery includes historical escarpment and forest photographs.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Kampot. Bedrock exposures belong to Early Cretaceous Bokor Formation, recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តកំពត។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Early Cretaceous Bokor Formation ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Quartz-rich sandstone; sandy weathering products",
      "provenanceNote": "Basis: Published botanical and geomorphological survey midpoint. Source: Rundel & Middleton 2017."
    }
  },
  {
    "id": "phnom-sampeu-la-ang-pracheu-bat-cave-in-battambang",
    "name": "Phnom Sampeu La Ang Pracheu bat cave in Battambang",
    "type": "geosite",
    "designation": "Research or heritage locality; no geopark designation asserted",
    "coordinates": [
      103.099832,
      13.026548
    ],
    "coordinate_order": "longitude, latitude",
    "crs": "EPSG:4326 interpreted from catalogue",
    "coordinate_status": "datum_unconfirmed",
    "publish_pin": true,
    "coordinate_source": "Basis: Published GPS observation. Source: Karst Biodiversity Report 2026, p.17, Table 1, C-32.",
    "original_coordinate_expression": "Original coordinate expression: 13.026548 N, 103.099832 E.",
    "coordinate_notes": "A named cave record, not entire hill boundary. Report coordinate datum not explicitly verified; WGS84 interpretation requires confirmation.",
    "source_urls": [
      "https://www.fauna-flora.org/wp-content/uploads/2026/03/fauna-flora-karst-biodiversity-report-2026.pdf"
    ],
    "description": "La Ang Pracheu is a named bat cave at Phnom Sampeu. The limestone hill links cave development, bat habitat and cultural heritage. The source report’s coordinate datum remains unconfirmed.",
    "mineralogy": "Limestone karst; no site-specific mineral analysis",
    "gallery": [
      {
        "src": "images/user-image-1.png",
        "caption": "Phnom Sampeu: cliff carvings beside a rock opening.",
        "credit": "Visible credit: CamNess / Ky Chamna.",
        "source_urls": [],
        "scope": "Phnom Sampeu locality supplied by user",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 1279,
        "height": 1280,
        "relationship": "site image supplied by user",
        "user_attachment_number": 1
      },
      {
        "src": "images/user-image-2.png",
        "caption": "Phnom Sampeu: reclining and seated Buddha carvings on the cliff face.",
        "credit": "User-supplied photograph; photographer not identified in the supplied image.",
        "source_urls": [],
        "scope": "Phnom Sampeu locality supplied by user",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 2555,
        "height": 2233,
        "relationship": "site image supplied by user",
        "user_attachment_number": 2
      },
      {
        "src": "images/user-image-3.png",
        "caption": "La Ang Pracheu, Phnom Sampeu: bats emerging above the cave and limestone cliff.",
        "credit": "User-supplied photograph; photographer not identified in the supplied image.",
        "source_urls": [],
        "scope": "Phnom Sampeu locality supplied by user",
        "reuse_status": "User supplied for website use on 2026-10-23",
        "width": 900,
        "height": 600,
        "relationship": "site image supplied by user",
        "user_attachment_number": 3
      }
    ],
    "nameKm": "រូងប្រចៀវល្អាងប្រចៀវ ភ្នំសំពៅ (ខេត្តបាត់ដំបង)",
    "province": {
      "en": "Battambang",
      "km": "បាត់ដំបង"
    },
    "era": "Permian Karst (Ratburi Limestone equivalent)",
    "narrative": {
      "overview": "La Ang Pracheu is a named bat cave at Phnom Sampeu. The limestone hill links cave development, bat habitat and cultural heritage. The source report’s coordinate datum remains unconfirmed.",
      "geologicalSetting": "The geosite represents a prominent element within Cambodia's regional geoscience architecture in Battambang. Bedrock exposures belong to Permian Karst (Ratburi Limestone equivalent), recording pivotal depositional, tectonic, or volcanic episodes in mainland Southeast Asia. Field evidence demonstrates distinct lithological contacts, weathering landforms, and surface drainage networks connecting bedrock topography with regional ecology.",
      "geologicalSettingKm": "ភូគព្ភស្ថាននេះជាចំណុចគន្លឹះមួយក្នុងស្ថាបត្យកម្មភូគព្ភសាស្ត្រតំបន់នៃខេត្តបាត់ដំបង។ កំណកសិលាស្ថិតក្នុងយុគសម័យ Permian Karst (Ratburi Limestone equivalent) ដែលឆ្លុះបញ្ចាំងពីដំណាក់កាលកកើតសិលា បម្រែបម្រួលផ្លាកតិចតូនិច ឬសកម្មភាពភ្នំភ្លើងដ៏សំខាន់នៅតំបន់អាស៊ីអាគ្នេយ៍ដីគោក។ ភស្តុតាងនៅទីវាលបង្ហាញពីស្រទាប់សិលា និងទម្រង់ធារទឹកតភ្ជាប់ជាមួយប្រព័ន្ធអេកូឡូស៊ីតំបន់។",
      "mineralogyNote": "Limestone karst; no site-specific mineral analysis",
      "provenanceNote": "Basis: Published GPS observation. Source: Karst Biodiversity Report 2026, p.17, Table 1, C-32."
    }
  }
];
