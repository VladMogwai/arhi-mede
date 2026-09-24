import type { Metadata } from "next";
import { siteUrl, studio } from "@/config/site";
import { defaultLocale, locales, openGraphLocales, type Locale } from "@/i18n/config";

export function localizedUrl(locale: Locale, path = ""): string {
  return `${siteUrl}/${locale}${path}`;
}

/** hreflang map for a page that exists in every locale. */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, localizedUrl(locale, path)])),
    "x-default": localizedUrl(defaultLocale, path),
  };
}

type PageMetadataOptions = {
  locale: Locale;
  /** Path after the locale prefix, e.g. "/projects". Empty for the home page. */
  path: string;
  title: string;
  description: string;
  /**
   * False when this locale only shows the Romanian fallback text: the page then points
   * its canonical URL at the Romanian version instead of competing with it in search.
   */
  translated?: boolean;
  image?: string;
};

export function pageMetadata({ locale, path, title, description, translated = true, image }: PageMetadataOptions): Metadata {
  const url = localizedUrl(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical: translated ? url : localizedUrl(defaultLocale, path),
      languages: translated ? languageAlternates(path) : undefined,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      locale: openGraphLocales[locale],
      siteName: studio.name,
      images: image ? [image] : undefined,
    },
  };
}
