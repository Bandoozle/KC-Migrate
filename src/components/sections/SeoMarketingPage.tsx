import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { PageTitle, SectionTitle } from "@/components/typography";
import { serviceHeroActions } from "@/lib/content/industry-heroes";
import { labelCase } from "@/lib/eyebrow";
import type { ServiceInfoCard, ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./SeoMarketingPage.module.css";

/*
 * SEO reads as a walk down through the layers of search: visibility, the
 * disciplines, the system, local, the technical foundation, content and
 * authority, then measurement feeding back to the start. The search visuals
 * (queries, ranked
 * positions, paths, crawl trees, topic clusters) are illustrative.
 */

const UPLOADS = "/wp-content/uploads";

const PHOTOS = {
  search: { src: `${UPLOADS}/2026/06/digital-marketing-services-1.jpg`, alt: "A phone showing a Google search for a furnace installer in Vancouver" },
  site: { src: `${UPLOADS}/2025/10/website-development.jpg`, alt: "A client e-commerce site open on a laptop" },
  city: { src: `${UPLOADS}/2023/06/vancouver-agency.jpg`, alt: "Vancouver waterfront and skyline at sunset" },
  report: { src: `${UPLOADS}/2026/06/social-media-content-marketing-1.jpg`, alt: "A performance dashboard open on a laptop" },
};

/* The eight disciplines, grouped by the job each does for search visibility */
const GROUPS: Array<{ name: string; line: string; match: RegExp[] }> = [
  { name: "Discover", line: "What people search for", match: [/keyword/i, /competitor/i] },
  { name: "Structure", line: "How the site is read", match: [/on-page/i, /technical/i] },
  { name: "Authority", line: "Why it deserves to rank", match: [/content/i, /link/i] },
  { name: "Local", line: "Where nearby buyers look", match: [/local/i] },
  { name: "Measure", line: "What it returns", match: [/analytic|report/i] },
];

/* How the capabilities run as one loop */
const SYSTEM = [
  { verb: "Discover", line: "Keyword research" },
  { verb: "Optimize", line: "Technical and on-page SEO" },
  { verb: "Build", line: "Content and authority" },
  { verb: "Win locally", line: "Local search visibility" },
  { verb: "Measure", line: "Analytics and reporting" },
];

/* Taken from the Technical SEO and On-Page Optimization cards */
const TECHNICAL = [
  { tag: "Speed", name: "Site speed", line: "Pages that load fast on every device." },
  { tag: "Crawl", name: "Crawlability", line: "Search engines can reach and index every page." },
  { tag: "Schema", name: "Schema markup", line: "Structured data that makes results richer." },
  { tag: "Vitals", name: "Core Web Vitals", line: "Performance tuned to Google’s own measures." },
  { tag: "On-page", name: "Titles, meta and headers", line: "Every page structured for its search terms." },
];

/* An illustrative crawl of a small site, as URL paths */
const CRAWL = [
  { path: "/", depth: 0 },
  { path: "/services/", depth: 1 },
  { path: "/services/installation/", depth: 2 },
  { path: "/locations/", depth: 1 },
  { path: "/locations/vancouver/", depth: 2 },
  { path: "/articles/", depth: 1 },
  { path: "/articles/buying-guide/", depth: 2 },
];

/* Illustrative topic cluster: one pillar page and the articles that support it */
const CLUSTER = ["Buying guide", "How-to", "Comparison", "Costs explained", "FAQ"];
/* Positions of the five articles in the cluster, as percentages (matching spoke1 to spoke5 in the CSS) */
const SPOKES: Array<[number, number]> = [
  [50, 18],
  [84, 40],
  [74, 78],
  [26, 78],
  [16, 40],
];

/* The metrics the reporting copy names, in the order a search becomes revenue */
const MEASURES = ["Keyword rankings", "Organic traffic", "Conversions", "Return on investment"];

const QUERIES = ["services near me", "best local provider", "how much does it cost", "open now", "reviews"];

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
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM15.5 15.5 20 20" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/* A section label with its layer number */
function Layer({ n, children, dark = false }: { n: number; children: ReactNode; dark?: boolean }) {
  return (
    <p className={dark ? `${styles.layer} ${styles.layerOnDark}` : styles.layer}>
      <span className={styles.layerNumber}>{String(n).padStart(2, "0")}</span>
      {children}
    </p>
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
  const actions = serviceHeroActions(contactHref);
  const primary = hero.cta === undefined ? actions.cta : hero.cta;
  const secondary = hero.secondaryCta === undefined ? actions.secondaryCta : hero.secondaryCta;
  const heroPhoto = hero.slides.find((slide) => slide.kind === "image");
  const placed = new Set<string>();
  const groups = GROUPS.map((group) => ({
    ...group,
    cards: group.match
      .map((pattern) => cards.find((card) => !placed.has(card.title) && pattern.test(card.title)))
      .filter((card): card is ServiceInfoCard => {
        if (!card) return false;
        placed.add(card.title);
        return true;
      }),
  })).filter((group) => group.cards.length > 0);
  // Number the disciplines straight through the groups, like ranked positions
  const firstNumber = groups.map((_, index) => groups.slice(0, index).reduce((sum, group) => sum + group.cards.length, 0) + 1);

  return (
    <main className={styles.page}>
      {/* Hero: the headline over a field of queries and ranked results */}
      <header className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            {hero.eyebrow ? <p className={styles.heroEyebrow}>{hero.eyebrow}</p> : null}
            <PageTitle className={styles.heroTitle}>
              {hero.displayTitle ? <span className={styles.heroTitleMuted}>{hero.displayTitle} </span> : null}
              {hero.titleSecondary || content.title}
            </PageTitle>
            {hero.subtitle ? <p className={styles.heroLead}>{hero.subtitle}</p> : null}
            <div className={styles.heroActions}>
              {primary ? (
                <Link className={styles.heroPrimary} href={primary.href}>
                  {primary.label}
                  <ArrowIcon />
                </Link>
              ) : null}
              {secondary ? (
                <a className={styles.heroSecondary} href={secondary.href}>
                  {secondary.label}
                </a>
              ) : null}
            </div>
          </div>

          <div className={styles.heroSearch} aria-hidden="true">
            <div className={styles.heroBar}>
              <SearchIcon />
              <span className={styles.heroQuery}>services near me</span>
              <span className={styles.caret} />
            </div>
            <ol className={styles.heroResults}>
              <li className={styles.heroResultLead}>
                <span className={styles.rank}>1</span>
                <span className={styles.heroResultBody}>
                  <span className={styles.path}>yourbusiness.ca › services</span>
                  <span className={styles.heroResultTitle}>Your business, where customers are searching</span>
                </span>
                <span className={styles.move}>▲</span>
              </li>
              <li>
                <span className={styles.rank}>2</span>
                <span className={styles.heroResultBody}>
                  <span className={styles.path}>competitor.ca</span>
                  <span className={styles.skeleton} />
                </span>
              </li>
              <li>
                <span className={styles.rank}>3</span>
                <span className={styles.heroResultBody}>
                  <span className={styles.path}>directory.ca</span>
                  <span className={styles.skeleton} />
                </span>
              </li>
            </ol>
            {heroPhoto ? (
              <div className={styles.heroPhoto}>
                <Image src={heroPhoto.src} alt="" fill priority sizes="(min-width: 960px) 30vw, 60vw" className={styles.cover} />
              </div>
            ) : null}
          </div>
        </div>
        {/* Queries drifting along the bottom of the hero, as texture */}
        <div className={styles.queryRow} aria-hidden="true">
          {[...QUERIES, ...QUERIES].map((query, index) => (
            <span key={`${query}-${index}`}>&ldquo;{query}&rdquo;</span>
          ))}
        </div>
      </header>

      {/* 01 Visibility: the promise, then a query becoming a found, chosen result */}
      <section className={`${styles.layerSection} ${styles.intro}`} aria-labelledby="seo-intro">
        <div className="container">
          <div className={styles.introGrid}>
            <div className={styles.introCopy}>
              <Layer n={1}>Search engine optimization</Layer>
              <SectionTitle id="seo-intro" className={styles.title}>
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
            <Reveal variant="fade" className={styles.introVisual}>
              <figure className={styles.figure}>
                <div className={styles.introPhoto}>
                  <Image src={PHOTOS.search.src} alt={PHOTOS.search.alt} fill sizes="(min-width: 960px) 30vw, 60vw" className={styles.cover} />
                </div>
                <div className={styles.serp} aria-hidden="true">
                  <div className={styles.searchBar}>
                    <SearchIcon />
                    <span>services near me</span>
                  </div>
                  <div className={`${styles.result} ${styles.resultLead}`}>
                    <span className={styles.path}>yourbusiness.ca</span>
                    <span className={styles.resultTitle}>Your business, where customers are searching</span>
                    <span className={styles.skeleton} />
                  </div>
                  <div className={styles.result}>
                    <span className={styles.path}>competitor.ca</span>
                    <span className={styles.skeleton} />
                  </div>
                </div>
                <figcaption className={styles.caption}>Search card is illustrative.</figcaption>
              </figure>
            </Reveal>
          </div>
          {/* The journey the copy describes, joined across both columns */}
          <ol className={styles.journey} aria-label="How a search becomes a customer">
            <li>
              <span className={styles.journeyStep}>Query</span>
              <span className={styles.journeyName}>Someone searches</span>
              <span className={styles.chip}>&ldquo;services near me&rdquo;</span>
            </li>
            <li>
              <span className={styles.journeyStep}>Found</span>
              <span className={styles.journeyName}>Your page is understood</span>
              <span className={styles.chip}>/services/</span>
            </li>
            <li>
              <span className={styles.journeyStep}>Trusted</span>
              <span className={styles.journeyName}>Your result earns the click</span>
              <span className={styles.chip}>Call · Directions · Book</span>
            </li>
          </ol>
        </div>
      </section>

      {/* 02 Disciplines: the eight capabilities hung from one visibility axis, in five groups */}
      {groups.length > 0 ? (
        <section className={`${styles.layerSection} ${styles.map}`} aria-labelledby="seo-index">
          <div className="container">
            <Layer n={2}>What the work covers</Layer>
            <SectionTitle id="seo-index" className={styles.title}>
              Eight disciplines, one program.
            </SectionTitle>
            <div className={styles.axis}>
              <span className={styles.axisLabel}>Search visibility</span>
            </div>
            <div className={styles.groups}>
              {groups.map((group, groupIndex) => (
                <section key={group.name} className={styles.group} aria-label={group.name}>
                  <p className={styles.groupName}>{group.name}</p>
                  <p className={styles.groupLine}>{group.line}</p>
                  <ol className={styles.disciplines}>
                    {group.cards.map((card, index) => (
                      <li key={card.title}>
                        <span className={styles.position}>#{firstNumber[groupIndex] + index}</span>
                        <span className={styles.discName}>{card.title}</span>
                        {card.body ? <span className={styles.discBody}>{card.body}</span> : null}
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 03 System: five stages on a track that loops back to the start */}
      <section className={`${styles.layerSection} ${styles.system}`} aria-labelledby="seo-system">
        <div className="container">
          <div className={styles.systemHead}>
            <div>
              <Layer n={3}>How it fits together</Layer>
              <SectionTitle id="seo-system" className={styles.title}>
                SEO is a system, not a checklist.
              </SectionTitle>
            </div>
          </div>
          <div className={styles.loop}>
            <ol className={styles.stages}>
              {SYSTEM.map((stage, index) => (
                <Reveal key={stage.verb} as="li" delay={index * 90} className={styles.stage}>
                  <span className={styles.stageNode} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.stageVerb}>{stage.verb}</span>
                  <span className={styles.stageLine}>{stage.line}</span>
                </Reveal>
              ))}
            </ol>
            <div className={styles.return} aria-hidden="true">
              <span className={styles.returnLabel}>What we measure feeds the next round of discovery</span>
            </div>
          </div>
        </div>
      </section>

      {/* 04 Local: copy beside a map with a search radius and the local pack */}
      <section className={`${styles.layerSection} ${styles.local}`} aria-labelledby="seo-local">
        <div className="container">
          <div className={styles.localGrid}>
            <div>
              <Layer n={4}>Local SEO</Layer>
              <SectionTitle id="seo-local" className={styles.title}>
                Own the local search results.
              </SectionTitle>
              <p className={styles.lead}>
                {localCard?.body || "Optimized Google Business profiles, citations and location-based strategies."}{" "}
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
                  <div className={styles.mapArea}>
                    <span className={styles.mapQuery}>
                      <SearchIcon />
                      near me
                    </span>
                    <span className={styles.radius} />
                    <span className={`${styles.pin} ${styles.pinLead}`} style={{ left: "46%", top: "46%" }}>
                      <span>1</span>
                    </span>
                    <span className={styles.pin} style={{ left: "22%", top: "70%" }}>
                      <span>2</span>
                    </span>
                    <span className={styles.pin} style={{ left: "76%", top: "62%" }}>
                      <span>3</span>
                    </span>
                  </div>
                  <ol className={styles.pack}>
                    <li className={styles.packLead}>
                      <span className={styles.rank}>1</span>
                      <span>
                        <span className={styles.packName}>Your business</span>
                        <span className={styles.packMeta}>Open now · Directions · Call</span>
                      </span>
                    </li>
                    <li>
                      <span className={styles.rank}>2</span>
                      <span>
                        <span className={styles.packName}>Nearby competitor</span>
                        <span className={styles.packMeta}>Directions</span>
                      </span>
                    </li>
                    <li>
                      <span className={styles.rank}>3</span>
                      <span>
                        <span className={styles.packName}>Nearby competitor</span>
                        <span className={styles.packMeta}>Directions</span>
                      </span>
                    </li>
                  </ol>
                </div>
                <figcaption className={styles.caption}>Illustrative local search result.</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 Technical: underneath the website. The site, its crawl, and the checks that keep it readable */}
      <section className={`${styles.layerSection} ${styles.technical}`} aria-labelledby="seo-technical">
        <div className="container">
          <Layer n={5} dark>
            Technical SEO
          </Layer>
          <SectionTitle id="seo-technical" className={styles.titleOnDark}>
            A site search engines can read.
          </SectionTitle>
          <div className={styles.techGrid}>
            <div className={styles.techSite}>
              <Reveal variant="fade" className={styles.techPhoto}>
                <Image src={PHOTOS.site.src} alt={PHOTOS.site.alt} fill sizes="(min-width: 960px) 45vw, 100vw" className={styles.cover} />
              </Reveal>
              <figure className={styles.figure}>
                <ol className={styles.crawl} aria-hidden="true">
                  {CRAWL.map((url) => (
                    <li key={url.path} className={styles[`depth${url.depth}` as const]}>
                      <span className={styles.crawlPath}>{url.path}</span>
                      <span className={styles.indexed}>
                        <CheckIcon />
                        Indexed
                      </span>
                    </li>
                  ))}
                </ol>
                <figcaption className={styles.captionOnDark}>Illustrative crawl of a site.</figcaption>
              </figure>
            </div>
            <ul className={styles.checks}>
              {TECHNICAL.map((item) => (
                <li key={item.name}>
                  <span className={styles.checkTag}>{item.tag}</span>
                  <span className={styles.checkName}>{item.name}</span>
                  <span className={styles.checkLine}>{item.line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 06 Content and authority: a topic cluster with links coming in, beside the three disciplines */}
      {contentCards.length > 0 ? (
        <section className={`${styles.layerSection} ${styles.authority}`} aria-labelledby="seo-authority">
          <div className="container">
            <Layer n={6}>Content &amp; authority</Layer>
            <SectionTitle id="seo-authority" className={styles.title}>
              Earn the right to rank.
            </SectionTitle>
            <div className={styles.authorityGrid}>
              <figure className={styles.figure}>
                <div className={styles.cluster} aria-hidden="true">
                  {/* Internal links from the pillar to each article, and links arriving from other sites */}
                  <svg className={styles.links} viewBox="0 0 100 100" preserveAspectRatio="none">
                    {SPOKES.map(([x, y]) => (
                      <line key={`${x}-${y}`} x1="50" y1="50" x2={x} y2={y} />
                    ))}
                    <line className={styles.inbound} x1="14" y1="8" x2="44" y2="44" />
                    <line className={styles.inbound} x1="86" y1="92" x2="56" y2="56" />
                  </svg>
                  <span className={styles.pillar}>
                    Pillar page
                    <span className={styles.pillarPath}>/topic/</span>
                  </span>
                  {CLUSTER.map((topic, index) => (
                    <span key={topic} className={`${styles.spoke} ${styles[`spoke${index + 1}` as const]}`}>
                      {topic}
                    </span>
                  ))}
                  <span className={`${styles.backlink} ${styles.backlinkA}`}>Referring site</span>
                  <span className={`${styles.backlink} ${styles.backlinkB}`}>Referring site</span>
                </div>
                <figcaption className={styles.caption}>Illustrative topic cluster.</figcaption>
              </figure>
              <ol className={styles.rows}>
                {contentCards.map((card, index) => (
                  <li key={card.id}>
                    <span className={styles.position}>#{index + 1}</span>
                    <span className={styles.discName}>{card.title}</span>
                    {card.body ? <span className={styles.discBody}>{card.body}</span> : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ) : null}

      {/* 07 Measurement: the layer that closes the loop back to Discover */}
      <section className={`${styles.layerSection} ${styles.reporting}`} aria-labelledby="seo-reporting">
        <div className="container">
          <div className={styles.reportGrid}>
            <div>
              <Layer n={7} dark>
                Analytics &amp; reporting
              </Layer>
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
            <div className={styles.measureStack}>
              <Reveal variant="fade" className={styles.reportPhoto}>
                <Image src={PHOTOS.report.src} alt={PHOTOS.report.alt} fill sizes="(min-width: 960px) 40vw, 100vw" className={styles.cover} />
              </Reveal>
              <ol className={styles.measures} aria-label="What we report on">
                {MEASURES.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ol>
              <p className={styles.loopBack}>
                <span aria-hidden="true">↺</span>
                Back to Discover: the next month&rsquo;s research starts from these numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vancouver: a short local-service close */}
      <section className={`${styles.layerSection} ${styles.vancouver}`} aria-labelledby="seo-vancouver">
        <div className="container">
          <div className={styles.vancouverGrid}>
            <div>
              <p className={styles.layer}>Vancouver SEO services</p>
              <SectionTitle id="seo-vancouver" className={styles.title}>
                A Canadian SEO agency built on 40+ years of marketing.
              </SectionTitle>
              <p className={styles.body}>
                We connect SEO to your wider brand and media strategy, so the whole program works harder than search
                alone.
              </p>
              <p className={styles.body}>Based in Vancouver, we help businesses win search in Calgary, Toronto and across Canada.</p>
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
            <Reveal variant="fade" className={styles.cityPhoto}>
              <Image src={PHOTOS.city.src} alt={PHOTOS.city.alt} fill sizes="(min-width: 960px) 50vw, 100vw" className={styles.cover} />
            </Reveal>
          </div>
        </div>
      </section>

      {faqs && faqs.items.length > 0 ? <FaqAccordion eyebrow="" title={labelCase(faqs.title)} items={faqs.items} /> : null}

      {cta ? <PageCta cta={cta} /> : null}
    </main>
  );
}
