import { z } from "zod";

export const activityCreationSchema = z.object({
  name: z.string().min(2, "Nome precisa de pelo menos 2 caracteres"),
  speaker: z.string().min(2, "Speaker precisa de pelo menos 2 caracteres"),
  location: z.string().min(2, "Localização precisa de pelo menos 2 caracteres"),
  standalone_slug: z.string(),
  type: z.string().min(2, "Tipo precisa de pelo menos 2 caracteres"),
  description: z.string().min(10, "Descrição precisa de pelo menos 10 caracteres"),
  start_time: z.date().or(z.string()),
  end_time: z.date().or(z.string()),
  has_fee: z.boolean(),
  is_hidden: z.boolean(),
  is_blocked: z.boolean(),
  has_unlimited_capacity: z.boolean(),
  is_mandatory: z.boolean(),
  is_standalone: z.boolean(),
  max_capacity: z.number({
    invalid_type_error: "Você precisa inserir um número",
    required_error: "Campo obrigatório",
  }).int().min(0, "Quantidade inválida"),
}).refine((data) => new Date(data.start_time) < new Date(data.end_time), {
  message: "A data de início precisa ser anterior a data de fim.",
  path: ["end_time"],
}).refine((data) => (!data.is_standalone || data.standalone_slug.trim().length >= 2), {
  message: "Slug precisa de pelo menos 2 caracteres",
  path: ["standalone_slug"],
});

export type ActivityCreationDataI = z.infer<typeof activityCreationSchema>;