"use client";

import Script from "next/script";
import { useActionState, useEffect, useRef } from "react";
import { subscribe, type SubscribeState } from "./actions";
import { dict, type Locale } from "@/lib/i18n";

const initial: SubscribeState = { status: "idle" };

/**
 * The mailing-list form, in one of two modes.
 *
 * RSVP is the same fields, the same table and the same consent — a signup that
 * also says yes — so it is a flag here rather than a second form to keep in
 * step. Only the wording, the button, a hidden field, and one RSVP-only field
 * (how many are coming) differ.
 */
export default function SubscribeForm({
  siteKey,
  rsvp = false,
  lang,
}: {
  siteKey?: string;
  rsvp?: boolean;
  lang: Locale;
}) {
  const [state, formAction, pending] = useActionState(subscribe, initial);
  const t = dict(lang);
  const s = t.subscribe;
  const widget = useRef<HTMLDivElement>(null);

  // A Turnstile token is single-use. After a failed submit the old one is spent,
  // so the widget has to be reset or the next attempt fails for the wrong reason.
  useEffect(() => {
    if (state.status === "error" && siteKey) {
      // reset() throws if Turnstile has already torn the widget down.
      try {
        (window as { turnstile?: { reset: () => void } }).turnstile?.reset();
      } catch (e) {
        console.warn("Turnstile reset failed (widget already gone):", e);
      }
    }
  }, [state, siteKey]);

  if (state.status === "ok") {
    return (
      <>
        <hr className="rule" />
        <h2>{rsvp ? s.seeYou : s.onList}</h2>
        <p className="form-ok" role="status">
          {state.message}
        </p>
      </>
    );
  }

  return (
    <>
      {siteKey && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      )}

      <form action={formAction} className="form">
        {/* Read server-side to set rsvp_at. A hidden field rather than a second
            action, so both paths share one validated, Turnstile-checked route. */}
        {rsvp && <input type="hidden" name="rsvp" value="1" />}
        {/* Which language to answer in. Read by the action; never stored. */}
        <input type="hidden" name="lang" value={lang} />

        <div className="field">
          <label htmlFor="email">{s.yourEmailAddress}</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={320}
          />
        </div>

        <div className="field">
          <label htmlFor="name">
            {t.common.yourName} <span className="optional">{t.common.optional}</span>
          </label>
          <input id="name" name="name" type="text" autoComplete="name" maxLength={120} />
        </div>

        {rsvp && (
          <div className="field">
            <label htmlFor="party-size">
              {s.numberAttending} <span className="optional">{t.common.optional}</span>
            </label>
            <input
              id="party-size"
              name="partySize"
              type="number"
              inputMode="numeric"
              min={1}
              max={50}
              placeholder="1"
            />
          </div>
        )}

        <div className="field">
          <label htmlFor="note">
            {rsvp ? s.anythingToKnow : s.howKnew}{" "}
            <span className="optional">{t.common.optional}</span>
          </label>
          <textarea
            id="note"
            name="note"
            rows={3}
            maxLength={500}
            placeholder={rsvp ? s.rsvpPlaceholder : undefined}
          />
        </div>

        {/* Honeypot. Hidden from people, tempting to naive bots. Not display:none —
            some bots skip those; this is off-screen and removed from the a11y tree. */}
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {/* data-action is Cloudflare's aggregate attribution marker for the
            Spin integration. Account-level only, never per-visitor. */}
        {siteKey && (
          <div
            ref={widget}
            className="cf-turnstile"
            data-sitekey={siteKey}
            data-action="turnstile-spin-v2"
            data-refresh-expired="auto"
          />
        )}

        {state.status === "error" && (
          <p className="form-error" role="alert">
            {state.message}
          </p>
        )}

        <button type="submit" disabled={pending}>
          {pending ? t.common.sending : rsvp ? s.rsvpButton : s.send}
        </button>
      </form>
    </>
  );
}
