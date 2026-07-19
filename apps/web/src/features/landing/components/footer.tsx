// Purpose: Render the DiscoveryOS dark footer with links and branding.

import { Github, BookOpen, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-white/[0.05] bg-surface">
      <div className="mx-auto flex w-full max-w-container-max flex-col gap-8 px-5 py-12 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Brand */}
          <div>
            <span className="font-display text-lg font-bold text-on-surface">
              DiscoveryOS
            </span>
            <p className="mt-1 max-w-xs text-xs leading-[1.5] text-on-surface-variant">
              Autonomous Scientific Discovery Platform — Orchestrating research
              at the intersection of AI agents and knowledge graphs.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6">
            {["Documentation", "API", "Support", "Ethics Policy"].map(
              (link) => (
                <Link
                  key={link}
                  href="#"
                  className="text-xs font-semibold uppercase tracking-normal text-on-surface-variant transition-colors hover:text-primary"
                >
                  {link}
                </Link>
              ),
            )}
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            {[
              { icon: Github, label: "GitHub" },
              { icon: BookOpen, label: "Docs" },
              { icon: Mail, label: "Email" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-surface-container-low text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.05] pt-6 md:flex-row">
          <span className="text-[11px] font-medium text-on-surface-variant/60">
            &copy; {new Date().getFullYear()} DiscoveryOS — Autonomous
            Scientific Research Shell
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-medium text-on-surface-variant/60">
              Built for researchers
            </span>
            <span className="h-3 w-px bg-white/[0.08]" />
            <span className="text-[11px] font-medium text-on-surface-variant/60">
              Open source
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
