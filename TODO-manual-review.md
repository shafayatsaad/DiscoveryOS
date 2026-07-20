# Manual Review Required

## P0 - Critical

### 1. [DUPLICATE PIPELINE] Duplicate pipeline implementations

**Files:** `backend/app/services/pipeline_service.py` and `backend/app/orchestrator/orchestrator.py`

Both implement the same 8-stage research pipeline. `DiscoveryPipelineService` (used by `/pipeline/start`) and `DiscoveryOrchestrator` (used by `/projects/{project_id}/run`) have diverged. Bugs fixed in one won't propagate to the other.

**Action:** Deprecate `DiscoveryPipelineService` and migrate all consumers to `DiscoveryOrchestrator`. Remove the `/pipeline/start` route after migration.

### 2. [HARDCODED RUN ID] SSE streaming uses hardcoded run ID

**File:** `backend/app/api/routes/projects.py` line 90

```python
run_id = f"run_{project_id}"
```

This tightly couples the SSE stream to the run ID convention used by `DiscoveryOrchestrator.run()`. If a pipeline is started through a different mechanism that uses a different run ID pattern, the stream silently shows "waiting" forever.

**Action:** Track the active run ID per project in the state backend or workspace service. The SSE stream should look up the current run ID for the project instead of constructing it.

### 3. [STATE BACKEND] InMemoryStateBackend is not a singleton

**Files:** `backend/app/orchestrator/orchestrator.py` line 82, `backend/app/orchestrator/service.py` line 22, `backend/app/api/dependencies.py` line 57 (via `DiscoveryPipelineService`)

Each dependency creates a **new** `InMemoryStateBackend` instance. This means:

- Pipeline state created by one service instance is invisible to another.
- The SSE stream may never see pipeline state created by a different instance.
- Restarting the Python process loses all state.

**Action:** Make `InMemoryStateBackend` a module-level singleton, or implement a proper database-backed state backend. Consider using the existing SQLite database.

### 4. [DUAL PIPELINE ROUTES] API exposes two separate pipeline endpoints

**Files:** `backend/app/api/router.py` (mounts both `pipeline` and `projects` routers)

Both `/pipeline/start` and `/projects/{project_id}/run` start pipeline executions but use different services and state backends. This will cause confusion and inconsistent behavior.

**Action:** Consolidate to a single pipeline start endpoint once item #1 is resolved.

---

## P1 - High

### 5. [RESUME BROKEN] Resume pipeline in OrchestratorService is unused

**File:** `backend/app/orchestrator/service.py` line 41-45

`OrchestratorService.resume_pipeline()` loads state and calls `resume()` on the orchestrator, but there's no API route that calls it. The `resume` endpoint needs to be exposed.

**Action:** Add a `POST /projects/{project_id}/resume` endpoint.

### 6. [MCP ERROR SILENCING] MCP errors are silently caught

**File:** `backend/app/orchestrator/orchestrator.py` lines 178-185

```python
except Exception:
    pass  # MCP failures should not break the pipeline
```

Errors from MCP persistence are completely silenced. There's no logging. If the filesystem MCP server fails (permissions, disk full), operators won't know.

**Action:** Add proper logging for MCP failures: `logger.warning("MCP save_report failed: %s", exc)`.

---

## P2 - Medium

### 7. [KNOWLEDGE GRAPH BUILDER] Direct instantiation bypasses DI

**Files:** `backend/app/orchestrator/orchestrator.py` line 80, `backend/app/services/pipeline_service.py` line 87

Both create `KnowledgeGraphBuilder()` directly instead of accepting it via constructor injection. This makes testing harder.

**Action:** Accept `graph_builder` parameter explicitly (the orchestrator already has it in `__init__`, but the default construction never passes a custom one).

### 8. [UNUSED IMPORTS] Various unused imports

**File:** `backend/app/orchestrator/orchestrator.py`

`BaseResearchAgent`, `DiscoveryEvent`, `TimelineEvent` are imported but not used directly in the class (they're used in type hints that may not be needed).

**Action:** Review and remove unused imports.

### 9. [PIPELINESTARTREQUEST] Validation only checks minimum length

**File:** `backend/app/schemas/pipeline.py` line 18

```python
query: str = Field(min_length=3)
```

This is the only validation. Empty whitespace strings pass through.

**Action:** Add `strip_whitespace=True` and regex validation for meaningful content.

---

## P3 - Low

### 10. [PYPROJECT.TOML] No requirements.txt for pip users

**File:** `backend/pyproject.toml` exists but no `requirements.txt`

Users who prefer pip over poetry/pdm need a generated requirements.txt.

**Action:** Generate requirements.txt from pyproject.toml dependencies.

### 11. [AGENT UNION TYPES] Complex run() method signatures

Every agent's `run()` accepts `Workspace | AgentContext | SpecificRequest` union types, requiring normalization code in every agent. This makes the API surface confusing.

**Action:** Simplify to accept only the specific request type.
