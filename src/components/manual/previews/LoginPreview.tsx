import { AppFrame, Callout } from "./AppFrame";

export function LoginPreview() {
  return (
    <div className="space-y-3">
      <AppFrame url="/login">
        {/* Auth background */}
        <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[oklch(0.18_0.06_245)] p-6">
          {/* Decorative grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(oklch(0.78 0.12 205) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.12 205) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
            aria-hidden="true"
          />
          {/* Login card */}
          <div className="relative w-72 rounded-xl border border-white/10 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[oklch(0.46_0.16_242)] text-white">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="3" />
                  <path d="M12 11v9" />
                  <path d="M9 14l3-3 3 3" />
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-bold text-[oklch(0.22_0.035_245)]">Biotecare</p>
                <p className="text-[9px] text-slate-400">IVCM + IA clínica</p>
              </div>
            </div>
            {/* Tabs */}
            <div className="mb-4 flex rounded-lg bg-slate-100 p-0.5 text-[10px]">
              <div className="flex-1 rounded-md bg-white py-1 text-center font-semibold text-[oklch(0.22_0.035_245)] shadow-xs">
                Iniciar sesión
              </div>
              <div className="flex-1 py-1 text-center text-slate-400">Crear cuenta</div>
            </div>
            {/* Fields */}
            <div className="space-y-2">
              <div>
                <label className="mb-0.5 block text-[10px] font-medium text-slate-600">
                  Correo electrónico
                </label>
                <div className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[10px] text-slate-400">
                  doctor@hospital.es
                </div>
              </div>
              <div>
                <label className="mb-0.5 block text-[10px] font-medium text-slate-600">
                  Contraseña
                </label>
                <div className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[10px] text-slate-300">
                  ••••••••••
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mt-3 w-full rounded-lg bg-[oklch(0.46_0.16_242)] py-1.5 text-[11px] font-semibold text-white"
            >
              Entrar
            </button>
          </div>
        </div>
      </AppFrame>
      {/* Callouts */}
      <ul className="space-y-1.5 pl-1">
        <Callout n={1} label="Introduce tu correo electrónico registrado." />
        <Callout n={2} label="Introduce tu contraseña (mínimo 8 caracteres)." />
        <Callout n={3} label='Pulsa "Entrar" para acceder al sistema.' />
        <Callout n={4} label='Usa la pestaña "Crear cuenta" si es tu primer acceso.' variant="amber" />
      </ul>
    </div>
  );
}
