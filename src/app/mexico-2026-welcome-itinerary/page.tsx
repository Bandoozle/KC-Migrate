import type { Metadata } from "next";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { MexicoItineraryPageView } from "@/components/microsites/MexicoItineraryPageView";
import { getMexicoItineraryContent } from "@/lib/wordpress/microsites";


export async function generateMetadata(): Promise<Metadata> {
  const content = await getMexicoItineraryContent();
  return {
    title: content.metaTitle,
    description: content.description || undefined,
  };
}

export default async function MexicoItineraryPage() {
  const content = await getMexicoItineraryContent();
  return (
    <NativePageShell transparentHeader>
      <MexicoItineraryPageView content={content} />
    </NativePageShell>
  );
}
