"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import Link from "next/link";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PatientCreateSchema,
  PatientUpdateSchema,
} from "@/lib/schemas/patient";
import type { PatientRead } from "@/types/api";

type PatientFormInput = {
  external_code?: string;
  birth_year?: number | null | "";
  sex?: "F" | "M" | "O" | null;
};

export function PatientForm({
  mode,
  patient,
  isPending,
  onSubmit,
}: {
  mode: "create" | "edit";
  patient?: PatientRead;
  isPending: boolean;
  onSubmit: (values: PatientFormInput) => void;
}) {
  const schema = mode === "create" ? PatientCreateSchema : PatientUpdateSchema;
  const form = useForm<PatientFormInput>({
    resolver: zodResolver(schema) as Resolver<PatientFormInput>,
    defaultValues: {
      external_code: patient?.external_code ?? "",
      birth_year: patient?.birth_year ?? null,
      sex: patient?.sex ?? null,
    },
  });
  const sex = useWatch({ control: form.control, name: "sex" });

  return (
    <form
      className="grid gap-5 rounded-lg border bg-card p-5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {mode === "create" ? (
        <div className="grid gap-2">
          <Label htmlFor="external_code">Código externo anónimo</Label>
          <Input
            id="external_code"
            placeholder="HRT-2026-0042"
            aria-invalid={Boolean(form.formState.errors.external_code)}
            data-tour-id="patient-form__code-field"
            {...form.register("external_code")}
          />
          {form.formState.errors.external_code ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.external_code.message}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-2">
          <Label>Código externo anónimo</Label>
          <Input value={patient?.external_code ?? ""} disabled />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="birth_year">Año de nacimiento</Label>
          <Input
            id="birth_year"
            type="number"
            min={1900}
            max={2030}
            placeholder="1975"
            aria-invalid={Boolean(form.formState.errors.birth_year)}
            data-tour-id="patient-form__birth-year-field"
            {...form.register("birth_year")}
          />
          {form.formState.errors.birth_year ? (
            <p className="text-sm text-destructive">{form.formState.errors.birth_year.message}</p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sex">Sexo</Label>
          <Select
            value={(sex as string | null) ?? "none"}
            onValueChange={(value) =>
              form.setValue("sex", value === "none" ? null : (value as "F" | "M" | "O"), {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="sex" data-tour-id="patient-form__sex-field">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No registrado</SelectItem>
              <SelectItem value="F">Femenino</SelectItem>
              <SelectItem value="M">Masculino</SelectItem>
              <SelectItem value="O">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" asChild>
          <Link href={patient ? `/patients/${patient.id}` : "/patients"}>
            <X />
            Cancelar
          </Link>
        </Button>
        <Button type="submit" disabled={isPending} data-tour-id="patient-form__submit-button">
          <Save />
          {isPending ? "Guardando" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
