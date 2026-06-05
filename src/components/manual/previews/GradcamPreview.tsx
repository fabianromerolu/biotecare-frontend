import { Callout } from "./AppFrame";

/** SVG-based heatmap — deterministic, no Math.random() */
function HeatmapSVG({ mode }: { mode: "original" | "heatmap" | "overlay" }) {
  const uid = mode; // stable ID for SVG defs

  return (
    <svg
      viewBox="0 0 120 90"
      className="w-full"
      role="img"
      aria-label={`Modo: ${mode}`}
      style={{ display: "block" }}
    >
      <defs>
        {/* Corneal background texture via gradient */}
        <radialGradient id={`bg-${uid}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#2d4a5a" />
          <stop offset="50%" stopColor="#1a2d3a" />
          <stop offset="100%" stopColor="#0f1a22" />
        </radialGradient>
        {/* Heat radial gradient centred on the "active zone" */}
        <radialGradient id={`heat-${uid}`} cx="52%" cy="48%" r="45%">
          <stop offset="0%"  stopColor="#ef4444" stopOpacity={mode === "heatmap" ? "0.92" : "0.72"} />
          <stop offset="22%" stopColor="#f97316" stopOpacity={mode === "heatmap" ? "0.75" : "0.55"} />
          <stop offset="48%" stopColor="#eab308" stopOpacity={mode === "heatmap" ? "0.45" : "0.30"} />
          <stop offset="72%" stopColor="#22d3ee" stopOpacity={mode === "heatmap" ? "0.20" : "0.10"} />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        {/* Secondary hot spot */}
        <radialGradient id={`heat2-${uid}`} cx="35%" cy="62%" r="25%">
          <stop offset="0%"  stopColor="#f97316" stopOpacity={mode === "heatmap" ? "0.65" : "0.45"} />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="120" height="90" fill={`url(#bg-${uid})`} />

      {/* Corneal structure lines (visible in original & overlay) */}
      {mode !== "heatmap" && (
        <g opacity={mode === "overlay" ? "0.35" : "0.65"} stroke="#4a7a8a" strokeWidth="0.7" fill="none">
          <ellipse cx="60" cy="45" rx="30" ry="22" />
          <ellipse cx="60" cy="45" rx="18" ry="14" />
          <path d="M 34 30 Q 60 42 86 30" />
          <path d="M 30 50 Q 60 44 90 50" />
          <path d="M 38 64 Q 60 52 82 64" />
          {/* nerve fiber hints */}
          <line x1="46" y1="33" x2="42" y2="26" />
          <line x1="60" y1="31" x2="60" y2="23" />
          <line x1="74" y1="33" x2="78" y2="26" />
          <line x1="80" y1="45" x2="90" y2="43" />
          <line x1="78" y1="56" x2="85" y2="62" />
        </g>
      )}

      {/* Heatmap overlay */}
      {mode !== "original" && (
        <>
          <rect width="120" height="90" fill={`url(#heat-${uid})`} />
          <rect width="120" height="90" fill={`url(#heat2-${uid})`} />
        </>
      )}

      {/* Mode label pill */}
      <rect x="4" y="4" width="112" height="12" rx="3" fill="rgba(0,0,0,0.55)" />
      <text x="60" y="12.5" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="#e2e8f0">
        {mode === "original" ? "IMAGEN ORIGINAL" : mode === "heatmap" ? "GRAD-CAM · ACTIVACIÓN" : "SUPERPOSICIÓN · 60%"}
      </text>

      {/* Scale bar (only in heatmap/overlay) */}
      {mode !== "original" && (
        <>
          <defs>
            <linearGradient id={`scale-${uid}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%"  stopColor="#3b82f6" />
              <stop offset="33%" stopColor="#eab308" />
              <stop offset="66%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <rect x="8" y="78" width="44" height="5" rx="1.5" fill={`url(#scale-${uid})`} />
          <text x="8"  y="88" fontSize="4.5" fill="#94a3b8">Bajo</text>
          <text x="46" y="88" fontSize="4.5" fill="#94a3b8" textAnchor="end">Alto</text>
        </>
      )}
    </svg>
  );
}

export function GradcamPreview() {
  const MODES = [
    { mode: "original" as const, label: "① Imagen original", desc: "IVCM corneal cargada por el médico. Muestra la red de fibras nerviosas y estructuras celulares." },
    { mode: "heatmap" as const, label: "② Mapa Grad-CAM", desc: "Zonas de activación del modelo. Rojo = mayor peso en la decisión. Azul = zona de menor atención." },
    { mode: "overlay" as const, label: "③ Superposición", desc: "Combinación ajustable de imagen + mapa. Permite correlacionar activación con estructuras anatómicas." },
  ];

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b bg-muted/30 px-4 py-3">
          <p className="text-[11px] font-semibold">Visor de imagen y mapa Grad-CAM</p>
          <p className="text-[10px] text-muted-foreground">Tres modos de visualización disponibles en el detalle de la imagen</p>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-3">
          {MODES.map(({ mode, label, desc }, i) => (
            <div key={mode} className="space-y-2">
              <div className={`overflow-hidden rounded-lg border-2 bg-slate-900 ${i === 2 ? "border-primary" : "border-slate-200"}`}>
                <HeatmapSVG mode={mode} />
              </div>
              <p className="text-[10px] font-semibold text-foreground">{label}</p>
              <p className="text-[9px] leading-snug text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
        <div className="border-t bg-amber-50/60 px-4 py-2.5 text-[10px] text-amber-800">
          ⚠ Grad-CAM muestra dónde miró el modelo, no diagnostica. Úsalo para revisar la coherencia clínica del análisis.
        </div>
      </div>
      <ul className="space-y-1.5 pl-1">
        <Callout n={1} label="Imagen original: estructuras corneales (fibras nerviosas, células) sin ningún procesamiento." />
        <Callout n={2} label="Grad-CAM: rojo intenso = zona de máxima activación que influyó en el resultado del modelo." />
        <Callout n={3} label="Superposición: permite comparar la zona activa con las estructuras anatómicas de la imagen." />
      </ul>
    </div>
  );
}
