import { HomePage, homeMetadata } from "@/components/pages/HomePage";
import { defaultLocale } from "@/i18n/config";

export const metadata = homeMetadata(defaultLocale);

export default function Page() {
  return <HomePage locale={defaultLocale} />;
}
