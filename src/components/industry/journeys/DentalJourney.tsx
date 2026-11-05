"use client";

import { JourneyFrame, Photo } from "./JourneyFrame";
import kit from "./kit.module.css";
import s from "./DentalJourney.module.css";

const U = "/wp-content/uploads";
const TIMES = ["9:00", "10:30", "1:15", "3:45"];

/** The real screens a patient moves through, sliding across like the path itself: search, site, booking. */
export function DentalJourney() {
  return (
    <JourneyFrame
      industry="dental"
      title="How a new patient chooses your practice."
      lead="Patients look you up, read about you and book before they ever see the waiting room. We build every stage of that path."
      summary="A prospective patient discovers your clinic in search, explores your treatments, and books a new patient exam."
      side="left"
      story="list"
      steps={[
        { label: "Discover", body: "Local SEO and Google Ads put your practice in front of patients searching nearby." },
        { label: "Explore", body: "A calm, credible website explains treatments clearly and answers the questions that hold people back." },
        { label: "Book", body: "Easy online booking turns that interest into a new patient exam on your calendar." },
      ]}
    >
      {(stage) => (
        <div className={s.window}>
          <div className={s.track} style={{ transform: `translateX(${stage * (-100 / 3)}%)` }}>
            <div className={s.pane}>
              <Photo src={`${U}/2026/07/Dental-Marketing.jpg`} position="50% 34%" />
              <span className={`${kit.tag} ${s.caption}`}>In search</span>
            </div>
            <div className={s.pane}>
              <Photo src={`${U}/2026/06/dental-clinic-branding.jpg`} position="72% 50%" />
              <span className={`${kit.tag} ${s.caption}`}>On your website</span>
            </div>
            <div className={s.pane}>
              <Photo src={`${U}/2026/07/Dental-Vancouver.jpg`} position="50% 60%" />
              <div className={`${kit.card} ${s.booking}`}>
                <b>New patient exam</b>
                <span className={s.day}>Tuesday</span>
                <span className={s.times}>
                  {TIMES.map((time) => (
                    <span key={time} className={s.time} data-picked={time === "10:30"}>
                      {time}
                    </span>
                  ))}
                </span>
                <span className={kit.done}>
                  <span className={kit.tick} />
                  Appointment booked
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </JourneyFrame>
  );
}
