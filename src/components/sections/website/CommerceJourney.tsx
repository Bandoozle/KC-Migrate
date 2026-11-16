"use client";

import Image from "next/image";
import { Jost, Vollkorn } from "next/font/google";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { Browser } from "./Browser";
import styles from "./CommerceJourney.module.css";

/*
 * Amsterdam Garden Centre on Shopify, from discovery to checkout, using their moss hanging basket
 * collection (approved by the client for this section; no other imagery is used here).
 *
 * Each stage is drawn as a 1200 × 750 page and scaled as a whole into the browser frame, so every
 * stage keeps the same proportions, like a screenshot. Reference: the live store, checked Nov 2026.
 *   Browse  reproduces amsterdamgardencentre.ca/collections/hanging-baskets: title, intro, filter row,
 *           the products in A–Z order with their real names, photos and prices.
 *   Choose  follows the live Lemon Meringue product page: gallery, size, quantity, pickup note,
 *           "Add to Wheelbarrow" and the real description.
 *   Discover and the filled cart are drawn in the store's own style (header, type, colours, footer);
 *           they are not copies of a specific page, and the caption says so.
 * Type: Vollkorn is the store's heading face; Jost Light stands in for Brandon Grotesque Light,
 * which is a commercial font.
 */
const serif = Vollkorn({ subsets: ["latin"], weight: "400", variable: "--agc-serif", display: "swap" });
const sans = Jost({ subsets: ["latin"], weight: ["300", "400"], variable: "--agc-sans", display: "swap" });

const HOST = "amsterdamgardencentre.ca";
const IMG = "/images/website-projects/hanging-baskets";
/* Logical width of each stage; the frame's 16:10 viewport scales it to fit */
const PAGE_W = 1200;

type Product = { name: string; src: string; price: string };

/* The first eight products of the live collection, sorted A–Z as the store sorts it */
const COLLECTION: Product[] = [
  { name: "Amsterdam Garden Centre Moss Hanging Basket", src: `${IMG}/amsterdam-signature.jpg`, price: "from $119.99" },
  { name: "Lemon Meringue Moss Hanging Basket", src: `${IMG}/lemon-meringue.jpg`, price: "from $119.99" },
  { name: "Lindsay's Favourite All-White Moss Hanging Basket", src: `${IMG}/lindsays-favourite.jpg`, price: "from $119.99" },
  { name: "Orange Solenia Begonia Moss Hanging Basket", src: `${IMG}/orange-solenia-begonia.jpg`, price: "$119.99" },
  { name: "Over the Rainbow Moss Hanging Basket", src: `${IMG}/over-the-rainbow.jpg`, price: "from $119.99" },
  { name: "Peach Solenia Begonia Moss Hanging Basket", src: `${IMG}/peach-solenia-begonia.jpg`, price: "$119.99" },
  { name: "Pink Solenia Begonia Moss Hanging Basket", src: `${IMG}/pink-solenia-begonia.jpg`, price: "$119.99" },
  { name: "Red Solenia Begonia Moss Hanging Basket", src: `${IMG}/red-solenia-begonia.jpg`, price: "$119.99" },
];
const COLLECTION_SIZE = 13;

const LEMON_GALLERY = [`${IMG}/lemon-meringue.jpg`, `${IMG}/lemon-meringue-2.jpg`, `${IMG}/lemon-meringue-3.jpg`];

const CART = [
  { name: "Lemon Meringue Moss Hanging Basket", src: `${IMG}/lemon-meringue.jpg`, size: '14"', price: 119.99 },
  { name: "Rise and Shine Moss Hanging Basket", src: `${IMG}/rise-and-shine.jpg`, size: '14"', price: 119.99 },
];

const money = (value: number) => `$${value.toFixed(2)}`;

const CHAPTERS = [
  {
    verb: "Discover",
    where: "Home page",
    path: undefined,
    line: "A seasonal hero that leads shoppers into the hanging basket collection.",
    screen: "A home page hero for the 2027 moss hanging basket preorder, with a Shop button.",
  },
  {
    verb: "Browse",
    where: "Collection",
    path: "/collections/hanging-baskets",
    line: "The live collection: real names, prices and photography, with filters and sorting.",
    screen: "The Preorder 2027 Moss Hanging Baskets collection page: 13 results in a four-column grid.",
  },
  {
    verb: "Choose",
    where: "Product page",
    path: "/products/lemon-meringue-moss-hanging-basket",
    line: "Size, quantity and pickup details, then Add to Wheelbarrow.",
    screen: "The Lemon Meringue Moss Hanging Basket product page at $119.99, size 14 inch, with Add to Wheelbarrow.",
  },
  {
    verb: "Convert",
    where: "Cart & checkout",
    path: "/cart",
    line: "A tidy cart with the subtotal and a clear path to checkout.",
    screen: "The cart with two moss hanging baskets, a $239.98 subtotal and a Checkout button.",
  },
] as const;

/** Time on each screen while playing. */
const STEP_MS = 4200;

export function CommerceJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState<boolean | null>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Scale the 1200px pages to the frame's width
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fit = () => setScale(stage.clientWidth / PAGE_W);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Paused by the visitor wins; otherwise play while on screen unless they prefer reduced motion
  const playing = visible && (paused === null ? !reduced : !paused);

  // Fill the current step's bar, then move to the next screen
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const start = performance.now() - progress * STEP_MS;
    const tick = (now: number) => {
      const p = Math.min((now - start) / STEP_MS, 1);
      setProgress(p);
      if (p >= 1) {
        setProgress(0);
        setActive((current) => (current + 1) % CHAPTERS.length);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // progress is read once when (re)starting, so a resume continues where it stopped
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, active]);

  function jump(index: number) {
    setActive(index);
    setProgress(0);
    if (paused === null && reduced) return;
    setPaused(false);
  }

  function fill(index: number) {
    if (index < active) return 1;
    if (index > active) return 0;
    return progress;
  }

  const current = CHAPTERS[active];

  return (
    <div className={styles.journey}>
      <ol className={styles.chapters}>
        {CHAPTERS.map((chapter, index) => (
          <li key={chapter.verb}>
            <button
              type="button"
              className={styles.chapter}
              aria-current={index === active ? "step" : undefined}
              onClick={() => jump(index)}
              style={{ "--p": fill(index) } as CSSProperties}
            >
              <span className={styles.bar} aria-hidden="true">
                <i />
              </span>
              <span className={styles.chapterHead}>
                <span className={styles.chapterNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.chapterVerb}>{chapter.verb}</span>
              </span>
              <span className={styles.chapterWhere}>{chapter.where}</span>
              <span className={styles.chapterLine}>{chapter.line}</span>
            </button>
          </li>
        ))}
      </ol>

      <div ref={ref} className={styles.screen}>
        <Browser host={HOST} path={current.path} ratio={16 / 10} className={styles.browser}>
          <div
            ref={stageRef}
            className={`${styles.stage} ${serif.variable} ${sans.variable}`}
            data-ready={scale > 0}
            style={{ "--s": scale || 1 } as CSSProperties}
            aria-hidden="true"
          >
            {CHAPTERS.map((chapter, index) => (
              <div key={chapter.verb} className={styles.shot} data-active={index === active}>
                <div className={styles.page}>
                  {index === 0 ? <DiscoverPage /> : null}
                  {index === 1 ? <BrowsePage /> : null}
                  {index === 2 ? <ChoosePage /> : null}
                  {index === 3 ? <ConvertPage /> : null}
                </div>
              </div>
            ))}
          </div>
          <p className={styles.srOnly}>{current.screen}</p>
          <button
            type="button"
            className={styles.control}
            onClick={() => setPaused(playing)}
            aria-label={playing ? "Pause the store tour" : "Play the store tour"}
          >
            {playing ? (
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M4 3h3v10H4zM9 3h3v10H9z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M4 2.5v11l9-5.5z" />
              </svg>
            )}
            <span>{playing ? "Playing" : "Paused"}</span>
          </button>
        </Browser>
        <p className={styles.caption}>
          Amsterdam Garden Centre on Shopify, with their moss hanging basket collection. Browse and Choose follow the
          live collection and product pages; Discover and the cart are drawn in the store’s own style.
        </p>
      </div>
    </div>
  );
}

/* ---------- The store's shared frame: announcement bar and header ---------- */

function StoreHeader({ cart = 0, cartAfter }: { cart?: number; cartAfter?: number }) {
  return (
    <>
      <div className={styles.announce}>Pre-Order Japanese Maples!</div>
      <div className={styles.header}>
        <Image src={`${IMG}/amsterdam-garden-centre-logo.png`} alt="" width={174} height={48} className={styles.logo} />
        <span className={styles.menu}>
          <span>
            Shop <Chevron />
          </span>
          <span>Workshops</span>
          <span>Blog</span>
          <span>Services</span>
          <span>
            Lookbooks <Chevron />
          </span>
          <span>Careers</span>
          <span>
            About Us <Chevron />
          </span>
          <span>Contact Us</span>
        </span>
        <span className={styles.icons}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="10.5" cy="10.5" r="7" />
            <path d="m20.5 20.5-5-5" />
          </svg>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </svg>
          <span className={styles.bag}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 8h14l-1 13H6zM9 8a3 3 0 0 1 6 0" />
            </svg>
            {cartAfter === undefined ? (
              <b className={styles.count}>{cart}</b>
            ) : (
              <>
                <b className={`${styles.count} ${styles.countBefore}`}>{cart}</b>
                <b className={`${styles.count} ${styles.countAfter}`}>{cartAfter}</b>
              </>
            )}
          </span>
        </span>
      </div>
    </>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="m3 4.5 3 3 3-3" />
    </svg>
  );
}

function Button({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={[styles.button, className].filter(Boolean).join(" ")}>{children}</span>;
}

/* ---------- 01 Discover: a hero in the store's style ---------- */

function DiscoverPage() {
  return (
    <>
      <StoreHeader />
      <div className={styles.discover}>
        <div className={styles.discoverMedia}>
          <Image src={COLLECTION[0].src} alt="" fill sizes="(min-width: 960px) 420px, 60vw" className={styles.cover} priority />
        </div>
        <div className={styles.discoverCopy}>
          <p className={styles.eyebrow}>Now taking preorders</p>
          <p className={styles.serifTitle}>Preorder 2027 Moss Hanging Baskets</p>
          <p className={styles.body}>
            We’re known for our exquisite moss hanging baskets, perfect for your front entrance, balcony, or patio.
            Reserve your favourites now and pick them up in early to mid-May, weather permitting.
          </p>
          <Button>Shop Moss Hanging Baskets</Button>
        </div>
      </div>
    </>
  );
}

/* ---------- 02 Browse: the live collection page, scrolled from the title to the grid ---------- */

function BrowsePage() {
  return (
    <div className={styles.scroller}>
      <StoreHeader />
      <div className={styles.collection}>
        <p className={`${styles.serifTitle} ${styles.center}`}>Preorder 2027 Moss Hanging Baskets</p>
        <div className={styles.intro}>
          <p>
            We’re known for our exquisite moss hanging baskets, perfect for your front entrance, balcony, or patio. These
            baskets feature beautiful blooms and foliage, carefully selected by our designers. With our preorder program,
            you can reserve your favourites now and pick them up in early to mid-May, weather permitting.
          </p>
          <p>Check out our moss hanging baskets for presale below!</p>
          <p>
            Orders are for <b>pickup only</b> at Amsterdam Garden Centre. We will contact you when your order is ready to
            be picked up.
          </p>
          <p>Please note: A 25% restocking fee applies to all order cancellations.</p>
        </div>

        <div className={styles.toolbar}>
          <span className={styles.filter}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 7h18M3 17h18" />
              <circle cx="8" cy="7" r="2.2" fill="#fff" />
              <circle cx="16" cy="17" r="2.2" fill="#fff" />
            </svg>
            Filter <span className={styles.results}>{COLLECTION_SIZE} Results</span>
          </span>
          <span>
            Sort: Alphabetically, A-Z <Chevron />
          </span>
        </div>
        <div className={styles.pills}>
          <span>
            Product type <Chevron />
          </span>
          <span>
            Supplier <Chevron />
          </span>
          <span>
            Price <Chevron />
          </span>
        </div>

        <ul className={styles.grid}>
          {COLLECTION.map((product) => (
            <li key={product.name}>
              <span className={styles.tile}>
                <Image src={product.src} alt="" fill sizes="(min-width: 960px) 200px, 30vw" className={styles.cover} />
              </span>
              <span className={styles.tileName}>{product.name}</span>
              <span className={styles.tilePrice}>{product.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- 03 Choose: the live product page ---------- */

function ChoosePage() {
  return (
    <>
      <StoreHeader cart={0} cartAfter={1} />
      <div className={styles.product}>
        <div className={styles.thumbs}>
          {LEMON_GALLERY.map((src, i) => (
            <span key={src} className={styles.thumb} data-active={i === 0}>
              <Image src={src} alt="" fill sizes="60px" className={styles.cover} />
            </span>
          ))}
        </div>
        <div className={styles.productMedia}>
          <Image src={LEMON_GALLERY[0]} alt="" fill sizes="(min-width: 960px) 320px, 40vw" className={styles.cover} />
        </div>
        <div className={styles.productInfo}>
          <p className={styles.productTitle}>Lemon Meringue Moss Hanging Basket</p>
          <p className={styles.productPrice}>$119.99</p>
          <p className={styles.label}>Size: 14&quot;</p>
          <span className={styles.select}>
            14&quot; <Chevron />
          </span>
          <p className={styles.label}>Quantity</p>
          <span className={styles.qty}>
            <i>−</i>1<i>+</i>
          </span>
          <span className={styles.pickup}>
            <b>PICKUP ONLY</b> from Amsterdam Garden Centre.
            <small>You will receive an email when your order is ready!</small>
          </span>
          <Button className={styles.addButton}>Add to Wheelbarrow</Button>
          <p className={styles.descHead}>Description</p>
          <p className={styles.desc}>
            Bring the zest and sweetness of a favourite dessert to your garden with our full to partial sun Lemon Meringue
            moss hanging basket. This dreamy creation is a feast for the senses, blending the bright, sunny hues of yellow
            petunias and calibrachoa with the fluffy white flowers of verbena, lobularia, and bacopa.
          </p>
        </div>
      </div>
    </>
  );
}

/* ---------- 04 Convert: the cart, in the store's style ---------- */

function ConvertPage() {
  const subtotal = CART.reduce((sum, item) => sum + item.price, 0);
  return (
    <>
      <StoreHeader cart={CART.length} />
      <div className={styles.cart}>
        <p className={`${styles.serifTitle} ${styles.center} ${styles.cartTitle}`}>Your cart</p>
        <div className={styles.cartHead}>
          <span>Product</span>
          <span>Quantity</span>
          <span>Total</span>
        </div>
        {CART.map((item) => (
          <div key={item.name} className={styles.cartRow}>
            <span className={styles.cartThumb}>
              <Image src={item.src} alt="" fill sizes="70px" className={styles.cover} />
            </span>
            <span className={styles.cartItem}>
              {item.name}
              <small>Size: {item.size}</small>
            </span>
            <span className={styles.qty}>
              <i>−</i>1<i>+</i>
            </span>
            <span className={styles.cartPrice}>{money(item.price)}</span>
          </div>
        ))}
        <div className={styles.summary}>
          <p>
            Subtotal <span>{money(subtotal)} CAD</span>
          </p>
          <small>Taxes and shipping calculated at checkout</small>
          <Button className={styles.checkout}>Checkout</Button>
        </div>
      </div>
      <div className={styles.footer}>
        <span>AMSTERDAM GARDEN CENTRE</span>
        <span>COMPANY</span>
        <span>EXPLORE</span>
        <span>SUBSCRIBE TO OUR NEWSLETTER</span>
      </div>
    </>
  );
}
