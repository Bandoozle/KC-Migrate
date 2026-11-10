"use client";

import { JourneyFrame, Photo, on, show } from "./JourneyFrame";
import { Icon, MapBase, MapPin, SearchBar, YouDot } from "./LocalMap";
import kit from "./kit.module.css";
import p from "./places.module.css";
import s from "./AestheticsJourney.module.css";

const U = "/wp-content/uploads";
const BACKDROP = `${U}/2026/02/medical-skincare-marketing.jpg`;
const POST = "/images/industries/medical-aesthetics/lip-treatment.jpg";
const CLINIC = `${U}/2026/02/aesthetic-clinic-marketing.jpg`;

const DAYS = [
  { day: "Wed", note: "" },
  { day: "Thu", note: "", selected: true },
  { day: "Fri", note: "" },
  { day: "Sat", note: "" },
];
const SLOTS = [
  { time: "11:00", taken: true },
  { time: "1:30" },
  { time: "3:00", taken: true },
  { time: "4:30", selected: true },
];

/** A post in the feed, the clinic on the map, a consultation booked at the clinic. */
export function AestheticsJourney() {
  return (
    <JourneyFrame
      industry="medical-aesthetics"
      title="Trust comes before the consultation."
      lead="Clients take their time with aesthetic treatments. We keep your clinic in view, answer their questions, and make the first consultation easy to book."
      summary="Illustration: a client sees your clinic's post, looks the clinic up nearby, and books a skin consultation for Thursday at 4:30 at your clinic."
      side="right"
      story="tabs"
      steps={[
        { label: "See", body: "Social content and video introduce your clinic and your treatments." },
        { label: "Trust", body: "Search, reviews and clear treatment pages show who they'll see and what to expect." },
        { label: "Consult", body: "Online booking turns that confidence into a consultation at your clinic." },
      ]}
    >
      {(stage) => (
        <div className={s.scene}>
          {/* 1. The post, as a feed shows it */}
          <div className={kit.layer} {...show(stage, 0)}>
            <Photo src={BACKDROP} position="50% 30%" className={s.backdrop} />
            <span className={s.post}>
              <span className={s.postHead}>
                <span className={s.avatar}>YC</span>
                <span>
                  <b>yourclinic</b>
                  <small>Sponsored</small>
                </span>
              </span>
              <span className={s.media}>
                <Photo src={POST} position="50% 50%" />
              </span>
              <span className={s.postCta}>
                Book a consultation
                <span aria-hidden="true">›</span>
              </span>
              <span className={s.caption}>
                <b>yourclinic</b> Skin treatments, explained by the people who do them.
              </span>
            </span>
          </div>

          {/* 2–3. The clinic on the map, then the booking */}
          <div className={kit.layer} {...show(stage, 1, 2)}>
            <svg className={p.map} viewBox="0 0 440 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <MapBase kind="suburb" />
              <MapPin x={110} y={130} tone="other" />
              <MapPin x={400} y={240} tone="other" />
              <YouDot x={60} y={180} />
              <MapPin x={300} y={150} label="Your Clinic" />
            </svg>
            <SearchBar query="skin clinic near me" />
            <span className={p.place}>
              <span className={p.thumb}>
                <Photo src={CLINIC} position="50% 42%" />
              </span>
              <span className={p.info}>
                <b>Your Clinic</b>
                <small>Medical aesthetics · Skin consultations</small>
                <small>
                  <span className={p.open}>Open</span> · Consultations by appointment
                </small>
              </span>
              <span className={p.actions}>
                <span className={p.action} data-active={stage === 2}>
                  <Icon name="book" />
                  Book consultation
                </span>
                <span className={p.action}>
                  <Icon name="directions" />
                  Directions
                </span>
              </span>
            </span>

            <span className={p.sheet} {...on(stage, 2)}>
              <span className={p.handle} />
              <span className={p.sheetHead}>
                <b>Skin consultation</b>
                <small>30 min · At your clinic</small>
              </span>
              <span className={p.days}>
                {DAYS.map((d) => (
                  <span key={d.day} data-selected={Boolean(d.selected)}>
                    {d.day}
                  </span>
                ))}
              </span>
              <span className={p.slots}>
                {SLOTS.map((slot) => (
                  <span key={slot.time} data-selected={Boolean(slot.selected)} data-taken={Boolean(slot.taken)}>
                    {slot.time}
                  </span>
                ))}
              </span>
              <span className={p.cta} data-done="true">
                <Icon name="check" />
                Consultation booked · Thu 4:30 PM
              </span>
            </span>
          </div>
          <span className={p.note}>Illustrative</span>
        </div>
      )}
    </JourneyFrame>
  );
}
