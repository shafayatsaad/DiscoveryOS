"use client";

// Purpose: Render the dashboard research-goal command input and animated magic-moment pipeline.

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, FileText, GitBranch, Lightbulb, Mic, Network, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/features/landing/components/motion-primitives";
import {
  magicMomentQuestion,
  quickActions,
} from "@/features/dashboard/data/dashboard-content";
import { useMagicMoment } from "@/features/dashboard/hooks/use-magic-moment";
import { primaryProjectId, projectRoute } from "@/features/projects/data/project-workspaces";
import { cn } from "@/lib/utils";

export function CommandCenter() {
  const { data: magicMoment } = useMagicMoment();
  const magicPipelineSteps = magicMoment?.steps ?? [];
  const magicMomentResults = magicMoment?.results ?? [];
  const magicStepCount = magicPipelineSteps.length;
  const [query, setQuery] = useState("");
  const [activeStep, setActiveStep] = useState(-1);
  const isRunning = activeStep >= 0 && magicStepCount > 0 && activeStep < magicStepCount - 1;
  const isComplete = magicStepCount > 0 && activeStep >= magicStepCount - 1;

  useEffect(() => {
    if (activeStep < 0 || magicStepCount === 0 || activeStep >= magicStepCount - 1) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveStep((step) => step + 1);
    }, 520);

    return () => window.clearTimeout(timer);
  }, [activeStep, magicStepCount]);

  function runDiscovery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery((currentQuery) => currentQuery.trim() || magicMomentQuestion);
    setActiveStep(0);
  }

  return (
    <MotionDiv
      className="glass-panel relative overflow-hidden rounded-xl p-6 text-center sm:p-8 md:p-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(173,198,255,0.06),transparent_60%)]" />
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
        <h1 className="max-w-3xl font-display text-3xl font-semibold leading-[1.15] text-on-surface sm:text-4xl lg:text-5xl">
          What scientific problem are you trying to solve today?
        </h1>

        <form className="mt-8 w-full max-w-4xl" action="#" onSubmit={runDiscovery}>
          <label className="sr-only" htmlFor="research-query">
            Research problem
          </label>
          <div className="glow-focus relative rounded-lg">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline-variant" />
            <input
              id="research-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-16 w-full rounded-lg border border-white/10 bg-[#0b0f14] py-3 pl-12 pr-36 font-mono text-sm text-on-surface outline-none transition-colors placeholder:text-outline-variant focus:border-primary focus:ring-0 sm:pr-44"
              placeholder={magicMomentQuestion}
              type="text"
            />
            <div className="absolute inset-y-0 right-2 flex items-center gap-2">
              <button
                className="hidden rounded-md p-2 text-outline-variant transition-colors hover:text-primary sm:inline-flex"
                type="button"
                aria-label="Voice input"
              >
                <Mic className="h-4 w-4" />
              </button>
              <Button type="submit" size="sm" variant="secondary" className="border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary">
                {isRunning ? "Running" : "Run Query"}
              </Button>
            </div>
          </div>
        </form>

        {activeStep >= 0 ? (
          <MotionDiv
            className="mt-8 grid w-full grid-cols-1 gap-4 text-left lg:grid-cols-[1.1fr_0.9fr]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <section className="glass-card rounded-xl p-5" aria-labelledby="magic-pipeline-heading">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-xs font-semibold uppercase tracking-normal text-primary">
                    DiscoveryOS Pipeline
                  </p>
                  <h2 id="magic-pipeline-heading" className="mt-1 font-display text-xl font-semibold text-on-surface">
                    {query || magicMomentQuestion}
                  </h2>
                </div>
                <span className="rounded-md bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                  {isComplete ? "Complete" : "Streaming"}
                </span>
              </div>
              <div className="space-y-3">
                {magicPipelineSteps.map((step, index) => {
                  const completed = index <= activeStep;
                  const current = index === activeStep && !isComplete;

                  return (
                    <div
                      key={step.label}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border border-white/[0.05] bg-surface/50 p-3 transition-all duration-300",
                        current && "border-primary/30 bg-primary/[0.06]",
                        !completed && "opacity-45",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                          completed
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-white/10 text-outline-variant",
                        )}
                      >
                        {completed ? <Check className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-sm font-semibold text-on-surface">{step.label}</span>
                        <span className="mt-1 block text-xs leading-[1.45] text-on-surface-variant">{step.detail}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="glass-card rounded-xl p-5" aria-labelledby="magic-results-heading">
              <p className="font-display text-xs font-semibold uppercase tracking-normal text-primary">
                Demo Outcome
              </p>
              <h2 id="magic-results-heading" className="mt-1 font-display text-xl font-semibold text-on-surface">
                {isComplete ? "Evidence-backed workspace ready" : "Assembling research memory"}
              </h2>
              <div className="mt-5 space-y-3">
                {magicMomentResults.map((result, index) => (
                  <MotionDiv
                    key={result.label}
                    className={cn(
                      "rounded-lg border border-white/[0.05] bg-surface/50 p-3",
                      !isComplete && "opacity-45",
                    )}
                    initial={false}
                    animate={{ opacity: isComplete ? 1 : 0.45, y: isComplete ? 0 : 4 }}
                    transition={{ delay: isComplete ? index * 0.05 : 0, duration: 0.25 }}
                  >
                    <p className="font-display text-xs font-semibold uppercase tracking-normal text-primary">
                      {result.label}
                    </p>
                    <p className="mt-1 text-sm leading-[1.45] text-on-surface-variant">{result.value}</p>
                  </MotionDiv>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { label: "Evidence", href: projectRoute(primaryProjectId, "evidence"), icon: FileText },
                  { label: "Graph", href: projectRoute(primaryProjectId, "graph"), icon: Network },
                  { label: "Experiments", href: projectRoute(primaryProjectId, "experiments"), icon: Lightbulb },
                  { label: "Report", href: projectRoute(primaryProjectId, "reports"), icon: GitBranch },
                ].map((link) => {
                  const Icon = link.icon;

                  return (
                    <Button key={link.label} asChild variant="secondary" size="sm" className="justify-center">
                      <Link href={link.href}>
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </section>
          </MotionDiv>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.label}
                href={action.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/60 px-4 py-2 font-display text-xs font-semibold text-on-surface-variant transition-colors hover:bg-white/[0.05] hover:text-on-surface"
              >
                <Icon className="h-3.5 w-3.5" />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>
    </MotionDiv>
  );
}
