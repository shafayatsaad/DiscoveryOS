"""Purpose: Generate complete scientific reports from workspace artifacts."""

import html

from app.agents.base import BaseResearchAgent
from app.agents.contradiction.schemas import ContradictionAnalysis
from app.agents.experiment.schemas import ExperimentPlan
from app.agents.novelty.schemas import NoveltyAnalysis
from app.agents.report.schemas import ScientificReport, ScientificReportRequest
from app.graph.schemas import KnowledgeGraph
from app.schemas.agent import AgentContext
from app.workspace.schemas import Workspace


class ReportAgent(BaseResearchAgent):
    """Agent that creates Markdown and HTML report artifacts from structured data."""

    name = "report"
    description = "Report Agent generates auditable Markdown and HTML research reports."

    async def run(
        self,
        request: ScientificReportRequest | Workspace | AgentContext,
    ) -> ScientificReport:
        """Generate a complete deterministic report without unsupported conclusions."""

        report_request = self._normalize_request(request)
        markdown = self._markdown(report_request)
        return ScientificReport(
            title=self._title(report_request.workspace),
            markdown=markdown,
            html=self._html(markdown),
            references=self._references(report_request.workspace),
        )

    def _normalize_request(
        self,
        request: ScientificReportRequest | Workspace | AgentContext,
    ) -> ScientificReportRequest:
        """Normalize workspace or generic context into a report request."""

        if isinstance(request, ScientificReportRequest):
            return request
        if isinstance(request, Workspace):
            return ScientificReportRequest(
                workspace=request,
                knowledge_graph=(
                    KnowledgeGraph.model_validate(request.knowledge_graph)
                    if request.knowledge_graph
                    else None
                ),
                contradictions=(
                    ContradictionAnalysis(contradictions=[], analyzed_evidence_count=0)
                ),
                novelty_analysis=(
                    NoveltyAnalysis.model_validate(request.novelty_analysis)
                    if request.novelty_analysis
                    else None
                ),
                experiment_plan=(
                    ExperimentPlan(
                        suggested_experiments=request.suggested_experiments,
                        planning_notes=[],
                    )
                    if request.suggested_experiments
                    else None
                ),
            )
        candidate = request.inputs.get("workspace")
        if isinstance(candidate, Workspace):
            return ScientificReportRequest(workspace=candidate)
        if isinstance(candidate, dict):
            return ScientificReportRequest(workspace=Workspace.model_validate(candidate))
        raise ValueError("ReportAgent requires a Workspace.")

    def _markdown(self, request: ScientificReportRequest) -> str:
        """Compose the required report sections as Markdown."""

        workspace = request.workspace
        lines = [
            f"# {self._title(workspace)}",
            "",
            "## Research Goal",
            workspace.research_goal or "No research goal recorded.",
            "",
            "## Research Plan",
            self._jsonish_section(workspace.research_plan),
            "",
            "## Evidence Summary",
            self._evidence_summary(workspace),
            "",
            "## Knowledge Graph Summary",
            self._graph_summary(request.knowledge_graph),
            "",
            "## Contradictions",
            self._contradictions_summary(request.contradictions, workspace),
            "",
            "## Novelty Analysis",
            self._novelty_summary(request.novelty_analysis),
            "",
            "## Suggested Experiments",
            self._experiment_summary(request.experiment_plan),
            "",
            "## References",
            self._references_summary(workspace),
        ]
        return "\n".join(lines)

    def _html(self, markdown: str) -> str:
        """Render minimal semantic HTML while preserving future PDF export compatibility."""

        html_lines: list[str] = ["<article>"]
        for line in markdown.splitlines():
            escaped = html.escape(line)
            if line.startswith("# "):
                html_lines.append(f"<h1>{escaped[2:]}</h1>")
            elif line.startswith("## "):
                html_lines.append(f"<h2>{escaped[3:]}</h2>")
            elif line.startswith("- "):
                html_lines.append(f"<p>{escaped}</p>")
            elif line:
                html_lines.append(f"<p>{escaped}</p>")
        html_lines.append("</article>")
        return "\n".join(html_lines)

    def _title(self, workspace: Workspace) -> str:
        """Create a stable report title from workspace state."""

        return f"DiscoveryOS Report: {workspace.research_goal or workspace.project_id}"

    def _jsonish_section(self, value: dict | None) -> str:
        """Summarize structured plan dictionaries without losing their shape."""

        if not value:
            return "No research plan recorded."
        objectives = value.get("objectives", [])
        queries = value.get("search_queries", [])
        lines = [f"- Domain: {value.get('research_domain', 'Unknown')}"]
        lines.extend(f"- Objective: {objective}" for objective in objectives[:4])
        lines.extend(f"- Query: {query.get('query', query)}" for query in queries[:3])
        return "\n".join(lines)

    def _evidence_summary(self, workspace: Workspace) -> str:
        """Summarize extracted evidence records."""

        if not workspace.extracted_evidence:
            return "No extracted evidence recorded."
        lines = []
        for evidence in workspace.extracted_evidence[:8]:
            title = evidence.get("paper_title", "Untitled paper")
            claims = evidence.get("claims", [])
            claim_text = claims[0].get("claim") if claims else "No claim text."
            lines.append(f"- {title}: {claim_text}")
        return "\n".join(lines)

    def _graph_summary(self, graph: KnowledgeGraph | None) -> str:
        """Summarize graph metrics."""

        if graph is None:
            return "No knowledge graph recorded."
        return (
            f"- Nodes: {graph.summary.get('node_count', 0)}\n"
            f"- Edges: {graph.summary.get('edge_count', 0)}\n"
            f"- Node types: {', '.join(graph.summary.get('node_types', []))}"
        )

    def _contradictions_summary(
        self,
        contradictions: ContradictionAnalysis | None,
        workspace: Workspace,
    ) -> str:
        """Summarize contradictions stored or passed to the report request."""

        records = contradictions.contradictions if contradictions else []
        if not records and workspace.contradictions:
            records = ContradictionAnalysis.model_validate(
                {
                    "contradictions": workspace.contradictions,
                    "analyzed_evidence_count": len(workspace.extracted_evidence),
                }
            ).contradictions
        if not records:
            return "No contradictions detected in the current retrieved corpus."
        return "\n".join(
            f"- {record.severity.title()}: {record.statement_a} / {record.statement_b}"
            for record in records
        )

    def _novelty_summary(self, novelty: NoveltyAnalysis | None) -> str:
        """Summarize novelty estimate."""

        if novelty is None:
            return "No novelty analysis recorded."
        return (
            f"- Category: {novelty.category}\n"
            f"- Score: {novelty.novelty_score:.2f}\n"
            f"- Caveat: {novelty.disclaimer}"
        )

    def _experiment_summary(self, plan: ExperimentPlan | None) -> str:
        """Summarize suggested experiments."""

        if plan is None or not plan.suggested_experiments:
            return "No suggested experiments recorded."
        return "\n".join(
            f"- {experiment.title}: {experiment.objective}"
            for experiment in plan.suggested_experiments
        )

    def _references_summary(self, workspace: Workspace) -> str:
        """Render references from retrieved papers."""

        references = self._references(workspace)
        if not references:
            return "No references recorded."
        return "\n".join(f"- {reference}" for reference in references)

    def _references(self, workspace: Workspace) -> list[str]:
        """Collect paper references from workspace metadata."""

        references: list[str] = []
        for paper in workspace.retrieved_papers:
            title = paper.get("title", "Untitled paper")
            source = paper.get("source", "Unknown source")
            doi = paper.get("doi")
            references.append(f"{title}. {source}. DOI: {doi or 'not available'}")
        return references
