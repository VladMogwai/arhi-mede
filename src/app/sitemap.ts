import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/i18n/config";
import { getPillars } from "@/lib/content/pillars";
import { getProjects } from "@/lib/content/projects";
import { languageAlternates, localizedUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pillarPaths = getPillars(defaultLocale).map((pillar) => `/${pillar.division}/${pillar.slug}`);
  const pages = ["", "/about", "/arhi", "/mede", "/projects", ...pillarPaths].flatMap((path) =>
    locales.map((locale) => ({ url: localizedUrl(locale, path), alternates: { languages: languageAlternates(path) } })),
  );
  // Untranslated projects point their canonical URL at Romanian, so only translated versions are listed.
  const projects = locales.flatMap((locale) =>
    getProjects(locale)
      .filter((project) => project.translated)
      .map((project) => ({ url: localizedUrl(locale, `/projects/${project.slug}`) })),
  );
  return [...pages, ...projects];
}
