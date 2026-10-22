import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { SimpleMessage } from "@/components/sections/SimpleMessage";
import { getThanksContent } from "@/lib/wordpress/thanks";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/thanks/");
}

export default async function ThanksPage() {
  const content = await getThanksContent();

  return (
    <main>
      <SimpleMessage title={content.title} />
    </main>
  );
}
