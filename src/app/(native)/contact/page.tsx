import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { ContactPageView } from "@/components/contact/ContactPageView";
import { getContactPageContent } from "@/lib/wordpress/contact";
import { getHomePageContent } from "@/lib/wordpress/home";

export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/contact/");
}

export default async function ContactPage() {
  const [content, home] = await Promise.all([getContactPageContent(), getHomePageContent()]);
  // The featured review: the first on the home page, and the only one naming the client's company
  return <ContactPageView content={content} testimonial={home.testimonials.items[0] ?? null} />;
}
