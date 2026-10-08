import SubscribeForm from "./form";
import { dict, type Locale } from "@/lib/i18n";
import { CONTACT_EMAIL } from "../../site.config";

/** /subscribe in either language. */
export default function Subscribe({ lang }: { lang: Locale }) {
  const t = dict(lang);
  return (
    <main className="page" id="main">
      <h1 className="page-title">{t.titles.subscribe}</h1>
      <hr className="rule" />
      <div className="prose">
        <p>{t.subscribe.intro}</p>
        <p>{t.subscribe.handful}</p>
      </div>

      <SubscribeForm siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} lang={lang} />

      <p className="contact-note">
        {t.subscribe.writeInstead} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </main>
  );
}
