# Roadmap

## Overview

DiscoveryOS should be built in phases. The hackathon version should prove the core concept with a narrow end-to-end workflow. Later phases can expand reliability, collaboration, scale, integrations, and domain-specific depth.

## Phase 0: Documentation and Architecture

Goal:

Establish the product vision, technical plan, architecture, agent responsibilities, and open-source project structure.

Deliverables:

- Project README
- Problem and vision documentation
- Architecture documentation
- Agent design documentation
- MCP plan
- ML pipeline plan
- Database plan
- API plan
- Frontend plan
- Hackathon AI usage documentation

Status:

In progress.

## Phase 1: Hackathon Vertical Slice

Goal:

Build a compelling end-to-end demo that transforms one research goal into an evidence-backed research report.

Core deliverables:

- Research goal intake
- Planner Agent
- Literature Retrieval Agent
- Evidence Extraction Agent
- Knowledge Graph Agent
- Hypothesis Generator
- Critic Agent
- Novelty Detection Agent
- Experiment Design Agent
- Report Generator
- Basic frontend workflow visualization
- Basic evidence explorer
- Basic knowledge graph view
- Submission-ready demo script

Success criteria:

- The demo clearly shows DiscoveryOS is not a chatbot.
- Agent steps are visible.
- Claims link to evidence.
- Hypotheses include critique and novelty analysis.
- The final report is structured and defensible.

## Phase 2: Technical Foundation

Goal:

Strengthen the prototype into a maintainable product foundation.

Deliverables:

- FastAPI backend structure
- Next.js frontend structure
- SQLite persistence
- ChromaDB semantic memory
- NetworkX graph export
- Prompt versioning
- Structured schemas
- Workflow resumability
- Test suite for core services
- Basic observability

Success criteria:

- Workflows can be rerun and inspected.
- Intermediate outputs are persisted.
- Agent modules are independently testable.
- Frontend reflects backend state reliably.

## Phase 3: Research Quality

Goal:

Improve the scientific quality of outputs.

Deliverables:

- Better evidence extraction schemas
- Contradiction analysis
- Evidence strength scoring
- Source quality metadata
- Human review checkpoints
- Report citation validation
- Evaluation datasets
- Agent output evaluation rubrics

Success criteria:

- Outputs become more useful to real researchers.
- Evidence lineage is reliable.
- Weak claims are flagged before final reports.

## Phase 4: Collaboration and Productization

Goal:

Turn DiscoveryOS into a collaborative research workspace.

Deliverables:

- User accounts
- Team workspaces
- Project permissions
- Comments and review workflows
- Shared reports
- Export formats
- Activity history
- Saved research templates

Success criteria:

- Multiple researchers can use DiscoveryOS together.
- The system becomes the project memory layer for a research team.

## Phase 5: Advanced Integrations

Goal:

Expand DiscoveryOS through MCP and external systems.

Deliverables:

- Literature database integrations
- Document storage integrations
- Citation manager integrations
- GitHub or notebook integration
- Dataset registry integration
- Lab notebook integration
- Institutional knowledge base integration

Success criteria:

- DiscoveryOS connects to the tools researchers already use.
- Agents can retrieve and update external context safely.

## Phase 6: Domain Specialization

Goal:

Support deeper workflows for specific scientific domains.

Potential domains:

- Biomedical research
- Drug discovery
- Clinical research
- Bioinformatics
- Materials science
- Climate science

Deliverables:

- Domain-specific extraction schemas
- Entity normalization
- Specialized graph relationship types
- Domain-specific evaluation sets
- Workflow templates

Success criteria:

- DiscoveryOS produces outputs that domain experts consider useful.

## Phase 7: Production Scale

Goal:

Prepare DiscoveryOS for real-world deployment.

Deliverables:

- PostgreSQL migration path
- Background workers
- Queue-based workflows
- Managed vector database option
- Cloud deployment
- Role-based access control
- Encryption and secure secrets management
- Monitoring and alerting
- Cost controls
- Compliance planning

Success criteria:

- The platform can support real users, long-running jobs, and sensitive research data.

## Near-Term Priorities

After documentation, the next practical build order should be:

1. Define core schemas.
2. Implement project and workflow persistence.
3. Implement the planner and agent orchestration skeleton.
4. Add literature retrieval for a narrow source set.
5. Add evidence extraction.
6. Build the frontend workflow view.
7. Add graph visualization.
8. Add hypothesis generation, critique, novelty, and report generation.

