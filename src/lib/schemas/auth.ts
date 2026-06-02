import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Introduce un email valido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.").max(128),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Introduce tu nombre completo.")
      .max(255, "El nombre es demasiado largo."),
    email: z.string().email("Introduce un email valido."),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .max(128),
    confirm_password: z.string().min(8, "Confirma la contraseña."),
  })
  .refine((values) => values.password === values.confirm_password, {
    message: "Las contraseñas no coinciden.",
    path: ["confirm_password"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;
