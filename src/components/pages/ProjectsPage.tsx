import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProjectIndex } from "@/components/project/ProjectIndex";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getProjects, projectCategories } from "@/lib/content/projects";
import { pageMetadata } from "@/lib/seo";

export function projectsMetadata(locale: Locale): Metadata {
  const { projects } = getDictionary(locale);
  return pageMetadata({ locale, path: "/projects", title: projects.metaTitle, description: projects.metaDescription });
}

export function ProjectsPage({ locale }: { locale: Locale }) {
  const { projects: text, common, categories } = getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <header className="px-3 pt-20 pb-12 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <h1 className="font-display text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.95] font-light lg:col-span-6 lg:col-start-2">{text.title}</h1>
          <p className="mt-6 text-xl leading-snug lg:col-span-4 lg:col-start-8 lg:self-end">{text.intro}</p>
        </header>
        <ProjectIndex
          locale={locale}
          projects={getProjects(locale)}
          categories={projectCategories.map((slug) => ({ slug, label: categories[slug] }))}
          labels={{ all: text.filterAll, viewProject: common.viewProject, examplePhoto: common.examplePhoto }}
        />
      </main>
    </>
  );
}
