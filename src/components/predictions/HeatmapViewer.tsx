"use client";

import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Image as KonvaImage, Layer, Rect, Stage, Text } from "react-konva";
import { Label } from "@/components/ui/label";

export function HeatmapViewer({ heatmapBlob }: { heatmapBlob: Blob | undefined }) {
  const [opacity, setOpacity] = useState(0.55);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 640, height: 420 });

  const url = useMemo(() => (heatmapBlob ? URL.createObjectURL(heatmapBlob) : null), [heatmapBlob]);

  useEffect(() => {
    if (!url) {
      return;
    }
    const image = new window.Image();
    image.onload = () => {
      setNaturalSize({ width: image.naturalWidth || 640, height: image.naturalHeight || 420 });
      setImageElement(image);
    };
    image.src = url;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  const canvasWidth = 720;
  const ratio = naturalSize.height / naturalSize.width;
  const canvasHeight = Math.max(320, Math.round(canvasWidth * ratio));

  return (
    <section className="rounded-lg border bg-card p-4" aria-labelledby="heatmap-title">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="heatmap-title" className="text-sm font-semibold">
          Grad-CAM
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
            aria-label={`Opacidad del heatmap: ${Math.round(opacity * 100)}%`}
            title={`Opacidad: ${Math.round(opacity * 100)}%`}
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-md border bg-muted">
        <Stage
          width={canvasWidth}
          height={canvasHeight}
          className="max-w-full"
          aria-label="Canvas de heatmap Grad-CAM"
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
                fill="#E5E7EB"
                text="Heatmap no disponible"
              />
            )}
          </Layer>
        </Stage>
      </div>
    </section>
  );
}
