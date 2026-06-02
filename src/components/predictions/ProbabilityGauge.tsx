import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatProbability } from "@/lib/utils/formatters";

export function ProbabilityGauge({
  probability,
  threshold,
}: {
  probability: number;
  threshold: number;
}) {
  const value = clamp(probability, 0, 1);
  const thresholdValue = clamp(threshold, 0, 1);
  const pct = Math.round(value * 100);
  const isDryEye = value >= thresholdValue;

  const needle = polarToCartesian(100, 100, 74, 270 + value * 180);
  const thresholdPoint = polarToCartesian(100, 100, 82, 270 + thresholdValue * 180);

  return (
    <section
      className="flex h-full flex-col overflow-hidden rounded-xl border shadow-sm"
      aria-labelledby="probability-title"
    >
      {/* Cabecera coloreada según resultado */}
      <div
        className={`flex items-center justify-between gap-3 border-b p-4 ${
          isDryEye
            ? "border-red-500/20 bg-red-500/10"
            : "border-emerald-500/20 bg-emerald-500/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl shadow-md ${
              isDryEye
                ? "bg-linear-to-br from-red-400 to-rose-600 shadow-red-500/20"
                : "bg-linear-to-br from-emerald-400 to-teal-600 shadow-emerald-500/20"
            }`}
          >
            {isDryEye ? (
              <AlertTriangle className="size-4 text-white" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="size-4 text-white" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Resultado del modelo de IA
            </p>
            <h2
              id="probability-title"
              className={`text-sm font-bold ${isDryEye ? "text-red-700" : "text-emerald-700"}`}
            >
              {isDryEye ? "Ojo seco detectado" : "Normal"}
            </h2>
          </div>
        </div>
        <span
          className={`font-mono text-3xl font-black tabular-nums ${
            isDryEye ? "text-red-700" : "text-emerald-700"
          }`}
          aria-label={`Probabilidad: ${pct}%`}
        >
          {pct}%
        </span>
      </div>

      {/* Velocímetro SVG */}
      <div className="flex flex-1 items-center justify-center bg-card p-4">
        <svg
          viewBox="0 0 200 125"
          role="img"
          aria-label={`Velocímetro: probabilidad de ojo seco ${formatProbability(value)}. Resultado: ${
            isDryEye ? "Ojo seco detectado" : "Normal"
          }.`}
          className="w-full max-w-[280px]"
        >
          {/* Track de fondo */}
          <path
            d={describeArc(100, 100, 82, 270, 450)}
            fill="none"
            stroke="#1E3A5F"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Arco zona normal */}
          <path
            d={describeArc(100, 100, 82, 270, 270 + thresholdValue * 180)}
            fill="none"
            stroke="#10B981"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Arco zona ojo seco */}
          <path
            d={describeArc(100, 100, 82, 270 + thresholdValue * 180, 450)}
            fill="none"
            stroke="#F43F5E"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Línea de umbral */}
          <line
            x1="100"
            y1="100"
            x2={thresholdPoint.x}
            y2={thresholdPoint.y}
            stroke="#00B4D8"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          {/* Aguja */}
          <line
            x1="100"
            y1="100"
            x2={needle.x}
            y2={needle.y}
            stroke="#1E3A5F"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Pivote */}
          <circle cx="100" cy="100" r="6" fill="#1E3A5F" />
          <circle cx="100" cy="100" r="3" fill="#F8FAFC" />
          {/* Label umbral */}
          <text x="100" y="118" textAnchor="middle" fontSize="9" fill="#60748A">
            umbral {Math.round(thresholdValue * 100)}%
          </text>
        </svg>
      </div>
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";
  return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
}
