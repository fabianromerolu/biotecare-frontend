"use client";

import { useQueries } from "@tanstack/react-query";
import { FilePlus2, Search, UsersRound } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorPanel } from "@/components/shared/ErrorPanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { PatientTable } from "@/components/patients/PatientTable";
import { getPatientUiStatus, type PatientUiStatus } from "@/components/patients/PatientStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listPatientImages } from "@/lib/api/images";
import { usePatients } from "@/hooks/usePatients";
import type { ImageRead, PatientSex } from "@/types/api";

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [sex, setSex] = useState<PatientSex | "all">("all");
  const [status, setStatus] = useState<PatientUiStatus | "all">("all");
  const patientsQuery = usePatients();
  const patients = useMemo(() => patientsQuery.data ?? [], [patientsQuery.data]);

  const imageQueries = useQueries({
    queries: patients.map((patient) => ({
      queryKey: ["patients", patient.id, "images"],
      queryFn: () => listPatientImages(patient.id),
      staleTime: 10_000,
      enabled: Boolean(patientsQuery.data),
    })),
  });

  const imageMap = useMemo(() => {
    return patients.reduce<Record<string, ImageRead[] | undefined>>((acc, patient, index) => {
      acc[patient.id] = imageQueries[index]?.data;
      return acc;
    }, {});
  }, [imageQueries, patients]);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return patients.filter((patient) => {
      const matchesSearch = patient.external_code.toLowerCase().includes(normalizedSearch);
      const matchesSex = sex === "all" || patient.sex === sex;
      const matchesStatus =
        status === "all" || getPatientUiStatus(imageMap[patient.id]) === status;
      return matchesSearch && matchesSex && matchesStatus;
    });
  }, [imageMap, patients, search, sex, status]);

  if (patientsQuery.isLoading) {
    return <LoadingSpinner label="Cargando pacientes" />;
  }

  if (patientsQuery.isError) {
    return <ErrorPanel message="Verifica que el backend este disponible en localhost:8000." />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">Pacientes</h2>
          <p className="text-sm text-muted-foreground">
            Registros anonimizados vinculados al medico autenticado.
          </p>
        </div>
        <Button asChild data-tour-id="patients__new-patient-button">
          <Link href="/patients/new">
            <FilePlus2 />
            Nuevo paciente
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_180px_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar codigo externo"
            className="pl-9"
            aria-label="Buscar codigo externo"
            data-tour-id="patients__search-input"
          />
        </div>
        <Select value={sex} onValueChange={(value) => setSex(value as PatientSex | "all")}>
          <SelectTrigger aria-label="Filtrar por sexo" data-tour-id="patients__sex-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los sexos</SelectItem>
            <SelectItem value="F">Femenino</SelectItem>
            <SelectItem value="M">Masculino</SelectItem>
            <SelectItem value="O">Otro</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value as PatientUiStatus | "all")}>
          <SelectTrigger aria-label="Filtrar por estado" data-tour-id="patients__status-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="empty">Sin analizar</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="predicted">Con prediccion</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {patients.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="Sin pacientes"
          description="Crea el primer registro anonimizado para iniciar el flujo IVCM."
          action={
            <Button asChild>
              <Link href="/patients/new">
                <FilePlus2 />
                Crear paciente
              </Link>
            </Button>
          }
        />
      ) : (
        <div data-tour-id="patients__table">
          <PatientTable patients={filtered} imageMap={imageMap} />
        </div>
      )}
    </div>
  );
}
