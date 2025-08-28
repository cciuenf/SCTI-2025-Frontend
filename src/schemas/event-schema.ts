import { z } from "zod";

export const eventCreationSchema = z.object({
  name: z.string().min(4, "Nome do evento deve ter ao menos 4 caracteres"),
  start_date: z.date().or(z.string()),
  end_date: z.date().or(z.string()),
  slug: z.string().min(2, "Slug do evento deve ter ao menos dois caracteres"),
  description: z.string().min(10, "Descrição do evento deve ter ao menos 10 caracteres"),
  location: z.string().min(6, "Localização do evento deve ter ao menos 6 caracteres"),
  is_blocked: z.boolean(),
  is_hidden: z.boolean(),
  max_tokens_per_user: z.number({
    invalid_type_error: "Você precisa inserir um número",
    required_error: "Campo obrigatório",
  }).int().min(0, "Quantidade inválida"),
}).refine((data) => new Date(data.start_date) < new Date(data.end_date), {
  message: "A data de início precisa ser anterior a data de fim.",
  path: ["end_date"],
});

export type EventCreationDataI = z.infer<typeof eventCreationSchema>;

export const eventRoleSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" })
});

export type EventRoleDataI = z.infer<typeof eventRoleSchema>;