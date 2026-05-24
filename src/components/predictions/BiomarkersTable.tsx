"use client";

import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BIOMARKER_ROWS } from "@/lib/utils/biomarkerNorms";
import type { Biomarkers } from "@/types/api";

export function BiomarkersTable({ biomarkers }: { biomarkers: Biomarkers | null }) {
  return (
    <section className="rounded-lg border bg-card" aria-labelledby="biomarkers-title">
      <div className="border-b p-4">
        <h2 id="biomarkers-title" className="text-sm font-semibold">
          Biomarcadores
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Haga clic en{" "}
          <HelpCircle className="inline size-3 text-muted-foreground" aria-hidden="true" />{" "}
          para ver la interpretación clínica de cada biomarcador.
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Biomarcador</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Referencia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {BIOMARKER_ROWS.map((row) => {
            const value = biomarkers?.[row.key];
            return (
              <TableRow key={row.key}>
                <TableCell>
                  <div className="flex items-start gap-1.5">
                    <div>
                      <div className="font-medium">{row.label}</div>
                      <div className="text-xs text-muted-foreground">{row.description}</div>
                    </div>
                    <BiomarkerInfoDialog row={row} />
                  </div>
                </TableCell>
                <TableCell className="font-mono">
                  {value != null ? String(value) : "N/D"}
                </TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.normal}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <p className="border-t p-4 text-xs text-muted-foreground">
        Valores calculados por el modelo de IA. Requieren validación clínica por parte del médico.
        Los rangos de referencia son orientativos.
      </p>
    </section>
  );
}

function BiomarkerInfoDialog({
  row,
}: {
  row: (typeof BIOMARKER_ROWS)[number];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="mt-0.5 shrink-0 rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Información clínica sobre ${row.label}`}
        >
          <HelpCircle className="size-3.5" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base leading-snug">
            {row.tooltip.fullName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <InfoSection label="Qué es" text={row.tooltip.explains} />
          <InfoSection label="Rango normal" text={row.tooltip.normalRange} />
          <InfoSection label="Interpretación clínica" text={row.tooltip.clinical} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoSection({ label, text }: { label: string; text: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="leading-relaxed text-foreground">{text}</p>
    </div>
  );
}
