// Purpose: Render the DiscoveryOS landing hero with animated shader background.

import { PlayCircle, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { primaryDemoHref } from "@/features/demo/data/demo-projects";
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
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/25 via-background/60 to-background" />

      <div className="relative z-10 mx-auto flex w-full max-w-container-max flex-col items-center text-center">
        <MotionDiv
          className="mb-8 flex items-center gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
        >
          <span className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-surface-container-low px-3.5 py-1.5 font-display text-xs font-semibold text-on-surface-variant hover:border-primary/20 transition-all duration-300">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            v0.1 — Early Access
          </span>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="animate-float"
        >
          <h1 className="mx-auto mb-6 max-w-5xl font-display text-5xl font-extrabold leading-[1.05] text-on-surface tracking-tight sm:text-6xl lg:text-[80px]">
            Accelerate Scientific Discovery with{" "}
            <span className="bg-gradient-to-r from-primary via-[#7dd3fc] to-secondary bg-clip-text text-transparent">
              Autonomous AI
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-base sm:text-lg leading-[1.7] text-on-surface-variant">
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
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Button
            asChild
            size="lg"
            variant="glow"
            className="w-full min-w-44 sm:w-auto"
          >
            <Link href="/dashboard">
              Start Discovery
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="w-full min-w-44 sm:w-auto"
          >
            <Link href="#capabilities">View Capabilities</Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="w-full min-w-44 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5 sm:w-auto"
          >
            <Link href={primaryDemoHref}>
              <PlayCircle className="h-4 w-4 shrink-0" />
              Try Demo
            </Link>
          </Button>
        </MotionDiv>

        <MotionDiv
          className="mt-20 flex flex-col items-center gap-2 cursor-pointer opacity-40 hover:opacity-80 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.4 }}
        >
          <span className="font-display text-[10px] font-bold uppercase tracking-normal">Explore OS</span>
          <div className="h-6 w-[1px] bg-gradient-to-b from-primary/80 to-transparent" />
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
