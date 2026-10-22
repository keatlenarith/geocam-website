export interface TopicSection {
  titleKm: string;
  titleEn: string;
  bodyKm: string[];
  bodyEn: string[];
  bulletsKm?: string[];
  bulletsEn?: string[];
  calloutKm?: string;
  calloutEn?: string;
}

export interface FocusTopic {
  id: string;
  slug: string;
  key: string;
  titleKm: string;
  titleEn: string;
  shortTitleKm: string;
  shortTitleEn: string;
  image: string;
  imageAlt: string;
  captionKm: string;
  captionEn: string;
  leadKm: string;
  leadEn: string;
  stats: { labelKm: string; labelEn: string; value: string }[];
  sections: TopicSection[];
  relatedPaperIds: string[];
  keyHighlightsKm: string[];
  keyHighlightsEn: string[];
}

export const FOCUS_TOPICS: FocusTopic[] = [
  {
    id: "tectonics",
    slug: "tectonics",
    key: "Tectonics",
    titleKm: "តិចតូនិកនៃប្រទេសកម្ពុជា និងការវិវត្តរចនាសម្ព័ន្ធដែនដី",
    titleEn: "Tectonics of Cambodia & Regional Geodynamics",
    shortTitleKm: "តិចតូនិក",
    shortTitleEn: "Tectonics",
    image: "/images/cms/focus-tectonics-image.jpg",
    imageAlt: "Tectonic framework map of Cambodia and Indochina Terrane",
    captionKm: "គ្រោងរចនាសម្ព័ន្ធតិចតូនិក និងតំបន់ភ្ជាប់ប្លុកនៅតំបន់អាស៊ីអាគ្នេយ៍ និងកម្ពុជា",
    captionEn: "Tectonic architecture and suture zones of Cambodia within mainland Southeast Asia",
    leadKm: "ប្រទេសកម្ពុជាស្ថិតនៅលើប្លុកឥណ្ឌូចិន (Indochina Block) ដែលជាផ្នែកមួយដ៏សំខាន់នៃទ្វីបអាស៊ីអាគ្នេយ៍។ ប្រវត្តិសាស្ត្រតិចតូនិករបស់កម្ពុជាឆ្លុះបញ្ចាំងពីការបុកទង្គិច និងផ្សារភ្ជាប់គ្នានៃប្លុកទ្វីបបុរាណ ការកកើតជួរភ្នំឥណ្ឌូស៊ីន និងការរំកិលតាមបណ្តោយបំណាក់សិលាសេណូសូអ៊ិក ដែលបង្កើតបានជាអាងបឹងទន្លេសាប និងទំនាបទន្លេមេគង្គ។",
    leadEn: "Cambodia occupies a core position within the Indochina Terrane of Southeast Asia. Its geodynamic history records Paleozoic–Mesozoic continental collisions, Indosinian orogenesis, and Cenozoic strike-slip fault reactivations that shaped the Tonle Sap basin and Mekong fluvial drainage.",
    stats: [
      { labelKm: "ប្លុកភូគព្ភសាស្ត្រ", labelEn: "Geological Terrane", value: "Indochina Block" },
      { labelKm: "ដំណាក់កាលកកើតភ្នំ", labelEn: "Major Orogeny", value: "Indosinian (Triassic)" },
      { labelKm: "អាងល្បាប់ធំជាងគេ", labelEn: "Principal Basin", value: "Tonle Sap Basin" },
      { labelKm: "ប្រព័ន្ធបំណាក់សិលា", labelEn: "Dominant Faults", value: "NW-SE & NE-SW" },
    ],
    sections: [
      {
        titleKm: "១. ទីតាំងភូមិសាស្ត្រ និងប្លុកឥណ្ឌូចិន (Indochina Terrane)",
        titleEn: "1. Geodynamic Setting & the Indochina Terrane",
        bodyKm: [
          "កម្ពុជាគឺជាស្នូលកណ្តាលនៃប្លុកឥណ្ឌូចិន ដែលត្រូវបានកំណត់ព្រំប្រទល់ដោយតំបន់ភ្ជាប់ប្លុកបុរាណ (Suture zones) ជាច្រើន រួមមានតំបន់ភ្ជាប់ប្លុកសុងម៉ា (Song Ma) នៅភាគឦសាន និងតំបន់ភ្ជាប់ប្លុកស្រះកែវ-ចន្ទបុរី (Sa Kaeo-Chanthaburi Suture) នៅភាគនិរតី។",
          "គ្រឹះរឹងបុរាណ (Basement) ត្រូវបានផ្សំឡើងដោយសិលារូបប្រែ និងសិលាអគ្នីអាយុកាលពីប៉ាឡេអូសូអ៊ិក ដែលគ្របដណ្តប់ដោយស្រទាប់សិលាល្បាប់មេសូសូអ៊ិក (Mesozoic red beds) និងកករកម្រាលល្បាប់ទឹកជំនន់សេណូសូអ៊ិក (Quaternary alluvium)។",
        ],
        bodyEn: [
          "Cambodia forms the core of the Indochina Terrane, bounded by ancient sutures including the Song Ma Suture to the northeast and the Sa Kaeo-Chanthaburi Suture to the southwest along the Thai-Cambodia border.",
          "The crystalline basement consists of Paleozoic metamorphic complexes and granitoid plutons, overlain unconformably by Mesozoic continental red beds and extensive Quaternary-Cenozoic alluvial cover.",
        ],
        bulletsKm: [
          "ប្លុកឥណ្ឌូចិនបានបំបែកចេញពីមហាទ្វីបហ្គុងវ៉ាណា (Gondwana) កាលពីដើមសម័យប៉ាឡេអូសូអ៊ិក។",
          "ការបុកទង្គិចរវាងប្លុកស៊ីប៊ូម៉ាស៊ូ (Sibumasu) និងឥណ្ឌូចិនក្នុងសម័យទ្រីយ៉ាសិក បង្កើតបានជាជួរភ្នំឥណ្ឌូស៊ីន (Indosinian Orogeny)។",
        ],
        bulletsEn: [
          "The Indochina terrane rifted from northern Gondwana during the Early Paleozoic.",
          "Triassic collision between Sibumasu and Indochina drove the Indosinian Orogeny and widespread granite magmatism.",
        ],
      },
      {
        titleKm: "២. បំណាក់សិលាសេណូសូអ៊ិក និងការកម្រើកឡើងវិញ (Cenozoic Fault Reactivation)",
        titleEn: "2. Cenozoic Extrusion & Strike-Slip Fault Reactivation",
        bodyKm: [
          "ផលវិបាកនៃការបុកទង្គិចគ្នារវាងទ្វីបឥណ្ឌា និងទ្វីបអឺរ៉ាស៊ី (India-Asia Collision) កាលពីប្រមាណ ៥០ លានឆ្នាំមុន បានបណ្តាលឱ្យប្លុកឥណ្ឌូចិនរំកិលរុញច្រានចេញទៅទិសអាគ្នេយ៍ (Extrusion Tectonics)។",
          "ប្រព័ន្ធបំណាក់សិលាសំខាន់ៗទិសពាយព្យ-អាគ្នេយ៍ (NW-SE) ដូចជាបំណាក់សិលាមែពីង (Mae Ping Fault) និងបំណាក់សិលាចេតិយបី (Three Pagodas Fault) បានកម្រើកឡើងវិញយ៉ាងខ្លាំង បង្កើតបានជាអាងទម្រង់ទាញពង្រីក (Pull-apart basins) និងបន្ទាត់បន្ទុះភ្នំភ្លើងបាសាល់។",
        ],
        bodyEn: [
          "The ongoing indentation of India into Eurasia since ~50 Ma generated massive lateral extrusion of Indochina toward the southeast along crustal-scale strike-slip shear zones.",
          "Major NW-SE and NE-SW faults—such as extensions of the Mae Ping and Three Pagodas fault systems—were reactivated as sinistral then dextral strike-slip corridors, controlling basin subsidence and intraplate volcanism.",
        ],
        calloutKm: "ចំណុចសំខាន់៖ បំណាក់សិលាក្នុងប្រទេសកម្ពុជាភាគច្រើនជាបំណាក់សិលារំកិលផ្ដេក (Strike-slip faults) ដែលបង្កើតបានជារចនាសម្ព័ន្ធជ្រលង និងអាងកករល្បាប់។",
        calloutEn: "Key takeaway: Strike-slip fault kinematics dominate Cambodia's structural fabric, directly controlling the morphology of its primary river valleys and lake basins.",
      },
      {
        titleKm: "៣. ការវិវត្តអាងបឹងទន្លេសាប និងទន្លេមេគង្គ (Tonle Sap & Mekong Basins)",
        titleEn: "3. Structural Evolution of the Tonle Sap & Mekong Basins",
        bodyKm: [
          "អាងបឹងទន្លេសាបជាអាងទាញពង្រីកតិចតូនិក (Pull-apart tectonic depression) ដែលស្ថិតនៅចំកណ្តាលប្រទេសកម្ពុជា។ ការស្រុតចុះនៃសំបកផែនដីបានអនុញ្ញាតឱ្យកករល្បាប់ទន្លេ និងបឹងកកកុញរាប់រយម៉ែត្រក្នុងសម័យក្វាទែណារី។",
          "លំហូរទន្លេមេគង្គកាត់តាមប្រទេសកម្ពុជាត្រូវបានកែប្រែដោយរចនាសម្ព័ន្ធតិចតូនិកកម្រើកថ្មី (Neotectonics) ជាពិសេសនៅចំណុចល្បាក់ខោន (Khone Falls) និងបណ្តោយបន្ទាត់បំណាក់សិលាក្រចេះ-កំពង់ចាម។",
        ],
        bodyEn: [
          "The Tonle Sap depression developed as a transtensional pull-apart basin during Neogene-Quaternary crustal extension, creating an immense sediment sink that traps monsoon floodwaters.",
          "The course of the Mekong River through Cambodia is strictly guided by underlying structural lineaments, including fault-controlled bedrock gorges and the Khone Falls knickpoint at the Laos border.",
        ],
      },
    ],
    relatedPaperIds: [
      "web05",
      "local-1e2550d30286",
      "local-fc48e0cb2b24",
      "local-5607ec1f1471",
      "local-213a3ea52781",
      "local-b40e5b3443cb",
      "local-7d51b80534c0",
    ],
    keyHighlightsKm: [
      "ទីតាំងកណ្តាលក្នុងប្លុកឥណ្ឌូចិន ហ៊ុំព័ទ្ធដោយតំបន់ភ្ជាប់ប្លុកបុរាណ",
      "ប្រព័ន្ធបំណាក់សិលារំកិលផ្ដេកសេណូសូអ៊ិក ទិសពាយព្យ-អាគ្នេយ៍",
      "អាងបឹងទន្លេសាបជាអាងស្រុតតិចតូនិកប្រភេទ Pull-apart",
      "ការកម្រើកថ្មីនៃបំណាក់សិលា និងការគ្រប់គ្រងលើលំហូរទន្លេមេគង្គ",
    ],
    keyHighlightsEn: [
      "Central position in the Indochina Terrane bounded by ancient collisional sutures",
      "Cenozoic strike-slip fault reactivations linked to India-Asia continental collision",
      "Tonle Sap pull-apart depression governing central Cambodian hydrology",
      "Neotectonic lineaments controlling Mekong River incised channels and waterfalls",
    ],
  },
  {
    id: "mineral-deposits",
    slug: "mineral-deposits",
    key: "Mineral deposits",
    titleKm: "ជម្រកដែក និងភូគព្ភសាស្ត្ររ៉ែនៅកម្ពុជា",
    titleEn: "Mineral Deposits, Ore Geology & Metallogeny of Cambodia",
    shortTitleKm: "ជម្រកដែក",
    shortTitleEn: "Mineral deposits",
    image: "/images/cms/focus-mineral-deposits-image.jpg",
    imageAlt: "Magmatic-hydrothermal ore deposition and mineral veins in Cambodia",
    captionKm: "គំរូប្រព័ន្ធរ៉ែមាក់ម៉ា-អ៊ីដ្រូទែម៉ាល់ និងការកកើតជម្រករ៉ែមាស លោហៈមូលដ្ឋាន និងរ៉ែដែក",
    captionEn: "Magmatic-hydrothermal ore deposition model and mineralization systems in Cambodia",
    leadKm: "ប្រទេសកម្ពុជាសម្បូរទៅដោយធនធានរ៉ែលោហៈ និងអលោហៈចម្រុះ ដែលកកើតឡើងតាមខ្សែក្រវាត់កំណកកកើតរ៉ែសំខាន់ៗ។ ការស្រាវជ្រាវភូគព្ភសាស្ត្ររ៉ែផ្តោតលើជម្រកដែកភ្នំដែក រ៉ែមាសអុកវាវ (Okvau) បុកស៊ីតនៅខ្ពង់រាប និងត្បូងធម្មជាតិប៉ៃលិន ដោយឈរលើគោលការណ៍វិទ្យាសាស្ត្រ និងការរុករកប្រកបដោយតម្លាភាព។",
    leadEn: "Cambodia hosts diverse metallogenic belts hosting significant gold, base metal, iron, bauxite, and gemstone resources. Modern economic geology focuses on intrusion-related gold, iron skarns, lateritic bauxite, and gemstone-bearing basalts supported by responsible exploration science.",
    stats: [
      { labelKm: "រ៉ែមាសចម្បង", labelEn: "Flagship Gold Deposit", value: "Okvau (Mondulkiri)" },
      { labelKm: "ជម្រករ៉ែដែកប្រវត្តិសាស្ត្រ", labelEn: "Historical Iron Deposit", value: "Phnom Deck (Preah Vihear)" },
      { labelKm: "ធនធានបុកស៊ីត", labelEn: "Bauxite Terrane", value: "Mondulkiri Plateau" },
      { labelKm: "ត្បូងកណ្ដៀង និងទទឹម", labelEn: "Gemstone Fields", value: "Pailin & Samlot" },
    ],
    sections: [
      {
        titleKm: "១. ខ្សែក្រវាត់រ៉ែ និងបរិបទភូគព្ភសាស្ត្រ (Metallogenic Belts)",
        titleEn: "1. Metallogenic Architecture & Belts",
        bodyKm: [
          "ការកកើតរ៉ែនៅកម្ពុជាត្រូវបែងចែកជាខ្សែក្រវាត់សំខាន់ៗ៖ ខ្សែក្រវាត់ភ្នំផ្នត់ឡឺយ (Loei Fold Belt) លាតសន្ធឹងមកប៉ែកខាងលិច ខ្សែក្រវាត់ដាឡាត់-ក្រចេះ (Dalat-Kratie Belt) នៅប៉ែកខាងកើត និងតំបន់កណ្តាលកំពង់ធំ-ព្រះវិហារ។",
          "សកម្មភាពមាក់ម៉ាក្នុងសម័យទ្រីយ៉ាសិក ជូរ៉ាស៊ីក និងក្រេតាសេ បានចាក់បញ្ចូលជាតិរ៉ែតាមរយៈចរន្តទឹកក្ដៅក្រោមដី (Hydrothermal fluids) បង្កើតបានជាសរសៃរ៉ែមាស រ៉ែស្ពាន់ រ៉ែសំណ-ស័ង្កសី និងរ៉ែដែក។",
        ],
        bodyEn: [
          "Cambodia's mineral wealth is structured along major arc and back-arc metallogenic belts: the southern extension of the Loei-Phetchabun Fold Belt in western Cambodia, the Dalat-Kratie volcanic arc in eastern Cambodia, and the central Kampong Thom-Preah Vihear belt.",
          "Mesozoic volcano-plutonic events drove extensive hydrothermal fluid circulation, precipitating intrusion-related gold, porphyry copper-gold prospects, polymetallic skarns, and epithermal veins.",
        ],
      },
      {
        titleKm: "២. រ៉ែមាសអុកវាវ និងប្រព័ន្ធរ៉ែមាសពាក់ព័ន្ធនឹងសិលាអគ្នី (Intrusion-Related Gold)",
        titleEn: "2. Intrusion-Related Gold Systems: Okvau & Eastern Cambodia",
        bodyKm: [
          "រ៉ែមាសអុកវាវ (Okvau Gold Project) ក្នុងខេត្តមណ្ឌលគិរី គឺជាអណ្តូងរ៉ែមាសកម្រិតឧស្សាហកម្មដំបូងគេបង្អស់នៅកម្ពុជា។ ជាតិមាសស្ថិតនៅក្នុងសរសៃថ្មខ្វាត (Quartz-sulphide veins) កាត់កាត់សិលាឌីអូរីត (Diorite intrusion) និងសិលាល្បាប់រូបប្រែ។",
          "នៅភូមិស្យារ៉ុង និងស្រុកស្នួល ក៏មានសក្ដានុពលរ៉ែមាសខ្ពស់ដែលផ្សារភ្ជាប់នឹងប្រព័ន្ធសិលាអគ្នីក្រេតាសេ។",
        ],
        bodyEn: [
          "The Okvau deposit in Mondulkiri province represents Cambodia's flagship commercial gold development, classified as a reduced intrusion-related gold system (RIRGS) hosted in Cretaceous diorite plutons intruding Paleozoic-Mesozoic hornfelsed sediments.",
          "Gold mineralization occurs in sheeted quartz-sulfide veins containing pyrrhotite, arsenopyrite, bismuth tellurides, and native gold, demonstrating significant regional exploration potential across eastern Cambodia.",
        ],
        bulletsKm: [
          "ធនធានរ៉ែមាសអុកវាវមានជាង ១ លានអោនស៍ (Troy Ounces)។",
          "បច្ចេកវិទ្យាកែច្នៃរ៉ែទំនើបធានាការការពារបរិស្ថាន និងការគ្រប់គ្រងសំណល់រ៉ែតាមស្តង់ដារអន្តរជាតិ។",
        ],
        bulletsEn: [
          "Okvau hosts a JORC-compliant reserve exceeding 1 million ounces of gold.",
          "Modern processing leverages international Cyanide Code compliance and dry-stack tailings management.",
        ],
      },
      {
        titleKm: "៣. ជម្រកដែកភ្នំដែក និងរ៉ែបុកស៊ីត (Iron Ore & Bauxite)",
        titleEn: "3. Iron Skarns (Phnom Deck) & Lateritic Bauxite",
        bodyKm: [
          "ភ្នំដែកក្នុងខេត្តព្រះវិហារ គឺជាទីតាំងប្រវត្តិសាស្ត្រនៃការស្លដែកបុរាណសម័យអង្គរ។ តាមលក្ខណៈភូគព្ភសាស្ត្រ វាជាជម្រករ៉ែស្កានដែក (Iron skarn deposit) ដែលកកើតឡើងពីប្រតិកម្មរវាងសិលាក្រានីត និងសិលាកំបោរ។",
          "នៅខ្ពង់រាបខេត្តមណ្ឌលគិរី ការពុកផុយនៃថ្មបាសាល់ក្រោមអាកាសធាតុត្រូពិច បានបង្កើតជាស្រទាប់រ៉ែបុកស៊ីត (Lateritic bauxite) ក្រាស់ ដែលជាប្រភពរ៉ែអាលុយមីញ៉ូមដ៏ធំមួយ។",
        ],
        bodyEn: [
          "Phnom Deck in Preah Vihear province represents an iconic iron ore skarn with ancient metallurgical heritage dating back to the Angkorian Empire. Contact metasomatism between Mesozoic intrusions and Permian limestones generated high-grade magnetite-hematite bodies.",
          "On the basaltic high plateaus of Mondulkiri and Haut Chhlong, intensive Cenozoic tropical weathering generated extensive lateritic bauxite crusts holding major alumina resource potential.",
        ],
      },
      {
        titleKm: "៤. ត្បូងធម្មជាតិប៉ៃលិន និងរតនគិរី (Gemstones & Alkali Basalts)",
        titleEn: "4. Gemstones & Cenozoic Basalt Volcanism",
        bodyKm: [
          "ត្បូងកណ្ដៀង (Sapphire) និងត្បូងទទឹម (Ruby) នៅប៉ៃលិន និងសំឡូត ក៏ដូចជាត្បូងស៊ីកូន (Zircon) នៅរតនគិរី កកើតឡើងពីថ្មម៉ាក់ម៉ាបាសាល់អាល់កាឡាំង (Alkali basalts) ក្នុងសម័យសេណូសូអ៊ិក ដែលបាននាំយកគ្រាប់ត្បូងពីជម្រៅផែនដីឡើងមកលើផ្ទៃ។",
        ],
        bodyEn: [
          "Cambodia's renowned gem corundum (sapphires and rubies) in Pailin and Samlot, alongside gem zircons in Ratanakiri, were brought to the surface as xenocrysts within mantle-derived Cenozoic intraplate alkali basalts.",
        ],
      },
    ],
    relatedPaperIds: [
      "web05",
      "web08",
      "local-59a1797c08e5",
      "local-66f8249914b4",
      "local-c1465040ef30",
      "local-8bebe58c33ec",
      "local-d8ad564a0e4c",
      "local-56f054325dd2",
    ],
    keyHighlightsKm: [
      "ខ្សែក្រវាត់រ៉ែមាស Okvau ប្រព័ន្ធ Intrusion-Related Gold",
      "ជម្រករ៉ែដែកស្កានប្រវត្តិសាស្ត្រភ្នំដែក ខេត្តព្រះវិហារ",
      "រ៉ែបុកស៊ីតលើកម្រាលបាសាល់ខ្ពង់រាបមណ្ឌលគិរី",
      "ត្បូងកណ្ដៀង ទទឹម និងស៊ីកូនក្នុងសិលាបាសាល់ប៉ៃលិន និងរតនគិរី",
    ],
    keyHighlightsEn: [
      "Commercial gold extraction at the Okvau reduced intrusion-related system",
      "Historic iron skarn mineralization at Phnom Deck in Preah Vihear",
      "Extensive lateritic bauxite reserves on Mondulkiri basalt plateaus",
      "Basalt-hosted sapphire, ruby, and zircon gemstone fields in Pailin and Ratanakiri",
    ],
  },
  {
    id: "geochemistry",
    slug: "geochemistry",
    key: "Geochemistry",
    titleKm: "គីមីភូគព្ភសាស្ត្រ និងគុណភាពទឹកក្រោមដីនៅកម្ពុជា",
    titleEn: "Geochemistry & Hydrogeochemistry of Cambodia",
    shortTitleKm: "គីមីភូគព្ភសាស្ត្រ",
    shortTitleEn: "Geochemistry",
    image: "/images/cms/focus-geochemistry-image.jpg",
    imageAlt: "Groundwater quality and hydrogeochemical analysis across Cambodia",
    captionKm: "ផែនទីចែកចាយអាសេនិច និងលក្ខណៈគីមីទឹកក្រោមដីតាមបណ្តោយទន្លេមេគង្គ និងបឹងទន្លេសាប",
    captionEn: "Hydrogeochemical spatial map of groundwater quality and arsenic distribution across Cambodia",
    leadKm: "គីមីភូគព្ភសាស្ត្រដើរតួនាទីយ៉ាងសំខាន់ក្នុងសុខភាពសាធារណៈ និងការស្វែងយល់ពីប្រវត្តិផែនដី។ ការស្រាវជ្រាវផ្តោតលើការចែកចាយសារធាតុអាសេនិចធម្មជាតិក្នុងស្រទាប់ផ្ទុកទឹកវាលទំនាប ការកំណត់អាយុកាលសិលាអគ្នីដោយអ៊ីសូតូបវិទ្យុសកម្ម និងគីមីសិលាបាយក្រៀមក្នុងតំបន់ត្រូពិច។",
    leadEn: "Geochemistry underpins public health protection and Earth history reconstruction in Cambodia. Critical research priorities include naturally occurring groundwater arsenic contamination in alluvial plains, isotope geochronology of magmatic arcs, and tropical laterite chemical weathering.",
    stats: [
      { labelKm: "បញ្ហាទឹកក្រោមដីចម្បង", labelEn: "Key Water Issue", value: "Arsenic (As) in Lowlands" },
      { labelKm: "ស្រទាប់ផ្ទុកទឹកងាយរងគ្រោះ", labelEn: "Vulnerable Aquifer", value: "Holocene Alluvium" },
      { labelKm: "វិធីសាស្ត្រកំណត់អាយុ", labelEn: "Dating Method", value: "Zircon U-Pb & Lu-Hf" },
      { labelKm: "កម្រិតអាសេនិចអតិបរមា", labelEn: "Cambodia Standard", value: "50 μg/L (WHO: 10 μg/L)" },
    ],
    sections: [
      {
        titleKm: "១. បញ្ហាអាសេនិចក្នុងទឹកក្រោមដីវាលទំនាប (Groundwater Arsenic Dynamics)",
        titleEn: "1. Groundwater Arsenic Problem in Holocene Floodplains",
        bodyKm: [
          "នៅតាមបណ្តោយដងទន្លេមេគង្គ ទន្លេបាសាក់ និងជុំវិញបឹងទន្លេសាប (ជាពិសេសខេត្តកណ្តាល ព្រៃវែង និងកំពង់ចាម) ស្រទាប់ផ្ទុកទឹកអណ្តូងស្នប់រាក់ (កម្រិតជម្រៅពី ២០ ទៅ ៦០ ម៉ែត្រ) ជួបប្រទះការប្រមូលផ្តុំអាសេនិចធម្មជាតិកម្រិតខ្ពស់។",
          "អាសេនិចនេះមិនមែនបណ្តាលមកពីរោងចក្រឧស្សាហកម្មនោះទេ ប៉ុន្តែជាអាសេនិចដែលរលាយចេញពីកករល្បាប់ធម្មជាតិក្រោមលក្ខខណ្ឌគីមីជាក់លាក់។",
        ],
        bodyEn: [
          "In floodplain aquifers along the Mekong, Bassac, and Tonle Sap river systems (especially Kandal, Prey Veng, and Kampong Cham provinces), shallow tubewells (20–60 m depth) frequently tap groundwater with elevated natural arsenic concentrations far exceeding safe limits.",
          "This contamination is entirely geological in origin, derived from pristine Himalayan sediments transported downstream and deposited in dynamic deltaic wetlands.",
        ],
      },
      {
        titleKm: "២. យន្តការគីមីនៃការរំលាយអាសេនិច (Reductive Dissolution Mechanism)",
        titleEn: "2. Geochemical Mechanism of Arsenic Mobilization",
        bodyKm: [
          "យន្តការគីមីចម្បងគឺ ការរំលាយបែបកាត់បន្ថយអុកស៊ីសែន (Microbial Reductive Dissolution) នៃសារធាតុរ៉ែអុកស៊ីតដែក (Fe-oxyhydroxides)។",
          "វត្តមានសារធាតុសរីរាង្គក្នុងដីល្បាប់ទំនាបបានជំរុញឱ្យបាក់តេរីប្រើប្រាស់ជាតិដែក ធ្វើឱ្យអាសេនិចដែលជាប់នៅជាមួយជាតិដែកត្រូវរលាយចូលទៅក្នុងទឹកក្រោមដី។ ផ្ទុយទៅវិញ ស្រទាប់ផ្ទុកទឹកជម្រៅជ្រៅ (Pleistocene aquifers) ច្រើនតែមានសុវត្ថិភាពពីជាតិអាសេនិច។",
        ],
        bodyEn: [
          "The dominant biogeochemical mechanism driving arsenic release is the microbial reductive dissolution of iron oxyhydroxides (FeOOH) within organically rich, anoxic Holocene sediment packages.",
          "Sedimentary organic matter fuels heterotrophic microbial respiration that reduces Fe(III) to soluble Fe(II), releasing strongly adsorbed arsenic directly into the pore water. Conversely, deeper Pleistocene sandy aquifers are predominantly arsenic-safe.",
        ],
        calloutKm: "វិទ្យាសាស្ត្រការពារសុខភាព៖ ការស្វែងយល់ពីគីមីភូគព្ភសាស្ត្រជួយឱ្យអ្នកបច្ចេកទេសអាចខួងអណ្តូងទឹកដល់ជម្រៅស្រទាប់ដែលមានសុវត្ថិភាពពីជាតិអាសេនិច។",
        calloutEn: "Health relevance: High-resolution hydrogeochemical mapping allows drillers to target deeper, oxidized Pleistocene aquifers that guarantee arsenic-free potable water.",
      },
      {
        titleKm: "៣. គីមីសិលាមាក់ម៉ា និងការកំណត់អាយុដោយអ៊ីសូតូប (Igneous Geochemistry & Geochronology)",
        titleEn: "3. Igneous Geochemistry & Isotope Geochronology",
        bodyKm: [
          "ការវិភាគធាតុគីមីចម្បង (Major elements) ធាតុបង្កកម្រិតទាប (Trace elements) និងដីកម្រ (Rare Earth Elements - REE) លើថ្មក្រានីតភ្នំឱរ៉ាល់ និងថ្មអគ្នីនៅកម្ពុជា ជួយបង្ហាញពីប្រភពកំណើតនៃសិលាមាក់ម៉ា។",
          "ការកំណត់អាយុដោយអ៊ីសូតូប U-Pb លើគ្រាប់ស៊ីកូន (Zircon) បានបញ្ជាក់ថា សកម្មភាពមាក់ម៉ាក្នុងប្រទេសកម្ពុជាមានអាយុកាលតាំងពី ៣០០ លានឆ្នាំ (Late Carboniferous-Permian) រហូតដល់សម័យក្រេតាសេ (Cretaceous)។",
        ],
        bodyEn: [
          "Whole-rock geochemical assays (XRF and ICP-MS) combined with in situ zircon U-Pb and Lu-Hf isotope analyses have resolved the complex magmatic evolution of Cambodian plutons, such as the Aoral granite and Dalat-Kratie arc complexes.",
          "Data demonstrate episodic magmatism spanning Late Paleozoic subduction through Mesozoic arc accretion and post-collisional crustal melting.",
        ],
      },
    ],
    relatedPaperIds: [
      "web02",
      "web05",
      "web06",
      "web13",
      "local-6ffdb410074f",
      "local-bca22ca3de4c",
      "local-3434e8da6b9b",
      "local-55f12de512bc",
    ],
    keyHighlightsKm: [
      "ការគ្រប់គ្រងជាតិអាសេនិចក្នុងទឹកក្រោមដីវាលទំនាបទន្លេមេគង្គ-បឹងទន្លេសាប",
      "យន្តការ Microbial Reductive Dissolution នៃរ៉ែអុកស៊ីតដែក",
      "ការកំណត់អាយុថ្មក្រានីតដោយអ៊ីសូតូប Zircon U-Pb",
      "ការវិភាគធាតុដីកម្រ (REE) និងគីមីសិលាបាយក្រៀមត្រូពិច",
    ],
    keyHighlightsEn: [
      "Arsenic hazard mitigation in Lower Mekong and Tonle Sap Holocene aquifers",
      "Microbial reductive dissolution controls on arsenic release into groundwater",
      "High-precision zircon U-Pb isotopic dating of Cambodian plutons and volcanic arcs",
      "Rare earth element (REE) fractionation and tropical laterite soil profiles",
    ],
  },
  {
    id: "geophysics",
    slug: "geophysics",
    key: "Geophysics",
    titleKm: "រូបភូគព្ភសាស្ត្រ និងការរុករកស្រទាប់ក្រោមដីនៅកម្ពុជា",
    titleEn: "Applied Geophysics & Subsurface Exploration in Cambodia",
    shortTitleKm: "រូបភូគព្ភសាស្ត្រ",
    shortTitleEn: "Geophysics",
    image: "/images/cms/focus-geophysics-image.jpg",
    imageAlt: "Airborne magnetic, gravity and geophysical map of Cambodia",
    captionKm: "ទិន្នន័យម៉ាញេទិច និងរំញ័រដីពីលើអាកាស បង្ហាញពីរចនាសម្ព័ន្ធបាតក្រោមដីនៃប្រទេសកម្ពុជា",
    captionEn: "Airborne magnetic and gravity geophysical synthesis highlighting Cambodia's deep basement architecture",
    leadKm: "វិធីសាស្ត្ររូបភូគព្ភសាស្ត្រអនុញ្ញាតឱ្យយើងអាចមើលធ្លុះស្រទាប់ដីល្បាប់កម្រាស់រាប់រយម៉ែត្រ ដើម្បីកំណត់ទម្រង់សំបកផែនដីជម្រៅជ្រៅ។ ការស្ទង់ម៉ាញេទិចពីលើអាកាស ការស្ទង់ទំនាញផែនដី វិធីសាស្ត្ររេស៊ីស្ទីវីតេអគ្គិសនី (ERT) និងរំញ័រដី គឺជាឧបករណ៍គន្លឹះសម្រាប់ការរុករករ៉ែ ធនធានទឹក និងការងារវិស្វកម្មសំណង់។",
    leadEn: "Geophysical methods provide vital non-invasive imaging beneath Cambodia's extensive alluvial blanket. Airborne magnetics, gravity surveys, electrical resistivity tomography (ERT), and seismic sounding resolve deep basement faults, mineralized intrusions, and productive aquifers.",
    stats: [
      { labelKm: "ការស្ទង់លើអាកាស", labelEn: "Airborne Coverage", value: "Magnetics & Radiometrics" },
      { labelKm: "វិធីសាស្ត្ររុករករ៉ែ", labelEn: "Mineral Targeting", value: "IP & Magnetics" },
      { labelKm: "វិធីសាស្ត្រទឹកក្រោមដី", labelEn: "Hydrogeophysics", value: "ERT & TEM" },
      { labelKm: "រចនាសម្ព័ន្ធក្រោមល្បាប់", labelEn: "Hidden Basement", value: "Fault Corridors" },
    ],
    sections: [
      {
        titleKm: "១. ការស្ទង់ម៉ាញេទិច និងវិទ្យុសកម្មពីលើអាកាស (Airborne Geophysical Surveys)",
        titleEn: "1. Airborne Magnetic & Radiometric Mapping",
        bodyKm: [
          "ដោយសារផ្ទៃដីប្រទេសកម្ពុជាភាគច្រើនត្រូវបានគ្របដណ្ដប់ដោយដីល្បាប់ក្វាទែណារី ការអង្កេតដោយផ្ទាល់លើសិលាគ្រឹះមានការលំបាក។ ការស្ទង់ម៉ាញេទិចពីលើអាកាស (Airborne Magnetic Survey) បានក្លាយជាមធ្យោបាយដ៏មានឥទ្ធិពលបំផុតក្នុងការគូសផែនទីបំណាក់សិលាលាក់ខ្លួន និងដុំសិលាអគ្នីជ្រៅៗ។",
          "ទិន្នន័យវិទ្យុសកម្ម (Radiometrics - K, Th, U) ជួយសម្គាល់ការប្រែប្រួលគីមីលើផ្ទៃដី ការបែងចែកប្រភេទសិលា និងការប្រែធាតុ (Hydrothermal alteration)។",
        ],
        bodyEn: [
          "Because vast tracts of Cambodia are blanketed by younger alluvial sediments, airborne aeromagnetic surveys represent the primary tool for revealing subsurface fault corridors, fold axes, and concealed plutons.",
          "Gamma-ray spectrometry (radiometrics tracking Potassium, Thorium, and Uranium channels) distinguishes subtle lithological boundaries, potassium-rich granites, and hydrothermal alteration halos.",
        ],
      },
      {
        titleKm: "២. វិធីសាស្ត្រអគ្គិសនី ERT និង IP (Electrical Resistivity & Induced Polarization)",
        titleEn: "2. Electrical Resistivity (ERT) & Induced Polarization (IP)",
        bodyKm: [
          "វិធីសាស្ត្រអគ្គិសនីរេស៊ីស្ទីវីតេ 2D/3D (Electrical Resistivity Tomography - ERT) ត្រូវបានប្រើប្រាស់យ៉ាងទូលំទូលាយក្នុងការស្វែងរកស្រទាប់ផ្ទុកទឹកសាប ការកំណត់ព្រំប្រទល់ទឹកប្រៃនៅតំបន់ឆ្នេរ និងការសិក្សាប្រហោងកាស្តក្រោមដី។",
          "វិធីសាស្ត្រប៉ូឡារីសកម្មកម្លាំង (Induced Polarization - IP) គឺជាវិធីសាស្ត្រចម្បងក្នុងការរុករកសរសៃរ៉ែស៊ុលភួរ (Disseminated sulfides) ដែលផ្ទុកមាស និងស្ពាន់។",
        ],
        bodyEn: [
          "Electrical Resistivity Tomography (ERT) is widely deployed across Cambodia for freshwater aquifer delineation, mapping saline water intrusion in coastal zones, and detecting underground karst voids and cavities.",
          "Induced Polarization (IP) chargeability measurements specifically identify disseminated sulfide mineral systems containing chalcopyrite and auriferous pyrite concealed beneath weathered overburden.",
        ],
      },
      {
        titleKm: "៣. ការស្ទង់ទំនាញផែនដី និងរំញ័រដី (Gravity & Seismic Investigations)",
        titleEn: "3. Gravity Surveys & Shallow Seismic for Engineering",
        bodyKm: [
          "ទិន្នន័យទំនាញផែនដី (Gravity anomalies) ជួយកំណត់ជម្រៅបាតអាងសិលារឹង និងកម្រាស់កករល្បាប់ក្នុងអាងទន្លេសាប និងអាងបាតសមុទ្រឈូងសមុទ្រកម្ពុជា។",
          "វិធីសាស្ត្ររំញ័រដីរាក់ (Shallow seismic refraction/reflection) ផ្តល់ព័ត៌មានលម្អិតអំពីលក្ខណៈមេកានិចនៃដី និងជម្រៅសិលារឹង សម្រាប់ការសាងសង់ហេដ្ឋារចនាសម្ព័ន្ធធំៗ ដូចជាទំនប់ទឹក ស្ពាន និងអគារខ្ពស់ៗ។",
        ],
        bodyEn: [
          "Regional Bouguer gravity anomaly mapping reveals structural depressions, crustal thinning, and sedimentary thickness across the Tonle Sap Basin and the offshore Khmer Trough in the Gulf of Thailand.",
          "Near-surface seismic refraction, MASW (Multichannel Analysis of Surface Waves), and ambient noise tomography quantify shear-wave velocity profiles and bedrock depth for civil engineering and infrastructure projects.",
        ],
      },
    ],
    relatedPaperIds: [
      "local-1e2550d30286",
      "local-55f12de512bc",
      "local-a338bebe6468",
      "local-5607ec1f1471",
      "local-23443d146559",
    ],
    keyHighlightsKm: [
      "ការស្ទង់ម៉ាញេទិចលើអាកាសឆ្លុះមើលរចនាសម្ព័ន្ធក្រោមដីល្បាប់កម្ពុជា",
      "វិធីសាស្ត្រអគ្គិសនី ERT ស្វែងរកស្រទាប់ទឹកក្រោមដី និងប្រហោងកាស្ត",
      "ការវាស់ IP រុករករ៉ែស្ពាន់ និងមាសក្នុងសិលាអគ្នី",
      "ការស្ទង់ទំនាញផែនដីកំណត់ទម្រង់អាងល្បាប់ និងជម្រៅសំបកផែនដី",
    ],
    keyHighlightsEn: [
      "High-resolution aeromagnetic mapping penetrating thick alluvial cover",
      "2D/3D ERT imaging for aquifer exploration and karst sinkhole detection",
      "Induced Polarization (IP) chargeability targeting disseminated sulfide ores",
      "Regional gravity anomaly modeling of Tonle Sap basin depth and geometry",
    ],
  },
  {
    id: "geohazards",
    slug: "geohazards",
    key: "Geohazards",
    titleKm: "មហន្តរាយភូគព្ភសាស្ត្រ និងការគ្រប់គ្រងហានិភ័យនៅកម្ពុជា",
    titleEn: "Geohazards & Environmental Risk Assessment in Cambodia",
    shortTitleKm: "មហន្តរាយ ភូគព្ភសាស្ត្រ",
    shortTitleEn: "Geohazards",
    image: "/images/cms/focus-geohazards-image.png",
    imageAlt: "Geohazard mapping, landslides, fault lines and subsidence in Cambodia",
    captionKm: "ផែនទីចែកចាយបន្ទាត់បំណាក់សិលា ហានិភ័យបាក់ដី និងការស្រុតដីនៅប្រទេសកម្ពុជា",
    captionEn: "Spatial distribution of active faults, landslide susceptibility, and ground instability in Cambodia",
    leadKm: "ទោះបីជាប្រទេសកម្ពុជាមានកម្រិតរញ្ជួយដីទាប បើធៀបនឹងប្រទេសក្បែរខាងក៏ដោយ ប៉ុន្តែមហន្តរាយភូគព្ភសាស្ត្រជាច្រើននៅតែកើតឡើងជាប្រចាំ រួមមានការបាក់ដីនៅតំបន់ភ្នំ ការបាក់ច្រាំងទន្លេមេគង្គ ការស្រុតដីដោយសារការបូមទឹកក្រោមដី និងការស្រុតរូងកាស្តក្នុងសិលាកំបោរ។",
    leadEn: "While Cambodia enjoys relatively low direct seismicity compared to active plate boundaries, it faces significant geohazard challenges: monsoon-induced landslides in highland corridors, catastrophic riverbank collapse, urban land subsidence from aquifer over-pumping, and karst sinkholes.",
    stats: [
      { labelKm: "ហានិភ័យប្រចាំឆ្នាំ", labelEn: "Frequent Hazard", value: "Riverbank Erosion" },
      { labelKm: "តំបន់បាក់ដីខ្ពស់", labelEn: "Landslide Risk Zone", value: "Cardamom & Dangrek" },
      { labelKm: "ហានិភ័យកាស្ត", labelEn: "Karst Vulnerability", value: "Kampot & Battambang" },
      { labelKm: "កម្រិតរញ្ជួយដី", labelEn: "Seismic Regime", value: "Low-to-Moderate Intraplate" },
    ],
    sections: [
      {
        titleKm: "១. ការបាក់ដី និងស្ថិរភាពជម្រាលភ្នំ (Highland Landslides & Slope Instability)",
        titleEn: "1. Highland Landslides & Debris Flows",
        bodyKm: [
          "នៅតំបន់ជួរភ្នំក្រវាញ ភ្នំដងរែក និងខ្ពង់រាបខេត្តរតនគិរី ការធ្លាក់ភ្លៀងខ្លាំងក្នុងរដូវវស្សាអាចបង្កឱ្យមានការបាក់ដី (Landslides) និងលំហូរភក់ដីថ្ម (Debris flows)។",
          "កត្តាសំខាន់ដែលបង្កឱ្យបាក់ដី រួមមានកម្រាស់ដីពុកផុយក្រាស់ ជម្រាលចោត ការកាប់បំផ្លាញគម្របព្រៃឈើ និងការសាងសង់ផ្លូវកាត់ជើងភ្នំដោយខ្វះប្រព័ន្ធទប់ជម្រាលត្រឹមត្រូវ។",
        ],
        bodyEn: [
          "In the Cardamom Mountains, Dangrek Escarpment, and volcanic hills of Ratanakiri, severe monsoon downpours trigger rotational landslides and high-velocity debris flows that impact roads and settlements.",
          "Contributing factors include thick tropical saprolite weathering mantles, steep slope gradients, deforestation, and cut-slope destabilization along mountain transport routes.",
        ],
      },
      {
        titleKm: "២. ការហូរច្រោះ និងបាក់ច្រាំងទន្លេ (Riverbank Collapse & Fluvial Erosion)",
        titleEn: "2. Riverbank Erosion along the Mekong & Tonle Sap",
        bodyKm: [
          "ការបាក់ច្រាំងទន្លេតាមបណ្តោយទន្លេមេគង្គ ទន្លេបាសាក់ និងទន្លេសាប កើតឡើងជាញឹកញាប់ក្នុងរដូវទឹកសម្រក។",
          "នៅពេលទឹកទន្លេស្រកចុះយ៉ាងគំហុក សម្ពាធទឹកក្នុងរន្ធញើសដីច្រាំងទន្លេ (Pore water pressure) នៅតែខ្ពស់ ធ្វើឱ្យច្រាំងបាត់បង់លំនឹង និងបាក់ស្រុតចូលក្នុងទឹក បង្កការខូចខាតដល់ផ្ទះសម្បែង និងហេដ្ឋារចនាសម្ព័ន្ធ។",
        ],
        bodyEn: [
          "Severe riverbank collapse along the Mekong, Bassac, and Tonle Sap rivers occurs annually during rapid water level recession following the monsoon flood peak.",
          "High pore water pressures retained within permeable sand layers beneath fine-grained silt caps drive geotechnical slope failure and cantilever collapse, threatening riverine communities.",
        ],
        calloutKm: "វិធានការការពារ៖ ការផ្សំរវាងការដាំស្មៅវ៉េទីវ័រ (Vetiver grass) និងការរៀបថ្មទប់ជើងច្រាំង (Riprap) ផ្តល់នូវដំណោះស្រាយប្រកបដោយចីរភាពក្នុងការទប់ស្កាត់ការបាក់ច្រាំង។",
        calloutEn: "Mitigation priority: Integrating bioengineering (Vetiver grass stabilization) with rock riprap toe protection provides sustainable, low-cost riverbank protection.",
      },
      {
        titleKm: "៣. ការស្រុតដី និងហានិភ័យរូងភ្នំកាស្ត (Land Subsidence & Karst Sinkholes)",
        titleEn: "3. Land Subsidence & Karst Cavity Collapse",
        bodyKm: [
          "ការបូមទឹកក្រោមដីច្រើនហួសប្រមាណនៅតំបន់ទីប្រជុំជន និងតំបន់កសិកម្ម អាចបណ្តាលឱ្យស្រទាប់ដីឥដ្ឋរួមតូច និងបង្កការស្រុតដីយឺតៗ (Land subsidence) ដែលបង្កើនហានិភ័យលិចទឹកជំនន់។",
          "នៅខេត្តកំពត និងបាត់ដំបង ថ្មកំបោរសម័យពែមៀន (Permian limestone) មានរូង និងប្រហោងកាស្តក្រោមដីច្រើន។ ការប្រែប្រួលកម្ពស់ទឹកក្រោមដី ឬការផ្ទុកទម្ងន់សំណង់ពីលើ អាចបណ្តាលឱ្យដំបូលរូងបាក់ស្រុត បង្កើតជាក្រហូងដី (Sinkholes)។",
        ],
        bodyEn: [
          "Accelerated groundwater abstraction for urban and agricultural needs risks compacting soft alluvial clay layers, causing gradual land subsidence that exacerbates seasonal flooding.",
          "In the karst landscapes of Kampot and Battambang, dissolution cavities within Permian limestones are susceptible to sudden sinkhole formation and roof collapse when hydrological equilibrium is perturbed.",
        ],
      },
      {
        titleKm: "៤. ការវាយតម្លៃគ្រោះថ្នាក់រញ្ជួយដី (Intraplate Seismic Hazard Assessment)",
        titleEn: "4. Intraplate Seismic Hazard & Fault Monitoring",
        bodyKm: [
          "ទោះបីកម្ពុជាមិនស្ថិតនៅលើបន្ទាត់រញ្ជួយដីសកម្មខ្លាំងដូចឥណ្ឌូណេស៊ី ឬហ្វីលីពីន ប៉ុន្តែការរំញ័រដីពីការរញ្ជួយដីនៅប្រទេសជិតខាង (ដូចជាយូណាន ប្រទេសចិន ឬមីយ៉ាន់ម៉ា) អាចបញ្ជូនរលកមកប៉ះពាល់ដល់អគារខ្ពស់ៗនៅរាជធានីភ្នំពេញ។",
          "លើសពីនេះ បំណាក់សិលាក្នុងប្រទេសមួយចំនួននៅតែរក្សាបាននូវចលនាតិចតួច ដែលទាមទារឱ្យមានការសិក្សាពីស្តង់ដារវិស្វកម្មសំណង់ធន់នឹងរញ្ជួយដី។",
        ],
        bodyEn: [
          "While low in baseline seismicity, tall buildings in Phnom Penh have felt long-period resonance from major subduction earthquakes in Sumatra and strike-slip events in Myanmar and Yunnan.",
          "Paleoseismic studies on intraplate faults near the Thai-Cambodia border inform updated building code provisions and disaster risk preparedness across Cambodia.",
        ],
      },
    ],
    relatedPaperIds: [
      "web02",
      "web11",
      "local-5607ec1f1471",
      "local-998034775438",
      "local-ae4c88e6c6e7",
    ],
    keyHighlightsKm: [
      "ការបាក់ដី និងស្ថិរភាពជម្រាលភ្នំក្រវាញ និងដងរែកក្នុងរដូវវស្សា",
      "យន្តការបាក់ច្រាំងទន្លេមេគង្គ និងទន្លេសាបក្នុងរដូវទឹកសម្រក",
      "ហានិភ័យស្រុតដីដោយសារការបូមទឹកក្រោមដីលើសកម្រិត",
      "ការដួលរលំប្រហោងកាស្ត និងការសិក្សាហានិភ័យរញ្ជួយដី",
    ],
    keyHighlightsEn: [
      "Monsoon landslide and debris flow susceptibility in Cardamom and Dangrek ranges",
      "Rapid drawdown pore-pressure mechanics in Mekong riverbank collapse",
      "Alluvial compaction and land subsidence from groundwater over-extraction",
      "Karst sinkhole hazards and regional intraplate seismic risk assessment",
    ],
  },
];

export function getTopicByIdOrSlug(idOrSlug: string | null): FocusTopic | undefined {
  if (!idOrSlug) return undefined;
  const normalized = idOrSlug.trim().toLowerCase().replace(/\s+/g, "-");
  return FOCUS_TOPICS.find(
    (t) =>
      t.id.toLowerCase() === normalized ||
      t.slug.toLowerCase() === normalized ||
      t.key.toLowerCase() === idOrSlug.trim().toLowerCase() ||
      t.key.toLowerCase().replace(/\s+/g, "-") === normalized,
  );
}
