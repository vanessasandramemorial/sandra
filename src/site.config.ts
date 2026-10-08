/**
 * The strings that make this Sandra's site rather than anyone else's.
 *
 * Kept in their own file, away from the Open Graph/metadata plumbing in
 * layout.tsx that reads them, so updates merged from the original project never
 * touch them. Listed in .gitattributes as `merge=ours` so an edit here is never
 * overwritten by pulling an update.
 *
 * The Spanish description lives with the other Spanish strings in
 * src/lib/i18n.ts.
 */
export const SITE_NAME = "Sandra Aponte Santiago";
export const SITE_DESCRIPTION =
  "In memory of Sandra Aponte Santiago, 1952–2026. Educator, counselor, traveler, and a loving mother, grandmother, and sister.";

/** Where visitors are told to write when something on the site doesn't work. */
export const CONTACT_EMAIL = "contact@sandraaponte.org";
