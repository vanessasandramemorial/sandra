/**
 * Keep one surname off the public pages.
 *
 * Some visitors write Sandra's married surname in guestbook messages and photo
 * captions; the family would rather it not appear. Messages are stored exactly
 * as written and cleaned only when shown, so the original survives in /admin
 * and a rule that reads badly can be changed without rewriting anyone's words.
 *
 * The surname itself is read from the REDACT_SURNAME environment variable and
 * is never written in this repository: the repo is public, and putting the
 * word here would publish it permanently — the opposite of the point. Unset,
 * text passes through untouched.
 *
 * Applied to message text and captions only, never to the name someone signs
 * with: a relative who carries the name signs as themselves.
 */

/** Titles that become "Ms. Aponte". */
const EN_TITLES = String.raw`Mrs\.?|Ms\.?|Miss|Mrs`;
/** Titles that become "Sra. Aponte". */
const ES_TITLES = String.raw`Sra\.?|Se[ñn]ora|Srta\.?|Do[ñn]a`;
/** Titles kept as written, with Aponte after them. */
const OTHER_TITLES = String.raw`Dr\.?|Dra\.?|Prof\.?|Profesora|Professor`;

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The surname as written, with or without "Aponte" or "de" before it, so
 * "Aponte <surname>" and "Aponte de <surname>" collapse to one "Aponte".
 * Unicode-aware boundaries, since \b doesn't treat accented letters as letters.
 */
function surnamePattern(name: string): string {
  return String.raw`(?:Aponte\s+(?:de\s+)?)?${escape(name)}(?![\p{L}\p{N}])`;
}

export function redactSurname(text: string): string;
export function redactSurname(text: string | null): string | null;
export function redactSurname(text: string | null): string | null {
  const name = process.env.REDACT_SURNAME?.trim();
  if (!text || !name) return text;
  const s = surnamePattern(name);
  const start = String.raw`(?<![\p{L}\p{N}])`;

  return (
    text
      // "Mrs. Surname" → "Ms. Aponte"; "Sra. Surname" → "Sra. Aponte".
      .replace(new RegExp(`${start}(?:${EN_TITLES})\\s+${s}`, "giu"), "Ms. Aponte")
      .replace(new RegExp(`${start}(?:${ES_TITLES})\\s+${s}`, "giu"), "Sra. Aponte")
      .replace(new RegExp(`${start}(${OTHER_TITLES})\\s+${s}`, "giu"), "$1 Aponte")
      // "Sandra Surname", "Sandra I. Surname", "Sandra Aponte de Surname" → "Sandra Aponte".
      .replace(
        new RegExp(`${start}Sandra\\s+(?:Ivelisse\\s+|I\\.\\s+|A\\.\\s+)?${s}`, "giu"),
        "Sandra Aponte",
      )
      // A possessive on its own reads better with her name than with nothing.
      .replace(new RegExp(`${start}${escape(name)}(['’]s)(?![\\p{L}\\p{N}])`, "giu"), "Aponte$1")
      // Anything left: drop the word and the space before it.
      .replace(new RegExp(`\\s*${start}${s}`, "giu"), "")
      .replace(/[ \t]{2,}/g, " ")
  );
}
