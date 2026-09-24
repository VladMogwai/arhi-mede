"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { localePath, locales, splitLocalePath, type Locale } from "@/i18n/config";

/** Where to scroll after switching language; read by the page that opens. */
const STORAGE_KEY = "language-switch-scroll";

type SavedScroll = { path: string; y: number };

/**
 * Links to the current page in every other locale, keeping the scroll position.
 * Romanian and the prefixed locales use different root layouts, so switching between them is a full
 * page load and Next.js cannot keep the position itself: it is saved here and restored on arrival.
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { path } = splitLocalePath(pathname);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      sessionStorage.removeItem(STORAGE_KEY);
      const { path: target, y } = JSON.parse(saved) as SavedScroll;
      if (target !== pathname) return;
      // Next.js resets the scroll while it starts up the page, so apply the position again until it holds.
      const restore = () => {
        if (Math.abs(window.scrollY - y) > 2) window.scrollTo({ top: y, behavior: "instant" });
      };
      requestAnimationFrame(restore);
      const timers = [100, 300, 600].map((delay) => window.setTimeout(restore, delay));
      return () => timers.forEach(window.clearTimeout);
    } catch {
      // Storage can be unavailable (private mode); then the page simply opens at the top.
    }
  }, [pathname]);

  const rememberScroll = (href: string) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ path: href, y: window.scrollY } satisfies SavedScroll));
    } catch {
      // See above.
    }
  };

  return (
    <ul className="flex gap-3">
      {locales.map((target) => {
        const href = localePath(target, path);
        return (
          <li key={target}>
            <Link
              href={href}
              scroll={false}
              onClick={() => rememberScroll(href)}
              hrefLang={target}
              aria-current={target === locale ? "true" : undefined}
              className={`uppercase transition-opacity ${target === locale ? "underline underline-offset-4" : "opacity-60 hover:opacity-100"}`}
            >
              {target}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
