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

function sentences(body: string): string[] {
  return body
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function specValue(spec?: string): string | null {
  if (!spec) return null;
  const [, ...rest] = spec.split(":");
  const value = rest.join(":").trim();
  return value || spec;
}

function introParagraph(parts: string[]): string {
  const first = parts[0] || "";
  const markets = parts.find((part) => part.includes("Vancouver")) || "";
  const closer = parts.find((part) => /breakdown/i.test(part)) || "";
  return [first, markets, closer].filter((part, index, all) => part && all.indexOf(part) === index).join(" ");
}

const NOTE_MATCHERS: Record<FormatKind, RegExp> = {
  super: /highway|large-format|high-speed/i,
  horizontal: /commuter|expressway/i,
  digital: /viewing distance|creative space|placement strategy/i,
  transit: /neighborhood|neighbourhood|regional exposure/i,
};

function noteFor(title: string, parts: string[], intro: string): string {
  return (
    parts.find((part) => !intro.includes(part) && NOTE_MATCHERS[formatKind(title)].test(part)) || ""
  );
}

function FormatCard({
  section,
  note,
}: {
  section: ResourceGuideSection;
  note: string;
}) {
  const dimension = specValue(section.spec);
  const description = [section.body, note].filter(Boolean).join(" ");

  return (
    <article id={anchorId(section.title)} className={styles.card}>
      {section.image?.src ? (
        <div className={styles.figure}>
          <Image
            src={section.image.src}
            alt={section.image.alt || section.title}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className={formatKind(section.title) === "transit" ? styles.transitPhoto : styles.photo}
          />
        </div>
      ) : null}
      <div className={styles.panel}>
        {dimension ? <p className={styles.dimension}>{dimension}</p> : null}
        <h3 className={styles.name}>{section.title}</h3>
        <p className={styles.body}>{description}</p>
        {section.cta ? (
          <Link
            href={section.cta.href}
            className={styles.button}
            aria-label={`${section.cta.label} about ${section.title}`}
          >
            {section.cta.label}
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
  const introSentences = content.intro?.body ? sentences(content.intro.body) : [];
  const intro = introParagraph(introSentences);

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
                <FormatCard
                  key={section.title}
                  section={section}
                  note={noteFor(section.title, introSentences, intro)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
