import React, { useState } from "react";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import { Lock } from "lucide-react";
import { Button } from "../ui/button";
import ForgotPasswordForm from "../Auth/ForgotPasswordForm";

const ChangePasswordModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-3/5 md:w-full flex items-center justify-center md:justify-end">
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
    </div>
  );
};

export default ChangePasswordModal;
