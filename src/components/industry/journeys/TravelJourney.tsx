"use client";

import { JourneyFrame, Photo, show } from "./JourneyFrame";
import { Icon } from "./LocalMap";
import kit from "./kit.module.css";
import p from "./places.module.css";
import s from "./TravelJourney.module.css";

const U = "/wp-content/uploads";

const FIELDS = [
  { label: "Interested in", value: "Ocean-view suite package" },
  { label: "Dates", value: "Feb 12 – 19 · 7 nights" },
  { label: "Guests", value: "2 adults" },
  { label: "Departing from", value: "Vancouver" },
];

/* The travel brand's reservations inbox: one new opportunity among others, at different stages */
const OPPORTUNITIES = [
  { title: "Feb 12–19 · 2 adults · Ocean-view suite", source: "Streaming ad", status: "Quote sent", tone: "quote", highlight: true },
  { title: "Group inquiry · 8 guests · March", source: "Search", status: "New", tone: "new" },
  { title: "Spring sailing · 4 adults", source: "Social", status: "Booked", tone: "booked" },
] as const;

/** From the travel business's side: reach an audience, engage the interested, receive a booking opportunity. */
export function TravelJourney() {
  return (
    <JourneyFrame
      industry="travel"
      title="Reach the right audience. Create more booking opportunities."
      lead="Television and streaming build awareness with people likely to travel. Your website and lead generation turn that interest into inquiries your team can follow up and book."
      summary="Illustration: a travel brand’s streaming ad reaches a relevant audience, an interested customer sends an inquiry from the brand’s website, and it arrives in the reservations inbox as a qualified booking opportunity alongside others at different stages."
      side="left"
      story="tabs"
      steps={[
        { label: "Reach", body: "Television, streaming and digital put your cruise line, resort or destination in front of relevant audiences." },
        { label: "Engage", body: "Interested customers visit your website, explore the offer and send an inquiry." },
        { label: "Book", body: "Your team receives a qualified booking opportunity to follow up and convert." },
      ]}
    >
      {(stage) => (
        <div className={s.scene}>
          {/* 1. Reach: the brand's spot in a streaming ad break */}
          <div className={kit.layer} {...show(stage, 0)}>
            <Photo src="/images/television/prime-video.jpg" position="50% 40%" />
            <span className={s.ad}>
              <span className={s.adHead}>
                <span className={s.adTag}>Ad</span>
                <b>Your travel brand</b>
                <small>0:12 / 0:30</small>
              </span>
              <span className={s.track}>
                <span className={s.fill} />
              </span>
              <span className={s.adFoot}>
                <span className={s.adCta}>Explore the offer ›</span>
                <span className={s.audience}>Streaming · Adults 35–64 · Your markets</span>
              </span>
            </span>
          </div>

          {/* 2. Engage: the inquiry form on the brand's own website */}
          <div className={kit.layer} {...show(stage, 1)}>
            <Photo src={`${U}/2026/06/social-media-marketing-2.jpg`} position="50% 50%" className={s.dim} />
            <span className={s.form}>
              <b className={s.formTitle}>Request a quote</b>
              {FIELDS.map((field) => (
                <span key={field.label} className={s.field}>
                  <small>{field.label}</small>
                  <span>{field.value}</span>
                </span>
              ))}
              <span className={s.sent}>
                <Icon name="check" />
                Inquiry sent
              </span>
            </span>
          </div>

          {/* 3. Book: the opportunity lands with the reservations team */}
          <div className={kit.layer} {...show(stage, 2)}>
            <Photo src={`${U}/2026/02/resort-marketing.jpg`} position="50% 55%" className={s.dim} />
            <span className={s.inbox}>
              <span className={s.inboxHead}>
                <b>Booking opportunities</b>
                <small>Reservations team</small>
              </span>
              {OPPORTUNITIES.map((row) => (
                <span key={row.title} className={s.row} data-highlight={"highlight" in row}>
                  <span className={s.rowText}>
                    <b>{row.title}</b>
                    <small>
                      Source: <span className={s.source}>{row.source}</span>
                    </small>
                  </span>
                  <span className={s.status} data-tone={row.tone}>
                    {row.status}
                  </span>
                </span>
              ))}
            </span>
          </div>
          <span className={`${p.note} ${s.note}`}>Illustrative</span>
        </div>
      )}
    </JourneyFrame>
  );
}
