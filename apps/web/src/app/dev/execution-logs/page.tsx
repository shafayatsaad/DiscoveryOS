// Purpose: Protect and render the developer-only execution log viewer.

import { notFound } from "next/navigation";

import { ExecutionLogViewer } from "@/features/execution-logs/components/execution-log-viewer";

export const dynamic = "force-dynamic";

export default function ExecutionLogsRoute() {
  const enabled =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_DEVELOPER_MODE === "true";

  if (!enabled) {
    notFound();
  }

  return <ExecutionLogViewer />;
}
