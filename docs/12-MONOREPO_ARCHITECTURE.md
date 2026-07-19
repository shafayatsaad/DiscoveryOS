# Monorepo Architecture

## Overview

DiscoveryOS is organized as a scalable monorepo with two primary applications, shared packages, durable storage boundaries, research data areas, infrastructure support, and testing layers.

The architecture is designed around the product idea that DiscoveryOS is not a chatbot. It is a scientific operating system that coordinates research goals, agents, literature evidence, knowledge graphs, machine learning, and final reports.

No business logic is defined in this document. This is an architecture map for where future implementation should live.

## Top-Level Structure

```text
DiscoveryOS/
  apps/
    web/
    api/
  packages/
    shared-types/
    prompts/
    evaluation/
  docs/
  data/
  storage/
  experiments/
  infra/
  tools/
  tests/
  assets/
  scripts/
```

## Top-Level Folder Responsibilities

| Folder | Purpose |
| --- | --- |
| `apps/` | Runnable applications owned by the product: frontend and backend. |
| `apps/web/` | Next.js researcher workspace. |
| `apps/api/` | FastAPI backend, orchestration, agents, storage adapters, graph, ML, and LLM integration. |
| `packages/` | Shared internal packages used across applications. |
| `docs/` | Product, architecture, API, agent, MCP, and hackathon documentation. |
| `data/` | Development and research data used for local experiments and demos. |
| `storage/` | Runtime persistence for SQLite, ChromaDB, and generated artifacts. |
| `experiments/` | Research notebooks, baselines, and exploratory ML outputs. |
| `infra/` | Docker, environment, deployment, and operational scaffolding. |
| `tools/` | Developer and research utilities. |
| `tests/` | Cross-application integration, contract, and end-to-end tests. |
| `assets/` | Brand files, diagrams, and visual assets. |
| `scripts/` | Root-level project automation scripts. |

## Frontend Architecture: `apps/web`

The frontend is a Next.js, React, Tailwind, and TypeScript application. Its role is to present DiscoveryOS as a research workspace, not as a chat window.

```text
apps/web/
  public/
  src/
    app/
      projects/
        new/
        [projectId]/
          workflow/
          evidence/
          graph/
          ml/
          hypotheses/
          experiments/
          reports/
    components/
      ui/
      layout/
      navigation/
      forms/
      data-display/
      feedback/
      graph/
      workflow/
    features/
      projects/
        api/
        components/
        hooks/
        types/
      research-goals/
        api/
        components/
        hooks/
        types/
      workflows/
        api/
        components/
        hooks/
        types/
      evidence/
        api/
        components/
        hooks/
        types/
      knowledge-graph/
        api/
        components/
        hooks/
        types/
      ml-insights/
        api/
        components/
        hooks/
        types/
      hypotheses/
        api/
        components/
        hooks/
        types/
      experiments/
        api/
        components/
        hooks/
        types/
      reports/
        api/
        components/
        hooks/
        types/
    hooks/
    lib/
      api/
      config/
      constants/
      formatters/
      validation/
    providers/
    styles/
    types/
  tests/
    unit/
    e2e/
```

### Frontend Folder Responsibilities

| Folder | Purpose |
| --- | --- |
| `public/` | Static assets served directly by Next.js. |
| `src/app/` | Next.js App Router routes and route-level layouts. |
| `src/app/projects/` | Project dashboard route area. |
| `src/app/projects/new/` | Research goal intake and new project creation route. |
| `src/app/projects/[projectId]/` | Project workspace shell for a persistent research project. |
| `src/app/projects/[projectId]/workflow/` | Workflow timeline and agent execution status route. |
| `src/app/projects/[projectId]/evidence/` | Evidence explorer route. |
| `src/app/projects/[projectId]/graph/` | Knowledge graph visualization route. |
| `src/app/projects/[projectId]/ml/` | Machine learning insight route. |
| `src/app/projects/[projectId]/hypotheses/` | Hypothesis review route. |
| `src/app/projects/[projectId]/experiments/` | Experiment plan route. |
| `src/app/projects/[projectId]/reports/` | Research report route. |
| `src/components/ui/` | Generic reusable UI primitives. |
| `src/components/layout/` | Application shells, panels, page layouts, and workspace frames. |
| `src/components/navigation/` | Sidebar, tabs, breadcrumbs, and project navigation. |
| `src/components/forms/` | Shared form controls and input patterns. |
| `src/components/data-display/` | Tables, lists, badges, metrics, and evidence displays. |
| `src/components/feedback/` | Loading, empty, error, toast, and review states. |
| `src/components/graph/` | Reusable graph visualization components. |
| `src/components/workflow/` | Shared workflow timeline and step components. |
| `src/features/*/api/` | Feature-specific frontend API clients and query functions. |
| `src/features/*/components/` | Feature-owned UI components. |
| `src/features/*/hooks/` | Feature-owned React hooks. |
| `src/features/*/types/` | Feature-level TypeScript types. |
| `src/hooks/` | Cross-feature React hooks. |
| `src/lib/api/` | Shared API client foundation. |
| `src/lib/config/` | Frontend runtime configuration boundaries. |
| `src/lib/constants/` | Shared frontend constants. |
| `src/lib/formatters/` | Formatting helpers for dates, scores, labels, and statuses. |
| `src/lib/validation/` | Frontend validation schemas and helpers. |
| `src/providers/` | App-wide React providers. |
| `src/styles/` | Tailwind and global style entry points. |
| `src/types/` | Global frontend types. |
| `tests/unit/` | Frontend unit tests. |
| `tests/e2e/` | Frontend end-to-end tests. |

## Backend Architecture: `apps/api`

The backend is a FastAPI application. It owns project state, workflow orchestration, agent execution, storage adapters, knowledge graph construction, ML analysis, MCP integration, and OpenAI Responses API integration.

```text
apps/api/
  app/
    api/
      routes/
      dependencies/
      middleware/
      errors/
    core/
      config/
      logging/
      security/
      telemetry/
    models/
      domain/
      enums/
    schemas/
      api/
      agents/
      evidence/
      graph/
      ml/
      reports/
    services/
      artifacts/
      evidence/
      experiments/
      hypotheses/
      projects/
      reports/
      sources/
      workflows/
      validation/
    repositories/
      sqlite/
      chroma/
      artifacts/
    db/
      sqlite/
        migrations/
        sessions/
        schema/
      chroma/
        collections/
        indexes/
        metadata/
    agents/
      planner/
      literature_retrieval/
      evidence_extraction/
      knowledge_graph/
      machine_learning/
      hypothesis_generator/
      critic/
      novelty_detection/
      experiment_design/
      report_generator/
    orchestration/
      engine/
      runners/
      state/
      checkpoints/
      events/
    workflows/
      definitions/
      templates/
      versions/
    graph/
      builders/
      analyzers/
      exporters/
      layouts/
      schemas/
    ml/
      preprocessing/
      features/
      pipelines/
      models/
      scoring/
      evaluation/
      artifacts/
    llm/
      providers/
      prompts/
      responses/
      structured_outputs/
      tools/
    mcp/
      clients/
      servers/
      registry/
      audit/
    jobs/
      background/
      scheduled/
  tests/
    unit/
    integration/
    contract/
    fixtures/
```

### Backend Folder Responsibilities

| Folder | Purpose |
| --- | --- |
| `app/api/routes/` | FastAPI route modules grouped by resource. |
| `app/api/dependencies/` | Route dependency boundaries such as database sessions and authenticated context. |
| `app/api/middleware/` | Request middleware such as tracing, timing, and error correlation. |
| `app/api/errors/` | API error mapping and response conventions. |
| `app/core/config/` | Runtime settings and environment configuration boundaries. |
| `app/core/logging/` | Logging setup and log formatting boundaries. |
| `app/core/security/` | Security primitives, future auth boundaries, and secret handling interfaces. |
| `app/core/telemetry/` | Metrics, tracing, and observability boundaries. |
| `app/models/domain/` | Internal domain objects used inside the backend. |
| `app/models/enums/` | Shared backend enum definitions such as workflow status and agent names. |
| `app/schemas/api/` | HTTP request and response schemas. |
| `app/schemas/agents/` | Agent input and output contracts. |
| `app/schemas/evidence/` | Evidence record, source, claim, and citation schemas. |
| `app/schemas/graph/` | Graph node, edge, and visualization schemas. |
| `app/schemas/ml/` | ML feature, run, score, and metric schemas. |
| `app/schemas/reports/` | Report section and export schemas. |
| `app/services/*/` | Business service boundaries for project, workflow, source, evidence, hypothesis, experiment, artifact, report, and validation operations. |
| `app/repositories/sqlite/` | SQLite persistence repositories. |
| `app/repositories/chroma/` | ChromaDB vector collection repositories. |
| `app/repositories/artifacts/` | File artifact persistence repositories. |
| `app/db/sqlite/migrations/` | SQLite migration files. |
| `app/db/sqlite/sessions/` | SQLite connection and session management. |
| `app/db/sqlite/schema/` | Relational schema definitions and schema documentation. |
| `app/db/chroma/collections/` | ChromaDB collection definitions. |
| `app/db/chroma/indexes/` | Vector index configuration boundaries. |
| `app/db/chroma/metadata/` | Metadata conventions for vector records. |
| `app/agents/*/` | Specialized scientific agents. |
| `app/orchestration/engine/` | Workflow execution engine boundary. |
| `app/orchestration/runners/` | Agent and step runner boundaries. |
| `app/orchestration/state/` | Workflow state models and transition boundaries. |
| `app/orchestration/checkpoints/` | Workflow resumability and checkpoint artifacts. |
| `app/orchestration/events/` | Internal workflow event contracts. |
| `app/workflows/definitions/` | Named workflow definitions. |
| `app/workflows/templates/` | Reusable workflow templates for research domains. |
| `app/workflows/versions/` | Versioned workflow specifications. |
| `app/graph/builders/` | NetworkX graph construction boundaries. |
| `app/graph/analyzers/` | Graph metric and relationship analysis boundaries. |
| `app/graph/exporters/` | Graph export boundaries for frontend visualization and artifacts. |
| `app/graph/layouts/` | Graph layout strategy boundaries. |
| `app/graph/schemas/` | Graph-specific internal schemas. |
| `app/ml/preprocessing/` | Input cleaning and normalization boundaries. |
| `app/ml/features/` | Feature extraction boundaries. |
| `app/ml/pipelines/` | scikit-learn pipeline composition boundaries. |
| `app/ml/models/` | Model wrappers and trained model loading boundaries. |
| `app/ml/scoring/` | Evidence, hypothesis, and novelty scoring boundaries. |
| `app/ml/evaluation/` | Model and signal evaluation boundaries. |
| `app/ml/artifacts/` | ML artifact management boundaries. |
| `app/llm/providers/` | OpenAI provider abstraction boundaries. |
| `app/llm/prompts/` | Runtime prompt loading and prompt version boundaries. |
| `app/llm/responses/` | OpenAI Responses API interaction boundaries. |
| `app/llm/structured_outputs/` | Structured output parsing and validation boundaries. |
| `app/llm/tools/` | LLM tool definitions and tool-call coordination boundaries. |
| `app/mcp/clients/` | MCP client integration boundaries. |
| `app/mcp/servers/` | Local or bundled MCP server boundaries. |
| `app/mcp/registry/` | Tool registry and permission mapping boundaries. |
| `app/mcp/audit/` | MCP call logging and audit boundaries. |
| `app/jobs/background/` | Background job execution boundaries. |
| `app/jobs/scheduled/` | Scheduled and recurring job boundaries. |
| `tests/unit/` | Backend unit tests. |
| `tests/integration/` | Backend integration tests. |
| `tests/contract/` | API and schema contract tests. |
| `tests/fixtures/` | Backend test fixtures. |

## Agent Service Architecture

Each agent folder is intentionally isolated so agents can evolve independently.

```text
app/agents/
  planner/
  literature_retrieval/
  evidence_extraction/
  knowledge_graph/
  machine_learning/
  hypothesis_generator/
  critic/
  novelty_detection/
  experiment_design/
  report_generator/
```

| Agent Folder | Purpose |
| --- | --- |
| `planner/` | Converts a research goal into a structured investigation plan. |
| `literature_retrieval/` | Owns scientific source retrieval and source ranking boundaries. |
| `evidence_extraction/` | Owns extraction of structured claims, methods, limitations, and source-linked evidence. |
| `knowledge_graph/` | Owns agent-level transformation from evidence into graph-ready relationships. |
| `machine_learning/` | Owns agent-level interpretation of ML pipeline results. |
| `hypothesis_generator/` | Generates candidate evidence-backed hypotheses. |
| `critic/` | Challenges hypotheses, identifies contradictions, and flags weak claims. |
| `novelty_detection/` | Estimates novelty using literature, embeddings, graph state, and prior claims. |
| `experiment_design/` | Converts hypotheses into validation and experiment plans. |
| `report_generator/` | Generates final research reports from structured workflow outputs. |

## Storage Architecture

DiscoveryOS uses multiple persistence boundaries because research workflows contain relational state, vector memory, graph artifacts, model artifacts, and generated reports.

```text
storage/
  sqlite/
    runtime/
    backups/
  chroma/
    runtime/
    collections/
  artifacts/
    workflows/
    graphs/
    ml-runs/
    reports/
```

| Folder | Purpose |
| --- | --- |
| `storage/sqlite/runtime/` | Local SQLite runtime database files. |
| `storage/sqlite/backups/` | SQLite backup files for local development and demos. |
| `storage/chroma/runtime/` | ChromaDB runtime persistence. |
| `storage/chroma/collections/` | Collection-level persisted vector data. |
| `storage/artifacts/workflows/` | Workflow run artifacts and checkpoints. |
| `storage/artifacts/graphs/` | Generated NetworkX graph exports. |
| `storage/artifacts/ml-runs/` | ML run outputs, metrics, and serialized artifacts. |
| `storage/artifacts/reports/` | Generated report artifacts. |

## Data Architecture

The `data/` directory is for local development, demos, and research inputs. Runtime state belongs in `storage/`.

```text
data/
  raw/
    literature/
    datasets/
  processed/
    evidence/
    features/
    graphs/
  embeddings/
    papers/
    claims/
    hypotheses/
  models/
    sklearn/
    xgboost/
  reports/
    drafts/
    final/
```

| Folder | Purpose |
| --- | --- |
| `data/raw/literature/` | Raw paper metadata, abstracts, and literature exports. |
| `data/raw/datasets/` | Raw user or demo datasets. |
| `data/processed/evidence/` | Processed extracted evidence records. |
| `data/processed/features/` | Tabular ML features. |
| `data/processed/graphs/` | Processed graph data for analysis. |
| `data/embeddings/papers/` | Paper-level embedding exports. |
| `data/embeddings/claims/` | Evidence claim embedding exports. |
| `data/embeddings/hypotheses/` | Hypothesis embedding exports. |
| `data/models/sklearn/` | scikit-learn model artifacts. |
| `data/models/xgboost/` | XGBoost model artifacts. |
| `data/reports/drafts/` | Draft report outputs. |
| `data/reports/final/` | Final report outputs. |

## Shared Package Architecture

Shared packages keep cross-application contracts and reusable assets out of app-specific code.

```text
packages/
  shared-types/
    src/
      api/
      domain/
      events/
  prompts/
    agents/
    system/
    reporting/
    evaluation/
  evaluation/
    datasets/
    rubrics/
    scenarios/
    scripts/
```

| Folder | Purpose |
| --- | --- |
| `packages/shared-types/src/api/` | API contract types shared with the frontend when generated or manually maintained. |
| `packages/shared-types/src/domain/` | Shared domain concepts such as project, source, evidence, hypothesis, and report shapes. |
| `packages/shared-types/src/events/` | Shared workflow and agent event contracts. |
| `packages/prompts/agents/` | Versioned agent prompt assets. |
| `packages/prompts/system/` | System-level prompt assets. |
| `packages/prompts/reporting/` | Report generation prompt assets. |
| `packages/prompts/evaluation/` | Prompt assets used for evaluations. |
| `packages/evaluation/datasets/` | Evaluation datasets and gold examples. |
| `packages/evaluation/rubrics/` | Human and automated evaluation rubrics. |
| `packages/evaluation/scenarios/` | End-to-end evaluation scenarios. |
| `packages/evaluation/scripts/` | Evaluation runner boundaries. |

## Infrastructure Architecture

```text
infra/
  docker/
    api/
    web/
    dev/
  env/
    development/
    test/
    production/
  scripts/
    bootstrap/
    deploy/
    maintenance/
```

| Folder | Purpose |
| --- | --- |
| `infra/docker/api/` | Backend container architecture files. |
| `infra/docker/web/` | Frontend container architecture files. |
| `infra/docker/dev/` | Local development container architecture files. |
| `infra/env/development/` | Development environment templates. |
| `infra/env/test/` | Test environment templates. |
| `infra/env/production/` | Production environment templates. |
| `infra/scripts/bootstrap/` | Environment bootstrap script boundaries. |
| `infra/scripts/deploy/` | Deployment script boundaries. |
| `infra/scripts/maintenance/` | Maintenance and operational script boundaries. |

## Tools Architecture

```text
tools/
  dev/
    scaffolding/
    quality/
  research/
    importers/
    exporters/
    inspectors/
```

| Folder | Purpose |
| --- | --- |
| `tools/dev/scaffolding/` | Developer scaffolding utility boundaries. |
| `tools/dev/quality/` | Code quality, formatting, and repository inspection utility boundaries. |
| `tools/research/importers/` | Literature, dataset, and artifact import utility boundaries. |
| `tools/research/exporters/` | Report, graph, and dataset export utility boundaries. |
| `tools/research/inspectors/` | Local inspection utilities for evidence, embeddings, graph, and ML artifacts. |

## Testing Architecture

```text
tests/
  integration/
  e2e/
  contract/
  fixtures/
```

| Folder | Purpose |
| --- | --- |
| `tests/integration/` | Cross-service integration tests. |
| `tests/e2e/` | End-to-end product tests across frontend and backend. |
| `tests/contract/` | Shared API and event contract tests. |
| `tests/fixtures/` | Shared test fixtures used by multiple services. |

## Scalability Principles

DiscoveryOS should scale by preserving clean boundaries:

- The frontend owns presentation, not scientific reasoning.
- The API owns project state and workflow execution.
- Agents own specialized reasoning stages.
- Services own business operations.
- Repositories own persistence concerns.
- SQLite owns relational state in the prototype.
- ChromaDB owns semantic retrieval.
- NetworkX owns graph construction and analysis.
- scikit-learn owns baseline ML pipelines.
- Artifact storage owns generated reports, graphs, checkpoints, and ML outputs.
- MCP owns external tool access boundaries.
- The LLM layer owns model provider interaction and structured output handling.

## Future Scalability Path

This folder architecture can support future production changes without reorganizing the whole project:

- SQLite can migrate to PostgreSQL behind repository boundaries.
- Local ChromaDB can move to managed vector infrastructure.
- Background jobs can move from in-process workers to a queue.
- NetworkX graph exports can be supplemented by a graph database.
- scikit-learn pipelines can be expanded with model registries.
- MCP tool access can be permissioned per user, project, and agent.
- API contracts can generate frontend types.
- Evaluation packages can become CI gates for agent quality.

