import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Caption } from "@/components/ui/Caption";
import { Photo } from "@/components/ui/Photo";
import { aboutPhotos } from "@/config/placeholder-images";
import { studio } from "@/config/site";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getAboutPage, paragraphs } from "@/lib/content/pages";
import { pageMetadata } from "@/lib/seo";

export function aboutMetadata(locale: Locale): Metadata {
  const { about } = getDictionary(locale);
  return pageMetadata({ locale, path: "/about", title: about.metaTitle, description: about.metaDescription });
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95] font-light">{children}</h2>;
}

export function AboutPage({ locale }: { locale: Locale }) {
  const { about: labels, nav, common } = getDictionary(locale);
  const about = getAboutPage(locale);

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <header className="px-3 pt-20 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <p className="caption lg:col-span-2 lg:col-start-2">+ {labels.label}</p>
          <h1 className="mt-4 font-display text-[clamp(3rem,7.5vw,7rem)] leading-[0.95] font-light lg:col-span-10 lg:col-start-2 lg:row-start-2">
            {about.title}
          </h1>
          <div className="mt-12 space-y-5 text-xl leading-snug sm:text-2xl lg:col-span-6 lg:col-start-4 lg:row-start-3">
            {paragraphs(about.intro).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </header>

        <div className="mt-24 grid gap-3 px-3 sm:grid-cols-[2fr_1fr]">
          {aboutPhotos.map((pexelsId, index) => (
            <Photo
              key={pexelsId}
              source={{ kind: "example", pexelsId }}
              alt=""
              sizes={index === 0 ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 640px) 33vw, 100vw"}
              exampleLabel={common.examplePhoto}
              className="aspect-4/3 sm:aspect-auto sm:h-[60svh]"
            />
          ))}
        </div>

        <section className="px-3 pt-32 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-10 lg:col-start-2">
            <SectionTitle>{about.whatTitle}</SectionTitle>
          </div>
          <Caption className="mt-10 lg:col-span-2 lg:col-start-1 lg:row-start-2">{about.whatIntro}</Caption>
          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:col-span-8 lg:col-start-4 lg:row-start-2">
            {(["arhi", "mede"] as const).map((division) => (
              <div key={division}>
                <p className="font-wordmark text-5xl uppercase">{nav[division]}</p>
                <ul className="mt-4">
                  {(division === "arhi" ? about.arhiItems : about.medeItems).map((item) => (
                    <li key={item} className="border-b border-line py-3">
                      {item}
                    </li>
                  ))}
                </ul>
                <ArrowLink href={localePath(locale, `/${division}`)} className="mt-6">
                  {nav[division]}
                </ArrowLink>
              </div>
            ))}
          </div>
          <div className="mt-12 space-y-1 text-muted lg:col-span-6 lg:col-start-4 lg:row-start-3">
            {about.divisionsNote.split("\n").map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>

        <section className="mx-3 mt-32 bg-sand px-5 py-16 sm:px-10 lg:mx-[5%] lg:px-[8%] lg:py-24">
          <SectionTitle>{about.howTitle}</SectionTitle>
          <div className="mt-8 max-w-[52ch] space-y-4 text-lg leading-snug">
            {paragraphs(about.howText).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <table className="mt-12 w-full text-left">
            <thead>
              <tr className="caption border-b border-ink">
                <th className="py-3 pr-6 font-normal">{about.helpColumns[0]}</th>
                <th className="py-3 font-normal">{about.helpColumns[1]}</th>
              </tr>
            </thead>
            <tbody>
              {about.help.map(([want, help]) => (
                <tr key={want} className="border-b border-ink/30 align-top">
                  <td className="py-4 pr-6 font-display text-xl sm:text-2xl">{want}</td>
                  <td className="py-4 text-sm leading-relaxed text-muted sm:text-base">{help}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="px-3 pt-32 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-10 lg:col-start-2">
            <SectionTitle>{about.whyTitle}</SectionTitle>
          </div>
          <div className="mt-8 space-y-4 text-xl leading-snug sm:text-2xl lg:col-span-6 lg:col-start-4">
            {paragraphs(about.whyText).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="px-3 pt-32 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <h2 className="caption lg:col-span-2 lg:col-start-2">+ {about.expertiseTitle}</h2>
          <ul className="mt-6 flex flex-wrap gap-3 lg:col-span-8 lg:col-start-4 lg:mt-0">
            {about.expertise.map((item) => (
              <li key={item} className="border border-ink px-4 py-2 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="px-3 pt-40 text-center">
          <h2 className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-none font-light">{about.ctaTitle}</h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-lg leading-snug">{about.ctaText}</p>
          <ArrowLink href={`mailto:${studio.email}`} className="mt-10">
            {nav.contact}
          </ArrowLink>
        </section>
      </main>
    </>
  );
}
