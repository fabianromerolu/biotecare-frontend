"use client";

import { HelpCircle, ImagePlus, UploadCloud, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MAX_UPLOAD_MB } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/utils/formatters";
import { blobToPreviewUrl } from "@/lib/utils/tiffDecoder";
import type { EyeSide, UploadImagesInput } from "@/types/api";

const ACCEPTED_MIME = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg", ".jfif"],
  "image/pjpeg": [".jpg", ".jpeg", ".jfif"],
  "image/tiff": [".tif", ".tiff"],
  "image/x-tiff": [".tif", ".tiff"],
  "image/bmp": [".bmp"],
  "image/x-ms-bmp": [".bmp"],
  "image/x-windows-bmp": [".bmp"],
  "application/octet-stream": [".png", ".jpg", ".jpeg", ".jfif", ".tif", ".tiff", ".bmp"],
};

export function ImageUploadZone({
  progress,
  isPending,
  onSubmit,
}: {
  progress: number;
  isPending: boolean;
  onSubmit: (input: UploadImagesInput) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [eye, setEye] = useState<EyeSide | null>(null);
  const [zDepth, setZDepth] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function setPreviewFromFile(selected: File | undefined) {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    if (!selected) {
      setPreviewUrl(null);
      setPreviewName(null);
      return;
    }

    let nextPreviewUrl: string;
    try {
      nextPreviewUrl = await blobToPreviewUrl(selected);
    } catch {
      nextPreviewUrl = URL.createObjectURL(selected);
    }
    setPreviewUrl(nextPreviewUrl);
    setPreviewName(selected.name);
  }

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const validFiles: File[] = [];
    const invalidMessages: string[] = [];
    for (const selected of acceptedFiles) {
      const validationError = await validateImageFile(selected);
      if (validationError) {
        invalidMessages.push(`${selected.name}: ${validationError}`);
      } else {
        validFiles.push(selected);
      }
    }

    if (!validFiles.length) {
      setError(invalidMessages[0] ?? "Selecciona al menos una imagen valida.");
      return;
    }

    setFiles((current) => [...current, ...validFiles]);
    setError(invalidMessages.length ? invalidMessages.join(" ") : null);
    if (!previewUrl) {
      await setPreviewFromFile(validFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: ACCEPTED_MIME,
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDrop,
    onDropRejected: () => {
      setError("Selecciona imagenes PNG, JPEG/JFIF, TIFF o BMP validas.");
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function removeFile(index: number) {
    setFiles((current) => {
      const removed = current[index];
      const next = current.filter((_, itemIndex) => itemIndex !== index);
      if (removed?.name === previewName) {
        void setPreviewFromFile(next[0]);
      }
      return next;
    });
  }

  function clearFiles() {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setFiles([]);
    setPreviewUrl(null);
    setPreviewName(null);
    setError(null);
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!files.length) {
          setError("Selecciona una o varias imagenes IVCM validas.");
          return;
        }
        onSubmit({
          files,
          eye,
          z_depth_um: zDepth ? Number(zDepth) : null,
        });
      }}
    >
      <div
        {...getRootProps()}
        data-tour-id="upload__drop-zone"
        className={cn(
          "grid min-h-64 place-items-center rounded-lg border border-dashed bg-card p-6 text-center transition-colors",
          isDragActive && "border-primary bg-accent",
        )}
      >
        <input {...getInputProps()} aria-label="Seleccionar imagenes IVCM" />
        {files.length ? (
          <div className="grid w-full gap-4 md:grid-cols-[260px_1fr] md:text-left">
            <div className="overflow-hidden rounded-md border bg-muted">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={`Vista previa de ${previewName ?? "imagen IVCM"}`}
                  className="h-48 w-full object-contain"
                />
              ) : (
                <div className="grid h-48 place-items-center text-sm text-muted-foreground">
                  Vista previa no disponible
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-3">
              <div>
                <p className="font-medium">
                  {files.length} imagen{files.length !== 1 ? "es" : ""} seleccionada
                  {files.length !== 1 ? "s" : ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total {formatBytes(files.reduce((sum, item) => sum + item.size, 0))}
                </p>
              </div>

              <div className="max-h-44 space-y-2 overflow-y-auto rounded-md border p-2">
                {files.map((item, index) => (
                  <div
                    key={`${item.name}-${item.size}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    <button
                      type="button"
                      className="min-w-0 flex-1 truncate text-left hover:text-primary"
                      onClick={() => setPreviewFromFile(item)}
                      title={item.name}
                    >
                      {item.name}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {formatBytes(item.size)}
                      </span>
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => removeFile(index)}
                      aria-label={`Quitar ${item.name}`}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={open}>
                  <ImagePlus />
                  Agregar mas
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={clearFiles}>
                  <X />
                  Quitar todas
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <UploadCloud className="size-7" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium">Arrastra imagenes IVCM o selecciona archivos</p>
              <p className="mt-1 text-sm text-muted-foreground">
                PNG, JPEG, TIFF o BMP; puedes seleccionar varias; maximo {MAX_UPLOAD_MB} MB por
                archivo
              </p>
            </div>
            <Button type="button" variant="outline" onClick={open}>
              <ImagePlus />
              Seleccionar imagenes
            </Button>
          </div>
        )}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-5 rounded-lg border bg-card p-5 md:grid-cols-2">
        <fieldset className="grid gap-2" data-tour-id="upload__eye-selector">
          <legend className="text-sm font-medium">Ojo</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {(["OD", "OS"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={eye === value ? "true" : "false"}
                className={cn(
                  "rounded-md border px-3 py-3 text-sm font-medium transition-colors",
                  eye === value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted",
                )}
                onClick={() => setEye(eye === value ? null : value)}
              >
                <span className="block text-base">{value}</span>
                <span className="block text-xs font-normal opacity-80">
                  {value === "OD" ? "Ojo derecho" : "Ojo izquierdo"}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-2" data-tour-id="upload__z-depth-field">
          <div className="flex items-center gap-1">
            <Label htmlFor="z_depth_um">Profundidad Z (um)</Label>
            <ZDepthInfoDialog />
          </div>
          <Input
            id="z_depth_um"
            type="number"
            step="0.1"
            placeholder="42.5"
            value={zDepth}
            onChange={(event) => setZDepth(event.target.value)}
          />
        </div>
      </div>

      {isPending ? (
        <div className="rounded-lg border bg-card p-4">
          <Progress value={progress} aria-label={`Progreso de subida ${progress}%`} />
          <p className="mt-2 text-sm text-muted-foreground">Subiendo imagenes... {progress}%</p>
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !files.length} data-tour-id="upload__submit-button">
          <UploadCloud />
          {isPending
            ? "Subiendo"
            : files.length > 1
              ? `Subir ${files.length} imagenes`
              : "Subir imagen IVCM"}
        </Button>
      </div>
    </form>
  );
}

function ZDepthInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Informacion sobre Profundidad Z"
        >
          <HelpCircle className="size-3.5" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Profundidad Z (um)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Que es
            </p>
            <p>
              El plano de enfoque de la imagen confocal expresado en micrometros. Este valor indica
              a que profundidad fue tomada la imagen.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ejemplo
            </p>
            <p>
              Un estudio tipico captura planos entre 40 um y 60 um de profundidad corneal. Si el
              equipo registra Z = 52.3 um, introduzca ese valor.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Es obligatorio?
            </p>
            <p>
              No. Si su equipo no registra este dato, puede dejar el campo vacio. No afecta al
              analisis de IA y mejora la trazabilidad cuando esta disponible.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

async function validateImageFile(file: File): Promise<string | null> {
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    return `El archivo supera ${MAX_UPLOAD_MB} MB.`;
  }

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const valid = isPng(bytes) || isJpeg(bytes) || isTiff(bytes) || isBmp(bytes);

  if (!valid) {
    return "El tipo real del archivo no coincide con PNG, JPEG/JFIF, TIFF o BMP.";
  }
  return null;
}

function isPng(bytes: Uint8Array) {
  return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
}

function isJpeg(bytes: Uint8Array) {
  return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

function isTiff(bytes: Uint8Array) {
  return (
    (bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2a && bytes[3] === 0x00) ||
    (bytes[0] === 0x4d && bytes[1] === 0x4d && bytes[2] === 0x00 && bytes[3] === 0x2a)
  );
}

function isBmp(bytes: Uint8Array) {
  return bytes[0] === 0x42 && bytes[1] === 0x4d;
}
