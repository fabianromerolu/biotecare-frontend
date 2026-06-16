"use client";

import {
  Activity,
  BookMarked,
  BookOpen,
  FlaskConical,
  Menu,
  Microscope,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/patients", label: "Pacientes", icon: UsersRound },
  { href: "/model", label: "Modelo", icon: Activity },
  { href: "/subfenotipos-ivcm", label: "Subfenotipos IVCM", icon: FlaskConical },
  { href: "/legal", label: "Legal", icon: BookOpen },
  { href: "/manual-usuario", label: "Manual", icon: BookMarked },
] as const;

const TOUR_IDS: Record<string, string> = {
  "/patients": "sidebar__nav-patients",
  "/model": "sidebar__nav-model",
  "/subfenotipos-ivcm": "sidebar__nav-subfenotipos-ivcm",
  "/legal": "sidebar__nav-legal",
  "/manual-usuario": "sidebar__nav-manual",
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Saltar al contenido principal
      </a>
      <div className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:block">
        <SidebarContent pathname={pathname} />
      </div>
      <div className="fixed left-4 top-3 z-50 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Abrir navegación">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-sidebar p-0 text-sidebar-foreground">
            <SheetHeader className="sr-only">
              <SheetTitle>Navegacion Biotecare</SheetTitle>
            </SheetHeader>
            <SidebarContent pathname={pathname} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <Microscope className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold">{APP_NAME}</p>
          <p className="text-xs text-sidebar-foreground/70">IVCM + IA clínica</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Principal">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              data-tour-id={TOUR_IDS[item.href]}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border px-5 py-3 text-xs text-sidebar-foreground/50">
        Biotecare · IVCM + IA clínica
      </div>
    </div>
  );
}
