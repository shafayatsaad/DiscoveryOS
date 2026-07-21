# DiscoveryOS Docker

Operational Docker assets live at the repository root for fast demo setup:

- `docker-compose.yml` runs frontend, API, PostgreSQL, and Redis.
- `apps/api/Dockerfile` builds the FastAPI service and runs migrations on startup.
- `apps/web/Dockerfile` builds and serves the Next.js frontend.
- `scripts/docker/api-entrypoint.sh` waits for dependencies, migrates, seeds, then starts Uvicorn.
