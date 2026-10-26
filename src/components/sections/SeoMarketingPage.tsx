import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ServiceInfoCard, ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./SeoMarketingPage.module.css";

const UPLOADS = "https://staging.kosick.com/wp-content/uploads";

const PHOTOS = {
  search: { src: `${UPLOADS}/2026/06/digital-marketing-services-1.jpg`, alt: "A phone showing a Google search for a furnace installer in Vancouver" },
  system: { src: `${UPLOADS}/2024/04/Web.webp`, alt: "A marketer working on a laptop with search and analytics graphics overlaid" },
  site: { src: `${UPLOADS}/2025/10/website-development.jpg`, alt: "A client e-commerce site open on a laptop" },
  content: { src: `${UPLOADS}/2025/12/digital-marketing-campaign.jpg`, alt: "Hands on a laptop with search and marketing graphics overlaid" },
  city: { src: `${UPLOADS}/2023/06/vancouver-agency.jpg`, alt: "Vancouver waterfront and skyline at sunset" },
  report: { src: `${UPLOADS}/2026/06/social-media-content-marketing-1.jpg`, alt: "A performance dashboard open on a laptop" },
};

/* How the eight capabilities group into one system */
const SYSTEM = [
  { verb: "Discover", line: "Keyword research" },
  { verb: "Optimize", line: "Technical and on-page SEO" },
  { verb: "Build", line: "Content and authority" },
  { verb: "Win locally", line: "Local search visibility" },
  { verb: "Measure", line: "Analytics and reporting" },
];

/* Taken from the Technical SEO and On-Page Optimization cards */
const TECHNICAL = [
  { name: "Site speed", line: "Pages that load fast on every device." },
  { name: "Crawlability", line: "Search engines can reach and index every page." },
  { name: "Schema markup", line: "Structured data that makes results richer." },
  { name: "Core Web Vitals", line: "Performance tuned to Google’s own measures." },
  { name: "Titles, meta and headers", line: "Every page structured for its search terms." },
];

const SITE_MAP = [
  { name: "Services", pages: ["Service page", "Service page"] },
  { name: "Locations", pages: ["Vancouver", "Calgary"] },
  { name: "Articles", pages: ["Guide", "Guide"] },
];

/* The metrics the reporting copy names */
const MEASURES = ["Keyword rankings", "Organic traffic", "Conversions", "Return on investment"];

function findCard(cards: ServiceInfoCard[], pattern: RegExp) {
  return cards.find((card) => pattern.test(card.title));
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM15.5 15.5 20 20" />
    </svg>
  );
}

function Stars() {
  return (
    <span className={styles.stars} aria-hidden="true">
      ★★★★★
    </span>
  );
}

type SeoMarketingPageProps = {
  content: ServicePageContent;
};

export function SeoMarketingPage({ content }: SeoMarketingPageProps) {
  const { hero, faqs, cta } = content;
  const cards = content.offerGroups.flatMap((group) => group.cards);
  const contentCards = [/content strategy/i, /link building/i, /competitor/i]
    .map((pattern) => findCard(cards, pattern))
    .filter((card): card is ServiceInfoCard => Boolean(card));
  const localCard = findCard(cards, /local/i);
  const contactHref = cta?.primary.href || "/contact/";

  return (
    <main className={styles.page}>
      <ServiceHero
        title={content.title}
        hero={hero}
        backgroundPosition="60% 38%"
        backgroundPositionMobile="center 42%"
      />

      {/* Intro: the promise beside an illustrative search result */}
      <section className={styles.intro} aria-labelledby="seo-intro">
        <div className="container">
          <div className={styles.split}>
            <div>
              <p className={styles.label}>Search engine optimization</p>
              <SectionTitle id="seo-intro" className={styles.display}>
                Build visibility that compounds.
              </SectionTitle>
              <p className={styles.lead}>
                SEO should make your business easier to find, easier to understand and easier to trust. Kosick
                combines technical SEO, content, local visibility and reporting into one long-term growth system.
              </p>
              <Link className={styles.dark} href={contactHref}>
                Start with an SEO review
                <ArrowIcon />
              </Link>
            </div>
            <Reveal variant="fade">
              <figure className={`${styles.figure} ${styles.introVisual}`}>
                <div className={styles.introPhoto}>
                  <Image src={PHOTOS.search.src} alt={PHOTOS.search.alt} fill sizes="(min-width: 960px) 36vw, 100vw" className={styles.cover} />
                </div>
                <div className={styles.serp} aria-hidden="true">
                  <div className={styles.searchBar}>
                    <SearchIcon />
                    <span>services near me</span>
                  </div>
                  <div className={`${styles.result} ${styles.resultLead}`}>
                    <span className={styles.resultUrl}>yourbusiness.ca</span>
                    <span className={styles.resultTitle}>Your business, where customers are searching</span>
                    <span className={styles.resultLine} />
                    <span className={`${styles.resultLine} ${styles.short}`} />
                  </div>
                  <div className={styles.result}>
                    <span className={styles.resultUrl}>competitor.ca</span>
                    <span className={styles.resultTitle}>A competitor result</span>
                    <span className={styles.resultLine} />
                  </div>
                  <div className={styles.trend}>
                    <span>Organic visibility</span>
                    <svg viewBox="0 0 120 32" preserveAspectRatio="none">
                      <path d="M0 28 L20 25 L40 26 L60 19 L80 15 L100 10 L120 4" />
                    </svg>
                  </div>
                </div>
                <figcaption className={styles.caption}>Search card is illustrative.</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Capabilities: a two-column numbered index */}
      {cards.length > 0 ? (
        <section className={styles.index} aria-labelledby="seo-index">
          <div className="container">
            <div className={styles.sectionHead}>
              <p className={styles.label}>What the work covers</p>
              <SectionTitle id="seo-index" className={styles.title}>
                Eight disciplines, one program.
              </SectionTitle>
            </div>
            <ol className={styles.capabilities}>
              {cards.map((card, index) => (
                <li key={card.id}>
                  <span className={styles.capNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.capTitle}>{card.title}</span>
                  {card.body ? <span className={styles.capBody}>{card.body}</span> : null}
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* System: five stages on one rule */}
      <section className={styles.system} aria-labelledby="seo-system">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.label}>How it fits together</p>
            <SectionTitle id="seo-system" className={styles.title}>
              SEO is a system, not a checklist.
            </SectionTitle>
          </div>
          <Reveal variant="fade" className={styles.banner}>
            <div className={styles.photo}>
              <Image src={PHOTOS.system.src} alt={PHOTOS.system.alt} fill sizes="(min-width: 1290px) 1290px, 100vw" className={styles.cover} />
            </div>
          </Reveal>
          <ol className={styles.flow}>
            {SYSTEM.map((stage, index) => (
              <Reveal key={stage.verb} as="li" delay={index * 100} className={styles.stage}>
                <span className={styles.stageNode} aria-hidden="true" />
                <span className={styles.stageNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.stageVerb}>{stage.verb}</span>
                <span className={styles.stageLine}>{stage.line}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Local: 60/40, copy beside an illustrative map and local pack */}
      <section className={styles.local} aria-labelledby="seo-local">
        <div className="container">
          <div className={styles.localGrid}>
            <div>
              <p className={styles.label}>Local SEO</p>
              <SectionTitle id="seo-local" className={styles.title}>
                Own the local search results.
              </SectionTitle>
              <p className={styles.lead}>
                {localCard?.body ||
                  "Optimized Google Business profiles, citations and location-based strategies."}{" "}
                So you show up in Vancouver, Calgary, Toronto and communities across Canada when nearby buyers are
                ready to act.
              </p>
              <ul className={styles.ticks}>
                <li>Google Business Profile</li>
                <li>Local citations</li>
                <li>Location pages and relevance</li>
              </ul>
            </div>
            <Reveal variant="fade">
              <figure className={styles.figure}>
                <div className={styles.localVisual} aria-hidden="true">
                  <div className={styles.map}>
                    <span className={`${styles.pin} ${styles.pinLead}`} style={{ left: "46%", top: "40%" }} />
                    <span className={styles.pin} style={{ left: "24%", top: "64%" }} />
                    <span className={styles.pin} style={{ left: "72%", top: "58%" }} />
                  </div>
                  <ul className={styles.pack}>
                    <li className={styles.packLead}>
                      <span className={styles.packName}>Your business</span>
                      <Stars />
                      <span className={styles.packMeta}>Open now · Directions · Call</span>
                    </li>
                    <li>
                      <span className={styles.packName}>Nearby competitor</span>
                      <span className={styles.packMeta}>Directions</span>
                    </li>
                    <li>
                      <span className={styles.packName}>Nearby competitor</span>
                      <span className={styles.packMeta}>Directions</span>
                    </li>
                  </ul>
                </div>
                <figcaption className={styles.caption}>Illustrative local search result.</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Technical: dark, a site architecture beside the foundations */}
      <section className={styles.technical} aria-labelledby="seo-technical">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.labelOnDark}>Technical SEO</p>
            <SectionTitle id="seo-technical" className={styles.titleOnDark}>
              A site search engines can read.
            </SectionTitle>
          </div>
          <Reveal variant="fade" className={styles.banner}>
            <div className={`${styles.photo} ${styles.photoDark}`}>
              <Image src={PHOTOS.site.src} alt={PHOTOS.site.alt} fill sizes="(min-width: 1290px) 1290px, 100vw" className={styles.cover} />
            </div>
          </Reveal>
          <div className={styles.techGrid}>
            <Reveal variant="fade">
              <figure className={styles.figure}>
                <div className={styles.tree} aria-hidden="true">
                  <span className={styles.treeRoot}>Home</span>
                  <div className={styles.treeBranches}>
                    {SITE_MAP.map((branch) => (
                      <div key={branch.name} className={styles.branch}>
                        <span className={styles.treeNode}>{branch.name}</span>
                        {branch.pages.map((page, index) => (
                          <span key={`${page}-${index}`} className={styles.treeLeaf}>
                            {page}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <figcaption className={styles.captionOnDark}>Illustrative site architecture.</figcaption>
              </figure>
            </Reveal>
            <ul className={styles.techList}>
              {TECHNICAL.map((item) => (
                <li key={item.name}>
                  <span className={styles.techName}>{item.name}</span>
                  <span className={styles.techLine}>{item.line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Content and authority: one photograph, three ruled rows */}
      {contentCards.length > 0 ? (
        <section className={styles.authority} aria-labelledby="seo-authority">
          <div className="container">
            <div className={styles.sectionHead}>
              <p className={styles.label}>Content &amp; authority</p>
              <SectionTitle id="seo-authority" className={styles.title}>
                Earn the right to rank.
              </SectionTitle>
            </div>
            <div className={styles.authorityGrid}>
              <Reveal variant="fade" className={styles.authorityMedia}>
                <div className={styles.photo}>
                  <Image src={PHOTOS.content.src} alt={PHOTOS.content.alt} fill sizes="(min-width: 960px) 55vw, 100vw" className={styles.cover} />
                </div>
              </Reveal>
              <ol className={styles.rows}>
                {contentCards.map((card, index) => (
                  <li key={card.id}>
                    <span className={styles.capNumber}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.capTitle}>{card.title}</span>
                    {card.body ? <span className={styles.capBody}>{card.body}</span> : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ) : null}

      {/* Reporting: copy and CTA beside a compact monthly report */}
      <section className={styles.reporting} aria-labelledby="seo-reporting">
        <div className="container">
          <div className={styles.split}>
            <div>
              <p className={styles.labelOnDark}>Analytics &amp; reporting</p>
              <SectionTitle id="seo-reporting" className={styles.titleOnDark}>
                SEO that drives measurable growth.
              </SectionTitle>
              <p className={styles.leadOnDark}>
                We track keyword rankings, organic traffic and conversions, then report in plain language every month
                so you always know what your investment returns.
              </p>
              <Link className={styles.light} href={contactHref}>
                Get a reporting plan
                <ArrowIcon />
              </Link>
            </div>
            <div>
              <Reveal variant="fade">
                <div className={`${styles.photo} ${styles.photoDark}`}>
                  <Image src={PHOTOS.report.src} alt={PHOTOS.report.alt} fill sizes="(min-width: 960px) 55vw, 100vw" className={styles.cover} />
                </div>
              </Reveal>
              <ul className={styles.measures} aria-label="What we report on">
                {MEASURES.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vancouver: a short local-service close */}
      <section className={styles.vancouver} aria-labelledby="seo-vancouver">
        <div className="container">
          <div className={styles.vancouverGrid}>
            <div>
              <p className={styles.label}>Vancouver SEO services</p>
              <SectionTitle id="seo-vancouver" className={styles.title}>
                A Canadian SEO agency built on 40+ years of marketing.
              </SectionTitle>
              <p className={styles.body}>
                We connect SEO to your wider brand and media strategy, so the whole program works harder than search
                alone.
              </p>
              <p className={styles.body}>
                Based in Vancouver, we help businesses win search in Calgary, Toronto and across Canada.
              </p>
              <ul className={styles.cities}>
                <li>Vancouver</li>
                <li>Calgary</li>
                <li>Toronto</li>
                <li>Across Canada</li>
              </ul>
              <Link className={styles.dark} href={contactHref}>
                Talk to our SEO team
                <ArrowIcon />
              </Link>
            </div>
            <Reveal variant="fade">
              <div className={styles.photo}>
                <Image src={PHOTOS.city.src} alt={PHOTOS.city.alt} fill sizes="(min-width: 960px) 50vw, 100vw" className={styles.cover} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {faqs && faqs.items.length > 0 ? (
        <FaqAccordion eyebrow="" title={labelCase(faqs.title)} items={faqs.items} />
      ) : null}

      {cta ? <PageCta cta={cta} /> : null}
    </main>
  );
}
