"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/authStore";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthSessionWatcher queryClient={queryClient} />
          {children}
          <Toaster richColors closeButton />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function AuthSessionWatcher({ queryClient }: { queryClient: QueryClient }) {
  const router = useRouter();
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    const handleExpired = () => {
      clearSession();
      queryClient.clear();
      router.replace("/login");
    };

    window.addEventListener("biotecare:auth-expired", handleExpired);
    return () => window.removeEventListener("biotecare:auth-expired", handleExpired);
  }, [clearSession, queryClient, router]);

  useEffect(() => {
    if (!expiresAt) {
      return;
    }

    const now = Date.now();
    const warnIn = expiresAt - now - 5 * 60 * 1000;
    const expireIn = expiresAt - now;

    if (expireIn <= 0) {
      clearSession();
      queryClient.clear();
      router.replace("/login");
      return;
    }

    const timers: number[] = [];
    if (warnIn > 0) {
      timers.push(
        window.setTimeout(() => {
          toast.warning("Su sesion expirara en 5 minutos.");
        }, warnIn),
      );
    }

    timers.push(
      window.setTimeout(() => {
        clearSession();
        queryClient.clear();
        toast.info("Su sesion ha expirado.");
        router.replace("/login");
      }, expireIn),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [clearSession, expiresAt, queryClient, router]);

  return null;
}
