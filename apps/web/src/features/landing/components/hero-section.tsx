// Purpose: Render the Stitch landing hero with animated shader background.

import { Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MotionDiv, MotionSection } from "@/features/landing/components/motion-primitives";
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

      <div className="relative z-10 mx-auto flex w-full max-w-container-max flex-col items-center text-center">
        <MotionDiv
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-normal text-primary"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
        >
          <Trophy className="h-3.5 w-3.5" />
          OpenAI Hackathon Winner
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="mx-auto mb-6 max-w-4xl font-display text-5xl font-semibold leading-[1.1] text-on-surface tracking-normal sm:text-6xl lg:text-[72px]">
            Accelerate Scientific Discovery with{" "}
            <span className="text-primary">Autonomous AI</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-[1.6] text-on-surface-variant">
            The first Operating System for autonomous research discoveries. Orchestrate complex
            evidence retrieval, synthesize models, and deploy specialized agents in a unified,
            distraction-free environment.
          </p>
        </MotionDiv>

        <MotionDiv
          className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.45 }}
        >
          <Button size="lg" className="w-full min-w-40 sm:w-auto">
            Request Demo
          </Button>
          <Button variant="secondary" size="lg" className="w-full min-w-40 sm:w-auto">
            Read Documentation
          </Button>
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
