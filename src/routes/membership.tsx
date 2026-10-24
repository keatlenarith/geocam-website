import { createFileRoute } from "@/lib/spa-router";
import { useState } from "react";
import { Container, DemoNote, PageHeader, meta } from "@/components/site/Chrome";
import { members } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/membership")({
  head: () => meta("Membership", "Apply to join GeoCam and browse the opt-in member directory."),
  component: Membership,
});

const tiers = [
  { en: "Student", km: "និស្សិត", descEn: "For enrolled geoscience students", descKm: "សម្រាប់និស្សិតដែលកំពុងសិក្សាផ្នែកភូគព្ភវិទ្យាសាស្ត្រ" },
  { en: "Professional", km: "អ្នកជំនាញ", descEn: "Practising geoscientists and engineers", descKm: "អ្នកភូគព្ភវិទ្យា និងវិស្វករកំពុងប្រកបវិជ្ជាជីវៈ" },
  { en: "Associate", km: "សមាជិកសហការ", descEn: "Educators, NGOs and interested public", descKm: "អ្នកអប់រំ អង្គការក្រៅរដ្ឋាភិបាល និងសាធារណជនទូទៅ" },
];

function Membership() {
  const { t, lang } = useI18n();
  const km = lang === "km";
  const [done, setDone] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const visible = members.filter((m) => m.showInDirectory && `${m.name} ${m.field}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader eyebrow={t("membership")} title={t("joinTitle")} sub={t("joinSub")} />
      <Container>
        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map((tr) => (
            <div key={tr.en} className="card-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">{km ? tr.km : tr.en}</h2>
              <p className="mt-1 text-muted-foreground">{km ? tr.descKm : tr.descEn}</p>
            </div>
          ))}
        </div>

        <section className="mt-14 grid gap-10 lg:grid-cols-2">
          <form
            className="card-surface space-y-4 p-7"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              setDone(String(f.get("name")));
              e.currentTarget.reset();
            }}
          >
            <h2 className="text-2xl font-semibold text-primary">{t("application")}</h2>
            <DemoNote>
              {km
                ? "ពាក្យស្នើសុំមិនត្រូវបានរក្សាទុកក្នុងគេហទំព័រគំរូនេះទេ។ ពេលដំណើរការប្រព័ន្ធខាងក្រោយ ព័ត៌មាននឹងត្រូវបញ្ជូនទៅ membership_applications សម្រាប់អ្នកគ្រប់គ្រងពិនិត្យ។"
                : "Applications are not stored in this prototype. With the backend enabled they go to membership_applications for admin review."}
            </DemoNote>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm font-medium">{km ? "ឈ្មោះពេញ" : "Full name"}</label>
                <input id="name" name="name" required className="field mt-1" />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium">{km ? "អ៊ីមែល" : "Email"}</label>
                <input id="email" name="email" type="email" required className="field mt-1" />
              </div>
              <div>
                <label htmlFor="cat" className="text-sm font-medium">{km ? "ប្រភេទសមាជិកភាព" : "Category"}</label>
                <select id="cat" name="cat" className="field mt-1">
                  {tiers.map((tr) => (
                    <option key={tr.en} value={tr.en}>{km ? tr.km : tr.en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="aff" className="text-sm font-medium">{km ? "ស្ថាប័ន / អង្គភាព" : "Affiliation"}</label>
                <input id="aff" name="aff" className="field mt-1" />
              </div>
            </div>
            <div>
              <label htmlFor="field" className="text-sm font-medium">{km ? "ជំនាញឯកទេស" : "Field of expertise"}</label>
              <input id="field" name="field" className="field mt-1" />
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="dir" className="mt-1" />
              <span>{km ? "បង្ហាញឈ្មោះ ស្ថាប័ន និងជំនាញរបស់ខ្ញុំក្នុងបញ្ជីសាធារណៈ (អ៊ីមែលមិនត្រូវបានបង្ហាញឡើយ)។" : "List my name, affiliation and field in the public directory (email is never shown)."}</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" required className="mt-1" />
              <span>{km ? "ខ្ញុំយល់ព្រមតាមក្រមសីលធម៌ និងគោលការណ៍ឯកជនភាពរបស់សមាគម។" : "I agree to the society’s code of conduct and privacy notice."}</span>
            </label>
            <button className="btn btn-accent">{t("apply")}</button>
            {done && (
              <p role="status" className="text-sm font-semibold text-primary">
                {km ? `គំរូសាកល្បង៖ ពាក្យស្នើសុំរបស់ ${done} ត្រូវបានផ្ទៀងផ្ទាត់ ប៉ុន្តែមិនបានរក្សាទុកទេ។` : `Demo: application for ${done} validated but NOT saved.`}
              </p>
            )}
          </form>

          <div>
            <h2 className="text-2xl font-semibold text-primary">{t("directory")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {km ? "មានតែសមាជិកដែលបានយល់ព្រមប៉ុណ្ណោះដែលត្រូវបានបង្ហាញ។ ព័ត៌មានលម្អិតទំនាក់ទំនងត្រូវបានលាក់ សារនឹងត្រូវបញ្ជូនបន្តតាមរយៈលេខាធិការដ្ឋាន។" : "Only members who opted in are listed. Contact details are hidden; messages are relayed by the secretariat."}
            </p>
            <input
              aria-label="Search directory"
              className="field mt-4"
              placeholder={km ? "ស្វែងរកបញ្ជីសមាជិក…" : `${t("search")}…`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
              {visible.map((m) => (
                <li key={m.id} className="flex justify-between gap-4 p-4">
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-sm text-muted-foreground">{m.affiliation}</p>
                  </div>
                  <span className="self-center rounded-full bg-sage/30 px-3 py-1 text-xs font-semibold">{m.field}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              {km
                ? `${members.length - members.filter((m) => m.showInDirectory).length} សមាជិកត្រូវបានលាក់តាមការកំណត់ឯកជនភាព · ឈ្មោះគំរូ`
                : `${members.length - members.filter((m) => m.showInDirectory).length} member(s) hidden by privacy preference · sample names`}
            </p>
          </div>
        </section>
      </Container>
    </>
  );
}
