"use client";

// Purpose: Centralize subtle Framer Motion patterns for dense DiscoveryOS surfaces.

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  interactive?: boolean;
};

export function AnimatedCard({
  children,
  className,
  delay = 0,
  interactive = true,
}: AnimatedCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("min-w-0", className)}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={
        !prefersReducedMotion && interactive
          ? { y: -2, transition: { duration: 0.16 } }
          : undefined
      }
      transition={{ delay, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export const MotionList = motion.div;
export const MotionItem = motion.div;
