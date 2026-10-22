"use client";

import {
  Children,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
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
  const reduced = usePrefersReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    let frame = 0;
    let observer: IntersectionObserver | undefined;
    const show = () => {
      frame = requestAnimationFrame(() => setShown(true));
    };

    const arm = () => {
      const rect = node.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
      setHidden(true);
      if (inView) {
        show();
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          show();
          observer?.disconnect();
        },
        { threshold: 0, rootMargin: "0px 0px -15% 0px" },
      );
      observer.observe(node);
    };
    arm();

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [reduced]);

  const classNames = [
    styles.reveal,
    variantClass[variant],
    !reduced && hidden && !shown ? styles.hidden : "",
    reduced || shown ? styles.shown : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const style =
    shown && delay > 0
      ? ({ transitionDelay: `${delay}ms` } satisfies CSSProperties)
      : undefined;

  return (
    <RevealElement as={as} nodeRef={ref} className={classNames} style={style}>
      {children}
    </RevealElement>
  );
}

function RevealElement({
  as,
  nodeRef,
  className,
  style,
  children,
}: {
  as: RevealTag;
  nodeRef: Ref<HTMLElement>;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  if (as === "li") {
    return (
      <li ref={nodeRef as Ref<HTMLLIElement>} className={className} style={style}>
        {children}
      </li>
    );
  }
  if (as === "article") {
    return (
      <article ref={nodeRef as Ref<HTMLElement>} className={className} style={style}>
        {children}
      </article>
    );
  }
  if (as === "section") {
    return (
      <section ref={nodeRef as Ref<HTMLElement>} className={className} style={style}>
        {children}
      </section>
    );
  }
  return (
    <div ref={nodeRef as Ref<HTMLDivElement>} className={className} style={style}>
      {children}
    </div>
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
