import { apiClient } from "@/lib/api/client";
import type { Token, UserRead } from "@/types/api";

export async function login(email: string, password: string): Promise<Token> {
  const payload = new URLSearchParams();
  payload.set("username", email);
  payload.set("password", password);

  const { data } = await apiClient.post<Token>("/auth/login", payload, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data;
}

export async function registerDoctor(input: {
  email: string;
  password: string;
  full_name: string;
}): Promise<UserRead> {
  const { data } = await apiClient.post<UserRead>("/auth/register", {
    ...input,
    role: "doctor",
  });
  return data;
}
