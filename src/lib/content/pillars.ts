import { localePath, type Locale } from "@/i18n/config";
import { readEntries } from "./files";

/** The two divisions spelled by the name: ARHI (buildings and spaces) and MEDE (materials and circularity). */
export const divisions = ["arhi", "mede"] as const;
export type Division = (typeof divisions)[number];

export type PillarData = {
  /** Brand name, the same in every language: its first letter spells ARHI MEDE. */
  name: string;
  letter: string;
  division: Division;
  order: number;
  title: string;
  summary: string;
  services: string[];
  /** Option in the home "I need…" navigator. */
  need: string;
};

export type Pillar = PillarData & { slug: string };

export function getPillars(locale: Locale, division?: Division): Pillar[] {
  return readEntries<PillarData>("pillars", locale, ["title", "summary"])
    .map(({ slug, data }) => ({ ...data, slug }))
    .filter((pillar) => !division || pillar.division === division)
    .sort((a, b) => a.order - b.order);
}

export function getPillar(locale: Locale, division: Division, slug: string): Pillar | undefined {
  return getPillars(locale, division).find((pillar) => pillar.slug === slug);
}

export function pillarPath(locale: Locale, pillar: Pick<Pillar, "division" | "slug">): string {
  return localePath(locale, `/${pillar.division}/${pillar.slug}`);
}
