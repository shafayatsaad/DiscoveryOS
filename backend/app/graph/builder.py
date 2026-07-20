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
        """Create graph nodes and edges from papers, claims, and extracted entities.

        Performance: Uses batched node/edge additions (add_nodes_from, add_edges_from)
        instead of one-at-a-time add_node/add_edge calls. This reduces Python-to-C
        boundary crossings in NetworkX significantly for large graphs.
        """
        graph = nx.MultiDiGraph(project_id=workspace.project_id)

        # --- Batch 1: Collect all paper nodes ---
        paper_nodes: list[tuple[str, dict]] = []
        for paper in workspace.retrieved_papers:
            paper_key = paper.get("doi") or paper.get("title", "paper")
            paper_id = self._node_id("paper", str(paper_key))
            paper_nodes.append((
                paper_id,
                {
                    "label": paper.get("title", "Untitled paper"),
                    "type": "Paper",
                    "metadata": paper,
                },
            ))
        graph.add_nodes_from(paper_nodes)

        # --- Batch 2: Collect evidence nodes and edges ---
        entity_nodes: list[tuple[str, dict]] = []
        claim_nodes: list[tuple[str, dict]] = []
        edges: list[tuple[str, str, dict]] = []

        seen_paper_ids: set[str] = {n[0] for n in paper_nodes}
        seen_entity_ids: set[str] = set()
        seen_claim_ids: set[str] = set()

        for evidence in workspace.extracted_evidence:
            paper_key = evidence.get("doi") or evidence.get("paper_title", "paper")
            paper_id = self._node_id("paper", str(paper_key))

            # Ensure paper node exists (it may only be in evidence, not in retrieved_papers)
            if paper_id not in seen_paper_ids:
                paper_nodes.append((
                    paper_id,
                    {
                        "label": evidence.get("paper_title", "Untitled paper"),
                        "type": "Paper",
                        "metadata": {"source": evidence.get("source")},
                    },
                ))
                seen_paper_ids.add(paper_id)

            # Entities
            for entity in evidence.get("key_entities", []):
                entity_id = self._node_id("entity", str(entity))
                if entity_id not in seen_entity_ids:
                    entity_nodes.append((
                        entity_id,
                        {
                            "label": str(entity),
                            "type": self._infer_node_type(str(entity)),
                            "metadata": {"source": "extracted_evidence"},
                        },
                    ))
                    seen_entity_ids.add(entity_id)
                edges.append((
                    paper_id,
                    entity_id,
                    {"relationship": "mentions", "evidence_refs": [str(paper_key)]},
                ))

            # Claims
            for claim in evidence.get("claims", []):
                claim_text = claim.get("claim", "")
                claim_id = self._node_id("claim", claim_text)
                if claim_id not in seen_claim_ids:
                    claim_nodes.append((
                        claim_id,
                        {
                            "label": claim_text[:120] or "Claim",
                            "type": "Claim",
                            "metadata": claim,
                        },
                    ))
                    seen_claim_ids.add(claim_id)
                edges.append((
                    paper_id,
                    claim_id,
                    {
                        "relationship": claim.get("support_level", "supports"),
                        "evidence_refs": [str(paper_key)],
                    },
                ))

        # Batch-add all collected nodes and edges at once
        graph.add_nodes_from(entity_nodes)
        graph.add_nodes_from(claim_nodes)
        graph.add_edges_from(edges)

        return self._to_schema(project_id=workspace.project_id, graph=graph)

    def _to_schema(self, project_id: str, graph: nx.MultiDiGraph) -> KnowledgeGraph:
        """Serialize a NetworkX graph into the API graph schema.

        Performance: Uses list comprehensions instead of manual loops for
        node/edge serialization, reducing Python-level iteration overhead.
        """
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