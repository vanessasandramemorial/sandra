import Link from "next/link";
import GuestbookForm from "../form";
import { dict, localize, type Locale } from "@/lib/i18n";

/** /guestbook/add in either language. */
export default function AddMessage({ lang }: { lang: Locale }) {
  const t = dict(lang);
  return (
    <main className="page" id="main">
      <h1 className="page-title">{t.titles.addMessage}</h1>
      <hr className="rule" />

      <p className="jump-note">
        <Link href={localize("/guestbook", lang)}>{t.guestbook.back}</Link>
      </p>

      <GuestbookForm siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} lang={lang} />
    </main>
  );
}
