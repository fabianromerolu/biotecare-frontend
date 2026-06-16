"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  createSubphenotypeRun,
  getSubphenotypeRun,
  listSubphenotypeAssignments,
  listSubphenotypeRuns,
} from "@/lib/api/subphenotypes";
import { useAuthStore } from "@/stores/authStore";
import type { SubphenotypeRunCreateInput } from "@/types/api";

export function useSubphenotypeRuns() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ["subphenotypes", "runs"],
    queryFn: listSubphenotypeRuns,
    staleTime: 30_000,
    enabled: Boolean(userId),
  });
}

export function useSubphenotypeRun(runId?: string) {
  return useQuery({
    queryKey: ["subphenotypes", "runs", runId],
    queryFn: () => getSubphenotypeRun(runId ?? ""),
    enabled: Boolean(runId),
    staleTime: 30_000,
  });
}

export function useSubphenotypeAssignments(runId?: string) {
  return useQuery({
    queryKey: ["subphenotypes", "runs", runId, "assignments"],
    queryFn: () => listSubphenotypeAssignments(runId ?? ""),
    enabled: Boolean(runId),
    staleTime: 30_000,
  });
}

export function useCreateSubphenotypeRun() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SubphenotypeRunCreateInput) => createSubphenotypeRun(input),
    onSuccess: (run) => {
      queryClient.invalidateQueries({ queryKey: ["subphenotypes", "runs"] });
      queryClient.invalidateQueries({ queryKey: ["subphenotypes", "runs", run.id] });
      queryClient.invalidateQueries({
        queryKey: ["subphenotypes", "runs", run.id, "assignments"],
      });
      toast.success("Exploracion de subfenotipos IVCM completada.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
