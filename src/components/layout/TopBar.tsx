"use client";

import { LogOut, ShieldCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TourResetButton } from "@/components/onboarding/TourResetButton";
import { useAuthStore } from "@/stores/authStore";

const TITLES: Record<string, string> = {
  "/patients": "Pacientes",
  "/model": "Estado del sistema",
};

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);

  const title =
    TITLES[pathname] ??
    (pathname.startsWith("/patients") ? "Gestion clinica" : "Biotecare");

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 pl-20 sm:px-6 lg:px-8 lg:pl-8">
        <div>
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
          <p
            className="flex items-center gap-1 text-xs text-muted-foreground"
            data-tour-id="topbar__session-badge"
          >
            <ShieldCheck className="size-3.5 text-emerald-700" aria-hidden="true" />
            Sesion clinica temporal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TourResetButton />
          <Button
            variant="outline"
            size="sm"
            data-tour-id="topbar__logout-button"
            onClick={() => {
              clearSession();
              router.replace("/login");
            }}
          >
            <LogOut />
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}
