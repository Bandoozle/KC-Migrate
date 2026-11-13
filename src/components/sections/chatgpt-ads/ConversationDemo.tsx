"use client";

import { useId } from "react";
import { handleArrowKeys, useStepper } from "@/components/sections/business-development/bd-motion";
import { CONVERSATION } from "@/content/chatgpt-ads-page";
import styles from "./ConversationDemo.module.css";

const STEPS = ["Question", "Answer", "Sponsored placement", "Website visit"] as const;

/**
 * A fictional conversation with a generic AI assistant: the question, the answer, a
 * clearly labelled sponsored placement below it, then the advertiser's page. Not a
 * reproduction of any product's interface. The mock is decorative; the summary and
 * step buttons carry the meaning.
 */
export function ConversationDemo() {
  const baseId = useId();
  const { ref, index: step, select } = useStepper<HTMLDivElement>(STEPS.length, { interval: 2800, loop: true, threshold: 0.3 });

  return (
    <div ref={ref} className={styles.demo} data-step={step}>
      <p className={styles.srOnly}>
        Illustration: someone asks an AI assistant “{CONVERSATION.question}”. The assistant answers, a sponsored placement
        for {CONVERSATION.sponsor.name} appears below the answer, labelled as sponsored, and the person visits the website to{" "}
        {CONVERSATION.sponsor.action.toLowerCase()}.
      </p>

      <div className={styles.window} aria-hidden="true">
        <div className={styles.windowBar}>
          <span className={styles.assistantMark} />
          <span className={styles.windowTitle}>AI assistant</span>
        </div>

        <div className={styles.thread}>
          <div className={styles.question}>{CONVERSATION.question}</div>

          <div className={styles.answer}>
            {CONVERSATION.answer.map((line, index) => (
              <span key={line} className={styles.answerLine} style={{ transitionDelay: `${index * 120}ms` }}>
                {line}
              </span>
            ))}
          </div>

          <div className={styles.sponsored}>
            <span className={styles.sponsoredLabel}>Sponsored</span>
            <span className={styles.sponsorName}>
              <span className={styles.sponsorMark}>{CONVERSATION.sponsor.name.charAt(0)}</span>
              {CONVERSATION.sponsor.name}
            </span>
            <span className={styles.sponsorLine}>{CONVERSATION.sponsor.line}</span>
            <span className={styles.sponsorAction}>{CONVERSATION.sponsor.action}</span>
          </div>
        </div>

        <div className={styles.composer}>
          <span>Ask a follow-up</span>
        </div>
      </div>

      <div className={styles.site} aria-hidden="true">
        <span className={styles.siteUrl}>{CONVERSATION.sponsor.domain}</span>
        <span className={styles.siteTitle}>{CONVERSATION.page.title}</span>
        <span className={styles.siteLine} />
        <span className={`${styles.siteLine} ${styles.short}`} />
        <span className={styles.siteDone}>✓ {CONVERSATION.page.result}</span>
      </div>

      <ol className={styles.steps} aria-label="Steps in the illustration">
        {STEPS.map((name, index) => (
          <li key={name}>
            <button
              id={`${baseId}-step-${index}`}
              type="button"
              className={styles.step}
              aria-current={index === step ? "step" : undefined}
              onClick={() => select(index)}
              onKeyDown={(event) => handleArrowKeys(event, index, STEPS.length, select, (next) => `${baseId}-step-${next}`)}
            >
              {name}
            </button>
          </li>
        ))}
      </ol>
      <p className={styles.caption}>
        Illustration with a fictional business. A sponsored placement sits below the answer and does not change it.
      </p>
    </div>
  );
}
