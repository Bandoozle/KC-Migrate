"use client";

import { JourneyFrame, Photo, on, show } from "./JourneyFrame";
import kit from "./kit.module.css";
import p from "./places.module.css";
import s from "./RetailJourney.module.css";

const SHELTER = "/wp-content/uploads/2026/06/arcteryx-billboard-advertising.jpg";
const SIZES = ["S", "M", "L"];

/** A real transit shelter on the street, then one phone taking the shopper from product to checkout. */
export function RetailJourney() {
  return (
    <JourneyFrame
      industry="retail"
      title="Attention on the street. Sales at the checkout."
      lead="Outdoor stops people, the brand holds them and digital makes it easy to buy. We run them as one campaign, so the path from the ad to the order stays connected."
      summary="Illustration: a shopper sees your ad on the street, finds the coat online, chooses a size and orders it for pickup at your store."
      side="right"
      story="tabs"
      steps={[
        { label: "See the ad", body: "Outdoor campaigns put the collection where your customers walk and commute." },
        { label: "Shop", body: "Digital and social bring them to the product while the ad is still fresh." },
        { label: "Pick up", body: "Order online, collect in store: the campaign ends with a visit to your shop." },
      ]}
    >
      {(stage) => (
        <div className={s.scene}>
          <div className={s.street} data-dim={stage > 0}>
            <Photo src={SHELTER} position="50% 58%" />
          </div>
          <span className={`${kit.tag} ${s.place}`}>On the street</span>

          <div className={`${kit.phone} ${s.phone}`} {...on(stage, 1)}>
            <div className={`${kit.layer} ${s.screen}`} {...show(stage, 0, 1)}>
              <span className={s.storeBar}>Your store</span>
              <span className={s.product}>
                <Photo src={SHELTER} position="50% 72%" className={s.productImage} />
              </span>
              <b>The dark coat</b>
              <span className={s.sizes}>
                {SIZES.map((size) => (
                  <span key={size} className={s.size} data-picked={size === "M"}>
                    {size}
                  </span>
                ))}
              </span>
              <span className={s.buy}>Add to bag</span>
            </div>

            <div className={`${kit.layer} ${s.screen}`} {...show(stage, 2)}>
              <span className={s.storeBar}>Checkout</span>
              <span className={s.line}>
                <span className={s.lineThumb}>
                  <Photo src={SHELTER} position="50% 72%" className={s.productImage} />
                </span>
                <span>
                  <b>The dark coat</b>
                  <small>Size M</small>
                </span>
              </span>
              <span className={s.option} data-selected="true">
                <span className={s.radio} />
                <span>
                  <b>Pick up in store</b>
                  <small>Ready today · Free</small>
                </span>
              </span>
              <span className={s.option}>
                <span className={s.radio} />
                <span>
                  <b>Ship to home</b>
                  <small>2–4 days</small>
                </span>
              </span>
              <span className={s.store}>
                <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
                  <rect width="40" height="40" rx="6" fill="#eef0ea" />
                  <path d="M0 22 H 40 M 24 0 V 40" stroke="#ffffff" strokeWidth="4" />
                  <path d="M24 26c-4-5-6-8-6-11a6 6 0 0 1 12 0c0 3-2 6-6 11Z" fill="var(--ind-accent)" />
                  <circle cx="24" cy="15" r="2" fill="#ffffff" />
                </svg>
                <span>
                  <b>Your store</b>
                  <small>King St · 1.2 km</small>
                </span>
              </span>
              <span className={`${s.confirm} ${kit.done}`}>
                <span className={kit.tick} />
                Ready for pickup today
              </span>
            </div>
          </div>
          <span className={p.note}>Illustrative</span>
        </div>
      )}
    </JourneyFrame>
  );
}
