"""Purpose: Provide shared OpenAI Responses API client with retry, timeout, token logging, and prompt storage."""

import asyncio
import json
import logging
from datetime import UTC, datetime
from typing import Any

from openai import AsyncOpenAI
from pydantic import BaseModel

from app.config import Settings, get_settings

logger = logging.getLogger(__name__)


class OpenAIClient:
    """Shared OpenAI client for all DiscoveryOS agents.

    Features:
    - Structured outputs via Pydantic response_format
    - Retry with exponential backoff (3 attempts)
    - Timeout handling (60s default)
    - Token usage logging
    - Prompt storage for debugging

    Usage:
        client = OpenAIClient(settings, system_prompt="...", prompt_version="v1")
        result = await client.parse(user_content="...", response_format=MyModel)
    """

    def __init__(
        self,
        settings: Settings | None = None,
        system_prompt: str = "",
        prompt_version: str = "unknown",
        timeout_seconds: float = 60.0,
        max_retries: int = 3,
    ) -> None:
        self._settings = settings or get_settings()
        self._api_key = self._settings.openai_api_key
        self._model = self._settings.openai_model
        self._system_prompt = system_prompt
        self._prompt_version = prompt_version
        self._timeout_seconds = timeout_seconds
        self._max_retries = max_retries
        self._total_input_tokens = 0
        self._total_output_tokens = 0
        self._total_requests = 0
        self._prompt_history: list[dict[str, Any]] = []

    @property
    def is_available(self) -> bool:
        """Return True when an OpenAI API key is configured."""
        return bool(self._api_key)

    async def parse(
        self,
        user_content: str,
        response_format: type[BaseModel],
    ) -> BaseModel:
        """Call OpenAI Responses API with structured output, retry, timeout, and logging.

        Args:
            user_content: The user prompt string.
            response_format: A Pydantic model class for structured output validation.

        Returns:
            A validated instance of response_format.

        Raises:
            RuntimeError: If all retry attempts fail.
            asyncio.TimeoutError: If the request exceeds the timeout.
        """
        self._store_prompt(user_content)
        last_error: Exception | None = None

        for attempt in range(self._max_retries):
            try:
                return await asyncio.wait_for(
                    self._make_request(user_content, response_format),
                    timeout=self._timeout_seconds,
                )
            except asyncio.TimeoutError:
                logger.warning(
                    "OpenAI request timed out after %ss (attempt %d/%d)",
                    self._timeout_seconds,
                    attempt + 1,
                    self._max_retries,
                )
                last_error = TimeoutError(
                    f"OpenAI request timed out after {self._timeout_seconds}s"
                )
                if attempt == self._max_retries - 1:
                    break
                await asyncio.sleep(0.5 * (2**attempt))
            except Exception as error:
                logger.warning(
                    "OpenAI request failed (attempt %d/%d): %s",
                    attempt + 1,
                    self._max_retries,
                    error,
                )
                last_error = error
                if attempt == self._max_retries - 1:
                    break
                await asyncio.sleep(0.2 * (2**attempt))

        if last_error is None:
            raise RuntimeError("OpenAI request failed without an exception.")
        raise last_error

    async def _make_request(
        self,
        user_content: str,
        response_format: type[BaseModel],
    ) -> BaseModel:
        """Execute the actual OpenAI API call."""
        client = AsyncOpenAI(api_key=self._api_key)
        response = await client.responses.parse(
            model=self._model,
            input=[
                {"role": "system", "content": self._system_prompt},
                {"role": "user", "content": user_content},
            ],
            text_format=response_format,
        )

        # Log token usage
        if response.usage is not None:
            self._total_input_tokens += response.usage.input_tokens
            self._total_output_tokens += response.usage.output_tokens
            self._total_requests += 1
            logger.info(
                "OpenAI request completed: model=%s input_tokens=%d output_tokens=%d total_requests=%d",
                self._model,
                response.usage.input_tokens,
                response.usage.output_tokens,
                self._total_requests,
            )

        parsed = response.output_parsed
        if parsed is None:
            raise ValueError("OpenAI response did not include parsed output.")
        return parsed

    def _store_prompt(self, user_content: str) -> None:
        """Store prompt for debugging purposes."""
        self._prompt_history.append({
            "version": self._prompt_version,
            "system_prompt": self._system_prompt,
            "user_content": user_content,
            "timestamp": datetime.now(UTC).isoformat(),
        })

    def get_token_usage(self) -> dict[str, int]:
        """Return cumulative token usage statistics."""
        return {
            "total_input_tokens": self._total_input_tokens,
            "total_output_tokens": self._total_output_tokens,
            "total_requests": self._total_requests,
            "model": self._model,
            "prompt_version": self._prompt_version,
        }

    def get_prompt_history(self) -> list[dict[str, Any]]:
        """Return stored prompts for debugging."""
        return list(self._prompt_history)

    def reset_prompt_history(self) -> None:
        """Clear stored prompt history."""
        self._prompt_history.clear()