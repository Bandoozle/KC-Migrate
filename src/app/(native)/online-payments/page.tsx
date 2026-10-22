import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { EmbeddedFrame } from "@/components/sections/EmbeddedFrame";
import { PageTitle } from "@/components/typography";
import { getOnlinePaymentsContent } from "@/lib/wordpress/online-payments";
import styles from "./page.module.css";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/online-payments/");
}

export default async function OnlinePaymentsPage() {
  const content = await getOnlinePaymentsContent();

  return (
    <main>
      <section className={`section ${styles.intro}`}>
        <div className="container">
          <PageTitle as="h1">{content.title}</PageTitle>
        </div>
      </section>
      <EmbeddedFrame
        title={content.title}
        src={content.iframeSrc}
        minHeight={content.iframeMinHeight}
      />
    </main>
  );
}
