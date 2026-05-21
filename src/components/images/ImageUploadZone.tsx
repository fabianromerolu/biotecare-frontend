"use client";

import { ImagePlus, UploadCloud, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MAX_UPLOAD_MB } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/utils/formatters";
import type { EyeSide, UploadImageInput } from "@/types/api";

const ACCEPTED_MIME = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/tiff": [".tif", ".tiff"],
  "image/bmp": [".bmp"],
};

export function ImageUploadZone({
  progress,
  isPending,
  onSubmit,
}: {
  progress: number;
  isPending: boolean;
  onSubmit: (input: UploadImageInput) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<string | null>(null);
  const [eye, setEye] = useState<EyeSide | null>(null);
  const [zDepth, setZDepth] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    if (!selected) {
      return;
    }
    const validationError = await validateImageFile(selected);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const nextPreviewUrl = URL.createObjectURL(selected);
    const image = new window.Image();
    image.onload = () => setDimensions(`${image.naturalWidth} x ${image.naturalHeight} px`);
    image.onerror = () => setDimensions("Vista previa no disponible");
    image.src = nextPreviewUrl;
    setError(null);
    setFile(selected);
    setPreviewUrl(nextPreviewUrl);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: ACCEPTED_MIME,
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!file) {
          setError("Selecciona una imagen IVCM valida.");
          return;
        }
        onSubmit({
          file,
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
        <input {...getInputProps()} aria-label="Seleccionar imagen IVCM" />
        {previewUrl && file ? (
          <div className="grid w-full gap-4 md:grid-cols-[260px_1fr] md:text-left">
            <div className="overflow-hidden rounded-md border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={`Vista previa de ${file.name}`}
                className="h-48 w-full object-contain"
              />
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatBytes(file.size)} · {dimensions ?? "Leyendo dimensiones"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                  }
                  setFile(null);
                  setPreviewUrl(null);
                  setDimensions(null);
                  setError(null);
                }}
              >
                <X />
                Quitar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <UploadCloud className="size-7" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium">Arrastra una imagen IVCM o selecciona un archivo</p>
              <p className="mt-1 text-sm text-muted-foreground">
                PNG, JPEG, TIFF o BMP · Maximo {MAX_UPLOAD_MB} MB
              </p>
            </div>
            <Button type="button" variant="outline" onClick={open}>
              <ImagePlus />
              Seleccionar imagen
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
          <Label htmlFor="z_depth_um">Profundidad Z (um)</Label>
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
          <p className="mt-2 text-sm text-muted-foreground">Subiendo imagen... {progress}%</p>
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !file} data-tour-id="upload__submit-button">
          <UploadCloud />
          {isPending ? "Subiendo" : "Subir imagen IVCM"}
        </Button>
      </div>
    </form>
  );
}

async function validateImageFile(file: File): Promise<string | null> {
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    return `El archivo supera ${MAX_UPLOAD_MB} MB.`;
  }

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const valid =
    isPng(bytes) ||
    isJpeg(bytes) ||
    isTiff(bytes) ||
    isBmp(bytes);

  if (!valid) {
    return "El tipo real del archivo no coincide con PNG, JPEG, TIFF o BMP.";
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
