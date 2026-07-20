// Purpose: Store developer-mode execution log examples for frontend inspection.

export type ExecutionLogStatus = "success" | "running" | "failed" | "retrying";

export type ExecutionLogEntry = {
  id: string;
  agent: string;
  status: ExecutionLogStatus;
  prompt: string;
  tokenUsage: {
    input: number;
    output: number;
  };
  executionTimeMs: number;
  retries: number;
  errors: string[];
  mcpCalls: {
    server: string;
    tool: string;
    durationMs: number;
    status: ExecutionLogStatus;
  }[];
  timeline: {
    time: string;
    label: string;
    status: ExecutionLogStatus;
  }[];
};

export const executionLogs: ExecutionLogEntry[] = [
  {
    id: "run-0091",
    agent: "Extractor",
    status: "success",
    prompt: "Extract PaperEvidence for supplied polymer electrolyte abstract.",
    tokenUsage: { input: 1840, output: 612 },
    executionTimeMs: 6840,
    retries: 0,
    errors: [],
    mcpCalls: [
      { server: "memory", tool: "write_evidence", durationMs: 91, status: "success" },
      { server: "filesystem", tool: "write_artifact", durationMs: 118, status: "success" },
    ],
    timeline: [
      { time: "10:42:15", label: "Prompt rendered", status: "success" },
      { time: "10:42:18", label: "OpenAI response parsed", status: "success" },
      { time: "10:42:22", label: "Evidence persisted", status: "success" },
    ],
  },
  {
    id: "run-0092",
    agent: "Contradiction",
    status: "retrying",
    prompt: "Detect contradictions from workspace payload with supplied citations only.",
    tokenUsage: { input: 3220, output: 744 },
    executionTimeMs: 11880,
    retries: 1,
    errors: ["Schema validation failed: supporting_papers contained one item."],
    mcpCalls: [
      { server: "memory", tool: "read_evidence", durationMs: 72, status: "success" },
      { server: "memory", tool: "write_contradictions", durationMs: 0, status: "retrying" },
    ],
    timeline: [
      { time: "10:43:01", label: "Prompt rendered", status: "success" },
      { time: "10:43:07", label: "First response rejected", status: "failed" },
      { time: "10:43:12", label: "Retry queued", status: "retrying" },
    ],
  },
  {
    id: "run-0093",
    agent: "Report",
    status: "running",
    prompt: "Generate ScientificReport with TOC, evidence cards, graph snapshot, and references.",
    tokenUsage: { input: 4912, output: 1318 },
    executionTimeMs: 15410,
    retries: 0,
    errors: [],
    mcpCalls: [
      { server: "filesystem", tool: "write_report", durationMs: 0, status: "running" },
    ],
    timeline: [
      { time: "10:44:02", label: "Workspace loaded", status: "success" },
      { time: "10:44:08", label: "Report generation running", status: "running" },
    ],
  },
];
