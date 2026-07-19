"""Purpose: Detect conflicting findings across workspace evidence."""

from typing import Protocol

from app.agents.base import BaseResearchAgent
from app.agents.contradiction.prompts import CONTRADICTION_SYSTEM_PROMPT
from app.agents.contradiction.schemas import (
    Contradiction,
    ContradictionAnalysis,
    ContradictionDetectionRequest,
    SupportingPaper,
)
from app.config import Settings, get_settings
from app.graph.schemas import KnowledgeGraph
from app.schemas.agent import AgentContext
from app.workspace.schemas import Workspace

NEGATIVE_TERMS = {"no ", "not ", "failed", "insignificant", "no significant", "did not"}
POSITIVE_TERMS = {"improves", "increases", "reduces", "significant", "associated", "supports"}


class ContradictionClient(Protocol):
    """Client boundary for contradiction detection implementations."""

    async def detect(self, request: ContradictionDetectionRequest) -> ContradictionAnalysis:
        """Return structured contradictions with paper citations."""


class OpenAIContradictionClient:
    """OpenAI Responses API implementation for contradiction detection."""

    def __init__(self, api_key: str, model: str) -> None:
        self._api_key = api_key
        self._model = model

    async def detect(self, request: ContradictionDetectionRequest) -> ContradictionAnalysis:
        """Call OpenAI with strict structured output validation."""

        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=self._api_key)
        response = await client.responses.parse(
            model=self._model,
            input=[
                {"role": "system", "content": CONTRADICTION_SYSTEM_PROMPT},
                {"role": "user", "content": request.model_dump_json()},
            ],
            text_format=ContradictionAnalysis,
        )
        if response.output_parsed is None:
            raise ValueError("OpenAI response did not include parsed ContradictionAnalysis.")
        return response.output_parsed


class DeterministicContradictionClient:
    """Local contradiction detector that only flags clear lexical conflicts."""

    async def detect(self, request: ContradictionDetectionRequest) -> ContradictionAnalysis:
        """Find conservative conflicts between positive and negative claim language."""

        claims = self._claims_with_papers(request.workspace)
        contradictions: list[Contradiction] = []
        for index, left in enumerate(claims):
            for right in claims[index + 1 :]:
                if left["paper"].title == right["paper"].title:
                    continue
                if self._is_conflict(left["claim"], right["claim"]):
                    contradictions.append(
                        Contradiction(
                            statement_a=left["claim"],
                            statement_b=right["claim"],
                            supporting_papers=[left["paper"], right["paper"]],
                            possible_causes=[
                                "Different datasets, populations, methods, or statistical power.",
                                "Abstract-level metadata may omit important experimental context.",
                            ],
                            confidence=0.55,
                            severity="medium",
                        )
                    )
        return ContradictionAnalysis(
            contradictions=contradictions,
            analyzed_evidence_count=len(claims),
            notes=["Deterministic detector flags only clear positive/negative claim tension."],
        )

    def _claims_with_papers(self, workspace: Workspace) -> list[dict[str, str | SupportingPaper]]:
        """Flatten evidence claims while preserving source citations."""

        rows: list[dict[str, str | SupportingPaper]] = []
        for evidence in workspace.extracted_evidence:
            paper = SupportingPaper(
                title=evidence.get("paper_title", "Untitled paper"),
                doi=evidence.get("doi"),
                source=evidence.get("source"),
            )
            for claim in evidence.get("claims", []):
                claim_text = claim.get("claim") if isinstance(claim, dict) else None
                if claim_text:
                    rows.append({"claim": claim_text, "paper": paper})
        return rows

    def _is_conflict(self, left: str | SupportingPaper, right: str | SupportingPaper) -> bool:
        """Return true only when two text claims express opposite directions."""

        left_text = str(left).lower()
        right_text = str(right).lower()
        left_negative = any(term in left_text for term in NEGATIVE_TERMS)
        right_negative = any(term in right_text for term in NEGATIVE_TERMS)
        left_positive = any(term in left_text for term in POSITIVE_TERMS)
        right_positive = any(term in right_text for term in POSITIVE_TERMS)
        shared_terms = set(left_text.split()).intersection(right_text.split())
        return bool(shared_terms) and (
            (left_positive and right_negative) or (left_negative and right_positive)
        )


class ContradictionAgent(BaseResearchAgent):
    """Agent that detects conflicting findings across workspace evidence."""

    name = "contradiction"
    description = "Contradiction Agent identifies conflicting evidence with citations."

    def __init__(
        self,
        client: ContradictionClient | None = None,
        settings: Settings | None = None,
    ) -> None:
        self._settings = settings or get_settings()
        self._client = client or self._default_client(self._settings)

    async def run(
        self,
        request: ContradictionDetectionRequest | Workspace | AgentContext,
    ) -> ContradictionAnalysis:
        """Run contradiction detection and return structured evidence conflicts."""

        return await self._client.detect(self._normalize_request(request))

    def _default_client(self, settings: Settings) -> ContradictionClient:
        """Use OpenAI when configured, otherwise deterministic local detection."""

        if settings.openai_api_key:
            return OpenAIContradictionClient(settings.openai_api_key, settings.openai_model)
        return DeterministicContradictionClient()

    def _normalize_request(
        self,
        request: ContradictionDetectionRequest | Workspace | AgentContext,
    ) -> ContradictionDetectionRequest:
        """Normalize generic invocations into the contradiction request schema."""

        if isinstance(request, ContradictionDetectionRequest):
            return request
        if isinstance(request, Workspace):
            graph = (
                KnowledgeGraph.model_validate(request.knowledge_graph)
                if request.knowledge_graph
                else None
            )
            return ContradictionDetectionRequest(workspace=request, knowledge_graph=graph)
        candidate = request.inputs.get("workspace")
        if isinstance(candidate, Workspace):
            return ContradictionDetectionRequest(workspace=candidate)
        if isinstance(candidate, dict):
            return ContradictionDetectionRequest(workspace=Workspace.model_validate(candidate))
        raise ValueError("ContradictionAgent requires a Workspace.")
