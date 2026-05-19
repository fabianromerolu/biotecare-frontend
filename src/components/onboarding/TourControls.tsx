"use client";

import { Button } from "@/components/ui/button";
import { useTourContext } from "./TourProvider";

export function TourControls() {
  const { stepIndex, totalSteps, next, prev, skip } = useTourContext();
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  return (
    <div className="mt-4 flex items-center justify-between gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={skip}
        aria-label="Omitir guía de inicio"
      >
        Omitir guía
      </Button>
      <div className="flex gap-2">
        {!isFirst && (
          <Button
            variant="outline"
            size="sm"
            onClick={prev}
            aria-label="Paso anterior"
          >
            Anterior
          </Button>
        )}
        <Button
          size="sm"
          onClick={next}
          aria-label={isLast ? "Finalizar guía" : "Siguiente paso"}
        >
          {isLast ? "Finalizar" : "Siguiente"}
        </Button>
      </div>
    </div>
  );
}
