import type { Metadata } from "next";
import Home from "./home";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = { alternates: alternatesFor("/", "en") };

export default function Page() {
  return <Home lang="en" />;
}
