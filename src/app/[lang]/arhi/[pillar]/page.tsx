import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PillarPage, pillarMetadata, pillarSlugs } from "@/components/pages/PillarPage";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.filter((locale) => locale !== defaultLocale).flatMap((lang) => pillarSlugs(lang, "arhi").map(({ pillar }) => ({ lang, pillar })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/arhi/[pillar]">): Promise<Metadata> {
  const { lang, pillar } = await params;
  return isLocale(lang) ? pillarMetadata(lang, "arhi", pillar) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/arhi/[pillar]">) {
  const { lang, pillar } = await params;
  if (!isLocale(lang)) notFound();
  return <PillarPage locale={lang} division="arhi" slug={pillar} />;
}
