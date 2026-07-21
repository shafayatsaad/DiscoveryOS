"""Purpose: Seed deterministic hackathon demo data without calling live APIs."""

from __future__ import annotations

import asyncio
from datetime import UTC, datetime

from sqlalchemy import select

from discoveryos_api.core.config import get_settings
from discoveryos_api.db.session import DatabaseSessionManager
from discoveryos_api.models.memory import (
    Evidence,
    Hypothesis,
    KnowledgeGraphSnapshot,
    ResearchNote,
    TimelineEvent,
)
from discoveryos_api.models.project import Project
from discoveryos_api.models.research_job import ResearchJob

DEMO_PROJECT_ID = "00000000-0000-4000-8000-000000000001"


async def seed_demo() -> None:
    """Purpose: Create a demo workspace, papers, graph, and report idempotently."""
    settings = get_settings()
    manager = DatabaseSessionManager(settings)
    try:
        async with manager.session() as session:
            result = await session.execute(select(Project).where(Project.id == DEMO_PROJECT_ID))
            project = result.scalar_one_or_none()
            if project is None:
                project = Project(
                    id=DEMO_PROJECT_ID,
                    title="Demo Workspace",
                    description="Offline hackathon demo workspace with seeded evidence.",
                    status="active",
                    research_goal=(
                        "Identify evidence-backed biomarkers and mechanisms for fatigue-linked "
                        "heart failure progression without depending on live literature APIs."
                    ),
                    domain="biomedicine",
                    owner_name="DiscoveryOS Demo",
                    project_metadata={
                        "demo": True,
                        "source": "local_seed",
                        "fallback_reason": "OpenAlex/network APIs are optional for the demo.",
                    },
                )
                session.add(project)

            await _seed_papers(session)
            await _seed_graph(session)
            await _seed_report(session)
            await _seed_job(session)
            await session.commit()
    finally:
        await manager.dispose()


async def _seed_papers(session) -> None:
    """Purpose: Seed demo papers as Evidence rows."""
    papers = [
        {
            "claim": "NT-proBNP elevation is associated with worsening heart failure risk.",
            "source_title": "Demo Papers: Natriuretic Peptides in Heart Failure",
            "citation": "DiscoveryOS offline fixture, 2026.",
            "evidence_type": "paper",
            "strength": "strong",
            "metadata": {"paper_id": "demo-paper-001", "topic": "biomarker"},
        },
        {
            "claim": "Inflammatory signaling can amplify myocardial stress responses.",
            "source_title": "Demo Papers: Inflammation and Cardiac Remodeling",
            "citation": "DiscoveryOS offline fixture, 2026.",
            "evidence_type": "paper",
            "strength": "moderate",
            "metadata": {"paper_id": "demo-paper-002", "topic": "mechanism"},
        },
        {
            "claim": "Wearable fatigue signals may reveal decompensation before hospitalization.",
            "source_title": "Demo Papers: Remote Monitoring Signals",
            "citation": "DiscoveryOS offline fixture, 2026.",
            "evidence_type": "paper",
            "strength": "moderate",
            "metadata": {"paper_id": "demo-paper-003", "topic": "digital_biomarker"},
        },
        {
            "claim": "Contradictory cohort findings require stratification by renal function.",
            "source_title": "Demo Papers: Biomarker Confounding in HF Cohorts",
            "citation": "DiscoveryOS offline fixture, 2026.",
            "evidence_type": "paper",
            "strength": "mixed",
            "metadata": {"paper_id": "demo-paper-004", "topic": "contradiction"},
        },
    ]
    for paper in papers:
        exists = await session.execute(
            select(Evidence).where(
                Evidence.project_id == DEMO_PROJECT_ID,
                Evidence.claim == paper["claim"],
            )
        )
        if exists.scalar_one_or_none() is None:
            metadata = paper.pop("metadata")
            session.add(
                Evidence(
                    project_id=DEMO_PROJECT_ID,
                    evidence_metadata=metadata,
                    **paper,
                )
            )


async def _seed_graph(session) -> None:
    """Purpose: Seed the demo knowledge graph snapshot."""
    exists = await session.execute(
        select(KnowledgeGraphSnapshot).where(
            KnowledgeGraphSnapshot.project_id == DEMO_PROJECT_ID,
            KnowledgeGraphSnapshot.name == "Demo Graph",
        )
    )
    if exists.scalar_one_or_none() is not None:
        return

    session.add(
        KnowledgeGraphSnapshot(
            project_id=DEMO_PROJECT_ID,
            name="Demo Graph",
            nodes=[
                {"id": "fatigue", "label": "Fatigue signal", "type": "phenotype"},
                {"id": "ntprobnp", "label": "NT-proBNP", "type": "biomarker"},
                {"id": "inflammation", "label": "Inflammation", "type": "mechanism"},
                {"id": "renal", "label": "Renal function", "type": "confounder"},
                {"id": "hf", "label": "Heart failure progression", "type": "outcome"},
            ],
            edges=[
                {"source": "ntprobnp", "target": "hf", "label": "predicts"},
                {"source": "inflammation", "target": "hf", "label": "amplifies"},
                {"source": "fatigue", "target": "hf", "label": "early_signal"},
                {"source": "renal", "target": "ntprobnp", "label": "confounds"},
            ],
            graph_metadata={"demo": True, "papers": 4, "generated_offline": True},
        )
    )


async def _seed_report(session) -> None:
    """Purpose: Seed the demo report and supporting timeline."""
    note_exists = await session.execute(
        select(ResearchNote).where(
            ResearchNote.project_id == DEMO_PROJECT_ID,
            ResearchNote.title == "Demo Report",
        )
    )
    if note_exists.scalar_one_or_none() is None:
        session.add(
            ResearchNote(
                project_id=DEMO_PROJECT_ID,
                title="Demo Report",
                content=(
                    "DiscoveryOS found a demo-ready evidence trail connecting fatigue signals, "
                    "NT-proBNP, inflammatory stress, and heart failure progression. The key "
                    "demo takeaway is that renal-function stratification should be explicit "
                    "before presenting biomarker novelty."
                ),
                tags=["demo", "report", "offline"],
            )
        )

    hypothesis_exists = await session.execute(
        select(Hypothesis).where(
            Hypothesis.project_id == DEMO_PROJECT_ID,
            Hypothesis.statement.like("%fatigue signal%NT-proBNP%"),
        )
    )
    if hypothesis_exists.scalar_one_or_none() is None:
        session.add(
            Hypothesis(
                project_id=DEMO_PROJECT_ID,
                statement=(
                    "A combined fatigue signal and NT-proBNP trajectory may improve short-term "
                    "heart failure risk prediction when stratified by renal function."
                ),
                rationale="Seeded from demo papers and graph relationships.",
                status="ready_for_review",
                confidence=0.82,
                hypothesis_metadata={"demo": True, "novelty_score": 0.82},
            )
        )

    event_exists = await session.execute(
        select(TimelineEvent).where(
            TimelineEvent.project_id == DEMO_PROJECT_ID,
            TimelineEvent.title == "Demo Report Ready",
        )
    )
    if event_exists.scalar_one_or_none() is None:
        session.add(
            TimelineEvent(
                project_id=DEMO_PROJECT_ID,
                event_type="report.ready",
                title="Demo Report Ready",
                description="Offline seeded report prepared for the hackathon walkthrough.",
                occurred_at=datetime.now(UTC),
                event_metadata={"demo": True},
            )
        )


async def _seed_job(session) -> None:
    """Purpose: Seed a completed research job visible in API job listings."""
    exists = await session.execute(
        select(ResearchJob).where(
            ResearchJob.project_id == DEMO_PROJECT_ID,
            ResearchJob.current_step == "Demo Report",
        )
    )
    if exists.scalar_one_or_none() is None:
        session.add(
            ResearchJob(
                project_id=DEMO_PROJECT_ID,
                status="completed",
                finished_at=datetime.now(UTC),
                current_step="Demo Report",
                progress=100.0,
                logs=[
                    "Demo Workspace created.",
                    "Demo Papers loaded from local fixtures.",
                    "Demo Graph generated from seeded evidence.",
                    "Demo Report prepared without live APIs.",
                ],
            )
        )


if __name__ == "__main__":
    asyncio.run(seed_demo())
