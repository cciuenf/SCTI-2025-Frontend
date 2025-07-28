import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import CustomGenericForm, {
  FieldConfig,
} from "../ui/Generic/CustomGenericForm";
import { handleForgotPassword } from "@/actions/auth-actions";

type Props = {};

const ForgotPasswordForm = (props: Props) => {
  const fields: FieldConfig<z.infer<typeof changePasswordSchema>>[] = [
    { name: "email", label: "Email" },
  ];

  const changePasswordSchema = z.object({
    email: z.string().email(),
  });

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleOnSubmit = async ({ email }: { email: string }) => {
    try {
      const result = await handleForgotPassword(email);

      if (result?.status == 200) {
        toast.info(`Te enviamos um email para que possa recuperar seu acesso!`);
        return;
      }
    } catch (error) {
      toast.error("Erro ao iniciar o processo de recuperação de acesso");
    }
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
