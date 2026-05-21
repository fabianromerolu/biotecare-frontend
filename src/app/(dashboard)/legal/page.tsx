import { BookOpen, Brain, FileText, Lock, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import LegalResetButton from "./LegalResetButton";

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BookOpen className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Marco legal de la plataforma</h1>
          <p className="text-sm text-muted-foreground">
            Fundamento normativo y condiciones de uso de Biotecare
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-6 text-sm">

        <LegalSection icon={Brain} title="Propósito del sistema">
          <p>
            Biotecare es un sistema de apoyo a la decisión clínica para la detección de ojo seco
            mediante análisis de imágenes de microscopía confocal (IVCM). Los resultados generados
            por el modelo de inteligencia artificial son orientativos y no constituyen un diagnóstico
            médico definitivo.
          </p>
          <p className="mt-2 font-medium text-foreground">
            El diagnóstico final es responsabilidad exclusiva del médico tratante.
          </p>
        </LegalSection>

        <Separator />

        <LegalSection icon={FileText} title="Reglamento UE de Inteligencia Artificial (EU AI Act 2024/1689)">
          <p>
            Este sistema está clasificado como sistema de IA de alto riesgo en el ámbito sanitario.
            En cumplimiento del artículo 14, se garantiza la supervisión humana en todas las
            decisiones clínicas. Ninguna predicción del modelo se aplica de forma automática:
            el médico debe revisar y confirmar o rechazar cada resultado.
          </p>
          <p className="mt-2">
            El sistema registra la revisión médica de cada predicción para garantizar la
            trazabilidad y la auditoría del proceso clínico.
          </p>
        </LegalSection>

        <Separator />

        <LegalSection icon={Lock} title="Protección de datos — RGPD Art. 9 (Datos de salud)">
          <p>
            Los datos procesados en esta plataforma son datos especiales de categoría 9 del
            Reglamento General de Protección de Datos (RGPD). Solo personal médico debidamente
            autorizado puede acceder a la plataforma.
          </p>
          <ul className="mt-2 space-y-1 pl-4">
            <li className="list-disc">
              Los registros de pacientes se almacenan con código anónimo externo, sin nombre real,
              DNI ni datos identificativos directos.
            </li>
            <li className="list-disc">
              Las imágenes IVCM se procesan localmente. No se transfieren a servicios externos en
              la nube.
            </li>
            <li className="list-disc">
              Cada acceso a datos clínicos queda registrado para auditoría.
            </li>
            <li className="list-disc">
              La sesión expira automáticamente para proteger el acceso no autorizado.
            </li>
          </ul>
        </LegalSection>

        <Separator />

        <LegalSection icon={ShieldCheck} title="Limitaciones del modelo de IA">
          <p>
            El modelo ResNet-18 fue entrenado con un conjunto específico de imágenes IVCM.
            Su rendimiento puede variar en función del microscopio utilizado, la calidad de
            la imagen y la técnica de captura. Los biomarcadores calculados son estimaciones
            cuantitativas y deben interpretarse siempre en el contexto clínico completo del paciente.
          </p>
        </LegalSection>

      </div>

      <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">¿Necesita revisar el aviso legal de nuevo?</p>
        <p className="mb-3">
          Si desea limpiar la confirmacion legal guardada en este navegador, puede
          restablecerlo a continuación.
        </p>
        <LegalResetButton />
      </div>
    </div>
  );
}

function LegalSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof ShieldCheck;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      <div className="pl-6 text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}
