import { z } from "zod";

export const productCreationSchema = z.object({
  name: z.string().min(2, "Nome precisa de pelo menos 2 caracteres"),
  description: z.string().min(10, "Descrição precisa de pelo menos 10 caracteres"),
  price_int: z.number({
    invalid_type_error: "Você precisa inserir um número",
    required_error: "Campo obrigatório",
  }).int().min(0, "O preço precisa ser positivo").max(999999999999999, "Preço muito alto"),
  has_unlimited_quantity: z.boolean(),
  quantity: z.number({
    invalid_type_error: "Você precisa inserir um número",
    required_error: "Campo obrigatório",
  }).int().min(0, "Quantidade inválida"),
  max_ownable_quantity: z.number({
    invalid_type_error: "Você precisa inserir um número",
    required_error: "Campo obrigatório",
  }).int().min(0, "Quantidade inválida"),
  is_physical_item: z.boolean(),
  is_public: z.boolean(),
  is_blocked: z.boolean(),
  is_hidden: z.boolean(),
  is_ticket_type: z.boolean(),
  access_targets: z.array(z.string())
});

export type ProductCreationDataI = z.infer<typeof productCreationSchema>;

export const productBuySchema = z.discriminatedUnion("is_gift", [
  z.object({
    is_gift: z.literal(true),
    gifted_to_email: z.string().email({ message: "E-mail inválido" }),
    quantity: z.number({
      invalid_type_error: "Você precisa inserir um número",
      required_error: "Campo obrigatório",
    }).int().min(1, "Quantidade inválida"),
  }),
  z.object({
    is_gift: z.literal(false),
    gifted_to_email: z.string(),
    quantity: z.number({
      invalid_type_error: "Você precisa inserir um número",
      required_error: "Campo obrigatório",
    }).int().min(1, "Quantidade inválida"),
  })
]);

export type ProductBuyDataI = z.infer<typeof productBuySchema>;