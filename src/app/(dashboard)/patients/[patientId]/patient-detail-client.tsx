"use client";

import { ArrowLeft, Brain, Edit3, FileImage, Trash2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AIActDisclaimer } from "@/components/compliance/AIActDisclaimer";
import { DoctorReviewPanel } from "@/components/predictions/DoctorReviewPanel";
import { PatientTimeline } from "@/components/predictions/PatientTimeline";
import { ProbabilityGauge } from "@/components/predictions/ProbabilityGauge";
import { BiomarkersTable } from "@/components/predictions/BiomarkersTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorPanel } from "@/components/shared/ErrorPanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDate, sexLabel } from "@/lib/utils/formatters";
import { useAggregatePatient, usePatientImages, usePatientPrediction, useReviewPrediction } from "@/hooks/useImages";
import { useDeletePatient, usePatient } from "@/hooks/usePatients";
import type { PredictionRead } from "@/types/api";

const BEST_METHOD = "attention" as const;
const BEST_THRESHOLD = 0.5;

export function PatientDetailClient({ patientId }: { patientId: string }) {
  const patientQuery = usePatient(patientId);
  const imagesQuery = usePatientImages(patientId);
  const aggregateMutation = useAggregatePatient(patientId);
  const reviewMutation = useReviewPrediction();
  const deleteMutation = useDeletePatient(patientId);
  const [aggregatePrediction, setAggregatePrediction] = useState<PredictionRead | null>(null);

  const images = imagesQuery.data ?? [];
  const canAggregate = images.some((image) => image.status === "predicted");

  const persistedPatientPrediction = usePatientPrediction(patientId, canAggregate && !aggregatePrediction);

  const resolvedAggregatePrediction = aggregatePrediction ?? persistedPatientPrediction.data ?? null;

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
      <section className="overflow-hidden rounded-xl border shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-primary/20 bg-primary/10 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Expediente clínico
            </p>
            <h2 className="text-xl font-bold text-foreground">{patient.external_code}</h2>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" asChild className="shrink-0">
              <Link href={`/patients/${patient.id}/edit`}>
                <Edit3 />
                Editar
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="shrink-0">
                  <Trash2 />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive">
                    <Trash2 />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Eliminar paciente</AlertDialogTitle>
                  <AlertDialogDescription>
                    Se eliminará el expediente {patient.external_code}, sus imágenes y sus análisis.
                    Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate()}
                  >
                    {deleteMutation.isPending ? "Eliminando..." : "Eliminar definitivamente"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="grid gap-4 bg-card p-5 text-sm sm:grid-cols-3">
          <InfoItem label="Año nac.">{patient.birth_year ?? "No registrado"}</InfoItem>
          <InfoItem label="Sexo">{sexLabel(patient.sex)}</InfoItem>
          <InfoItem label="Fecha registro">{formatDate(patient.created_at)}</InfoItem>
        </div>
      </section>

      {/* Imágenes IVCM */}
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
        {images.length === 0 && (
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
        )}
      </section>

      {/* Línea de tiempo de evolución */}
      {images.length > 0 && (
        <PatientTimeline patientId={patient.id} images={images} />
      )}

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

        {resolvedAggregatePrediction ? (
          <div className="grid gap-4 xl:grid-cols-2">
            <ProbabilityGauge
              probability={resolvedAggregatePrediction.dry_eye_probability}
              threshold={resolvedAggregatePrediction.threshold}
            />
            <DoctorReviewPanel
              prediction={resolvedAggregatePrediction}
              isPending={reviewMutation.isPending}
              onReview={(accepted) =>
                reviewMutation.mutate(
                  { predictionId: resolvedAggregatePrediction.id, doctorAccepted: accepted },
                  { onSuccess: setAggregatePrediction },
                )
              }
            />
            <div className="xl:col-span-2">
              <BiomarkersTable biomarkers={resolvedAggregatePrediction.biomarkers} />
            </div>
          </div>
        ) : null}
      </section>

      {/* Disclaimer EU AI Act — al final */}
      <div data-tour-id="patient-detail__ai-act-disclaimer">
        <AIActDisclaimer />
      </div>
    </div>
  );
}

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 wrap-break-word font-semibold">{children}</p>
    </div>
  );
}
