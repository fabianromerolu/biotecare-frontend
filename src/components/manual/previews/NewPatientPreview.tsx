import { AppFrame, SidebarMock, TopBarMock, Callout } from "./AppFrame";

export function NewPatientPreview() {
  return (
    <div className="space-y-3">
      <AppFrame url="/patients/new">
        <div className="flex h-[300px]">
          <SidebarMock active="/patients" />
          <div className="flex flex-1 flex-col">
            <TopBarMock title="Nuevo paciente" />
            <div className="flex-1 overflow-auto p-4">
              <div className="rounded-xl border bg-white p-4 shadow-xs">
                <h3 className="mb-3 text-[12px] font-bold text-[oklch(0.22_0.035_245)]">
                  Nuevo paciente
                </h3>
                <div className="space-y-3">
                  {/* External code - required */}
                  <div>
                    <div className="mb-1 flex items-center gap-1">
                      <label className="text-[10px] font-semibold text-slate-700">
                        Código externo
                      </label>
                      <span className="rounded bg-red-50 px-1 text-[8px] font-bold text-red-500">
                        OBLIGATORIO
                      </span>
                    </div>
                    <div className="rounded-lg border-2 border-[oklch(0.46_0.16_242)] bg-white px-2.5 py-1.5 text-[10px] text-slate-600">
                      HRT-2026-0042
                    </div>
                    <p className="mt-0.5 text-[9px] text-slate-400">
                      Identificador anónimo de tu historia clínica.
                    </p>
                  </div>
                  {/* Birth year - optional */}
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-slate-700">
                      Año de nacimiento{" "}
                      <span className="font-normal text-slate-400">(opcional)</span>
                    </label>
                    <div className="rounded-lg border bg-white px-2.5 py-1.5 text-[10px] text-slate-600">
                      1978
                    </div>
                  </div>
                  {/* Sex - optional */}
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-slate-700">
                      Sexo <span className="font-normal text-slate-400">(opcional)</span>
                    </label>
                    <div className="flex items-center justify-between rounded-lg border bg-white px-2.5 py-1.5 text-[10px] text-slate-600">
                      <span>Femenino</span>
                      <span className="text-slate-400">▾</span>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-[oklch(0.46_0.16_242)] py-1.5 text-[10px] font-semibold text-white"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border px-3 py-1.5 text-[10px] font-medium text-slate-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppFrame>
      <ul className="space-y-1.5 pl-1">
        <Callout n={1} label='Código externo: único campo obligatorio. Usa un ID anónimo de tu HCE.' />
        <Callout n={2} label='Año de nacimiento y sexo son opcionales pero mejoran la trazabilidad.' />
        <Callout n={3} label='El código externo NO se puede modificar una vez guardado.' variant="amber" />
      </ul>
    </div>
  );
}
