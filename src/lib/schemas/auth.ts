import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Introduce un email valido."),
  password: z.string().min(8, "La contrasena debe tener al menos 8 caracteres.").max(128),
});

export type LoginInput = z.infer<typeof LoginSchema>;
