"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  createPatient,
  getPatient,
  listPatients,
  updatePatient,
} from "@/lib/api/patients";
import { useAuthStore } from "@/stores/authStore";
import type { PatientCreateInput, PatientUpdateInput } from "@/types/api";

export function usePatients() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ["patients"],
    queryFn: listPatients,
    staleTime: 30_000,
    enabled: Boolean(userId),
  });
}

export function usePatient(patientId: string) {
  return useQuery({
    queryKey: ["patients", patientId],
    queryFn: () => getPatient(patientId),
    staleTime: 30_000,
  });
}

export function useCreatePatient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PatientCreateInput) => createPatient(input),
    onSuccess: (patient) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Paciente creado.");
      router.push(`/patients/${patient.id}`);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useUpdatePatient(patientId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PatientUpdateInput) => updatePatient(patientId, input),
    onSuccess: (patient) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patients", patientId] });
      toast.success("Paciente actualizado.");
      router.push(`/patients/${patient.id}`);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
