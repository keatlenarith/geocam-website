import fs from "node:fs";

console.log("Applying Geoscience translations and Laptop/Desktop image sizing fixes...");

// 1. Chrome.tsx
let chrome = fs.readFileSync("src/components/site/Chrome.tsx", "utf8");
chrome = chrome.replace(
  `function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="GeoCam home">
      <img
        src="/geocam-logo.png"
        alt="GeoCam logo"
        className="h-11 w-11 rounded-full object-contain"
      />
      <span className="leading-tight">
        <span className="block font-display text-xl font-semibold text-primary">
          GeoCam
        </span>
        <span className="block text-[11px] text-muted-foreground">
          Geosciences Society of Cambodia
        </span>
      </span>
    </Link>
  );
}`.replace(/\n/g, "\r\n"),
  `function Logo() {
  const { lang } = useI18n();
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="GeoCam home">
      <img
        src="/geocam-logo.png"
        alt="GeoCam logo"
        className="h-11 w-11 rounded-full object-contain"
      />
      <span className="leading-tight">
        <span className="block font-display text-xl font-semibold text-primary">
          GeoCam
        </span>
        <span className="block text-[11px] text-muted-foreground">
          {lang === "km" ? "សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា" : "Geosciences Society of Cambodia"}
        </span>
      </span>
    </Link>
  );
}`.replace(/\n/g, "\r\n")
);
fs.writeFileSync("src/components/site/Chrome.tsx", chrome, "utf8");
console.log("✓ Updated src/components/site/Chrome.tsx");

// 2. src/routes/index.tsx
let index = fs.readFileSync("src/routes/index.tsx", "utf8");
index = index.replace(
  `GEOSCIENCES SOCIETY<br/>OF CAMBODIA`,
  `{lang === "km" ? <>សមាគមភូគព្ភវិទ្យាសាស្ត្រ<br/>កម្ពុជា</> : <>GEOSCIENCES SOCIETY<br/>OF CAMBODIA</>}`
);
index = index.replace(
  `subtitle:"មជ្ឈមណ្ឌលចំណេះដឹងភូគព្ភសាស្ត្រ ផែនទីអន្តរកម្ម ការស្រាវជ្រាវ ធនធានវិទ្យាសាស្ត្រ និងសហគមន៍អ្នកជំនាញនៅកម្ពុជា។"`,
  `subtitle:"មជ្ឈមណ្ឌលចំណេះដឹងភូគព្ភវិទ្យាសាស្ត្រ ផែនទីអន្តរកម្ម ការស្រាវជ្រាវ ធនធានវិទ្យាសាស្ត្រ និងសហគមន៍អ្នកជំនាញនៅកម្ពុជា។"`
);
index = index.replace(
  `featuredSub:"ច្រកចូលទៅកាន់ចំណេះដឹង និងធនធានឌីជីថលផ្នែកភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា"`,
  `featuredSub:"ច្រកចូលទៅកាន់ចំណេះដឹង និងធនធានឌីជីថលផ្នែកភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា"`
);
index = index.replace(
  `missionBody:"GeoCam ប្រមូលផ្តុំនិស្សិត អ្នកស្រាវជ្រាវ និងអ្នកជំនាញ ដើម្បីចែករំលែកចំណេះដឹងភូគព្ភវិទ្យាសាស្ត្រផ្អែកលើភស្តុតាង និងលើកកម្ពស់ការអប់រំនៅកម្ពុជា។"`,
  `missionBody:"GeoCam ប្រមូលផ្តុំនិស្សិត អ្នកស្រាវជ្រាវ និងអ្នកជំនាញ ដើម្បីចែករំលែកចំណេះដឹងភូគព្ភវិទ្យាសាស្ត្រផ្អែកលើភស្តុតាង និងលើកកម្ពស់ការអប់រំនៅកម្ពុជា។"`
);
fs.writeFileSync("src/routes/index.tsx", index, "utf8");
console.log("✓ Updated src/routes/index.tsx");

// 3. src/routes/research.tsx
let research = fs.readFileSync("src/routes/research.tsx", "utf8");
research = research.replace(
  `lang === "km" ? "វិស័យសំខាន់ៗទាំង៥" : "5 Core Geoscience Disciplines"`,
  `lang === "km" ? "វិស័យសំខាន់ៗទាំង៥នៃភូគព្ភវិទ្យាសាស្ត្រ" : "5 Core Geoscience Disciplines"`
);
research = research.replace(
  `lang === "km"\r\n                ? "វិស័យសំខាន់ៗនៃភូគព្ភសាស្ត្រកម្ពុជា"\r\n                : "Cambodia's Key Geoscience Disciplines"`,
  `lang === "km"\r\n                ? "វិស័យសំខាន់ៗនៃភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា"\r\n                : "Cambodia's Key Geoscience Disciplines"`
);
// Also try LF version just in case
research = research.replace(
  `lang === "km"\n                ? "វិស័យសំខាន់ៗនៃភូគព្ភសាស្ត្រកម្ពុជា"\n                : "Cambodia's Key Geoscience Disciplines"`,
  `lang === "km"\n                ? "វិស័យសំខាន់ៗនៃភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា"\n                : "Cambodia's Key Geoscience Disciplines"`
);
fs.writeFileSync("src/routes/research.tsx", research, "utf8");
console.log("✓ Updated src/routes/research.tsx");

// 4. src/routes/research-topic.tsx
let rTopic = fs.readFileSync("src/routes/research-topic.tsx", "utf8");
rTopic = rTopic.replace(
  `lang === "km" ? "វិស័យសំខាន់ៗផ្សេងទៀតនៃភូគព្ភសាស្ត្រ" : "Other Key Research Disciplines"`,
  `lang === "km" ? "វិស័យសំខាន់ៗផ្សេងទៀតនៃភូគព្ភវិទ្យាសាស្ត្រ" : "Other Key Research Disciplines"`
);
// Article max width constraint on desktop/laptop
rTopic = rTopic.replace(
  `<article className="card-surface p-6 md:p-10 shadow-sm rounded-2xl border border-slate-200">`,
  `<article className="card-surface mx-auto max-w-5xl p-6 md:p-10 shadow-sm rounded-2xl border border-slate-200">`
);
// Featured figure max width constraint
rTopic = rTopic.replace(
  `<figure className="mb-10 rounded-xl border border-slate-200 bg-slate-50 overflow-visible p-2">`,
  `<figure className="mb-10 mx-auto max-w-3xl rounded-xl border border-slate-200 bg-slate-50 overflow-visible p-2">`
);
rTopic = rTopic.replace(
  `className="w-full object-contain bg-slate-50 mx-auto rounded-lg"\r\n              style={{ maxHeight: "none", height: "auto" }}`,
  `className="w-full max-h-[60vh] object-contain bg-slate-50 mx-auto rounded-lg"\r\n              style={{ maxHeight: "60vh", height: "auto" }}`
);
rTopic = rTopic.replace(
  `className="w-full object-contain bg-slate-50 mx-auto rounded-lg"\n              style={{ maxHeight: "none", height: "auto" }}`,
  `className="w-full max-h-[60vh] object-contain bg-slate-50 mx-auto rounded-lg"\n              style={{ maxHeight: "60vh", height: "auto" }}`
);
// Section figures max width constraint
rTopic = rTopic.replace(
  `<figure\r\n                    className="my-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs overflow-visible text-center"`,
  `<figure\r\n                    className="my-6 mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs overflow-visible text-center"`
);
rTopic = rTopic.replace(
  `<figure\n                    className="my-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs overflow-visible text-center"`,
  `<figure\n                    className="my-6 mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs overflow-visible text-center"`
);
rTopic = rTopic.replace(
  `<figure\r\n                      key={imgIdx}\r\n                      className="my-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs overflow-visible text-center"`,
  `<figure\r\n                      key={imgIdx}\r\n                      className="my-6 mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs overflow-visible text-center"`
);
rTopic = rTopic.replace(
  `<figure\n                      key={imgIdx}\n                      className="my-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs overflow-visible text-center"`,
  `<figure\n                      key={imgIdx}\n                      className="my-6 mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs overflow-visible text-center"`
);
fs.writeFileSync("src/routes/research-topic.tsx", rTopic, "utf8");
console.log("✓ Updated src/routes/research-topic.tsx");

// 5. src/routes/news-item.tsx and src/routes/news.tsx
let newsItem = fs.readFileSync("src/routes/news-item.tsx", "utf8");
newsItem = newsItem.replace(
  `eyebrow={lang === "km" ? "ព័ត៌មានភូគព្ភសាស្ត្រ" : "Geoscience News"}`,
  `eyebrow={lang === "km" ? "ព័ត៌មានភូគព្ភវិទ្យាសាស្ត្រ" : "Geoscience News"}`
);
fs.writeFileSync("src/routes/news-item.tsx", newsItem, "utf8");
console.log("✓ Updated src/routes/news-item.tsx");

let news = fs.readFileSync("src/routes/news.tsx", "utf8");
news = news.replace(
  `eyebrow={lang === "km" ? "ព័ត៌មានភូគព្ភសាស្ត្រ" : "Geoscience News"}`,
  `eyebrow={lang === "km" ? "ព័ត៌មានភូគព្ភវិទ្យាសាស្ត្រ" : "Geoscience News"}`
);
news = news.replace(
  `title={\r\n          lang === "km"\r\n            ? "ព័ត៌មានភូគព្ភសាស្ត្រចុងក្រោយ"\r\n            : "Latest Geoscience News"\r\n        }`,
  `title={\r\n          lang === "km"\r\n            ? "ព័ត៌មានភូគព្ភវិទ្យាសាស្ត្រចុងក្រោយ"\r\n            : "Latest Geoscience News"\r\n        }`
);
news = news.replace(
  `title={\n          lang === "km"\n            ? "ព័ត៌មានភូគព្ភសាស្ត្រចុងក្រោយ"\n            : "Latest Geoscience News"\n        }`,
  `title={\n          lang === "km"\n            ? "ព័ត៌មានភូគព្ភវិទ្យាសាស្ត្រចុងក្រោយ"\n            : "Latest Geoscience News"\n        }`
);
fs.writeFileSync("src/routes/news.tsx", news, "utf8");
console.log("✓ Updated src/routes/news.tsx");

// 6. src/admin/page-data.ts
let pageData = fs.readFileSync("src/admin/page-data.ts", "utf8");
pageData = pageData.replace(
  `headlineKm: "ភូគព្ភវិទ្យា និងការសង្កេតផែនដីនៃប្រទេសកម្ពុជា",`,
  `headlineKm: "ភូគព្ភវិទ្យាសាស្ត្រ និងការសង្កេតផែនដីនៃប្រទេសកម្ពុជា",`
);
pageData = pageData.replace(
  `subKm:\r\n      "លើកកម្ពស់ការស្រាវជ្រាវភូគព្ភវិទ្យា ការតាមដានបរិស្ថាន និងធនធានធម្មជាតិប្រកបដោយនិរន្តរភាព។",`,
  `subKm:\r\n      "លើកកម្ពស់ការស្រាវជ្រាវភូគព្ភវិទ្យាសាស្ត្រ ការតាមដានបរិស្ថាន និងធនធានធម្មជាតិប្រកបដោយនិរន្តរភាព។",`
);
pageData = pageData.replace(
  `subKm:\n      "លើកកម្ពស់ការស្រាវជ្រាវភូគព្ភវិទ្យា ការតាមដានបរិស្ថាន និងធនធានធម្មជាតិប្រកបដោយនិរន្តរភាព។",`,
  `subKm:\n      "លើកកម្ពស់ការស្រាវជ្រាវភូគព្ភវិទ្យាសាស្ត្រ ការតាមដានបរិស្ថាន និងធនធានធម្មជាតិប្រកបដោយនិរន្តរភាព។",`
);
pageData = pageData.replace(
  `headlineKm: "ការបោះពុម្ពផ្សាយវិទ្យាសាស្ត្រភូគព្ភសាស្ត្រកម្ពុជា",`,
  `headlineKm: "ការបោះពុម្ពផ្សាយវិទ្យាសាស្ត្រភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា",`
);
pageData = pageData.replace(
  `headlineKm: "ចូលរួមជាមួយសហគមន៍ភូគព្ភវិទ្យា",`,
  `headlineKm: "ចូលរួមជាមួយសហគមន៍ភូគព្ភវិទ្យាសាស្ត្រ",`
);
pageData = pageData.replace(
  `titleKm: "វចនានុក្រមភូគព្ភសាស្ត្រ",`,
  `titleKm: "វចនានុក្រមភូគព្ភវិទ្យាសាស្ត្រ",`
);
pageData = pageData.replace(
  `headlineKm: "វចនានុក្រមពាក្យបច្ចេកទេសភូគព្ភសាស្ត្រ អង់គ្លេស-ខ្មែរ",`,
  `headlineKm: "វចនានុក្រមពាក្យបច្ចេកទេសភូគព្ភវិទ្យាសាស្ត្រ អង់គ្លេស-ខ្មែរ",`
);
pageData = pageData.replace(
  `subKm:\r\n      "ស្វែងរកនិយមន័យ ការបែងចែកប្រភេទភូគព្ភសាស្ត្រ និងពាក្យវិទ្យាសាស្ត្រជាភាសាខ្មែរ។",`,
  `subKm:\r\n      "ស្វែងរកនិយមន័យ ការបែងចែកប្រភេទភូគព្ភវិទ្យាសាស្ត្រ និងពាក្យវិទ្យាសាស្ត្រជាភាសាខ្មែរ។",`
);
pageData = pageData.replace(
  `subKm:\n      "ស្វែងរកនិយមន័យ ការបែងចែកប្រភេទភូគព្ភសាស្ត្រ និងពាក្យវិទ្យាសាស្ត្រជាភាសាខ្មែរ។",`,
  `subKm:\n      "ស្វែងរកនិយមន័យ ការបែងចែកប្រភេទភូគព្ភវិទ្យាសាស្ត្រ និងពាក្យវិទ្យាសាស្ត្រជាភាសាខ្មែរ។",`
);
fs.writeFileSync("src/admin/page-data.ts", pageData, "utf8");
console.log("✓ Updated src/admin/page-data.ts");

// 7. src/lib/auto-khmer.ts
let autoKhmer = fs.readFileSync("src/lib/auto-khmer.ts", "utf8");
if (!autoKhmer.includes("'Geoscience':")) {
  autoKhmer = autoKhmer.replace(
    `'Geosciences Society of Cambodia':'សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា',`,
    `'Geosciences Society of Cambodia':'សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា','Cambodian Geoscience Society':'សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា','Geoscience Association of Cambodia':'សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា','Geoscience':'ភូគព្ភវិទ្យាសាស្ត្រ','Geosciences':'ភូគព្ភវិទ្យាសាស្ត្រ','Geoscience News':'ព័ត៌មានភូគព្ភវិទ្យាសាស្ត្រ','Geoscience Community':'សហគមន៍ភូគព្ភវិទ្យាសាស្ត្រ',`
  );
  fs.writeFileSync("src/lib/auto-khmer.ts", autoKhmer, "utf8");
  console.log("✓ Updated src/lib/auto-khmer.ts");
}

// 8. src/styles.css - Laptop & Desktop image size constraints
let styles = fs.readFileSync("src/styles.css", "utf8");
if (!styles.includes("/* Responsive image sizing for Laptop & Desktop viewports */")) {
  styles += `\r\n
/* Responsive image sizing for Laptop & Desktop viewports */
@media (min-width: 1024px) {
  article figure,
  .geocam-article-body figure,
  .geocam-figure {
    max-width: 820px !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
  article figure img,
  .geocam-article-body img,
  .geocam-img-wrapper img {
    max-height: 65vh !important;
    object-fit: contain !important;
    margin-left: auto !important;
    margin-right: auto !important;
    display: block !important;
  }
}
`;
  fs.writeFileSync("src/styles.css", styles, "utf8");
  console.log("✓ Updated src/styles.css with laptop & desktop responsive image constraints");
}

console.log("=== ALL SCRIPT UPDATES COMPLETE ===");
