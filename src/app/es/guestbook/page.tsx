import type { Metadata } from "next";
import Guestbook from "../../guestbook/view";
import { alternatesFor, dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict("es").titles.guestbook,
  alternates: alternatesFor("/guestbook", "es"),
};

// Per-request, like the English page; see src/app/guestbook/page.tsx.
export const dynamic = "force-dynamic";

export default function GuestbookPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return <Guestbook searchParams={searchParams} lang="es" />;
}
