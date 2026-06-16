"use client";

import { HelpCircle, ImageIcon, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Rect, Stage, Text } from "react-konva";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { blobToPreviewUrl } from "@/lib/utils/tiffDecoder";

interface LoadedBlobImage {
  blob: Blob;
  image: HTMLImageElement | null;
  error: boolean;
}

export function HeatmapViewer({
  heatmapBlob,
  originalImageBlob,
}: {
  heatmapBlob: Blob | undefined;
  originalImageBlob: Blob;
}) {
  const [opacity, setOpacity] = useState(0.55);
  const [showOriginal, setShowOriginal] = useState(false);
  const [originalImageState, setOriginalImageState] = useState<LoadedBlobImage | null>(null);
  const [heatmapImageState, setHeatmapImageState] = useState<LoadedBlobImage | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 640, height: 420 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const displayingOriginal = showOriginal || !heatmapBlob;
  const currentOriginalState =
    originalImageState?.blob === originalImageBlob ? originalImageState : null;
  const currentHeatmapState =
    heatmapBlob && heatmapImageState?.blob === heatmapBlob ? heatmapImageState : null;
  const originalImageElement = currentOriginalState?.image ?? null;
  const heatmapImageElement = currentHeatmapState?.image ?? null;
  const originalImageError = currentOriginalState?.error ?? false;
  const heatmapImageError = currentHeatmapState?.error ?? false;

  // Track container width responsively
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setCanvasWidth(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    let previewUrl: string | null = null;
    const img = new window.Image();
    img.onload = () => {
      if (!active) return;
      setNaturalSize({ width: img.naturalWidth || 640, height: img.naturalHeight || 420 });
      setOriginalImageState({ blob: originalImageBlob, image: img, error: false });
    };
    img.onerror = () => {
      if (!active) return;
      setOriginalImageState({ blob: originalImageBlob, image: null, error: true });
    };
    blobToPreviewUrl(originalImageBlob)
      .then((url) => {
        if (!active) {
          if (url.startsWith("blob:")) URL.revokeObjectURL(url);
          return;
        }
        previewUrl = url;
        img.src = url;
      })
      .catch(() => {
        if (active) setOriginalImageState({ blob: originalImageBlob, image: null, error: true });
      });
    return () => {
      active = false;
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [originalImageBlob]);

  useEffect(() => {
    if (!heatmapBlob) return;
    const url = URL.createObjectURL(heatmapBlob);
    const img = new window.Image();
    img.onload = () => {
      setHeatmapImageState({ blob: heatmapBlob, image: img, error: false });
    };
    img.onerror = () => {
      setHeatmapImageState({ blob: heatmapBlob, image: null, error: true });
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [heatmapBlob]);

  const ratio = naturalSize.height / naturalSize.width;
  const canvasHeight = canvasWidth > 0 ? Math.max(180, Math.round(canvasWidth * ratio)) : 0;
  const viewerMessage = originalImageError
    ? "No se pudo mostrar la imagen original."
    : !originalImageElement
      ? "Cargando imagen original..."
      : !displayingOriginal && heatmapImageError
        ? "No se pudo superponer el mapa de activación."
        : !displayingOriginal && !heatmapImageElement
          ? "Cargando mapa de activación..."
          : null;

  return (
    <section className="rounded-lg border bg-card p-4" aria-labelledby="heatmap-title">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1">
          <h2 id="heatmap-title" className="text-sm font-semibold">
            {displayingOriginal ? "Imagen IVCM original" : "Mapa de activación Grad-CAM"}
          </h2>
          {!displayingOriginal && <GradCamInfoDialog />}
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex items-center gap-2">
            <ImageIcon className="size-4 text-muted-foreground" aria-hidden="true" />
            <Label htmlFor="show-original-image" className="text-xs text-muted-foreground">
              Ver imagen original
            </Label>
            <button
              id="show-original-image"
              type="button"
              role="switch"
              aria-checked={displayingOriginal}
              disabled={!heatmapBlob}
              onClick={() => setShowOriginal((current) => !current)}
              className="group relative inline-flex h-6 w-11 shrink-0 rounded-full border border-border bg-muted transition-colors aria-checked:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="pointer-events-none absolute left-0.5 top-0.5 size-4.5 rounded-full bg-white shadow-sm transition-transform group-aria-checked:translate-x-5" />
            </button>
          </div>
          {!displayingOriginal && (
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
              <Label htmlFor="heatmap-opacity" className="text-xs text-muted-foreground">
                Opacidad {Math.round(opacity * 100)}%
              </Label>
              <input
                id="heatmap-opacity"
                type="range"
                min="0"
                max="100"
                value={Math.round(opacity * 100)}
                onChange={(event) => setOpacity(Number(event.target.value) / 100)}
                className="w-32"
                aria-label={`Opacidad del mapa de activación: ${Math.round(opacity * 100)}%`}
                title={`Opacidad: ${Math.round(opacity * 100)}%`}
              />
            </div>
          )}
        </div>
      </div>
      <div ref={containerRef} className="overflow-hidden rounded-md border bg-muted">
        {canvasWidth > 0 && canvasHeight > 0 && (
          <Stage
            width={canvasWidth}
            height={canvasHeight}
            aria-label={displayingOriginal ? "Imagen IVCM original" : "Mapa de activación Grad-CAM"}
          >
            <Layer>
              <Rect x={0} y={0} width={canvasWidth} height={canvasHeight} fill="#101827" />
              {originalImageElement ? (
                <KonvaImage
                  image={originalImageElement}
                  x={0}
                  y={0}
                  width={canvasWidth}
                  height={canvasHeight}
                  opacity={1}
                />
              ) : null}
              {!displayingOriginal && heatmapImageElement ? (
                <KonvaImage
                  image={heatmapImageElement}
                  x={0}
                  y={0}
                  width={canvasWidth}
                  height={canvasHeight}
                  opacity={opacity}
                />
              ) : null}
              {viewerMessage ? (
                <Text
                  x={24}
                  y={originalImageElement ? 20 : canvasHeight / 2 - 18}
                  width={Math.max(0, canvasWidth - 48)}
                  align="center"
                  fill={originalImageError || heatmapImageError ? "#FCA5A5" : "#CBD5E1"}
                  text={viewerMessage}
                />
              ) : null}
            </Layer>
          </Stage>
        )}
      </div>
    </section>
  );
}

function GradCamInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Información sobre el mapa de activación Grad-CAM"
        >
          <HelpCircle className="size-3.5" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mapa de activación Grad-CAM</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div className="space-y-1 md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Qué es
            </p>
            <p>
              <strong>Grad-CAM</strong> (Gradient-weighted Class Activation Mapping) es una técnica
              de explicabilidad que resalta qué zonas de la imagen influyeron más en la decisión del
              modelo ResNet-18. Permite al médico verificar si el modelo está mirando las regiones
              anatómicamente relevantes.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Cómo leerlo
            </p>
            <ul className="space-y-1 pl-4 list-disc">
              <li>
                <span className="font-medium text-red-600">Rojo / Amarillo</span> — zona de alta
                activación: el modelo la usó activamente para tomar la decisión.
              </li>
              <li>
                <span className="font-medium text-blue-500">Azul / Verde</span> — baja influencia:
                estas áreas tuvieron poco peso en el resultado.
              </li>
            </ul>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ejemplo clínico
            </p>
            <p>
              En imágenes con ojo seco, las zonas de alta activación suelen coincidir con
              alteraciones del plexo nervioso subbasal: menor densidad de fibras nerviosas, trayectos
              irregulares o presencia de células dendríticas. Si el mapa se concentra en áreas
              periféricas sin relevancia clínica, revise el resultado con criterio profesional.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Control de opacidad
            </p>
            <p>
              El slider ajusta la transparencia del mapa superpuesto sobre la imagen original.
              Reduzca la opacidad para comparar el mapa con la morfología real de las fibras.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
