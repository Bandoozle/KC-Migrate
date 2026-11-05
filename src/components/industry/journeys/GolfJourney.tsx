"use client";

import { JourneyFrame, Photo, on, show } from "./JourneyFrame";
import kit from "./kit.module.css";
import s from "./GolfJourney.module.css";

const U = "/wp-content/uploads";

const TIMES = [
  { time: "7:20", state: "taken" },
  { time: "7:30", state: "taken" },
  { time: "7:40", state: "yours" },
  { time: "7:50", state: "open" },
];

/** The course on one side, its tee sheet on the other: the sheet fills in as the golfer gets closer. */
export function GolfJourney() {
  return (
    <JourneyFrame
      industry="golf"
      title="Every tee time starts long before the first tee."
      lead="Golfers find a course, look it over online, then decide. We market every stretch of that path, for public play and membership alike."
      summary="A golfer discovers your course, explores it online, and books a tee time or sends a membership inquiry."
      side="left"
      story="list"
      steps={[
        { label: "Discover", body: "Broadcast, social and search put your course in front of the right golfers." },
        { label: "Explore", body: "A website built around the course shows the holes, the clubhouse and why it's worth the drive." },
        { label: "Book", body: "Online booking and a clear inquiry form fill the tee sheet and the membership list." },
      ]}
    >
      {(stage) => (
        <div className={s.scene}>
          <div className={s.photos}>
            <div className={kit.layer} {...show(stage, 0)}>
              <Photo src={`${U}/2026/06/golf-social-media-marketing.jpg`} position="50% 55%" />
              <span className={`${kit.tag} ${s.caption}`}>In their feed</span>
            </div>
            <div className={kit.layer} {...show(stage, 1)}>
              <Photo src={`${U}/2026/03/website-development-e-commerce.jpg`} position="50% 50%" className={s.laptop} />
              <span className={`${kit.tag} ${s.caption}`}>On your website</span>
            </div>
            <div className={kit.layer} {...show(stage, 2)}>
              <Photo src={`${U}/2026/06/golf-course-branding-marketing.jpg`} position="50% 30%" />
              <span className={`${kit.tag} ${s.caption}`}>On the first tee</span>
            </div>
          </div>

          <div className={s.sheet}>
            <span className={s.sheetHead}>
              <b>Tee sheet</b>
              <small>Saturday</small>
            </span>
            {TIMES.map(({ time, state }) => (
              <span
                key={time}
                className={s.row}
                data-state={state}
                data-lit={state === "yours" && stage >= 1}
                data-booked={state === "yours" && stage === 2}
              >
                <em>{time}</em>
                {state === "taken" ? (
                  <span className={s.players} />
                ) : state === "yours" && stage === 2 ? (
                  <span className={kit.done}>
                    <span className={kit.tick} />
                    Booked
                  </span>
                ) : (
                  <span className={s.open}>Open</span>
                )}
              </span>
            ))}
            <span className={`${s.member} ${kit.fade}`} {...on(stage, 2)}>
              Membership inquiry received
            </span>
          </div>
        </div>
      )}
    </JourneyFrame>
  );
}
