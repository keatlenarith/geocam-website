import { ChevronDown, ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/spa-router";
import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { useI18n, type TKey } from "@/lib/i18n";
import { VisitorCounter } from "./VisitorCounter";

const nav: { to: string; k: TKey }[] = [
  { to: "/about", k: "about" },
  { to: "/research", k: "research" },
  { to: "/publications", k: "publications" },
  { to: "/events", k: "events" },
  { to: "/membership", k: "membership" },
  { to: "/geodata", k: "geodata" },
  { to: "/mining", k: "mining" },
  { to: "/news", k: "news" },
  { to: "/geopark", k: "geopark" },
  { to: "/lexicon", k: "lexicon" },
  { to: "/contact", k: "contact" },
  { to: "/environmental-monitoring", k: "environmentalMonitoring" },
  { to: "/earthquake-monitoring", k: "earthquakeMonitoring" },
];
const navGroups = [
  {
    en: "Organization",
    km: "អំពីស្ថាប័ន",
    items: ["/about", "/contact", "/membership"],
  },
  {
    en: "Geoscience & Data",
    km: "ភូគព្ភវិទ្យាសាស្ត្រ និងទិន្នន័យ",
    items: ["/geodata", "/environmental-monitoring", "/earthquake-monitoring", "/geopark", "/mining"],
  },
  {
    en: "Knowledge & Research",
    km: "ចំណេះដឹង និងការស្រាវជ្រាវ",
    items: ["/research", "/publications", "/lexicon"],
  },
  { en: "Community", km: "សហគមន៍", items: ["/news", "/events"] },
];

function Logo() {
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
}

function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div
      className="flex rounded-full border border-border p-0.5 text-xs font-semibold"
      role="group"
      aria-label="Language"
    >
      {(["en", "km"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-3 py-1 ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          {l === "en" ? "EN" : "KH"}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const closeCooldownRef = useRef(false);

  const closeDropdowns = useCallback(() => {
    closeCooldownRef.current = true;
    setOpenGroup(null);
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setTimeout(() => {
      closeCooldownRef.current = false;
    }, 250);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      closeDropdowns();
      setOpen(false);
    };
    const onMouseDown = (e: MouseEvent) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target as Node)) {
        closeDropdowns();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDropdowns();
        setOpen(false);
      }
    };

    window.addEventListener("popstate", onPopState);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeDropdowns]);

  return (
    <header className="sticky top-0 z-[1000] border-b border-border bg-background/95 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:p-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-5 px-5 py-3 xl:px-10">
        <Logo />
        <nav
          ref={desktopNavRef}
          className="gc-desktop-nav hidden items-center gap-2 lg:flex"
          aria-label="Main"
        >
          {navGroups.map((group) => {
            const isOpen = openGroup === group.en;
            return (
              <div
                key={group.en}
                className={`gc-nav-group ${isOpen ? "is-open" : ""}`}
                onMouseEnter={() => {
                  if (!closeCooldownRef.current) {
                    setOpenGroup(group.en);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setOpenGroup((curr) => (curr === group.en ? null : curr));
                  }
                }}
              >
                <button
                  type="button"
                  className="gc-nav-trigger"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onClick={() => {
                    if (isOpen) {
                      closeDropdowns();
                    } else {
                      setOpenGroup(group.en);
                    }
                  }}
                >
                  {lang === "km" ? group.km : group.en}
                  <ChevronDown
                    className="gc-chevron"
                    size={17}
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="gc-nav-panel" role="menu">
                    {group.items.map((path) => {
                      const item = nav.find((n) => n.to === path)!;
                      return (
                        <Link
                          key={path}
                          to={path}
                          className="gc-nav-link"
                          role="menuitem"
                          onClick={() => {
                            closeDropdowns();
                          }}
                        >
                          {t(item.k)}
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="https://www.facebook.com/geoscience.cambodia/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-xs dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white"
            title="Follow Geosciences Society of Cambodia on Facebook"
            aria-label="Facebook Page"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <LangSwitch />
          <Link
            to="/dashboard"
            className="btn btn-outline hidden !py-1.5 text-xs md:inline-flex"
          >
            {t("dashboard")}
          </Link>
          <button
            className="btn btn-outline !px-3 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden>{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="gc-mobile-nav border-t border-border px-4 pb-4 lg:hidden"
          aria-label="Mobile"
        >
          <div className="flex items-center justify-between py-3 border-b border-border/60 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {lang === "km" ? "ភាសា" : "Language"}
            </span>
            <LangSwitch />
          </div>
          {navGroups.map((group) => (
            <details key={group.en} className="gc-mobile-group">
              <summary>{lang === "km" ? group.km : group.en}</summary>
              {group.items.map((path) => {
                const item = nav.find((n) => n.to === path)!;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => {
                      setOpen(false);
                      closeDropdowns();
                    }}
                    className="block py-2 pl-4"
                  >
                    {t(item.k)}
                  </Link>
                );
              })}
            </details>
          ))}
          <Link
            to="/dashboard"
            onClick={() => {
              setOpen(false);
              closeDropdowns();
            }}
            className="block py-3"
          >
            {t("dashboard")}
          </Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t, lang } = useI18n();
  return (
    <footer className="mt-24 bg-forest-deep text-on-dark">
      <div className="strata h-2" aria-hidden />
      <div className="mx-auto grid max-w-[1800px] gap-10 px-5 py-14 xl:px-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl">GeoCam</p>
          <p className="mt-1 text-sm opacity-80">{t("orgName")}</p>
          <p className="mt-4 max-w-md text-sm opacity-70">{t("footerTag")}</p>
          <a
            className="mt-4 inline-block text-sm underline underline-offset-4"
            href="mailto:keatlenarith@gmail.com"
          >
            keatlenarith@gmail.com
          </a>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href="https://www.facebook.com/geoscience.cambodia/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-500 transition"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>{lang === "km" ? "ទំព័រហ្វេសប៊ុកផ្លូវការ" : "Official Facebook Page"}</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="mt-5">
            <VisitorCounter />
          </div>
        </div>
        <div className="space-y-2 text-sm">
          {nav.slice(0, 4).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="block opacity-80 hover:opacity-100"
            >
              {t(n.k)}
            </Link>
          ))}
        </div>
        <div className="space-y-2 text-sm">
          {nav.slice(4).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="block opacity-80 hover:opacity-100"
            >
              {t(n.k)}
            </Link>
          ))}
        </div>
      </div>
      <p className="border-t border-on-dark/15 py-5 text-center text-xs opacity-60">
        {lang === "km"
          ? "© ២០២៦ GeoCam · គេហទំព័រគំរូ · មាតិកាគំរូប៉ុណ្ណោះ · មិនសំដៅលើការទទួលស្គាល់ជាផ្លូវការទេ"
          : "© 2026 GeoCam prototype · Sample content only · No official endorsements implied"}
      </p>
    </footer>
  );
}

export function PageHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
}) {
  const namedFields = !["/", "/about", "/research", "/membership", "/contact"].includes(location.pathname);
  return (
    <section className="border-b border-border bg-muted/60">
      <div className="mx-auto max-w-[1800px] px-5 py-14 xl:px-10">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 data-cms-id={namedFields ? "page-title" : undefined} className="mt-2 text-4xl font-semibold text-primary md:text-5xl">
          {title}
        </h1>
        {sub && (
            <p data-cms-id={namedFields ? "page-description" : undefined} className="mt-4 max-w-2xl text-lg text-muted-foreground">{sub}</p>
        )}
      </div>
    </section>
  );
}

export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <div
      role="note"
      className="flex items-start gap-2 rounded-lg border border-warning bg-warning/15 px-4 py-3 text-sm"
    >
      <span className="rounded bg-warning px-1.5 py-0.5 text-xs font-bold">
        DEMO
      </span>
      <span>{children}</span>
    </div>
  );
}

export function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1800px] px-5 py-12 xl:px-10">{children}</div>
  );
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
