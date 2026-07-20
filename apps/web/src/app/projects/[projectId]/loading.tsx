// Purpose: Show an instant loading skeleton during project page transitions.

export default function ProjectLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f14]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="font-display text-sm font-medium text-on-surface-variant">
          Loading project...
        </p>
      </div>
    </div>
  );
}
