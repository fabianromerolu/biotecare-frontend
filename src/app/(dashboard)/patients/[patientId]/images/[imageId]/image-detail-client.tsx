"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Brain, CalendarDays, FileImage, Gauge, Loader2, Ruler, Scale } from "lucide-react";
import { AIActDisclaimer } from "@/components/compliance/AIActDisclaimer";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const PIPELINE: ImageStatus[] = ["uploaded", "preprocessed", "predicted"];

export function ImageDetailClient({
  patientId,
  imageId,
}: {
  patientId: string;
  imageId: string;
}) {
  const [threshold, setThreshold] = useState(0.5);
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
      <AIActDisclaimer />

      <section className="rounded-lg border bg-card p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="font-mono text-sm text-muted-foreground">{image.id}</p>
            <h2 className="mt-1 text-xl font-semibold">{image.original_filename}</h2>
          </div>
          <ImageStatusBadge status={image.status} />
        </div>

        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <MetaItem icon={FileImage} label="Formato">
            {image.mime_type}
          </MetaItem>
          <MetaItem icon={Scale} label="Tamano">
            {formatBytes(image.size_bytes)}
          </MetaItem>
          <MetaItem icon={Ruler} label="Dimensiones">
            {image.width && image.height ? `${image.width} x ${image.height}px` : "N/D"}
          </MetaItem>
          <MetaItem icon={CalendarDays} label="Fecha">
            {formatDateOnly(image.created_at)}
          </MetaItem>
        </dl>
        <Separator className="my-5" />
        <div data-tour-id="image-detail__pipeline-stepper">
          <PipelineStepper status={image.status} />
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border bg-card p-5 lg:grid-cols-[220px_1fr_auto]">
        <div className="grid gap-2">
          <Label htmlFor="threshold">Umbral</Label>
          <Input
            id="threshold"
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
          />
        </div>
        <div className="flex items-end text-sm text-muted-foreground">
          {predictMutation.isPending ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Procesando imagen con ResNet-18. Puede tardar hasta 30 segundos en CPU.
            </span>
          ) : (
            <span>El boton queda deshabilitado mientras la inferencia esta en curso.</span>
          )}
        </div>
        <div className="flex items-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={predictMutation.isPending}
                data-tour-id="image-detail__run-ai-button"
              >
                <Brain />
                Ejecutar analisis IA
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar analisis de IA</AlertDialogTitle>
                <AlertDialogDescription>
                  El resultado generado por este sistema de inteligencia artificial es unicamente un
                  soporte para la decision clinica. El diagnostico final es responsabilidad
                  exclusiva del medico.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    predictMutation.mutate(threshold, {
                      onSuccess: (data) => setPrediction(data),
                    })
                  }
                >
                  Entendido - Ejecutar analisis
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>

      {image.status === "predicted" && !prediction ? (
        <Alert>
          <Gauge className="size-4" aria-hidden="true" />
          <AlertTitle>Prediccion previa detectada</AlertTitle>
          <AlertDescription>
            La API actual expone el heatmap, pero no tiene un endpoint de lectura de predicciones por
            imagen. Ejecuta el analisis para refrescar biomarcadores y trazabilidad en esta sesion.
          </AlertDescription>
        </Alert>
      ) : null}

      {heatmapQuery.data ? (
        <div data-tour-id="image-detail__heatmap-viewer">
          <HeatmapViewer heatmapBlob={heatmapQuery.data} />
        </div>
      ) : null}

      {showPrediction && prediction ? (
        <div className="grid gap-4 xl:grid-cols-2">
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
          <div className="xl:col-span-2" data-tour-id="image-detail__biomarkers-table">
            <BiomarkersTable biomarkers={prediction.biomarkers} />
          </div>
          <div className="xl:col-span-2" data-tour-id="image-detail__audit-trail">
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
      <dt className="flex items-center gap-1 text-xs text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 break-words font-medium">{children}</dd>
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
            {step.toUpperCase()}
          </li>
        );
      })}
    </ol>
  );
}
