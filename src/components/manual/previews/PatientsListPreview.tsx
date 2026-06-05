import { AppFrame, SidebarMock, TopBarMock, Callout } from "./AppFrame";

const SAMPLE_PATIENTS = [
  { code: "HRT-2026-0042", year: "1978", sex: "F", date: "01/06/2026", images: 2, status: "Con predicción", statusColor: "green" },
  { code: "OCU-2026-0109", year: "1965", sex: "M", date: "28/05/2026", images: 1, status: "Pendiente", statusColor: "amber" },
  { code: "DRY-2026-0007", year: "1990", sex: "F", date: "20/05/2026", images: 0, status: "Sin analizar", statusColor: "gray" },
];

const STATUS_COLORS: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border border-amber-200",
  gray: "bg-slate-50 text-slate-500 border border-slate-200",
};

export function PatientsListPreview() {
  return (
    <div className="space-y-3">
      <AppFrame url="/patients">
        <div className="flex h-[300px]">
          <SidebarMock active="/patients" />
          <div className="flex flex-1 flex-col overflow-hidden">
            <TopBarMock title="Pacientes" />
            <div className="flex-1 overflow-auto p-4">
              {/* Toolbar */}
              <div className="mb-3 flex items-center gap-2">
                <div className="flex-1 rounded-lg border bg-white px-2.5 py-1.5 text-[10px] text-slate-400">
                  Buscar código externo…
                </div>
                <div className="rounded-lg border bg-white px-2.5 py-1.5 text-[10px] text-slate-500">
                  Sexo ▾
                </div>
                <div className="rounded-lg border bg-white px-2.5 py-1.5 text-[10px] text-slate-500">
                  Estado ▾
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-[oklch(0.46_0.16_242)] px-3 py-1.5 text-[10px] font-semibold text-white"
                >
                  + Nuevo paciente
                </button>
              </div>
              {/* Table */}
              <div className="overflow-hidden rounded-lg border bg-white shadow-xs">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-50 text-left text-[9px] font-semibold uppercase text-slate-500">
                      <th className="px-3 py-2">Código externo</th>
                      <th className="px-3 py-2">Año nac.</th>
                      <th className="px-3 py-2">Sexo</th>
                      <th className="px-3 py-2">Fecha</th>
                      <th className="px-3 py-2">Imágenes</th>
                      <th className="px-3 py-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_PATIENTS.map((p, i) => (
                      <tr key={p.code} className={i < SAMPLE_PATIENTS.length - 1 ? "border-b" : ""}>
                        <td className="px-3 py-2 text-[10px] font-semibold text-[oklch(0.46_0.16_242)]">
                          {p.code}
                        </td>
                        <td className="px-3 py-2 text-[10px] text-slate-600">{p.year}</td>
                        <td className="px-3 py-2 text-[10px] text-slate-600">{p.sex}</td>
                        <td className="px-3 py-2 text-[10px] text-slate-500">{p.date}</td>
                        <td className="px-3 py-2 text-center text-[10px] text-slate-600">
                          {p.images}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${STATUS_COLORS[p.statusColor]}`}
                          >
                            {p.status}
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
      </AppFrame>
      <ul className="space-y-1.5 pl-1">
        <Callout n={1} label='Barra de búsqueda: filtra por código externo en tiempo real.' />
        <Callout n={2} label='Desplegables Sexo y Estado para filtros adicionales.' />
        <Callout n={3} label='"Nuevo paciente" abre el formulario de creación.' />
        <Callout n={4} label='El código externo azul es un enlace al expediente del paciente.' />
      </ul>
    </div>
  );
}
