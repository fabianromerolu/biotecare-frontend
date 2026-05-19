export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Biotecare";

export const MAX_UPLOAD_MB = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB ?? 25);

export const SESSION_COOKIE = "biotecare_session";
