import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { eyebrowLabel, labelCase } from "@/lib/eyebrow";
import type { RadioArticles } from "@/lib/wordpress/radio-articles";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import { RadioDial, type RadioFormat, type RadioStation } from "./RadioDial";
import styles from "./RadioAdvertisingPage.module.css";

type RadioAdvertisingPageProps = {
  content: ServicePageContent;
  articles: RadioArticles;
};

/** Frequencies for the Vancouver stations named in "The Power of Radio Advertising". */
const STATION_DIRECTORY: (Omit<RadioStation, "id"> & { match: RegExp })[] = [
  { match: /Rock 101/i, name: "Rock 101", call: "CFMI", band: "FM", frequency: 101.1 },
  { match: /\bCFOX\b/, name: "CFOX", band: "FM", frequency: 99.3 },
  { match: /Virgin Radio/i, name: "Virgin Radio", band: "FM", frequency: 94.5 },
  { match: /Z95\.3/i, name: "Z95.3", band: "FM", frequency: 95.3 },
  { match: /\bCKNW\b/, name: "CKNW", band: "AM", frequency: 980 },
  { match: /CBC Radio One/i, name: "CBC Radio One", band: "AM", frequency: 690 },
  { match: /\bJRFM\b/i, name: "JRFM", band: "FM", frequency: 93.7 },
];

const MIX_LINKS: { match: RegExp; href: string | null }[] = [
  { match: /linear tv/i, href: "/services/television-advertising/" },
  { match: /connected tv/i, href: "/services/digital-connected-tv/" },
  { match: /radio/i, href: null },
  { match: /digital/i, href: "/services/digital-marketing/" },
];

const STUDIO_IMAGE = {
  src: "https://staging.kosick.com/wp-content/uploads/2021/07/audio-recording.jpg",
  alt: "Studio condenser microphone in a shock mount, ready for a voice session",
};

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function stationsIn(text: string): RadioStation[] {
  return STATION_DIRECTORY.map((station) => ({ station, at: text.search(station.match) }))
    .filter(({ at }) => at >= 0)
    .sort((a, b) => a.at - b.at)
    .map(({ station }) => ({
      id: slug(station.name),
      name: station.name,
      call: station.call,
      band: station.band,
      frequency: station.frequency,
    }));
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />
    </svg>
  );
}

function ChannelGlyph({ kind }: { kind: "broadcast" | "streaming" | "audience" | "performance" }) {
  if (kind === "broadcast") {
    return (
      <svg viewBox="0 0 120 36" aria-hidden="true" focusable="false">
        {Array.from({ length: 21 }, (_, index) => (
          <line
            key={index}
            x1={6 + index * 5.4}
            x2={6 + index * 5.4}
            y1={index % 5 === 0 ? 8 : 16}
            y2={28}
            stroke="currentColor"
            strokeWidth="1"
            opacity={index % 5 === 0 ? 0.9 : 0.45}
          />
        ))}
        <line x1="76" x2="76" y1="2" y2="34" className={styles.glyphAccent} strokeWidth="2" />
      </svg>
    );
  }
  if (kind === "streaming") {
    return (
      <svg viewBox="0 0 120 36" aria-hidden="true" focusable="false">
        <path d="M6 9 L18 18 L6 27 Z" className={styles.glyphAccentFill} />
        {[0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.95, 0.65, 0.4, 0.8, 0.55, 0.9, 0.45, 0.7, 0.35].map((h, index) => (
          <rect
            key={index}
            x={30 + index * 6}
            y={18 - h * 14}
            width="2.5"
            height={h * 28}
            rx="1.25"
            fill="currentColor"
            opacity="0.8"
          />
        ))}
      </svg>
    );
  }
  if (kind === "audience") {
    return (
      <svg viewBox="0 0 120 36" aria-hidden="true" focusable="false">
        {[0, 1, 2, 3].map((index) => (
          <rect
            key={index}
            x={6 + index * 28}
            y="10"
            width="24"
            height="16"
            rx="2"
            fill={index === 0 || index === 2 ? undefined : "none"}
            className={index === 0 || index === 2 ? styles.glyphAccentFill : undefined}
            stroke="currentColor"
            strokeOpacity="0.6"
          />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 36" aria-hidden="true" focusable="false">
      {Array.from({ length: 12 }, (_, index) => (
        <rect
          key={index}
          x={6 + index * 9}
          y="12"
          width="6"
          height="12"
          rx="1"
          fill="currentColor"
          className={index >= 8 ? styles.glyphAccentFill : undefined}
          opacity={index >= 8 ? 1 : 0.35 + index * 0.05}
        />
      ))}
    </svg>
  );
}

export function RadioAdvertisingPage({ content, articles }: RadioAdvertisingPageProps) {
  const cards = content.offerGroups.flatMap((group) => group.cards);
  const [local, mix, targeting] = [
    content.features.find((feature) => /local radio|local advertising/i.test(`${feature.title} ${feature.eyebrow ?? ""}`)),
    content.features.find((feature) => /media mix/i.test(`${feature.title} ${feature.eyebrow ?? ""}`)),
    content.features.find((feature) => /audience/i.test(feature.title)),
  ];
  const faq = (pattern: RegExp) => content.faqs?.items.find((item) => pattern.test(item.question));
  const stationsFaq = faq(/right radio stations/i);
  const productionFaq = faq(/production|copywriting/i);

  const guide = articles.guide;
  const formats: RadioFormat[] = (guide?.formats?.items ?? []).map((item) => ({
    id: slug(item.label),
    label: labelCase(item.label),
    text: item.text,
    stations: stationsIn(item.text),
  }));
  const streaming = guide?.streaming;
  if (streaming && streaming.items.length > 0) {
    const named = streaming.lead?.match(/Platforms like (.+?) allow/i)?.[1];
    const platforms = [
      ...(named ? named.split(/,\s*(?:and\s+)?|\s+and\s+/) : []),
      ...(articles.mediaBuying?.streamingPlatforms ?? []),
    ]
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => (/^station-specific apps$/i.test(name) ? "Station apps" : name));
    formats.push({
      id: "streaming",
      label: "Streaming audio",
      text: (streaming.lead ?? "").replace(/:\s*$/, "."),
      stations: [],
      platforms: [...new Set(platforms)],
      points: streaming.items.map((item) => ({ label: labelCase(item.label), text: item.text })),
    });
  }

  const channelKinds = ["broadcast", "streaming", "audience", "performance"] as const;
  const channels = cards.map((card, index) => {
    const streamingCard = /spotify|podcast|streaming/i.test(card.body ?? "");
    const kind = streamingCard
      ? "streaming"
      : /audience|target/i.test(card.title)
        ? "audience"
        : /performance|attribution|tracking/i.test(card.title)
          ? "performance"
          : /am\/fm|radio/i.test(card.title)
            ? "broadcast"
            : channelKinds[index % channelKinds.length];
    // WordPress titles the streaming card "Community Management"; its copy describes streaming audio.
    const title = streamingCard && /community management/i.test(card.title) ? "Streaming Audio" : card.title;
    return { ...card, title, kind };
  });

  const roles = (articles.mediaBuying?.roles ?? []).map((role) => ({
    ...role,
    href: MIX_LINKS.find((link) => link.match.test(role.channel))?.href,
    current: /radio/i.test(role.channel),
  }));

  const dayparts = stationsFaq?.answer
    .match(/daypart performance,?\s*(.+?)\s*[—–-]+\s*to place/i)?.[1]
    ?.split(/,\s*(?:and\s+)?|\s+and\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const daypartOrder = ["morning drive", "midday", "afternoon drive", "evening"];
  const orderedDayparts = dayparts
    ?.slice()
    .sort((a, b) => daypartOrder.indexOf(a.toLowerCase()) - daypartOrder.indexOf(b.toLowerCase()));
  const process = guide?.process;
  const localEyebrow = eyebrowLabel(local?.eyebrow, local?.title);
  const mixEyebrow = eyebrowLabel(mix?.eyebrow, mix?.title);
  const targetingEyebrow = eyebrowLabel(targeting?.eyebrow, targeting?.title);
  const productionDetail = productionFaq?.answer.replace(/^Yes\.\s*/i, "");

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={content.hero} />

      {local ? (
        <section className={`section ${styles.onAir}`} aria-labelledby="radio-local">
          <div className={`container ${styles.onAirGrid}`}>
            <div className={styles.onAirLead}>
              {localEyebrow ? <p className={styles.kicker}>{localEyebrow}</p> : null}
              <h2 id="radio-local" className={styles.sectionTitle}>
                {labelCase(local.title)}
              </h2>
              {local.body ? <p className={styles.lead}>{local.body}</p> : null}
              {local.cta ? (
                <Link className={styles.solid} href={local.cta.href}>
                  {labelCase(local.cta.label)}
                  <ArrowIcon />
                </Link>
              ) : null}
            </div>
            {(local.bullets?.length ?? 0) > 0 ? (
              <ol className={styles.signals}>
                {local.bullets?.map((bullet, index) => (
                  <li key={bullet}>
                    <span className={styles.signalIndex}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.signalMeter} aria-hidden="true">
                      {Array.from({ length: 5 }, (_, bar) => (
                        <span key={bar} data-on={bar <= index + 1 ? "true" : "false"} />
                      ))}
                    </span>
                    <span className={styles.signalText}>{bullet}</span>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </section>
      ) : null}

      {guide?.formats && formats.length > 1 ? (
        <section className={`section ${styles.dial}`} aria-labelledby="radio-formats">
          <div className="container">
            <div className={styles.dialHead}>
              <h2 id="radio-formats" className={styles.sectionTitle}>
                {labelCase(guide.formats.title)}
              </h2>
              {guide.formats.lead ? (
                <p className={styles.lead}>{guide.formats.lead.replace(/:\s*$/, ".")}</p>
              ) : null}
              <p className={styles.source}>
                From the Kosick article <Link href={guide.href}>{guide.title}</Link>
              </p>
            </div>
            <RadioDial formats={formats} />
          </div>
        </section>
      ) : null}

      {content.intro && channels.length > 0 ? (
        <section className={`section ${styles.channels}`} aria-labelledby="radio-channels">
          <div className="container">
            <h2 id="radio-channels" className={styles.sectionTitle}>
              {content.intro.title}
            </h2>
            {content.intro.body ? <p className={styles.lead}>{content.intro.body}</p> : null}
            <ul className={styles.console}>
              {channels.map((channel, index) => (
                <li key={channel.title} className={styles.strip}>
                  <div className={styles.stripHead}>
                    <span>Ch {String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.stripLed} aria-hidden="true" />
                  </div>
                  <div className={styles.stripGlyph}>
                    <ChannelGlyph kind={channel.kind} />
                  </div>
                  <h3 className={styles.stripTitle}>{channel.title}</h3>
                  {channel.body ? <p className={styles.stripBody}>{channel.body}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {mix ? (
        <section className={`section ${styles.mix}`} aria-labelledby="radio-mix">
          <div className={`container ${styles.mixGrid}`}>
            <div className={styles.mixLead}>
              {mixEyebrow ? <p className={styles.kicker}>{mixEyebrow}</p> : null}
              <h2 id="radio-mix" className={styles.sectionTitle}>
                {labelCase(mix.title)}
              </h2>
              {mix.body ? <p className={styles.body}>{mix.body}</p> : null}
              {mix.cta ? (
                <Link className={styles.solid} href={mix.cta.href}>
                  {labelCase(mix.cta.label)}
                  <ArrowIcon />
                </Link>
              ) : null}
            </div>
            {roles.length > 1 ? (
              <figure className={styles.mixBoard}>
                <ol className={styles.mixRoles}>
                  {roles.map((role, index) => (
                    <li key={role.channel} data-current={role.current ? "true" : "false"}>
                      <span className={styles.mixIndex}>{String(index + 1).padStart(2, "0")}</span>
                      <span className={styles.mixChannel}>
                        {role.href ? (
                          <Link href={role.href}>
                            {role.channel}
                            <ArrowIcon />
                          </Link>
                        ) : (
                          role.channel
                        )}
                      </span>
                      <span className={styles.mixRole}>{role.role}</span>
                    </li>
                  ))}
                </ol>
                {articles.mediaBuying ? (
                  <figcaption className={styles.source}>
                    From the Kosick article{" "}
                    <Link href={articles.mediaBuying.href}>{articles.mediaBuying.title}</Link>
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
            {(mix.bullets?.length ?? 0) > 0 ? (
              <ul className={styles.points}>
                {mix.bullets?.map((bullet, index) => (
                  <li key={bullet}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      {targeting ? (
        <section className={`section ${styles.targeting}`} aria-labelledby="radio-targeting">
          <div className={`container ${styles.targetingGrid}`}>
            <div className={styles.targetingLead}>
              {targetingEyebrow ? <p className={styles.kickerDark}>{targetingEyebrow}</p> : null}
              <h2 id="radio-targeting" className={styles.sectionTitle}>
                {labelCase(targeting.title)}
              </h2>
              {targeting.body ? <p className={styles.bodyDark}>{targeting.body}</p> : null}
              {targeting.cta ? (
                <Link className={styles.ghost} href={targeting.cta.href}>
                  {labelCase(targeting.cta.label)}
                  <ArrowIcon />
                </Link>
              ) : null}
            </div>
            <div className={styles.targetingMedia}>
              {mix?.image ? (
                <div className={styles.targetingPhoto}>
                  <Image
                    src={mix.image.src}
                    alt={mix.image.alt || "Listener wearing headphones at home"}
                    fill
                    sizes="(max-width: 999px) 100vw, 52vw"
                  />
                </div>
              ) : null}
              {orderedDayparts && orderedDayparts.length > 1 ? (
                <div className={styles.dayparts}>
                  <p className={styles.daypartsLabel}>Dayparts we plan around</p>
                  <ol className={styles.daypartTrack}>
                    {orderedDayparts.map((part) => (
                      <li key={part}>{labelCase(part)}</li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </div>
            {(targeting.bullets?.length ?? 0) > 0 ? (
              <ul className={styles.targetingPoints}>
                {targeting.bullets?.map((bullet, index) => (
                  <li key={bullet}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      {process && process.items.length > 1 ? (
        <section className={`section ${styles.studio}`} aria-labelledby="radio-studio">
          <div className={`container ${styles.studioGrid}`}>
            <figure className={styles.studioPhoto}>
              <Image src={STUDIO_IMAGE.src} alt={STUDIO_IMAGE.alt} fill sizes="(max-width: 899px) 100vw, 38vw" />
            </figure>
            <div className={styles.studioCopy}>
              <h2 id="radio-studio" className={styles.sectionTitle}>
                {labelCase(process.title)}
              </h2>
              {process.lead ? <p className={styles.lead}>{process.lead.replace(/:\s*$/, ".")}</p> : null}
              <ol className={styles.runSheet}>
                {process.items.map((item, index) => (
                  <li key={item.label}>
                    <span className={styles.runIndex}>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className={styles.runTitle}>{labelCase(item.label)}</h3>
                      <p className={styles.runText}>{item.text}</p>
                      {/creative/i.test(item.label) && productionDetail ? (
                        <p className={styles.runDetail}>{productionDetail}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
              {guide ? (
                <Link className={styles.textLink} href={guide.href}>
                  Read {guide.title}
                  <ArrowIcon />
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {content.faqs && content.faqs.items.length > 0 ? (
        <FaqAccordion eyebrow={content.faqs.eyebrow} title={content.faqs.title} items={content.faqs.items} />
      ) : null}

      {content.cta ? <PageCta cta={content.cta} /> : null}
    </main>
  );
}
