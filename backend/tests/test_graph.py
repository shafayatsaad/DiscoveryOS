"""Purpose: Test knowledge graph construction and API persistence."""

from datetime import UTC, datetime

from fastapi.testclient import TestClient

from app.graph.builder import KnowledgeGraphBuilder
from app.main import create_app
from app.workspace.schemas import Workspace


def test_graph_builder_infers_domain_agnostic_nodes() -> None:
    """Graph builder should infer useful node types without fixed biomedical assumptions."""

    graph = KnowledgeGraphBuilder().build(
        Workspace(
            id="workspace_graph_unit",
            project_id="project_graph_unit",
            retrieved_papers=[
                {
                    "title": "Transformer model benchmark",
                    "doi": "10.0000/ai",
                    "source": "FakeSource",
                }
            ],
            extracted_evidence=[
                {
                    "paper_title": "Transformer model benchmark",
                    "doi": "10.0000/ai",
                    "source": "FakeSource",
                    "claims": [{"claim": "The model improves benchmark performance."}],
                    "key_entities": ["Transformer model", "AI benchmark", "Dataset"],
                }
            ],
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )
    )

    node_types = {node.type for node in graph.nodes}
    assert "Paper" in node_types
    assert "Model" in node_types
    assert "Benchmark" in node_types


def test_graph_build_endpoint_stores_graph() -> None:
    """POST /graph/build should persist graph JSON on the workspace."""

    project_id = "project_graph_endpoint"
    with TestClient(create_app()) as client:
        client.patch(
            f"/api/v1/projects/{project_id}/workspace",
            json={
                "retrieved_papers": [{"title": "Climate policy paper", "source": "Fake"}],
                "extracted_evidence": [
                    {
                        "paper_title": "Climate policy paper",
                        "source": "Fake",
                        "claims": [{"claim": "Policy affects emissions."}],
                        "key_entities": ["Climate policy", "carbon emission"],
                    }
                ],
            },
        )

        response = client.post(f"/api/v1/projects/{project_id}/graph/build")

    assert response.status_code == 200
    assert response.json()["summary"]["node_count"] >= 3
