"use client";

// Este archivo se importa dinámicamente con ssr:false desde ManualPdfSection.tsx.
// IMPORTANTE: No mover las importaciones de @react-pdf/renderer a otro archivo;
// deben vivir en el mismo chunk para que la librería se inicialice correctamente.
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Download, FileText, Loader2 } from "lucide-react";
import { ManualPdfDocument } from "./ManualPdf";
import { APP_MANUAL_NAME } from "@/lib/manual/manualSections";

export function ManualPdfClient() {
  return (
    <>
      {/* Visor inline (solo desktop) */}
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

      {/* Botón de descarga (siempre visible) */}
      <div className="mt-4 flex flex-col items-start gap-3 lg:mt-3">
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
                Generando PDF…
              </>
            ) : (
              <>
                <Download className="size-4" aria-hidden="true" />
                Descargar PDF
              </>
            )
          }
        </PDFDownloadLink>

        {/* Fallback móvil */}
        <div className="flex flex-col items-center gap-3 py-6 text-center lg:hidden">
          <FileText className="size-9 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            El visor PDF está disponible en pantallas de escritorio.
            Usa el botón de arriba para descargar el documento.
          </p>
        </div>
      </div>
    </>
  );
}
