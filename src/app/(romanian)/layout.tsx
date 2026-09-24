import { RootDocument, rootMetadata } from "@/components/layout/RootDocument";
import { defaultLocale } from "@/i18n/config";

// Romanian, the default locale, lives at the site root without a prefix.
export const metadata = rootMetadata;

export default function RomanianLayout({ children }: LayoutProps<"/">) {
  return <RootDocument locale={defaultLocale}>{children}</RootDocument>;
}
