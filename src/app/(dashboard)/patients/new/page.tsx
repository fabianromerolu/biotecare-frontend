"use client";

import { PatientForm } from "@/components/patients/PatientForm";
import { useCreatePatient } from "@/hooks/usePatients";
import type { PatientCreateInput } from "@/types/api";

export default function NewPatientPage() {
  const mutation = useCreatePatient();

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Nuevo paciente</h2>
        <p className="text-sm text-muted-foreground">
          Usa un código externo anonimizado; no introduzcas nombres ni documentos.
        </p>
      </div>
      <PatientForm
        mode="create"
        isPending={mutation.isPending}
        onSubmit={(values) => mutation.mutate(values as PatientCreateInput)}
      />
    </div>
  );
}
