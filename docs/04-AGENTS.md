# Agents

## Overview

DiscoveryOS uses specialized agents to transform a research goal into a scientific workflow. Each agent owns one major responsibility and exchanges structured data with the rest of the system.

The purpose of the agent layer is not to create the illusion of many personalities. It is to decompose scientific reasoning into auditable stages.

## Agent Design Principles

### Narrow Responsibility

Each agent should have a clear job. For example, the Evidence Extraction Agent extracts claims and evidence; it should not also design experiments or write the final report.

### Structured Outputs

Agents should return typed, validated objects whenever possible. Structured outputs make the workflow testable and reduce ambiguity.

### Evidence Preservation

Any agent that uses source material must preserve references to the source. Evidence lineage is a core product feature.

### Inspectability

Agent results should be visible to users and developers. Researchers should understand why the system reached a conclusion.

### Replaceability

Agents should be replaceable. A future version may use a stronger prompt, a different model, a domain-specific extractor, or a deterministic method without rewriting the entire system.

## Core Agent Workflow

```text
Planner
  -> Literature Retrieval
  -> Evidence Extraction
  -> Knowledge Graph
  -> Machine Learning
  -> Hypothesis Generator
  -> Critic
  -> Novelty Detection
  -> Experiment Design
  -> Report Generator
```

## Planner Agent

Purpose:

Convert a researcher's goal into a structured investigation plan.

Inputs:

- Research goal
- Optional domain
- Optional constraints
- Available tools
- Project context

Outputs:

- Research questions
- Search strategy
- Evidence requirements
- Candidate entities
- Expected workflow steps
- Success criteria

Key behavior:

- Decompose vague goals into actionable subquestions.
- Identify what evidence would be needed.
- Define what the system should retrieve and analyze.
- Avoid claiming conclusions before evidence is gathered.

## Literature Retrieval Agent

Purpose:

Find relevant scientific sources for the research plan.

Inputs:

- Search strategy
- Research questions
- Domain terms
- Inclusion and exclusion criteria

Outputs:

- Search queries
- Retrieved paper metadata
- Source ranking
- Retrieval notes

Key behavior:

- Use available retrieval tools through controlled interfaces.
- Prefer reliable scientific sources.
- Preserve source metadata.
- Record why sources were included or excluded.

## Evidence Extraction Agent

Purpose:

Extract structured evidence from retrieved sources.

Inputs:

- Paper metadata
- Abstracts or full text when available
- Research questions
- Extraction schema

Outputs:

- Claims
- Findings
- Methods
- Populations or datasets
- Effect directions
- Limitations
- Evidence strength notes
- Source references

Key behavior:

- Distinguish claims from evidence.
- Preserve provenance.
- Extract uncertainty and limitations.
- Avoid overstating conclusions.

## Knowledge Graph Agent

Purpose:

Convert extracted evidence into a graph of scientific relationships.

Inputs:

- Evidence objects
- Entities
- Claims
- Hypotheses

Outputs:

- Graph nodes
- Graph edges
- Relationship types
- Graph metrics
- Visualization-ready graph data

Key behavior:

- Represent papers, claims, biological entities, methods, datasets, and hypotheses.
- Mark support and contradiction edges.
- Preserve evidence references on graph edges.
- Produce data usable by NetworkX and the frontend.

## Machine Learning Agent

Purpose:

Run lightweight ML analysis to surface patterns and quantitative signals.

Inputs:

- Extracted features
- Structured evidence
- Graph-derived features
- Optional user datasets

Outputs:

- Feature summaries
- Model results
- Rankings
- Clusters
- Novelty signals
- Confidence notes

Key behavior:

- Use scikit-learn and XGBoost for interpretable, hackathon-feasible workflows.
- Record model configuration and metrics.
- Explain outputs as signals, not final truth.
- Avoid unsupported causal claims.

## Hypothesis Generator

Purpose:

Generate candidate hypotheses based on the evidence, graph, and ML signals.

Inputs:

- Research goal
- Evidence summaries
- Knowledge graph
- ML outputs
- Contradictions and gaps

Outputs:

- Candidate hypotheses
- Supporting evidence
- Required assumptions
- Expected mechanisms
- Testable predictions

Key behavior:

- Produce testable hypotheses.
- Link each hypothesis to evidence and graph relationships.
- Identify why the hypothesis may be interesting.
- Avoid generic or non-falsifiable statements.

## Critic Agent

Purpose:

Challenge candidate hypotheses before they are presented as strong findings.

Inputs:

- Candidate hypotheses
- Evidence objects
- Knowledge graph
- ML outputs

Outputs:

- Weaknesses
- Contradictions
- Missing evidence
- Bias risks
- Alternative explanations
- Revision recommendations

Key behavior:

- Act like a skeptical reviewer.
- Surface uncertainty clearly.
- Identify overclaims.
- Improve scientific quality before report generation.

## Novelty Detection Agent

Purpose:

Estimate whether a hypothesis appears novel relative to retrieved evidence.

Inputs:

- Candidate hypotheses
- Literature corpus
- Semantic search results
- Knowledge graph

Outputs:

- Novelty score
- Similar prior work
- Known mechanisms
- Potentially new combinations
- Confidence level

Key behavior:

- Distinguish "not found in current corpus" from "novel."
- Compare hypotheses against retrieved evidence.
- Identify whether novelty comes from an entity, mechanism, population, method, or combination.
- Flag low-confidence novelty claims.

## Experiment Design Agent

Purpose:

Convert promising hypotheses into validation plans.

Inputs:

- Refined hypotheses
- Critic feedback
- Evidence strength
- Domain constraints

Outputs:

- Experiment proposals
- Required materials or datasets
- Methods
- Controls
- Expected outcomes
- Failure modes
- Ethical or safety considerations

Key behavior:

- Make hypotheses testable.
- Recommend appropriate controls.
- Surface limitations.
- Avoid unsafe or unsupported operational detail in sensitive domains.

## Research Report Generator

Purpose:

Produce a clear, evidence-backed research report.

Inputs:

- Research goal
- Workflow history
- Evidence objects
- Knowledge graph summary
- ML outputs
- Hypotheses
- Critiques
- Novelty analysis
- Experiment plans

Outputs:

- Executive summary
- Methodology
- Evidence review
- Knowledge graph findings
- ML insights
- Hypotheses
- Critique and limitations
- Experiment recommendations
- References

Key behavior:

- Write from structured evidence.
- Show uncertainty and limitations.
- Include provenance.
- Avoid unsupported conclusions.

## Agent Evaluation

Agents should be evaluated on:

- Schema validity
- Evidence traceability
- Factual consistency
- Usefulness to downstream agents
- Handling of uncertainty
- Reproducibility
- Human reviewer usefulness

