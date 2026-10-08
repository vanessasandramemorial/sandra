import type { Metadata } from "next";
import Legacy from "../../legacy/view";
import { alternatesFor, dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict("es").titles.legacy,
  alternates: alternatesFor("/legacy", "es"),
};

export default function LegacyPage() {
  return <Legacy lang="es" />;
}
