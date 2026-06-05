import { AppFrame, SidebarMock, TopBarMock, Callout } from "./AppFrame";

/** Compact inline gauge for the analysis mockup */
function MiniGauge({ prob }: { prob: number }) {
  const cx = 50, cy = 46, r = 34;
  const toPoint = (deg: number) => ({
    x: cx + r * Math.cos((deg * Math.PI) / 180),
    y: cy + r * Math.sin((deg * Math.PI) / 180),
  });
  const start = toPoint(120);
  const mid   = toPoint(270);
  const end   = toPoint(60);
  const deg   = 120 + (prob / 100) * 300;
  const nrad  = (deg * Math.PI) / 180;

  return (
    <svg viewBox="0 0 100 72" className="w-full" aria-label={`Gauge ${prob}%`}>
      {/* Track */}
      <path d={`M ${start.x.toFixed(1)} ${start.y.toFixed(1)} A ${r} ${r} 0 1 1 ${end.x.toFixed(1)} ${end.y.toFixed(1)}`}
        fill="none" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
      {/* Green */}
      <path d={`M ${start.x.toFixed(1)} ${start.y.toFixed(1)} A ${r} ${r} 0 0 1 ${mid.x.toFixed(1)} ${mid.y.toFixed(1)}`}
        fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
      {/* Red */}
      <path d={`M ${mid.x.toFixed(1)} ${mid.y.toFixed(1)} A ${r} ${r} 0 0 1 ${end.x.toFixed(1)} ${end.y.toFixed(1)}`}
        fill="none" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" />
      {/* Needle */}
      <line x1={cx} y1={cy}
        x2={(cx + (r - 7) * Math.cos(nrad)).toFixed(1)}
        y2={(cy + (r - 7) * Math.sin(nrad)).toFixed(1)}
        stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="3.5" fill="#1e293b" />
      <circle cx={cx} cy={cy} r="1.5" fill="white" />
      {/* Value */}
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fontWeight="bold"
        fill={prob >= 50 ? "#ef4444" : "#10b981"}>{prob}%</text>
      <text x={cx} y={cy + 22} textAnchor="middle" fontSize="5.5" fill="#64748b">
        {prob >= 50 ? "Ojo seco" : "Normal"}
      </text>
    </svg>
  );
}

export function AnalysisPreview() {
  return (
    <div className="space-y-3">
      <AppFrame url="/patients/HRT-2026-0042/images/img-001">
        <div className="flex min-h-75">
          <SidebarMock active="/patients" />
          <div className="flex flex-1 flex-col overflow-hidden">
            <TopBarMock title="Detalle de imagen" />
            <div className="flex-1 overflow-auto p-3 space-y-2">

              {/* Pipeline stepper */}
              <div className="flex items-center gap-1 rounded-lg border bg-white px-3 py-2 flex-wrap">
                {[
                  { n: "①", label: "Cargada", done: true },
                  { n: "②", label: "Preprocesada", done: true },
                  { n: "③", label: "Predicha", done: true },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center gap-1">
                    {i > 0 && <div className="h-px w-3 bg-emerald-400" />}
                    <div className="flex items-center gap-1">
                      <div className="flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[7px] font-bold text-white">
                        ✓
                      </div>
                      <span className="text-[9px] font-semibold text-emerald-700">{s.n} {s.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Execute button */}
              <div className="rounded-lg border bg-white px-3 py-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[9px] font-semibold text-slate-700">④ Análisis con IA</p>
                  <p className="text-[8px] text-emerald-600">✓ Imagen analizada · ResNet-18</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-lg bg-linear-to-r from-blue-600 to-cyan-500 px-3 py-1 text-[9px] font-bold text-white"
                >
                  ✦ Ejecutar análisis IA
                </button>
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 gap-2">
                {/* Gauge */}
                <div className="flex flex-col items-center rounded-lg border bg-white p-2">
                  <p className="mb-1 text-[8px] font-semibold text-slate-600">⑤ Probabilidad</p>
                  <MiniGauge prob={65} />
                </div>

                {/* Biomarkers */}
                <div className="rounded-lg border bg-white p-2">
                  <p className="mb-1 text-[8px] font-semibold text-slate-600">⑥ Biomarcadores</p>
                  <table className="w-full">
                    <tbody>
                      {[
                        { n: "CNFL", v: "18.2", ok: false },
                        { n: "CNFD", v: "22.5", ok: false },
                        { n: "CNBD", v: "6.1",  ok: true },
                      ].map((b) => (
                        <tr key={b.n} className="border-b last:border-0">
                          <td className="py-0.5 text-[7px] font-bold">{b.n}</td>
                          <td className={`py-0.5 text-right text-[7px] font-bold ${b.ok ? "text-emerald-600" : "text-red-500"}`}>
                            {b.v}
                          </td>
                          <td className="py-0.5 pl-1 text-[6px] text-slate-400">
                            <span className={`rounded-full px-1 ${b.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                              {b.ok ? "ok" : "↓"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppFrame>
      <ul className="space-y-1.5 pl-1">
        <Callout n={1} label="Pipeline en verde: la imagen completó los 3 estados de procesamiento." />
        <Callout n={4} label='"Ejecutar análisis IA" lanza ResNet-18. Puede tardar hasta 30 s en CPU.' />
        <Callout n={5} label="El gauge muestra la probabilidad de ojo seco. Rojo = ≥50%, Verde = <50%." />
        <Callout n={6} label="Biomarcadores: rojo = fuera del rango normal de referencia." variant="amber" />
      </ul>
    </div>
  );
}
