"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SECTIONS, needsFullLoad } from "@/lib/sections";
import { basePath, dict, localeFromPath, localize, LOCALES } from "@/lib/i18n";
import { SITE_NAME } from "../site.config";

export default function Nav() {
  const pathname = usePathname();
  const lang = localeFromPath(pathname);
  const t = dict(lang);
  const here = basePath(pathname ?? "/");

  // The root layout is shared by both languages, so <html lang> is rendered as
  // "en" everywhere; correct it once the page knows which one it is. The page
  // content itself is also wrapped in an element carrying the right lang (see
  // src/app/es/layout.tsx), which is what screen readers act on first.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <>
      <a href="#main" className="skip">
        {t.skip}
      </a>
      <header className="sitenav">
        <nav className="sitenav-inner" aria-label={t.nav.label}>
          <Link
            href={localize("/", lang)}
            className="wordmark"
            aria-current={here === "/" ? "page" : undefined}
          >
            {SITE_NAME}
          </Link>
          <ul>
            {SECTIONS.map(({ href, key }) => {
              const label = t.nav[key];
              const target = localize(href, lang);
              const current = here === href;
              return (
                <li key={href}>
                  {/* The current section is not a link to itself — it reads as a label. */}
                  {current ? (
                    <span aria-current="page">{label}</span>
                  ) : needsFullLoad(target) ? (
                    // Plain anchor on purpose — see needsFullLoad in lib/sections.
                    <a href={target}>{label}</a>
                  ) : (
                    <Link href={target}>{label}</Link>
                  )}
                </li>
              );
            })}
          </ul>
          {/* Each language is named in itself, so someone who reads only one of
              them can still find it. A plain anchor: the other language is a
              different page, and several of these carry a Turnstile widget. */}
          <p className="langswitch" aria-label={t.nav.language}>
            {LOCALES.map((l, i) => (
              <span key={l}>
                {i > 0 && <span aria-hidden="true"> | </span>}
                {l === lang ? (
                  <span aria-current="true" lang={l}>
                    {dict(l).langName}
                  </span>
                ) : (
                  <a href={localize(here, l)} lang={l} hrefLang={l}>
                    {dict(l).langName}
                  </a>
                )}
              </span>
            ))}
          </p>
        </nav>
      </header>
    </>
  );
}
