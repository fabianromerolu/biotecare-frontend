"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTourContext } from "./TourProvider";
import { tourStorage } from "@/lib/tour/tourStorage";

export function TourResetButton() {
  const { startTour } = useTourContext();

  const handleReset = () => {
    tourStorage.resetAll();
    startTour(true);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleReset}
      aria-label="Ver guía interactiva de la plataforma"
    >
      <BookOpen className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline">Ver guía</span>
    </Button>
  );
}
