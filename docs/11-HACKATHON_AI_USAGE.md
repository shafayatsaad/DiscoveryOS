# Hackathon AI Usage

## Overview

DiscoveryOS is both built with AI assistance and designed to showcase AI-native scientific workflows. This document explains how AI is used in the project in a submission-ready format.

## Project Use of OpenAI

DiscoveryOS uses OpenAI models as the reasoning and language layer of a broader scientific operating system. The system does not rely on an LLM alone. It combines LLM reasoning with databases, graph algorithms, machine learning, and tool integrations.

Planned OpenAI usage includes:

- Research planning
- Agent reasoning
- Structured evidence extraction
- Hypothesis generation
- Critical review
- Novelty explanation
- Experiment design
- Research report generation
- Tool-aware workflows through MCP

## Responses API Role

The OpenAI Responses API is intended to power agent interactions. Each agent can use model reasoning with structured outputs so downstream systems can validate and store results.

Examples:

- The Planner Agent returns a structured research plan.
- The Evidence Extraction Agent returns claims, methods, entities, and limitations.
- The Hypothesis Generator returns hypotheses with supporting evidence IDs.
- The Critic Agent returns weaknesses, contradictions, and missing evidence.
- The Report Generator turns structured workflow outputs into a readable report.

## Structured Outputs

DiscoveryOS should use structured outputs whenever possible. This matters because scientific workflows require reliable handoffs between components.

Benefits:

- Easier validation
- Better testing
- Lower ambiguity
- Persistent storage
- Clear agent contracts
- More reliable frontend rendering

## MCP Usage

MCP is used to connect agents with external tools and data sources. Instead of asking an LLM to imagine research context, DiscoveryOS should let agents call tools that retrieve or inspect actual information.

MCP can support:

- Literature retrieval
- Document access
- External knowledge sources
- Artifact storage
- Collaboration tools
- Future lab or dataset integrations

## Human-AI Collaboration

DiscoveryOS is designed for human oversight. The system should not present generated hypotheses as confirmed scientific truths.

The researcher remains responsible for:

- Reviewing evidence
- Evaluating scientific plausibility
- Approving hypotheses
- Assessing safety and ethics
- Designing real-world studies
- Interpreting final outputs

AI assists by organizing and accelerating the workflow.

## Responsible AI Considerations

Scientific AI systems require extra caution. DiscoveryOS should:

- Preserve source links.
- Show uncertainty.
- Distinguish evidence from speculation.
- Flag contradictions.
- Avoid unsupported conclusions.
- Avoid presenting novelty as certainty.
- Avoid unsafe operational guidance in sensitive domains.
- Keep humans in the review loop.

## AI-Assisted Development

The project documentation, planning, and implementation may be created with assistance from AI coding tools. AI assistance should be used to accelerate:

- Architecture design
- Documentation drafting
- Schema planning
- Boilerplate generation
- Test planning
- Demo preparation

Human judgment should guide product decisions, review generated code, and validate scientific claims.

## Hackathon Demo Narrative

The demo should emphasize that DiscoveryOS is:

- Not another chatbot
- A persistent research workspace
- A multi-agent scientific workflow
- Evidence-backed
- Tool-connected through MCP
- Graph-aware
- ML-assisted
- Designed for reproducibility

The strongest demo moment is when a judge can trace a generated hypothesis back through critique, evidence, graph relationships, source records, and the original research goal.

## Submission Summary

DiscoveryOS uses OpenAI to coordinate scientific reasoning while preserving transparent evidence chains. The project demonstrates how LLMs can operate inside a structured research system rather than as isolated conversational agents.

