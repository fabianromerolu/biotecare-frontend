"use client";

import { Activity, BrainCircuit, Database, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ErrorPanel } from "@/components/shared/ErrorPanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatDate } from "@/lib/utils/formatters";
import { useHealth, useModelInfo } from "@/hooks/useSystem";

export default function ModelPage() {
  const healthQuery = useHealth();
  const modelQuery = useModelInfo();
  const now = new Date().toISOString();

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">Estado del sistema</h2>
          <p className="text-sm text-muted-foreground">
            API FastAPI, base de datos y modelo ResNet-18.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            healthQuery.refetch();
            modelQuery.refetch();
          }}
        >
          <RefreshCw />
          Refrescar
        </Button>
      </div>

      {healthQuery.isError ? (
        <ErrorPanel message="No se pudo contactar el backend local en localhost:8000." />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Card data-tour-id="model__health-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="size-4" aria-hidden="true" />
              API
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthQuery.isLoading ? (
              <LoadingSpinner label="Consultando health" />
            ) : (
              <>
                <StatusLine
                  icon={Activity}
                  label="Servicio"
                  ok={healthQuery.data?.status === "ok"}
                  value={healthQuery.data?.status ?? "desconocido"}
                />
                <StatusLine
                  icon={Database}
                  label="Base de datos"
                  ok={healthQuery.data?.database === "ok"}
                  value={healthQuery.data?.database ?? "desconocido"}
                />
                <Separator />
                <p className="text-sm text-muted-foreground">
                  Ultimo refresco: {formatDate(now)}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-tour-id="model__model-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BrainCircuit className="size-4" aria-hidden="true" />
              Modelo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modelQuery.isLoading ? (
              <LoadingSpinner label="Cargando modelo" />
            ) : (
              <>
                <div>
                  <p className="text-xs text-muted-foreground">Version</p>
                  <p className="mt-1 font-mono text-sm font-medium">
                    {modelQuery.data?.model_version ?? "No disponible"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tarea</p>
                  <p className="mt-1 text-sm font-medium">
                    {modelQuery.data?.task ?? "No disponible"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Labels</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {modelQuery.data?.labels.map((label) => (
                      <Badge key={label} variant="outline">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Biomarcadores</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {modelQuery.data?.biomarkers.map((biomarker) => (
                      <Badge key={biomarker} variant="secondary">
                        {biomarker}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusLine({
  icon: Icon,
  label,
  ok,
  value,
}: {
  icon: typeof Activity;
  label: string;
  ok: boolean;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-sm">{label}</span>
      </div>
      <Badge
        className={ok ? "border-emerald-700 bg-emerald-50 text-emerald-800" : undefined}
        variant={ok ? "outline" : "destructive"}
      >
        {value}
      </Badge>
    </div>
  );
}
