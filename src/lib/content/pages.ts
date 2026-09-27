import { readFileSync } from "node:fs";
import path from "node:path";
import { defaultLocale, type Locale } from "@/i18n/config";

export type AboutPage = {
  title: string;
  intro: string;
  whatTitle: string;
  whatIntro: string;
  arhiItems: string[];
  medeItems: string[];
  divisionsNote: string;
  howTitle: string;
  howText: string;
  helpColumns: [string, string];
  help: [string, string][];
  whyTitle: string;
  whyText: string;
  expertiseTitle: string;
  expertise: string[];
  ctaTitle: string;
  ctaText: string;
};

/** content/pages/about.json, merged over the Romanian text like other content files. */
export function getAboutPage(locale: Locale): AboutPage {
  const file = JSON.parse(readFileSync(path.join(process.cwd(), "content/pages/about.json"), "utf8")) as Record<string, Partial<AboutPage>>;
  return { ...file[defaultLocale], ...file[locale] } as AboutPage;
}

/** Splits a text field on blank lines into paragraphs. */
export function paragraphs(text: string): string[] {
  return text.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}
