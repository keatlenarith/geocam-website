export interface SectionGalleryImage {
  url: string;
  captionEn: string;
  captionKm: string;
  subEn?: string;
  subKm?: string;
}

export interface KnowledgeSection {
  id: string;
  headingEn: string;
  headingKm: string;
  contentEn: string;
  contentKm: string;
  bulletsEn?: string[];
  bulletsKm?: string[];
  calloutEn?: string;
  calloutKm?: string;
  image?: string;
  imageCaptionEn?: string;
  imageCaptionKm?: string;
  gallery?: SectionGalleryImage[];
  table?: {
    captionEn?: string;
    captionKm?: string;
    headersEn: string[];
    headersKm: string[];
    rowsEn: string[][];
    rowsKm: string[][];
  };
}

export interface KnowledgeDocument {
  titleEn: string;
  titleKm: string;
  filename: string;
  size: string;
  url: string;
  descriptionEn?: string;
  descriptionKm?: string;
}

export interface KnowledgeArticle {
  id: string;
  slug: string;
  category: string;
  categoryKm: string;
  titleEn: string;
  titleKm: string;
  excerptEn: string;
  excerptKm: string;
  readTime: string;
  image: string;
  date: string;
  authorEn: string;
  authorKm: string;
  tagEn: string;
  tagKm: string;
  document?: KnowledgeDocument;
  sections: KnowledgeSection[];
  takeawaysEn: string[];
  takeawaysKm: string[];
  relatedIds: string[];
}

export const BASIC_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: "bk-rocks",
    slug: "classification-rocks-cambodia",
    category: "Rocks & Minerals",
    categoryKm: "ថ្ម និងខនិជ",
    titleEn: "Classification of Rocks in Cambodia: Igneous, Sedimentary & Metamorphic",
    titleKm: "ចំណាត់ថ្នាក់ថ្មនៅកម្ពុជា៖ ថ្មម៉ាក់ម៉ា ថ្មកម្ទេចកំណ និងថ្មប្រែរូប",
    excerptEn: "A foundational guide to identifying granite intrusions, sandstone plateaus, limestone karst, and schist belts across Cambodia's provinces.",
    excerptKm: "មគ្គុទ្ទេសក៍មូលដ្ឋានសម្រាប់កំណត់អត្តសញ្ញាណថ្មក្រានីត ខ្ពង់រាបថ្មភក់ កាស្ត៍ថ្មកំបោរ និងខ្សែក្រវាត់ថ្មសៀសនៅទូទាំងខេត្តនានាក្នុងប្រទេសកម្ពុជា។",
    readTime: "10 min read",
    image: "/images/rock-atlas/geology.png",
    date: "2026-10-27",
    authorEn: "Department of Geology & Mineral Resources (GDMR / JICA / CCOP)",
    authorKm: "អគ្គនាយកដ្ឋានធនធានរ៉ែ (GDMR / JICA / CCOP)",
    tagEn: "National Rock Atlas & Geochemistry",
    tagKm: "កម្រងអាត្លាសថ្ម និងគីមីភូគព្ភសាស្ត្រជាតិ",
    document: {
      titleEn: "Cambodia Rock Geology and Geochemistry Atlas (October 2026)",
      titleKm: "កម្រងអាត្លាសថ្ម ភូគព្ភវិទ្យា និងគីមីភូគព្ភសាស្ត្រនៃប្រទេសកម្ពុជា (២៧ តុលា ២០២៦)",
      filename: "Cambodia_rock_geology_geochemistry_atlas.pdf",
      size: "42.5 MB",
      url: "/documents/Cambodia_rock_geology_geochemistry_atlas.pdf",
      descriptionEn: "Complete 26-page atlas featuring 74 field rock samples, 20 whole-rock XRF analyses, QAPF/TAS classification diagrams, Harker variation plots, genuine field photographs, and geophysical correlations.",
      descriptionKm: "កម្រងឯកសារអាត្លាសពេញលេញ ២៦ ទំព័រ រួមបញ្ចូលសំណាកថ្មវាល ៧៤ កន្លែង ការវិភាគគីមីថ្មសរុប XRF ចំនួន ២០ គំនូសតាងចំណាត់ថ្នាក់ QAPF/TAS គំនូសតាងបម្រែបម្រួលធាតុ Harker រូបថតចុះវាលជាក់ស្តែង និងទំនាក់ទំនងរូបភូគព្ភសាស្ត្រ។",
    },
    sections: [
    {
        "id": "overview-lithology",
        "headingEn": "1. Overview of Cambodian Lithology & National Sample Distribution",
        "headingKm": "១. ទិដ្ឋភាពទូទៅនៃសណ្ឋានថ្ម និងការចែកចាយសំណាកជាតិ",
        "contentEn": "Cambodia exhibits a rich diversity of rock types spanning from the Paleozoic era to the Quaternary. The landscape is shaped by granitic plutons, vast Mesozoic continental sandstone covers, isolated Permian limestone towers, and widespread Cenozoic basalt plateaus in the northeast. This official 2026 atlas compiles 74 rock samples from the JICA National Mining Master Plan, CCOP specimen archives, and peer-reviewed Cretaceous plutonic suites across Cambodia.",
        "contentKm": "ប្រទេសកម្ពុជាមានភាពសម្បូរបែបនៃប្រភេទថ្មចាប់ពីស័កបុរាណសត្វរហូតដល់សម័យទីបួន។ ទិដ្ឋភាពទូទៅត្រូវបានកំណត់ដោយថ្មក្រានីតម៉ាក់ម៉ា ស្រទាប់ថ្មភក់ដីគោកយុគកណ្តាលសត្វ ប៉មថ្មកំបោរកាស្ត៍យុគពែរមៀន និងខ្ពង់រាបថ្មបាសាល់យុគថ្មីនៅប៉ែកឦសាន។ កម្រងអាត្លាសថ្មជាតិ ២០២៦ នេះបានសំយោគសំណាកថ្មវាលចំនួន ៧៤ ពីផែនការមេវិស័យរ៉ែ JICA បណ្ណសាររូបភាព CCOP និងការស្រាវជ្រាវសិលាអគ្នីជ្រៅយុគគ្រីតាសេ។",
        "bulletsEn": [
            "Igneous: Mesozoic granite batholiths, Dalat-Kratie Cretaceous diorite/granodiorite, and Neogene-Quaternary alkali basalts.",
            "Sedimentary: Triassic-Cretaceous continental redbed sandstones and Permian fossiliferous limestone karst towers.",
            "Metamorphic: Proterozoic-Paleozoic mica-schists, gneisses, quartzites, and contact skarn aureoles."
        ],
        "bulletsKm": [
            "ថ្មម៉ាក់ម៉ា៖ ថ្មក្រានីតបាតូលីតយុគកណ្តាលសត្វ ថ្មឌីយ៉ូរីត/ក្រាណូឌីយ៉ូរីតស្នួល និងថ្មបាសាល់អាល់កាលីយុគទីបី-ទីបួន។",
            "ថ្មកម្ទេចកំណ៖ ថ្មភក់ក្រហមដីគោកយុគត្រីយ៉ាស-ក្រេតាសេ និងប៉មកាស្ត៍ថ្មកំបោរផូស៊ីលយុគពែរមៀន។",
            "ថ្មប្រែរូប៖ ថ្មសៀសមីកា ថ្មនែស ថ្មក្វាតស៊ីត និងវណ្ឌថ្មស្កានប្រែរូបប៉ះទង្គិច។"
        ],
        "calloutEn": "Field observation rule: Cambodian rock groups reflect distinct tectonic episodes, particularly the Indosinian Orogeny and circum-Pacific Cretaceous subduction.",
        "calloutKm": "ចំណាំក្នុងការចុះវាល៖ ប្រព័ន្ធថ្មនៅកម្ពុជាឆ្លុះបញ្ចាំងពីដំណាក់កាលតិចតូនិចសំខាន់ៗ ជាពិសេសចលនាភ្នំឥណ្ឌូស៊ីនៀ និងការរងសម្ពាធមាត់ទ្វីបប៉ាស៊ីហ្វិកសម័យគ្រីតាសេ។",
        "image": "/images/rock-atlas/geology.png",
        "imageCaptionEn": "Figure: Geological and Structural Map of Cambodia (1:500,000 Department of Geology / GDMR base) displaying mapped lithostratigraphic formations, fault networks, and plutonic complexes.",
        "imageCaptionKm": "រូបភាព៖ ផែនទីភូគព្ភសាស្ត្រ និងរចនាសម្ព័ន្ធនៃព្រះរាជាណាចក្រកម្ពុជា (មាត្រដ្ឋាន ១:៥០០,០០០ នាយកដ្ឋានភូគព្ភសាស្ត្រ / GDMR) បង្ហាញសណ្ឋានសិលា បណ្តាញទ្រុឌបាក់ និងដុំសិលាជ្រៅ។",
        "gallery": [
          {
            "url": "/images/rock-atlas/geology.png",
            "captionEn": "National Geological & Structural Map (1:500k)",
            "captionKm": "ផែនទីភូគព្ភសាស្ត្រ និងរចនាសម្ព័ន្ធជាតិ (១:៥០០,០០០)",
            "subEn": "Source: Dept. of Geology 1:500,000 base",
            "subKm": "ប្រភព៖ មូលដ្ឋាននាយកដ្ឋានភូគព្ភសាស្ត្រ ១:៥០០,០០០"
          },
          {
            "url": "/images/rock-atlas/JICA_sample_map.png",
            "captionEn": "National Rock & Geochemical Sample Map (74 Sites)",
            "captionKm": "ផែនទីទីតាំងសំណាកថ្ម និងគីមីភូគព្ភសាស្ត្រ (៧៤ កន្លែង)",
            "subEn": "JICA 2010 Master Plan Appendix V-4/V-7",
            "subKm": "ផែនការមេ JICA ២០១០ ឧបសម្ព័ន្ធ V-4/V-7"
          },
          {
            "url": "/images/rock-atlas/wgm2012_bouguer.png",
            "captionEn": "WGM2012 Bouguer Gravity Anomaly Framework",
            "captionKm": "ក្របខ័ណ្ឌអានូម៉ាលីទំនាញផែនដីប៊ូហ្គ័រ WGM2012",
            "subEn": "Deep basement density contrasts & structural basins",
            "subKm": "កម្រិតដង់ស៊ីតេខឿនសិលាជម្រៅជ្រៅ និងអាងរចនាសម្ព័ន្ធ"
          }
        ]
    },
    {
        "id": "carbonates-sandstone",
        "headingEn": "2. Carbonates, Fossiliferous Limestones & Sandstone Formations",
        "headingKm": "២. ថ្មកំបោរ ថ្មកំបោរផូស៊ីល និងសណ្ឋានថ្មភក់",
        "contentEn": "Permian limestones outcrop as karst towers and hills in Banteay Meanchey, Battambang, and Kampot, providing the essential raw material for Cambodia's cement industry. In thin section and hand specimen, they display bioclastic micrite, foraminifera, crinoid fragments, and secondary calcite veining. Mesozoic sandstones (Khorat and Cardamom groups) consist of quartz-rich and feldspathic (arkosic) arenites, which form majestic plateau escarpments and provided the building stone for Angkorian monuments.",
        "contentKm": "ថ្មកំបោរយុគពែរមៀនលេចចេញជារាងប៉មកាស្ត៍ និងកូនភ្នំនៅបន្ទាយមានជ័យ បាត់ដំបង និងកំពត ដែលផ្តល់នូវវត្ថុធាតុដើមដ៏សំខាន់សម្រាប់ឧស្សាហកម្មស៊ីម៉ងត៍កម្ពុជា។ ក្រោមមីក្រូទស្សន៍ និងសំណាកថ្មដៃ ពួកវាបង្ហាញនូវមីគ្រីតប៊ីយ៉ូក្លាស ផូស៊ីល Foraminifera បំណែកគ្រីណូអ៊ីត និងសរសៃកាល់ស៊ីត។ ថ្មភក់យុគកណ្តាលសត្វ (ក្រុមភ្នំក្រវាញ និងកូរ៉ាត) រួមមានថ្មភក់ក្វាត និងអាខូស ដែលបង្កើតជាជញ្ជាំងខ្ពង់រាប និងជាប្រភពថ្មសម្រាប់សាងសង់ប្រាសាទអង្គរ។",
        "bulletsEn": [
            "Specimen CAM_GDP_0050 & 0051: Gray massive Permian fossiliferous limestone from Banteay Meanchey (CCOP Archive).",
            "Angkorian Sandstones: Fine-to-medium grained feldspathic arenites quarried from Phnom Kulen.",
            "Calcareous Sandstone: Mixed siliciclastic-carbonate transitions mapped in central-western Cambodia."
        ],
        "bulletsKm": [
            "សំណាក CAM_GDP_0050 & 0051៖ ថ្មកំបោរផូស៊ីលពែរមៀនពណ៌ប្រផេះរឹងមាំពីខេត្តបន្ទាយមានជ័យ (បណ្ណសារ CCOP)។",
            "ថ្មភក់ប្រាសាទបុរាណ៖ ថ្មភក់អាខូសគ្រាប់ម៉ដ្ឋទៅមធ្យមដែលជីកយកពីភ្នំគូលែន។",
            "ថ្មភក់កាល់ការ៖ ស្រទាប់ចន្លោះរវាងកម្ទេចថ្មស៊ីលីស និងកាបូណាតនៅកម្ពុជាភាគកណ្តាល-ខាងលិច។"
        ],
        "image": "/images/rock-atlas/CAM_GDP_0050_BMC1901a_1.jpg",
        "imageCaptionEn": "Figure: Specimen photograph of Permian fossiliferous limestone (Sample CAM_GDP_0050, Banteay Meanchey Province; CCOP collection).",
        "imageCaptionKm": "រូបភាព៖ រូបថតសំណាកថ្មកំបោរផូស៊ីលយុគពែរមៀន (លេខសម្គាល់ CAM_GDP_0050 ខេត្តបន្ទាយមានជ័យ បណ្ណសារ CCOP)។"
    },
    {
        "id": "basalt-weathering",
        "headingEn": "3. Cenozoic Basalts & Lateritic Red Soil Development",
        "headingKm": "៣. ថ្មបាសាល់យុគថ្មី និងការកកើតដីក្រហមឡាតេរីត",
        "contentEn": "Extensive Neogene-Quaternary plateau basalts cover roughly 10,000 km² in Ratanakiri, Mondulkiri, and Kampong Cham. Intense tropical chemical weathering of these iron- and magnesium-rich mafic volcanics has generated thick, fertile basaltic red soils (Terre Rouge) and valuable alluvial zircon/gemstone deposits in Banlung and Pailin.",
        "contentKm": "ខ្ពង់រាបថ្មបាសាល់យុគទីបី-ទីបួនគ្របដណ្តប់លើផ្ទៃដីប្រមាណ ១០,០០០ គីឡូម៉ែត្រការ៉េ នៅខេត្តរតនគិរី មណ្ឌលគិរី និងកំពង់ចាម។ ការរលួយធាតុអាកាសត្រូពិចយ៉ាងខ្លាំងក្លាលើថ្មភ្នំភ្លើងម៉ាហ្វិកដែលសម្បូរជាតិដែក និងម៉ាញេស្យូមនេះ បានបង្កើតជាស្រទាប់ដីក្រហមដុះលូតលាស់ដំណាំយ៉ាងមានជីជាតិ និងកំណកកករត្បូងទទឹម/កណ្ដៀងនៅបានលុង និងប៉ៃលិន។",
        "bulletsEn": [
            "Sample MDK25015 & MDK25016: Weathered basalt outcrops and thick lateritic red soil profiles in Mondulkiri.",
            "Gemstone deposits: Corundum, sapphire, and zircon xenocrysts transported from mantle depths by alkaline basaltic melts.",
            "Bauxite potential: Lateritic weathering profiles forming high-grade aluminous bauxite caps in eastern plateau regions."
        ],
        "bulletsKm": [
            "សំណាក MDK25015 & MDK25016៖ ផ្ទាំងថ្មបាសាល់រលួយ និងមុខកាត់ដីក្រហមឡាតេរីតក្រាស់នៅខេត្តមណ្ឌលគិរី។",
            "កំណកកករត្បូងមានតម្លៃ៖ ត្បូងកណ្តៀង ទទឹម និងហ្សៀកុង ដែលត្រូវបានកម្អែរាវបាសាល់នាំយកពីស្រទាប់ម៉ង់តូជ្រៅ។",
            "សក្តានុពលរ៉ែបុកស៊ីត៖ ស្រទាប់ឡាតេរីតដែលបង្កើតជាកម្របបុកស៊ីតសម្បូរអាលុយមីញ៉ូមលើខ្ពង់រាបប៉ែកខាងកើត។"
        ],
        "image": "/images/rock-atlas/MDK25015_1.jpg",
        "imageCaptionEn": "Figure: Field outcrop of weathered basalt and deep red lateritic soil profile in Mondulkiri Province (CCOP specimen MDK25015).",
        "imageCaptionKm": "រូបភាព៖ ផ្ទាំងថ្មបាសាល់រលួយដោយធាតុអាកាស និងមុខកាត់ដីក្រហមឡាតេរីតនៅខេត្តមណ្ឌលគិរី (សំណាក CCOP លេខ MDK25015)។"
    },
    {
        "id": "snoul-intrusion",
        "headingEn": "4. Snoul Cretaceous Arc Intrusion & Petrographic Microstructures",
        "headingKm": "៤. ដុំសិលាជ្រៅធ្នូកោះយុគគ្រីតាសេស្នួល និងរចនាសម្ព័ន្ធមីក្រូទស្សន៍",
        "contentEn": "The Snoul plutonic suite in Kratie Province represents a critical geodynamic anchor for eastern Cambodia. Recent zircon U-Pb dating (Shellnutt et al., 2023) establishes an Early Cretaceous crystallization age of ~103 Ma. The intrusion comprises diorite, quartz diorite, and granodiorite cross-cut by aplite dikes, representing an active continental margin volcanic-arc environment associated with paleo-Pacific subduction beneath the Indochina terrane.",
        "contentKm": "បណ្តុំសិលាជ្រៅស្នួលក្នុងខេត្តក្រចេះ គឺជាភស្តុតាងភូគព្ភថាមវន្តដ៏សំខាន់សម្រាប់កម្ពុជាភាគខាងកើត។ ការកំណត់អាយុកាល Zircon U-Pb ថ្មីៗ (Shellnutt et al., 2023) បញ្ជាក់ពីអាយុកាលកកើតក្រាមក្នុងយុគគ្រីតាសេដើម (~១០៣ លានឆ្នាំមុន)។ ដុំសិលានេះរួមមានថ្មឌីយ៉ូរីត ថ្មក្វាតឌីយ៉ូរីត និងក្រាណូឌីយ៉ូរីត ដែលឆ្លុះបញ្ចាំងពីបរិស្ថានធ្នូកោះភ្នំភ្លើងមាត់ទ្វីបសកម្ម ដោយសារការរងសម្ពាធមហាសមុទ្រប៉ាស៊ីហ្វិកបុរាណក្រោមប្លុកឥណ្ឌូចិន។",
        "bulletsEn": [
            "Mineral assemblage: Plagioclase (andesine-oligoclase), hornblende, biotite, quartz, and accessory zircon/apatite/titanite.",
            "Microstructures: Zoned subhedral plagioclase laths, intergranular hornblende, and interstitial quartz-biotite intergrowths.",
            "Geodynamic significance: Confirms direct continuity between eastern Cambodia's magmatism and Vietnam's Dalat-Kratie zone."
        ],
        "bulletsKm": [
            "ការផ្គុំរ៉ែ៖ ប្លាស្យូក្លាស (អង់ដេស៊ីន-អូលីហ្គោគ្លាស) ហនប្លេន ប៊ីយ៉ូទីត ក្វាត និងរ៉ែបន្ទាប់បន្សំ ហ្សៀកុង អាប៉ាទីត ទីតានីត។",
            "រចនាសម្ព័ន្ធក្រោមមីក្រូទស្សន៍៖ គ្រាប់ប្លាស្យូក្លាសមានវណ្ឌ (Zoned laths) ហនប្លេនចន្លោះគ្រាប់ និងការប្រសព្វក្វាត-ប៊ីយ៉ូទីត។",
            "សារៈសំខាន់ភូគព្ភថាមវន្ត៖ បញ្ជាក់ពីការតភ្ជាប់ដោយផ្ទាល់រវាងសិលាអគ្នីកម្ពុជាភាគខាងកើត និងតំបន់ដាឡាត់-ក្រចេះនៃប្រទេសវៀតណាម។"
        ],
        "image": "/images/rock-atlas/Shellnutt_2023_Fig4.jpg",
        "imageCaptionEn": "Figure: Petrographic thin-section photomicrographs (cross-polarized and plane-polarized light) showing mineral textures of the Snoul diorite suite (Shellnutt et al., 2023).",
        "imageCaptionKm": "រូបភាព៖ រូបថតកាត់បន្ទះស្តើងក្រោមមីក្រូទស្សន៍ប៉ូឡារីស បង្ហាញរចនាសម្ព័ន្ធរ៉ែ និងក្រាមនៃសិលាឌីយ៉ូរីតស្នួល (Shellnutt et al., 2023)។"
    },
    {
        "id": "tas-qapf-classification",
        "headingEn": "5. IUGS QAPF & Total Alkali-Silica (TAS) Classification Standards",
        "headingKm": "៥. ស្តង់ដារចំណាត់ថ្នាក់ IUGS QAPF និងអាល់កាលី-ស៊ីលីកាសរុប (TAS)",
        "contentEn": "Formal igneous petrology uses two complementary standards established by the International Union of Geological Sciences (IUGS). The QAPF double triangle classifies phaneritic plutonic and volcanic rocks by modal proportions of Quartz, Alkali feldspar, Plagioclase, and Feldspathoid. For fine-grained or volcanic suites, the Total Alkali-Silica (TAS) diagram classifies rocks chemically by wt% SiO2 versus (Na2O + K2O).",
        "contentKm": "សិលាវិទ្យាអគ្នីស្តង់ដារប្រើប្រាស់ក្របខ័ណ្ឌពីរដែលបង្កើតឡើងដោយសហភាពភូគព្ភវិទ្យាអន្តរជាតិ (IUGS)។ ត្រីកោណទ្វេ QAPF ចែកចំណាត់ថ្នាក់ថ្មជ្រៅ និងថ្មភ្នំភ្លើងតាមសមាមាត្ររ៉ែ Quartz, Alkali feldspar, Plagioclase, និង Feldspathoid។ សម្រាប់ថ្មភ្នំភ្លើងគ្រាប់ម៉ដ្ឋ គំនូសតាងអាល់កាលី-ស៊ីលីកាសរុប (TAS) ចែកចំណាត់ថ្នាក់តាមគីមី % ទម្ងន់នៃ SiO2 ធៀបនឹង (Na2O + K2O)។",
        "bulletsEn": [
            "QAPF Field Reference: Differentiates granite, granodiorite, tonalite, diorite, gabbro, and alkali-feldspar granite.",
            "TAS Volcanic Framework: Establishes boundaries between basalt, basaltic andesite, andesite, dacite, and rhyolite.",
            "Alkaline vs Subalkaline Line: Divides high-alkali volcanic series from calc-alkaline volcanic-arc suites."
        ],
        "bulletsKm": [
            "ក្របខ័ណ្ឌយោង QAPF៖ បែងចែករវាងថ្មក្រានីត ក្រាណូឌីយ៉ូរីត តូណាលីត ឌីយ៉ូរីត ហ្កាប់ប្រូ និងក្រានីតអាល់កាលី-ហ្វែលស្ប៉ា។",
            "ក្របខ័ណ្ឌភ្នំភ្លើង TAS៖ កំណត់ព្រំប្រទល់រវាងបាសាល់ បាសាល់ទិកអង់ដេស៊ីត អង់ដេស៊ីត ដាស៊ីត និងរីយ៉ូលីត។",
            "បន្ទាត់ Alkaline និង Subalkaline៖ បែងចែកស៊េរីភ្នំភ្លើងអាល់កាលីខ្ពស់ ពីស៊េរីធ្នូកោះកាល់-អាល់កាលី។"
        ],
        "image": "/images/rock-atlas/QAPF_reference.png",
        "imageCaptionEn": "Figure: British Geological Survey (BGS) / IUGS reference QAPF classification diagram for plutonic and volcanic rocks (Gillespie & Styles, 1999).",
        "imageCaptionKm": "រូបភាព៖ គំនូសតាងយោងស្តង់ដារ BGS / IUGS QAPF សម្រាប់ចំណាត់ថ្នាក់សិលាអគ្នីជ្រៅ និងថ្មភ្នំភ្លើង (Gillespie & Styles, 1999)។"
    },
    {
        "id": "whole-rock-geochemistry",
        "headingEn": "6. JICA Measured Whole-Rock Geochemistry & Harker Variation",
        "headingKm": "៦. គីមីថ្មសរុបវាស់វែងដោយ JICA និងបំរែបំរួល Harker",
        "contentEn": "The JICA 2010 Mining Master Plan analyzed 20 whole-rock samples across Cambodia using X-ray fluorescence (XRF). Compositions range from basic basalt (~46.1% SiO2) to high-silica granite and rhyolite (>75% SiO2). Harker variation plots show typical magmatic differentiation trends: negative correlations of Fe2O3, MgO, and CaO with increasing SiO2, and an increase in alkalis (Na2O + K2O).",
        "contentKm": "ផែនការមេវិស័យរ៉ែ JICA ២០១០ បានវិភាគសំណាកថ្មសរុបចំនួន ២០ នៅទូទាំងប្រទេសកម្ពុជាដោយប្រើម៉ាស៊ីន XRF។ សមាសធាតុគ្របដណ្តប់ចាប់ពីថ្មបាសាល់បាស៊ីក (~៤៦.១% SiO2) រហូតដល់ថ្មក្រានីត និងរីយ៉ូលីតសម្បូរស៊ីលីកា (>៧៥% SiO2)។ គំនូសតាងបំរែបំរួល Harker បង្ហាញពីនិន្នាការបំបែកម៉ាក់ម៉ាយ៉ាងច្បាស់៖ ការធ្លាក់ចុះនៃ Fe2O3, MgO, និង CaO ពេល SiO2 កើនឡើង និងការកើនឡើងនៃជាតិអាល់កាលី។",
        "bulletsEn": [
            "Basalt Compositions: Low SiO2 (46.07%), high MgO (7.07%), and high total iron (12.35% Fe2O3).",
            "High-Silica Granites: SiO2 reaching 75.16% with total alkalis (Na2O+K2O) between 7.5% and 8.7%.",
            "AFM & Alumina Saturation: Displays subalkaline calc-alkaline differentiation and metaluminous-peraluminous signatures."
        ],
        "bulletsKm": [
            "សមាសធាតុថ្មបាសាល់៖ ស៊ីលីកាទាប (៤៦.០៧%) ម៉ាញេស្យូមខ្ពស់ (៧.០៧%) និងដែកសរុបខ្ពស់ (១២.៣៥% Fe2O3)។",
            "ថ្មក្រានីតស៊ីលីកាខ្ពស់៖ ស៊ីលីកាឡើងដល់ ៧៥.១៦% ជាមួយជាតិអាល់កាលីសរុប (Na2O+K2O) ចន្លោះ ៧.៥% និង ៨.៧%។",
            "កម្រិត AFM និងឆ្អែតអាលុយមីន៖ បង្ហាញលក្ខណៈបំបែកម៉ាក់ម៉ាកាល់-អាល់កាលី និងលក្ខណៈ Metaluminous ទៅ Peraluminous។"
        ],
        "table": {
            "captionKm": "តារាងទី ១៖ លទ្ធផលវិភាគគីមីថ្មសរុប XRF នៃសំណាកតំណាងកម្ពុជា (JICA 2010 Appendix V-7)",
            "captionEn": "Table 1. Representative JICA 2010 Whole-Rock XRF Geochemical Analyses (% wt)",
            "headersKm": [
                "លេខកូដ (Sample ID)",
                "ប្រភេទថ្ម (Rock Name)",
                "ខេត្ត (Province)",
                "SiO2 %",
                "Al2O3 %",
                "Fe2O3 %",
                "MgO %",
                "CaO %",
                "Na2O+K2O %"
            ],
            "headersEn": [
                "Sample ID",
                "Rock Name",
                "Province",
                "SiO2 %",
                "Al2O3 %",
                "Fe2O3 %",
                "MgO %",
                "CaO %",
                "Na2O+K2O %"
            ],
            "rowsKm": [
                [
                    "9061408",
                    "Picritic basalt",
                    "Preah Vihear",
                    "46.07",
                    "14.53",
                    "12.35",
                    "7.07",
                    "8.35",
                    "4.39"
                ],
                [
                    "9061407",
                    "Augite andesite",
                    "Preah Vihear",
                    "61.27",
                    "17.31",
                    "5.41",
                    "1.69",
                    "4.90",
                    "4.17"
                ],
                [
                    "9080703",
                    "Granite",
                    "Ratanakiri",
                    "60.82",
                    "17.83",
                    "3.43",
                    "0.51",
                    "1.91",
                    "12.63"
                ],
                [
                    "9060509",
                    "Rhyolite",
                    "Kep",
                    "71.55",
                    "13.74",
                    "3.03",
                    "0.77",
                    "0.67",
                    "7.63"
                ],
                [
                    "9060802",
                    "Granite",
                    "Kampong Chhnang",
                    "73.69",
                    "13.64",
                    "2.11",
                    "0.27",
                    "1.22",
                    "7.81"
                ],
                [
                    "9061405",
                    "Dacite",
                    "Siem Reap",
                    "74.31",
                    "13.09",
                    "5.11",
                    "0.29",
                    "0.22",
                    "0.30"
                ],
                [
                    "9061702A",
                    "Granite",
                    "Takeo",
                    "75.16",
                    "13.34",
                    "1.16",
                    "0.16",
                    "0.53",
                    "8.75"
                ]
            ],
            "rowsEn": [
                [
                    "9061408",
                    "Picritic basalt",
                    "Preah Vihear",
                    "46.07",
                    "14.53",
                    "12.35",
                    "7.07",
                    "8.35",
                    "4.39"
                ],
                [
                    "9061407",
                    "Augite andesite",
                    "Preah Vihear",
                    "61.27",
                    "17.31",
                    "5.41",
                    "1.69",
                    "4.90",
                    "4.17"
                ],
                [
                    "9080703",
                    "Granite",
                    "Ratanakiri",
                    "60.82",
                    "17.83",
                    "3.43",
                    "0.51",
                    "1.91",
                    "12.63"
                ],
                [
                    "9060509",
                    "Rhyolite",
                    "Kep",
                    "71.55",
                    "13.74",
                    "3.03",
                    "0.77",
                    "0.67",
                    "7.63"
                ],
                [
                    "9060802",
                    "Granite",
                    "Kampong Chhnang",
                    "73.69",
                    "13.64",
                    "2.11",
                    "0.27",
                    "1.22",
                    "7.81"
                ],
                [
                    "9061405",
                    "Dacite",
                    "Siem Reap",
                    "74.31",
                    "13.09",
                    "5.11",
                    "0.29",
                    "0.22",
                    "0.30"
                ],
                [
                    "9061702A",
                    "Granite",
                    "Takeo",
                    "75.16",
                    "13.34",
                    "1.16",
                    "0.16",
                    "0.53",
                    "8.75"
                ]
            ]
        },
        "image": "/images/rock-atlas/JICA_Harker.png",
        "imageCaptionEn": "Figure: Harker variation diagrams (K2O, MgO, Fe2O3, CaO versus SiO2 wt%) for 20 Cambodian whole-rock samples (JICA, 2010).",
        "imageCaptionKm": "រូបភាព៖ គំនូសតាងបំរែបំរួល Harker (K2O, MgO, Fe2O3, CaO ធៀបនឹង SiO2 wt%) សម្រាប់សំណាកថ្មសរុបទាំង ២០ នៃប្រទេសកម្ពុជា (JICA, 2010)។"
    },
    {
        "id": "afm-ternary",
        "headingEn": "7. AFM Major Element Proportions & Alumina Saturation",
        "headingKm": "៧. សមាមាត្រធាតុធំ AFM និងកម្រិតឆ្អែតអាលុយមីន",
        "contentEn": "The AFM ternary diagram (Alkalis - Total Iron as FeO - MgO) illustrates the differentiation pathway of Cambodian igneous rocks. The samples follow a typical calc-alkaline evolutionary trend without extreme iron enrichment. The alumina saturation index (A/CNK versus A/NK) identifies both metaluminous (hornblende-bearing diorites and granodiorites) and peraluminous (biotite-muscovite granites) suites.",
        "contentKm": "គំនូសតាងត្រីកោណ AFM (អាល់កាលី - ដែកសរុបជា FeO - ម៉ាញេស្យូម) បង្ហាញពីគន្លងនៃការបំបែកម៉ាក់ម៉ានៃសិលាអគ្នីកម្ពុជា។ សំណាកទាំងនេះដើរតាមនិន្នាការវិវត្តកាល់-អាល់កាលីធម្មតា ដោយគ្មានការប្រមូលផ្តុំជាតិដែកខ្លាំងជ្រុលឡើយ។ សន្ទស្សន៍ឆ្អែតអាលុយមីន (A/CNK ធៀបនឹង A/NK) កំណត់អត្តសញ្ញាណទាំងសំណុំសិលា Metaluminous (ឌីយ៉ូរីត និងក្រាណូឌីយ៉ូរីតមានហនប្លេន) និង Peraluminous (ក្រានីតមានប៊ីយ៉ូទីត-មុសកូវីត)។",
        "image": "/images/rock-atlas/JICA_AFM.png",
        "imageCaptionEn": "Figure: AFM ternary plot showing measured mass proportions (Na2O+K2O, FeO-total, MgO) for Cambodian igneous rock samples.",
        "imageCaptionKm": "រូបភាព៖ គំនូសតាងត្រីកោណ AFM បង្ហាញពីសមាមាត្រម៉ាស់ (Na2O+K2O, FeO-total, MgO) នៃសំណាកសិលាអគ្នីកម្ពុជា។"
    },
    {
        "id": "metamorphic-rocks",
        "headingEn": "8. Metamorphic Basement & Contact Aureoles",
        "headingKm": "៨. សិលាគ្រឹះប្រែរូប និងវណ្ឌប្រែរូបប៉ះទង្គិច",
        "contentEn": "Metamorphic rocks are exposed along deep structural shear zones and ancient basement uplifts, where intense heat and directional tectonic pressure altered pre-existing sedimentary and volcanic formations. These include Proterozoic to Paleozoic mica schists and gneisses in Pailin and Stung Treng, and contact metamorphic skarns developed around granitic intrusions.",
        "contentKm": "ថ្មប្រែរូបត្រូវបានរកឃើញនៅតាមតំបន់កាត់ទទឹងរចនាសម្ព័ន្ធជ្រៅ និងកំណកគ្រឹះបុរាណ ដែលកម្ដៅខ្លាំង និងសម្ពាធតិចតូនិចបានកែប្រែថ្មកម្ទេចកំណ និងថ្មភ្នំភ្លើងដើម។ ទាំងនេះរួមមានថ្មសៀសមីកា និងថ្មនែសយុគបុរេកំប្រី-បុរាណសត្វនៅប៉ៃលិន និងស្ទឹងត្រែង ព្រមទាំងវណ្ឌថ្មស្កានប្រែរូបប៉ះទង្គិចជុំវិញដុំសិលាជ្រៅក្រានីត។",
        "bulletsEn": [
            "Mica Schist & Gneiss: Deep metamorphic basement exposures at Pailin and northern Stung Treng.",
            "Quartzite: Highly resistant ridges standing out against erosional valleys in western provinces.",
            "Marble & Skarn: Contact metamorphic aureoles near limestone-granite boundaries, often hosting copper-gold-iron skarns."
        ],
        "bulletsKm": [
            "ថ្មសៀសមីកា និងថ្មនែស៖ ផ្ទាំងសិលាគ្រឹះប្រែរូបជម្រៅជ្រៅនៅប៉ៃលិន និងប៉ែកខាងជើងស្ទឹងត្រែង។",
            "ថ្មក្វាតស៊ីត៖ ខ្សែជួរភ្នំធន់នឹងការសឹករិចរិលនៅបណ្តាខេត្តភាគខាងលិច។",
            "ថ្មម៉ាប និងស្កាន៖ វណ្ឌប្រែរូបប៉ះទង្គិចក្បែរព្រំដែនថ្មកំបោរ-ថ្មក្រានីត ដែលជាញឹកញាប់ផ្ទុកកំណកកកររ៉ែស្ពាន់-មាស-ដែក។"
        ],
        "image": "/images/rock-atlas/photo_review.jpg",
        "imageCaptionEn": "Figure: Photographic verification plate of Cambodian rock specimens, field outcrops, and petrographic thin-sections.",
        "imageCaptionKm": "រូបភាព៖ ផ្ទាំងរូបថតផ្ទៀងផ្ទាត់សំណាកថ្មកម្ពុជា ផ្ទាំងថ្មវាល និងបន្ទះស្តើងក្រោមមីក្រូទស្សន៍។"
    },
    {
      id: "jica-field-photos-part1",
      headingEn: "9. Authentic Field Photographs: Volcanics and Alteration (JICA 2010 Survey)",
      headingKm: "៩. រូបថតចុះវាលជាក់ស្តែង៖ សិលាភ្នំភ្លើង និងការប្រែធាតុ (ការអង្កេត JICA ឆ្នាំ២០១០)",
      contentEn: "High-resolution authentic field survey photographs documenting volcanic and altered host rock formations across Cambodia, extracted directly from JICA (2010) Master Plan Report Appendix V-4 (p. 129). These document hydrothermal alteration, gossans, silicification, and metallogenic vein systems.",
      contentKm: "កម្រងរូបថតចុះវាលជាក់ស្តែងកម្រិតច្បាស់ខ្ពស់ដែលកត់ត្រាទ្រង់ទ្រាយសិលាភ្នំភ្លើង និងថ្មមេប្រែធាតុនៅទូទាំងប្រទេសកម្ពុជា ស្រង់ចេញដោយផ្ទាល់ពីរបាយការណ៍មេ JICA (២០១០) ឧបសម្ព័ន្ធ V-4 (ទំព័រ ១២៩)។ រូបថតទាំងនេះបង្ហាញពីការប្រែធាតុដោយកម្តៅទឹកក្រោមដី (Hydrothermal alteration) ហ្គូសាន ស៊ីលីស៊ីភីកាសុង និងប្រព័ន្ធសរសៃរ៉ែ។",
      gallery: [
        {
          url: "/images/rock-atlas/JICA_V4_p129_1_Im0.png",
          captionEn: "Photo 1: Silicified Andesite / Shale Contact Outcrop",
          captionKm: "រូបថតទី ១៖ ផ្ទាំងថ្មអានដេស៊ីតស៊ីលីស៊ីភី និងថ្មសែលប៉ះគ្នា",
          subEn: "JICA 2010 Survey Photo 1 (App. V-4, p.129)",
          subKm: "រូបថតអង្កេត JICA ២០១០ លេខ ១ (ឧបសម្ព័ន្ធ V-4, ទំព័រ ១២៩)"
        },
        {
          url: "/images/rock-atlas/JICA_V4_p129_2_Im1.png",
          captionEn: "Photo 2: Altered Quarry Outcrop with Limonitic Gossan",
          captionKm: "រូបថតទី ២៖ ការដ្ឋានថ្មប្រែធាតុជាមួយហ្គូសានលីម៉ូណាយ",
          subEn: "JICA 2010 Survey Photo 2 (App. V-4, p.129)",
          subKm: "រូបថតអង្កេត JICA ២០១០ លេខ ២ (ឧបសម្ព័ន្ធ V-4, ទំព័រ ១២៩)"
        },
        {
          url: "/images/rock-atlas/JICA_V4_p129_3_Im2.png",
          captionEn: "Photo 3: Strong Silicification and Argillic Alteration Zone",
          captionKm: "រូបថតទី ៣៖ តំបន់ប្រែធាតុស៊ីលីស៊ីភីកាសុង និងអាជីលិកខ្លាំង",
          subEn: "JICA 2010 Survey Photo 3 (App. V-4, p.129)",
          subKm: "រូបថតអង្កេត JICA ២០១០ លេខ ៣ (ឧបសម្ព័ន្ធ V-4, ទំព័រ ១២៩)"
        },
        {
          url: "/images/rock-atlas/JICA_V4_p129_5_Im4.png",
          captionEn: "Photo 4: Roadside Pit Showing Limonite Staining and Bleached Rock",
          captionKm: "រូបថតទី ៤៖ រណ្តៅក្បែរផ្លូវបង្ហាញស្លាកស្នាមលីម៉ូណាយ និងថ្មសប្រែពណ៌",
          subEn: "JICA 2010 Survey Photo 4 (App. V-4, p.129)",
          subKm: "រូបថតអង្កេត JICA ២០១០ លេខ ៤ (ឧបសម្ព័ន្ធ V-4, ទំព័រ ១២៩)"
        },
        {
          url: "/images/rock-atlas/JICA_V4_p129_6_Im5.png",
          captionEn: "Photo 5: Stockwork Quartz-Limonite Veinlets in Conglomerate",
          captionKm: "រូបថតទី ៥៖ បណ្តាញសរសៃក្វាត-លីម៉ូណាយក្នុងថ្មកុងក្លូមេរ៉ា",
          subEn: "JICA 2010 Survey Photo 5 (App. V-4, p.129)",
          subKm: "រូបថតអង្កេត JICA ២០១០ លេខ ៥ (ឧបសម្ព័ន្ធ V-4, ទំព័រ ១២៩)"
        },
        {
          url: "/images/rock-atlas/JICA_V4_p129_8_Im7.png",
          captionEn: "Photo 6: Iron-Manganese Vein System Penetrating Fractured Shale",
          captionKm: "រូបថតទី ៦៖ ប្រព័ន្ធសរសៃដែក-ម៉ង់កាណែសជ្រៀតកាត់ថ្មសែលប្រេះស្រាំ",
          subEn: "JICA 2010 Survey Photo 6 (App. V-4, p.129)",
          subKm: "រូបថតអង្កេត JICA ២០១០ លេខ ៦ (ឧបសម្ព័ន្ធ V-4, ទំព័រ ១២៩)"
        }
      ]
    },
    {
      id: "jica-field-photos-part2",
      headingEn: "10. Authentic Field Photographs: Plutons, Hornfels and Skarn (JICA 2010 Survey)",
      headingKm: "១០. រូបថតចុះវាលជាក់ស្តែង៖ សិលាជ្រៅ ហនហ្វែល និងស្កាន (ការអង្កេត JICA ឆ្នាំ២០១០)",
      contentEn: "Field outcrop evidence of intrusive granite quarrying, thermal contact metamorphism (shale hornfels), hydrothermal skarn veinlets carrying amphibole and arsenopyrite, and weathered quartz porphyry complexes from JICA (2010) Appendix V-4 (p. 130).",
      contentKm: "ភស្តុតាងផ្ទាំងថ្មវាលនៃការដ្ឋានថ្មក្រានីតជ្រៀតចូល ការប្រែរូបប៉ះទង្គិចកម្តៅ (ថ្មហនហ្វែលកកើតពីថ្មសែល) សរសៃស្កានជលកម្ដៅដែលផ្ទុកអំព្វីបូលនិងអាសេណូពីរីត និងកម្រងថ្មក្វាតព័រភីរីពុកផុយ ស្រង់ពី JICA (២០១០) ឧបសម្ព័ន្ធ V-4 (ទំព័រ ១៣០)។",
      gallery: [
        {
          url: "/images/rock-atlas/JICA_V4_p130_3_Im0.png",
          captionEn: "Photo 7: Fe-Mn Nodule with Black Manganiferous Core and Limonite Rim",
          captionKm: "រូបថតទី ៧៖ ពកដុំដែក-ម៉ង់កាណែសដែលមានស្នូលខ្មៅ និងគែមលីម៉ូណាយត្នោត",
          subEn: "JICA 2010 Survey Photo 7 (App. V-4, p.130)",
          subKm: "រូបថតអង្កេត JICA ២០១០ លេខ ៧ (ឧបសម្ព័ន្ធ V-4, ទំព័រ ១៣០)"
        },
        {
          url: "/images/rock-atlas/JICA_V4_p130_4_Im1.png",
          captionEn: "Photo 8: Active Granite Quarry with Molybdenite Occurrences",
          captionKm: "រូបថតទី ៨៖ ការដ្ឋានថ្មក្រានីតសកម្មដែលមានវត្តមានរ៉ែមូលីបដេនីត",
          subEn: "JICA 2010 Survey Photo 8 (App. V-4, p.130)",
          subKm: "រូបថតអង្កេត JICA ២០១០ លេខ ៨ (ឧបសម្ព័ន្ធ V-4, ទំព័រ ១៣០)"
        },
        {
          url: "/images/rock-atlas/JICA_V4_p130_6_Im3.png",
          captionEn: "Photo 9: Dense Contact-Metamorphic Shale Hornfels near Granite Boundary",
          captionKm: "រូបថតទី ៩៖ ថ្មហនហ្វែលប្រែរូបប៉ះទង្គិចក្បែរព្រំប្រទល់ថ្មក្រានីត",
          subEn: "JICA 2010 Survey Photo 9 (App. V-4, p.130)",
          subKm: "រូបថតអង្កេត JICA ២០១០ លេខ ៩ (ឧបសម្ព័ន្ធ V-4, ទំព័រ ១៣០)"
        },
        {
          url: "/images/rock-atlas/JICA_V4_p130_1_Im10.png",
          captionEn: "Photo 10: Hydrothermal Skarn Veinlets with Amphibole and Arsenopyrite",
          captionKm: "រូបថតទី ១០៖ សរសៃស្កានជលកម្តៅផ្ទុកអំព្វីបូល និងអាសេណូពីរីត",
          subEn: "JICA 2010 Survey Photo 10 (App. V-4, p.130)",
          subKm: "រូបថតអង្កេត JICA ២០១០ លេខ ១០ (ឧបសម្ព័ន្ធ V-4, ទំព័រ ១៣០)"
        },
        {
          url: "/images/rock-atlas/JICA_V4_p130_9_Im6.png",
          captionEn: "Photo 11: Weathered Resistant Quartz Porphyry Outcrop Hill",
          captionKm: "រូបថតទី ១១៖ ភ្នំផ្ទាំងថ្មក្វាតព័រភីរីធន់នឹងធាតុអាកាស",
          subEn: "JICA 2010 Survey Photo 11 (App. V-4, p.130)",
          subKm: "រូបថតអង្កេត JICA ២០១០ លេខ ១១ (ឧបសម្ព័ន្ធ V-4, ទំព័រ ១៣០)"
        },
        {
          url: "/images/rock-atlas/JICA_V4_p130_11_Im8.png",
          captionEn: "Photo 12: Weathered Quartz Porphyry with Limonite Network Veinlets",
          captionKm: "រូបថតទី ១២៖ ថ្មក្វាតព័រភីរីពុកផុយជាមួយបណ្តាញសរសៃលីម៉ូណាយ",
          subEn: "JICA 2010 Survey Photo 12 (App. V-4, p.130)",
          subKm: "រូបថតអង្កេត JICA ២០១០ លេខ ១២ (ឧបសម្ព័ន្ធ V-4, ទំព័រ ១៣០)"
        }
      ]
    },
    {
      id: "atlas-references-sources",
      headingEn: "11. Geological References, Cartographic Sources and Data Provenance",
      headingKm: "១១. ឯកសារយោងភូគព្ភសាស្ត្រ ប្រភពផែនទី និងប្រភពទិន្នន័យ (Data Provenance)",
      contentEn: "The data, whole-rock geochemical analyses, thin-sections, and cartographic boundaries in this Atlas are synthesized from verified national surveys, international bilateral technical cooperation missions, and peer-reviewed international geoscientific literature.",
      contentKm: "ទិន្នន័យ ការវិភាគគីមីថ្មសរុប បន្ទះស្តើងក្រោមមីក្រូទស្សន៍ និងព្រំប្រទល់ផែនទីនៅក្នុងកម្រងអាត្លាសនេះ ត្រូវបានសំយោគចេញពីការអង្កេតថ្នាក់ជាតិ គម្រោងសហប្រតិបត្តិការបច្ចេកទេសទ្វេភាគីអន្តរជាតិ និងអត្ថបទស្រាវជ្រាវវិទ្យាសាស្ត្រអន្តរជាតិផ្លូវការ។",
      bulletsEn: [
        "JICA (2010): The Master Plan Study for Promotion of the Mining Industry in the Kingdom of Cambodia. Japan International Cooperation Agency & Ministry of Industry, Mines and Energy (MIME), Final Report & Analytical Appendices V-4 (Field Photos), V-5 (74 Rock Samples), V-7 (Whole-Rock XRF), V-8 (36-Element Assays), and V-10 (Sediment Geochemistry).",
        "Department of Geology / GDMR (2014): Geological and Structural Map of Cambodia (1:500,000 scale). General Department of Mineral Resources, Ministry of Mines and Energy (MME), Phnom Penh.",
        "Shellnutt, J.G., Nguyen, D.T., Lee, H.Y. (2023): Cretaceous arc magmatism in eastern Cambodia: Implications for paleo-Pacific subduction beneath Indochina. Frontiers in Earth Science, 11:1110568. doi:10.3389/feart.2023.1110568.",
        "Gillespie, M.R. & Styles, M.T. (1999): BGS Rock Classification Scheme, Volume 1: Classification of igneous rocks. British Geological Survey Research Report, RR 99-06.",
        "CCOP Geodata Repository (2020): Specimen Photographic Archive for Cambodian Carbonate, Sandstone, Basalt, and Lateritic Profiles (Specimens CAM_GDP_0050, 0051, 0003, MDK25015, MDK25016). Coordinating Committee for Geoscience Programmes in East and Southeast Asia.",
        "BGI / Bureau Gravimetrique International (2012): World Gravity Map 2012 (WGM2012) Global Bouguer and Isostatic Gravity Anomaly Grids (2 arc-minute resolution). Commission for the Geological Map of the World (CGMW), UNESCO.",
        "Meyer, B., Saltus, R., Chulliat, A. (2017): EMAG2v3: Earth Magnetic Anomaly Grid (2-arc-minute resolution), Version 3, NOAA National Centers for Environmental Information. doi:10.7289/V5H70CVX.",
        "Sandwell, D.T., et al. (2014): New global marine gravity model from CryoSat-2 and Jason-1 reveals buried tectonic structure. Science 346, 65-67. Scripps Institution of Oceanography, UCSD."
      ],
      bulletsKm: [
        "JICA (២០១០)៖ ផែនការមេសម្រាប់ការលើកកម្ពស់វិស័យឧស្សាហកម្មរ៉ែនៅព្រះរាជាណាចក្រកម្ពុជា។ ទីភ្នាក់ងារសហប្រតិបត្តិការអន្តរជាតិនៃប្រទេសជប៉ុន (JICA) និងក្រសួងឧស្សាហកម្ម រ៉ែ និងថាមពល (MIME) របាយការណ៍ស្ថាពរ និងឧបសម្ព័ន្ធវិភាគ V-4 (រូបថតចុះវាល) V-5 (សំណាកថ្ម ៧៤) V-7 (គីមីថ្មសរុប XRF) V-8 (ធាតុវិភាគ ៣៦) និង V-10 (គីមីដីល្បាប់)។",
        "នាយកដ្ឋានភូគព្ភសាស្ត្រ / GDMR (២០១៤)៖ ផែនទីភូគព្ភសាស្ត្រ និងរចនាសម្ព័ន្ធនៃព្រះរាជាណាចក្រកម្ពុជា (មាត្រដ្ឋាន ១:៥០០,០០០)។ អគ្គនាយកដ្ឋានធនធានរ៉ែ ក្រសួងរ៉ែ និងថាមពល (MME) រាជធានីភ្នំពេញ។",
        "Shellnutt, J.G., Nguyen, D.T., Lee, H.Y. (២០២៣)៖ សកម្មភាពម៉ាក់ម៉ាធ្នូកោះយុគគ្រីតាសេនៅកម្ពុជាភាគខាងកើត៖ ផលប៉ះពាល់នៃការរងសម្ពាធមហាសមុទ្រប៉ាស៊ីហ្វិកបុរាណក្រោមប្លុកឥណ្ឌូចិន។ Frontiers in Earth Science, 11:1110568. doi:10.3389/feart.2023.1110568.",
        "Gillespie, M.R. & Styles, M.T. (១៩៩៩)៖ គ្រោងការណ៍ចំណាត់ថ្នាក់ថ្ម BGS ភាគ ១៖ ចំណាត់ថ្នាក់សិលាអគ្នី។ របាយការណ៍ស្រាវជ្រាវរបស់អង្គការអង្កេតភូគព្ភសាស្ត្រអង់គ្លេស (British Geological Survey) RR 99-06.",
        "ឃ្លាំងទិន្នន័យភូគព្ភសាស្ត្រ CCOP (២០២០)៖ បណ្ណសាររូបថតសំណាកថ្មកាបូណាត ថ្មភក់ ថ្មបាសាល់ និងមុខកាត់ដីឡាតេរីតនៅកម្ពុជា (សំណាក CAM_GDP_0050, 0051, 0003, MDK25015, MDK25016)។ គណៈកម្មាធិការសម្របសម្រួលកម្មវិធីភូគព្ភសាស្ត្រប្រចាំតំបន់អាស៊ីបូព៌ា និងអាស៊ីអាគ្នេយ៍ (CCOP)។",
        "BGI / Bureau Gravimétrique International (២០១២)៖ ផែនទីទំនាញផែនដីពិភពលោក ២០១២ (WGM2012) ក្របខ័ណ្ឌអានូម៉ាលីទំនាញប៊ូហ្គ័រ និងអ៊ីសូស្តាស៊ីសកល។ គណៈកម្មការសម្រាប់ផែនទីភូគព្ភសាស្ត្រពិភពលោក (CGMW) អង្គការយូណេស្កូ (UNESCO)។",
        "Meyer, B., Saltus, R., Chulliat, A. (២០១៧)៖ EMAG2v3: ក្រឡាចត្រង្គអានូម៉ាលីដែនម៉ាញ៉េទិចផែនដី (កម្រិត ២ នាទី) កំណែទី ៣ NOAA NCEI. doi:10.7289/V5H70CVX.",
        "Sandwell, D.T., et al. (២០១៤)៖ គំរូទំនាញផែនដីសមុទ្រសកលពីផ្កាយរណប CryoSat-2 និង Jason-1 បង្ហាញរចនាសម្ព័ន្ធតិចតូនិចកប់ក្នុងជម្រៅជ្រៅ។ ទស្សនាវដ្តី Science 346, 65-67 វិទ្យាស្ថានមហាសមុទ្រ Scripps សាកលវិទ្យាល័យកាលីហ្វ័រញ៉ា សាន់ឌីអេហ្គោ (UCSD)។"
      ]
    }
  ],
    takeawaysEn: [
      "Cambodia's bedrock consists of three foundational classes: igneous plutons/basalts, Mesozoic sandstones, and older metamorphic schists.",
      "The newly integrated 2026 Atlas provides 74 surveyed rock samples, whole-rock XRF geochemistry, and thin-section microphotographs.",
      "Field identification relies on crystal grain size, mineral cleavage, TAS chemical coordinates, and regional tectonic context.",
      "The rich red soils of eastern provinces directly derive from the weathering of Quaternary alkali basalts.",
    ],
    takeawaysKm: [
      "គ្រឹះថ្មនៅកម្ពុជារួមមានបីប្រភេទធំៗ៖ ថ្មម៉ាក់ម៉ាក្រានីត/បាសាល់ ថ្មភក់យុគកណ្តាលសត្វ និងថ្មប្រែរូបសៀសចំណាស់ៗ។",
      "កម្រងអាត្លាសឆ្នាំ២០២៦ ថ្មីនេះ ផ្តល់នូវសំណាកថ្មវាល ៧៤ កន្លែង ការវិភាគគីមីថ្មសរុប XRF និងរូបថតកាត់បន្ទះស្តើងក្រោមមីក្រូទស្សន៍។",
      "ការកំណត់អត្តសញ្ញាណនៅទីវាលពឹងផ្អែកលើទំហំគ្រាប់ក្រាម លក្ខណៈបំបែកនៃខនិជ កូអរដោនេគីមី TAS និងបរិបទតិចតូនិចតំបន់។",
      "ដីក្រហមមានជីជាតិនៅខេត្តភាគខាងកើតកើតចេញពីការរលួយដោយធាតុអាកាសនៃថ្មបាសាល់អាល់កាលីសម័យទីបួន។",
    ],
    relatedIds: ["bk-history", "bk-hydro", "bk-volcanism"],
  },
  {
    id: "bk-history",
    slug: "geological-history-cambodia",
    category: "General Geology",
    categoryKm: "ភូគព្ភសាស្ត្រទូទៅ",
    titleEn: "Introduction to Cambodia's Geological History & Rock Formations",
    titleKm: "សេចក្តីផ្តើមអំពីប្រវត្តិភូគព្ភសាស្ត្រ និងសណ្ឋានសិលានៅកម្ពុជា",
    excerptEn: "Explore the ancient basement of Indochina, Paleozoic marine sedimentation, Mesozoic continental sandstone plateaus, and Cenozoic basalt volcanism.",
    excerptKm: "ស្វែងយល់អំពីខឿនបុរាណឥណ្ឌូចិន កំណកកករសមុទ្រយុគបុរាណសត្វ ខ្ពង់រាបថ្មភក់ដីគោកយុគកណ្តាលសត្វ និងបន្ទុះភ្នំភ្លើងបាសាល់យុគថ្មី។",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    date: "2026-10-20",
    authorEn: "Cambodian Geoscience Committee",
    authorKm: "គណៈកម្មាធិការភូគព្ភសាស្ត្រកម្ពុជា",
    tagEn: "Core Foundation",
    tagKm: "មូលដ្ឋានគ្រឹះ",
    sections: [
      {
        id: "indochina-basement",
        headingEn: "1. The Indochina Craton and Basement Formation",
        headingKm: "១. ខឿនទ្វីបឥណ្ឌូចិន និងការកកើតគ្រឹះបុរាណ",
        contentEn: "Cambodia occupies the southwestern core of the Indochina Terrane, an ancient continental fragment that was detached from Gondwana during the Paleozoic era and drifted northward to amalgamate with Eurasia.",
        contentKm: "កម្ពុជាស្ថិតនៅលើចំណុចកណ្តាលភាគនិរតីនៃប្លាកទ្វីបឥណ្ឌូចិន ដែលជាបំណែកទ្វីបបុរាណរបេះចេញពីទ្វីបហ្គុងវ៉ាណា (Gondwana) ក្នុងស័កបុរាណសត្វ ហើយរសាត់ទៅទិសខាងជើងដើម្បីបញ្ចូលគ្នាជាមួយទ្វីបអឺរ៉ាស៊ី។",
      },
      {
        id: "indosinian-orogeny",
        headingEn: "2. The Indosinian Orogeny & Mountain Building",
        headingKm: "២. ចលនាភ្នំឥណ្ឌូស៊ីនៀ និងការកកើតជួរភ្នំ",
        contentEn: "During the Permian to Triassic, the collision between the Sibumasu and Indochina blocks triggered the massive Indosinian Orogeny. This crustal shortening generated extensive fold-and-thrust belts, regional metamorphism, and widespread granitic batholithic intrusions.",
        contentKm: "អំឡុងយុគពែរមៀនដល់ត្រីយ៉ាស ការបុកទង្គិចគ្នារវាងប្លាកស៊ីប៊ូម៉ាស៊ូ (Sibumasu) និងឥណ្ឌូចិន បានបង្កជាចលនាភ្នំឥណ្ឌូស៊ីនៀដ៏ធំសម្បើម បង្កើតជាខ្សែក្រវាត់ផ្នត់ និងការជ្រៀតចូលនៃថ្មក្រានីតបាតូលីតយ៉ាងទូលំទូលាយ។",
      },
      {
        id: "mesozoic-sandstones",
        headingEn: "3. Mesozoic Continental Sedimentation",
        headingKm: "៣. កំណកកករដីគោកយុគកណ្តាលសត្វ",
        contentEn: "Following the orogeny, regional thermal subsidence created extensive intracontinental depressions, resulting in thick sandstone and conglomerate accumulations known as the Khorat and Cardamom basins.",
        contentKm: "ក្រោយចលនាភ្នំ ការស្រុតចុះនៃសំបកផែនដីបានបង្កើតអាងទឹករាក់ក្នុងដីគោក បង្កជាកម្រាស់ថ្មភក់ និងថ្មកុងក្លូមេរ៉ាដ៏ក្រាស់ ដែលគេស្គាល់ថាជាអាងកូរ៉ាត និងអាងជួរភ្នំក្រវាញ។",
      },
      {
        id: "cenozoic-quaternary",
        headingEn: "4. Cenozoic Faulting and Basalt Volcanism",
        headingKm: "៤. បំណាក់យុគទីបី និងបន្ទុះភ្នំភ្លើងបាសាល់យុគទីបួន",
        contentEn: "Extensional tectonics during the late Cenozoic generated strike-slip faults and intraplate volcanic fields, culminating in extensive basalt flows that blanketed northeastern Cambodia.",
        contentKm: "តិចតូនិចពង្រីកសំបកផែនដីក្នុងយុគទីបីចុងក្រោយបានបង្កើតបំណាក់រអិលផ្តេក និងវាលបន្ទុះភ្នំភ្លើងកម្អែបាសាល់យ៉ាងក្រាស់នៅភាគឦសានប្រទេសកម្ពុជា។",
      },
    ],
    takeawaysEn: [
      "The Indochina Terrane originated from Gondwana before docking with Eurasian continental margins.",
      "The Indosinian Orogeny is the single most defining mountain-building event in Cambodian geology.",
      "Modern terrain reflects Mesozoic sandstone relief preserved over millions of years of selective erosion.",
    ],
    takeawaysKm: [
      "ប្លាកទ្វីបឥណ្ឌូចិនមានប្រភពចេញពីទ្វីបហ្គុងវ៉ាណា មុនពេលរសាត់មកភ្ជាប់ជាមួយជាយទ្វីបអឺរ៉ាស៊ី។",
      "ចលនាភ្នំឥណ្ឌូស៊ីនៀគឺជាព្រឹត្តិការណ៍បង្កើតភ្នំដ៏សំខាន់បំផុតនៅក្នុងប្រវត្តិភូគព្ភសាស្ត្រកម្ពុជា។",
      "ទម្រង់ដីសព្វថ្ងៃឆ្លុះបញ្ចាំងពីថ្មភក់យុគកណ្តាលសត្វដែលនៅគង់វង្សក្រោយរាប់លានឆ្នាំនៃការសឹករិចរិល។",
    ],
    relatedIds: ["bk-rocks", "bk-structures", "bk-volcanism"],
  },
  {
    id: "bk-hydro",
    slug: "hydrogeology-basics-aquifers",
    category: "Groundwater",
    categoryKm: "ទឹកក្រោមដី",
    titleEn: "Hydrogeology Basics: How Aquifers Function in the Lower Mekong Basin",
    titleKm: "មូលដ្ឋានគ្រឹះវារីភូគព្ភសាស្ត្រ៖ ដំណើរការនៃស្រទាប់ផ្ទុកទឹកនៅអាងទន្លេមេគង្គក្រោម",
    excerptEn: "Understand unconfined alluvial aquifers, recharge dynamics, seasonal water-table fluctuations, and natural groundwater filtration.",
    excerptKm: "ស្វែងយល់អំពីស្រទាប់ផ្ទុកទឹកល្បាប់ជ្រាយ ថាមវន្តនៃការជ្រាបបំពេញទឹកឡើងវិញ ការប្រែប្រួលកម្រិតទឹកតាមរដូវ និងការច្រោះទឹកក្រោមដីតាមធម្មជាតិ។",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    date: "2026-10-15",
    authorEn: "Groundwater Research Group",
    authorKm: "ក្រុមស្រាវជ្រាវទឹកក្រោមដី",
    tagEn: "Environmental Insight",
    tagKm: "បរិស្ថាន និងធនធានទឹក",
    sections: [
      {
        id: "aquifer-types",
        headingEn: "1. Alluvial Aquifer Architecture",
        headingKm: "១. រចនាសម្ព័ន្ធស្រទាប់ផ្ទុកទឹកល្បាប់ទន្លេ",
        contentEn: "The Lower Mekong Basin in Cambodia contains two primary groundwater zones: shallow unconfined Quaternary alluvial sand aquifers, and deeper semi-confined to confined Neogene gravel beds.",
        contentKm: "អាងទន្លេមេគង្គក្រោមនៅកម្ពុជាមានស្រទាប់ទឹកក្រោមដីសំខាន់ពីរ៖ ស្រទាប់ផ្ទុកទឹកល្បាប់ខ្សាច់រាក់យុគទីបួន និងស្រទាប់គ្រួសក្រួសជម្រៅជ្រៅយុគទីបី។",
      },
      {
        id: "recharge-dynamics",
        headingEn: "2. Seasonal Recharge and Fluvial Coupling",
        headingKm: "២. ថាមវន្តនៃការជ្រាបបំពេញទឹកឡើងវិញ និងទំនាក់ទំនងទន្លេ",
        contentEn: "During the monsoon season, high river discharge from the Mekong and Tonle Sap recharges the shallow aquifer, raising the water table by several meters. In the dry season, the flow partially reverses.",
        contentKm: "ក្នុងរដូវវស្សា បរិមាណទឹកហូរខ្ពស់ពីទន្លេមេគង្គ និងបឹងទន្លេសាបជ្រាបចូលបំពេញស្រទាប់ទឹកក្រោមដី ធ្វើឱ្យកម្រិតទឹកឡើងខ្ពស់ជាច្រើនម៉ែត្រ។ ក្នុងរដូវប្រាំង ទិសដៅលំហូរអាចបញ្រ្ចាសត្រឡប់មកវិញមួយផ្នែក។",
      },
      {
        id: "water-quality",
        headingEn: "3. Water Quality & Naturally Occurring Arsenic",
        headingKm: "៣. គុណភាពទឹក និងសារធាតុអាសេនិចធម្មជាតិ",
        contentEn: "Naturally occurring arsenic is found in reducing geochemical environments within Holocene alluvial sediments along the Mekong floodplain. Continuous monitoring and community filtration are vital for safe drinking water.",
        contentKm: "សារធាតុអាសេនិចធម្មជាតិត្រូវបានរកឃើញនៅក្នុងបរិស្ថានភូគីមីបន្សាបអុកស៊ីហ្សែននៃល្បាប់ដីសើមតាមដងទន្លេមេគង្គ។ ការត្រួតពិនិត្យជាប្រចាំ និងប្រព័ន្ធច្រោះសហគមន៍មានសារៈសំខាន់បំផុតសម្រាប់សុវត្ថិភាពទឹកពិសា។",
        calloutEn: "Shallow wells in Holocene alluvium require periodic laboratory testing for arsenic, iron, and dissolved solids.",
        calloutKm: "អណ្តូងរាក់ក្នុងល្បាប់ទន្លេត្រូវតែធ្វើតេស្តមន្ទីរពិសោធន៍ជាទៀងទាត់លើសារធាតុអាសេនិច ជាតិដែក និងសារធាតុរំលាយ។",
      },
    ],
    takeawaysEn: [
      "Shallow unconfined aquifers are closely coupled with the annual flood cycle of the Mekong-Tonle Sap river network.",
      "Deeper confined aquifers generally offer lower risk of microbiological contamination.",
      "Arsenic testing remains essential for rural water supply boreholes in young alluvial plains.",
    ],
    takeawaysKm: [
      "ស្រទាប់ផ្ទុកទឹកក្រោមដីរាក់មានទំនាក់ទំនងយ៉ាងជិតស្និទ្ធជាមួយវដ្តទឹកជំនន់ប្រចាំឆ្នាំនៃបណ្តាញទន្លេមេគង្គ-ទន្លេសាប។",
      "ស្រទាប់ផ្ទុកទឹកជ្រៅជាទូទៅមានសុវត្ថិភាពខ្ពស់ពីការបំពុលដោយមេរោគ។",
      "ការធ្វើតេស្តអាសេនិចនៅតែជាការចាំបាច់សម្រាប់អណ្តូងស្នប់នៅតាមតំបន់ទំនាបល្បាប់ក្មេងៗ។",
    ],
    relatedIds: ["bk-rocks", "bk-history"],
  },
  {
    id: "bk-mining",
    slug: "mineral-exploration-basics",
    category: "Mining & Resources",
    categoryKm: "ធនធានរ៉ែ",
    titleEn: "Understanding Mineral Exploration: From Outcrop Sampling to Resource Estimation",
    titleKm: "ស្វែងយល់ពីការរុករករ៉ែ៖ ចាប់ពីការយកសំណាកថ្ម ដល់ការប៉ាន់ប្រមាណបរិមាណធនធាន",
    excerptEn: "How geologists discover mineral deposits: geochemical stream sediment sampling, trenching, geophysical anomaly mapping, and core drilling.",
    excerptKm: "របៀបដែលអ្នកភូគព្ភវិទូស្វែងរកជម្រករ៉ែ៖ ការយកសំណាកល្បាប់ស្ទឹង ការជីកលេណដ្ឋាន ការគូសផែនទីភាពមិនប្រក្រតីនៃរូបវិទ្យា និងការខួងស្រង់ស្នូលថ្ម។",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
    date: "2026-10-12",
    authorEn: "General Department of Mineral Resources",
    authorKm: "អគ្គនាយកដ្ឋានធនធានរ៉ែ",
    tagEn: "Industry Overview",
    tagKm: "ទិដ្ឋភាពឧស្សាហកម្ម",
    sections: [
      {
        id: "exploration-stages",
        headingEn: "1. The Exploration Funnel: Reconnaissance to Drilling",
        headingKm: "១. ដំណាក់កាលស្វែងរុករករ៉ែ៖ ពីការរុករកបឋមដល់ការខួង",
        contentEn: "Mineral exploration begins with broad regional geochemical sampling, followed by detailed geophysical surveys and diamond core drilling to delineate ore grade and tonnage.",
        contentKm: "ការរុករករ៉ែចាប់ផ្តើមពីការយកសំណាកភូគីមីថ្នាក់តំបន់ បន្ទាប់មកការស្ទង់រូបវិទ្យាលម្អិត និងការខួងស្រង់ស្នូលថ្មដើម្បីកំណត់កម្រិតគុណភាពរ៉ែ និងបរិមាណ។",
      },
    ],
    takeawaysEn: [
      "Exploration systematically narrows down vast territorial regions into high-potential drill targets.",
      "Modern practices integrate strict environmental and social impact assessments at every stage.",
    ],
    takeawaysKm: [
      "ការរុករកបង្រួមផ្ទៃដីធំៗមកជាទីតាំងគោលដៅខួងដែលមានសក្តានុពលខ្ពស់។",
      "ការអនុវត្តសម័យទំនើបតម្រូវឱ្យមានការវាយតម្លៃហេតុប៉ះពាល់បរិស្ថាន និងសង្គមយ៉ាងម៉ឺងម៉ាត់។",
    ],
    relatedIds: ["bk-rocks", "bk-structures"],
  },
  {
    id: "bk-structures",
    slug: "faults-folds-joints-basics",
    category: "Structural Geology",
    categoryKm: "ភូគព្ភសាស្ត្ររចនាសម្ព័ន្ធ",
    titleEn: "Faults, Folds, and Joints: Geological Structures Explained with Cambodian Outcrops",
    titleKm: "បំណាក់ ផ្នត់ និងប្រេះស្រាំ៖ ការពន្យល់អំពីរចនាសម្ព័ន្ធភូគព្ភសាស្ត្រជាមួយផ្ទាំងថ្មនៅកម្ពុជា",
    excerptEn: "Visual guide to strike-slip faults, anticlines, synclines, and tectonic deformation observed in the Kampot Fold Belt and Cardamom ranges.",
    excerptKm: "មគ្គុទ្ទេសក៍រូបភាពអំពីបំណាក់រអិលផ្តេក ផ្នត់ប៉ោង ផ្នត់ផត និងបម្រែបម្រួលរចនាសម្ព័ន្ធតិចតូនិចនៅខ្សែក្រវាត់ផ្នត់កំពត និងជួរភ្នំក្រវាញ។",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    date: "2026-10-08",
    authorEn: "Tectonics & Geodynamics Lab",
    authorKm: "មន្ទីរពិសោធន៍តិចតូនិច និងភូគព្ភថាមវន្ត",
    tagEn: "Structural Guide",
    tagKm: "មគ្គុទ្ទេសក៍រចនាសម្ព័ន្ធ",
    sections: [
      {
        id: "structural-principles",
        headingEn: "1. Principles of Crustal Deformation",
        headingKm: "១. គោលការណ៍នៃបម្រែបម្រួលសំបកផែនដី",
        contentEn: "Compressional tectonic forces fold brittle-ductile sedimentary sequences, while brittle shear along crustal fracture corridors causes fault displacement.",
        contentKm: "កម្លាំងសង្កត់តិចតូនិចបត់បែនស្រទាប់ថ្មកម្ទេចកំណ ខណៈកម្លាំងកាត់តាមខ្សែបាក់បែកសំបកផែនដីបង្កជាបំណាក់រអិលផ្លាស់ទី។",
      },
    ],
    takeawaysEn: [
      "Fold belts reflect intense compressional episodes from Paleozoic-Mesozoic plate collisions.",
      "Fracture corridors guide groundwater pathways and hydrothermal mineral deposits.",
    ],
    takeawaysKm: [
      "ខ្សែក្រវាត់ផ្នត់ឆ្លុះបញ្ចាំងពីការបុកទង្គិចគ្នានៃប្លាកទ្វីបកាលពីសម័យបុរាណ។",
      "ខ្សែប្រេះស្រាំដើរតួជាផ្លូវលំហូរនៃទឹកក្រោមដី និងកំណកកកររ៉ែទឹកក្តៅក្រោមដី។",
    ],
    relatedIds: ["bk-history", "bk-rocks"],
  },
  {
    id: "bk-volcanism",
    slug: "volcanism-cambodia-basalt",
    category: "General Geology",
    categoryKm: "ភូគព្ភសាស្ត្រទូទៅ",
    titleEn: "Volcanism in Cambodia: Ratanakiri Lava Plateaus and Quaternary Basalt",
    titleKm: "បន្ទុះភ្នំភ្លើងនៅកម្ពុជា៖ ខ្ពង់រាបកម្អែរតនគិរី និងថ្មបាសាល់សម័យទីបួន",
    excerptEn: "Discover the fiery past of northeastern Cambodia, volcanic crater lakes such as Boeng Yeak Laom, and gemstone-bearing gem-gravel layers.",
    excerptKm: "ស្វែងយល់ពីប្រវត្តិភ្នំភ្លើងនៅភាគឦសានប្រទេសកម្ពុជា បឹងមាត់ភ្នំភ្លើងដូចជាបឹងយក្សឡោម និងស្រទាប់ក្រួសកំណកត្បូង។",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    date: "2026-10-05",
    authorEn: "Geoparks & Geoheritage Unit",
    authorKm: "អង្គភាពឧទ្យានភូគព្ភសាស្ត្រ និងបេតិកភណ្ឌ",
    tagEn: "Geoheritage",
    tagKm: "បេតិកភណ្ឌភូគព្ភសាស្ត្រ",
    sections: [
      {
        id: "ratanakiri-volcanism",
        headingEn: "1. The Quaternary Volcanic Field of Ratanakiri",
        headingKm: "១. តំបន់ភ្នំភ្លើងសម័យទីបួននៅខេត្តរតនគិរី",
        contentEn: "Extensive basaltic volcanism produced plateau flows and explosive maar craters. Boeng Yeak Laom is a prime example of a near-perfect circular maar crater lake formed by phreatomagmatic explosions.",
        contentKm: "បន្ទុះភ្នំភ្លើងបាសាល់បានបង្កើតជាខ្ពង់រាបកម្អែ និងមាត់ភ្នំភ្លើងម៉ារ (maar)។ បឹងយក្សឡោមគឺជាគំរូដ៏ល្អឥតខ្ចោះនៃបឹងមាត់ភ្នំភ្លើងរាងមូលដែលកកើតឡើងពីការផ្ទុះប៉ះគ្នារវាងកម្អែ និងទឹកក្រោមដី។",
      },
    ],
    takeawaysEn: [
      "Quaternary intraplate basalts created the distinct volcanic landforms of eastern Cambodia.",
      "Boeng Yeak Laom is an internationally recognized maar crater geoheritage site.",
      "Gem zircon deposits in Ratanakiri are genetically tied to basaltic pipe intrusions.",
    ],
    takeawaysKm: [
      "ថ្មបាសាល់សម័យទីបួនបានបង្កើតទម្រង់ដីភ្នំភ្លើងដ៏ស្រស់បំព្រងនៅភាគខាងកើតកម្ពុជា។",
      "បឹងយក្សឡោមគឺជាទីតាំងបេតិកភណ្ឌភូគព្ភសាស្ត្រមាត់ភ្នំភ្លើងម៉ារទទួលស្គាល់កម្រិតអន្តរជាតិ។",
      "កំណកត្បូងកណ្ដៀង និងត្បូងហ្សៀកុងនៅរតនគិរីមានទំនាក់ទំនងផ្ទាល់ជាមួយបំពង់បន្ទុះភ្នំភ្លើងបាសាល់។",
    ],
    relatedIds: ["bk-rocks", "bk-history"],
  },
];

export function getKnowledgeArticleByIdOrSlug(idOrSlug: string): KnowledgeArticle | undefined {
  if (!idOrSlug) return undefined;
  const clean = idOrSlug.trim().toLowerCase();
  return BASIC_KNOWLEDGE_ARTICLES.find(
    (a) =>
      a.id.toLowerCase() === clean ||
      a.slug.toLowerCase() === clean ||
      // Handle legacy aliases like bk-1, bk-2, bk-3
      (clean === "bk-1" && a.id === "bk-history") ||
      (clean === "bk-2" && a.id === "bk-rocks") ||
      (clean === "bk-3" && a.id === "bk-hydro") ||
      (clean === "bk-4" && a.id === "bk-mining") ||
      (clean === "bk-5" && a.id === "bk-structures") ||
      (clean === "bk-6" && a.id === "bk-volcanism")
  );
}
