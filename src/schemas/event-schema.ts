import { z } from "zod";

export const eventCreationSchema = z.object({
  name: z.string(),
  start_date: z.date().or(z.string()),
  end_date: z.date().or(z.string()),
  slug: z.string(),
  description: z.string(),
  location: z.string(),
  is_blocked: z.boolean(),
  is_hidden: z.boolean(),
  max_tokens_per_user: z.number({
    invalid_type_error: "Você precisa inserir um número",
    required_error: "Campo obrigatório",
  }).int().min(0, "Quantidade inválida"),
}).refine((data) => data.start_date < data.end_date, {
  message: "A data de início precisa ser anterior a data de fim.",
  path: ["end_date"],
});

export type EventCreationDataI = z.infer<typeof eventCreationSchema>;