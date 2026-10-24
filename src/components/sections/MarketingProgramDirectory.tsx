import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { InternalPageHero } from "@/components/sections/InternalPageHero";
import { PageCta } from "@/components/sections/PageCta";
import { serviceHeroActions, INDUSTRY_SERVICE_HEROES } from "@/lib/content/industry-heroes";
import {
  BodyText,
  CardTitle,
  Eyebrow,
  SectionDescription,
  SectionTitle,
} from "@/components/typography";
import {
  MARKETING_PROGRAM_GROUPS,
  MARKETING_PROGRAMS_CTA,
  MARKETING_PROGRAMS_HERO_VISUALS,
  MARKETING_PROGRAMS_INTRO,
  MARKETING_PROGRAMS_WHY,
} from "@/lib/content/marketing-program-directory";
import styles from "./MarketingProgramDirectory.module.css";

export function MarketingProgramDirectory() {
  const heroImage = MARKETING_PROGRAMS_HERO_VISUALS[0];
  const actions = serviceHeroActions();

  return (
    <>
      <InternalPageHero
        eyebrow={INDUSTRY_SERVICE_HEROES.programs.eyebrow}
        titlePrimary="Marketing"
        titleSecondary="Programs"
        description={MARKETING_PROGRAMS_INTRO.description}
        backgroundImage={heroImage.src}
        primaryCTA={{ label: MARKETING_PROGRAMS_INTRO.cta.label, href: MARKETING_PROGRAMS_INTRO.cta.href }}
        secondaryCTA={actions.secondaryCta}
      />

      {MARKETING_PROGRAM_GROUPS.map((group) => (
        <section
          key={group.id}
          className={[
            "section",
            styles.group,
            group.id === "digital" ? styles.groupAlt : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-labelledby={group.id}
        >
          <div className="container">
            <Reveal variant="fadeUp" className={styles.groupIntro}>
              <SectionTitle id={group.id} as="h2" className={styles.groupTitle}>
                {group.title}
              </SectionTitle>
              <SectionDescription className={styles.groupLead}>{group.lead}</SectionDescription>
            </Reveal>
            <ul className={styles.grid}>
              {group.programs.map((program, index) => (
                <Reveal
                  key={program.href}
                  as="li"
                  variant="fadeUp"
                  delay={Math.min(index, 7) * 90}
                  className={styles.cardWrap}
                >
                  <Link href={program.href} className={styles.card}>
                    <span className={styles.media}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={program.image.src}
                        alt={program.image.alt}
                        style={
                          program.image.position
                            ? { objectPosition: program.image.position }
                            : undefined
                        }
                      />
                    </span>
                    <span className={styles.cardBody}>
                      <Eyebrow className={styles.cardEyebrow}>{group.eyebrow}</Eyebrow>
                      <CardTitle as="h3" className={styles.cardTitle}>
                        {program.title}
                      </CardTitle>
                      <BodyText className={styles.cardText}>{program.description}</BodyText>
                      <span className={styles.explore}>
                        Explore program
                        <span className={styles.arrow} aria-hidden="true">
                          →
                        </span>
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className={`section ${styles.why}`}>
        <div className="container">
          <Reveal variant="fadeUp">
            <SectionTitle as="h2" className={styles.whyTitle}>
              {MARKETING_PROGRAMS_WHY.title}
            </SectionTitle>
          </Reveal>
          <ul className={styles.points}>
            {MARKETING_PROGRAMS_WHY.points.map((point, index) => (
              <Reveal
                key={point.title}
                as="li"
                variant="fadeUp"
                delay={Math.min(index, 7) * 90}
                className={styles.point}
              >
                <span className={styles.pointIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <CardTitle as="h3" className={styles.pointTitle}>
                  {point.title}
                </CardTitle>
                <BodyText className={styles.pointBody}>{point.body}</BodyText>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <PageCta className={styles.cta} cta={MARKETING_PROGRAMS_CTA} />
    </>
  );
}
