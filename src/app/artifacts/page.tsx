import type { Metadata } from "next";
import GalleryPage from "../photos/view";
import { alternatesFor, dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict("en").titles.art,
  alternates: alternatesFor("/artifacts", "en"),
};

// Cached, not per-request — approving calls revalidatePath("/artifacts"), so an
// approved picture still appears at once. See the note on /photos.
export const revalidate = 60;

export default function ArtifactsPage() {
  return <GalleryPage kind="artifact" lang="en" />;
}
