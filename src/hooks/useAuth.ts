"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import { login } from "@/lib/api/auth";
import { isSessionValid, useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      setSession(data.access_token, data.expires_in);
      const params =
        typeof window === "undefined" ? null : new URLSearchParams(window.location.search);
      const next = params?.get("next") ?? "/patients";
      router.replace(next);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  return {
    token,
    expiresAt,
    isAuthenticated: isSessionValid(token, expiresAt),
    loginMutation,
    clearSession,
  };
}
