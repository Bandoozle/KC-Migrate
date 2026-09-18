"use client";

import { useState } from "react";
import { Eyebrow, SectionTitle } from "@/components/typography";
import type { FaqItem } from "@/lib/wordpress/digital-marketing";
import styles from "./FaqAccordion.module.css";

type FaqAccordionProps = {
  eyebrow: string;
  title: string;
  items: FaqItem[];
};

export function FaqAccordion({ eyebrow, title, items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.intro}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <SectionTitle as="h2">{title}</SectionTitle>
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
                {open ? <div className={styles.panel}>{item.answer}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
