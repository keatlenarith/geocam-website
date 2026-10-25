import type { FeatureCollection } from "geojson";
import type { MapSymbol, LineStyle } from "./import-geodata";

export interface LayerSymbology {
  visible: boolean;
  opacity: number; // 0 to 1
  color: string; // Stroke / border / point outline color
  fillColor: string; // Polygon or point fill color
  strokeWidth: number; // 1 to 20 px
  lineStyle: LineStyle; // "solid" | "dashed" | "dotted" | "dash-dot"
  symbol: MapSymbol; // "circle" | "diamond" | "mine" | "drillhole" | "quarry" | "triangle" | "square" | "star" | "hexagon" | "cross" | "pin" | "strike-dip"
  symbolSize: number; // 6 to 64 px
  original?: boolean; // whether to preserve source KML styles
}

export interface TocLayerItem {
  id: string;
  nameEn: string;
  nameKm: string;
  category:
    | "geology"
    | "faults"
    | "minerals"
    | "marine"
    | "hazards"
    | "geosites"
    | "potential-zones"
    | "other";
  geometryType: "Polygon" | "LineString" | "Point";
  featureCount: number;
  descriptionEn: string;
  descriptionKm: string;
  isBuiltin: boolean;
  sourceDatasetId?: string; // If uploaded from geocam_map_layers
  symbology: LayerSymbology;
  geojson?: FeatureCollection;
}

export interface TocCategoryGroup {
  id: TocLayerItem["category"];
  labelEn: string;
  labelKm: string;
  iconName: string;
  badgeColor: string;
}

export const TOC_CATEGORIES: TocCategoryGroup[] = [
  {
    id: "geology",
    labelEn: "Bedrock Geology & Formations",
    labelKm: "ភូគព្ភសាស្ត្រគ្រឹះ និងស្រទាប់ថ្ម",
    iconName: "Layers",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "faults",
    labelEn: "Faults & Structural Lineaments",
    labelKm: "ខ្សែរចនាសម្ព័ន្ធ និងប្រេះស្រាំ",
    iconName: "GitCommit",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  {
    id: "minerals",
    labelEn: "Mineral Deposits & Mining",
    labelKm: "ជម្រករ៉ែ និងអាជីវកម្មរ៉ែ",
    iconName: "Pickaxe",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "marine",
    labelEn: "Marine & Coastal Geology",
    labelKm: "ភូគព្ភសាស្ត្រសមុទ្រ និងឆ្នេរ",
    iconName: "Waves",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "hazards",
    labelEn: "Geohazards & Seismic Monitoring",
    labelKm: "គ្រោះភូគព្ភសាស្ត្រ និងរញ្ជួយដី",
    iconName: "Activity",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  },
  {
    id: "geosites",
    labelEn: "Geoparks & Natural Heritage",
    labelKm: "ឧទ្យានភូគព្ភសាស្ត្រ និងបេតិកភណ្ឌ",
    iconName: "Compass",
    badgeColor: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  },
  {
    id: "potential-zones",
    labelEn: "Exploration Potential Zones",
    labelKm: "តំបន់សក្ដានុពលរុករក",
    iconName: "Target",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "other",
    labelEn: "Uploaded & Other Data",
    labelKm: "ទិន្នន័យបញ្ចូល និងផ្សេងៗ",
    iconName: "FolderOpen",
    badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  },
];

// Built-in GeoJSON collections for Cambodia
export const BUILTIN_GEOLOGY_GEOJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Mesozoic Sandstone Uplands (Cardamom & Dângrêk Ranges)",
        nameKm: "តំបន់ខ្ពង់រាបថ្មខ្សាច់មេសូសូអ៊ិក (ជួរភ្នំក្រវាញ និងដងរែក)",
        formation: "Khorat Group equivalent continental sandstone",
        age: "Triassic–Cretaceous",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [102.6, 12.9],
            [103.9, 12.4],
            [104.0, 11.2],
            [103.2, 10.9],
            [102.6, 11.6],
            [102.6, 12.9],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Quaternary Alluvium (Mekong Basin & Tonle Sap Floodplain)",
        nameKm: "ដីល្បាប់ក្វាតឺណារី (អាងទន្លេមេគង្គ និងទំនាបបឹងទន្លេសាប)",
        formation: "Fluvial & lacustrine silt, clay, sand",
        age: "Holocene–Pleistocene",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [103.6, 13.3],
            [104.6, 12.6],
            [105.3, 11.4],
            [105.0, 10.6],
            [104.4, 11.3],
            [103.6, 12.6],
            [103.6, 13.3],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Cenozoic Basalt Volcanic Plateau (Ratanakiri & Mondulkiri)",
        nameKm: "ខ្ពង់រាបភ្នំភ្លើងបាសាល់សេណូសូអ៊ិក (រតនគិរី និងមណ្ឌលគិរី)",
        formation: "Tholeiitic to alkali continental flood basalts",
        age: "Neogene–Quaternary",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [106.6, 14.1],
            [107.4, 13.9],
            [107.5, 12.6],
            [106.8, 12.4],
            [106.6, 14.1],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Paleozoic–Mesozoic Granitic Intrusions (Kampot & Takeo)",
        nameKm: "ថ្មក្រានីតជ្រៀតចូលប៉ាលេអូសូអ៊ិក-មេសូសូអ៊ិក (កំពត និងតាកែវ)",
        formation: "Biotite granite and granodiorite plutons",
        age: "Permian–Cretaceous",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [104.2, 11.0],
            [104.4, 10.6],
            [104.9, 10.7],
            [104.7, 11.1],
            [104.2, 11.0],
          ],
        ],
      },
    },
  ],
};

export const BUILTIN_FAULTS_GEOJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Mekong River Regional Shear Fault Zone",
        nameKm: "តំបន់ខ្សែបន្ទាត់ប្រេះស្រាំទន្លេមេគង្គ",
        type: "Regional strike-slip shear zone",
        status: "Major tectonic suture lineament",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [103.0, 14.3],
          [104.2, 13.1],
          [105.6, 12.0],
          [105.8, 11.2],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Cardamom Southern Thrust & Fault System",
        nameKm: "ប្រព័ន្ធបន្ទាត់កំហុសក្រវាញខាងត្បូង",
        type: "Thrust fault system",
        status: "Mesozoic accretionary boundary",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [105.9, 13.6],
          [106.4, 12.8],
          [107.0, 11.4],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Tonle Sap Inferred Basement Boundary",
        nameKm: "ខ្សែបន្ទាត់រចនាសម្ព័ន្ធបាតអាងទន្លេសាប",
        type: "Extensional rift fault",
        status: "Subsurface tectonic contact",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [102.8, 13.8],
          [103.8, 13.0],
          [104.6, 12.3],
          [105.2, 11.1],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Elephant Range Coastal Lineament",
        nameKm: "ខ្សែបន្ទាត់ឆ្នេរជួរភ្នំដំរី",
        type: "Fault lineament",
        status: "Coastal structural trend",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [102.9, 11.8],
          [103.5, 11.2],
          [104.1, 10.7],
        ],
      },
    },
  ],
};

export const BUILTIN_MINERALS_GEOJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Okvau Gold Project (Mondulkiri)",
        nameKm: "គម្រោងរ៉ែមាសអូខ្វាវ (មណ្ឌលគិរី)",
        commodity: "Gold (Au)",
        depositType: "Reduced Intrusion-Related Gold (IRGS)",
      },
      geometry: { type: "Point", coordinates: [107.12, 12.92] },
    },
    {
      type: "Feature",
      properties: {
        name: "Snoul Gold-Copper Prospect (Kratie)",
        nameKm: "ទីតាំងរ៉ែមាស-ទង់ដែងស្នួល (ក្រចេះ)",
        commodity: "Gold, Copper (Au-Cu)",
        depositType: "Epithermal quartz-vein system",
      },
      geometry: { type: "Point", coordinates: [106.45, 12.18] },
    },
    {
      type: "Feature",
      properties: {
        name: "Romchek Copper-Gold Occurrence (Siem Reap)",
        nameKm: "រ៉ែទង់ដែង-មាសរំចេក (សៀមរាប)",
        commodity: "Copper, Gold (Cu-Au)",
        depositType: "Porphyry-skarn transition",
      },
      geometry: { type: "Point", coordinates: [103.95, 13.38] },
    },
    {
      type: "Feature",
      properties: {
        name: "Phnom Deck / Chhep Iron Deposit (Preah Vihear)",
        nameKm: "រ៉ែដែកភ្នំដែក / ឆែប (ព្រះវិហារ)",
        commodity: "Iron Ore (Fe)",
        depositType: "Contact metasomatic skarn magnetite",
      },
      geometry: { type: "Point", coordinates: [105.28, 13.78] },
    },
    {
      type: "Feature",
      properties: {
        name: "Haut Chhlong Bauxite Plateau (Mondulkiri)",
        nameKm: "ខ្ពង់រ៉ែបុកស៊ីតអូឆ្លង (មណ្ឌលគិរី)",
        commodity: "Bauxite (Al)",
        depositType: "Lateritic weathering over basalt",
      },
      geometry: { type: "Point", coordinates: [107.35, 12.45] },
    },
    {
      type: "Feature",
      properties: {
        name: "Pailin Gemstone Gravels (Pailin)",
        nameKm: "តំបន់រ៉ែត្បូងទទឹម និងកែវកណ្ដៀងប៉ៃលិន",
        commodity: "Ruby, Sapphire, Zircon",
        depositType: "Alkali-basalt placer gravels",
      },
      geometry: { type: "Point", coordinates: [102.61, 12.85] },
    },
    {
      type: "Feature",
      properties: {
        name: "Kampot Industrial High-Calcium Limestone (Kampot)",
        nameKm: "ថ្មកំបោរឧស្សាហកម្មកាល់ស្យូមខ្ពស់ (កំពត)",
        commodity: "Limestone (CaCO3)",
        depositType: "Permian marine carbonate karst",
      },
      geometry: { type: "Point", coordinates: [104.3, 10.65] },
    },
    {
      type: "Feature",
      properties: {
        name: "Koh Kong Silica Sand Deposit (Koh Kong)",
        nameKm: "រ៉ែខ្សាច់ស៊ីលីកាកោះកុង",
        commodity: "High-purity silica sand (SiO2)",
        depositType: "Coastal marine littoral beach placer",
      },
      geometry: { type: "Point", coordinates: [103.02, 11.55] },
    },
  ],
};

export const BUILTIN_MARINE_GEOJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Sihanoukville Coastal Geo-Environmental Survey Zone (2018)",
        nameKm: "តំបន់អង្កេតភូគព្ភបរិស្ថានឆ្នេរសមុទ្រក្រុងព្រះសីហនុ",
        project: "CGS–GDMR Collaborative Coastal Mapping",
        depthRange: "0 to -30m",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [103.45, 10.72],
            [103.62, 10.68],
            [103.58, 10.48],
            [103.35, 10.52],
            [103.45, 10.72],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Gulf of Thailand Continental Shelf Sediment Sector",
        nameKm: "តំបន់កករដីល្បាប់បាតសមុទ្រឈូងសមុទ្រកម្ពុជា",
        sedimentType: "Fine sand, silty clay, and carbonate shell fragments",
        bathymetry: "-20m to -50m isobath",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [102.8, 10.3],
            [103.3, 10.2],
            [103.6, 9.8],
            [102.5, 9.9],
            [102.8, 10.3],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Inner Shelf 20-Metre Bathymetry Isobath Contour",
        nameKm: "ខ្សែបន្ទាត់ជម្រៅទឹកសមុទ្រ ២០ ម៉ែត្រ",
        depth: "20 m below mean sea level",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [102.75, 10.9],
          [103.1, 10.55],
          [103.4, 10.3],
          [103.8, 10.15],
        ],
      },
    },
  ],
};

export const BUILTIN_HAZARDS_GEOJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Phnom Penh National Seismic Station (PPKH)",
        nameKm: "ស្ថានីយតាមដានរញ្ជួយដីជាតិរាជធានីភ្នំពេញ (PPKH)",
        sensor: "Broadband Triaxial Seismometer",
        network: "Cambodia National Seismic Network",
      },
      geometry: { type: "Point", coordinates: [104.92, 11.56] },
    },
    {
      type: "Feature",
      properties: {
        name: "Siem Reap Heritage Seismic Sensor (SRPKH)",
        nameKm: "ឧបករណ៍តាមដានរញ្ជួយដីតំបន់បេតិកភណ្ឌសៀមរាប (SRPKH)",
        sensor: "Short-period accelerometer",
        network: "Angkor Seismic Monitor",
      },
      geometry: { type: "Point", coordinates: [103.86, 13.36] },
    },
    {
      type: "Feature",
      properties: {
        name: "Ratanakiri Volcanic Field Seismic Node (RTNK)",
        nameKm: "ស្ថានីយរញ្ជួយដីតំបន់ភ្នំភ្លើងរតនគិរី (RTNK)",
        sensor: "Broadband digitizer",
        network: "Eastern Highland Monitor",
      },
      geometry: { type: "Point", coordinates: [107.0, 13.74] },
    },
    {
      type: "Feature",
      properties: {
        name: "Sihanoukville Coastal Marine Sensor (SHNV)",
        nameKm: "ស្ថានីយតាមដានរលក និងរញ្ជួយដីឆ្នេរព្រះសីហនុ (SHNV)",
        sensor: "Coastal hydrodynamic & micro-seismic sensor",
        network: "Coastal Early Warning",
      },
      geometry: { type: "Point", coordinates: [103.52, 10.62] },
    },
    {
      type: "Feature",
      properties: {
        name: "Historic Micro-Tremor Epicenter (Tonle Sap Basin M2.8)",
        nameKm: "ចំណុចកណ្តាលរំញ័រដីកម្រិតស្រាលអាងទន្លេសាប (M2.8)",
        magnitude: "M 2.8",
        depth: "10 km",
      },
      geometry: { type: "Point", coordinates: [104.45, 12.82] },
    },
    {
      type: "Feature",
      properties: {
        name: "Offshore Shelf Seismic Event (Gulf of Thailand M3.1)",
        nameKm: "ព្រឹត្តិការណ៍រញ្ជួយដីបាតសមុទ្រឈូងសមុទ្រកម្ពុជា (M3.1)",
        magnitude: "M 3.1",
        depth: "12 km",
      },
      geometry: { type: "Point", coordinates: [103.1, 10.15] },
    },
  ],
};

export const BUILTIN_GEOSITES_GEOJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Phnom Kulen National Geopark Candidate Area",
        nameKm: "តំបន់បេក្ខភាពឧទ្យានភូគព្ភសាស្ត្រជាតិភ្នំគូលែន",
        geology: "Mesozoic plateau, 1000 Lingas riverbed sandstone carvings, waterfalls",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [104.05, 13.62],
            [104.18, 13.75],
            [104.32, 13.68],
            [104.15, 13.52],
            [104.05, 13.62],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Yeak Laom Volcanic Maar Crater Lake (Ratanakiri)",
        nameKm: "បឹងយក្សឡោម បឹងមាត់ភ្នំភ្លើងបុរាណ (រតនគិរី)",
        geology: "Nearly circular maar crater lake in late Cenozoic basalt",
      },
      geometry: { type: "Point", coordinates: [107.02, 13.73] },
    },
    {
      type: "Feature",
      properties: {
        name: "Kampot Permian Karst Tower Geosite",
        nameKm: "តំបន់ភ្នំកំបោរកាស្តប៉េកកំពត (ភ្នំឈ្ងោក និងភ្នំកំពង់ត្រាច)",
        geology: "Tower karst with subterranean cave labyrinths and pre-Angkorian shrines",
      },
      geometry: { type: "Point", coordinates: [104.25, 10.62] },
    },
  ],
};

// Default Toc Layer Catalog with default symbology
export const DEFAULT_TOC_LAYERS: TocLayerItem[] = [
  {
    id: "builtin_bedrock_geology",
    nameEn: "Bedrock Geology & Rock Units",
    nameKm: "ភូគព្ភសាស្ត្រគ្រឹះ និងស្រទាប់ថ្ម",
    category: "geology",
    geometryType: "Polygon",
    featureCount: 4,
    descriptionEn: "Mesozoic sandstone uplands, Quaternary alluvium, Cenozoic basalts, and granitic plutons.",
    descriptionKm: "តំបន់ខ្ពង់រាបថ្មខ្សាច់ ដីល្បាប់ក្វាតឺណារី ខ្ពង់រាបភ្នំភ្លើងបាសាល់ និងថ្មក្រានីត។",
    isBuiltin: true,
    symbology: {
      visible: true,
      opacity: 0.45,
      color: "#c98a5a",
      fillColor: "#c98a5a",
      strokeWidth: 2,
      lineStyle: "solid",
      symbol: "circle",
      symbolSize: 20,
      original: false,
    },
    geojson: BUILTIN_GEOLOGY_GEOJSON,
  },
  {
    id: "builtin_structural_faults",
    nameEn: "Fault Lines & Tectonic Lineaments",
    nameKm: "ខ្សែបន្ទាត់ប្រេះស្រាំ និងរចនាសម្ព័ន្ធធាន",
    category: "faults",
    geometryType: "LineString",
    featureCount: 4,
    descriptionEn: "Regional shear zones, strike-slip faults, and basement tectonic contacts across Cambodia.",
    descriptionKm: "ខ្សែបន្ទាត់ប្រេះស្រាំទន្លេមេគង្គ ប្រព័ន្ធបន្ទាត់កំហុសក្រវាញ និងខ្សែបាតអាងទន្លេសាប។",
    isBuiltin: true,
    symbology: {
      visible: true,
      opacity: 0.9,
      color: "#dc2626",
      fillColor: "#dc2626",
      strokeWidth: 3,
      lineStyle: "dashed",
      symbol: "circle",
      symbolSize: 18,
      original: false,
    },
    geojson: BUILTIN_FAULTS_GEOJSON,
  },
  {
    id: "builtin_mineral_deposits",
    nameEn: "Mineral Occurrences & Deposit Sites",
    nameKm: "ទីតាំង និងជម្រករ៉ែសំខាន់ៗ",
    category: "minerals",
    geometryType: "Point",
    featureCount: 8,
    descriptionEn: "Gold (Okvau, Snoul), Bauxite, Iron ore, Copper, Limestone, Gemstones, and Silica sand.",
    descriptionKm: "រ៉ែមាស (អូខ្វាវ ស្នួល) បុកស៊ីត ដែក ទង់ដែង ថ្មកំបោរ ត្បូង និងខ្សាច់ស៊ីលីកា។",
    isBuiltin: true,
    symbology: {
      visible: true,
      opacity: 0.95,
      color: "#7a3b1d",
      fillColor: "#eab308",
      strokeWidth: 2,
      lineStyle: "solid",
      symbol: "diamond",
      symbolSize: 24,
      original: false,
    },
    geojson: BUILTIN_MINERALS_GEOJSON,
  },
  {
    id: "builtin_marine_coastal",
    nameEn: "Marine & Coastal Geo-Environment",
    nameKm: "ភូគព្ភសាស្ត្រសមុទ្រ និងបរិស្ថានឆ្នេរ",
    category: "marine",
    geometryType: "Polygon",
    featureCount: 3,
    descriptionEn: "Sihanoukville coastal survey atlas zone, shelf sediment zones, and bathymetric isobaths.",
    descriptionKm: "តំបន់អង្កេតឆ្នេរព្រះសីហនុ កករដីល្បាប់បាតសមុទ្រ និងខ្សែជម្រៅទឹក ២០ម។",
    isBuiltin: true,
    symbology: {
      visible: true,
      opacity: 0.4,
      color: "#0284c7",
      fillColor: "#38bdf8",
      strokeWidth: 2,
      lineStyle: "solid",
      symbol: "circle",
      symbolSize: 18,
      original: false,
    },
    geojson: BUILTIN_MARINE_GEOJSON,
  },
  {
    id: "builtin_hazards_monitoring",
    nameEn: "Seismic Stations & Earthquakes",
    nameKm: "ស្ថានីយរញ្ជួយដី និងទីតាំងរំញ័រដី",
    category: "hazards",
    geometryType: "Point",
    featureCount: 6,
    descriptionEn: "National seismic network stations (Phnom Penh, Siem Reap, Ratanakiri) and historic epicenters.",
    descriptionKm: "ស្ថានីយតាមដានរញ្ជួយដីជាតិ (ភ្នំពេញ សៀមរាប រតនគិរី ព្រះសីហនុ) និងចំណុចរំញ័រដី។",
    isBuiltin: true,
    symbology: {
      visible: true,
      opacity: 0.9,
      color: "#991b1b",
      fillColor: "#f87171",
      strokeWidth: 2,
      lineStyle: "solid",
      symbol: "triangle",
      symbolSize: 24,
      original: false,
    },
    geojson: BUILTIN_HAZARDS_GEOJSON,
  },
  {
    id: "builtin_geoparks_heritage",
    nameEn: "Geoparks & Natural Heritage Sites",
    nameKm: "ឧទ្យានភូគព្ភសាស្ត្រ និងបេតិកភណ្ឌ",
    category: "geosites",
    geometryType: "Polygon",
    featureCount: 3,
    descriptionEn: "Phnom Kulen sandstone plateau, Yeak Laom volcanic maar crater, and Kampot karst towers.",
    descriptionKm: "ឧទ្យានជាតិភ្នំគូលែន បឹងយក្សឡោមរតនគិរី និងភ្នំកំបោរកាស្តកំពត។",
    isBuiltin: true,
    symbology: {
      visible: true,
      opacity: 0.4,
      color: "#047857",
      fillColor: "#10b981",
      strokeWidth: 2,
      lineStyle: "solid",
      symbol: "star",
      symbolSize: 24,
      original: false,
    },
    geojson: BUILTIN_GEOSITES_GEOJSON,
  },
];

// Local storage key for saved layer TOC configuration and symbology
export const TOC_STORAGE_KEY = "geocam_geodata_toc_symbology";

/**
 * Load saved symbology overrides from localStorage
 */
export function loadSavedTocSymbology(): Record<string, Partial<LayerSymbology>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(TOC_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Save symbology overrides to localStorage and dispatch event for live cross-component sync
 */
export function saveTocSymbology(settings: Record<string, Partial<LayerSymbology>>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOC_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent("geocam:toc_updated", { detail: settings }));
  } catch (err) {
    console.error("Failed to save TOC symbology:", err);
  }
}

/**
 * Reset TOC symbology to system defaults
 */
export function resetTocSymbology(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOC_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("geocam:toc_updated", { detail: {} }));
  } catch (err) {
    console.error("Failed to reset TOC symbology:", err);
  }
}
