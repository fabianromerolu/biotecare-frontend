"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Brain, CalendarDays, FileImage, Gauge, Loader2, Ruler, Scale } from "lucide-react";
import { AuditTrailNote } from "@/components/compliance/AuditTrailNote";
import { ImageStatusBadge } from "@/components/images/ImageStatusBadge";
import { BiomarkersTable } from "@/components/predictions/BiomarkersTable";
import { DoctorReviewPanel } from "@/components/predictions/DoctorReviewPanel";
import { ProbabilityGauge } from "@/components/predictions/ProbabilityGauge";
import { ErrorPanel } from "@/components/shared/ErrorPanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatBytes, formatDateOnly } from "@/lib/utils/formatters";
import {
  readCachedPrediction,
  useHeatmap,
  useImage,
  usePredictImage,
  useReviewPrediction,
} from "@/hooks/useImages";
import type { ImageStatus, PredictionRead } from "@/types/api";

const HeatmapViewer = dynamic(
  () => import("@/components/predictions/HeatmapViewer").then((mod) => mod.HeatmapViewer),
  {
    ssr: false,
    loading: () => <LoadingSpinner label="Preparando canvas" />,
  },
);

// Parámetros fijos para máximo rendimiento del modelo
const BEST_THRESHOLD = 0.5;

const PIPELINE: ImageStatus[] = ["uploaded", "preprocessed", "predicted"];

const PIPELINE_LABELS: Record<string, string> = {
  uploaded: "Cargada",
  preprocessed: "Preprocesada",
  predicted: "Analizada",
  failed: "Error",
};

export function ImageDetailClient({
  patientId,
  imageId,
}: {
  patientId: string;
  imageId: string;
}) {
  const [prediction, setPrediction] = useState<PredictionRead | null>(() =>
    readCachedPrediction(imageId),
  );
  const imageQuery = useImage(imageId);
  const predictMutation = usePredictImage(patientId, imageId);
  const reviewMutation = useReviewPrediction(imageId);
  const heatmapQuery = useHeatmap(
    imageId,
    Boolean(prediction?.heatmap_path || imageQuery.data?.status === "predicted"),
  );

  if (imageQuery.isLoading) {
    return <LoadingSpinner label="Cargando imagen" />;
  }

  if (imageQuery.isError || !imageQuery.data) {
    return <ErrorPanel message="No se pudo cargar la imagen solicitada." />;
  }

  const image = imageQuery.data;
  const showPrediction = Boolean(prediction);

  return (
    <div className="space-y-5">
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" asChild>
          <Link href={`/patients/${patientId}`}>
            <ArrowLeft className="size-4" />
            Volver al paciente
          </Link>
        </Button>
      </div>

      <section className="rounded-lg border bg-card p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="font-mono text-sm text-muted-foreground">{image.id}</p>
            <h2 className="mt-1 text-xl font-semibold">{image.original_filename}</h2>
          </div>
          <ImageStatusBadge status={image.status} />
        </div>

        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <MetaItem icon={FileImage} label="Formato">
            {image.mime_type}
          </MetaItem>
          <MetaItem icon={Scale} label="Tamaño">
            {formatBytes(image.size_bytes)}
          </MetaItem>
          <MetaItem icon={Ruler} label="Dimensiones">
            {image.width && image.height ? `${image.width} x ${image.height}px` : "N/D"}
          </MetaItem>
          <MetaItem icon={CalendarDays} label="Fecha">
            {formatDateOnly(image.created_at)}
          </MetaItem>
        </div>
        <Separator className="my-5" />
        <div data-tour-id="image-detail__pipeline-stepper">
          <PipelineStepper status={image.status} />
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">Análisis de imagen con IA</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {predictMutation.isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                Procesando con ResNet-18. Puede tardar hasta 30 segundos en CPU…
              </span>
            ) : (
              "Ejecuta el modelo para obtener la probabilidad de ojo seco y el mapa de activación."
            )}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={predictMutation.isPending}
              data-tour-id="image-detail__run-ai-button"
            >
              <Brain />
              Ejecutar análisis IA
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar análisis de IA</AlertDialogTitle>
              <AlertDialogDescription>
                El modelo analizará esta imagen y generará una probabilidad de ojo seco junto con
                un mapa de activación. El resultado es un apoyo diagnóstico — el criterio clínico
                final corresponde al médico responsable.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  predictMutation.mutate(BEST_THRESHOLD, {
                    onSuccess: (data) => setPrediction(data),
                  })
                }
              >
                Ejecutar análisis
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {image.status === "predicted" && !prediction ? (
        <Alert>
          <Gauge className="size-4" aria-hidden="true" />
          <AlertTitle>Predicción previa detectada</AlertTitle>
          <AlertDescription>
            Ejecuta el análisis para refrescar biomarcadores y trazabilidad en esta sesión.
          </AlertDescription>
        </Alert>
      ) : null}

      {heatmapQuery.data ? (
        <div data-tour-id="image-detail__heatmap-viewer">
          <HeatmapViewer heatmapBlob={heatmapQuery.data} />
        </div>
      ) : null}

      {showPrediction && prediction ? (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div data-tour-id="image-detail__probability-gauge">
              <ProbabilityGauge
                probability={prediction.dry_eye_probability}
                threshold={prediction.threshold}
              />
            </div>
            <div data-tour-id="image-detail__doctor-review-panel">
              <DoctorReviewPanel
                prediction={prediction}
                isPending={reviewMutation.isPending}
                onReview={(accepted) =>
                  reviewMutation.mutate(
                    { predictionId: prediction.id, doctorAccepted: accepted },
                    { onSuccess: setPrediction },
                  )
                }
              />
            </div>
          </div>
          <div data-tour-id="image-detail__biomarkers-table">
            <BiomarkersTable biomarkers={prediction.biomarkers} />
          </div>
          <div data-tour-id="image-detail__audit-trail">
            <AuditTrailNote prediction={prediction} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MetaItem({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof FileImage;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 wrap-break-word font-medium">{children}</p>
    </div>
  );
}

function PipelineStepper({ status }: { status: ImageStatus }) {
  const activeIndex = status === "failed" ? -1 : PIPELINE.indexOf(status);
  return (
    <ol className="grid gap-2 sm:grid-cols-3" aria-label="Estado del pipeline">
      {PIPELINE.map((step, index) => {
        const active = index <= activeIndex;
        return (
          <li
            key={step}
            className={
              active
                ? "rounded-md border border-emerald-700 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900"
                : "rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground"
            }
          >
            {PIPELINE_LABELS[step] ?? step}
          </li>
        );
      })}
    </ol>
  );
}
