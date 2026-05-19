import { z } from "zod";

export const PatientAggregateSchema = z.object({
  aggregation_method: z.enum(["mean", "max", "attention"]),
  threshold: z.coerce.number().min(0).max(1),
});

export type PatientAggregateFormInput = z.infer<typeof PatientAggregateSchema>;
