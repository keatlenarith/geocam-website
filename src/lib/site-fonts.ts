import { useEffect } from "react";
import { useCms } from "../visual-cms/VisualCms";
import { useI18n } from "./i18n";

export const englishFonts = [
  {
    id: "times",
    label: "Times New Roman",
    css: '"Times New Roman", Times, serif',
  },
  { id: "georgia", label: "Georgia", css: "Georgia, serif" },
  { id: "arial", label: "Arial", css: "Arial, Helvetica, sans-serif" },
  {
    id: "inter",
    label: "Inter",
    css: "Inter, Arial, sans-serif",
    google: "Inter:wght@400;500;600;700",
  },
  {
    id: "lora",
    label: "Lora",
    css: "Lora, Georgia, serif",
    google: "Lora:wght@400;500;600;700",
  },
];
export const khmerFonts = [
  {
    id: "noto-sans-khmer",
    label: "Noto Sans Khmer",
    css: '"Noto Sans Khmer", sans-serif',
    google: "Noto+Sans+Khmer:wght@400;500;600;700",
  },
  {
    id: "battambang",
    label: "Battambang",
    css: 'Battambang, "Noto Sans Khmer", sans-serif',
    google: "Battambang:wght@400;700",
  },
  {
    id: "siemreap",
    label: "Siemreap",
    css: 'Siemreap, "Noto Sans Khmer", sans-serif',
    google: "Siemreap",
  },
  {
    id: "kantumruy-pro",
    label: "Kantumruy Pro",
    css: '"Kantumruy Pro", "Noto Sans Khmer", sans-serif',
    google: "Kantumruy+Pro:wght@400;500;600;700",
  },
];
export const fontCss = (id: string) =>
  [...englishFonts, ...khmerFonts].find((font) => font.id === id)?.css ||
  englishFonts[0].css;
export function loadFontStyles(ids: string[]) {
  for (const id of ids) {
    const font = [...englishFonts, ...khmerFonts].find(
      (font) => font.id === id,
    );
    if (
      !font ||
      !("google" in font) ||
      !font.google ||
      document.getElementById("gc-font-" + id)
    )
      continue;
    const link = document.createElement("link");
    link.id = "gc-font-" + id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=" +
      font.google +
      "&display=swap";
    document.head.append(link);
  }
}
export function SiteFonts() {
  const { published } = useCms();
  const { lang } = useI18n();
  const en = published.__appearance?.englishFont?.value || "times";
  const km = published.__appearance?.khmerFont?.value || "noto-sans-khmer";
  useEffect(() => {
    loadFontStyles([en, km]);
    const root = document.documentElement;
    root.style.setProperty("--geocam-font-en", fontCss(en));
    root.style.setProperty("--geocam-font-km", fontCss(km));
    root.style.setProperty(
      "--geocam-font-active",
      fontCss(lang === "km" ? km : en),
    );
    root.dataset.geocamFonts = "approved";
  }, [en, km, lang]);
  return null;
}
