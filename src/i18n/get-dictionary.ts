import type { Locale } from "./config";
import { de } from "./dictionaries/de";
import { en } from "./dictionaries/en";
import { ro, type Dictionary } from "./dictionaries/ro";
import { uk } from "./dictionaries/uk";

const dictionaries: Record<Locale, Dictionary> = { ro, en, de, uk };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
