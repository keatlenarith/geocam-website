import { ChevronDown, ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/spa-router";
import { useState, type ReactNode } from "react";
import { useI18n, type TKey } from "@/lib/i18n";

const nav: { to: string; k: TKey }[] = [
  { to: "/about", k: "about" }, { to: "/research", k: "research" },
  { to: "/publications", k: "publications" }, { to: "/events", k: "events" },
  { to: "/membership", k: "membership" }, { to: "/geodata", k: "geodata" },
  { to: "/mining", k: "mining" }, { to: "/news", k: "news" },
  { to: "/geopark", k: "geopark" }, { to: "/lexicon", k: "lexicon" },
  { to: "/contact", k: "contact" },
];
const navGroups = [
 { en: "Organization", km: "អំពីស្ថាប័ន", items: ["/about", "/contact", "/membership"] },
 { en: "Geoscience & Data", km: "ភូគព្ភសាស្ត្រ និងទិន្នន័យ", items: ["/geodata", "/geopark", "/mining"] },
 { en: "Knowledge & Research", km: "ចំណេះដឹង និងការស្រាវជ្រាវ", items: ["/research", "/publications", "/lexicon"] },
 { en: "Community", km: "សហគមន៍", items: ["/news", "/events"] },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="GeoCam home">
      <img src="/geocam-logo.png" alt="GeoCam logo" className="h-11 w-11 rounded-full object-contain" />
      <span className="leading-tight">
        <span className="block font-display text-xl font-semibold text-primary">GeoCam</span>
        <span className="block text-[11px] text-muted-foreground">Geosciences Society of Cambodia</span>
      </span>
    </Link>
  );
}

function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex rounded-full border border-border p-0.5 text-xs font-semibold" role="group" aria-label="Language">
      {(["en", "km"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-3 py-1 ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          {l === "en" ? "EN" : "ខ្មែរ"}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-[1000] border-b border-border bg-background/95 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-2">Skip to content</a>
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-5 px-5 py-3 xl:px-10">
        <Logo />
        <nav className="gc-desktop-nav hidden items-center gap-2 lg:flex" aria-label="Main">
          {navGroups.map(group => <div key={group.en} className="gc-nav-group">
            <button type="button" className="gc-nav-trigger" aria-haspopup="true">{lang === "km" ? group.km : group.en}<ChevronDown className="gc-chevron" size={17} strokeWidth={2.2} aria-hidden="true"/></button>
            <div className="gc-nav-panel">
              {group.items.map(path => {const item = nav.find(n => n.to === path)!; return <Link key={path} to={path} className="gc-nav-link">{t(item.k)}<ArrowUpRight size={16} aria-hidden="true"/></Link>})}
            </div>
          </div>)}
        </nav>
        <div className="flex items-center gap-2">

          <LangSwitch />
          <Link to="/dashboard" className="btn btn-outline hidden !py-1.5 text-xs md:inline-flex">{t("dashboard")}</Link>
          <button className="btn btn-outline !px-3 lg:hidden" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
            <span className="sr-only">Menu</span>
            <span aria-hidden>{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className="gc-mobile-nav border-t border-border px-4 pb-4 lg:hidden" aria-label="Mobile">
          {navGroups.map(group => <details key={group.en} className="gc-mobile-group">
            <summary>{lang === "km" ? group.km : group.en}</summary>
            {group.items.map(path => {const item = nav.find(n=>n.to===path)!;return <Link key={path} to={path} onClick={() => setOpen(false)} className="block py-2 pl-4">{t(item.k)}</Link>})}
          </details>)}
          <Link to="/dashboard" onClick={()=>setOpen(false)} className="block py-3">{t("dashboard")}</Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 bg-forest-deep text-on-dark">
      <div className="strata h-2" aria-hidden />
      <div className="mx-auto grid max-w-[1800px] gap-10 px-5 py-14 xl:px-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl">GeoCam</p>
          <p className="mt-1 text-sm opacity-80">{t("orgName")}</p>
          <p className="mt-4 max-w-md text-sm opacity-70">{t("footerTag")}</p><a className="mt-4 inline-block text-sm underline underline-offset-4" href="mailto:keatlenarith@gmail.com">keatlenarith@gmail.com</a>
        </div>
        <div className="space-y-2 text-sm">
          {nav.slice(0, 4).map((n) => <Link key={n.to} to={n.to} className="block opacity-80 hover:opacity-100">{t(n.k)}</Link>)}
        </div>
        <div className="space-y-2 text-sm">
          {nav.slice(4).map((n) => <Link key={n.to} to={n.to} className="block opacity-80 hover:opacity-100">{t(n.k)}</Link>)}
          <Link to="/admin" className="block opacity-80 hover:opacity-100">{t("admin")}</Link>
        </div>
      </div>
      <p className="border-t border-on-dark/15 py-5 text-center text-xs opacity-60">© 2026 GeoCam prototype · Sample content only · No official endorsements implied</p>
    </footer>
  );
}

export function PageHeader({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <section className="border-b border-border bg-muted/60">
      <div className="mx-auto max-w-[1800px] px-5 py-14 xl:px-10">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 text-4xl font-semibold text-primary md:text-5xl">{title}</h1>
        {sub && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{sub}</p>}
      </div>
    </section>
  );
}

export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <div role="note" className="flex items-start gap-2 rounded-lg border border-warning bg-warning/15 px-4 py-3 text-sm">
      <span className="rounded bg-warning px-1.5 py-0.5 text-xs font-bold">DEMO</span>
      <span>{children}</span>
    </div>
  );
}

export function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1800px] px-5 py-12 xl:px-10">{children}</div>;
}

export const meta = (title: string, description: string) => ({
  meta: [
    { title: `${title} · GeoCam` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · GeoCam` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
