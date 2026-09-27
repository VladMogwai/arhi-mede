import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DivisionPage, divisionMetadata } from "@/components/pages/DivisionPage";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/arhi">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? divisionMetadata(lang, "arhi") : {};
}

export default async function Page({ params }: PageProps<"/[lang]/arhi">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <DivisionPage locale={lang} division="arhi" />;
}
