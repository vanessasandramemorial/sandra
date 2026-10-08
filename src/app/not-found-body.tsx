"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS, needsFullLoad } from "@/lib/sections";
import { dict, localeFromPath, localize } from "@/lib/i18n";
import { CONTACT_EMAIL } from "../site.config";

// Someone mistyping a URL off a printed program lands here, so it offers the
// way onward rather than just stating the error. A client component only so it
// can read the path, which is how it knows the language.
export default function NotFoundBody() {
  const lang = localeFromPath(usePathname());
  const t = dict(lang);

  return (
    <main className="page" id="main" lang={lang}>
      <h1 className="page-title">{t.notFound.heading}</h1>
      <hr className="rule" />
      <div className="prose">
        <p>{t.notFound.body}</p>
        <ul className="plainlist">
          <li>
            <Link href={localize("/", lang)}>{t.notFound.obituary}</Link>
          </li>
          {SECTIONS.map(({ href, key }) => {
            const target = localize(href, lang);
            return (
              <li key={href}>
                {/* Plain anchor where the page carries Turnstile — see needsFullLoad. */}
                {needsFullLoad(target) ? (
                  <a href={target}>{t.nav[key]}</a>
                ) : (
                  <Link href={target}>{t.nav[key]}</Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <p className="contact-note">
        {t.notFound.stuck} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </main>
  );
}
