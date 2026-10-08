import type { Metadata } from "next";
import GalleryPage from "./view";
import { alternatesFor, dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict("en").titles.photos,
  alternates: alternatesFor("/photos", "en"),
};

// Cached, not per-request. Approving a photo calls revalidatePath("/photos"),
// so it still appears the moment it is approved — the window here is only a
// backstop for anything that changes outside that path.
//
// Per-request meant a Postgres round trip for every visitor, and this page is
// the one a few hundred people open at once when the email goes out. Neon bills
// by the time the compute is awake.
export const revalidate = 60;

export default function PhotosPage() {
  return <GalleryPage kind="photo" lang="en" />;
}
