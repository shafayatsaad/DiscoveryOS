// Purpose: Render the DiscoveryOS landing hero with animated shader background.

import { Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  MotionDiv,
  MotionSection,
} from "@/features/landing/components/motion-primitives";
import { ShaderBackground } from "@/features/landing/components/shader-background";

export function HeroSection() {
  return (
    <MotionSection
      id="top"
      className="relative flex min-h-[720px] w-full items-center justify-center overflow-hidden border-b border-white/[0.05] px-5 py-24 sm:min-h-[870px] sm:px-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55 }}
    >
      <ShaderBackground />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/35 via-background/70 to-background" />

      {/* Ambient glow behind content */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-container-max flex-col items-center text-center">
        <MotionDiv
          className="mb-8 flex items-center gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          <span className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-surface-container-low px-3 py-1.5 font-display text-xs font-medium text-on-surface-variant">
            <Sparkles className="h-3 w-3 text-primary" />
            v0.1 — Early Access
          </span>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5 }}
        >
          <h1 className="mx-auto mb-6 max-w-5xl font-display text-5xl font-semibold leading-[1.05] text-on-surface tracking-tight sm:text-6xl lg:text-[80px]">
            Accelerate Scientific Discovery with{" "}
            <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
              Autonomous AI
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-[1.7] text-on-surface-variant">
            The first Operating System for autonomous research discoveries.
            Orchestrate complex evidence retrieval, synthesize models, and
            deploy specialized agents in a unified, distraction-free
            environment.
          </p>
        </MotionDiv>

        <MotionDiv
          className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
        >
          <Button
            asChild
            size="lg"
            className="group relative w-full min-w-40 overflow-hidden sm:w-auto"
          >
            <Link href="/dashboard">
              <span className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative z-10">Start Discovery</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="w-full min-w-40 sm:w-auto"
          >
            <Link href="#capabilities">View Capabilities</Link>
          </Button>
        </MotionDiv>

        {/* Subtle bottom indicator */}
        <div className="mt-16 h-px w-32 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
    </MotionSection>
  );
}
