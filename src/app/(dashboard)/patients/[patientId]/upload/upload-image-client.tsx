"use client";

import { ImageUploadZone } from "@/components/images/ImageUploadZone";
import { ErrorPanel } from "@/components/shared/ErrorPanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useImageUpload } from "@/hooks/useImages";
import { usePatient } from "@/hooks/usePatients";

export function UploadImageClient({ patientId }: { patientId: string }) {
  const patientQuery = usePatient(patientId);
  const upload = useImageUpload(patientId);

  if (patientQuery.isLoading) {
    return <LoadingSpinner label="Cargando paciente" />;
  }

  if (patientQuery.isError || !patientQuery.data) {
    return <ErrorPanel message="No se pudo cargar el paciente solicitado." />;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Subir imagen IVCM</h2>
        <p className="text-sm text-muted-foreground">
          Paciente {patientQuery.data.external_code}
        </p>
      </div>
      <ImageUploadZone
        progress={upload.progress}
        isPending={upload.isPending}
        onSubmit={(input) => upload.mutate(input)}
      />
    </div>
  );
}
