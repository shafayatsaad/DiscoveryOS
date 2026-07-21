# Purpose: Build the production container image for the DiscoveryOS FastAPI backend.

FROM python:3.12-slim AS runtime

# Purpose: Keep Python deterministic and make container logs stream immediately.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Purpose: Install package metadata first so dependency layers can be cached.
COPY apps/api/pyproject.toml apps/api/README.md ./

# Purpose: Copy only backend source and migration infrastructure into the image.
COPY apps/api/src ./src
COPY apps/api/alembic.ini ./alembic.ini
COPY apps/api/alembic ./alembic
COPY scripts/seed_demo.py ./scripts/seed_demo.py
COPY scripts/docker/api-entrypoint.sh ./docker/api-entrypoint.sh

# Purpose: Install the backend package and runtime dependencies.
RUN python -m pip install --upgrade pip \
    && python -m pip install ".[dev]" \
    && chmod +x ./docker/api-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./docker/api-entrypoint.sh"]

# Purpose: Start the ASGI app with Uvicorn; orchestration can override this command.
CMD ["uvicorn", "discoveryos_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
