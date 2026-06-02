import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AIActDisclaimer() {
  return (
    <Alert className="border-amber-300 bg-amber-50 text-amber-950">
      <TriangleAlert className="size-4" aria-hidden="true" />
      <AlertTitle>Supervisión humana obligatoria</AlertTitle>
      <AlertDescription>
        Biotecare es una herramienta de soporte diagnóstico basada en inteligencia artificial. Sus
        resultados son orientativos y no constituyen un diagnóstico médico definitivo. La decisión
        clínica final corresponde exclusivamente al médico responsable, quien debe revisar, aceptar
        o rechazar cada predicción.
      </AlertDescription>
    </Alert>
  );
}
