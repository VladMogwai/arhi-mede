"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePath, locales, splitLocalePath, type Locale } from "@/i18n/config";

/** Links to the current page in every other locale. */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { path } = splitLocalePath(pathname);

  return (
    <ul className="flex gap-3">
      {locales.map((target) => (
        <li key={target}>
          <Link
            href={localePath(target, path)}
            hrefLang={target}
            aria-current={target === locale ? "true" : undefined}
            className={`uppercase transition-opacity ${target === locale ? "underline underline-offset-4" : "opacity-60 hover:opacity-100"}`}
          >
            {target}
          </Link>
        </li>
      ))}
    </ul>
  );
}
