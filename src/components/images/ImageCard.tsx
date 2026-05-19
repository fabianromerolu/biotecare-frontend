import { Eye, FileImage } from "lucide-react";
import Link from "next/link";
import { ImageStatusBadge } from "@/components/images/ImageStatusBadge";
import { Button } from "@/components/ui/button";
import { formatBytes, formatDateOnly } from "@/lib/utils/formatters";
import type { ImageRead } from "@/types/api";

export function ImageCard({ patientId, image }: { patientId: string; image: ImageRead }) {
  return (
    <article className="rounded-lg border bg-card p-4">
      <div className="mb-4 flex aspect-video items-center justify-center rounded-md bg-muted">
        <FileImage className="size-9 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 truncate text-sm font-semibold">{image.original_filename}</h3>
          <ImageStatusBadge status={image.status} />
        </div>
        <dl className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <dt>Ojo</dt>
            <dd className="font-medium text-foreground">{image.eye ?? "No registrado"}</dd>
          </div>
          <div>
            <dt>Tamano</dt>
            <dd className="font-medium text-foreground">{formatBytes(image.size_bytes)}</dd>
          </div>
          <div>
            <dt>Dimensiones</dt>
            <dd className="font-medium text-foreground">
              {image.width && image.height ? `${image.width} x ${image.height}px` : "N/D"}
            </dd>
          </div>
          <div>
            <dt>Fecha</dt>
            <dd className="font-medium text-foreground">{formatDateOnly(image.created_at)}</dd>
          </div>
        </dl>
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
