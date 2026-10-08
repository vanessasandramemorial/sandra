import { readDoc } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

/**
 * /legacy in either language: the causes Sandra cared about, and an invitation
 * to support them. The wording lives in content/legacy.md and legacy.es.md, so
 * it can be edited without touching code.
 */
export default function Legacy({ lang }: { lang: Locale }) {
  const doc = readDoc(lang === "es" ? "legacy.es" : "legacy");
  return (
    <main className="page" id="main">
      <h1 className="page-title">{doc.title ?? dict(lang).titles.legacy}</h1>
      <hr className="rule" />
      {/* Our own Markdown from content/, so this HTML is trusted — see
          ARCHITECTURE.md → "Security boundaries". */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: doc.html }} />
    </main>
  );
}
