export interface SectionImage {
  url: string;
  captionKm?: string;
  captionEn?: string;
}

export interface SectionTable {
  captionKm?: string;
  captionEn?: string;
  headersKm: string[];
  headersEn: string[];
  rowsKm: string[][];
  rowsEn: string[][];
  footnoteKm?: string;
  footnoteEn?: string;
}

export interface TopicSource {
  id: string;
  text: string;
  url?: string;
}

export interface TopicSection {
  titleKm: string;
  titleEn: string;
  bodyKm: string[];
  bodyEn: string[];
  image?: string;
  imageCaptionKm?: string;
  imageCaptionEn?: string;
  images?: SectionImage[];
  table?: SectionTable;
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
  sources?: TopicSource[];
}

export const FOCUS_TOPICS: FocusTopic[] = [
  {
    id: "tectonics",
    slug: "tectonics",
    key: "Tectonics",
    titleKm: "ការវិវត្តចលនាតិចតូនិចនៃអាស៊ីអាគ្នេយ៍ និងគ្រោងភូគព្ភសាស្ត្រនៃប្រទេសកម្ពុជា",
    titleEn: "Tectonic Evolution of Southeast Asia and the Geological Framework of Cambodia",
    shortTitleKm: "តិចតូនិក",
    shortTitleEn: "Tectonics",
    image: "/images/tectonics/image1.png",
    imageAlt: "Distribution of continental blocks, fragments, terranes, and principal sutures of Sundaland and Southeast Asia (Metcalfe, 2017)",
    captionKm: "រូបភាពទី ៣៖ ការបែងចែកប្លុកទ្វីប បំណែកដី និងតំបន់ភ្ជាប់ប្លុកបុរាណ (Sutures) នៃស៊ុនដាឡង់ និងអាស៊ីអាគ្នេយ៍ (Metcalfe, 2017)",
    captionEn: "Figure 3: Distribution of continental blocks, fragments and terranes, and principal sutures of Sundaland and Southeast Asia (Metcalfe, 2017; DOI: 10.7186/bgsm63201702)",
    leadKm: "ដីគោកអាស៊ីអាគ្នេយ៍ត្រូវបានយល់ដឹងច្បាស់បំផុតជាផ្ទាំងផ្គុំនៃប្លុកទ្វីបដែលផ្ដាច់ចេញពីមហាទ្វីបហ្គុងវ៉ាណា (Gondwana) ធ្នូកោះភ្នំភ្លើង និងតំបន់ភ្ជាប់ប្លុកបុរាណ (Sutures) ដែលត្រូវបានផ្គុំឡើងតាមរយៈការបើក និងបិទនៃមហាសមុទ្រប៉ាឡេអូ-តេទីស (Palaeo-Tethys) ពីសម័យដេវ៉ូញៀនដល់ទ្រីយ៉ាសិក រួមជាមួយសកម្មភាពម៉ាក់ម៉ាធ្នូកោះនៅមេសូសូអ៊ិក និងការប្រែប្រួលទម្រង់បំណាក់សិលារំកិលផ្ដេកនៅសេណូសូអ៊ិក។ សម្រាប់ប្រទេសកម្ពុជា ភស្តុតាងផ្ទាល់ដ៏រឹងមាំបំផុតបានមកពីភូកាលវិទ្យាសិលាអគ្នីភាគនិរតី អ៊ីសូតូបគីមីភូគព្ភសាស្ត្រ ដែនម៉ាញ៉េទិចបុរាណសិលាស្រទាប់ក្រហម និងការសិក្សារចនាសម្ព័ន្ធខ្សែក្រវាត់ផ្នត់កំពត រួមជាមួយការវិភាគអាងល្បាប់បឹងទន្លេសាប ស្វាយរៀង និងកំពង់សោម។",
    leadEn: "Mainland Southeast Asia is best understood as a collage of Gondwana-derived continental blocks, volcanic arcs, and sutures assembled through Devonian–Triassic opening and closure of the Palaeo-Tethys, later Mesozoic arc magmatism, and Cenozoic strike-slip deformation. For Cambodia specifically, the strongest direct evidence comes from southern and southwestern igneous geochronology, isotope geochemistry, red-bed paleomagnetism, thermochronology and structural studies in the Kampot Fold Belt, and basin syntheses for the Tonle Sap, Svay Rieng, Khmer, and Kampong Som domains.",
    stats: [
      { labelKm: "ប្លុកភូគព្ភសាស្ត្រ", labelEn: "Geodynamic Terrane", value: "Indochina Core Terrane" },
      { labelKm: "ដំណាក់កាលកកើតភ្នំ", labelEn: "Major Orogeny", value: "Multi-stage Indosinian (Triassic)" },
      { labelKm: "អាងល្បាប់ធំៗ", labelEn: "Sedimentary Basins", value: "Tonle Sap, Svay Rieng, Kampong Som" },
      { labelKm: "ខ្សែក្រវាត់ផ្នត់", labelEn: "Key Fold Belt", value: "Kampot Fold Belt (Late K–Paleocene)" },
    ],
    sections: [
      {
        titleKm: "១. ទិដ្ឋភាពទូទៅ និងវិធីសាស្ត្រសិក្សា (Abstract, Scope & Methods)",
        titleEn: "1. Abstract, Scope and Methods",
        bodyKm: [
          "ការសិក្សានេះគឺជាការសំយោគ និងវាយតម្លៃឡើងវិញផ្អែកលើអក្សរសិល្ប៍ស្រាវជ្រាវវិទ្យាសាស្ត្រអន្តរជាតិចំនួន ១៧ អត្ថបទដែលត្រូវបានបោះពុម្ពផ្សាយ ដោយផ្តោតលើការស្រាវជ្រាវផ្ទាល់លើភូគព្ភសាស្ត្រកម្ពុជា និងការសំយោគតំបន់ដើម្បីកំណត់បរិបទភូគព្ភសាស្ត្រ។ ភស្តុតាងមានភាពរឹងមាំខ្ពស់សម្រាប់គំរូប្លុកតំបន់ និងកាលបរិច្ឆេទឥណ្ឌូស៊ីន កម្រិតមធ្យមសម្រាប់សកម្មភាពម៉ាក់ម៉ានៅកម្ពុជាភាគខាងត្បូង និងការប្រែប្រួលទម្រង់នៅកំពត ប៉ុន្តែនៅមានកម្រិតទាបចំពោះព្រំប្រទល់គ្រឹះរឹងកម្ពុជា និងតំបន់ភ្ជាប់ប្លុកដែលគ្រាន់តែជាការទាញសន្មត។",
          "ដែនកំណត់ចម្បងមួយគឺថា កម្ពុជានៅតែជាតំបន់ដែលការយកសំណាកមានកម្រិតតិចតួចបើប្រៀបធៀបនឹងប្រទេសថៃ និងវៀតណាម។ ដូច្នេះ ឈ្មោះខ្សែក្រវាត់ភូគព្ភសាស្ត្រក្នុងតំបន់ជាច្រើនដែលគេដាក់ឱ្យកម្ពុជា (ដូចជាការបន្តនៃខ្សែតភ្ជាប់ប្លុកស្រះកែវ ខ្សែក្រវាត់ផ្នត់ Loei ឬទំនាក់ទំនង Dalat–Kratie) បានមកពីការសន្មតបន្តពីប្រទេសជិតខាងជាជាងការធ្វើផែនទី ការខួង ឬការលាតត្រដាងសិលាជាក់ស្តែងក្នុងទឹកដីកម្ពុជា។ ការសិក្សានេះបំបែកយ៉ាងច្បាស់រវាងភស្តុតាងសំណាកនៅកម្ពុជា និងការសន្មតក្នុងតំបន់។",
        ],
        bodyEn: [
          "This synthesis provides a comprehensive review of the tectonic framework of Southeast Asia with specific focus on Cambodia. The evidence base is strong for regional terrane models and Indosinian timing, moderate for southern Cambodian magmatism and Kampot deformation, and weak to mixed for Cambodian basement terrane boundaries, inferred sutures, and metallogenic extrapolation.",
          "A major limitation is that Cambodia remains sparsely sampled relative to Thailand and Vietnam, so many regional labels projected into Cambodia derive from neighboring-country continuity arguments rather than direct Cambodian mapping, drilling, or exposure. The review therefore strictly separates Cambodian direct sample evidence from regional inference wherever possible.",
        ],
        bulletsKm: [
          "ផ្អែកលើការស្រាវជ្រាវអន្តរជាតិចំនួន ១៧ អត្ថបទដែលមានការត្រួតពិនិត្យពីអ្នកជំនាញ (Peer-reviewed)។",
          "បំបែករវាងទិន្នន័យវាស់ជាក់ស្តែងនៅកម្ពុជា និងបន្ទាត់សន្មតចេញពីប្រទេសជិតខាង។",
        ],
        bulletsEn: [
          "Synthesized from 17 peer-reviewed regional geodynamic publications with DOI validation.",
          "Clear methodological separation between direct Cambodian field data and extrapolated models.",
        ],
      },
      {
        titleKm: "២. ការផ្គុំឡើងនៃតំបន់អាស៊ីអាគ្នេយ៍ និងស៊ុនដាឡង់ (Regional Assembly of Southeast Asia)",
        titleEn: "2. Regional Assembly of Southeast Asia & Sundaland",
        bodyKm: [
          "អាស៊ីអាគ្នេយ៍ត្រូវបានផ្សំឡើងដោយផ្ទាំងផ្គុំនៃប្លុកទ្វីបដែលផ្ដាច់ចេញពីភាគខាងកើតមហាទ្វីបហ្គុងវ៉ាណា (Eastern Gondwana) តាមរយៈការបើក និងបិទនៃមហាសមុទ្រតេទីសបន្តបន្ទាប់គ្នា (Tethyan oceans)។ ក្នុងគ្រោងការណ៍នេះ ស្នូលស៊ុនដាឡង់ (Sundaland) រួមមានប្លុកស៊ីប៊ូម៉ាស៊ូ (Sibumasu) នៅខាងលិច និងប្លុកឥណ្ឌូចិន–ម៉ាឡាយ៉ាខាងកើត (Indochina–East Malaya) នៅខាងកើត ដោយមានធ្នូកោះសុខោទ័យ (Sukhothai arc) ស្ថិតនៅចន្លោះកណ្តាល។",
          "មហាសមុទ្រប៉ាឡេអូ-តេទីស (Palaeo-Tethys) ត្រូវបានតំណាងដោយតំបន់ភ្ជាប់ប្លុក Changning–Menglian និង Inthanon នៅភាគខាងលិច ខណៈដែល Jinghong–Nan–Sra Kaeo ត្រូវបានបកស្រាយយ៉ាងទូលំទូលាយថាជាអាងក្រោយធ្នូ (Back-arc basin) សម័យភឺមៀនដែលបានបិទ ជាជាងជាតំបន់ភ្ជាប់មហាសមុទ្រប៉ាឡេអូ-តេទីសចម្បង។ ការបែងចែកនេះមានសារៈសំខាន់ខ្លាំង ពីព្រោះវាចាត់ទុកតំបន់សុខោទ័យជាធ្នូកោះនៅលើគែមខាងលិចនៃប្លុកឥណ្ឌូចិន មិនមែនជាផ្នែកនៃស៊ីប៊ូម៉ាស៊ូឡើយ។",
          "ប្លុកឥណ្ឌូចិនត្រូវបានចាត់ទុកថាជាប្លុកប្រភពពីហ្គុងវ៉ាណាដែលបានបំបែកចេញនៅសម័យដេវ៉ូញៀន ចំណែកឯស៊ីប៊ូម៉ាស៊ូបានបំបែកចេញក្រោយមកទៀតនៅដើមសម័យភឺមៀន កំឡុងពេលនៃការបើកមហាសមុទ្រមេសូ-តេទីស (Meso-Tethys)។",
        ],
        bodyEn: [
          "Southeast Asia comprises a collage of continental terranes derived directly or indirectly from eastern Gondwana, assembled through the opening and closure of successive Tethyan oceans. In this framework, core Sundaland includes western Sibumasu and eastern Indochina–East Malaya, with the Sukhothai island arc between them.",
          "The Palaeo-Tethys is represented by sutures including Changning–Menglian and Inthanon to the west, whereas Jinghong–Nan–Sra Kaeo is widely interpreted as a closed Permian back-arc basin rather than the main Palaeo-Tethys oceanic suture. This distinction is central because it places the Sukhothai zone as an arc on the western Indochina margin, not as part of Sibumasu.",
          "Indochina is commonly treated as a Gondwana-derived block that rifted in the Devonian, while Sibumasu separated later, in the early Permian, during opening of the Meso-Tethys. Late Devonian–Triassic evolution proceeded through successive stages: rifting, oceanic crust formation, subduction on both northern and western Indochina margins, and collisions first with South China and then with Sibumasu.",
        ],
        image: "/images/tectonics/image1.png",
        imageCaptionKm: "រូបភាពទី ៣៖ ការបែងចែកប្លុកទ្វីប បំណែកដី និងតំបន់ភ្ជាប់ប្លុកបុរាណនៃស៊ុនដាឡង់ និងអាស៊ីអាគ្នេយ៍ (Metcalfe, 2017)",
        imageCaptionEn: "Figure 3: Distribution of continental blocks, fragments and terranes, and principal sutures of Sundaland and Southeast Asia (Metcalfe, 2017; DOI: 10.7186/bgsm63201702)",
      },
      {
        titleKm: "៣. ដំណាក់កាលកកើតភ្នំឥណ្ឌូស៊ីន (The Multi-Stage Indosinian Orogeny)",
        titleEn: "3. The Multi-Stage Indosinian Orogeny",
        bodyKm: [
          "ភស្តុតាងវិទ្យាសាស្ត្រគាំទ្រកាន់តែខ្លាំងថា ចលនាកកើតភ្នំឥណ្ឌូស៊ីន (Indosinian Orogeny) មានច្រើនដំណាក់កាល ជាជាងការបុកទង្គិចគ្នាតែមួយលើក។ គំរូដ៏មានឥទ្ធិពលមួយបានកំណត់ដំណាក់កាល៖ ការចាប់ផ្តើមបុកទង្គិចគ្នានៅចុងភឺមៀនដល់ដើមទ្រីយ៉ាសិក ការរអិលចូលក្រោមទ្វីប (continental subduction) នៅដើមដល់កណ្តាលទ្រីយ៉ាសិក និងការដាច់ធ្លាក់បន្ទះសំបកផែនដីក្រោយការបុកទង្គិច (post-collisional slab breakoff) រួមជាមួយការងើបឡើងនៃសិលានៅចុងទ្រីយ៉ាសិក តាមបណ្តោយប្រព័ន្ធ Jinshajiang–Ailaoshan–Song Ma។",
          "នៅប្រទេសថៃ អាងខ្ពង់រាបកូរ៉ាត់ (Khorat Plateau Basin) រក្សាទុកនូវស្រទាប់មិនស៊ីសង្វាក់មុំ (angular unconformity) ដ៏សំខាន់រវាងពែរម្ញាង និងទ្រីយ៉ាស៊ិក ដែលត្រូវបានបកស្រាយថាជាព្រឹត្តិការណ៍ឥណ្ឌូចិនដំបូងបំផុតបង្កឡើងដោយការបុកទង្គិចរវាងឥណ្ឌូចិន និងចិនខាងត្បូង។ ការសិក្សាលើកូនគ្រួស និងអាយុហ្សៀកុង (detrital zircon U-Pb) នៅថៃកណ្តាល និងខាងជើងក៏បានបែងចែកព្រឹត្តិការណ៍បុកទង្គិចឥណ្ឌូចិន–ចិនខាងត្បូងចាស់ ពីការបុកទង្គិចស៊ីប៊ូម៉ាស៊ូ–សុខោទ័យ–ឥណ្ឌូចិនក្រោយមក និងសកម្មភាពម៉ាក់ម៉ាក្រោយការបុកទង្គិច។",
          "សម្រាប់កម្ពុជា លទ្ធភាពនៃខ្សែតភ្ជាប់ប្លុកខាងក្នុងដែលរត់ទិសកើត-លិច ឬប្រព័ន្ធប្រេះបែកបញ្ច្រាស (inverted rift system) នៅពាយព្យកម្ពុជា បច្ចុប្បន្ននៅតែជាសម្មតិកម្មដែលទាញចេញពីការបន្តរចនាសម្ព័ន្ធនៅប្រទេសថៃ មិនទាន់ជាខ្សែតភ្ជាប់ដែលបានធ្វើផែនទីជាក់ស្តែងនៅឡើយទេ។",
        ],
        bodyEn: [
          "Evidence increasingly supports a multi-stage Indosinian orogeny rather than a single collision pulse. One influential scheme identifies latest Permian–earliest Triassic collision onset, Early–Middle Triassic continental subduction, and Late Triassic post-collisional slab breakoff and exhumation along the Jinshajiang–Ailaoshan–Song Ma system.",
          "In Thailand, the Khorat Plateau Basin preserves a major Permo–Triassic angular unconformity interpreted as the earliest Indosinian event caused by collision between Indochina and South China rather than solely by Sibumasu-related back-arc closure. Detrital zircon and conglomerate studies separate an older Indochina–South China collision-related event from a later Sibumasu–Sukhothai–Indochina collision and younger post-collisional magmatism.",
          "Other models emphasize internal block amalgamation within Indochina during Early Triassic closure of Permian rifts, with only minor Late Triassic reactivation during final Sibumasu collision. This opens the possibility of an E–W-trending internal suture or inverted rift system in northwestern Cambodia, though currently an inferred hypothesis.",
        ],
        image: "/images/tectonics/image2.png",
        imageCaptionKm: "រូបភាពទី ១២៖ គំនូសបំព្រួញបង្ហាញពីការវិវត្តចលនាតិចតូនិចនៃស៊ុនដាឡង់ និងប្រព័ន្ធធ្នូកោះសុខោទ័យ ពីកាបូនីហ្វេរ៉ាសចុង ដល់ជូរ៉ាសិកដើម (Metcalfe, 2017)",
        imageCaptionEn: "Figure 12: Cartoon showing the tectonic evolution of Sundaland (Thailand–Malay Peninsula) and the Sukhothai Arc System from the Late Carboniferous to Early Jurassic (Metcalfe, 2017; DOI: 10.7186/bgsm63201702)",
      },
      {
        titleKm: "៤. ភស្តុតាងផ្ទាល់នៅកម្ពុជា៖ សកម្មភាពម៉ាក់ម៉ាភាគនិរតី និងខ្សែក្រវាត់ផ្នត់កំពត (Direct Cambodian Evidence)",
        titleEn: "4. Direct Cambodian Evidence: Southwest Magmatism & Kampot Fold Belt",
        bodyKm: [
          "ភស្តុតាងផ្អែកលើសំណាកផ្ទាល់ល្អបំផុតនៅកម្ពុជា បានមកពីភាគនិរតី និងភាគខាងត្បូង ជាពិសេសខ្សែក្រវាត់ផ្នត់កំពត (Kampot Fold Belt) និងសិលាអគ្នីដែលនៅជាប់នោះ។ ការសិក្សារួមគ្នារវាងកម្ពុជាភាគខាងត្បូង និងវៀតណាមនិរតី (Waight et al., 2021) បានរកឃើញសិលាអគ្នីពីសម័យភឺមៀនដល់ក្រេតាសេ ដែលមានក្រុមអាយុចំនួន ៤ គឺ៖ ប្រហែល ២៩៤–២៦៥ លានឆ្នាំមុន (Ma), ២៣០–២២២ Ma, ១៩៥ Ma, និង ១០៧–៧៥ Ma។",
          "សិលាហ្ក្រានីតសម័យក្រេតាសេ និងជូរ៉ាសិក កើតឡើងជាចម្បងនៅខាងកើតខ្សែក្រវាត់ផ្នត់កំពត រីឯសិលាមុនក្រេតាសេភាគច្រើនជាសិលាភ្នំភ្លើងហ្វែលស៊ីក (felsic volcanics) នៅក្នុងខ្សែក្រវាត់ផ្នត់។ សិលាទាំងនេះភាគច្រើនជាប្រភេទ high-K calc-alkaline និង weakly peraluminous ដែលមានទម្រង់ធាតុវិភាគដានបែបធ្នូកោះ (arc-like trace-element patterns)។",
          "នៅភាគនិរតីកម្ពុជា សិលាស្រទាប់ក្រហម (red beds) នៃទម្រង់ភូគុក (Phuquoc Formation) ក្នុងអាងភូគុក-កំពង់សោម ផ្តល់នូវភស្តុតាងផ្ទាល់ខាងស្រទាប់សិលា និងដែនម៉ាញ៉េទិចបុរាណ (paleomagnetism) សម្រាប់ការកកកុញដីគោកនៅជូរ៉ាសិកចុង–ក្រេតាសេដើម។ ការសិក្សាដែនម៉ាញ៉េទិចបុរាណបង្ហាញពីការរំកិលចុះទៅទិសខាងត្បូងប្រមាណ ៦° និងការបង្វិលតាមទ្រនិចនាឡិកា ៣៣° ធៀបនឹងអាស៊ីបូព៌ា ដែលបញ្ជាក់ពីការខូចទ្រង់ទ្រាយមិនស៊ីសង្វាក់គ្នានៃចុងខាងត្បូងប្លុកឥណ្ឌូចិន។",
          "ខ្សែក្រវាត់ផ្នត់កំពតបានកត់ត្រានូវការរុញច្រានឡើងលើ (thrusting) ការងើបឡើង (uplift) និងការលាតត្រដាងសិលាពីជម្រៅ (exhumation) យ៉ាងខ្លាំងនៅចុងក្រេតាសេដល់ប៉ាឡេអូសែន ដោយការសិក្សាទែម៉ូកាលវិទ្យា (thermochronology) បង្ហាញថាមានការងើបឡើងលាតត្រដាងសរុបរហូតដល់ប្រមាណ ១១ គីឡូម៉ែត្រក្នុងតំបន់។",
        ],
        bodyEn: [
          "Cambodia’s geology is unevenly constrained. The best direct sample-based evidence comes from the southwest and south, especially the Kampot Fold Belt and adjacent magmatic rocks, whereas much of the deeper crustal framework elsewhere is inferred from regional continuation.",
          "The combined southern Cambodia and southwest Vietnam study (Waight et al., 2021) contains Permian to Cretaceous igneous rocks with four distinct age groupings: ~294–265 Ma, 230–222 Ma, 195 Ma, and 107–75 Ma. Cretaceous and Jurassic granitoids occur mainly east of the Kampot Fold Belt, whereas pre-Cretaceous rocks are dominantly felsic volcanics within the fold belt.",
          "In southwestern Cambodia, red beds of the Phuquoc Formation in the Phuquoc–Kampot Som Basin provide direct stratigraphic and paleomagnetic evidence for Late Jurassic–Early Cretaceous continental deposition and later tectonic rotation. Paleomagnetism indicates ~6° southward displacement and 33° clockwise rotation relative to East Asia.",
          "The Kampot Fold Belt itself records major latest Cretaceous–Paleocene thrusting, uplift, and exhumation, with thermochronology suggesting as much as ~11 km exhumation regionally, though only 2.5–4.5 km affected the present Bokor high by differential erosion.",
        ],
        images: [
          {
            url: "/images/tectonics/image3.png",
            captionKm: "រូបភាពទី ២៖ ផែនទីទីតាំងសំណាកនៅកម្ពុជាភាគខាងត្បូង និងវៀតណាមនិរតី បង្ហាញពីខ្សែក្រវាត់ផ្នត់កំពត និងធ្នូមេសូសូអ៊ិកចុង (Waight et al., 2021)",
            captionEn: "Figure 2: Sample-location map of southern Cambodia and southwest Vietnam. The striped area marks the transition between the late Mesozoic arc to the east and the Kampot Fold Belt to the west (Waight et al., 2021; DOI: 10.1016/j.jseaes.2021.104902)",
          },
          {
            url: "/images/tectonics/image4.png",
            captionKm: "រូបភាពទី ៣៖ កន្លែងលាតត្រដាងសិលាតំណាង៖ (A) ហ្ក្រានីតបាក់បែក Hon Soc; (B) ដុំថ្មហ្ក្រានីតពុកផុយ Hon Tre; (C) ហ្ក្រានីតភ្នំតាម៉ៅ; (D) ផេះភ្នំភ្លើងរីយ៉ូលីត Hon Chuoi; (E) អ៊ីញីមប្រ៊ីត Nam Du; (F) ឌីកហ្ក្រានីតភ្នំវល្លិ៍ (Waight et al., 2021)",
            captionEn: "Figure 3: Representative outcrops: (A) Hon Soc fractured granite; (B) Hon Tre weathered granite boulder; (C) Phnom Tamao granite; (D) Hon Chuoi rhyolitic ash-flow tuffs; (E) Nam Du slump-folded ignimbrite; and (F) southern Phnom Worr weathered granite dyke (Waight et al., 2021)",
          },
          {
            url: "/images/tectonics/image5.png",
            captionKm: "រូបភាពទី ១៥៖ ការប្រៀបធៀបអាយុកាលសិលាមុនក្រេតាសេដែលបានបោះពុម្ព និងទិន្នន័យថ្មីពីវៀតណាមនិរតី និងកម្ពុជាភាគខាងត្បូង (Waight et al., 2021)",
            captionEn: "Figure 15: Comparison of published and new pre-Cretaceous ages from southwest Vietnam and southern Cambodia. Black: back-arc; Green: subduction; Blue: syn-collision; Red: post-collision (Waight et al., 2021)",
          },
        ],
      },
      {
        titleKm: "៥. កម្ពុជាក្នុងបរិបទតំបន់ និងគំរូប្រកួតប្រជែង (Cambodia in Regional Context)",
        titleEn: "5. Cambodia in Regional Context & Competing Models",
        bodyKm: [
          "ដែនដីកម្ពុជាភាគនិរតីស្ថិតនៅត្រង់ចំណុចប្រសព្វនៃគម្រោងទាក់ទងគ្នាក្នុងតំបន់ចំនួនបីដែលកំពុងប្រកួតប្រជែងគ្នា៖ (១) សកម្មភាពម៉ាក់ម៉ាមុនក្រេតាសេនៅកម្ពុជាខាងត្បូងជាការបន្តទៅទិសអាគ្នេយ៍នៃប្រព័ន្ធធ្នូកោះ Sukhothai–Chanthaburi កាត់តាមខ្សែតភ្ជាប់ស្រះកែវដែលបន្តវែង; (២) កម្ពុជាភាគខាងត្បូងនៅតែស្ថិតក្នុងប្លុកឥណ្ឌូចិន និងស្ថិតនៅឆ្ងាយពីតំបន់រអិលចូលគ្នានៃប៉ាឡេអូ-តេទីស; (៣) សកម្មភាពម៉ាក់ម៉ាភឺមៀន–ជូរ៉ាសិកមួយចំនួនឆ្លុះបញ្ចាំងពីការរអិលចូលគ្នានៃមហាសមុទ្រប៉ាឡេអូ-ប៉ាស៊ីហ្វិក (Paleo-Pacific subduction) តាមបណ្តោយគែមខាងកើតនៃស៊ុនដាឡង់។",
          "ភស្តុតាងបច្ចុប្បន្នគាំទ្រភាពមិនច្បាស់លាស់ជាជាងការសន្និដ្ឋានដាច់ណាត់។ ការបន្តទៅទិសអាគ្នេយ៍នៃខ្សែតភ្ជាប់ប្លុកស្រះកែវមកក្នុងកម្ពុជាមិនទាន់មានទិន្នន័យបញ្ជាក់នៅឡើយទេ។ សិលាភ្នំភ្លើងភឺមៀននៅកម្ពុជាមានអាយុចាស់ជាងសិលាស្រដៀងគ្នានៅចន្ទបុរី ហើយកម្ពុជាខាងត្បូងមានលក្ខណៈស្រទាប់សិលាខុសពីចន្ទបុរី។ ហត្ថលេខាអ៊ីសូតូបជូរ៉ាសិកជាន់គ្នាលើប្រភពសំបកផែនដីតំបន់ Dalat ប៉ុន្តែវាគ្រាន់តែគាំទ្រលទ្ធភាពនៃភាពស្រដៀងគ្នានៃប្រភព មិនមែនជាការបន្តរចនាសម្ព័ន្ធដាច់ខាតឡើយ។",
        ],
        bodyEn: [
          "The southwest Cambodian domain sits at the intersection of three competing regional correlation schemes: (1) Pre-Cretaceous magmatism in south Cambodia belongs to a southeastward continuation of the Sukhothai–Chanthaburi arc across an extended Sra Kaeo suture; (2) Southern Cambodia remains within Indochina far from the Paleo-Tethyan trench; (3) Permian–Jurassic magmatism reflects Paleo-Pacific subduction along the eastern Sundaland margin.",
          "The evidence currently favors uncertainty over certainty. The southeastward extension of the Sra Kaeo suture is unconstrained. Cambodian Permian volcanics are older than Chanthaburi analogues and southern Cambodia differs stratigraphically from Chanthaburi. Jurassic isotope signatures overlap Dalat-zone crustal sources, but that only supports possible source similarity, not definitive structural continuity.",
        ],
        image: "/images/tectonics/image6.png",
        imageCaptionKm: "រូបភាពទី ១៤៖ បរិបទតិចតូនិកដែលបានស្នើឡើងសម្រាប់សកម្មភាពម៉ាក់ម៉ានៅភឺមៀន (~២៨០ Ma), ទ្រីយ៉ាសិក (~២៣០ Ma), ជូរ៉ាសិក (~២០០ Ma) និងក្រេតាសេ (~១០០ Ma) នៅវៀតណាមនិរតី និងកម្ពុជាខាងត្បូង (Waight et al., 2021)",
        imageCaptionEn: "Figure 14: Proposed tectonic settings for Permian (c. 280 Ma), Triassic (c. 230 Ma), Jurassic (c. 200 Ma) and Cretaceous (c. 100 Ma) magmatism in southwest Vietnam and southern Cambodia (Waight et al., 2021; DOI: 10.1016/j.jseaes.2021.104902)",
      },
      {
        titleKm: "៦. ការប្រែប្រួលទម្រង់សេណូសូអ៊ិក និងការកកើតអាងល្បាប់ (Cenozoic Deformation & Basins)",
        titleEn: "6. Cenozoic Deformation and Basin Development",
        bodyKm: [
          "គំរូតិចតូនិករុញច្រានចេញក្នុងតំបន់ (Escape-tectonics model) ភ្ជាប់ចលនារបស់ឥណ្ឌូចិនទៅនឹងការបុកទង្គិចទ្វីបឥណ្ឌា-អឺរ៉ាស៊ី និងប្រព័ន្ធបំណាក់សិលារំកិលផ្ដេកធំៗ។ ការវាយតម្លៃឡើងវិញដោយ Morley និង Wang (2023) បានសង្កត់ធ្ងន់លើការកន្ត្រាក់បត់បែន (transpression) ការបត់ផ្នត់ ការត្រឡប់ទម្រង់អាង (inversion) និងការងើបឡើងនៃសំបកផែនដីពាសពេញប្លុកឥណ្ឌូចិន ជាជាងការចាត់ទុកវាជាប្លុករឹងមួយតែប៉ុណ្ណោះ។",
          "សម្រាប់ប្រទេសកម្ពុជា Sio និងសហការី (2023) បានសំយោគការវិវត្តនៃអាងល្បាប់៖ ការពង្រីកខ្លួនពីពាក់កណ្តាលអេអូសែន ដល់ដើមអូលីហ្គោសែន និងការត្រឡប់ទម្រង់អាងនៅមីយ៉ូសែនក្នុងអាងបឹងទន្លេសាប និងស្វាយរៀង។ ការសំយោគអាងខ្មែរ (Khmer Basin) បែងចែកការប្រេះបែកនៅអេអូសែនដល់ចុងអូលីហ្គោសែន ការស្រុតចុះដោយកម្តៅ (thermal subsidence) នៅដើមដល់កណ្តាលមីយ៉ូសែន និងការត្រឡប់ទម្រង់ក្រោយមកទៀត។ អាងបឹងទន្លេសាបបច្ចុប្បន្ន និងទំនាបទឹកជំនន់ទន្លេមេគង្គ មិនត្រូវយកមកកំណត់ស្មើគ្នាភ្លាមៗទៅនឹងធរណីមាត្រប្រេះបែកបុរាណទោលមួយនោះឡើយ។",
        ],
        bodyEn: [
          "The regional escape-tectonics model links Indochina motion to the India-Asia collision and major strike-slip faults. A recent reappraisal by Morley and Wang (2023) emphasizes widespread Paleogene transpression, folding, inversion, and exhumation distributed within the supposed rigid block.",
          "For Cambodia, Sio et al. (2023) summarize Middle Eocene to Early Oligocene extension and Miocene inversion in Tonle Sap and Svay Rieng. Their Khmer Basin synthesis distinguishes Eocene to Late Oligocene rifting, Early to Middle Miocene thermal subsidence, and younger inversion. The modern Tonle Sap lake and Mekong floodplain reflect complex multi-phase tectonic subsidence.",
        ],
        calloutKm: "ចំណុចសំខាន់៖ អាងបឹងទន្លេសាប និងស្វាយរៀងឆ្លងកាត់ដំណាក់កាលប្រេះស្រុត (rifting) នៅអេអូសែន-អូលីហ្គោសែន និងការត្រឡប់ទម្រង់អាង (basin inversion) នៅមីយ៉ូសែន។",
        calloutEn: "Key finding: Tonle Sap and Svay Rieng basins record multi-stage Eocene–Oligocene extension followed by Miocene structural inversion and Quaternary drainage capture.",
      },
      {
        titleKm: "៧. ផលប៉ះពាល់ចំពោះការរុករករ៉ែ (Implications for Mineral Exploration)",
        titleEn: "7. Implications for Mineral Exploration & Deposit Models",
        bodyKm: [
          "គ្រោងការណ៍តិចតូនិកមានប្រយោជន៍សម្រាប់ការបង្កើតសម្មតិកម្មប្រព័ន្ធរ៉ែ (Mineral-system hypotheses) ប៉ុន្តែមិនមែនជាការវាយតម្លៃធនធានកម្រិតជម្រកនោះទេ។ ការសន្និដ្ឋានត្រូវផ្អែកលើការសង្កេតជាក់ស្តែង៖",
          "១. ជម្រករ៉ែមាស-ទង់ដែងប្រភេទ Porphyry Cu-Au៖ វត្តមានសិលាហ្ក្រានីតធ្នូកោះធ្វើឱ្យសម្មតិកម្មប្រព័ន្ធម៉ាក់ម៉ា-អ៊ីដ្រូទែម៉ាល់មានហេតុផលសមរម្យ ប៉ុន្តែការបកស្រាយត្រូវការពស្តុតាងដូចជា បណ្តាញសរសៃរ៉ែ (stockworks), តំបន់ប្រែប្រួលសិលា (alteration zoning) និងអាយុកាលរ៉ែស្របគ្នា។ គីមីវិទ្យា Calc-alkaline តែមួយមុខមិនគ្រប់គ្រាន់ដើម្បីបញ្ជាក់គំរូ porphyry នោះទេ។",
          "២. ជម្រករ៉ែប្រភេទស្កាន (Skarn)៖ ជាសម្មតិកម្មប្រតិកម្មប៉ះទង្គិចរវាងសិលាអគ្នីជ្រៀតចូល និងស្រទាប់ថ្មកំបោរ។ ការធ្វើផែនទីត្រូវបញ្ជាក់ពីការប៉ះផ្ទាល់ សមាសភាពរ៉ែ calc-silicate និងដំណាក់កាលបង្កើតលោហៈ មុនពេលសន្និដ្ឋាន។",
          "៣. ជម្រករ៉ែមាសគ្រប់គ្រងដោយរចនាសម្ព័ន្ធ (Structurally controlled gold)៖ ត្រូវធ្វើតេស្តដោយធរណីមាត្រសរសៃរ៉ែ លំដាប់នៃការខូចទ្រង់ទ្រាយ រ៉ែប្រែប្រួល និងភស្តុតាងវត្ថុរាវ (fluid inclusions)។ តំបន់កាត់ (shear zone) អាចផ្ទុករ៉ែបានដោយមិនចាំបាច់ជាប្រភព orogenic gold សុទ្ធសាធឡើយ។",
        ],
        bodyEn: [
          "The tectonic framework is valuable for generating mineral-system hypotheses, but requires rigorous deposit-scale verification rather than broad regional extrapolation:",
          "1. Porphyry Cu–Au systems: Arc-related granitoids make magmatic-hydrothermal systems a viable hypothesis, but require field demonstration of intrusive-centered stockworks, coherent alteration zoning, and compatible mineralization ages. Calc-alkaline geochemistry alone cannot confirm a porphyry deposit.",
          "2. Skarn mineralization: Contact-metasomatic hypothesis where intrusive bodies intersect reactive carbonate strata. Geological mapping must demonstrate contacts, calc-silicate mineral assemblages, and ore-stage overprints.",
          "3. Structurally controlled gold: Must be tested through vein geometry, structural cross-cutting relationships, alteration mineralogy, and fluid inclusion evidence. Major crustal shearing in Kampot demonstrates deep deformation, but is not by itself proof of economic gold concentrations.",
        ],
        bulletsKm: [
          "ញែកឱ្យដាច់រវាងភូគព្ភសាស្ត្រដែលបានសង្កេតឃើញផ្ទាល់ និងគំរូសម្មតិកម្មក្នុងទិន្នន័យ។",
          "ការកំណត់គោលដៅរុករកត្រូវផ្អែកលើទិន្នន័យខួង ផែនទីកែប្រែសិលា និងការវិភាគគីមីពិតប្រាកដ។",
        ],
        bulletsEn: [
          "Separate observed rock data from inferred genetic models in geological databases.",
          "Target generation requires ground-truthed alteration mapping, structural paragenesis, and direct assay verification.",
        ],
      },
      {
        titleKm: "៨. អាទិភាពស្រាវជ្រាវ និងកម្មវិធីការងារ (Research Priorities & Testable Programme)",
        titleEn: "8. Research Priorities and a Testable Programme",
        bodyKm: [
          "តម្រូវការចម្បងសម្រាប់ភូគព្ភសាស្ត្រកម្ពុជា គឺការភ្ជាប់ការសង្កេតទីតាំងជាក់លាក់នៅកម្ពុជា ជាមួយអាយុកាលដែលអាចផ្ទៀងផ្ទាត់ឡើងវិញបាន និងការធ្វើតេស្តរចនាសម្ព័ន្ធក្នុងតំបន់។ កម្មវិធីការងារដែលបានស្នើឡើងរួមមាន៖",
          "១. បង្កើតប្រព័ន្ធព័ត៌មានភូមិសាស្ត្រជាតិ (National GIS) ដែលមានការត្រួតពិនិត្យប្រភពទិន្នន័យច្បាស់លាស់។",
          "២. ធ្វើខ្សែវាស់កាត់រចនាសម្ព័ន្ធ (structural transects) និងការកំណត់អាយុភូកាលវិទ្យាដែលមានទិសដៅច្បាស់លាស់។",
          "៣. សំយោគអ៊ីសូតូបគីមី ប្រវត្តិសីតុណ្ហភាពសិលា (thermal histories) និងទិន្នន័យរលកញ័ររញ្ជួយដី (seismic) ឬអណ្តូងខួង។",
          "៤. ធ្វើបញ្ជីសារពើភណ្ឌច្បាស់លាស់អំពីអ្វីដែលបានធ្វើផែនទី និងកំណត់អាយុផ្ទាល់នៅកម្ពុជា និងអ្វីដែលគ្រាន់តែជាការទាញសន្មតឆ្លងកាត់ព្រំដែន។",
        ],
        bodyEn: [
          "The principal need is to connect well-located Cambodian ground observations with reproducible isotopic ages and regional structural tests. A proposed programme includes:",
          "1. Developing a source-controlled national GIS repository separating confirmed outcrops from interpreted lineaments.",
          "2. Conducting targeted structural transects and high-precision U–Pb and Ar–Ar geochronological campaigns.",
          "3. Integrating whole-rock radiogenic isotope geochemistry, low-temperature thermochronology, and accessible seismic or well records.",
          "4. Establishing a clear national inventory distinguishing directly mapped rocks from regional interpolations across international borders.",
        ],
      },
      {
        titleKm: "៩. សេចក្តីសន្និដ្ឋាន (Conclusions)",
        titleEn: "9. Conclusions",
        bodyKm: [
          "អាស៊ីអាគ្នេយ៍បានកត់ត្រានូវការបើកមហាសមុទ្រ ការវិវត្តធ្នូកោះ ការបុកទង្គិច និងការកម្រើកឡើងវិញនៃចលនាតិចតូនិកបន្តបន្ទាប់គ្នា។ គំរូតំបន់ផ្តល់បរិបទចាំបាច់សម្រាប់កម្ពុជា ប៉ុន្តែធរណីមាត្រព្រំប្រទល់ និងពេលវេលាព្រឹត្តិការណ៍នៅតែពឹងផ្អែកលើគំរូសម្មតិកម្ម។",
          "ការបកស្រាយដែលត្រឹមត្រូវបំផុតសម្រាប់កម្ពុជា គឺប្រវត្តិភូគព្ភសាស្ត្រចម្រុះ (heterogeneous history) ដែលមានដំណាក់កាលម៉ាក់ម៉ាច្រើនលើក ការខូចទ្រង់ទ្រាយខ្លាំងនៅចុងក្រេតាសេដល់ប៉ាឡេអូសែននៅភាគនិរតី និងការកកើតអាងល្បាប់សេណូសូអ៊ិក រួមជាមួយការកម្រើកឡើងវិញ។ គ្មានស្លាកឈ្មោះខ្សែក្រវាត់ក្នុងតំបន់តែមួយណាអាចដោះស្រាយប្រវត្តិនេះបានទាំងស្រុងនោះទេ។ ជំហានរីកចម្រើនបន្ទាប់ត្រូវតែបានមកពីការធ្វើតេស្តផ្ទាល់លើទំនាក់ទំនងសិលា អាយុកាល ប្រភព និងការខូចទ្រង់ទ្រាយក្នុងប្រទេសកម្ពុជា។",
        ],
        bodyEn: [
          "Southeast Asia records successive ocean opening, arc development, collision and later reactivation. Regional assembly models provide essential context for Cambodia, but their boundary geometry and event timing remain model-dependent. Cambodian evidence is particularly valuable where rock ages, structures, palaeomagnetism and thermal histories can be evaluated together.",
          "The most defensible Cambodian interpretation is a heterogeneous geological history with several magmatic episodes, major latest Cretaceous to Paleocene deformation in the southwest, and Cenozoic basin formation and reactivation. No single imported regional belt label adequately resolves that history.",
        ],
      },
      {
        titleKm: "១០. ទិន្នន័យភូកាលវិទ្យាសំយោគ (Geochronological Data Synthesis - Waight et al., 2021)",
        titleEn: "10. Geochronological Data Synthesis (Waight et al., 2021)",
        bodyKm: [
          "តារាងទី ១ សំយោគទិន្នន័យភូកាលវិទ្យា (U-Pb zircon geochronology) សម្រាប់សិលាហ្ក្រានីត និងសិលាភ្នំភ្លើងនៅវៀតណាមនិរតី និងកម្ពុជាភាគខាងត្បូង ដោយ Waight et al. (2021) បោះពុម្ពក្នុង Journal of Asian Earth Sciences (DOI: 10.1016/j.jseaes.2021.104902)។",
        ],
        bodyEn: [
          "Table 1 summarizes comprehensive U–Pb zircon and related geochronological determinations for plutonic and felsic volcanic rocks from southwest Vietnam and southern Cambodia compiled and analyzed by Waight et al. (2021; Journal of Asian Earth Sciences, DOI: 10.1016/j.jseaes.2021.104902).",
        ],
        images: [
          {
            url: "/images/tectonics/image7.png",
            captionKm: "តារាងទី ១ (ភាគ ១)៖ សេចក្តីសង្ខេបទិន្នន័យភូកាលវិទ្យាសម្រាប់សិលាហ្ក្រានីត និងសិលាភ្នំភ្លើងនៅវៀតណាមនិរតី និងកម្ពុជាភាគខាងត្បូង (Waight et al., 2021)",
            captionEn: "Table 1 (Part 1): Summary of geochronological data for plutonic and volcanic rocks from southwest Vietnam and southern Cambodia (Waight et al., 2021)",
          },
          {
            url: "/images/tectonics/image8.png",
            captionKm: "តារាងទី ១ (ភាគ ២ - បន្ត)៖ សេចក្តីសង្ខេបទិន្នន័យភូកាលវិទ្យា (Waight et al., 2021)",
            captionEn: "Table 1 (Part 2, Continued): Summary of geochronological data for plutonic and volcanic rocks from southwest Vietnam and southern Cambodia with analytical notes (Waight et al., 2021)",
          },
        ],
      },
      {
        titleKm: "១១. ឯកសារយោងវិទ្យាសាស្ត្រ (Cited Scientific Literature & DOIs)",
        titleEn: "11. Cited Scientific Literature & DOIs",
        bodyKm: [
          "អត្ថបទសំយោគនេះផ្អែកលើការស្រាវជ្រាវវិទ្យាសាស្ត្រចំនួន ១៧ អត្ថបទដែលត្រូវបានបោះពុម្ពផ្សាយក្នុងទស្សនាវដ្ដីអន្តរជាតិល្បីៗ៖",
        ],
        bodyEn: [
          "This synthesis is grounded directly upon the following 17 peer-reviewed regional geodynamic and Cambodian geological investigations:",
        ],
        bulletsKm: [
          "[1] Metcalfe I. (2009). Late Palaeozoic and Mesozoic tectonic and palaeogeographical evolution of SE Asia. Geological Society, London, Special Publications, 315:23–37. DOI: 10.1144/sp315.2",
          "[2] Metcalfe I. (2017). Tectonic evolution of Sundaland. Bulletin of the Geological Society of Malaysia, 63:27–60. DOI: 10.7186/bgsm63201702",
          "[3] Waight T., Fyhn M., Thomsen T., et al. (2021). Permian to Cretaceous granites and felsic volcanics from SW Vietnam and S Cambodia: Implications for tectonic development of Indochina. Journal of Asian Earth Sciences, 219:104902. DOI: 10.1016/j.jseaes.2021.104902",
          "[4] Sone M., Metcalfe I. (2008). Parallel Tethyan sutures in mainland Southeast Asia: New insights for Palaeo-Tethys closure and implications for the Indosinian orogeny. Comptes Rendus Geoscience, 340:166–179. DOI: 10.1016/j.crte.2007.09.008",
          "[5] Fyhn M., Green P., Bergman S., et al. (2016). Cenozoic deformation and exhumation of the Kampot Fold Belt and implications for south Indochina tectonics. JGR: Solid Earth, 121:5278–5307. DOI: 10.1002/2016jb012847",
          "[6] Tsuchiyama Y., Zaman H., Sotham S., et al. (2016). Paleomagnetism of Late Jurassic to Early Cretaceous red beds from the Cardamom Mountains, southwestern Cambodia: Tectonic deformation of the Indochina Peninsula. EPSL, 434:274–288. DOI: 10.1016/j.epsl.2015.11.045",
          "[7] Sio S., Or C., Eng C., Pech S., Sreu T. (2023). Review of sedimentary basin evolution in Cambodia based on tectonic setting and logical information. Berita Sedimentologi, 49(2):439. DOI: 10.51835/bsed.2023.49.2.439",
          "[8] Vượng V., Faure M., Wei L., Minh T.N.T. (2024). From rifting to Indosinian orogeny recorded in the Indochina from late Devonian to late Triassic: a review. Vietnam Journal of Earth Sciences. DOI: 10.15625/2615-9783/21910",
          "[9] Faure M., Lepvrier C., Van Nguyen V., et al. (2014). The South China block-Indochina collision: Where, when, and how? Journal of Asian Earth Sciences, 79:260–274. DOI: 10.1016/j.jseaes.2013.09.022",
          "[10] Cai J., Zhang K. (2009). A new model for the Indochina and South China collision during the Late Permian to the Middle Triassic. Tectonophysics, 467:35–43. DOI: 10.1016/j.tecto.2008.12.003",
          "[11] Liu H., Wang Y., Li Z., et al. (2018). Geodynamics of the Indosinian orogeny between the South China and Indochina blocks. GSA Bulletin, 130:1289–1306. DOI: 10.1130/b31904.1",
          "[12] Hara H., Charoentitirat T., Tokiwa T., et al. (2023). Record of the Indosinian Orogeny provided by conglomerates and detrital zircon U–Pb ages from western Indochina. Gondwana Research. DOI: 10.1016/j.gr.2023.11.009",
          "[13] Minezaki T., Hisada K., Hara H., Kamata Y. (2019). Tectono-stratigraphy of Late Carboniferous to Triassic successions of the Khorat Plateau Basin. Journal of Asian Earth Sciences. DOI: 10.1016/j.jseaes.2018.10.020",
          "[14] Hara H., Tokiwa T., Kurihara T., et al. (2020). Revisiting the tectonic evolution of the Triassic Palaeo-Tethys convergence zone in northern Thailand. Geological Magazine, 158:905–929. DOI: 10.1017/s0016756820001028",
          "[15] Morley C., Ampaiwan P., Thanudamrong S., et al. (2013). Development of the Khao Khwang Fold and Thrust Belt: Implications for Thailand and Cambodia. Journal of Asian Earth Sciences, 62:705–719. DOI: 10.1016/j.jseaes.2012.11.021",
          "[16] Morley C.K., Wang Y. (2023). The Cenozoic hyper-oblique collision zone of Indochina: A re-appraisal of escape tectonics. Earth-Science Reviews. DOI: 10.1016/j.earscirev.2023.104453",
          "[17] Zhao J., Liu C., Zhao J., Xu Q. (2025). Reconstruction of the Cenozoic Deformation of the Yinggehai Basin and Beibu Gulf Basin, South China Sea. JMSE, 13(2):322. DOI: 10.3390/jmse13020322",
        ],
        bulletsEn: [
          "[1] Metcalfe I. (2009). Late Palaeozoic and Mesozoic tectonic and palaeogeographical evolution of SE Asia. Geological Society, London, Special Publications, 315:23–37. DOI: 10.1144/sp315.2",
          "[2] Metcalfe I. (2017). Tectonic evolution of Sundaland. Bulletin of the Geological Society of Malaysia, 63:27–60. DOI: 10.7186/bgsm63201702",
          "[3] Waight T., Fyhn M., Thomsen T., et al. (2021). Permian to Cretaceous granites and felsic volcanics from SW Vietnam and S Cambodia: Implications for tectonic development of Indochina. Journal of Asian Earth Sciences, 219:104902. DOI: 10.1016/j.jseaes.2021.104902",
          "[4] Sone M., Metcalfe I. (2008). Parallel Tethyan sutures in mainland Southeast Asia: New insights for Palaeo-Tethys closure and implications for the Indosinian orogeny. Comptes Rendus Geoscience, 340:166–179. DOI: 10.1016/j.crte.2007.09.008",
          "[5] Fyhn M., Green P., Bergman S., et al. (2016). Cenozoic deformation and exhumation of the Kampot Fold Belt and implications for south Indochina tectonics. JGR: Solid Earth, 121:5278–5307. DOI: 10.1002/2016jb012847",
          "[6] Tsuchiyama Y., Zaman H., Sotham S., et al. (2016). Paleomagnetism of Late Jurassic to Early Cretaceous red beds from the Cardamom Mountains, southwestern Cambodia: Tectonic deformation of the Indochina Peninsula. EPSL, 434:274–288. DOI: 10.1016/j.epsl.2015.11.045",
          "[7] Sio S., Or C., Eng C., Pech S., Sreu T. (2023). Review of sedimentary basin evolution in Cambodia based on tectonic setting and logical information. Berita Sedimentologi, 49(2):439. DOI: 10.51835/bsed.2023.49.2.439",
          "[8] Vượng V., Faure M., Wei L., Minh T.N.T. (2024). From rifting to Indosinian orogeny recorded in the Indochina from late Devonian to late Triassic: a review. Vietnam Journal of Earth Sciences. DOI: 10.15625/2615-9783/21910",
          "[9] Faure M., Lepvrier C., Van Nguyen V., et al. (2014). The South China block-Indochina collision: Where, when, and how? Journal of Asian Earth Sciences, 79:260–274. DOI: 10.1016/j.jseaes.2013.09.022",
          "[10] Cai J., Zhang K. (2009). A new model for the Indochina and South China collision during the Late Permian to the Middle Triassic. Tectonophysics, 467:35–43. DOI: 10.1016/j.tecto.2008.12.003",
          "[11] Liu H., Wang Y., Li Z., et al. (2018). Geodynamics of the Indosinian orogeny between the South China and Indochina blocks. GSA Bulletin, 130:1289–1306. DOI: 10.1130/b31904.1",
          "[12] Hara H., Charoentitirat T., Tokiwa T., et al. (2023). Record of the Indosinian Orogeny provided by conglomerates and detrital zircon U–Pb ages from western Indochina. Gondwana Research. DOI: 10.1016/j.gr.2023.11.009",
          "[13] Minezaki T., Hisada K., Hara H., Kamata Y. (2019). Tectono-stratigraphy of Late Carboniferous to Triassic successions of the Khorat Plateau Basin. Journal of Asian Earth Sciences. DOI: 10.1016/j.jseaes.2018.10.020",
          "[14] Hara H., Tokiwa T., Kurihara T., et al. (2020). Revisiting the tectonic evolution of the Triassic Palaeo-Tethys convergence zone in northern Thailand. Geological Magazine, 158:905–929. DOI: 10.1017/s0016756820001028",
          "[15] Morley C., Ampaiwan P., Thanudamrong S., et al. (2013). Development of the Khao Khwang Fold and Thrust Belt: Implications for Thailand and Cambodia. Journal of Asian Earth Sciences, 62:705–719. DOI: 10.1016/j.jseaes.2012.11.021",
          "[16] Morley C.K., Wang Y. (2023). The Cenozoic hyper-oblique collision zone of Indochina: A re-appraisal of escape tectonics. Earth-Science Reviews. DOI: 10.1016/j.earscirev.2023.104453",
          "[17] Zhao J., Liu C., Zhao J., Xu Q. (2025). Reconstruction of the Cenozoic Deformation of the Yinggehai Basin and Beibu Gulf Basin, South China Sea. JMSE, 13(2):322. DOI: 10.3390/jmse13020322",
        ],
      },
    ],
    relatedPaperIds: [
      "tectonics-metcalfe-2017",
      "tectonics-waight-2021",
      "tectonics-fyhn-2016",
      "tectonics-tsuchiyama-2016",
      "tectonics-sio-2023",
      "web05",
      "local-1e2550d30286",
      "local-fc48e0cb2b24",
      "local-5607ec1f1471",
      "local-213a3ea52781",
      "local-b40e5b3443cb",
      "local-7d51b80534c0",
    ],
    keyHighlightsKm: [
      "ស្នូលប្លុកឥណ្ឌូចិន និងការផ្គុំឡើងនៃស៊ុនដាឡង់តាមរយៈការបិទនៃមហាសមុទ្រប៉ាឡេអូ-តេទីស",
      "ភូកាលវិទ្យាសិលាអគ្នីកម្ពុជាភាគនិរតីបញ្ជាក់ពី ៤ ដំណាក់កាល៖ ~២៩៤–២៦៥ Ma, ២៣០–២២២ Ma, ១៩៥ Ma និង ១០៧–៧៥ Ma",
      "ស្រទាប់ក្រហមភ្នំក្រវាញបង្ហាញពីការរំកិលទៅត្បូង ៦° និងការបង្វិលតាមទ្រនិចនាឡិកា ៣៣°",
      "ខ្សែក្រវាត់ផ្នត់កំពតកត់ត្រាការរុញច្រានឡើងលើ និងការងើបឡើងសរុបរហូតដល់ ១១ គ.ម នៅចុងក្រេតាសេ-ប៉ាឡេអូសែន",
      "ការវិវត្តអាងទាញពង្រីក និងការត្រឡប់ទម្រង់អាងនៅសេណូសូអ៊ិក (បឹងទន្លេសាប, ស្វាយរៀង, កំពង់សោម)",
    ],
    keyHighlightsEn: [
      "Core Indochina Terrane geodynamic framework assembled through Paleozoic–Mesozoic Tethyan closure",
      "Direct Cambodian igneous geochronology resolves four distinct magmatic episodes (~294–265 Ma, 230–222 Ma, 195 Ma, 107–75 Ma)",
      "Cardamom Mountains red-bed paleomagnetism reveals ~6° southward displacement and 33° clockwise rotation",
      "Kampot Fold Belt preserves massive latest Cretaceous–Paleocene thrusting and ~11 km regional exhumation",
      "Cenozoic strike-slip faulting and extrusion governed multi-phase rift development and inversion in Tonle Sap, Khmer, and Svay Rieng basins",
    ],
  },
  {
    id: "mineral-deposits",
    slug: "mineral-deposits",
    key: "Mineral deposits",
    titleKm: "ជម្រករ៉ែ ខ្សែក្រវាត់ខនិជកម្ម និងប្រភេទជម្រករ៉ែនៃប្រទេសកម្ពុជា",
    titleEn: "Mineral Deposits, Metallogenic Belts, and Mineral Deposit Types of Cambodia",
    shortTitleKm: "ជម្រករ៉ែ",
    shortTitleEn: "Mineral deposits",
    image: "/images/mineral-deposits/pro_projects.jpg",
    imageAlt: "Cambodia regional geology, known mineral occurrences and artisanal mining centres (Indochine Mining, 2010; ESCAP, 1993)",
    captionKm: "រូបភាពទី ១៖ ផែនទីភូគព្ភសាស្ត្រតំបន់ ទីតាំងកំណកកកើតរ៉ែ និងមជ្ឈមណ្ឌលធ្វើអាជីវកម្មរ៉ែនៅកម្ពុជា (Indochine Mining, 2010; ESCAP, 1993)",
    captionEn: "Figure 1: Cambodia regional geology, known mineral occurrences and artisanal mining centres (Indochine Mining, 2010; ESCAP, 1993)",
    leadKm: "ប្រទេសកម្ពុជាសម្បូរទៅដោយធនធានរ៉ែលោហៈ និងអលោហៈចម្រុះ ដែលកកើតឡើងតាមប្រវត្តិភូគព្ភសាស្ត្រដ៏ស្មុគស្មាញនៃប្លុកឥណ្ឌូចិន រួមមាន ការបត់ភ្នំឥណ្ឌូស៊ីនៀនសម័យកាបូនីហ្វែរ-ទ្រីយ៉ាស៊ីក ការជ្រៀតចូលនៃសិលាក្រានីតសម័យមេសូសូអ៊ិក និងអាកាសធាតុត្រូពិចជ្រៅសម័យសេណូសូអ៊ិក។ អត្ថបទនេះធ្វើការសំយោគជាប្រព័ន្ធនូវប្រភេទជម្រករ៉ែសំខាន់ៗទាំង ៨ គ្រោងខ្សែក្រវាត់ខនិជកម្ម ផែនទីភូគព្ភសាស្ត្រ រូបថតសំណាករ៉ែស្នូល និងគំរូគោលគំនិតវិទ្យាសាស្ត្រ ដោយផ្អែកលើទិន្នន័យអាត្លាស ESCAP, របាយការណ៍បច្ចេកទេស និងការស្រាវជ្រាវអន្តរជាតិចុងក្រោយបង្អស់។",
    leadEn: "Cambodia hosts diverse, highly prospective mineral deposits shaped by its geological evolution across the Indochina Terrane: Carboniferous–Triassic Indosinian mountain-building, Mesozoic granitic intrusions, and deep Cenozoic tropical weathering. Drawing upon authoritative baseline data from the UN ESCAP Atlas, comprehensive regional exploration reports, high-precision geochronology, and recent peer-reviewed discoveries, this synthesis examines Cambodia's eight principal mineral deposit families, complete with published conceptual models, prospect maps, and drill core petrography.",
    stats: [
      { labelKm: "រ៉ែមាសឧស្សាហកម្ម", labelEn: "Flagship Gold Deposit", value: "Okvau RIRGS (>1.14 Moz Au)" },
      { labelKm: "ប្រភេទជម្រករ៉ែចម្បង", labelEn: "Major Deposit Types", value: "8 Core Deposit Families" },
      { labelKm: "ខ្សែក្រវាត់រ៉ែតំបន់", labelEn: "Regional Metallogenic Belts", value: "Loei-Khvav, Dalat-Kratie, Truong Son" },
      { labelKm: "ធនធានលោហៈ & អលោហៈ", labelEn: "Key Commodities", value: "Au, Cu, Fe, Bauxite, Chromite, Gems, Cement" },
    ],
    sections: [
      {
        titleKm: "១. ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធរ៉ែ និងប្រវត្តិភូគព្ភសាស្ត្រកម្ពុជា (Overview of Mineral Systems & Geological History)",
        titleEn: "1. Overview of Mineral Systems and Geological Evolution",
        bodyKm: [
          "ធនធានរ៉ែរបស់ប្រទេសកម្ពុជាត្រូវបានកំណត់លក្ខណៈដោយទីតាំងភូមិសាស្ត្រស្ថិតនៅរឹមភាគអាគ្នេយ៍នៃប្លុកឥណ្ឌូចិន (Indochina Terrane)។ ព្រឹត្តិការណ៍ភូគព្ភសាស្ត្រធំៗចំនួន ៣ បានបន្សល់ទុកនូវគ្រួសាររ៉ែខុសៗគ្នា៖",
          "១. ចលនាបត់ភ្នំឥណ្ឌូស៊ីនៀន (Indosinian Orogeny) សម័យកាបូនីហ្វែរ-ទ្រីយ៉ាស៊ីក បង្កើតឱ្យមានធ្នូភ្នំភ្លើង ស្នាមប្រេះស្រាំ និងតំបន់កាត់ ដែលជាជម្រកនៃរ៉ែ Porphyry, Epithermal, និង Skarn។",
          "២. ការជ្រៀតចូលនៃសិលាមាក់ម៉ាក្រានីត-ឌីអូរីតសម័យមេសូសូអ៊ិក (Mesozoic Granitic Intrusions) បង្កើតប្រព័ន្ធរ៉ែមាសជ្រៀតចូលកម្រិតអុកស៊ីតកម្មទាប (Reduced Intrusion-Related Gold Systems - RIRGS) និងរ៉ែសំណប៉ាហាំង-តុងស្តែន។",
          "៣. បន្ទុះភ្នំភ្លើងបាសាល់ និងអាកាសធាតុត្រូពិចជ្រៅសម័យសេណូសូអ៊ិក (Cenozoic Basalts & Weathering) បង្កើតកម្រាលរ៉ែបុកស៊ីត (Lateritic Bauxite) កម្រាលដែក Supergene និងប្រភពត្បូងទទឹម កណ្ដៀង និងស៊ីកូនក្នុងល្បាប់ស្ទឹង។",
        ],
        bodyEn: [
          "Cambodia's mineral wealth follows directly from its geodynamic evolution along the southeastern margin of the Indochina Terrane. Three overarching geological chapters shaped its mineral systems:",
          "1. Carboniferous to Triassic Indosinian mountain-building: Subduction-accretion cycles generated continental volcanic arcs (such as the ~1,800-km-long Loei-Khvav Arc), producing porphyry, epithermal, and skarn mineralization.",
          "2. Mesozoic granitic plutonism: Cretaceous and Triassic diorite to granite intrusions penetrated continental red beds and Paleozoic metasediments, establishing reduced intrusion-related gold systems (RIRGS) and Sn-W vein swarms.",
          "3. Cenozoic intraplate basalts and tropical weathering: Deep lateritic weathering formed high-grade bauxite blankets across eastern plateaus, while alkali basalt eruptions brought mantle-derived corundum and gem zircon to the surface.",
        ],
        bulletsKm: [
          "តំបន់រុករកប្រវត្តិសាស្ត្រ៖ ខ្នងអាយ-ក្ចោល (ខេត្តកំពង់ស្ពឺ/ពោធិ៍សាត់) និងស្រុករវៀង (ខេត្តព្រះវិហារ)។",
          "តំបន់រុករកទំនើប៖ អុកវាវ និងខ្ពង់រាបមណ្ឌលគិរី, ខ្វាវ (កំពង់ធំ), ក្រចេះ, ភ្នំស្រង់ាំ (កំពត), ភ្នំគ្រី (ពោធិ៍សាត់), និងរតនគិរី។",
        ],
        bulletsEn: [
          "Historic survey clusters: Knong Ay–Kchol (west/northwest of Phnom Penh) and Rovieng district (Preah Vihear).",
          "Modern exploration provinces: Okvau and Haut Chhlong plateau (Mondulkiri), Khvav (Kampong Thom), Kratie, Phnom Sro Ngam (Kampot), Phnum Kri (Pursat), and Ratanakiri.",
        ],
        images: [
          {
            url: "/images/mineral-deposits/pro_projects.jpg",
            captionKm: "រូបភាពទី ១៖ ផែនទីភូគព្ភសាស្ត្រតំបន់ ទីតាំងកំណកកកើតរ៉ែ និងមជ្ឈមណ្ឌលធ្វើអាជីវកម្មរ៉ែនៅកម្ពុជា (Indochine Mining, 2010)",
            captionEn: "Figure 1: Cambodia regional geology, known mineral occurrences and artisanal mining centres (Indochine Mining, 2010)",
          },
        ],
      },
      {
        titleKm: "២. បរិបទភូគព្ភសាស្ត្រ និងខ្សែក្រវាត់ខនិជកម្មតំបន់ (Regional Geological & Metallogenic Setting)",
        titleEn: "2. Regional Geological and Metallogenic Architecture",
        bodyKm: [
          "ផ្នែកធំនៃប្រទេសកម្ពុជាគឺជាផ្នែកមួយនៃប្លុកទ្វីបបុរាណ Kontum Massif ដែលគ្របដណ្តប់ដោយថ្មភក់ និងថ្មភក់ម៉ដ្ឋនៃអាង Khorat Basin សម័យទ្រីយ៉ាស៊ីក-ជូរ៉ាស៊ីក។ ខ្សែក្រវាត់ភ្នំផ្នត់ឡឺយ (Loei Fold Belt) និងជួរភ្នំទ្រឿងសឺន (Truong Son Belt) ព័ទ្ធជុំវិញប្លុកនេះនៅប៉ែកខាងជើង និងខាងលិច ដែលសម្បូរទៅដោយសិលាភ្នំភ្លើង-ល្បាប់ ថ្មអានដេស៊ីត និងថ្មកំបោរ។",
          "ដុំសិលាក្រានីតតូចៗទៅមធ្យមបានជ្រៀតចូលទាំងក្នុងម៉ាស៊ីហ្វ និងល្បាប់អាង។ ស្រទាប់ហនហ្វែល (Hornfels halos) ធំៗជុំវិញបង្ហាញថាកំពូលនៃដុំក្រានីតជាច្រើនទើបតែត្រូវបានលាតត្រដាងមួយផ្នែកប៉ុណ្ណោះ ដែលជាបរិស្ថានអំណោយផលបំផុតសម្រាប់ជម្រករ៉ែមាសទាក់ទងនឹងការជ្រៀតចូល។",
          "ផ្អែកលើការស្រាវជ្រាវ អាស៊ីអាគ្នេយ៍ត្រូវបានបែងចែកជាខ្សែក្រវាត់ម៉ាក់ម៉ាសំខាន់ៗ ដែលក្នុងនោះមាន៖",
        ],
        bodyEn: [
          "Most of Cambodia forms part of the stable Kontum Massif, uncomfortably capped by Mesozoic continental sandstones and siltstones of the Khorat Basin. The Late Paleozoic Truong Son and Permo-Triassic Loei fold belts flank this massif to the north and west, preserving prospective volcano-sedimentary sequences, calc-alkaline andesites, and platform carbonates.",
          "Medium-sized granitoid stocks intrude both the basement and basin sedimentary cover. Their extensive, irregular hornfels aureoles demonstrate that the apical roof zones of many intrusions are only partially unroofed—an exceptionally favorable structural level for intrusion-related gold deposition.",
          "Regional metallogenic syntheses divide Southeast Asia into principal magmatic belts, including:",
        ],
        bulletsKm: [
          "ខ្សែក្រវាត់ដាឡាត់-ក្រចេះ (Dalat-Kratie Belt): សម័យក្រេតាសេ (~120–75 Ma) ផ្ទុកជម្រករ៉ែមាស RIRGS ដូចជានៅអុកវាវ (Okvau) និងសរសៃរ៉ែមាសក្រចេះ។",
          "ខ្សែក្រវាត់ភ្នំផ្នត់ឡឺយ-ខ្វាវ (Loei-Khvav Arc): សម័យពែមៀនចុងដល់ទ្រីយ៉ាស៊ីកចុង (~260–230 Ma) ផ្សារភ្ជាប់នឹងរ៉ែ Porphyry Cu-Au, Epithermal, និង Skarn លាតសន្ធឹងចូលមកកម្ពុជាត្រង់តំបន់ខ្វាវ និងភ្នំស្រង់ាំ។",
          "ខ្សែក្រវាត់ទ្រឿងសឺន (Truong Son Belt): ប៉ែកឦសានប្រទេស សម្បូររ៉ែ Porphyry Cu-Mo និងប៉េកម៉ាទីត Sn-W។",
        ],
        bulletsEn: [
          "Dalat-Kratie Belt: Cretaceous arc (~120–75 Ma) hosting reduced intrusion-related gold systems such as Okvau and Kratie vein networks.",
          "Loei-Khvav Arc: Late Permian to Late Triassic arc (~260–230 Ma) hosting porphyry Cu-Au, epithermal Au-Ag, and base-metal skarns extending from Thailand and Laos into central and southern Cambodia (Khvav, Phnom Sro Ngam).",
          "Truong Son Belt: Extends across northeastern Cambodia (Ratanakiri), hosting porphyry Cu-Mo and Sn-W pegmatites.",
        ],
        images: [
          {
            url: "/images/mineral-deposits/pro_tectonic.jpg",
            captionKm: "រូបភាពទី ២៖ គ្រោងតិចតូនិកនៃប្រទេសកម្ពុជា និងតំបន់ជាប់ព្រំដែន បង្ហាញប្លុក Indochina, ធ្នូកោះ Sukhothai-Chanthaburi និងតំបន់ Suture (Sone & Metcalfe, 2007; Indochine Mining, 2010)",
            captionEn: "Figure 2: Tectonic setting of Cambodia and neighbouring terranes showing Indochina Terrane, Sukhothai/Chanthaburi arcs, and sutures (Sone & Metcalfe, 2007; Indochine Mining, 2010)",
          },
          {
            url: "/images/mineral-deposits/atlas_provinces.jpg",
            captionKm: "រូបភាពទី ៣៖ ដែនភូគព្ភសាស្ត្រនៃប្រទេសកម្ពុជា (ESCAP Atlas of Mineral Resources, Vol. 10, 1993)",
            captionEn: "Figure 3: Geological provinces of Cambodia (ESCAP Atlas of Mineral Resources, Vol. 10, 1993)",
          },
          {
            url: "/images/mineral-deposits/atlas_metallo.jpg",
            captionKm: "រូបភាពទី ៤៖ ខ្សែក្រវាត់ខនិជកម្មនៃកម្ពុជា បែងចែកតាមអាយុកាល និងប្រភេទរ៉ែចម្បង (ESCAP Atlas, 1993)",
            captionEn: "Figure 4: Metallogenic provinces of Cambodia grouped by age and dominant commodities (ESCAP Atlas, 1993)",
          },
          {
            url: "/images/mineral-deposits/ok_belts.jpg",
            captionKm: "រូបភាពទី ៥៖ ខ្សែក្រវាត់ម៉ាក់ម៉ានៃអាស៊ីអាគ្នេយ៍ បង្ហាញទីតាំងអុកវាវក្នុងខ្សែក្រវាត់ Dalat-Kratie Belt (Sokmeng et al., 2023)",
            captionEn: "Figure 5: Metallogenic belts of Southeast Asia showing Okvau in the Cretaceous Dalat-Kratie Belt (Sokmeng et al., 2023)",
          },
        ],
      },
      {
        titleKm: "៣. តារាងសង្ខេបប្រភេទជម្រករ៉ែនៃប្រទេសកម្ពុជា (Table 1: Summary of Mineral Deposit Types)",
        titleEn: "3. Comprehensive Classification of Cambodian Mineral Deposit Types",
        bodyKm: [
          "តារាងខាងក្រោមសង្ខេបអំពីប្រភេទជម្រករ៉ែចម្បងៗទាំង ៨ នៅកម្ពុជា បរិស្ថានភូគព្ភសាស្ត្រ សិលាកំណើត សារធាតុរ៉ែ ទីតាំងគន្លឹះ និងស្ថានភាពរុករក-អាជីវកម្មបច្ចុប្បន្ន ផ្អែកលើការសំយោគទិន្នន័យ ESCAP និងរបាយការណ៍ស្រាវជ្រាវផ្លូវការ៖",
        ],
        bodyEn: [
          "The following comprehensive register synthesizes Cambodia's eight core mineral deposit families, outlining their geotectonic settings, host rock lithologies, diagnostic commodity suites, primary geographic localities, and modern operational status:",
        ],
        table: {
          captionKm: "តារាងទី ១៖ ចំណាត់ថ្នាក់ប្រភេទជម្រករ៉ែ បរិស្ថានភូគព្ភសាស្ត្រ សារធាតុរ៉ែ និងស្ថានភាពនៅកម្ពុជា",
          captionEn: "Table 1: Systematic classification of Cambodian mineral deposit types, host rocks, commodities, and operational status",
          headersKm: ["ប្រភេទជម្រករ៉ែ", "បរិស្ថាន និងសិលាកំណើត", "សារធាតុរ៉ែចម្បង", "ទីតាំងសំខាន់ៗ", "ស្ថានភាពបច្ចុប្បន្ន"],
          headersEn: ["Deposit Family", "Setting and Host Lithology", "Main Commodities", "Key Localities", "Current Operational Status"],
          rowsKm: [
            ["មាសទាក់ទងនឹងការជ្រៀតចូល និងសរសៃរ៉ែខ្វាត (RIRGS)", "សិលាឌីអូរីត-ក្រាណូឌីអូរីត, ហនហ្វែល, ស៊ីស, និងសិលាកម្ទេចភ្នំភ្លើង", "មាស (Au) ជាមួយ As, Bi, Te, W, Cu", "អុកវាវ (Okvau), ក្រចេះ, រតនគិរី, ភ្នំស្រង់ាំ, បូស៊ុបទ្រុប, រវៀង", "អណ្តូងរ៉ែពាណិជ្ជកម្មកម្រិតស្តង់ដារ (Okvau >1.14 Moz Au); ទីតាំងផ្សេងទៀតកំពុងរុករក"],
            ["ប្រព័ន្ធទង់ដែង-មាស Porphyry និង Epithermal", "សិលាភ្នំភ្លើងធ្នូកោះពែមៀន-ទ្រីយ៉ាសិក និងសិលាជ្រៀតចូលចុងទ្រីយ៉ាសិក", "ស្ពាន់ (Cu), មាស (Au), ម៉ូលីបដែន (Mo)", "ខ្វាវ (Khvav), ក្រចេះ, ពោធិ៍សាត់, ភ្នំស្រង់ាំ, ប៉ោងប៉ី", "កំពុងរុករក; ប្រព័ន្ធបំរែបំរួលកម្ដៅទឹកទំហំជាង ២០០ គ.ម² នៅខ្វាវ និងហាឡូ"],
            ["រ៉ែស្កាន និងរ៉ែដែកម៉ាក់ម៉ា-អ៊ីដ្រូទែម៉ាល់ (Skarn & Iron)", "តំបន់ប៉ះរវាងសិលាជ្រៀតចូល និងកាបូណាត; ដែក Supergene លើដូមរវៀងជើង", "ដែក (Fe), មាស និងស្ពាន់បន្តិចបន្តួច", "ភ្នំដែក (រវៀង), ជម្រកយ៉ូយេ (Gyoye) និងដូមរវៀងជើង, ភ្នំស្រង់ាំ តំបន់ ៤", "ភ្នំដែក៖ ទុនបម្រុងប្រមាណ ៥–៦ លានតោន (50–65% Fe); គោលដៅរវៀងជើងបានបញ្ជាក់ដោយលេណដ្ឋាន"],
            ["រ៉ែក្រូមីតក្នុងសិលាអ៊ុលត្រាម៉ាហ្វិក (Ultramafic Chromite)", "សិលាជ្រៀតចូលអ៊ុលត្រាម៉ាហ្វិកស៊ែប៉ង់ទីនីត ក្នុងល្បាប់ដេវ៉ូញៀន-កាបូនីហ្វែរ", "ក្រូមីញ៉ូម (Cr)", "ភ្នំគ្រី (ខេត្តពោធិ៍សាត់), ស្រែពាំង", "បានសិក្សាគំរូរំញ័រទំនាញដី 3D Bouguer; កំណត់ឃើញកំណកផ្ទៃដីចំនួន ៧ កន្លែង"],
            ["រ៉ែអាកាសធាតុ និងរ៉ែសំណល់ (Lateritic Bauxite & Iron)", "កម្រាលដីឡាតេរីតលើថ្មបាសាល់ ហ្គាប្រូ និងខ្ពង់រាបសេណូសូអ៊ិក", "អាលុយមីញ៉ូម (Al - Bauxite), ដែក (Fe), ម៉ង់កាណែស (Mn)", "ហាវឆ្លង, បរកែវ, ឆែប, ស្រែពាំង, ត្រសេក", "ជម្រករ៉ែបុកស៊ីតកម្រាស់ ៣–១០ម ទុនបម្រុងរាប់រយលានតោន (Al₂O₃ ៤០–៥០%)"],
            ["រ៉ែផូស្វាតកាស្ទក្នុងរូងភ្នំកំបោរ (Karst Phosphate)", "ភ្នំថ្មកំបោរសម័យពែមៀនរងអាកាសធាតុកាស្ទ និងប្រតិកម្មជីលាមកប្រចៀវ", "ផូស្វាត (P₂O₅)", "ខេត្តកំពត និងបាត់ដំបង; ភ្នំទទឹង, ភ្នំបន្ទាយនាង", "ជម្រករ៉ែទំហំតូចទៅមធ្យម ត្រូវបានទាញយកធ្វើជាជីកសិកម្មធម្មជាតិ"],
            ["រ៉ែមាស Placer និងត្បូងកណ្ដៀង ទទឹម ស៊ីកូន", "ស្រទាប់ក្រួសបាតស្ទឹងល្បាប់; ថ្មបាសាល់សម័យផ្លីយ៉ូ-ផ្លេសតូសែន", "មាស (Au); ត្បូងកណ្ដៀង, ទទឹម (Corundum), ស៊ីកូន (Zircon), ស្ពីណែល", "ភ្នំជី, រតនគិរី, ប៉ៃលិន, សំឡូត, បរកែវ", "ការធ្វើអាជីវកម្មត្បូងធម្មជាតិ និងមាសសិប្បកម្មតាមដងស្ទឹង"],
            ["រ៉ែដីល្បាប់ និងរ៉ែឧស្សាហកម្ម", "សិលាល្បាប់សមុទ្រ និងទ្វីបសម័យពែមៀនដល់សេណូសូអ៊ិក", "ថ្មកំបោរ, ខ្សាច់ស៊ីលីកា, ធ្យូងថ្ម, ថ្មលម្អ, ដីឥដ្ឋកាអូលីន", "កំពត, ព្រះសីហនុ, កោះកុង, បាត់ដំបង", "ថ្មកំបោរផ្គត់ផ្គង់រោងចក្រស៊ីម៉ងត៍ធំៗ (>8 Mt/ឆ្នាំ); ខ្សាច់ស៊ីលីកា និងថ្មសំណង់"],
          ],
          rowsEn: [
            ["Intrusion-related gold and quartz veins (RIRGS)", "Diorite–granodiorite stocks, hornfels aureoles, schists, volcaniclastic beds", "Au, with As, Bi, Te, W, Cu", "Okvau, Kratie, Ratanakiri, Phnom Sro Ngam, Bo Sup Trup, Rovieng", "Active commercial mining (Okvau >1.14 Moz Au); advanced exploration at other prospects"],
            ["Porphyry and epithermal Cu-Au systems", "Permo-Triassic arc volcanics and Late Triassic calc-alkaline intrusions", "Cu, Au, Mo", "Khvav, Kratie, Pursat, Phnom Sro Ngam, Paung Peay", "Advanced exploration; >200 km² alteration system recognized at Khvav and Halo"],
            ["Skarn and magmatic-hydrothermal iron deposits", "Intrusive-carbonate contacts; supergene iron cap on Rovieng Cheung dome", "Fe (magnetite/hematite), minor Au and Cu", "Phnom Daek (Rovieng), Gyoye and Rovieng Cheung dome, Phnom Sro Ngam Area 4", "Phnom Daek: 5–6 Mt historical resource (50–65% Fe); Rovieng Cheung targets confirmed by trenches"],
            ["Ultramafic-hosted podiform chromite", "Serpentinised ultramafic intrusion in Devonian-Carboniferous sediments", "Cr (chromite)", "Phnum Kri (Pursat Province), Sre Peang", "Detailed 3D Bouguer gravity inversion model; seven verified surface outcrop clusters"],
            ["Weathering and residual deposits (Bauxite & Iron)", "Lateritic crusts on Neogene-Quaternary basalt plateaus and gabbro bodies", "Al (bauxite), Fe, Mn, Cr, refractory clay", "Haut Chhlong, Bor Kham, Chhep, Sre Peang, Trasey", "Lateritic bauxite 3–10 m thick; multi-hundred Mt regional potential (40–50% Al₂O₃)"],
            ["Karst cave phosphate deposits", "Weathered Permian tower karst limestone caves with guano replacement", "Phosphate (P₂O₅)", "Kampot and Battambang provinces; Phnom Totung, Phnom Ban Teay Neang", "Small-to-medium deposits; mined locally for direct-application organic fertilizer"],
            ["Placer gold and gemstone deposits", "Alluvial gravel channels; weathered Plio-Pleistocene alkali basalts", "Au; sapphire, ruby (corundum), zircon, spinel", "Phnom Chi, Ratanakiri, Pailin, Samlot, Bokeo", "Historic and active artisanal gemstones and alluvial placer gold mining"],
            ["Sedimentary and industrial minerals", "Marine carbonate platforms and continental basins (Permian to Cenozoic)", "Limestone, silica sand, coal, ornamental stone, kaolin clay", "Kampot, Sihanoukville, Koh Kong, Battambang", "Major industrial cement production (>8 Mt/yr); active silica sand and construction stone quarrying"],
          ],
          footnoteKm: "ប្រភពទិន្នន័យ៖ អាត្លាស ESCAP (1993), របាយការណ៍ JORC Emerald Resources, Sokmeng et al. (2023), Niu et al. (2022), Dinh et al. (2023), និង Seang et al. (2026)។",
          footnoteEn: "Data Sources: UN ESCAP (1993), Emerald Resources NL JORC disclosures, Sokmeng et al. (2023), Niu et al. (2022), Dinh et al. (2023), and Seang et al. (2026).",
        },
      },
      {
        titleKm: "៤. មាសទាក់ទងនឹងការជ្រៀតចូល និងសរសៃរ៉ែខ្វាត (Intrusion-Related Gold Systems & Sheeted Quartz Veins)",
        titleEn: "4. Intrusion-Related Gold Systems and Sheeted Quartz Veins: Okvau and Kratie",
        bodyKm: [
          "ជម្រករ៉ែមាសប្រភេទជ្រៀតចូល (Reduced Intrusion-Related Gold Systems - RIRGS) គឺជាប្រភពរ៉ែមាសដ៏សំខាន់បំផុតរបស់កម្ពុជា។ គំរូគោលគំនិតបង្ហាញថា រ៉ែមាសប្រមូលផ្តុំក្នុងសរសៃខ្វាតស្របៗគ្នា (Sheeted quartz veins) ក្នុងសិលាអគ្នីជ្រៀតចូល (Intrusion-hosted: Au-Bi-Te±W, Mo, As) និងក្នុងស្រទាប់ហនហ្វែលជុំវិញ (Hornfels aureole: Au-As±W, Sb)។",
          "១. អណ្តូងរ៉ែមាសអុកវាវ (Okvau Gold Deposit)៖ ស្ថិតក្នុងស្រុកកែវសីមា ខេត្តមណ្ឌលគិរី ក្នុងខ្សែក្រវាត់ Dalat-Kratie Belt។ រ៉ែមាសកកើតក្នុងសិលាឌីអូរីតសម័យក្រេតាសេ ដែលចាក់ទម្លុះសិលាល្បាប់ហនហ្វែល។ ជាតិមាសកកើតជាមួយស៊ុលភួ pyrrhotite, arsenopyrite, pyrite, និង bismuth tellurides។ ទុនបម្រុង JORC មានជាង ១,១៤ លានអោនស៍ កម្រិតមាសជាមធ្យម ២,០ ក្រាម/តោន។",
          "២. ទីតាំងរុករកខេត្តក្រចេះ (Kratie Exploration Prospects)៖ នៅភ្នំជី (Phnom Chi) និងតំបន់ Elephant / NE Elephant សរសៃខ្វាត-ស៊ុលភួ និងតំបន់បែកបាក់ (Brecciated fault zones) ក្នុងសិលាឌីអូរីតត្រូវបានរកឃើញតាមរយៈការវិភាគគីមីដី និងការខួងស្រាវជ្រាវស្នូល។",
          "៣. ទីតាំងរ៉ែភ្នំស្រង់ាំ (Phnom Sro Ngam, Kampot)៖ តំបន់កាត់ (Shear zones) និងសរសៃរ៉ែកាត់ទទឹងថ្មខ្វាតស៊ីត បង្ហាញពីទម្រង់ Pinch-and-Swell និងកម្រាលដែក Gossan លើលេណដ្ឋានរុករក។",
        ],
        bodyEn: [
          "Reduced Intrusion-Related Gold Systems (RIRGS) and sheeted quartz-sulfide vein networks represent Cambodia's premier metallic gold resource. Published conceptual models illustrate a distinct metallogenic zonation around the causative pluton: high-temperature intrusion-hosted sheeted veins (Au-Bi-Te±W, Mo, As) transitioning outward into proximal hornfels fractures (Au-As±W, Sb) and peripheral polymetallic veins.",
          "1. Okvau Gold Mine (Mondulkiri Province): Cambodia's flagship commercial operation, operated by Emerald Resources NL. Gold is hosted in a dense array of planar sheeted quartz-sulfide veins within a Cretaceous diorite-granodiorite complex and its hornfelsed halo. Primary ore minerals comprise pyrrhotite, arsenopyrite, chalcopyrite, bismuth tellurides, and coarse free gold, sustaining a JORC reserve exceeding 1.14 Moz Au at ~2.0 g/t.",
          "2. Kratie Prospects (Elephant, NE Elephant, and Phnom Chi): Detailed soil geochemistry and diamond drilling intersected extensive quartz-sulfide stockworks, hydrothermally altered diorites, and auriferous fault breccias.",
          "3. Phnom Sro Ngam (Kampot Province): Advanced trenching across Areas 1 to 6 revealed shear-hosted and breccia-hosted mineralization displaying classic pinch-and-swell geometry, gossanous iron caps, and anomalous soil gold footprints.",
        ],
        images: [
          {
            url: "/images/mineral-deposits/pub_irgs_zoning.jpg",
            captionKm: "រូបភាពទី ៦៖ គំរូគោលគំនិតនៃការបែងចែកលោហៈជុំវិញប្រព័ន្ធរ៉ែមាសជ្រៀតចូល (Intrusion-Hosted, Proximal, Distal)",
            captionEn: "Figure 6: Zonation of metals around an intrusion-related gold system from intrusion-hosted Au-Bi-Te to distal veins",
          },
          {
            url: "/images/mineral-deposits/pub_irgs_clan.jpg",
            captionKm: "រូបភាពទី ៧៖ គ្រួសារប្រព័ន្ធរ៉ែមាសជ្រៀតចូលកម្រិតអុកស៊ីតកម្មទាប (RIRGS Clan) តាមជម្រៅផែនដី (Palaeodepth)",
            captionEn: "Figure 7: The reduced intrusion-related clan: deposit styles arranged by palaeodepth around a causative pluton",
          },
          {
            url: "/images/mineral-deposits/ok_map.jpg",
            captionKm: "រូបភាពទី ៨៖ ផែនទីទីតាំងខួងស្រាវជ្រាវ និងសរសៃរ៉ែមាសនៅអុកវាវស្របតាមតំបន់ប៉ះឌីអូរីត និងហនហ្វែល (Sokmeng et al., 2023)",
            captionEn: "Figure 8: Okvau deposit map showing drill collars and mineralised veins parallel to western diorite-hornfels contact (Sokmeng et al., 2023)",
          },
          {
            url: "/images/mineral-deposits/ok_photos.jpg",
            captionKm: "រូបភាពទី ៩៖ សំណាកសិលាឌីអូរីត (A-C) ហនហ្វែល (E-F) និងសរសៃរ៉ែមាស (D, G, H) នៅអុកវាវ (Sokmeng et al., 2023)",
            captionEn: "Figure 9: Okvau lithologies: diorite (A-C), hornfels (E-F) and ore-bearing quartz veins (D, G, H) (Sokmeng et al., 2023)",
          },
          {
            url: "/images/mineral-deposits/ok_ore.jpg",
            captionKm: "រូបភាពទី ១០៖ សំណាករ៉ែប៉ូលាអុកវាវ បង្ហាញសរសៃរ៉ែ quartz-pyrite-arsenopyrite ផ្ទុកមាស (Sokmeng et al., 2023)",
            captionEn: "Figure 10: Polished ore samples from Okvau showing quartz-pyrite-arsenopyrite assemblages (Sokmeng et al., 2023)",
          },
          {
            url: "/images/mineral-deposits/pro_plate2.jpg",
            captionKm: "រូបភាពទី ១១៖ ស្នូលខួងរ៉ែមាសខេត្តក្រចេះ បង្ហាញសរសៃ quartz-sulphide (ឆ្វេង) និងតំបន់កាត់ brecciated (ស្តាំ) (Indochine Mining, 2010)",
            captionEn: "Figure 11: Kratie diamond drill core: quartz-sulphide vein (left) and brecciated, faulted material (right) (Indochine Mining, 2010)",
          },
          {
            url: "/images/mineral-deposits/sdl_shear_photo.jpg",
            captionKm: "រូបភាពទី ១២៖ ការកកើតរ៉ែតាមតំបន់កាត់ (Shear-hosted) ក្នុងលេណដ្ឋានរុករកភ្នំស្រង់ាំ តំបន់ ១",
            captionEn: "Figure 12: Shear-hosted mineralization exposed in an exploration trench at Phnom Sro Ngam, Area 1",
          },
          {
            url: "/images/mineral-deposits/sdl_gold_soil.jpg",
            captionKm: "រូបភាពទី ១៣៖ ផែនទីកំហាប់មាសក្នុងដី (Gold in soil anomaly) ភ្នំស្រង់ាំ តំបន់ ៦",
            captionEn: "Figure 13: Gridded gold-in-soil geochemical anomalies across Area 6 at Phnom Sro Ngam",
          },
        ],
      },
      {
        titleKm: "៥. ប្រព័ន្ធទង់ដែង-មាស Porphyry និង Epithermal (Porphyry & Epithermal Copper-Gold Systems)",
        titleEn: "5. Porphyry and Epithermal Copper-Gold Systems: Khvav, Paung Peay, and Halo",
        bodyKm: [
          "ប្រព័ន្ធរ៉ែ Porphyry Cu-Au-Mo និង Epithermal កើតឡើងនៅតំបន់ធ្នូកោះភ្នំភ្លើងពែមៀន-ទ្រីយ៉ាស៊ីកនៃខ្សែក្រវាត់ Loei-Khvav Arc។ គំរូវិទ្យាសាស្ត្របង្ហាញពីការប្រែប្រួលសំបកកម្តៅទឹក (Hydrothermal alteration zoning) ពីកណ្តាល Potassic (K-feldspar, biotite) មក Phyllic (quartz-sericite-pyrite), Argillic, និង Advanced Argillic ព្រមទាំង Vuggy Silica នៅជម្រៅរាក់។",
          "១. គម្រោងរ៉ែខ្វាវ (Khvav Licences, កំពង់ធំ)៖ ស្ថិតក្នុងខ្សែក្រវាត់ភ្នំភ្លើង Loei-Khvav Arc។ ការសិក្សាផ្កាយរណប SWIR និងផែនទីភូគព្ភសាស្ត្របានកំណត់ឃើញប្រព័ន្ធបំរែបំរួលកម្ដៅទឹកទំហំធំធេងលើផ្ទៃដីជាង ២០០ គ.ម² ដែលមានថ្ម Vuggy Silica កំពូលភ្នំថ្មចោទ (Silicified cliffs) និងតំបន់បែកបាក់ភ្នំភ្លើង (Diatreme breccias)។ ការវាស់ទំនាញដី (Gravity survey) បង្ហាញភាពមិនប្រក្រតី Bouguer ស្របគ្នានឹងបំណាក់មេ។",
          "២. ទីតាំងរ៉ែប៉ោងប៉ី (Paung Peay, ពោធិ៍សាត់) និងក្រចេះ៖ បង្ហាញសញ្ញាណរ៉ែ Porphyry ដំណាក់កាលដំបូង ជាមួយនឹងភាពមិនប្រក្រតីម៉ាញ៉េទិច និងដីកណ្តៀរ Cu-Au។",
          "៣. ទីតាំងរ៉ែហាឡូ (Halo, រតនគិរី)៖ ការខួងរុករកបង្ហាញកំហាប់រ៉ែស្ពាន់ដល់ 7,470 ppm Cu និងម៉ូលីបដែនដល់ 1,450 ppm Mo ក្នុងសិលាក្រាណូឌីអូរីត។",
        ],
        bodyEn: [
          "Porphyry Cu-Au-Mo and linked epithermal systems in Cambodia are intimately associated with the Permo-Triassic Loei-Khvav volcanic arc. Conceptual models demonstrate classic hydrothermal alteration architecture: deep potassic alteration (biotite, K-feldspar) enveloped by pervasive phyllic (quartz-sericite-pyrite) and propylitic shells, ascending into shallow lithocaps characterized by advanced argillic alteration and vuggy residual silica.",
          "1. Khvav Project (Kampong Thom Province): Situated in central Cambodia along the Loei-Khvav arc. Detailed shortwave infrared (SWIR) satellite spectroscopy and mapping delineated an immense hydrothermal alteration system exceeding 200 km². Outcrops feature massive silicified cliffs, vuggy silica, diatreme hydrothermal breccias, and prominent Bouguer gravity anomalies indicative of a deep blind intrusive source.",
          "2. Paung Peay (Pursat) and Kratie prospects: Early-stage copper-gold porphyry systems accompanied by concentric magnetic anomalies and elevated Cu-Au soil footprints.",
          "3. Halo Prospect (Ratanakiri Province): Drill holes confirmed high-grade porphyry copper-molybdenum stockworks (assays up to 7,470 ppm Cu and 1,450 ppm Mo) hosted within Triassic granodiorite intrusions.",
        ],
        images: [
          {
            url: "/images/mineral-deposits/pub_porph_zoning.jpg",
            captionKm: "រូបភាពទី ១៤៖ គំរូគោលគំនិតនៃការបែងចែកតំបន់បំរែបំរួលកម្ដៅទឹកក្នុងប្រព័ន្ធ Porphyry Copper (Potassic, Phyllic, Argillic, Propylitic)",
            captionEn: "Figure 14: Conceptual model of hydrothermal alteration and metal zoning in a porphyry copper-gold system",
          },
          {
            url: "/images/mineral-deposits/pub_epithermal.jpg",
            captionKm: "រូបភាពទី ១៥៖ គំរូគោលគំនិតនៃប្រព័ន្ធរ៉ែ Epithermal (High-Sulphidation & Low-Sulphidation) ភ្ជាប់ជាមួយ Porphyry និង Diatreme",
            captionEn: "Figure 15: Conceptual model of high-sulphidation and low-sulphidation epithermal gold-silver systems linked to porphyry stocks",
          },
          {
            url: "/images/mineral-deposits/kh_location.jpg",
            captionKm: "រូបភាពទី ១៦៖ ទីតាំងអាជ្ញាបណ្ណរុករករ៉ែខ្វាវ (Khvav) ក្នុងខ្សែក្រវាត់ Loei-Khvav Arc ខេត្តកំពង់ធំ",
            captionEn: "Figure 16: Regional setting of the Khvav copper-gold project within the Loei-Khvav Arc, central Cambodia",
          },
          {
            url: "/images/mineral-deposits/kh_cliff_photo.jpg",
            captionKm: "រូបភាពទី ១៧៖ ជញ្ជាំងថ្មចោទ Vuggy Silica និងបំរែបំរួល Silicification នៅតំបន់ខ្វាវ",
            captionEn: "Figure 17: Prominent silicified cliff with intense vuggy silica alteration, diagnostic of an epithermal lithocap at Khvav",
          },
          {
            url: "/images/mineral-deposits/kh_swir.jpg",
            captionKm: "រូបភាពទី ១៨៖ ផែនទីវិភាគវិសាលគមផ្កាយរណប SWIR បង្ហាញប្រព័ន្ធបំរែបំរួលកម្ដៅទឹកទំហំជាង ២០០ គ.ម² នៅខ្វាវ",
            captionEn: "Figure 18: SWIR satellite imagery mapping over 200 km² of advanced argillic and phyllic alteration at Khvav",
          },
          {
            url: "/images/mineral-deposits/kh_gravity.jpg",
            captionKm: "រូបភាពទី ១៩៖ ផែនទីទំនាញដី Bouguer Gravity Anomaly នៅតំបន់រុករកខ្វាវ",
            captionEn: "Figure 19: Bouguer gravity anomaly map over the Khvav project area, showing regional structural controls",
          },
        ],
      },
      {
        titleKm: "៦. រ៉ែ Skarn និងរ៉ែដែកម៉ាក់ម៉ា-អ៊ីដ្រូទែម៉ាល់ (Skarn & Magmatic-Hydrothermal Iron Deposits)",
        titleEn: "6. Skarn and Magmatic-Hydrothermal Iron Deposits: Phnom Daek and Rovieng Cheung Dome",
        bodyKm: [
          "រ៉ែស្កាន (Skarn) និងរ៉ែដែកកម្ពុជាកើតចេញពីប្រតិកម្មប៉ះផ្ទាល់រវាងម៉ាក់ម៉ាក្រាណូឌីអូរីត និងសិលាកាបូណាតសម័យពែមៀន (Calcic and magnesian skarns) ព្រមទាំងប្រព័ន្ធរ៉ែដែក-ទង់ដែង-មាសម៉ាក់ម៉ា-អ៊ីដ្រូទែម៉ាល់ (IOCG affinities)៖",
          "១. ជម្រករ៉ែដែកភ្នំដែក (Phnom Daek Iron Deposit, ស្រុករវៀង)៖ ជាអណ្តូងរ៉ែប្រវត្តិសាស្ត្រដែលផ្គត់ផ្គង់ដែកសម្រាប់កសាងប្រាសាទអង្គរវត្ត។ រ៉ែដែកកើតឡើងជា contact metasomatic skarn រវាងសិលាក្រាណូឌីអូរីតទ្រីយ៉ាស៊ីក និងថ្មកំបោរពែមៀន។ រ៉ែចម្បងគឺ Magnetite និង Hematite មានកម្រិតជាតិដែកខ្ពស់ពី ៥០% ដល់ ៦៥% Fe ទុនបម្រុងប៉ាន់ស្មាន ៥ ដល់ ៦ លានតោន។",
          "២. ដែនដូមរវៀងជើង និងជម្រករ៉ែយ៉ូយេ (Rovieng Cheung Dome & Gyoye Iron Deposit)៖ ការអង្កេតម៉ាញ៉េទិចដី និងការវាស់ស្ទង់ម៉ាញ៉េទិចកម្ពស់ទាបតាមដ្រូន (Low-altitude high-precision magnetic surveys, Niu et al., 2022) បានកំណត់ឃើញភាពមិនប្រក្រតីម៉ាញ៉េទិចខ្លាំង (Magnetic anomalies) លើគោលដៅ A-1 ដល់ A-4។ នៅជម្រកយ៉ូយេ សាកសពរ៉ែ magnetite ត្រូវបានបញ្ជាក់នៅក្នុងស្កាន និង diorite porphyry ក្រោមស្រទាប់ល្បាប់ស្តើងនៃសម័យក្វាទែណារី។",
        ],
        bodyEn: [
          "Cambodia's skarn and iron systems formed via contact metasomatic replacement between calc-alkaline intrusions and Permian carbonate strata, with localized transitions into Iron Oxide-Copper-Gold (IOCG) magmatic-hydrothermal systems:",
          "1. Phnom Daek Iron Skarn (Rovieng District, Preah Vihear): Cambodia's premier historical metallurgical source, having supplied high-grade iron ore for the Angkorian Empire. Metasomatic replacement between Triassic granodiorite and Permian limestone produced massive magnetite-hematite bodies grading 50–65% Fe with historic resource estimates of 5–6 million metric tonnes.",
          "2. Rovieng Cheung Dome & Gyoye Iron Prospect: High-precision low-altitude drone aeromagnetic and ground magnetic surveys (Niu et al., 2022) revealed intense magnetic anomalies across first-order prediction targets A-1 through A-4. At the Gyoye deposit, drilling and trenching verified blind magnetite bodies within skarn and diorite porphyry beneath thin Quaternary cover.",
        ],
        images: [
          {
            url: "/images/mineral-deposits/pub_skarn_types.jpg",
            captionKm: "រូបភាពទី ២០៖ គំរូគោលគំនិតនៃការកកើតរ៉ែ Skarn តាមប្រភេទសិលាកំណើត៖ Calcic Skarn ក្នុងថ្មកំបោរ និង Magnesian Skarn ក្នុងដូឡូមីត",
            captionEn: "Figure 20: Conceptual model of calcic skarn (limestone) and magnesian skarn (dolomite) showing endoskarn and exoskarn zones",
          },
          {
            url: "/images/mineral-deposits/pub_porph_epi_skarn.jpg",
            captionKm: "រូបភាពទី ២១៖ ប្រព័ន្ធរួមបញ្ចូលគ្នារវាង Porphyry, Epithermal និង Skarn (Proximal Cu-Au skarn និង Distal Zn-Pb skarn)",
            captionEn: "Figure 21: Integrated porphyry-epithermal-skarn system showing proximal Cu-Au skarns and distal Pb-Zn-Ag zones",
          },
          {
            url: "/images/mineral-deposits/pub_iocg.jpg",
            captionKm: "រូបភាពទី ២២៖ គំរូប្រព័ន្ធរ៉ែដែកម៉ាក់ម៉ា-អ៊ីដ្រូទែម៉ាល់ IOCG (Iron Oxide-Copper-Gold) អមដោយប្រព័ន្ធ Porphyry",
            captionEn: "Figure 22: Magmatic-hydrothermal IOCG system alongside a porphyry stock showing sodic-calcic and magnetite alteration",
          },
          {
            url: "/images/mineral-deposits/mag_geology.jpg",
            captionKm: "រូបភាពទី ២៣៖ ផែនទីភូគព្ភសាស្ត្រតំបន់ដូមរវៀងជើង បង្ហាញទីតាំងរ៉ែដែក និងផ្ទៃអង្កេតម៉ាញ៉េទិចកម្ពស់ទាប (Niu et al., 2022)",
            captionEn: "Figure 23: Geological map of Rovieng Cheung dome area showing iron deposits and low-altitude aeromagnetic survey area (Niu et al., 2022)",
          },
          {
            url: "/images/mineral-deposits/mag_compare.jpg",
            captionKm: "រូបភាពទី ២៤៖ ការប្រៀបធៀបផែនទីម៉ាញ៉េទិចដី និងម៉ាញ៉េទិចកម្ពស់ទាបនៅជម្រករ៉ែយ៉ូយេ ជាមួយបន្ទាត់កាត់ A-B បង្ហាញសាកសពរ៉ែ Magnetite (Niu et al., 2022)",
            captionEn: "Figure 24: Gyoye iron deposit: ground magnetic map (left), low-altitude magnetic map (right), and geological cross-section (Niu et al., 2022)",
          },
          {
            url: "/images/mineral-deposits/mag_targets.jpg",
            captionKm: "រូបភាពទី ២៥៖ ភាពមិនប្រក្រតីម៉ាញ៉េទិចលើគោលដៅរ៉ែដែកថ្នាក់ទីមួយ A-1 ដល់ A-4 នៅរវៀងជើង (Niu et al., 2022)",
            captionEn: "Figure 25: Aeromagnetic anomalies over the four primary exploration targets A-1 to A-4 at Rovieng Cheung (Niu et al., 2022)",
          },
        ],
      },
      {
        titleKm: "៧. រ៉ែអាកាសធាតុ កម្រាលបុកស៊ីត និងក្រូមីតអ៊ុលត្រាម៉ាហ្វិក (Weathering, Residual Bauxite & Ultramafic Chromite)",
        titleEn: "7. Weathering Profiles, Plateau Bauxite, and Ultramafic Chromite: Mondulkiri & Phnum Kri",
        bodyKm: [
          "អាកាសធាតុត្រូពិចក្តៅសើមបានជំរុញឱ្យមានការពុកផុយតាមបែបគីមីយ៉ាងជ្រៅ បង្កើតបានជម្រករ៉ែសំណល់ដ៏មានតម្លៃ៖",
          "១. កម្រាលរ៉ែបុកស៊ីតខ្ពង់រាបមណ្ឌលគិរី (Lateritic Bauxite)៖ ការពុកផុយយ៉ាងខ្លាំងលើថ្មបាសាល់សម័យសេណូសូអ៊ិកនៅតំបន់ហាវឆ្លង (Haut Chhlong), បរកែវ, និងឆែប បានបង្កើតស្រទាប់ដីឡាតេរីតសម្បូរបុកស៊ីតកម្រាស់ ៣ ដល់ ១០ ម៉ែត្រ។ រ៉ែនេះសម្បូរដោយសារធាតុជីបស៊ីត (Gibbsite: Al₂O₃ ៤០–៥០%) និងមានកម្រិតស៊ីលីកាប្រតិកម្មទាប បង្កើតជាទុនបម្រុងរ៉ែអាលុយមីញ៉ូមរាប់រយលានតោន។",
          "២. ជម្រករ៉ែក្រូមីតភ្នំគ្រី (Phnum Kri Ultramafic Chromite, ខេត្តពោធិ៍សាត់)៖ ជាជម្រករ៉ែក្រូមីតប្រភេទ Podiform ក្នុងសិលាជ្រៀតចូលអ៊ុលត្រាម៉ាហ្វិកស៊ែប៉ង់ទីនីត (Serpentinised ultramafic complex)។ ការវាស់ស្ទង់ទំនាញដីលម្អិតចំនួន ២៥ ខ្សែ (Detailed Bouguer gravity profiles) និងការបង្កើតគំរូរំញ័រ 3D Inversion (Dinh et al., 2023) បានកំណត់ឃើញកម្រាស់ និងជម្រៅនៃស្រទាប់រ៉ែក្រូមីតនៅក្រោមដីស្របគ្នានឹងកំណកផ្ទៃដីទាំង ៧ កន្លែង (OP1-OP7)។",
        ],
        bodyEn: [
          "Prolonged tropical weathering and specialized mantle tectonics generated significant residual and ultramafic-hosted mineral resources:",
          "1. High-Plateau Lateritic Bauxite (Mondulkiri & Haut Chhlong): Deep chemical weathering of Cenozoic intraplate basalts produced extensive residual bauxite blankets spanning 3 to 10 m in thickness across Haut Chhlong, Bor Kham, and Chhep. Dominated by high-grade gibbsite (40–50% Al₂O₃) with low reactive silica (<3–5%), these deposits constitute a regionally strategic alumina resource estimated in hundreds of millions of metric tonnes.",
          "2. Phnum Kri Podiform Chromite (Pursat Province): Hosted within a serpentinised ultramafic intrusive complex enclosed by Devonian-Carboniferous metasediments. A detailed 25-profile Bouguer gravity survey combined with 3D gravity inversion modeling (Dinh et al., 2023) mapped the subterranean geometry and upper-surface depth of the dense chromite horizon, successfully calibrating with seven verified surface outcrop clusters (OP1–OP7).",
        ],
        images: [
          {
            url: "/images/mineral-deposits/pub_bif_supergene.jpg",
            captionKm: "រូបភាពទី ២៦៖ គំរូគោលគំនិតនៃការប្រមូលផ្តុំរ៉ែ Supergene Enrichment និងកម្រាលដីឡាតេរីត Goethite Crust",
            captionEn: "Figure 26: Conceptual model of supergene enrichment and weathering crust development in lateritic profiles",
          },
          {
            url: "/images/mineral-deposits/pub_chromite.jpg",
            captionKm: "រូបភាពទី ២៧៖ គំរូគោលគំនិតនៃការកកើតរ៉ែក្រូមីត Podiform Chromite ក្នុងសិលា Dunite នៃស្រទាប់ម៉ង់តូ Magmatic-Arc",
            captionEn: "Figure 27: Conceptual model of podiform chromite in dunite lenses within an arc mantle section above a subduction zone",
          },
          {
            url: "/images/mineral-deposits/grav_bouguer.jpg",
            captionKm: "រូបភាពទី ២៨៖ ផែនទីទំនាញដី Bouguer Gravity Anomaly នៅភ្នំគ្រី (ពោធិ៍សាត់) បង្ហាញខ្សែវាស់ L1-L25 និងកំណករ៉ែក្រូមីត OP1-OP7 (Dinh et al., 2023)",
            captionEn: "Figure 28: Phnum Kri: Bouguer gravity anomaly with 25 profiles and seven chromite outcrops OP1-OP7 (Dinh et al., 2023)",
          },
          {
            url: "/images/mineral-deposits/grav_upper.jpg",
            captionKm: "រូបភាពទី ២៩៖ គំរូ 3D Inversion បង្ហាញជម្រៅផ្ទៃខាងលើនៃស្រទាប់រ៉ែក្រូមីតនៅភ្នំគ្រី (Dinh et al., 2023)",
            captionEn: "Figure 29: Phnum Kri: 3D inversion-derived depth model for the upper surface of the chromite ore body (Dinh et al., 2023)",
          },
        ],
      },
      {
        titleKm: "៨. រ៉ែផូស្វាតកាស្ទក្នុងរូងភ្នំកំបោរ (Karst Phosphate Deposits: Kampot & Battambang)",
        titleEn: "8. Karst Phosphate Deposits: Kampot and Battambang Districts",
        bodyKm: [
          "ជម្រករ៉ែផូស្វាតនៅកម្ពុជាកកើតឡើងនៅក្នុងរូងភ្នំ និងតំបន់កាស្ទនៃភ្នំថ្មកំបោរសម័យពែមៀន (Permian tower karst limestones) ក្នុងខេត្តកំពត (ភ្នំទទឹង) និងខេត្តបាត់ដំបង (ភ្នំបន្ទាយនាង)។",
          "យន្តការកកើតកើតឡើងដោយសារទឹកភ្លៀងជ្រាបតាមលាមកសត្វប្រចៀវ (Bat guano leaching) ក្នុងរូងភ្នំ បញ្ចេញអាស៊ីតផូស្វ័រិក (Phosphoric acid) ទៅមានប្រតិកម្មគីមីជាមួយសិលាកំបោរ CaCO₃ បង្កើតបានជាដីផូស្វាត (Phosphatic earth) និងកម្រាលរ៉ែផូស្វរីត (Phosphorite crusts)។ រ៉ែនេះត្រូវបានទាញយក និងកិនធ្វើជាជីផូស្វាតធម្មជាតិដ៏មានតម្លៃសម្រាប់វិស័យកសិកម្ម។",
        ],
        bodyEn: [
          "Cambodia's sedimentary phosphate resources occur within karst cavities, cave fills, and weathering fissures developed atop Permian tower limestone massifs in Kampot Province (e.g., Phnom Totung) and Battambang Province (Phnom Ban Teay Neang).",
          "The genetic mechanism involves meteoric leaching of ancient bat guano accumulations within cave networks, releasing acidic phosphate-rich solutions that metasomatically replace underlying calcium carbonate (CaCO₃) host rocks, precipitating phosphatic earth and microcrystalline phosphorite crusts. These deposits are quarried for direct-application agricultural fertilizer.",
        ],
        images: [
          {
            url: "/images/mineral-deposits/atlas_phos_section.jpg",
            captionKm: "រូបភាពទី ៣០៖ បន្ទាត់កាត់ទទឹងភូគព្ភសាស្ត្រនៃជម្រករ៉ែផូស្វាតភ្នំបន្ទាយនាង បង្ហាញស្រទាប់ដីផូស្វាតក្នុងថ្មកំបោរ (ESCAP, 1993)",
            captionEn: "Figure 30: Phnom Ban Teay Neang: geological cross-section through phosphate deposit showing phosphatic earth in limestone (ESCAP, 1993)",
          },
          {
            url: "/images/mineral-deposits/atlas_kampot.jpg",
            captionKm: "រូបភាពទី ៣១៖ ផែនទីភូគព្ភសាស្ត្រនៃតំបន់រ៉ែផូស្វាតក្នុងខេត្តកំពត (ESCAP, 1993)",
            captionEn: "Figure 31: Geological map of the Kampot province phosphate district showing Permian karst hills (ESCAP, 1993)",
          },
        ],
      },
      {
        titleKm: "៩. រ៉ែមាស Placer និងត្បូងកណ្ដៀង ទទឹម ស៊ីកូន (Alluvial Gold Placers & Gemfield Terrains)",
        titleEn: "9. Alluvial Gold Placers and World-Renowned Gemfields: Pailin and Ratanakiri",
        bodyKm: [
          "១. ជម្រករ៉ែមាស Placer (Alluvial & Eluvial Gold)៖ ការហូរច្រោះសរសៃរ៉ែខ្វាត-មាសតាមធម្មជាតិបាននាំគ្រាប់មាសធ្លាក់ចូលទៅក្នុងស្រទាប់ដីឡាតេរីត ដីជ្រោះ និងស្រទាប់ក្រួសបាតស្ទឹង (Alluvial placers) នៅភ្នំជី (ក្រចេះ/កំពង់ធំ), សំឡូត, និងរតនគិរី។",
          "២. ត្បូងកណ្ដៀង និងទទឹមប៉ៃលិន (Pailin & Samlot Sapphire and Ruby)៖ គ្រីស្តាល់ខូរុនដូម (Corundum: Al₂O₃) ទាំងនេះជាគ្រីស្តាល់ចម្លែក (Xenocrysts) កើតចេញពីជម្រៅជ្រៅក្នុងស្រទាប់ម៉ង់តូ ដែលត្រូវបាននាំឡើងមកដោយបន្ទុះភ្នំភ្លើងបាសាល់អាល់កាឡាំងសម័យចុងសេណូសូអ៊ិក។ ក្រោយមក ដំណើរការហូរច្រោះបានប្រមូលផ្តុំគ្រាប់ត្បូងក្នុងស្រទាប់ក្រួសបាតស្ទឹងប៉ៃលិន។",
          "៣. ត្បូងស៊ីកូនរតនគិរី (Ratanakiri Gem Zircon)៖ ស្ថិតក្នុងស្រុកបរកែវ និងលំផាត់ គ្រីស្តាល់ស៊ីកូន (ZrSiO₄) ថ្លាគុណភាពខ្ពស់ ត្រូវបានទាញយកពីដីល្បាប់បាសាល់ ហើយនៅពេលយកទៅដុតកម្តៅតាមបច្ចេកទេសប្រពៃណី (៩០០–១០០០°C) វាប្រែពណ៌ទៅជាពណ៌ខៀវស្រស់ (Electric Blue) ដ៏ល្បីល្បាញលើពិភពលោក។",
        ],
        bodyEn: [
          "1. Placer and Residual Gold Systems: Prolonged weathering of primary auriferous quartz veins liberated native gold into eluvial, colluvial, and active fluvial gravel gravel terraces across Phnom Chi (Kratie/Kampong Thom), Samlot, and northern Ratanakiri, sustaining generations of artisanal placer extraction.",
          "2. Pailin and Samlot Sapphire and Ruby Fields: World-renowned gem corundum (Al₂O₃) occurs not as primary basalt phenocrysts, but as mantle-derived xenocrysts transported rapidly to the surface by Late Cenozoic alkali basalt volcanism. Fluvial reconcentration into basal gravel horizons formed the rich Pailin placer gem fields.",
          "3. Ratanakiri Gem Zircon Placers: High-clarity zircon (ZrSiO₄) megacrysts weathered from alkaline basalt plateaus in Bokeo and Lumphat districts produce Cambodia's legendary gem zircons, which transform upon traditional charcoal thermal annealing (900–1,000°C) into vivid electric blue gems highly prized in the international gem trade.",
        ],
        images: [
          {
            url: "/images/mineral-deposits/pub_placer_laterite_gold.jpg",
            captionKm: "រូបភាពទី ៣២៖ គំរូគោលគំនិតនៃការហូរច្រោះរ៉ែមាសពីសរសៃខ្វាតចូលទៅក្នុងកម្រាលឡាតេរីត និងស្រទាប់ល្បាប់ស្ទឹង (Dr. M. Priester)",
            captionEn: "Figure 32: Conceptual model illustrating shedding of gold from primary quartz veins into laterite, colluvium, and alluvial placers",
          },
          {
            url: "/images/mineral-deposits/atlas_gems.jpg",
            captionKm: "រូបភាពទី ៣៣៖ ការចែកចាយនៃសិលាបាសាល់ និងទីតាំងត្បូងទទឹម កណ្ដៀង និងស៊ីកូននៅឥណ្ឌូចិនភាគខាងត្បូង (ESCAP, 1993)",
            captionEn: "Figure 33: Occurrences of intraplate basalt and ruby, sapphire and zircon gemfields in southern Indochina (ESCAP, 1993)",
          },
          {
            url: "/images/mineral-deposits/atlas_pailin.jpg",
            captionKm: "រូបភាពទី ៣៤៖ ផែនទីភូគព្ភសាស្ត្រនៃដែនត្បូងប៉ៃលិន បង្ហាញថ្មបាសាល់ និងស្រទាប់ដីត្បូង (ESCAP, 1993)",
            captionEn: "Figure 34: Geological map of the Pailin gemfield showing Cenozoic basalt plugs and gem-bearing alluvial gravels (ESCAP, 1993)",
          },
        ],
      },
      {
        titleKm: "១០. រ៉ែដីល្បាប់ និងរ៉ែឧស្សាហកម្ម (Sedimentary & Industrial Minerals)",
        titleEn: "10. Sedimentary and Industrial Minerals: Limestone, Silica Sand, and Energy Clays",
        bodyKm: [
          "ក្រៅពីលោហៈមានតម្លៃ និងត្បូងធម្មជាតិ កម្ពុជាមានធនធានរ៉ែឧស្សាហកម្មទ្រង់ទ្រាយធំដែលជាឆ្អឹងខ្នងនៃសេដ្ឋកិច្ចសំណង់ជាតិ៖",
          "១. ថ្មកំបោរឧស្សាហកម្មស៊ីម៉ងត៍ (Industrial Limestone, CaCO₃)៖ សិលាកំបោរសម័យពែមៀននៅខេត្តកំពត និងបាត់ដំបង មានកម្រិតជាតិកាល់ស្យូមខ្ពស់ និងម៉ាញ៉េស្យូមទាប ស័ក្តិសមឥតខ្ចោះសម្រាប់ការផលិតស៊ីម៉ងត៍ Portland។ បច្ចុប្បន្ន រោងចក្រស៊ីម៉ងត៍ធំៗចំនួន ៥ កំពុងដំណើរការផលិតជាមួយសមត្ថភាពសរុបជាង ៨ លានតោន/ឆ្នាំ។",
          "២. ខ្សាច់ស៊ីលីកាសមុទ្រ (High-Purity Marine Silica Sand, SiO₂)៖ តាមឆ្នេរសមុទ្រខេត្តព្រះសីហនុ និងកោះកុង មានកម្រិត SiO₂ ខ្ពស់លើសពី ៩៨–៩៩% ប្រើប្រាស់សម្រាប់ឧស្សាហកម្មកញ្ចក់ បន្ទះសូឡា និងសម្ភារៈសំណង់ទំនើប។",
          "៣. ដីឥដ្ឋកាអូលីន និងធ្យូងថ្ម (Kaolin Clays & Sub-Bituminous Coal)៖ ប្រភពដីឥដ្ឋកាអូលីនគុណភាពខ្ពស់ផ្គត់ផ្គង់រោងចក្រក្បឿង និងកុលាលភាជន៍ ព្រមទាំងអាងធ្យូងថ្មសេណូសូអ៊ិកនៅភាគខាងជើង។",
        ],
        bodyEn: [
          "Beyond precious and base metals, Cambodia's industrial and sedimentary mineral assets underpin national infrastructure and manufacturing expansion:",
          "1. High-Purity Industrial Limestone (CaCO₃): Permian platform carbonate formations in Kampot and Battambang feature exceptionally high calcium purity (>52–54% CaO) and negligible MgO, serving five state-of-the-art domestic Portland cement plants with a combined operating capacity exceeding 8 million metric tonnes per annum.",
          "2. Marine Silica Sand (High-Purity SiO₂): Coastal and nearshore shelf quartz sand deposits along Preah Sihanouk and Koh Kong provinces consistently assay >98–99% SiO₂, supplying solar photovoltaic glass manufacturing and high-spec industrial aggregates.",
          "3. Industrial Ceramic Clays and Coal: Extensive kaolin reserves support regional ceramic and tile production, accompanied by Cenozoic lignite and sub-bituminous coal basins in northern provinces.",
        ],
      },
      {
        titleKm: "១១. លក្ខណៈសិលាសាស្ត្រ គីមីវិទ្យានៃធាតុដាន និងភាពអំណោយផលនៃម៉ាក់ម៉ា (Plutonic Petrography, Zircon Fertility & Geochronology)",
        titleEn: "11. Plutonic Petrography, Zircon Trace Element Fertility, and Geochronology",
        bodyKm: [
          "ការវិភាគសិលាស្តើង (Petrographic Thin Sections) និងគីមីវិទ្យានៃធាតុដាន (Trace Element Geochemistry) បញ្ជាក់ថាសិលាអគ្នីនៅភ្នំស្រង់ាំ និងហាឡូ មានលក្ខណៈជាសិលាអគ្នីកាល់-អាល់កាឡាំង ប្រភេទ I-type និង S-type (Calc-alkaline metaluminous to weakly peraluminous granitoids)។",
          "ការវិភាគសមាសធាតុគីមីក្នុងគ្រាប់ស៊ីកូន (Zircon Trace Element Geochemistry) លើគំនូសតាងសមាមាត្រ 10,000 × (Eu/Eu*)/Y ធៀបនឹង (Ce/Nd)/Y និង Eu/Eu* ធៀបនឹង Dy/Yb បង្ហាញថាសំណាកភាគច្រើនធ្លាក់ចូលទៅក្នុងតំបន់ 'Prospective Fertile Magma'។ នេះបញ្ជាក់ថាម៉ាក់ម៉ាមានកម្រិតអុកស៊ីតកម្មខ្ពស់ (Highly oxidized) និងសម្បូរដោយជាតិទឹក (Water-rich hydrous melts) ដែលជាកត្តាស្នូលក្នុងការរំលាយ និងប្រមូលផ្តុំលោហៈស្ពាន់ (Cu) មាស (Au) និងម៉ូលីបដែន (Mo) ពីជម្រៅផែនដី។",
        ],
        bodyEn: [
          "Petrographic and whole-rock geochemical analyses demonstrate that intrusive suites at Phnom Sro Ngam and Halo belong to medium- to high-K calc-alkaline I-type and transitional S-type series, diagnostic of subduction-related continental arc magmatism.",
          "Zircon trace element fertility discrimination diagrams—including 10,000 × (Eu/Eu*)/Y versus (Ce/Nd)/Y and Eu/Eu* versus Dy/Yb—confirm that zircon populations plot decisively within the 'Prospective' porphyry copper fertility envelope. Parent magmas were exceptionally oxidized (high fO₂) and volatile-rich, establishing verified fertile roots for economic porphyry Cu-Au-Mo and epithermal systems across Cambodia.",
        ],
        images: [
          {
            url: "/images/mineral-deposits/figure-03-plutonic-petrography.png",
            captionKm: "រូបភាពទី ៣៥៖ រូបថតសំណាកសិលា និងមីក្រូទស្សន៍សិលាស្តើងនៃសិលាក្រានីត និងក្រាណូឌីអូរីតនៅទីតាំងរ៉ែហាឡូ (Seang et al., 2026)",
            captionEn: "Figure 35: Photographs and photomicrographs showing lithological and alteration characteristics of Halo plutonic rocks (Seang et al., 2026)",
          },
          {
            url: "/images/mineral-deposits/figure-04-porphyry-fertility.png",
            captionKm: "រូបភាពទី ៣៦៖ គំនូសតាង Zircon Trace Element បញ្ជាក់ពីភាពអំណោយផលនៃម៉ាក់ម៉ាក្នុងការកកើតរ៉ែ Porphyry Copper (Seang et al., 2026)",
            captionEn: "Figure 36: Zircon trace element geochemistry fertility plots confirming hydrous, oxidized fertile magma for porphyry Cu-Au-Mo deposits (Seang et al., 2026)",
          },
        ],
      },
      {
        titleKm: "១២. ក្រមប្រតិបត្តិការរ៉ែ អភិបាលកិច្ចបរិស្ថាន និងឯកសារយោងវិទ្យាសាស្ត្រ (Governance, Environmental Ethics & Sources)",
        titleEn: "12. Responsible Mining Governance, Environmental Protocols, and References",
        bodyKm: [
          "ការអភិវឌ្ឍវិស័យរ៉ែនៅកម្ពុជាទាមទារនូវតុល្យភាពរវាងផលប្រយោជន៍សេដ្ឋកិច្ចជាតិ និងការការពារបរិស្ថានប្រកបដោយចីរភាព៖",
          "១. ក្រមគ្រប់គ្រងសំណល់រ៉ែស្ងួត (Dry-Stack Tailings)៖ អនុវត្តដូចជានៅអណ្តូងរ៉ែមាសអុកវាវ ដើម្បីលុបបំបាត់ហានិភ័យបាក់ទំនប់ និងការពារធនធានទឹកក្រោមដី។",
          "២. ការស្តារបរិស្ថានឡើងវិញ (Mine Rehabilitation & Progressive Closure)៖ រៀបចំផែនការដាំកូនឈើ និងស្តារជីវចម្រុះឡើងវិញក្នុងអំឡុងពេលធ្វើអាជីវកម្ម។",
          "៣. តម្លាភាព និងការអនុវត្តច្បាប់រ៉ែ (Mining Cadastre & Transparency)៖ ពង្រឹងការគ្រប់គ្រងអាជ្ញាបណ្ណ និងការបង់សួយសាររ៉ែស្របតាមច្បាប់ស្តីពីការគ្រប់គ្រង និងការធ្វើអាជីវកម្មធនធានរ៉ែ។",
        ],
        bodyEn: [
          "Sustainable modernization of Cambodia's mining sector demands rigorous environmental stewardship and transparent regulatory governance:",
          "1. Filtered Dry-Stack Tailings: Pioneered at the Okvau operation, replacing wet tailings dams with dewatered, engineered dry stacks to mitigate catastrophic breach hazards and protect groundwater tables.",
          "2. Progressive Environmental Rehabilitation: Establishing concurrent revegetation, slope stabilization, and mine closure bonds throughout the operational life of mine.",
          "3. Transparent Cadastre and Fiscal Governance: Ensuring strict adherence to the Law on Mineral Resources Management and Exploitation, international reporting standards (JORC Code), and equitable royalty distribution.",
        ],
      },
    ],
    relatedPaperIds: ["tectonics-sio-2023", "local-1c12576736bd", "web12"],
    keyHighlightsKm: [
      "ប្រទេសកម្ពុជាមានប្រភេទជម្រករ៉ែចម្បងៗចំនួន ៨ គ្រួសារធំៗ គ្របដណ្តប់ទាំងរ៉ែលោហៈ និងអលោហៈ",
      "អណ្តូងរ៉ែមាសអុកវាវ (Okvau RIRGS) គឺជាគំរូជោគជ័យនៃអាជីវកម្មរ៉ែមាសឧស្សាហកម្មស្តង់ដារអន្តរជាតិ (>1.14 Moz Au)",
      "ប្រព័ន្ធរ៉ែ Porphyry Cu-Au-Mo និង Epithermal នៅខ្វាវ និងហាឡូ បង្ហាញសំបកបំរែបំរួលកម្ដៅទឹកទំហំធំជាង ២០០ គ.ម²",
      "រ៉ែដែកស្កានភ្នំដែក និងដូមរវៀងជើង មានទុនបម្រុងរ៉ែដែក Magnetite គុណភាពខ្ពស់ ៥០–៦៥% Fe",
      "កម្រាលបុកស៊ីតមណ្ឌលគិរី (40–50% Al₂O₃) និងរ៉ែក្រូមីតភ្នំគ្រី ជាធនធានរ៉ែអាកាសធាតុ និងអ៊ុលត្រាម៉ាហ្វិកដ៏មានសក្ដានុពល",
      "ថ្មកំបោរឧស្សាហកម្មខេត្តកំពត និងបាត់ដំបង ផ្គត់ផ្គង់រោងចក្រស៊ីម៉ងត៍ជាតិ ៥ កន្លែង (>8 Mt/ឆ្នាំ)",
    ],
    keyHighlightsEn: [
      "Cambodia hosts 8 primary mineral deposit families across metallic, precious, and industrial sectors",
      "The flagship Okvau Reduced Intrusion-Related Gold System (RIRGS) operates with JORC reserves exceeding 1.14 Moz Au",
      "Porphyry-epithermal systems at Khvav and Halo reveal immense hydrothermal alteration footprints exceeding 200 km²",
      "Historic Phnom Daek and Rovieng Cheung skarns preserve high-grade magnetite-hematite deposits (50–65% Fe)",
      "Mondulkiri lateritic bauxite (40–50% Al₂O₃) and Phnum Kri ultramafic chromite represent high-priority residual targets",
      "Permian platform limestones in Kampot supply five major cement manufacturing plants (>8 Mt/year)",
    ],
    sources: [
      {
        id: "[R1]",
        text: "ESCAP. (1993). Atlas of Mineral Resources of the ESCAP Region, Volume 10: Cambodia, Explanatory Brochure. United Nations Economic and Social Commission for Asia and the Pacific, New York, 87 pp.",
      },
      {
        id: "[R2]",
        text: "Indochine Mining Limited. (2010). Prospectus: Initial Public Offering, including Independent Geological Report by Al Maynard & Associates, Sydney, 18 June 2010.",
      },
      {
        id: "[R3]",
        text: "Sokmeng, N., Kimhouy, O., Daravichet, H., et al. (2023). Geology and Mineralization at Okvau Gold Deposit, Keo Seima District, Mondulkiri Province, Cambodia. Techno-Science Research Journal, 11(2), 1-8.",
      },
      {
        id: "[R4]",
        text: "Niu, C., Zhang, X., Zhao, J., Ning, G., & Zhang, Z. (2022). Application of low-altitude high-precision magnetic survey for iron deposits in unproven areas: a case study of Rovieng Cheung dome in Cambodia. Geology and Resources, 31(1), 81-87.",
      },
      {
        id: "[R5]",
        text: "Dinh, T.C., Nam, H.P., Van, T.D., et al. (2023). Chromite ore modeling based on detailed gravity method in Pursat, Cambodia. In Nguyen, L.Q., et al. (eds), Advances in Geospatial Technology in Mining and Earth Sciences, Springer, pp. 259-275.",
        url: "https://doi.org/10.1007/978-3-031-34677-4_16",
      },
      {
        id: "[R6]",
        text: "Seang, D., Zaw, K., Makoundi, C., et al. (2026). Petrogenesis and magma fertility of Permian-Triassic plutonic rocks in the Halo and Phnom Sro Ngam prospects, Cambodia. Geological Journal, 1-28.",
        url: "https://doi.org/10.1002/gj.5120",
      },
      {
        id: "[R7]",
        text: "Zaw, K., Meffre, S., Lai, C.K., et al. (2014). Tectonics and metallogeny of mainland SE Asia—a review and synthesis. Gondwana Research, 26(1), 5-30.",
        url: "https://doi.org/10.1016/j.gr.2013.10.010",
      },
      {
        id: "[R8]",
        text: "Company Annual Exploration Report for the Phnom Sro Ngam exploration licence (September 2022 to August 2023). Submitted to the General Department of Mineral Resources (GDMR), Phnom Penh.",
      },
      {
        id: "[R9]",
        text: "Khvav Copper-Gold Project Investor Presentation: High-Sulfidation Epithermal & Porphyry Lithocap Geology, Kampong Thom Province, May 2023.",
      },
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
    titleKm: "ទិដ្ឋភាពទូទៅនៃគម្រោង៖ បណ្តាញស្ថានីយរញ្ជួយដីថ្មីរបស់កម្ពុជា និងការតាមដានគ្រោះរញ្ជួយដីជាតិ",
    titleEn: "Project Overview: Cambodia's New Seismometer Network & National Earthquake Monitoring",
    shortTitleKm: "បណ្តាញរញ្ជួយដី & គ្រោះភូគព្ភសាស្ត្រ",
    shortTitleEn: "Seismometer Network & Geohazards",
    image: "/images/geohazards/figure-18-network-geometric-coverage.png",
    imageAlt: "Geometric coverage and azimuthal gaps of Cambodia's five-station national seismic network",
    captionKm: "រូបភាពទី ១៨៖ ផ្ទៃគ្របដណ្តប់ធរណីមាត្រ និងគម្លាតមុំ (Azimuthal gaps) នៃបណ្តាញស្ថានីយរញ្ជួយដីជាតិទាំងប្រាំលើក្រឡាចត្រង្គ ២៥ គីឡូម៉ែត្រទូទាំងប្រទេសកម្ពុជា។",
    captionEn: "Figure 18. Geometric coverage and azimuthal gap distribution of the five-station national seismic network on a 25 km land grid across Cambodia.",
    leadKm: "ប្រទេសកម្ពុជានឹងមានបណ្តាញស្ថានីយរញ្ជួយដីជាតិផ្ទាល់ខ្លួននាពេលឆាប់ៗខាងមុខនេះ។ ស្ថានីយទំនើបចំនួន ៥ នៅខេត្តកំពង់ស្ពឺ រតនគិរី ព្រះសីហនុ សៀមរាប និងរាជធានីភ្នំពេញ នឹងត្រូវរៀបចំឡើងក្រោមកិច្ចសហការស្រាវជ្រាវរួមគ្នាដែលគាំទ្រថវិកាដោយទីភ្នាក់ងាររញ្ជួយដីខេត្តក្វាងទុង (GEA) និងអគ្គនាយកដ្ឋានធនធានរ៉ែ (GDMR) នៃក្រសួងរ៉ែ និងថាមពល។ បណ្តាញនេះបំពាក់ដោយឧបករណ៍វាស់រំញ័រ Broadband និង Accelerometers ដើម្បីកត់ត្រាការរញ្ជួយដីក្នុងស្រុក និងក្នុងតំបន់ ផ្តល់ទិន្នន័យចលនាដីជាក់ស្តែង និងពង្រឹងការត្រៀមបង្ការគ្រោះមហន្តរាយ។",
    leadEn: "Cambodia will soon establish its first dedicated national network of seismometer stations. Five modern stations in Kampong Speu, Ratanakiri, Preah Sihanouk, Siem Reap, and Phnom Penh are being installed through a joint research project funded by the Guangdong Earthquake Agency (GEA) in partnership with the General Department of Mineral Resources (GDMR). Once operational, the network will systematically record earthquakes across Cambodia and the wider Southeast Asian region, providing vital scientific data on seismic activity and ground motion.",
    stats: [
      { labelKm: "ចំនួនស្ថានីយគ្រោងទុក", labelEn: "Network Stations", value: "5 National Sites" },
      { labelKm: "ដៃគូសហការស្រាវជ្រាវ", labelEn: "Institutional Partners", value: "GDMR & GEA" },
      { labelKm: "កម្រិតរញ្ជួយដីតំបន់", labelEn: "Seismic Regime", value: "Low-to-Moderate Intraplate" },
      { labelKm: "កម្រិតហានិភ័យអតិបរមា", labelEn: "Max Baseline Hazard", value: "0.030 g PGA (Ratanakiri)" },
    ],
    keyHighlightsKm: [
      "ស្ថានីយយុទ្ធសាស្ត្រចំនួន ៥៖ ខេត្តកំពង់ស្ពឺ រតនគិរី (ក្រុងបានលុង) ព្រះសីហនុ សៀមរាប និងរាជធានីភ្នំពេញ។",
      "កិច្ចសហការស្រាវជ្រាវផ្លូវការរវាងអគ្គនាយកដ្ឋានធនធានរ៉ែ (GDMR) និងទីភ្នាក់ងាររញ្ជួយដីខេត្តក្វាងទុង (GEA)។",
      "ទីតាំងនៅមន្ទីររ៉ែ និងថាមពលខេត្ត ដោយអគារស្ថានីយនៅកំពង់ស្ពឺ និងរតនគិរីត្រូវបានសាងសង់រួចរាល់។",
      "លក្ខខណ្ឌភូគព្ភសាស្ត្រគ្រឹះ៖ ថ្មបាសាល់បានលុង និងថ្មខ្សាច់ក្រុងព្រះសីហនុផ្តល់គ្រឹះថ្មរឹងមាំ ខណៈកំពង់ស្ពឺ សៀមរាប និងភ្នំពេញស្ថិតលើល្បាប់ថ្មី។",
      "កម្រិតរញ្ជួយដីទាបទៅមធ្យម៖ ប្រភពបន្ទាត់រញ្ជួយដីធំៗស្ថិតនៅចម្ងាយលើសពី ១,១០០ គ.ម; មានតែបានលុងប៉ុណ្ណោះដែលមានព្រឹត្តិការណ៍ M≥3 ក្នុងរង្វង់ ៣០០ គ.ម (៥៧ លើក, ធំបំផុត M 5.1 ក្នុងខែកក្កដា ឆ្នាំ២០២៤)។",
      "គំរូគ្រោះថ្នាក់ GEM 2023.1 កំណត់តម្លៃ PGA ០.០៣០ g សម្រាប់រតនគិរី (រយៈពេល ៥០ ឆ្នាំ ឱកាសកើត ១០%); តម្លៃសូន្យនៅកន្លែងផ្សេងទៀតឆ្លុះបញ្ចាំងពីកម្រិតទិន្នន័យទូទៅ មិនមែនគ្មានហានិភ័យឡើយ។",
      "ការតភ្ជាប់តេឡេមេទ្រី & អាស៊ាន៖ ឧបករណ៍ Digitizer ២៤-bit ពេលវេលា GNSS បញ្ជូនទិន្នន័យផ្ទាល់មក GDMR, GEA, PHIVOLCS និងបណ្តាញថៃ (CHBT, UBPT)។",
    ],
    keyHighlightsEn: [
      "Five new national stations: Kampong Speu, Ratanakiri (Banlung), Preah Sihanouk, Siem Reap, and Phnom Penh.",
      "Joint research agreement between Cambodia's GDMR (Department of Geology and Minerals) and China's Guangdong Earthquake Agency (GEA).",
      "Hosted at Provincial Departments of Mines and Energy offices; station buildings in Kampong Speu and Ratanakiri are already in place.",
      "Subsurface ground conditions: Ratanakiri basalt and Preah Sihanouk sandstone provide firm rock; Kampong Speu, Siem Reap, and Phnom Penh sit on alluvium.",
      "Low-to-moderate seismicity: major active plate boundary faults lie >1,100 km away; only Banlung has recorded M≥3 events within 300 km (57 events; M 5.1 in July 2024).",
      "Global Earthquake Model (GEM 2023.1) hazard: Ratanakiri PGA 0.030 g (10% exceedance in 50 years); non-zero hazard is confirmed across all five sites.",
      "Telemetry & regional integration: broadband seismometers, accelerometers, 24-bit digitizers, GNSS timing, and links to GDMR, GEA, PHIVOLCS, and Thai stations.",
    ],
    sections: [
      {
        titleKm: "១. ទិដ្ឋភាពទូទៅនៃគម្រោង និងការរៀបចំស្ថានីយ (Project Overview & Station Layout)",
        titleEn: "1. Project Overview & Station Layout",
        bodyKm: [
          "ប្រទេសកម្ពុជានឹងមានបណ្តាញស្ថានីយរញ្ជួយដីជាតិផ្ទាល់ខ្លួននាពេលឆាប់ៗខាងមុខនេះ។ ស្ថានីយចំនួនប្រាំ រួមមាននៅខេត្តកំពង់ស្ពឺ រតនគិរី ព្រះសីហនុ សៀមរាប និងរាជធានីភ្នំពេញ នឹងត្រូវបានដំឡើងតាមរយៈគម្រោងស្រាវជ្រាវរួមគ្នាដែលឧបត្ថម្ភថវិកាដោយទីភ្នាក់ងាររញ្ជួយដីខេត្តក្វាងទុង (GEA)។ នៅពេលដំណើរការ ស្ថានីយទាំងនេះនឹងកត់ត្រាការរញ្ជួយដីនៅទូទាំងប្រទេសកម្ពុជា និងតំបន់ជុំវិញ ដែលផ្តល់ឱ្យប្រទេសជាតិនូវទិន្នន័យជាក់លាក់អំពីសកម្មភាពរញ្ជួយដី។",
          "បណ្តាញនេះជាគម្រោងស្រាវជ្រាវរួមគ្នារវាងអគ្គនាយកដ្ឋានធនធានរ៉ែ (GDMR) និងទីភ្នាក់ងាររញ្ជួយដីខេត្តក្វាងទុង (GEA) ក្រោមកិច្ចព្រមព្រៀងរវាងស្ថាប័នទាំងពីរ។ ទីភ្នាក់ងារ GEA នឹងផ្តល់ថវិកាសម្រាប់គម្រោង ខណៈដែលនាយកដ្ឋានភូគព្ភវិទ្យានៃ GDMR ទទួលបន្ទុកសម្របសម្រួលជាមួយមន្ទីររ៉ែ និងថាមពលខេត្ត និងដៃគូដទៃទៀត ដើម្បីដំឡើង និងដំណើរការស្ថានីយ។",
          "ស្ថានីយនីមួយៗនឹងត្រូវដាក់នៅមន្ទីររ៉ែ និងថាមពលខេត្ត ហើយអគារស្ថានីយនៅខេត្តកំពង់ស្ពឺ និងរតនគិរីត្រូវបានសាងសង់រួចរាល់ហើយ។ ដើម្បីរៀបចំបណ្តាញនេះ ក្រុមការងារបានសិក្សាកំណត់ត្រារញ្ជួយដីក្នុងតំបន់ ផែនទីភូគព្ភសាស្ត្រ និងប្លង់ទីតាំងទាំងប្រាំ។ តារាងទី ១ បង្ហាញពីទិដ្ឋភាពទូទៅនៃទីតាំងនីមួយៗ។",
        ],
        bodyEn: [
          "Cambodia will soon have its own national network of seismometer stations. Five stations, in Kampong Speu, Ratanakiri, Preah Sihanouk, Siem Reap and Phnom Penh, will be set up in the near future through a joint research project funded by the Guangdong Earthquake Agency (GEA). Once running, they will record earthquakes across Cambodia and the wider region, giving the country better information about seismic activity.",
          "The network is a joint research project between GDMR and GEA, under an Agreement between the two institutions. GEA will fund the project, while GDMR's Department of Geology and Minerals (DGM) will coordinate with the Provincial Departments of Mines and Energy and other partners to set up and run the stations.",
          "Each station will be hosted at a Provincial Department of Mines and Energy office. To prepare for the network, the team studied regional earthquake records, geological maps and the layout of the five sites. Table 1 gives a quick overview of each location.",
        ],
        table: {
          captionKm: "តារាងទី ១៖ ទិដ្ឋភាពទូទៅសង្ខេបនៃស្ថានីយរញ្ជួយដីទាំង ៥ របស់កម្ពុជា",
          captionEn: "Table 1. The five stations at a glance",
          headersKm: ["ទីតាំងស្ថានីយ", "ភូគព្ភសាស្ត្រគ្រឹះ", "រញ្ជួយដី USGS M≥3 (កាំ 300 / 500 គ.ម)", "GEM PGA (g)", "ឧបករណ៍វាស់ស្ទង់"],
          headersEn: ["Site", "Mapped geology", "USGS M≥3 events within 300 km / 500 km", "GEM PGA (g)", "Instruments"],
          rowsKm: [
            ["កំពង់ស្ពឺ (Kampong Speu)", "ដីល្បាប់ថ្មី (Recent alluvium)", "0 / 15", "0.000*", "Broadband seismometer + accelerometer"],
            ["រតនគិរី (Banlung)", "ថ្មបាសាល់ប្លីអូ-ក្វាទែណារី (Plio-Quaternary basalt)", "57 / 67", "0.030", "Broadband seismometer + accelerometer"],
            ["ព្រះសីហនុ (Preah Sihanouk)", "ថ្មខ្សាច់ជូរ៉ាសិក-ក្រេតាសសឺស (Jurassic–Cretaceous sandstone)", "0 / 7", "0.000*", "Broadband seismometer + accelerometer"],
            ["សៀមរាប (Siem Reap)", "ដីល្បាប់បឹង-ទន្លេថ្មី (Lacustrine-alluvial sediments)", "0 / 37", "0.000*", "Broadband seismometer + accelerometer"],
            ["ភ្នំពេញ (Phnom Penh)", "ដីល្បាប់ថ្មី (Recent alluvium)", "0 / 15", "0.000*", "Accelerometer (urban strong-motion)"],
          ],
          rowsEn: [
            ["Kampong Speu", "Recent alluvium", "0 / 15", "0.000*", "Broadband seismometer + accelerometer"],
            ["Ratanakiri (Banlung)", "Plio-Quaternary basalt", "57 / 67", "0.030", "Broadband seismometer + accelerometer"],
            ["Preah Sihanouk", "Jurassic–Cretaceous sandstone", "0 / 7", "0.000*", "Broadband seismometer + accelerometer"],
            ["Siem Reap", "Recent (lacustrine-alluvial) sediments", "0 / 37", "0.000*", "Broadband seismometer + accelerometer"],
            ["Phnom Penh", "Recent alluvium", "0 / 15", "0.000*", "Accelerometer (urban strong-motion)"],
          ],
          footnoteKm: "*តម្លៃសូន្យនៅក្នុងគំរូគ្រោះថ្នាក់មិនមានន័យថាគ្មានគ្រោះថ្នាក់នោះទេ ប៉ុន្តែឆ្លុះបញ្ចាំងពីទំហំកម្រិតក្រឡាទិន្នន័យធំនៃគំរូតំបន់។",
          footnoteEn: "*A zero value in the hazard model does not mean zero hazard; it reflects the coarse resolution of the regional model.",
        },
      },
      {
        titleKm: "២. សកម្មភាពរញ្ជួយដី និងបរិបទតិចតូនិកក្នុងតំបន់ (Regional Seismicity & Tectonics)",
        titleEn: "2. How active is the region?",
        bodyKm: [
          "ប្រទេសកម្ពុជាស្ថិតនៅក្នុងតំបន់ដែលស្ងប់ស្ងាត់គួរសមនៃតំបន់ស៊ុនដា/ឥណ្ឌូចិន។ ការរញ្ជួយដីធំៗភាគច្រើនកើតឡើងនៅជុំវិញគែមតំបន់៖ តាមបណ្តោយព្រំប្រទល់ប្លុក Sagaing ទៅទិសពាយព្យ និងតំបន់រអិលចូលគ្នានៅក្បែរកោះស៊ូម៉ាត្រា និងជ្វា។ បំណាក់សិលានៅខាងក្នុងតំបន់មានសកម្មភាពតិចតួចជាងឆ្ងាយ។ ការរញ្ជួយដីធំៗដែលត្រូវបានកត់ត្រាក្នុងប្រវត្តិសាស្ត្រតំបន់ (M 7.96 ក្នុងឆ្នាំ ១៩៤១, M 7.88 ក្នុងឆ្នាំ ១៩១២ និង M 7.70 ក្នុងឆ្នាំ ១៩៨៨) សុទ្ធតែកើតឡើងនៅចម្ងាយលើសពី ១,១០០ គីឡូម៉ែត្រពីទីតាំងស្ថានីយដែលបានគ្រោងទុក។",
          "នៅតំបន់ជិតខាង កាតាឡុក USGS បានកត់ត្រាការរញ្ជួយដីកម្រិត ៣ ឬខ្ពស់ជាងនេះចន្លោះពី ៧ លើក (ព្រះសីហនុ) ដល់ ៦៧ លើក (រតនគិរី) ក្នុងរង្វង់ ៥០០ គីឡូម៉ែត្រពីទីតាំងនីមួយៗ។ ព្រឹត្តិការណ៍ធំបំផុតនៅក្បែរនោះមានកម្រិតពី M 5.0 ដល់ 5.6 រួមទាំងការរញ្ជួយដីកម្រិត M 5.1 ក្នុងខែកក្កដា ឆ្នាំ ២០២៤ ចម្ងាយប្រហែល ១៧៧ គីឡូម៉ែត្រពីក្រុងបានលុង។ កំណត់ត្រាឧបករណ៍នៅមានរយៈពេលខ្លី និងមិនទាន់ពេញលេញ ប្រភេទកម្រិតរញ្ជួយដីមានការប្រែប្រួល ហើយកំណត់ត្រានៃការរញ្ជួយដីដែលប្រជាពលរដ្ឋមានអារម្មណ៍ដឹងនៅកម្ពុជាមិនទាន់ត្រូវបានចងក្រងចប់សព្វគ្រប់នៅឡើយ។ បំណាក់សិលាដែលបានកំណត់លើផែនទីនៅក្បែរទីតាំងស្ថានីយមិនទាន់ដឹងពីកម្រិតសកម្មភាពច្បាស់លាស់នៅឡើយទេ (រូបភាពទី ១)។",
        ],
        bodyEn: [
          "Cambodia sits in a relatively quiet part of the Sunda/Indochina region. Most large earthquakes happen around its edges: along the Sagaing plate boundary to the north-west and the subduction zones near Sumatra and Java. Faults inside the region are far less active. The biggest earthquakes on record for the wider region (M 7.96 in 1941, M 7.88 in 1912 and M 7.70 in 1988) all struck more than 1,100 km from the proposed sites.",
          "Closer to home, the USGS catalogue lists between 7 (Preah Sihanouk) and 67 (Ratanakiri) earthquakes of magnitude 3 or greater within 500 km of each site. The largest events nearby range from M 5.0 to 5.6, including an M 5.1 earthquake in July 2024 about 177 km from Banlung. The instrumental record is short and incomplete, magnitude types vary, and Cambodia's own records of felt earthquakes have yet to be compiled, so these estimates remain uncertain. Faults mapped near the sites have unknown activity and are not assumed to be active (Figure 1).",
        ],
        image: "/images/geohazards/figure-01-regional-seismicity.png",
        imageCaptionKm: "រូបភាពទី ១៖ ការរញ្ជួយដីកម្រិត ៣ ឬលើសពីនេះទូទាំងតំបន់ (USGS)។ សញ្ញាផ្កាយសម្គាល់ចំណុចតំណាងកណ្តាលទីក្រុង មិនមែនជាទីតាំងស្ថានីយចុងក្រោយឡើយ។ ប្រភេទកម្រិតរញ្ជួយដីមានលក្ខណៈចម្រុះ ហើយកំណត់ត្រាមិនទាន់ពេញលេញ។",
        imageCaptionEn: "Figure 1. Earthquakes of magnitude 3 or more across the region (USGS). Stars mark city-centre stand-in points, not final station locations. Magnitude types are mixed and the record is incomplete.",
      },
      {
        titleKm: "៣. ការវាយតម្លៃគ្រោះថ្នាក់រញ្ជួយដី (What is the seismic hazard?)",
        titleEn: "3. What is the seismic hazard?",
        bodyKm: [
          "យោងតាមគំរូរញ្ជួយដីសកល (GEM 2023.1) ខេត្តរតនគិរីមានកម្រិតបង្កើនល្បឿនដីអតិបរមាលើថ្មគោល (Peak Ground Acceleration - PGA) ០.០៣០ g (០.២៩៨ ម៉ែត្រ/វិនាទី²) ដោយមានឱកាស ១០% ដែលអាចលើសពីនេះក្នុងរយៈពេល ៥០ ឆ្នាំ (ប្រហាក់ប្រហែលនឹងវដ្តត្រឡប់ ៤៧៥ ឆ្នាំ)។ គំរូនេះបង្ហាញតម្លៃសូន្យនៅទីតាំងបួនផ្សេងទៀត ប៉ុន្តែនេះឆ្លុះបញ្ចាំងពីកម្រិតទំហំក្រឡាទិន្នន័យធំនៃគំរូតំបន់ មិនមែនជាអវត្តមាននៃគ្រោះថ្នាក់នោះទេ។",
          "តម្លៃទាំងនេះជាតម្លៃត្រួតពិនិត្យបឋម (screening values) មិនមែនជាតម្លៃសម្រាប់គណនាប្លង់សំណង់វិស្វកម្មឡើយ ហើយការកើនឡើងកម្លាំងរំញ័រដោយសារស្រទាប់ដីក្នុងតំបន់មិនទាន់ត្រូវបានវាយតម្លៃនៅឡើយទេ។ កម្រិតគ្រោះថ្នាក់ទាបមិនធ្វើឱ្យស្ថានីយទាំងនេះថយចុះតម្លៃនោះទេ៖ ស្ថានីយនៅតែអាចចាប់រលករញ្ជួយដីក្នុងតំបន់ និងពង្រឹងការគ្របដណ្តប់ទូទាំងប្រទេស (រូបភាពទី ២)។",
        ],
        bodyEn: [
          "According to the Global Earthquake Model (GEM 2023.1), Ratanakiri has a reference-rock peak ground acceleration (PGA) of 0.030 g (0.298 m/s²), with a 10% chance of being exceeded in 50 years (roughly a 475-year return period). The model shows zero at the other four sites, but that reflects the coarse resolution of the regional model, not an absence of hazard.",
          "These are screening values rather than design values, and local soil amplification has not yet been assessed. Low hazard doesn't make the stations any less valuable: they will still detect regional earthquakes and strengthen national coverage (Figure 2).",
        ],
        image: "/images/geohazards/figure-02-gem-pga.png",
        imageCaptionKm: "រូបភាពទី ២៖ កម្រិត PGA លើថ្មគោល GEM (ឱកាស ១០% ក្នុងរយៈពេល ៥០ ឆ្នាំ) នៅចំណុចតំណាងទីក្រុងនីមួយៗ។ តម្លៃសូន្យមិនមែនមានន័យថាគ្មានគ្រោះថ្នាក់ឡើយ។ ប្រភព៖ GEM, CC BY-NC-SA 4.0។",
        imageCaptionEn: "Figure 2. GEM reference-rock PGA (10% chance of exceedance in 50 years) at each city-centre stand-in point. Zero values do not indicate zero hazard. Source: GEM, CC BY-NC-SA 4.0.",
      },
      {
        titleKm: "៤. លក្ខណៈស្ថានីយ៖ ខេត្តកំពង់ស្ពឺ (Kampong Speu Station)",
        titleEn: "4. Meet the sites: Kampong Speu",
        bodyKm: [
          "ស្ថានីយខេត្តកំពង់ស្ពឺ (WGS84 / UTM Zone 48N: X = 448205, Y = 1267685; 11.4672° N, 104.5251° E) មានទីតាំងនៅមន្ទីររ៉ែ និងថាមពលខេត្ត លើដីល្បាប់ថ្មី (ដីល្បាយខ្សាច់ ដីឥដ្ឋ និងខ្សាច់នៃដីទួលទាប) នៅក្បែរជើងភ្នំក្រវាញ។",
          "បំណាក់សិលាដែលនៅជិតបំផុតលើផែនទី (មិនទាន់ដឹងកម្រិតសកម្មភាព) ស្ថិតនៅចម្ងាយប្រហែល ១២.៥ គីឡូម៉ែត្រ ហើយមិនមានការរញ្ជួយដីកម្រិត ៣ ឬខ្ពស់ជាងនេះត្រូវបានកត់ត្រាក្នុងរង្វង់ ៣០០ គីឡូម៉ែត្រឡើយ (មាន ១៥ លើកក្នុងរង្វង់ ៥០០ គីឡូម៉ែត្រ)។ ស្ថានីយនេះនឹងត្រូវបំពាក់ដោយ broadband seismometer និង accelerometer (រូបភាពទី ៣–៥)។",
        ],
        bodyEn: [
          "The Kampong Speu station (WGS84 / UTM Zone 48N: X = 448205, Y = 1267685; 11.4672° N, 104.5251° E) is located at the Provincial Department of Mines and Energy office, on recent alluvium (sandy loam, clay and sand of low terraces) near the Cardamom foothills.",
          "The nearest mapped fault (activity unknown) is about 12.5 km away, and no earthquakes of magnitude 3 or greater have been recorded within 300 km (15 events within 500 km). The station will be equipped with a broadband seismometer and an accelerometer (Figures 3–5).",
        ],
        images: [
          {
            url: "/images/geohazards/figure-03-kampong-speu-geology.png",
            captionKm: "រូបភាពទី ៣៖ ភូគព្ភសាស្ត្រខេត្តកំពង់ស្ពឺពីផែនទីភូគព្ភសាស្ត្រ (កាំ ៣០ គ.ម)។ បន្ទាត់ដាច់ៗពណ៌ខ្មៅបង្ហាញពីបំណាក់សិលា បន្ទាត់ពណ៌ប្រផេះបង្ហាញពីព្រំប្រទល់ខេត្ត និងសញ្ញាផ្កាយសម្គាល់ចំណុចតំណាងទីក្រុង។",
            captionEn: "Figure 3. Kampong Speu geology from the supplied geological map. Black dashed lines show mapped faults (activity unknown), grey lines show provincial boundaries and the star marks the city-centre stand-in point.",
          },
          {
            url: "/images/geohazards/figure-04-kampong-speu-seismicity.png",
            captionKm: "រូបភាពទី ៤៖ កំពង់ស្ពឺ៖ ការរញ្ជួយដីកម្រិត ៣ ឬលើសពីនេះក្នុងរង្វង់ ៥០០ គីឡូម៉ែត្រពីចំណុចកណ្តាលក្រុង (USGS)។ រង្វង់ទទេមានន័យថាមិនមានព្រឹត្តិការណ៍ត្រូវបានកត់ត្រានៅទីនោះ មិនមែនគ្មានគ្រោះថ្នាក់ឡើយ។",
            captionEn: "Figure 4. Kampong Speu: earthquakes of magnitude 3 or greater within 500 km of the city-centre point (USGS). Empty rings mean no events were recorded there, not that there is no hazard.",
          },
          {
            url: "/images/geohazards/figure-05-kampong-speu-stats.png",
            captionKm: "រូបភាពទី ៥៖ កំពង់ស្ពឺ៖ ក្រាហ្វិកកម្រិតរញ្ជួយដីតាមពេលវេលា ជម្រៅ ចំនួនសរុប និងទំនាក់ទំនងទំហំ-ប្រេកង់ (៥០០ គ.ម)។ និន្នាការមួយចំនួនឆ្លុះបញ្ចាំងពីការផ្លាស់ប្តូរនៃភាពពេញលេញនៃការកត់ត្រាតាមពេលវេលា។",
            captionEn: "Figure 5. Kampong Speu: magnitude over time, depth, cumulative count and magnitude–frequency charts (500 km). Some apparent trends reflect changes in how completely earthquakes were recorded over time.",
          },
        ],
      },
      {
        titleKm: "៥. លក្ខណៈស្ថានីយ៖ ខេត្តរតនគិរី (Ratanakiri Station)",
        titleEn: "5. Meet the sites: Ratanakiri",
        bodyKm: [
          "ស្ថានីយខេត្តរតនគិរី (WGS84 / UTM Zone 48N: X = 715435, Y = 1519850; 13.7399° N, 106.9924° E) ស្ថិតនៅក្រុងបានលុង លើខ្ពង់រាបថ្មបាសាល់ប្លីអូ-ក្វាទែណារី ដែលជាគ្រឹះថ្មរឹងមាំបំផុតក្នុងចំណោមទីតាំងទាំងប្រាំ។ បំណាក់សិលាលើផែនទី (មិនទាន់ដឹងកម្រិតសកម្មភាព) ស្ថិតនៅចម្ងាយប្រហែល ២.៨ គីឡូម៉ែត្រ។",
          "រតនគិរីជាទីតាំងតែមួយគត់ដែលមានការកត់ត្រាការរញ្ជួយដីកម្រិត ៣ ឬខ្ពស់ជាងនេះក្នុងរង្វង់ ៣០០ គីឡូម៉ែត្រ (៥៧ លើក; ធំបំផុត M 5.1 ក្នុងខែកក្កដា ឆ្នាំ ២០២៤ ចម្ងាយ ១៧៧ គ.ម) និងជាទីតាំងតែមួយគត់ដែលមានតម្លៃគ្រោះថ្នាក់ GEM មិនសូន្យ (០.០៣០ g) ដែលធ្វើឱ្យទីតាំងនេះក្លាយជាចំណុចគន្លឹះសម្រាប់ការតាមដាន។ ស្ថានីយនេះនឹងត្រូវបំពាក់ដោយ broadband seismometer និង accelerometer (រូបភាពទី ៦–៨)។",
        ],
        bodyEn: [
          "The Ratanakiri station (WGS84 / UTM Zone 48N: X = 715435, Y = 1519850; 13.7399° N, 106.9924° E) is in Banlung, on Plio-Quaternary plateau basalt, the firmest rock foundation of the five sites. A mapped fault (activity unknown) lies about 2.8 km away.",
          "Ratanakiri is the only site with recorded earthquakes of magnitude 3 or greater within 300 km (57 events; largest M 5.1, July 2024, 177 km away) and the only site with a non-zero GEM hazard value (0.030 g), making it a key location for monitoring. The station will be equipped with a broadband seismometer and an accelerometer (Figures 6–8).",
        ],
        images: [
          {
            url: "/images/geohazards/figure-06-ratanakiri-geology.png",
            captionKm: "រូបភាពទី ៦៖ ភូគព្ភសាស្ត្រខេត្តរតនគិរីពីផែនទីភូគព្ភសាស្ត្រ (កាំ ៣០ គ.ម)។ បន្ទាត់ដាច់ៗពណ៌ខ្មៅបង្ហាញពីបំណាក់សិលា បន្ទាត់ពណ៌ប្រផេះបង្ហាញពីព្រំប្រទល់ខេត្ត និងសញ្ញាផ្កាយសម្គាល់ចំណុចតំណាងទីក្រុង។",
            captionEn: "Figure 6. Ratanakiri geology from the supplied geological map. Black dashed lines show mapped faults (activity unknown), grey lines show provincial boundaries and the star marks the city-centre stand-in point.",
          },
          {
            url: "/images/geohazards/figure-07-ratanakiri-seismicity.png",
            captionKm: "រូបភាពទី ៧៖ រតនគិរី៖ ការរញ្ជួយដីកម្រិត ៣ ឬលើសពីនេះក្នុងរង្វង់ ៥០០ គីឡូម៉ែត្រពីចំណុចកណ្តាលក្រុង (USGS)។",
            captionEn: "Figure 7. Ratanakiri: earthquakes of magnitude 3 or greater within 500 km of the city-centre point (USGS). Empty rings mean no events were recorded there, not that there is no hazard.",
          },
          {
            url: "/images/geohazards/figure-08-ratanakiri-stats.png",
            captionKm: "រូបភាពទី ៨៖ រតនគិរី៖ ក្រាហ្វិកកម្រិតរញ្ជួយដីតាមពេលវេលា ជម្រៅ ចំនួនសរុប និងទំនាក់ទំនងទំហំ-ប្រេកង់ (៥០០ គ.ម)។",
            captionEn: "Figure 8. Ratanakiri: magnitude over time, depth, cumulative count and magnitude–frequency charts (500 km). Some apparent trends reflect changes in how completely earthquakes were recorded over time.",
          },
        ],
      },
      {
        titleKm: "៦. លក្ខណៈស្ថានីយ៖ ខេត្តព្រះសីហនុ (Preah Sihanouk Coastal Station)",
        titleEn: "6. Meet the sites: Preah Sihanouk",
        bodyKm: [
          "ស្ថានីយខេត្តព្រះសីហនុនឹងមានទីតាំងនៅក្រុងព្រះសីហនុ លើថ្មខ្សាច់ជូរ៉ាសិក-ក្រេតាសសឺស (ទម្រង់ Sao Hua)។ ក្នុងនាមជាស្ថានីយតំបន់ឆ្នេរ វានឹងជួយតាមដានផ្នែកនិរតីនៃប្រទេស។",
          "បំណាក់សិលាដែលនៅជិតបំផុតលើផែនទីស្ថិតនៅចម្ងាយប្រហែល ៣១.៧ គីឡូម៉ែត្រ ហើយការរញ្ជួយដីកម្រិត ៣ ឬខ្ពស់ជាងនេះចំនួន ៧ លើកត្រូវបានកត់ត្រាក្នុងរង្វង់ ៥០០ គីឡូម៉ែត្រ (ធំបំផុត M 5.0)។ ស្ថានីយនេះនឹងត្រូវបំពាក់ដោយ broadband seismometer និង accelerometer (រូបភាពទី ៩–១១)។",
        ],
        bodyEn: [
          "The Preah Sihanouk station will be located in Sihanoukville, on Jurassic–Cretaceous sandstone (Sao Hua formation). As a coastal site, it will help monitor the south-west of the country.",
          "The nearest mapped fault is about 31.7 km away, and seven earthquakes of magnitude 3 or greater have been recorded within 500 km (largest M 5.0). The station will be equipped with a broadband seismometer and an accelerometer (Figures 9–11).",
        ],
        images: [
          {
            url: "/images/geohazards/figure-09-preah-sihanouk-geology.png",
            captionKm: "រូបភាពទី ៩៖ ភូគព្ភសាស្ត្រខេត្តព្រះសីហនុពីផែនទីភូគព្ភសាស្ត្រ (កាំ ៣០ គ.ម)។",
            captionEn: "Figure 9. Preah Sihanouk geology from the supplied geological map. Black dashed lines show mapped faults (activity unknown), grey lines show provincial boundaries and the star marks the city-centre stand-in point.",
          },
          {
            url: "/images/geohazards/figure-10-preah-sihanouk-seismicity.png",
            captionKm: "រូបភាពទី ១០៖ ព្រះសីហនុ៖ ការរញ្ជួយដីកម្រិត ៣ ឬលើសពីនេះក្នុងរង្វង់ ៥០០ គីឡូម៉ែត្រពីចំណុចកណ្តាលក្រុង (USGS)។",
            captionEn: "Figure 10. Preah Sihanouk: earthquakes of magnitude 3 or greater within 500 km of the city-centre point (USGS). Empty rings mean no events were recorded there, not that there is no hazard.",
          },
          {
            url: "/images/geohazards/figure-11-preah-sihanouk-stats.png",
            captionKm: "រូបភាពទី ១១៖ ព្រះសីហនុ៖ ក្រាហ្វិកកម្រិតរញ្ជួយដីតាមពេលវេលា ជម្រៅ ចំនួនសរុប និងទំនាក់ទំនងទំហំ-ប្រេកង់ (៥០០ គ.ម)។",
            captionEn: "Figure 11. Preah Sihanouk: magnitude over time, depth, cumulative count and magnitude–frequency charts (500 km). Some apparent trends reflect changes in how completely earthquakes were recorded over time.",
          },
        ],
      },
      {
        titleKm: "៧. លក្ខណៈស្ថានីយ៖ ខេត្តសៀមរាប (Siem Reap Station)",
        titleEn: "7. Meet the sites: Siem Reap",
        bodyKm: [
          "ស្ថានីយខេត្តសៀមរាបនឹងស្ថិតនៅលើដីល្បាប់បឹង-ទន្លេថ្មីនៃវាលទំនាបបឹងទន្លេសាប។ បំណាក់សិលាដែលនៅជិតបំផុតលើផែនទីស្ថិតនៅចម្ងាយប្រហែល ៥២ គីឡូម៉ែត្រ ហើយការរញ្ជួយដីកម្រិត ៣ ឬខ្ពស់ជាងនេះចំនួន ៣៧ លើកត្រូវបានកត់ត្រាក្នុងរង្វង់ ៥០០ គីឡូម៉ែត្រ (ធំបំផុត M 5.6 ក្នុងឆ្នាំ ១៩២៥ ចម្ងាយ ៣៦១ គ.ម)។",
          "ស្ថានីយនេះនឹងត្រូវបំពាក់ដោយ broadband seismometer និង accelerometer (រូបភាពទី ១២–១៤)។",
        ],
        bodyEn: [
          "The Siem Reap station will sit on recent lacustrine-alluvial sediments of the Tonle Sap plain. The nearest mapped fault is about 52 km away, and 37 earthquakes of magnitude 3 or greater have been recorded within 500 km (largest M 5.6 in 1925, 361 km away).",
          "The station will be equipped with a broadband seismometer and an accelerometer (Figures 12–14).",
        ],
        images: [
          {
            url: "/images/geohazards/figure-12-siem-reap-geology.png",
            captionKm: "រូបភាពទី ១២៖ ភូគព្ភសាស្ត្រខេត្តសៀមរាបពីផែនទីភូគព្ភសាស្ត្រ (កាំ ៣០ គ.ម)។",
            captionEn: "Figure 12. Siem Reap geology from the supplied geological map. Black dashed lines show mapped faults (activity unknown), grey lines show provincial boundaries and the star marks the city-centre stand-in point.",
          },
          {
            url: "/images/geohazards/figure-13-siem-reap-seismicity.png",
            captionKm: "រូបភាពទី ១៣៖ សៀមរាប៖ ការរញ្ជួយដីកម្រិត ៣ ឬលើសពីនេះក្នុងរង្វង់ ៥០០ គីឡូម៉ែត្រពីចំណុចកណ្តាលក្រុង (USGS)។",
            captionEn: "Figure 13. Siem Reap: earthquakes of magnitude 3 or greater within 500 km of the city-centre point (USGS). Empty rings mean no events were recorded there, not that there is no hazard.",
          },
          {
            url: "/images/geohazards/figure-14-siem-reap-stats.png",
            captionKm: "រូបភាពទី ១៤៖ សៀមរាប៖ ក្រាហ្វិកកម្រិតរញ្ជួយដីតាមពេលវេលា ជម្រៅ ចំនួនសរុប និងទំនាក់ទំនងទំហំ-ប្រេកង់ (៥០០ គ.ម)។",
            captionEn: "Figure 14. Siem Reap: magnitude over time, depth, cumulative count and magnitude–frequency charts (500 km). Some apparent trends reflect changes in how completely earthquakes were recorded over time.",
          },
        ],
      },
      {
        titleKm: "៨. លក្ខណៈស្ថានីយ៖ រាជធានីភ្នំពេញ (Phnom Penh Urban Strong-Motion)",
        titleEn: "8. Meet the sites: Phnom Penh",
        bodyKm: [
          "ស្ថានីយរាជធានីភ្នំពេញនឹងមានទីតាំងនៅរាជធានី លើដីខ្សាច់ល្បាប់ ដីល្បាយខ្សាច់ និងដីឥដ្ឋ។ ដោយសារជាតំបន់ប្រមូលផ្តុំប្រជាជន និងអគារខ្ពស់ៗ ស្ថានីយភ្នំពេញនឹងផ្តោតលើការតាមដានចលនាដីខ្លាំងក្នុងទីក្រុង (urban strong-motion monitoring) ដោយប្រើ accelerometer ដើម្បីកត់ត្រាកម្រិតរំញ័រដីក្នុងទីក្រុងនៅពេលមានការរញ្ជួយដី (រូបភាពទី ១៥–១៧)។",
        ],
        bodyEn: [
          "The Phnom Penh station will be located in the capital, on alluvial sand, sandy loam and clay. With its dense population and buildings, Phnom Penh will focus on urban strong-motion monitoring with an accelerometer, recording how the ground shakes in the city during earthquakes (Figures 15–17).",
        ],
        images: [
          {
            url: "/images/geohazards/figure-15-phnom-penh-geology.png",
            captionKm: "រូបភាពទី ១៥៖ ភូគព្ភសាស្ត្ររាជធានីភ្នំពេញពីផែនទីភូគព្ភសាស្ត្រ (កាំ ៣០ គ.ម)។",
            captionEn: "Figure 15. Phnom Penh geology from the supplied geological map. Black dashed lines show mapped faults (activity unknown), grey lines show provincial boundaries and the star marks the city-centre stand-in point.",
          },
          {
            url: "/images/geohazards/figure-16-phnom-penh-seismicity.png",
            captionKm: "រូបភាពទី ១៦៖ ភ្នំពេញ៖ ការរញ្ជួយដីកម្រិត ៣ ឬលើសពីនេះក្នុងរង្វង់ ៥០០ គីឡូម៉ែត្រពីចំណុចកណ្តាលក្រុង (USGS)។",
            captionEn: "Figure 16. Phnom Penh: earthquakes of magnitude 3 or greater within 500 km of the city-centre point (USGS). Empty rings mean no events were recorded there, not that there is no hazard.",
          },
          {
            url: "/images/geohazards/figure-17-phnom-penh-stats.png",
            captionKm: "រូបភាពទី ១៧៖ ភ្នំពេញ៖ ក្រាហ្វិកកម្រិតរញ្ជួយដីតាមពេលវេលា ជម្រៅ ចំនួនសរុប និងទំនាក់ទំនងទំហំ-ប្រេកង់ (៥០០ គ.ម)។",
            captionEn: "Figure 17. Phnom Penh: magnitude over time, depth, cumulative count and magnitude–frequency charts (500 km). Some apparent trends reflect changes in how completely earthquakes were recorded over time.",
          },
        ],
      },
      {
        titleKm: "៩. បណ្តាញថ្នាក់ជាតិ និងផ្ទៃគ្របដណ្តប់ (A national network)",
        titleEn: "9. A national network & geometric coverage",
        bodyKm: [
          "ស្ថានីយទាំងប្រាំនឹងមានចន្លោះគម្លាតពី ៤៤ គីឡូម៉ែត្រ (កំពង់ស្ពឺ–ភ្នំពេញ) ដល់ ៥១១ គីឡូម៉ែត្រ (រតនគិរី–ព្រះសីហនុ) ដោយបង្កើតបានជាបណ្តាញរញ្ជួយដីជាតិដំបូងសម្រាប់កម្ពុជា។ ស្ថានីយបន្ថែមអាចនឹងត្រូវបង្កើតឡើងបន្ថែមទៀតនៅពេលអនាគត ជាពិសេសនៅតំបន់ព្រំដែនភាគពាយព្យ និរតី និងឦសាន (រូបភាពទី ១៨)។",
          "បណ្តាញនេះក៏នឹងជួយបំពេញបន្ថែមដល់ស្ថានីយជិតខាងក្នុងប្រទេសថៃផងដែរ (CHBT នៅច័ន្ទបុរី និង UBPT នៅឧប៊ុនរាជធានី) ដែលស្ថិតនៅចម្ងាយ ១៧៧–៣០៨ គីឡូម៉ែត្រពីទីតាំងស្ថានីយ។",
        ],
        bodyEn: [
          "The five stations will be spaced between 44 km (Kampong Speu–Phnom Penh) and 511 km (Ratanakiri–Preah Sihanouk) apart, forming a national seismic network for Cambodia. More stations may be added in the future, especially in the north-west, south-west and north-east border areas (Figure 18).",
          "The network will also complement nearby stations in Thailand (CHBT at Chanthaburi and UBPT at Ubon Ratchathani), 177–308 km from the sites.",
        ],
        image: "/images/geohazards/figure-18-network-geometric-coverage.png",
        imageCaptionKm: "រូបភាពទី ១៨៖ ផ្ទៃគ្របដណ្តប់នៃបណ្តាញស្ថានីយទាំងប្រាំលើក្រឡាចត្រង្គដី ២៥ គីឡូម៉ែត្រ (គម្លាតមុំ azimuthal gaps ធរណីមាត្រ)។",
        imageCaptionEn: "Figure 18. Coverage of the five-station network on a 25 km land grid (geometric azimuthal gaps).",
      },
      {
        titleKm: "១០. ទិសដៅទៅមុខ និងសារៈសំខាន់គន្លឹះ (Looking ahead & The bottom line)",
        titleEn: "10. Looking ahead & The bottom line",
        bodyKm: [
          "ស្ថានីយរញ្ជួយដីទាំងប្រាំរបស់កម្ពុជានឹងត្រូវដាក់ឱ្យដំណើរការនាពេលឆាប់ៗខាងមុខ។ ស្ថានីយទាំងនេះនឹងត្រូវបំពាក់ដោយ broadband seismometers និង accelerometers ឧបករណ៍បំលែងឌីជីថល ២៤-bit (24-bit digitizers) ជាមួយប្រព័ន្ធពេលវេលា GNSS និងបណ្តាញបញ្ជូនទិន្នន័យ (telemetry link) មកកាន់នាយកដ្ឋានភូគព្ភវិទ្យានៃ GDMR។",
          "ទិន្នន័យរញ្ជួយដីនឹងត្រូវចែករំលែកតាមពេលវេលាជាក់ស្តែង (real time) ជាមួយ GEA ក្រោមកិច្ចព្រមព្រៀងគម្រោង និងជាមួយដៃគូនានា ដូចជាវិទ្យាស្ថានភ្នំភ្លើងវិទ្យា និងរញ្ជួយដីវិទ្យាហ្វីលីពីន (PHIVOLCS) ព្រមទាំងស្ថាប័នជាតិ និងអាស៊ានដទៃទៀត។ មន្ត្រីជំនាញមូលដ្ឋាននឹងត្រូវបានបណ្តុះបណ្តាលដើម្បីដំណើរការ និងថែទាំបណ្តាញនេះ។",
        ],
        bodyEn: [
          "Cambodia's five seismometer stations will be up and running in the near future. The stations will be equipped with broadband seismometers and accelerometers, 24-bit digitizers with GNSS timing and a telemetry link to DGM of GDMR.",
          "Earthquake data will be shared in real time with GEA under the project Agreement, and with partners such as the Philippine Institute of Volcanology and Seismology (PHIVOLCS) and other national and ASEAN institutions. Local staff will be trained to operate and maintain the network.",
        ],
        calloutKm: "សេចក្តីសន្និដ្ឋានសំខាន់៖ កម្ពុជានឹងមានស្ថានីយរញ្ជួយដីចំនួនប្រាំ គឺនៅកំពង់ស្ពឺ រតនគិរី ព្រះសីហនុ សៀមរាប និងភ្នំពេញ។ ស្ថានីយទាំងនេះរួមគ្នានឹងបង្កើតបានជាបណ្តាញរញ្ជួយដីថ្នាក់ជាតិ ដែលជួយលើកកម្ពស់ការតាមដានការរញ្ជួយដី គាំទ្រការស្រាវជ្រាវ និងពង្រឹងកិច្ចសហប្រតិបត្តិការក្នុងតំបន់សម្រាប់ឆ្នាំខាងមុខ។",
        calloutEn: "The bottom line: Cambodia will soon have five seismometer stations, in Kampong Speu, Ratanakiri, Preah Sihanouk, Siem Reap and Phnom Penh. Together they will form a national seismic network that improves earthquake monitoring, supports research and strengthens regional cooperation in the years ahead.",
      },
    ],
    relatedPaperIds: [
      "web02",
      "web11",
      "local-5607ec1f1471",
      "local-998034775438",
      "local-ae4c88e6c6e7",
    ],
    sources: [
      {
        id: "[R1]",
        text: "GDMR / user-supplied geological GIS collection. Geological_map_750k – Edited/Geological_map_750k.shp; Geological_map_750k/Geology_750K.shp; geo_Cam_ASEAN/GeoMap500K_Cambodia_ASEAN.shp; Cambodia_Lithology_Polygons_Altered_Litho_OKV_OCH_region.shp; Faults.shp; Structures.shp; Karst1.shp. Local directory: D:/1-GIS Data/Dept_Geology/Geological_map. Read 14 October 2026.",
      },
      {
        id: "[R2]",
        text: "CNGD / user-supplied administrative and OSM-derived GIS collection. khm_admbnda_adm1_gov.shp; khm_admbnda_adm2_gov.shp; gis_osm_roads_free_1.shp; gis_osm_railways_free_1.shp; gis_osm_water_a_free_1.shp. Local directory: D:/1-GIS Data/CNGD. Read 14 October 2026.",
      },
      {
        id: "[R3]",
        text: "U.S. Geological Survey. Earthquake Catalog (ComCat), FDSN Event Web Service. Retrieved 14 October 2026.",
        url: "https://earthquake.usgs.gov/fdsnws/event/1/",
      },
      {
        id: "[R4]",
        text: "International Seismological Centre. ISC Bulletin FDSN Event Web Service and ISC-GEM Global Instrumental Earthquake Catalogue. Retrieved 14 October 2026. DOI: 10.31905/D808B825.",
        url: "https://www.isc.ac.uk/fdsnws/event/1/",
      },
      {
        id: "[R5]",
        text: "European-Mediterranean Seismological Centre. SeismicPortal FDSN Event Web Service. Retrieved 14 October 2026.",
        url: "https://www.seismicportal.eu/fdsnws/event/1/",
      },
      {
        id: "[R6]",
        text: "EarthScope (IRIS service endpoint). FDSN Station Web Service. Retrieved 14 October 2026.",
        url: "https://service.iris.edu/fdsnws/station/1/",
      },
      {
        id: "[R7]",
        text: "GEM Hazard Team. PSHA input model documentation for Continental Southeast Asia (SEA), model v2018.2.0. Describes source models of Chan et al. (2017) and Ornthammarath et al. (2020). Accessed 14 October 2026.",
        url: "https://hazard.openquake.org/gem/models/SEA/",
      },
      {
        id: "[R8]",
        text: "Global Earthquake Model Foundation. Global Seismic Hazard Map numeric open dataset, 2023. DOI: 10.5281/zenodo.8409647. Johnson, K. et al. (2026). Global Earthquake Model (GEM) Seismic Hazard Map, version 2026.1.",
        url: "https://doi.org/10.5281/zenodo.8409646",
      },
      {
        id: "[R9]",
        text: "U.S. Geological Survey. Vs30 Models and Data (ArcGIS slope-proxy service). Retrieved 14 October 2026.",
        url: "https://www.usgs.gov/programs/earthquake-hazards/science/vs30-models-and-data",
      },
      {
        id: "[R10]",
        text: "Peterson, J.R. (1993). Observations and modeling of seismic background noise. U.S. Geological Survey Open-File Report 93-322, 94 pp.",
        url: "https://doi.org/10.3133/ofr93322",
      },
      {
        id: "[R11]",
        text: "Thailand Meteorological Department. Regional earthquake portal (CHBT & UBPT seismic station network). Accessed 14 October 2026.",
        url: "https://earthquake.tmd.go.th/inside.html",
      },
      {
        id: "[R12]",
        text: "Provincial Department of Mines and Energy station premises coordinates table. GDMR/DGM project survey records, coordinate system EPSG:32648 (WGS 84 / UTM zone 48N). Surveyed October 2026.",
      },
      {
        id: "[R13]",
        text: "National Institute of Standards and Technology. Guide for the Use of the International System of Units (SI), Special Publication 811: standard acceleration of free fall (conventional g = 9.80665 m/s²).",
        url: "https://physics.nist.gov/Pubs/SP811/appenB.html",
      },
    ],
  },
  {
    id: "environmental-hydrogeology",
    slug: "environmental-hydrogeology",
    key: "Environmental Hydrogeology",
    titleKm: "ជលភូគព្ភសាស្ត្របរិស្ថាន ឌីណាមិកប្រព័ន្ធស្រទាប់ផ្ទុកទឹក និងបញ្ហាគុណភាពទឹកនៅកម្ពុជា",
    titleEn: "Environmental Hydrogeology, Aquifer Dynamics, and Groundwater Quality in Cambodia",
    shortTitleKm: "ជលភូគព្ភសាស្ត្របរិស្ថាន",
    shortTitleEn: "Environmental Hydrogeology",
    image: "/images/cms/focus-environmental-hydrogeology-image.png",
    imageAlt: "Conceptual hydrogeological cross-section and aquifer architecture across the Lower Mekong Basin in Cambodia",
    captionKm: "រូបភាពទី ១៖ គំរូកាត់ទទឹងជលភូគព្ភសាស្ត្រ និងការចែកចាយស្រទាប់ផ្ទុកទឹកក្រោមដីនៅអាងទន្លេមេគង្គក្រោមនៃប្រទេសកម្ពុជា (ITC & MRD, 2024)",
    captionEn: "Figure 1: Conceptual hydrogeological cross-section and aquifer architecture across the Lower Mekong Basin in Cambodia (ITC & MRD, 2024)",
    leadKm: "ទឹកក្រោមដីជាប្រភពធនធានទឹកដ៏មានសារៈសំខាន់បំផុតមួយសម្រាប់ជីវភាពរស់នៅ កសិកម្ម និងការអភិវឌ្ឍសេដ្ឋកិច្ចសង្គមនៅកម្ពុជា ជាពិសេសសម្រាប់ប្រជាពលរដ្ឋជាង ៥០% នៅតំបន់ជនបទ។ ជលភូគព្ភសាស្ត្របរិស្ថាននៅកម្ពុជាផ្តោតលើការយល់ដឹងអំពីរចនាសម្ព័ន្ធស្រទាប់ផ្ទុកទឹកល្បាប់ទំនាបមេគង្គ-បឹងទន្លេសាប យន្តការគីមីភូគព្ភសាស្ត្រនៃការរំលាយ និងបំលាស់ទីសារធាតុអាសេនិចធម្មជាតិ (Geogenic Arsenic) ការជ្រាបចូលនៃទឹកប្រៃនៅតំបន់ឆ្នេរខេត្តកោះកុង កំពត និងព្រះសីហនុ និងផលប៉ះពាល់បរិស្ថានជុំវិញការធ្វើអាជីវកម្មរ៉ែ និងសកម្មភាពឧស្សាហកម្ម។",
    leadEn: "Groundwater constitutes a critical lifeline for domestic water supply, agriculture, and rural livelihoods in Cambodia, serving over 50% of the rural population. Environmental hydrogeology investigates the geometry and hydraulic properties of Cambodia's sedimentary aquifers, the biogeochemical mechanisms driving natural geogenic arsenic contamination in the Lower Mekong floodplain, coastal saltwater intrusion along the Gulf of Thailand, and anthropogenic footprints associated with artisanal mining and agricultural intensification.",
    stats: [
      { labelKm: "ឯកតាស្រទាប់ផ្ទុកទឹកចម្បង", labelEn: "Principal Aquifer Systems", value: "Holocene & Pleistocene Alluvium" },
      { labelKm: "ទិន្នផលទឹកទូទៅ", labelEn: "Typical Aquifer Yield", value: "5 – 45 m³/h (Alluvial Aquifer)" },
      { labelKm: "បញ្ហាគីមីភូគព្ភសាស្ត្រចម្បង", labelEn: "Key Geogenic Concern", value: "Arsenic (>10–50 µg/L) & Salinity" },
      { labelKm: "អត្រាប្រើប្រាស់ទឹកក្រោមដី", labelEn: "Rural Groundwater Reliance", value: ">50% Domestic Water Use" },
    ],
    sections: [
      {
        titleKm: "១. គ្រោងភូគព្ភសាស្ត្រ និងស្ថាបត្យកម្មស្រទាប់ផ្ទុកទឹកនៅកម្ពុជា (Hydrogeological Framework of Cambodia)",
        titleEn: "1. Hydrogeological Architecture and Regional Aquifer Systems",
        bodyKm: [
          "ធនធានទឹកក្រោមដីនៅកម្ពុជាត្រូវបានគ្រប់គ្រងដោយផ្ទាល់ដោយការវិវត្តភូគព្ភសាស្ត្រនៃអាងទន្លេមេគង្គ និងបឹងទន្លេសាប រួមជាមួយខ្សែក្រវាត់ភ្នំជុំវិញ។ ស្រទាប់ផ្ទុកទឹកដែលមានទិន្នផលខ្ពស់បំផុតស្ថិតនៅក្នុងកម្រាលល្បាប់សេណូសូអ៊ិក (Cenozoic unconsolidated sediment) ដែលគ្របដណ្តប់លើផ្ទៃទំនាបកណ្តាលនៃប្រទេស។",
          "ផ្អែកលើការខួងស្រាវជ្រាវ ការវាស់ស្ទង់ភូគព្ភរូបវិទ្យា (Resistivity soundings) និងទិន្នន័យអណ្តូងខួងរបស់ក្រសួងអភិវឌ្ឍន៍ជនបទ (MRD) ប្រព័ន្ធស្រទាប់ផ្ទុកទឹកនៅកម្ពុជាត្រូវបានបែងចែកជា ៣ ប្រភេទចម្បង៖",
        ],
        bodyEn: [
          "Cambodia's groundwater resources are intimately controlled by the Cenozoic geodynamic evolution of the Lower Mekong and Tonle Sap alluvial basins, framed by peripheral Mesozoic–Paleozoic upland belts. The most prolific aquifers occur within unconsolidated Quaternary fluvio-lacustrine and deltaic deposits that blanket the central lowlands.",
          "Decades of borehole drilling, regional geophysical resistivity soundings, and systematic hydrochemical inventories by the Ministry of Rural Development (MRD) and academic partners delineate three principal hydrogeological regimes:",
        ],
        bulletsKm: [
          "ស្រទាប់ផ្ទុកទឹកល្បាប់ទំនាបកណ្តាល (Central Alluvial Aquifers): ផ្សំឡើងពីដីល្បាប់ខ្សាច់ និងគ្រួសនៃសម័យកាលហូឡូសែន និងផ្លេសតូសែន (Holocene–Pleistocene) កម្រាស់ពី ២០ ទៅជាង ១៥០ ម៉ែត្រ មានទិន្នផលខ្ពស់ និងជាប្រភពទឹកចម្បងរបស់ប្រជាជន។",
          "ស្រទាប់ផ្ទុកទឹកថ្មបាសាល់ខ្ពង់រាប (Plateau Basalt Aquifers): ស្ថិតនៅខេត្តកំពង់ចាម ត្បូងឃ្មុំ រតនគិរី និងមណ្ឌលគិរី កើតពីថ្មបាសាល់សេណូសូអ៊ិក ដែលមានស្នាមប្រេះស្រាំ និងរន្ធប្រហោង អាចផ្ទុកទឹកសាបគុណភាពល្អ។",
          "ស្រទាប់ផ្ទុកទឹកថ្មរឹង និងថ្មភក់មេសូសូអ៊ិក (Fractured Bedrock & Sandstone Aquifers): ស្ថិតនៅតំបន់ជួរភ្នំក្រវាញ ភ្នំដងរែក និងភូមិភាគឦសាន ជាស្រទាប់ផ្ទុកទឹកតាមស្នាមបំណាក់ និងប្រេះស្រាំ ដែលមានទិន្នផលពីមធ្យមទៅទាប។",
        ],
        bulletsEn: [
          "Central Lowland Alluvial Aquifers: Composed of unconsolidated Holocene and Pleistocene sands, gravels, and interbedded silts (thickness 20 to >150 m), offering the highest hydraulic conductivity and domestic abstraction yields.",
          "Neogene–Quaternary Basalt Aquifers: Form elevated plateau aquifers across Kampong Cham, Tboung Khmum, Ratanakiri, and Mondulkiri, where vesicular structures and tectonic fracturing sustain high-quality freshwater reserves.",
          "Mesozoic Sandstone and Fractured Bedrock Aquifers: Underlie the Cardamom and Dangrek mountain ranges and northern bedrock corridors, where groundwater flow is strictly structural, localized along faults and shear joints with variable yields.",
        ],
      },
      {
        titleKm: "២. ចំណាត់ថ្នាក់ឯកតាជលសិលាវិទ្យានៅកម្ពុជា (Table 1: Hydrostratigraphic Units of Cambodia)",
        titleEn: "2. Hydrostratigraphic Classification and Aquifer Properties",
        bodyKm: [
          "តារាងខាងក្រោមបង្ហាញពីចំណាត់ថ្នាក់ឯកតាជលសិលាវិទ្យា (Hydrostratigraphic units) លក្ខណៈសម្បត្តិធារាសាស្ត្រ និងគុណភាពទឹកទូទៅនៅទូទាំងប្រទេសកម្ពុជា៖",
        ],
        bodyEn: [
          "The following table summarizes Cambodia's hydrostratigraphic units, depth intervals, typical borehole yields, and baseline hydrochemical characteristics:",
        ],
        table: {
          captionKm: "តារាងទី ១៖ ចំណាត់ថ្នាក់ឯកតាជលសិលាវិទ្យា លក្ខណៈធារាសាស្ត្រ និងគុណភាពទឹកនៅកម្ពុជា",
          captionEn: "Table 1: Hydrostratigraphic units, hydraulic properties, and water quality characteristics in Cambodia",
          headersKm: ["ឯកតាជលសិលាវិទ្យា", "អាយុកាលភូគព្ភសាស្ត្រ", "ជម្រៅជាមធ្យម (m)", "ទិន្នផល (m³/h)", "គុណភាពទឹក និងបញ្ហាគីមី"],
          headersEn: ["Hydrostratigraphic Unit", "Geological Age", "Depth Range (m)", "Borehole Yield (m³/h)", "Water Quality & Geochemical Profile"],
          rowsKm: [
            ["ស្រទាប់ល្បាប់លើ (Upper Holocene Alluvium)", "Holocene (<10 ka)", "0 – 25", "2 – 15", "បរិស្ថានអុកស៊ីតកម្ម-រេដុកម្មទាប, ងាយរងគ្រោះដោយអាសេនិច (>50 µg/L)"],
            ["ស្រទាប់ខ្សាច់-គ្រួសក្រោម (Lower Pleistocene Aquifer)", "Pleistocene (0.01 – 2.6 Ma)", "25 – 120", "15 – 50", "ទឹកសាបគុណភាពល្អ, កម្រិតជាតិដែកខ្ពស់, ហានិភ័យអាសេនិចទាបជាង"],
            ["ថ្មបាសាល់ខ្ពង់រាប (Plateau Vesicular Basalts)", "Neogene–Quaternary", "10 – 80", "10 – 35", "ទឹកសាបថ្លាល្អ, pH អព្យាក្រឹត, សម្បូរម៉ាញ៉េស្យូម និងកាល់ស្យូម"],
            ["ថ្មភក់ស្រទាប់ក្រហម (Indosinias Sandstones)", "Jurassic–Cretaceous", "30 – 150+", "1 – 10", "រ៉ែទាប, លំហូរតាមស្នាមប្រេះ, ទិន្នផលមានកម្រិត"],
            ["សិលាមូលដ្ឋានប្រេះស្រាំ (Fractured Basement Rocks)", "Paleozoic–Triassic", "15 – 100", "0.5 – 5", "ប្រែប្រួលតាមមូលដ្ឋាន, ជួនកាលមានសារធាតុរ៉ែរំលាយខ្ពស់"],
          ],
          rowsEn: [
            ["Upper Holocene Alluvium", "Holocene (<10 ka)", "0 – 25", "2 – 15", "Reducing conditions, widespread geogenic arsenic hazard (>50 µg/L)"],
            ["Lower Pleistocene Aquifer", "Pleistocene (0.01 – 2.6 Ma)", "25 – 120", "15 – 50", "High productivity freshwater, elevated Fe/Mn, generally low As"],
            ["Plateau Vesicular Basalts", "Neogene–Quaternary", "10 – 80", "10 – 35", "Excellent clarity, circum-neutral pH, rich in Ca-Mg bicarbonate"],
            ["Mesozoic Continental Sandstones", "Jurassic–Cretaceous", "30 – 150+", "1 – 10", "Low mineralization, fracture-dominated flow, localized modest yield"],
            ["Fractured Basement / Metamorphic", "Paleozoic–Triassic", "15 – 100", "0.5 – 5", "Highly variable, locally brackish or mineralized along fault zones"],
          ],
          footnoteKm: "ប្រភពទិន្នន័យ៖ នាយកដ្ឋានផ្គត់ផ្គង់ទឹកជនបទ (MRD), វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC), និង JICA Hydrogeological Surveys (2020–2025)",
          footnoteEn: "Source: Ministry of Rural Development (MRD), Institute of Technology of Cambodia (ITC), and JICA Groundwater Study Compilations (2020–2025).",
        },
      },
      {
        titleKm: "៣. យន្តការបំលាស់ទីសារធាតុអាសេនិចធម្មជាតិនៅទំនាបមេគង្គ (Geogenic Arsenic Mobilization Mechanisms)",
        titleEn: "3. Geogenic Arsenic Mobilization in the Lower Mekong Floodplain",
        bodyKm: [
          "ការចម្លងសារធាតុអាសេនិចធម្មជាតិ (Natural geogenic arsenic contamination) ក្នុងទឹកក្រោមដីនៅតំបន់ទំនាបមេគង្គ និងទន្លេសាប ជាបញ្ហាប្រឈមសុខភាពសាធារណៈដ៏ធ្ងន់ធ្ងរបំផុតមួយនៅកម្ពុជា។ ខេត្តដែលមានហានិភ័យខ្ពស់រួមមាន ខេត្តកណ្តាល ព្រៃវែង កំពង់ចាម និងផ្នែកខ្លះនៃរាជធានីភ្នំពេញ ដែលអណ្តូងទឹកមួយចំនួនមានកំហាប់អាសេនិចលើសពី ៥០ ទៅ ១០០០ µg/L (ខណៈស្តង់ដារជាតិគឺ ៥០ µg/L និងស្តង់ដារ WHO គឺ ១០ µg/L)។",
          "ការសិក្សាគីមីភូគព្ភសាស្ត្រស៊ីជម្រៅ (Rowland et al., ITC, Polizzotto et al.) បានបញ្ជាក់ថាយន្តការចម្បងនៃការរំដោះអាសេនិច គឺដំណើរការរំលាយរេដុកម្មនៃសារធាតុ Fe(III) oxyhydroxides (Reductive dissolution) ដោយសារវត្តមានសារធាតុសរីរាង្គក្នុងល្បាប់ហូឡូសែន៖",
        ],
        bodyEn: [
          "Natural geogenic arsenic contamination in shallow alluvial aquifers represents the most pressing public health and geochemical challenge in Cambodia. Across high-risk floodplains along the Mekong and Bassac rivers (notably in Kandal, Prey Veng, and Kampong Cham provinces), arsenic concentrations frequently exceed 100 to 1,000 µg/L, vastly eclipsing the WHO drinking water guideline of 10 µg/L and the national standard of 50 µg/L.",
          "Rigorous geochemical investigations (Rowland et al., ITC, Polizzotto et al.) establish that arsenic is released via the microbially driven reductive dissolution of iron(III) oxyhydroxides [Fe(III) oxides/hydroxides] within young, organic-rich Holocene sediments:",
        ],
        bulletsKm: [
          "ល្បាប់វ័យក្មេងហូឡូសែនសម្បូរសារធាតុសរីរាង្គកប់ក្នុងដី ដែលជម្រុញសកម្មភាពបាក់តេរីប្រើប្រាស់អុកស៊ីសែនអស់ បង្កើតបានបរិស្ថានរេដុកម្មខ្លាំង (Anoxic reducing conditions)។",
          "បាក់តេរីរេដុកម្មដែក (Iron-reducing bacteria) រំលាយស្រទាប់រ៉ែ Fe-oxyhydroxide ដែលភ្ជាប់អាសេនិច ធ្វើឱ្យអាសេនិច (ជាទម្រង់ Arsenite As(III) ដែលមានជាតិពុលខ្ពស់) ត្រូវបានរំដោះចូលទៅក្នុងទឹកក្រោមដី។",
          "ផ្ទុយទៅវិញ ស្រទាប់ល្បាប់ផ្លេសតូសែនចំណាស់ (Pleistocene aquifers) ត្រូវបានលាងសម្អាត និងកត់សុីតាំងពីបុរាណកាល ដូច្នេះមិនមានដំណើរការរេដុកម្មខ្លាំងឡើយ ដែលធ្វើឱ្យទឹកនៅស្រទាប់ជ្រៅ (>60–80m) ជាទូទៅមានសុវត្ថិភាពពីអាសេនិច។",
        ],
        bulletsEn: [
          "Young Holocene alluvial-deltaic sediments contain abundant labile organic matter that rapidly exhausts dissolved oxygen, establishing strongly reducing, methanogenic conditions.",
          "Heterotrophic iron-reducing bacteria use ferric iron as an electron acceptor, dissolving arsenic-bearing Fe(III) oxyhydroxides and releasing adsorbed arsenite [As(III)] directly into solution.",
          "Conversely, older Pleistocene sands have undergone extensive paleoweathering and flushing; their weathered iron oxides are more crystalline and resistant to microbial reduction, resulting in safe, low-arsenic groundwater in deeper aquifers (>60–80 m depth).",
        ],
        calloutKm: "ចំណាំបច្ចេកទេស៖ ការខួងអណ្តូងចូលទៅកាន់ស្រទាប់ល្បាប់ផ្លេសតូសែនជម្រៅជ្រៅ (>៦០–៨០ ម៉ែត្រ) ដែលមានស្រទាប់ដីឥដ្ឋការពារពីលើ (Clay aquitard) គឺជាយុទ្ធសាស្ត្រជលភូគព្ភសាស្ត្រដ៏មានប្រសិទ្ធភាពក្នុងការទាញយកទឹកក្រោមដីដែលគ្មានជាតិអាសេនិចសម្រាប់សហគមន៍ជនបទ។",
        calloutEn: "Technical Note: Targeting deeper Pleistocene sand-gravel aquifers (>60–80 m) confined beneath impermeable clay aquitards provides a reliable, hydrogeologically sound mitigation pathway for arsenic-free community drinking water.",
      },
      {
        titleKm: "៤. ជលភូគព្ភសាស្ត្រតំបន់ឆ្នេរ និងការជ្រាបចូលនៃទឹកប្រៃ (Coastal Hydrogeology and Saline Water Intrusion)",
        titleEn: "4. Coastal Aquifer Dynamics and Saline Water Intrusion",
        bodyKm: [
          "តំបន់ឆ្នេរសមុទ្រកម្ពុជា ដែលលាតសន្ធឹងតាមខេត្តកោះកុង ព្រះសីហនុ កំពត និងកែប ប្រឈមនឹងបញ្ហាប្រឈមជលភូគព្ភសាស្ត្រខុសប្លែកពីតំបន់ទំនាបកណ្តាល។ ស្រទាប់ផ្ទុកទឹកនៅតំបន់នេះមានកម្រាស់ស្តើងជាង និងស្ថិតនៅលើសិលាមូលដ្ឋានរឹង ឬថ្មភក់។",
          "ការជ្រាបចូលនៃទឹកប្រៃ (Seawater intrusion) កើតឡើងដោយសារកត្តាធម្មជាតិ (ជំនោរទឹកសមុទ្រ និងការប្រែប្រួលកម្រិតទឹកសមុទ្រ) រួមជាមួយការទាញយកទឹកក្រោមដីហួសកម្រិតសម្រាប់តំបន់ទីប្រជុំជន ទេសចរណ៍ និងកសិដ្ឋានវារីវប្បកម្ម។ ផែនទីកំហាប់ជាតិប្រៃ (Chloride and Total Dissolved Solids - TDS) បង្ហាញថាអណ្តូងទឹកក្បែរឆ្នេរ និងតាមមាត់ព្រែកជាច្រើនមានកម្រិត TDS លើសពី ១.០០០ mg/L ក្នុងរដូវប្រាំង។",
        ],
        bodyEn: [
          "Cambodia's coastal zone, spanning Koh Kong, Preah Sihanouk, Kampot, and Kep provinces along the Gulf of Thailand, presents unique hydrogeological dynamics governed by coastal estuarine deposits, shallow alluvial sands, and fractured bedrock aquifers.",
          "Saline water intrusion into coastal aquifers is driven by a combination of natural tidal dynamics, sea-level fluctuations, and localized over-abstraction for urban municipal supply, tourism facilities, and aquaculture. Hydrochemical surveys demonstrate that dry-season shallow wells situated within 2–5 km of the coastline frequently register Total Dissolved Solids (TDS) exceeding 1,000–3,000 mg/L, exceeding potable thresholds.",
        ],
      },
      {
        titleKm: "៥. អន្តរកម្មទឹកលើដី និងទឹកក្រោមដីនៅអាងទន្លេមេគង្គ-ទន្លេសាប (Surface Water–Groundwater Interactions)",
        titleEn: "5. Surface Water–Groundwater Interactions in the Mekong–Tonle Sap Basin",
        bodyKm: [
          "ប្រព័ន្ធជលសាស្ត្រកម្ពុជាមានលក្ខណៈពិសេសដោយសារវដ្តទឹកជំនន់ប្រចាំឆ្នាំនៃទន្លេមេគង្គ និងបឹងទន្លេសាប ដែលបណ្តាលឱ្យមានការផ្លាស់ប្តូរទិសដៅលំហូរទឹកដ៏អស្ចារ្យ។ ក្នុងរដូវវស្សា កម្រិតទឹកទន្លេខ្ពស់បានបញ្ចូលទឹកទៅក្នុងស្រទាប់ផ្ទុកទឹកល្បាប់អមសងខាង (Groundwater recharge)។",
          "ក្នុងរដូវប្រាំង កម្រិតទឹកលើដីធ្លាក់ចុះ ធ្វើឱ្យទឹកក្រោមដីបញ្ចេញលំហូរត្រឡប់មកកាន់ទន្លេ និងបឹងវិញ (Baseflow discharge) ដែលដើរតួនាទីយ៉ាងសំខាន់ក្នុងការរក្សាប្រព័ន្ធអេកូឡូស៊ីទឹកសាប និងគាំទ្រដល់កសិកម្មរដូវប្រាំង។ ការសិក្សាដោយប្រើប្រាស់អ៊ីសូតូបធម្មជាតិ (Oxygen-18 និង Deuterium) បង្ហាញថាការបញ្ចូលទឹកក្រោមដីភាគច្រើនកើតចេញពីទឹកភ្លៀងតាមរដូវ និងទឹកជំនន់ទន្លេមេគង្គ។",
        ],
        bodyEn: [
          "Cambodia's hydrogeological regime is fundamentally coupled to the seasonal flood pulse of the Mekong and Tonle Sap river-lake system, one of the world's most dramatic hydrological reversals. During the monsoon season (June–October), elevated river stages drive active lateral and vertical recharge into adjacent alluvial aquifers.",
          "During the dry season (December–May), this hydraulic gradient reverses: groundwater discharges as baseflow into channels and wetlands, sustaining critical baseflows and wetland habitats. Stable water isotope investigations (δ¹⁸O and δ²H) indicate that recharge is dominated by monsoon precipitation and seasonal overbank flooding, underscoring the vulnerability of aquifers to upstream hydropower regulation and climate volatility.",
        ],
      },
      {
        titleKm: "៦. ផលប៉ះពាល់បរិស្ថានពីការរុករករ៉ែ និងការតាមដានគុណភាពទឹក (Mining Footprints & Water Quality Monitoring)",
        titleEn: "6. Environmental Impacts of Mining and Systematic Water Monitoring",
        bodyKm: [
          "ក្រៅពីសារធាតុអាសេនិចធម្មជាតិ សកម្មភាពមនុស្សដូចជាការធ្វើអាជីវកម្មរ៉ែមាសបែបប្រពៃណី (Artisanal gold mining) នៅប៉ែកឦសានប្រទេស (ដូចជានៅអាងទន្លេព្រែកទេ ខេត្តមណ្ឌលគិរី) អាចបង្កផលប៉ះពាល់ដល់គុណភាពទឹកលើដី និងទឹកក្រោមដី តាមរយៈការប្រើប្រាស់បារត (Mercury) និងស៊ីយានីត (Cyanide) ព្រមទាំងការកើនឡើងនៃល្បាប់ដី។",
          "ការស្រាវជ្រាវបរិស្ថានទឹក (ដូចជាការសិក្សានៅព្រែកទេ ឆ្នាំ២០២៥) និងបណ្តាញតាមដានគុណភាពទឹកក្រោមដីជាតិ បាននិងកំពុងអនុវត្តការត្រួតពិនិត្យជាប្រចាំលើលោហៈធ្ងន់ (Heavy metals: As, Hg, Pb, Cd, Fe, Mn) និងសមាសធាតុគីមីទឹក ដើម្បីធានាសុវត្ថិភាពដល់សហគមន៍មូលដ្ឋាន និងការពារប្រភពទឹកក្រោមដីពីការបំពុល។",
        ],
        bodyEn: [
          "Beyond natural geogenic contaminants, anthropogenic activities introduce localized environmental risks to Cambodian water systems. Historical and artisanal gold extraction in northeastern catchments (such as the Prek Te River Basin in Mondulkiri) has generated concerns regarding mercury amalgamation residues, cyanide leaching, and severe river siltation.",
          "Targeted water quality assessments (e.g., Prek Te watershed studies, 2025) coupled with the national groundwater monitoring network evaluate trace heavy metals (As, Hg, Pb, Cd, Fe, Mn), nutrient loadings, and major ion chemistry to safeguard communal water reserves and support science-based environmental licensing.",
        ],
      },
      {
        titleKm: "៧. យុទ្ធសាស្ត្រគ្រប់គ្រង និងអភិបាលកិច្ចទឹកក្រោមដីប្រកបដោយចីរភាព (Sustainable Groundwater Governance & Mitigation)",
        titleEn: "7. Sustainable Groundwater Governance, Technology, and Policy Pathways",
        bodyKm: [
          "ដើម្បីធានាចីរភាពនៃធនធានទឹកក្រោមដីនៅកម្ពុជា ការស្រាវជ្រាវ និងការអនុវត្តជាក់ស្តែងទាមទារនូវយុទ្ធសាស្ត្ររួមបញ្ចូលគ្នា៖",
        ],
        bodyEn: [
          "Securing sustainable groundwater stewardship for Cambodia requires an integrated technical, institutional, and community-driven approach:",
        ],
        bulletsKm: [
          "ការពង្រីកបណ្តាញអណ្តូងតាមដានជាតិ (National Monitoring Well Network) ដើម្បីវាស់ស្ទង់កម្រិតទឹក និងគីមីទឹកដោយស្វ័យប្រវត្តិតាមប្រព័ន្ធ Telemetry។",
          "ការកំណត់តំបន់ការពារប្រភពទឹក (Aquifer Protection Zones) ជាពិសេសនៅតំបន់ជុំវិញរាជធានីភ្នំពេញ ដែលមានការបូមទឹកក្រោមដីច្រើនសម្រាប់វិស័យឧស្សាហកម្មកាត់ដេរ និងសំណង់។",
          "ការលើកកម្ពស់បច្ចេកវិទ្យាចម្រោះអាសេនិចតាមខ្នងផ្ទះ និងសហគមន៍ (Community Arsenic Removal Systems) ដោយប្រើប្រាស់តម្រងខ្សាច់ដែក (Iron-sand filters) និងបច្ចេកវិទ្យាភ្នាសចម្រោះ (Membrane filtration)។",
          "ការការពារស្រទាប់ដីឥដ្ឋខាងលើ (Aquitard Integrity) តាមរយៈការខួង និងសង់អណ្តូងតាមក្បួនខ្នាតបច្ចេកទេសត្រឹមត្រូវ ដើម្បីកុំឱ្យទឹកដែលផ្ទុកអាសេនិចជ្រាបចូលទៅក្នុងស្រទាប់ទឹកជ្រៅ។",
        ],
        bulletsEn: [
          "Expansion of the National Telemetric Monitoring Network to capture real-time groundwater head variations and seasonal salinity/geochemical shifts across high-abstraction corridors.",
          "Designation of Aquifer Protection Zones around Phnom Penh and industrial hubs to prevent localized aquifer depression cones and land subsidence.",
          "Deployment of decentralized community arsenic treatment solutions, including locally manufactured Kanchan-type iron oxide sand filters and solar-powered membrane systems.",
          "Preservation of confining aquitard integrity through standardized well-sealing and grouting codes to prevent downward cross-contamination of deep pristine Pleistocene aquifers.",
        ],
      },
    ],
    relatedPaperIds: ["web02", "web10", "web12"],
    keyHighlightsKm: [
      "ទឹកក្រោមដីផ្តល់ទឹកប្រើប្រាស់ជាង ៥០% សម្រាប់សហគមន៍ជនបទនៅកម្ពុជា",
      "ស្រទាប់ល្បាប់ទំនាបកណ្តាលហូឡូសែន-ផ្លេសតូសែន ជាប្រភពទឹកក្រោមដីដែលមានទិន្នផលខ្ពស់បំផុត",
      "អាសេនិចធម្មជាតិកើតចេញពីដំណើរការរំលាយរេដុកម្មនៃសារធាតុ Fe-oxyhydroxides ដោយបាក់តេរីក្នុងល្បាប់ហូឡូសែន",
      "ស្រទាប់ខ្សាច់ផ្លេសតូសែនជម្រៅជ្រៅ (>៦០–៨០ ម៉ែត្រ) ជាប្រភពទឹកស្អាតមានសុវត្ថិភាពពីអាសេនិច",
      "តំបន់ឆ្នេរប្រឈមនឹងការជ្រាបចូលនៃទឹកប្រៃដែលទាមទារការគ្រប់គ្រងការបូមទឹកយ៉ាងប្រុងប្រយ័ត្ន",
    ],
    keyHighlightsEn: [
      "Groundwater supplies domestic water for over 50% of Cambodia's rural population",
      "Quaternary fluvio-deltaic alluvium forms the most productive regional aquifer system (yields up to 45 m³/h)",
      "Geogenic arsenic release is governed by microbial reductive dissolution of Fe(III) oxyhydroxides in young Holocene strata",
      "Deep confined Pleistocene aquifers (>60–80 m) provide a verified, arsenic-safe groundwater exploration target",
      "Coastal zones require rigorous monitoring against saltwater intrusion and over-abstraction",
    ],
    sources: [
      {
        id: "[R1]",
        text: "Sok, D., Polizzotto, M.L., Rowland, H.A.L., et al. (2020). Hydrogeological framework and arsenic distribution in Cambodian floodplain aquifers. Journal of Hydrology: Regional Studies, 32, 100745.",
        url: "https://doi.org/10.1016/j.ejrh.2020.100745",
      },
      {
        id: "[R2]",
        text: "Ministry of Rural Development (MRD) & JICA. (2022). Comprehensive Groundwater Resources Assessment and Arsenic Risk Atlas of the Kingdom of Cambodia. Technical Report, Phnom Penh.",
      },
      {
        id: "[R3]",
        text: "Buschmann, J., Berg, M., Stengel, C., & Sampson, M.L. (2007). Arsenic and manganese contamination in drinking water resources in Cambodia: coincide of risk areas with Holocene sediments. Environmental Science & Technology, 41(7), 2146-2152.",
        url: "https://doi.org/10.1021/es062056k",
      },
      {
        id: "[R4]",
        text: "Charlet, L., & Polya, D.A. (2006). Arsenic in shallow, reducing groundwaters in southern Asia: an environmental health catastrophe. Elements, 2(2), 91-96.",
        url: "https://doi.org/10.2113/gselements.2.2.91",
      },
      {
        id: "[R5]",
        text: "Chea, L., et al. (2025). Surface and Groundwater Quality Impacted by Artisanal Gold Mining Activities in the Prek Te River Basin, Mondulkiri Province. ITC Geoscience Technical Series, 4, 112-128.",
      },
    ],
  },
  {
    id: "marine-geology",
    slug: "marine-geology",
    relatedPaperIds: ["local-b40e5b34438f", "tectonics-sio-2023", "local-23443d1465d4", "local-1c12576736bd"],
    sources: [
      {
        id: "[R1]",
        text: "China Geological Survey & General Department of Mineral Resources (2018). Atlas of Kampong Som Bay Coastal Geo-Environment, Cambodia. Qingdao Institute of Marine Geology, 47 pages.",
      },
      {
        id: "[R2]",
        text: "Fyhn, M.B.W., Boldreel, L.O., & Nielsen, L.H. (2010). Palaeocene–early Eocene inversion of the Phuquoc–Kampot Som Basin: SE Asian deformed margin. Journal of the Geological Society, London, 167(2), 281-296.",
        url: "https://doi.org/10.1144/0016-76492009-026",
      },
      {
        id: "[R3]",
        text: "Vysotsky, V.I., Rodnikova, R.D., & Agamirzoyev, E.A. (1994). Petroleum Geology of Cambodia. International Geology Review, 36(6), 574-586.",
        url: "https://doi.org/10.1080/00206819409465476",
      },
      {
        id: "[R4]",
        text: "Morley, C.K. (2004). Nested strike-slip duplexes, and processes of basin formation, inversion, and strike-slip faulting: examples from the Gulf of Thailand. AAPG Bulletin, 88(2), 217-240.",
        url: "https://doi.org/10.1306/09240303036",
      },
      {
        id: "[R5]",
        text: "ESCAP (1993). Atlas of Mineral Resources of the ESCAP Region, Volume 10: Cambodia. United Nations Economic and Social Commission for Asia and the Pacific, New York, 85 pages.",
      },
    ],
    key: "Marine Geology",
    titleKm: "ភូគព្ភសាស្ត្រសមុទ្រ និងបរិស្ថានឆ្នេរខេត្តព្រះសីហនុ — ឆកសមុទ្រកំពង់សោម",
    titleEn: "Marine and Coastal Geology of Sihanoukville and Kampong Som Bay, Cambodia",
    shortTitleKm: "ភូគព្ភសាស្ត្រសមុទ្រ",
    shortTitleEn: "Marine Geology",
    image: "/images/marine-geology/geology.jpg",
    imageAlt: "Coastal geology map of Kampong Som Bay and Sihanoukville Province (China Geological Survey & GDMR, 2018)",
    captionKm: "រូបភាពទី ១៖ ផែនទីភូគព្ភសាស្ត្រឆ្នេរសមុទ្រ និងកោះនានាក្នុងឆកសមុទ្រកំពង់សោម និងខេត្តព្រះសីហនុ (CGS / GDMR, 2018)",
    captionEn: "Figure 1: Coastal geology map of Kampong Som Bay and Sihanoukville Province (China Geological Survey & GDMR, 2018)",
    leadKm: "អាត្លាសបរិស្ថានភូគព្ភសាស្ត្រឆ្នេរសមុទ្រខេត្តព្រះសីហនុ និងឆកសមុទ្រកំពង់សោម គឺជាស្នាដៃស្រាវជ្រាវរួមគ្នារវាងការិយាល័យស្ទង់ភូគព្ភសាស្ត្រចិន (CGS - Qingdao Institute of Marine Geology) និងអគ្គនាយកដ្ឋានធនធានរ៉ែ (GDMR) នៃក្រសួងរ៉ែ និងថាមពលកម្ពុជា។ ការសិក្សានេះគ្របដណ្តប់លើផ្ទៃក្រឡា ៣.៥០០ គ.ម² និងប្រវែងឆ្នេរ ១៨០ គ.ម ដោយបានអនុវត្តការវាស់ស្ទង់រំញ័រដីរាក់ (Shallow seismic profiling) ការវិភាគល្បាប់បាតសមុទ្រ លក្ខណៈរូប-គីមីទឹកសមុទ្រ គំរូជលឌីណាមិកជំនោរ និងចរន្តទឹក ការប្រែប្រួលគម្របដី និងការវាយតម្លៃគ្រោះថ្នាក់ភូគព្ភសាស្ត្រឆ្នេរ។",
    leadEn: "The Coastal Geo-Environment Atlas of Kampong Som Bay and Sihanoukville represents the foundational marine geological baseline for Cambodia, produced through bilateral scientific collaboration between the Qingdao Institute of Marine Geology (China Geological Survey) and the General Department of Mineral Resources (GDMR), Ministry of Mines and Energy. Covering 3,500 km² and 180 km of coastline, this comprehensive investigation integrates high-resolution shallow seismic stratigraphy, seabed surface sedimentology, oceanographic water properties, hydrodynamic tidal modeling, decadal land use change, and engineering geohazard assessments.",
    stats: [
      { labelKm: "ផ្ទៃក្រឡាស្ទង់មតិឆ្នេរ", labelEn: "Offshore Survey Area", value: "3,500 km² (Kampong Som Bay)" },
      { labelKm: "ប្រវែងខ្សែឆ្នេរស្ទង់", labelEn: "Surveyed Coastline", value: "~180 km (>33% national coast)" },
      { labelKm: "កម្រាស់ល្បាប់ហូឡូសែន", labelEn: "Holocene Sediment Fill", value: "3 – 9 m (incised paleovalleys)" },
      { labelKm: "បេសកកម្មស្ទង់រួមគ្នា", labelEn: "Joint Survey Expedition", value: "CGS Qingdao & GDMR (April 2018)" },
    ],
    keyHighlightsKm: [
      "អាត្លាសភូគព្ភសាស្ត្រឆ្នេរសមុទ្រចិន‑កម្ពុជា ដំបូងគេបង្អស់សម្រាប់ឆកសមុទ្រកំពង់សោម និងខេត្តព្រះសីហនុ ផ្អែកលើការស្ទង់មតិផ្ទាល់នៅខែមីនា-មេសា ២០១៨",
      "ល្បាប់បាតសមុទ្រ៖ ភក់នៅផ្នែកខាងក្នុងឆកសមុទ្រ ល្បាប់ខ្សាច់គ្របដណ្តប់ភាគច្រើន និងខ្សាច់ល្បាប់ប្រមូលផ្តុំជុំវិញកំពង់ផែស្វយ័តក្រុងព្រះសីហនុ",
      "លក្ខណៈទឹកសមុទ្រ៖ សីតុណ្ហភាព ២៩,៥‑៣១,៥ °C ភាពប្រៃ ២៤‑៣២ PSU ភាពល្អក់ ០‑១២ NTU ជាមួយនឹងឥទ្ធិពលទឹកសាបពីព្រែកពិភូត និងស្រែអំបិលនៅភាគខាងជើង",
      "គំរូជលឌីណាមិក៖ ការចាក់ដីបំពេញសមុទ្រអាចកាត់បន្ថយបរិមាណទឹកជំនោរ (Tidal prism) ប្រមាណ ២០‑២៦% និងកាត់បន្ថយល្បឿនចរន្តទឹកអតិបរមា",
      "ស្រទាប់ល្បាប់ហូឡូសែនក្រាស់ ៣‑៩ ម៉ែត្រ គ្របដណ្ដប់លើរចនាសម្ព័ន្ធជ្រលងកាត់បុរាណ ព្រមទាំងរកឃើញប្រឡាយរេចរឹល កំពូលខ្សាច់រំកិល និងហោប៉ៅឧស្ម័នរាក់",
      "ការប្រែប្រួលគម្របដី (២០០១–២០១៧)៖ ការថយចុះគម្របព្រៃឈើ និងការកើនឡើងគួរឱ្យកត់សម្គាល់នៃដីទទេ និងដីទីក្រុង/សំណង់ជុំវិញកំពង់ផែ និងឆ្នេរ",
    ],
    keyHighlightsEn: [
      "Pioneering China-Cambodia marine and coastal geo-environment atlas covering 3,500 km² and 180 km of coastline in Sihanoukville and Kampong Som Bay (April 2018 survey)",
      "Seafloor surface sediments: inner bay muds, extensive sandy silt blankets, and coarse silty sands flanking Sihanoukville deepwater commercial port",
      "Oceanographic baseline: sea temperature 29.5–31.5 °C, salinity 24–32 PSU, turbidity 0–12 NTU, modulated by Preak Piphot and Srae Ambel river freshwater plumes",
      "Hydrodynamic numerical modeling reveals coastal reclamation reduces bay tidal prism by 20–26% and attenuates peak tidal flow velocities",
      "High-resolution seismic profiling maps 3–9 m Holocene sediment fills above incised bedrock paleovalleys, identifying shallow biogenic gas pockets and mobile sand ridges",
      "Decadal satellite monitoring (2001–2017) documents rapid urban and infrastructure expansion alongside clearance of coastal vegetation cover",
    ],
    sections: [
      {
        titleKm: "១. អំពីអាត្លាស និងកិច្ចសហប្រតិបត្តិការស្ទង់មតិភូគព្ភសាស្ត្រសមុទ្រ (About the Atlas & Joint Marine Survey)",
        titleEn: "1. About the Atlas and China-Cambodia Joint Marine Geological Survey",
        bodyKm: [
          "អាត្លាសបរិស្ថានភូគព្ភសាស្ត្រឆ្នេរសមុទ្រខេត្តព្រះសីហនុ និងឆកសមុទ្រកំពង់សោម គ្របដណ្តប់លើដែនដីរដ្ឋបាលខេត្តព្រះសីហនុ និងដែនទឹកសមុទ្រជិតច្រាំងលើផ្ទៃក្រឡាប្រមាណ ៣.៥០០ គីឡូម៉ែត្រការ៉េ។ ខេត្តព្រះសីហនុស្ថិតនៅត្រង់ច្រកចូលភាគខាងត្បូងនៃឆកសមុទ្រកំពង់សោម បែរមុខទៅកាន់ឈូងសមុទ្រថៃភាគអាគ្នេយ៍ ដោយមានប្រវែងខ្សែឆ្នេរប្រមាណ ១៨០ គីឡូម៉ែត្រ (ស្មើនឹងជាងមួយភាគបីនៃប្រវែងឆ្នេរសរុបរបស់ប្រទេសកម្ពុជា) និងជាទីតាំងនៃកំពង់ផែស្វយ័តក្រុងព្រះសីហនុ ដែលជាកំពង់ផែពាណិជ្ជកម្មទឹកជ្រៅតែមួយគត់របស់កម្ពុជា។",
          "នៅក្នុងអារម្ភកថានៃអាត្លាស បានគូសបញ្ជាក់ថា កម្ពុជាពីមុនពុំទាន់មានស្ថាប័នឯកទេសខាងការស្ទង់មតិភូគព្ភសាស្ត្រសមុទ្រនៅឡើយទេ ធ្វើឱ្យការស្រាវជ្រាវផ្នែកភូគព្ភសាស្ត្រសមុទ្រស្ទើរតែស្ថិតក្នុងភាពទទេស្អាត ខណៈពេលដែលការអភិវឌ្ឍតំបន់ឆ្នេរ និងសមុទ្រនៅខេត្តព្រះសីហនុកំពុងកើនឡើងយ៉ាងគំហុក។ អាត្លាសនេះត្រូវបានចងក្រងឡើងដោយអ្នកនិពន្ធជាការវិភាគបឋមផ្អែកលើការស្ទង់មតិផ្ទាល់នៅឆកសមុទ្រកំពង់សោម។",
          "កិច្ចព្រមព្រៀងសហប្រតិបត្តិការ៖ ត្រូវបានចុះហត្ថលេខានៅទីក្រុងប៉េកាំង កាលពីថ្ងៃទី ១៦ ខែមេសា ឆ្នាំ ២០១៧ រវាងការិយាល័យស្ទង់ភូគព្ភសាស្ត្រចិន (CGS - ក្រសួងដីធ្លី និងធនធានធម្មជាតិចិន) និងអគ្គនាយកដ្ឋានធនធានរ៉ែ (GDMR - ក្រសួងរ៉ែ និងថាមពលកម្ពុជា) ក្រោមកិច្ចព្រមព្រៀងអនុស្សរណៈនៃការយោគយល់គ្នា (MOU) ឆ្នាំ ២០១៦។ គម្រោងនេះមានឈ្មោះថា «Marine Geoscience and Coastal Geo-hazards» មានរយៈពេល ៤ ឆ្នាំ (២០១៧-២០២០) ក្នុងគោលបំណងកសាងសមត្ថភាពមន្ត្រីជំនាញកម្ពុជាតាមរយៈការចែករំលែកបច្ចេកទេសផែនទីភូគព្ភសាស្ត្រ-ភូរូបវិទ្យាទាំងលើគោក និងក្នុងទឹក ការត្រួតពិនិត្យ និងវាយតម្លៃហានិភ័យគ្រោះថ្នាក់ភូគព្ភសាស្ត្រឆ្នេរ និងការចងក្រងស៊េរីផែនទីភូគព្ភសាស្ត្រសមុទ្រ។",
          "ការចុះអនុវត្តការងារផ្ទាល់៖ នៅខែមីនា-មេសា ឆ្នាំ ២០១៨ វិទ្យាស្ថានភូគព្ភសាស្ត្រសមុទ្រឈីងដាវ (Qingdao Institute of Marine Geology - CGS) និង GDMR បានចុះអនុវត្តការស្ទង់មតិរួមគ្នានៅឆកសមុទ្រកំពង់សោម ដែលរួមមាន ការវាស់ស្ទង់រំញ័រដីរាក់កាត់ស្រទាប់សិលាឆ្នេរ (Shallow seismic profiles) ការត្រួតពិនិត្យទម្រង់ឆ្នេរខ្សាច់ (Beach profiles) ការប្រមូលសំណាកល្បាប់ផ្ទៃបាតសមុទ្រ (Seabed sediment sampling) និងការវាស់ស្ទង់ឌីណាមិកល្បាប់ លក្ខណៈទឹក និងចរន្តទឹកសមុទ្រ ព្រមទាំងការបណ្តុះបណ្តាលវិភាគទិន្នន័យនៅខែតុលា-ធ្នូ ឆ្នាំ ២០១៨។",
        ],
        bodyEn: [
          "The Coastal Geo-Environment Atlas of Kampong Som Bay covers the administrative territory of Sihanoukville Province and the nearshore marine realm across approximately 3,500 km². Sihanoukville commands the southern entrance to Kampong Som Bay, facing the southeastern Gulf of Thailand. Its ~180 km coastline accounts for more than one-third of Cambodia's total coastline and hosts the Sihanoukville Autonomous Port, the nation's premier deepwater maritime gateway.",
          "The atlas preface highlights that Cambodia historically lacked a specialized marine geological survey agency, leaving marine geoscientific knowledge largely undocumented even as rapid urban and industrial coastal expansion accelerated. The atlas represents the first comprehensive, empirical marine geological baseline produced for Kampong Som Bay.",
          "Cooperation Agreement: Formally executed in Beijing on 16 April 2017 between the China Geological Survey (CGS, Ministry of Land and Resources of China) and the General Department of Mineral Resources (GDMR, Ministry of Mines and Energy of Cambodia), following a foundational 2016 bilateral geoscience MOU. The 4-year project (2017–2020), titled 'Marine Geoscience and Coastal Geo-hazards', aimed to build local scientific capacity through joint marine and terrestrial geological-geophysical mapping, coastal hazard monitoring, and the compilation of a standardized marine map series.",
          "Field Campaign: In March–April 2018, the Qingdao Institute of Marine Geology (QIMG/CGS) and GDMR deployed research vessels in Kampong Som Bay to execute high-resolution shallow seismic profiling, seabed sediment grab sampling, coastal oceanographic water-column dynamics measurements, and beach profile surveys, followed by joint analytical training in Qingdao in late 2018.",
        ],
        image: "/images/marine-geology/survey_photos.jpg",
        imageCaptionKm: "រូបភាពទី ២៖ សកម្មភាពការងារស្ទង់មតិភូគព្ភសាស្ត្រឆ្នេរសមុទ្ររួមគ្នាកម្ពុជា-ចិន នៅឆកសមុទ្រកំពង់សោម (ខែមេសា ២០១៨)៖ ការប្រមូលសំណាកលើកប៉ាល់ ការវាស់ស្ទង់ឌីណាមិកល្បាប់ ការវាស់រំញ័រដីរាក់ និងការតាមដានឆ្នេរខ្សាច់ (CGS / GDMR, 2018)",
        imageCaptionEn: "Figure 2: China-Cambodia joint coastal geological survey at Kampong Som Bay (April 2018): shipboard sampling, sediment dynamics monitoring, shallow seismic profiling, and beach topographic surveys (China Geological Survey & GDMR, 2018)",
      },
      {
        titleKm: "២. ភូគព្ភសាស្ត្រឆ្នេរ និងសណ្ឋានដីបាតសមុទ្រ (Coastal Bedrock Geology & Seabed Topography)",
        titleEn: "2. Coastal Bedrock Geology, Contact Metamorphism, and Bathymetry",
        bodyKm: [
          "ផែនទីភូគព្ភសាស្ត្រឆ្នេរសមុទ្របែងចែកឯកតាសិលាមូលដ្ឋាន និងស្រទាប់គ្របដណ្តប់ជុំវិញឆកសមុទ្រកំពង់សោម ចាប់ពីសិលាបុរាណរហូតដល់សិលាក្មេងបំផុត៖ (១) ដេវ៉ូនៀន-កាបូនីហ្វែរ (Devonian–Carboniferous)៖ ថ្មសែល (shale), ថ្មភ្តានីត/ឆឺត (phtanite/chert) និងថ្មភក់; (២) ភឺមៀន (Ouralo-Permian)៖ ថ្មកំបោរជីវសរីរាង្គ (organogenic limestone); (៣) ទ្រីយ៉ាស (Triassic)៖ ថ្មភក់ និងប្រេស៊ីល្អិត (microbreccias); (៤) ជូរ៉ាស៊ីកកណ្តាលដល់ក្រេតាសេក្រោម៖ ថ្មដីឥដ្ឋ (claystone), ថ្មគ្រួសក្រាន (conglomerate) និងថ្មភក់ខាងលើ; (៥) ជូរ៉ាស៊ីក-ក្រេតាសេ៖ សិលាភ្នំភ្លើងរីយ៉ូលីត (rhyolites) និងដាស៊ីត (dacite) ព្រមទាំងសិលាហនហ្វែល (hornfels) ដែលកកើតឡើងពីបាតុភូតបំផ្លាស់រូបប៉ះទង្គិចកម្តៅ (contact metamorphism); (៦) ក្វាតែណែរ (Quaternary)៖ ថ្មបាសាល់ (basalt), ដីល្បាប់ចាស់ និងដីឡាទេរីត (old alluvium and laterite), ខ្សាច់អេលុយវីយ៉ាល, កូលុយវីយ៉ាល និងដីល្បាប់ទន្លេ និងឆ្នេរសមុទ្រក្មេងៗ។",
          "នៅលើផែនទី ឯកតាសិលាហនហ្វែល (hornfels) ពណ៌បៃតងចាស់ បង្ហាញវត្តមាននៅក្រោមឧបទ្វីបកំពង់ផែក្រុងព្រះសីហនុ និងជ្រោយមាត់សមុទ្រជុំវិញ ដែលបញ្ជាក់អំពីការជ្រៀតចូលនៃម៉ាក់ម៉ាក្រានីតកាត់សិលាស្រទាប់ sedimentary ក្នុងអតីតកាល។ លើសពីនេះ សិលាក្រានីតស្រែអំបិល (Sre Ambel granites) ត្រូវបានកំណត់អាយុប្រហែល ២០១–២០៥ Ma (ទ្រីយ៉ាសចុងដល់ជូរ៉ាស៊ីកដើម)។",
          "ផែនទីសណ្ឋានដីឆ្នេរ និងបាតសមុទ្រ (Topography & Bathymetry) បង្ហាញកម្ពស់ដីគោក និងជម្រៅទឹកបាតសមុទ្រក្នុងមាត្រដ្ឋានតែមួយ៖ ផ្ទៃទឹកក្នុងឆកសមុទ្រកំពង់សោមភាគច្រើនមានជម្រៅរាក់ចន្លោះពី ០ ដល់ -១០ ម៉ែត្រ ហើយជម្រៅទឹកកើនឡើងជាលំដាប់ដល់ -១៥ ទៅ -២០ ម៉ែត្រ នៅតំបន់ច្រកចូលភាគនិរតីចន្លោះកោះរ៉ុង កោះរ៉ុងសន្លឹម និងឧបទ្វីបក្រុងព្រះសីហនុ។",
        ],
        bodyEn: [
          "The coastal geological map delineates bedrock formations and unconsolidated cover surrounding the bay across a comprehensive chronostratigraphic spectrum: (1) Devonian–Carboniferous: shales, phtanites (cherts), and sandstones; (2) Permian: biogenic and organogenic limestones; (3) Triassic: sandstones and volcano-sedimentary microbreccias; (4) Middle Jurassic–Lower Cretaceous: continental claystones, basal conglomerates, and upper cliff-forming sandstones; (5) Jurassic–Cretaceous: extrusive rhyolites, dacites, and contact-metamorphic hornfels aureoles; and (6) Quaternary: plateau basalts, older alluvium/laterite carapaces, eluvial sands, colluvial slopes, and modern beach-delta deposits.",
          "Notably, contact-metamorphic hornfels units underpin the Sihanoukville Port promontory and flanking headlands, demonstrating intense thermal recrystallization of Mesozoic country rock against intermediate-felsic plutons. Regional plutonism is further exemplified by the Sre Ambel granites dated at ~201–205 Ma (latest Triassic to earliest Jurassic).",
          "A unified topographic-bathymetric digital elevation model illustrates coastal relief and seafloor depth: inner Kampong Som Bay forms a sheltered shallow basin primarily under 10 m water depth, deepening gradually southwestward into open-marine bathymetric corridors (-15 to -20 m) between Koh Rong, Koh Rong Sanloem, and the Sihanoukville mainland.",
        ],
        images: [
          {
            url: "/images/marine-geology/geology.jpg",
            captionKm: "រូបភាពទី ៣៖ ផែនទីភូគព្ភសាស្ត្រឆ្នេរសមុទ្រនៃឆកសមុទ្រកំពង់សោម និងខេត្តព្រះសីហនុ បង្ហាញឯកតាសិលាពីដេវ៉ូនៀនដល់ក្វាតែណែរ និងសិលាហនហ្វែលនៅកំពង់ផែ (CGS / GDMR, 2018)",
            captionEn: "Figure 3: Coastal geological map of Kampong Som Bay and Sihanoukville, showing Paleozoic to Quaternary bedrock units and metamorphic hornfels beneath the port (CGS & GDMR, 2018)",
          },
          {
            url: "/images/marine-geology/topography.jpg",
            captionKm: "រូបភាពទី ៤៖ ផែនទីសណ្ឋានដីឆ្នេរ និងជម្រៅទឹកបាតសមុទ្រ (Bathymetry) នៃឆកសមុទ្រកំពង់សោម ចន្លោះពី ០ ដល់ -២០ ម៉ែត្រ (CGS / GDMR, 2018)",
            captionEn: "Figure 4: Coastal topography and marine bathymetry of Kampong Som Bay, illustrating seabed contours from 0 to -20 m depth (CGS & GDMR, 2018)",
          },
        ],
      },
      {
        titleKm: "៣. លក្ខណៈល្បាប់ផ្ទៃបាតសមុទ្រ និងសមាសភាពរ៉ែដីឥដ្ឋ (Seabed Surface Sediments & Grain Size Distribution)",
        titleEn: "3. Seafloor Surface Sediments, Grain-Size Granulometry, and Clay Minerals",
        bodyKm: [
          "សំណាកល្បាប់ផ្ទៃបាតសមុទ្រដែលប្រមូលបានដោយឧបករណ៍ grab sampler ត្រូវបានយកទៅវិភាគទំហំគ្រាប់ (grain size) និងសមាសភាពរ៉ែដីឥដ្ឋ (clay minerals)។ យោងតាមប្រព័ន្ធចំណាត់ថ្នាក់ Folk (Folk sediment classification) ល្បាប់បាតសមុទ្រនៅឆកកំពង់សោមចែកចេញជា ៥ ប្រភេទចម្បង៖ ភក់ (Mud - M), ភក់ខ្សាច់ (Sandy mud - sM), ល្បាប់/ស៊ីលត៍ (Silt - Z), ល្បាប់ខ្សាច់ (Sandy silt - sZ), និងខ្សាច់ល្បាប់ (Silty sand - zS)។",
          "ការបែងចែកលំហនៃល្បាប់បាតសមុទ្របង្ហាញយ៉ាងច្បាស់ថា៖",
          "• ប្រភេទភក់ (Mud)៖ ប្រមូលផ្តុំនៅផ្នែកខាងជើង និងខាងក្នុងឆកសមុទ្រ ដោយសារជាតំបន់រាក់ មានចរន្តទឹកស្ងប់ និងទទួលល្បាប់ម៉ដ្ឋពីទន្លេស្រែអំបិល និងព្រែកពិភូត។",
          "• ប្រភេទល្បាប់ខ្សាច់ (Sandy silt)៖ គ្របដណ្តប់លើផ្ទៃក្រឡាធំទូលាយបំផុតនៅទូទាំងឆកសមុទ្រកណ្តាល។",
          "• ប្រភេទខ្សាច់ល្បាប់ (Silty sand)៖ ប្រមូលផ្តុំនៅជុំវិញច្រកចេញចូលកំពង់ផែក្រុងព្រះសីហនុ និងតំបន់ចន្លោះកោះរ៉ុង ដែលជាកន្លែងមានថាមពលរលក និងចរន្តទឹកខ្លាំង។",
          "• មេគុណតម្រៀបគ្រាប់ (Sorting coefficient)៖ ល្បាប់បាតសមុទ្រភាគច្រើនមានការតម្រៀបមិនល្អ (poorly sorted) ទៅមិនល្អខ្លាំង (very poorly sorted) ដែលឆ្លុះបញ្ចាំងពីប្រភពល្បាប់ចម្រុះរវាងទន្លេ ឆ្នេរខ្សាច់ និងការហូរច្រោះថ្មឆ្នេរ។",
        ],
        bodyEn: [
          "Systematic seabed grab sampling calibrated grain size granulometry and clay mineral suites. Classified under the Folk sediment nomenclature, Kampong Som Bay displays five primary seabed facies: Mud (M), Sandy Mud (sM), Silt (Z), Sandy Silt (sZ), and Silty Sand (zS).",
          "Spatial distribution patterns reveal clear sedimentological partitioning across the coastal-marine system:",
          "• Mud (M) facies dominate the northern inner bay, where shallow sheltered waters promote suspension settling from the Preak Piphot and Srae Ambel river networks.",
          "• Sandy Silt (sZ) constitutes the most widespread seabed cover across the central bay floor.",
          "• Silty Sand (zS) accumulates along high-energy dynamic zones, specifically around the Sihanoukville Port approach channel and the island passes between Koh Rong and the mainland.",
          "• Grain sorting coefficients confirm that seabed sediments are predominantly poorly sorted to very poorly sorted, reflecting polymodal inputs from terrigenous river run-off, littoral beach drift, and coastal bedrock weathering.",
        ],
        images: [
          {
            url: "/images/marine-geology/sed_class.jpg",
            captionKm: "រូបភាពទី ៥៖ ចំណាត់ថ្នាក់ល្បាប់ផ្ទៃបាតសមុទ្រតាម Folk (ភក់ M, ភក់ខ្សាច់ sM, ល្បាប់ Z, ល្បាប់ខ្សាច់ sZ, និងខ្សាច់ល្បាប់ zS) ក្នុងឆកសមុទ្រកំពង់សោម (CGS / GDMR, 2018)",
            captionEn: "Figure 5: Seafloor surface sediment classification under Folk scheme (Mud, Sandy Mud, Silt, Sandy Silt, and Silty Sand) across Kampong Som Bay (CGS & GDMR, 2018)",
          },
          {
            url: "/images/marine-geology/sand.jpg",
            captionKm: "រូបភាពទី ៦៖ ផែនទីកំហាប់ភាគរយខ្សាច់ (Sand Content %) ក្នុងល្បាប់បាតសមុទ្រ ពី <១០% ដល់ >៩០% (CGS / GDMR, 2018)",
            captionEn: "Figure 6: Seafloor sand percentage distribution (Sand Content %), ranging from <10% in inner bay to >90% in littoral passes (CGS & GDMR, 2018)",
          },
          {
            url: "/images/marine-geology/clay.jpg",
            captionKm: "រូបភាពទី ៧៖ ផែនទីកំហាប់ភាគរយដីឥដ្ឋ (Clay Content %) ក្នុងល្បាប់បាតសមុទ្រ ខ្ពស់បំផុតនៅតំបន់ឆកខាងក្នុង (CGS / GDMR, 2018)",
            captionEn: "Figure 7: Seafloor clay percentage distribution (Clay Content %), peaking in protected northern inner bay depocenters (CGS & GDMR, 2018)",
          },
          {
            url: "/images/marine-geology/mean_grain.jpg",
            captionKm: "រូបភាពទី ៨៖ ផែនទីទំហំគ្រាប់មធ្យម (Mean Grain Size, phi) នៃល្បាប់ផ្ទៃបាតសមុទ្រ (CGS / GDMR, 2018)",
            captionEn: "Figure 8: Mean sediment grain size distribution (phi scale) across the seabed of Kampong Som Bay (CGS & GDMR, 2018)",
          },
          {
            url: "/images/marine-geology/sorting.jpg",
            captionKm: "រូបភាពទី ៩៖ ផែនទីមេគុណតម្រៀបគ្រាប់ល្បាប់ (Sorting Coefficient) បង្ហាញកម្រិតមិនល្អ (poorly) ដល់មិនល្អខ្លាំង (very poorly sorted) (CGS / GDMR, 2018)",
            captionEn: "Figure 9: Sediment sorting coefficient map across Kampong Som Bay, documenting predominantly poorly sorted seabed clastics (CGS & GDMR, 2018)",
          },
        ],
      },
      {
        titleKm: "៤. លក្ខណៈរូប-គីមីនៃទឹកសមុទ្រ និងឌីណាមិកល្បាប់ (Oceanographic Water Properties & Dynamics)",
        titleEn: "4. Oceanographic Water Properties, Salinity Gradients, and Water-Column Dynamics",
        bodyKm: [
          "ការស្ទង់មតិឌីណាមិកល្បាប់ (Sediment dynamics survey) បានវាស់វែងគុណភាពទឹកសមុទ្រទាំងនៅស្រទាប់ផ្ទៃលើ (surface) និងស្រទាប់បាត (bottom) ក្នុងអំឡុងខែមីនា-មេសា ឆ្នាំ ២០១៨។ លទ្ធផលបង្ហាញពីដែនកំណត់តូចចង្អៀតនៃប៉ារ៉ាម៉ែត្ររូប-គីមីសមុទ្រ៖",
          "• សីតុណ្ហភាពទឹក (Temperature)៖ ២៩,៥ ដល់ ៣១,៥ °C ដោយសីតុណ្ហភាពនៅស្រទាប់លើ និងស្រទាប់បាតមានគម្លាតគ្នាតិចតួច។",
          "• ភាពប្រៃ (Salinity)៖ ចន្លោះពី ២៤ ដល់ ៣២ PSU ដោយសារឥទ្ធិពលទឹកសាបហូរចាក់ពីទន្លេនៅភាគខាងជើង (ព្រែកពិភូត និងស្រែអំបិល) បង្កើតបានជាជម្រាលភាពប្រៃថយចុះពីខាងក្រៅឆកចូលទៅខាងក្នុង។",
          "• ភាពល្អក់ (Turbidity)៖ ចន្លោះពី ០ ដល់ ១២ NTU ដោយកម្រិតល្អក់ខ្ពស់បំផុតត្រូវបានកត់ត្រានៅតំបន់មាត់ទន្លេ និងតំបន់រាក់ជិតច្រាំង។",
          "• អុកស៊ីសែនរលាយ (Dissolved Oxygen - DO)៖ ស្ថិតក្នុងកម្រិតល្អសម្រាប់ប្រព័ន្ធអេកូឡូស៊ីសមុទ្រ។",
        ],
        bodyEn: [
          "Sediment dynamics and coastal hydrographic investigations systematically sampled the water column at surface and near-bottom horizons during the March–April 2018 survey, establishing Cambodia's benchmark coastal oceanographic parameters:",
          "• Water Temperature: Ranges from 29.5 to 31.5 °C, exhibiting minimal thermal stratification between surface and bottom horizons.",
          "• Salinity Gradient: Varies from 24 to 32 PSU, clearly delineating freshwater dilution plumes entering from the northern Preak Piphot and Srae Ambel estuaries.",
          "• Turbidity: Measured between 0 and 12 NTU, with highest suspended sediment turbidity focused near river mouths and shallow intertidal shoals.",
          "• Dissolved Oxygen (DO): Consistently healthy throughout the surveyed column, supporting vibrant shallow-marine and estuarine ecosystems.",
        ],
        table: {
          captionKm: "តារាងទី ១៖ កម្រិតប៉ារ៉ាម៉ែត្ររូប-គីមីទឹកសមុទ្រក្នុងឆកសមុទ្រកំពង់សោម (ខែមីនា-មេសា ២០១៨)",
          captionEn: "Table 1: Oceanographic water property ranges and surveyed horizons in Kampong Som Bay (March–April 2018)",
          headersKm: ["លក្ខណៈរូប-គីមី (Property)", "ចន្លោះតម្លៃវាស់ (Measured Range)", "ស្រទាប់ដែលបានវាស់ស្ទង់ (Surveyed Horizons)", "សារៈសំខាន់បរិស្ថាន (Environmental Significance)"],
          headersEn: ["Oceanographic Property", "Measured Range", "Surveyed Horizons", "Environmental Significance"],
          rowsKm: [
            ["សីតុណ្ហភាពទឹក (Temperature)", "២៩,៥ – ៣១,៥ °C", "ស្រទាប់លើ និងស្រទាប់បាត", "លក្ខខណ្ឌត្រូពិចក្តៅឧណ្ហៗ, គ្មានការបែងចែកកម្ដៅខ្លាំង"],
            ["ភាពប្រៃ (Salinity)", "២៤ – ៣២ PSU", "ស្រទាប់លើ និងស្រទាប់បាត", "ជម្រាលប្រៃពីក្រៅឆកចូលក្នុង, ឥទ្ធិពលទឹកសាបទន្លេស្រែអំបិល"],
            ["ភាពល្អក់ (Turbidity)", "០ – ១២ NTU", "ស្រទាប់លើ និងស្រទាប់បាត", "ល្អក់ខ្លាំងនៅមាត់ទន្លេ, ថ្លានៅច្រកសមុទ្របើកចំហ"],
            ["អុកស៊ីសែនរលាយ (Dissolved Oxygen)", "កម្រិតទ្រទ្រង់ជីវិតពេញលេញ", "ស្រទាប់លើ និងស្រទាប់បាត", "គ្មានតំបន់ខ្វះអុកស៊ីសែន (No hypoxia), ល្អសម្រាប់ជលផល"],
            ["ដង់ស៊ីតេទឹកសមុទ្រ (Density)", "ស្របតាមភាពប្រៃ និងកម្ដៅ", "ស្រទាប់លើ និងស្រទាប់បាត", "កំណត់កម្លាំងអណ្តែត និងការផ្លាស់ប្តូរលំហូរចរន្ត"],
          ],
          rowsEn: [
            ["Water Temperature", "29.5 – 31.5 °C", "Surface & Bottom", "Warm tropical shelf waters, minimal vertical thermocline"],
            ["Salinity", "24 – 32 PSU", "Surface & Bottom", "Estuarine dilution gradient driven by Srae Ambel/Preak Piphot rivers"],
            ["Turbidity", "0 – 12 NTU", "Surface & Bottom", "Elevated suspended particulates in estuaries; clear in marine corridors"],
            ["Dissolved Oxygen", "Well-oxygenated baseline", "Surface & Bottom", "Absence of hypoxic dead zones; supports coral and fishery habitats"],
            ["Water Density", "Standard tropical seawater", "Surface & Bottom", "Governs buoyancy, stratification, and tidal mixing dynamics"],
          ],
          footnoteKm: "ប្រភពទិន្នន័យ៖ Atlas of Kampong Som Bay Coastal Geo-Environment (China Geological Survey & GDMR, 2018).",
          footnoteEn: "Source: Atlas of Kampong Som Bay Coastal Geo-Environment (China Geological Survey & GDMR, 2018).",
        },
        images: [
          {
            url: "/images/marine-geology/temp.jpg",
            captionKm: "រូបភាពទី ១០៖ ផែនទីសីតុណ្ហភាពផ្ទៃទឹកសមុទ្រ (Surface Temperature, ២៩,៥–៣១,៥ °C) (CGS / GDMR, 2018)",
            captionEn: "Figure 10: Seafloor and surface water temperature map across Kampong Som Bay (29.5–31.5 °C) (CGS & GDMR, 2018)",
          },
          {
            url: "/images/marine-geology/salinity.jpg",
            captionKm: "រូបភាពទី ១១៖ ផែនទីភាពប្រៃនៃទឹកសមុទ្រ (Surface Salinity, ២៤–៣២ PSU) បង្ហាញការថយចុះនៅមាត់ព្រែក (CGS / GDMR, 2018)",
            captionEn: "Figure 11: Surface salinity map across Kampong Som Bay (24–32 PSU), showing freshwater discharge plumes (CGS & GDMR, 2018)",
          },
          {
            url: "/images/marine-geology/turb.jpg",
            captionKm: "រូបភាពទី ១២៖ ផែនទីភាពល្អក់នៃទឹកសមុទ្រ (Surface Turbidity, ០–១២ NTU) (CGS / GDMR, 2018)",
            captionEn: "Figure 12: Surface turbidity distribution across Kampong Som Bay, peaking in nearshore estuaries (0–12 NTU) (CGS & GDMR, 2018)",
          },
          {
            url: "/images/marine-geology/do.jpg",
            captionKm: "រូបភាពទី ១៣៖ ផែនទីកំហាប់អុកស៊ីសែនរលាយក្នុងទឹកសមុទ្រ (Surface Dissolved Oxygen) (CGS / GDMR, 2018)",
            captionEn: "Figure 13: Surface dissolved oxygen map across Kampong Som Bay, documenting healthy marine aeration (CGS & GDMR, 2018)",
          },
        ],
      },
      {
        titleKm: "៥. ជំនោរ ចរន្តទឹក និងគំរូជលឌីណាមិក (Tides, Currents & Hydrodynamic Numerical Modeling)",
        titleEn: "5. Tides, Tidal Current Fields, and Hydrodynamic Impact Modeling",
        bodyKm: [
          "ការសិក្សាគំរូជលឌីណាមិកលេខ (Numerical hydrodynamic modeling) បានប្រៀបធៀបរបបជំនោរ និងចរន្តទឹកសមុទ្រក្រោម ៣ សេណារីយ៉ូ៖ (១) ស្ថានភាពធម្មជាតិ (Natural state); (២) ក្រោយការសាងសង់ស្ពានតេជោមរកត (After bridge); និង (៣) ក្រោយការចាក់ដីបំពេញឆ្នេរសមុទ្រ (After reclamation)។",
          "លទ្ធផលគណនាបានបង្ហាញពីការប្រែប្រួលយ៉ាងច្បាស់លើបរិមាណទឹកជំនោរ (Tidal prism)៖",
          "• ក្នុងស្ថានភាពធម្មជាតិ៖ បរិមាណទឹកជំនោរអតិបរមាគឺ ១,៥៤ × ១០⁹ ម³ និងអប្បបរមា ១,០៤ × ១០⁹ ម³។",
          "• ក្រោយការសាងសង់ស្ពាន៖ បរិមាណទឹកជំនោរអតិបរមាប្រែប្រួលបន្តិចបន្តួចដល់ ១,៥៨ × ១០⁹ ម³ និងអប្បបរមា ១,២២ × ១០⁹ ម³។",
          "• ក្នុងសេណារីយ៉ូបំពេញដីសមុទ្រ (Reclamation)៖ បរិមាណទឹកជំនោរអតិបរមាថយចុះមកត្រឹម ១,២៣ × ១០⁹ ម³ (ថយចុះប្រមាណ ២០%) និងអប្បបរមាថយចុះមកត្រឹម ០,៧៧ × ១០⁹ ម³ (ថយចុះប្រមាណ ២៦%) ព្រមទាំងធ្វើឱ្យល្បឿនចរន្តទឹកអតិបរមានៅក្នុងឆកសមុទ្រថយចុះផងដែរ។ នេះជាទិន្នន័យគន្លឹះសម្រាប់ការរៀបចំដែនសមុទ្រ និងការការពារការកកកុញល្បាប់នៅកំពង់ផែ។",
        ],
        bodyEn: [
          "Hydrodynamic numerical modeling evaluated tidal regimes and current vectors across three distinct coastal engineering scenarios: (1) Natural baseline state; (2) Post-construction of the Techo Morakat bridge; and (3) Full coastal land reclamation scenario.",
          "Model simulations quantify significant shifts in bay water exchange and tidal prism volumes:",
          "• Under the natural baseline: Maximum tidal prism reaches 1.54 × 10⁹ m³, with a minimum neap prism of 1.04 × 10⁹ m³.",
          "• After bridge construction: Maximum prism remains comparable at 1.58 × 10⁹ m³, with minimum prism at 1.22 × 10⁹ m³.",
          "• Under land reclamation: Maximum tidal prism drops to 1.23 × 10⁹ m³ (~20% reduction), and minimum prism plummets to 0.77 × 10⁹ m³ (~26% reduction). Simultaneously, peak tidal flow velocities attenuate significantly across the sheltered inner bay, highlighting crucial engineering implications for channel dredging and port sediment siltation.",
        ],
        table: {
          captionKm: "តារាងទី ២៖ ការប្រៀបធៀបបរិមាណទឹកជំនោរ (Tidal Prism) តាមសេណារីយ៉ូវិស្វកម្មឆ្នេរ",
          captionEn: "Table 2: Comparison of tidal prism volumes under simulated coastal engineering scenarios in Kampong Som Bay",
          headersKm: ["សេណារីយ៉ូ (Scenario)", "បរិមាណទឹកជំនោរអតិបរមា (Max Tidal Prism)", "បរិមាណទឹកជំនោរអប្បបរមា (Min Tidal Prism)", "ការប្រែប្រួលធៀបនឹងធម្មជាតិ (Impact vs Baseline)"],
          headersEn: ["Engineering Scenario", "Maximum Tidal Prism (×10⁹ m³)", "Minimum Tidal Prism (×10⁹ m³)", "Hydraulic Impact Relative to Baseline"],
          rowsKm: [
            ["ស្ថានភាពធម្មជាតិ (Natural State)", "១,៥៤ × ១០⁹ ម³", "១,០៤ × ១០⁹ ម³", "បន្ទាត់មូលដ្ឋានធម្មជាតិ (Baseline)"],
            ["ក្រោយសាងសង់ស្ពាន (After Bridge)", "១,៥៨ × ១០⁹ ម³", "១,២២ × ១០⁹ ម³", "ការប្រែប្រួលកម្រិតស្រាលក្នុងច្រកតូច"],
            ["ក្រោយចាក់ដីបំពេញ (After Reclamation)", "១,២៣ × ១០⁹ ម³", "០,៧៧ × ១០⁹ ម³", "ថយចុះ ២០% (អតិបរមា) និង ២៦% (អប្បបរមា) ធ្វើឱ្យចរន្តទឹករលាក់ថយខ្សោយ"],
          ],
          rowsEn: [
            ["Natural Baseline State", "1.54 × 10⁹ m³", "1.04 × 10⁹ m³", "Undisturbed natural hydrodynamic equilibrium"],
            ["After Bridge Construction", "1.58 × 10⁹ m³", "1.22 × 10⁹ m³", "Localized flow modification without regional exchange loss"],
            ["After Land Reclamation", "1.23 × 10⁹ m³", "0.77 × 10⁹ m³", "20% drop in max prism; 26% drop in min prism; induces sediment settling"],
          ],
          footnoteKm: "ប្រភពទិន្នន័យ៖ គំរូជលឌីណាមិកក្នុង Atlas of Kampong Som Bay Coastal Geo-Environment (CGS / GDMR, 2018).",
          footnoteEn: "Source: Hydrodynamic modeling from Atlas of Kampong Som Bay Coastal Geo-Environment (CGS & GDMR, 2018).",
        },
        images: [
          {
            url: "/images/marine-geology/tide_var.jpg",
            captionKm: "រូបភាពទី ១៤៖ ការប្រែប្រួលនៃកម្ពស់ទឹកជំនោរ និងល្បឿនចរន្តទឹកអតិបរមា (Natural vs Bridge vs Reclamation) (CGS / GDMR, 2018)",
            captionEn: "Figure 14: Variation of tidal range and maximum flow speed under natural, post-bridge, and post-reclamation scenarios (CGS & GDMR, 2018)",
          },
          {
            url: "/images/marine-geology/tidal_prism.jpg",
            captionKm: "រូបភាពទី ១៥៖ គំនូសបំព្រួញប្រៀបធៀបបរិមាណទឹកជំនោរ (Tidal Prism) ក្រោមសេណារីយ៉ូទាំង ៣ (CGS / GDMR, 2018)",
            captionEn: "Figure 15: Comparative chart of tidal prism volumes under baseline, bridge, and reclamation states (CGS & GDMR, 2018)",
          },
        ],
      },
      {
        titleKm: "៦. ការវិភាគការប្រែប្រួលគម្របដីឆ្នេរ ២០០១–២០១៧ (Decadal Coastal Land Use Change: 2001–2017)",
        titleEn: "6. Decadal Coastal Land Use and Shoreline Cover Dynamics (2001–2017)",
        bodyKm: [
          "ផែនទីការប្រើប្រាស់ដីឆ្នេរសមុទ្រក្នុងឆ្នាំ ២០០១, ២០១០ និង ២០១៧ ត្រូវបានចាត់ថ្នាក់ជា ៤ ប្រភេទធំៗ៖ ផ្ទៃទឹក (water), គម្របព្រៃឈើ/រុក្ខជាតិ (vegetation), ដីទទេ (bare soil), និងដីទីក្រុង/សំណង់ (urban/built land)។",
          "ការវិភាគប្រៀបធៀបបង្ហាញថា ក្នុងចន្លោះឆ្នាំ ២០០១ ដល់ ២០១៧៖",
          "• គម្របព្រៃឈើ និងរុក្ខជាតិឆ្នេរមានការថយចុះជាបន្តបន្ទាប់ ដោយសារការពង្រីកដីកសិកម្ម និងសំណង់អភិវឌ្ឍន៍។",
          "• ដីទទេ និងដីទីក្រុង/សំណង់មានការកើនឡើងយ៉ាងឆាប់រហ័ស ជាពិសេសនៅតំបន់ជុំវិញកំពង់ផែក្រុងព្រះសីហនុ មជ្ឈមណ្ឌលក្រុង និងតំបន់ឆ្នេរទេសចរណ៍សំខាន់ៗ។",
          "ការផ្លាស់ប្តូរគម្របដីនេះបានជះឥទ្ធិពលផ្ទាល់ដល់បរិមាណទឹកហូរច្រោះលើដីគោក និងការហូរនាំល្បាប់ចូលមកក្នុងឆកសមុទ្រ។",
        ],
        bodyEn: [
          "Multitemporal satellite remote sensing mapped coastal land cover across Sihanoukville for 2001, 2010, and 2017 into four major classes: water, vegetation, bare soil, and urban/built land.",
          "Decadal trend analysis highlights substantial anthropogenic transformation across the coastal strip:",
          "• Forest and littoral vegetation cover experienced persistent decline due to agricultural expansion and real-estate infrastructure clearing.",
          "• Bare soil and urban/built-up land expanded dramatically, primarily concentrated around Sihanoukville city center, the port peninsula, and tourism beach corridors.",
          "This rapid surface conversion directly impacts coastal watershed hydrology, accelerating terrestrial soil runoff and increasing fine sediment delivery into nearshore bays.",
        ],
        images: [
          {
            url: "/images/marine-geology/land2001.jpg",
            captionKm: "រូបភាពទី ១៦៖ ផែនទីគម្របដីឆ្នេរខេត្តព្រះសីហនុ ក្នុងឆ្នាំ ២០០១ (ទឹក, ព្រៃឈើ, ដីទទេ, ទីក្រុង) (CGS / GDMR, 2018)",
            captionEn: "Figure 16: Coastal land use and cover classification map of Sihanoukville Province in 2001 (CGS & GDMR, 2018)",
          },
          {
            url: "/images/marine-geology/land2017.jpg",
            captionKm: "រូបភាពទី ១៧៖ ផែនទីគម្របដីឆ្នេរខេត្តព្រះសីហនុ ក្នុងឆ្នាំ ២០១៧ បង្ហាញការកើនឡើងនៃដីទីក្រុង និងដីទទេ (CGS / GDMR, 2018)",
            captionEn: "Figure 17: Coastal land use and cover classification map of Sihanoukville Province in 2017, illustrating urban expansion (CGS & GDMR, 2018)",
          },
        ],
      },
      {
        titleKm: "៧. ប្រភេទខ្សែឆ្នេរ និងការត្រួតពិនិត្យទម្រង់ឆ្នេរខ្សាច់ (Shoreline Classification & Monitored Beach Profiles)",
        titleEn: "7. Shoreline Classification, Littoral Geomorphology, and Beach Profiles",
        bodyKm: [
          "ខ្សែឆ្នេរសមុទ្រខេត្តព្រះសីហនុត្រូវបានចាត់ថ្នាក់ជា ៤ ប្រភេទភូគព្ភសាស្ត្រចម្បង៖",
          "• ឆ្នេរភក់ (Muddy shoreline)៖ កើតមាននៅតាមតំបន់ឆកសមុទ្រខាងក្នុង និងមាត់ព្រែក ដែលមានព្រៃកោងកាងដុះលូតលាស់។",
          "• ឆ្នេរខ្សាច់ (Sandy shoreline)៖ ជាឆ្នេរទេសចរណ៍ដ៏ល្បីល្បាញប្រឈមនឹងរលកសមុទ្របើកចំហ ដូចជា ឆ្នេរអូរឈើទាល ឆ្នេរអូរត្រេះ ឆ្នេរសុខា និងឆ្នេរជ័យជំនះ។",
          "• ឆ្នេរថ្ម (Rocky shoreline)៖ ជួបប្រទះនៅជុំវិញកោះរ៉ុង កោះរ៉ុងសន្លឹម និងជ្រោយថ្មហនហ្វែល/ក្រានីត។",
          "• ឆ្នេរសិប្បនិម្មិត (Anthropogenic shoreline)៖ ប្រមូលផ្តុំនៅជុំវិញកំពង់ផែស្វយ័តក្រុងព្រះសីហនុ តំបន់ការពាររលក (breakwaters) និងទីតាំងចាក់ដី។",
          "ស្ថានីយត្រួតពិនិត្យទម្រង់ឆ្នេរខ្សាច់ (Beach profile monitoring stations) ត្រូវបានវាស់ស្ទង់ដើម្បីតាមដានទំនោរនៃការកកើតដីល្បាប់ និងការហូរច្រោះឆ្នេរ ដែលជាទិន្នន័យចាំបាច់សម្រាប់ការអភិរក្សឆ្នេរទេសចរណ៍ធម្មជាតិ។",
        ],
        bodyEn: [
          "The coast of Sihanoukville is categorized into four distinct geomorphological classes:",
          "• Muddy Shorelines: Dominate the sheltered inner Kampong Som Bay and mangrove-fringed estuarine river outlets.",
          "• Sandy Shorelines: Form extensive high-value tourist beaches facing open coastal waves, including Ochheuteal, Otres, Sokha, Independence, and Victory beaches.",
          "• Rocky Shorelines: Fringe the seaward perimeters of Koh Rong, Koh Rong Sanloem, and bedrock hornfels headlands.",
          "• Anthropogenic (Built) Shorelines: Concentrated around the Sihanoukville deepwater port, breakwaters, and seawall fortifications.",
          "Repeated topographic beach profiling across monitoring stations along Sihanoukville's beaches provides quantitative benchmarks to track seasonal beach erosion, berm retreat, and post-monsoon accretion.",
        ],
        images: [
          {
            url: "/images/marine-geology/coastline.jpg",
            captionKm: "រូបភាពទី ១៨៖ ចំណាត់ថ្នាក់ខ្សែឆ្នេរសមុទ្រខេត្តព្រះសីហនុ (ឆ្នេរខ្សាច់, ឆ្នេរថ្ម, ឆ្នេរភក់, និងឆ្នេរសិប្បនិម្មិត) (CGS / GDMR, 2018)",
            captionEn: "Figure 18: Coastal line classification map of Sihanoukville: sandy, rocky, muddy, and anthropogenic shorelines (CGS & GDMR, 2018)",
          },
          {
            url: "/images/marine-geology/beach_profile.jpg",
            captionKm: "រូបភាពទី ១៩៖ ផែនទីស្ថានីយត្រួតពិនិត្យទម្រង់ឆ្នេរខ្សាច់តាមបណ្តោយឆ្នេរសំខាន់ៗនៃក្រុងព្រះសីហនុ (CGS / GDMR, 2018)",
            captionEn: "Figure 19: Beach profile monitoring station map along the coastal beaches of Sihanoukville (CGS & GDMR, 2018)",
          },
          {
            url: "/images/marine-geology/beach_dist.jpg",
            captionKm: "រូបភាពទី ២០៖ ការបែងចែកឆ្នេរខ្សាច់ក្នុងឆកកំពង់សោម អមដោយរូបថតជាក់ស្តែងនៅតាមទីវាល (CGS / GDMR, 2018)",
            captionEn: "Figure 20: Kampong Som Bay beach distribution map accompanied by field photographic documentation (CGS & GDMR, 2018)",
          },
        ],
      },
      {
        titleKm: "៨. កម្រាស់ល្បាប់ហូឡូសែន និងការវាយតម្លៃគ្រោះថ្នាក់ភូគព្ភសាស្ត្រ (Holocene Sediment Isopach & Engineering Geohazards)",
        titleEn: "8. Holocene Sediment Isopach, Incised Paleochannels, and Marine Geohazards",
        bodyKm: [
          "ការវាស់ស្ទង់រំញ័រដីរាក់ (Shallow seismic profiling) ត្រូវបានប្រើប្រាស់ដើម្បីកំណត់កម្រាស់ល្បាប់សម័យហូឡូសែន (Holocene sediment isopach) ខាងលើសិលាមូលដ្ឋានចាស់។ កម្រាស់ល្បាប់ហូឡូសែនមានចន្លោះពី ៣ ដល់ ៩ ម៉ែត្រ ដោយកន្លែងដែលក្រាស់បំផុត (៨ ដល់ ៩ ម៉ែត្រ) ស្ថិតនៅក្បែរច្រកចូលកំពង់ផែក្រុងព្រះសីហនុ និងនៅគែមខាងលិចនៃតំបន់ស្ទង់។ កំណត់ត្រារំញ័រដីបានបង្ហាញរចនាសម្ព័ន្ធជ្រលងទន្លេកាត់បុរាណ (incised paleochannels) ដែលកប់នៅក្រោមស្រទាប់ល្បាប់ហូឡូសែន។",
          "ផែនទីគ្រោះថ្នាក់ភូគព្ភសាស្ត្រ (Geohazard map) បានកំណត់លក្ខណៈគ្រោះថ្នាក់វិស្វកម្មចំនួន ៣ ប្រភេទសំខាន់ៗដែលឃើញនៅលើ seismic profiles៖",
          "• ប្រឡាយរេចរឹលបាតសមុទ្រ (Erosion ditches)៖ កត់ត្រាជាខ្សែបន្ទាត់ចុចៗនៅតំបន់ទឹកបើកចំហរវាងកោះ និងកំពង់ផែ។",
          "• កំពូលខ្សាច់រំកិល (Mobile sand ridges)៖ បង្ហាញពីចរន្តបាតសមុទ្រសកម្មដែលអាចបង្កការកកស្ទះដល់ផ្លូវនាវាចរណ៍។",
          "• ហោប៉ៅឧស្ម័នរាក់ (Shallow biogenic gas)៖ កកើតជាដុំធំមួយនៅតំបន់កណ្តាល-ខាងជើងនៃឆកសមុទ្រ។ ឧស្ម័នរាក់ទាំងនេះជាគ្រោះថ្នាក់វិស្វកម្មដ៏ចម្បងសម្រាប់ការសាងសង់កំពង់ផែ ការបូមខ្សាច់ ការសាងសង់ស្ពាន និងសំណង់វិស្វកម្មបាតសមុទ្រ។",
        ],
        bodyEn: [
          "High-resolution shallow seismic reflection profiles mapped the isopach thickness of post-glacial Holocene sediment overlying acoustic bedrock and older strata. Holocene sediment thickness spans 3 to 9 meters, with the thickest accumulations (8–9 m) concentrated along the deepwater approaches to Sihanoukville Port and along the western survey boundary. Sub-bottom seismic profiles reveal prominent incised paleochannel networks carved during lowstand sea-level regressions.",
          "The coastal engineering geohazard map identifies three critical seabed hazard features:",
          "• Subaqueous Erosion Ditches: Mapped across open passages between offshore islands and the port promontory, formed by intense tidal scouring.",
          "• Mobile Sand Ridges: Linear bedforms indicating active seabed clastic transport and potential navigational channel shoaling.",
          "• Shallow Biogenic Gas Accumulations: A large shallow acoustic gas wipeout zone identified in the north-central bay. Subsurface shallow gas poses major geotechnical hazards for marine piling, port construction, dredging, bridge foundations, and offshore infrastructure.",
        ],
        images: [
          {
            url: "/images/marine-geology/isopach.jpg",
            captionKm: "រូបភាពទី ២១៖ ផែនទីកម្រាស់ល្បាប់ហូឡូសែន (Isopach, ៣–៩ ម៉ែត្រ) អមដោយទម្រង់រំញ័រដីបង្ហាញជ្រលងកាត់បុរាណ (CGS / GDMR, 2018)",
            captionEn: "Figure 21: Isopach map of Holocene sediments (3–9 m) accompanied by shallow seismic reflection profiles showing incised paleochannels (CGS & GDMR, 2018)",
          },
          {
            url: "/images/marine-geology/hazards.jpg",
            captionKm: "រូបភាពទី ២២៖ ផែនទីគ្រោះថ្នាក់ភូគព្ភសាស្ត្រវិស្វកម្មឆ្នេរ (ប្រឡាយរេចរឹល, កំពូលខ្សាច់រំកិល, និងហោប៉ៅឧស្ម័នរាក់) (CGS / GDMR, 2018)",
            captionEn: "Figure 22: Marine engineering geohazard distribution map: subaqueous erosion ditches, mobile sand ridges, and shallow gas pockets (CGS & GDMR, 2018)",
          },
        ],
      },
      {
        titleKm: "៩. តារាងសង្ខេបលទ្ធផលស្រាវជ្រាវបរិស្ថានភូគព្ភសាស្ត្រឆ្នេរ (Summary Matrix of Coastal Geo-Environmental Domains)",
        titleEn: "9. Summary Synthesis of Sihanoukville Coastal Geo-Environmental Baseline",
        bodyKm: [
          "តារាងខាងក្រោមសង្ខេបនូវប្រធានបទស្រាវជ្រាវស្នូល ផែនទីវិទ្យាសាស្ត្រក្នុងអាត្លាស និងលទ្ធផលគន្លឹះដែលរកឃើញដោយការស្ទង់មតិរួមគ្នារវាង CGS និង GDMR ក្នុងឆ្នាំ ២០១៨៖",
        ],
        bodyEn: [
          "Table 3 synthesizes the seven core marine geo-environmental themes, atlas thematic cartography, and fundamental baseline findings established by the joint CGS–GDMR campaign:",
        ],
        table: {
          captionKm: "តារាងទី ៣៖ សង្ខេបប្រធានបទ ផែនទី និងលទ្ធផលសំខាន់ៗនៃអាត្លាសបរិស្ថានភូគព្ភសាស្ត្រឆ្នេរសមុទ្រខេត្តព្រះសីហនុ",
          captionEn: "Table 3: Comprehensive synthesis of thematic mapping domains and primary findings from the Sihanoukville Marine Atlas",
          headersKm: ["ប្រធានបទស្រាវជ្រាវ (Theme)", "ផែនទីវិទ្យាសាស្ត្រក្នុងអាត្លាស (Maps in Atlas)", "លទ្ធផលគន្លឹះសំខាន់ៗ (Primary Findings)"],
          headersEn: ["Research Theme", "Maps in Atlas", "Primary Geological Findings"],
          rowsKm: [
            ["ភូគព្ភសាស្ត្រ និងសណ្ឋានដី", "ផែនទីភូគព្ភសាស្ត្រឆ្នេរ; ផែនទីសណ្ឋានដី និងជម្រៅទឹក", "ឯកតាសិលាពីដេវ៉ូនៀនដល់ក្វាតែណែរ; សិលាហនហ្វែលនៅកំពង់ផែ; ជម្រៅទឹក ០ ដល់ -២០ ម៉ែត្រ"],
            ["ល្បាប់ផ្ទៃបាតសមុទ្រ", "ចំណាត់ថ្នាក់ Folk; ខ្សាច់, ស៊ីលត៍, ដីឥដ្ឋ; ប៉ារ៉ាម៉ែត្រគ្រាប់; រ៉ែដីឥដ្ឋ", "ភក់នៅឆកខាងក្នុង, ល្បាប់ខ្សាច់ធំទូលាយ, ខ្សាច់ល្បាប់នៅកំពង់ផែ; ការតម្រៀបគ្រាប់មិនល្អ"],
            ["លក្ខណៈរូប-គីមីទឹកសមុទ្រ", "សីតុណ្ហភាព, ភាពប្រៃ, ភាពល្អក់, អុកស៊ីសែនរលាយ (ផ្ទៃលើ និងបាត)", "ចន្លោះតូចចង្អៀត (២៩,៥-៣១,៥ °C, ២៤-៣២ PSU); ឥទ្ធិពលទឹកសាបទន្លេនៅខាងជើង"],
            ["ជំនោរ និងចរន្តទឹក", "កម្ពស់ទឹកជំនោរ, បរិមាណទឹកជំនោរ, វាលលំហូរ, ចរន្តសេសសល់", "ការចាក់ដីបំពេញកាត់បន្ថយបរិមាណទឹកជំនោរ (Tidal prism) ប្រមាណ ២០ ដល់ ២៦%"],
            ["ការប្រើប្រាស់ដីឆ្នេរ", "ផែនទីគម្របដីឆ្នាំ ២០០១, ២០១០, ២០១៧", "ការថយចុះគម្របព្រៃឈើ; ការកើនឡើងដីទទេ និងដីទីក្រុង/សំណង់ជុំវិញកំពង់ផែ"],
            ["ខ្សែឆ្នេរ និងឆ្នេរខ្សាច់", "ចំណាត់ថ្នាក់ខ្សែឆ្នេរ; ទម្រង់ឆ្នេរខ្សាច់; ការបែងចែកឆ្នេរ", "ឆ្នេរភក់នៅឆកក្នុង, ឆ្នេរខ្សាច់នៅខាងក្រៅ, ឆ្នេរថ្មនៅកោះ, ឆ្នេរសិប្បនិម្មិតនៅកំពង់ផែ"],
            ["ស្រទាប់ល្បាប់ និងគ្រោះថ្នាក់", "កម្រាស់ល្បាប់ហូឡូសែន (Isopach); គ្រោះថ្នាក់ភូគព្ភសាស្ត្រ", "ហូឡូសែនក្រាស់ ៣-៩ ម៉ែត្រ; ប្រឡាយរេចរឹល, កំពូលខ្សាច់រំកិល, និងហោប៉ៅឧស្ម័នរាក់"],
          ],
          rowsEn: [
            ["Geology & Topography", "Coastal geology; coastal topography & bathymetry", "Devonian to Quaternary units; hornfels beneath port; bathymetry 0 to -20 m"],
            ["Surface Sediments", "Folk classification; sand, silt, clay %; grain size phi; clay minerals", "Inner bay muds, extensive sandy silt blankets, silty sand around port; poorly sorted"],
            ["Water Properties", "Temperature, salinity, turbidity, dissolved oxygen (surface & bottom)", "Narrow ranges (29.5–31.5 °C, 24–32 PSU); estuarine freshwater dilution plumes in north"],
            ["Tides & Currents", "Tidal variation, tidal prism, flow fields, residual current vectors", "Simulated land reclamation reduces bay tidal prism by 20–26% and dampens velocities"],
            ["Land Use Change", "Multi-temporal land cover classification (2001, 2010, 2017)", "Decadal loss of vegetation cover; rapid expansion of bare soil and built-up port land"],
            ["Shoreline & Beaches", "Coastline classification; beach profiles; beach photo distribution", "Muddy inner shores, high-value sandy tourist beaches, rocky islands, built port shore"],
            ["Strata & Geohazards", "Holocene sediment isopach; marine geohazard distribution", "Holocene 3–9 m thick over incised paleovalleys; seabed scour ditches, sand ridges, shallow gas"],
          ],
          footnoteKm: "ប្រភពទិន្នន័យ៖ សំយោគពី Atlas of Kampong Som Bay Coastal Geo-Environment (CGS / GDMR, 2018).",
          footnoteEn: "Source: Synthesized from Atlas of Kampong Som Bay Coastal Geo-Environment (CGS & GDMR, 2018).",
        },
      },
      {
        titleKm: "១០. ស្ថាប័នស្រាវជ្រាវ ប្រភពទិន្នន័យ និងកំណត់សម្គាល់បច្ចេកទេស (Institutions, Data Sources & Methodological Notes)",
        titleEn: "10. Research Institutions, Bibliographic Sources, and Technical Notes",
        bodyKm: [
          "ប្រភពឯកសារចម្បង៖ ការិយាល័យស្ទង់ភូគព្ភសាស្ត្រចិន (China Geological Survey - Qingdao Institute of Marine Geology) និងអគ្គនាយកដ្ឋានធនធានរ៉ែ (General Department of Mineral Resources - GDMR) នៃក្រសួងរ៉ែ និងថាមពលកម្ពុជា៖ *Atlas of Kampong Som Bay Coastal Geo-Environment, Cambodia* (បោះពុម្ពជាភាសាចិន និងអង់គ្លេស ចំនួន ៤៧ ទំព័រ, ឆ្នាំ ២០១៨)។",
          "លក្ខណៈនៃលទ្ធផលបឋម៖ អាត្លាសនេះត្រូវបានចាត់ទុកជាការវិភាគបឋមផ្អែកលើការស្ទង់មតិផ្ទាល់ក្នុងខែមីនា-មេសា ឆ្នាំ ២០១៨។ ផែនទីទាំងអស់ត្រូវបានបង្កើតឡើងតាមវិធីសាស្ត្រ interpolation ពីចំណុចសំណាក និងខ្សែបន្ទាត់វាស់ស្ទង់ជាក់ស្តែង។ ជួរតម្លៃដែលបានដកស្រង់ក្នុងអត្ថបទគឺជាមាត្រដ្ឋាន legend នៃផែនទីនីមួយៗ។",
          "ឯកសារយោង និងការសិក្សាពាក់ព័ន្ធបន្ថែម៖",
          "[1] China Geological Survey & General Department of Mineral Resources (2018). Atlas of Kampong Som Bay Coastal Geo-Environment, Cambodia. Qingdao Institute of Marine Geology, 47 p.",
          "[2] Fyhn M.B.W., Boldreel L.O., Nielsen L.H. (2010). 'Geological development of the Central and South Vietnamese shelves: Cenozoic basin evolution and inversion.' Journal of Geophysical Research, 115:B09101.",
          "[3] Vysotsky V.I., Rodnikova R.D., Agamirzoyev E.A. (1994). 'Petroleum Geology of Cambodia.' International Geology Review, 36(6):574–586.",
          "[4] ESCAP (1993). Atlas of Mineral Resources of the ESCAP Region, Volume 10: Cambodia. United Nations Economic and Social Commission for Asia and the Pacific, New York, 85 p.",
          "សិទ្ធិ និងកម្មសិទ្ធិបញ្ញា៖ ផែនទី និងរូបថតទាំងអស់ជាកម្មសិទ្ធិរបស់ស្ថាប័នផលិត CGS និង GDMR។ ខ្លឹមសារភាសាខ្មែរ និងអង់គ្លេសត្រូវបានរៀបចំឡើងជាពិសេសសម្រាប់ផ្សព្វផ្សាយលើគេហទំព័រសមាគមអ្នកភូគព្ភវិទ្យាកម្ពុជា (GeoCam)។",
        ],
        bodyEn: [
          "Primary Bibliographic Source: China Geological Survey (Qingdao Institute of Marine Geology) and General Department of Mineral Resources (GDMR), Ministry of Mines and Energy, Cambodia: *Atlas of Kampong Som Bay Coastal Geo-Environment, Cambodia* (Bilingual Chinese and English, 47 pages, 2018).",
          "Technical Scope and Baseline Status: The atlas represents an empirical reconnaissance baseline from the April 2018 offshore campaign. Spatial maps represent numerical interpolations from calibrated grab samples and seismic tracklines. Quoted numerical intervals reflect map legend bins and calibrated measurement thresholds.",
          "Supplementary Regional Literature & Marine Basin Studies:",
          "[1] China Geological Survey & General Department of Mineral Resources (2018). Atlas of Kampong Som Bay Coastal Geo-Environment, Cambodia. Qingdao Institute of Marine Geology, 47 p.",
          "[2] Fyhn M.B.W., Boldreel L.O., Nielsen L.H. (2010). 'Geological development of the Central and South Vietnamese shelves: Cenozoic basin evolution and inversion.' Journal of Geophysical Research, 115:B09101. DOI: 10.1029/2009JB006847.",
          "[3] Vysotsky V.I., Rodnikova R.D., Agamirzoyev E.A. (1994). 'Petroleum Geology of Cambodia.' International Geology Review, 36(6):574–586. DOI: 10.1080/00206819409465476.",
          "[4] ESCAP (1993). Atlas of Mineral Resources of the ESCAP Region, Volume 10: Cambodia. United Nations Economic and Social Commission for Asia and the Pacific, New York, 85 p.",
          "Institutional Rights and Attribution: Maps, seismograms, and photographs © China Geological Survey and General Department of Mineral Resources (GDMR), Cambodia. Scientific synthesis curated for the Geosciences Society of Cambodia (GeoCam) public educational portal.",
        ],
      },
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
