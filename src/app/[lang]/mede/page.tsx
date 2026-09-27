import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DivisionPage, divisionMetadata } from "@/components/pages/DivisionPage";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/mede">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? divisionMetadata(lang, "mede") : {};
}

export default async function Page({ params }: PageProps<"/[lang]/mede">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <DivisionPage locale={lang} division="mede" />;
}
