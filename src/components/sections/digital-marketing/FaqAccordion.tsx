"use client";

import { Fragment, useState } from "react";
import { Eyebrow, SectionTitle } from "@/components/typography";
import type { FaqItem } from "@/lib/wordpress/digital-marketing";
import styles from "./FaqAccordion.module.css";

type FaqAccordionProps = {
  eyebrow: string;
  title: string;
  items: FaqItem[];
};

/** One FAQ heading across the site: "Frequently Asked Questions" and "Golf marketing questions" both read this way. */
function faqHeading(title: string): string {
  return /^(frequently asked questions|[\w\s&]+ questions)$/i.test(title.trim()) ? "Frequently asked questions" : title;
}

/** The answer as plain text, with only the phrases the source underlined wrapped in <u>. */
function answerWithUnderline(answer: string, underline: string[] | undefined) {
  if (!underline?.length) return answer;
  const parts: Array<{ text: string; underlined: boolean }> = [{ text: answer, underlined: false }];
  for (const phrase of underline) {
    const at = parts.findIndex((part) => !part.underlined && part.text.includes(phrase));
    if (at < 0) continue;
    const [before, ...rest] = parts[at].text.split(phrase);
    parts.splice(
      at,
      1,
      { text: before, underlined: false },
      { text: phrase, underlined: true },
      { text: rest.join(phrase), underlined: false },
    );
  }
  return parts.map((part, index) =>
    part.underlined ? <u key={index}>{part.text}</u> : <Fragment key={index}>{part.text}</Fragment>,
  );
}

export function FaqAccordion({ eyebrow, title, items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.intro}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <SectionTitle as="h2">{faqHeading(title)}</SectionTitle>
        </div>

        <div className={styles.list}>
          {items.map((item, index) => {
            const open = openIndex === index;
            return (
              <div className={styles.item} key={item.question}>
                <button
                  type="button"
                  className={styles.trigger}
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  <span>{item.question}</span>
                  <span className={styles.icon} aria-hidden="true">
                    {open ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`${styles.panelWrap} ${open ? styles.panelWrapOpen : ""}`}
                  aria-hidden={!open}
                >
                  <div className={styles.panel}>{answerWithUnderline(item.answer, item.underline)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
