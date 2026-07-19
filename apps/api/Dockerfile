# Purpose: Build the production container image for the DiscoveryOS FastAPI backend.

FROM python:3.12-slim AS runtime

# Purpose: Keep Python deterministic and make container logs stream immediately.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Purpose: Install package metadata first so dependency layers can be cached.
COPY pyproject.toml README.md ./

# Purpose: Copy only backend source and migration infrastructure into the image.
COPY src ./src
COPY alembic.ini ./alembic.ini
COPY alembic ./alembic

# Purpose: Install the backend package and runtime dependencies.
RUN python -m pip install --upgrade pip && python -m pip install .

EXPOSE 8000

# Purpose: Start the ASGI app with Uvicorn; orchestration can override this command.
CMD ["uvicorn", "discoveryos_api.main:app", "--host", "0.0.0.0", "--port", "8000"]

