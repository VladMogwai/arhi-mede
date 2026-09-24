import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Inter, Jost } from "next/font/google";
import { siteUrl, studio } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { PageScrollbar } from "./PageScrollbar";
import { SiteFooter } from "./SiteFooter";
import "../../app/globals.css";

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

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: studio.name, template: `%s — ${studio.name}` },
};

/**
 * The <html> document shared by both root layouts: Romanian at the site root and the
 * prefixed locales under app/[lang].
 */
export function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the home intro script adds data-intro to <html> before React hydrates.
    <html lang={locale} suppressHydrationWarning className={`${cormorant.variable} ${inter.variable} ${plexMono.variable} ${jost.variable}`}>
      <body>
        {children}
        <SiteFooter locale={locale} />
        <PageScrollbar />
      </body>
    </html>
  );
}
