import type { Metadata } from "next";
import AddPhotos from "../../../photos/add/view";
import { alternatesFor, dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict("es").titles.addPhotos,
  alternates: alternatesFor("/photos/add", "es"),
};

export default function AddPhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  return <AddPhotos searchParams={searchParams} lang="es" />;
}
