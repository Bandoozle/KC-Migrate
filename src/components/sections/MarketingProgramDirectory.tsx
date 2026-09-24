import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { PageCta } from "@/components/sections/PageCta";
import {
  BodyText,
  CardTitle,
  Eyebrow,
  PageTitle,
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
  const [heroMain, ...heroSides] = MARKETING_PROGRAMS_HERO_VISUALS;

  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <Reveal variant="fadeUp" className={styles.heroCopy}>
            <Eyebrow>{MARKETING_PROGRAMS_INTRO.eyebrow}</Eyebrow>
            <PageTitle className={styles.heroTitle}>{MARKETING_PROGRAMS_INTRO.title}</PageTitle>
            <SectionDescription className={styles.heroLead}>
              {MARKETING_PROGRAMS_INTRO.description}
            </SectionDescription>
            <Link href={MARKETING_PROGRAMS_INTRO.cta.href} className={styles.heroCta}>
              {MARKETING_PROGRAMS_INTRO.cta.label}
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </Reveal>
          <Reveal variant="fade" delay={80} className={styles.collage}>
            <span className={styles.collageMain}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroMain.src} alt={heroMain.alt} />
            </span>
            {heroSides.map((visual) => (
              <span key={visual.src} className={styles.collageSide}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={visual.src} alt={visual.alt} />
              </span>
            ))}
          </Reveal>
        </div>
      </section>

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
