# DiscoveryOS

Autonomous scientific discovery infrastructure for evidence-backed hypotheses.

DiscoveryOS is an OpenAI hackathon project that explores what comes after chatbots for research. Instead of answering isolated prompts, DiscoveryOS turns a research goal into a reproducible scientific workflow powered by multi-agent AI, MCP-connected tools, literature evidence, knowledge graphs, and machine learning.

The project is designed like a real startup: modular architecture, clear agent boundaries, auditable evidence chains, persistent project memory, and an open-source foundation that can grow beyond a hackathon prototype.

## Why DiscoveryOS

Modern AI assistants are excellent at conversation, but scientific research is not just conversation. Research involves long-running investigation, source verification, conflicting evidence, evolving hypotheses, structured datasets, model-driven analysis, experiment design, and reproducible reporting.

DiscoveryOS treats research as an operating system:

- A researcher creates a persistent research project.
- Agents plan and execute the scientific workflow.
- Literature and datasets are retrieved through controlled tools.
- Evidence is extracted into structured claims.
- A knowledge graph links entities, mechanisms, findings, and contradictions.
- ML pipelines analyze patterns and generate signals.
- Hypotheses are proposed, criticized, novelty-checked, and converted into experiment plans.
- A final report explains the evidence trail instead of hiding it.

## Core Workflow

```text
Research Goal
  -> Planner Agent
  -> Literature Retrieval Agent
  -> Evidence Extraction Agent
  -> Knowledge Graph Agent
  -> Machine Learning Agent
  -> Hypothesis Generator
  -> Critic Agent
  -> Novelty Detection Agent
  -> Experiment Design Agent
  -> Research Report Generator
```

## Tech Stack

Frontend:

- Next.js
- React
- TypeScript
- Tailwind CSS

Backend:

- FastAPI
- Python

Data and storage:

- PostgreSQL for Docker Compose project memory
- Redis for runtime coordination and readiness checks
- Local `storage/` for demo-safe runtime artifacts
- Local `logs/` for agent and infrastructure debugging
- SQLite remains available for isolated local API tests

Machine learning:

- scikit-learn
- XGBoost

AI and tools:

- OpenAI Responses API
- Structured outputs
- MCP tool ecosystem
- Multi-agent orchestration

## Repository Structure

```text
apps/
  web/                 Next.js frontend
  api/                 FastAPI backend
backend/               Agent/orchestration scaffold and domain prototypes
packages/
  shared-types/        Shared contracts and generated types
  prompts/             Versioned prompts and agent instructions
  evaluation/          Evaluation rubrics and benchmark assets
docs/                  Project documentation
storage/               Runtime database and vector storage locations
docker/                Docker operational notes
scripts/               Startup, seed, and developer utilities
tests/                 Integration and end-to-end tests
.github/               GitHub workflow and metadata location
README.md
docker-compose.yml
.env.example
Makefile
```

## Docker Demo Quick Start

DiscoveryOS is prepared for hackathon demo setup through Docker Compose. The default demo path uses seeded local data, so the walkthrough does not depend on OpenAlex or any other live literature API.

Prerequisites:

- Docker Desktop or Docker Engine with Compose v2
- `make` available on your shell

Run the stack:

```bash
cp .env.example .env
make demo
```

Open:

- Frontend: [http://localhost:3000](http://localhost:3000)
- API health: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
- API readiness: [http://localhost:8000/api/v1/ready](http://localhost:8000/api/v1/ready)

Useful commands:

```bash
make up      # build and start frontend, API, PostgreSQL, and Redis
make down    # stop the stack
make test    # run API tests and frontend typecheck in Compose
make demo    # start the seeded demo stack and print service URLs
make logs    # follow API/frontend container logs
make seed    # rerun the offline demo seed script
```

The API container waits for PostgreSQL and Redis, runs `alembic upgrade head`, seeds demo data when `DISCOVERYOS_SEED_DEMO=true`, and then starts Uvicorn. The seeded path creates:

```text
Demo Workspace
  -> Demo Papers
  -> Demo Graph
  -> Demo Report
```

Runtime debug logs are written to `logs/`:

- `planner.log`
- `retriever.log`
- `orchestrator.log`
- `mcp.log`
- `openai.log`

Optional live model settings are documented in `.env.example`. For NVIDIA-hosted DeepSeek, set:

```bash
DISCOVERYOS_OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1
DISCOVERYOS_OPENAI_MODEL=deepseek-ai/deepseek-v4-flash
DISCOVERYOS_OPENAI_API_KEY=your-key
```

## Documentation

- [Hackathon Context](docs/00-HACKATHON_CONTEXT.md)
- [Problem](docs/01-PROBLEM.md)
- [Vision](docs/02-VISION.md)
- [Architecture](docs/03-ARCHITECTURE.md)
- [Agents](docs/04-AGENTS.md)
- [MCP](docs/05-MCP.md)
- [ML Pipeline](docs/06-ML_PIPELINE.md)
- [Database](docs/07-DATABASE.md)
- [API](docs/08-API.md)
- [Frontend](docs/09-FRONTEND.md)
- [Roadmap](docs/10-ROADMAP.md)
- [Hackathon AI Usage](docs/11-HACKATHON_AI_USAGE.md)
- [Monorepo Architecture](docs/12-MONOREPO_ARCHITECTURE.md)

## What Makes DiscoveryOS Different

DiscoveryOS is not a chat interface with citations. It is a research execution environment.

The system is built around:

- Persistent research projects instead of disposable chats
- Verifiable evidence objects instead of unsupported summaries
- Agent specialization instead of a single monolithic assistant
- Scientific memory instead of short-term chat history
- Knowledge graph reasoning instead of flat notes
- ML-assisted insight discovery instead of purely textual analysis
- Reproducible reports instead of opaque conclusions

## Hackathon Scope

The hackathon version is intended to demonstrate one complete vertical workflow:

1. Accept a research goal.
2. Generate an execution plan.
3. Retrieve a focused literature set.
4. Extract structured evidence.
5. Build a small knowledge graph.
6. Generate and critique hypotheses.
7. Estimate novelty.
8. Propose experiments.
9. Produce a transparent research report.

The goal is not to replace scientists. The goal is to give researchers a system that makes their reasoning, evidence, and discovery process more organized, auditable, and powerful.

## Project Status

DiscoveryOS now includes a Docker Compose demo stack with frontend, FastAPI API, PostgreSQL, Redis, automatic migrations, deterministic seed data, health checks, and local debug logs.

## License

License to be selected before public release.
