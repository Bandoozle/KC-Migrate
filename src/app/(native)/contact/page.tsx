import type { Metadata } from "next";
import { ContactPageView } from "@/components/contact/ContactPageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getContactPageContent } from "@/lib/wordpress/contact";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("contact");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Contact | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function ContactPage() {
  const content = await getContactPageContent();
  return <ContactPageView content={content} />;
}
