"""Purpose: Provide reusable provider, retry, rate-limit, and cache primitives."""

import asyncio
import time
from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from typing import Any, Protocol, TypeVar

import httpx

from app.agents.retriever.schemas import Paper

T = TypeVar("T")


class LiteratureProvider(Protocol):
    """Protocol implemented by every scientific metadata provider."""

    name: str

    async def search(self, query: str, limit: int) -> list[Paper]:
        """Search a literature source and return normalized paper metadata."""


class ResponseCache(Protocol):
    """Cache boundary so provider responses can move to Redis later."""

    async def get(self, key: str) -> Any | None:
        """Return a cached value by key."""

    async def set(self, key: str, value: Any, ttl_seconds: int) -> None:
        """Store a cached value by key."""


class InMemoryResponseCache:
    """Simple process-local cache for tests and local development."""

    def __init__(self) -> None:
        self._values: dict[str, tuple[float, Any]] = {}

    async def get(self, key: str) -> Any | None:
        """Return an unexpired cached value."""

        record = self._values.get(key)
        if record is None:
            return None
        expires_at, value = record
        if expires_at <= time.monotonic():
            self._values.pop(key, None)
            return None
        return value

    async def set(self, key: str, value: Any, ttl_seconds: int) -> None:
        """Store a value until ttl_seconds has elapsed."""

        self._values[key] = (time.monotonic() + ttl_seconds, value)


@dataclass(frozen=True)
class RetryConfig:
    """Retry policy shared by providers and OpenAI-backed extraction."""

    attempts: int = 3
    base_delay_seconds: float = 0.1


class AsyncRateLimiter:
    """Minimal async rate limiter that spaces calls from one provider."""

    def __init__(self, min_interval_seconds: float = 0.1) -> None:
        self._min_interval_seconds = min_interval_seconds
        self._lock = asyncio.Lock()
        self._last_call_at = 0.0

    async def wait(self) -> None:
        """Wait until the next provider request is allowed."""

        async with self._lock:
            elapsed = time.monotonic() - self._last_call_at
            delay = self._min_interval_seconds - elapsed
            if delay > 0:
                await asyncio.sleep(delay)
            self._last_call_at = time.monotonic()


async def retry_async[T](operation: Callable[[], Awaitable[T]], config: RetryConfig) -> T:
    """Run an async operation with simple exponential backoff."""

    last_error: Exception | None = None
    for attempt in range(config.attempts):
        try:
            return await operation()
        except (httpx.HTTPError, TimeoutError, ValueError) as error:
            last_error = error
            if attempt == config.attempts - 1:
                break
            await asyncio.sleep(config.base_delay_seconds * (2**attempt))

    if last_error is None:
        raise RuntimeError("Retry operation failed without an exception.")
    raise last_error


class HttpLiteratureProvider:
    """Base class for HTTP-backed literature metadata providers."""

    name: str

    def __init__(
        self,
        client: httpx.AsyncClient | None = None,
        cache: ResponseCache | None = None,
        retry_config: RetryConfig | None = None,
        rate_limiter: AsyncRateLimiter | None = None,
        cache_ttl_seconds: int = 900,
    ) -> None:
        self._owns_client = client is None
        self._client = client or httpx.AsyncClient(timeout=10.0)
        self._cache = cache or InMemoryResponseCache()
        self._retry_config = retry_config or RetryConfig()
        self._rate_limiter = rate_limiter or AsyncRateLimiter()
        self._cache_ttl_seconds = cache_ttl_seconds

    async def close(self) -> None:
        """Close the provider-owned HTTP client."""

        if self._owns_client:
            await self._client.aclose()

    async def _get_json(self, cache_key: str, url: str, params: dict[str, Any]) -> Any:
        """Fetch and cache a JSON provider response."""

        cached = await self._cache.get(cache_key)
        if cached is not None:
            return cached

        async def operation() -> Any:
            await self._rate_limiter.wait()
            response = await self._client.get(url, params=params)
            response.raise_for_status()
            return response.json()

        data = await retry_async(operation, self._retry_config)
        await self._cache.set(cache_key, data, self._cache_ttl_seconds)
        return data

    async def _get_text(self, cache_key: str, url: str, params: dict[str, Any]) -> str:
        """Fetch and cache a text provider response."""

        cached = await self._cache.get(cache_key)
        if cached is not None:
            return str(cached)

        async def operation() -> str:
            await self._rate_limiter.wait()
            response = await self._client.get(url, params=params)
            response.raise_for_status()
            return response.text

        data = await retry_async(operation, self._retry_config)
        await self._cache.set(cache_key, data, self._cache_ttl_seconds)
        return data
