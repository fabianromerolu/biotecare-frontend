import { AppFrame, SidebarMock, TopBarMock, Callout } from "./AppFrame";

export function PatientEditPreview() {
  return (
    <div className="space-y-3">
      <AppFrame url="/patients/HRT-2026-0042/edit">
        <div className="flex h-[260px]">
          <SidebarMock active="/patients" />
          <div className="flex flex-1 flex-col">
            <TopBarMock title="Editar paciente" />
            <div className="flex-1 overflow-auto p-4">
              <div className="rounded-xl border bg-white p-4 shadow-xs">
                <h3 className="mb-3 text-[12px] font-bold text-[oklch(0.22_0.035_245)]">
                  Editar paciente
                </h3>
                <div className="space-y-3">
                  {/* Code - readonly */}
                  <div>
                    <div className="mb-1 flex items-center gap-1.5">
                      <label className="text-[10px] font-semibold text-slate-700">
                        Código externo
                      </label>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-medium text-slate-500">
                        Solo lectura
                      </span>
                    </div>
                    <div className="rounded-lg border border-dashed bg-slate-50 px-2.5 py-1.5 text-[10px] text-slate-400 cursor-not-allowed">
                      HRT-2026-0042
                    </div>
                    <p className="mt-0.5 text-[9px] text-slate-400">
                      El código no se puede modificar una vez creado.
                    </p>
                  </div>
                  {/* Birth year - editable */}
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-slate-700">
                      ① Año de nacimiento
                    </label>
                    <div className="rounded-lg border-2 border-[oklch(0.46_0.16_242)] bg-white px-2.5 py-1.5 text-[10px] text-slate-600">
                      1982
                    </div>
                  </div>
                  {/* Sex - editable */}
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-slate-700">
                      ② Sexo
                    </label>
                    <div className="flex items-center justify-between rounded-lg border bg-white px-2.5 py-1.5 text-[10px] text-slate-600">
                      <span>Femenino</span>
                      <span className="text-slate-400">▾</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button type="button" className="flex-1 rounded-lg bg-[oklch(0.46_0.16_242)] py-1.5 text-[10px] font-semibold text-white">
                    Guardar cambios
                  </button>
                  <button type="button" className="rounded-lg border px-3 py-1.5 text-[10px] font-medium text-slate-600">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppFrame>
      <ul className="space-y-1.5 pl-1">
        <Callout n={1} label='Año de nacimiento y sexo: únicos campos editables.' />
        <Callout n={2} label='El código externo aparece deshabilitado — es inmutable por trazabilidad.' variant="amber" />
      </ul>
    </div>
  );
}
