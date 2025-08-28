import { z } from "zod";

export const signUpFormSchema = z
  .object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    last_name: z
      .string()
      .min(2, "O sobrenome deve ter pelo menos 2 caracteres"),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirm_password: z.string().min(6),
    is_uenf: z.boolean(),
    uenf_semester: z.string().or(z.number()),
    terms: z
      .boolean()
      .refine((val) => val === true, "A checkbox precisa ser preenchida!"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As senhas não conferem",
    path: ["confirm_password"],
  });

export type SignUpFormDataI = z.infer<typeof signUpFormSchema>;
export type SignUpFormDataToSendI = Omit<
  SignUpFormDataI,
  "terms" | "confirm_password"
>;

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type LoginFormDataI = z.infer<typeof loginFormSchema>;
