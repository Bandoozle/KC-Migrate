"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import styles from "./ResponsiveStudio.module.css";

/*
 * One site, three states. A layout built around the Cool Comfort Solutions
 * hero sits in a frame measured in real CSS pixels and scaled to fit, so its
 * width is a true viewport width: the layout reflows at a container query
 * (640px) as the frame narrows, the same way a responsive site does. Design
 * shows the wireframe, Build the desktop page, Convert the phone with its
 * call and booking bar. The layout is illustrative; the photograph is the
 * client's.
 */

const HERO = { src: "/wp-content/uploads/2024/03/Screenshot-2024-03-07-at-10.07.14-AM-5.png", alt: "Cool Comfort Solutions hero, a heat pump lit in green" };
const HOST = "coolcomfortsolutions.ca";

const STEPS = [
  { key: "design", verb: "Design", state: "Wireframe", name: "UX & responsive design", line: "Layouts planned for every screen before a line of code.", width: 1200 },
  { key: "build", verb: "Build", state: "Desktop", name: "Development", line: "Custom WordPress and React builds your team can update.", width: 1200 },
  { key: "convert", verb: "Convert", state: "Mobile", name: "Content & conversion", line: "Pages structured to answer questions and prompt the next step.", width: 390 },
] as const;

const BREAKPOINT = 640;
const MIN_W = 360;
const MAX_W = 1280;
const RULER = [390, 768, 1024, 1280];

export function ResponsiveStudio() {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [width, setWidth] = useState<number>(STEPS[0].width);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);
  const [avail, setAvail] = useState({ w: 1100, h: 600 });
  const [inView, setInView] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; w: number; scale: number } | null>(null);

  const phone = width < BREAKPOINT;
  const height = phone ? 760 : 720;
  const scale = Math.min(avail.w / width, avail.h / height, 1);
  const skin = step === 0 ? "wire" : "real";

  // Measure the stage so the frame scales to fit it
  useLayoutEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const measure = () => {
      const w = node.clientWidth;
      setAvail({ w: w - 8, h: w < 700 ? 470 : 600 });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Until the visitor takes over, walk through the three states while the stage is on screen
  useEffect(() => {
    if (touched || reduced || !inView) return;
    const timer = window.setTimeout(() => {
      const next = (step + 1) % STEPS.length;
      setStep(next);
      setWidth(STEPS[next].width);
    }, step === 2 ? 4200 : 3400);
    return () => window.clearTimeout(timer);
  }, [step, touched, reduced, inView]);

  function choose(index: number) {
    setTouched(true);
    setStep(index);
    setWidth(STEPS[index].width);
  }

  function onHandleDown(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setTouched(true);
    setDragging(true);
    if (step === 0) setStep(1);
    drag.current = { x: event.clientX, w: width, scale };
  }

  function onHandleMove(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current;
    if (!start) return;
    // The frame is centred, so each pixel of pointer travel moves both edges
    const next = Math.round(Math.min(MAX_W, Math.max(MIN_W, start.w + ((event.clientX - start.x) * 2) / start.scale)));
    setWidth(next);
    setStep(next < BREAKPOINT ? 2 : 1);
  }

  function onHandleUp() {
    drag.current = null;
    setDragging(false);
  }

  function onHandleKey(event: KeyboardEvent<HTMLButtonElement>) {
    const delta = event.key === "ArrowLeft" ? -40 : event.key === "ArrowRight" ? 40 : 0;
    if (!delta) return;
    event.preventDefault();
    setTouched(true);
    const next = Math.min(MAX_W, Math.max(MIN_W, width + delta));
    setWidth(next);
    setStep(next < BREAKPOINT ? 2 : 1);
  }

  const frameStyle = {
    "--s": scale,
    width: `${width}px`,
    height: `${height}px`,
    marginLeft: `${-width / 2}px`,
    transform: `scale(${scale})`,
  } as CSSProperties;

  return (
    <div className={styles.studio} data-dragging={dragging}>
      {/* Breakpoint ruler, in the frame's own pixels */}
      <div className={styles.ruler} aria-hidden="true">
        <span className={styles.readout}>
          <b>{width}</b>px <i>{phone ? "phone" : width < 1024 ? "tablet" : "desktop"}</i>
        </span>
        <span className={styles.track}>
          {RULER.map((mark) => (
            <span key={mark} className={styles.mark} style={{ left: `${(mark / MAX_W) * 100}%` }} data-on={width >= mark}>
              {mark}
            </span>
          ))}
          <span className={styles.span} style={{ width: `${(width / MAX_W) * 100}%` }} />
        </span>
      </div>

      <div ref={stageRef} className={styles.stage} style={{ height: `${height * scale + 28}px` }}>
        <div className={styles.frame} data-device={phone ? "phone" : "browser"} style={frameStyle}>
          {phone ? (
            <div className={styles.phoneTop} aria-hidden="true">
              <span>9:41</span>
              <i />
              <span>●●●</span>
            </div>
          ) : (
            <div className={styles.browserTop} aria-hidden="true">
              <span className={styles.dots}>
                <i />
                <i />
                <i />
              </span>
              <span className={styles.url}>{HOST}</span>
              <span />
            </div>
          )}

          <div className={styles.site} data-skin={skin} data-step={STEPS[step].key} role="img" aria-label={`The Cool Comfort Solutions layout at ${width} pixels wide, ${skin === "wire" ? "as a wireframe" : phone ? "on a phone with a call and booking bar" : "as a finished desktop page"}`}>
            <div className={styles.siteNav}>
              <span className={styles.logo}>
                <i />
                <b />
              </span>
              <span className={styles.links}>
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className={styles.navCta}>Book service</span>
              <span className={styles.burger}>
                <i />
                <i />
                <i />
              </span>
              <em className={styles.note}>nav</em>
            </div>

            <div className={styles.siteHero}>
              <Image src={HERO.src} alt="" fill sizes="(min-width: 960px) 70vw, 100vw" className={styles.heroImg} />
              <em className={styles.note}>hero</em>
            </div>

            <div className={styles.siteIntro}>
              <b />
              <i />
              <i />
              <em className={styles.note}>intro</em>
            </div>

            <div className={styles.siteCards}>
              {["Heating", "Cooling", "Rebates"].map((name) => (
                <span key={name} className={styles.card}>
                  <span className={styles.cardIcon} />
                  <span className={styles.cardName}>{name}</span>
                  <i />
                  <i />
                </span>
              ))}
              <em className={styles.note}>services</em>
            </div>

            <div className={styles.convertBar}>
              <span className={styles.call}>Call now</span>
              <span className={styles.book}>Book online</span>
              <em className={styles.flag}>Tap-to-call and booking, always in reach</em>
            </div>
          </div>

          {/* Resize handle on the frame's right edge */}
          <button
            type="button"
            className={styles.handle}
            onPointerDown={onHandleDown}
            onPointerMove={onHandleMove}
            onPointerUp={onHandleUp}
            onPointerCancel={onHandleUp}
            onKeyDown={onHandleKey}
            aria-label={`Resize the layout, now ${width} pixels wide. Use the left and right arrow keys.`}
          >
            <i />
          </button>
        </div>
      </div>

      <p className={styles.hint} aria-hidden="true">
        Drag the edge to resize. The layout reflows at {BREAKPOINT}px.
      </p>

      <ol className={styles.steps}>
        {STEPS.map((item, index) => (
          <li key={item.key}>
            <button type="button" className={styles.stepButton} aria-pressed={step === index} onClick={() => choose(index)}>
              <span className={styles.stepHead}>
                <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.stepVerb}>{item.verb}</span>
                <span className={styles.stepState}>{item.state}</span>
              </span>
              <span className={styles.stepName}>{item.name}</span>
              <span className={styles.stepLine}>{item.line}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className={styles.activeLine} aria-live="polite">
        <b>{STEPS[step].name}.</b> {STEPS[step].line}
      </p>
    </div>
  );
}
