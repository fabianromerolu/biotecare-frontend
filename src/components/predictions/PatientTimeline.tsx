"use client";

import { Activity, ArrowRight, Clock, Eye, Minus, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useImagePrediction } from "@/hooks/useImages";
import { formatDateOnly } from "@/lib/utils/formatters";
import type { ImageRead } from "@/types/api";

export function PatientTimeline({
  patientId,
  images,
}: {
  patientId: string;
  images: ImageRead[];
}) {
  const predicted = images.filter((img) => img.status === "predicted");
  if (predicted.length === 0) return null;

  const sorted = [...predicted].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  return (
    <section data-tour-id="patient-detail__timeline">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-[#00B4D8] to-cyan-600 shadow-md shadow-[#00B4D8]/20">
            <Activity className="size-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Línea de evolución</h2>
            <p className="text-xs text-muted-foreground">
              {sorted.length} imagen{sorted.length !== 1 ? "es" : ""} analizada{sorted.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {sorted.length >= 2 && <TrendBadge images={sorted} />}
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Vertical line */}
        <div
          className="absolute left-3.5 top-3 bottom-3 w-px bg-linear-to-b from-[#00B4D8] via-cyan-600 to-border"
          aria-hidden="true"
        />

        <ol className="space-y-5">
          {sorted.map((image, index) => (
            <TimelineCard
              key={image.id}
              patientId={patientId}
              image={image}
              index={index}
              total={sorted.length}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function TrendBadge({ images }: { images: ImageRead[] }) {
  // Mostrar tendencia solo cuando tengamos predicciones cargadas — se usa como orientación visual
  const first = images[0];
  const last = images[images.length - 1];
  if (!first || !last || first.id === last.id) return null;

  return (
    <div className="flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
      <Clock className="size-3" />
      {formatDateOnly(first.created_at)} → {formatDateOnly(last.created_at)}
    </div>
  );
}

function TimelineCard({
  patientId,
  image,
  index,
  total,
}: {
  patientId: string;
  image: ImageRead;
  index: number;
  total: number;
}) {
  const predictionQuery = useImagePrediction(image.id, true);
  const prediction = predictionQuery.data;

  const isDryEye = prediction?.predicted_label === "dry_eye";
  const isNormal = prediction?.predicted_label === "normal";
  const pct = prediction ? Math.round(prediction.dry_eye_probability * 100) : null;

  const dotColor = isDryEye
    ? "from-red-400 to-rose-600 shadow-red-200"
    : isNormal
    ? "from-emerald-400 to-teal-600 shadow-emerald-200"
    : "from-slate-300 to-slate-400 shadow-slate-100";

  const cardAccent = isDryEye
    ? "border-red-500/30 bg-red-500/5"
    : isNormal
    ? "border-emerald-500/30 bg-emerald-500/5"
    : "border-border bg-card";

  return (
    <li className="relative">
      {/* Dot on timeline */}
      <div
        className={`absolute -left-8 flex size-7 items-center justify-center rounded-full bg-linear-to-br shadow-md ${dotColor} border-2 border-background`}
        aria-hidden="true"
      >
        <Eye className="size-3 text-white" />
      </div>

      {/* Card */}
      <div
        className={`group rounded-xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${cardAccent}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          {/* Left: date + filename */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {formatDateOnly(image.created_at)}
              </span>
              {index === 0 && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                  Inicio
                </span>
              )}
              {index === total - 1 && total > 1 && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                  Más reciente
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-sm font-medium text-foreground">
              {image.original_filename}
            </p>
          </div>

          {/* Right: badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {image.eye && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-semibold shadow-xs">
                <Eye className="size-3 text-muted-foreground" />
                {image.eye}
              </span>
            )}
            {isDryEye && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                <TrendingDown className="size-3" />
                Ojo seco
              </span>
            )}
            {isNormal && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                <TrendingUp className="size-3" />
                Normal
              </span>
            )}
            {!prediction && !predictionQuery.isLoading && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                Sin análisis
              </span>
            )}
          </div>
        </div>

        {/* Probability bar */}
        {pct != null && (
          <div className="mt-3" aria-label={`Probabilidad de ojo seco: ${pct}%`}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Probabilidad ojo seco</span>
              <span
                className={`font-mono text-sm font-bold ${
                  pct >= 50 ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {pct}%
              </span>
            </div>
            <ProbabilityBar pct={pct} />
            <div className="mt-0.5 flex justify-end">
              <span className="text-[10px] text-muted-foreground">Umbral 50%</span>
            </div>
          </div>
        )}

        {/* Review status + link */}
        <div className="mt-3 flex items-center justify-between">
          <ReviewBadge override={prediction?.doctor_override} />
          <Link
            href={`/patients/${patientId}/images/${image.id}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground group-hover:text-foreground"
          >
            Ver análisis completo
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </li>
  );
}

function ProbabilityBar({ pct }: { pct: number }) {
  const barColor =
    pct >= 75
      ? "from-orange-400 to-red-600"
      : pct >= 50
      ? "from-yellow-400 to-orange-500"
      : pct >= 25
      ? "from-teal-400 to-emerald-500"
      : "from-emerald-400 to-teal-500";

  // Dynamic width via CSS custom property to avoid inline-style warning on the visible bar
  const style = { "--bar-w": `${pct}%` } as React.CSSProperties;

  return (
    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted" style={style}>
      <div
        className={`h-full w-[var(--bar-w)] rounded-full bg-linear-to-r transition-all duration-700 ${barColor}`}
      />
      {/* Threshold marker */}
      <div
        className="absolute top-0 left-1/2 h-full w-px bg-foreground/30"
        aria-hidden="true"
      />
    </div>
  );
}

function ReviewBadge({ override }: { override: boolean | null | undefined }) {
  if (override === true) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
        <span className="size-1.5 rounded-full bg-blue-500" aria-hidden="true" />
        Revisión aceptada
      </span>
    );
  }
  if (override === false) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700">
        <span className="size-1.5 rounded-full bg-orange-500" aria-hidden="true" />
        Revisión rechazada
      </span>
    );
  }
  if (override === null || override === undefined) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
        <Minus className="size-2.5" />
        Sin revisar
      </span>
    );
  }
  return null;
}
