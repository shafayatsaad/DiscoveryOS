// Purpose: Show an instant loading state during page transitions so users never see a blank screen.

import { Logo } from "@/components/ui/logo";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0e14] px-6">
      <div className="relative flex flex-col items-center gap-6 max-w-sm w-full text-center">
        {/* Glow effect back drop */}
        <div className="absolute inset-0 -z-10 h-32 w-32 rounded-full bg-primary/[0.04] blur-2xl self-center" />
        
        <Logo size="lg" className="animate-float" />
        
        <div className="w-48 h-[2px] bg-white/[0.06] rounded-full overflow-hidden relative mt-2">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-primary via-[#7dd3fc] to-primary rounded-full animate-shimmer" 
               style={{ animationDuration: '1.5s' }} />
        </div>
        
        <p className="font-display text-xs font-bold uppercase tracking-widest text-outline">
          Initializing OS
        </p>
      </div>
    </div>
  );
}
