import type { Metadata } from "next";
import Subscribe from "../../subscribe/view";
import { alternatesFor, dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict("es").titles.subscribe,
  alternates: alternatesFor("/subscribe", "es"),
};

export default function SubscribePage() {
  return <Subscribe lang="es" />;
}
