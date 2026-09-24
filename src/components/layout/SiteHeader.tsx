import Link from "next/link";
import { studio } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SiteNav } from "./SiteNav";

type SiteHeaderProps = {
  locale: Locale;
  /** On the home page the header sits on top of the hero photo. */
  overHero?: boolean;
};

/**
 * Full-width wordmark followed by a thin navigation row that sticks to the top of the viewport.
 * Rendered by each page (not the layout) so the sticky row stays in the body's flow.
 */
export function SiteHeader({ locale, overHero = false }: SiteHeaderProps) {
  const { nav } = getDictionary(locale);
  const links = [
    { href: `/${locale}#studio`, label: nav.studio },
    { href: `/${locale}/projects`, label: nav.projects },
    { href: "#contact", label: nav.contact },
  ];

  return (
    <>
      <Link
        href={`/${locale}`}
        aria-label={studio.name}
        className={`relative z-10 flex h-(--wordmark-height) items-center justify-between px-3 font-wordmark text-(length:--wordmark-size) leading-none font-normal uppercase ${
          overHero ? "text-paper" : "text-ink"
        }`}
      >
        {[...studio.wordmark.toUpperCase()].map((letter, index) => (
          <span key={index} aria-hidden="true" className={letter === " " ? "w-[0.2em]" : undefined}>
            {letter}
          </span>
        ))}
      </Link>
      <SiteNav locale={locale} links={links} overHero={overHero} />
    </>
  );
}
