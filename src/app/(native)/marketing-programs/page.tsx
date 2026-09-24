import type { Metadata } from "next";
import { MarketingProgramDirectory } from "@/components/sections/MarketingProgramDirectory";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { MARKETING_PROGRAMS_INTRO } from "@/lib/content/marketing-program-directory";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("marketing-programs");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Marketing Programs | Kosick Communications",
    description: MARKETING_PROGRAMS_INTRO.description,
  };
}

export default function MarketingProgramsPage() {
  return (
    <main>
      <MarketingProgramDirectory />
    </main>
  );
}
