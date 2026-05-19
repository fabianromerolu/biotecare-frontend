import { Clipboard, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { compactId, formatDate } from "@/lib/utils/formatters";
import type { PredictionRead } from "@/types/api";

export function AuditTrailNote({ prediction }: { prediction: PredictionRead }) {
  return (
    <section className="rounded-lg border bg-card p-4" aria-labelledby="audit-title">
      <div className="mb-3 flex items-center gap-2">
        <Clipboard className="size-4 text-primary" aria-hidden="true" />
        <h2 id="audit-title" className="text-sm font-semibold">
          Trazabilidad
        </h2>
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <AuditItem label="Prediccion">
          <span className="font-mono">{compactId(prediction.id)}</span>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Copiar ID de prediccion"
            onClick={() => {
              navigator.clipboard.writeText(prediction.id);
              toast.success("ID copiado.");
            }}
          >
            <Copy />
          </Button>
        </AuditItem>
        <AuditItem label="Modelo">{prediction.model_version}</AuditItem>
        <AuditItem label="Umbral">{prediction.threshold.toFixed(2)}</AuditItem>
        <AuditItem label="Fecha">{formatDate(prediction.created_at)}</AuditItem>
      </dl>
    </section>
  );
}

function AuditItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 flex min-h-7 items-center gap-1 break-words font-medium">{children}</dd>
    </div>
  );
}
