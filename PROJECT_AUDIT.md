# DiscoveryOS Project Audit

Date: 2026-07-21

Scope: repository-wide production-readiness pass across frontend, API, demo data, Docker, documentation, routing performance, tests, and hackathon deliverables.

## Executive Summary

DiscoveryOS is now in a stronger hackathon shipping state. The main product surfaces build, lint, typecheck, and pass Playwright smoke coverage. The most important performance issue was project-route rendering: all project pages were dynamic server-rendered routes even though the project catalog is deterministic demo data. Those routes are now statically generated, and the heavy knowledge graph canvas is dynamically loaded behind a page-local boundary.

## Critical Issues

| Issue | Impact | Status |
| --- | --- | --- |
| Project routes were dynamic SSR (`ƒ`) instead of statically generated | Navigation between project screens waited on server work and RSC payload generation | Fixed |
| Knowledge graph route loaded React Flow in the initial route chunk | Graph navigation felt heavier than other pages; route size was 66.9 kB | Fixed |
| Frontend dashboard used `polymer-electrolyte-discovery`, but Docker seed created only a UUID project | `Run Query` failed against seeded Docker API with `PROJECT_NOT_FOUND` | Fixed |
| Root `dev:api` script pointed at `app.main:app` instead of the active `discoveryos_api.main:app` | Local API development command failed or targeted the wrong backend | Fixed |
| SSE reconnect path could leave stale EventSource instances open | Reconnect storms and duplicate streams were possible after transient errors | Fixed |

## Major Issues

| Issue | Impact | Status |
| --- | --- | --- |
| OpenAI Docker defaults used a non-OpenAI provider URL | Hackathon story and OpenAI integration docs were inconsistent | Fixed |
| E2E test suite depended on a live backend for dashboard streaming | CI could not reliably validate the frontend flow with only `next start` | Fixed with Playwright route stubs |
| Reports route smoke test asserted stale product copy | Tests did not match the actual UI | Fixed |
| `.github` contained no CI workflow | No automated quality gate for lint, typecheck, build, and API tests | Fixed |
| README read like internal project notes instead of a startup/demo landing page | Weaker judging and onboarding experience | Fixed |

## Minor Issues

| Issue | Impact | Status |
| --- | --- | --- |
| Active UI and comments used "mock" language for curated demo data | Product felt unfinished | Fixed in active frontend files |
| Docker had development defaults but no production-shaped override | Ambiguous production command | Fixed with `docker-compose.prod.yml` |
| Hackathon narration, Devpost copy, and diagrams were scattered or missing | Submission prep burden remained | Fixed in `docs/14-HACKATHON_DELIVERABLES.md` |
| Legacy `backend/` package still contains placeholder agents and prototype routes | Architectural ambiguity remains | Documented as remaining cleanup |

## Completed Fixes

- Added `apps/web/src/app/projects/[projectId]/layout.tsx` with `generateStaticParams()` for all curated project IDs.
- Deferred `GraphCanvas` with `next/dynamic` and `ssr: false` so React Flow no longer blocks the graph shell.
- Reworked `subscribeToPipeline()` to return a cleanup-safe subscription wrapper.
- Closed stale SSE subscriptions before scheduled reconnects.
- Aligned `scripts/seed_demo.py` with frontend project IDs and seeded realistic demo projects:
  - Solid-State Polymer Electrolytes
  - Heart Failure Biomarkers
  - Sustainable Battery Materials
  - Urban Heat Resilience
  - LLM Hallucination Detection
  - Microplastics and Alzheimer's
- Added API tests for demo pipeline query validation and frontend project ID contract.
- Fixed `npm run dev:api` to start the active FastAPI package with `--app-dir src`.
- Replaced non-OpenAI Docker defaults with OpenAI API defaults.
- Rewrote `README.md` with product copy, screenshots, diagrams, setup, OpenAI, MCP, Docker, and demo sections.
- Added `docker-compose.prod.yml`.
- Added `.github/workflows/ci.yml`.
- Added `docs/14-HACKATHON_DELIVERABLES.md`.
- Updated frontend e2e tests to match current product copy and mock streaming endpoints.

## Performance Improvements

Before:

- `/projects/[projectId]` and all child routes were dynamic (`ƒ`).
- `/projects/[projectId]/graph` route size was 66.9 kB with 219 kB first-load JS.

After:

- Project routes are statically generated (`●`) for the curated workspace catalog.
- 95 static pages are generated at build time.
- `/projects/[projectId]/graph` route size dropped to 11.7 kB with 164 kB first-load JS before the deferred graph canvas chunk.
- Full Playwright route smoke suite renders all primary screens in under one second per route on the local production build.

Root cause:

The app used deterministic local project data but did not expose known project IDs through `generateStaticParams()`. Next.js therefore treated project pages as dynamic server-rendered routes. The graph screen also imported the heavy React Flow canvas into the page's initial client chunk.

## Architecture Improvements

- Clarified active service boundary: `apps/api` is the Docker/tested FastAPI service; `backend/` is a legacy prototype.
- Strengthened frontend/backend contract around project IDs and demo pipeline endpoints.
- Added CI to guard web linting, typechecking, production build, and API tests.
- Added production Compose override for production-like runtime settings.
- Added diagrams for architecture, pipeline, component relationships, and sequence flow.

## Security Improvements

- `.env.example` no longer suggests committing a fake provider key value.
- Docker defaults now keep live OpenAI calls optional; the offline demo path does not require secrets.
- API readiness checks continue to validate database and Redis connectivity without exposing secrets.
- Frontend settings copy clarifies that no secrets are stored by inactive UI controls.

## OpenAI Review

- The active Docker/API configuration now points at `https://api.openai.com/v1`.
- The documented model default is `gpt-5.6`, matching the OpenAI model documentation reviewed during the audit.
- Current `apps/api` does not yet execute live OpenAI calls; the deeper OpenAI Responses API implementation still lives in the legacy `backend/` prototype.
- Recommendation: move the structured-output OpenAI adapter from `backend/` into `apps/api` behind explicit service interfaces, then add deterministic eval fixtures for prompt changes.

## MCP Review

- MCP concepts are documented and represented in the legacy prototype.
- The active `apps/api` service does not yet expose live MCP server orchestration.
- Recommendation: promote MCP server registry/client boundaries into `apps/api` only when the first live connector is used by the product flow.

## Verification

Passed:

- `npm run typecheck`
- `npm run lint`
- `python -m pytest apps/api/tests` - 20 passed
- `npm run build`
- `npx playwright test` - 12 passed

Build evidence:

- Next.js generated 95 static pages.
- All curated project workspace routes are SSG.
- Graph route initial size reduced from 66.9 kB to 11.7 kB.

## Remaining TODOs

- Decide whether to archive or remove the legacy `backend/` package, or promote its agent/OpenAI/MCP implementations into `apps/api`.
- Add authentication and authorization before any hosted multi-user deployment.
- Add rate limiting and request body limits to the public API.
- Add structured observability traces for pipeline runs and agent stages.
- Add prompt regression/evaluation tests before enabling live model execution.
- Add real report export generation for PDF/DOCX rather than frontend-only export text.
- Add cloud deployment manifests once the target platform is selected.
- Select and record the final project license.
