import type { Metadata } from "next";
import AddMessage from "./view";
import { alternatesFor, dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict("en").titles.addMessage,
  alternates: alternatesFor("/guestbook/add", "en"),
};

export default function AddGuestbookPage() {
  return <AddMessage lang="en" />;
}
