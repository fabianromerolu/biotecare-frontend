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
                  <div className="font-medium">{row.label}</div>
                  <div className="text-xs text-muted-foreground">{row.description}</div>
                </TableCell>
                <TableCell className="font-mono">{value ?? "N/D"}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.normal}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <p className="border-t p-4 text-xs text-muted-foreground">
        Valores calculados por el modelo de IA. Requieren validacion clinica por parte del medico.
        Los rangos de referencia son orientativos.
      </p>
    </section>
  );
}
