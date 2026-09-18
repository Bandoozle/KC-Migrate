import type { HomePageContent } from "@/lib/wordpress/home";
import { HomeBento } from "./HomeBento";
import { HomeBrandTabs } from "./HomeBrandTabs";
import { HomeContact } from "./HomeContact";
import { HomeHero } from "./HomeHero";
import { HomeIntro } from "./HomeIntro";
import { HomeQuote } from "./HomeQuote";
import { HomeSolutions } from "./HomeSolutions";
import { HomeTestimonials } from "./HomeTestimonials";
import { HomeWhyChoose } from "./HomeWhyChoose";
import { SectionSeparator } from "./SectionSeparator";
import styles from "./HomePageView.module.css";

type HomePageViewProps = {
  content: HomePageContent;
};

export function HomePageView({ content }: HomePageViewProps) {
  return (
    <main className={styles.main}>
      <HomeHero content={content.hero} />
      <HomeIntro content={content.whatWeDoIntro} />
      <HomeBento items={content.bento} />
      <SectionSeparator />
      <HomeSolutions content={content.solutions} />
      <SectionSeparator />
      <HomeBrandTabs preceding={content.brandTabsPreceding} tabs={content.brandTabs} />
      <SectionSeparator tight />
      <HomeTestimonials content={content.testimonials} />
      <SectionSeparator />
      <HomeWhyChoose content={content.whyChoose} />
      <HomeQuote content={content.quote} />
      <HomeContact content={content.contact} />
    </main>
  );
}
