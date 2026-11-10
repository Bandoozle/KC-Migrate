"use client";

import { JourneyFrame, Photo, on, show } from "./JourneyFrame";
import kit from "./kit.module.css";
import p from "./places.module.css";
import s from "./ConstructionJourney.module.css";

const U = "/wp-content/uploads";
const HOME = `${U}/2023/06/services.jpg`;

/** A real project wiped from plan to finished build, then the site that wins the shortlist, then the request. */
export function ConstructionJourney() {
  return (
    <JourneyFrame
      industry="construction"
      title="The work wins the job, if the right people see it."
      lead="Homeowners shortlist builders before they ever call. We put your projects where they're looking and make your company an easy choice."
      summary="A homeowner sees your work, puts you on their shortlist of builders, and requests a site visit."
      side="right"
      story="list"
      steps={[
        { label: "Show the work", body: "Social media and a strong portfolio show your builds as they happen." },
        { label: "Shortlist", body: "A website that looks the part, and content that proves you know the trade, earn the spot on the list." },
        { label: "Site visit", body: "A clear next step makes it easy to go from the shortlist to a site visit request." },
      ]}
    >
      {(stage) => (
        <div className={s.scene}>
          <div className={`${kit.layer} ${s.build}`} {...show(stage, 0)}>
            <Photo src={HOME} position="50% 50%" />
            <div className={s.plan} data-wipe={stage === 0}>
              <Photo src={HOME} position="50% 50%" className={s.planImage} />
              <span className={s.grid} />
              <span className={s.lines} />
            </div>
            <span className={s.seam} data-wipe={stage === 0} />
            <span className={`${kit.tag} ${s.left}`}>Finished build</span>
            <span className={`${kit.tag} ${s.right}`}>The plan</span>
          </div>

          <div className={kit.layer} {...show(stage, 1)}>
            <Photo src={`${U}/2024/03/padwood-construction.webp`} position="50% 62%" className={s.laptop} />
            <div className={`${kit.card} ${s.shortlist}`}>
              <span className={s.listHead}>
                <b>Saved builders</b>
                <small>3 saved</small>
              </span>
              <span className={s.you}>
                <span className={s.youThumb}>
                  <Photo src={HOME} position="50% 50%" />
                </span>
                <span className={s.youText}>
                  <b>Your company</b>
                  <small>Custom homes · Renovations</small>
                </span>
                <span className={kit.tick} />
              </span>
              <span className={s.others}>+ 2 other builders</span>
              <span className={s.visitBtn}>Request a site visit</span>
            </div>
          </div>

          <div className={kit.layer} {...show(stage, 2)}>
            <Photo src={`${U}/2026/02/home-services-marketing.jpg`} position="50% 45%" />
            <div className={`${kit.card} ${s.request} ${kit.pop}`} {...on(stage, 2)}>
              <span className={kit.done}>
                <span className={kit.tick} />
                Site visit requested
              </span>
              <small>New build · Thursday morning</small>
            </div>
          </div>
          <span className={p.note}>Illustrative</span>
        </div>
      )}
    </JourneyFrame>
  );
}
