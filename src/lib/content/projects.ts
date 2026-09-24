import type { Locale } from "@/i18n/config";
import { readEntries } from "./files";

export type ProjectData = {
  title: string;
  category: string;
  order: number;
  featured: boolean;
  location: string;
  year: number | null;
  /** Built area in m². */
  area: number | null;
  /** Short language-neutral labels, e.g. "Passivhaus". */
  highlights: string[];
  images: string[];
  summary: string;
  /** Markdown. */
  body: string;
};

export type Project = ProjectData & { slug: string; translated: boolean };

/** Categories in the order the studio presents its work. */
export const projectCategories = [
  "constructii-noi",
  "consolidari-si-reabilitari-de-cladiri-existente",
  "amenajare-interioara",
  "studii",
] as const;

export function getProjects(locale: Locale): Project[] {
  return readEntries<ProjectData>("projects", locale, ["summary", "body"])
    .map(({ slug, data, translated }) => ({ ...data, slug, translated }))
    .sort((a, b) => a.order - b.order);
}

export function getProject(locale: Locale, slug: string): Project | undefined {
  return getProjects(locale).find((project) => project.slug === slug);
}

export function getFeaturedProject(locale: Locale): Project {
  const projects = getProjects(locale);
  return projects.find((project) => project.featured) ?? projects[0];
}
