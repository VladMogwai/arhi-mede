import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectsPage, projectsMetadata } from "@/components/pages/ProjectsPage";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? projectsMetadata(lang) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <ProjectsPage locale={lang} />;
}
