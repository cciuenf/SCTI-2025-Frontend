import { z } from "zod";

export const signUpFormSchema = z.object({
  name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).max(20),
  confirm_password: z.string().min(8).max(20),
  is_uenf: z.boolean(),
  uenf_semester: z.string().or(z.number()),
  terms: z.boolean().refine((val) => val === true, "A checkbox precisa ser preenchida!"),
}).refine((data) => data.password === data.confirm_password, {
  message: "As senhas não conferem",
  path: ["confirm_password"]
});

export type SignUpFormDataI = z.infer<typeof signUpFormSchema>;
export type SignUpFormDataToSendI = Omit<SignUpFormDataI, "terms" | "confirm_password">;

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

export type LoginFormDataI = z.infer<typeof loginFormSchema>;