"use client";

import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Database,
  Eye,
  FileImage,
  Microscope,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ErrorPanel } from "@/components/shared/ErrorPanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatDate } from "@/lib/utils/formatters";
import { useHealth, useModelInfo } from "@/hooks/useSystem";

const MODEL_STEPS = [
  {
    icon: FileImage,
    title: "1. Recibe una imagen",
    description: "El médico carga una imagen IVCM de la córnea. El sistema prepara el archivo para analizarlo.",
  },
  {
    icon: BrainCircuit,
    title: "2. Busca patrones",
    description: "ResNet-18 examina formas y texturas aprendidas durante su entrenamiento con imágenes similares.",
  },
  {
    icon: ScanSearch,
    title: "3. Explica qué observó",
    description: "Grad-CAM resalta las zonas que más influyeron y se calculan biomarcadores morfológicos.",
  },
  {
    icon: Stethoscope,
    title: "4. El médico decide",
    description: "La probabilidad orienta la revisión clínica. El profesional siempre acepta o rechaza el resultado.",
  },
] as const;

export default function ModelPage() {
  const healthQuery = useHealth();
  const modelQuery = useModelInfo();
  const now = new Date().toISOString();

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="grid gap-6 bg-linear-to-br from-blue-50 to-cyan-50 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Badge className="mb-3 border-blue-200 bg-white text-blue-800" variant="outline">
              Explicación sencilla del modelo
            </Badge>
            <h2 className="text-2xl font-bold text-foreground">Cómo funciona la inteligencia artificial</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Biotecare actúa como una segunda lectura visual. Analiza imágenes de microscopía confocal
              corneal, estima la probabilidad de ojo seco y muestra qué zonas influyeron en el resultado.
            </p>
            <p className="mt-3 font-semibold text-blue-900">
              No sustituye al médico: el resultado es orientativo y requiere supervisión humana.
            </p>
          </div>
          <div className="flex size-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Microscope className="size-10" aria-hidden="true" />
          </div>
        </div>
      </section>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">Estado técnico del sistema</h2>
          <p className="text-sm text-muted-foreground">API FastAPI, base de datos y modelo ResNet-18.</p>
        </div>
        <Button variant="outline" onClick={() => { healthQuery.refetch(); modelQuery.refetch(); }}>
          <RefreshCw />
          Refrescar estado
        </Button>
      </div>

      {healthQuery.isError ? (
        <ErrorPanel message="No se pudo contactar con el backend local en localhost:8000." />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Card data-tour-id="model__health-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="size-4" />Servicios</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {healthQuery.isLoading ? <LoadingSpinner label="Consultando estado" /> : (
              <>
                <StatusLine icon={Activity} label="API" ok={healthQuery.data?.status === "ok"} value={healthQuery.data?.status ?? "desconocido"} />
                <StatusLine icon={Database} label="Base de datos" ok={healthQuery.data?.database === "ok"} value={healthQuery.data?.database ?? "desconocido"} />
                <Separator />
                <p className="text-sm text-muted-foreground">Última actualización: {formatDate(now)}</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-tour-id="model__model-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><BrainCircuit className="size-4" />Modelo activo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {modelQuery.isLoading ? <LoadingSpinner label="Cargando modelo" /> : (
              <>
                <Info label="Versión" value={modelQuery.data?.model_version ?? "No disponible"} mono />
                <Info label="Tarea" value={modelQuery.data?.task ?? "No disponible"} />
                <TagList label="Resultados posibles" items={modelQuery.data?.labels ?? []} />
                <TagList label="Biomarcadores" items={modelQuery.data?.biomarkers ?? []} secondary />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="text-xl font-semibold">El recorrido de una imagen</h2>
        <p className="mt-1 text-sm text-muted-foreground">Cuatro pasos para entender el proceso sin conocimientos técnicos.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {MODEL_STEPS.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardContent className="space-y-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-primary"><Icon className="size-5" /></div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Eye className="size-5 text-primary" />Cómo leer el resultado</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
          <Concept title="Probabilidad" text="Indica cuánto se parece la imagen a los patrones asociados al ojo seco." />
          <ArrowRight className="hidden size-5 text-muted-foreground lg:block" />
          <Concept title="Mapa Grad-CAM" text="Resalta visualmente las regiones que más pesaron en la estimación." />
          <ArrowRight className="hidden size-5 text-muted-foreground lg:block" />
          <Concept title="Biomarcadores" text="Aportan medidas morfológicas para contextualizar el análisis clínico." />
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <Explanation icon={ScanSearch} title="Grad-CAM no diagnostica" text="El mapa de activación ayuda a inspeccionar dónde miró el modelo. No demuestra por sí solo una enfermedad." />
        <Explanation icon={Database} title="Los biomarcadores contextualizan" text="Las medidas complementan la lectura visual y deben interpretarse con la historia clínica del paciente." />
        <Explanation icon={ShieldCheck} title="La decisión sigue siendo humana" text="El médico revisa, acepta o rechaza cada predicción y conserva la responsabilidad clínica final." />
      </section>
    </div>
  );
}

function StatusLine({ icon: Icon, label, ok, value }: { icon: typeof Activity; label: string; ok: boolean; value: string }) {
  return <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Icon className="size-4 text-muted-foreground" /><span className="text-sm">{label}</span></div><Badge className={ok ? "border-emerald-700 bg-emerald-50 text-emerald-800" : undefined} variant={ok ? "outline" : "destructive"}>{value}</Badge></div>;
}
function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className={`mt-1 text-sm font-medium ${mono ? "font-mono" : ""}`}>{value}</p></div>;
}
function TagList({ label, items, secondary = false }: { label: string; items: string[]; secondary?: boolean }) {
  return <div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><div className="mt-2 flex flex-wrap gap-2">{items.length ? items.map((item) => <Badge key={item} variant={secondary ? "secondary" : "outline"}>{item}</Badge>) : <span className="text-sm text-muted-foreground">No disponible</span>}</div></div>;
}
function Concept({ title, text }: { title: string; text: string }) {
  return <div className="rounded-xl border bg-muted/50 p-4"><h3 className="font-semibold text-primary">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p></div>;
}
function Explanation({ icon: Icon, title, text }: { icon: typeof ScanSearch; title: string; text: string }) {
  return <div className="rounded-xl border bg-card p-4 shadow-sm"><Icon className="size-5 text-primary" /><h3 className="mt-3 font-semibold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p></div>;
}
