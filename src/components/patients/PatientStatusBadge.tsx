import { CheckCircle2, Clock3, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ImageRead } from "@/types/api";

export type PatientUiStatus = "empty" | "pending" | "predicted";

export function getPatientUiStatus(images: ImageRead[] | undefined): PatientUiStatus {
  if (!images || images.length === 0) {
    return "empty";
  }
  if (images.some((image) => image.status === "predicted")) {
    return "predicted";
  }
  return "pending";
}

export function PatientStatusBadge({ images }: { images: ImageRead[] | undefined }) {
  const status = getPatientUiStatus(images);
  if (status === "predicted") {
    return (
      <Badge className="border-emerald-700 bg-emerald-50 text-emerald-800" variant="outline">
        <CheckCircle2 /> Con predicción
      </Badge>
    );
  }
  if (status === "pending") {
    return (
      <Badge className="border-amber-700 bg-amber-50 text-amber-800" variant="outline">
        <Clock3 /> Pendiente
      </Badge>
    );
  }
  return (
    <Badge variant="outline">
      <ImageOff /> Sin analizar
    </Badge>
  );
}
