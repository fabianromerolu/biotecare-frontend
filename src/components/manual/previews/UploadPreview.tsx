import { AppFrame, SidebarMock, TopBarMock, Callout } from "./AppFrame";

export function UploadPreview() {
  return (
    <div className="space-y-3">
      <AppFrame url="/patients/HRT-2026-0042/upload">
        <div className="flex h-[300px]">
          <SidebarMock active="/patients" />
          <div className="flex flex-1 flex-col">
            <TopBarMock title="Cargar imagen IVCM" />
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-3">
                {/* Drop zone - with file */}
                <div className="rounded-xl border-2 border-[oklch(0.46_0.16_242)] bg-[oklch(0.945_0.018_228)] p-3">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail mock */}
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-slate-700">
                      <div className="grid grid-cols-4 gap-px opacity-60">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div
                            key={i}
                            className="size-2.5 rounded-sm"
                            style={{
                              backgroundColor: `hsl(${180 + i * 10}, 60%, ${30 + i * 3}%)`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-semibold text-slate-700">
                        cornea_od_2026-06-04.tif
                      </p>
                      <p className="text-[9px] text-slate-500">
                        TIFF · 512 × 512 px · 4.2 MB
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full w-full rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-600">100%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata fields */}
                <div className="rounded-xl border bg-white p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="text-[10px] font-semibold text-slate-700">Ojo</div>
                    <div className="flex gap-1.5">
                      <div className="rounded-full bg-[oklch(0.46_0.16_242)] px-2.5 py-0.5 text-[9px] font-bold text-white">
                        OD
                      </div>
                      <div className="rounded-full border px-2.5 py-0.5 text-[9px] font-medium text-slate-500">
                        OS
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-slate-700">
                      Profundidad Z (μm){" "}
                      <span className="font-normal text-slate-400">(opcional)</span>
                    </label>
                    <div className="rounded-lg border px-2.5 py-1.5 text-[10px] text-slate-600">
                      42.5
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="button"
                  className="w-full rounded-lg bg-[oklch(0.46_0.16_242)] py-1.5 text-[10px] font-semibold text-white"
                >
                  Subir imagen IVCM
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppFrame>
      <ul className="space-y-1.5 pl-1">
        <Callout n={1} label='Arrastra el archivo al área o haz clic en ella. Formatos: PNG, JPEG, TIFF, BMP (máx. 25 MB).' />
        <Callout n={2} label='OD = Ojo derecho · OS = Ojo izquierdo. Selección opcional.' />
        <Callout n={3} label='Profundidad Z de captura en microscopía confocal. Campo opcional.' />
        <Callout n={4} label='La barra verde indica que la imagen se subió correctamente.' variant="green" />
      </ul>
    </div>
  );
}
