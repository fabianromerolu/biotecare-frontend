"use client";

import { useEffect, useRef } from "react";
import { useTourContext } from "./TourProvider";
import { TourControls } from "./TourControls";
import { cn } from "@/lib/utils";

const MAX_TOOLTIP_WIDTH = 340;
const OFFSET = 16;

interface Position {
  top: number;
  left: number;
}

function computePosition(
  rect: DOMRect | null,
  placement: string,
  tooltipHeight: number,
  tooltipWidth: number,
): Position {
  if (!rect) {
    // Modal: centrado en pantalla
    return {
      top: Math.max(16, window.innerHeight / 2 - tooltipHeight / 2),
      left: Math.max(12, window.innerWidth / 2 - tooltipWidth / 2),
    };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top = 0;
  let left = 0;

  switch (placement) {
    case "top":
      top = rect.top - tooltipHeight - OFFSET;
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
      break;
    case "top-start":
      top = rect.top - tooltipHeight - OFFSET;
      left = rect.left;
      break;
    case "bottom":
      top = rect.bottom + OFFSET;
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
      break;
    case "bottom-start":
      top = rect.bottom + OFFSET;
      left = rect.left;
      break;
    case "right":
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.right + OFFSET;
      break;
    case "left":
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.left - tooltipWidth - OFFSET;
      break;
    default:
      top = rect.bottom + OFFSET;
      left = rect.left;
  }

  const margin = 12;
  left = Math.max(margin, Math.min(left, vw - tooltipWidth - margin));
  top = Math.max(margin, Math.min(top, vh - tooltipHeight - margin));

  return { top, left };
}

export function TourTooltip() {
  const { isActive, currentStep, stepIndex, totalSteps, targetRect } =
    useTourContext();
  const ref = useRef<HTMLDivElement>(null);

  // Enfocar el primer botón al cambiar de paso
  useEffect(() => {
    if (!isActive || !ref.current) return;
    const btn = ref.current.querySelector<HTMLButtonElement>("button");
    btn?.focus();
  }, [isActive, stepIndex]);

  if (!isActive || !currentStep) return null;

  const tooltipWidth = Math.min(MAX_TOOLTIP_WIDTH, Math.max(280, window.innerWidth - 24));
  const tooltipHeight = 220;
  const { top, left } = computePosition(
    targetRect,
    currentStep.placement,
    tooltipHeight,
    tooltipWidth,
  );

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-label={currentStep.title}
      className={cn(
        "fixed z-100 rounded-xl border border-primary/20 bg-popover p-5 text-popover-foreground shadow-xl",
        "ring-1 ring-primary/15",
        "animate-in fade-in-0 zoom-in-95 duration-150",
      )}
      style={{ top, left, width: tooltipWidth }}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Paso {stepIndex + 1} de {totalSteps}
        </span>
      </div>
      <h3 className="mb-1.5 text-sm font-semibold leading-snug text-foreground">
        {currentStep.title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {currentStep.content}
      </p>
      <TourControls />
    </div>
  );
}
