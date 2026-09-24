import type { Metadata } from "next";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { ComfortmakerPageView } from "@/components/microsites/ComfortmakerPageView";
import { getComfortmakerContent } from "@/lib/wordpress/microsites";


export async function generateMetadata(): Promise<Metadata> {
  const content = await getComfortmakerContent();
  return {
    title: content.metaTitle,
    description: content.description || undefined,
  };
}

export default async function ComfortmakerPage() {
  const content = await getComfortmakerContent();
  return (
    <NativePageShell transparentHeader>
      <ComfortmakerPageView content={content} />
    </NativePageShell>
  );
}
