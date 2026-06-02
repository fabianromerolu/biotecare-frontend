import { Copy, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { compactId, formatDate } from "@/lib/utils/formatters";
import type { PredictionRead } from "@/types/api";

export function AuditTrailNote({ prediction }: { prediction: PredictionRead }) {
  return (
    <section
      className="overflow-hidden rounded-xl border shadow-sm"
      aria-labelledby="audit-title"
    >
      {/* Cabecera */}
      <div className="flex items-center gap-3 border-b border-primary/20 bg-primary/10 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#00B4D8] to-cyan-600 shadow-md shadow-[#00B4D8]/20">
          <ShieldCheck className="size-4 text-white" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            EU AI Act · Art. 14
          </p>
          <h2 id="audit-title" className="text-sm font-bold text-foreground">
            Trazabilidad del análisis
          </h2>
        </div>
      </div>

      {/* Datos */}
      <div className="grid gap-4 bg-card p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <AuditItem label="ID Predicción">
          <span className="font-mono text-xs">{compactId(prediction.id)}</span>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Copiar ID de predicción"
            onClick={() => {
              navigator.clipboard.writeText(prediction.id);
              toast.success("ID copiado.");
            }}
          >
            <Copy className="size-3" />
          </Button>
        </AuditItem>
        <AuditItem label="Modelo">{prediction.model_version}</AuditItem>
        <AuditItem label="Umbral">{Math.round(prediction.threshold * 100)}%</AuditItem>
        <AuditItem label="Fecha">{formatDate(prediction.created_at)}</AuditItem>
      </div>
    </section>
  );
}

function AuditItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 flex min-h-6 items-center gap-1 wrap-break-word font-medium">{children}</div>
    </div>
  );
}
