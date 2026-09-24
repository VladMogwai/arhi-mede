import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ArrowIcon, ArrowLink } from "@/components/ui/ArrowLink";
import { HeroIntroScript, HeroIntroThumbs } from "@/components/home/HeroIntro";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { Caption } from "@/components/ui/Caption";
import { Facts } from "@/components/ui/Facts";
import { Photo } from "@/components/ui/Photo";
import { heroSlides, placeholderPhotos } from "@/config/placeholder-images";
import { studio } from "@/config/site";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getFeaturedProject, getProjects } from "@/lib/content/projects";
import { getTeam } from "@/lib/content/team";
import { pageMetadata } from "@/lib/seo";

export function homeMetadata(locale: Locale): Metadata {
  const { home } = getDictionary(locale);
  return { ...pageMetadata({ locale, path: "", title: home.metaTitle, description: home.metaDescription }), title: { absolute: home.metaTitle } };
}

export function HomePage({ locale }: { locale: Locale }) {
  const { home, common } = getDictionary(locale);
  const featured = getFeaturedProject(locale);
  const introImages = getProjects(locale)
    .filter((project) => project.slug !== featured.slug && project.category === featured.category)
    .slice(0, 3)
    .map((project) => project.images[0]);

  return (
    <>
      <HeroIntroScript />
      {/* The hero photo runs under the wordmark and navigation. */}
      <div className="hero-frame absolute inset-x-0 top-0 h-svh">
        <HeroSlideshow
          slides={heroSlides.map((pexelsId) => ({ kind: "example", pexelsId }))}
          exampleLabel={common.examplePhoto}
          nextLabel={common.nextPhoto}
        />
        <div className="intro-fade pointer-events-none absolute inset-0 bg-linear-to-b from-ink/45 via-ink/5 to-ink/55" />
        <HeroIntroThumbs images={introImages} />
      </div>

      <SiteHeader locale={locale} overHero />

      <section className="relative flex h-[calc(100svh-var(--wordmark-height)-var(--nav-height))] items-end px-3 pb-12">
        <h1 className="intro-fade max-w-[34ch] text-xl leading-snug text-paper sm:text-2xl">{home.heroStatement}</h1>
      </section>

      <main>
        <StudioSection locale={locale} />
        <ServicesSection locale={locale} />
        <ProjectsSection locale={locale} />
        <Photo
          source={{ kind: "example", pexelsId: placeholderPhotos.landscape }}
          alt=""
          sizes="100vw"
          exampleLabel={common.examplePhoto}
          className="mt-32 h-[70svh]"
        />
        <ApproachSection locale={locale} />
        <TeamSection locale={locale} />
        <ContactSection locale={locale} />
      </main>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.95] font-light tracking-tight">{children}</h2>;
}

function StudioSection({ locale }: { locale: Locale }) {
  const { home, common } = getDictionary(locale);
  return (
    <section id="studio" className="scroll-mt-(--nav-height) px-3 pt-32 lg:grid lg:grid-cols-12 lg:gap-x-6">
      <div className="lg:col-span-10 lg:col-start-2">
        <SectionTitle>{home.studio.title}</SectionTitle>
      </div>
      <p className="mt-8 text-xl leading-snug indent-[25%] sm:text-2xl lg:col-span-6 lg:col-start-4">{home.studio.lead}</p>
      <Caption className="mt-10 lg:col-span-2 lg:col-start-1 lg:row-start-3 lg:self-end">{home.studio.caption}</Caption>
      <Photo
        source={{ kind: "example", pexelsId: placeholderPhotos.studio }}
        alt=""
        sizes="(min-width: 1024px) 45vw, 100vw"
        exampleLabel={common.examplePhoto}
        className="mt-10 aspect-4/3 lg:col-span-5 lg:col-start-4 lg:row-start-3"
      />
    </section>
  );
}

function ServicesSection({ locale }: { locale: Locale }) {
  const { home } = getDictionary(locale);
  return (
    <section className="px-3 pt-32 lg:grid lg:grid-cols-12 lg:gap-x-6">
      <h2 className="caption lg:col-span-2 lg:col-start-2">{home.services.title}</h2>
      <ol className="mt-6 lg:col-span-7 lg:col-start-4 lg:mt-0">
        {home.services.items.map((service, index) => (
          <li key={service.title} className="grid grid-cols-[3rem_1fr] gap-y-2 border-t border-line py-6 last:border-b sm:grid-cols-[4rem_1fr_1fr] sm:gap-x-6">
            <span className="caption pt-2">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="font-display text-3xl leading-tight">{service.title}</h3>
            <p className="col-start-2 text-sm leading-relaxed text-muted sm:col-start-3 sm:pt-2">{service.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ProjectsSection({ locale }: { locale: Locale }) {
  const { home, common, categories } = getDictionary(locale);
  const featured = getFeaturedProject(locale);
  const others = getProjects(locale).filter((project) => project.slug !== featured.slug);

  return (
    <section className="mx-3 mt-32 bg-sand px-5 py-16 sm:px-10 lg:mx-[5%] lg:px-[8%] lg:py-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="caption mb-6">+ {home.featured.label}</p>
          <h2 className="font-display text-[clamp(2.75rem,6vw,5rem)] leading-none font-light">{featured.title}</h2>
          <Facts className="mt-6" items={[featured.area && `${featured.area} m²`, featured.location, featured.year, ...featured.highlights]} />
          <p lang={featured.translated ? undefined : "ro"} className="caption mt-10 max-w-[38ch]">
            {featured.summary}
          </p>
          <ArrowLink href={localePath(locale, `/projects/${featured.slug}`)} className="mt-10">
            {common.viewProject}
          </ArrowLink>
        </div>
        <Photo
          source={{ kind: "media", src: featured.images[0] }}
          alt={featured.title}
          sizes="(min-width: 1024px) 40vw, 100vw"
          exampleLabel={common.examplePhoto}
          className="aspect-4/3"
        />
      </div>

      <ul className="mt-20">
        {others.map((project) => (
          <li key={project.slug} className="border-b border-ink/70 first:border-t">
            <Link
              href={localePath(locale, `/projects/${project.slug}`)}
              className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-3 sm:grid-cols-[2fr_1.3fr_1fr_auto]"
            >
              <span className="font-display text-2xl transition-transform duration-300 group-hover:translate-x-2">{project.title}</span>
              <span className="caption hidden sm:block">{categories[project.category]}</span>
              <span className="caption hidden sm:block">{project.location}</span>
              <ArrowIcon className="self-center transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          </li>
        ))}
      </ul>
      <ArrowLink href={localePath(locale, "/projects")} className="mt-12">
        {common.allProjects}
      </ArrowLink>
    </section>
  );
}

function ApproachSection({ locale }: { locale: Locale }) {
  const { home } = getDictionary(locale);
  return (
    <section className="px-3 pt-32 lg:grid lg:grid-cols-12 lg:gap-x-6">
      <div className="lg:col-span-10 lg:col-start-2">
        <SectionTitle>{home.approach.title}</SectionTitle>
      </div>
      <p className="mt-8 text-xl leading-snug indent-[25%] sm:text-2xl lg:col-span-6 lg:col-start-4">{home.approach.text}</p>
      <Caption className="mt-10 lg:col-span-2 lg:col-start-1 lg:row-start-3">{home.approach.caption}</Caption>
      <ul className="mt-12 grid gap-8 sm:grid-cols-3 lg:col-span-8 lg:col-start-4 lg:row-start-3">
        {home.approach.points.map((point) => (
          <li key={point.title} className="border-t border-ink pt-4">
            <h3 className="font-display text-2xl">{point.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{point.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TeamSection({ locale }: { locale: Locale }) {
  const { home, common } = getDictionary(locale);
  const team = getTeam(locale);
  return (
    <section className="px-3 pt-32 lg:grid lg:grid-cols-12 lg:gap-x-6">
      <div className="lg:col-span-10 lg:col-start-2">
        <SectionTitle>{home.team.title}</SectionTitle>
      </div>
      <Caption className="mt-10 lg:col-span-2 lg:col-start-1 lg:row-start-2">{home.team.caption}</Caption>
      <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-4 lg:row-start-2">
        {team.map((member) => (
          <li key={member.slug}>
            {member.photo && (
              <Photo
                source={{ kind: "media", src: member.photo }}
                alt={member.name}
                sizes="(min-width: 640px) 30vw, 100vw"
                exampleLabel={common.examplePhoto}
                className="aspect-4/5"
                imageClassName="grayscale"
              />
            )}
            <h3 className="mt-5 font-display text-3xl">{member.name}</h3>
            <p className="caption mt-1">{member.role}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{member.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ContactSection({ locale }: { locale: Locale }) {
  const { home } = getDictionary(locale);
  return (
    <section className="px-3 pt-40 text-center">
      <h2 className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-none font-light">{home.cta.title}</h2>
      <p className="mx-auto mt-6 max-w-[48ch] text-lg leading-snug">{home.cta.text}</p>
      <ArrowLink href={`mailto:${studio.email}`} className="mt-10">
        {home.cta.button}
      </ArrowLink>
    </section>
  );
}
