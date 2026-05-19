import { apiClient } from "@/lib/api/client";
import type { PatientCreateInput, PatientRead, PatientUpdateInput } from "@/types/api";

export async function listPatients(): Promise<PatientRead[]> {
  const { data } = await apiClient.get<PatientRead[]>("/patients");
  return data;
}

export async function getPatient(patientId: string): Promise<PatientRead> {
  const { data } = await apiClient.get<PatientRead>(`/patients/${patientId}`);
  return data;
}

export async function createPatient(input: PatientCreateInput): Promise<PatientRead> {
  const { data } = await apiClient.post<PatientRead>("/patients", normalizePatientInput(input));
  return data;
}

export async function updatePatient(
  patientId: string,
  input: PatientUpdateInput,
): Promise<PatientRead> {
  const { data } = await apiClient.patch<PatientRead>(
    `/patients/${patientId}`,
    normalizePatientInput(input),
  );
  return data;
}

function normalizePatientInput<T extends PatientCreateInput | PatientUpdateInput>(input: T) {
  return {
    ...input,
    birth_year: input.birth_year === undefined ? null : input.birth_year,
    sex: input.sex === undefined ? null : input.sex,
  };
}
