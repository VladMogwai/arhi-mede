import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PillarPage, pillarMetadata, pillarSlugs } from "@/components/pages/PillarPage";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.filter((locale) => locale !== defaultLocale).flatMap((lang) => pillarSlugs(lang, "mede").map(({ pillar }) => ({ lang, pillar })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/mede/[pillar]">): Promise<Metadata> {
  const { lang, pillar } = await params;
  return isLocale(lang) ? pillarMetadata(lang, "mede", pillar) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/mede/[pillar]">) {
  const { lang, pillar } = await params;
  if (!isLocale(lang)) notFound();
  return <PillarPage locale={lang} division="mede" slug={pillar} />;
}
