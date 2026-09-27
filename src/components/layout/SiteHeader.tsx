import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { divisions, getPillars, pillarPath } from "@/lib/content/pillars";
import { SiteNav } from "./SiteNav";

type SiteHeaderProps = {
  locale: Locale;
  /** On the home page the header sits on top of the hero photo. */
  overHero?: boolean;
};

/**
 * The full-width "ARHI MEDE" wordmark doubles as the entry to the site's two divisions: with a mouse
 * every letter links to the direction it stands for (A — Architecture…) and names it on hover; on
 * touch screens, where single letters are too small to tap, each word links to its division.
 * A thin navigation row follows and sticks to the top of the viewport. Rendered by each page
 * (not the layout) so the sticky row stays in the body's flow.
 */
export function SiteHeader({ locale, overHero = false }: SiteHeaderProps) {
  const { nav } = getDictionary(locale);
  const links = [
    { href: localePath(locale), label: nav.home },
    { href: localePath(locale, "/arhi"), label: nav.arhi },
    { href: localePath(locale, "/mede"), label: nav.mede },
    { href: localePath(locale, "/projects"), label: nav.projects },
    { href: localePath(locale, "/about"), label: nav.about },
    { href: "#contact", label: nav.contact },
  ];
  let letterIndex = 0;

  return (
    <>
      <div
        className={`group/wordmark relative z-50 flex h-(--wordmark-height) items-center justify-between px-3 font-wordmark text-(length:--wordmark-size) leading-none font-normal uppercase ${
          overHero ? "text-paper" : "text-ink"
        }`}
      >
        {divisions.map((division, divisionIndex) => [
          // The space between the two words; wider on touch screens, where each word is its own box.
          divisionIndex > 0 && <span key="space" aria-hidden="true" className="w-[0.45em] shrink-0 [@media(pointer:fine)]:w-[0.2em]" />,
          // With a mouse the word box dissolves (display: contents) so all nine items share one even spacing.
          <div key={division} className="relative flex flex-1 justify-between [@media(pointer:fine)]:contents">
            {/* Touch screens: the whole word is one link to its division. */}
            <Link
              href={localePath(locale, `/${division}`)}
              aria-label={nav[division]}
              className="absolute inset-0 z-10 [@media(pointer:fine)]:hidden"
            />
            {getPillars(locale, division).map((pillar) => (
              <Link
                key={pillar.slug}
                href={pillarPath(locale, pillar)}
                aria-label={`${pillar.name} — ${pillar.title}`}
                className="group/letter relative transition-opacity duration-300 [@media(pointer:fine)]:group-hover/wordmark:opacity-30 [@media(pointer:fine)]:hover:opacity-100!"
              >
                <span className="block overflow-hidden">
                  <span className="intro-letter inline-block" style={{ "--letter-index": letterIndex++ } as React.CSSProperties}>
                    {pillar.letter}
                  </span>
                </span>
                <span
                  className={`caption pointer-events-none absolute top-full mt-1 hidden ${division === "arhi" ? "left-0" : "right-0"} bg-ink px-2 py-1 whitespace-nowrap text-paper opacity-0 transition-opacity duration-200 group-hover/letter:opacity-100 [@media(pointer:fine)]:block`}
                >
                  {pillar.letter} — {pillar.name} · {pillar.title}
                </span>
              </Link>
            ))}
          </div>,
        ])}
      </div>
      <SiteNav locale={locale} links={links} labels={{ menu: nav.menu, close: nav.close }} overHero={overHero} />
    </>
  );
}
