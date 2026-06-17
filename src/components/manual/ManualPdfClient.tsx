"use client";

// Este archivo se importa dinámicamente con ssr:false desde ManualPdfSection.tsx.
// IMPORTANTE: No mover las importaciones de @react-pdf/renderer a otro archivo;
// deben vivir en el mismo chunk para que la librería se inicialice correctamente.
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Download, FileText, Loader2 } from "lucide-react";
import { ManualPdfDocument } from "./ManualPdf";
import { APP_MANUAL_NAME } from "@/lib/manual/manualSections";

export type ManualPdfMode = "download" | "viewer";

interface ManualPdfClientProps {
  mode: ManualPdfMode;
}

export function ManualPdfClient({ mode }: ManualPdfClientProps) {
  if (mode === "download") {
    return (
      <div className="rounded-xl border bg-card p-4 shadow-xs">
        <PDFDownloadLink
          document={<ManualPdfDocument />}
          fileName="biotecare-manual-usuario.pdf"
          aria-label={`Descargar manual de usuario de ${APP_MANUAL_NAME} en PDF`}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {({ loading }) =>
            loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Preparando PDF...
              </>
            ) : (
              <>
                <Download className="size-4" aria-hidden="true" />
                Descargar PDF
              </>
            )
          }
        </PDFDownloadLink>
        <p className="mt-3 text-xs text-muted-foreground">
          La generación puede tardar unos segundos porque el documento se crea en el navegador.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="hidden lg:block">
        <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
          <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="size-3 rounded-full bg-red-400" aria-hidden="true" />
              <span className="size-3 rounded-full bg-amber-400" aria-hidden="true" />
              <span className="size-3 rounded-full bg-green-400" aria-hidden="true" />
            </div>
            <span className="text-xs text-muted-foreground">
              biotecare-manual-usuario.pdf
            </span>
          </div>
          <PDFViewer width="100%" height={680} showToolbar={false}>
            <ManualPdfDocument />
          </PDFViewer>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-xl border bg-card py-6 text-center lg:hidden">
        <FileText className="size-9 text-muted-foreground" aria-hidden="true" />
        <p className="max-w-md px-4 text-sm text-muted-foreground">
          La vista previa PDF está disponible en pantallas de escritorio.
          Para móviles, usa la opción de preparar descarga.
        </p>
      </div>
    </div>
  );
}
