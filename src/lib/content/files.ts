import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { defaultLocale, type Locale } from "@/i18n/config";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * A content file in Sveltia CMS's "single_file" i18n structure: one block per locale.
 * The default-locale block is complete; other blocks hold only what has been translated.
 */
type LocalizedFile<T> = { [defaultLocale]: T } & Partial<Record<Exclude<Locale, typeof defaultLocale>, Partial<T>>>;

export type Entry<T> = {
  slug: string;
  data: T;
  /** False when the locale has no translation of the fields listed as translatable. */
  translated: boolean;
};

/** Reads every entry of a content folder, merging the requested locale over the default one. */
export function readEntries<T extends object>(folder: string, locale: Locale, translatableFields: (keyof T)[]): Entry<T>[] {
  const dir = path.join(CONTENT_DIR, folder);
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const file = JSON.parse(readFileSync(path.join(dir, name), "utf8")) as LocalizedFile<T>;
      const base = file[defaultLocale];
      const localized = locale === defaultLocale ? {} : (file[locale] ?? {});
      const overrides = Object.fromEntries(Object.entries(localized).filter(([, value]) => value !== "" && value != null));
      return {
        slug: name.replace(/\.json$/, ""),
        data: { ...base, ...overrides } as T,
        translated: locale === defaultLocale || translatableFields.every((field) => field in overrides),
      };
    });
}
