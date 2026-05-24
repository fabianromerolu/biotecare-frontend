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
import { Separator } from "@/components/ui/separator";
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
            <CheckCircle2 className="size-3.5" /> Aceptada
          </Badge>
        }
        note="Predicción aceptada por el médico responsable. Queda registrada en el expediente clínico."
      />
    );
  }

  if (prediction.doctor_override === false) {
    return (
      <ReviewBox
        title="Revisión completada"
        badge={
          <Badge className="border-amber-700 bg-amber-50 text-amber-800" variant="outline">
            <XCircle className="size-3.5" /> Rechazada
          </Badge>
        }
        note="Predicción rechazada por el médico responsable. Queda registrada en el expediente clínico."
      />
    );
  }

  return (
    <section
      className="flex h-full flex-col rounded-lg border bg-card p-4"
      aria-labelledby="review-title"
    >
      <div>
        <h2 id="review-title" className="text-sm font-semibold">
          Revisión médica
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Confirme su valoración clínica del resultado antes de cerrar el análisis.
        </p>
        <Badge className="mt-3 border-amber-700 bg-amber-50 text-amber-800" variant="outline">
          <Clock3 className="size-3" /> Pendiente de revisión
        </Badge>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
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

      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
        La decisión quedará registrada en el expediente y no podrá modificarse.
      </p>
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
    <section
      className="flex h-full flex-col rounded-lg border bg-card p-4"
      aria-labelledby="review-title"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 id="review-title" className="text-sm font-semibold">
          {title}
        </h2>
        {badge}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{note}</p>
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
        <Button
          variant={accepted ? "default" : "outline"}
          disabled={disabled}
          className="w-full justify-start gap-2"
        >
          {accepted ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
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
