/**
 * GeoCam Earthquake Location Translator & Sanitizer
 *
 * Guarantees that:
 * 1. Under no circumstances will Thai script ([\u0E00-\u0E7F]) or Lao script ([\u0E80-\u0EFF]) appear in either language.
 * 2. In English mode (en), locations are rendered in clean, accurate English (e.g. "Myanmar", "Laos", "Chiang Mai, Thailand").
 * 3. In Khmer mode (km), locations are translated into formal Khmer (e.g. "ប្រទេសមីយ៉ាន់ម៉ា (Myanmar)", "ប្រទេសឡាវ (Laos)", "ខេត្តឈៀងម៉ៃ, ប្រទេសថៃ").
 */

export const THAI_SCRIPT_REGEX = /[\u0E00-\u0E7F]/g;
export const LAO_SCRIPT_REGEX = /[\u0E80-\u0EFF]/g;

/**
 * Classify hypocenter depth into standard seismological categories:
 * - Shallow (រាក់): 0 - 70 km
 * - Intermediate (មធ្យម): 70 - 300 km
 * - Deep (ជ្រៅ): > 300 km
 */
export function getDepthClassification(depthKm: number | null | undefined, kh: boolean = false): {
  category: "shallow" | "intermediate" | "deep" | "unknown";
  labelEn: string;
  labelKm: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
} {
  if (depthKm === null || depthKm === undefined || isNaN(depthKm)) {
    return {
      category: "unknown",
      labelEn: "Unknown",
      labelKm: "មិនទាន់កំណត់",
      badgeBg: "bg-slate-100",
      badgeText: "text-slate-700",
      badgeBorder: "border-slate-300",
    };
  }
  if (depthKm < 70) {
    return {
      category: "shallow",
      labelEn: "Shallow",
      labelKm: "រាក់ (Shallow)",
      badgeBg: "bg-emerald-50 text-emerald-700",
      badgeText: "text-emerald-700",
      badgeBorder: "border-emerald-200",
    };
  }
  if (depthKm <= 300) {
    return {
      category: "intermediate",
      labelEn: "Intermediate",
      labelKm: "មធ្យម (Intermediate)",
      badgeBg: "bg-amber-50 text-amber-800",
      badgeText: "text-amber-800",
      badgeBorder: "border-amber-200",
    };
  }
  return {
    category: "deep",
    labelEn: "Deep",
    labelKm: "ជ្រៅ (Deep)",
    badgeBg: "bg-purple-50 text-purple-700",
    badgeText: "text-purple-700",
    badgeBorder: "border-purple-200",
  };
}

interface TranslationEntry {
  pattern: RegExp;
  en: string;
  km: string;
}

// Ordered substitution rules (longer/more specific phrases first)
const LOCATION_RULES: TranslationEntry[] = [
  // --- Directional & Relative Modifiers ---
  {
    pattern: /(?:ทาง)?ทิศตะวันตกเฉียงใต้ของ/g,
    en: "SW of ",
    km: "ភាគនិរតីនៃ ",
  },
  {
    pattern: /(?:ทาง)?ทิศตะวันตกเฉียงเหนือของ/g,
    en: "NW of ",
    km: "ភាគពាយព្យនៃ ",
  },
  {
    pattern: /(?:ทาง)?ทิศตะวันออกเฉียงใต้ของ/g,
    en: "SE of ",
    km: "ភាគអាគ្នេយ៍នៃ ",
  },
  {
    pattern: /(?:ทาง)?ทิศตะวันออกเฉียงเหนือของ/g,
    en: "NE of ",
    km: "ភាគឦសាននៃ ",
  },
  {
    pattern: /(?:ทาง)?ทิศเหนือของ/g,
    en: "N of ",
    km: "ភាគខាងជើងនៃ ",
  },
  {
    pattern: /(?:ทาง)?ทิศใต้ของ/g,
    en: "S of ",
    km: "ភាគខាងត្បូងនៃ ",
  },
  {
    pattern: /(?:ทาง)?ทิศตะวันออกของ/g,
    en: "E of ",
    km: "ភាគខាងកើតនៃ ",
  },
  {
    pattern: /(?:ทาง)?ทิศตะวันตกของ/g,
    en: "W of ",
    km: "ភាគខាងលិចនៃ ",
  },
  {
    pattern: /นอกชายฝั่ง(?:ทาง)?ตอนใต้ของ/g,
    en: "Off the southern coast of ",
    km: "ក្រៅឆ្នេរសមុទ្រភាគខាងត្បូងនៃ ",
  },
  {
    pattern: /นอกชายฝั่ง(?:ทาง)?ตอนเหนือของ/g,
    en: "Off the northern coast of ",
    km: "ក្រៅឆ្នេរសមុទ្រភាគខាងជើងនៃ ",
  },
  {
    pattern: /นอกชายฝั่ง/g,
    en: "Off coast of ",
    km: "ក្រៅឆ្នេរសមុទ្រនៃ ",
  },
  {
    pattern: /ชายฝั่ง/g,
    en: "Coast of ",
    km: "ឆ្នេរសមុទ្រនៃ ",
  },
  {
    pattern: /พรมแดน(?:ระหว่าง)?/g,
    en: "Border region of ",
    km: "តំបន់ព្រំដែន ",
  },
  {
    pattern: /ตอนใต้ของ/g,
    en: "Southern ",
    km: "ភាគខាងត្បូងនៃ ",
  },
  {
    pattern: /ตอนเหนือของ/g,
    en: "Northern ",
    km: "ភាគខាងជើងនៃ ",
  },

  // --- Countries (Thai & Lao forms) ---
  {
    pattern: /ประเทศเมียนมา|เมียนมา|พม่า|ປະເທດມຽນມາ|ມຽນມາ/g,
    en: "Myanmar",
    km: "ប្រទេសមីយ៉ាន់ម៉ា",
  },
  {
    pattern: /ประเทศลาว|สปป\.ลาว|ลาว|ປະເທດລາວ|ສປປ\.ລາວ|ລາວ/g,
    en: "Laos",
    km: "ប្រទេសឡាវ",
  },
  {
    pattern: /ประเทศไทย|ไทย|ປະເທດໄທ|ໄທ/g,
    en: "Thailand",
    km: "ប្រទេសថៃ",
  },
  {
    pattern: /ประเทศเวียดนาม|เวียดนาม|ປະເທດຫວຽດນາມ|ຫວຽດນາມ/g,
    en: "Vietnam",
    km: "ប្រទេសវៀតណាម",
  },
  {
    pattern: /ประเทศจีน|จีน|ປະເທດຈີນ|ຈີນ/g,
    en: "China",
    km: "ប្រទេសចិន",
  },
  {
    pattern: /ประเทศกัมพูชา|กัมพูชา|ປະເທດກຳປູເຈຍ|ກຳປູເຈຍ/g,
    en: "Cambodia",
    km: "ប្រទេសកម្ពុជា",
  },
  {
    pattern: /ประเทศอินโดนีเซีย|อินโดนีเซีย/g,
    en: "Indonesia",
    km: "ប្រទេសឥណ្ឌូណេស៊ី",
  },
  {
    pattern: /ประเทศฟิลิปปินส์|ฟิลิปปินส์/g,
    en: "Philippines",
    km: "ប្រទេសហ្វីលីពីន",
  },
  {
    pattern: /ประเทศมาเลเซีย|มาเลเซีย/g,
    en: "Malaysia",
    km: "ប្រទេសម៉ាឡេស៊ី",
  },
  {
    pattern: /ประเทศอินเดีย|อินเดีย/g,
    en: "India",
    km: "ប្រទេសឥណ្ឌា",
  },
  {
    pattern: /ประเทศบังกลาเทศ|บังกลาเทศ/g,
    en: "Bangladesh",
    km: "ប្រទេសបង់ក្លាដែស",
  },
  {
    pattern: /ประเทศญี่ปุ่น|ญี่ปุ่น/g,
    en: "Japan",
    km: "ប្រទេសជប៉ុន",
  },
  {
    pattern: /ประเทศไต้หวัน|ไต้หวัน/g,
    en: "Taiwan",
    km: "តៃវ៉ាន់",
  },

  // --- Water Bodies & Islands ---
  {
    pattern: /หมู่เกาะอันดามัน|เกาะอันดามัน/g,
    en: "Andaman Islands",
    km: "ប្រជុំកោះអាន់ដាម៉ាន",
  },
  {
    pattern: /ทะเลอันดามัน/g,
    en: "Andaman Sea",
    km: "សមុទ្រអាន់ដាម៉ាន",
  },
  {
    pattern: /อ่าวเบงกอล/g,
    en: "Bay of Bengal",
    km: "ឈូងសមុទ្របង់ហ្គាល់",
  },
  {
    pattern: /หมู่เกาะนิโคบาร์/g,
    en: "Nicobar Islands",
    km: "ប្រជុំកោះនីកូបា",
  },
  {
    pattern: /ช่องแคบมะละกา/g,
    en: "Strait of Malacca",
    km: "ច្រកសមុទ្រម៉ាឡាកា",
  },
  {
    pattern: /ทะเลจีนใต้/g,
    en: "South China Sea",
    km: "សមុទ្រចិនខាងត្បូង",
  },
  {
    pattern: /อ่าวไทย/g,
    en: "Gulf of Thailand",
    km: "ឈូងសមុទ្រថៃ",
  },

  // --- Laos Provinces & Towns ---
  {
    pattern: /แขวงบ่อแก้ว|ບໍ່ແກ້ວ|บ่อแก้ว/g,
    en: "Bokeo Province, Laos",
    km: "ខេត្តបកែវ ប្រទេសឡាវ",
  },
  {
    pattern: /แขวงไชยบุรี|แขวงไซยะบูลี|แขวงไชยบูลี|ໄຊຍະບູລີ|ไชยบุรี|ไซยะบูลี/g,
    en: "Xayabury Province, Laos",
    km: "ខេត្តសាយ៉ាបូរី ប្រទេសឡាវ",
  },
  {
    pattern: /แขวงหลวงพระบาง|ຫຼວງພະບາງ|หลวงพระบาง/g,
    en: "Luang Prabang Province, Laos",
    km: "ខេត្តហ្លួងព្រះបាង ប្រទេសឡាវ",
  },
  {
    pattern: /แขวงอุดมไซ|ອຸດົມໄຊ|อุดมไซ/g,
    en: "Oudomxay Province, Laos",
    km: "ខេត្តឧត្តមជ័យ ប្រទេសឡាវ",
  },
  {
    pattern: /แขวงพงสาลี|ຜົ້ງສາລີ|พงสาลี/g,
    en: "Phongsaly Province, Laos",
    km: "ខេត្តផុងសាលី ប្រទេសឡាវ",
  },
  {
    pattern: /แขวงหลวงน้ำทา|ຫຼວງນ້ຳທາ|หลวงน้ำทา/g,
    en: "Luang Namtha Province, Laos",
    km: "ខេត្តហ្លួងណាំថា ប្រទេសឡាវ",
  },
  {
    pattern: /แขวงหัวพัน|ຫົວພັນ|หัวพัน/g,
    en: "Houaphanh Province, Laos",
    km: "ខេត្តហួរផាន់ ប្រទេសឡាវ",
  },
  {
    pattern: /แขวงเชียงขวาง|ຊຽງຂວາງ|เชียงขวาง/g,
    en: "Xiangkhouang Province, Laos",
    km: "ខេត្តឈៀងខ្វាង ប្រទេសឡាវ",
  },
  {
    pattern: /แขวงเวียงจันทน์|ວຽງຈັນ|เวียงจันทน์/g,
    en: "Vientiane Province, Laos",
    km: "ខេត្តវៀងចន្ទន៍ ប្រទេសឡាវ",
  },
  {
    pattern: /แขวงคำม่วน|ຄຳມ່ວນ|คำม่วน/g,
    en: "Khammouane Province, Laos",
    km: "ខេត្តខាំមួន ប្រទេសឡាវ",
  },
  {
    pattern: /แขวงสะหวันนะเขต|ສະຫວັນນະເຂດ|สะหวันนะเขต/g,
    en: "Savannakhet Province, Laos",
    km: "ខេត្តសុវណ្ណខេត្ត ប្រទេសឡាវ",
  },
  {
    pattern: /แขวงสาละวัน|ສາລະວັນ|สาละวัน/g,
    en: "Salavan Province, Laos",
    km: "ខេត្តសារ៉ាវ៉ាន់ ប្រទេសឡាវ",
  },
  {
    pattern: /แขวงเซกอง|ເຊກອງ|เซกอง/g,
    en: "Sekong Province, Laos",
    km: "ខេត្តសេកុង ប្រទេសឡាវ",
  },
  {
    pattern: /แขวงอัตตะปือ|ອັດຕະປື|อัตตะปือ/g,
    en: "Attapeu Province, Laos",
    km: "ខេត្តអាត្តាពឺ ប្រទេសឡាវ",
  },
  {
    pattern: /แขวงจำปาศักดิ์|ຈຳປາສັກ|จำปาศักดิ์/g,
    en: "Champasak Province, Laos",
    km: "ខេត្តចម្ប៉ាសក្តិ ប្រទេសឡាវ",
  },
  {
    pattern: /เมืองต้นผึ้ง|ຕົ້ນເຜິ້ງ|ต้นผึ้ง/g,
    en: "Ton Pheung, Bokeo, Laos",
    km: "ស្រុកតុនភើង ខេត្តបកែវ ប្រទេសឡាវ",
  },
  {
    pattern: /เมืองห้วยทราย|ຫ້ວຍຊາຍ|ห้วยทราย/g,
    en: "Houayxay, Bokeo, Laos",
    km: "ស្រុកហួយសាយ ខេត្តបកែវ ប្រទេសឡាវ",
  },

  // --- Myanmar Regions & Cities in TMD ---
  {
    pattern: /รัฐฉาน/g,
    en: "Shan State, Myanmar",
    km: "រដ្ឋសាន ប្រទេសមីយ៉ាន់ម៉ា",
  },
  {
    pattern: /รัฐกะฉิ่น/g,
    en: "Kachin State, Myanmar",
    km: "រដ្ឋកាឈីន ប្រទេសមីយ៉ាន់ម៉ា",
  },
  {
    pattern: /รัฐกะเหรี่ยง/g,
    en: "Kayin State, Myanmar",
    km: "រដ្ឋការ៉ែន ប្រទេសមីយ៉ាន់ម៉ា",
  },
  {
    pattern: /รัฐมอญ/g,
    en: "Mon State, Myanmar",
    km: "រដ្ឋមន ប្រទេសមីយ៉ាន់ម៉ា",
  },
  {
    pattern: /รัฐยะไข่/g,
    en: "Rakhine State, Myanmar",
    km: "រដ្ឋរ៉ាខាញ ប្រទេសមីយ៉ាន់ម៉ា",
  },
  {
    pattern: /มัณฑะเลย์/g,
    en: "Mandalay, Myanmar",
    km: "ក្រុងម៉ាន់ដាឡាយ ប្រទេសមីយ៉ាន់ម៉ា",
  },
  {
    pattern: /เนปยีดอ|เนปิดอว์|เนปิโด/g,
    en: "Naypyidaw, Myanmar",
    km: "រាជធានីណៃពិដោ ប្រទេសមីយ៉ាន់ម៉ា",
  },
  {
    pattern: /ย่างกุ้ง/g,
    en: "Yangon, Myanmar",
    km: "ក្រុងយ៉ាំងហ្គោន ប្រទេសមីយ៉ាន់ម៉ា",
  },
  {
    pattern: /พะโค|หงสาวดี/g,
    en: "Bago, Myanmar",
    km: "ក្រុងបាហ្គោ ប្រទេសមីយ៉ាន់ម៉ា",
  },
  {
    pattern: /ท่าขี้เหล็ก/g,
    en: "Tachileik, Myanmar",
    km: "ក្រុងតាឈីលេក ប្រទេសមីយ៉ាន់ម៉ា",
  },
  {
    pattern: /เชียงตุง/g,
    en: "Kengtung, Myanmar",
    km: "ក្រុងឈៀងទុង ប្រទេសមីយ៉ាន់ម៉ា",
  },
  {
    pattern: /ตองยี/g,
    en: "Taunggyi, Myanmar",
    km: "ក្រុងតោនជី ប្រទេសមីយ៉ាន់ម៉ា",
  },
  {
    pattern: /พะอัน/g,
    en: "Hpa-An, Myanmar",
    km: "ក្រុងផាអាន ប្រទេសមីយ៉ាន់ម៉ា",
  },
  {
    pattern: /เมียวดี/g,
    en: "Myawaddy, Myanmar",
    km: "ក្រុងម្យ៉ាវ៉ាឌី ប្រទេសមីយ៉ាន់ម៉ា",
  },

  // --- Thailand Provinces ---
  { pattern: /แม่ฮ่องสอน/g, en: "Mae Hong Son", km: "ម៉ែហុងសន" },
  { pattern: /เชียงใหม่/g, en: "Chiang Mai", km: "ឈៀងម៉ៃ" },
  { pattern: /เชียงราย/g, en: "Chiang Rai", km: "ឈៀងរ៉ៃ" },
  { pattern: /ลำปาง/g, en: "Lampang", km: "ឡាំប៉ាង" },
  { pattern: /ลำพูน/g, en: "Lamphun", km: "ឡាំភូន" },
  { pattern: /แพร่/g, en: "Phrae", km: "ភ្រែ" },
  { pattern: /น่าน/g, en: "Nan", km: "ណាន" },
  { pattern: /พะเยา/g, en: "Phayao", km: "ផាយ៉ាវ" },
  { pattern: /ตาก/g, en: "Tak", km: "តាក" },
  { pattern: /อุตรดิตถ์/g, en: "Uttaradit", km: "ឧត្តរទិត្ថ" },
  { pattern: /พิษณุโลก/g, en: "Phitsanulok", km: "ពិស្ណុលោក" },
  { pattern: /สุโขทัย/g, en: "Sukhothai", km: "សុខោទ័យ" },
  { pattern: /กำแพงเพชร/g, en: "Kamphaeng Phet", km: "កំពែងពេជ្រ" },
  { pattern: /เพชรบูรณ์/g, en: "Phetchabun", km: "ពេជ្របូរណ៍" },
  { pattern: /พิจิตร/g, en: "Phichit", km: "ពិចិត្រ" },
  { pattern: /นครสวรรค์/g, en: "Nakhon Sawan", km: "នគរសួគ៌" },
  { pattern: /อุทัยธานี/g, en: "Uthai Thani", km: "ឧទ័យធានី" },
  { pattern: /กาญจนบุรี/g, en: "Kanchanaburi", km: "កញ្ចនបុរី" },
  { pattern: /สุพรรณบุรี/g, en: "Suphan Buri", km: "សុវណ្ណបុរី" },
  { pattern: /ราชบุรี/g, en: "Ratchaburi", km: "រាជបុរី" },
  { pattern: /เพชรบุรี/g, en: "Phetchaburi", km: "ពេជ្របុរី" },
  { pattern: /ประจวบคีรีขันธ์/g, en: "Prachuap Khiri Khan", km: "ប្រជួបគិរីខ័ន្ធ" },
  { pattern: /ชุมพร/g, en: "Chumphon", km: "ជុំពរ" },
  { pattern: /ระนอง/g, en: "Ranong", km: "រនង" },
  { pattern: /สุราษฎร์ธานี/g, en: "Surat Thani", km: "សុរាស្ត្រធានី" },
  { pattern: /พังงา/g, en: "Phang Nga", km: "ផាំងង៉ា" },
  { pattern: /ภูเก็ต/g, en: "Phuket", km: "ភូកេត" },
  { pattern: /กระบี่/g, en: "Krabi", km: "ក្របី" },
  { pattern: /ตรัง/g, en: "Trang", km: "ត្រាំង" },
  { pattern: /พัทลุง/g, en: "Phatthalung", km: "ព័ទ្ធលុង" },
  { pattern: /สงขลา/g, en: "Songkhla", km: "សង្ខលា" },
  { pattern: /สตูล/g, en: "Satun", km: "ស្តូល" },
  { pattern: /ปัตตานี/g, en: "Pattani", km: "ប៉ាតានី" },
  { pattern: /ยะลา/g, en: "Yala", km: "យ៉ាឡា" },
  { pattern: /นราธิวาส/g, en: "Narathiwat", km: "នរាធិវាស" },
  { pattern: /เลย/g, en: "Loei", km: "ឡើយ" },
  { pattern: /หนองคาย/g, en: "Nong Khai", km: "ណងខាយ" },
  { pattern: /บึงกาฬ/g, en: "Bueng Kan", km: "បឹងកាល" },
  { pattern: /หนองบัวลำภู/g, en: "Nong Bua Lamphu", km: "ណងបួលំភូ" },
  { pattern: /อุดรธานี/g, en: "Udon Thani", km: "ឧដរធានី" },
  { pattern: /สกลนคร/g, en: "Sakon Nakhon", km: "សកលនគរ" },
  { pattern: /นครพนม/g, en: "Nakhon Phanom", km: "នគរភ្នំ" },
  { pattern: /มุกดาหาร/g, en: "Mukdahan", km: "មុកដាហាន" },
  { pattern: /ขอนแก่น/g, en: "Khon Kaen", km: "ខនកែន" },
  { pattern: /กาฬสินธุ์/g, en: "Kalasin", km: "កាឡាស៊ីន" },
  { pattern: /มหาสารคาม/g, en: "Maha Sarakham", km: "មហាសារខាម" },
  { pattern: /ร้อยเอ็ด/g, en: "Roi Et", km: "រយអេច" },
  { pattern: /ยโสธร/g, en: "Yasothon", km: "យសោធរ" },
  { pattern: /อำนาจเจริญ/g, en: "Amnat Charoen", km: "អំណាចចម្រើន" },
  { pattern: /อุบลราชธานี/g, en: "Ubon Ratchathani", km: "ឧប៊ុនរាជធានី" },
  { pattern: /ศรีสะเกษ/g, en: "Si Sa Ket", km: "ស៊ីសាកេត" },
  { pattern: /สุรินทร์/g, en: "Surin", km: "សុរិន្ទ" },
  { pattern: /บุรีรัมย์/g, en: "Buri Ram", km: "បុរីរម្យ" },
  { pattern: /นครราชสีมา/g, en: "Nakhon Ratchasima", km: "នគររាជសីមា" },
  { pattern: /ชัยภูมิ/g, en: "Chaiyaphum", km: "ជ័យភូមិ" },
  { pattern: /สระแก้ว/g, en: "Sa Kaeo", km: "ស្រះកែវ" },
  { pattern: /ปราจีนบุรี/g, en: "Prachin Buri", km: "ប្រាចិនបុរី" },
  { pattern: /นครนายก/g, en: "Nakhon Nayok", km: "នគរនាយក" },
  { pattern: /ฉะเชิงเทรา/g, en: "Chachoengsao", km: "ឆាក់ជើងសៅ" },
  { pattern: /ชลบุรี/g, en: "Chon Buri", km: "ជលបុរី" },
  { pattern: /ระยอง/g, en: "Rayong", km: "រយ៉ង" },
  { pattern: /จันทบุรี/g, en: "Chanthaburi", km: "ចន្ទបុរី" },
  { pattern: /ตราด/g, en: "Trat", km: "ត្រាត" },
  { pattern: /กรุงเทพมหานคร|กรุงเทพฯ/g, en: "Bangkok", km: "ក្រុងបាងកក" },

  // --- Common Thai Seismic Districts & Subdistricts ---
  { pattern: /ปาย/g, en: "Pai", km: "ប៉ាយ" },
  { pattern: /ปางมะผ้า/g, en: "Pang Mapha", km: "ប៉ាងម៉ាក់ផា" },
  { pattern: /ขุนยวม/g, en: "Khun Yuam", km: "ឃុនយួម" },
  { pattern: /สบเมย/g, en: "Sop Moei", km: "សុបមើយ" },
  { pattern: /แม่ลาน้อย/g, en: "Mae La Noi", km: "ម៉ែឡាណយ" },
  { pattern: /แม่สะเรียง/g, en: "Mae Sariang", km: "ម៉ែសារៀង" },
  { pattern: /แม่แตง/g, en: "Mae Taeng", km: "ម៉ែតែង" },
  { pattern: /แม่ริม/g, en: "Mae Rim", km: "ម៉ែរីម" },
  { pattern: /สันทราย/g, en: "San Sai", km: "សានសាយ" },
  { pattern: /สันกำแพง/g, en: "San Kamphaeng", km: "សានកំផែង" },
  { pattern: /ดอยสะเก็ด/g, en: "Doi Saket", km: "ដូយសាកេត" },
  { pattern: /ฮอด/g, en: "Hot", km: "ហត" },
  { pattern: /จอมทอง/g, en: "Chom Thong", km: "ចមថង" },
  { pattern: /ฝาง/g, en: "Fang", km: "ហ្វាង" },
  { pattern: /แม่อาย/g, en: "Mae Ai", km: "ម៉ែអាយ" },
  { pattern: /พร้าว/g, en: "Phrao", km: "ព្រាវ" },
  { pattern: /เชียงดาว/g, en: "Chiang Dao", km: "ឈៀងដាវ" },
  { pattern: /สะเมิง/g, en: "Samoeng", km: "សាមឿង" },
  { pattern: /แม่วาง/g, en: "Mae Wang", km: "ម៉ែវ៉ាង" },
  { pattern: /แม่แจ่ม/g, en: "Mae Chaem", km: "ម៉ែជែម" },
  { pattern: /แม่สรวย/g, en: "Mae Suai", km: "ម៉ែស្រួយ" },
  { pattern: /เวียงป่าเป้า/g, en: "Wiang Pa Pao", km: "វៀងប៉ាប៉ាវ" },
  { pattern: /พาน/g, en: "Phan", km: "ផាន" },
  { pattern: /แม่สาย/g, en: "Mae Sai", km: "ម៉ែសាយ" },
  { pattern: /แม่จัน/g, en: "Mae Chan", km: "ម៉ែចាន់" },
  { pattern: /เชียงของ/g, en: "Chiang Khong", km: "ឈៀងខង" },
  { pattern: /เชียงแสน/g, en: "Chiang Saen", km: "ឈៀងសែន" },
  { pattern: /เทิง/g, en: "Thoeng", km: "ធើង" },
  { pattern: /เวียงแก่น/g, en: "Wiang Kaen", km: "វៀងកែន" },
  { pattern: /วังเหนือ/g, en: "Wang Nuea", km: "វ៉ាងហ្នឿ" },
  { pattern: /งาว/g, en: "Ngao", km: "ង៉ាវ" },
  { pattern: /ร้องกวาง/g, en: "Rong Kwang", km: "រ៉ងក្វាង" },
  { pattern: /สอง/g, en: "Song", km: "សង" },
  { pattern: /ลอง/g, en: "Long", km: "ឡង" },
  { pattern: /เด่นชัย/g, en: "Den Chai", km: "ដេនជ័យ" },
  { pattern: /ทุ่งช้าง/g, en: "Thung Chang", km: "ធុងឆាង" },
  { pattern: /เชียงกลาง/g, en: "Chiang Klang", km: "ឈៀងក្លាង" },
  { pattern: /ปัว/g, en: "Pua", km: "ប៉ួ" },
  { pattern: /ท่าวังผา/g, en: "Tha Wang Pha", km: "ថាវ៉ាងផា" },
  { pattern: /เวียงเหนือ/g, en: "Wiang Nuea", km: "វៀងហ្នឿ" },
  { pattern: /เวียงใต้/g, en: "Wiang Tai", km: "វៀងតៃ" },
  { pattern: /แม่นาเติง/g, en: "Mae Na Toeng", km: "ម៉ែណាទើង" },

  // --- Administrative Prefixes ---
  { pattern: /ต\.\s*/g, en: "Subdistrict ", km: "ឃុំ" },
  { pattern: /ตำบล\s*/g, en: "Subdistrict ", km: "ឃុំ" },
  { pattern: /อ\.\s*/g, en: ", District ", km: " ស្រុក" },
  { pattern: /อำเภอ\s*/g, en: ", District ", km: " ស្រុក" },
  { pattern: /จ\.\s*/g, en: ", Province ", km: " ខេត្ត" },
  { pattern: /จังหวัด\s*/g, en: ", Province ", km: " ខេត្ត" },
  { pattern: /แขวง|ແຂວງ/g, en: "Province ", km: "ខេត្ត" },
  { pattern: /เมือง|ເມືອງ/g, en: "District ", km: "ស្រុក" },
  { pattern: /เกาะ/g, en: "Island ", km: "កោះ" },
  { pattern: /บ้าน/g, en: "Ban ", km: "ភូមិ" },

  // --- Chinese Provinces (CENC) ---
  { pattern: /广东/g, en: "Guangdong", km: "ក្វាងទុង" },
  { pattern: /云南/g, en: "Yunnan", km: "យូណាន" },
  { pattern: /四川/g, en: "Sichuan", km: "ស៊ីឈួន" },
  { pattern: /西藏/g, en: "Tibet", km: "ទីបេ" },
  { pattern: /新疆/g, en: "Xinjiang", km: "ស៊ីនជាំង" },
  { pattern: /青海/g, en: "Qinghai", km: "ឈីងហាយ" },
  { pattern: /台湾/g, en: "Taiwan", km: "តៃវ៉ាន់" },
  { pattern: /海南/g, en: "Hainan", km: "ហៃណាន" },
  { pattern: /广西/g, en: "Guangxi", km: "ក្វាងស៊ី" },
  { pattern: /福建/g, en: "Fujian", km: "ហ្វូជាន" },
  { pattern: /市/g, en: " City, ", km: "ក្រុង" },
  { pattern: /县/g, en: " County, ", km: "ស្រុក" },
  { pattern: /区/g, en: " District, ", km: "ខណ្ឌ" },

  // --- Country name translation for Khmer UI ---
  { pattern: /\bMyanmar\b/gi, en: "Myanmar", km: "ប្រទេសមីយ៉ាន់ម៉ា (Myanmar)" },
  { pattern: /\bLaos\b/gi, en: "Laos", km: "ប្រទេសឡាវ (Laos)" },
  { pattern: /\bThailand\b/gi, en: "Thailand", km: "ប្រទេសថៃ (Thailand)" },
  { pattern: /\bCambodia\b/gi, en: "Cambodia", km: "ប្រទេសកម្ពុជា" },
  { pattern: /\bVietnam\b/gi, en: "Vietnam", km: "ប្រទេសវៀតណាម" },
  { pattern: /\bChina\b/gi, en: "China", km: "ប្រទេសចិន" },
  { pattern: /\bIndonesia\b/gi, en: "Indonesia", km: "ប្រទេសឥណ្ឌូណេស៊ី" },
  { pattern: /\bPhilippines\b/gi, en: "Philippines", km: "ប្រទេសហ្វីលីពីន" },
  { pattern: /\bMalaysia\b/gi, en: "Malaysia", km: "ប្រទេសម៉ាឡេស៊ី" },
  { pattern: /\bIndia\b/gi, en: "India", km: "ប្រទេសឥណ្ឌា" },
  { pattern: /\bJapan\b/gi, en: "Japan", km: "ប្រទេសជប៉ុន" },
  { pattern: /\bTaiwan\b/gi, en: "Taiwan", km: "តៃវ៉ាន់" },

];

/**
 * Format and sanitize an earthquake location string.
 * Guarantees zero Thai or Lao characters in the final output.
 */
export function translateEarthquakeLocation(
  rawLocation: string | undefined | null,
  lang: "en" | "km" = "en"
): string {
  if (!rawLocation || typeof rawLocation !== "string") {
    return lang === "km" ? "ចំណុចកណ្តាលរញ្ជួយដី" : "Regional epicenter";
  }

  let text = rawLocation.replace(/^Earthquake\s*/i, "").trim();

  // Check if string contains an English name inside parentheses e.g. "ประเทศเมียนมา (Myanmar)"
  const parenMatch = text.match(/\(([^)]+)\)/);
  const englishParen = parenMatch ? parenMatch[1].trim() : null;

  let en = text;
  let km = text;

  // Apply substitutions
  for (const rule of LOCATION_RULES) {
    en = en.replace(rule.pattern, rule.en);
    km = km.replace(rule.pattern, rule.km);
  }

  // Handle parenthetical English like "(Myanmar)" or "(Laos)"
  if (englishParen) {
    // In English mode, if parenthetical matches or is clean English, eliminate duplicate wrapping
    if (en.includes(englishParen)) {
      en = en.replace(THAI_SCRIPT_REGEX, "").replace(LAO_SCRIPT_REGEX, "");
      // Replace "Myanmar (Myanmar)" -> "Myanmar"
      const duplicateRegex = new RegExp(`\\b${englishParen}\\b\\s*\\(${englishParen}\\)`, "i");
      en = en.replace(duplicateRegex, englishParen);
      en = en.replace(/\(\s*\)/g, "").trim();
    }

    // In Khmer mode, strip any remaining Thai/Lao
    km = km.replace(THAI_SCRIPT_REGEX, "").replace(LAO_SCRIPT_REGEX, "");
    km = km.replace(/\(\s*\)/g, "").trim();
  }

  // STRICT INVARIANT: Strip 100% of any remaining Thai or Lao unicode characters
  en = en.replace(THAI_SCRIPT_REGEX, "").replace(LAO_SCRIPT_REGEX, "");
  km = km.replace(THAI_SCRIPT_REGEX, "").replace(LAO_SCRIPT_REGEX, "");

  // Clean trailing commas, hyphens, and whitespace collapses
  en = en
    .replace(/,\s*,+/g, ",")
    .replace(/\s+/g, " ")
    .replace(/^[,;:\-\s]+|[,;:\-\s]+$/g, "")
    .trim();

  km = km
    .replace(/,\s*,+/g, ",")
    .replace(/\s+/g, " ")
    .replace(/^[,;:\-\s]+|[,;:\-\s]+$/g, "")
    .trim();

  // If Thai administrative units were converted (e.g. Wiang Nuea, Pai, Mae Hong Son), append country if missing
  if (en.includes("Mae Hong Son") || en.includes("Chiang Mai") || en.includes("Chiang Rai")) {
    if (!en.toLowerCase().includes("thailand")) {
      en = `${en}, Thailand`;
    }
  }
  if (km.includes("ម៉ែហុងសន") || km.includes("ឈៀងម៉ៃ") || km.includes("ឈៀងរ៉ៃ")) {
    if (!km.includes("ប្រទេសថៃ")) {
      km = `${km}, ប្រទេសថៃ`;
    }
  }

  // Fallbacks if string was entirely non-English/non-Khmer script and got completely cleared
  if (!en) {
    en = "Regional epicenter";
  }
  if (!km) {
    km = "ចំណុចកណ្តាលរញ្ជួយក្នុងតំបន់";
  }

  return lang === "km" ? km : en;
}


/**
 * GeoCam Earthquake Monitoring Data Layer
 * Models, validation, filtering, source normalization, deduplication, and factual announcement formatting.
 */

export type ProviderName = "USGS" | "TMD" | "VIETNAM" | "PHIVOLCS" | "CENC";
export type ProviderStatus = "available" | "unavailable" | "loading" | "delayed";

export interface EarthquakeReport {
  provider: ProviderName;
  providerEventId: string;
  sourceUrl: string;
  magnitude?: number | null;
  magnitudeType?: string;
  depthKm?: number | null;
}

export interface EarthquakeEvent {
  id: string; // Stable GeoCam identifier
  originTime: string; // ISO 8601 UTC
  firstSeenAt: string; // Stable receipt time (not reset on every fetch)
  updatedAt?: string;
  latitude: number;
  longitude: number;
  depthKm: number | null;
  magnitude: number | null;
  magnitudeType?: string;
  location: string;
  reviewStatus?: string;
  status?: string; // alias for reviewStatus
  url?: string; // primary bulletin URL
  isRegional?: boolean;
  distanceToCambodiaKm?: number;
  reports: EarthquakeReport[];
}

export const CAMBODIA_CENTER = {
  latitude: 12.5657,
  longitude: 104.991,
};

export interface ProviderHealth {
  provider: ProviderName;
  name: string;
  status: ProviderStatus;
  officialUrl: string;
  lastChecked?: string;
  note?: string;
  eventCount?: number;
}

/**
 * Regional Bounding Box for Cambodia & Region:
 * Latitude: 5°N to 25°N
 * Longitude: 92°E to 112°E
 */
export const REGIONAL_BOUNDS = {
  minLat: 5.0,
  maxLat: 25.0,
  minLon: 92.0,
  maxLon: 112.0,
  labelEn: "Cambodia & region (5°–25°N, 92°–112°E)",
  labelKm: "កម្ពុជា និងតំបន់ជុំវិញ (5°–25°N, 92°–112°E)",
};

/**
 * Check if coordinates fall within the regional envelope
 */
export function isWithinRegionalEnvelope(lat: number, lon: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= REGIONAL_BOUNDS.minLat &&
    lat <= REGIONAL_BOUNDS.maxLat &&
    lon >= REGIONAL_BOUNDS.minLon &&
    lon <= REGIONAL_BOUNDS.maxLon
  );
}

/**
 * Haversine formula to compute great-circle distance in kilometers
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format timestamp to ICT (Indochina Time, UTC+7, Asia/Phnom_Penh)
 */
export function formatLocalIctTime(
  isoUtc: string,
  lang: "en" | "km" = "en",
  options?: { includeDate?: boolean; includeSeconds?: boolean }
): string {
  try {
    const date = new Date(isoUtc);
    if (isNaN(date.getTime())) return "—";

    const opts: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Phnom_Penh",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    if (options?.includeSeconds) {
      opts.second = "2-digit";
    }

    if (options?.includeDate !== false) {
      opts.year = "numeric";
      opts.month = "short";
      opts.day = "numeric";
    }

    return new Intl.DateTimeFormat(lang === "km" ? "km-KH" : "en-GB", opts).format(date);
  } catch {
    return isoUtc;
  }
}

/**
 * Generate factual, standardized announcement messages.
 * Template:
 * EN: M{magnitude} earthquake reported near {location} at {time} ICT on {date}. Depth: {depth} km. Source: {provider}.
 * KM: ការរញ្ជួយដីកម្រិត M{magnitude} ត្រូវបានរាយការណ៍នៅជិត {location} នៅម៉ោង {time} ICT ថ្ងៃទី {date}។ ជម្រៅ៖ {depth} គ.ម។ ប្រភព៖ {provider}។
 */
export function generateEventAnnouncement(
  event: EarthquakeEvent,
  lang: "en" | "km" = "en"
): string {
  const magStr =
    event.magnitude !== null && event.magnitude !== undefined
      ? event.magnitude.toFixed(1)
      : "—";

  const providerNames = event.reports.map((r) => r.provider).join(" / ") || "USGS";

  const depthStr =
    event.depthKm !== null && event.depthKm !== undefined
      ? `${event.depthKm.toFixed(0)} km`
      : "depth unconfirmed";

  const depthStrKm =
    event.depthKm !== null && event.depthKm !== undefined
      ? `${event.depthKm.toFixed(0)} គ.ម`
      : "ជម្រៅមិនទាន់បញ្ជាក់";

  const date = new Date(event.originTime);
  const timeIct = isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Phnom_Penh",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);

  const dateIct = isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Phnom_Penh",
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);

  const dateIctKm = isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("km-KH", {
        timeZone: "Asia/Phnom_Penh",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);

  const displayLocation = translateEarthquakeLocation(event.location, lang);

  if (lang === "km") {
    return `ការរញ្ជួយដីកម្រិត M${magStr} ត្រូវបានរាយការណ៍នៅជិត ${displayLocation} នៅម៉ោង ${timeIct} ICT ថ្ងៃទី ${dateIctKm}។ ជម្រៅ៖ ${depthStrKm}។ ប្រភព៖ ${providerNames}។`;
  }

  return `M${magStr} earthquake reported near ${displayLocation} at ${timeIct} ICT on ${dateIct}. Depth: ${depthStr}. Source: ${providerNames}.`;
}

/**
 * Normalize USGS GeoJSON feature into normalized EarthquakeEvent
 */
export function normalizeUsgsFeature(feature: any): EarthquakeEvent | null {
  if (!feature || !feature.geometry || !feature.properties) return null;
  const [lon, lat, depth] = feature.geometry.coordinates || [];

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const originTime = feature.properties.time
    ? new Date(feature.properties.time).toISOString()
    : new Date().toISOString();

  const id = `usgs-${feature.id || Math.abs(lat + lon)}`;
  const isRegional = isWithinRegionalEnvelope(lat, lon);
  const distanceToCambodiaKm = Math.round(
    haversineDistanceKm(CAMBODIA_CENTER.latitude, CAMBODIA_CENTER.longitude, lat, lon)
  );

  return {
    id,
    originTime,
    firstSeenAt: originTime,
    updatedAt: feature.properties.updated ? new Date(feature.properties.updated).toISOString() : undefined,
    latitude: lat,
    longitude: lon,
    depthKm: Number.isFinite(depth) ? depth : null,
    magnitude: Number.isFinite(feature.properties.mag) ? feature.properties.mag : null,
    magnitudeType: feature.properties.magType || "M",
    location: (feature.properties.place || (isRegional ? "Regional epicenter" : "Global epicenter")).trim(),
    reviewStatus: feature.properties.status || "automatic",
    status: feature.properties.status || "automatic",
    url: feature.properties.url || `https://earthquake.usgs.gov/earthquakes/eventpage/${feature.id}`,
    isRegional,
    distanceToCambodiaKm,
    reports: [
      {
        provider: "USGS",
        providerEventId: feature.id,
        sourceUrl: feature.properties.url || `https://earthquake.usgs.gov/earthquakes/eventpage/${feature.id}`,
        magnitude: feature.properties.mag,
        magnitudeType: feature.properties.magType,
        depthKm: Number.isFinite(depth) ? depth : null,
      },
    ],
  };
}

/**
 * Parse TMD RSS XML item or text (robust against missing tags)
 */
export function parseTmdXml(xmlText: string): EarthquakeEvent[] {
  const events: EarthquakeEvent[] = [];
  if (!xmlText || typeof xmlText !== "string") return events;

  // Simple and regex-based RSS item parser (browser and node safe without DOM parser dependency)
  const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/gi) || [];

  for (const itemXml of itemMatches) {
    try {
      const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/i);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
      const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/i);
      const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
      const latMatch = itemXml.match(/<geo:lat>([\s\S]*?)<\/geo:lat>/i) || itemXml.match(/latitude[:\s]+([0-9.-]+)/i);
      const lonMatch = itemXml.match(/<geo:long>([\s\S]*?)<\/geo:long>/i) || itemXml.match(/longitude[:\s]+([0-9.-]+)/i);

      const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";
      const desc = descMatch ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";
      const link = linkMatch ? linkMatch[1].trim() : "https://earthquake.tmd.go.th/";
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : "";

      let lat = latMatch ? parseFloat(latMatch[1]) : NaN;
      let lon = lonMatch ? parseFloat(lonMatch[1]) : NaN;

      // Extract magnitude from title or description (e.g. "Magnitude 3.5" or "ขนาด 3.5")
      let mag: number | null = null;
      const magMatch = (title + " " + desc).match(/magnitude[:\s]+([0-9.]+)/i) || (title + " " + desc).match(/ขนาด\s*([0-9.]+)/i);
      if (magMatch) mag = parseFloat(magMatch[1]);

      // Extract depth if present (e.g. "Depth 10 km" or "ลึก 10 กม.")
      let depth: number | null = null;
      const depthMatch = (title + " " + desc).match(/depth[:\s]+([0-9.]+)/i) || (title + " " + desc).match(/ลึก\s*([0-9.]+)/i);
      if (depthMatch) depth = parseFloat(depthMatch[1]);

      let originTime = new Date().toISOString();
      if (pubDate) {
        const d = new Date(pubDate);
        if (!isNaN(d.getTime())) originTime = d.toISOString();
      }

      if (Number.isFinite(lat) && Number.isFinite(lon) && isWithinRegionalEnvelope(lat, lon)) {
        const rawLoc = title.replace(/^Earthquake\s*/i, "").trim() || "Regional epicenter";
        const cleanTitle = translateEarthquakeLocation(rawLoc, "en");
        const id = `tmd-${lat.toFixed(3)}-${lon.toFixed(3)}-${originTime.slice(0, 16)}`;

        const distKm = Math.round(
          haversineDistanceKm(CAMBODIA_CENTER.latitude, CAMBODIA_CENTER.longitude, lat, lon)
        );

        events.push({
          id,
          originTime,
          firstSeenAt: originTime,
          latitude: lat,
          longitude: lon,
          depthKm: depth,
          magnitude: mag,
          magnitudeType: "mb",
          location: cleanTitle,
          reviewStatus: "preliminary",
          status: "preliminary",
          url: link,
          isRegional: true,
          distanceToCambodiaKm: distKm,
          reports: [
            {
              provider: "TMD",
              providerEventId: id,
              sourceUrl: link,
              magnitude: mag,
              depthKm: depth,
            },
          ],
        });
      }
    } catch {
      // Continue parsing remaining items
    }
  }

  return events;
}

/**
 * Parse CENC / China Earthquake Administration (CEA) & Guangdong Seismological Network JSON
 */
export function parseCencJson(jsonObj: Record<string, any>): EarthquakeEvent[] {
  const events: EarthquakeEvent[] = [];
  if (!jsonObj || typeof jsonObj !== "object") return events;

  const itemKeys = Object.keys(jsonObj).filter((k) => k.startsWith("No"));
  for (const k of itemKeys) {
    try {
      const it = jsonObj[k];
      if (!it || !it.time) continue;

      const lat = parseFloat(it.latitude);
      const lon = parseFloat(it.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

      const mag = it.magnitude ? parseFloat(it.magnitude) : null;
      const depth = it.depth ? parseFloat(it.depth) : null;

      // it.time is China Standard Time (Beijing Time, UTC+8)
      const beijingIso = `${it.time.replace(" ", "T")}+08:00`;
      const originDate = new Date(beijingIso);
      if (isNaN(originDate.getTime())) continue;
      const originTime = originDate.toISOString();

      const isReg = isWithinRegionalEnvelope(lat, lon);
      const distKm = Math.round(
        haversineDistanceKm(CAMBODIA_CENTER.latitude, CAMBODIA_CENTER.longitude, lat, lon)
      );

      const isGuangdong = Boolean(it.location && it.location.includes("广东"));
      const cleanLoc = (it.location || it.placeName || "").trim();
      const locationLabel = isGuangdong
        ? `${cleanLoc} (Guangdong, China)`
        : cleanLoc || (isReg ? "Regional epicenter" : "China / Global epicenter");

      const eventId = `cenc-${it.EventID || `${lat.toFixed(2)}-${lon.toFixed(2)}-${originTime.slice(0, 16)}`}`;
      const sourceUrl = isGuangdong
        ? "http://www.gddzj.gov.cn/"
        : `https://news.ceic.ac.cn/`;

      events.push({
        id: eventId,
        originTime,
        firstSeenAt: originTime,
        latitude: lat,
        longitude: lon,
        depthKm: Number.isFinite(depth) ? depth : null,
        magnitude: Number.isFinite(mag) ? mag : null,
        magnitudeType: "M",
        location: locationLabel,
        reviewStatus: it.type || "reviewed",
        status: it.type || "reviewed",
        url: sourceUrl,
        isRegional: isReg,
        distanceToCambodiaKm: distKm,
        reports: [
          {
            provider: "CENC",
            providerEventId: it.EventID || eventId,
            sourceUrl,
            magnitude: Number.isFinite(mag) ? mag : null,
            depthKm: Number.isFinite(depth) ? depth : null,
          },
        ],
      });
    } catch {
      // Continue parsing remaining items
    }
  }

  return events;
}

/**
 * Deduplicate events across providers.
 * Tolerance: Origin time within 60 seconds AND epicenter distance < 30 km.
 * When matching, merges reports array and retains preferred display values.
 */
export function deduplicateEvents(events: EarthquakeEvent[]): EarthquakeEvent[] {
  const sorted = [...events].sort(
    (a, b) => new Date(b.originTime).getTime() - new Date(a.originTime).getTime()
  );

  const deduplicated: EarthquakeEvent[] = [];

  for (const candidate of sorted) {
    const candidateTime = new Date(candidate.originTime).getTime();

    const existingMatch = deduplicated.find((existing) => {
      const existingTime = new Date(existing.originTime).getTime();
      const timeDiffSeconds = Math.abs(candidateTime - existingTime) / 1000;
      if (timeDiffSeconds > 60) return false;

      const distKm = haversineDistanceKm(
        existing.latitude,
        existing.longitude,
        candidate.latitude,
        candidate.longitude
      );
      return distKm <= 30;
    });

    if (existingMatch) {
      // Merge candidate report into existing match without creating duplicate report entries
      for (const rep of candidate.reports) {
        if (!existingMatch.reports.some((r) => r.provider === rep.provider && r.providerEventId === rep.providerEventId)) {
          existingMatch.reports.push(rep);
        }
      }
      // If existing had null depth or magnitude, backfill from candidate
      if (existingMatch.depthKm === null && candidate.depthKm !== null) {
        existingMatch.depthKm = candidate.depthKm;
      }
      if (existingMatch.magnitude === null && candidate.magnitude !== null) {
        existingMatch.magnitude = candidate.magnitude;
      }
    } else {
      deduplicated.push({ ...candidate, reports: [...candidate.reports] });
    }
  }

  return deduplicated;
}

/**
 * Filter events by time window, magnitude, scope (cambodia vs global), and search query
 */
export function filterEarthquakes(
  events: EarthquakeEvent[],
  options: {
    hoursWindow?: number; // 24, 168 (7d), 720 (30d)
    minMagnitude?: number; // 0, 2, 3, 4, 5
    sortOrder?: "newest" | "largest";
    providerFilter?: string; // "all", "USGS", "TMD"
    scope?: "cambodia" | "global" | "all"; // default: "cambodia"
    searchQuery?: string;
  }
): EarthquakeEvent[] {
  const now = Date.now();
  const windowMs = (options.hoursWindow ?? 168) * 3600 * 1000;
  const minMag = options.minMagnitude ?? 0;
  const scope = options.scope ?? "cambodia";
  const search = options.searchQuery?.trim().toLowerCase() || "";

  return events
    .filter((e) => {
      // Time window check
      const eventTime = new Date(e.originTime).getTime();
      if (now - eventTime > windowMs) return false;

      // Minimum magnitude check (treat null as 0 if minMag is 0, otherwise filter out)
      const mag = e.magnitude ?? 0;
      if (mag < minMag) return false;

      // Geographic Scope check:
      // If a search query is typed, search across the entire global database!
      // Otherwise, if scope is "cambodia", filter to Cambodia & surrounding region
      if (!search && scope === "cambodia" && !isWithinRegionalEnvelope(e.latitude, e.longitude)) {
        return false;
      }

      // Search query filter (matches location name, provider, or coordinates)
      if (search) {
        const loc = (e.location || "").toLowerCase();
        const providers = e.reports.map((r) => r.provider.toLowerCase()).join(" ");
        const coords = `${e.latitude.toFixed(2)} ${e.longitude.toFixed(2)}`;
        if (!loc.includes(search) && !providers.includes(search) && !coords.includes(search)) {
          return false;
        }
      }

      // Provider filter check
      if (options.providerFilter && options.providerFilter !== "all") {
        if (!e.reports.some((r) => r.provider === options.providerFilter)) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (options.sortOrder === "largest") {
        const magA = a.magnitude ?? -999;
        const magB = b.magnitude ?? -999;
        if (magB !== magA) return magB - magA;
      }
      return new Date(b.originTime).getTime() - new Date(a.originTime).getTime();
    });
}
