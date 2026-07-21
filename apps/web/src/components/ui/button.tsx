"use client";

// Purpose: Provide a reusable shadcn-style Button primitive for DiscoveryOS.

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-display text-xs font-semibold uppercase tracking-normal transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-on-primary shadow-[0_4px_12px_rgba(173,198,255,0.15)] hover:shadow-[0_4px_20px_rgba(173,198,255,0.3)] hover:brightness-[1.05] active:translate-y-px transition-all duration-300",
        secondary:
          "border border-white/10 bg-white/[0.02] text-on-surface backdrop-blur-md hover:border-primary/30 hover:bg-white/[0.05] hover:text-primary hover:shadow-[0_0_15px_rgba(173,198,255,0.06)] active:translate-y-px transition-all duration-300",
        ghost: "text-on-surface-variant hover:bg-white/[0.04] hover:text-primary transition-colors duration-200",
        glow: "relative bg-gradient-to-r from-primary via-[#7dd3fc] to-primary/80 text-on-primary shadow-glow-primary hover:brightness-[1.08] active:translate-y-px transition-all duration-300",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 rounded-md px-3.5",
        lg: "h-12 rounded-lg px-8 text-sm",
        icon: "h-9 w-9 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragEnd" | "onDragStart"
    >,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={prefersReducedMotion ? undefined : { y: -1 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
