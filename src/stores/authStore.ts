"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SESSION_COOKIE } from "@/lib/constants";
import type { UserRole } from "@/types/api";

interface SessionUser {
  id: string | null;
  role: UserRole | null;
}

interface AuthState {
  token: string | null;
  expiresAt: number | null;
  user: SessionUser | null;
  setSession: (token: string, expiresIn: number) => void;
  clearSession: () => void;
}

const noopStorage: Storage = {
  length: 0,
  clear: () => undefined,
  getItem: () => null,
  key: () => null,
  removeItem: () => undefined,
  setItem: () => undefined,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      expiresAt: null,
      user: null,
      setSession: (token, expiresIn) => {
        const expiresAt = Date.now() + expiresIn * 1000;
        const payload = decodeJwtPayload(token);
        set({
          token,
          expiresAt,
          user: {
            id: payload?.sub ?? null,
            role: payload?.role === "admin" ? "admin" : "doctor",
          },
        });
        setSessionCookie(expiresIn);
      },
      clearSession: () => {
        set({ token: null, expiresAt: null, user: null });
        expireSessionCookie();
      },
    }),
    {
      name: "biotecare-auth",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.sessionStorage,
      ),
      partialize: (state) => ({
        token: state.token,
        expiresAt: state.expiresAt,
        user: state.user,
      }),
    },
  ),
);

export function isSessionValid(token: string | null, expiresAt: number | null): boolean {
  return Boolean(token && expiresAt && expiresAt > Date.now());
}

function setSessionCookie(maxAgeSeconds: number) {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${SESSION_COOKIE}=active; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
}

function expireSessionCookie() {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${SESSION_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function decodeJwtPayload(token: string): { sub?: string; role?: string } | null {
  try {
    const [, payload] = token.split(".");
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "="));
    return JSON.parse(decoded) as { sub?: string; role?: string };
  } catch {
    return null;
  }
}
