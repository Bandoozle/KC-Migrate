"use client";

import { JourneyFrame, Photo, on, show } from "@/components/industry/journeys/JourneyFrame";
import kit from "@/components/industry/journeys/kit.module.css";
import s from "./AudienceJourney.module.css";

const AD_IMAGE = "/images/email/campaign-hero.jpg";

type AudienceJourneyProps = {
  title: string;
  lead: string;
};

/**
 * Target → Reach → Engage → Lead. The campaign's audience is set on the right,
 * the ad appears in a real-looking feed on the phone, the person fills in the
 * lead form, and the enquiry lands in the business's lead list.
 */
export function AudienceJourney({ title, lead }: AudienceJourneyProps) {
  return (
    <JourneyFrame
      industry="digital"
      title={title}
      lead={lead}
      summary="Illustration: a business sets a campaign audience by location, age and interests, its sponsored ad appears in a social feed, a person opens the lead form and sends their details, and the enquiry arrives in the business's lead list."
      side="right"
      story="list"
      steps={[
        { label: "Target", body: "Choose who should see your ads: location, age, interests and the searches that signal intent." },
        { label: "Reach", body: "Your ad appears where those people already spend time, in the feed or in search." },
        { label: "Engage", body: "A clear offer and a short form make it easy to ask for a quote or a call." },
        { label: "Lead", body: "The enquiry arrives with its campaign attached, ready for your team to follow up." },
      ]}
    >
      {(stage) => (
        <div className={s.scene} data-stage={stage}>
          {/* The phone */}
          <div className={`${kit.phone} ${s.phone}`}>
            <span className={s.island} />

            {/* Feed: an organic post, then the sponsored one scrolls into view */}
            <div className={`${kit.layer} ${s.screen}`} {...show(stage, 0, 1)}>
              <span className={s.status}>
                <b>9:41</b>
                <i />
              </span>
              <span className={s.appBar}>
                <b>Feed</b>
                <span className={s.appIcons}>
                  <i />
                  <i />
                </span>
              </span>
              <span className={s.feed} data-scrolled={stage >= 1}>
                <span className={s.post}>
                  <span className={s.postHead}>
                    <span className={`${s.avatar} ${s.avatarOther}`} />
                    <span>
                      <b>localfoodguide</b>
                      <small>2h</small>
                    </span>
                  </span>
                  <span className={`${s.postMedia} ${s.postMediaPlain}`} />
                  <span className={s.postLines}>
                    <i />
                    <i />
                  </span>
                </span>
                <span className={`${s.post} ${s.ad}`}>
                  <span className={s.postHead}>
                    <span className={s.avatar}>YB</span>
                    <span>
                      <b>Your business</b>
                      <small>Sponsored</small>
                    </span>
                  </span>
                  <span className={s.postCopy}>Spring offer: book a free consultation this month.</span>
                  <span className={s.postMedia}>
                    <Photo src={AD_IMAGE} position="30% 50%" />
                  </span>
                  <span className={s.cta} data-pressed={stage === 1}>
                    <span>
                      <small>yourbusiness.ca</small>
                      <b>Get a free quote</b>
                    </span>
                    <span className={s.ctaButton}>Learn more</span>
                    <span className={s.tap} />
                  </span>
                </span>
              </span>
            </div>

            {/* The lead form the ad opens */}
            <div className={`${kit.layer} ${s.screen} ${s.form}`} {...show(stage, 2)}>
              <span className={s.status}>
                <b>9:42</b>
                <i />
              </span>
              <span className={s.formHead}>
                <span className={s.avatar}>YB</span>
                <b>Get a free quote</b>
                <small>Your business</small>
              </span>
              <span className={s.field}>
                <small>Full name</small>
                <span>Sam Taylor</span>
              </span>
              <span className={s.field}>
                <small>Phone</small>
                <span>(604) 555-0142</span>
              </span>
              <span className={s.field}>
                <small>What can we help with?</small>
                <span>A quote for this spring</span>
              </span>
              <span className={s.submit}>
                Submit
                <span className={s.tap} />
              </span>
            </div>

            {/* Sent */}
            <div className={`${kit.layer} ${s.screen} ${s.sent}`} {...show(stage, 3)}>
              <span className={s.status}>
                <b>9:42</b>
                <i />
              </span>
              <span className={s.sentTick}>✓</span>
              <b className={s.sentTitle}>Thanks, Sam</b>
              <small className={s.sentLine}>Your business will call you shortly.</small>
            </div>
          </div>

          {/* The business's side */}
          <div className={s.side}>
            <span className={s.card} data-focus={stage === 0}>
              <span className={s.cardHead}>
                <b>Campaign</b>
                <span className={s.goal}>Goal: Leads</span>
              </span>
              <span className={s.row}>
                <small>Location</small>
                <span>Within 15 km of your business</span>
              </span>
              <span className={s.row}>
                <small>Age</small>
                <span>30–64</span>
              </span>
              <span className={s.row}>
                <small>Interests</small>
                <span className={s.chips}>
                  <i>Home improvement</i>
                  <i>Local services</i>
                </span>
              </span>
              <span className={s.row}>
                <small>Placements</small>
                <span>Facebook · Instagram</span>
              </span>
            </span>

            <span className={s.card} data-focus={stage === 3}>
              <span className={s.cardHead}>
                <b>Leads</b>
                <small>Today</small>
              </span>
              <span className={s.leads}>
                <span className={`${s.lead} ${kit.pop}`} {...on(stage, 3)}>
                  <span className={s.leadDot} />
                  <span className={s.leadText}>
                    <b>Sam Taylor · Quote request</b>
                    <small>Meta lead form · Spring offer</small>
                  </span>
                  <span className={s.leadNew}>New</span>
                </span>
                <span className={`${s.lead} ${s.leadOld}`}>
                  <span className={s.leadDot} />
                  <span className={s.leadText}>
                    <b>Call · 3 min</b>
                    <small>Google Ads · Search</small>
                  </span>
                  <span className={s.leadDone}>Called back</span>
                </span>
              </span>
            </span>
          </div>
          <span className={s.note}>Illustrative</span>
        </div>
      )}
    </JourneyFrame>
  );
}
