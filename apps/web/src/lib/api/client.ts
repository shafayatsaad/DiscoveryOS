// Purpose: Provide typed API client for the DiscoveryOS backend.

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export type PipelineStartResponse = {
  run_id: string;
  project_id: string;
  status: string;
  progress: number;
  current_stage: string | null;
};

export type PipelineEvent = {
  event_type: string;
  stage: string | null;
  progress: number;
  message: string;
  timestamp: string | null;
  metadata: {
    papers_count: number;
    evidence_count: number;
    contradictions_count: number;
    novelty_score: number | null;
    current_agent: string | null;
    execution_time_ms: number;
    stages: Record<string, { status: string; label: string }>;
  };
};

export async function startPipeline(
  projectId: string,
  query: string,
  domain?: string,
): Promise<PipelineStartResponse> {
  const response = await fetch(`${API_BASE}/projects/${projectId}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, domain }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pipeline start failed: ${response.status} ${error}`);
  }

  return response.json();
}

export function subscribeToPipeline(
  projectId: string,
  onEvent: (event: PipelineEvent) => void,
  onError?: (error: Event) => void,
  onClose?: () => void,
): EventSource {
  const url = `${API_BASE}/projects/${projectId}/stream`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data) as PipelineEvent;
      onEvent(data);
    } catch {
      // Ignore malformed events (e.g. keepalive comments)
    }
  };

  eventSource.onerror = (event: Event) => {
    onError?.(event);
    // EventSource auto-reconnects by default
  };

  // EventSource doesn't have a native onclose, but we can detect via readyState
  const checkClosed = setInterval(() => {
    if (eventSource.readyState === EventSource.CLOSED) {
      clearInterval(checkClosed);
      onClose?.();
    }
  }, 1000);

  return eventSource;
}
