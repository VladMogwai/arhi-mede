import { DivisionPage, divisionMetadata } from "@/components/pages/DivisionPage";
import { defaultLocale } from "@/i18n/config";

export const metadata = divisionMetadata(defaultLocale, "mede");

export default function Page() {
  return <DivisionPage locale={defaultLocale} division="mede" />;
}
