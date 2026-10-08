import type { Metadata } from "next";
import NotFoundBody from "./not-found-body";

// One not-found page serves both languages — an unmatched address never
// reaches a nested segment — so the title carries both, and the body picks its
// language from the path in the browser.
export const metadata: Metadata = { title: "Page not found · Página no encontrada" };

export default function NotFound() {
  return <NotFoundBody />;
}
