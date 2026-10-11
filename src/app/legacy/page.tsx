import type { Metadata } from "next";
import Legacy from "./view";
import { alternatesFor, dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict("en").titles.legacy,
  alternates: alternatesFor("/legacy", "en"),
};

// Cached, like the galleries: a press calls revalidatePath("/legacy"), so the
// new count shows at once, and this is only the backstop for edits in /admin.
export const revalidate = 60;

export default function LegacyPage() {
  return <Legacy lang="en" />;
}
