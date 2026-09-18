import type { Metadata } from "next";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { UncorkedPageView } from "@/components/microsites/UncorkedPageView";
import { getUncorkedContent } from "@/lib/wordpress/microsites";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getUncorkedContent();
  return {
    title: content.metaTitle,
    description: content.description || undefined,
  };
}

export default async function UncorkedPage() {
  const content = await getUncorkedContent();
  return (
    <NativePageShell transparentHeader>
      <UncorkedPageView content={content} />
    </NativePageShell>
  );
}
