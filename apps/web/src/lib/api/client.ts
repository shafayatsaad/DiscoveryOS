// Purpose: Provide typed API client for the DiscoveryOS backend with retry support.
// Retries are applied to transient failures (network blips, 503s) to keep the pipeline
// responsive without crashing the application.

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

// ---------------------------------------------------------------------------
// Retry helper
// ---------------------------------------------------------------------------

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  baseDelayMs = 500,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      // Don't retry client errors (4xx) — they're the caller's fault
      if (!response.ok && response.status < 500) {
        return response;
      }
      // Retry server errors (5xx) and successful responses are returned as-is
      if (response.ok) {
        return response;
      }
      // 5xx — retry after backoff
      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }

    if (attempt < maxRetries - 1) {
      const delay = baseDelayMs * Math.pow(2, attempt);
      console.warn(
        `[API] Request to ${url} failed (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`,
        lastError,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw (
    lastError ??
    new Error(`Request to ${url} failed after ${maxRetries} retries.`)
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function startPipeline(
  projectId: string,
  query: string,
  domain?: string,
): Promise<PipelineStartResponse> {
  const response = await fetchWithRetry(
    `${API_BASE}/projects/${projectId}/run`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, domain }),
    },
    3,
    500,
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Pipeline start failed (${response.status}): ${errorText}`);
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
    } catch (parseErr) {
      // Malformed events (e.g. keepalive comments) are expected — log at debug level
      console.warn("[API] Malformed SSE event received:", event.data, parseErr);
    }
  };

  eventSource.onerror = (event: Event) => {
    console.warn("[API] SSE connection error for project:", projectId, event);
    onError?.(event);
    // EventSource auto-reconnects by default
  };

  // EventSource doesn't have a native onclose, but we can detect via readyState
  const checkClosed = setInterval(() => {
    if (eventSource.readyState === EventSource.CLOSED) {
      clearInterval(checkClosed);
      console.info("[API] SSE connection closed for project:", projectId);
      onClose?.();
    }
  }, 1000);

  return eventSource;
}
