"use client";

import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Rect, Stage, Text } from "react-konva";
import { Label } from "@/components/ui/label";

export function HeatmapViewer({ heatmapBlob }: { heatmapBlob: Blob | undefined }) {
  const [opacity, setOpacity] = useState(0.55);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 640, height: 420 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);

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

  const url = useMemo(() => (heatmapBlob ? URL.createObjectURL(heatmapBlob) : null), [heatmapBlob]);

  useEffect(() => {
    if (!url) return;
    const img = new window.Image();
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth || 640, height: img.naturalHeight || 420 });
      setImageElement(img);
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  const ratio = naturalSize.height / naturalSize.width;
  const canvasHeight = canvasWidth > 0 ? Math.max(180, Math.round(canvasWidth * ratio)) : 0;

  return (
    <section className="rounded-lg border bg-card p-4" aria-labelledby="heatmap-title">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="heatmap-title" className="text-sm font-semibold">
          Mapa de activación Grad-CAM
        </h2>
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
      </div>
      <div ref={containerRef} className="overflow-hidden rounded-md border bg-muted">
        {canvasWidth > 0 && canvasHeight > 0 && (
          <Stage
            width={canvasWidth}
            height={canvasHeight}
            aria-label="Mapa de activación Grad-CAM"
          >
            <Layer>
              <Rect x={0} y={0} width={canvasWidth} height={canvasHeight} fill="#101827" />
              {imageElement ? (
                <KonvaImage
                  image={imageElement}
                  x={0}
                  y={0}
                  width={canvasWidth}
                  height={canvasHeight}
                  opacity={opacity}
                />
              ) : (
                <Text
                  x={0}
                  y={canvasHeight / 2 - 8}
                  width={canvasWidth}
                  align="center"
                  fill="#9CA3AF"
                  text="Cargando mapa de activación…"
                />
              )}
            </Layer>
          </Stage>
        )}
      </div>
    </section>
  );
}
