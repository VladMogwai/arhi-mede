import type { Metadata } from "next";
import { PillarPage, pillarMetadata, pillarSlugs } from "@/components/pages/PillarPage";
import { defaultLocale } from "@/i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return pillarSlugs(defaultLocale, "mede");
}

export async function generateMetadata({ params }: PageProps<"/mede/[pillar]">): Promise<Metadata> {
  const { pillar } = await params;
  return pillarMetadata(defaultLocale, "mede", pillar);
}

export default async function Page({ params }: PageProps<"/mede/[pillar]">) {
  const { pillar } = await params;
  return <PillarPage locale={defaultLocale} division="mede" slug={pillar} />;
}
