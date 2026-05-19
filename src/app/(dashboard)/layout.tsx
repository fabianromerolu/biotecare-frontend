import { AuthGuard } from "@/components/layout/AuthGuard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TourProvider } from "@/components/onboarding/TourProvider";
import { TourOverlay } from "@/components/onboarding/TourOverlay";
import { TourTooltip } from "@/components/onboarding/TourTooltip";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <TourProvider>
        <DashboardShell>{children}</DashboardShell>
        <TourOverlay />
        <TourTooltip />
      </TourProvider>
    </AuthGuard>
  );
}
