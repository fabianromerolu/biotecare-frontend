import UTIF from "utif";

/**
 * Convierte un Blob de imagen a una URL utilizable en <img>.
 * Para TIFF: decodifica con UTIF y renderiza en canvas → dataURL.
 * Para el resto: usa URL.createObjectURL directamente.
 */
export async function blobToPreviewUrl(blob: Blob): Promise<string> {
  if (await isTiffBlob(blob)) {
    return decodeTiff(blob);
  }
  return URL.createObjectURL(blob);
}

async function isTiffBlob(blob: Blob): Promise<boolean> {
  if (blob.type === "image/tiff" || blob.type === "image/x-tiff") {
    return true;
  }

  const bytes = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
  return (
    (bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2a && bytes[3] === 0x00) ||
    (bytes[0] === 0x4d && bytes[1] === 0x4d && bytes[2] === 0x00 && bytes[3] === 0x2a)
  );
}

async function decodeTiff(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const ifds = UTIF.decode(buffer);
  if (!ifds.length) throw new Error("TIFF sin páginas");

  UTIF.decodeImage(buffer, ifds[0]);
  const { width, height } = ifds[0] as { width: number; height: number };
  const rgba = UTIF.toRGBA8(ifds[0]);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear contexto 2D");

  const imageData = ctx.createImageData(width, height);
  imageData.data.set(rgba);
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
}
