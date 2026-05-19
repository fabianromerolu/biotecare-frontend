import { AlertTriangle, CheckCircle2, Clock3, ScanLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ImageStatus } from "@/types/api";

export function ImageStatusBadge({ status }: { status: ImageStatus }) {
  if (status === "predicted") {
    return (
      <Badge className="border-emerald-700 bg-emerald-50 text-emerald-800" variant="outline">
        <CheckCircle2 /> Predicha
      </Badge>
    );
  }
  if (status === "preprocessed") {
    return (
      <Badge className="border-sky-700 bg-sky-50 text-sky-800" variant="outline">
        <ScanLine /> Preprocesada
      </Badge>
    );
  }
  if (status === "failed") {
    return (
      <Badge className="border-red-700 bg-red-50 text-red-800" variant="outline">
        <AlertTriangle /> Error
      </Badge>
    );
  }
  return (
    <Badge className="border-amber-700 bg-amber-50 text-amber-800" variant="outline">
      <Clock3 /> Cargada
    </Badge>
  );
}
