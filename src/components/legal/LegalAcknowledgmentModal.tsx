"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Brain, Lock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const STORAGE_KEY = "biotecare-legal-acknowledged";

function safeGetAck(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return true;
  }
}

function safeSetAck(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // noop
  }
}

export function LegalAcknowledgmentModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!safeGetAck()) {
        setOpen(true);
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const handleAccept = () => {
    safeSetAck();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-h-[90vh] max-w-2xl overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <DialogTitle className="text-xl">
            Información legal y uso de la plataforma
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Lea detenidamente antes de continuar. Debe aceptar estas condiciones para acceder a la plataforma.
          </p>
        </DialogHeader>

        <div className="mt-2 space-y-5 text-sm">

          {/* Propósito */}
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

          {/* AI Act */}
          <LegalSection icon={FileText} title="Reglamento UE de Inteligencia Artificial (EU AI Act 2024/1689)">
            <p>
              Por su uso como soporte diagnóstico sanitario, este sistema puede clasificarse como
              IA de alto riesgo.
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

          {/* GDPR */}
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
                Las imágenes IVCM se procesan localmente. No se transfieren a
                servicios externos en la nube.
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

          {/* Limitaciones */}
          <LegalSection icon={ShieldCheck} title="Limitaciones del modelo de IA">
            <p>
              El modelo ResNet-18 fue entrenado con un conjunto específico de imágenes IVCM.
              Su rendimiento puede variar en función del microscopio utilizado, la calidad de
              la imagen y la técnica de captura. Los biomarcadores calculados son estimaciones
              cuantitativas y deben interpretarse siempre en el contexto clínico completo del paciente.
            </p>
          </LegalSection>

        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleAccept} className="px-8">
            Entendido — Acceder a la plataforma
          </Button>
        </div>
      </DialogContent>
    </Dialog>
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
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="pl-6 text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

export function useLegalReset() {
  return () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // noop
    }
  };
}
