"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Download, Eye, FileText, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MANUAL_VERSION, MANUAL_DATE } from "@/lib/manual/manualSections";
import type { ManualPdfMode } from "./ManualPdfClient";

// Importar el módulo completo con ssr:false para que @react-pdf/renderer
// se inicialice solo cuando el usuario prepara o previsualiza el PDF.
const ManualPdfClient = dynamic(
  () => import("./ManualPdfClient").then((m) => m.ManualPdfClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        Cargando visor de PDF…
      </div>
    ),
  },
);

export function ManualPdfSection() {
  const [mode, setMode] = useState<ManualPdfMode | null>(null);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <FileText className="size-5 text-primary" aria-hidden="true" />
          Manual completo del sistema
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Versión {MANUAL_VERSION} · {MANUAL_DATE} · Documento PDF listo para imprimir y archivar
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-xs">
        <p className="text-sm text-muted-foreground">
          Para que el manual web abra más rápido, el PDF completo se prepara solo cuando se solicita.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant={mode === "download" ? "default" : "outline"}
            onClick={() => setMode("download")}
          >
            <Download className="size-4" aria-hidden="true" />
            Preparar descarga
          </Button>
          <Button
            type="button"
            variant={mode === "viewer" ? "default" : "outline"}
            onClick={() => setMode("viewer")}
            className="hidden lg:inline-flex"
          >
            <Eye className="size-4" aria-hidden="true" />
            Ver vista previa
          </Button>
          {mode && (
            <Button type="button" variant="ghost" onClick={() => setMode(null)}>
              <X className="size-4" aria-hidden="true" />
              Cerrar PDF
            </Button>
          )}
        </div>
      </div>

      {mode && <ManualPdfClient mode={mode} />}
    </section>
  );
}
