"use client";

import dynamic from "next/dynamic";
import { FileText, Loader2 } from "lucide-react";
import { MANUAL_VERSION, MANUAL_DATE } from "@/lib/manual/manualSections";

// Importar el módulo completo con ssr:false para que @react-pdf/renderer
// se inicialice en un único chunk de browser y no rompa su estado interno.
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
      <ManualPdfClient />
    </section>
  );
}
