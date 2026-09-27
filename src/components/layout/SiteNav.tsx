"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";

type SiteNavProps = {
  locale: Locale;
  links: { href: string; label: string }[];
  labels: { menu: string; close: string };
  /** Transparent with white text while the home hero photo is behind it. */
  overHero: boolean;
};

/**
 * Thin navigation row that sticks to the top; turns solid once the hero photo has scrolled away.
 * Below the md breakpoint the links collapse into a "Menu" toggle with a full-width panel.
 */
export function SiteNav({ locale, links, labels, overHero }: SiteNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!overHero) return;
    // The hero photo is one viewport tall from the top of the page.
    const update = () => setPastHero(window.scrollY + (navRef.current?.offsetHeight ?? 0) > window.innerHeight);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [overHero]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const transparent = overHero && !pastHero && !menuOpen;

  return (
    <nav
      ref={navRef}
      className={`intro-fade sticky top-0 z-40 flex h-(--nav-height) items-center justify-between border-t px-3 text-[13px] transition-colors duration-300 ${
        transparent ? "border-paper/40 text-paper [text-shadow:0_1px_10px_rgb(0_0_0/0.45)]" : "border-line bg-paper/95 text-ink backdrop-blur-sm"
      }`}
    >
      <ul className="hidden gap-10 md:flex lg:gap-16">
        {links.map((link) => (
          <li key={link.href}>
            <NavLink href={link.href} label={link.label} />
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-controls="site-menu"
        className="group inline-flex cursor-pointer items-center gap-1.5 md:hidden"
      >
        <span aria-hidden="true" className={`text-[10px] opacity-70 transition-transform ${menuOpen ? "rotate-45" : ""}`}>
          +
        </span>
        {menuOpen ? labels.close : labels.menu}
      </button>

      <LanguageSwitcher locale={locale} />

      {menuOpen && (
        <ul id="site-menu" className="absolute inset-x-0 top-full border-y border-line bg-paper px-3 py-4 md:hidden">
          {links.map((link) => (
            <li key={link.href} className="border-b border-line last:border-b-0">
              <Link href={link.href} onClick={() => setMenuOpen(false)} className="block py-3 font-display text-3xl">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-1.5">
      <span aria-hidden="true" className="text-[10px] opacity-70 transition-transform group-hover:rotate-90">
        +
      </span>
      {label}
    </Link>
  );
}
