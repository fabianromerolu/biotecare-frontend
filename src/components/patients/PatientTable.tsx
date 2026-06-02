"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ImageStatusBadge } from "@/components/images/ImageStatusBadge";
import { PatientStatusBadge } from "@/components/patients/PatientStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateOnly, sexLabel } from "@/lib/utils/formatters";
import type { ImageRead, PatientRead } from "@/types/api";

export function PatientTable({
  patients,
  imageMap,
}: {
  patients: PatientRead[];
  imageMap: Record<string, ImageRead[] | undefined>;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <Table className="min-w-[760px]">
        <TableHeader>
          <TableRow>
            <TableHead>Código externo</TableHead>
            <TableHead>Año nac.</TableHead>
            <TableHead>Sexo</TableHead>
            <TableHead>Fecha creación</TableHead>
            <TableHead>N.º imágenes</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
            const images = imageMap[patient.id];
            const latest = images?.[0];
            return (
              <TableRow key={patient.id}>
                <TableCell>
                  <Link
                    href={`/patients/${patient.id}`}
                    className="font-mono text-sm font-medium hover:underline"
                  >
                    {patient.external_code}
                  </Link>
                </TableCell>
                <TableCell>{patient.birth_year ?? "No registrado"}</TableCell>
                <TableCell>{sexLabel(patient.sex)}</TableCell>
                <TableCell>{formatDateOnly(patient.created_at)}</TableCell>
                <TableCell>{images ? images.length : "..."}</TableCell>
                <TableCell className="space-y-1">
                  <PatientStatusBadge images={images} />
                  {latest ? (
                    <div className="pt-1">
                      <ImageStatusBadge status={latest.status} />
                    </div>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-sm" asChild aria-label="Abrir paciente">
                    <Link href={`/patients/${patient.id}`}>
                      <ChevronRight />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
