"use client";

import {
  BarChart2,
  BookMarked,
  BrainCircuit,
  Stethoscope,
  Upload,
  UsersRound,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ManualAccordion } from "@/components/manual/ManualAccordion";
import { ManualPdfSection } from "@/components/manual/ManualPdfSection";
import {
  MANUAL_DATE,
  MANUAL_SECTIONS,
  MANUAL_VERSION,
} from "@/lib/manual/manualSections";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>> = {
  UsersRound,
  Upload,
  BrainCircuit,
  Stethoscope,
  BarChart2,
};

/* Only show sections where showInWeb is not explicitly false */
const WEB_SECTIONS = MANUAL_SECTIONS.filter((s) => s.showInWeb !== false);

export function UserManualClient() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header — minimal */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <BookMarked className="size-5 text-primary" aria-hidden="true" />
            <h1 className="text-2xl font-bold tracking-tight">Manual de usuario</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Guía de uso de Biotecare para profesionales sanitarios · v{MANUAL_VERSION} · {MANUAL_DATE}
          </p>
        </div>
      </div>

      <Separator />

      {/* Accordion sections */}
      <div data-tour-id="manual__sections" className="space-y-10">
        {WEB_SECTIONS.map((section) => {
          const Icon = ICON_MAP[section.iconName];
          return (
            <section key={section.id} id={`section-${section.id}`}>
              <div className="mb-4 flex items-center gap-2">
                {Icon && <Icon className="size-4 text-primary" aria-hidden="true" />}
                <h2 className="text-base font-semibold">{section.title}</h2>
              </div>
              <div className="grid gap-2">
                {section.questions.map((q) => (
                  <ManualAccordion key={q.id} question={q} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <Separator />

      {/* PDF section */}
      <div data-tour-id="manual__pdf-section">
        <ManualPdfSection />
      </div>
    </div>
  );
}
