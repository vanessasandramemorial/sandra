import type { Metadata } from "next";
import GalleryPage from "../../photos/view";
import { alternatesFor, dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict("es").titles.photos,
  alternates: alternatesFor("/photos", "es"),
};

// Same caching as the English page; see src/app/photos/page.tsx.
export const revalidate = 60;

export default function PhotosPage() {
  return <GalleryPage kind="photo" lang="es" />;
}
