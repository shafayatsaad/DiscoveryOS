# ML Pipeline

## Overview

DiscoveryOS uses machine learning as a supporting analysis layer. The ML pipeline should help identify patterns, rank evidence, detect clusters, score novelty signals, and provide quantitative support for hypothesis generation.

The ML layer does not replace scientific judgment or LLM reasoning. It provides structured signals that agents and researchers can inspect.

## Goals

The ML pipeline should:

- Convert extracted evidence into features.
- Analyze relationships across papers, entities, methods, and claims.
- Rank candidate hypotheses or evidence items.
- Support novelty estimation.
- Identify clusters of related findings.
- Produce reproducible outputs with metadata.

## Initial Stack

DiscoveryOS uses:

- scikit-learn for preprocessing, clustering, classification, ranking, and interpretable baselines
- XGBoost for stronger tabular modeling where useful
- ChromaDB embeddings for semantic similarity features
- NetworkX graph metrics as graph-derived features

## ML Inputs

Potential inputs include:

- Paper metadata
- Extracted claims
- Entities
- Methods
- Study types
- Evidence strength labels
- Citation or source metadata
- Embedding similarity scores
- Graph centrality metrics
- Contradiction counts
- User-provided datasets

The first hackathon version can use a small subset of these inputs.

## Feature Categories

### Literature Features

- Publication year
- Source type
- Study type
- Sample size when available
- Method names
- Domain keywords
- Citation-like metadata if available

### Evidence Features

- Claim type
- Evidence strength
- Direction of effect
- Limitation count
- Contradiction count
- Number of supporting sources

### Semantic Features

- Similarity between research goal and paper
- Similarity between hypothesis and prior claims
- Cluster membership
- Distance from known evidence clusters

### Graph Features

- Node degree
- Betweenness centrality
- Connected components
- Relationship density
- Support and contradiction edge counts
- Path distance between entities

## Core Pipeline Stages

```text
Data selection
  -> Feature extraction
  -> Feature validation
  -> Model or algorithm execution
  -> Metric calculation
  -> Result interpretation
  -> Artifact persistence
```

## Use Cases

### Evidence Ranking

The system can rank evidence by relevance to a research goal using semantic similarity, source metadata, and extracted evidence strength.

### Literature Clustering

The system can cluster papers or claims to identify themes, methods, and research subareas.

### Hypothesis Scoring

Candidate hypotheses can be scored using:

- Number of supporting claims
- Number of contradictions
- Graph connectivity
- Semantic distance from known work
- Strength of evidence
- Novelty indicators

### Novelty Signals

Novelty should not be treated as a single definitive number. The ML pipeline can provide signals such as:

- Low similarity to known hypotheses
- Unusual combinations of entities
- Sparse graph connections
- Recent but underconnected evidence
- Gaps between related research clusters

### Contradiction Detection Support

ML can help surface potentially contradictory claims by comparing entities, effect directions, populations, methods, and outcomes.

## Model Governance

Every ML run should record:

- Project ID
- Workflow run ID
- Input artifact IDs
- Feature schema version
- Model type
- Model parameters
- Training data summary
- Metrics
- Output artifact path
- Timestamp

This metadata is essential for reproducibility.

## Interpreting ML Outputs

ML outputs should be presented as signals, not conclusions. For example:

- "This hypothesis is semantically distant from retrieved prior work" is acceptable.
- "This hypothesis is definitely novel" is not acceptable.

The frontend and report should communicate uncertainty clearly.

## Hackathon Scope

A practical hackathon ML pipeline may include:

1. Convert extracted evidence into tabular features.
2. Compute semantic similarity scores.
3. Compute graph metrics.
4. Cluster papers or claims.
5. Rank hypotheses using a weighted scoring model or simple XGBoost model.
6. Persist results for the report.

This is enough to show that DiscoveryOS combines LLM reasoning with conventional machine learning.

## Future ML Extensions

Future versions may include:

- Domain-specific biomedical embeddings
- Causal discovery methods
- Active learning for human review
- Weak supervision for claim classification
- Replication likelihood prediction
- Dataset recommendation
- Automated feature extraction from uploaded datasets
- Model cards for research outputs

