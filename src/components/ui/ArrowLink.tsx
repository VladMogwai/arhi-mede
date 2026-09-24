import Link from "next/link";

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className={`h-3 w-3 ${className}`}>
      <path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

/** Outlined button with a black arrow square, as on archidomo.fr: [ VEZI PROIECTUL ■↗ ]. */
export function ArrowLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const isExternal = /^(https?:|mailto:|tel:)/.test(href);
  const content = (
    <>
      <span className="caption px-4">{children}</span>
      <span className="flex h-8 w-8 items-center justify-center bg-ink text-paper transition-transform duration-300 group-hover:rotate-45">
        <ArrowIcon />
      </span>
    </>
  );
  const classes = `group inline-flex items-center gap-2 border border-ink p-1 transition-colors hover:bg-ink hover:text-paper ${className}`;
  return isExternal ? (
    <a href={href} className={classes}>
      {content}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
