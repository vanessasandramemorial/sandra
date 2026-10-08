import type { Metadata } from "next";
import AddMessage from "../../../guestbook/add/view";
import { alternatesFor, dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict("es").titles.addMessage,
  alternates: alternatesFor("/guestbook/add", "es"),
};

export default function AddGuestbookPage() {
  return <AddMessage lang="es" />;
}
