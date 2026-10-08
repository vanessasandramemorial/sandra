"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { notifyGuestbookEntry } from "@/lib/notify";
import { db } from "@/lib/db";
import { hashIp } from "@/lib/ip";
import { recentCountForIp } from "@/lib/guestbook";
import { verifyTurnstile } from "@/lib/turnstile";
import { DATE_LOCALE, dict, parseLocale } from "@/lib/i18n";

export type GuestbookState = { status: "idle" | "ok" | "error"; message?: string };

const MAX_NAME = 120;
const MAX_MESSAGE = 5000;
const MAX_EMAIL = 320;
/** Entries per IP per hour. High enough that a family posting together is fine. */
const HOURLY_LIMIT = 5;

export async function signGuestbook(
  _prev: GuestbookState,
  formData: FormData,
): Promise<GuestbookState> {
  const lang = parseLocale(formData.get("lang"));
  const t = dict(lang).guestbookActions;

  if ((formData.get("website") as string | null)?.trim()) {
    // Honeypot hit. Report success so the bot learns nothing; write nothing.
    return { status: "ok", message: t.thanks };
  }

  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";

  if (!name) return { status: "error", message: t.needName };
  if (!message) return { status: "error", message: t.needMessage };
  if (name.length > MAX_NAME) {
    return { status: "error", message: t.nameTooLong };
  }
  if (message.length > MAX_MESSAGE) {
    return {
      status: "error",
      message: t.messageTooLong(MAX_MESSAGE.toLocaleString(DATE_LOCALE[lang])),
    };
  }
  if (email.length > MAX_EMAIL) {
    return { status: "error", message: t.emailTooLong };
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ipHash = hashIp(ip);

  // "deny" on outage, unlike the signup form: entries here publish straight to
  // a public page, so an unverified one is visible to everyone who visits.
  const check = await verifyTurnstile(
    formData.get("cf-turnstile-response") as string | null,
    ip,
    "deny",
  );
  if (!check.ok) return { status: "error", message: dict(lang).turnstile[check.code ?? "rejected"] };

  try {
    if ((await recentCountForIp(ipHash)) >= HOURLY_LIMIT) {
      return { status: "error", message: t.rateLimited };
    }

    // Published immediately — historic/HISTORY.md §1. A tribute that vanishes
    // on submit reads as broken to the person who wrote it, and they don't come back.
    await db()`
      insert into guestbook_entries (name, message, email, ip_hash, status)
      values (${name}, ${message}, ${email || null}, ${ipHash}, 'published')
    `;

    // Every visitor action lands in contact_log, not just mailing-list and
    // RSVP signups — see subscribe/actions.ts for the rest of the writers.
    await db()`
      insert into contact_log (type, email, name, detail)
      values ('guestbook', ${email || null}, ${name}, ${message})
    `;
  } catch (e) {
    console.error("Failed to record a guestbook entry:", e);
    return { status: "error", message: t.saveFailed };
  }

  revalidatePath("/guestbook");
  revalidatePath("/es/guestbook");

  // after() runs once the response has been sent, so the writer isn't kept
  // waiting on an email round trip. It also survives the serverless function
  // returning, which a bare floating promise would not.
  after(() => notifyGuestbookEntry({ name, message, email: email || null }));

  return { status: "ok", message: t.thanks };
}
