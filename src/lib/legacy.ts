import { db } from "./db";

/** Causes that can carry a counter. Matches the rows seeded by db/016. */
export const LEGACY_SLUGS = ["prxpr", "kind", "thedream", "latinos-for-education"] as const;
export type LegacySlug = (typeof LEGACY_SLUGS)[number];

/** Display names for /admin, which is English only. */
export const LEGACY_NAMES: Record<LegacySlug, string> = {
  prxpr: "PRxPR Relief & Rebuild Fund",
  kind: "Kids in Need of Defense (KIND)",
  thedream: "TheDream.US",
  "latinos-for-education": "Latinos for Education",
};

export function isLegacySlug(s: unknown): s is LegacySlug {
  return typeof s === "string" && (LEGACY_SLUGS as readonly string[]).includes(s);
}

/** Current count for every cause; a cause with no row reads as 0. */
export async function getLegacyCounts(): Promise<Record<LegacySlug, number>> {
  const rows = (await db()`select slug, count from legacy_causes`) as {
    slug: string;
    count: number;
  }[];
  const out = Object.fromEntries(LEGACY_SLUGS.map((s) => [s, 0])) as Record<LegacySlug, number>;
  for (const r of rows) if (isLegacySlug(r.slug)) out[r.slug] = r.count;
  return out;
}

/**
 * Presses allowed from one address: once per cause per day, and a handful in
 * total per day. Generous for a family sharing one connection, useless to a
 * script. The family can always correct a number in /admin.
 */
const PER_CAUSE_WINDOW = "24 hours";
const DAILY_LIMIT = 8;

export type SupportResult =
  | { status: "counted"; id: string }
  | { status: "already" }
  | { status: "limited" };

/**
 * Record one "I supported this" press, unless the same address just did.
 *
 * Returns the press's id on success. The visitor's browser keeps it, and it is
 * what lets them take the press back with removeSupport — knowing the id is the
 * only proof needed, since nothing else ties a press to a person.
 */
export async function recordSupport(slug: LegacySlug, ipHash: string | null): Promise<SupportResult> {
  if (ipHash) {
    const [row] = (await db()`
      select
        count(*) filter (where slug = ${slug} and created_at > now() - ${PER_CAUSE_WINDOW}::interval)::int as same,
        count(*) filter (where created_at > now() - interval '24 hours')::int as total
      from legacy_supports
      where ip_hash = ${ipHash}
    `) as { same: number; total: number }[];
    if ((row?.same ?? 0) > 0) return { status: "already" };
    if ((row?.total ?? 0) >= DAILY_LIMIT) return { status: "limited" };
  }

  const [inserted] = (await db()`
    insert into legacy_supports (slug, ip_hash) values (${slug}, ${ipHash}) returning id
  `) as { id: string }[];
  await db()`
    update legacy_causes set count = count + 1, updated_at = now() where slug = ${slug}
  `;
  return { status: "counted", id: inserted.id };
}

/**
 * Take back one press — someone who clicked by accident. Removes that press
 * and lowers the count by one, never below zero. Returns the cause it belonged
 * to, or null if the id matches nothing (already undone, or invented).
 */
export async function removeSupport(id: string): Promise<LegacySlug | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = (await db()`
    delete from legacy_supports where id = ${id}::uuid returning slug
  `) as { slug: string }[];
  if (!row || !isLegacySlug(row.slug)) return null;
  await db()`
    update legacy_causes set count = greatest(count - 1, 0), updated_at = now()
    where slug = ${row.slug}
  `;
  return row.slug;
}

/** Set a cause's number by hand, from /admin. */
export async function setLegacyCount(slug: LegacySlug, count: number): Promise<void> {
  await db()`
    insert into legacy_causes (slug, count) values (${slug}, ${count})
    on conflict (slug) do update set count = excluded.count, updated_at = now()
  `;
}
