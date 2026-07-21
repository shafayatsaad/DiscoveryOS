// Purpose: Show an instant loading state during page transitions so users never see a blank screen.

import { Logo } from "@/components/ui/logo";

export default function Loading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-[#0a0e14] px-6"
      aria-busy="true"
      role="status"
    >
      <div className="relative flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <div className="absolute inset-0 -z-10 h-32 w-32 self-center rounded-full bg-primary/[0.04] blur-2xl" />

        <Logo size="lg" className="animate-float" />

        <div className="relative mt-2 h-[2px] w-48 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="absolute inset-y-0 left-0 w-1/3 animate-shimmer rounded-full bg-gradient-to-r from-primary via-[#7dd3fc] to-primary"
            style={{ animationDuration: "1.5s" }}
          />
        </div>

        <p className="font-display text-xs font-bold uppercase tracking-normal text-outline">
          Initializing OS
        </p>
      </div>
    </div>
  );
}
