import { z } from "zod";

export const signUpFormSchema = z.object({
  name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).max(20)
  // terms: z.boolean().refine((val) => val === true, "A checkbox precisa ser preenchida!"),
});

export type SignUpFormDataI = z.infer<typeof signUpFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

export type LoginFormDataI = z.infer<typeof loginFormSchema>;