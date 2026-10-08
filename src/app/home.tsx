import Image from "next/image";
import { readDoc } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";
import { SITE_NAME } from "../site.config";
import portrait from "../../public/portrait-hero.jpg";

// next/image is used only for curated assets we control. Visitor-submitted photos
// are served straight from Cloudflare Images and never touch sharp here.
// See ARCHITECTURE.md → "Security boundaries".

/** The home page in either language. The obituary is content/obituary.md, or obituary.es.md. */
export default function Home({ lang }: { lang: Locale }) {
  const t = dict(lang);
  const obituary = readDoc(lang === "es" ? "obituary.es" : "obituary");

  // Unfilled placeholders are marked in development so a draft can't quietly ship.
  const html =
    process.env.NODE_ENV === "development"
      ? obituary.html.replace(/X{3,}/g, (m) => `<mark class="todo">${m}</mark>`)
      : obituary.html;

  return (
    <main className="page" id="main">
      <figure className="portrait">
        <Image
          src={portrait}
          alt={t.home.portraitAlt}
          priority
          sizes="(max-width: 40rem) 100vw, 40rem"
          placeholder="blur"
        />
      </figure>

      <h1 className="name">{SITE_NAME}</h1>
      <p className="dates">{t.home.dates}</p>
      {/* Kept in Spanish in every language, as it was written for her. */}
      <blockquote className="epigraph" lang="es">
        <p>
          Que la Luz perpetua brille para ella
          <br />
          y que descanse en Paz.
        </p>
      </blockquote>
      <hr className="rule" />

      {/* Source is ours and lives in the repo, so this HTML is trusted.
          Visitor-submitted text never renders this way — see ARCHITECTURE.md
          → "Security boundaries". */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
