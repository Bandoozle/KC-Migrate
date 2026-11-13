import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import type { OfferCard } from "@/lib/wordpress/digital-marketing";
import s from "./ChannelShowcase.module.css";

type Kind = "meta" | "google" | "geo" | "streaming";

function kindOf(title: string): Kind {
  if (/meta|facebook|instagram/i.test(title)) return "meta";
  if (/geo/i.test(title)) return "geo";
  if (/stream|pre-?roll|video/i.test(title)) return "streaming";
  return "google";
}

/* What each channel offers, in plain terms */
const COPY: Record<Kind, string> = {
  meta: "Facebook and Instagram ads targeted by location, interests and life stage, with creative made for the feed and lead forms that capture inquiries.",
  google: "Search and YouTube campaigns that reach people already looking for what you sell, with keywords, bids and ads tuned toward calls and conversions.",
  geo: "Ads limited to the neighbourhoods, cities or regions you serve, so budget goes to the people who can actually become customers.",
  streaming: "Pre-roll video on streaming and connected TV that builds awareness before the search, then retargets viewers who visit your site.",
};

/* A small, believable ad for each channel */
function Mock({ kind }: { kind: Kind }) {
  if (kind === "meta") {
    return (
      <span className={`${s.mock} ${s.feed}`}>
        <span className={s.feedHead}>
          <span className={s.avatar}>YB</span>
          <span>
            <b>Your business</b>
            <small>Sponsored</small>
          </span>
        </span>
        <span className={s.feedImage}>
          <Image
            src="/wp-content/uploads/2026/02/resort-marketing.jpg"
            alt="A travel destination photograph used in a social feed ad mockup"
            fill
            sizes="240px"
            className={s.cover}
          />
        </span>
        <span className={s.feedCta}>
          <span>
            <small>yourbusiness.ca</small>
            <b>Summer getaway packages</b>
          </span>
          <span className={s.feedButton}>Book now</span>
        </span>
      </span>
    );
  }
  if (kind === "google") {
    return (
      <span className={`${s.mock} ${s.search}`}>
        <span className={s.query}>
          <i />
          plumber near me
        </span>
        <span className={s.result}>
          <small className={s.sponsored}>Sponsored</small>
          <span className={s.site}>
            <span className={s.favicon}>YB</span>
            <span>
              <b>Your Business</b>
              <small>yourbusiness.ca</small>
            </span>
          </span>
          <span className={s.headline}>Licensed Plumbers | Same-Day Service</span>
          <span className={s.desc}>Upfront quotes. Available evenings and weekends.</span>
          <span className={s.links}>
            <span>Call</span>
            <span>Get a quote</span>
          </span>
        </span>
        <span className={s.organic}>
          <i />
          <i />
        </span>
      </span>
    );
  }
  if (kind === "geo") {
    return (
      <span className={`${s.mock} ${s.mapMock}`}>
        <svg viewBox="0 0 240 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
          <rect width="240" height="170" fill="#eceee8" />
          <path d="M0 0 H 90 C 70 20, 40 30, 0 34 Z" fill="#bcd6e6" />
          <g fill="#e1e2db">
            <rect x="12" y="50" width="40" height="26" rx="2" />
            <rect x="64" y="50" width="40" height="26" rx="2" />
            <rect x="140" y="20" width="44" height="30" rx="2" />
            <rect x="196" y="20" width="36" height="30" rx="2" />
            <rect x="12" y="104" width="40" height="30" rx="2" />
            <rect x="140" y="104" width="44" height="30" rx="2" />
            <rect x="196" y="104" width="36" height="30" rx="2" />
          </g>
          <g stroke="#ffffff" fill="none">
            <path d="M0 90 H 240" strokeWidth="6" />
            <path d="M122 0 V 170" strokeWidth="6" />
            <path d="M0 145 H 240 M 60 0 V 170" strokeWidth="3" />
          </g>
          <circle cx="122" cy="90" r="58" className={s.radius} />
          <path d="M122 90 c-6-8-9-13-9-18 a9 9 0 0 1 18 0 c0 5-3 10-9 18Z" fill="#5b63f5" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="122" cy="72" r="3" fill="#ffffff" />
        </svg>
        <span className={s.mapChip}>Within 10 km of your business</span>
      </span>
    );
  }
  return (
    <span className={`${s.mock} ${s.player}`}>
      <span className={s.playerImage}>
        <Image
          src="/images/television/prime-video.jpg"
          alt="Prime Video playing on a wall-mounted living-room television"
          fill
          sizes="240px"
          className={s.cover}
        />
      </span>
      <span className={s.adBar}>
        <span className={s.adTag}>Ad · 0:06</span>
        <span className={s.skip}>Skip ad ›</span>
        <span className={s.adTrack}>
          <span />
        </span>
      </span>
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** The four paid channels as distinct, readable panels, each showing what an ad there looks like. */
export function ChannelShowcase({ cards }: { cards: OfferCard[] }) {
  return (
    <ul className={s.grid}>
      {cards.map((card, index) => {
        const kind = kindOf(card.title);
        const inner = (
          <>
            <span className={s.stage} data-kind={kind} aria-hidden="true">
              <Mock kind={kind} />
            </span>
            <span className={s.body}>
              {card.subtitle ? <span className={s.platform}>{card.subtitle}</span> : null}
              <h3 className={s.name}>{card.title}</h3>
              <span className={s.copy}>{COPY[kind]}</span>
              {card.href ? (
                <span className={s.more}>
                  Explore {card.title.toLowerCase()}
                  <ArrowIcon />
                </span>
              ) : null}
            </span>
          </>
        );
        return (
          <Reveal key={card.title} as="li" delay={index * 90} className={s.item}>
            {card.href ? (
              <Link href={card.href} className={s.card}>
                {inner}
              </Link>
            ) : (
              <div className={s.card}>{inner}</div>
            )}
          </Reveal>
        );
      })}
    </ul>
  );
}
