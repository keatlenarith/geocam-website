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
      "local-59a1797c08dd",
      "local-66f8249914c1",
      "local-c1465040ef54",
      "local-8bebe58c338a",
      "local-d8ad564a0ea2",
      "web14",
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
