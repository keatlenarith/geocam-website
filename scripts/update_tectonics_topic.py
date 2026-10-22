import json
import re

# Read current focus-topics-data.ts
with open(r"d:\9-Database Information\GeoCam Website\geocam-website\src\features\research\focus-topics-data.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Construct the full Tectonics topic data
tectonics_ts = '''  {
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
          "នៅប្រទេសថៃ អាងខ្ពង់រាបគោរាជ (Khorat Plateau Basin) រក្សាទុកនូវស្រទាប់មិនស៊ីសង្វាក់មុំ (angular unconformity) ដ៏សំខាន់រវាងភឺមៀន និងទ្រីយ៉ាសិក ដែលត្រូវបានបកស្រាយថាជាព្រឹត្តិការណ៍ឥណ្ឌូស៊ីនដំបូងបំផុតបង្កឡើងដោយការបុកទង្គិចរវាងឥណ្ឌូចិន និងចិនខាងត្បូង។ ការសិក្សាលើកូនគ្រួស និងអាយុហ្សៀកុង (detrital zircon U-Pb) នៅថៃកណ្តាល និងខាងជើងក៏បានបែងចែកព្រឹត្តិការណ៍បុកទង្គិចឥណ្ឌូចិន–ចិនខាងត្បូងចាស់ ពីការបុកទង្គិចស៊ីប៊ូម៉ាស៊ូ–សុខោទ័យ–ឥណ្ឌូចិនក្រោយមក និងសកម្មភាពម៉ាក់ម៉ាក្រោយការបុកទង្គិច។",
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
  },'''

# Replace FOCUS_TOPICS[0] in content
pattern = r'export const FOCUS_TOPICS: FocusTopic\[\] = \[\s*\{.*?id: "tectonics".*?\n  \},'
new_content = re.sub(pattern, f'export const FOCUS_TOPICS: FocusTopic[] = [\n{tectonics_ts}', content, flags=re.DOTALL)

with open(r"d:\9-Database Information\GeoCam Website\geocam-website\src\features\research\focus-topics-data.ts", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully replaced FOCUS_TOPICS[0] with complete Tectonics report data!")
