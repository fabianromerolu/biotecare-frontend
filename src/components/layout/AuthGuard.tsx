"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { isSessionValid, useAuthStore } from "@/stores/authStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    const markHydrated = () => {
      if (active) {
        setHydrated(true);
      }
    };
    const unsubscribe = useAuthStore.persist.onFinishHydration(markHydrated);
    if (useAuthStore.persist.hasHydrated()) {
      queueMicrotask(markHydrated);
    } else {
      void useAuthStore.persist.rehydrate();
    }
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (!isSessionValid(token, expiresAt)) {
      clearSession();
      router.replace("/login");
    }
  }, [clearSession, expiresAt, hydrated, router, token]);

  if (!hydrated || !isSessionValid(token, expiresAt)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingSpinner label="Validando sesión" />
      </div>
    );
  }

  return children;
}
