"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { TOUR_ROUTES } from "@/lib/tour/tourSteps";
import { tourStorage } from "@/lib/tour/tourStorage";
import type { TourStep } from "@/lib/tour/tourTypes";

interface TourContextValue {
  isActive: boolean;
  currentStep: TourStep | null;
  stepIndex: number;
  totalSteps: number;
  targetRect: DOMRect | null;
  startTour: (forceGlobal?: boolean) => void;
  next: () => void;
  prev: () => void;
  skip: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

const GLOBAL_STEP_IDS = new Set([
  "__global_welcome",
  "sidebar__nav-patients",
  "sidebar__nav-model",
  "topbar__session-badge",
  "topbar__logout-button",
]);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role = useAuthStore((state) => state.user?.role ?? "doctor");

  const [isActive, setIsActive] = useState(false);
  const [activeSteps, setActiveSteps] = useState<TourStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const observerRef = useRef<ResizeObserver | null>(null);
  const scrollListenerRef = useRef<(() => void) | null>(null);

  const buildSteps = useCallback(
    (forceGlobal = false): TourStep[] => {
      const isGlobalDone = tourStorage.isGlobalCompleted();
      const steps: TourStep[] = [];

      // Pasos de bienvenida global (solo si es la primera vez o forzado)
      if (!isGlobalDone || forceGlobal) {
        const globalRoute = TOUR_ROUTES.find(
          (r) => r.pathname === "/patients" && r.matchMode === "exact",
        );
        if (globalRoute) {
          const globalSteps = globalRoute.steps.filter((s) =>
            GLOBAL_STEP_IDS.has(s.targetId),
          );
          steps.push(
            ...globalSteps.filter(
              (s) => s.roles.includes("all") || s.roles.includes(role),
            ),
          );
        }
      }

      // Pasos específicos de la ruta actual (excluir los globales para no repetir)
      const routeSteps = TOUR_ROUTES.filter((r) => {
        if (r.matchMode === "exact") return r.pathname === pathname;
        return pathname.startsWith(r.pathname);
      })
        .flatMap((r) => r.steps)
        .filter((s) => !GLOBAL_STEP_IDS.has(s.targetId))
        .filter((s) => s.roles.includes("all") || s.roles.includes(role));

      // Deduplicar por targetId manteniendo el primero encontrado
      const seen = new Set<string>();
      const deduped: TourStep[] = [];
      for (const s of [...steps, ...routeSteps]) {
        if (!seen.has(s.targetId)) {
          seen.add(s.targetId);
          deduped.push(s);
        }
      }

      return deduped;
    },
    [pathname, role],
  );

  const resolveRect = useCallback((step: TourStep): DOMRect | null => {
    if (step.isModal) return null;
    const el = document.querySelector<HTMLElement>(
      `[data-tour-id="${step.targetId}"]`,
    );
    if (!el) return null;
    return el.getBoundingClientRect();
  }, []);

  const attachObservers = useCallback(
    (step: TourStep) => {
      observerRef.current?.disconnect();
      if (scrollListenerRef.current) {
        window.removeEventListener("scroll", scrollListenerRef.current);
        scrollListenerRef.current = null;
      }

      if (step.isModal) return;

      const el = document.querySelector<HTMLElement>(
        `[data-tour-id="${step.targetId}"]`,
      );
      if (!el) return;

      observerRef.current = new ResizeObserver(() => {
        setTargetRect(el.getBoundingClientRect());
      });
      observerRef.current.observe(el);
      observerRef.current.observe(document.body);

      const onScroll = () => setTargetRect(el.getBoundingClientRect());
      scrollListenerRef.current = onScroll;
      window.addEventListener("scroll", onScroll, { passive: true });
    },
    [],
  );

  const activateStep = useCallback(
    (step: TourStep) => {
      const delay = step.mountDelay ?? 0;

      if (delay === 0) {
        const rect = resolveRect(step);
        setTargetRect(rect);
        if (!step.isModal && rect) {
          const el = document.querySelector<HTMLElement>(
            `[data-tour-id="${step.targetId}"]`,
          );
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        attachObservers(step);
      } else {
        setTargetRect(null);
        const t = window.setTimeout(() => {
          const rect = resolveRect(step);
          setTargetRect(rect);
          if (!step.isModal && rect) {
            const el = document.querySelector<HTMLElement>(
              `[data-tour-id="${step.targetId}"]`,
            );
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          attachObservers(step);
        }, delay);
        return t;
      }
    },
    [resolveRect, attachObservers],
  );

  const startTour = useCallback(
    (forceGlobal = false) => {
      const steps = buildSteps(forceGlobal);
      if (steps.length === 0) return;
      setActiveSteps(steps);
      setStepIndex(0);
      setIsActive(true);
      activateStep(steps[0]!);
    },
    [buildSteps, activateStep],
  );

  const finishTour = useCallback(() => {
    tourStorage.markGlobalCompleted();
    tourStorage.markRouteCompleted(pathname);
    observerRef.current?.disconnect();
    if (scrollListenerRef.current) {
      window.removeEventListener("scroll", scrollListenerRef.current);
      scrollListenerRef.current = null;
    }
    setIsActive(false);
    setActiveSteps([]);
    setTargetRect(null);
  }, [pathname]);

  const next = useCallback(() => {
    const nextIdx = stepIndex + 1;
    if (nextIdx >= activeSteps.length) {
      finishTour();
      return;
    }
    setStepIndex(nextIdx);
    activateStep(activeSteps[nextIdx]!);
  }, [activeSteps, stepIndex, finishTour, activateStep]);

  const prev = useCallback(() => {
    const prevIdx = stepIndex - 1;
    if (prevIdx < 0) return;
    setStepIndex(prevIdx);
    activateStep(activeSteps[prevIdx]!);
  }, [activeSteps, stepIndex, activateStep]);

  const skip = useCallback(() => {
    finishTour();
  }, [finishTour]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isActive, skip]);

  // Auto-inicio al montar: solo si el tour global no se completó
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (tourStorage.isGlobalCompleted()) return;
    const t = window.setTimeout(() => startTour(false), 800);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      if (scrollListenerRef.current) {
        window.removeEventListener("scroll", scrollListenerRef.current);
      }
    };
  }, []);

  const currentStep = isActive ? (activeSteps[stepIndex] ?? null) : null;

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        stepIndex,
        totalSteps: activeSteps.length,
        targetRect,
        startTour,
        next,
        prev,
        skip,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTourContext(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTourContext must be inside TourProvider");
  return ctx;
}
