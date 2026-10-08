import Link from "next/link";
import { getPublishedEntries, formatDate, PAGE_SIZE } from "@/lib/guestbook";
import { DATE_LOCALE, dict, localize, type Locale } from "@/lib/i18n";

/** /guestbook in either language. Messages are shown as written, in whatever language. */
export default async function Guestbook({
  searchParams,
  lang,
}: {
  searchParams: Promise<{ page?: string }>;
  lang: Locale;
}) {
  const t = dict(lang);
  const g = t.guestbook;
  const base = localize("/guestbook", lang);
  const { page: raw } = await searchParams;
  const page = Math.max(0, Number.parseInt(raw ?? "0", 10) || 0);

  let entries: Awaited<ReturnType<typeof getPublishedEntries>>["entries"] = [];
  let hasOlder = false;
  let failed = false;

  try {
    ({ entries, hasOlder } = await getPublishedEntries(page));
  } catch (e) {
    // A database problem shouldn't take the page down — visitors can still
    // navigate to /guestbook/add to write a message.
    console.error("Failed to load guestbook entries:", e);
    failed = true;
  }

  return (
    <main className="page" id="main">
      <h1 className="page-title">{t.titles.guestbook}</h1>
      <hr className="rule" />

      {page === 0 && (
        <p className="jump-note">
          {/* Plain anchor, not Link: the target renders a Turnstile widget and a
              client-side navigation leaves it unrendered. See needsFullLoad. */}
          <a href={localize("/guestbook/add", lang)} className="btn-primary">
            {g.leave}
          </a>
        </p>
      )}

      {failed ? (
        <p className="form-error">{g.loadFailed}</p>
      ) : entries.length === 0 ? (
        <p className="prose empty-state">{page === 0 ? g.emptyFirst : g.emptyMore}</p>
      ) : (
        <div className="entries">
          {entries.map((entry) => (
            <article key={entry.id} className="entry">
              <header className="entry-head">
                {/* Rendered as text by React, never as HTML. */}
                <span className="entry-name">{g.from(entry.name)}</span>
                <time className="entry-date" dateTime={entry.created_at.toISOString()}>
                  {formatDate(entry.created_at, DATE_LOCALE[lang])}
                </time>
              </header>
              {/* white-space: pre-line keeps the paragraph breaks people type,
                  without interpreting anything as markup. No lang attribute:
                  a message is in whichever language its writer chose. */}
              <p className="entry-message" lang="">
                {entry.message}
              </p>
            </article>
          ))}
        </div>
      )}

      {(page > 0 || hasOlder) && (
        <nav className="pager" aria-label={g.pagerLabel}>
          {page > 0 ? (
            <Link href={page === 1 ? base : `${base}?page=${page - 1}`}>{g.newer}</Link>
          ) : (
            <span />
          )}
          {hasOlder && <Link href={`${base}?page=${page + 1}`}>{g.older}</Link>}
        </nav>
      )}

      {page > 0 && entries.length > 0 && (
        <p className="muted-note pager-note">
          {g.showing(page * PAGE_SIZE + 1, page * PAGE_SIZE + entries.length)}
        </p>
      )}
    </main>
  );
}
