import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "@/components/typography";
import { InternalPageHero } from "@/components/sections/InternalPageHero";
import { serviceHeroActions } from "@/lib/content/industry-heroes";
import type { ResourceGuideContent, ResourceGuideSection } from "@/lib/wordpress/resource-guide-types";
import styles from "./ResourceGuidePageView.module.css";

type ResourceGuidePageViewProps = {
  content: ResourceGuideContent;
};

type FormatKind = "super" | "horizontal" | "digital" | "transit";

function formatKind(title: string): FormatKind {
  const value = title.toLowerCase();
  if (value.includes("super")) return "super";
  if (value.includes("digital")) return "digital";
  if (value.includes("transit") || value.includes("shelter") || /\btsa\b/.test(value)) return "transit";
  return "horizontal";
}

function anchorId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function specValue(spec?: string): string | null {
  if (!spec) return null;
  const [, ...rest] = spec.split(":");
  const value = rest.join(":").trim();
  return value || spec;
}

/* Short card copy, condensed from each format's WordPress description */
const SUMMARY: Record<FormatKind, string> = {
  super: "Large-format placements built for major highways and long-distance visibility.",
  horizontal: "A versatile billboard format for high-traffic urban and roadside placements.",
  digital: "Digital placements that rotate creative throughout the day and allow campaigns to change quickly.",
  transit: "Street-level placements that reach pedestrians, commuters and local neighbourhood traffic.",
};

const INTRO =
  "Billboard dimensions in Canada vary by format. The right choice depends on placement, audience and campaign goals.";

/* "Superboards (Large Format Billboards)" reads as "Superboards" on the card */
function shortName(title: string): string {
  return title.replace(/\s*\([^)]*\)\s*$/, "").trim() || title;
}

function FormatCard({ section }: { section: ResourceGuideSection }) {
  const dimension = specValue(section.spec);
  const kind = formatKind(section.title);
  const name = shortName(section.title);

  return (
    <article id={anchorId(section.title)} className={styles.card}>
      {section.image?.src ? (
        <div className={styles.figure}>
          <Image
            src={section.image.src}
            alt={section.image.alt || section.title}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className={kind === "transit" ? styles.transitPhoto : styles.photo}
          />
        </div>
      ) : null}
      <div className={styles.panel}>
        {dimension ? (
          <p className={styles.dimension}>
            <span className={styles.sizeLabel}>Size</span>
            {dimension}
          </p>
        ) : null}
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.body}>{SUMMARY[kind]}</p>
        {section.cta ? (
          <Link href={section.cta.href} className={styles.textLink} aria-label={`Learn more about ${name}`}>
            Learn more
            <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export function ResourceGuidePageView({ content }: ResourceGuidePageViewProps) {
  const actions = serviceHeroActions();
  const cleaned = content.hero.title.replace(/Billlboard/g, "Billboard").trim();
  const [beforeColon, ...afterColon] = cleaned.split(":");
  const colonSecondary = afterColon.join(":").trim();
  const words = (colonSecondary ? beforeColon : cleaned).trim().split(/\s+/).filter(Boolean);
  const mid = words.length <= 4 ? 1 : Math.ceil(words.length / 2);
  const titlePrimary = (colonSecondary ? beforeColon : words.slice(0, mid).join(" ")).trim() || cleaned;
  const titleSecondary = colonSecondary || (words.length > 1 ? words.slice(mid).join(" ") : undefined);
  const intro = content.intro?.body ? INTRO : "";

  return (
    <main>
      <InternalPageHero
        eyebrow="Outdoor Advertising"
        titlePrimary={titlePrimary}
        titleSecondary={titleSecondary}
        description={content.hero.subtitle || undefined}
        slides={content.hero.slides}
        primaryCTA={actions.cta}
        secondaryCTA={actions.secondaryCta}
      />

      <section className={`section ${styles.page}`}>
        <div className="container">
          {intro ? (
            <div className={styles.intro}>
              <SectionTitle as="h2" className={styles.introTitle}>
                Billboard dimensions in Canada
              </SectionTitle>
              <p className={styles.lead}>{intro}</p>
              {content.intro?.cta ? (
                <Link href={content.intro.cta.href} className={styles.button}>
                  {content.intro.cta.label}
                </Link>
              ) : null}
            </div>
          ) : null}

          {content.sections.length > 0 ? (
            <div className={styles.grid}>
              {content.sections.map((section) => (
                <FormatCard key={section.title} section={section} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
