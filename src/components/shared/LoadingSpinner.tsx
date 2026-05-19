import { Loader2 } from "lucide-react";

export function LoadingSpinner({ label = "Cargando" }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground" role="status">
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
