# Frontend

## Overview

The DiscoveryOS frontend is a research workspace, not a chatbot interface. It should help researchers understand an autonomous scientific workflow as it unfolds.

The planned stack is:

- Next.js
- React
- TypeScript
- Tailwind CSS

## Frontend Product Goals

The interface should make DiscoveryOS feel like a scientific operating system:

- Persistent research projects
- Visible workflow progress
- Inspectable agent outputs
- Evidence-backed claims
- Interactive knowledge graph
- ML insight summaries
- Hypothesis review
- Critic feedback
- Novelty scores
- Experiment plans
- Report generation

The UI should be clear, serious, and efficient. It should avoid feeling like a marketing page or generic chat app.

## Primary Screens

### Project Dashboard

Purpose:

Show all research projects and their current state.

Key elements:

- Project list
- Status indicators
- Last updated time
- Domain labels
- Quick access to active workflows

### Research Goal Intake

Purpose:

Allow a researcher to create a new project from a research goal.

Key elements:

- Goal input
- Optional domain
- Optional constraints
- Start workflow action

The intake should feel more like creating a research project than sending a chat message.

### Workflow Timeline

Purpose:

Show the status of each agent and workflow stage.

Key elements:

- Agent sequence
- Step status
- Current active step
- Completed outputs
- Errors or review states

### Evidence Explorer

Purpose:

Let users inspect retrieved sources and extracted evidence.

Key elements:

- Source list
- Evidence records
- Claim text
- Source metadata
- Confidence indicators
- Contradiction flags
- Filters by entity, source, method, or claim type

### Knowledge Graph View

Purpose:

Visualize scientific relationships.

Key elements:

- Nodes for entities, papers, claims, hypotheses, and methods
- Edges for support, contradiction, association, and provenance
- Search and filtering
- Node detail panel
- Evidence references

### ML Insights View

Purpose:

Show machine learning outputs in an interpretable way.

Key elements:

- Feature summaries
- Cluster views
- Ranking tables
- Novelty signals
- Model metadata
- Confidence notes

### Hypothesis Review

Purpose:

Help researchers evaluate generated hypotheses.

Key elements:

- Hypothesis cards or table
- Supporting evidence
- Contradictory evidence
- Mechanism explanation
- Testable predictions
- Critic notes
- Novelty score
- User decision controls

### Experiment Plan View

Purpose:

Present proposed experiments for selected hypotheses.

Key elements:

- Objective
- Method summary
- Controls
- Expected outcomes
- Risks
- Required data or materials
- Evidence linkage

### Research Report View

Purpose:

Present the final evidence-backed report.

Key elements:

- Executive summary
- Methods
- Evidence review
- Graph insights
- ML insights
- Hypotheses
- Limitations
- Experiment recommendations
- References

## Information Architecture

Suggested route structure:

```text
/
/projects
/projects/new
/projects/[projectId]
/projects/[projectId]/workflow
/projects/[projectId]/evidence
/projects/[projectId]/graph
/projects/[projectId]/ml
/projects/[projectId]/hypotheses
/projects/[projectId]/experiments
/projects/[projectId]/report
```

## Frontend State

The frontend should treat the backend as the source of truth. Local state should be used for:

- UI filters
- Selected graph node
- Expanded panels
- Temporary form input
- Optimistic progress only when safe

Workflow status should come from backend endpoints or real-time updates in a future version.

## Design Direction

DiscoveryOS should look like professional scientific software:

- Dense but readable layouts
- Clear data tables
- Subtle status indicators
- Minimal decorative UI
- Strong hierarchy
- Graph and evidence views as core surfaces
- No generic chatbot-first composition

## Accessibility

The frontend should prioritize:

- Keyboard navigation
- Color contrast
- Clear focus states
- Meaningful labels
- Non-color-only status indicators
- Responsive layouts

## Hackathon UI Priorities

The hackathon frontend should prioritize:

1. Research goal creation
2. Workflow progress
3. Evidence explorer
4. Knowledge graph visualization
5. Hypothesis review
6. Final report

These screens are enough to demonstrate the core product concept.

