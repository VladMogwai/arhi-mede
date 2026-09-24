import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ArrowIcon } from "@/components/ui/ArrowLink";
import { Facts } from "@/components/ui/Facts";
import { Photo, type PhotoSource } from "@/components/ui/Photo";
import { placeholderGalleries } from "@/config/placeholder-images";
import { siteUrl } from "@/config/site";
import { defaultLocale, localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getProject, getProjects } from "@/lib/content/projects";
import { renderMarkdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/seo";

export function projectSlugs(locale: Locale): { slug: string }[] {
  return getProjects(locale).map((project) => ({ slug: project.slug }));
}

export function projectMetadata(locale: Locale, slug: string): Metadata {
  const project = getProject(locale, slug);
  if (!project) return {};
  return pageMetadata({
    locale,
    path: `/projects/${slug}`,
    title: project.title,
    description: project.summary,
    translated: project.translated,
    image: `${siteUrl}${project.images[0]}`,
  });
}

export function ProjectPage({ locale, slug }: { locale: Locale; slug: string }) {
  const project = getProject(locale, slug);
  if (!project) notFound();

  const { common, categories } = getDictionary(locale);
  const projects = getProjects(locale);
  const next = projects[(projects.findIndex((item) => item.slug === slug) + 1) % projects.length];

  // Until the studio sends more photography, stand-in photos show how a full gallery reads.
  const gallery: PhotoSource[] = [
    ...project.images.map((src) => ({ kind: "media" as const, src })),
    ...(placeholderGalleries[project.category] ?? []).slice(0, 2).map((pexelsId) => ({ kind: "example" as const, pexelsId })),
  ];

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <aside className="bg-sand px-5 pt-8 pb-12 lg:sticky lg:top-(--nav-height) lg:h-[calc(100svh-var(--nav-height))] lg:overflow-y-auto lg:px-10">
          <Link href={localePath(locale, "/projects")} className="group caption inline-flex items-center gap-3 border border-ink p-1 pr-3">
            <span className="flex h-6 w-6 items-center justify-center bg-ink text-paper">
              <ArrowIcon className="-rotate-135" />
            </span>
            {common.backToProjects}
          </Link>
          <h1 className="mt-10 font-display text-[clamp(2.75rem,5vw,4.5rem)] leading-none font-light">{project.title}</h1>
          <Facts
            className="mt-6"
            items={[categories[project.category], project.area && `${project.area} m²`, project.location, project.year, ...project.highlights]}
          />
          {!project.translated && <p className="caption mt-8 text-muted">{common.romanianOnly}</p>}
          <div
            lang={project.translated ? locale : defaultLocale}
            className="prose-body mt-8 max-w-[60ch]"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(project.body) }}
          />
        </aside>

        <div className="flex flex-col gap-3 p-3">
          {gallery.map((source, index) => (
            <Photo
              key={source.kind === "media" ? source.src : source.pexelsId}
              source={source}
              alt={index === 0 ? project.title : ""}
              sizes="(min-width: 1024px) 58vw, 100vw"
              exampleLabel={common.examplePhoto}
              priority={index === 0}
            />
          ))}
        </div>
      </main>

      <Link
        href={localePath(locale, `/projects/${next.slug}`)}
        className="group mt-3 flex items-end justify-between border-y border-line px-3 py-10"
      >
        <span>
          <span className="caption block">{common.nextProject}</span>
          <span className="mt-3 block font-display text-[clamp(2.25rem,5vw,4rem)] leading-none font-light">{next.title}</span>
        </span>
        <span className="flex h-12 w-12 items-center justify-center bg-ink text-paper transition-transform duration-300 group-hover:rotate-45">
          <ArrowIcon className="h-4 w-4" />
        </span>
      </Link>
    </>
  );
}
