import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { PageCta } from "@/components/sections/PageCta";
import { SectionTitle } from "@/components/typography";
import { MediaPreview, type MediaService } from "./MediaPreview";
import styles from "./ServicesOverview.module.css";

const UPLOADS = "https://staging.kosick.com/wp-content/uploads";

const CHAPTERS = [
  { id: "advertising-media", name: "Advertising & Media" },
  { id: "brand-creative", name: "Brand & Creative" },
  { id: "digital-marketing", name: "Digital Marketing" },
  { id: "industry-marketing", name: "Industry Marketing" },
  { id: "events", name: "Events" },
  { id: "business-development", name: "Business Development" },
];

const MEDIA: MediaService[] = [
  {
    name: "Television Advertising",
    line: "Broadcast and streaming TV for reach and brand recall.",
    href: "/services/television-advertising/",
    image: { src: `${UPLOADS}/2026/06/tv-streaming-advertising-1.jpg`, alt: "Living-room television open to the Prime Video app" },
  },
  {
    name: "Radio Advertising",
    line: "Local stations and streaming audio that build frequency.",
    href: "/services/radio-advertising/",
    image: { src: `${UPLOADS}/2021/07/audio-recording.jpg`, alt: "Studio condenser microphone" },
  },
  {
    name: "Outdoor Advertising",
    line: "Billboards, superboards and transit across Canadian cities.",
    href: "/services/outdoor-advertising/",
    image: { src: `${UPLOADS}/2026/01/outdoor-advertising.jpg`, alt: "Trane “We run together” billboard on a rooftop structure" },
  },
  {
    name: "Digital Video Advertising",
    line: "Connected TV, pre-roll and outstream placements.",
    href: "/services/digital-connected-tv/",
    image: { src: `${UPLOADS}/2026/06/digital-streaming-advertising-1.jpg`, alt: "Wall-mounted television showing a Formula 1 race" },
  },
  {
    name: "Media Buying",
    line: "Negotiated rates and planned flights across every channel.",
    href: "/services/digital-marketing/",
    image: { src: `${UPLOADS}/2026/02/media-buying.jpg`, alt: "Media buying campaign creative" },
  },
];

const BRAND = {
  branding: {
    name: "Strategic Corporate Branding",
    line: "Identity systems built to last.",
    href: "/services/corporate-branding/",
    image: { src: `${UPLOADS}/2026/06/corporate-branding.jpg`, alt: "Identity sheet with logo, colour palette, typography, icons and applications" },
  },
  creative: {
    name: "Creative & Production",
    line: "Video, photography, design and 3D.",
    href: "/services/creative/",
    image: { src: `${UPLOADS}/2021/07/video-scaled.jpg`, alt: "Camera operator filming with a handheld rig" },
  },
  development: {
    name: "Business Development",
    line: "Strategy for growth, sale and succession.",
    href: "/services/business-development/",
    image: { src: `${UPLOADS}/2026/09/henderson-inclusive-strategy-edited.jpg`, alt: "A team fitting coloured gears together on a meeting table" },
  },
};

const DIGITAL = [
  { name: "Search Engine Optimization", line: "Rankings and local visibility that compound over time.", href: "/services/search-engine-optimization/" },
  { name: "Social Media Marketing", line: "Strategy, content and paid social across every platform.", href: "/services/social-media-marketing/" },
  { name: "Email Marketing", line: "Campaigns and automations that keep customers coming back.", href: "/services/email-marketing/" },
];

const INDUSTRIES = {
  hvac: {
    name: "HVAC Marketing",
    line: "Campaigns and co-op programs for dealers and manufacturers.",
    href: "/services/hvac-marketing/",
    image: { src: `${UPLOADS}/2026/03/hvac-marketing.jpg`, alt: "A Napoleon air conditioner beside a home and garden" },
  },
  dental: {
    name: "Dental Marketing",
    line: "Patient growth for modern practices.",
    href: "/services/dental-marketing/",
    image: { src: `${UPLOADS}/2026/07/Dental-Vancouver.jpg`, alt: "The Sparkle Dental Spa waiting room with a gold tooth on the table" },
  },
  golf: {
    name: "Golf Marketing",
    line: "Rounds, memberships and events for clubs and courses.",
    href: "/services/golf-marketing/",
    image: { src: `${UPLOADS}/2026/03/golf-course-branding.jpg`, alt: "A golfer walking down a sunlit fairway with his bag" },
  },
};

const EVENT_IMAGE = {
  src: `${UPLOADS}/2025/08/IMG_2596-scaled.jpg`,
  alt: "A presenter on stage in front of a Trane screen aboard the Sun Princess",
};

const DEVELOPMENT = [
  { name: "Growth Strategy", line: "Clarify direction, identify opportunities and build a plan for sustainable growth.", href: "/services/business-development/#growth" },
  { name: "Corporate Sales", line: "Prepare, position and support the business through a sale or acquisition.", href: "/services/business-development/#sales" },
  { name: "Legal & Compliance", line: "Navigate corporate structure, documentation and transaction requirements.", href: "/services/business-development/#legal" },
  { name: "Exit Strategy", line: "Prepare the business for transition, succession or sale.", href: "/services/business-development/#exit" },
];

const CTA = {
  title: "Ready to grow your brand?",
  description: "Tell us where you want to go, and we’ll build the plan to get there.",
  primary: { label: "Start a Project", href: "/contact/" },
  phone: { label: "(604) 925-5800", href: "tel:+16049255800" },
};

function Arrow() {
  return (
    <span className={styles.arrow} aria-hidden="true">
      →
    </span>
  );
}

function ChapterHead({
  index,
  id,
  title,
  lead,
  dark = false,
}: {
  index: number;
  id: string;
  title: string;
  lead: string;
  dark?: boolean;
}) {
  return (
    <div className={styles.head}>
      <p className={dark ? styles.labelOnDark : styles.label}>{String(index + 1).padStart(2, "0")}</p>
      <SectionTitle as="h2" id={`${id}-title`} className={dark ? styles.titleOnDark : styles.title}>
        {title}
      </SectionTitle>
      <p className={dark ? styles.leadOnDark : styles.lead}>{lead}</p>
    </div>
  );
}

/** The services index: an overview and six chapters, each with its own composition. */
export function ServicesOverview() {
  return (
    <>
      {/* Overview and chapter index */}
      <section className={styles.intro} aria-labelledby="services-intro">
        <div className="container">
          <p className={styles.label}>Our services</p>
          <SectionTitle as="h2" id="services-intro" className={styles.display}>
            Everything your brand needs to grow.
          </SectionTitle>
          <p className={styles.lead}>
            Strategy, creative, media, digital, events and business development, brought together under one team.
          </p>
          <nav aria-label="Service families">
            <ol className={styles.index}>
              {CHAPTERS.map((chapter, index) => (
                <li key={chapter.id}>
                  <a href={`#${chapter.id}`} className={styles.indexLink}>
                    <span className={styles.indexNumber}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.indexName}>{chapter.name}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* 01 Advertising & Media: one large image that follows the hovered service */}
      <section id={CHAPTERS[0]!.id} className={`${styles.chapter} ${styles.dark}`} aria-labelledby={`${CHAPTERS[0]!.id}-title`}>
        <div className="container">
          <ChapterHead
            index={0}
            id={CHAPTERS[0]!.id}
            title="Advertising & Media"
            lead="Television, radio, outdoor and digital video, planned and bought as one media mix."
            dark
          />
          <MediaPreview services={MEDIA} />
        </div>
      </section>

      {/* 02 Brand & Creative: an asymmetric portfolio collage */}
      <section id={CHAPTERS[1]!.id} className={styles.chapter} aria-labelledby={`${CHAPTERS[1]!.id}-title`}>
        <div className="container">
          <ChapterHead
            index={1}
            id={CHAPTERS[1]!.id}
            title="Brand & Creative"
            lead="Identity, production and growth strategy shaped by one creative team."
          />
          <div className={styles.collage}>
            {(["branding", "creative", "development"] as const).map((key, index) => {
              const item = BRAND[key];
              return (
                <Reveal key={key} variant="scale" delay={index * 120} className={styles[`collage_${key}`]}>
                  <Link href={item.href} className={styles.tile}>
                    <span className={styles.tileImage}>
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes={key === "branding" ? "(min-width: 960px) 60vw, 100vw" : "(min-width: 960px) 38vw, 100vw"}
                        className={styles.cover}
                      />
                    </span>
                    <span className={styles.tileCaption}>
                      <span className={styles.tileName}>{item.name}</span>
                      <span className={styles.tileLine}>{item.line}</span>
                      <Arrow />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 03 Digital Marketing: a browser view of the website work with the other capabilities beside it */}
      <section id={CHAPTERS[2]!.id} className={`${styles.chapter} ${styles.warm}`} aria-labelledby={`${CHAPTERS[2]!.id}-title`}>
        <div className="container">
          <ChapterHead
            index={2}
            id={CHAPTERS[2]!.id}
            title="Digital Marketing"
            lead="Websites, search, social and email working as one system."
          />
          <div className={styles.digital}>
            <Link href="/services/website-development/" className={styles.browserLink}>
              <span className={styles.browser}>
                <span className={styles.browserBar} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.browserView}>
                  <Image
                    src={`${UPLOADS}/2026/07/Honest-Cleaning-Website.jpg`}
                    alt="Honest Cleaning & Services home page"
                    fill
                    sizes="(min-width: 960px) 58vw, 100vw"
                    className={styles.coverTop}
                  />
                </span>
              </span>
              <span className={styles.browserCaption}>
                <span className={styles.tileName}>Website Development &amp; E-Commerce</span>
                <span className={styles.tileLine}>Custom sites and online stores built to convert.</span>
                <span className={styles.explore}>
                  Explore <Arrow />
                </span>
              </span>
            </Link>
            <ul className={styles.capabilities}>
              {DIGITAL.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.capability}>
                    <span className={styles.capabilityName}>{item.name}</span>
                    <span className={styles.capabilityLine}>{item.line}</span>
                    <span className={styles.explore}>
                      Explore <Arrow />
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services/digital-marketing/" className={styles.textLink}>
                  All digital marketing <Arrow />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 04 Industry Marketing: one featured industry, two supporting */}
      <section id={CHAPTERS[3]!.id} className={styles.chapter} aria-labelledby={`${CHAPTERS[3]!.id}-title`}>
        <div className="container">
          <ChapterHead
            index={3}
            id={CHAPTERS[3]!.id}
            title="Industry Marketing"
            lead="Specialist programs for the industries we know best."
          />
          <div className={styles.industries}>
            {(["hvac", "dental", "golf"] as const).map((key) => {
              const item = INDUSTRIES[key];
              return (
                <Link key={key} href={item.href} className={`${styles.world} ${styles[`world_${key}`]}`}>
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes={key === "hvac" ? "(min-width: 960px) 62vw, 100vw" : "(min-width: 960px) 36vw, 100vw"}
                    className={styles.cover}
                  />
                  <span className={styles.worldShade} aria-hidden="true" />
                  <span className={styles.worldCopy}>
                    <span className={styles.worldName}>{item.name}</span>
                    <span className={styles.worldLine}>{item.line}</span>
                    <Arrow />
                  </span>
                </Link>
              );
            })}
          </div>
          <Link href="/marketing-programs/" className={styles.textLink}>
            All marketing programs <Arrow />
          </Link>
        </div>
      </section>

      {/* 05 Events: one full-width photograph */}
      <section id={CHAPTERS[4]!.id} className={styles.events} aria-labelledby={`${CHAPTERS[4]!.id}-title`}>
        <Image src={EVENT_IMAGE.src} alt={EVENT_IMAGE.alt} fill sizes="100vw" className={styles.cover} />
        <div className={styles.eventsShade} aria-hidden="true" />
        <div className={`container ${styles.eventsInner}`}>
          <p className={styles.labelOnDark}>05</p>
          <SectionTitle as="h2" id={`${CHAPTERS[4]!.id}-title`} className={styles.titleOnDark}>
            Corporate Events
          </SectionTitle>
          <p className={styles.leadOnDark}>
            Experiences, incentives, trade shows and gatherings designed to bring people together.
          </p>
          <Link href="/corporate-events/" className={styles.buttonLight}>
            Explore corporate events
          </Link>
        </div>
      </section>

      {/* 06 Business Development: dark, ruled rows */}
      <section id={CHAPTERS[5]!.id} className={`${styles.chapter} ${styles.dark}`} aria-labelledby={`${CHAPTERS[5]!.id}-title`}>
        <div className="container">
          <ChapterHead
            index={5}
            id={CHAPTERS[5]!.id}
            title="Business Development"
            lead="Strategy, sales, legal and succession support for owners planning what comes next."
            dark
          />
          <ol className={styles.rows}>
            {DEVELOPMENT.map((item, index) => (
              <li key={item.name}>
                <Link href={item.href} className={styles.row}>
                  <span className={styles.rowNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.rowName}>{item.name}</span>
                  <span className={styles.rowLine}>{item.line}</span>
                  <Arrow />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <PageCta cta={CTA} />
    </>
  );
}
