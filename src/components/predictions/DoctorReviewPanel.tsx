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
        title="Revisión completada"
        badge={
          <Badge className="border-emerald-700 bg-emerald-50 text-emerald-800" variant="outline">
            <CheckCircle2 /> Aceptada
          </Badge>
        }
        note="Predicción aceptada por el médico responsable."
      />
    );
  }

  if (prediction.doctor_override === false) {
    return (
      <ReviewBox
        title="Revisión completada"
        badge={
          <Badge className="border-amber-700 bg-amber-50 text-amber-800" variant="outline">
            <XCircle /> Rechazada
          </Badge>
        }
        note="Predicción rechazada por el médico responsable."
      />
    );
  }

  return (
    <section className="rounded-lg border bg-card p-4" aria-labelledby="review-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="review-title" className="text-sm font-semibold">
            Revisión médica
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Confirme su valoración clínica del resultado.
          </p>
          <Badge className="mt-2 border-amber-700 bg-amber-50 text-amber-800" variant="outline">
            <Clock3 /> Pendiente de revisión
          </Badge>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ReviewAction
            accepted
            disabled={isPending}
            label={isPending ? "Registrando…" : "Aceptar resultado"}
            onConfirm={() => onReview(true)}
          />
          <ReviewAction
            disabled={isPending}
            label={isPending ? "Registrando…" : "Rechazar resultado"}
            onConfirm={() => onReview(false)}
          />
        </div>
      </div>
    </section>
  );
}

function ReviewBox({
  title,
  badge,
  note,
}: {
  title: string;
  badge: React.ReactNode;
  note: string;
}) {
  return (
    <section className="rounded-lg border bg-card p-4" aria-labelledby="review-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="review-title" className="text-sm font-semibold">
          {title}
        </h2>
        {badge}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
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
            {accepted ? "Confirmar aceptación" : "Confirmar rechazo"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción quedará registrada en el expediente clínico y no puede modificarse
            posteriormente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {accepted ? "Aceptar resultado" : "Rechazar resultado"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
