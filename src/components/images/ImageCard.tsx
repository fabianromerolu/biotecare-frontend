"use client";

import { Eye, FileImage } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImageStatusBadge } from "@/components/images/ImageStatusBadge";
import { Button } from "@/components/ui/button";
import { useImageFile } from "@/hooks/useImages";
import { blobToPreviewUrl } from "@/lib/utils/tiffDecoder";
import { formatBytes, formatDateOnly } from "@/lib/utils/formatters";
import type { ImageRead } from "@/types/api";

export function ImageCard({ patientId, image }: { patientId: string; image: ImageRead }) {
  const fileQuery = useImageFile(image.id);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!fileQuery.data) return;
    let objectUrl: string | null = null;
    blobToPreviewUrl(fileQuery.data)
      .then((url) => {
        if (url.startsWith("blob:")) objectUrl = url;
        setPreviewUrl(url);
      })
      .catch(() => setPreviewUrl(null));
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileQuery.data]);

  return (
    <article className="rounded-lg border bg-card p-4">
      <div className="mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-md border bg-muted">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={`Imagen IVCM: ${image.original_filename}`}
            className="h-full w-full object-contain"
          />
        ) : (
          <FileImage className="size-9 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 truncate text-sm font-semibold">{image.original_filename}</h3>
          <ImageStatusBadge status={image.status} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <p>Ojo</p>
            <p className="font-medium text-foreground">{image.eye ?? "No registrado"}</p>
          </div>
          <div>
            <p>Tamaño</p>
            <p className="font-medium text-foreground">{formatBytes(image.size_bytes)}</p>
          </div>
          <div>
            <p>Dimensiones</p>
            <p className="font-medium text-foreground">
              {image.width && image.height ? `${image.width} x ${image.height}px` : "N/D"}
            </p>
          </div>
          <div>
            <p>Fecha</p>
            <p className="font-medium text-foreground">{formatDateOnly(image.created_at)}</p>
          </div>
        </div>
        <Button className="w-full" variant="outline" asChild>
          <Link href={`/patients/${patientId}/images/${image.id}`}>
            <Eye />
            Ver imagen
          </Link>
        </Button>
      </div>
    </article>
  );
}
