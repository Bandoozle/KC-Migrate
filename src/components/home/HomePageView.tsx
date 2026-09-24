import type { HomePageContent } from "@/lib/wordpress/home";
import { Reveal } from "@/components/motion/Reveal";
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
      <Reveal variant="fadeUp">
        <HomeIntro content={content.whatWeDoIntro} />
      </Reveal>
      <Reveal variant="fadeUp">
        <HomeBento items={content.bento} />
      </Reveal>
      <SectionSeparator />
      <Reveal variant="fadeUp">
        <HomeSolutions content={content.solutions} />
      </Reveal>
      <SectionSeparator />
      <Reveal variant="fadeUp">
        <HomeBrandTabs preceding={content.brandTabsPreceding} tabs={content.brandTabs} />
      </Reveal>
      <SectionSeparator tight />
      <Reveal variant="fadeUp">
        <HomeTestimonials content={content.testimonials} />
      </Reveal>
      <SectionSeparator />
      <Reveal variant="fadeUp">
        <HomeWhyChoose content={content.whyChoose} />
      </Reveal>
      <Reveal variant="fade">
        <HomeQuote content={content.quote} />
      </Reveal>
      <Reveal variant="fadeUp">
        <HomeContact content={content.contact} />
      </Reveal>
    </main>
  );
}
