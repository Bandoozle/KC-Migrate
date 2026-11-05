"use client";

import { JourneyFrame, Photo, on, show } from "./JourneyFrame";
import kit from "./kit.module.css";
import s from "./HvacJourney.module.css";

const SITE = "/wp-content/uploads/2023/09/hvac-website-development.png";
const UNIT = "/wp-content/uploads/2026/02/hvac-digital-marketing.webp";
const SLOTS = ["9 AM", "11 AM", "1 PM", "3 PM"];

/** One phone carries the homeowner from search to call; the job lands on the dealer's schedule beside it. */
export function HvacJourney() {
  return (
    <JourneyFrame
      industry="hvac"
      title="When the furnace quits, the call should come to you."
      lead="Homeowners with no heat don't compare for long. We put your company at the top of the search, make it one tap to call, and get the job on your schedule."
      summary="A homeowner searches for furnace repair, finds your company, calls, and the job lands on your service schedule."
      side="right"
      story="list"
      steps={[
        { label: "Search", body: "Google Ads and local SEO put your company in front of them at that moment." },
        { label: "Find", body: "Your website shows you're local and ready to help, so they stop looking." },
        { label: "Call", body: "A clear call button on a fast mobile site turns the visit into a phone call." },
        { label: "Booked", body: "The job lands on your schedule, and the campaign keeps bringing in the next one." },
      ]}
    >
      {(stage) => (
        <div className={s.scene}>
          <div className={`${kit.phone} ${s.phone}`}>
            <div className={`${kit.layer} ${s.search}`} {...show(stage, 0)}>
              <span className={s.searchBar}>furnace repair near me</span>
              <span className={s.sponsored}>Sponsored</span>
              <span className={s.adTitle}>Your company</span>
              <span className={s.adLine}>Furnace repair. Local technicians, open now.</span>
              <span className={s.adLinks}>
                <span>Call</span>
                <span>Website</span>
              </span>
              <span className={kit.skel} />
              <span className={`${kit.skel} ${s.short}`} />
              <span className={kit.skel} />
            </div>

            <div className={`${kit.layer} ${s.site}`} {...show(stage, 1)}>
              <span className={s.siteNav}>
                <i />
                <i />
                <i />
              </span>
              <span className={s.siteHero}>
                <Photo src={SITE} position="50% 50%" />
              </span>
              <b>Furnace repair, today</b>
              <span className={kit.skel} />
              <span className={`${kit.skel} ${s.short}`} />
              <span className={s.siteCta}>Call now</span>
            </div>

            <div className={`${kit.layer} ${s.call}`} {...show(stage, 2, 3)}>
              <span className={s.avatar}>YC</span>
              <span className={s.callName}>Your company</span>
              <span className={s.callState}>{stage === 3 ? "Call connected" : "Calling…"}</span>
              <span className={s.ring} data-live={stage === 2} />
            </div>
          </div>

          <div className={s.board}>
            <span className={s.boardHead}>Today&rsquo;s schedule</span>
            {SLOTS.map((slot, index) => (
              <span key={slot} className={s.slot}>
                <em>{slot}</em>
                {index === 2 ? (
                  <span className={`${s.job} ${kit.pop}`} {...on(stage, 3)}>
                    <span className={s.thumb}>
                      <Photo src={UNIT} position="55% 40%" />
                    </span>
                    <span className={s.jobText}>
                      <b>Furnace repair</b>
                      <small>New customer</small>
                    </span>
                  </span>
                ) : (
                  <span className={index === 0 ? s.taken : s.open} />
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </JourneyFrame>
  );
}
