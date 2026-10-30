import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionTitle } from "@/components/typography";
import type { IndustryLanding } from "@/lib/industries";
import styles from "./RetailAttention.module.css";

type RetailAttentionProps = {
  label: string;
  landing: IndustryLanding & { moments: NonNullable<IndustryLanding["moments"]> };
};

/*
 * Retail's opening: the copy names three moments where attention is won, so
 * the section shows those three moments as a strip of photographs, under an
 * oversized headline with the key word set in red.
 */
export function RetailAttention({ label, landing }: RetailAttentionProps) {
  const [lead, close] = landing.intro.paragraphs;
  const title = landing.intro.title;
  const keyword = "attention";
  const at = title.toLowerCase().indexOf(keyword);

  return (
    <section className={styles.section} aria-labelledby="ind-intro">
      <div className="container">
        <p className={styles.label}>{label}</p>
        <SectionTitle id="ind-intro" className={styles.title}>
          {at >= 0 ? (
            <>
              {title.slice(0, at)}
              <span className={styles.keyword}>{title.slice(at, at + keyword.length)}</span>
              {title.slice(at + keyword.length)}
            </>
          ) : (
            title
          )}
        </SectionTitle>
        {lead ? <p className={styles.lead}>{lead}</p> : null}

        <ol className={styles.moments}>
          {landing.moments.map((moment, index) => (
            <Reveal key={moment.caption} as="li" delay={index * 110} className={styles.moment}>
              <figure className={styles.frame}>
                <Image
                  src={moment.image.src}
                  alt={moment.image.alt}
                  fill
                  sizes="(min-width: 960px) 30vw, 33vw"
                  className={styles.cover}
                  style={moment.image.position ? { objectPosition: moment.image.position } : undefined}
                />
              </figure>
              <p className={styles.caption}>
                <span className={styles.captionIndex}>{String(index + 1).padStart(2, "0")}</span>
                {moment.caption}
              </p>
            </Reveal>
          ))}
        </ol>

        {close ? <p className={styles.close}>{close}</p> : null}
      </div>
    </section>
  );
}
