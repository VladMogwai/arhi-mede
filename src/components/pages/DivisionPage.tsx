import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ArrowIcon } from "@/components/ui/ArrowLink";
import { Photo } from "@/components/ui/Photo";
import { divisionPhotos, pillarPhotos } from "@/config/placeholder-images";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getPillars, pillarPath, type Division } from "@/lib/content/pillars";
import { pageMetadata } from "@/lib/seo";

export function divisionMetadata(locale: Locale, division: Division): Metadata {
  const { nav, divisions } = getDictionary(locale);
  return pageMetadata({ locale, path: `/${division}`, title: nav[division], description: divisions[division].metaDescription });
}

/** ARHI or MEDE: the division's four directions, one letter each. */
export function DivisionPage({ locale, division }: { locale: Locale; division: Division }) {
  const { nav, divisions, common } = getDictionary(locale);
  const pillars = getPillars(locale, division);

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <header className="px-3 pt-20 pb-16 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <p className="caption lg:col-span-2 lg:col-start-2">+ {divisions.label}</p>
          <h1 className="mt-4 font-wordmark text-[clamp(4rem,14vw,12rem)] leading-[0.85] tracking-wide uppercase lg:col-span-6 lg:col-start-2 lg:row-start-2">
            {nav[division]}
          </h1>
          <p className="mt-8 max-w-[30ch] text-xl leading-snug sm:text-2xl lg:col-span-4 lg:col-start-8 lg:row-start-2 lg:self-end">
            {divisions[division].description}
          </p>
        </header>

        <Photo
          source={{ kind: "example", pexelsId: divisionPhotos[division] }}
          alt=""
          exampleLabel={common.examplePhoto}
          priority
          className="mx-3 mb-16 h-[55svh]"
        />

        <ol>
          {pillars.map((pillar) => (
            <li key={pillar.slug} className="border-t border-line last:border-b">
              <Link
                href={pillarPath(locale, pillar)}
                className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-4 sm:grid-cols-[7rem_1fr_auto] px-3 py-8 transition-colors hover:bg-sand sm:gap-x-10 lg:grid-cols-12"
              >
                <span className="font-wordmark text-[clamp(4rem,10vw,8rem)] leading-none lg:col-span-2 lg:col-start-2">{pillar.letter}</span>
                <span className="lg:col-span-4">
                  <span className="block font-display text-[clamp(2rem,4vw,3.25rem)] leading-none">{pillar.name}</span>
                  <span className="caption mt-3 block">{pillar.title}</span>
                </span>
                <span className="hidden text-sm leading-relaxed text-muted lg:col-span-3 lg:block">{pillar.summary}</span>
                {pillarPhotos[pillar.slug] && (
                  <Photo
                    source={{ kind: "example", pexelsId: pillarPhotos[pillar.slug][0] }}
                    alt=""
                    sizes="200px"
                    exampleLabel={common.examplePhoto}
                    className="hidden aspect-4/3 lg:col-span-1 lg:block [&>figcaption]:hidden"
                    imageClassName="grayscale transition duration-500 group-hover:grayscale-0"
                  />
                )}
                <span className="flex h-10 w-10 items-center justify-center bg-ink text-paper transition-transform duration-300 group-hover:rotate-45 lg:col-span-1 lg:justify-self-end">
                  <ArrowIcon />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
