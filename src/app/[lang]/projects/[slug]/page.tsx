import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage, projectMetadata, projectSlugs } from "@/components/pages/ProjectPage";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.filter((locale) => locale !== defaultLocale).flatMap((lang) => projectSlugs(lang).map(({ slug }) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  return isLocale(lang) ? projectMetadata(lang, slug) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  return <ProjectPage locale={lang} slug={slug} />;
}
