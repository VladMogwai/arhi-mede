import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Inter, Jost } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { siteUrl, studio } from "@/config/site";
import { isLocale, locales } from "@/i18n/config";
import "../globals.css";

// Every font needs Cyrillic for the Ukrainian version and latin-ext for Romanian ș/ț.
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400"],
  variable: "--font-plex-mono",
});

// Only draws the Latin wordmark "ARHI MEDE".
const jost = Jost({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jost",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: studio.name, template: `%s — ${studio.name}` },
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${cormorant.variable} ${inter.variable} ${plexMono.variable} ${jost.variable}`}>
      <body>
        {children}
        <SiteFooter locale={lang} />
      </body>
    </html>
  );
}
