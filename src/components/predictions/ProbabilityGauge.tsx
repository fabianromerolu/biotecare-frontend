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

  // Orientación: velocímetro horizontal (flat abajo, arco arriba)
  // 270° = LEFT (0%), 360°/0° = TOP (50%), 90° = RIGHT (100%)
  const needle = polarToCartesian(100, 100, 74, 270 + value * 180);
  const thresholdPoint = polarToCartesian(100, 100, 82, 270 + thresholdValue * 180);
  const isDryEye = value >= thresholdValue;

  return (
    <section className="flex h-full flex-col rounded-lg border bg-card p-4" aria-labelledby="probability-title">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="probability-title" className="text-sm font-semibold">
          Resultado del modelo de IA
        </h2>
        <span
          className={
            isDryEye
              ? "inline-flex items-center gap-1 text-sm font-medium text-red-700"
              : "inline-flex items-center gap-1 text-sm font-medium text-emerald-700"
          }
        >
          {isDryEye ? <AlertTriangle className="size-4" /> : <CheckCircle2 className="size-4" />}
          {isDryEye ? "Ojo seco detectado" : "Normal"}
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <svg
          viewBox="0 0 200 125"
          role="img"
          aria-label={`Probabilidad de ojo seco: ${formatProbability(value)}. Resultado: ${
            isDryEye ? "Ojo seco detectado" : "Normal"
          }.`}
          className="w-full max-w-[280px]"
        >
          {/* Arco verde: zona normal (izquierda → umbral) */}
          <path
            d={describeArc(100, 100, 82, 270, 270 + thresholdValue * 180)}
            fill="none"
            stroke="#16A34A"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Arco rojo: zona ojo seco (umbral → derecha) */}
          <path
            d={describeArc(100, 100, 82, 270 + thresholdValue * 180, 450)}
            fill="none"
            stroke="#DC2626"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Línea de umbral */}
          <line
            x1="100"
            y1="100"
            x2={thresholdPoint.x}
            y2={thresholdPoint.y}
            stroke="#1E3A5F"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          {/* Aguja */}
          <line
            x1="100"
            y1="100"
            x2={needle.x}
            y2={needle.y}
            stroke="#111827"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Pivote central */}
          <circle cx="100" cy="100" r="6" fill="#111827" />
          {/* Valor de probabilidad */}
          <text x="100" y="88" textAnchor="middle" className="fill-foreground text-2xl font-semibold">
            {formatProbability(value)}
          </text>
          {/* Umbral */}
          <text x="100" y="118" textAnchor="middle" className="fill-muted-foreground text-[11px]">
            umbral {thresholdValue.toFixed(2)}
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

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";
  return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
}
