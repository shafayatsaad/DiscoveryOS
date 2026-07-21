"use client";

// Purpose: Subscribe to real-time pipeline SSE events with reconnection support.
// Reconnection attempts are capped at 10. After that, the user sees a
// persistent "disconnected" state instead of silently retrying forever.

import { useCallback, useEffect, useRef, useState } from "react";

import type { PipelineEvent, PipelineSubscription } from "@/lib/api/client";
import { subscribeToPipeline } from "@/lib/api/client";

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "completed"
  | "failed"
  | "reconnect_exhausted";

export type UsePipelineStreamOptions = {
  projectId: string | null;
  onEvent?: (event: PipelineEvent) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
  maxReconnectAttempts?: number;
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
  isReconnectExhausted: boolean;
  reconnectAttempts: number;
  disconnect: () => void;
};

export function usePipelineStream({
  projectId,
  onEvent,
  onComplete,
  onError,
  maxReconnectAttempts = 10,
}: UsePipelineStreamOptions): UsePipelineStreamReturn {
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [latestEvent, setLatestEvent] = useState<PipelineEvent | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState<PipelineEvent["metadata"] | null>(
    null,
  );
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const statusRef = useRef<ConnectionStatus>("disconnected");
  const eventSourceRef = useRef<PipelineSubscription | null>(null);
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

    // If we've exhausted reconnection attempts, give up permanently
    if (reconnectAttemptRef.current >= maxReconnectAttempts) {
      updateStatus("reconnect_exhausted");
      return;
    }

    updateStatus("connecting");
    setReconnectAttempts(reconnectAttemptRef.current);
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
          setReconnectAttempts(0);
        }
      },
      () => {
        // On error, attempt reconnection with exponential backoff
        if (
          statusRef.current !== "completed" &&
          statusRef.current !== "failed" &&
          statusRef.current !== "reconnect_exhausted"
        ) {
          reconnectAttemptRef.current += 1;
          setReconnectAttempts(reconnectAttemptRef.current);

          if (reconnectAttemptRef.current >= maxReconnectAttempts) {
            eventSourceRef.current?.close();
            eventSourceRef.current = null;
            updateStatus("reconnect_exhausted");
            return;
          }

          eventSourceRef.current?.close();
          eventSourceRef.current = null;
          updateStatus("connecting");
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttemptRef.current),
            maxReconnectDelay,
          );
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      },
      () => {
        if (
          statusRef.current !== "completed" &&
          statusRef.current !== "failed" &&
          statusRef.current !== "reconnect_exhausted"
        ) {
          updateStatus("disconnected");
        }
      },
    );
  }, [
    projectId,
    onEvent,
    onComplete,
    onError,
    updateStatus,
    maxReconnectAttempts,
  ]);

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
    isReconnectExhausted: status === "reconnect_exhausted",
    reconnectAttempts,
    disconnect,
  };
}
