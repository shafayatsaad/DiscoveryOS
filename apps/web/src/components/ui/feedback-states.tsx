"use client";

// Purpose: Reusable premium loading, empty, and success states for app work surfaces.

import { CheckCircle2, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-white/[0.06] before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent",
        className,
      )}
    />
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  className,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-8 text-center", className)}>
      <Icon className="mb-3 h-8 w-8 text-outline-variant" />
      <p className="font-display text-sm font-medium text-on-surface-variant">{title}</p>
      <p className="mt-1 max-w-xs text-xs leading-5 text-outline">{body}</p>
    </div>
  );
}

export function SuccessMark({ label }: { label: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      className="inline-flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-1.5 font-display text-xs font-semibold text-emerald-300"
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <motion.span
        initial={prefersReducedMotion ? false : { scale: 0.8 }}
        animate={prefersReducedMotion ? undefined : { scale: [0.8, 1.08, 1] }}
        transition={{ duration: 0.34, ease: "easeOut" }}
      >
        <CheckCircle2 className="h-4 w-4" />
      </motion.span>
      {label}
    </motion.span>
  );
}
