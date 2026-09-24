import { ProjectsPage, projectsMetadata } from "@/components/pages/ProjectsPage";
import { defaultLocale } from "@/i18n/config";

export const metadata = projectsMetadata(defaultLocale);

export default function Page() {
  return <ProjectsPage locale={defaultLocale} />;
}
