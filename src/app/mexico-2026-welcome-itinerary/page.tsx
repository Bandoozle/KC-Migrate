import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { MexicoItineraryPageView } from "@/components/microsites/MexicoItineraryPageView";
import { getMexicoItineraryContent } from "@/lib/wordpress/microsites";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/mexico-2026-welcome-itinerary/");
}

export default async function MexicoItineraryPage() {
  const content = await getMexicoItineraryContent();
  return (
    <NativePageShell transparentHeader>
      <MexicoItineraryPageView content={content} />
    </NativePageShell>
  );
}
