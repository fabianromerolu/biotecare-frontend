"use client";

import dynamic from "next/dynamic";
import { AlertTriangle, CircleDot, ChevronDown, HelpCircle, ImageIcon, Table2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ErrorPanel } from "@/components/shared/ErrorPanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHeatmap, useImageFile } from "@/hooks/useImages";
import { compactId } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import type {
  SubphenotypeAssignmentRead,
  SubphenotypeRunRead,
  SubphenotypeRunStatus,
} from "@/types/api";

const HeatmapViewer = dynamic(
  () => import("@/components/predictions/HeatmapViewer").then((mod) => mod.HeatmapViewer),
  { ssr: false, loading: () => <LoadingSpinner label="Preparando visor" /> },
);

const CLUSTER_COLORS = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#ea580c", "#0891b2"];

interface SubphenotypeRunDetailProps {
  run: SubphenotypeRunRead;
  assignments: SubphenotypeAssignmentRead[];
  loadingAssignments: boolean;
  actions?: React.ReactNode;
}

export function SubphenotypeRunDetail({
  run,
  assignments,
  loadingAssignments,
  actions,
}: SubphenotypeRunDetailProps) {
  const warning = run.summary?.quality_warning;

  return (
    <section className="space-y-4" data-tour-id="subphenotypes__run-detail">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Detalle de corrida</h1>
            <SubphenotypeStatusBadge status={run.status} />
          </div>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            {compactId(run.id)} · {run.exploratory_disclaimer}
          </p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>

      {run.error_message ? <ErrorPanel message={run.error_message} /> : null}

      {warning?.has_warning ? (
        <Alert className="border-amber-300 bg-amber-50 text-amber-950">
          <AlertTriangle className="size-4" />
          <AlertTitle>Revisar calidad de imagen</AlertTitle>
          <AlertDescription>{warning.messages.join(" ")}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" data-tour-id="subphenotypes__metrics">
        <MetricCard
          label="Imágenes"
          help="Cantidad de imágenes IVCM que sí pudieron procesarse en esta corrida. No incluye archivos omitidos por no estar disponibles o no ser decodificables."
          value={String(run.n_images)}
        />
        <MetricCard
          label="Clusters"
          help="Número de grupos visuales que el algoritmo intenta formar. Un cluster es una agrupación exploratoria, no un diagnóstico."
          value={String(run.n_clusters)}
        />
        <MetricCard
          label="ARI KMeans/GMM"
          help="Mide cuánto se parecen los grupos obtenidos con KMeans y GMM. Valores cercanos a 1 indican alta coincidencia; valores cercanos a 0 indican baja coincidencia."
          value={formatMetric(run.metrics?.ari_kmeans_gmm)}
        />
        <MetricCard
          label="ARI consenso"
          help="Compara KMeans con el resultado de consenso, si se activó. Sirve para estimar estabilidad de los grupos, no validez clínica."
          value={formatMetric(run.metrics?.ari_kmeans_consensus)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card data-tour-id="subphenotypes__pca-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleDot className="size-4" />
              PCA por cluster
              <ContextHelp text="PCA reduce los embeddings de la red a dos coordenadas para ver si las imágenes tienden a agruparse visualmente. La distancia ayuda a explorar similitud, pero no confirma enfermedad." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAssignments ? (
              <LoadingSpinner label="Cargando asignaciones" />
            ) : (
              <PcaScatter assignments={assignments} />
            )}
          </CardContent>
        </Card>

        <Card data-tour-id="subphenotypes__distribution-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Distribución
              <ContextHelp text="Muestra cuántas imágenes quedaron en cada cluster. Si un cluster contiene muy pocas imágenes, conviene interpretarlo con cautela." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClusterDistribution run={run} />
          </CardContent>
        </Card>
      </div>

      <Card data-tour-id="subphenotypes__assignments-table">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2 className="size-4" />
            Imágenes asignadas
            <ContextHelp text="Cada fila muestra a qué cluster fue asignada una imagen y sus métricas básicas de calidad. Despliega una fila para revisar la imagen y su Grad-CAM si ya tiene análisis clínico." />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAssignments ? (
            <LoadingSpinner label="Cargando imágenes" />
          ) : assignments.length ? (
            <div className="space-y-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Imagen</TableHead>
                    <TableHead>
                      <span className="inline-flex items-center gap-1">
                        Cluster
                        <ContextHelp text="Grupo visual asignado por KMeans. Sirve para explorar similitudes morfológicas entre imágenes." />
                      </span>
                    </TableHead>
                    <TableHead>PC1</TableHead>
                    <TableHead>PC2</TableHead>
                    <TableHead>
                      <span className="inline-flex items-center gap-1">
                        Nitidez
                        <ContextHelp text="Varianza Laplaciana. Valores bajos suelen indicar imagen borrosa o con poco detalle." />
                      </span>
                    </TableHead>
                    <TableHead>
                      <span className="inline-flex items-center gap-1">
                        Contraste
                        <ContextHelp text="Contraste RMS. Ayuda a identificar imágenes planas o con poca separación entre estructuras." />
                      </span>
                    </TableHead>
                    <TableHead>Saturación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>{assignment.patient_external_code ?? compactId(assignment.patient_id)}</TableCell>
                      <TableCell>{assignment.original_filename ?? compactId(assignment.image_id)}</TableCell>
                      <TableCell>
                        <ClusterBadge cluster={assignment.cluster_label} />
                      </TableCell>
                      <TableCell>{formatMetric(assignment.pc1)}</TableCell>
                      <TableCell>{formatMetric(assignment.pc2)}</TableCell>
                      <TableCell>
                        {formatMetric(assignment.quality_metrics.sharpness_laplacian)}
                      </TableCell>
                      <TableCell>{formatMetric(assignment.quality_metrics.rms_contrast)}</TableCell>
                      <TableCell>
                        {formatMetric(assignment.quality_metrics.saturation_percent)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="space-y-2" data-tour-id="subphenotypes__assignment-image-disclosures">
                {assignments.map((assignment) => (
                  <AssignmentImageDisclosure key={assignment.id} assignment={assignment} />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
              Esta corrida aún no tiene asignaciones.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function AssignmentImageDisclosure({ assignment }: { assignment: SubphenotypeAssignmentRead }) {
  const [open, setOpen] = useState(false);
  const imageFileQuery = useImageFile(assignment.image_id, open);
  const heatmapQuery = useHeatmap(assignment.image_id, open);
  const label = assignment.original_filename ?? compactId(assignment.image_id);

  return (
    <details
      className="group overflow-hidden rounded-lg border bg-background"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-muted/60">
        <span className="flex min-w-0 items-center gap-2">
          <ImageIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="truncate font-medium">{label}</span>
          <ClusterBadge cluster={assignment.cluster_label} />
        </span>
        <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
          Ver imagen y Grad-CAM
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>
      <div className="space-y-3 border-t bg-muted/20 p-4">
        <p className="text-xs text-muted-foreground">
          El Grad-CAM aparece si esta imagen ya tiene una predicción clínica individual. Si no existe,
          se muestra la imagen original para revisión visual.
        </p>

        {imageFileQuery.isLoading ? <LoadingSpinner label="Cargando imagen" /> : null}
        {imageFileQuery.isError ? (
          <ErrorPanel message="No se pudo cargar la imagen original desde el almacenamiento." />
        ) : null}
        {heatmapQuery.isLoading ? <LoadingSpinner label="Cargando Grad-CAM" /> : null}
        {heatmapQuery.isError ? (
          <Alert className="border-amber-300 bg-amber-50 text-amber-950">
            <AlertTriangle className="size-4" />
            <AlertTitle>Grad-CAM no disponible</AlertTitle>
            <AlertDescription>
              Esta imagen no tiene mapa Grad-CAM disponible. Ejecute el análisis clínico de la
              imagen para generarlo.
            </AlertDescription>
          </Alert>
        ) : null}

        {imageFileQuery.data ? (
          <HeatmapViewer
            originalImageBlob={imageFileQuery.data}
            heatmapBlob={heatmapQuery.data}
          />
        ) : null}
      </div>
    </details>
  );
}

function MetricCard({
  label,
  value,
  help,
}: {
  label: string;
  value: string;
  help: string;
}) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
          <ContextHelp text={help} />
        </p>
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function ClusterDistribution({ run }: { run: SubphenotypeRunRead }) {
  const distribution = run.summary?.cluster_distribution ?? {};
  const total = Object.values(distribution).reduce((sum, value) => sum + value, 0);
  if (!total) {
    return <p className="text-sm text-muted-foreground">Sin distribución disponible.</p>;
  }

  return (
    <div className="space-y-3">
      {Object.entries(distribution).map(([cluster, count]) => {
        const percent = total ? Math.round((count / total) * 100) : 0;
        return (
          <div key={cluster} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <ClusterBadge cluster={Number(cluster)} />
              <span className="font-mono text-xs text-muted-foreground">
                {count} imágenes · {percent}%
              </span>
            </div>
            <div className="h-2 rounded-md bg-muted">
              <div
                className="h-2 rounded-md"
                style={{
                  width: `${percent}%`,
                  backgroundColor: colorForCluster(Number(cluster)),
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PcaScatter({ assignments }: { assignments: SubphenotypeAssignmentRead[] }) {
  if (!assignments.length) {
    return (
      <div className="flex aspect-[16/9] min-h-72 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        Sin puntos PCA para mostrar.
      </div>
    );
  }

  const xs = assignments.map((item) => item.pc1);
  const ys = assignments.map((item) => item.pc2);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const padX = Math.max((maxX - minX) * 0.12, 0.5);
  const padY = Math.max((maxY - minY) * 0.12, 0.5);
  const view = { width: 720, height: 360, left: 48, right: 20, top: 20, bottom: 42 };
  const plotWidth = view.width - view.left - view.right;
  const plotHeight = view.height - view.top - view.bottom;

  function scaleX(value: number) {
    return view.left + ((value - minX + padX) / (maxX - minX + padX * 2)) * plotWidth;
  }
  function scaleY(value: number) {
    return view.top + plotHeight - ((value - minY + padY) / (maxY - minY + padY * 2)) * plotHeight;
  }

  const clusters = Array.from(new Set(assignments.map((item) => item.cluster_label))).sort(
    (a, b) => a - b,
  );

  return (
    <div className="space-y-3">
      <svg
        role="img"
        aria-label="Puntos PCA coloreados por cluster"
        viewBox={`0 0 ${view.width} ${view.height}`}
        className="aspect-[16/9] min-h-72 w-full rounded-md border bg-white"
      >
        <line
          x1={view.left}
          x2={view.left}
          y1={view.top}
          y2={view.top + plotHeight}
          stroke="#cbd5e1"
        />
        <line
          x1={view.left}
          x2={view.left + plotWidth}
          y1={view.top + plotHeight}
          y2={view.top + plotHeight}
          stroke="#cbd5e1"
        />
        <text x={view.left + plotWidth / 2} y={view.height - 10} textAnchor="middle" fontSize="12" fill="#475569">
          PC1
        </text>
        <text
          x="14"
          y={view.top + plotHeight / 2}
          textAnchor="middle"
          fontSize="12"
          fill="#475569"
          transform={`rotate(-90 14 ${view.top + plotHeight / 2})`}
        >
          PC2
        </text>
        {assignments.map((item) => (
          <circle
            key={item.id}
            cx={scaleX(item.pc1)}
            cy={scaleY(item.pc2)}
            r="6"
            fill={colorForCluster(item.cluster_label)}
            opacity="0.82"
          />
        ))}
      </svg>
      <div className="flex flex-wrap gap-2">
        {clusters.map((cluster) => (
          <ClusterBadge key={cluster} cluster={cluster} />
        ))}
      </div>
    </div>
  );
}

export function SubphenotypeStatusBadge({ status }: { status: SubphenotypeRunStatus }) {
  const styles: Record<SubphenotypeRunStatus, string> = {
    running: "border-blue-700 bg-blue-50 text-blue-800",
    completed: "border-emerald-700 bg-emerald-50 text-emerald-800",
    failed: "border-red-700 bg-red-50 text-red-800",
  };
  const labels: Record<SubphenotypeRunStatus, string> = {
    running: "Ejecutando",
    completed: "Completada",
    failed: "Fallida",
  };

  return (
    <Badge variant="outline" className={cn("w-fit", styles[status])}>
      {labels[status]}
    </Badge>
  );
}

export function ClusterBadge({ cluster }: { cluster: number }) {
  return (
    <Badge
      variant="outline"
      className="w-fit"
      style={{ borderColor: colorForCluster(cluster), color: colorForCluster(cluster) }}
    >
      Cluster {cluster}
    </Badge>
  );
}

export function ContextHelp({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Ayuda contextual"
        >
          <HelpCircle className="size-3.5" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6} className="max-w-72 leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function colorForCluster(cluster: number) {
  return CLUSTER_COLORS[Math.abs(cluster) % CLUSTER_COLORS.length];
}

export function formatMetric(value: number | null | undefined | unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(3) : "No disponible";
}
