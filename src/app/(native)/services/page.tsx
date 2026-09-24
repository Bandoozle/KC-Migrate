import type { Metadata } from "next";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { PageHero } from "@/components/sections/PageHero";
import { SectionLead } from "@/components/sections/SectionLead";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getServicesContent } from "@/lib/wordpress/services";


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("services");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Our Services & Expertise | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : "Explore Kosick Communications services and expertise.",
  };
}

export default async function ServicesPage() {
  const content = await getServicesContent();

  return (
    <main>
      <PageHero
        title={content.hero.title}
        backgroundImage={content.hero.backgroundImage}
      />
      <SectionLead title={content.intro.title} body={content.intro.body} />
      {content.categories.map((category) => (
        <FeatureSplit key={category.title} feature={category} />
      ))}
    </main>
  );
}
