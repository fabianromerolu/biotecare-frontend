import {
  AlertTriangle, ArrowRight, BadgeCheck, Building2, CheckCircle2,
  CircleDot, Database, FileCheck2, Gavel, HeartPulse,
  Lock, Scale, Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LegalResetButton from "./LegalResetButton";

const FLOW = [
  ["Imágenes médicas", "IVCM corneal", HeartPulse],
  ["Análisis asistido", "Probabilidad, Grad-CAM y biomarcadores", Database],
  ["Revisión médica", "El profesional acepta o rechaza", Stethoscope],
  ["Trazabilidad", "La decisión queda registrada", FileCheck2],
] as const;

const RULES = [
  ["España", "LOPDGDD · Ley Orgánica 3/2018", "Protección de datos personales y derechos digitales.", "Registro de tratamientos, medidas adecuadas y posible DPO a gran escala.", "AEPD"],
  ["España", "Ley 41/2002", "Autonomía del paciente y consentimiento informado.", "Informar del apoyo de IA y permitir aceptar o rechazar su uso.", "Servicios autonómicos de salud"],
  ["España", "Ley 14/2007", "Investigación biomédica.", "CEI y consentimiento específico si se usan datos reales para entrenar o validar.", "CEI autonómicos y AEMPS"],
  ["España", "Ley 14/1986", "Ley General de Sanidad.", "La herramienta apoya al médico, no sustituye su responsabilidad profesional.", "Ministerio y consejerías de Sanidad"],
  ["España", "RDL 14/2019", "Seguridad reforzada para datos sensibles.", "Evaluar ENS si existe colaboración con el sector público sanitario.", "AEPD y CCN"],
  ["España", "RD 192/2023", "Productos sanitarios en España.", "Evaluar su aplicación si existe despliegue clínico o comercialización.", "AEMPS"],
  ["Unión Europea", "EU AI Act · Reglamento 2024/1689", "Sistemas de IA de alto riesgo.", "Riesgos, documentación, logs, transparencia, supervisión humana y registro.", "Autoridades competentes de IA"],
  ["Unión Europea", "RGPD · Reglamento 2016/679", "Datos de salud como categoría especial.", "Consentimiento explícito, registro, DPIA y protocolo de brechas en 72 horas.", "AEPD"],
  ["Unión Europea", "MDR · Reglamento 2017/745", "Software sanitario.", "Evaluar marcado CE, calidad y evaluación clínica antes de uso real o comercialización.", "AEMPS"],
  ["Unión Europea", "IVDR · Reglamento 2017/746", "Diagnóstico in vitro.", "No aplica actualmente: Biotecare procesa imágenes digitales, no muestras biológicas.", "No aplica actualmente"],
] as const;

const COMPLIANCE = [
  ["Implementado", "Supervisión humana", "El médico acepta o rechaza explícitamente cada predicción.", "EU AI Act art. 14 · Ley 41/2002"],
  ["Implementado", "Trazabilidad de inferencias", "Cada resultado conserva médico, paciente, imagen, modelo, umbral y fecha.", "EU AI Act art. 12"],
  ["Implementado", "Registro de auditoría", "Los accesos a datos de salud quedan registrados.", "RGPD art. 9 · LOPDGDD"],
  ["Pendiente", "DPIA", "Debe completarse antes de trabajar con datos reales.", "RGPD art. 35"],
  ["Pendiente", "Consentimiento informado específico", "El paciente debe aceptar el uso de IA diagnóstica.", "RGPD art. 9.2.a · Ley 41/2002"],
  ["Parcial", "Documentación técnica formal", "Completar arquitectura, datos, métricas, límites y gestión de riesgos.", "EU AI Act art. 11"],
  ["Pendiente", "Registro europeo de IA de alto riesgo", "Preparar el registro antes del plazo aplicable.", "EU AI Act art. 49 · agosto de 2026"],
  ["No aplica aún", "MDR y marcado CE", "Evaluar antes de despliegue clínico real o comercialización.", "MDR · RD 192/2023"],
] as const;

const PHASES = [
  ["Fase I", "Antes de usar datos reales", ["Elaborar DPIA", "Redactar consentimiento informado", "Evaluar necesidad de DPO", "Registrar tratamientos", "Crear protocolo de brechas en 72 horas"]],
  ["Fase II", "Antes del despliegue clínico", ["Obtener aprobación CEI si aplica", "Completar documentación técnica", "Registrar el sistema de alto riesgo", "Mantener advertencias visibles", "Consultar a la AEMPS sobre SaMD"]],
  ["Fase III", "Antes de comercializar", ["Evaluar conformidad MDR", "Obtener marcado CE si corresponde", "Implantar ISO 13485", "Realizar evaluación clínica", "Preparar vigilancia poscomercialización"]],
] as const;

const RISKS = [
  ["Sin DPIA", "Alta", "Sanción de la AEPD", "Elaborar la DPIA antes de utilizar datos reales."],
  ["Sin consentimiento informado", "Alta", "Tratamiento ilícito y reclamaciones", "Crear un consentimiento específico para el uso de IA."],
  ["Brecha de seguridad", "Baja con medidas actuales", "Sanciones y notificación en 72 horas", "Mantener infraestructura aislada, auditoría y protocolo de incidentes."],
  ["Despliegue sin conformidad MDR", "Baja en prototipo", "Retirada o prohibición de comercialización", "No desplegar clínicamente sin evaluación regulatoria."],
  ["Predicción incorrecta", "Posible", "Riesgo clínico y responsabilidad", "Advertencias claras y supervisión humana obligatoria."],
] as const;

const GLOSSARY = [
  ["DPIA", "Evaluación de Impacto sobre la Protección de Datos."], ["RGPD", "Reglamento General de Protección de Datos."],
  ["LOPDGDD", "Ley española de protección de datos y derechos digitales."], ["EU AI Act", "Reglamento europeo sobre inteligencia artificial."],
  ["MDR", "Reglamento europeo de productos sanitarios."], ["SaMD", "Software como dispositivo médico."],
  ["CEI", "Comité de Ética de la Investigación."], ["AEPD", "Agencia Española de Protección de Datos."],
  ["AEMPS", "Agencia Española de Medicamentos y Productos Sanitarios."], ["Trazabilidad", "Registro que permite reconstruir quién hizo qué y cuándo."],
] as const;

export default function LegalPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="grid gap-5 bg-linear-to-br from-blue-50 to-cyan-50 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Badge className="mb-3 border-blue-200 bg-white text-blue-800" variant="outline">España y Unión Europea</Badge>
            <h1 className="text-2xl font-bold">Marco legal y cumplimiento normativo de Biotecare</h1>
            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground">Sistema de IA de soporte diagnóstico oftalmológico bajo regulación española y europea.</p>
            <p className="mt-4 rounded-lg border border-blue-200 bg-white p-3 text-sm font-semibold text-blue-950">Biotecare no sustituye al médico. La decisión diagnóstica final siempre corresponde al profesional sanitario.</p>
          </div>
          <div className="flex size-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md"><Scale className="size-10" /></div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Summary icon={BadgeCheck} title="Viabilidad jurídica" value="Viable con condiciones" />
        <Summary icon={AlertTriangle} title="Clasificación probable" value="IA de alto riesgo" />
        <Summary icon={Lock} title="Datos tratados" value="Datos de salud" />
        <Summary icon={Building2} title="Fase actual" value="Prototipo" />
      </section>

      <Section title="Qué ocurre desde la imagen hasta la decisión" description="El sistema acompaña al profesional y deja constancia del proceso.">
        <div className="grid gap-3 lg:grid-cols-4">
          {FLOW.map(([title, text, Icon], index) => <div key={title} className="relative rounded-xl border bg-card p-4 shadow-sm"><Icon className="size-5 text-primary" /><h3 className="mt-3 font-semibold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{text}</p>{index < FLOW.length - 1 ? <ArrowRight className="absolute -right-5 top-1/2 z-10 hidden size-5 text-primary lg:block" /> : null}</div>)}
        </div>
      </Section>

      <Section title="Normas aplicables" description="Cada ficha resume qué regula la norma y qué implica para Biotecare.">
        <div className="grid gap-3 lg:grid-cols-2">
          {RULES.map(([area, name, regulates, obligation, authority]) => <details key={name} className="group rounded-xl border bg-card p-4 shadow-sm"><summary className="cursor-pointer list-none"><div className="flex items-start justify-between gap-3"><div><Badge variant="secondary">{area}</Badge><h3 className="mt-2 font-semibold">{name}</h3><p className="mt-1 text-sm text-muted-foreground">{regulates}</p></div><CircleDot className="mt-1 size-4 shrink-0 text-primary" /></div></summary><div className="mt-4 grid gap-3 border-t pt-4 text-sm"><LegalFact label="Obligación para Biotecare" value={obligation} /><LegalFact label="Autoridad o referencia" value={authority} /></div></details>)}
        </div>
      </Section>

      <Section title="Matriz de cumplimiento" description="Estado actual del prototipo y próximos compromisos regulatorios.">
        <div className="grid gap-3 md:grid-cols-2">
          {COMPLIANCE.map(([status, title, description, reference]) => <div key={title} className="rounded-xl border bg-card p-4 shadow-sm"><StatusBadge status={status} /><h3 className="mt-3 font-semibold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{description}</p><p className="mt-3 text-xs font-medium text-primary">{reference}</p></div>)}
        </div>
      </Section>

      <Section title="Hoja de ruta regulatoria" description="Qué debe completarse antes de avanzar a cada fase.">
        <div className="grid gap-4 lg:grid-cols-3">
          {PHASES.map(([phase, title, actions], index) => <Card key={phase}><CardHeader><Badge className="w-fit" variant="secondary">{phase}</Badge><CardTitle>{title}</CardTitle></CardHeader><CardContent><ul className="space-y-2">{actions.map((action) => <li key={action} className="flex gap-2 text-sm text-muted-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />{action}</li>)}</ul>{index === 1 ? <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs font-medium text-amber-900">Plazo relevante del EU AI Act: agosto de 2026 para sistemas de alto riesgo del Anexo III.</p> : null}</CardContent></Card>)}
        </div>
      </Section>

      <Section title="Riesgos jurídicos principales" description="Riesgos identificados y su medida de mitigación.">
        <div className="grid gap-3 md:grid-cols-2">
          {RISKS.map(([risk, probability, impact, mitigation]) => <details key={risk} className="rounded-xl border bg-card p-4 shadow-sm"><summary className="cursor-pointer list-none"><div className="flex items-center justify-between gap-2"><h3 className="font-semibold">{risk}</h3><Badge variant="outline">{probability}</Badge></div><p className="mt-2 text-sm text-muted-foreground">{impact}</p></summary><p className="mt-3 border-t pt-3 text-sm"><span className="font-semibold">Mitigación: </span>{mitigation}</p></details>)}
        </div>
      </Section>

      <Section title="Glosario rápido" description="Conceptos legales explicados en lenguaje sencillo.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{GLOSSARY.map(([term, description]) => <div key={term} className="rounded-xl border bg-muted/40 p-3"><p className="font-semibold text-primary">{term}</p><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>)}</div>
      </Section>

      <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground"><p className="font-semibold text-foreground">¿Necesita revisar el aviso legal de nuevo?</p><p className="mb-3 mt-1">Puede restablecer la confirmación guardada en este navegador.</p><LegalResetButton /></div>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section><h2 className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p><div className="mt-4">{children}</div></section>; }
function Summary({ icon: Icon, title, value }: { icon: typeof Gavel; title: string; value: string }) { return <div className="rounded-xl border bg-card p-4 shadow-sm"><Icon className="size-5 text-primary" /><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p><p className="mt-1 font-semibold">{value}</p></div>; }
function LegalFact({ label, value }: { label: string; value: string }) { return <p><span className="font-semibold text-foreground">{label}: </span><span className="text-muted-foreground">{value}</span></p>; }
function StatusBadge({ status }: { status: string }) { const classes = status === "Implementado" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : status === "Pendiente" ? "border-amber-200 bg-amber-50 text-amber-900" : status === "Parcial" ? "border-blue-200 bg-blue-50 text-blue-800" : "border-slate-200 bg-slate-50 text-slate-700"; return <Badge className={classes} variant="outline">{status}</Badge>; }
