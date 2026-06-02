"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePatientImages } from "@/hooks/useImages";
import { usePatients } from "@/hooks/usePatients";
import { useAuthStore } from "@/stores/authStore";
import { TOUR_ROUTES } from "@/lib/tour/tourSteps";
import { tourStorage } from "@/lib/tour/tourStorage";
import type { TourRoute, TourStep } from "@/lib/tour/tourTypes";

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
]);

const RESERVED_PATIENT_PATHS = new Set(["new"]);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = useAuthStore((state) => state.user?.role ?? "doctor");
  const patientsQuery = usePatients();
  const firstPatientId = patientsQuery.data?.[0]?.id ?? null;
  const currentPatientId = extractPatientId(pathname);
  const patientIdForTour = currentPatientId ?? firstPatientId;
  const imagesQuery = usePatientImages(patientIdForTour ?? "", Boolean(patientIdForTour));
  const firstImageId = imagesQuery.data?.[0]?.id ?? null;
  const currentImageId = extractImageId(pathname);
  const imageIdForTour = currentImageId ?? firstImageId;

  const [isActive, setIsActive] = useState(false);
  const [activeSteps, setActiveSteps] = useState<TourStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const observerRef = useRef<ResizeObserver | null>(null);
  const scrollListenerRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearActivationTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const detachObservers = useCallback(() => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (scrollListenerRef.current) {
      window.removeEventListener("scroll", scrollListenerRef.current);
      scrollListenerRef.current = null;
    }
  }, []);

  const buildSteps = useCallback(
    (forceGlobal = false): TourStep[] => {
      const includeGlobal = !tourStorage.isGlobalCompleted() || forceGlobal;
      const fullJourney = forceGlobal;
      const matchedRoutes = fullJourney
        ? TOUR_ROUTES
        : TOUR_ROUTES.filter((route) => routeMatches(route, pathname));

      const routeSteps = matchedRoutes
        .flatMap((route) => route.steps)
        .filter((step) => includeGlobal || !GLOBAL_STEP_IDS.has(step.targetId))
        .filter((step) => step.roles.includes("all") || step.roles.includes(role));

      const seen = new Set<string>();
      const deduped: TourStep[] = [];
      for (const step of routeSteps) {
        if (!seen.has(step.targetId)) {
          seen.add(step.targetId);
          deduped.push(step);
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

  const resolveStepRoute = useCallback(
    (step: TourStep): string | null => {
      if (!step.route) return null;

      let href = step.route;
      if (href.includes("[patientId]")) {
        if (!patientIdForTour) return null;
        href = href.replace("[patientId]", patientIdForTour);
      }
      if (href.includes("[imageId]")) {
        if (!imageIdForTour) return null;
        href = href.replace("[imageId]", imageIdForTour);
      }
      return href;
    },
    [imageIdForTour, patientIdForTour],
  );

  const attachObservers = useCallback(
    (step: TourStep) => {
      detachObservers();
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
    [detachObservers],
  );

  const finishTour = useCallback(() => {
    tourStorage.markGlobalCompleted();
    tourStorage.markRouteCompleted(pathname);
    clearActivationTimer();
    detachObservers();
    setIsActive(false);
    setActiveSteps([]);
    setTargetRect(null);
  }, [clearActivationTimer, detachObservers, pathname]);

  const skipMissingStep = useCallback(
    (missingIndex: number) => {
      setStepIndex((current) => {
        if (current !== missingIndex) return current;
        let nextIndex = current + 1;
        while (nextIndex < activeSteps.length) {
          const nextStep = activeSteps[nextIndex];
          if (!nextStep?.route || resolveStepRoute(nextStep)) break;
          nextIndex += 1;
        }

        if (nextIndex >= activeSteps.length) {
          window.setTimeout(finishTour, 0);
          return current;
        }
        return nextIndex;
      });
    },
    [activeSteps, finishTour, resolveStepRoute],
  );

  const activateStep = useCallback(
    (step: TourStep, index: number) => {
      clearActivationTimer();
      detachObservers();
      setTargetRect(null);

      const href = resolveStepRoute(step);
      if (step.route && !href) {
        timerRef.current = window.setTimeout(() => skipMissingStep(index), 1200);
        return;
      }

      const shouldNavigate = Boolean(href && href !== pathname);
      if (href && shouldNavigate) {
        router.push(href);
      }

      const initialDelay = (step.mountDelay ?? 0) + (shouldNavigate ? 650 : 0);
      const tryResolve = (attempt = 0) => {
        if (step.isModal) {
          setTargetRect(null);
          return;
        }

        const rect = resolveRect(step);
        if (rect) {
          setTargetRect(rect);
          const el = document.querySelector<HTMLElement>(
            `[data-tour-id="${step.targetId}"]`,
          );
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
          attachObservers(step);
          return;
        }

        if (attempt < 6) {
          timerRef.current = window.setTimeout(() => tryResolve(attempt + 1), 180);
          return;
        }

        skipMissingStep(index);
      };

      timerRef.current = window.setTimeout(() => tryResolve(), initialDelay);
    },
    [
      attachObservers,
      clearActivationTimer,
      detachObservers,
      pathname,
      resolveRect,
      resolveStepRoute,
      router,
      skipMissingStep,
    ],
  );

  const startTour = useCallback(
    (forceGlobal = false) => {
      const steps = buildSteps(forceGlobal);
      if (steps.length === 0) return;
      setActiveSteps(steps);
      setStepIndex(0);
      setIsActive(true);
    },
    [buildSteps],
  );

  const next = useCallback(() => {
    const nextIdx = stepIndex + 1;
    if (nextIdx >= activeSteps.length) {
      finishTour();
      return;
    }
    setStepIndex(nextIdx);
  }, [activeSteps.length, finishTour, stepIndex]);

  const prev = useCallback(() => {
    const prevIdx = stepIndex - 1;
    if (prevIdx < 0) return;
    setStepIndex(prevIdx);
  }, [stepIndex]);

  const skip = useCallback(() => {
    finishTour();
  }, [finishTour]);

  const currentStep = useMemo(
    () => (isActive ? (activeSteps[stepIndex] ?? null) : null),
    [activeSteps, isActive, stepIndex],
  );

  useEffect(() => {
    if (!isActive || !currentStep) return;
    const t = window.setTimeout(() => activateStep(currentStep, stepIndex), 0);
    return () => window.clearTimeout(t);
  }, [activateStep, currentStep, isActive, stepIndex]);

  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isActive, skip]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (tourStorage.isGlobalCompleted()) return;
    const t = window.setTimeout(() => startTour(false), 800);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      clearActivationTimer();
      detachObservers();
    };
  }, [clearActivationTimer, detachObservers]);

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

function routeMatches(route: TourRoute, currentPathname: string) {
  if (route.matchMode === "exact") return route.pathname === currentPathname;
  if (route.matchMode === "startsWith") return currentPathname.startsWith(route.pathname);
  return patternMatches(route.pathname, currentPathname);
}

function patternMatches(pattern: string, currentPathname: string) {
  const patternSegments = segments(pattern);
  const currentSegments = segments(currentPathname);
  if (patternSegments.length !== currentSegments.length) return false;

  return patternSegments.every((segment, index) => {
    const current = currentSegments[index];
    if (segment === "[patientId]" && RESERVED_PATIENT_PATHS.has(current)) {
      return false;
    }
    if (segment.startsWith("[") && segment.endsWith("]")) {
      return Boolean(current);
    }
    return segment === current;
  });
}

function segments(path: string) {
  return path.split("/").filter(Boolean);
}

function extractPatientId(path: string): string | null {
  const parts = segments(path);
  if (parts[0] !== "patients") return null;
  const patientId = parts[1];
  if (!patientId || RESERVED_PATIENT_PATHS.has(patientId)) return null;
  return patientId;
}

function extractImageId(path: string): string | null {
  const parts = segments(path);
  if (parts[0] !== "patients" || parts[2] !== "images") return null;
  return parts[3] ?? null;
}
