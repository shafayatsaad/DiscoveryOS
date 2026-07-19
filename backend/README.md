# DiscoveryOS Backend

This backend is the architecture foundation for DiscoveryOS. It intentionally avoids AI calls and research business logic for now.

## Architecture Decisions

- `FastAPI` owns HTTP routing and lifecycle management.
- `SQLModel` is the relational model boundary for SQLite today and a future PostgreSQL migration path.
- Agents share one abstract contract: `run(context) -> AgentResult`.
- Agent implementations are placeholders so OpenAI Agents SDK and LangGraph can be integrated without changing route or service contracts.
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
