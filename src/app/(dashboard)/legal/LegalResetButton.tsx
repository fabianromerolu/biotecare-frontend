"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLegalReset } from "@/components/legal/LegalAcknowledgmentModal";

export default function LegalResetButton() {
  const resetLegal = useLegalReset();
  const router = useRouter();

  const handleReset = () => {
    resetLegal();
    router.push("/patients");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleReset}>
      <RefreshCw className="size-3.5" />
      Restablecer aviso legal
    </Button>
  );
}
