import type { Metadata } from "next";
import Legacy from "./view";
import { alternatesFor, dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict("en").titles.legacy,
  alternates: alternatesFor("/legacy", "en"),
};

export default function LegacyPage() {
  return <Legacy lang="en" />;
}
