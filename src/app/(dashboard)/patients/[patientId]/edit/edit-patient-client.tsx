"use client";

import { PatientForm } from "@/components/patients/PatientForm";
import { ErrorPanel } from "@/components/shared/ErrorPanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { usePatient, useUpdatePatient } from "@/hooks/usePatients";
import type { PatientUpdateInput } from "@/types/api";

export function EditPatientClient({ patientId }: { patientId: string }) {
  const patientQuery = usePatient(patientId);
  const mutation = useUpdatePatient(patientId);

  if (patientQuery.isLoading) {
    return <LoadingSpinner label="Cargando paciente" />;
  }

  if (patientQuery.isError || !patientQuery.data) {
    return <ErrorPanel message="No se pudo cargar el paciente solicitado." />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Editar paciente</h2>
        <p className="text-sm text-muted-foreground">
          El código externo permanece inmutable por trazabilidad.
        </p>
      </div>
      <PatientForm
        mode="edit"
        patient={patientQuery.data}
        isPending={mutation.isPending}
        onSubmit={(values) => mutation.mutate(values as PatientUpdateInput)}
      />
    </div>
  );
}
