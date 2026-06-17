"use client";

import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { ErrorPanel } from "@/components/shared/ErrorPanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SubphenotypeRunDetail } from "@/components/subphenotypes/SubphenotypeRunDetail";
import {
  useDeleteSubphenotypeRun,
  useSubphenotypeAssignments,
  useSubphenotypeRun,
} from "@/hooks/useSubphenotypes";

export function SubphenotypeRunDetailClient({ runId }: { runId: string }) {
  const router = useRouter();
  const runQuery = useSubphenotypeRun(runId);
  const assignmentsQuery = useSubphenotypeAssignments(runId);
  const deleteRun = useDeleteSubphenotypeRun();

  if (runQuery.isLoading) {
    return <LoadingSpinner label="Cargando corrida" />;
  }

  if (runQuery.isError || !runQuery.data) {
    return <ErrorPanel message="No se pudo cargar la corrida seleccionada." />;
  }

  const run = runQuery.data;

  return (
    <div className="space-y-5">
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" asChild>
          <Link href="/subfenotipos-ivcm">
            <ArrowLeft className="size-4" />
            Volver a corridas
          </Link>
        </Button>
      </div>

      <SubphenotypeRunDetail
        run={run}
        assignments={assignmentsQuery.data ?? []}
        loadingAssignments={assignmentsQuery.isLoading}
        actions={
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={deleteRun.isPending}>
                <Trash2 />
                Eliminar corrida
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive">
                  <Trash2 />
                </AlertDialogMedia>
                <AlertDialogTitle>Eliminar corrida</AlertDialogTitle>
                <AlertDialogDescription>
                  Se eliminará esta corrida exploratoria y sus asignaciones. Las imágenes,
                  predicciones clínicas y Grad-CAM existentes no se modificarán.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteRun.isPending}>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={deleteRun.isPending}
                  onClick={() =>
                    deleteRun.mutate(run.id, {
                      onSuccess: () => router.push("/subfenotipos-ivcm"),
                    })
                  }
                >
                  {deleteRun.isPending ? "Eliminando..." : "Eliminar definitivamente"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        }
      />
    </div>
  );
}
