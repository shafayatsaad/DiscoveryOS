"use client";

// Purpose: Expose curated Magic Moment demo data through TanStack Query.

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
