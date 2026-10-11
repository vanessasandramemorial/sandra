import type { Metadata } from "next";
import Legacy from "../../legacy/view";
import { alternatesFor, dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict("es").titles.legacy,
  alternates: alternatesFor("/legacy", "es"),
};

// Same caching as the English page; see src/app/legacy/page.tsx.
export const revalidate = 60;

export default function LegacyPage() {
  return <Legacy lang="es" />;
}
