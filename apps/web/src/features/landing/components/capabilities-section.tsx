// Purpose: Render the DiscoveryOS bento capability grid with glassmorphism cards.

import { ArrowUpRight, GitFork } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  MotionDiv,
  MotionSection,
} from "@/features/landing/components/motion-primitives";
import {
  featureCards,
  pipelineStages,
} from "@/features/landing/data/landing-content";
import { cn } from "@/lib/utils";

const toneClasses = {
  primary: "text-primary bg-primary/10 border-primary/20",
  secondary: "text-secondary bg-secondary/10 border-secondary/20",
  tertiary: "text-tertiary bg-tertiary/10 border-tertiary/20",
};

const toneGradients = {
  primary: "from-primary/5 via-transparent to-transparent",
  secondary: "from-secondary/5 via-transparent to-transparent",
  tertiary: "from-tertiary/5 via-transparent to-transparent",
};

export function CapabilitiesSection() {
  return (
    <MotionSection
      id="capabilities"
      className="mx-auto w-full max-w-container-max px-5 py-24 sm:px-10"
    >
      <div className="mb-16">
        <span className="mb-4 inline-block font-display text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          Capabilities
        </span>
        <h2 className="mb-4 font-display text-3xl font-semibold leading-[1.2] text-on-surface tracking-tight sm:text-4xl">
          Core Capabilities
        </h2>
        <p className="max-w-2xl text-base leading-[1.7] text-on-surface-variant">
          Modular systems designed to parallelize literature review, hypothesis
          generation, and data synthesis — all working together in a unified
          research workflow.
        </p>
      </div>

      <div className="grid auto-rows-[minmax(280px,auto)] grid-cols-1 gap-6 md:grid-cols-3">
        {featureCards.map((feature) => {
          const Icon = feature.icon;

          return (
            <MotionDiv
              key={feature.title}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-surface-container/80 to-surface-container-low p-6"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {/* Hover gradient overlay */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  toneGradients[feature.tone],
                )}
              />

              <div
                className={cn(
                  "relative z-10 mb-auto flex h-12 w-12 items-center justify-center rounded-lg border",
                  toneClasses[feature.tone],
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="relative z-10 mt-8">
                <h3 className="mb-2 font-display text-xl font-medium leading-[1.4] text-on-surface">
                  {feature.title}
                </h3>
                <p className="text-sm leading-[1.6] text-on-surface-variant">
                  {feature.description}
                </p>
              </div>
              <div className="relative z-10 mt-4 flex items-center gap-1 text-xs font-medium text-on-surface-variant/60 transition-colors duration-200 group-hover:text-primary">
                <span>Explore</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </MotionDiv>
          );
        })}

        <ExecutionPipeline />
        <CtaCard />
      </div>
    </MotionSection>
  );
}

function ExecutionPipeline() {
  return (
    <MotionDiv
      id="pipeline"
      className="group relative flex h-[400px] flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-surface-container/80 p-0 md:col-span-2"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.05] bg-surface-container/50 p-6 backdrop-blur-md">
        <div>
          <h3 className="font-display text-xl font-medium leading-[1.4] text-on-surface">
            Execution Pipeline
          </h3>
          <p className="text-sm leading-[1.5] text-on-surface-variant">
            Visual orchestration of concurrent research tasks.
          </p>
        </div>
        <GitFork className="h-5 w-5 text-outline" />
      </div>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#0b0f14] p-6">
        <div className="grid-mask absolute inset-0 opacity-[0.18]" />
        <div className="relative z-10 grid w-full max-w-2xl grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_32px_1fr_32px_1fr]">
          {pipelineStages.map((stage, index) => (
            <PipelineStage key={stage.title} index={index} stage={stage} />
          ))}
        </div>
      </div>
    </MotionDiv>
  );
}

function PipelineStage({
  stage,
  index,
}: {
  stage: (typeof pipelineStages)[number];
  index: number;
}) {
  return (
    <>
      <div
        className={cn(
          "rounded-lg border bg-surface/80 p-3 transition-all duration-200",
          stage.active
            ? "border-primary/30 bg-primary/[0.06] shadow-[0_0_15px_rgba(173,198,255,0.10)]"
            : "border-white/10",
          stage.progress === 0 && "opacity-55",
        )}
      >
        <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase leading-[1.5] text-primary">
          <span>{stage.label}</span>
          {stage.active ? (
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          ) : null}
        </div>
        <div className="truncate font-display text-xs font-semibold uppercase tracking-normal text-on-surface">
          {stage.title}
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded bg-surface-container-high">
          <div
            className="h-full rounded bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
            style={{ width: `${stage.progress}%` }}
          />
        </div>
      </div>
      {index < pipelineStages.length - 1 ? (
        <div
          className="hidden h-px bg-gradient-to-r from-transparent via-white/20 to-transparent sm:block"
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}

function CtaCard() {
  return (
    <MotionDiv
      className="group relative flex min-h-[320px] flex-col justify-center overflow-hidden rounded-xl border border-primary/10 bg-gradient-to-br from-primary/[0.04] to-surface p-6 md:col-span-1"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/[0.06] blur-[60px]" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-primary/[0.04] blur-[40px]" />

      <h3 className="relative z-10 mb-3 font-display text-2xl font-medium leading-[1.3] text-on-surface tracking-tight">
        Ready to accelerate?
      </h3>
      <p className="relative z-10 mb-8 text-sm leading-[1.6] text-on-surface-variant">
        Deploy your first autonomous research agent in under 5 minutes.
      </p>
      <Button className="relative z-10 w-full group-hover:shadow-[0_0_20px_rgba(173,198,255,0.15)] transition-shadow duration-300">
        Start Building Free
        <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    </MotionDiv>
  );
}
