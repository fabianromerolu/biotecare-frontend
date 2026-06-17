import { AppFrame, SidebarMock, TopBarMock, Callout } from "./AppFrame";

function ClusterBadge({ cluster }: { cluster: number }) {
  const colors = ["#2563eb", "#16a34a", "#dc2626"];
  return (
    <span
      className="rounded-full border px-1.5 py-0.5 text-[7px] font-semibold"
      style={{ borderColor: colors[cluster], color: colors[cluster] }}
    >
      Cluster {cluster}
    </span>
  );
}

export function SubphenotypesPreview() {
  return (
    <div className="space-y-3">
      <AppFrame url="/subfenotipos-ivcm">
        <div className="flex h-[330px]">
          <SidebarMock active="/subfenotipos-ivcm" />
          <div className="flex flex-1 flex-col">
            <TopBarMock title="Subfenotipos IVCM" />
            <div className="grid flex-1 grid-cols-[190px_1fr] gap-2 overflow-hidden p-3">
              <div className="space-y-2">
                <div className="rounded-lg border bg-white p-2">
                  <p className="mb-1.5 text-[9px] font-bold text-slate-700">1. Nueva corrida</p>
                  <div className="grid grid-cols-3 gap-1">
                    {["Clusters 3", "PCA 2", "Semilla 42"].map((item) => (
                      <div key={item} className="rounded border bg-slate-50 px-1.5 py-1 text-[7px] text-slate-600">
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="mt-1.5 space-y-1">
                    <div className="rounded border px-1.5 py-1 text-[7px] text-slate-600">Comparar con GMM ✓</div>
                    <div className="rounded border px-1.5 py-1 text-[7px] text-slate-600">Consensus clustering ✓</div>
                  </div>
                  <div className="mt-1.5 rounded border bg-slate-50 p-1.5">
                    <p className="mb-1 text-[7px] font-semibold text-slate-500">Pacientes</p>
                    <p className="truncate text-[7px] text-slate-600">☑ HRT-2026-0042</p>
                    <p className="truncate text-[7px] text-slate-600">☑ OCU-2026-0109</p>
                  </div>
                  <button type="button" className="mt-2 w-full rounded bg-blue-600 py-1 text-[8px] font-bold text-white">
                    2. Ejecutar exploración
                  </button>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-2">
                  <p className="text-[8px] font-bold text-amber-800">Módulo exploratorio</p>
                  <p className="mt-0.5 text-[7px] leading-snug text-amber-700">
                    No constituye diagnóstico clínico.
                  </p>
                </div>
              </div>

              <div className="space-y-2 overflow-hidden">
                <div className="rounded-lg border bg-white p-2">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-[9px] font-bold text-slate-700">3. Corridas</p>
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[7px] font-semibold text-emerald-700">
                      Completada
                    </span>
                  </div>
                  <div className="grid grid-cols-[1fr_45px_40px_65px] gap-1 rounded bg-slate-50 px-1.5 py-1 text-[7px] font-semibold text-slate-500">
                    <span>Corrida</span>
                    <span>Img.</span>
                    <span>Clusters</span>
                    <span>Acciones</span>
                  </div>
                  <div className="grid grid-cols-[1fr_45px_40px_65px] gap-1 px-1.5 py-1 text-[7px] text-slate-700">
                    <span>8f3a21</span>
                    <span>12</span>
                    <span>3</span>
                    <span className="flex gap-1">
                      <span className="rounded bg-blue-600 px-1 text-center font-bold text-white">Ver</span>
                      <span className="rounded bg-red-600 px-1 text-center font-bold text-white">Eliminar</span>
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border-2 border-blue-500 bg-white p-2">
                  <p className="mb-1.5 text-[9px] font-bold text-slate-700">4. Pantalla aparte de detalle</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      ["Imágenes", "12"],
                      ["Clusters", "3"],
                      ["ARI GMM", "0.71"],
                      ["ARI consenso", "0.68"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded border bg-slate-50 p-1">
                        <p className="text-[6.5px] uppercase text-slate-400">{label}</p>
                        <p className="text-[10px] font-bold text-slate-800">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 grid grid-cols-[1fr_120px] gap-2">
                    <div className="rounded border bg-white p-1.5">
                      <p className="mb-1 text-[7px] font-semibold text-slate-600">5. PCA por cluster</p>
                      <svg viewBox="0 0 160 80" className="h-[72px] w-full rounded bg-slate-50">
                        <line x1="18" y1="64" x2="150" y2="64" stroke="#cbd5e1" />
                        <line x1="18" y1="8" x2="18" y2="64" stroke="#cbd5e1" />
                        {[
                          { x: 36, y: 48, color: "#2563eb" },
                          { x: 48, y: 40, color: "#2563eb" },
                          { x: 70, y: 26, color: "#16a34a" },
                          { x: 82, y: 30, color: "#16a34a" },
                          { x: 118, y: 46, color: "#dc2626" },
                          { x: 128, y: 36, color: "#dc2626" },
                        ].map((point, index) => (
                          <circle key={index} cx={point.x} cy={point.y} r="4" fill={point.color} opacity="0.85" />
                        ))}
                      </svg>
                    </div>
                    <div className="rounded border bg-white p-1.5">
                      <p className="mb-1 text-[7px] font-semibold text-slate-600">6. Distribución</p>
                      {[0, 1, 2].map((cluster) => (
                        <div key={cluster} className="mb-1">
                          <div className="mb-0.5 flex items-center justify-between">
                            <ClusterBadge cluster={cluster} />
                            <span className="text-[6px] text-slate-400">{[5, 4, 3][cluster]} img.</span>
                          </div>
                          <div className="h-1.5 rounded bg-slate-100">
                            <div
                              className="h-1.5 rounded"
                              style={{ width: `${[80, 65, 48][cluster]}%`, backgroundColor: ["#2563eb", "#16a34a", "#dc2626"][cluster] }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2 rounded border bg-slate-50 p-1.5">
                    <p className="mb-1 text-[7px] font-semibold text-slate-600">7. Asignaciones e imagen</p>
                    <div className="grid grid-cols-[1fr_1fr_50px_35px_35px] gap-1 text-[6.5px] text-slate-500">
                      <span>Paciente</span>
                      <span>Imagen</span>
                      <span>Cluster</span>
                      <span>PC1</span>
                      <span>Nitidez</span>
                    </div>
                    <div className="grid grid-cols-[1fr_1fr_50px_35px_35px] gap-1 text-[6.5px] text-slate-700">
                      <span>HRT-2026</span>
                      <span>cornea_od.tif</span>
                      <ClusterBadge cluster={1} />
                      <span>0.42</span>
                      <span>128.3</span>
                    </div>
                    <div className="mt-1 rounded border border-blue-200 bg-white px-1.5 py-1 text-[6.5px] text-slate-600">
                      Desplegable: imagen original + Grad-CAM si existe
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppFrame>

      <ul className="space-y-1.5 pl-1">
        <Callout n={1} label="Configura clusters, PCA, semilla y métodos de comparación antes de ejecutar." />
        <Callout n={2} label="La exploración requiere al menos seis imágenes IVCM legibles." />
        <Callout n={3} label='El botón "Ver" abre una pantalla aparte; "Eliminar" borra solo la corrida exploratoria.' />
        <Callout n={4} label="El detalle reúne métricas, PCA, distribución y asignaciones por imagen." />
        <Callout n={5} label="El PCA ayuda a observar agrupaciones visuales, no diagnósticos." />
        <Callout n={6} label="La distribución permite detectar clusters dominantes o minoritarios." />
        <Callout n={7} label="Cada asignación puede desplegar la imagen original y el Grad-CAM cuando exista." variant="green" />
      </ul>
    </div>
  );
}
