import { AboutPage, aboutMetadata } from "@/components/pages/AboutPage";
import { defaultLocale } from "@/i18n/config";

export const metadata = aboutMetadata(defaultLocale);

export default function Page() {
  return <AboutPage locale={defaultLocale} />;
}
