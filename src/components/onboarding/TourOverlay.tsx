"use client";

import { useTourContext } from "./TourProvider";

const PADDING = 8;

export function TourOverlay() {
  const { isActive, currentStep, targetRect } = useTourContext();

  if (!isActive) return null;

  // Paso modal: overlay simple sin agujero
  if (!targetRect || currentStep?.isModal) {
    return (
      <div
        className="fixed inset-0 z-[90] bg-black/60 transition-colors duration-200"
        aria-hidden="true"
      />
    );
  }

  const { x, y, width, height } = targetRect;
  const spotX = x - PADDING;
  const spotY = y - PADDING;
  const spotW = width + PADDING * 2;
  const spotH = height + PADDING * 2;

  return (
    <>
      {/* Overlay oscuro: cuatro bandas alrededor del spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-[90]"
        aria-hidden="true"
      >
        {/* Arriba */}
        <div
          className="absolute left-0 right-0 top-0 bg-black/60 transition-all duration-200"
          style={{ height: Math.max(0, spotY) }}
        />
        {/* Abajo */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-black/60 transition-all duration-200"
          style={{ top: spotY + spotH }}
        />
        {/* Izquierda */}
        <div
          className="absolute bg-black/60 transition-all duration-200"
          style={{
            top: spotY,
            left: 0,
            width: Math.max(0, spotX),
            height: spotH,
          }}
        />
        {/* Derecha */}
        <div
          className="absolute bg-black/60 transition-all duration-200"
          style={{
            top: spotY,
            left: spotX + spotW,
            right: 0,
            height: spotH,
          }}
        />
      </div>
      {/* Borde resaltado del elemento */}
      <div
        className="pointer-events-none fixed z-[91] rounded-lg transition-all duration-200"
        style={{
          left: spotX,
          top: spotY,
          width: spotW,
          height: spotH,
          outline: "2px solid var(--ring)",
          outlineOffset: "0px",
        }}
        aria-hidden="true"
      />
    </>
  );
}
