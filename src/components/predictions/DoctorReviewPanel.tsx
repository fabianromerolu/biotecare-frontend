"use client";

import { CheckCircle2, Clock3, Stethoscope, XCircle } from "lucide-react";
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
    return <ReviewCompleted accepted />;
  }
  if (prediction.doctor_override === false) {
    return <ReviewCompleted accepted={false} />;
  }

  return (
    <section
      className="flex h-full flex-col overflow-hidden rounded-xl border shadow-sm"
      aria-labelledby="review-title"
    >
      {/* Cabecera — pendiente en ámbar */}
      <div className="flex items-center gap-3 border-b border-amber-500/20 bg-amber-500/10 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/20">
          <Stethoscope className="size-4 text-white" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Supervisión médica
          </p>
          <div className="flex items-center gap-1.5">
            <h2 id="review-title" className="text-sm font-bold text-amber-700">
              Revisión pendiente
            </h2>
            <Clock3 className="size-3.5 text-amber-700" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col justify-between gap-4 bg-card p-4">
        <p className="text-xs text-muted-foreground">
          Confirme su valoración clínica del resultado. La decisión quedará registrada en el
          expediente y no puede modificarse.
        </p>

        <div className="space-y-2">
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

function ReviewCompleted({ accepted }: { accepted: boolean }) {
  return (
    <section
      className="flex h-full flex-col overflow-hidden rounded-xl border shadow-sm"
      aria-labelledby="review-completed-title"
    >
      <div
        className={`flex items-center gap-3 border-b p-4 ${
          accepted
            ? "border-emerald-500/20 bg-emerald-500/10"
            : "border-red-500/20 bg-red-500/10"
        }`}
      >
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl shadow-md ${
            accepted
              ? "bg-linear-to-br from-emerald-400 to-teal-600 shadow-emerald-500/20"
              : "bg-linear-to-br from-red-400 to-rose-600 shadow-red-500/20"
          }`}
        >
          {accepted ? (
            <CheckCircle2 className="size-4 text-white" aria-hidden="true" />
          ) : (
            <XCircle className="size-4 text-white" aria-hidden="true" />
          )}
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Supervisión médica
          </p>
          <h2
            id="review-completed-title"
            className={`text-sm font-bold ${accepted ? "text-emerald-700" : "text-red-700"}`}
          >
            {accepted ? "Predicción aceptada" : "Predicción rechazada"}
          </h2>
        </div>
      </div>
      <div className="flex flex-1 items-center bg-card p-4">
        <p className="text-xs text-muted-foreground">
          {accepted
            ? "El médico responsable ratificó el resultado. Queda registrado en el expediente clínico."
            : "El médico responsable descartó el resultado. Queda registrado en el expediente clínico."}
        </p>
      </div>
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
          disabled={disabled}
          className={`w-full justify-start gap-2 font-medium shadow-sm ${
            accepted
              ? "bg-linear-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
              : "border border-red-500/30 bg-red-50 text-red-700 hover:bg-red-100"
          }`}
          variant="ghost"
        >
          {accepted ? (
            <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          ) : (
            <XCircle className="size-4 shrink-0" aria-hidden="true" />
          )}
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
