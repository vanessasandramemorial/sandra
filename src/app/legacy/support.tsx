"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { supportCause, undoSupport } from "./actions";
import { dict, type Locale } from "@/lib/i18n";

/**
 * Where a press is remembered: localStorage, which can throw in private
 * windows or with site data blocked — then an in-memory copy stands in, so
 * the button still works and merely forgets the press on reload.
 */
const memory = new Map<string, string>();
const CHANGED = "legacy-support-changed";

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    if (value) memory.set(key, value);
    else memory.delete(key);
  }
  window.dispatchEvent(new Event(CHANGED));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGED, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGED, onChange);
  };
}

/**
 * The count line and "I supported this" button under one cause.
 *
 * The count line only appears from 1 upward, so no cause ever reads as
 * overlooked. After a press the browser keeps the press's id: returning to the
 * page shows the thank-you instead of inviting a second count, and "Undo" can
 * take back exactly that press if it was an accident.
 */
export default function Support({
  slug,
  initialCount,
  lang,
}: {
  slug: string;
  initialCount: number;
  lang: Locale;
}) {
  const t = dict(lang).legacy;
  const key = `legacy-supported:${slug}`;
  // null on the server and on first paint, so the page renders the same
  // there as in the browser; the stored press appears right after.
  const pressId = useSyncExternalStore(subscribe, () => read(key), () => null);
  const [count, setCount] = useState(initialCount);
  const [notice, setNotice] = useState<"limited" | "error" | null>(null);
  const [pending, start] = useTransition();

  function press() {
    setNotice(null);
    start(async () => {
      const r = await supportCause(slug);
      if (r.status === "counted") {
        setCount((c) => c + 1);
        write(key, r.id);
      } else if (r.status === "already" || r.status === "limited") {
        setNotice("limited");
      } else {
        setNotice("error");
      }
    });
  }

  function undo() {
    if (!pressId) return;
    setNotice(null);
    start(async () => {
      if (await undoSupport(pressId)) {
        setCount((c) => Math.max(c - 1, 0));
      }
      // Forget the press either way: a failed undo means it was already gone.
      write(key, null);
    });
  }

  return (
    <div className="legacy-support">
      {count > 0 && (
        <p className="legacy-count">
          <span aria-hidden="true">♥ </span>
          {t.count(count)}
        </p>
      )}
      {pressId ? (
        <p className="muted-note" role="status">
          {t.thanks}{" "}
          <button type="button" className="link-button" disabled={pending} onClick={undo}>
            {pending ? t.undoing : t.undo}
          </button>
        </p>
      ) : notice === "limited" ? (
        <p className="muted-note" role="status">
          {t.limited}
        </p>
      ) : (
        <>
          <button type="button" className="btn-quiet" disabled={pending} onClick={press}>
            {pending ? t.sending : t.button}
          </button>
          {notice === "error" && (
            <p className="form-error" role="alert">
              {t.error}
            </p>
          )}
        </>
      )}
    </div>
  );
}
