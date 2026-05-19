"use client";

import { Brain, Edit3, FileImage, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ImageCard } from "@/components/images/ImageCard";
import { AIActDisclaimer } from "@/components/compliance/AIActDisclaimer";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { formatDate, methodLabel, sexLabel } from "@/lib/utils/formatters";
import { useAggregatePatient, usePatientImages, useReviewPrediction } from "@/hooks/useImages";
import { usePatient } from "@/hooks/usePatients";
import type { AggregationMethod, PredictionRead } from "@/types/api";

export function PatientDetailClient({ patientId }: { patientId: string }) {
  const patientQuery = usePatient(patientId);
  const imagesQuery = usePatientImages(patientId);
  const aggregateMutation = useAggregatePatient(patientId);
  const reviewMutation = useReviewPrediction();
  const [aggregatePrediction, setAggregatePrediction] = useState<PredictionRead | null>(null);
  const [aggregationMethod, setAggregationMethod] = useState<AggregationMethod>("mean");
  const [threshold, setThreshold] = useState(0.5);

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
      <section className="rounded-lg border bg-card p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="font-mono text-sm text-muted-foreground">{patient.id}</p>
            <h2 className="mt-1 text-xl font-semibold">{patient.external_code}</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/patients/${patient.id}/edit`}>
              <Edit3 />
              Editar
            </Link>
          </Button>
        </div>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="Ano nac.">{patient.birth_year ?? "No registrado"}</InfoItem>
          <InfoItem label="Sexo">{sexLabel(patient.sex)}</InfoItem>
          <InfoItem label="Fecha creacion">{formatDate(patient.created_at)}</InfoItem>
          <InfoItem label="Doctor ID">{patient.doctor_id}</InfoItem>
        </dl>
      </section>

      <section className="space-y-3" data-tour-id="patient-detail__images-section">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-semibold">Imagenes IVCM</h2>
            <p className="text-sm text-muted-foreground">{images.length} imagenes registradas</p>
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
            title="Sin imagenes"
            description="Sube una imagen IVCM para iniciar el analisis."
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

      <section className="space-y-4">
        <div data-tour-id="patient-detail__ai-act-disclaimer">
          <AIActDisclaimer />
        </div>
        <Card data-tour-id="patient-detail__aggregation-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="size-4" aria-hidden="true" />
              Prediccion agregada del paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 lg:grid-cols-[220px_1fr_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                aggregateMutation.mutate(
                  { aggregation_method: aggregationMethod, threshold },
                  {
                  onSuccess: (prediction) => setAggregatePrediction(prediction),
                  },
                );
              }}
            >
              <div className="grid gap-2">
                <Label>Metodo</Label>
                <Select
                  value={aggregationMethod}
                  onValueChange={(value) => setAggregationMethod(value as AggregationMethod)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mean">Promedio</SelectItem>
                    <SelectItem value="max">Maximo</SelectItem>
                    <SelectItem value="attention">Atencion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="threshold">Umbral {threshold.toFixed(2)}</Label>
                <Slider
                  id="threshold"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[threshold]}
                  onValueChange={([value]) => setThreshold(value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={!canAggregate || aggregateMutation.isPending}
                  data-tour-id="patient-detail__aggregation-submit"
                >
                  <Brain />
                  {aggregateMutation.isPending ? "Generando" : "Generar"}
                </Button>
              </div>
            </form>
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
        ) : (
          <p className="text-sm text-muted-foreground">
            Metodo actual: {methodLabel(aggregationMethod)}. La agregacion se habilita
            cuando al menos una imagen tiene prediccion.
          </p>
        )}
      </section>
    </div>
  );
}

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words font-medium">{children}</dd>
    </div>
  );
}
