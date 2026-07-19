// Purpose: Render the project workspace top utility navigation.

import { Bell, CircleHelp, Microscope, Search } from "lucide-react";

export function ProjectTopBar() {
  return (
    <header className="sticky top-0 z-40 hidden h-16 items-center justify-between border-b border-white/10 bg-surface/80 px-10 backdrop-blur-xl md:flex">
      <nav className="flex gap-6 font-display text-sm font-semibold" aria-label="Workspace">
        <a className="border-b-2 border-primary pb-1 text-primary" href="#">
          Projects
        </a>
        <a className="pb-1 text-on-surface-variant transition-colors hover:text-primary" href="#">
          Current Research
        </a>
      </nav>

      <div className="flex items-center gap-4">
        <label className="relative hidden lg:block">
          <span className="sr-only">Search parameters</span>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            className="h-10 w-64 rounded-lg border border-white/10 bg-surface-container-highest py-2 pl-10 pr-4 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary/50"
            placeholder="Search parameters..."
            type="search"
          />
        </label>
        <button className="text-on-surface-variant transition-colors hover:text-primary" type="button" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <button className="text-on-surface-variant transition-colors hover:text-primary" type="button" aria-label="Help">
          <CircleHelp className="h-5 w-5" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-surface-container-high">
          <Microscope className="h-4 w-4 text-primary" />
        </div>
      </div>
    </header>
  );
}
