import Image from "next/image";
import Link from "next/link";
import { IndustryGrid } from "@/components/industry/IndustryGrid";
import { Reveal } from "@/components/motion/Reveal";
import { InternalPageHero } from "@/components/sections/InternalPageHero";
import { PageCta } from "@/components/sections/PageCta";
import { serviceHeroActions, INDUSTRY_SERVICE_HEROES } from "@/lib/content/industry-heroes";
import { SectionTitle } from "@/components/typography";
import { INDUSTRY_LINKS } from "@/lib/industries/nav";
import {
  MARKETING_PROGRAMS_CTA,
  MARKETING_PROGRAMS_HERO_VISUALS,
  MARKETING_PROGRAMS_INTRO,
} from "@/lib/content/marketing-program-directory";
import styles from "./MarketingProgramDirectory.module.css";

const UPLOADS = "/wp-content/uploads";

/* The channels a program draws on, at equal weight; one strategy decides the mix */
const CHANNELS = [
  {
    name: "Website & E-Commerce",
    line: "Fast, flexible sites and stores that turn traffic into results.",
    href: "/services/website-development/",
  },
  {
    name: "Social Media",
    line: "Content and paid social that keep the brand in the feed.",
    href: "/services/social-media-marketing/",
  },
  {
    name: "Search & SEO",
    line: "Technical, content and local search that compounds.",
    href: "/services/search-engine-optimization/",
  },
  {
    name: "Email",
    line: "Campaigns and automation that bring customers back.",
    href: "/services/email-marketing/",
  },
  {
    name: "Media",
    line: "Planning and buying across TV, radio, streaming and outdoor.",
    href: "/services/#advertising-media",
  },
];

const INDUSTRY_NAMES = INDUSTRY_LINKS.map((link) => link.label.replace(/ Marketing$/, ""));

/* Live Sparkle Dental Spa placements: one practice carried across them */
const CAMPAIGN = {
  outdoor: { src: `${UPLOADS}/2026/06/outdoor-advertising.jpg`, alt: "A Sparkle Dental Spa poster with a bright smile in a transit shelter" },
  website: { src: `${UPLOADS}/2026/07/Dental-Web-Development.jpg`, alt: "The Sparkle Dental Spa website on a laptop" },
  social: { src: `${UPLOADS}/2026/07/Social-Media-Dental.jpg`, alt: "Sparkle Dental Spa social posts of the reception, a gold tooth and products" },
  site: { src: `${UPLOADS}/2026/07/Screenshot-2026-07-22-at-11.22.57-PM.jpg`, alt: "The Sparkle Dental Spa site on a phone" },
};

/* What the partnership brings, each shown with real KC work */
const DISCIPLINES = [
  {
    name: "Strategy",
    line: "Where to compete and how to grow.",
    image: { src: `${UPLOADS}/2026/09/henderson-inclusive-strategy-edited.jpg`, alt: "A team fitting coloured gears together on a meeting table" },
  },
  {
    name: "Creative",
    line: "Ideas and execution that make the brand memorable.",
    image: { src: `${UPLOADS}/2026/06/corporate-branding.jpg`, alt: "A brand identity sheet with logo, colours, type and applications" },
  },
  {
    name: "Media",
    line: "Planning and buying across the right channels.",
    image: { src: `${UPLOADS}/2024/03/digital-superboard.webp`, alt: "A Pattison digital superboard beside a highway" },
  },
  {
    name: "Digital",
    line: "Search, social, websites and measurable performance.",
    image: { src: `${UPLOADS}/2026/06/hvac-social-media-marketing-1.jpg`, alt: "HVAC social posts on a phone" },
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function MarketingProgramDirectory() {
  const heroImage = MARKETING_PROGRAMS_HERO_VISUALS[0];
  const actions = serviceHeroActions();

  return (
    <>
      <InternalPageHero
        eyebrow={INDUSTRY_SERVICE_HEROES.programs.eyebrow}
        titlePrimary="Marketing"
        titleSecondary="Programs"
        description={MARKETING_PROGRAMS_INTRO.description}
        backgroundImage={heroImage.src}
        primaryCTA={{ label: MARKETING_PROGRAMS_INTRO.cta.label, href: MARKETING_PROGRAMS_INTRO.cta.href }}
        secondaryCTA={actions.secondaryCta}
      />

      <div className={styles.page}>
        {/* Industries: every program at the same size and weight */}
        <section className={styles.industries} aria-labelledby="mp-industry">
          <div className="container">
            <p className={styles.label}>Industry marketing</p>
            <SectionTitle id="mp-industry" className={styles.title}>
              Industry marketing built around how your business actually works.
            </SectionTitle>
            <IndustryGrid
              linkLabel="Explore program"
              closing={{
                title: "Not sure which fits?",
                line: "Tell us about your business and we’ll recommend the right program.",
                label: "Talk to us",
                href: "/contact/",
              }}
            />
          </div>
        </section>

        {/* 1. The mix: industry in, one strategy at the centre, channels chosen around it, outcomes out */}
        <section className={styles.mix} aria-labelledby="mp-mix">
          <div className="container">
            <p className={styles.label}>How a program comes together</p>
            <SectionTitle id="mp-mix" className={styles.title}>
              Industry knowledge meets channel expertise.
            </SectionTitle>
            <p className={styles.lead}>
              We start with how your industry buys, build one strategy around it, then run it across the channels
              that reach your customers.
            </p>
            <div className={styles.board}>
              <div className={styles.boardIndustry}>
                <p className={styles.boardHeading}>Your industry</p>
                <ul className={styles.industryTags}>
                  {INDUSTRY_NAMES.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
              <Reveal variant="fade" className={styles.core}>
                <p className={styles.coreKicker}>One strategy</p>
                <p className={styles.coreStatement}>One plan, one budget, one set of goals.</p>
                <p className={styles.coreOutcome}>
                  <span>Measured by</span>
                  Leads, bookings and revenue you can measure.
                </p>
              </Reveal>
              <div className={styles.boardChannels}>
                <p className={styles.boardHeading}>The channels it calls for</p>
                <ul className={styles.channelList}>
                  {CHANNELS.map((channel, index) => (
                    <Reveal key={channel.href} as="li" delay={index * 70}>
                      <Link href={channel.href} className={styles.channel}>
                        <span className={styles.channelCopy}>
                          <span className={styles.channelName}>{channel.name}</span>
                          <span className={styles.channelLine}>{channel.line}</span>
                        </span>
                        <span className={styles.channelArrow} aria-hidden="true">
                          <ArrowIcon />
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 2. The idea first, then one real program as the example */}
        <section className={styles.campaign} aria-labelledby="mp-campaign">
          <div className="container">
            <p className={styles.label}>What it looks like in market</p>
            <SectionTitle id="mp-campaign" className={styles.title}>
              One strategy. Every channel.
            </SectionTitle>
            <p className={styles.lead}>
              A complete program carries the same positioning and creative across every touchpoint, physical and
              digital, so each placement reinforces the others. For Sparkle Dental Spa, a Medical &amp; Dental Marketing
              client, that meant one look and one message from the street to the screen.
            </p>
            <div className={styles.campaignBoard}>
              <Reveal variant="fade" className={`${styles.shot} ${styles.shotOutdoor}`}>
                <Image src={CAMPAIGN.outdoor.src} alt={CAMPAIGN.outdoor.alt} fill sizes="(min-width: 960px) 34vw, 50vw" className={styles.cover} />
                <span className={styles.shotLabel}>Transit shelter</span>
              </Reveal>
              <Reveal delay={90} className={`${styles.shot} ${styles.shotWebsite}`}>
                <Image src={CAMPAIGN.website.src} alt={CAMPAIGN.website.alt} fill sizes="(min-width: 960px) 40vw, 50vw" className={styles.cover} />
                <span className={styles.shotLabel}>Website</span>
              </Reveal>
              <Reveal delay={180} className={`${styles.shot} ${styles.shotSocial}`}>
                <Image src={CAMPAIGN.social.src} alt={CAMPAIGN.social.alt} fill sizes="(min-width: 960px) 22vw, 50vw" className={styles.cover} />
                <span className={styles.shotLabel}>Social</span>
              </Reveal>
              <Reveal delay={270} className={`${styles.shot} ${styles.shotMobile}`}>
                <span className={styles.phone}>
                  <span className={styles.phoneScreen}>
                    <Image src={CAMPAIGN.site.src} alt={CAMPAIGN.site.alt} fill sizes="140px" className={styles.cover} style={{ objectPosition: "20% 0%" }} />
                  </span>
                </span>
                <span className={styles.shotLabel}>Mobile</span>
              </Reveal>
            </div>
            <div className={styles.campaignFoot}>
              <p>Sparkle Dental Spa: transit, website, social and mobile, all live work.</p>
              <Link href="/services/dental-marketing/" className={styles.textLink}>
                Medical &amp; Dental Marketing
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. The partner: four disciplines adding up to one program */}
        <section className={styles.partner} aria-labelledby="mp-partner">
          <div className={`container ${styles.partnerGrid}`}>
            <div className={styles.partnerCopy}>
              <p className={styles.label}>Full-service partnership</p>
              <SectionTitle id="mp-partner" className={styles.title}>
                More than a campaign. A complete marketing partner.
              </SectionTitle>
              <p className={styles.lead}>
                Strategy, creative, media and digital under one roof, so every program works as one.
              </p>
            </div>
            <ul className={styles.layers}>
              {DISCIPLINES.map((discipline, index) => (
                <Reveal key={discipline.name} as="li" delay={index * 110} className={styles.layer}>
                  <span className={styles.layerThumb}>
                    <Image src={discipline.image.src} alt={discipline.image.alt} fill sizes="120px" className={styles.cover} />
                  </span>
                  <span className={styles.layerCopy}>
                    <span className={styles.layerName}>{discipline.name}</span>
                    <span className={styles.layerLine}>{discipline.line}</span>
                  </span>
                </Reveal>
              ))}
              <li className={styles.layerSum}>One coordinated program</li>
            </ul>
          </div>
        </section>
      </div>

      <PageCta className={styles.cta} cta={MARKETING_PROGRAMS_CTA} />
    </>
  );
}
