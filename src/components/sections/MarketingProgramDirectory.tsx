import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { InternalPageHero } from "@/components/sections/InternalPageHero";
import { PageCta } from "@/components/sections/PageCta";
import { serviceHeroActions, INDUSTRY_SERVICE_HEROES } from "@/lib/content/industry-heroes";
import { SectionTitle } from "@/components/typography";
import {
  MARKETING_PROGRAMS_CTA,
  MARKETING_PROGRAMS_HERO_VISUALS,
  MARKETING_PROGRAMS_INTRO,
} from "@/lib/content/marketing-program-directory";
import styles from "./MarketingProgramDirectory.module.css";

const UPLOADS = "https://staging.kosick.com/wp-content/uploads";

const INDUSTRIES = {
  hvac: {
    name: "HVAC Marketing",
    line: "Omni-channel programs that keep a dealer’s schedule full, year-round.",
    href: "/services/hvac-marketing/",
    image: { src: `${UPLOADS}/2026/06/hvac-billboard-advertising.jpg`, alt: "Heat pump billboard above a street corner" },
  },
  dental: {
    name: "Dental Marketing",
    line: "Visibility, trust and booked appointments for growing practices.",
    href: "/services/dental-marketing/",
    image: { src: `${UPLOADS}/2026/07/Dental-Marketing.jpg`, alt: "A hygienist with a patient in the chair" },
  },
  golf: {
    name: "Golf Marketing",
    line: "Rounds, memberships and tournaments for courses and clubs.",
    href: "/services/golf-marketing/",
    image: { src: `${UPLOADS}/2026/03/golf-course-branding.jpg`, alt: "A golfer walking a sunlit fairway" },
  },
};

const DIGITAL = {
  website: {
    name: "Website Development & E-Commerce",
    line: "Fast, flexible sites and stores that turn traffic into results.",
    href: "/services/website-development/",
    image: { src: `${UPLOADS}/2025/07/home-services-website-design.webp`, alt: "The DirectBuy Furnace website on a laptop" },
  },
  supporting: [
    {
      name: "Social Media Marketing",
      line: "Content and paid social that keep the brand in the feed.",
      href: "/services/social-media-marketing/",
      image: { src: `${UPLOADS}/2026/06/social-media-advertising.jpg`, alt: "The Kosick Instagram profile on a phone" },
    },
    {
      name: "Email Marketing",
      line: "Campaigns and automation that bring customers back.",
      href: "/services/email-marketing/",
      image: { src: `${UPLOADS}/2026/07/Email-Marketing.jpg`, alt: "A garden centre email open in Mailchimp" },
    },
    {
      name: "Search Engine Optimization",
      line: "Technical, content and local search that compounds.",
      href: "/services/search-engine-optimization/",
      image: { src: `${UPLOADS}/2026/06/digital-marketing-services-1.jpg`, alt: "A Google search for a furnace installer on a phone" },
    },
  ],
};

const SYSTEM = {
  industries: ["HVAC", "Dental", "Golf"],
  channels: ["Search", "Social", "Email", "Web", "Media"],
};

/* Sparkle Dental Spa, one practice carried across its placements */
const CAMPAIGN = {
  outdoor: { src: `${UPLOADS}/2026/06/outdoor-advertising.jpg`, alt: "Sparkle Dental Spa transit shelter ad" },
  website: { src: `${UPLOADS}/2026/07/Dental-Web-Development.jpg`, alt: "The Sparkle Dental Spa website on a laptop" },
  site: { src: `${UPLOADS}/2026/07/Screenshot-2026-07-22-at-11.22.57-PM.jpg`, alt: "Sparkle Dental Spa site on a phone" },
  social: { src: `${UPLOADS}/2026/07/Social-Media-Dental.jpg`, alt: "Sparkle Dental Spa social content" },
};

const PARTNERSHIP = [
  { name: "Strategy", line: "Where to compete and how to grow." },
  { name: "Creative", line: "Ideas and execution that make the brand memorable." },
  { name: "Media", line: "Planning and buying across the right channels." },
  { name: "Digital", line: "Search, social, websites and measurable performance." },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ProgramLink({ label }: { label: string }) {
  return (
    <span className={styles.explore}>
      Explore {label}
      <ArrowIcon />
    </span>
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
        {/* Industries: one large world and two smaller ones */}
        <section className={styles.industries} aria-labelledby="mp-industry">
          <div className="container">
            <p className={styles.label}>Industry marketing</p>
            <SectionTitle id="mp-industry" className={styles.title}>
              Industry marketing built around how your business actually works.
            </SectionTitle>
            <div className={styles.industryGrid}>
              {(["hvac", "dental", "golf"] as const).map((key, index) => {
                const item = INDUSTRIES[key];
                return (
                  <Reveal key={key} delay={index * 110} className={key === "hvac" ? `${styles.world} ${styles.worldLarge}` : styles.world}>
                    <Link href={item.href} className={styles.worldLink}>
                      <Image src={item.image.src} alt={item.image.alt} fill sizes={key === "hvac" ? "(min-width: 960px) 58vw, 100vw" : "(min-width: 960px) 40vw, 100vw"} className={styles.cover} />
                      <span className={styles.worldShade} aria-hidden="true" />
                      <span className={styles.worldCopy}>
                        <span className={styles.worldName}>{item.name}</span>
                        <span className={styles.worldLine}>{item.line}</span>
                        <ProgramLink label="program" />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Digital: one featured capability beside three ruled rows */}
        <section className={styles.digital} aria-labelledby="mp-digital">
          <div className="container">
            <p className={styles.label}>Digital marketing</p>
            <SectionTitle id="mp-digital" className={styles.title}>
              The channels that carry the program.
            </SectionTitle>
            <div className={styles.digitalGrid}>
              <Reveal variant="fade" className={styles.featured}>
                <Link href={DIGITAL.website.href} className={styles.featuredLink}>
                  <span className={styles.featuredFrame}>
                    <Image src={DIGITAL.website.image.src} alt={DIGITAL.website.image.alt} fill sizes="(min-width: 960px) 55vw, 100vw" className={styles.cover} />
                  </span>
                  <span className={styles.featuredName}>{DIGITAL.website.name}</span>
                  <span className={styles.featuredLine}>{DIGITAL.website.line}</span>
                  <ProgramLink label="program" />
                </Link>
              </Reveal>
              <ul className={styles.capabilities}>
                {DIGITAL.supporting.map((item, index) => (
                  <Reveal key={item.href} as="li" delay={index * 100}>
                    <Link href={item.href} className={styles.capability}>
                      <span className={styles.capThumb}>
                        <Image src={item.image.src} alt={item.image.alt} fill sizes="160px" className={styles.cover} />
                      </span>
                      <span className={styles.capCopy}>
                        <span className={styles.capName}>{item.name}</span>
                        <span className={styles.capLine}>{item.line}</span>
                      </span>
                      <span className={styles.capArrow} aria-hidden="true">
                        <ArrowIcon />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* System: industry knowledge and channels meet in one strategy */}
        <section className={styles.system} aria-labelledby="mp-system">
          <div className="container">
            <p className={styles.labelOnDark}>How it fits together</p>
            <SectionTitle id="mp-system" className={styles.titleOnDark}>
              Industry knowledge meets channel expertise.
            </SectionTitle>
            <p className={styles.leadOnDark}>
              We start with how your industry buys, build one strategy around it, then run it across the channels
              that reach your customers.
            </p>
            <ol className={styles.flow}>
              <Reveal as="li" className={styles.flowStep}>
                <span className={styles.flowNumber}>01</span>
                <span className={styles.flowName}>Industry</span>
                <span className={styles.flowTags}>
                  {SYSTEM.industries.map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                </span>
              </Reveal>
              <Reveal as="li" delay={120} className={styles.flowStep}>
                <span className={styles.flowNumber}>02</span>
                <span className={styles.flowName}>Strategy</span>
                <span className={styles.flowNote}>One plan, one budget, one set of goals.</span>
              </Reveal>
              <Reveal as="li" delay={240} className={styles.flowStep}>
                <span className={styles.flowNumber}>03</span>
                <span className={styles.flowName}>Channels</span>
                <span className={styles.flowTags}>
                  {SYSTEM.channels.map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                </span>
              </Reveal>
              <Reveal as="li" delay={360} className={`${styles.flowStep} ${styles.flowEnd}`}>
                <span className={styles.flowNumber}>04</span>
                <span className={styles.flowName}>Results</span>
                <span className={styles.flowNote}>Leads, bookings and revenue you can measure.</span>
              </Reveal>
            </ol>
          </div>
        </section>

        {/* Campaign: one practice across its placements */}
        <section className={styles.campaign} aria-labelledby="mp-campaign">
          <div className="container">
            <p className={styles.label}>Sparkle Dental Spa</p>
            <SectionTitle id="mp-campaign" className={styles.display}>
              One strategy. Every channel.
            </SectionTitle>
            <p className={styles.lead}>
              One practice, one look and one message, carried from the street to the screen.
            </p>
            <div className={styles.mosaic}>
              <Reveal variant="fade" className={`${styles.tile} ${styles.tileOutdoor}`}>
                <Image src={CAMPAIGN.outdoor.src} alt={CAMPAIGN.outdoor.alt} fill sizes="(min-width: 960px) 40vw, 100vw" className={styles.cover} />
                <span className={styles.tileLabel}>Outdoor</span>
              </Reveal>
              <Reveal delay={90} className={`${styles.tile} ${styles.tileWebsite}`}>
                <Image src={CAMPAIGN.website.src} alt={CAMPAIGN.website.alt} fill sizes="(min-width: 960px) 30vw, 50vw" className={styles.cover} />
                <span className={styles.tileLabel}>Website</span>
              </Reveal>
              <Reveal delay={180} className={`${styles.tile} ${styles.tileSearch}`}>
                <span className={styles.searchCard} aria-hidden="true">
                  <span className={styles.searchQuery}>dentist south surrey</span>
                  <span className={styles.searchTag}>Sponsored</span>
                  <span className={styles.searchTitle}>Sparkle Dental Spa</span>
                  <span className={styles.searchUrl}>sparkledentalspa.ca</span>
                </span>
                <span className={styles.tileLabel}>Search</span>
              </Reveal>
              <Reveal delay={270} className={`${styles.tile} ${styles.tileSocial}`}>
                <Image src={CAMPAIGN.social.src} alt={CAMPAIGN.social.alt} fill sizes="(min-width: 960px) 30vw, 50vw" className={styles.cover} />
                <span className={styles.tileLabel}>Social</span>
              </Reveal>
              <Reveal delay={360} className={`${styles.tile} ${styles.tileMobile}`}>
                <span className={styles.phone}>
                  <span className={styles.phoneScreen}>
                    <Image src={CAMPAIGN.site.src} alt={CAMPAIGN.site.alt} fill sizes="160px" className={styles.cover} style={{ objectPosition: "20% 0%" }} />
                  </span>
                </span>
                <span className={styles.tileLabel}>Mobile</span>
              </Reveal>
            </div>
            <p className={styles.caption}>Search result is illustrative. All other placements are live Sparkle Dental Spa work.</p>
          </div>
        </section>

        {/* Partnership: four large rows */}
        <section className={styles.partner} aria-labelledby="mp-partner">
          <div className="container">
            <p className={styles.labelOnDark}>Full-service partnership</p>
            <SectionTitle id="mp-partner" className={styles.titleOnDark}>
              More than a campaign. A complete marketing partner.
            </SectionTitle>
            <p className={styles.leadOnDark}>
              Strategy, creative, media and digital under one roof, so every program works as one.
            </p>
            <ol className={styles.rows}>
              {PARTNERSHIP.map((row, index) => (
                <li key={row.name} className={styles.row}>
                  <span className={styles.rowNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.rowName}>{row.name}</span>
                  <span className={styles.rowLine}>{row.line}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>

      <PageCta className={styles.cta} cta={MARKETING_PROGRAMS_CTA} />
    </>
  );
}
