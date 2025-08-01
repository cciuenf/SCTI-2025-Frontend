import React, { useState } from "react";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import { PenIcon } from "lucide-react";
import { Button } from "../ui/button";
import ForgotPasswordForm from "../Auth/ForgotPasswordForm";

type Props = {};

const ChangePasswordModal = (props: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-3/5 md:w-full flex items-center justify-center md:justify-end">
      <CustomGenericModal
        title="Alterar senha"
        description="Coloque aqui o seu e-mail para que possamos prosseguir com o processo de alteração da sua senha!"
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Button variant={"edit"} className="w-full">
            <PenIcon className="w-3 h-3 md:w-4 md:h-4"/>
            <p className="text-sm md:text-base">Alterar Senha</p>
          </Button>
        }
      >
        <ForgotPasswordForm />
      </CustomGenericModal>
    </div>
  );
};

export default ChangePasswordModal;
