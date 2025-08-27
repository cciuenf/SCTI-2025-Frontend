import React, { useState } from "react";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import { Lock } from "lucide-react";
import { Button } from "../ui/button";
import ForgotPasswordForm from "../Auth/ForgotPasswordForm";

const ChangePasswordModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <CustomGenericModal
      title="Alterar senha"
      description="Coloque aqui o seu e-mail para que possamos prosseguir com o processo de alteração da sua senha!"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="edit" className="w-full h-10 rounded-md">
          <Lock />
          <p className="text-sm">Alterar Senha</p>
        </Button>
      }
    >
      <ForgotPasswordForm />
    </CustomGenericModal>
  );
};

export default ChangePasswordModal;
