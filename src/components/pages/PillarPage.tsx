import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ArrowIcon, ArrowLink } from "@/components/ui/ArrowLink";
import { Photo } from "@/components/ui/Photo";
import { pillarPhotos } from "@/config/placeholder-images";
import { studio } from "@/config/site";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getPillar, getPillars, pillarPath, type Division } from "@/lib/content/pillars";
import { getProjectsForPillar } from "@/lib/content/projects";
import { pageMetadata } from "@/lib/seo";

export function pillarSlugs(locale: Locale, division: Division): { pillar: string }[] {
  return getPillars(locale, division).map((pillar) => ({ pillar: pillar.slug }));
}

export function pillarMetadata(locale: Locale, division: Division, slug: string): Metadata {
  const pillar = getPillar(locale, division, slug);
  if (!pillar) return {};
  return pageMetadata({ locale, path: `/${division}/${slug}`, title: `${pillar.name} — ${pillar.title}`, description: pillar.summary });
}

/** One ARHI MEDE direction: its letter, what it covers, and the projects that show it. */
export function PillarPage({ locale, division, slug }: { locale: Locale; division: Division; slug: string }) {
  const pillar = getPillar(locale, division, slug);
  if (!pillar) notFound();

  const { nav, pillar: text, common } = getDictionary(locale);
  const projects = getProjectsForPillar(locale, pillar.slug);
  const all = getPillars(locale);
  const next = all[(all.findIndex((item) => item.slug === pillar.slug) + 1) % all.length];
  const [cover, ...gallery] = pillarPhotos[pillar.slug] ?? [];

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <header className="grid gap-8 px-3 pt-16 pb-20 lg:grid-cols-12 lg:gap-x-6">
          <p aria-hidden="true" className="font-wordmark text-[clamp(10rem,32vw,26rem)] leading-[0.8] lg:col-span-4 lg:col-start-1">
            {pillar.letter}
          </p>
          <div className="lg:col-span-6 lg:col-start-6 lg:self-end">
            <p className="caption flex gap-5">
              <Link href={localePath(locale, `/${division}`)} className="hover:underline">
                [ {nav[division]} ]
              </Link>
              <span>
                [ {String(pillar.order).padStart(2, "0")} / {String(all.length).padStart(2, "0")} ]
              </span>
            </p>
            <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.95] font-light">{pillar.name}</h1>
            <p className="caption mt-4">{pillar.title}</p>
            <p className="mt-10 text-xl leading-snug sm:text-2xl">{pillar.summary}</p>
          </div>
        </header>

        {cover && (
          <Photo source={{ kind: "example", pexelsId: cover }} alt="" exampleLabel={common.examplePhoto} priority className="mx-3 h-[65svh]" />
        )}

        <section className="px-3 py-16 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <h2 className="caption lg:col-span-2 lg:col-start-2">+ {text.services}</h2>
          <ul className="mt-6 flex flex-wrap gap-3 lg:col-span-8 lg:col-start-6 lg:mt-0">
            {pillar.services.map((service) => (
              <li key={service} className="border border-ink px-4 py-2 text-sm">
                {service}
              </li>
            ))}
          </ul>
        </section>

        {gallery.length > 0 && (
          <div className="grid gap-3 px-3 pb-16 sm:grid-cols-[3fr_2fr]">
            {gallery.map((pexelsId) => (
              <Photo
                key={pexelsId}
                source={{ kind: "example", pexelsId }}
                alt=""
                sizes="(min-width: 640px) 60vw, 100vw"
                exampleLabel={common.examplePhoto}
                className="aspect-4/3 sm:aspect-auto sm:h-[55svh]"
              />
            ))}
          </div>
        )}

        <section className="bg-sand px-3 py-16 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <h2 className="caption lg:col-span-2 lg:col-start-2">+ {text.projects}</h2>
          {projects.length > 0 ? (
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:col-span-8 lg:col-start-6 lg:mt-0">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link href={localePath(locale, `/projects/${project.slug}`)} className="group block">
                    <Photo
                      source={{ kind: "media", src: project.images[0] }}
                      alt={project.title}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                      exampleLabel={common.examplePhoto}
                      className="aspect-4/3"
                      imageClassName="transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="mt-3 block font-display text-2xl">{project.title}</span>
                    {project.location && <span className="caption mt-1 block">{project.location}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 max-w-[40ch] text-lg leading-snug text-muted lg:col-span-6 lg:col-start-6 lg:mt-0">{text.noProjects}</p>
          )}
        </section>

        <section className="px-3 pt-24 text-center">
          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none font-light">{text.ctaTitle}</h2>
          <ArrowLink href={`mailto:${studio.email}`} className="mt-10">
            {text.ctaButton}
          </ArrowLink>
        </section>
      </main>

      <Link
        href={pillarPath(locale, next)}
        className="group mt-24 flex items-end justify-between border-y border-line px-3 py-10"
      >
        <span>
          <span className="caption block">{text.next}</span>
          <span className="mt-3 block font-display text-[clamp(2.25rem,5vw,4rem)] leading-none font-light">
            <span className="font-wordmark">{next.letter}</span> — {next.name}
          </span>
        </span>
        <span className="flex h-12 w-12 items-center justify-center bg-ink text-paper transition-transform duration-300 group-hover:rotate-45">
          <ArrowIcon className="h-4 w-4" />
        </span>
      </Link>
    </>
  );
}
