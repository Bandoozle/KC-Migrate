"use client";

import { JourneyFrame, Photo, on, show } from "./JourneyFrame";
import { Icon, MapBase, MapPin, Route, SearchBar, YouDot } from "./LocalMap";
import kit from "./kit.module.css";
import p from "./places.module.css";
import s from "./GolfJourney.module.css";

const U = "/wp-content/uploads";
const COURSE = `${U}/2026/06/golf-course-branding-marketing.jpg`;
const FAIRWAY = `${U}/2026/06/golf-social-media-marketing.jpg`;

const DAYS = [
  { day: "Fri", note: "Today" },
  { day: "Sat", note: "Tomorrow", selected: true },
  { day: "Sun", note: "" },
  { day: "Mon", note: "" },
];
const SLOTS = [
  { time: "7:20", taken: true },
  { time: "7:30", taken: true },
  { time: "7:40", selected: true },
  { time: "7:50" },
  { time: "8:00" },
  { time: "8:10", taken: true },
  { time: "8:20" },
  { time: "8:30" },
];

/** Search the map, book a tee time, arrive at the first tee: a round that starts on a phone. */
export function GolfJourney() {
  return (
    <JourneyFrame
      industry="golf"
      title="Every tee time starts long before the first tee."
      lead="Golfers search, compare and book in minutes. We put your course on the map, make the tee sheet easy to book and bring them out to play."
      summary="Illustration: a golfer searches for golf courses nearby, finds your course on the map, books a Saturday tee time and checks in at the clubhouse."
      side="left"
      story="list"
      steps={[
        { label: "Search", body: "Search, social and broadcast put your course in front of golfers looking for a round nearby." },
        { label: "Book", body: "Online tee times on a fast website turn that interest into a booked round." },
        { label: "Play", body: "They drive out for their tee time, and the round is on your sheet." },
      ]}
    >
      {(stage) => (
        <div className={s.scene}>
          <div className={kit.layer} {...show(stage, 0, 1)}>
            <svg className={p.map} viewBox="0 0 440 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <MapBase kind="golf" />
              <MapPin x={64} y={126} tone="other" />
              <MapPin x={100} y={178} tone="other" />
              <YouDot x={30} y={206} />
              <MapPin x={176} y={196} label="Your Golf Club" />
            </svg>
            <SearchBar query="golf courses near me" />
            <span className={p.chips}>
              <span>Open now</span>
              <span>Public</span>
              <span>Tee times</span>
            </span>
            <span className={p.place}>
              <span className={p.thumb}>
                <Photo src={FAIRWAY} position="50% 55%" />
              </span>
              <span className={p.info}>
                <b>Your Golf Club</b>
                <small>Public course · 18 holes</small>
                <small>
                  <span className={p.open}>Open</span> · First tee 6:30 AM
                </small>
              </span>
              <span className={p.actions}>
                <span className={p.action} data-active={stage === 1}>
                  <Icon name="book" />
                  Tee times
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
                <b>Tee times</b>
                <small>2 players · 18 holes</small>
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
              <span className={p.cta}>Book 7:40 · 2 players</span>
            </span>
          </div>

          <div className={kit.layer} {...show(stage, 2)}>
            <Photo src={COURSE} position="50% 30%" />
            <span className={p.trip}>
              <svg viewBox="0 0 132 70" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <rect width="132" height="70" fill="#eef0e8" />
                <path d="M60 0 C 100 0, 132 10, 132 20 V 70 H 50 C 40 50, 40 20, 60 0 Z" fill="#cfe2bd" />
                <path d="M0 40 H 40 C 50 40, 54 46, 58 54" fill="none" stroke="#ffffff" strokeWidth="5" />
                <Route d="M10 40 H 40 C 50 40, 54 46, 60 52" on={stage === 2} />
                <circle cx="10" cy="40" r="3.5" fill="#1a73e8" stroke="#ffffff" strokeWidth="1.5" />
                <MapPin x={62} y={56} />
              </svg>
              <span>
                Arrived <small>· 14 min drive</small>
              </span>
            </span>
            <span className={p.confirm}>
              <span className={p.tick}>
                <Icon name="check" />
              </span>
              <b>Checked in for 7:40</b>
              <small>Saturday · 2 players · Your Golf Club</small>
            </span>
          </div>
          <span className={p.note}>Illustrative</span>
        </div>
      )}
    </JourneyFrame>
  );
}
