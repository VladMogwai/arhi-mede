"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";

type SiteNavProps = {
  locale: Locale;
  links: { href: string; label: string }[];
  /** Transparent with white text while the home hero photo is behind it. */
  overHero: boolean;
};

/** Thin navigation row that sticks to the top; turns solid once the hero photo has scrolled away. */
export function SiteNav({ locale, links, overHero }: SiteNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (!overHero) return;
    // The hero photo is one viewport tall from the top of the page.
    const update = () => setPastHero(window.scrollY + (navRef.current?.offsetHeight ?? 0) > window.innerHeight);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [overHero]);

  const transparent = overHero && !pastHero;

  return (
    <nav
      ref={navRef}
      className={`intro-fade sticky top-0 z-40 flex h-(--nav-height) items-center justify-between border-t px-3 text-[13px] transition-colors duration-300 ${
        transparent ? "border-paper/40 text-paper [text-shadow:0_1px_10px_rgb(0_0_0/0.45)]" : "border-line bg-paper/95 text-ink backdrop-blur-sm"
      }`}
    >
      <ul className="flex gap-5 sm:gap-16">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="group inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="text-[10px] opacity-70 transition-transform group-hover:rotate-90">
                +
              </span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <LanguageSwitcher locale={locale} />
    </nav>
  );
}
