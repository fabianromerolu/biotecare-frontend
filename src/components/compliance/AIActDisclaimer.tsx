import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AIActDisclaimer() {
  return (
    <Alert className="border-amber-300 bg-amber-50 text-amber-950">
      <TriangleAlert className="size-4" aria-hidden="true" />
      <AlertTitle>Supervision humana obligatoria</AlertTitle>
      <AlertDescription>
        El resultado generado por este sistema de inteligencia artificial es unicamente un soporte
        para la decision clinica. El diagnostico final es responsabilidad exclusiva del medico. Este
        sistema cumple con el Reglamento (UE) 2024/1689 del Parlamento Europeo (EU AI Act), Art. 14
        - Supervision humana.
      </AlertDescription>
    </Alert>
  );
}
