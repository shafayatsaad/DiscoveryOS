# DiscoveryOS Performance Report

Date: 2026-07-21

Scope: Next.js routing, Server Components, dynamic imports, Suspense/loading states, API latency, streaming, React rendering, database usage, graph rendering, hydration, bundle size, caching, prefetching, images, fonts, and Tailwind output.

## Executive Summary

The exact remaining navigation bottleneck was dashboard hydration and network work, not database latency. The dashboard rendered a passive `ProcessesPanel` that opened the pipeline `EventSource` stream as soon as the page loaded. That meant ordinary navigation could create backend work, reconnect timers, event handlers, and React state churn before the user asked the agent pipeline to run.

The second avoidable cost was a global React Query provider in the root layout, even though no query hook was used in the app. That provider forced an unnecessary client boundary and shipped unused React Query code across the app.

After optimization, navigation is driven by static/SSG App Router pages, Next prefetch, deferred graph rendering, no passive dashboard stream, no unused React Query provider, and production standalone output.

## Exact Bottleneck

Primary bottleneck:

- `apps/web/src/features/dashboard/components/processes-panel.tsx` called `usePipelineStream` during dashboard render.
- `usePipelineStream` created an `EventSource` connection to the API on page load.
- The stream was only visually summarizing process state, but it behaved like an active execution surface.
- Result: dashboard navigation paid for streaming setup, backend coordination, reconnect behavior, and repeated client state updates before user intent.

Secondary bottleneck:

- `apps/web/src/app/layout.tsx` wrapped every route in an unused `AppProviders` client component.
- `apps/web/src/providers/app-providers.tsx` created a React Query client globally.
- No active code used `@tanstack/react-query`, so this was pure shared hydration and bundle overhead.

Confirmed non-bottlenecks:

- Project pages are SSG through `generateStaticParams`.
- Known project navigation does not hit the database on the critical render path.
- Knowledge graph rendering is already split behind a dynamic import with `ssr: false`.
- API health/readiness endpoints are not blocking client route transitions.

## Measurements

Production build after optimization:

```text
Next.js 15.5.20
Compiled successfully in 17.5s
Generated static pages: 95/95

/dashboard                                      11.3 kB    167 kB first load
/projects/[projectId]                           1.47 kB   163 kB first load
/projects/[projectId]/evidence                  3.39 kB   156 kB first load
/projects/[projectId]/graph                    11.7 kB    164 kB first load
/projects/[projectId]/pipeline                  3.89 kB   156 kB first load
/projects/[projectId]/workflow                  127 B     103 kB first load
Shared first-load JS                            103 kB
```

Verification commands:

```bash
npm run build
npm run lint
npm run typecheck
npm run test:e2e --workspace=apps/web
```

All four passed after the optimization pass. The Playwright route smoke suite rendered the sampled pages in roughly 323 ms to 641 ms after the initial page load on the local standalone server, and the dashboard stream interaction completed in 1.4 s with mocked API events.

## Optimizations Applied

### Navigation and Routing

- Kept project routes statically generated with `generateStaticParams`.
- Confirmed the app renders 95 static/SSG pages in production.
- Kept explicit `prefetch={true}` on project workspace navigation links.
- Preserved the existing App Router layout structure so the product did not get redesigned.

### Server Components

- Removed the unused global `AppProviders` wrapper from `apps/web/src/app/layout.tsx`.
- Returned the root layout to a server-rendered shell with only necessary client islands below it.
- Deleted `apps/web/src/providers/app-providers.tsx`.

### Streaming and API Latency

- Replaced dashboard process streaming with a lightweight static summary sourced from `activeProcesses`.
- Kept live SSE behavior only in `CommandCenter`, where the user explicitly runs the pipeline.
- Eliminated the passive EventSource connection during ordinary dashboard navigation.
- Reduced backend load and avoided reconnect timers on route entry.

### React Rendering and Hydration

- Removed the unused React Query provider and package.
- Deleted unused `useMagicMoment` query hook.
- Reduced global client-side setup during initial hydration.
- Kept interactive islands scoped to components that actually need client state.

### Dynamic Imports and Graph Rendering

- Preserved the dynamic `GraphCanvas` import with `ssr: false`.
- Kept the graph library out of server rendering and out of non-graph route execution.
- Maintained a stable loading surface for graph hydration.

### Bundle Size

- Removed `@tanstack/react-query` from `apps/web/package.json` and `package-lock.json`.
- Added Next package import optimization for `lucide-react` and `framer-motion`.
- Preserved route-level code splitting for the graph canvas.

### Caching and Production Runtime

- Enabled Next standalone output for the frontend.
- Added `compress: true` and `poweredByHeader: false` in `next.config.ts`.
- Switched Docker runtime to serve the standalone Next server instead of the full workspace install.

### Images and Fonts

- Existing product screenshots remain static local assets.
- No remote image bottleneck was found in route navigation.
- No font loading blocker was introduced by this pass.

### Tailwind

- Tailwind remains compiled by the Next production build.
- No large runtime Tailwind dependency is shipped to the browser.
- Existing visual utility structure was preserved.

## Stack Review

| Area | Finding | Action |
| --- | --- | --- |
| Next.js routing | Known project pages are SSG | Kept and documented |
| Server Components | Root provider forced unnecessary client setup | Removed provider |
| Dynamic imports | Graph canvas is correctly deferred | Kept |
| Suspense/loading | Graph loading state is stable | Kept |
| API latency | Not on static route critical path | Confirmed |
| Streaming | Passive dashboard SSE was the bottleneck | Removed from dashboard render |
| React rendering | Unused query client inflated hydration | Removed |
| Database | Not used for static navigation | Confirmed |
| Graph rendering | Heavy graph isolated to graph route | Kept dynamic |
| Hydration | Root hydration reduced | Removed global client provider |
| Bundle size | Unused React Query dependency | Uninstalled |
| Caching | Standalone production server enabled | Added |
| Prefetching | Project nav prefetch is explicit | Kept |
| Images | Local static assets | No change needed |
| Fonts | No remote blocking issue found | No change needed |
| Tailwind | Static compiled CSS | No change needed |

## Files Changed

- `apps/web/src/app/layout.tsx`
- `apps/web/src/features/dashboard/components/processes-panel.tsx`
- `apps/web/src/providers/app-providers.tsx`
- `apps/web/src/features/dashboard/hooks/use-magic-moment.ts`
- `apps/web/package.json`
- `package-lock.json`
- `apps/web/next.config.ts`
- `apps/web/playwright.config.ts`
- `apps/web/tests/e2e/frontend-routes.spec.ts`
- `apps/web/tests/e2e/start-standalone.mjs`
- `apps/web/Dockerfile`
- `apps/api/Dockerfile`
- `docker-compose.yml`
- `docker-compose.dev.yml`
- `docker-compose.prod.yml`
- `.dockerignore`
- `.env.example`

## Result

Navigation now behaves like a static SaaS workspace: pages are prerendered, prefetched, and hydrated with fewer global client responsibilities. The dashboard no longer opens a backend stream on arrival, so the expensive path is reserved for the explicit `Run Query` interaction.
