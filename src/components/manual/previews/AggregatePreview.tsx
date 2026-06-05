import { AppFrame, SidebarMock, TopBarMock, Callout } from "./AppFrame";

function MiniGauge({ prob }: { prob: number }) {
  return (
    <svg viewBox="0 0 80 50" className="w-16 h-10" aria-label={`Gauge ${prob}%`}>
      <path d="M 14 42 A 30 30 0 0 1 40 12" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
      <path d="M 40 12 A 30 30 0 0 1 66 42" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
      {(() => {
        const angle = -150 + (prob / 100) * 300;
        const rad = (angle * Math.PI) / 180;
        return (
          <>
            <line x1="40" y1="42" x2={40 + 22 * Math.cos(rad)} y2={42 + 22 * Math.sin(rad)} stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="40" cy="42" r="2.5" fill="#1e293b" />
          </>
        );
      })()}
      <text x="40" y="35" textAnchor="middle" fontSize="7" fontWeight="bold" fill={prob >= 50 ? "#ef4444" : "#10b981"}>{prob}%</text>
    </svg>
  );
}

export function AggregatePreview() {
  return (
    <div className="space-y-3">
      <AppFrame url="/patients/HRT-2026-0042">
        <div className="flex h-[270px]">
          <SidebarMock active="/patients" />
          <div className="flex flex-1 flex-col">
            <TopBarMock title="Expediente" />
            <div className="flex-1 overflow-auto p-3 space-y-2">
              {/* Images mini list */}
              <div className="rounded-lg border bg-white p-2">
                <p className="mb-1.5 text-[9px] font-semibold text-slate-600">① Imágenes con predicción (2)</p>
                {[
                  { date: "04/06", file: "cornea_od_a.tif", prob: 65, color: "red" },
                  { date: "20/05", file: "cornea_od_b.tif", prob: 32, color: "green" },
                ].map((img) => (
                  <div key={img.file} className="mb-1 flex items-center justify-between rounded border-l-2 bg-slate-50 px-2 py-1" style={{ borderLeftColor: img.color === "red" ? "#ef4444" : "#10b981" }}>
                    <span className="text-[8px] text-slate-600">{img.date} · {img.file}</span>
                    <span className={`text-[8px] font-bold ${img.color === "red" ? "text-red-500" : "text-emerald-600"}`}>{img.prob}%</span>
                  </div>
                ))}
              </div>

              {/* Aggregate section */}
              <div className="rounded-lg border-2 border-[oklch(0.46_0.16_242)] bg-white p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-bold text-[oklch(0.22_0.035_245)]">
                    ② Análisis agregado del paciente
                  </p>
                  <button type="button" className="rounded bg-[oklch(0.46_0.16_242)] px-2 py-0.5 text-[8px] font-semibold text-white">
                    ③ Generar análisis
                  </button>
                </div>
                <p className="mb-2 text-[9px] text-slate-500">
                  Combina todas las predicciones del paciente usando el método de atención.
                </p>
                {/* Result preview */}
                <div className="flex items-center gap-3 rounded-lg bg-red-50 p-2">
                  <MiniGauge prob={54} />
                  <div>
                    <p className="text-[9px] font-bold text-red-700">④ Resultado: Ojo seco (54%)</p>
                    <p className="text-[8px] text-slate-500">Método: attention · Umbral: 50%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppFrame>
      <ul className="space-y-1.5 pl-1">
        <Callout n={1} label='El análisis agregado requiere al menos una imagen con predicción completada.' />
        <Callout n={2} label='La sección aparece en el expediente del paciente, desplazando hacia abajo.' />
        <Callout n={3} label='"Generar análisis" combina todas las predicciones usando método attention.' />
        <Callout n={4} label='El resultado agregado también requiere revisión médica (aceptar/rechazar).' variant="green" />
      </ul>
    </div>
  );
}
