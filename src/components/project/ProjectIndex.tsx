"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Facts } from "@/components/ui/Facts";
import { Photo } from "@/components/ui/Photo";
import type { Project } from "@/lib/content/projects";

type ProjectIndexProps = {
  locale: string;
  projects: Project[];
  categories: { slug: string; label: string }[];
  labels: { all: string; viewProject: string; examplePhoto: string };
};

/** Project archive in alternating rows, filtered by category on the client. */
export function ProjectIndex({ locale, projects, categories, labels }: ProjectIndexProps) {
  const [category, setCategory] = useState<string | null>(null);
  const visible = category ? projects.filter((project) => project.category === category) : projects;
  const filters = [{ slug: null, label: labels.all }, ...categories];

  return (
    <>
      <ul className="caption flex flex-wrap gap-x-6 gap-y-2 px-3">
        {filters.map((filter) => (
          <li key={filter.slug ?? "all"}>
            <button
              type="button"
              onClick={() => setCategory(filter.slug)}
              aria-pressed={category === filter.slug}
              className={`cursor-pointer uppercase ${category === filter.slug ? "underline underline-offset-4" : "text-muted hover:text-ink"}`}
            >
              [ {filter.label} ]
            </button>
          </li>
        ))}
      </ul>

      <ul className="mt-10">
        {visible.map((project, index) => (
          <li key={project.slug} className="border-t border-line bg-sand">
            <article className="grid gap-8 px-3 py-10 lg:grid-cols-12 lg:gap-x-6 lg:py-16">
              <div className="flex flex-col lg:col-span-5 lg:col-start-1">
                <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-light">
                  <Link href={`/${locale}/projects/${project.slug}`}>{project.title}</Link>
                </h2>
                <Facts
                  className="mt-6"
                  items={[categories.find((c) => c.slug === project.category)?.label, project.location, project.year, ...project.highlights]}
                />
                <div className="mt-10 flex items-end gap-6">
                  {project.images[1] && (
                    <Photo
                      source={{ kind: "media", src: project.images[1] }}
                      alt=""
                      sizes="160px"
                      exampleLabel={labels.examplePhoto}
                      className="hidden aspect-square w-40 shrink-0 sm:block"
                    />
                  )}
                  <div>
                    <p lang={project.translated ? undefined : "ro"} className="caption max-w-[36ch]">
                      {project.summary}
                    </p>
                    <ArrowLink href={`/${locale}/projects/${project.slug}`} className="mt-6">
                      {labels.viewProject}
                    </ArrowLink>
                  </div>
                </div>
              </div>
              <Link href={`/${locale}/projects/${project.slug}`} tabIndex={-1} className="lg:col-span-7">
                <Photo
                  source={{ kind: "media", src: project.images[0] }}
                  alt={project.title}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  exampleLabel={labels.examplePhoto}
                  priority={index === 0}
                  className="aspect-3/2"
                />
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
