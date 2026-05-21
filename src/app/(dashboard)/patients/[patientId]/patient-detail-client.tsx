"use client";

import { ArrowLeft, Brain, Edit3, FileImage, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AIActDisclaimer } from "@/components/compliance/AIActDisclaimer";
import { ImageCard } from "@/components/images/ImageCard";
import { DoctorReviewPanel } from "@/components/predictions/DoctorReviewPanel";
import { ProbabilityGauge } from "@/components/predictions/ProbabilityGauge";
import { BiomarkersTable } from "@/components/predictions/BiomarkersTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorPanel } from "@/components/shared/ErrorPanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, sexLabel } from "@/lib/utils/formatters";
import { useAggregatePatient, usePatientImages, useReviewPrediction } from "@/hooks/useImages";
import { usePatient } from "@/hooks/usePatients";
import type { PredictionRead } from "@/types/api";

// Parámetros fijos para máximo rendimiento del modelo
const BEST_METHOD = "attention" as const;
const BEST_THRESHOLD = 0.5;

export function PatientDetailClient({ patientId }: { patientId: string }) {
  const patientQuery = usePatient(patientId);
  const imagesQuery = usePatientImages(patientId);
  const aggregateMutation = useAggregatePatient(patientId);
  const reviewMutation = useReviewPrediction();
  const [aggregatePrediction, setAggregatePrediction] = useState<PredictionRead | null>(null);

  const images = imagesQuery.data ?? [];
  const canAggregate = images.some((image) => image.status === "predicted");

  if (patientQuery.isLoading || imagesQuery.isLoading) {
    return <LoadingSpinner label="Cargando paciente" />;
  }

  if (patientQuery.isError || !patientQuery.data) {
    return <ErrorPanel message="No se pudo cargar el paciente solicitado." />;
  }

  const patient = patientQuery.data;

  return (
    <div className="space-y-5">
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" asChild>
          <Link href="/patients">
            <ArrowLeft className="size-4" />
            Volver a pacientes
          </Link>
        </Button>
      </div>

      {/* Información del paciente */}
      <section className="rounded-lg border bg-card p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{patient.id}</p>
            <h2 className="mt-1 text-xl font-semibold">{patient.external_code}</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/patients/${patient.id}/edit`}>
              <Edit3 />
              Editar
            </Link>
          </Button>
        </div>
        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="Año nac.">{patient.birth_year ?? "No registrado"}</InfoItem>
          <InfoItem label="Sexo">{sexLabel(patient.sex)}</InfoItem>
          <InfoItem label="Fecha creación">{formatDate(patient.created_at)}</InfoItem>
          <InfoItem label="Doctor ID">
            <span className="font-mono text-xs">{patient.doctor_id}</span>
          </InfoItem>
        </div>
      </section>

      {/* Imágenes IVCM */}
      <div data-tour-id="patient-detail__ai-act-disclaimer">
        <AIActDisclaimer />
      </div>

      <section className="space-y-3" data-tour-id="patient-detail__images-section">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-semibold">Imágenes IVCM</h2>
            <p className="text-sm text-muted-foreground">{images.length} imágenes registradas</p>
          </div>
          <Button asChild data-tour-id="patient-detail__upload-button">
            <Link href={`/patients/${patient.id}/upload`}>
              <UploadCloud />
              Subir imagen IVCM
            </Link>
          </Button>
        </div>
        {images.length === 0 ? (
          <EmptyState
            icon={FileImage}
            title="Sin imágenes"
            description="Sube una imagen IVCM para iniciar el análisis."
            action={
              <Button asChild>
                <Link href={`/patients/${patient.id}/upload`}>
                  <UploadCloud />
                  Subir imagen
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => (
              <ImageCard key={image.id} patientId={patient.id} image={image} />
            ))}
          </div>
        )}
      </section>

      {/* Análisis agregado del paciente */}
      <section className="space-y-4">
        <Card data-tour-id="patient-detail__aggregation-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="size-4" aria-hidden="true" />
              Análisis agregado del paciente
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Combina todas las imágenes con predicción usando el algoritmo de mayor precisión.
            </p>
          </CardHeader>
          <CardContent>
            <Button
              data-tour-id="patient-detail__aggregation-submit"
              disabled={!canAggregate || aggregateMutation.isPending}
              onClick={() =>
                aggregateMutation.mutate(
                  { aggregation_method: BEST_METHOD, threshold: BEST_THRESHOLD },
                  { onSuccess: (prediction) => setAggregatePrediction(prediction) },
                )
              }
            >
              <Brain />
              {aggregateMutation.isPending ? "Analizando…" : "Generar análisis"}
            </Button>
            {!canAggregate && (
              <p className="mt-2 text-xs text-muted-foreground">
                Se activa cuando al menos una imagen tiene predicción individual.
              </p>
            )}
          </CardContent>
        </Card>

        {aggregatePrediction ? (
          <div className="grid gap-4 xl:grid-cols-2">
            <ProbabilityGauge
              probability={aggregatePrediction.dry_eye_probability}
              threshold={aggregatePrediction.threshold}
            />
            <DoctorReviewPanel
              prediction={aggregatePrediction}
              isPending={reviewMutation.isPending}
              onReview={(accepted) =>
                reviewMutation.mutate(
                  { predictionId: aggregatePrediction.id, doctorAccepted: accepted },
                  { onSuccess: setAggregatePrediction },
                )
              }
            />
            <div className="xl:col-span-2">
              <BiomarkersTable biomarkers={aggregatePrediction.biomarkers} />
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 wrap-break-word font-medium">{children}</p>
    </div>
  );
}
