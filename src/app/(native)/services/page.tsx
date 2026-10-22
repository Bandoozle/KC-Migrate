import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { PageHero } from "@/components/sections/PageHero";
import { SectionLead } from "@/components/sections/SectionLead";
import { getServicesContent } from "@/lib/wordpress/services";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/");
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
