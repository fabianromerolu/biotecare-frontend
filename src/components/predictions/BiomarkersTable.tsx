"use client";

import { HelpCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BIOMARKER_ROWS } from "@/lib/utils/biomarkerNorms";
import type { Biomarkers } from "@/types/api";

export function BiomarkersTable({ biomarkers }: { biomarkers: Biomarkers | null }) {
  return (
    <TooltipProvider delayDuration={200}>
      <section className="rounded-lg border bg-card" aria-labelledby="biomarkers-title">
        <div className="border-b p-4">
          <h2 id="biomarkers-title" className="text-sm font-semibold">
            Biomarcadores
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Pase el cursor sobre{" "}
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={`Información sobre ${row.label}`}
                          >
                            <HelpCircle className="size-3.5" aria-hidden="true" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="max-w-xs space-y-1.5 text-left font-normal"
                        >
                          <p className="font-semibold leading-tight">{row.tooltip.fullName}</p>
                          <p className="leading-snug">{row.tooltip.explains}</p>
                          <p className="leading-snug opacity-90">{row.tooltip.normalRange}</p>
                          <p className="leading-snug opacity-90">{row.tooltip.clinical}</p>
                        </TooltipContent>
                      </Tooltip>
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
    </TooltipProvider>
  );
}
