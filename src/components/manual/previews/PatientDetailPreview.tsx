import { AppFrame, SidebarMock, TopBarMock, Callout } from "./AppFrame";

export function PatientDetailPreview() {
  return (
    <div className="space-y-3">
      <AppFrame url="/patients/HRT-2026-0042">
        <div className="flex h-[310px]">
          <SidebarMock active="/patients" />
          <div className="flex flex-1 flex-col">
            <TopBarMock title="Expediente" />
            <div className="flex-1 overflow-auto p-3 space-y-2">
              {/* Patient info card */}
              <div className="rounded-lg border bg-white p-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[12px] font-bold text-[oklch(0.22_0.035_245)]">
                      HRT-2026-0042
                    </p>
                    <div className="mt-1 flex gap-3 text-[9px] text-slate-500">
                      <span>Año nac.: 1978</span>
                      <span>Sexo: F</span>
                      <span>Creado: 01/06/2026</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded border px-2 py-0.5 text-[8px] font-medium text-slate-600"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[8px] font-medium text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>

              {/* Images timeline */}
              <div className="rounded-lg border bg-white p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-700">
                    Imágenes IVCM · 2 registradas
                  </p>
                  <button
                    type="button"
                    className="rounded bg-[oklch(0.46_0.16_242)] px-2 py-0.5 text-[8px] font-semibold text-white"
                  >
                    + Cargar imagen
                  </button>
                </div>
                {/* Timeline items */}
                <div className="space-y-1.5 pl-2">
                  {[
                    { date: "04/06/2026", file: "cornea_od_2026-06-04.tif", result: "Ojo seco", prob: 65, color: "red", review: "Aceptada" },
                    { date: "20/05/2026", file: "cornea_od_2026-05-20.tif", result: "Normal", prob: 32, color: "green", review: "Pendiente" },
                  ].map((img, i) => (
                    <div
                      key={i}
                      className="rounded border bg-slate-50 p-2 text-[9px]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700">{img.file}</span>
                        <span
                          className={`rounded-full px-1.5 py-0.5 font-semibold ${
                            img.color === "red"
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {img.result} · {img.prob}%
                        </span>
                      </div>
                      <div className="mt-0.5 flex justify-between text-[8px] text-slate-400">
                        <span>{img.date} · OD</span>
                        <span>Revisión: {img.review}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aggregate analysis */}
              <div className="rounded-lg border bg-white p-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-700">Análisis agregado</p>
                  <button
                    type="button"
                    className="rounded bg-[oklch(0.46_0.16_242)] px-2 py-0.5 text-[8px] font-semibold text-white"
                  >
                    Generar análisis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppFrame>
      <ul className="space-y-1.5 pl-1">
        <Callout n={1} label='Cabecera del expediente con código, año nac., sexo y fecha de creación.' />
        <Callout n={2} label='"Cargar imagen" sube una nueva imagen IVCM al expediente.' />
        <Callout n={3} label='Timeline: cada imagen muestra resultado, probabilidad y estado de revisión.' />
        <Callout n={4} label='"Generar análisis" combina todas las predicciones del paciente.' variant="green" />
      </ul>
    </div>
  );
}
