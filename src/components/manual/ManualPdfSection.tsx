import { Download, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MANUAL_VERSION, MANUAL_DATE } from "@/lib/manual/manualSections";

const MANUAL_PDF_PATH = "/manual/biotecare-manual-usuario.pdf";

export function ManualPdfSection() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <FileText className="size-5 text-primary" aria-hidden="true" />
          Manual completo del sistema
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Versión {MANUAL_VERSION} · {MANUAL_DATE} · Documento PDF listo para imprimir y archivar.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-xs">
        <p className="text-sm text-muted-foreground">
          El PDF se genera previamente y se sirve como archivo estático para que esta pantalla cargue sin esperas.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <a href={MANUAL_PDF_PATH} download="biotecare-manual-usuario.pdf">
              <Download className="size-4" aria-hidden="true" />
              Descargar PDF
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={MANUAL_PDF_PATH} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" aria-hidden="true" />
              Abrir en pestaña
            </a>
          </Button>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-xl border bg-card shadow-xs lg:block">
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-red-400" aria-hidden="true" />
            <span className="size-3 rounded-full bg-amber-400" aria-hidden="true" />
            <span className="size-3 rounded-full bg-green-400" aria-hidden="true" />
          </div>
          <span className="text-xs text-muted-foreground">biotecare-manual-usuario.pdf</span>
        </div>
        <iframe
          title="Manual de usuario de Biotecare"
          src={MANUAL_PDF_PATH}
          className="h-[680px] w-full"
        />
      </div>
    </section>
  );
}
