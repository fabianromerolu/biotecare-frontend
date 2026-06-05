import type { Metadata } from "next";
import { UserManualClient } from "./UserManualClient";

export const metadata: Metadata = {
  title: "Manual de usuario | Biotecare",
  description:
    "Guía completa de uso del sistema Biotecare para profesionales sanitarios.",
};

export default function ManualUsuarioPage() {
  return <UserManualClient />;
}
