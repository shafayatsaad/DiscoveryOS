// Purpose: Render the dashboard research-goal command input and quick actions.

import { Mic, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/features/landing/components/motion-primitives";
import { quickActions } from "@/features/dashboard/data/dashboard-content";

export function CommandCenter() {
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

        <form className="mt-8 w-full max-w-4xl" action="#">
          <label className="sr-only" htmlFor="research-query">
            Research problem
          </label>
          <div className="glow-focus relative rounded-lg">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline-variant" />
            <input
              id="research-query"
              className="h-16 w-full rounded-lg border border-white/10 bg-[#0b0f14] py-3 pl-12 pr-36 font-mono text-sm text-on-surface outline-none transition-colors placeholder:text-outline-variant focus:border-primary focus:ring-0 sm:pr-44"
              placeholder="e.g., Analyze protein folding pathways in Alzheimer's model..."
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
                Run Query
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/60 px-4 py-2 font-display text-xs font-semibold text-on-surface-variant transition-colors hover:bg-white/[0.05] hover:text-on-surface"
                type="button"
              >
                <Icon className="h-3.5 w-3.5" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </MotionDiv>
  );
}
