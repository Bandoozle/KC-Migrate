"use client";

import { JourneyFrame, Photo, on, show } from "./JourneyFrame";
import { Icon, MapBase, MapPin, Route, SearchBar, YouDot } from "./LocalMap";
import kit from "./kit.module.css";
import p from "./places.module.css";
import s from "./DentalJourney.module.css";

// The page hero already shows the Sparkle reception (Dental-Vancouver.jpg), so the illustration uses other practice photos
const RECEPTION = "/images/industries/dental/reception-check-in.jpg";
const VISIT = "/images/industries/dental/front-desk.jpg";

const DAYS = [
  { day: "Mon", note: "Today" },
  { day: "Tue", note: "Tomorrow", selected: true },
  { day: "Wed", note: "" },
  { day: "Thu", note: "" },
];
const SLOTS = [
  { time: "8:30", taken: true },
  { time: "9:00" },
  { time: "10:30", selected: true },
  { time: "11:15", taken: true },
  { time: "1:15" },
  { time: "2:00", taken: true },
  { time: "3:45" },
  { time: "4:30" },
];

/** Search nearby, book a new patient exam, walk into the clinic. */
export function DentalJourney() {
  return (
    <JourneyFrame
      industry="dental"
      title="How a new patient chooses your practice."
      lead="Patients search nearby, book online and walk in for their first visit. We build every stage of that path, from the map to the chair."
      summary="Illustration: a prospective patient searches for a dentist nearby, finds your clinic on the map, books a new patient exam for Tuesday at 10:30 and checks in at reception."
      side="left"
      story="list"
      steps={[
        { label: "Search", body: "Local SEO and Google Ads put your practice in front of patients searching nearby." },
        { label: "Book", body: "Clear times and online booking turn that search into a new patient exam." },
        { label: "Visit", body: "They arrive for the appointment, and a new patient is on your books." },
      ]}
    >
      {(stage) => (
        <div className={s.scene}>
          <div className={kit.layer} {...show(stage, 0, 1)}>
            <svg className={p.map} viewBox="0 0 440 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <MapBase kind="city" />
              <MapPin x={204} y={150} tone="other" />
              <MapPin x={392} y={180} tone="other" />
              <YouDot x={70} y={183} />
              <MapPin x={300} y={110} label="Your Dental Clinic" />
            </svg>
            <SearchBar query="dentist near me" />
            <span className={p.chips}>
              <span>Open now</span>
              <span>New patients</span>
            </span>
            <span className={p.place}>
              <span className={p.thumb}>
                <Photo src={RECEPTION} position="50% 60%" />
              </span>
              <span className={p.info}>
                <b>Your Dental Clinic</b>
                <small>Family &amp; cosmetic dentistry</small>
                <small>
                  <span className={p.open}>Open</span> · Accepting new patients
                </small>
              </span>
              <span className={p.actions}>
                <span className={p.action} data-active={stage === 1}>
                  <Icon name="book" />
                  Book
                </span>
                <span className={p.action}>
                  <Icon name="call" />
                  Call
                </span>
                <span className={p.action}>
                  <Icon name="directions" />
                  Directions
                </span>
              </span>
            </span>

            <span className={p.sheet} {...on(stage, 1)}>
              <span className={p.handle} />
              <span className={p.sheetHead}>
                <b>New patient exam</b>
                <small>60 min · Exam &amp; cleaning</small>
              </span>
              <span className={p.days}>
                {DAYS.map((d) => (
                  <span key={d.day} data-selected={Boolean(d.selected)}>
                    {d.day}
                    {d.note ? <small>{d.note}</small> : null}
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
              <span className={p.cta}>Book Tuesday, 10:30 AM</span>
            </span>
          </div>

          <div className={kit.layer} {...show(stage, 2)}>
            <Photo src={VISIT} position="50% 45%" />
            <span className={p.trip}>
              <svg viewBox="0 0 132 70" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <rect width="132" height="70" fill="#eef0ea" />
                <g fill="#e2e2da">
                  <rect x="4" y="6" width="34" height="36" rx="2" />
                  <rect x="48" y="6" width="34" height="36" rx="2" />
                  <rect x="4" y="56" width="34" height="14" rx="2" />
                  <rect x="92" y="56" width="36" height="14" rx="2" />
                </g>
                <path d="M0 50 H 132 M 88 0 V 70" stroke="#ffffff" strokeWidth="6" />
                <Route d="M10 50 H 88 V 40" on={stage === 2} />
                <circle cx="10" cy="50" r="3.5" fill="#1a73e8" stroke="#ffffff" strokeWidth="1.5" />
                <MapPin x={88} y={40} />
              </svg>
              <span>
                Arrived <small>· 8 min drive</small>
              </span>
            </span>
            <span className={p.confirm}>
              <span className={p.tick}>
                <Icon name="check" />
              </span>
              <b>Checked in · New patient exam</b>
              <small>Tuesday, 10:30 AM · Your Dental Clinic</small>
            </span>
          </div>
          <span className={p.note}>Illustrative</span>
        </div>
      )}
    </JourneyFrame>
  );
}
