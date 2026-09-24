"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import styles from "./RevealOnEnter.module.css";

type RevealOnEnterProps = {
  children: ReactNode;
  className?: string;
  from: "left" | "right";
  delay?: number;
};

export function RevealOnEnter({
  children,
  className,
  from,
  delay = 0,
}: RevealOnEnterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    let frame = 0;
    const show = () => {
      frame = requestAnimationFrame(() => setVisible(true));
    };

    const rect = node.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.88 && rect.bottom > 48;
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
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={[
        className,
        styles.reveal,
        from === "left" ? styles.fromLeft : styles.fromRight,
        hidden && !visible ? styles.hidden : "",
        visible ? styles.visible : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ transitionDelay: visible ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}
