import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SectionTitle } from "@/components/typography";
import { servicePath, type Industry, type IndustryId } from "@/lib/industries";
import "@/styles/industry-themes.css";
import styles from "./IndustryOffers.module.css";

/* Each industry sets its service cards differently; the content and link behaviour are the same */
const LAYOUT: Record<IndustryId, keyof typeof styles> = {
  hvac: "mosaic",
  "medical-dental": "clinical",
  golf: "holes",
  retail: "posters",
  "specialty-retail": "tags",
  construction: "sheets",
  travel: "passes",
};

function indexLabel(id: IndustryId, index: number): string {
  const n = index + 1;
  if (id === "golf") return `Hole ${n}`;
  if (id === "construction") return `Sheet A-${String(n).padStart(2, "0")}`;
  if (id === "retail") return `No. ${n}`;
  if (id === "travel") return `Route ${String(n).padStart(2, "0")}`;
  return String(n).padStart(2, "0");
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

type IndustryOffersProps = {
  industry: Industry;
  /** Section heading id, unique on the page. */
  headingId?: string;
  className?: string;
};

/** "What We Offer" on an industry page: one linked card per service subpage. */
export function IndustryOffers({ industry, headingId = "industry-offers", className }: IndustryOffersProps) {
  const layout = LAYOUT[industry.id];
  const { offersIntro, services } = industry;

  return (
    <section
      className={[styles.section, styles[layout], `industry-${industry.id}`, className].filter(Boolean).join(" ")}
      aria-labelledby={headingId}
    >
      <div className="container">
        <div className={styles.head}>
          <p className={styles.label}>{offersIntro.label}</p>
          <SectionTitle id={headingId} className={styles.title}>
            {offersIntro.title}
          </SectionTitle>
          <p className={styles.lead}>{offersIntro.lead}</p>
        </div>
        {layout === "clinical" ? (
          <div className={styles.chartHead} aria-hidden="true">
            <span>Treatment plan</span>
            <span>Your practice</span>
          </div>
        ) : null}
        <ul className={styles.grid} data-count={services.length}>
          {services.map((service, index) => {
            const image = service.card ?? service.hero.image;
            return (
              <Reveal key={service.slug} as="li" delay={index * 80} className={styles.item}>
                <Link href={servicePath(industry, service)} className={styles.card}>
                  <span className={styles.media}>
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      sizes={layout === "passes" ? "(min-width: 960px) 22vw, 40vw" : "(min-width: 960px) 34vw, 100vw"}
                      className={styles.cover}
                      style={image.position ? { objectPosition: image.position } : undefined}
                    />
                  </span>
                  <span className={styles.body}>
                    <span className={styles.index}>{indexLabel(industry.id, index)}</span>
                    <h3 className={styles.name}>{service.title}</h3>
                    <span className={styles.summary}>{service.summary}</span>
                    <span className={styles.more}>
                      Explore the service
                      <ArrowIcon />
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
