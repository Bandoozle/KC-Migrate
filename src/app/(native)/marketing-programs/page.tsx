import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { MarketingProgramDirectory } from "@/components/sections/MarketingProgramDirectory";

export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/marketing-programs/");
}

export default function MarketingProgramsPage() {
  return (
    <main>
      <MarketingProgramDirectory />
    </main>
  );
}
