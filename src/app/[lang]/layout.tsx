import { notFound } from "next/navigation";
import { RootDocument, rootMetadata } from "@/components/layout/RootDocument";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

// Prefixed locales only; Romanian is served from the site root by app/(romanian).
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.filter((locale) => locale !== defaultLocale).map((lang) => ({ lang }));
}

export const metadata = rootMetadata;

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <RootDocument locale={lang}>{children}</RootDocument>;
}
