"use client";

import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import type { PredictionRead } from "@/types/api";

export function DoctorReviewPanel({
  prediction,
  isPending,
  onReview,
}: {
  prediction: PredictionRead;
  isPending: boolean;
  onReview: (accepted: boolean) => void;
}) {
  if (prediction.doctor_override === true) {
    return (
      <ReviewBox
        title="Prediccion aceptada"
        badge={
          <Badge className="border-emerald-700 bg-emerald-50 text-emerald-800" variant="outline">
            <CheckCircle2 /> Aceptada
          </Badge>
        }
      />
    );
  }

  if (prediction.doctor_override === false) {
    return (
      <ReviewBox
        title="Prediccion rechazada"
        badge={
          <Badge className="border-amber-700 bg-amber-50 text-amber-800" variant="outline">
            <XCircle /> Rechazada
          </Badge>
        }
      />
    );
  }

  return (
    <section className="rounded-lg border bg-card p-4" aria-labelledby="review-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="review-title" className="text-sm font-semibold">
            Revision medica
          </h2>
          <Badge className="mt-2 border-amber-700 bg-amber-50 text-amber-800" variant="outline">
            <Clock3 /> Pendiente de revision
          </Badge>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ReviewAction
            accepted
            disabled={isPending}
            label={isPending ? "Registrando" : "Aceptar prediccion"}
            onConfirm={() => onReview(true)}
          />
          <ReviewAction
            disabled={isPending}
            label={isPending ? "Registrando" : "Rechazar prediccion"}
            onConfirm={() => onReview(false)}
          />
        </div>
      </div>
    </section>
  );
}

function ReviewBox({ title, badge }: { title: string; badge: React.ReactNode }) {
  return (
    <section className="rounded-lg border bg-card p-4" aria-labelledby="review-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="review-title" className="text-sm font-semibold">
          {title}
        </h2>
        {badge}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        La revision registrada queda bloqueada en esta interfaz para preservar la trazabilidad.
      </p>
    </section>
  );
}

function ReviewAction({
  accepted = false,
  disabled,
  label,
  onConfirm,
}: {
  accepted?: boolean;
  disabled: boolean;
  label: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={accepted ? "default" : "outline"} disabled={disabled}>
          {accepted ? <CheckCircle2 /> : <XCircle />}
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {accepted ? "Aceptar resultado del modelo" : "Rechazar resultado del modelo"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            El resultado generado por este sistema de inteligencia artificial es unicamente un
            soporte para la decision clinica. El diagnostico final es responsabilidad exclusiva del
            medico.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {accepted ? "Aceptar" : "Rechazar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
