# API

## Overview

The DiscoveryOS API is the backend interface between the frontend, workflow orchestrator, agents, databases, graph layer, ML layer, and LLM provider.

The initial backend is planned with FastAPI and Python. This document defines the intended API shape without implementing code.

## API Principles

- Project-first design
- Structured responses
- Evidence traceability
- Long-running workflow support
- Clear status reporting
- Frontend-friendly resource shapes
- Separation between user actions and background execution

## Core Resource Model

The API should expose these primary resources:

- Projects
- Workflow runs
- Agent runs
- Sources
- Evidence records
- Graphs
- ML runs
- Hypotheses
- Critiques
- Novelty analyses
- Experiment plans
- Reports

## Suggested Endpoint Groups

### Health

```text
GET /health
```

Purpose:

Confirm that the backend is running.

### Projects

```text
POST /projects
GET /projects
GET /projects/{project_id}
PATCH /projects/{project_id}
DELETE /projects/{project_id}
```

Purpose:

Manage persistent research projects.

### Workflow Runs

```text
POST /projects/{project_id}/runs
GET /projects/{project_id}/runs
GET /runs/{run_id}
GET /runs/{run_id}/status
```

Purpose:

Start and inspect research workflows.

### Agent Runs

```text
GET /runs/{run_id}/agents
GET /agent-runs/{agent_run_id}
```

Purpose:

Expose per-agent execution status, inputs, outputs, and errors.

### Sources

```text
GET /projects/{project_id}/sources
GET /sources/{source_id}
```

Purpose:

Inspect retrieved papers and research sources.

### Evidence

```text
GET /projects/{project_id}/evidence
GET /evidence/{evidence_id}
```

Purpose:

Inspect structured claims, findings, and evidence records.

### Knowledge Graph

```text
GET /projects/{project_id}/graph
GET /projects/{project_id}/graph/nodes
GET /projects/{project_id}/graph/edges
```

Purpose:

Provide graph data for frontend visualization and graph-based analysis.

### ML Runs

```text
GET /projects/{project_id}/ml-runs
GET /ml-runs/{ml_run_id}
```

Purpose:

Expose ML outputs, metrics, features, and artifacts.

### Hypotheses

```text
GET /projects/{project_id}/hypotheses
GET /hypotheses/{hypothesis_id}
PATCH /hypotheses/{hypothesis_id}
```

Purpose:

Review, update, and track generated hypotheses.

### Experiment Plans

```text
GET /projects/{project_id}/experiments
GET /experiments/{experiment_id}
```

Purpose:

Inspect proposed experiments and validation plans.

### Reports

```text
GET /projects/{project_id}/reports
GET /reports/{report_id}
POST /projects/{project_id}/reports
```

Purpose:

Generate and retrieve evidence-backed research reports.

## Workflow Status Model

Workflow steps should use a consistent status model:

- `pending`
- `running`
- `completed`
- `failed`
- `skipped`
- `needs_review`

The frontend should be able to render workflow state without knowing agent internals.

## Example Project Creation Request

```json
{
  "title": "Metformin and neuroinflammation",
  "research_goal": "Identify evidence-backed hypotheses connecting metformin, neuroinflammation, and Alzheimer's disease.",
  "domain": "biomedical research"
}
```

## Example Workflow Status Response

```json
{
  "run_id": "run_123",
  "project_id": "project_123",
  "status": "running",
  "current_step": "evidence_extraction",
  "steps": [
    {
      "name": "planner",
      "status": "completed"
    },
    {
      "name": "literature_retrieval",
      "status": "completed"
    },
    {
      "name": "evidence_extraction",
      "status": "running"
    }
  ]
}
```

## Error Handling

API errors should return:

- Error code
- Human-readable message
- Request ID
- Suggested recovery when possible

Example:

```json
{
  "error": {
    "code": "WORKFLOW_STEP_FAILED",
    "message": "Evidence extraction failed for one source.",
    "request_id": "req_123"
  }
}
```

## Future API Capabilities

Future versions may include:

- WebSocket or server-sent events for live workflow updates
- Human review checkpoints
- Project collaboration
- Source upload
- Dataset upload
- Report export
- Team permissions
- Evaluation endpoints
- Admin observability endpoints

