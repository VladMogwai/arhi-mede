import type { Metadata } from "next";
import { PillarPage, pillarMetadata, pillarSlugs } from "@/components/pages/PillarPage";
import { defaultLocale } from "@/i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return pillarSlugs(defaultLocale, "arhi");
}

export async function generateMetadata({ params }: PageProps<"/arhi/[pillar]">): Promise<Metadata> {
  const { pillar } = await params;
  return pillarMetadata(defaultLocale, "arhi", pillar);
}

export default async function Page({ params }: PageProps<"/arhi/[pillar]">) {
  const { pillar } = await params;
  return <PillarPage locale={defaultLocale} division="arhi" slug={pillar} />;
}
