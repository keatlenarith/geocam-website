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
    image: "/images/rock-atlas/JICA_sample_map.png",
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
        id: "overview-lithology",
        headingEn: "Overview of Cambodian Lithology & Atlas Compilation",
        headingKm: "ទិដ្ឋភាពទូទៅនៃសណ្ឋានថ្ម និងកម្រងអាត្លាសជាតិ",
        contentEn: "Cambodia exhibits a rich diversity of rock types spanning from the Paleozoic era to the Quaternary. The landscape is shaped by granitic plutons, vast Mesozoic continental sandstone covers, isolated Permian limestone towers, and widespread Cenozoic basalt plateaus in the northeast. This official 2026 atlas compiles 74 rock samples from the JICA National Mining Master Plan, CCOP specimen archives, and peer-reviewed Cretaceous plutonic suites.",
        contentKm: "ប្រទេសកម្ពុជាមានភាពសម្បូរបែបនៃប្រភេទថ្មចាប់ពីស័កបុរាណសត្វរហូតដល់សម័យទីបួន។ ទិដ្ឋភាពទូទៅត្រូវបានកំណត់ដោយថ្មក្រានីតម៉ាក់ម៉ា ស្រទាប់ថ្មភក់ដីគោកយុគកណ្តាលសត្វ ប៉មថ្មកំបោរកាស្ត៍យុគពែរមៀន និងខ្ពង់រាបថ្មបាសាល់យុគថ្មីនៅប៉ែកឦសាន។ កម្រងអាត្លាសថ្មជាតិ ២០២៦ នេះបានសំយោគសំណាកថ្មវាលចំនួន ៧៤ ពីផែនការមេវិស័យរ៉ែ JICA បណ្ណសាររូបភាព CCOP និងការស្រាវជ្រាវសិលាអគ្នីជ្រៅយុគគ្រីតាសេ។",
        bulletsEn: [
          "Igneous: Mesozoic granite batholiths, Dalat-Kratie Cretaceous diorite/granodiorite, and Neogene-Quaternary alkali basalts.",
          "Sedimentary: Triassic-Cretaceous continental redbed sandstones and Permian fossiliferous limestone karst towers.",
          "Metamorphic: Proterozoic-Paleozoic mica-schists, gneisses, quartzites, and contact skarn aureoles.",
        ],
        bulletsKm: [
          "ថ្មម៉ាក់ម៉ា៖ ថ្មក្រានីតបាតូលីតយុគកណ្តាលសត្វ ថ្មឌីយ៉ូរីត/ក្រាណូឌីយ៉ូរីតស្នួល និងថ្មបាសាល់អាល់កាលីយុគទីបី-ទីបួន។",
          "ថ្មកម្ទេចកំណ៖ ថ្មភក់ក្រហមដីគោកយុគត្រីយ៉ាស-ក្រេតាសេ និងប៉មកាស្ត៍ថ្មកំបោរផូស៊ីលយុគពែរមៀន។",
          "ថ្មប្រែរូប៖ ថ្មសៀសមីកា ថ្មនែស ថ្មក្វាតស៊ីត និងវណ្ឌថ្មស្កានប្រែរូបប៉ះទង្គិច។",
        ],
        calloutEn: "Field observation rule: Cambodian rock groups reflect distinct tectonic episodes, particularly the Indosinian Orogeny and circum-Pacific Cretaceous subduction.",
        calloutKm: "ចំណាំក្នុងការចុះវាល៖ ប្រព័ន្ធថ្មនៅកម្ពុជាឆ្លុះបញ្ចាំងពីដំណាក់កាលតិចតូនិចសំខាន់ៗ ជាពិសេសចលនាភ្នំឥណ្ឌូស៊ីនៀ និងការរងសម្ពាធមាត់ទ្វីបប៉ាស៊ីហ្វិកសម័យគ្រីតាសេ។",
        image: "/images/rock-atlas/JICA_sample_map.png",
        imageCaptionEn: "Figure: Geographic distribution of 74 rock and whole-rock geochemical samples across Cambodia from the national geological survey database.",
        imageCaptionKm: "រូបភាព៖ ទីតាំងភូមិសាស្ត្រនៃសំណាកថ្ម និងគីមីភូគព្ភសាស្ត្រចំនួន ៧៤ កន្លែងទូទាំងប្រទេសកម្ពុជាពីមូលដ្ឋានទិន្នន័យស្ទង់ភូគព្ភសាស្ត្រជាតិ។",
      },
      {
        id: "igneous-rocks",
        headingEn: "Igneous Rocks: Plutons, Volcanic Basalts & Snoul Intrusion",
        headingKm: "ថ្មម៉ាក់ម៉ា៖ ថ្មក្រានីត បន្ទុះថ្មបាសាល់ និងដុំសិលាជ្រៅស្នួល",
        contentEn: "Igneous rocks originate from deep magma intrusions that cooled slowly into coarse-grained granite/diorite, and rapid continental eruptions of basaltic lava. Recent work on the Snoul intrusion (Kratie province) dates Cretaceous arc-related diorite-granodiorite magmatism at ~103 Ma, linking eastern Cambodia to the Dalat-Kratie igneous belt.",
        contentKm: "ថ្មម៉ាក់ម៉ានៅកម្ពុជាកើតចេញពីការជ្រៀតចូលនៃម៉ាក់ម៉ាក្នុងជម្រៅដែលចុះត្រជាក់យឺតៗបង្កើតជាថ្មក្រានីត/ឌីយ៉ូរីត និងការផ្ទុះភ្នំភ្លើងកម្អែរាវបាសាល់មកលើផ្ទៃដីគោក។ ការស្រាវជ្រាវថ្មីៗលើដុំសិលាជ្រៅស្រុកស្នួល (ខេត្តក្រចេះ) បានកំណត់អាយុកាលសិលាឌីយ៉ូរីត-ក្រាណូឌីយ៉ូរីតធ្នូកោះយុគគ្រីតាសេប្រមាណ ១០៣ លានឆ្នាំមុន ដែលភ្ជាប់កម្ពុជាភាគខាងកើតទៅកាន់ខ្សែក្រវាត់សិលាអគ្នីដាឡាត់-ក្រចេះ។",
        bulletsEn: [
          "Granite & Granodiorite: Cardamom and Elephant Ranges (Pursat, Koh Kong, Kampot) and eastern intrusive complexes.",
          "Snoul Diorite & Gabbro: Cretaceous plutonic suites in Kratie displaying plagioclase, hornblende, and biotite textures.",
          "Alkali Basalt: Extensive volcanic plateau covers in Ratanakiri, Mondulkiri, and Kampong Cham weathering into fertile red soil.",
          "Rhyolite & Andesite: Continental arc volcanic suites outcropping in Oddar Meanchey, Kratie, and Kampong Chhnang.",
        ],
        bulletsKm: [
          "ថ្មក្រានីត និងក្រាណូឌីយ៉ូរីត៖ ជួរភ្នំក្រវាញ ជួរភ្នំដំរី (ពោធិ៍សាត់ កោះកុង កំពត) និងបណ្តុំសិលាជ្រៅប៉ែកខាងកើត។",
          "ថ្មឌីយ៉ូរីត និងហ្កាប់ប្រូស្នួល៖ សំណុំសិលាជ្រៅយុគគ្រីតាសេនៅក្រចេះ បង្ហាញរចនាសម្ព័ន្ធប្លាស្យូក្លាស ហនប្លេន និងប៊ីយ៉ូទីត។",
          "ថ្មបាសាល់អាល់កាលី៖ ខ្ពង់រាបភ្នំភ្លើងដ៏ធំធេងនៅរតនគិរី មណ្ឌលគិរី និងកំពង់ចាម ដែលរលួយបង្កើតជាដីក្រហមមានជីជាតិ។",
          "ថ្មរីយ៉ូលីត និងអង់ដេស៊ីត៖ សំណុំថ្មភ្នំភ្លើងធ្នូកោះនៅឧត្តរមានជ័យ ក្រចេះ និងកំពង់ឆ្នាំង។",
        ],
        image: "/images/rock-atlas/Shellnutt_2023_Fig3.jpg",
        imageCaptionEn: "Figure: Field outcrop, drill core specimens, and hand samples of the Early Cretaceous Snoul diorite intrusion in Kratie Province (Shellnutt et al., 2023).",
        imageCaptionKm: "រូបភាព៖ ផ្ទាំងថ្មវាល ស្នូលខួង និងសំណាកថ្មដៃនៃសិលាឌីយ៉ូរីតស្នួលយុគគ្រីតាសេដើមក្នុងខេត្តក្រចេះ (Shellnutt et al., 2023)។",
      },
      {
        id: "geochemistry-classification",
        headingEn: "Geochemical Classification: TAS & QAPF Standards",
        headingKm: "ចំណាត់ថ្នាក់គីមីភូគព្ភសាស្ត្រ៖ ស្តង់ដារ TAS និង QAPF",
        contentEn: "Quantitative petrology of Cambodian igneous suites requires formal IUGS classification standards. The Total Alkali-Silica (TAS) diagram categorizes volcanic rocks based on wt% SiO2 versus (Na2O + K2O). For 20 whole-rock samples from the JICA database, compositions span from basalts (~48% SiO2) to high-silica rhyolites (>75% SiO2). The Plutonic QAPF system (Quartz, Alkali feldspar, Plagioclase, Feldspathoid) provides the mineralogical reference.",
        contentKm: "ការសិក្សាផ្នែកសិលាវិទ្យាបរិមាណនៃសិលាអគ្នីកម្ពុជា តម្រូវឱ្យប្រើប្រាស់ស្តង់ដារចំណាត់ថ្នាក់អន្តរជាតិ IUGS។ គំនូសតាងអាល់កាលី-ស៊ីលីកាសរុប (TAS) ចែកចំណាត់ថ្នាក់ថ្មភ្នំភ្លើងផ្អែកលើ % ទម្ងន់នៃ SiO2 ធៀបនឹង (Na2O + K2O)។ សម្រាប់សំណាកថ្មសរុបទាំង ២០ ពីមូលដ្ឋានទិន្នន័យ JICA សមាសធាតុគ្របដណ្តប់ពីថ្មបាសាល់ (~៤៨% SiO2) រហូតដល់ថ្មរីយ៉ូលីតស៊ីលីកាខ្ពស់ (>៧៥% SiO2)។ ប្រព័ន្ធ QAPF ផ្តល់នូវក្របខ័ណ្ឌយោងផ្នែករ៉ែសម្រាប់ថ្មជ្រៅ។",
        bulletsEn: [
          "TAS Diagram: Classifies subalkaline vs alkaline volcanic series across Cambodia's volcanic centers.",
          "Harker Variation: Linear trends in Fe2O3, MgO, and CaO reflect fractional crystallization of mafic minerals.",
          "Alumina Saturation: Identifies metaluminous to peraluminous signatures in Cambodian granite batholiths.",
        ],
        bulletsKm: [
          "គំនូសតាង TAS៖ បែងចែកស៊េរីថ្មភ្នំភ្លើង Subalkaline និង Alkaline នៅតាមមណ្ឌលភ្នំភ្លើងកម្ពុជា។",
          "បម្រែបម្រួល Harker៖ និន្នាការធ្លាក់ចុះនៃ Fe2O3, MgO, និង CaO ឆ្លុះបញ្ចាំងពីការកកើតក្រាមដោយផ្នែក (Fractional crystallization)។",
          "កម្រិតឆ្អែតអាលុយមីន៖ កំណត់លក្ខណៈ Metaluminous ទៅ Peraluminous នៃដុំសិលាក្រានីតកម្ពុជា។",
        ],
        image: "/images/rock-atlas/TAS_reference.png",
        imageCaptionEn: "Figure: IUGS Total Alkali versus Silica (TAS) chemical classification framework for volcanic rocks.",
        imageCaptionKm: "រូបភាព៖ ក្របខ័ណ្ឌចំណាត់ថ្នាក់គីមីអាល់កាលីធៀបស៊ីលីកា (TAS) ស្តង់ដារ IUGS សម្រាប់ថ្មភ្នំភ្លើង។",
      },
      {
        id: "sedimentary-rocks",
        headingEn: "Sedimentary Rocks: Sandstone Plateaus & Limestone Karst",
        headingKm: "ថ្មកម្ទេចកំណ៖ ខ្ពង់រាបថ្មភក់ និងកាស្ត៍ថ្មកំបោរ",
        contentEn: "Sedimentary strata define Cambodia's iconic geomorphology. Massive Mesozoic sandstone sheets create the majestic escarpments of Dangrek, Phnom Kulen, and Bokor, while Permian limestone karsts dot Battambang, Banteay Meanchey, and Kampot.",
        contentKm: "ស្រទាប់ថ្មកម្ទេចកំណកំណត់ទម្រង់ដីល្បីៗរបស់កម្ពុជា។ ផ្ទាំងថ្មភក់យុគកណ្តាលសត្វបង្កើតជាជញ្ជាំងភ្នំដងរែក ភ្នំគូលែន និងភ្នំបូកគោ ខណៈកាស្ត៍ថ្មកំបោរយុគពែរមៀនលេចចេញជារាងប៉មនៅបាត់ដំបង បន្ទាយមានជ័យ និងកំពត។",
        calloutEn: "The famous temples of Angkor were predominantly sculpted from fine-grained arkosic sandstone quarried from Phnom Kulen.",
        calloutKm: "ប្រាសាទបុរាណក្នុងតំបន់អង្គរភាគច្រើនត្រូវបានកសាងឡើងដោយថ្មភក់អាខូសគ្រាប់ម៉ដ្ឋដែលជីកយកពីភ្នំគូលែន។",
      },
      {
        id: "metamorphic-rocks",
        headingEn: "Metamorphic Rocks: Schists and Quartzites",
        headingKm: "ថ្មប្រែរូប៖ ថ្មសៀស និងថ្មក្វាតស៊ីត",
        contentEn: "Metamorphic rocks are exposed along deep structural shear zones and ancient basement uplifts, where intense heat and directional tectonic pressure altered pre-existing sedimentary and volcanic formations.",
        contentKm: "ថ្មប្រែរូបត្រូវបានរកឃើញនៅតាមតំបន់កាត់ទទឹងរចនាសម្ព័ន្ធជ្រៅ និងកំណកគ្រឹះបុរាណ ដែលកម្ដៅខ្លាំង និងសម្ពាធតិចតូនិចបានកែប្រែថ្មកម្ទេចកំណ និងថ្មភ្នំភ្លើងដើម។",
        bulletsEn: [
          "Mica Schist & Gneiss: Outcrops in Pailin and northern Stung Treng.",
          "Quartzite: Highly resistant ridges standing out against erosional valleys in western provinces.",
          "Marble & Skarn: Contact metamorphic aureoles near limestone-granite boundaries, often bearing metallic skarns.",
        ],
        bulletsKm: [
          "ថ្មសៀសមីកា និងថ្មនែស៖ ផ្ទាំងថ្មនៅប៉ៃលិន និងប៉ែកខាងជើងស្ទឹងត្រែង។",
          "ថ្មក្វាតស៊ីត៖ ខ្សែជួរភ្នំធន់នឹងការសឹករិចរិលនៅបណ្តាខេត្តភាគខាងលិច។",
          "ថ្មម៉ាប និងស្កាន៖ វណ្ឌប្រែរូបប៉ះទង្គិចក្បែរព្រំដែនថ្មកំបោរ-ថ្មក្រានីត ដែលជាញឹកញាប់ផ្ទុកកំណកកកររ៉ែដែក។",
        ],
      },
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
