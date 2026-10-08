import type { Metadata } from "next";
import GalleryPage from "../../photos/view";
import { alternatesFor, dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict("es").titles.art,
  alternates: alternatesFor("/artifacts", "es"),
};

// Same caching as the English page; see src/app/photos/page.tsx.
export const revalidate = 60;

export default function ArtifactsPage() {
  return <GalleryPage kind="artifact" lang="es" />;
}
