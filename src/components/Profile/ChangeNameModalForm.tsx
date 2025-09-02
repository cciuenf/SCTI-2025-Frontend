"use client";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import { PenLine } from "lucide-react";
import { Button } from "../ui/button";

import { useState } from "react";
import CustomGenericForm, {
  type FieldConfig,
} from "../ui/Generic/CustomGenericForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handleChangeName, handleForceReAuth } from "@/actions/auth-actions";
import type { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import { runWithToast } from "@/lib/client/run-with-toast";

type Props = {
  accessData: UserAccessTokenJwtPayload;
};

const ChangeNameModalForm = ({ accessData }: Props) => {
  const [open, setOpen] = useState(false);

  const fields: FieldConfig<z.infer<typeof changeNameFormSchema>>[] = [
    { name: "new_name", label: "Nome" },
    { name: "new_last_name", label: "Sobrenome" },
  ];

  const changeNameFormSchema = z.object({
    new_name: z.string().min(2, "O nome precisa de pelo menos 2 caracteres"),
    new_last_name: z
      .string()
      .min(2, "O sobrenome precisa de pelo menos 2 caracteres"),
  });

  const form = useForm<z.infer<typeof changeNameFormSchema>>({
    resolver: zodResolver(changeNameFormSchema),
    defaultValues: {
      new_name: accessData.name,
      new_last_name: accessData.last_name,
    },
  });

  const handleOnSubmit = async ({
    new_name,
    new_last_name,
  }: {
    new_name: string;
    new_last_name: string;
  }) => {
    const res = await runWithToast(
      handleChangeName(new_name, new_last_name),
      {
        loading: "Alterando nome...",
        success: () => "Nome alterado com sucesso!",
        error: () => "Erro ao alterar nome!",
      }
    )
    if(res.success) {
      await handleForceReAuth();
      setOpen(false);
    }
  };

  return (
    <CustomGenericModal
      title="Alterar nome e sobrenome"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="ghost" className="w-10 h-10 opacity-90 hover:opacity-100 p-2 rounded-full" title="Editar nome">
          <PenLine className="w-4 h-4 text-white hover:text-secondary"/>
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <CustomGenericForm
          schema={changeNameFormSchema}
          onSubmit={handleOnSubmit}
          fields={fields}
          defaultValues={form.getValues()}
          onCancel={() => setOpen(false)}
          form={form}
        />
      </div>
    </CustomGenericModal>
  );
};

export default ChangeNameModalForm;
