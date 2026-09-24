import Link from "next/link";
import { studio } from "@/config/site";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export function SiteFooter({ locale }: { locale: Locale }) {
  const { nav, footer } = getDictionary(locale);
  const { address, hours } = studio;

  return (
    <footer id="contact" className="mt-32 bg-sand">
      <p
        aria-hidden="true"
        className="flex justify-between px-3 pt-10 font-wordmark text-(length:--wordmark-size) leading-[0.86] uppercase"
      >
        {[...studio.wordmark.toUpperCase()].map((letter, index) => (
          <span key={index} className={letter === " " ? "w-[0.2em]" : undefined}>
            {letter}
          </span>
        ))}
      </p>
      <p className="caption mt-4 text-center tracking-[0.5em]">{footer.tagline}</p>

      <div className="grid gap-10 px-3 pt-20 pb-10 sm:grid-cols-2 lg:grid-cols-4">
        <ul className="font-display text-3xl leading-tight">
          <li>
            <Link href={localePath(locale)}>{nav.home}</Link>
          </li>
          <li>
            <Link href={`${localePath(locale)}#studio`}>{nav.studio}</Link>
          </li>
          <li>
            <Link href={localePath(locale, "/projects")}>{nav.projects}</Link>
          </li>
        </ul>
        <div>
          <h2 className="mb-3 text-sm">{footer.contact}</h2>
          <ul className="caption space-y-1">
            <li>
              <a href={`mailto:${studio.email}`} className="hover:underline">
                {studio.email}
              </a>
            </li>
            {studio.phone && (
              <li>
                <a href={`tel:${studio.phone.replace(/\s/g, "")}`} className="hover:underline">
                  {studio.phone}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm">{footer.address}</h2>
          <address className="caption not-italic">
            {address.street}
            <br />
            {address.district}, {address.city}
            <br />
            {address.country}
          </address>
        </div>
        <div>
          <h2 className="mb-3 text-sm">{footer.hours}</h2>
          <dl className="caption grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt>{footer.weekdays}</dt>
            <dd>{hours.weekdays}</dd>
            <dt>{footer.saturday}</dt>
            <dd>{hours.saturday}</dd>
          </dl>
        </div>
      </div>

      <p className="caption border-t border-line px-3 py-4">
        © {new Date().getFullYear()} {studio.name}. {footer.rights}
      </p>
    </footer>
  );
}
