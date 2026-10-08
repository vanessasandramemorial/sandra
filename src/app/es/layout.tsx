import type { Metadata } from "next";
import { dict } from "@/lib/i18n";
import { SITE_NAME } from "../../site.config";

const t = dict("es");

// Everything under /es is the Spanish mirror of the English site. Only the
// description and share-card locale differ here; titles come from each page.
export const metadata: Metadata = {
  description: t.description,
  openGraph: {
    type: "profile",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: t.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SITE_NAME }],
    locale: "es_PR",
    alternateLocale: ["en_US"],
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: t.description },
};

export default function SpanishLayout({ children }: { children: React.ReactNode }) {
  // <html lang> belongs to the shared root layout, which can't know the
  // language without making every page dynamic. Marking the content itself is
  // what screen readers and search engines act on; Nav corrects <html lang>
  // once the page loads.
  return <div lang="es">{children}</div>;
}
