import Link from "next/link";
import Gallery from "./gallery";
import { getApprovedPhotos, type PhotoKind as Kind } from "@/lib/photos";
import { imageUrl, thumbUrl, imagesConfigured } from "@/lib/cf-images";
import { dict, localize, type Locale } from "@/lib/i18n";

/**
 * /photos and /artifacts in either language. Both galleries are the same
 * component over getApprovedPhotos(kind); only the words around them differ.
 */
export default async function GalleryPage({ kind, lang }: { kind: Kind; lang: Locale }) {
  const t = dict(lang);
  const isArt = kind === "artifact";
  const addHref = localize(isArt ? "/photos/add?kind=artifact" : "/photos/add", lang);

  let photos: Awaited<ReturnType<typeof getApprovedPhotos>> = [];
  let failed = false;
  try {
    photos = await getApprovedPhotos(kind);
  } catch (e) {
    // A database problem shouldn't take the page down — the gallery below still tries.
    console.error(`Failed to load ${kind} gallery:`, e);
    failed = true;
  }

  return (
    <main className="page page-photos" id="main">
      <h1 className="page-title">{isArt ? t.titles.art : t.titles.photos}</h1>
      <hr className="rule" />

      {isArt && <p className="prose">{t.art.intro}</p>}

      <div className="toolbar-row">
        {/* Plain anchor, not Link: the target renders a Turnstile widget and a
            client-side navigation leaves it unrendered. See needsFullLoad. */}
        <a href={addHref} className="btn-primary">
          {isArt ? t.art.send : t.photos.addMore}
        </a>

        <p className="muted-note">{isArt ? t.art.notOnlyPhotos : t.photos.reloadNote}</p>
      </div>

      {!isArt && (
        <p className="muted-note">
          {t.photos.artLivesUnder} <Link href={localize("/artifacts", lang)}>{t.nav.art}</Link>.
        </p>
      )}

      {failed ? (
        <p className="form-error">{isArt ? t.art.loadFailed : t.photos.loadFailed}</p>
      ) : photos.length === 0 ? (
        <p className="prose empty-state">
          {isArt ? t.art.emptyLead : t.photos.emptyLead}{" "}
          {imagesConfigured() ? (
            isArt ? (
              <>
                {t.art.emptyHave} <a href={addHref}>{t.art.emptySend}</a> {t.art.emptyAppear}
              </>
            ) : (
              <>
                {t.photos.emptyHaveSome} <a href={addHref}>{t.photos.emptySendThem}</a>{" "}
                {t.photos.emptyAppear}
              </>
            )
          ) : (
            <>{isArt ? t.art.emptySoon : t.photos.emptySoon}</>
          )}
        </p>
      ) : (
        <Gallery
          lang={lang}
          photos={photos.map((p) => ({
            id: p.id,
            thumb: thumbUrl(p.storage_ref),
            full: imageUrl(p.storage_ref),
            caption: p.caption,
            submitter: p.submitter,
            year: p.taken_year,
            yearApprox: p.taken_source === "guess",
            rotation: p.rotation,
            width: p.width,
            height: p.height,
            stack: p.stack.map((s) => ({
              thumb: thumbUrl(s.storage_ref),
              full: imageUrl(s.storage_ref),
              caption: s.caption,
              rotation: s.rotation,
              width: s.width,
              height: s.height,
            })),
          }))}
        />
      )}
    </main>
  );
}
