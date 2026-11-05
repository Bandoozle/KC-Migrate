"use client";

import { JourneyFrame, Photo } from "./JourneyFrame";
import kit from "./kit.module.css";
import s from "./AestheticsJourney.module.css";

const U = "/wp-content/uploads";
const REASSURANCE = ["What to expect", "Who it's for", "Meet your provider"];

function position(stage: number, index: number) {
  return index < stage ? "past" : index === stage ? "front" : "next";
}

/** A deck of clinic work dealt forward: the social post, the treatment page, the consultation. */
export function AestheticsJourney() {
  return (
    <JourneyFrame
      industry="medical-aesthetics"
      title="Trust comes before the consultation."
      lead="Clients take their time with aesthetic treatments. We keep your clinic in view and answer their questions until they're ready to book."
      summary="A client sees your clinic on social media, learns about the treatment and your team, and requests a consultation."
      side="right"
      story="tabs"
      steps={[
        { label: "See", body: "Social content and video introduce your clinic and your treatments." },
        { label: "Trust", body: "Clear treatment pages and calm branding explain what to expect and who they'll see." },
        { label: "Consult", body: "A simple form turns that confidence into a consultation request." },
      ]}
    >
      {(stage) => (
        <div className={s.deck}>
          <div className={s.backdrop}>
            <Photo src={`${U}/2026/02/medical-skincare-marketing.jpg`} position="50% 30%" />
          </div>

          <div className={`${kit.card} ${s.card}`} data-pos={position(stage, 0)}>
            <span className={s.postHead}>
              <span className={s.avatar} />
              Your clinic
            </span>
            <span className={s.media}>
              <Photo src={`${U}/2023/09/medical-aesthetics.png`} position="50% 50%" />
            </span>
            <span className={s.postFoot}>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M12 20s-7.5-4.6-9.2-9.1C1.7 7.6 4 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.8 1.1-1.7 2.7-2.8 4.7-2.8 3.3 0 5.6 3.1 4.5 6.4C19.5 15.4 12 20 12 20Z"
                />
              </svg>
              Skin treatments, explained
            </span>
          </div>

          <div className={`${kit.card} ${s.card}`} data-pos={position(stage, 1)}>
            <span className={s.media}>
              <Photo src={`${U}/2026/02/aesthetic-clinic-marketing.jpg`} position="50% 42%" />
            </span>
            <b className={s.cardTitle}>Treatment guide</b>
            <ul className={s.list}>
              {REASSURANCE.map((item) => (
                <li key={item}>
                  <span className={kit.tick} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={`${kit.card} ${s.card}`} data-pos={position(stage, 2)}>
            <b className={s.cardTitle}>Book a consultation</b>
            <span className={s.field}>Treatment of interest</span>
            <span className={s.field}>Preferred day</span>
            <span className={s.field}>Your email</span>
            <span className={s.submit}>
              <span className={kit.tick} />
              Consultation requested
            </span>
          </div>
        </div>
      )}
    </JourneyFrame>
  );
}
