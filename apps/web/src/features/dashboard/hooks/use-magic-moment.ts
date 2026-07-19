"use client";

// Purpose: Expose Magic Moment mock data through TanStack Query for future API replacement.

import { useQuery } from "@tanstack/react-query";

import {
  magicMomentResults,
  magicPipelineSteps,
} from "@/features/dashboard/data/dashboard-content";

export function useMagicMoment() {
  return useQuery({
    queryKey: ["magic-moment-demo"],
    queryFn: async () => ({
      steps: magicPipelineSteps,
      results: magicMomentResults,
    }),
  });
}
