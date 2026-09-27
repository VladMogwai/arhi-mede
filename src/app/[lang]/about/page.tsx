import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutPage, aboutMetadata } from "@/components/pages/AboutPage";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? aboutMetadata(lang) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <AboutPage locale={lang} />;
}
