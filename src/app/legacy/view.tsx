import { Fragment } from "react";
import { readDoc } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";
import { getLegacyCounts, isLegacySlug, LEGACY_SLUGS, type LegacySlug } from "@/lib/legacy";
import Support from "./support";

/** A `{{support:slug}}` line in the Markdown, which marked wraps in a <p>. */
const MARKER = /<p>\{\{support:([a-z0-9-]+)\}\}<\/p>/g;

/**
 * /legacy in either language: the causes Sandra cared about, and an invitation
 * to support them. The wording lives in content/legacy.md and legacy.es.md, so
 * it can be edited without touching code; a `{{support:slug}}` line marks where
 * that cause's count and button go.
 */
export default async function Legacy({ lang }: { lang: Locale }) {
  const doc = readDoc(lang === "es" ? "legacy.es" : "legacy");

  let counts = Object.fromEntries(LEGACY_SLUGS.map((s) => [s, 0])) as Record<LegacySlug, number>;
  try {
    counts = await getLegacyCounts();
  } catch (e) {
    // The page is still worth showing without the numbers.
    console.error("Failed to load legacy counts:", e);
  }

  // split() with a capture group alternates: html, slug, html, slug, html…
  const parts = doc.html.split(MARKER);

  return (
    <main className="page" id="main">
      <h1 className="page-title">{doc.title ?? dict(lang).titles.legacy}</h1>
      <hr className="rule" />
      <div className="prose">
        {parts.map((part, i) =>
          i % 2 === 0 ? (
            // Our own Markdown from content/, so this HTML is trusted — see
            // ARCHITECTURE.md → "Security boundaries".
            <div key={i} dangerouslySetInnerHTML={{ __html: part }} />
          ) : isLegacySlug(part) ? (
            <Support key={i} slug={part} initialCount={counts[part]} lang={lang} />
          ) : (
            <Fragment key={i} />
          ),
        )}
      </div>
    </main>
  );
}
