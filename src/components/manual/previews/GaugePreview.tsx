import { Callout } from "./AppFrame";

interface GaugeProps {
  probability: number;
  label: string;
  colorClass: "red" | "green";
}

/**
 * Correct arc-based gauge.
 * Center (80, 78), radius 56.
 * Start 120° (SVG CW, ~7 o'clock) → End 420°/60° (~5 o'clock).
 * Total span 300°. 0% = 120°, 50% = 270° (top), 100% = 420°.
 */
function Gauge({ probability, label, colorClass }: GaugeProps) {
  const cx = 80, cy = 78, r = 56;

  const toPoint = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const arcPath = (startDeg: number, endDeg: number, sweep = 1) => {
    const s = toPoint(startDeg);
    const e = toPoint(endDeg);
    const span = Math.abs(endDeg - startDeg);
    const large = span > 180 ? 1 : 0;
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} ${sweep} ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
  };

  // Gauge arcs: 120° → 270° (green, 150° span) · 270° → 420° (red, 150° span)
  const greenEnd = toPoint(270);
  const redEnd   = toPoint(60); // 420° = 60°

  // Background track (full 300° span)
  const trackStart = toPoint(120);

  // Needle: 0% → 120°, 100% → 420° (60°), linear
  const needleDeg = 120 + (probability / 100) * 300;
  const nrad = (needleDeg * Math.PI) / 180;
  const nx = cx + (r - 10) * Math.cos(nrad);
  const ny = cy + (r - 10) * Math.sin(nrad);

  // Threshold marker at 270° (50%)
  const tInner = toPoint(270);
  const tOuter = { x: cx + (r + 7) * Math.cos(Math.PI * 270 / 180), y: cy + (r + 7) * Math.sin(Math.PI * 270 / 180) };

  const isRed = probability >= 50;

  return (
    <svg viewBox="0 0 160 110" className="w-full" role="img" aria-label={`Probabilidad: ${probability}%`}>
      {/* Track background */}
      <path
        d={`M ${trackStart.x.toFixed(2)} ${trackStart.y.toFixed(2)} A ${r} ${r} 0 1 1 ${redEnd.x.toFixed(2)} ${redEnd.y.toFixed(2)}`}
        fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round"
      />
      {/* Green arc: 120° → 270° */}
      <path
        d={`M ${trackStart.x.toFixed(2)} ${trackStart.y.toFixed(2)} A ${r} ${r} 0 0 1 ${greenEnd.x.toFixed(2)} ${greenEnd.y.toFixed(2)}`}
        fill="none" stroke="#10b981" strokeWidth="10" strokeLinecap="round"
      />
      {/* Red arc: 270° → 420°/60° */}
      <path
        d={`M ${greenEnd.x.toFixed(2)} ${greenEnd.y.toFixed(2)} A ${r} ${r} 0 0 1 ${redEnd.x.toFixed(2)} ${redEnd.y.toFixed(2)}`}
        fill="none" stroke="#ef4444" strokeWidth="10" strokeLinecap="round"
      />
      {/* Threshold tick at 50% */}
      <line
        x1={tInner.x.toFixed(2)} y1={(tInner.y - 0).toFixed(2)}
        x2={tOuter.x.toFixed(2)} y2={tOuter.y.toFixed(2)}
        stroke="#3b82f6" strokeWidth="2" strokeDasharray="3,2"
      />
      {/* Needle */}
      <line
        x1={cx} y1={cy}
        x2={nx.toFixed(2)} y2={ny.toFixed(2)}
        stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="5" fill="#1e293b" />
      <circle cx={cx} cy={cy} r="2.5" fill="white" />
      {/* Value */}
      <text x={cx} y={cy + 20} textAnchor="middle" fontSize="18" fontWeight="bold"
        fill={isRed ? "#ef4444" : "#10b981"}>
        {probability}%
      </text>
      <text x={cx} y={cy + 32} textAnchor="middle" fontSize="7.5" fill="#64748b">
        {label}
      </text>
      {/* Scale labels */}
      <text x={trackStart.x - 4} y={trackStart.y + 10} fontSize="7" fill="#94a3b8" textAnchor="middle">0%</text>
      <text x={redEnd.x + 4} y={redEnd.y + 10} fontSize="7" fill="#94a3b8" textAnchor="middle">100%</text>
      <text x={cx} y={cy - r - 10} textAnchor="middle" fontSize="7" fill="#3b82f6">50%</text>
    </svg>
  );
}

export function GaugePreview() {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b bg-muted/30 px-4 py-3">
          <p className="text-[11px] font-semibold">Gauge de probabilidad — dos ejemplos reales</p>
          <p className="text-[10px] text-muted-foreground">La aguja indica la probabilidad estimada por el modelo</p>
        </div>
        <div className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="flex flex-col items-center gap-2 bg-red-50/40 p-5">
            <p className="text-[11px] font-semibold text-red-700">Ojo seco detectado</p>
            <Gauge probability={65} label="Ojo seco detectado" colorClass="red" />
            <p className="text-center text-[9px] text-slate-500">
              Probabilidad ≥ 50% · Aguja en zona roja
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 bg-emerald-50/40 p-5">
            <p className="text-[11px] font-semibold text-emerald-700">Normal</p>
            <Gauge probability={28} label="Normal" colorClass="green" />
            <p className="text-center text-[9px] text-slate-500">
              Probabilidad &lt; 50% · Aguja en zona verde
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x border-t text-center text-[9px]">
          <div className="flex items-center justify-center gap-1.5 px-3 py-2.5">
            <span className="inline-block size-2.5 rounded-full bg-emerald-500" />
            <span>Zona verde · <strong>Normal</strong> (0–50%)</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 px-3 py-2.5">
            <span className="inline-block size-2.5 rounded-full bg-red-500" />
            <span>Zona roja · <strong>Ojo seco</strong> (≥50%)</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 px-3 py-2.5">
            <span className="inline-block h-1 w-5 border-t-2 border-dashed border-blue-500" />
            <span>Umbral decisional (50%)</span>
          </div>
        </div>
      </div>
      <ul className="space-y-1.5 pl-1">
        <Callout n={1} label="La aguja indica la probabilidad calculada por ResNet-18 a partir de la imagen IVCM." />
        <Callout n={2} label="La línea azul punteada es el umbral decisional al 50% (configurable)." />
        <Callout n={3} label="El porcentaje es orientativo — el médico siempre acepta o rechaza el resultado." variant="amber" />
      </ul>
    </div>
  );
}
