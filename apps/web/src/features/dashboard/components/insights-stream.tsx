// Purpose: Render the dashboard timeline of mocked research insights.

import { Eye, Lightbulb } from "lucide-react";

import { insightStream } from "@/features/dashboard/data/dashboard-content";
import { cn } from "@/lib/utils";

export function InsightsStream() {
  return (
    <section className="glass-panel rounded-lg p-5 sm:p-6" aria-labelledby="insights-heading">
      <div className="mb-5 border-b border-white/[0.05] pb-4">
        <h2
          id="insights-heading"
          className="flex items-center gap-2 font-display text-2xl font-semibold leading-[1.25] text-on-surface"
        >
          <Lightbulb className="h-5 w-5 text-primary" />
          Latest Insights Stream
        </h2>
      </div>

      <div className="relative space-y-7 pl-7">
        <div className="absolute bottom-2 left-[6px] top-3 w-px bg-white/10" />
        {insightStream.map((insight) => (
          <article key={`${insight.time}-${insight.tag}`} className="relative">
            <span
              className={cn(
                "absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 bg-surface",
                insight.primary ? "border-primary" : "border-outline-variant",
              )}
            />
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "font-display text-xs font-semibold",
                  insight.primary ? "text-primary" : "text-on-surface-variant",
                )}
              >
                {insight.time}
              </span>
              <span className="rounded bg-white/[0.05] px-2 py-0.5 font-mono text-xs font-semibold text-on-surface-variant">
                {insight.tag}
              </span>
            </div>
            <p className="max-w-3xl text-base leading-[1.55] text-on-surface sm:text-lg">
              {insight.body}
            </p>
            {insight.action ? (
              <button
                className="mt-4 inline-flex items-center gap-2 font-mono text-sm text-outline-variant transition-colors hover:text-on-surface"
                type="button"
              >
                <Eye className="h-4 w-4" />
                {insight.action}
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
