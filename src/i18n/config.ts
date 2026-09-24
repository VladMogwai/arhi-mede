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

/** URL path of a page in a locale: Romanian lives at the site root, other locales under their prefix. */
export function localePath(locale: Locale, path = ""): string {
  return `${locale === defaultLocale ? "" : `/${locale}`}${path}` || "/";
}

/** Splits a pathname into its locale and the path after the prefix: "/en/projects" → en, "/projects". */
export function splitLocalePath(pathname: string): { locale: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first) && first !== defaultLocale) return { locale: first, path: rest.length ? `/${rest.join("/")}` : "" };
  return { locale: defaultLocale, path: pathname === "/" ? "" : pathname };
}
