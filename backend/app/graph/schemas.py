"""Purpose: Define domain-agnostic knowledge graph schemas."""

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

NodeType = Literal[
    "Medicine",
    "Disease",
    "Drug",
    "Gene",
    "Protein",
    "Climate",
    "Country",
    "Policy",
    "Emission",
    "Technology",
    "AI",
    "Model",
    "Benchmark",
    "Dataset",
    "Method",
    "Paper",
    "Claim",
    "Entity",
]


class GraphNode(BaseModel):
    """Node in a domain-agnostic scientific knowledge graph."""

    id: str
    label: str
    type: NodeType
    metadata: dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(extra="forbid")


class GraphEdge(BaseModel):
    """Relationship between scientific graph nodes."""

    id: str
    source: str
    target: str
    relationship: str
    evidence_refs: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(extra="forbid")


class KnowledgeGraph(BaseModel):
    """Serializable graph payload stored on the workspace and returned by APIs."""

    project_id: str
    nodes: list[GraphNode]
    edges: list[GraphEdge]
    summary: dict[str, Any]

    model_config = ConfigDict(extra="forbid")
