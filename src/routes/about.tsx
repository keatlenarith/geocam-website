import { createFileRoute } from "@/lib/spa-router";
import { Container, PageHeader, meta } from "@/components/site/Chrome";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => meta("About", "GeoCam’s mission, values and leadership: an independent professional society for Cambodian geoscience."),
  component: About,
});

const roles = ["President", "Vice-President", "General Secretary", "Treasurer", "Education Officer", "Data & Outreach Officer"];

function About() {
  const { t, lang } = useI18n();
  const km = lang === "km";
  return (
    <>
      <PageHeader eyebrow={t("about")} title={t("mission")} sub={km ? "លើកកម្ពស់ចំណេះដឹងភូគព្ភសាស្ត្រកម្ពុជា គាំទ្រអ្នកជំនាញជំនាន់ថ្មី និងចែករំលែកចំណេះដឹងសម្រាប់សង្គម។" : "To advance understanding of Cambodia’s geology, support the next generation of geoscientists, and share knowledge that helps communities live safely and use earth resources responsibly."} />
      <Container>
        <div className="relative mt-7 mb-10 overflow-hidden rounded-2xl min-h-[250px] md:min-h-[330px]">
          <img src="/about-geology.jpg" alt="Cambodian geological landscape" className="absolute inset-0 h-full w-full object-cover" data-cms-id="about-background-image" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent pointer-events-none" />
          <div className="absolute bottom-5 left-6 right-6 text-white pointer-events-none"><p className="text-2xl font-semibold" data-cms-id="about-hero-title">{km ? "សហគមន៍ភូគព្ភសាស្ត្រកម្ពុជា" : "Cambodia’s geoscience community"}</p></div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {(km ? [
            ["វិទ្យាសាស្ត្រ", "លើកកម្ពស់ការស្រាវជ្រាវភូគព្ភសាស្ត្រប្រកបដោយគុណភាព និងការផ្សព្វផ្សាយចំណេះដឹង។"],
            ["ការអប់រំ", "រៀបចំការសិក្សាទីវាល ការណែនាំ និងសម្ភារៈសិក្សាពីរភាសាសម្រាប់និស្សិត និងអ្នកជំនាញវ័យក្មេង។"],
            ["សង្គម", "ផ្សព្វផ្សាយចំណេះដឹងអំពីគ្រោះមហន្តរាយភូគព្ភសាស្ត្រ និងធនធានធម្មជាតិដល់សាធារណជន។"],
          ] : [
            ["Science", "Promote rigorous, open and peer-reviewed geoscience about Cambodia and the wider Indochina region."],
            ["Education", "Run field schools, mentoring and bilingual learning material for students and early-career members."],
            ["Society", "Communicate geohazard and resource knowledge clearly to the public, independent of any commercial interest."],
          ]).map(([h, p]) => (
            <div key={h} className="card-surface p-6"><h2 className="text-2xl font-semibold text-primary">{h}</h2><p className="mt-2 text-muted-foreground">{p}</p></div>
          ))}
        </div>
        <h2 className="mt-16 text-3xl font-semibold text-primary">{t("leadership")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{km ? "មុខតំណែងគំរូ — ឈ្មោះនឹងផ្សព្វផ្សាយបន្ទាប់ពីមហាសន្និបាតបង្កើតសមាគម។" : "Placeholder positions — names will be published after the founding general assembly."}</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <div key={r} className="flex items-center gap-4 rounded-xl border border-dashed border-border bg-card p-5">
              <div className="strata h-14 w-14 rounded-full opacity-60" aria-hidden />
              <div><p className="font-semibold">{km ? ({"President":"ប្រធាន", "Vice-President":"អនុប្រធាន", "General Secretary":"អគ្គលេខាធិការ", "Treasurer":"ហេរញ្ញិក", "Education Officer":"មន្ត្រីអប់រំ", "Data & Outreach Officer":"មន្ត្រីទិន្នន័យ និងផ្សព្វផ្សាយ"} as Record<string,string>)[r] : r}</p><p className="text-sm text-muted-foreground">{km ? "នឹងប្រកាសនៅពេលក្រោយ" : "To be announced"}</p></div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
