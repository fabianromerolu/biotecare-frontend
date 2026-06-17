"use client";

import {
  Activity,
  AlertTriangle,
  CircleDot,
  FlaskConical,
  Play,
  RefreshCw,
  Settings2,
  Table2,
} from "lucide-react";
import { useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ErrorPanel } from "@/components/shared/ErrorPanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { usePatients } from "@/hooks/usePatients";
import {
  useCreateSubphenotypeRun,
  useSubphenotypeAssignments,
  useSubphenotypeRuns,
} from "@/hooks/useSubphenotypes";
import { compactId, formatDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import type {
  SubphenotypeAssignmentRead,
  SubphenotypeRunRead,
  SubphenotypeRunStatus,
} from "@/types/api";

const CLUSTER_COLORS = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#ea580c", "#0891b2"];

export default function SubphenotypePage() {
  const patientsQuery = usePatients();
  const runsQuery = useSubphenotypeRuns();
  const createRun = useCreateSubphenotypeRun();
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string>();
  const [nClusters, setNClusters] = useState(3);
  const [pcaComponents, setPcaComponents] = useState(2);
  const [useGmm, setUseGmm] = useState(true);
  const [useConsensus, setUseConsensus] = useState(true);
  const [randomSeed, setRandomSeed] = useState(42);
  const resultsRef = useRef<HTMLDivElement>(null);

  const activeRunId = selectedRunId ?? runsQuery.data?.[0]?.id;

  const selectedRun = runsQuery.data?.find((run) => run.id === activeRunId) ?? null;
  const assignmentsQuery = useSubphenotypeAssignments(activeRunId);

  function togglePatient(patientId: string) {
    setSelectedPatientIds((current) =>
      current.includes(patientId)
        ? current.filter((id) => id !== patientId)
        : [...current, patientId],
    );
  }

  function showRunDetail(runId: string) {
    setSelectedRunId(runId);
    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      resultsRef.current?.focus({ preventScroll: true });
    });
  }

  function submitRun() {
    createRun.mutate(
      {
        patient_ids: selectedPatientIds,
        n_clusters: nClusters,
        pca_components: pcaComponents,
        use_gmm: useGmm,
        use_consensus: useConsensus,
        random_seed: randomSeed,
      },
      {
        onSuccess: (run) => showRunDetail(run.id),
      },
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="flex flex-col justify-between gap-3 md:flex-row md:items-start"
        data-tour-id="subphenotypes__header"
      >
        <div>
          <div className="mb-1 flex items-center gap-2">
            <FlaskConical className="size-5 text-primary" aria-hidden="true" />
            <h1 className="text-2xl font-bold tracking-tight">Subfenotipos IVCM</h1>
          </div>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Fenotipado visual no supervisado sobre imagenes IVCM ya cargadas en Biotecare.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            data-tour-id="subphenotypes__refresh-button"
            onClick={() => {
              runsQuery.refetch();
              if (activeRunId) {
                assignmentsQuery.refetch();
              }
            }}
          >
            <RefreshCw />
            Refrescar
          </Button>
        </div>
      </div>

      <Alert
        className="border-amber-300 bg-amber-50 text-amber-950"
        data-tour-id="subphenotypes__disclaimer"
      >
        <AlertTriangle className="size-4" />
        <AlertTitle>Modulo exploratorio</AlertTitle>
        <AlertDescription>
          Este modulo es exploratorio y no constituye diagnostico clinico.
        </AlertDescription>
      </Alert>

      <div className="grid gap-3 md:grid-cols-3" data-tour-id="subphenotypes__guide-hints">
        <GuideHint
          title="Minimo de imagenes"
          text="Necesitas al menos 6 imagenes IVCM del medico actual para crear una corrida."
        />
        <GuideHint
          title="Salida no diagnostica"
          text="Los clusters se guardan aparte de Prediction y sirven para investigacion visual."
        />
        <GuideHint
          title="Lectura recomendada"
          text="Compara PCA, ARI y calidad antes de interpretar cualquier subgrupo."
        />
      </div>

      <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card data-tour-id="subphenotypes__new-run-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="size-4" />
              Nueva corrida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <NumberField
                label="Clusters"
                min={2}
                max={12}
                value={nClusters}
                onChange={setNClusters}
              />
              <NumberField
                label="PCA components"
                min={2}
                max={32}
                value={pcaComponents}
                onChange={setPcaComponents}
              />
              <NumberField
                label="Semilla"
                min={0}
                max={999999}
                value={randomSeed}
                onChange={setRandomSeed}
              />
            </div>

            <div className="space-y-3" data-tour-id="subphenotypes__patient-selector">
              <ToggleLine checked={useGmm} label="Comparar con GMM" onChange={setUseGmm} />
              <ToggleLine
                checked={useConsensus}
                label="Activar consensus clustering"
                onChange={setUseConsensus}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Label>Pacientes</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedPatientIds([])}>
                  Usar todos
                </Button>
              </div>
              <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border p-2">
                {patientsQuery.isLoading ? (
                  <LoadingSpinner label="Cargando pacientes" />
                ) : patientsQuery.data?.length ? (
                  patientsQuery.data.map((patient) => (
                    <label
                      key={patient.id}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                    >
                      <input
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={selectedPatientIds.includes(patient.id)}
                        onChange={() => togglePatient(patient.id)}
                      />
                      <span className="truncate">{patient.external_code}</span>
                    </label>
                  ))
                ) : (
                  <p className="px-2 py-3 text-sm text-muted-foreground">No hay pacientes.</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Sin seleccion manual, el modulo usa todas las imagenes disponibles del medico.
              </p>
            </div>

            <Button
              className="w-full"
              data-tour-id="subphenotypes__run-button"
              onClick={submitRun}
              disabled={createRun.isPending}
            >
              {createRun.isPending ? <RefreshCw className="animate-spin" /> : <Play />}
              Ejecutar exploracion
            </Button>
          </CardContent>
        </Card>

        <Card data-tour-id="subphenotypes__runs-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-4" />
              Corridas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {runsQuery.isError ? (
              <ErrorPanel message="No se pudieron cargar las corridas de subfenotipos IVCM." />
            ) : runsQuery.isLoading ? (
              <LoadingSpinner label="Cargando corridas" />
            ) : runsQuery.data?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Corrida</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Imagenes</TableHead>
                    <TableHead>Clusters</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runsQuery.data.map((run) => (
                    <TableRow key={run.id} data-state={run.id === activeRunId ? "selected" : undefined}>
                      <TableCell className="font-mono text-xs">{compactId(run.id)}</TableCell>
                      <TableCell>
                        <SubphenotypeStatusBadge status={run.status} />
                      </TableCell>
                      <TableCell>{run.n_images}</TableCell>
                      <TableCell>{run.n_clusters}</TableCell>
                      <TableCell>{formatDate(run.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={run.id === activeRunId ? "default" : "outline"}
                          size="sm"
                          aria-label={`Ver detalle de la corrida ${compactId(run.id)}`}
                          onClick={() => showRunDetail(run.id)}
                        >
                          {run.id === activeRunId ? "Viendo" : "Ver"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                Aun no hay corridas de subfenotipos IVCM. Crea una corrida con al menos 6 imagenes IVCM
                o use Ver guia en la barra superior para revisar el flujo recomendado.
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <div ref={resultsRef} tabIndex={-1} className="scroll-mt-6 outline-none">
        {selectedRun ? (
          <SubphenotypeRunDetail
            run={selectedRun}
            assignments={assignmentsQuery.data ?? []}
            loadingAssignments={assignmentsQuery.isLoading}
          />
        ) : (
          <SubphenotypeResultsGuidePlaceholder />
        )}
      </div>
    </div>
  );
}

function SubphenotypeResultsGuidePlaceholder() {
  return (
    <section className="space-y-4" data-tour-id="subphenotypes__run-detail">
      <div>
        <h2 className="text-xl font-semibold">Vista de resultados</h2>
        <p className="text-sm text-muted-foreground">
          Al crear o seleccionar una corrida, esta zona mostrara las metricas, el PCA, la
          distribucion de clusters y la tabla de imagenes asignadas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" data-tour-id="subphenotypes__metrics">
        <MetricCard label="Imagenes" value="-" />
        <MetricCard label="Clusters" value="-" />
        <MetricCard label="ARI KMeans/GMM" value="-" />
        <MetricCard label="ARI consenso" value="-" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card data-tour-id="subphenotypes__pca-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleDot className="size-4" />
              PCA por cluster
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex aspect-[16/9] min-h-72 items-center justify-center rounded-md border border-dashed text-center text-sm text-muted-foreground">
              Ejecute una corrida para ver PC1 y PC2 coloreados por cluster.
            </div>
          </CardContent>
        </Card>

        <Card data-tour-id="subphenotypes__distribution-card">
          <CardHeader>
            <CardTitle>Distribucion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[0, 1, 2].map((cluster) => (
                <div key={cluster} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <ClusterBadge cluster={cluster} />
                    <span className="font-mono text-xs text-muted-foreground">pendiente</span>
                  </div>
                  <div className="h-2 rounded-md bg-muted" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card data-tour-id="subphenotypes__assignments-table">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2 className="size-4" />
            Imagenes asignadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            Las asignaciones apareceran aqui despues de completar una exploracion.
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function GuideHint({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-md border bg-card px-4 py-3">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

function NumberField({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function ToggleLine({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
      <span>{label}</span>
      <input
        type="checkbox"
        className="size-4 accent-primary"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

function SubphenotypeRunDetail({
  run,
  assignments,
  loadingAssignments,
}: {
  run: SubphenotypeRunRead;
  assignments: SubphenotypeAssignmentRead[];
  loadingAssignments: boolean;
}) {
  const warning = run.summary?.quality_warning;
  return (
    <section className="space-y-4" data-tour-id="subphenotypes__run-detail">
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-semibold">Detalle de corrida</h2>
          <p className="text-sm text-muted-foreground">
            {compactId(run.id)} Â· {run.exploratory_disclaimer}
          </p>
        </div>
        <SubphenotypeStatusBadge status={run.status} />
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
        <MetricCard label="Imagenes" value={String(run.n_images)} />
        <MetricCard label="Clusters" value={String(run.n_clusters)} />
        <MetricCard label="ARI KMeans/GMM" value={formatMetric(run.metrics?.ari_kmeans_gmm)} />
        <MetricCard
          label="ARI consenso"
          value={formatMetric(run.metrics?.ari_kmeans_consensus)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card data-tour-id="subphenotypes__pca-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleDot className="size-4" />
              PCA por cluster
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
            <CardTitle>Distribucion</CardTitle>
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
            Imagenes asignadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAssignments ? (
            <LoadingSpinner label="Cargando imagenes" />
          ) : assignments.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Cluster</TableHead>
                  <TableHead>PC1</TableHead>
                  <TableHead>PC2</TableHead>
                  <TableHead>Nitidez</TableHead>
                  <TableHead>Contraste</TableHead>
                  <TableHead>Saturacion</TableHead>
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
          ) : (
            <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
              Esta corrida aun no tiene asignaciones.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function ClusterDistribution({ run }: { run: SubphenotypeRunRead }) {
  const distribution = run.summary?.cluster_distribution ?? {};
  const total = Object.values(distribution).reduce((sum, value) => sum + value, 0);
  if (!total) {
    return <p className="text-sm text-muted-foreground">Sin distribucion disponible.</p>;
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
                {count} imagenes Â· {percent}%
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

function SubphenotypeStatusBadge({ status }: { status: SubphenotypeRunStatus }) {
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

function ClusterBadge({ cluster }: { cluster: number }) {
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

function colorForCluster(cluster: number) {
  return CLUSTER_COLORS[Math.abs(cluster) % CLUSTER_COLORS.length];
}

function formatMetric(value: number | null | undefined | unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(3) : "No disponible";
}
