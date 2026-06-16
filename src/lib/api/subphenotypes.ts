import { apiClient } from "@/lib/api/client";
import type {
  SubphenotypeAssignmentRead,
  SubphenotypeRunCreateInput,
  SubphenotypeRunRead,
} from "@/types/api";

export async function createSubphenotypeRun(
  input: SubphenotypeRunCreateInput,
): Promise<SubphenotypeRunRead> {
  const { data } = await apiClient.post<SubphenotypeRunRead>(
    "/ivcm-subphenotypes/runs",
    normalizeRunInput(input),
    {
      timeout: 0,
    },
  );
  return data;
}

export async function listSubphenotypeRuns(): Promise<SubphenotypeRunRead[]> {
  const { data } = await apiClient.get<SubphenotypeRunRead[]>("/ivcm-subphenotypes/runs");
  return data;
}

export async function getSubphenotypeRun(runId: string): Promise<SubphenotypeRunRead> {
  const { data } = await apiClient.get<SubphenotypeRunRead>(
    `/ivcm-subphenotypes/runs/${runId}`,
  );
  return data;
}

export async function listSubphenotypeAssignments(runId: string): Promise<SubphenotypeAssignmentRead[]> {
  const { data } = await apiClient.get<SubphenotypeAssignmentRead[]>(
    `/ivcm-subphenotypes/runs/${runId}/assignments`,
  );
  return data;
}

function normalizeRunInput(input: SubphenotypeRunCreateInput) {
  return {
    ...input,
    patient_ids: input.patient_ids?.length ? input.patient_ids : null,
  };
}
