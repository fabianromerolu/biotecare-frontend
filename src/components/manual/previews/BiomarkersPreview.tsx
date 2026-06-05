import { Callout } from "./AppFrame";

const BIOMARKERS = [
  {
    name: "CNFL",
    full: "Longitud de fibras nerviosas corneales",
    unit: "mm/mm²",
    normal: "> 20",
    value: 18.2,
    ok: false,
    meaning: "Valores bajos indican pérdida de inervación y déficit lagrimal.",
  },
  {
    name: "CNFD",
    full: "Densidad de fibras nerviosas corneales",
    unit: "fibras/mm²",
    normal: "> 25",
    value: 22.5,
    ok: false,
    meaning: "La denervación corneal altera la sensibilidad ocular.",
  },
  {
    name: "CNBD",
    full: "Densidad de ramificaciones nerviosas",
    unit: "ramas/mm²",
    normal: "> 5.5",
    value: 6.1,
    ok: true,
    meaning: "Indicador temprano de neuropatía corneal.",
  },
  {
    name: "Cél. dendríticas",
    full: "Densidad de células dendríticas",
    unit: "células/mm²",
    normal: "< 30",
    value: 42,
    ok: false,
    meaning: "Valores elevados indican inflamación activa en la córnea.",
  },
  {
    name: "Microneuromas",
    full: "Microneuromas corneales",
    unit: "conteo",
    normal: "0",
    value: 2,
    ok: false,
    meaning: "Su presencia indica daño axonal o regeneración aberrante.",
  },
];

export function BiomarkersPreview() {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b bg-muted/30 px-4 py-2.5">
          <p className="text-[11px] font-semibold">Biomarcadores morfológicos calculados por el sistema</p>
          <p className="text-[10px] text-muted-foreground">Haz clic en cualquier fila para ver la interpretación clínica completa</p>
        </div>
        <div className="divide-y">
          {BIOMARKERS.map((b) => (
            <div
              key={b.name}
              className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-2.5 text-xs hover:bg-muted/20 cursor-pointer"
            >
              <div className="min-w-[4.5rem]">
                <p className="font-bold text-foreground">{b.name}</p>
                <p className="text-[9px] text-muted-foreground leading-tight">{b.full}</p>
              </div>
              <div className="hidden sm:block">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${b.ok ? "bg-emerald-500" : "bg-red-400"}`}
                    style={{ width: `${Math.min(100, (b.value / (b.ok ? b.value * 1.5 : b.value * 2)) * 100)}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${b.ok ? "text-emerald-600" : "text-red-500"}`}>
                  {b.value}
                </p>
                <p className="text-[9px] text-muted-foreground">{b.unit}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-semibold ${b.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                  {b.ok ? "Normal" : "Alterado"}
                </span>
                <p className="text-[8px] text-muted-foreground">Ref: {b.normal}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Interpretation panel example */}
        <div className="border-t bg-blue-50 p-3">
          <p className="text-[10px] font-semibold text-blue-800">
            Panel de interpretación (al hacer clic en CNFL):
          </p>
          <p className="mt-0.5 text-[9px] text-blue-700 leading-relaxed">
            {BIOMARKERS[0].meaning} · Valor normal: {BIOMARKERS[0].normal} {BIOMARKERS[0].unit} · Valor actual: {BIOMARKERS[0].value} {BIOMARKERS[0].unit}
          </p>
        </div>
      </div>
      <ul className="space-y-1.5 pl-1">
        <Callout n={1} label='Verde = dentro del rango normal · Rojo = fuera del rango de referencia.' />
        <Callout n={2} label='Haz clic en cualquier fila para abrir la explicación clínica completa del biomarcador.' />
        <Callout n={3} label='Los biomarcadores complementan la probabilidad — úsalos junto con la historia clínica.' variant="amber" />
      </ul>
    </div>
  );
}
