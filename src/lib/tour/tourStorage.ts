const PREFIX = "biotecare-tour";

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // localStorage bloqueado — tour no persiste, no rompe la app
  }
}

function safeRemove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // noop
  }
}

export const tourStorage = {
  isGlobalCompleted(): boolean {
    if (typeof window === "undefined") return true;
    return safeGet(`${PREFIX}-global-completed`) === "true";
  },

  markGlobalCompleted(): void {
    safeSet(`${PREFIX}-global-completed`, "true");
  },

  isRouteCompleted(pathname: string): boolean {
    if (typeof window === "undefined") return true;
    return safeGet(`${PREFIX}-route:${pathname}`) === "true";
  },

  markRouteCompleted(pathname: string): void {
    safeSet(`${PREFIX}-route:${pathname}`, "true");
  },

  resetAll(): void {
    if (typeof window === "undefined") return;
    try {
      const toRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key?.startsWith(PREFIX)) toRemove.push(key);
      }
      toRemove.forEach(safeRemove);
    } catch {
      // noop
    }
  },
};
