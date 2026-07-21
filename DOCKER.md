# DiscoveryOS Docker Guide

DiscoveryOS ships with a complete Docker Compose stack for local demos, development, and production-shaped runs.

## Services

| Service | Image/build | Port | Purpose |
| --- | --- | --- | --- |
| `frontend` | `apps/web/Dockerfile` | `3000` | Next.js product UI |
| `api` | `apps/api/Dockerfile` | `8000` | FastAPI backend |
| `postgres` | `postgres:16-alpine` | `5432` | Persistent database |
| `redis` | `redis:7-alpine` | `6379` | Coordination/cache-ready service |

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

Open:

- Web app: [http://localhost:3000](http://localhost:3000)
- API health: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
- API readiness: [http://localhost:8000/api/v1/ready](http://localhost:8000/api/v1/ready)

The API entrypoint waits for Postgres and Redis, runs Alembic migrations, and seeds deterministic demo data when `DISCOVERYOS_SEED_DEMO=true`.

## Development Mode

Use the development override for hot reload:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Development mode uses:

- Next.js dev server for `frontend`.
- Uvicorn reload for `api`.
- Bind mounts for frontend and backend source.
- Named volumes for API storage, logs, Postgres data, Redis data, and Next cache.

## Production Mode

Use the production override for a closer deployment shape:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

Production mode uses:

- Next.js standalone runtime.
- API wheel install without development dependencies.
- `restart: unless-stopped` for long-running services.
- Demo seeding disabled by default through `DISCOVERYOS_SEED_DEMO=false`.

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed.

Important variables:

| Variable | Default | Description |
| --- | --- | --- |
| `WEB_PORT` | `3000` | Host port for the frontend |
| `API_PORT` | `8000` | Host port for the API |
| `POSTGRES_DB` | `discoveryos` | Database name |
| `POSTGRES_USER` | `discoveryos` | Database user |
| `POSTGRES_PASSWORD` | `discoveryos` | Database password |
| `DISCOVERYOS_DEMO_MODE` | `true` | Enables deterministic demo behavior |
| `DISCOVERYOS_SEED_DEMO` | `true` | Seeds demo projects on startup |
| `DISCOVERYOS_OPENAI_API_KEY` | empty | Optional live OpenAI key |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api/v1` | Browser-visible API base URL |

Do not commit a populated `.env` file.

## Health Checks

Compose waits for dependency health before starting dependent services:

- `postgres`: `pg_isready`
- `redis`: `redis-cli ping`
- `api`: `/api/v1/ready`
- `frontend`: HTTP request to `/`

## Volumes

| Volume | Mounted at | Purpose |
| --- | --- | --- |
| `postgres-data` | `/var/lib/postgresql/data` | Database persistence |
| `redis-data` | `/data` | Redis append-only persistence |
| `api-storage` | `/app/storage` | Runtime artifacts |
| `api-logs` | `/app/logs` | Service logs |
| `web-next-cache` | `/app/apps/web/.next` | Dev-only Next cache |

Reset the stack:

```bash
docker compose down -v
```

## Image Optimization

Frontend:

- Uses `node:22-alpine`.
- Installs dependencies in a separate `deps` stage.
- Builds with Next `output: "standalone"`.
- Runtime image copies only `.next/standalone`, `.next/static`, and `public`.
- Runs as the non-root `nextjs` user.

Backend:

- Uses `python:3.12-slim`.
- Builds a wheel in a separate `builder` stage.
- Runtime image installs the wheel without dev extras.
- Copies only migrations, seed script, and entrypoint.
- Runs as the non-root `appuser` user.

Build context:

- `.dockerignore` excludes local caches, logs, storage, `.env`, test reports, and build outputs.

## Common Commands

```bash
docker compose ps
docker compose logs -f api
docker compose logs -f frontend
docker compose down
docker compose down -v
```

Rebuild one service:

```bash
docker compose build frontend
docker compose up frontend
```

## Troubleshooting

If the API is unhealthy, check:

```bash
docker compose logs api
docker compose logs postgres
docker compose logs redis
```

If the frontend cannot reach the API from the browser, confirm:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

If ports are already in use, change `WEB_PORT`, `API_PORT`, `POSTGRES_PORT`, or `REDIS_PORT` in `.env`.
