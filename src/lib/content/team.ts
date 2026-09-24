import type { Locale } from "@/i18n/config";
import { readEntries } from "./files";

export type TeamMemberData = {
  name: string;
  order: number;
  photo: string | null;
  role: string;
  summary: string;
  /** Markdown. */
  bio: string;
};

export type TeamMember = TeamMemberData & { slug: string };

export function getTeam(locale: Locale): TeamMember[] {
  return readEntries<TeamMemberData>("team", locale, ["summary"])
    .map(({ slug, data }) => ({ ...data, slug }))
    .sort((a, b) => a.order - b.order);
}
