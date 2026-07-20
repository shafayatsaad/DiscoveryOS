// Purpose: Show an instant loading skeleton during project page transitions.

import { SkeletonBlock } from "@/components/ui/feedback-states";

export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-[#0a0e14] md:flex">
      {/* Sidebar Skeleton */}
      <div className="hidden h-screen w-[280px] shrink-0 flex-col border-r border-white/5 bg-surface/20 p-6 md:flex">
        <SkeletonBlock className="h-9 w-40 mb-8" />
        <SkeletonBlock className="h-10 w-full mb-10" />
        <div className="space-y-4 flex-1">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <SkeletonBlock key={item} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Main Workspace Skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar skeleton */}
        <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between">
          <SkeletonBlock className="h-6 w-32" />
          <SkeletonBlock className="h-8 w-24 rounded-full" />
        </div>

        {/* Workspace body skeleton */}
        <div className="mx-auto grid w-full max-w-container-max flex-1 grid-cols-1 gap-6 px-5 py-6 sm:px-8 md:px-10 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-6">
            <SkeletonBlock className="h-4 w-48" /> {/* Breadcrumbs */}
            <div className="glass-panel p-6 rounded-lg space-y-4"> {/* Header panel */}
              <SkeletonBlock className="h-8 w-2/3" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
            <div className="glass-panel p-6 rounded-lg space-y-4"> {/* Pipeline */}
              <SkeletonBlock className="h-6 w-36" />
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <SkeletonBlock key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-lg space-y-6"> {/* Sidebar synopsis */}
            <SkeletonBlock className="h-6 w-48" />
            <SkeletonBlock className="h-32 w-full rounded-lg" />
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between gap-4">
                  <SkeletonBlock className="h-4 w-20" />
                  <SkeletonBlock className="h-4 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
