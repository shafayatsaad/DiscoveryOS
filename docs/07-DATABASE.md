# Database

## Overview

DiscoveryOS uses multiple persistence layers because scientific workflows contain different kinds of data. Relational state, semantic memory, graph structures, and generated artifacts should not be forced into one storage model.

The initial stack uses:

- SQLite for relational application data
- ChromaDB for vector search and semantic memory
- File storage for generated artifacts
- NetworkX graph exports for graph state and visualization

## Storage Principles

### Source of Truth

SQLite should be the source of truth for projects, workflow runs, agents, artifacts, evidence records, and relationships between records.

### Semantic Retrieval

ChromaDB should store embeddings and metadata needed for semantic search. It should reference relational IDs where possible.

### Artifact Preservation

Generated reports, graph exports, ML outputs, and intermediate files should be stored as artifacts with metadata in SQLite.

### Reproducibility

Every important output should be traceable to:

- A project
- A workflow run
- An agent
- Source inputs
- Prompt or model version when applicable
- Timestamp

## Core Entities

### Project

Represents a persistent research workspace.

Fields may include:

- ID
- Title
- Research goal
- Domain
- Owner
- Status
- Created timestamp
- Updated timestamp

### Workflow Run

Represents one execution of the DiscoveryOS research workflow.

Fields may include:

- ID
- Project ID
- Status
- Started timestamp
- Completed timestamp
- Current step
- Error message

### Agent Run

Represents one agent execution.

Fields may include:

- ID
- Workflow run ID
- Agent name
- Input artifact IDs
- Output artifact IDs
- Status
- Model name
- Prompt version
- Started timestamp
- Completed timestamp
- Error details

### Source

Represents a paper, preprint, dataset, article, or other research source.

Fields may include:

- ID
- Title
- Authors
- Abstract
- Publication year
- DOI or external identifier
- URL
- Source type
- Retrieval query
- Relevance score

### Evidence Record

Represents a structured claim or finding extracted from a source.

Fields may include:

- ID
- Source ID
- Claim text
- Evidence type
- Entity names
- Method
- Outcome
- Direction
- Limitations
- Confidence
- Extracted by agent run ID

### Hypothesis

Represents a generated scientific hypothesis.

Fields may include:

- ID
- Project ID
- Workflow run ID
- Statement
- Mechanism
- Supporting evidence IDs
- Contradicting evidence IDs
- Novelty score
- Confidence
- Status

### Experiment Plan

Represents a proposed way to test a hypothesis.

Fields may include:

- ID
- Hypothesis ID
- Objective
- Method summary
- Controls
- Expected outcomes
- Risks
- Required data or materials

### Artifact

Represents generated or stored outputs.

Fields may include:

- ID
- Project ID
- Workflow run ID
- Type
- Path or URI
- Metadata
- Created by agent run ID
- Created timestamp

## ChromaDB Collections

Potential collections:

- `papers`: embeddings for paper titles and abstracts
- `claims`: embeddings for extracted evidence statements
- `hypotheses`: embeddings for generated hypotheses
- `reports`: embeddings for generated report sections

Each ChromaDB record should include metadata that links back to SQLite IDs.

## Graph Persistence

NetworkX graphs can be persisted as artifacts in formats such as JSON, GraphML, or node-link data. SQLite should store metadata about graph artifacts, including:

- Project ID
- Workflow run ID
- Graph version
- Node count
- Edge count
- Created timestamp
- Artifact path

## Runtime Storage Layout

```text
storage/
  sqlite/      SQLite database files
  chroma/      ChromaDB persistent storage
  artifacts/   Reports, graph exports, ML outputs, and intermediate files
```

## Data Integrity Requirements

DiscoveryOS should enforce:

- Evidence records must link to sources.
- Agent outputs must link to workflow runs.
- Hypotheses must link to supporting evidence when available.
- Reports must link to the artifacts and evidence used to generate them.
- ChromaDB items must reference relational IDs.

## Privacy and Security Considerations

Future production versions should include:

- User authentication
- Project-level permissions
- Secure storage for API keys
- Encryption for sensitive documents
- Audit logs
- Data retention policies
- Workspace-level isolation

## Migration Path

SQLite is appropriate for the hackathon and early prototype. A production system may later migrate to PostgreSQL while preserving the same repository and service boundaries.

