import React, { useState } from "react";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import { PenIcon } from "lucide-react";
import { Button } from "../ui/button";
import ForgotPasswordForm from "../Auth/ForgotPasswordForm";

type Props = {};

const ChangePasswordModal = (props: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-end">
      <CustomGenericModal
        title="Alterar senha"
        description="Coloque aqui o seu e-mail para que possamos prosseguir com o processo de alteração da sua senha!"
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Button variant={"edit"} className="w-4/5">
            <PenIcon />
            <p>Alterar Senha</p>
          </Button>
        }
      >
        <ForgotPasswordForm />
      </CustomGenericModal>
    </div>
  );
};

export default ChangePasswordModal;
