import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import { AudioSession, type AudioLane } from "./AudioSession";
import { CapabilitySelector, type Capability } from "./CapabilitySelector";
import { MotionStoryboard, type StoryboardFrame } from "./MotionStoryboard";
import { ReelPlayer } from "./ReelPlayer";
import styles from "./CreativeProductionPage.module.css";

const UPLOADS = "https://staging.kosick.com/wp-content/uploads";

const FILMS = {
  spot: { src: `${UPLOADS}/2024/03/hvac.mp4`, poster: "/images/creative/reel-spot.jpg" },
  render: { src: `${UPLOADS}/2017/12/2016-12-21_CGI.mp4`, poster: "/images/creative/render-aerial.jpg" },
  motion: { src: `${UPLOADS}/2024/03/tr_how-we-run_70_16x9_020323104508_hd-1.mp4`, duration: 69.875 },
};

const STORYBOARD: StoryboardFrame[] = [
  { time: 7, poster: "/images/creative/motion-01.jpg", label: "Product reveal" },
  { time: 24.5, poster: "/images/creative/motion-02.jpg", label: "Interface overlay" },
  { time: 42, poster: "/images/creative/motion-03.jpg", label: "Particle pass" },
  { time: 59.4, poster: "/images/creative/motion-04.jpg", label: "Effects and data" },
];

/** `slot` sets the tile's place in the simplified tablet and mobile sequence. */
type WallTile = { src: string; alt: string; label: string; width: number; height: number; slot: string };

const WALL: WallTile[][] = [
  [
    { src: `${UPLOADS}/2023/06/packaging.jpg`, alt: "Underwear packaging boxes fanned out in a row", label: "Packaging", width: 870, height: 542, slot: "slotPackaging" },
    { src: `${UPLOADS}/2023/06/MBYMockupcards2.jpeg`, alt: "Business cards in a tonal colour range", label: "Stationery", width: 1280, height: 865, slot: "slotStationery" },
    { src: `${UPLOADS}/2026/06/arcteryx-billboard-advertising.jpg`, alt: "Arc’teryx transit shelter outdoor advertising", label: "Transit shelter", width: 1409, height: 1116, slot: "slotTransit" },
  ],
  [
    { src: `${UPLOADS}/2026/06/corporate-branding.jpg`, alt: "Identity sheet with logo, colour palette, typography, icons and applications", label: "Identity system", width: 1122, height: 1402, slot: "slotIdentity" },
  ],
  [
    { src: `${UPLOADS}/2026/06/hvac-billboard-advertising.jpg`, alt: "Billboard for high-efficiency heat pumps above a street corner", label: "Billboard", width: 1122, height: 1402, slot: "slotBillboard" },
    { src: `${UPLOADS}/2026/06/social-media-marketing.jpg`, alt: "Social media page design shown on desktop and mobile", label: "Social", width: 1536, height: 1024, slot: "slotSocial" },
  ],
];

const RENDER_STILLS = {
  model: {
    src: `${UPLOADS}/2023/06/KOSICK-MODEL-LOWER-LEVEL-MARCH-17-2023-ROUGH-2-1-e1686846929767.jpg`,
    alt: "Architectural model of a concrete building, lower level",
    caption: "Lower-level model, rough pass.",
  },
  interior: {
    src: `${UPLOADS}/2023/06/tcs2017-08_noritz_basement_front_final_v1-2-1-e1687153222220.jpg`,
    alt: "Wall-mounted water heater in a finished basement",
    caption: "Product shown in a finished basement scene.",
  },
};

const AUDIO_LANES: AudioLane[] = [
  { name: "Voice-over", detail: "Professional talent", shape: "voice" },
  { name: "Commercial", detail: "Audio for the spot", shape: "bed" },
  { name: "Effects", detail: "Sound design", shape: "hits" },
  { name: "Mix & master", detail: "Final levels", shape: "master" },
];

type CraftIconName = "storyboard" | "camera" | "grade" | "slate";

const VIDEO_CRAFT: { title: string; icon: CraftIconName }[] = [
  { title: "Pre-production, storyboarding and creative direction", icon: "storyboard" },
  { title: "Cinematography with professional lighting and sound", icon: "camera" },
  { title: "Editing, colour grading and sound design", icon: "grade" },
  { title: "Commercials, corporate films and brand documentaries", icon: "slate" },
];

const CRAFT_PATHS: Record<CraftIconName, string> = {
  storyboard: "M6 4h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM9 8h6M9 12h6M9 16h3",
  camera: "M4 7h11a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1ZM16 10.5l5-3v9l-5-3",
  grade: "M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1M15 5v4M9 10v4M17 15v4",
  slate: "M4 10h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9ZM4 10 3.4 6.6a1 1 0 0 1 .8-1.2l13.8-2.4a1 1 0 0 1 1.2.8L19.6 7M8 4.6 10 9M13 3.7 15 8.2",
};

function CraftIcon({ name }: { name: CraftIconName }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d={CRAFT_PATHS[name]} />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function sentence(text: string) {
  return text.replace(/,? and /g, " and ").replace(/\s+/g, " ").trim().replace(/([^.])$/, "$1.");
}

type CreativeProductionPageProps = {
  content: ServicePageContent;
};

export function CreativeProductionPage({ content }: CreativeProductionPageProps) {
  const { hero, faqs, cta } = content;
  const cards = content.offerGroups[0]?.cards ?? [];
  const related = content.relatedServices;
  const cardBody = (title: string) => cards.find((card) => card.title === title)?.body ?? "";
  const relatedItems = (title: string) => related.find((service) => service.title === title)?.items ?? [];

  const capabilities: Capability[] = [
    {
      key: "video",
      tab: "Video",
      title: "Video & cinematography",
      body: sentence(cardBody("Video & Cinematography")),
      points: relatedItems("Video & Production"),
      image: { src: `${UPLOADS}/2021/07/video-scaled.jpg`, alt: "Camera operator filming with a handheld rig", position: "50% 40%" },
      anchor: { href: "#video", label: "See the film" },
    },
    {
      key: "motion",
      tab: "Motion",
      title: "Motion graphics & VFX",
      body: sentence(cardBody("Motion Graphics & VFX")),
      points: relatedItems("Motion Graphics"),
      image: { src: STORYBOARD[1].poster, alt: "Frame from a product animation with interface graphics" },
      anchor: { href: "#motion", label: "See the storyboard" },
    },
    {
      key: "design",
      tab: "Design",
      title: "Graphic design",
      body: sentence(cardBody("Graphic Design")),
      points: relatedItems("Graphic Design"),
      image: { src: `${UPLOADS}/2023/06/business-cards-printing.jpg`, alt: "Printed business cards on a gold backdrop" },
      anchor: { href: "#design", label: "See the design wall" },
    },
    {
      key: "audio",
      tab: "Audio",
      title: "Audio production",
      body: sentence(cardBody("Audio Production")),
      points: relatedItems("Audio Production"),
      image: { src: `${UPLOADS}/2021/07/audio-recording.jpg`, alt: "Studio condenser microphone", position: "50% 35%" },
      anchor: { href: "#audio", label: "See the session" },
    },
  ];

  const videoFeature = content.features[0];
  const renderFeature = content.features[2];
  const closing = cta
    ? { ...cta, title: "Start a creative project", primary: { ...cta.primary, label: "Talk to our creative team" } }
    : null;

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={hero} />

      {/* Capabilities: one large selector instead of four small cards */}
      <section className={styles.capabilities} aria-labelledby="cp-offer">
        <div className="container">
          <SectionTitle id="cp-offer" className={styles.offerTitle}>
            {labelCase(content.intro?.eyebrow || "What we offer")}
          </SectionTitle>
          <CapabilitySelector capabilities={capabilities} />
        </div>
      </section>

      {/* Video: full-bleed film, then a short copy row */}
      <section id="video" className={styles.video} aria-labelledby="cp-video">
        <Reveal variant="fade">
          <ReelPlayer src={FILMS.spot.src} poster={FILMS.spot.poster} title="the brand spot" className={styles.cinema} />
        </Reveal>
        <div className="container">
          <div className={styles.videoCopy}>
            <div className={styles.videoLead}>
              <SectionTitle id="cp-video" className={styles.onDark}>
                {labelCase(videoFeature?.title || "Compelling visuals that leave a lasting impression")}
              </SectionTitle>
              <p className={styles.bodyOnDark}>
                Great creative grabs attention, engages the senses and inspires action. Every piece is built to
                reinforce your brand and move people to buy.
              </p>
              <div className={styles.videoActions}>
                <Link className={styles.primaryOnDark} href={cta?.primary?.href || "/contact/"}>
                  Start a project
                  <ArrowIcon />
                </Link>
              </div>
            </div>
            <ol className={styles.craftGrid}>
              {VIDEO_CRAFT.map((item, index) => (
                <li key={item.title} className={styles.craftCard}>
                  <span className={styles.craftIcon}>
                    <CraftIcon name={item.icon} />
                  </span>
                  <span className={styles.craftStep} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className={styles.craftTitle}>{item.title}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Motion: a storyboard with a timeline, not another photo split */}
      <section id="motion" className={styles.motion} aria-labelledby="cp-motion">
        <div className="container">
          <Reveal>
            <MotionStoryboard
              src={FILMS.motion.src}
              duration={FILMS.motion.duration}
              frames={STORYBOARD}
              intro={
                <>
                  <p className={styles.label}>Motion graphics & VFX</p>
                  <SectionTitle id="cp-motion" className={styles.motionTitle}>
                    Frame by frame
                  </SectionTitle>
                  <p className={styles.body}>
                    Animation, 3D product work and visual effects. Pick a frame to play the spot from that moment.
                  </p>
                </>
              }
            />
          </Reveal>
        </div>
      </section>

      {/* Design: a staggered wall of real brand applications */}
      <section id="design" className={styles.design} aria-labelledby="cp-design">
        <div className="container">
          <div className={styles.wall}>
            {WALL.map((column, columnIndex) => (
              <div key={columnIndex} className={styles.wallColumn}>
                {columnIndex === 1 ? (
                  <div className={styles.wallIntro}>
                    <p className={styles.label}>Graphic design</p>
                    <SectionTitle id="cp-design" className={styles.wallTitle}>
                      One visual system, every format
                    </SectionTitle>
                    <p className={styles.body}>
                      Identity, packaging, print, out-of-home and social, designed to work together.
                    </p>
                  </div>
                ) : null}
                {column.map((tile, tileIndex) => (
                  <Reveal key={tile.src} delay={(columnIndex + tileIndex) * 90} className={styles[tile.slot]}>
                    <figure className={tile.height > tile.width ? `${styles.tile} ${styles.tilePortrait}` : styles.tile}>
                      <div className={styles.tileFrame} style={{ aspectRatio: `${tile.width} / ${tile.height}` }}>
                        <Image src={tile.src} alt={tile.alt} fill sizes="(min-width: 960px) 30vw, 50vw" className={styles.cover} />
                      </div>
                      <figcaption className={styles.tileLabel}>{tile.label}</figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Renders: a wide fly-over, then a model and an interior */}
      <section id="renders" className={styles.renders} aria-labelledby="cp-renders">
        <div className="container">
          <div className={styles.renderHead}>
            <div>
              <p className={styles.renderEyebrow}>3D & architectural</p>
              <SectionTitle id="cp-renders" className={styles.renderTitle}>
                {labelCase(renderFeature?.title || "Tell the story with renders")}
              </SectionTitle>
              <p className={styles.renderLead}>
                From architecture to product visualization, we create imagery that helps people understand the idea
                before it is built.
              </p>
            </div>
            <ul className={styles.inlineList}>
              <li>Architectural visualization</li>
              <li>Product renderings</li>
              <li>Interiors and exteriors</li>
              <li>Fly-through animation</li>
            </ul>
          </div>

          <Reveal variant="fade">
            <figure className={styles.renderWide}>
              <ReelPlayer src={FILMS.render.src} poster={FILMS.render.poster} title="the fly-over" className={styles.renderFrame} />
              <figcaption className={styles.captionOnDark}>Computer-generated aerial of a coastal resort.</figcaption>
            </figure>
          </Reveal>

          <div className={styles.renderPair}>
            {[RENDER_STILLS.model, RENDER_STILLS.interior].map((still, index) => (
              <Reveal key={still.src} delay={index * 120}>
                <figure className={styles.renderStill}>
                  <div className={styles.renderStillFrame}>
                    <Image src={still.src} alt={still.alt} fill sizes="(min-width: 960px) 45vw, 100vw" className={styles.cover} />
                  </div>
                  <figcaption className={styles.captionOnDark}>{still.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <p className={`${styles.bodyOnDark} ${styles.renderNote}`}>
            Photorealistic renders help people see a space or product before it exists, and double as marketing from
            day one.
          </p>
        </div>
      </section>

      {/* Audio: a multitrack session as the visual */}
      <section id="audio" className={styles.audio} aria-labelledby="cp-audio">
        <div className="container">
          <div className={styles.audioGrid}>
            <div>
              <p className={styles.label}>Audio production</p>
              <SectionTitle id="cp-audio" className={styles.audioTitle}>
                Heard before it’s seen
              </SectionTitle>
              <p className={styles.body}>{sentence(cardBody("Audio Production"))}</p>
            </div>
            <AudioSession lanes={AUDIO_LANES} />
          </div>
        </div>
      </section>

      {faqs && faqs.items.length > 0 ? (
        <FaqAccordion eyebrow="" title={labelCase(faqs.title)} items={faqs.items} />
      ) : null}

      {closing ? <PageCta cta={closing} /> : null}
    </main>
  );
}
