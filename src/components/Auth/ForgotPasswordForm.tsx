import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomGenericForm, {
  type FieldConfig,
} from "../ui/Generic/CustomGenericForm";
import { handleForgotPassword } from "@/actions/auth-actions";
import { runWithToast } from "@/lib/client/run-with-toast";

const ForgotPasswordForm = () => {
  const fields: FieldConfig<z.infer<typeof changePasswordSchema>>[] = [
    { name: "email", label: "Email" },
  ];

  const changePasswordSchema = z.object({
    email: z.string().email({ message: "Precisa ser um email válido" }),
  });

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleOnSubmit = async ({ email }: { email: string }) => {
    await runWithToast(handleForgotPassword(email), {
      loading: "Enviando email para recuperação de acesso...",
      success: () =>
        "Te enviamos um email para que possa recuperar seu acesso!",
      error: () => "Erro ao iniciar o processo de recuperação de acesso",
    });
  };

  return (
    <div className="w-full">
      <CustomGenericForm
        schema={changePasswordSchema}
        onSubmit={handleOnSubmit}
        fields={fields}
        defaultValues={form.getValues()}
        form={form}
      />
    </div>
  );
};

export default ForgotPasswordForm;
