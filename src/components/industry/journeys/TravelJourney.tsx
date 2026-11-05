"use client";

import { JourneyFrame, Photo, show } from "./JourneyFrame";
import kit from "./kit.module.css";
import s from "./TravelJourney.module.css";

const U = "/wp-content/uploads";

const TICKET = [
  { kicker: "On screen", value: "Your destination", detail: "A TV spot starts the trip" },
  { kicker: "Planning", value: "2 travellers, 7 nights", detail: "A qualified inquiry reaches you" },
  { kicker: "Confirmed", value: "Your destination", detail: "Seats and rooms filled" },
];

const FLIGHT = [14, 52, 90];

/** Living room, tablet, poolside: the scene changes while one ticket fills in and the flight moves along it. */
export function TravelJourney() {
  return (
    <JourneyFrame
      industry="travel"
      title="From a spark on the screen to a confirmed booking."
      lead="Television plants the idea, and lead generation finds the traveller who is ready to plan. Together they turn interest into filled seats and rooms."
      summary="A TV spot inspires the trip, the traveller sends a qualified inquiry while planning, and the inquiry becomes a booking."
      side="left"
      story="tabs"
      steps={[
        { label: "Inspire", body: "Television puts your destination in front of people before they've started looking." },
        { label: "Plan", body: "Lead generation captures travellers who are actively planning and passes you qualified inquiries." },
        { label: "Book", body: "Those inquiries become booked seats and rooms." },
      ]}
    >
      {(stage) => (
        <div className={s.scene}>
          <div className={kit.layer} {...show(stage, 0)}>
            <Photo src={`${U}/2026/06/tv-streaming-advertising-1.jpg`} position="50% 44%" />
          </div>
          <div className={kit.layer} {...show(stage, 1)}>
            <Photo src={`${U}/2026/06/social-media-marketing-2.jpg`} position="50% 50%" />
          </div>
          <div className={kit.layer} {...show(stage, 2)}>
            <Photo src={`${U}/2026/02/resort-marketing.jpg`} position="50% 55%" />
          </div>

          <div className={`${kit.card} ${s.ticket}`}>
            <div className={s.main}>
              <span className={s.kicker}>{TICKET[stage].kicker}</span>
              <b key={TICKET[stage].value + stage} className={s.value}>
                {TICKET[stage].value}
              </b>
              <small>{TICKET[stage].detail}</small>
              <span className={s.route}>
                <span className={s.routeFill} style={{ width: `${FLIGHT[stage]}%` }} />
                <span className={s.plane} style={{ left: `${FLIGHT[stage]}%` }} />
              </span>
            </div>
            <div className={s.stub} data-booked={stage === 2}>
              {stage === 2 ? <span className={kit.tick} /> : <span className={s.barcode} />}
              <span>{stage === 2 ? "Booked" : "Open"}</span>
            </div>
          </div>
        </div>
      )}
    </JourneyFrame>
  );
}
