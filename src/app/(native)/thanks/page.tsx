import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { InternalPageHero } from "@/components/sections/InternalPageHero";
import { getThanksContent } from "@/lib/wordpress/thanks";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/thanks/");
}

export default async function ThanksPage() {
  const content = await getThanksContent();
  const title = content.title.trim();
  const thanksTitle = /^thank you\.?$/i.test(title);

  return (
    <main>
      <InternalPageHero
        plain
        eyebrow="Kosick Communications"
        titlePrimary="Thank"
        titleSecondary="You"
        description={thanksTitle ? undefined : title}
        primaryCTA={{ label: "Back to Home", href: "/" }}
      />
    </main>
  );
}
