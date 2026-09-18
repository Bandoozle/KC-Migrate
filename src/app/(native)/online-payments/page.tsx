import type { Metadata } from "next";
import { EmbeddedFrame } from "@/components/sections/EmbeddedFrame";
import { PageTitle } from "@/components/typography";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getOnlinePaymentsContent } from "@/lib/wordpress/online-payments";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("online-payments");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Pay Your Invoice Online | Kosick Communications",
  };
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
