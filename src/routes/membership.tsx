import { createFileRoute } from "@/lib/spa-router";
import { useState, useEffect, useMemo } from "react";
import { Container, PageHeader, meta } from "@/components/site/Chrome";
import {
  getMembers,
  submitApplication,
  subscribeMembers,
  MEMBER_LEVELS,
  type Member,
  type MemberLevel,
} from "@/lib/member-service";
import { useI18n } from "@/lib/i18n";
import { CheckCircle2, Search, Filter, ShieldCheck, Users, Mail, Building, Award } from "lucide-react";

export const Route = createFileRoute("/membership")({
  head: () =>
    meta(
      "Membership & Directory",
      "Apply to join the Geosciences Society of Cambodia (GeoCam) and explore our official opt-in member roster."
    ),
  component: Membership,
});

const tiers = [
  {
    en: "Student",
    km: "និស្សិត",
    descEn: "For enrolled undergraduate & postgraduate geoscience students",
    descKm: "សម្រាប់និស្សិតដែលកំពុងសិក្សាថ្នាក់បរិញ្ញាបត្រ ឬក្រោយបរិញ្ញាបត្រផ្នែកភូគព្ភវិទ្យា",
  },
  {
    en: "Professional",
    km: "អ្នកជំនាញ",
    descEn: "Practising geologists, geoscientists, and geotechnical engineers",
    descKm: "អ្នកភូគព្ភវិទ្យា និងវិស្វករកំពុងប្រកបវិជ្ជាជីវៈ",
  },
  {
    en: "Associate",
    km: "សមាជិកសហការ",
    descEn: "Educators, allied scientists, and geospatial enthusiasts",
    descKm: "អ្នកអប់រំ អ្នកវិទ្យាសាស្ត្របរិស្ថាន និងអ្នកស្រាវជ្រាវទូទៅ",
  },
];

function Membership() {
  const { t, lang } = useI18n();
  const km = lang === "km";

  const [membersList, setMembersList] = useState<Member[]>(() => getMembers());
  const [submittedApp, setSubmittedApp] = useState<{ id: string; name: string; category: string } | null>(null);
  const [q, setQ] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");

  useEffect(() => {
    const unsub = subscribeMembers(() => {
      setMembersList(getMembers());
    });
    return unsub;
  }, []);

  const visible = useMemo(() => {
    return membersList.filter((m) => {
      if (!m.showInDirectory) return false;
      if (m.status === "Inactive" || m.status === "Expired") return false;
      if (levelFilter !== "ALL" && m.level !== levelFilter) return false;
      if (q.trim()) {
        const query = q.toLowerCase().trim();
        const matchName = m.name?.toLowerCase().includes(query) || m.nameKm?.includes(query);
        const matchField = m.field?.toLowerCase().includes(query) || m.fieldKm?.includes(query);
        const matchAff = m.affiliation?.toLowerCase().includes(query) || m.affiliationKm?.includes(query);
        return matchName || matchField || matchAff;
      }
      return true;
    });
  }, [membersList, q, levelFilter]);

  const hiddenCount = useMemo(() => {
    return membersList.length - membersList.filter((m) => m.showInDirectory && m.status !== "Inactive").length;
  }, [membersList]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);

    const name = String(f.get("name") || "").trim();
    const email = String(f.get("email") || "").trim();
    const category = String(f.get("cat") || "Professional");
    const affiliation = String(f.get("aff") || "").trim();
    const field = String(f.get("field") || "").trim();
    const showInDirectory = f.get("dir") === "on";

    if (!name || !email) return;

    const newApp = submitApplication({
      name,
      email,
      category,
      affiliation,
      field,
      showInDirectory,
    });

    setSubmittedApp({ id: newApp.id, name: newApp.name, category: newApp.category });
    form.reset();
  };

  const getLevelBadgeClass = (lvl?: MemberLevel) => {
    switch (lvl) {
      case "Student":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
      case "Professional":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
      case "Associate":
        return "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800";
      case "Honorary Fellow":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
      case "Corporate":
        return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800";
      case "Executive":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const getLevelLabel = (lvl?: MemberLevel) => {
    const found = MEMBER_LEVELS.find((l) => l.id === lvl);
    if (!found) return lvl || "Professional";
    return km ? found.km : found.en;
  };

  return (
    <>
      <PageHeader
        eyebrow={t("membership")}
        title={km ? "សមាជិកភាព និងបញ្ជីសមាជិកផ្លូវការ" : "Membership & Official Directory"}
        sub={
          km
            ? "ចូលរួមជាមួយសហគមន៍អ្នកភូគព្ភវិទ្យា និស្សិត និងអ្នកជំនាញវិទ្យាសាស្ត្រផែនដី ដើម្បីទទួលបានធនធាន និងបណ្តាញកិច្ចសហការ។"
            : "Connect with Cambodia's earth science community, access specialized research resources, and participate in collaborative field studies."
        }
      />

      <Container>
        {/* 1. Tiers Overview */}
        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map((tr) => (
            <div key={tr.en} className="card-surface p-6 transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-primary">{km ? tr.km : tr.en}</h2>
                <Award size={20} className="text-primary/60" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{km ? tr.descKm : tr.descEn}</p>
            </div>
          ))}
        </div>

        {/* 2. Main Content Grid: Application Form + Directory */}
        <section className="mt-14 grid gap-10 lg:grid-cols-2 items-start">
          {/* A: Application Form */}
          <form onSubmit={handleSubmit} className="card-surface space-y-4 p-7 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <ShieldCheck size={22} className="text-primary" />
              <h2 className="text-2xl font-semibold text-primary">
                {km ? "ពាក្យស្នើសុំចូលជាសមាជិក" : "Membership Application"}
              </h2>
            </div>

            <p className="text-sm text-muted-foreground">
              {km
                ? "សូមបំពេញព័ត៌មានខាងក្រោម។ ពាក្យស្នើសុំរបស់អ្នកនឹងត្រូវបញ្ជូនទៅកាន់លេខាធិការដ្ឋាន GeoCam សម្រាប់ការត្រួតពិនិត្យ និងអនុម័តជាផ្លូវការ។"
                : "Fill out the application below. Submissions are reviewed by the GeoCam Secretariat for official accreditation and membership badge assignment."}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  {km ? "ឈ្មោះពេញ *" : "Full name *"}
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  placeholder="e.g. Dara Sok"
                  className="field mt-1"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  {km ? "អ៊ីមែល *" : "Email *"}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.org"
                  className="field mt-1"
                />
              </div>
              <div>
                <label htmlFor="cat" className="text-sm font-medium">
                  {km ? "កម្រិតសមាជិកភាព *" : "Membership Tier *"}
                </label>
                <select id="cat" name="cat" className="field mt-1">
                  {MEMBER_LEVELS.map((tr) => (
                    <option key={tr.id} value={tr.id}>
                      {km ? tr.km : tr.en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="aff" className="text-sm font-medium">
                  {km ? "ស្ថាប័ន / អង្គភាព" : "Affiliation"}
                </label>
                <input
                  id="aff"
                  name="aff"
                  placeholder="e.g. ITC, RUPP, Ministry..."
                  className="field mt-1"
                />
              </div>
            </div>

            <div>
              <label htmlFor="field" className="text-sm font-medium">
                {km ? "ជំនាញឯកទេស" : "Field of expertise"}
              </label>
              <input
                id="field"
                name="field"
                placeholder="e.g. Structural Geology, Hydrogeology, Geophysics..."
                className="field mt-1"
              />
            </div>

            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="dir" defaultChecked className="mt-1" />
              <span>
                {km
                  ? "បង្ហាញឈ្មោះ ស្ថាប័ន និងជំនាញរបស់ខ្ញុំក្នុងបញ្ជីសាធារណៈ (អ៊ីមែល និងលេខទូរស័ព្ទត្រូវបានរក្សាជាការសម្ងាត់)។"
                  : "List my name, affiliation, and field in the public directory (contact email is kept strictly confidential)."}
              </span>
            </label>

            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input type="checkbox" required className="mt-1" />
              <span>
                {km
                  ? "ខ្ញុំយល់ព្រមតាមក្រមសីលធម៌ និងគោលការណ៍ឯកជនភាពរបស់សមាគមភូគព្ភវិទ្យាសាស្ត្រកម្ពុជា។"
                  : "I agree to the GeoCam code of conduct, scientific ethics, and privacy terms."}
              </span>
            </label>

            <button type="submit" className="btn btn-accent w-full sm:w-auto">
              {km ? "ដាក់ពាក្យស្នើសុំ" : "Submit Application"}
            </button>

            {submittedApp && (
              <div
                role="status"
                className="mt-3 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
              >
                <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-emerald-600" />
                <div>
                  <p className="font-semibold">
                    {km
                      ? `ពាក្យស្នើសុំរបស់ ${submittedApp.name} ត្រូវបានបញ្ជូនដោយជោគជ័យ!`
                      : `Application for ${submittedApp.name} submitted successfully!`}
                  </p>
                  <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
                    {km
                      ? `លេខកូដពាក្យស្នើសុំ #${submittedApp.id} · កម្រិត ${submittedApp.category}។ លេខាធិការដ្ឋាននឹងពិនិត្យ និងជូនដំណឹងតាមអ៊ីមែល។`
                      : `Application #${submittedApp.id} · Category: ${submittedApp.category}. Our Secretariat has recorded your application for admin review.`}
                  </p>
                </div>
              </div>
            )}
          </form>

          {/* B: Public Member Directory */}
          <div className="card-surface p-7 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Users size={22} className="text-primary" />
                <h2 className="text-2xl font-semibold text-primary">
                  {km ? "បញ្ជីសមាជិកផ្លូវការ" : "Member Directory"}
                </h2>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {visible.length} {km ? "សមាជិក" : "members"}
              </span>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {km
                ? "មានតែសមាជិកដែលបានយល់ព្រមប៉ុណ្ណោះដែលត្រូវបានបង្ហាញ។ ព័ត៌មានលម្អិតទំនាក់ទំនងត្រូវបានការពារ សារនឹងត្រូវបញ្ជូនបន្តតាមរយៈលេខាធិការដ្ឋាន។"
                : "Only members who opted in are listed. Contact details remain protected; inquiries are routed through the secretariat."}
            </p>

            {/* Search and Level Filter */}
            <div className="mt-4 space-y-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  aria-label="Search directory"
                  className="field pl-9"
                  placeholder={
                    km
                      ? "ស្វែងរកតាមឈ្មោះ ស្ថាប័ន ឬជំនាញឯកទេស…"
                      : "Search directory by name, affiliation, or field…"
                  }
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>

              {/* Level Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                <span className="text-muted-foreground font-medium flex items-center gap-1 mr-1">
                  <Filter size={12} />
                  {km ? "កម្រិត៖" : "Tier:"}
                </span>
                <button
                  onClick={() => setLevelFilter("ALL")}
                  className={`rounded-full px-2.5 py-1 font-medium transition ${
                    levelFilter === "ALL"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {km ? "ទាំងអស់" : "All"}
                </button>
                {MEMBER_LEVELS.slice(0, 4).map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setLevelFilter(lvl.id)}
                    className={`rounded-full px-2.5 py-1 font-medium transition ${
                      levelFilter === "lvl.id" || levelFilter === lvl.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {km ? lvl.km : lvl.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Members Directory List */}
            <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card max-h-[460px] overflow-y-auto">
              {visible.length === 0 ? (
                <li className="p-8 text-center text-muted-foreground">
                  <p className="font-medium">{km ? "រកមិនឃើញសមាជិកដែលត្រូវគ្នា" : "No members found"}</p>
                  <p className="text-xs mt-1 text-muted-foreground">
                    {km ? "សូមសាកល្បងពាក្យស្វែងរកផ្សេងទៀត" : "Try adjusting your search or tier filter"}
                  </p>
                </li>
              ) : (
                visible.map((m) => (
                  <li key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-muted/30 transition">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">
                            {km && m.nameKm ? m.nameKm : m.name}
                          </p>
                          {km && m.nameKm && m.name !== m.nameKm && (
                            <span className="text-xs text-muted-foreground">({m.name})</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Building size={12} className="shrink-0" />
                          <span>{km && m.affiliationKm ? m.affiliationKm : m.affiliation}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getLevelBadgeClass(
                          m.level
                        )}`}
                      >
                        {getLevelLabel(m.level)}
                      </span>
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {km && m.fieldKm ? m.fieldKm : m.field}
                      </span>
                    </div>
                  </li>
                ))
              )}
            </ul>

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {km
                  ? `${hiddenCount} សមាជិកត្រូវបានលាក់តាមការកំណត់ឯកជនភាព`
                  : `${hiddenCount} member(s) hidden by privacy preference`}
              </span>
              <span>{km ? "បានផ្ទៀងផ្ទាត់ដោយ GeoCam" : "Verified by GeoCam"}</span>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
