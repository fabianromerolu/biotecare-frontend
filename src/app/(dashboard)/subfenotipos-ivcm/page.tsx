"use client";

import {
  Activity,
  AlertTriangle,
  Eye,
  FlaskConical,
  Play,
  RefreshCw,
  Settings2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContextHelp, SubphenotypeStatusBadge } from "@/components/subphenotypes/SubphenotypeRunDetail";
import { ErrorPanel } from "@/components/shared/ErrorPanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { usePatients } from "@/hooks/usePatients";
import {
  useCreateSubphenotypeRun,
  useDeleteSubphenotypeRun,
  useSubphenotypeRuns,
} from "@/hooks/useSubphenotypes";
import { compactId, formatDate } from "@/lib/utils/formatters";
import type { SubphenotypeRunRead } from "@/types/api";

export default function SubphenotypePage() {
  const router = useRouter();
  const patientsQuery = usePatients();
  const runsQuery = useSubphenotypeRuns();
  const createRun = useCreateSubphenotypeRun();
  const deleteRun = useDeleteSubphenotypeRun();
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [nClusters, setNClusters] = useState(3);
  const [pcaComponents, setPcaComponents] = useState(2);
  const [useGmm, setUseGmm] = useState(true);
  const [useConsensus, setUseConsensus] = useState(true);
  const [randomSeed, setRandomSeed] = useState(42);

  function togglePatient(patientId: string) {
    setSelectedPatientIds((current) =>
      current.includes(patientId)
        ? current.filter((id) => id !== patientId)
        : [...current, patientId],
    );
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
        onSuccess: (run) => router.push(`/subfenotipos-ivcm/${run.id}`),
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
            <ContextHelp text="Módulo de investigación para explorar subgrupos visuales en imágenes IVCM. No reemplaza el diagnóstico clínico ni modifica predicciones existentes." />
          </div>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Fenotipado visual no supervisado sobre imágenes IVCM ya cargadas en Biotecare.
          </p>
        </div>
        <Button
          variant="outline"
          data-tour-id="subphenotypes__refresh-button"
          onClick={() => runsQuery.refetch()}
        >
          <RefreshCw />
          Refrescar
        </Button>
      </div>

      <Alert
        className="border-amber-300 bg-amber-50 text-amber-950"
        data-tour-id="subphenotypes__disclaimer"
      >
        <AlertTriangle className="size-4" />
        <AlertTitle>Módulo exploratorio</AlertTitle>
        <AlertDescription>
          Este módulo es exploratorio y no constituye diagnóstico clínico.
        </AlertDescription>
      </Alert>

      <div className="grid gap-3 md:grid-cols-3" data-tour-id="subphenotypes__guide-hints">
        <GuideHint
          title="Mínimo de imágenes"
          text="Necesitas al menos 6 imágenes IVCM legibles del médico actual para crear una corrida."
          help="Las imágenes deben tener archivo disponible o respaldo en base de datos y formato decodificable."
        />
        <GuideHint
          title="Salida no diagnóstica"
          text="Los clusters se guardan aparte de Prediction y sirven para investigación visual."
          help="Los clusters no se usan como diagnóstico ni cambian la revisión médica."
        />
        <GuideHint
          title="Lectura recomendada"
          text="Compara PCA, ARI y calidad antes de interpretar cualquier subgrupo."
          help="Si un cluster coincide con mala calidad de imagen, puede ser un artefacto técnico y no un patrón clínico."
        />
      </div>

      <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card data-tour-id="subphenotypes__new-run-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="size-4" />
              Nueva corrida
              <ContextHelp text="Una corrida es una ejecución completa de exploración sobre un conjunto de imágenes. Guarda configuración, métricas y asignaciones." />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <NumberField
                label="Clusters"
                help="Número de grupos visuales que intentará formar el algoritmo. Empieza con 3 salvo que tengas un motivo técnico para cambiarlo."
                min={2}
                max={12}
                value={nClusters}
                onChange={setNClusters}
              />
              <NumberField
                label="PCA components"
                help="Componentes principales calculados. Para visualización usa 2, porque el gráfico muestra PC1 y PC2."
                min={2}
                max={32}
                value={pcaComponents}
                onChange={setPcaComponents}
              />
              <NumberField
                label="Semilla"
                help="Valor que ayuda a reproducir la corrida. Si usas la misma semilla y datos, el resultado debería ser comparable."
                min={0}
                max={999999}
                value={randomSeed}
                onChange={setRandomSeed}
              />
            </div>

            <div className="space-y-3" data-tour-id="subphenotypes__patient-selector">
              <ToggleLine
                checked={useGmm}
                label="Comparar con GMM"
                help="GMM es otro método de clustering. Compararlo con KMeans ayuda a estimar si los grupos son estables."
                onChange={setUseGmm}
              />
              <ToggleLine
                checked={useConsensus}
                label="Activar consensus clustering"
                help="El consenso repite agrupaciones y resume estabilidad. Es más costoso, pero aporta una referencia adicional."
                onChange={setUseConsensus}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1">
                  <Label>Pacientes</Label>
                  <ContextHelp text="Si no seleccionas pacientes, la corrida usará todas las imágenes disponibles del médico actual." />
                </span>
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
                Sin selección manual, el módulo usa todas las imágenes disponibles del médico.
              </p>
            </div>

            <Button
              className="w-full"
              data-tour-id="subphenotypes__run-button"
              onClick={submitRun}
              disabled={createRun.isPending}
            >
              {createRun.isPending ? <RefreshCw className="animate-spin" /> : <Play />}
              Ejecutar exploración
            </Button>
          </CardContent>
        </Card>

        <Card data-tour-id="subphenotypes__runs-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-4" />
              Corridas
              <ContextHelp text="Historial de exploraciones realizadas. Usa Ver para abrir una pantalla independiente con resultados y Eliminar para borrar solo la corrida exploratoria." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {runsQuery.isError ? (
              <ErrorPanel message="No se pudieron cargar las corridas de subfenotipos IVCM." />
            ) : runsQuery.isLoading ? (
              <LoadingSpinner label="Cargando corridas" />
            ) : runsQuery.data?.length ? (
              <SubphenotypeRunsTable
                runs={runsQuery.data}
                deletingRunId={deleteRun.variables}
                isDeleting={deleteRun.isPending}
                onDelete={(runId) => deleteRun.mutate(runId)}
              />
            ) : (
              <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                Aún no hay corridas de subfenotipos IVCM. Crea una corrida con al menos 6 imágenes
                IVCM o usa Ver guía en la barra superior para revisar el flujo recomendado.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function SubphenotypeRunsTable({
  runs,
  deletingRunId,
  isDeleting,
  onDelete,
}: {
  runs: SubphenotypeRunRead[];
  deletingRunId: string | undefined;
  isDeleting: boolean;
  onDelete: (runId: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Corrida</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Imágenes</TableHead>
          <TableHead>Clusters</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {runs.map((run) => (
          <TableRow key={run.id}>
            <TableCell className="font-mono text-xs">{compactId(run.id)}</TableCell>
            <TableCell>
              <SubphenotypeStatusBadge status={run.status} />
            </TableCell>
            <TableCell>{run.n_images}</TableCell>
            <TableCell>{run.n_clusters}</TableCell>
            <TableCell>{formatDate(run.created_at)}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/subfenotipos-ivcm/${run.id}`}>
                    <Eye />
                    Ver
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isDeleting}>
                      <Trash2 />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogMedia className="bg-destructive/10 text-destructive">
                        <Trash2 />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Eliminar corrida</AlertDialogTitle>
                      <AlertDialogDescription>
                        Se eliminará la corrida {compactId(run.id)} y sus asignaciones. Las imágenes,
                        predicciones clínicas y revisiones médicas no se modificarán.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={() => onDelete(run.id)}
                      >
                        {isDeleting && deletingRunId === run.id
                          ? "Eliminando..."
                          : "Eliminar definitivamente"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function GuideHint({ title, text, help }: { title: string; text: string; help: string }) {
  return (
    <div className="rounded-md border bg-card px-4 py-3">
      <p className="flex items-center gap-1 text-sm font-semibold">
        {title}
        <ContextHelp text={help} />
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

function NumberField({
  label,
  help,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  help: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="inline-flex items-center gap-1">
        <Label>{label}</Label>
        <ContextHelp text={help} />
      </span>
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
  help,
  onChange,
}: {
  checked: boolean;
  label: string;
  help: string;
  onChange: (value: boolean) => void;
}) {
  const inputId = `subphenotypes-toggle-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
      <span className="inline-flex items-center gap-1">
        <Label htmlFor={inputId} className="cursor-pointer font-normal">
          {label}
        </Label>
        <ContextHelp text={help} />
      </span>
      <input
        id={inputId}
        type="checkbox"
        className="size-4 accent-primary"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </div>
  );
}
