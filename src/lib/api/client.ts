"use client";

import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { isSessionValid, useAuthStore } from "@/stores/authStore";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const { token, expiresAt, clearSession } = useAuthStore.getState();
  if (token && !isSessionValid(token, expiresAt)) {
    clearSession();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("biotecare:auth-expired"));
    }
    return config;
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      useAuthStore.getState().clearSession();
      window.dispatchEvent(new Event("biotecare:auth-expired"));
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg ?? String(item)).join(" ");
    }
    if (typeof detail === "string") {
      return detail;
    }
    if (error.response?.status === 413) {
      return "El archivo supera el tamano permitido.";
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrio un error inesperado.";
}
