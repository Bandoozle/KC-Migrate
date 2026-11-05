"use client";

import { JourneyFrame, Photo, on, show } from "./JourneyFrame";
import kit from "./kit.module.css";
import s from "./RetailJourney.module.css";

const SHELTER = "/wp-content/uploads/2026/06/arcteryx-billboard-advertising.jpg";
const SIZES = ["S", "M", "L"];

/** A real transit shelter on the street, then one phone taking the shopper from product to checkout. */
export function RetailJourney() {
  return (
    <JourneyFrame
      industry="retail"
      title="Attention on the street. Sales at the checkout."
      lead="Outdoor stops people, the brand holds them, and digital closes the sale. We run them as one campaign, so nothing is lost between the ad and the order."
      summary="A shopper sees your ad, finds the product online, chooses a size and completes the purchase."
      side="right"
      story="tabs"
      steps={[
        { label: "See the ad", body: "Outdoor campaigns put the collection where your customers walk and commute." },
        { label: "Shop", body: "Digital and social bring them to the product while the ad is still fresh." },
        { label: "Buy", body: "A clear path to purchase turns that attention into an order." },
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
              <span className={s.field}>Shipping address</span>
              <span className={s.field}>Payment</span>
              <span className={s.totals}>
                <span className={kit.skel} />
                <span className={kit.skel} />
              </span>
              <span className={`${s.confirm} ${kit.done}`}>
                <span className={kit.tick} />
                Order placed
              </span>
            </div>
          </div>
        </div>
      )}
    </JourneyFrame>
  );
}
