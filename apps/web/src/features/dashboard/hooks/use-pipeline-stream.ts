"use client";

// Purpose: Subscribe to real-time pipeline SSE events with reconnection support.

import { useCallback, useEffect, useRef, useState } from "react";

import type { PipelineEvent } from "@/lib/api/client";
import { subscribeToPipeline } from "@/lib/api/client";

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "completed"
  | "failed";

export type UsePipelineStreamOptions = {
  projectId: string | null;
  onEvent?: (event: PipelineEvent) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
};

export type UsePipelineStreamReturn = {
  events: PipelineEvent[];
  latestEvent: PipelineEvent | null;
  status: ConnectionStatus;
  progress: number;
  metadata: PipelineEvent["metadata"] | null;
  isConnected: boolean;
  isComplete: boolean;
  isFailed: boolean;
  disconnect: () => void;
};

export function usePipelineStream({
  projectId,
  onEvent,
  onComplete,
  onError,
}: UsePipelineStreamOptions): UsePipelineStreamReturn {
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [latestEvent, setLatestEvent] = useState<PipelineEvent | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState<PipelineEvent["metadata"] | null>(
    null,
  );
  const statusRef = useRef<ConnectionStatus>("disconnected");
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const reconnectAttemptRef = useRef(0);
  const maxReconnectDelay = 30000;

  const updateStatus = useCallback((newStatus: ConnectionStatus) => {
    statusRef.current = newStatus;
    setStatus(newStatus);
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    updateStatus("disconnected");
  }, [updateStatus]);

  const connect = useCallback(() => {
    if (!projectId) return;

    updateStatus("connecting");
    eventSourceRef.current = subscribeToPipeline(
      projectId,
      (event) => {
        setEvents((prev) => [...prev, event]);
        setLatestEvent(event);
        setProgress(event.progress);
        setMetadata(event.metadata);
        onEvent?.(event);

        if (event.event_type === "pipeline.completed") {
          updateStatus("completed");
          eventSourceRef.current?.close();
          onComplete?.();
        } else if (event.event_type === "pipeline.failed") {
          updateStatus("failed");
          eventSourceRef.current?.close();
          onError?.(event.message);
        } else {
          updateStatus("connected");
          reconnectAttemptRef.current = 0;
        }
      },
      () => {
        // On error, attempt reconnection with exponential backoff
        if (
          statusRef.current !== "completed" &&
          statusRef.current !== "failed"
        ) {
          updateStatus("connecting");
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttemptRef.current),
            maxReconnectDelay,
          );
          reconnectAttemptRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      },
      () => {
        if (
          statusRef.current !== "completed" &&
          statusRef.current !== "failed"
        ) {
          updateStatus("disconnected");
        }
      },
    );
  }, [projectId, onEvent, onComplete, onError, updateStatus]);

  useEffect(() => {
    if (projectId) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [projectId, connect, disconnect]);

  return {
    events,
    latestEvent,
    status,
    progress,
    metadata,
    isConnected: status === "connected",
    isComplete: status === "completed",
    isFailed: status === "failed",
    disconnect,
  };
}
