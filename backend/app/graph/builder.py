"""Purpose: Build domain-agnostic NetworkX knowledge graphs from workspace evidence."""

import hashlib

import networkx as nx

from app.graph.schemas import GraphEdge, GraphNode, KnowledgeGraph, NodeType
from app.workspace.schemas import Workspace

NODE_KEYWORDS: dict[NodeType, set[str]] = {
    "Disease": {"disease", "syndrome", "cancer", "alzheimer", "diabetes", "infection"},
    "Drug": {"drug", "therapy", "metformin", "compound", "inhibitor", "vaccine"},
    "Gene": {"gene", "genetic", "allele", "genomic"},
    "Protein": {"protein", "enzyme", "receptor", "cytokine"},
    "Climate": {"climate", "warming", "temperature", "ocean", "atmospheric"},
    "Country": {"country", "nation", "region", "china", "india", "brazil", "united states"},
    "Policy": {"policy", "regulation", "law", "tax", "treaty"},
    "Emission": {"emission", "carbon", "methane", "co2", "greenhouse"},
    "Technology": {"technology", "sensor", "capture", "battery", "semiconductor"},
    "Benchmark": {"benchmark", "leaderboard", "evaluation"},
    "Model": {"model", "transformer", "classifier", "regression"},
    "AI": {"ai", "artificial intelligence", "machine learning", "neural"},
    "Dataset": {"dataset", "corpus", "cohort", "database"},
    "Method": {"method", "assay", "protocol", "trial", "simulation"},
}


class KnowledgeGraphBuilder:
    """Build a NetworkX graph from evidence without assuming a scientific domain."""

    def build(self, workspace: Workspace) -> KnowledgeGraph:
        """Create graph nodes and edges from papers, claims, and extracted entities."""

        graph = nx.MultiDiGraph(project_id=workspace.project_id)

        for paper in workspace.retrieved_papers:
            paper_key = paper.get("doi") or paper.get("title", "paper")
            paper_id = self._node_id("paper", str(paper_key))
            graph.add_node(
                paper_id,
                label=paper.get("title", "Untitled paper"),
                type="Paper",
                metadata=paper,
            )

        for evidence in workspace.extracted_evidence:
            paper_key = evidence.get("doi") or evidence.get("paper_title", "paper")
            paper_id = self._node_id("paper", str(paper_key))
            if paper_id not in graph:
                graph.add_node(
                    paper_id,
                    label=evidence.get("paper_title", "Untitled paper"),
                    type="Paper",
                    metadata={"source": evidence.get("source")},
                )

            for entity in evidence.get("key_entities", []):
                entity_id = self._node_id("entity", str(entity))
                graph.add_node(
                    entity_id,
                    label=str(entity),
                    type=self._infer_node_type(str(entity)),
                    metadata={"source": "extracted_evidence"},
                )
                graph.add_edge(
                    paper_id,
                    entity_id,
                    relationship="mentions",
                    evidence_refs=[str(paper_key)],
                )

            for claim in evidence.get("claims", []):
                claim_text = claim.get("claim", "")
                claim_id = self._node_id("claim", claim_text)
                graph.add_node(
                    claim_id,
                    label=claim_text[:120] or "Claim",
                    type="Claim",
                    metadata=claim,
                )
                graph.add_edge(
                    paper_id,
                    claim_id,
                    relationship=claim.get("support_level", "supports"),
                    evidence_refs=[str(paper_key)],
                )

        return self._to_schema(project_id=workspace.project_id, graph=graph)

    def _to_schema(self, project_id: str, graph: nx.MultiDiGraph) -> KnowledgeGraph:
        """Serialize a NetworkX graph into the API graph schema."""

        nodes = [
            GraphNode(
                id=node_id,
                label=attributes["label"],
                type=attributes["type"],
                metadata=attributes.get("metadata", {}),
            )
            for node_id, attributes in graph.nodes(data=True)
        ]
        edges = [
            GraphEdge(
                id=self._node_id("edge", f"{source}:{target}:{key}"),
                source=source,
                target=target,
                relationship=attributes.get("relationship", "related_to"),
                evidence_refs=attributes.get("evidence_refs", []),
                metadata={
                    key: value
                    for key, value in attributes.items()
                    if key != "evidence_refs"
                },
            )
            for source, target, key, attributes in graph.edges(keys=True, data=True)
        ]
        return KnowledgeGraph(
            project_id=project_id,
            nodes=nodes,
            edges=edges,
            summary={
                "node_count": graph.number_of_nodes(),
                "edge_count": graph.number_of_edges(),
                "node_types": sorted({node.type for node in nodes}),
            },
        )

    def _infer_node_type(self, label: str) -> NodeType:
        """Infer a useful node type from entity text while allowing arbitrary domains."""

        normalized = label.lower()
        for node_type, keywords in NODE_KEYWORDS.items():
            if any(keyword in normalized for keyword in keywords):
                return node_type
        return "Entity"

    def _node_id(self, prefix: str, value: str) -> str:
        """Create deterministic node IDs so rebuilds are stable."""

        digest = hashlib.sha1(value.encode("utf-8")).hexdigest()[:12]
        return f"{prefix}_{digest}"
