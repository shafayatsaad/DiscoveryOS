"""Purpose: Implement evidence extraction with GPT-5 structured outputs via shared OpenAIClient."""

import asyncio
from typing import Protocol

from app.agents.base import BaseResearchAgent
from app.agents.extractor.prompts import (
    EXTRACTOR_PROMPT_VERSION,
    EXTRACTOR_SYSTEM_PROMPT,
    EXTRACTOR_TASK_PROMPT_TEMPLATE,
)
from app.agents.extractor.schemas import (
    EvidenceClaim,
    EvidenceCollection,
    EvidenceExtractionRequest,
    EvidenceSnippet,
    PaperEvidence,
)
from app.agents.openai_adapter import OpenAIClient
from app.agents.prompt_templates import render_task_prompt
from app.agents.retriever.schemas import Paper, PaperCollection
from app.config import Settings, get_settings
from app.schemas.agent import AgentContext


class EvidenceExtractionClient(Protocol):
    """Client boundary for evidence extraction implementations."""

    async def extract(self, paper: Paper, research_goal: str, domain: str) -> PaperEvidence:
        """Extract structured evidence for one paper."""


class OpenAIResponsesEvidenceClient:
    """GPT-5 powered evidence extraction using the shared OpenAIClient."""

    def __init__(self, settings: Settings) -> None:
        self._client = OpenAIClient(
            settings=settings,
            system_prompt=EXTRACTOR_SYSTEM_PROMPT,
            prompt_version=EXTRACTOR_PROMPT_VERSION,
        )

    async def extract(self, paper: Paper, research_goal: str, domain: str) -> PaperEvidence:
        """Extract structured evidence using GPT-5 structured outputs."""
        user_content = render_task_prompt(
            EXTRACTOR_TASK_PROMPT_TEMPLATE,
            research_goal=research_goal,
            domain=domain,
            title=paper.title,
            authors=", ".join(paper.authors),
            year=str(paper.year),
            doi=paper.doi or "not available",
            source=paper.source,
            keywords=", ".join(paper.keywords),
            abstract=paper.abstract or "No abstract available.",
        )
        result = await self._client.parse(
            user_content=user_content,
            response_format=PaperEvidence,
        )
        return result


class DeterministicEvidenceExtractionClient:
    """Local deterministic extractor used when OpenAI credentials are not configured."""

    async def extract(self, paper: Paper, research_goal: str, domain: str) -> PaperEvidence:
        """Create conservative evidence from metadata without making scientific claims."""
        abstract = paper.abstract or ""
        first_sentence = self._first_sentence(abstract) or paper.title
        entities = self._entities_from_keywords(paper.keywords, research_goal, domain)
        return PaperEvidence(
            paper_title=paper.title,
            source=paper.source,
            doi=paper.doi,
            claims=[
                EvidenceClaim(
                    claim=first_sentence,
                    claim_type="uncertain",
                    support_level="insufficient" if not abstract else "indirect",
                )
            ],
            methods=[],
            results=[first_sentence] if abstract else [],
            limitations=["Full-text evidence was not available for deterministic extraction."],
            confidence=0.35 if abstract else 0.1,
            key_entities=entities,
            evidence_snippets=[
                EvidenceSnippet(text=first_sentence, relevance="medium" if abstract else "low")
            ],
        )

    def _first_sentence(self, abstract: str) -> str | None:
        """Read a stable snippet from an abstract for local fallback extraction."""
        if not abstract.strip():
            return None
        sentence = abstract.strip().split(".")[0].strip()
        return f"{sentence}." if sentence else None

    def _entities_from_keywords(
        self, keywords: list[str], research_goal: str, domain: str,
    ) -> list[str]:
        """Create entity candidates without generative inference."""
        words = keywords + [
            token.strip("?,.").lower()
            for token in research_goal.split()
            if len(token.strip("?,.")) > 4
        ]
        unique: list[str] = []
        for word in [domain, *words]:
            if word and word not in unique:
                unique.append(word)
        return unique[:8]


class ExtractorAgent(BaseResearchAgent):
    """Extract structured evidence from retrieved paper metadata and abstracts.

    Uses GPT-5 via the shared OpenAIClient when OPENAI_API_KEY is set.
    Falls back to deterministic extraction when no API key is available.
    """

    name = "extractor"
    description = "Extractor Agent converts paper abstracts into source-linked evidence."

    def __init__(
        self,
        client: EvidenceExtractionClient | None = None,
        settings: Settings | None = None,
    ) -> None:
        self._settings = settings or get_settings()
        self._client = client or self._default_client(self._settings)

    async def run(
        self,
        request: EvidenceExtractionRequest | PaperCollection | AgentContext,
    ) -> EvidenceCollection:
        """Extract evidence records from papers using the configured extraction client."""
        extraction_request = self._normalize_request(request)
        evidence = await asyncio.gather(
            *[
                self._extract_with_retry(
                    paper=paper,
                    research_goal=extraction_request.research_goal,
                    domain=extraction_request.domain,
                )
                for paper in extraction_request.papers
            ]
        )
        return EvidenceCollection(evidence=list(evidence), extracted_count=len(evidence))

    async def _extract_with_retry(
        self, paper: Paper, research_goal: str, domain: str, attempts: int = 3,
    ) -> PaperEvidence:
        """Retry extraction because LLM and network calls can fail transiently."""
        last_error: Exception | None = None
        for attempt in range(attempts):
            try:
                return await self._client.extract(
                    paper=paper, research_goal=research_goal, domain=domain,
                )
            except Exception as error:
                last_error = error
                if attempt == attempts - 1:
                    break
                await asyncio.sleep(0.2 * (2**attempt))

        if last_error is None:
            raise RuntimeError("Evidence extraction failed without an exception.")
        raise last_error

    def _default_client(self, settings: Settings) -> EvidenceExtractionClient:
        """Use OpenAI when configured, otherwise keep local development deterministic."""
        if settings.openai_api_key:
            return OpenAIResponsesEvidenceClient(settings)
        return DeterministicEvidenceExtractionClient()

    def _normalize_request(
        self, request: EvidenceExtractionRequest | PaperCollection | AgentContext,
    ) -> EvidenceExtractionRequest:
        """Support pipeline-native and generic AgentContext invocations."""
        if isinstance(request, EvidenceExtractionRequest):
            return request
        if isinstance(request, PaperCollection):
            return EvidenceExtractionRequest(
                research_goal="Unspecified research goal",
                domain="General Science",
                papers=request.papers,
            )
        candidate = request.inputs.get("extraction_request")
        if isinstance(candidate, EvidenceExtractionRequest):
            return candidate
        if isinstance(candidate, dict):
            return EvidenceExtractionRequest.model_validate(candidate)
        papers = request.inputs.get("papers", [])
        return EvidenceExtractionRequest(
            research_goal=request.research_goal or "Unspecified research goal",
            domain=request.domain or "General Science",
            papers=[Paper.model_validate(paper) for paper in papers],
        )
