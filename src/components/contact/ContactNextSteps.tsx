"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type JSX } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { SectionDescription, SectionTitle } from "@/components/typography";
import styles from "./ContactNextSteps.module.css";

const STEP_GAP_MS = 1500;
const REPLAY_AFTER_MS = 1200;

function InquiryVisual() {
  return (
    <div className={`${styles.visual} ${styles.inquiry}`} aria-hidden="true">
      <span className={styles.toast}>
        <span className={styles.toastDot} />
        <span>
          <b>New inquiry</b>
          <small>“Can we talk about our spring ads?”</small>
        </span>
      </span>
      <span className={styles.drop} />
      <span className={styles.calendar}>
        <span className={styles.calendarHead}>Intro call</span>
        <span className={styles.days}>
          {["M", "T", "W", "T", "F"].map((day, index) => (
            <span key={`${day}-${index}`} className={index === 2 ? styles.dayPicked : styles.day}>
              {day}
            </span>
          ))}
        </span>
        <span className={styles.booked}>
          <span className={styles.bookedTick} />
          Conversation booked
        </span>
      </span>
    </div>
  );
}

const LEFT_CHANNELS = [
  { label: "Search", y: 30, d: "M86 30 C 124 30, 124 90, 160 90" },
  { label: "Social", y: 90, d: "M86 90 L 160 90" },
  { label: "TV", y: 150, d: "M86 150 C 124 150, 124 90, 160 90" },
];

const RIGHT_CHANNELS = [
  { label: "Radio", y: 30, d: "M274 30 C 236 30, 236 90, 200 90" },
  { label: "Outdoor", y: 90, d: "M274 90 L 200 90" },
  { label: "Web", y: 150, d: "M274 150 C 236 150, 236 90, 200 90" },
];

function ChannelVisual() {
  const channels = [...LEFT_CHANNELS.map((c) => ({ ...c, x: 8 })), ...RIGHT_CHANNELS.map((c) => ({ ...c, x: 274 }))];
  return (
    <div className={`${styles.visual} ${styles.channels}`} aria-hidden="true">
      <svg viewBox="0 0 360 180" className={styles.channelMap}>
        {channels.map((channel, index) => (
          <path
            key={channel.label}
            className={styles.route}
            d={channel.d}
            pathLength={1}
            style={{ animationDelay: `${150 + index * 170}ms` }}
          />
        ))}
        {channels.map((channel, index) => (
          <g key={channel.label} className={styles.chip} style={{ animationDelay: `${index * 170}ms` }}>
            <rect x={channel.x} y={channel.y - 15} width="78" height="30" rx="2" />
            <text x={channel.x + 39} y={channel.y + 4.5} textAnchor="middle">
              {channel.label}
            </text>
          </g>
        ))}
        <g className={styles.hub}>
          <circle className={styles.hubRing} cx="180" cy="90" r="38" />
          <circle className={styles.hubCore} cx="180" cy="90" r="29" />
          <text x="180" y="86" textAnchor="middle">
            One
          </text>
          <text x="180" y="101" textAnchor="middle">
            plan
          </text>
        </g>
      </svg>
    </div>
  );
}

const RESULT_BARS = [22, 30, 28, 44, 52, 66, 84];

function LaunchVisual() {
  return (
    <div className={`${styles.visual} ${styles.launch}`} aria-hidden="true">
      <span className={styles.launchHead}>
        Campaign
        <span className={styles.switch}>
          <span className={styles.switchKnob} />
        </span>
        <span className={styles.liveTag}>Live</span>
      </span>
      <span className={styles.bars}>
        {RESULT_BARS.map((height, index) => (
          <span
            key={index}
            className={styles.resultBar}
            style={{ height: `${height}%`, animationDelay: `${650 + index * 110}ms` }}
          />
        ))}
      </span>
      <span className={styles.meter}>
        <span className={styles.meterName}>Reach</span>
        <span className={styles.meterTrack}>
          <span className={`${styles.meterFill} ${styles.meterReach}`} />
        </span>
      </span>
      <span className={styles.meter}>
        <span className={styles.meterName}>Inquiries</span>
        <span className={styles.meterTrack}>
          <span className={`${styles.meterFill} ${styles.meterLeads}`} />
        </span>
      </span>
    </div>
  );
}

type StepContent = {
  title: string;
  body: string;
  Visual: () => JSX.Element;
};

const STEPS: StepContent[] = [
  {
    title: "Let’s talk",
    body: "Call, email or send the form below. We start by learning what you sell, who you sell to, and what has or hasn’t worked so far.",
    Visual: InquiryVisual,
  },
  {
    title: "We build your strategy",
    body: "Search, social, TV, radio, outdoor and your website get planned together, so every channel works toward the same goal and the same budget.",
    Visual: ChannelVisual,
  },
  {
    title: "Let’s make it happen",
    body: "We produce the creative, launch the campaign and report on what it’s doing, so you can see where the results are coming from.",
    Visual: LaunchVisual,
  },
];

const subscribeNever = () => () => {};

/** False in server HTML, so a page without JavaScript shows finished diagrams. */
function useHydrated() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

function Step({ step, index, reached, armed }: { step: StepContent; index: number; reached: boolean; armed: boolean }) {
  const [run, setRun] = useState(0);
  const lastRun = useRef(0);
  const { Visual } = step;
  const state = !armed ? "rest" : reached ? "play" : "armed";

  function replay() {
    if (!armed || !reached) return;
    const now = Date.now();
    if (now - lastRun.current < REPLAY_AFTER_MS) return;
    lastRun.current = now;
    setRun((value) => value + 1);
  }

  return (
    <li className={styles.step} data-reached={reached || !armed} onMouseEnter={replay}>
      <span className={styles.node}>{index + 1}</span>
      <article className={styles.card}>
        <div key={run} className={styles.demo} data-state={state}>
          <Visual />
        </div>
        <div className={styles.copy}>
          <h3 className={styles.title}>{step.title}</h3>
          <p className={styles.body}>{step.body}</p>
        </div>
      </article>
    </li>
  );
}

export function ContactNextSteps() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = usePrefersReducedMotion();
  const hydrated = useHydrated();
  const [reached, setReached] = useState(0);
  const armed = hydrated && !reduced;

  useEffect(() => {
    const node = ref.current;
    if (!node || !armed) return;
    const timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        STEPS.forEach((_, index) => {
          timers.push(window.setTimeout(() => setReached(index + 1), index * STEP_GAP_MS));
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [armed]);

  return (
    <section className={styles.section} aria-labelledby="contact-next-title">
      <div className="container">
        <SectionTitle id="contact-next-title" className={styles.heading}>
          What happens next?
        </SectionTitle>
        <SectionDescription className={styles.lead}>
          Three steps from your first message to a campaign in market.
        </SectionDescription>

        <ol ref={ref} className={styles.steps} data-reached={armed ? reached : STEPS.length}>
          {STEPS.map((step, index) => (
            <Step key={step.title} step={step} index={index} reached={reached > index} armed={armed} />
          ))}
        </ol>
      </div>
    </section>
  );
}
