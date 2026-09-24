"use client";

import {
  Children,
  createElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
  type ReactNode,
} from "react";
import styles from "./Reveal.module.css";

export type RevealVariant = "fadeUp" | "fade" | "left" | "right" | "scale";

type RevealTag = "div" | "li" | "article" | "section";

type RevealProps = {
  children: ReactNode;
  variant?: RevealVariant;
  /** Delay in milliseconds. Applied when the element becomes visible. */
  delay?: number;
  className?: string;
  as?: RevealTag;
};

const variantClass: Record<RevealVariant, string> = {
  fadeUp: styles.fadeUp,
  fade: styles.fade,
  left: styles.left,
  right: styles.right,
  scale: styles.scale,
};

/**
 * One-time viewport reveal. Layout space is reserved; only opacity and
 * transform change. Reduced motion shows the content immediately.
 */
export function Reveal({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [hidden, setHidden] = useState(false);
  const [shown, setShown] = useState(false);

  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    let frame = 0;
    const show = () => {
      frame = requestAnimationFrame(() => setShown(true));
    };

    const rect = node.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
    setHidden(true);

    if (inView) {
      show();
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        show();
        observer.disconnect();
      },
      { threshold: 0, rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return createElement(
    as,
    {
      ref: setRef,
      className: [
        styles.reveal,
        variantClass[variant],
        hidden && !shown ? styles.hidden : "",
        shown ? styles.shown : "",
        className,
      ]
        .filter(Boolean)
        .join(" "),
      style:
        shown && delay > 0
          ? ({ transitionDelay: `${delay}ms` } satisfies CSSProperties)
          : undefined,
    },
    children,
  );
}

const STAGGER_CAP = 8;

type RevealGroupProps = {
  children: ReactNode;
  /** Milliseconds between children. Defaults to 90. */
  stagger?: number;
  variant?: RevealVariant;
  className?: string;
  as?: RevealTag;
};

/** Staggers direct children with one shared reveal variant. */
export function RevealGroup({
  children,
  stagger = 90,
  variant = "fadeUp",
  className,
  as,
}: RevealGroupProps) {
  return Children.map(Children.toArray(children), (child, index) => (
    <Reveal
      variant={variant}
      delay={Math.min(index, STAGGER_CAP - 1) * stagger}
      className={className}
      as={as}
    >
      {child}
    </Reveal>
  ));
}

/** Editorial image: fade plus a very small scale. */
export function MotionImage({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <Reveal variant="scale">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={className} {...props} />
    </Reveal>
  );
}
