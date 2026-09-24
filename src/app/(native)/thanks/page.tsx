import type { Metadata } from "next";
import { SimpleMessage } from "@/components/sections/SimpleMessage";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getThanksContent } from "@/lib/wordpress/thanks";


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("thanks");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Thank you | Kosick Communications",
  };
}

export default async function ThanksPage() {
  const content = await getThanksContent();

  return (
    <main>
      <SimpleMessage title={content.title} />
    </main>
  );
}
