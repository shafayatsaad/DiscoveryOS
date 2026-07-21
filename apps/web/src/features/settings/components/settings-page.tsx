// Purpose: Render project-level DiscoveryOS settings using demo configuration state.

import { Bell, Database, KeyRound, SlidersHorizontal, Workflow } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { ProjectFooter } from "@/features/projects/components/project-footer";
import { ProjectSidebar } from "@/features/projects/components/project-sidebar";
import { getProjectOverview } from "@/features/projects/data/research-project-content";

const settingsGroups = [
  {
    title: "Pipeline Controls",
    icon: Workflow,
    settings: ["Pause before report generation", "Require review for contradictions", "Auto-build graph snapshots"],
  },
  {
    title: "Evidence Thresholds",
    icon: SlidersHorizontal,
    settings: ["Minimum confidence: 80%", "Show indirect evidence", "Flag unsupported claims"],
  },
  {
    title: "Data Sources",
    icon: Database,
    settings: ["OpenAlex enabled", "PubMed enabled", "arXiv enabled"],
  },
  {
    title: "Notifications",
    icon: Bell,
    settings: ["Pipeline completion", "Contradiction alerts", "Report ready"],
  },
];

export function SettingsPage({ projectId }: { projectId: string }) {
  const project = getProjectOverview(projectId);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-on-surface md:flex">
      <ProjectSidebar activeSection="settings" projectId={projectId} />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-6 px-5 py-6 sm:px-8 md:px-10 md:py-10">
          <Reveal>
            <header className="glass-panel rounded-xl p-5 sm:p-6">
              <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-xs font-semibold uppercase tracking-normal text-primary">
                {project.domain} Workspace
              </span>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-on-surface">
                Settings
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-[1.6] text-on-surface-variant">
                Configure the research workspace for {project.title}. These controls are frontend-only and ready for future API-backed preferences.
              </p>
            </header>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {settingsGroups.map((group, index) => {
              const Icon = group.icon;

              return (
                <Reveal key={group.title} delay={index * 0.04}>
                  <section className="glass-panel rounded-xl p-5" aria-labelledby={`${group.title}-heading`}>
                    <h2 id={`${group.title}-heading`} className="mb-5 flex items-center gap-2 font-display text-xl font-semibold text-on-surface">
                      <Icon className="h-5 w-5 text-primary" />
                      {group.title}
                    </h2>
                    <div className="space-y-3">
                      {group.settings.map((setting, settingIndex) => (
                        <label
                          key={setting}
                          className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-white/[0.05] bg-surface/50 p-3 text-sm text-on-surface-variant transition-colors hover:border-primary/20 hover:text-on-surface"
                        >
                          <span>{setting}</span>
                          <input
                            className="h-4 w-4 accent-primary"
                            type="checkbox"
                            defaultChecked={settingIndex !== 1}
                          />
                        </label>
                      ))}
                    </div>
                  </section>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.12}>
            <section className="glass-panel rounded-xl p-5">
              <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold text-on-surface">
                <KeyRound className="h-5 w-5 text-primary" />
                Integration Readiness
              </h2>
              <p className="text-sm leading-[1.6] text-on-surface-variant">
                API keys, MCP permissions, and team access are represented here as inactive product settings. No secrets or backend calls are stored in the frontend.
              </p>
            </section>
          </Reveal>
        </div>
        <ProjectFooter />
      </main>
    </div>
  );
}
