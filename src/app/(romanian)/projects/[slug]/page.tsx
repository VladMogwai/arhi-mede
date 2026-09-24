import type { Metadata } from "next";
import { ProjectPage, projectMetadata, projectSlugs } from "@/components/pages/ProjectPage";
import { defaultLocale } from "@/i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return projectSlugs(defaultLocale);
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return projectMetadata(defaultLocale, slug);
}

export default async function Page({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  return <ProjectPage locale={defaultLocale} slug={slug} />;
}
