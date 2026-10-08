import Link from "next/link";
import PhotoForm from "../form";
import { imagesConfigured } from "@/lib/cf-images";
import { parseKind } from "@/lib/photos";
import { dict, localize, type Locale } from "@/lib/i18n";
import { CONTACT_EMAIL } from "../../../site.config";

/** /photos/add in either language. */
export default async function AddPhotos({
  searchParams,
  lang,
}: {
  searchParams: Promise<{ kind?: string }>;
  lang: Locale;
}) {
  const t = dict(lang);
  // Arriving from the art gallery preselects that kind, so the common case
  // needs no interaction. The toggle is still there per file, because a batch
  // off someone's phone is often a mix.
  const defaultKind = parseKind((await searchParams).kind);
  const fromArtifacts = defaultKind === "artifact";

  return (
    <main className="page" id="main">
      <h1 className="page-title">
        {fromArtifacts ? t.addPhotos.headingArt : t.addPhotos.headingPhotos}
      </h1>
      <hr className="rule" />

      <p className="jump-note">
        <Link href={localize(fromArtifacts ? "/artifacts" : "/photos", lang)}>{t.addPhotos.back}</Link>
      </p>

      {/* Don't offer an upload form that cannot accept an upload. Without
          credentials the submission would fail after the visitor had chosen
          files and waited — say so up front instead. */}
      {imagesConfigured() ? (
        <PhotoForm
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          defaultKind={defaultKind}
          lang={lang}
        />
      ) : (
        <section id="add" className="add-entry">
          <h2>{t.addPhotos.closedHeading}</h2>
          <p className="prose">
            {t.addPhotos.closedBody}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </section>
      )}
    </main>
  );
}
