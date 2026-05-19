import { apiClient } from "@/lib/api/client";
import type { HealthRead, ModelInfoRead } from "@/types/api";

export async function getHealth(): Promise<HealthRead> {
  const { data } = await apiClient.get<HealthRead>("/health");
  return data;
}

export async function getModelInfo(): Promise<ModelInfoRead> {
  const { data } = await apiClient.get<ModelInfoRead>("/model/info");
  return data;
}
