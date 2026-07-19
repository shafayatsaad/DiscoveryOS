# MCP

## Overview

MCP, the Model Context Protocol, is a key part of the DiscoveryOS vision. It allows agents to interact with external tools and data sources through controlled interfaces rather than relying only on free-form model output.

DiscoveryOS should use MCP to make research workflows tool-aware, inspectable, and extensible.

## Why MCP Matters

Scientific discovery requires access to many systems:

- Literature databases
- Document repositories
- Citation managers
- Datasets
- Laboratory tools
- Collaboration platforms
- Internal knowledge bases
- Cloud storage
- Analysis services

Without a tool protocol, agents either cannot access these systems or must rely on brittle custom integrations. MCP provides a standard pattern for connecting agents to external capabilities.

## MCP Role in DiscoveryOS

MCP should serve as the boundary between agent reasoning and external action.

Agents may use MCP to:

- Search for literature
- Retrieve paper metadata
- Access documents
- Query datasets
- Save artifacts
- Load prior project knowledge
- Interact with collaboration tools
- Trigger analysis jobs
- Fetch external context

The system should log MCP calls as part of the research audit trail.

## Tool-Use Philosophy

DiscoveryOS should treat tool use as first-class scientific activity. A generated answer is not enough. The system should show:

- Which tool was called
- What query was used
- What result was returned
- Which agent requested the call
- How the result influenced downstream reasoning

This creates trust and enables reproducibility.

## MCP in the Hackathon Prototype

For the hackathon, MCP usage can focus on a small but meaningful set of interactions:

- Literature or document retrieval
- Source metadata lookup
- Structured artifact storage
- Optional collaboration or workspace integration

The goal is not to integrate every possible tool. The goal is to demonstrate that DiscoveryOS is built for tool-connected research workflows from the beginning.

## Example MCP-Enabled Flow

```text
Planner Agent
  -> requests literature search strategy

Literature Retrieval Agent
  -> calls search tool through MCP
  -> receives source metadata
  -> stores retrieval results

Evidence Extraction Agent
  -> accesses source text where available
  -> extracts claims
  -> links evidence to source IDs

Report Generator
  -> references logged source metadata
  -> includes citations and evidence trace
```

## Security and Trust

MCP integrations should be designed with least privilege:

- Agents should only access tools required for the task.
- Sensitive data should be handled according to project and user permissions.
- Tool calls should be logged.
- Destructive tool actions should require explicit approval in production.
- External results should be validated before use.

## Extensibility

DiscoveryOS should support new MCP servers over time. Possible future integrations include:

- PubMed or scholarly search providers
- arXiv or preprint services
- Semantic Scholar-style metadata sources
- Institutional document stores
- Google Drive or Box
- Notion or Slack for collaboration
- GitHub for research code
- Lab notebook systems
- Dataset registries

## MCP and Agent Boundaries

Not every agent needs direct access to every tool. A safer pattern is to define tool permissions by agent role.

Example:

| Agent | Likely Tool Access |
| --- | --- |
| Planner | Project memory, tool inventory |
| Literature Retrieval | Search and metadata tools |
| Evidence Extraction | Document access tools |
| Knowledge Graph | Stored evidence and graph artifacts |
| ML | Dataset and artifact storage |
| Report Generator | Evidence store and report export |

## Audit Trail

Every tool call should be associated with:

- Project ID
- Workflow run ID
- Agent name
- Tool name
- Input parameters
- Output summary
- Timestamp
- Status
- Error details when applicable

This audit trail supports reproducibility, debugging, and trust.

