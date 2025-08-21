"use client";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import { PenIcon } from "lucide-react";
import { Button } from "../ui/button";

import type { Dispatch, SetStateAction} from "react";
import { useState } from "react";
import CustomGenericForm, {
  type FieldConfig,
} from "../ui/Generic/CustomGenericForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handleChangeName } from "@/actions/auth-actions";
import type { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import { runWithToast } from "@/lib/client/run-with-toast";

type Props = {
  accessData: UserAccessTokenJwtPayload;
  setAccessData: Dispatch<
    SetStateAction<UserAccessTokenJwtPayload | null | undefined>
  >;
};

const ChangeNameModalForm = ({ accessData, setAccessData }: Props) => {
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
      const newAccessTokenData = {
        ...accessData,
        name: new_name,
        last_name: new_last_name,
      };
      setAccessData(newAccessTokenData);
      setOpen(false);
    }
  };

  return (
    <CustomGenericModal
      title="Alterar nome e sobrenome"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant={"edit"} className="w-3/5 md:w-4/5">
          <PenIcon className="w-3 h-3 md:w-4 md:h-4" />
          <p className="text-sm md:text-base">Editar perfil</p>
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
