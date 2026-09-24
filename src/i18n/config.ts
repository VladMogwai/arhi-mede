export const locales = ["ro", "en", "de", "uk"] as const;

export type Locale = (typeof locales)[number];

/** Content is written in Romanian first; other locales fall back to it until translated. */
export const defaultLocale: Locale = "ro";

export const openGraphLocales: Record<Locale, string> = {
  ro: "ro_RO",
  en: "en_US",
  de: "de_DE",
  uk: "uk_UA",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
