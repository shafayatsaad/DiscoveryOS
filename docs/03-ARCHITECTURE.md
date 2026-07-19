# Architecture

## Overview

DiscoveryOS uses a modular architecture with a Next.js frontend, a FastAPI backend, persistent databases, an agent orchestration layer, graph analysis, machine learning pipelines, and OpenAI-powered reasoning.

The architecture is designed for a hackathon vertical slice while preserving a path to production scale.

```text
User
  -> Next.js Frontend
  -> FastAPI Backend
  -> Workflow Orchestrator
  -> Specialized Agents
  -> Tools, Storage, Graph, ML, LLM
  -> Evidence-backed Research Report
```

## Major Components

### Frontend

The frontend provides the researcher workspace. It is responsible for:

- Research goal creation
- Workflow progress visualization
- Evidence inspection
- Knowledge graph exploration
- Hypothesis review
- Critic feedback display
- Novelty and confidence indicators
- Experiment plan review
- Report viewing and export

The frontend should not contain scientific logic. It should present backend state clearly and make agent activity understandable.

### Backend API

The FastAPI backend exposes application capabilities through HTTP endpoints. It owns:

- Project lifecycle
- Workflow execution
- Agent orchestration
- Storage access
- LLM calls
- MCP tool execution
- Graph construction
- ML execution
- Report generation

The backend should be treated as the authoritative application layer.

### Workflow Orchestrator

The orchestrator coordinates the research workflow. It receives a research goal, creates a project run, invokes agents in order, records intermediate outputs, handles errors, and exposes progress to the frontend.

Responsibilities:

- Create workflow runs
- Track step status
- Pass structured outputs between agents
- Persist artifacts
- Retry failed steps when appropriate
- Support resumability
- Maintain audit logs

### Agent Layer

Each agent performs one specialized task. Agents should communicate through structured schemas rather than informal text wherever possible.

The initial workflow includes:

- Planner Agent
- Literature Retrieval Agent
- Evidence Extraction Agent
- Knowledge Graph Agent
- Machine Learning Agent
- Hypothesis Generator
- Critic Agent
- Novelty Detection Agent
- Experiment Design Agent
- Research Report Generator

### LLM Layer

The LLM layer wraps calls to the OpenAI Responses API. It should provide a consistent internal interface for:

- Prompt execution
- Structured output parsing
- Tool-aware reasoning
- Model configuration
- Response logging
- Error handling
- Prompt version tracking

Agent code should not call the provider directly. It should use the LLM layer so models, prompts, and settings can evolve centrally.

### MCP Tool Layer

MCP provides a controlled way for agents to access external capabilities. In a mature system, MCP servers may connect to literature search, databases, document stores, citation managers, lab systems, and collaborative tools.

For the hackathon, MCP can demonstrate that DiscoveryOS is tool-native rather than prompt-only.

### Storage Layer

DiscoveryOS uses multiple storage modes:

- SQLite for relational application state
- ChromaDB for semantic search and vector memory
- File storage for generated artifacts
- Graph snapshots for knowledge graph state

Each storage system serves a different purpose. SQLite should not be forced to act as a vector database, and ChromaDB should not be used as the source of truth for project state.

### Knowledge Graph Layer

NetworkX is used to construct and analyze scientific relationships. Nodes may represent papers, entities, claims, mechanisms, datasets, methods, hypotheses, and experiments. Edges may represent support, contradiction, association, causation, method usage, and evidence provenance.

The graph layer should produce both machine-readable graph data and frontend-friendly graph views.

### ML Layer

The ML layer uses scikit-learn and XGBoost for structured analysis. It can support:

- Ranking candidate evidence
- Clustering papers or claims
- Scoring novelty signals
- Detecting patterns in extracted features
- Training lightweight predictive models on tabular datasets

ML outputs should be treated as evidence signals and stored with metadata.

## Data Flow

```text
Research goal
  -> Plan
  -> Literature search queries
  -> Retrieved papers
  -> Extracted evidence
  -> Knowledge graph
  -> ML features and signals
  -> Candidate hypotheses
  -> Critique and contradiction analysis
  -> Novelty score
  -> Experiment plan
  -> Research report
```

## Backend Folder Responsibilities

```text
apps/api/app/api/routes/       HTTP endpoints
apps/api/app/core/             Settings, configuration, shared runtime concerns
apps/api/app/models/           Internal domain models
apps/api/app/schemas/          Request and response schemas
apps/api/app/services/         Business services
apps/api/app/repositories/     Data access layer
apps/api/app/orchestration/    Workflow execution
apps/api/app/agents/           Specialized agent modules
apps/api/app/db/               Database adapters
apps/api/app/graph/            NetworkX graph utilities
apps/api/app/ml/               ML pipeline logic
apps/api/app/llm/              OpenAI provider abstraction
apps/api/app/workflows/        Workflow definitions
```

## Design Constraints

- Keep agent outputs structured.
- Keep prompts versioned.
- Keep generated claims linked to source evidence.
- Keep workflow state persistent.
- Keep frontend logic separate from scientific reasoning.
- Make each major step resumable.
- Prefer modular services over monolithic scripts.

## Production Path

The hackathon architecture can evolve into production by adding:

- Background workers
- Queue-based execution
- Authentication and authorization
- Team workspaces
- Cloud storage
- Managed vector database
- Observability
- Prompt and model evaluation
- Role-based access control
- Deployment automation

