"use client";

import { JourneyFrame, Photo, show } from "./JourneyFrame";
import kit from "./kit.module.css";
import s from "./HvacJourney.module.css";

const UNIT = "/wp-content/uploads/2026/02/hvac-digital-marketing.webp";

/* The dealer's day before the call comes in. Names and jobs are illustrative. */
const BOOKED = [
  { time: "8 AM", title: "AC tune-up", meta: "Maintenance", tech: "MR", kind: "maintain" },
  { time: "10 AM", title: "Heat pump install", meta: "Install", tech: "JT", kind: "install" },
  { time: "1 PM", title: null, meta: null, tech: null, kind: "open" },
  { time: "3 PM", title: "Furnace check", meta: "Maintenance", tech: "MR", kind: "maintain" },
] as const;

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"
      />
    </svg>
  );
}

function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <span className={dark ? `${s.status} ${s.statusDark}` : s.status}>
      <b>9:41</b>
      <span className={s.statusIcons}>
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}

/**
 * Search → Find → Call → Booked. The phone carries the homeowner; the dealer's
 * schedule beside it shows the call arrive as a new lead, then become a booking.
 */
export function HvacJourney() {
  return (
    <JourneyFrame
      industry="hvac"
      title="When the furnace quits, the call should come to you."
      lead="Homeowners with no heat don't compare for long. HVAC Google Ads and local SEO put you at the top of the search, and your website turns the visit into a tracked call."
      summary="Illustration: a homeowner searches for furnace repair near me, taps your sponsored result, calls from your website, and the call arrives on your schedule as a new lead that your team books into an open slot."
      side="right"
      story="list"
      steps={[
        { label: "Search", body: "HVAC Google Ads and local SEO put you in front of homeowners searching right now." },
        { label: "Find", body: "A fast, local landing page shows you serve their area." },
        { label: "Call", body: "One tap to call. It arrives as a new lead, tracked to the campaign." },
        { label: "Booked", body: "Your team books the visit into an open slot on the schedule." },
      ]}
    >
      {(stage) => (
        <div className={s.scene} data-stage={stage}>
          <span className={s.note}>Illustrative</span>

          <div className={`${kit.phone} ${s.phone}`}>
            <span className={s.island} />

            {/* 1. Search results: the ad is one result among several, not the whole screen */}
            <div className={`${kit.layer} ${s.screen} ${s.serp}`} {...show(stage, 0)}>
              <StatusBar />
              <span className={s.query}>
                <span className={s.queryIcon} />
                furnace repair near me
              </span>
              <span className={s.tabs}>
                <b>All</b>
                <span>Maps</span>
                <span>Images</span>
                <span>News</span>
              </span>
              <span className={s.ad}>
                <span className={s.adLabel}>Sponsored</span>
                <span className={s.adSource}>
                  <span className={s.favicon}>YC</span>
                  <span>
                    <b>Your Company Heating &amp; Cooling</b>
                    <small>yourcompany.ca</small>
                  </span>
                </span>
                <span className={s.adTitle}>Furnace Repair Near You | Same-Day Service</span>
                <span className={s.adBody}>Licensed local technicians. Upfront pricing on every repair.</span>
                <span className={s.adActions}>
                  <span>
                    <PhoneIcon />
                    Call
                  </span>
                  <span>Website</span>
                </span>
                <span className={`${s.tap} ${s.tapAd}`} />
              </span>
              <span className={s.places}>
                <b>Places</b>
                <span className={s.map}>
                  <i />
                  <i />
                  <i />
                </span>
              </span>
              <span className={s.result}>
                <i />
                <i />
                <i />
              </span>
            </div>

            {/* 2. The landing page the ad opens */}
            <div className={`${kit.layer} ${s.screen} ${s.site}`} {...show(stage, 1)}>
              <StatusBar />
              <span className={s.siteBar}>
                <b>Your Company</b>
                <span className={s.siteCall}>
                  <PhoneIcon />
                </span>
              </span>
              <span className={s.siteHero}>
                <Photo src={UNIT} position="55% 45%" />
              </span>
              <span className={s.siteBody}>
                <b>Furnace repair, today.</b>
                <small>Licensed technicians serving your area. Financing available.</small>
                <span className={s.siteCta}>
                  <PhoneIcon />
                  Call now
                  <span className={`${s.tap} ${s.tapCall}`} />
                </span>
                <span className={s.siteSecondary}>Book online</span>
              </span>
              <span className={s.trust}>
                <span>Same-day service</span>
                <span>Licensed &amp; insured</span>
              </span>
            </div>

            {/* 3. The call */}
            <div className={`${kit.layer} ${s.screen} ${s.call}`} {...show(stage, 2)}>
              <StatusBar dark />
              <span className={s.avatar}>YC</span>
              <b className={s.callName}>Your Company</b>
              <span className={s.callState}>Calling…</span>
              <span className={s.callKeys}>
                <i />
                <i />
                <i />
              </span>
              <span className={s.hangup}>
                <PhoneIcon />
              </span>
            </div>

            {/* 4. The confirmation the homeowner receives once the visit is booked */}
            <div className={`${kit.layer} ${s.screen} ${s.confirm}`} {...show(stage, 3)}>
              <StatusBar />
              <span className={s.thread}>Your Company</span>
              <span className={s.bubble}>
                Thanks for calling. Your furnace repair is booked for today, 1–3 PM. Reply to reschedule.
              </span>
              <span className={s.delivered}>Delivered</span>
              <span className={s.compose}>Text message</span>
            </div>
          </div>

          {/* The dealer's side: a day view with an enquiry tray above it */}
          <div className={s.board}>
            <span className={s.boardHead}>
              <b>Today</b>
              <span>Service schedule</span>
            </span>

            <span className={s.sectionLabel}>New enquiries</span>
            <span className={s.tray}>
              <span className={s.trayEmpty} data-hidden={stage === 2}>
                {stage === 3 ? "All enquiries booked" : "Calls and forms land here"}
              </span>
            </span>

            <span className={s.sectionLabel}>Schedule</span>
            <span className={s.rows}>
              {BOOKED.map((row) => (
                <span key={row.time} className={s.row}>
                  <em>{row.time}</em>
                  {row.title ? (
                    <span className={s.appt} data-kind={row.kind}>
                      <span className={s.apptText}>
                        <b>{row.title}</b>
                        <small>{row.meta}</small>
                      </span>
                      <span className={s.tech}>{row.tech}</span>
                    </span>
                  ) : (
                    <span className={s.open}>Open</span>
                  )}
                </span>
              ))}
            </span>

            {/* One card: it arrives as a lead from the call, then moves into the open slot once booked */}
            <span className={s.lead} data-at={stage < 2 ? "away" : stage === 2 ? "tray" : "slot"}>
              <span className={s.leadIcon}>
                <PhoneIcon />
              </span>
              <span className={s.leadText}>
                <b>Furnace repair</b>
                <small>{stage === 3 ? "New customer · Google Ads" : "Incoming call · Google Ads"}</small>
              </span>
              <span className={s.leadPill} data-booked={stage === 3}>
                {stage === 3 ? "Booked" : "New lead"}
              </span>
            </span>
          </div>
        </div>
      )}
    </JourneyFrame>
  );
}
