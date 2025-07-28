"use client";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import {PenIcon} from "lucide-react";
import { Button } from "../ui/button";


import { Dispatch, SetStateAction, useState } from "react";
import CustomGenericForm, {
  FieldConfig,
} from "../ui/Generic/CustomGenericForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { handleChangeName } from "@/actions/auth-actions";
import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";

type Props = {
  accessData: UserAccessTokenJwtPayload
  setAccessData: Dispatch<SetStateAction<UserAccessTokenJwtPayload | null | undefined>>
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
    try {
      const result = await handleChangeName(new_name, new_last_name);

      if (result?.status == 200) {
        const newAccessTokenData = { ...accessData, name: new_name, last_name: new_last_name }
        setAccessData(newAccessTokenData)
        toast.success(`Nome alterado com sucesso!`);
        setOpen(false);
        return;
      }
    } catch (error) {
      toast.error("Erro ao alterar nome!");
    }
  };

  return (
    <CustomGenericModal
      title="Alterar nome e sobrenome"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant={"edit"} className="w-4/5">
          <PenIcon />
          <p>Editar perfil</p>
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
