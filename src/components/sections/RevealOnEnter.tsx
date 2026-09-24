"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

type RevealOnEnterProps = {
  children: ReactNode;
  className?: string;
  from: "left" | "right";
  delay?: number;
};

/** @deprecated Use Reveal from @/components/motion/Reveal. */
export function RevealOnEnter({ children, className, from, delay = 0 }: RevealOnEnterProps) {
  return (
    <Reveal variant={from} delay={delay} className={className}>
      {children}
    </Reveal>
  );
}
