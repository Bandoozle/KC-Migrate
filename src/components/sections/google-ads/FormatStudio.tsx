"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { handleArrowKeys } from "@/components/sections/business-development/bd-motion";
import { CAMPAIGN_TYPES, SAMPLE_AD, SHOPPING_PRODUCTS } from "@/content/google-ads-page";
import styles from "./FormatStudio.module.css";

type TypeId = (typeof CAMPAIGN_TYPES)[number]["id"];

const PHOTO = {
  living: "/images/google-ads/ductless-living-room.jpg",
  bedroom: "/images/google-ads/ductless-bedroom.jpg",
};

function SearchBar({ query }: { query: string }) {
  return (
    <div className={styles.searchBar}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>{query}</span>
    </div>
  );
}

function SearchExample() {
  return (
    <div className={`${styles.screen} ${styles.serp}`}>
      <SearchBar query={SAMPLE_AD.query} />
      <div className={styles.serpTabs}>
        <span data-on>All</span>
        <span>Maps</span>
        <span>Images</span>
        <span>Shopping</span>
      </div>
      <div className={styles.result} data-sponsored>
        <span className={styles.sponsored}>Sponsored</span>
        <span className={styles.site}>
          <span className={styles.favicon}>N</span>
          <span>
            <b>{SAMPLE_AD.business}</b>
            <small>https://{SAMPLE_AD.domain}</small>
          </span>
        </span>
        <span className={styles.resultTitle}>{SAMPLE_AD.headline}</span>
        <span className={styles.resultText}>{SAMPLE_AD.description}</span>
        <span className={styles.sitelinks}>
          {SAMPLE_AD.sitelinks.map((link) => (
            <span key={link}>{link}</span>
          ))}
        </span>
      </div>
      <div className={styles.result}>
        <span className={styles.site}>
          <span className={styles.favicon} data-muted>
            H
          </span>
          <span>
            <b>Harbour Home Services</b>
            <small>https://harbourhome.ca › furnaces</small>
          </span>
        </span>
        <span className={styles.resultTitle}>Furnace Installation and Repair, Metro Vancouver</span>
        <span className={styles.resultText}>Gas and electric furnaces installed by certified technicians. Serving Vancouver since 2004.</span>
      </div>
    </div>
  );
}

function DisplayExample() {
  return (
    <div className={`${styles.screen} ${styles.article}`}>
      <div className={styles.masthead}>
        <b>The Home Journal</b>
        <span>Living · Renovation · Energy</span>
      </div>
      <div className={styles.articleGrid}>
        <div className={styles.articleBody}>
          <span className={styles.kicker}>Energy</span>
          <h4 className={styles.articleTitle}>Five ways to cut your heating bill before the first cold snap</h4>
          <p>Older furnaces can lose a surprising share of their heat before it reaches the room. An inspection in early fall is the cheapest way to find out how yours is doing.</p>
          <div className={styles.leaderboard}>
            <Image src={PHOTO.bedroom} alt="" fill sizes="(min-width: 1000px) 30vw, 70vw" className={styles.cover} />
            <span className={styles.adBadge}>Ad</span>
            <span className={styles.leaderText}>
              <b>Quiet heat, room by room.</b>
              <span>{SAMPLE_AD.business}</span>
            </span>
          </div>
          <p>Heat pumps now handle most Lower Mainland winters on their own, and many homes qualify for rebates on the switch.</p>
        </div>
        <aside className={styles.mrec}>
          <div className={styles.mrecImage}>
            <Image src={PHOTO.living} alt="" fill sizes="(min-width: 1000px) 16vw, 40vw" className={styles.cover} />
            <span className={styles.adBadge}>Ad</span>
          </div>
          <b>Free in-home estimates</b>
          <span>Same-week heat pump installs in Vancouver.</span>
          <span className={styles.mrecButton}>Book now</span>
        </aside>
      </div>
    </div>
  );
}

function ShoppingExample() {
  return (
    <div className={`${styles.screen} ${styles.shopping}`}>
      <SearchBar query="ductless heat pump" />
      <span className={styles.sponsoredRow}>Sponsored products</span>
      <ul className={styles.products}>
        {SHOPPING_PRODUCTS.map((product) => (
          <li key={product.title} className={styles.product}>
            <span className={styles.productImage}>
              <Image src={product.image} alt="" fill sizes="(min-width: 1000px) 12vw, 40vw" className={styles.cover} />
            </span>
            <span className={styles.productTitle}>{product.title}</span>
            <b className={styles.productPrice}>{product.price}</b>
            <span className={styles.productStore}>{product.store}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VideoExample() {
  return (
    <div className={`${styles.screen} ${styles.video}`}>
      <div className={styles.player}>
        <Image src={PHOTO.living} alt="" fill sizes="(min-width: 1000px) 45vw, 90vw" className={styles.cover} />
        <span className={styles.playerShade} />
        <span className={styles.adPill}>Sponsored · 0:08</span>
        <span className={styles.adCard}>
          <span className={styles.favicon}>N</span>
          <span>
            <b>{SAMPLE_AD.business}</b>
            <small>{SAMPLE_AD.domain}</small>
          </span>
          <span className={styles.adCardButton}>Book an estimate</span>
        </span>
        <span className={styles.skip}>Skip ›</span>
        <span className={styles.progress} />
      </div>
      <div className={styles.videoMeta}>
        <b>Winter home prep: a heating checklist</b>
        <span>Home Basics · 48K views</span>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg className={styles.googleMark} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
    </svg>
  );
}

function PmaxExample() {
  return (
    <div className={styles.pmax}>
      <article className={styles.surface}>
        <span className={styles.surfaceName}>Search</span>
        <div className={styles.pmaxSearchBar}>
          <GoogleMark />
          <span>heat pump installation vancouver</span>
          <span className={styles.pmaxSearchIcons} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11h-2Z" />
            </svg>
            <svg viewBox="0 0 24 24" width="14" height="14">
              <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M15.5 15.5 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <div className={styles.pmaxSearchAd}>
          <div className={styles.pmaxSearchCopy}>
            <span className={styles.pmaxSite}>
              <span className={styles.favicon}>N</span>
              <span>
                <b>{SAMPLE_AD.business}</b>
                <small>{SAMPLE_AD.domain}</small>
              </span>
            </span>
            <span className={styles.pmaxHeadline}>Heat Pump Installation in Vancouver</span>
            <span className={styles.pmaxDesc}>
              Efficient, quiet heat pumps from trusted local experts. Free in-home estimates this week.
            </span>
            <span className={styles.pmaxProof}>
              <span className={styles.pmaxStars} aria-hidden="true">
                ★★★★★
              </span>
              <span>4.9 (1.2K)</span>
              <span className={styles.pmaxLoc}>Vancouver</span>
            </span>
          </div>
          <span className={styles.pmaxThumb}>
            <Image src="/images/google-ads/product-heat-pump.jpg" alt="" fill sizes="96px" className={styles.cover} />
          </span>
        </div>
        <div className={styles.pmaxSitelinks}>
          <span>Get a Quote</span>
          <span>Heat Pump Rebates</span>
          <span>Our Services</span>
        </div>
      </article>

      <article className={styles.surface}>
        <span className={styles.surfaceName}>YouTube</span>
        <div className={styles.pmaxPlayer}>
          <Image src={PHOTO.living} alt="" fill sizes="(min-width: 1000px) 28vw, 70vw" className={styles.cover} />
          <span className={styles.pmaxPlayerShade} aria-hidden="true" />
          <span className={styles.pmaxBrandChip}>
            <span className={styles.favicon}>N</span>
            {SAMPLE_AD.business}
          </span>
          <span className={styles.pmaxAdTime}>
            <b>Ad</b> 0:15
          </span>
          <span className={styles.pmaxPlayerLine}>A more efficient home all year.</span>
          <span className={styles.pmaxControls} aria-hidden="true">
            <span className={styles.pmaxPlay} />
            <span className={styles.pmaxProgress}>
              <i />
            </span>
            <span>0:15 / 0:30</span>
          </span>
        </div>
      </article>

      <article className={styles.surface}>
        <span className={styles.surfaceName}>Gmail</span>
        <div className={styles.pmaxMail}>
          <aside className={styles.pmaxMailNav} aria-hidden="true">
            <span data-on />
            <span />
            <span />
            <span />
            <span />
          </aside>
          <div className={styles.pmaxMailBody}>
            <span className={styles.pmaxMailRow}>
              <span className={styles.pmaxAdTag}>Ad</span>
              <span>
                <b>{SAMPLE_AD.business}</b>
                <small>Upgrade to a heat pump this season. Lower energy costs and a more comfortable home…</small>
              </span>
            </span>
            <span className={styles.pmaxMailImage}>
              <Image src={PHOTO.living} alt="" fill sizes="(min-width: 1000px) 22vw, 70vw" className={styles.cover} />
            </span>
          </div>
        </div>
      </article>

      <article className={styles.surface}>
        <span className={styles.surfaceName}>Maps</span>
        <div className={styles.pmaxMap}>
          <span className={styles.pmaxMapCanvas} aria-hidden="true">
            <span className={styles.pmaxMapPin} />
          </span>
          <div className={styles.pmaxMapCard}>
            <span className={styles.pmaxMapThumb}>
              <Image src="/images/google-ads/product-heat-pump.jpg" alt="" fill sizes="56px" className={styles.cover} />
            </span>
            <span className={styles.pmaxMapCopy}>
              <b>{SAMPLE_AD.business}</b>
              <small>Sponsored · HVAC contractor</small>
              <span className={styles.pmaxProof}>
                <span className={styles.pmaxStars} aria-hidden="true">
                  ★★★★★
                </span>
                <span>4.9</span>
                <span>Open until 6 p.m.</span>
              </span>
            </span>
            <span className={styles.pmaxCall}>
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1l-2.22 2.2Z"
                />
              </svg>
              Call
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}

const EXAMPLES: Record<TypeId, () => React.JSX.Element> = {
  search: SearchExample,
  display: DisplayExample,
  shopping: ShoppingExample,
  video: VideoExample,
  pmax: PmaxExample,
};

/** Campaign types as a studio: choose a format, see a full-size example of where it appears. */
export function FormatStudio() {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const type = CAMPAIGN_TYPES[active];
  const Example = EXAMPLES[type.id];

  return (
    <div className={styles.studio}>
      <div className={styles.tabs} role="tablist" aria-label="Google Ads campaign types">
        {CAMPAIGN_TYPES.map((item, index) => (
          <button
            key={item.id}
            id={`${baseId}-tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={index === active ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(index)}
            onKeyDown={(event) =>
              handleArrowKeys(event, index, CAMPAIGN_TYPES.length, setActive, (next) => `${baseId}-tab-${CAMPAIGN_TYPES[next].id}`)
            }
          >
            <span className={styles.tabName}>{item.name}</span>
            <span className={styles.tabLine}>{item.line}</span>
          </button>
        ))}
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${type.id}`} className={styles.panel} key={type.id}>
        <div className={styles.stage} aria-hidden="true">
          <Example />
        </div>
        <div className={styles.copy}>
          <h3 className={styles.typeTitle}>{type.title}</h3>
          <p className={styles.typeBody}>{type.body}</p>
          <p className={styles.bestFor}>
            <b>Best for</b> {type.bestFor}
          </p>
          <ul className={styles.manage}>
            {type.manage.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className={styles.note}>Examples use a fictional business and fictional retailers.</p>
    </div>
  );
}
