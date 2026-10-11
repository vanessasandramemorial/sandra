"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { hashIp } from "@/lib/ip";
import { isLegacySlug, recordSupport, removeSupport, type SupportResult } from "@/lib/legacy";

function refresh() {
  revalidatePath("/legacy");
  revalidatePath("/es/legacy");
  revalidatePath("/admin");
}

/**
 * "I supported this in Sandra's memory."
 *
 * No Turnstile, unlike the forms: this writes a single number, nobody's words
 * or files, and a mistaken or inflated count is corrected in /admin with no
 * harm done. A verification box beside every cause would cost far more, for
 * the older readers this page is for, than the abuse it would stop. The rate
 * limit in recordSupport is the guard instead.
 */
export async function supportCause(slug: string): Promise<SupportResult | { status: "error" }> {
  if (!isLegacySlug(slug)) return { status: "error" };

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  try {
    const result = await recordSupport(slug, hashIp(ip));
    if (result.status === "counted") refresh();
    return result;
  } catch (e) {
    console.error("Failed to record legacy support:", e);
    return { status: "error" };
  }
}

/** Undo a press made by accident, using the id the visitor's browser kept. */
export async function undoSupport(id: string): Promise<boolean> {
  try {
    const slug = await removeSupport(String(id));
    if (!slug) return false;
    refresh();
    return true;
  } catch (e) {
    console.error("Failed to undo legacy support:", e);
    return false;
  }
}
