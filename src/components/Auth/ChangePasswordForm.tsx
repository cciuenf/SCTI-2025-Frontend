"use client";
import React from "react";
import CustomGenericForm, {
  FieldConfig,
} from "../ui/Generic/CustomGenericForm";
import { handleChangePassword } from "@/actions/auth-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { clearAuthTokens } from "@/lib/cookies";

type Props = {
  token: string;
};

const ChangePasswordForm = ({ token }: Props) => {
  const router = useRouter();
  const fields: FieldConfig<z.infer<typeof changePasswordFormSchema>>[] = [
    { name: "new_password", label: "Nova Senha" },
  ];

  const changePasswordFormSchema = z.object({
    new_password: z
      .string()
      .min(8, "A senha precisa de pelo menos 8 caracteres"),
  });

  const form = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      new_password: "",
    },
  });

  const handleOnSubmit = async ({ new_password }: { new_password: string }) => {
    const result = await handleChangePassword(new_password, token);

    if (result?.status == 200) {
      await clearAuthTokens()
      toast.success("Senha alterada com sucesso!");
      router.push("/login");
      return;
    }

    if (result?.status != 200) {
      toast.error("Token inválido ou expirado!")
    }
  };

  return (
    <div className="w-[400px] h-[300px] flex flex-col items-center justify-around mx-auto border-2 shadow-xs p-2 rounded-md">
      <h2 className="text-2xl">Digite sua nova senha</h2>
      <CustomGenericForm
        schema={changePasswordFormSchema}
        onSubmit={handleOnSubmit}
        fields={fields}
        defaultValues={form.getValues()}
        form={form}
      />
    </div>
  );
};

export default ChangePasswordForm;
