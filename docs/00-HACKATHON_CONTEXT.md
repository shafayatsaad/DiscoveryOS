# Hackathon Context

## Overview

DiscoveryOS is an OpenAI hackathon project that demonstrates a new category of AI-native scientific software: an autonomous scientific operating system.

Most AI research tools behave like assistants. A user asks a question, receives an answer, and then manually decides what to do next. DiscoveryOS proposes a different model. A researcher defines a goal, and the system creates a structured investigation that can retrieve literature, extract evidence, build a knowledge graph, run machine learning analysis, generate hypotheses, critique them, evaluate novelty, design experiments, and produce an evidence-backed report.

The hackathon prototype should feel like the beginning of a real company, not a disposable demo. The project is therefore organized around startup-grade principles: modular architecture, durable data models, clear agent responsibilities, transparent evidence chains, and a credible path from demo to product.

## Hackathon Thesis

The central thesis is:

> Scientific discovery should not be trapped inside chat sessions.

Research is iterative, evidence-heavy, collaborative, and long-running. A chatbot can help answer a question, but it is not designed to manage an investigation. DiscoveryOS turns the research process itself into the product.

## What We Are Demonstrating

DiscoveryOS demonstrates how OpenAI models and tool ecosystems can coordinate with traditional software components:

- LLM agents perform planning, evidence extraction, critique, and report generation.
- MCP provides controlled access to external tools and data sources.
- SQLite stores persistent research memory and workflow state.
- ChromaDB stores semantic memory and supports literature retrieval.
- NetworkX represents scientific knowledge as a graph.
- scikit-learn and XGBoost provide machine learning analysis for patterns, ranking, and novelty signals.
- The frontend presents research as a living workspace rather than a chat transcript.

The demo should show that an AI system can move beyond conversation and operate as a structured discovery workflow.

## Target Hackathon Story

The preferred demo story is simple:

1. A researcher enters a research goal.
2. DiscoveryOS creates a plan.
3. Agents retrieve and analyze relevant literature.
4. The system extracts claims and evidence.
5. A knowledge graph appears as the investigation progresses.
6. The system proposes hypotheses.
7. A critic agent identifies weak assumptions and contradictions.
8. The novelty agent estimates whether a hypothesis is already well-known.
9. The experiment design agent proposes concrete validation steps.
10. A final report explains the evidence trail.

The important moment is not that the system produces a polished paragraph. The important moment is that it produces an auditable scientific workflow.

## OpenAI Usage

DiscoveryOS is designed around the OpenAI Responses API for agent reasoning, structured outputs, tool calls, and report generation. It uses OpenAI capabilities where language understanding, synthesis, planning, and reasoning are valuable, while relying on deterministic systems for storage, graphs, and ML.

This combination is deliberate. The project should not pretend that an LLM alone is a complete scientific system. Instead, it shows how an LLM can act as a reasoning layer inside a broader operating system for research.

## Hackathon Constraints

The hackathon version should prioritize a convincing end-to-end vertical slice over broad feature coverage.

In scope:

- One polished research project workflow
- Focused literature retrieval
- Structured evidence extraction
- Simple knowledge graph construction
- Basic ML-assisted scoring or ranking
- Hypothesis generation and critique
- Novelty estimation
- Experiment proposal
- Research report generation

Out of scope for the first demo:

- Full-scale literature monitoring
- Institutional user management
- Production-grade distributed task queues
- Complex laboratory integration
- Regulatory validation
- Peer-review-level automated conclusions

## Evaluation Criteria

DiscoveryOS should be evaluated on:

- Clarity of product idea
- Depth of scientific workflow
- Evidence transparency
- Appropriate use of OpenAI models
- Multi-agent design quality
- Technical credibility
- Demo polish
- Future product potential

## North Star

DiscoveryOS wins if a viewer immediately understands this sentence:

> This is not a chatbot for scientists. This is an operating system for scientific discovery.

