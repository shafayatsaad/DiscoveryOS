# syntax=docker/dockerfile:1
# Purpose: Build optimized runtime and development images for the DiscoveryOS API.

FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /build

COPY apps/api/pyproject.toml apps/api/README.md ./
COPY apps/api/src ./src
RUN python -m pip install --upgrade pip wheel \
    && python -m pip wheel --wheel-dir /wheels .

FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN useradd --create-home --user-group --uid 10001 --shell /usr/sbin/nologin appuser

COPY --from=builder /wheels /wheels
RUN python -m pip install --no-cache-dir /wheels/*.whl \
    && rm -rf /wheels

COPY apps/api/alembic.ini ./alembic.ini
COPY apps/api/alembic ./alembic
COPY scripts/seed_demo.py ./scripts/seed_demo.py
COPY scripts/docker/api-entrypoint.sh ./docker/api-entrypoint.sh

RUN chmod +x ./docker/api-entrypoint.sh \
    && mkdir -p /app/storage /app/logs \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

ENTRYPOINT ["./docker/api-entrypoint.sh"]

CMD ["uvicorn", "discoveryos_api.main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM python:3.12-slim AS dev

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY apps/api/pyproject.toml apps/api/README.md ./
COPY apps/api/src ./src
COPY apps/api/alembic.ini ./alembic.ini
COPY apps/api/alembic ./alembic
COPY scripts/seed_demo.py ./scripts/seed_demo.py
COPY scripts/docker/api-entrypoint.sh ./docker/api-entrypoint.sh

RUN python -m pip install --upgrade pip \
    && python -m pip install -e ".[dev]" \
    && chmod +x ./docker/api-entrypoint.sh \
    && mkdir -p /app/storage /app/logs

EXPOSE 8000

ENTRYPOINT ["./docker/api-entrypoint.sh"]

CMD ["uvicorn", "discoveryos_api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--app-dir", "src"]
