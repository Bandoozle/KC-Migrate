import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { InternalPageHero } from "@/components/sections/InternalPageHero";
import { EmbeddedFrame } from "@/components/sections/EmbeddedFrame";
import { serviceHeroActions } from "@/lib/content/industry-heroes";
import { getOnlinePaymentsContent } from "@/lib/wordpress/online-payments";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/online-payments/");
}

export default async function OnlinePaymentsPage() {
  const content = await getOnlinePaymentsContent();
  const actions = serviceHeroActions();
  const words = content.title.trim().split(/\s+/).filter(Boolean);
  const mid = Math.max(1, Math.ceil(words.length / 2));

  return (
    <main>
      <InternalPageHero
        plain
        eyebrow="Payments"
        titlePrimary={words.slice(0, mid).join(" ") || "Pay Your Invoice"}
        titleSecondary={words.slice(mid).join(" ") || undefined}
        primaryCTA={actions.cta}
        secondaryCTA={actions.secondaryCta}
      />
      <EmbeddedFrame
        title={content.title}
        src={content.iframeSrc}
        minHeight={content.iframeMinHeight}
      />
    </main>
  );
}
