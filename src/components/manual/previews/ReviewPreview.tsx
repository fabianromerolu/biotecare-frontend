import { AppFrame, Callout } from "./AppFrame";

export function ReviewPreview() {
  return (
    <div className="space-y-3">
      {/* Show all three states side by side */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* State 1: Pending */}
        <div className="overflow-hidden rounded-xl border shadow-xs">
          <div className="border-b bg-amber-50 px-3 py-2">
            <p className="text-[10px] font-bold text-amber-800">⏳ Revisión pendiente</p>
          </div>
          <div className="bg-white p-3">
            <p className="mb-2 text-[9px] leading-snug text-slate-600">
              Confirme su valoración clínica del resultado antes de cerrar el expediente.
            </p>
            <div className="space-y-1.5">
              <button
                type="button"
                className="w-full rounded-lg bg-emerald-600 py-1 text-[9px] font-semibold text-white"
              >
                ✓ Aceptar resultado
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-red-300 py-1 text-[9px] font-semibold text-red-600"
              >
                ✕ Rechazar resultado
              </button>
            </div>
          </div>
        </div>

        {/* State 2: Accepted */}
        <div className="overflow-hidden rounded-xl border shadow-xs">
          <div className="border-b bg-emerald-50 px-3 py-2">
            <p className="text-[10px] font-bold text-emerald-800">✓ Predicción aceptada</p>
          </div>
          <div className="bg-white p-3">
            <p className="text-[9px] leading-snug text-slate-600">
              El médico responsable ratificó el resultado. Queda registrado en el expediente clínico.
            </p>
            <p className="mt-2 text-[8px] text-slate-400">
              dr. garcía · 04/06/2026 · 10:32
            </p>
          </div>
        </div>

        {/* State 3: Rejected */}
        <div className="overflow-hidden rounded-xl border shadow-xs">
          <div className="border-b bg-red-50 px-3 py-2">
            <p className="text-[10px] font-bold text-red-800">✕ Predicción rechazada</p>
          </div>
          <div className="bg-white p-3">
            <p className="text-[9px] leading-snug text-slate-600">
              El médico responsable descartó el resultado. Queda registrado en el expediente clínico.
            </p>
            <p className="mt-2 text-[8px] text-slate-400">
              dr. garcía · 04/06/2026 · 11:05
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation dialog mock */}
      <div className="rounded-xl border bg-white p-3 shadow-xs">
        <p className="mb-2 text-[10px] font-bold text-slate-700">
          Diálogo de confirmación (aparece al pulsar Aceptar o Rechazar)
        </p>
        <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
          <div className="border-b bg-slate-50 p-3">
            <p className="text-[10px] font-bold text-slate-800">Confirmar aceptación</p>
            <p className="mt-1 text-[9px] text-slate-500">
              Esta acción quedará registrada en el expediente clínico y no puede modificarse
              posteriormente.
            </p>
          </div>
          <div className="flex justify-end gap-2 p-2">
            <button
              type="button"
              className="rounded border px-2.5 py-1 text-[9px] text-slate-600"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="rounded bg-emerald-600 px-2.5 py-1 text-[9px] font-bold text-white"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>

      <ul className="space-y-1.5 pl-1">
        <Callout n={1} label='Estado inicial: Revisión pendiente (ámbar). El médico debe aceptar o rechazar.' />
        <Callout n={2} label='Aceptado (verde): el resultado es clínicamente coherente y queda registrado.' />
        <Callout n={3} label='Rechazado (rojo): el médico descarta el resultado (imagen de baja calidad, etc.).' />
        <Callout n={4} label='¡Irreversible! Confirma bien antes de pulsar el botón final.' variant="amber" />
      </ul>
    </div>
  );
}
