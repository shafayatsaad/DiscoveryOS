# DiscoveryOS Prompt Inventory

Purpose: document every OpenAI-facing prompt asset and the contract each agent must follow.

## Shared Rules

- System prompts define role, evidence limits, schema boundaries, and hallucination rules.
- Task prompts provide only the current request payload.
- Outputs must match each Pydantic schema exactly.
- Citations and references must come only from supplied metadata, abstracts, or workspace artifacts.
- Reasoning fields should be concise and evidence-bound.
- Agents should return empty or low-confidence outputs when evidence is insufficient.

## Prompts

| Agent | Version | System Prompt | Task Template | Citation Policy | Token Policy |
| --- | --- | --- | --- | --- | --- |
| Planner | `planner.v3` | `backend/app/agents/planner/prompts.py::PLANNER_SYSTEM_PROMPT` | `PLANNER_TASK_PROMPT_TEMPLATE` | No citations expected; must not fabricate literature metadata. | Compact lists, no research answer. |
| Extractor | `extractor.v3` | `backend/app/agents/extractor/prompts.py::EXTRACTOR_SYSTEM_PROMPT` | `EXTRACTOR_TASK_PROMPT_TEMPLATE` | Claims and snippets must be grounded in supplied paper metadata and abstract. | Short evidence-bearing lists, no free-form summary. |
| Contradiction | `contradiction.v3` | `backend/app/agents/contradiction/prompts.py::CONTRADICTION_SYSTEM_PROMPT` | `CONTRADICTION_TASK_PROMPT_TEMPLATE` | Each contradiction requires at least two supplied supporting papers. | Brief statements and notes; return empty when uncertain. |
| Novelty | `novelty.v3` | `backend/app/agents/novelty/prompts.py::NOVELTY_SYSTEM_PROMPT` | `NOVELTY_TASK_PROMPT_TEMPLATE` | Related work must use supplied retrieved papers only. | Short reasoning and bounded related-work lists. |
| Experiment | `experiment.v3` | `backend/app/agents/experiment/prompts.py::EXPERIMENT_SYSTEM_PROMPT` | `EXPERIMENT_TASK_PROMPT_TEMPLATE` | Evidence links must use supplied DOI, title, or reference strings only. | Concise experiment fields, no lab protocol narrative. |
| Report | `report.v3` | `backend/app/agents/report/prompts.py::REPORT_SYSTEM_PROMPT` | `REPORT_TASK_PROMPT_TEMPLATE` | References and evidence cards must use supplied provenance only. | Compact paper language and no duplicated unsupported narrative. |

## Maintenance

- Update this inventory whenever a prompt version changes.
- Keep schema details in Pydantic models; prompts should summarize behavior rather than duplicate every field.
- Prefer narrower task payloads when a future agent can safely omit unused workspace artifacts.
