import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionTitle } from "@/components/typography";
import type { Industry, IndustryImage, IndustryLanding } from "@/lib/industries";
import styles from "./IndustryReasons.module.css";

/*
 * "How we plan" on the newer industry pages. Same content everywhere (four
 * reasons, two photographs); each industry gets its own composition drawn
 * from its theme: a lookbook spread, a shop rail of hang tags, a drawing
 * sheet, a boarding pass.
 */

type ReasonsProps = {
  industry: Industry & { landing: IndustryLanding };
  photos: IndustryImage[];
};

function Head({ industry, dark = false }: { industry: Industry & { landing: IndustryLanding }; dark?: boolean }) {
  return (
    <div className={styles.head}>
      <p className={dark ? `${styles.label} ${styles.labelOnDark}` : styles.label}>How we plan {industry.noun} marketing</p>
      <SectionTitle id="ind-reasons" className={dark ? `${styles.title} ${styles.titleOnDark}` : styles.title}>
        {industry.landing.reasonsTitle}
      </SectionTitle>
    </div>
  );
}

function Photo({ photo, sizes, className }: { photo: IndustryImage | undefined; sizes: string; className: string }) {
  if (!photo) return null;
  return (
    <figure className={className}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        className={styles.cover}
        style={photo.position ? { objectPosition: photo.position } : undefined}
      />
    </figure>
  );
}

/* Retail: cover lines. Each reason is set large like a magazine headline, with its photo tilted onto it. */
function RetailReasons({ industry }: ReasonsProps) {
  return (
    <section className={`${styles.section} ${styles.coverLines}`} aria-labelledby="ind-reasons">
      <div className="container">
        <Head industry={industry} />
        <ol className={styles.lines}>
          {industry.landing.reasons.map((reason, index) => (
            <li key={reason.title} className={styles.line}>
              <span className={styles.lineNumber}>{String(index + 1).padStart(2, "0")}</span>
              <div className={styles.lineCopy}>
                <h3 className={styles.lineName}>{reason.title}</h3>
                <p className={styles.lineBody}>{reason.body}</p>
              </div>
              {reason.image ? (
                <Reveal variant="fade" className={styles.lineShot}>
                  <Photo photo={reason.image} sizes="(min-width: 960px) 18vw, 40vw" className={styles.lineFrame} />
                </Reveal>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* Specialty retail: the reasons hang as price tags from a shop rail, above a framed shop window. */
function SpecialtyReasons({ industry, photos }: ReasonsProps) {
  return (
    <section className={`${styles.section} ${styles.shop}`} aria-labelledby="ind-reasons">
      <div className="container">
        <Head industry={industry} dark />
        <div className={styles.rail} aria-hidden="true" />
        <ul className={styles.tags}>
          {industry.landing.reasons.map((reason, index) => (
            <Reveal key={reason.title} as="li" delay={index * 90} className={styles.tagItem}>
              <div className={styles.tag}>
                <h3 className={styles.tagName}>{reason.title}</h3>
                <p className={styles.tagBody}>{reason.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        <div className={styles.window}>
          {photos.slice(0, 2).map((photo) => (
            <Photo key={photo.src} photo={photo} sizes="(min-width: 960px) 45vw, 50vw" className={styles.windowPane} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* Construction: a drawing sheet. Main view with a dimension line, an inset detail, general notes and a title block. */
function ConstructionReasons({ industry, photos }: ReasonsProps) {
  return (
    <section className={`${styles.section} ${styles.drawing}`} aria-labelledby="ind-reasons">
      <div className="container">
        <Head industry={industry} />
        <div className={styles.sheet}>
          <div className={styles.view}>
            <span className={styles.dimension} aria-hidden="true">
              <span>Your project</span>
            </span>
            <Photo photo={photos[0]} sizes="(min-width: 960px) 55vw, 100vw" className={styles.viewMain} />
            {photos[1] ? (
              <div className={styles.detail}>
                <Photo photo={photos[1]} sizes="(min-width: 960px) 20vw, 40vw" className={styles.detailFrame} />
                <span className={styles.detailLabel} aria-hidden="true">
                  Detail A
                </span>
              </div>
            ) : null}
          </div>
          <div className={styles.notes}>
            <p className={styles.notesHeading}>General notes</p>
            <ol className={styles.noteList}>
              {industry.landing.reasons.map((reason) => (
                <li key={reason.title}>
                  <h3 className={styles.noteName}>{reason.title}</h3>
                  <p className={styles.noteBody}>{reason.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <dl className={styles.titleBlock} aria-hidden="true">
            <div>
              <dt>Project</dt>
              <dd>{industry.name}</dd>
            </div>
            <div>
              <dt>Drawn by</dt>
              <dd>Kosick Communications</dd>
            </div>
            <div>
              <dt>Sheet</dt>
              <dd>Planning notes</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

/* Travel: a boarding pass. The photo sits in the stub; each reason fills a field on the pass. */
const PASS_FIELDS = ["Who", "From", "Route", "When"];

function TravelReasons({ industry, photos }: ReasonsProps) {
  return (
    <section className={`${styles.section} ${styles.travel}`} aria-labelledby="ind-reasons">
      <div className="container">
        <Head industry={industry} dark />
        <div className={styles.passWrap}>
          <Photo photo={photos[1]} sizes="(min-width: 960px) 22vw, 40vw" className={styles.postcard} />
          <div className={styles.pass}>
            <div className={styles.stub}>
              <Photo photo={photos[0]} sizes="(min-width: 960px) 30vw, 100vw" className={styles.stubPhoto} />
            </div>
            <div className={styles.passMain}>
              <p className={styles.passHeader} aria-hidden="true">
                <span>Kosick Communications</span>
                <span>{industry.name} program</span>
              </p>
              <ul className={styles.fields}>
                {industry.landing.reasons.map((reason, index) => (
                  <li key={reason.title} className={styles.field}>
                    <span className={styles.fieldLabel}>{PASS_FIELDS[index] ?? ""}</span>
                    <h3 className={styles.fieldName}>{reason.title}</h3>
                    <p className={styles.fieldBody}>{reason.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function IndustryReasons(props: ReasonsProps) {
  switch (props.industry.id) {
    case "retail":
      return <RetailReasons {...props} />;
    case "specialty-retail":
      return <SpecialtyReasons {...props} />;
    case "construction":
      return <ConstructionReasons {...props} />;
    case "travel":
      return <TravelReasons {...props} />;
    default:
      return null;
  }
}
