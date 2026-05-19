"use client";

import { useQuery } from "@tanstack/react-query";
import { getHealth, getModelInfo } from "@/lib/api/system";

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 60_000,
  });
}

export function useModelInfo() {
  return useQuery({
    queryKey: ["model", "info"],
    queryFn: getModelInfo,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
