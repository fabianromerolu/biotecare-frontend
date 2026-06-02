import { z } from "zod";

export const PatientCreateSchema = z.object({
  external_code: z.string().trim().min(1, "El código externo es obligatorio.").max(64),
  birth_year: z.coerce
    .number()
    .int()
    .min(1900)
    .max(2030)
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null)),
  sex: z.enum(["F", "M", "O"]).nullable().optional(),
});

export const PatientUpdateSchema = PatientCreateSchema.pick({
  birth_year: true,
  sex: true,
});

export type PatientCreateFormInput = z.infer<typeof PatientCreateSchema>;
export type PatientUpdateFormInput = z.infer<typeof PatientUpdateSchema>;
