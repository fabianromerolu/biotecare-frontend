export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "No registrado";
  }
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatDateOnly(value: string | null | undefined): string {
  if (!value) {
    return "No registrado";
  }
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function formatProbability(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function sexLabel(value: string | null | undefined): string {
  if (value === "F") {
    return "Femenino";
  }
  if (value === "M") {
    return "Masculino";
  }
  if (value === "O") {
    return "Otro";
  }
  return "No registrado";
}

export function methodLabel(value: string | null | undefined): string {
  if (value === "mean") {
    return "Promedio";
  }
  if (value === "max") {
    return "Maximo";
  }
  if (value === "attention") {
    return "Atencion";
  }
  return "No aplica";
}

export function compactId(value: string): string {
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}
