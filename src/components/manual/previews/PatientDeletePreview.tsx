import { AppFrame, Callout } from "./AppFrame";

export function PatientDeletePreview() {
  return (
    <div className="space-y-3">
      <AppFrame url="/patients/HRT-2026-0042">
        {/* Blurred background hint + modal */}
        <div className="relative flex items-center justify-center bg-[oklch(0.975_0.008_225)] p-6" style={{ minHeight: 220 }}>
          {/* Background hint */}
          <div className="pointer-events-none absolute inset-0 flex items-start p-4 opacity-20">
            <div className="w-full rounded-lg border bg-white p-3">
              <p className="text-[10px] font-bold text-slate-800">HRT-2026-0042</p>
              <p className="text-[9px] text-slate-500">Año nac.: 1978 · Sexo: F · 2 imágenes</p>
            </div>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" aria-hidden="true" />

          {/* Dialog */}
          <div className="relative z-10 w-72 overflow-hidden rounded-xl border bg-white shadow-2xl">
            <div className="border-b bg-red-50 px-4 py-3">
              <p className="text-[12px] font-bold text-red-800">① Eliminar paciente</p>
            </div>
            <div className="p-4">
              <p className="text-[10px] leading-relaxed text-slate-700">
                Se eliminarán permanentemente:
              </p>
              <ul className="mt-2 space-y-1">
                {["Expediente del paciente HRT-2026-0042", "2 imágenes IVCM registradas", "Todos los análisis y predicciones"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-[9px] text-red-700">
                    <span className="text-red-500">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[9px] text-amber-800">
                ② Esta acción no se puede deshacer.
              </div>
            </div>
            <div className="flex gap-2 border-t px-4 py-3">
              <button type="button" className="flex-1 rounded-lg border py-1.5 text-[10px] font-medium text-slate-600">
                Cancelar
              </button>
              <button type="button" className="flex-1 rounded-lg bg-red-600 py-1.5 text-[10px] font-semibold text-white">
                Eliminar definitivamente
              </button>
            </div>
          </div>
        </div>
      </AppFrame>
      <ul className="space-y-1.5 pl-1">
        <Callout n={1} label='El diálogo lista exactamente qué se borrará: expediente, imágenes y análisis.' />
        <Callout n={2} label='La eliminación es permanente e irreversible. No se puede recuperar.' variant="amber" />
      </ul>
    </div>
  );
}
