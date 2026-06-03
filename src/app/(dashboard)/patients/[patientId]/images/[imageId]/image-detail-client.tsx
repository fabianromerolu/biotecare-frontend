"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Brain,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  FileImage,
  Loader2,
  Ruler,
  Scale,
  Sparkles,
} from "lucide-react";
import { AuditTrailNote } from "@/components/compliance/AuditTrailNote";
import { AIActDisclaimer } from "@/components/compliance/AIActDisclaimer";
import { ImageStatusBadge } from "@/components/images/ImageStatusBadge";
import { BiomarkersTable } from "@/components/predictions/BiomarkersTable";
import { DoctorReviewPanel } from "@/components/predictions/DoctorReviewPanel";
import { ProbabilityGauge } from "@/components/predictions/ProbabilityGauge";
import { ErrorPanel } from "@/components/shared/ErrorPanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
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
import { formatBytes, formatDateOnly } from "@/lib/utils/formatters";
import {
  cachePrediction,
  readCachedPrediction,
  useHeatmap,
  useImage,
  useImageFile,
  useImagePrediction,
  usePredictImage,
  useReviewPrediction,
} from "@/hooks/useImages";
import type { ImageStatus, PredictionRead } from "@/types/api";

const HeatmapViewer = dynamic(
  () => import("@/components/predictions/HeatmapViewer").then((mod) => mod.HeatmapViewer),
  { ssr: false, loading: () => <LoadingSpinner label="Preparando canvas" /> },
);

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
  const imageFileQuery = useImageFile(imageId);
  const predictMutation = usePredictImage(patientId, imageId);
  const reviewMutation = useReviewPrediction(imageId);
  const persistedPredictionQuery = useImagePrediction(
    imageId,
    !prediction && imageQuery.data?.status === "predicted",
  );
  // enabled cuando: la imagen ya tenía predicción previa | el modelo acaba de correr | hay heatmap_path
  const heatmapQuery = useHeatmap(
    imageId,
    Boolean(
      imageQuery.data?.status === "predicted" ||
        predictMutation.isSuccess ||
        prediction?.heatmap_path,
    ),
  );

  useEffect(() => {
    if (persistedPredictionQuery.data) {
      cachePrediction(imageId, persistedPredictionQuery.data);
    }
  }, [persistedPredictionQuery.data, imageId]);

  if (imageQuery.isLoading) return <LoadingSpinner label="Cargando imagen" />;
  if (imageQuery.isError || !imageQuery.data) {
    return <ErrorPanel message="No se pudo cargar la imagen solicitada." />;
  }

  const image = imageQuery.data;
  const resolvedPrediction = prediction ?? persistedPredictionQuery.data ?? null;

  return (
    <div className="space-y-5">
      {/* Back */}
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" asChild>
          <Link href={`/patients/${patientId}`}>
            <ArrowLeft className="size-4" />
            Volver al paciente
          </Link>
        </Button>
      </div>

      {/* ── Tarjeta imagen ─────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-xl border shadow-sm">
        {/* Cabecera violeta */}
        <div className="flex flex-col justify-between gap-4 border-b border-primary/20 bg-primary/10 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#00B4D8] to-cyan-600 shadow-md shadow-[#00B4D8]/20">
              <FileImage className="size-4 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Imagen IVCM
              </p>
              <h2 className="truncate text-base font-bold text-foreground">
                {image.original_filename}
              </h2>
            </div>
          </div>
          <ImageStatusBadge status={image.status} />
        </div>

        {/* Metadata grid */}
        <div className="grid gap-4 bg-card p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <MetaItem icon={FileImage} label="Formato">{image.mime_type}</MetaItem>
          <MetaItem icon={Scale} label="Tamaño">{formatBytes(image.size_bytes)}</MetaItem>
          <MetaItem icon={Ruler} label="Dimensiones">
            {image.width && image.height ? `${image.width} × ${image.height} px` : "N/D"}
          </MetaItem>
          <MetaItem icon={CalendarDays} label="Fecha">{formatDateOnly(image.created_at)}</MetaItem>
        </div>

        {/* Pipeline */}
        <div className="border-t bg-card px-5 pb-5" data-tour-id="image-detail__pipeline-stepper">
          <PipelineStepper status={image.status} />
        </div>
      </section>

      {/* ── Ejecutar análisis ──────────────────────────────────────── */}
      <section className="overflow-hidden rounded-xl border shadow-sm">
        <div className="flex flex-col gap-4 border-b border-primary/20 bg-primary/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#00B4D8] to-cyan-600 shadow-md shadow-[#00B4D8]/20">
              <Brain className="size-4 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Modelo ResNet-18
              </p>
              <h2 className="text-sm font-bold text-foreground" data-tour-id="image-detail__run-ai-button-label">
                Análisis con inteligencia artificial
              </h2>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={predictMutation.isPending}
                className="shrink-0 bg-linear-to-r from-[#00B4D8] to-cyan-600 shadow-md shadow-[#00B4D8]/20 hover:from-cyan-500 hover:to-cyan-700"
                data-tour-id="image-detail__run-ai-button"
              >
                {predictMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="size-4" aria-hidden="true" />
                )}
                {predictMutation.isPending ? "Procesando…" : "Ejecutar análisis IA"}
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
        </div>

        {/* Estado del análisis */}
        <div className="bg-card px-5 py-4 text-xs text-muted-foreground">
          {predictMutation.isPending ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              Procesando con ResNet-18. Puede tardar hasta 30 segundos en CPU…
            </span>
          ) : image.status === "predicted" ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
              Imagen analizada. Vuelva a ejecutar para actualizar los resultados.
            </span>
          ) : (
            "Ejecuta el modelo para obtener la probabilidad de ojo seco y el mapa de activación."
          )}
        </div>
      </section>

      {/* ── Carga de predicción previa ─────────────────────────────── */}
      {image.status === "predicted" && !prediction && persistedPredictionQuery.isLoading && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm">
          <Loader2 className="size-4 shrink-0 animate-spin text-primary" aria-hidden="true" />
          <span className="text-foreground">Recuperando análisis previo…</span>
        </div>
      )}

      {/* ── Visor de imagen y mapa de activación ───────────────────── */}
      <details
        className="group overflow-hidden rounded-xl border bg-card shadow-sm"
        data-tour-id="image-detail__visual-accordion"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-primary/10 p-5 transition-colors hover:bg-primary/15">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#00B4D8] to-cyan-600 shadow-md shadow-[#00B4D8]/20">
              <FileImage className="size-4 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Visor comparativo
              </p>
              <h2 className="text-sm font-bold text-foreground">
                Imagen original y mapa de activación
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Despliegue para revisar la imagen cargada, Grad-CAM y la mezcla por opacidad.
              </p>
            </div>
          </div>
          <ChevronDown
            className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="space-y-4 border-t bg-background/60 p-4">
          {imageFileQuery.isLoading && (
            <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm">
              <Loader2 className="size-4 shrink-0 animate-spin text-primary" aria-hidden="true" />
              <span className="text-foreground">Cargando imagen original...</span>
            </div>
          )}

          {imageFileQuery.isError && (
            <ErrorPanel message="No se pudo cargar la imagen original desde el almacenamiento." />
          )}

          {heatmapQuery.isLoading && image.status === "predicted" && (
            <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm">
              <Loader2 className="size-4 shrink-0 animate-spin text-primary" aria-hidden="true" />
              <span className="text-foreground">Cargando mapa de activación...</span>
            </div>
          )}

          {heatmapQuery.isError && image.status === "predicted" && (
            <ErrorPanel message="No se pudo cargar el mapa de activación Grad-CAM. Vuelva a ejecutar el análisis para regenerarlo." />
          )}

          {imageFileQuery.data && (
            <div data-tour-id="image-detail__heatmap-viewer">
              <HeatmapViewer
                heatmapBlob={heatmapQuery.data}
                originalImageBlob={imageFileQuery.data}
              />
            </div>
          )}
        </div>
      </details>

      {/* ── Resultados del análisis ────────────────────────────────── */}
      {resolvedPrediction && (
        <div className="space-y-4">
          <AIActDisclaimer />
          <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
            <div data-tour-id="image-detail__probability-gauge">
              <ProbabilityGauge
                probability={resolvedPrediction.dry_eye_probability}
                threshold={resolvedPrediction.threshold}
              />
            </div>
            <div data-tour-id="image-detail__doctor-review-panel">
              <DoctorReviewPanel
                prediction={resolvedPrediction}
                isPending={reviewMutation.isPending}
                onReview={(accepted) =>
                  reviewMutation.mutate(
                    { predictionId: resolvedPrediction.id, doctorAccepted: accepted },
                    { onSuccess: setPrediction },
                  )
                }
              />
            </div>
          </div>
          <div data-tour-id="image-detail__biomarkers-table">
            <BiomarkersTable biomarkers={resolvedPrediction.biomarkers} />
          </div>
          <div data-tour-id="image-detail__audit-trail">
            <AuditTrailNote prediction={resolvedPrediction} />
          </div>
        </div>
      )}
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
      <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 wrap-break-word font-semibold">{children}</p>
    </div>
  );
}

function PipelineStepper({ status }: { status: ImageStatus }) {
  const activeIndex = status === "failed" ? -1 : PIPELINE.indexOf(status);
  return (
    <ol className="mt-4 grid gap-2 sm:grid-cols-3" aria-label="Estado del pipeline de procesamiento">
      {PIPELINE.map((step, index) => {
        const done = index < activeIndex;
        const current = index === activeIndex;
        return (
          <li
            key={step}
            className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              done
                ? "border border-primary/25 bg-primary/8 text-foreground"
                : current
                ? "border border-primary/40 bg-primary/15 font-bold text-foreground shadow-sm shadow-primary/10"
                : "border border-border bg-muted text-muted-foreground"
            }`}
          >
            <span
              className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                done || current
                  ? "bg-linear-to-br from-[#00B4D8] to-cyan-600 text-[#0A192F]"
                  : "bg-border text-muted-foreground"
              }`}
            >
              {done ? "✓" : index + 1}
            </span>
            {PIPELINE_LABELS[step] ?? step}
          </li>
        );
      })}
    </ol>
  );
}
