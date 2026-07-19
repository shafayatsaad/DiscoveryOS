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
- The first pipeline service runs `research question -> planner -> retriever -> extractor` synchronously while returning event metadata that can evolve into streaming updates.
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
