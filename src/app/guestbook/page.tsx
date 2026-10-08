import type { Metadata } from "next";
import Guestbook from "./view";
import { alternatesFor, dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict("en").titles.guestbook,
  alternates: alternatesFor("/guestbook", "en"),
};

// Stays per-request, unlike /photos and /artifacts, and not by choice: this page
// reads searchParams for pagination, which makes it dynamic whatever revalidate
// says. Caching it would mean moving pages into the path (/guestbook/2), which
// changes URLs people may already have.
//
// Accepted for now because it is the quieter of the two: the gallery is what a
// few hundred people open at once from an email. If Neon usage is still high
// after the other changes, this is the next thing to look at.
export const dynamic = "force-dynamic";

export default function GuestbookPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return <Guestbook searchParams={searchParams} lang="en" />;
}
