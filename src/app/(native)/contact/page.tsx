import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { ContactPageView } from "@/components/contact/ContactPageView";
import { getContactPageContent } from "@/lib/wordpress/contact";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/contact/");
}

export default async function ContactPage() {
  const content = await getContactPageContent();
  return <ContactPageView content={content} />;
}
