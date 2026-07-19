# DiscoveryOS Backend

This backend is the architecture foundation for DiscoveryOS. It intentionally avoids AI calls and research business logic for now.

## Architecture Decisions

- `FastAPI` owns HTTP routing and lifecycle management.
- `SQLModel` is the relational model boundary for SQLite today and a future PostgreSQL migration path.
- Agents expose `run(...)` methods that return typed Pydantic domain outputs such as `ResearchPlan`, `PaperCollection`, and `EvidenceCollection`.
- The generic `/agents/{name}/run` inspection API wraps typed agent outputs in `AgentResult` so the external debugging contract remains stable.
- The Planner Agent is deterministic today and keeps prompt assets versioned for a future GPT-5 planner.
- The Retriever Agent uses modular provider classes for OpenAlex, Crossref, and arXiv with shared retry, rate limiting, and cache boundaries.
- The Evidence Extraction Agent owns a strict Pydantic schema and an OpenAI Responses API client boundary; local tests inject deterministic clients instead of making live model calls.
- The Discovery Workspace is the persistent memory spine. Every project ID resolves to one workspace that stores plans, papers, evidence, graph JSON, contradictions, novelty analysis, experiments, notes, timeline events, and generated reports.
- Workspace artifacts are JSON-backed in SQLite so future agents can append new structured outputs without requiring an immediate relational migration for every artifact.
- The Knowledge Graph Builder uses NetworkX and stores API-ready graph JSON on the workspace; node typing is inferred from entity text while falling back to a generic `Entity` type for arbitrary scientific domains.
- Contradiction, Novelty, and Experiment agents use structured Pydantic outputs and OpenAI Responses API boundaries, with deterministic local clients for no-key development and tests.
- The pipeline service runs the hackathon demo path end to end: `research question -> planner -> retriever -> extractor -> graph -> contradiction -> novelty -> experiment -> report`.
- Pipeline responses include event names that can evolve into server-sent events or WebSocket streaming updates.
- MCP is represented as a protocol boundary so retrieval/storage tools can be added later without changing agent interfaces.
- Storage integrations are represented by protocols, keeping Redis optional.
- Configuration is environment-driven through Pydantic settings.
- Logging is configured centrally so request handling, orchestration, and agents can later share structured log conventions.

## Run Locally

```bash
pip install -e ".[dev]"
uvicorn app.main:create_app --factory --reload
```

Health checks:

```text
GET /health
GET /api/v1/health
```

First pipeline:

```text
POST /api/v1/pipeline/start
```

Workspace and graph endpoints:

```text
GET /api/v1/projects/{project_id}/workspace
PATCH /api/v1/projects/{project_id}/workspace
GET /api/v1/projects/{project_id}/graph
POST /api/v1/projects/{project_id}/graph/build
```
