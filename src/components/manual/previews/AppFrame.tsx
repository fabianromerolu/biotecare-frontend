import { cn } from "@/lib/utils";

interface AppFrameProps {
  url: string;
  children: React.ReactNode;
  className?: string;
  scale?: "sm" | "md";
}

/**
 * Wraps UI mockups in a browser chrome frame so they look like real screenshots.
 */
export function AppFrame({ url, children, className, scale = "md" }: AppFrameProps) {
  return (
    <figure
      className={cn(
        "not-prose overflow-hidden rounded-xl border border-slate-200 shadow-lg",
        className,
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-amber-400" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-green-400" aria-hidden="true" />
        </div>
        <div className="mx-2 flex flex-1 items-center rounded bg-white px-2.5 py-0.5 text-[10px] text-slate-400 shadow-xs">
          localhost:3000{url}
        </div>
      </div>
      {/* App content */}
      <div
        className={cn(
          "bg-[oklch(0.975_0.008_225)]",
          scale === "sm" ? "text-[10px]" : "text-xs",
        )}
      >
        {children}
      </div>
    </figure>
  );
}

/** Sidebar replica used inside AppFrame mockups */
export function SidebarMock({ active }: { active: string }) {
  const items = [
    { href: "/patients", label: "Pacientes" },
    { href: "/subfenotipos-ivcm", label: "Subfenotipos IVCM" },
    { href: "/model", label: "Modelo" },
    { href: "/legal", label: "Legal" },
    { href: "/manual-usuario", label: "Manual" },
  ];
  return (
    <aside className="flex w-40 shrink-0 flex-col bg-[oklch(0.27_0.075_243)] text-white">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
        <div className="flex size-6 items-center justify-center rounded bg-[oklch(0.78_0.12_205)] text-white">
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="3" />
            <path d="M12 11v9" />
            <path d="M9 14l3-3 3 3" />
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-semibold">Biotecare</p>
          <p className="text-[9px] text-white/50">IVCM + IA clínica</p>
        </div>
      </div>
      <nav className="flex flex-col gap-0.5 px-2 py-2">
        {items.map((item) => (
          <div
            key={item.href}
            className={cn(
              "rounded px-2 py-1.5 text-[11px] font-medium",
              active === item.href
                ? "bg-[oklch(0.37_0.075_240)] text-white"
                : "text-white/70",
            )}
          >
            {item.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}

/** TopBar replica used inside AppFrame mockups */
export function TopBarMock({ title }: { title: string }) {
  return (
    <div className="flex h-10 items-center justify-between border-b bg-white px-4 shadow-xs">
      <span className="text-[12px] font-semibold text-[oklch(0.22_0.035_245)]">{title}</span>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[oklch(0.945_0.018_228)] px-2 py-0.5 text-[9px] font-medium text-[oklch(0.46_0.16_242)]">
          doctor@hospital.es
        </span>
        <div className="size-5 rounded-full bg-[oklch(0.855_0.018_228)]" aria-hidden="true" />
      </div>
    </div>
  );
}

/** Callout annotation badge */
export function Callout({
  n,
  label,
  variant = "blue",
}: {
  n: number;
  label: string;
  variant?: "blue" | "green" | "amber";
}) {
  const colors = {
    blue: "bg-blue-600 text-white",
    green: "bg-emerald-600 text-white",
    amber: "bg-amber-500 text-white",
  };
  return (
    <li className="flex items-start gap-2">
      <span
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
          colors[variant],
        )}
      >
        {n}
      </span>
      <span className="text-[11px] leading-snug text-slate-700">{label}</span>
    </li>
  );
}
