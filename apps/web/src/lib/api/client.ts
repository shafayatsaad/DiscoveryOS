// Purpose: Provide typed API client for the DiscoveryOS backend with retry support.
// Retries are applied to transient failures so the pipeline can recover from
// short network blips without crashing the application.

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

export type PipelineSubscription = {
  close: () => void;
  readonly readyState: number;
};

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

      if (!response.ok && response.status < 500) {
        return response;
      }

      if (response.ok) {
        return response;
      }

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
): PipelineSubscription {
  const url = `${API_BASE}/projects/${projectId}/stream`;
  const eventSource = new EventSource(url);
  let closed = false;

  eventSource.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data) as PipelineEvent;
      onEvent(data);
    } catch (parseErr) {
      console.warn("[API] Malformed SSE event received:", event.data, parseErr);
    }
  };

  eventSource.onerror = (event: Event) => {
    console.warn("[API] SSE connection error for project:", projectId, event);
    onError?.(event);
  };

  const notifyClosed = () => {
    if (closed) {
      return;
    }

    closed = true;
    console.info("[API] SSE connection closed for project:", projectId);
    onClose?.();
  };

  const checkClosed = setInterval(() => {
    if (eventSource.readyState === EventSource.CLOSED) {
      clearInterval(checkClosed);
      notifyClosed();
    }
  }, 1000);

  return {
    close: () => {
      clearInterval(checkClosed);
      eventSource.close();
      notifyClosed();
    },
    get readyState() {
      return eventSource.readyState;
    },
  };
}
