"use client";

import { useEffect, useRef } from "react";
import { useTourContext } from "./TourProvider";
import { TourControls } from "./TourControls";
import { cn } from "@/lib/utils";

const TOOLTIP_WIDTH = 340;
const OFFSET = 16;

interface Position {
  top: number;
  left: number;
}

function computePosition(
  rect: DOMRect | null,
  placement: string,
  tooltipHeight: number,
): Position {
  if (!rect) {
    // Modal: centrado en pantalla
    return {
      top: Math.max(16, window.innerHeight / 2 - tooltipHeight / 2),
      left: Math.max(16, window.innerWidth / 2 - TOOLTIP_WIDTH / 2),
    };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top = 0;
  let left = 0;

  switch (placement) {
    case "top":
      top = rect.top - tooltipHeight - OFFSET;
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      break;
    case "top-start":
      top = rect.top - tooltipHeight - OFFSET;
      left = rect.left;
      break;
    case "bottom":
      top = rect.bottom + OFFSET;
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
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
      left = rect.left - TOOLTIP_WIDTH - OFFSET;
      break;
    default:
      top = rect.bottom + OFFSET;
      left = rect.left;
  }

  const margin = 12;
  left = Math.max(margin, Math.min(left, vw - TOOLTIP_WIDTH - margin));
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

  const tooltipHeight = ref.current?.offsetHeight ?? 200;
  const { top, left } = computePosition(
    targetRect,
    currentStep.placement,
    tooltipHeight,
  );

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-label={currentStep.title}
      className={cn(
        "fixed z-[100] rounded-xl border bg-popover p-4 text-popover-foreground shadow-xl",
        "ring-1 ring-black/10",
        "animate-in fade-in-0 zoom-in-95 duration-150",
      )}
      style={{ top, left, width: TOOLTIP_WIDTH }}
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
