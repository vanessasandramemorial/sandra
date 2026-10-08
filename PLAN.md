# Plan — what's still ahead

Forward-looking only. What the site already is: `ARCHITECTURE.md`. Why past
decisions were made: `historic/HISTORY.md`. How to run and moderate the live
site: `README.md`.

## Soon after launch

- Add photographs of Sandra's paintings and her glass mosaic to the Art page.
- Share the link with family and friends, including the Spanish address
  (`sandraaponte.org/es`) for Spanish-speaking family.
- Expect the largest burst of guestbook entries and photo submissions in the
  first couple of weeks — check `/admin` daily during that window.

## Ongoing

- **Keep both languages in step.** Any change to the obituary goes into both
  `content/obituary.md` and `content/obituary.es.md`; any change to the site's
  wording goes into both halves of `src/lib/i18n.ts`.
- **Gallery sort order.** Curated photos currently lead, then submissions run
  newest-first. Chronological order by `taken_year` is the better arrangement
  once enough of those are confirmed (see `src/lib/photos.ts`).
- **Handoff notes** for whoever inherits running this, beyond what's already
  in `README.md` — who has the passwords, who pays for what, and where the
  physical and digital originals ended up.

## Year two: freeze to static

Submissions will stop, probably within six months. When they do:

1. Snapshot the guestbook and both galleries to plain HTML.
2. Delete the database (Neon, and its connection string).
3. Point the domain at static hosting.

After that the site costs only the domain renewal and cannot break — no
vendor, no tier, no free-plan policy change, nothing to unpause, nothing to
monitor. This is why the database was always treated as temporary scaffolding
rather than permanent infrastructure (see `ARCHITECTURE.md` → "Data model").
