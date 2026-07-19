"""Purpose: Implement deterministic research-plan generation for the Planner Agent."""

from app.agents.base import BaseResearchAgent
from app.agents.planner.schemas import PaperSource, PlannerInput, ResearchPlan, SearchQuery
from app.schemas.agent import AgentContext

DOMAIN_KEYWORDS = {
    "Biomedical": {
        "alzheimer",
        "disease",
        "protein",
        "gene",
        "clinical",
        "cell",
        "microplastics",
        "inflammation",
    },
    "Materials Science": {
        "battery",
        "polymer",
        "alloy",
        "catalyst",
        "semiconductor",
        "material",
        "nanoparticle",
    },
    "Climate": {
        "climate",
        "carbon",
        "warming",
        "emissions",
        "atmospheric",
        "ocean",
        "drought",
    },
}

STOPWORDS = {
    "about",
    "after",
    "between",
    "could",
    "contribute",
    "from",
    "have",
    "into",
    "research",
    "should",
    "that",
    "their",
    "there",
    "this",
    "what",
    "where",
    "with",
}


class PlannerAgent(BaseResearchAgent):
    """Convert a research question into a structured, evidence-seeking plan."""

    name = "planner"
    description = "Planner Agent decomposes research questions into structured workflows."

    async def run(self, context: AgentContext | PlannerInput) -> ResearchPlan:
        """Create a deterministic ResearchPlan without answering the research question."""

        planner_input = self._normalize_input(context)
        keywords = self._extract_keywords(planner_input.research_question)
        domain = planner_input.domain or self._infer_domain(
            planner_input.research_question,
            keywords,
        )

        return ResearchPlan(
            research_goal=planner_input.research_question,
            research_domain=domain,
            objectives=[
                "Clarify the scientific mechanism or relationship being investigated.",
                "Retrieve peer-reviewed and preprint literature relevant to the question.",
                "Extract source-linked evidence without drawing unsupported conclusions.",
                "Identify contradictions, gaps, and testable follow-up directions.",
            ],
            sub_problems=[
                "Define the main entities, exposures, outcomes, and mechanisms.",
                "Collect literature across broad and targeted scientific indexes.",
                "Separate mechanistic evidence from association-only findings.",
                "Preserve uncertainty, limitations, and source provenance.",
            ],
            keywords=keywords,
            search_queries=self._build_search_queries(planner_input.research_question, keywords),
            recommended_data_sources=[
                "OpenAlex works metadata",
                "Crossref scholarly metadata",
                "arXiv preprints",
                "Domain-specific repositories when connected through MCP",
            ],
            paper_sources=[
                PaperSource(
                    name="OpenAlex",
                    priority=1,
                    reason="Broad scholarly graph metadata with citation signals.",
                ),
                PaperSource(
                    name="Crossref",
                    priority=2,
                    reason="DOI-centered publisher metadata for source verification.",
                ),
                PaperSource(
                    name="arXiv",
                    priority=3,
                    reason="Preprint coverage for emerging technical or scientific work.",
                ),
            ],
            potential_risks=[
                "Retrieved abstracts may not contain enough evidence for strong claims.",
                "Search terms may miss domain-specific synonyms or emerging terminology.",
                "Citation counts can bias retrieval toward older publications.",
                "The plan must not be interpreted as a scientific conclusion.",
            ],
            expected_deliverables=[
                "Research plan",
                "Literature metadata collection",
                "Structured evidence records",
                "Contradiction and gap inventory",
                "Evidence-backed hypothesis candidates",
            ],
        )

    def _normalize_input(self, context: AgentContext | PlannerInput) -> PlannerInput:
        """Accept the generic agent context while exposing a planner-native schema."""

        if isinstance(context, PlannerInput):
            return context

        question = (
            context.research_goal
            or context.inputs.get("query")
            or context.inputs.get("question")
        )
        if not isinstance(question, str):
            question = ""

        domain = context.domain or context.inputs.get("domain")
        return PlannerInput(research_question=question.strip(), domain=domain)

    def _infer_domain(self, question: str, keywords: list[str]) -> str:
        """Infer a broad research domain from deterministic keyword matches."""

        haystack = {word.lower() for word in question.replace("?", " ").split()} | set(keywords)
        scores = {
            domain: len(haystack.intersection(domain_keywords))
            for domain, domain_keywords in DOMAIN_KEYWORDS.items()
        }
        best_domain, score = max(scores.items(), key=lambda item: item[1])
        return best_domain if score > 0 else "General Science"

    def _extract_keywords(self, question: str) -> list[str]:
        """Extract stable keyword candidates without LLM inference."""

        normalized = "".join(char.lower() if char.isalnum() else " " for char in question)
        keywords: list[str] = []
        for token in normalized.split():
            if len(token) < 4 or token in STOPWORDS or token in keywords:
                continue
            keywords.append(token)
        return keywords[:10]

    def _build_search_queries(self, question: str, keywords: list[str]) -> list[SearchQuery]:
        """Create broad and targeted queries that retrievers can execute."""

        primary_terms = " ".join(keywords[:4]) or question
        return [
            SearchQuery(
                query=question,
                rationale="Preserve the original research question for broad recall.",
            ),
            SearchQuery(
                query=f"{primary_terms} mechanism evidence",
                rationale="Find mechanistic papers and evidence-bearing abstracts.",
            ),
            SearchQuery(
                query=f"{primary_terms} systematic review OR meta analysis",
                rationale="Find review literature and synthesized prior evidence.",
            ),
        ]
