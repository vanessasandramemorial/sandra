"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dict, localeFromPath } from "@/lib/i18n";

// A client component only to read the path, which is how it knows the language.
// The page it links to is English only, and says so in Spanish.
export default function Footer() {
  const t = dict(localeFromPath(usePathname()));
  return (
    <footer className="sitefoot">
      <Link href="/how-to-make-this" hrefLang="en">
        {t.footer.howTo}
      </Link>
    </footer>
  );
}
