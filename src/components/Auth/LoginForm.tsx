import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import {
  type LoginFormDataI,
  loginFormSchema,
  type SignUpFormDataI,
  type SignUpFormDataToSendI,
  signUpFormSchema
} from "@/schemas/auth-schema";
import CustomGenericForm from "../ui/Generic/CustomGenericForm";
import { runWithToast } from "@/lib/client/run-with-toast";
import type { ActionResult } from "@/actions/_utils";
import type { AuthCredentialsI } from "@/types/auth-interfaces";

type LoginFormProps = {
  type: "Login" | "Sign Up";
  handleLoginSubmit?: (values: LoginFormDataI) => Promise<ActionResult<AuthCredentialsI>>;
  handleSignUpSubmit?: (values: SignUpFormDataToSendI) => Promise<{success: boolean, data: null, message: string}>;

  setMustShowVerify?: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};


export default function LoginForm({
  type,
  handleLoginSubmit,
  handleSignUpSubmit,
  setIsLoading,
  setMustShowVerify,
}: LoginFormProps) {
  const router = useRouter();

  const onSubmitSignUp = async (values: SignUpFormDataToSendI) => {
    if (!handleSignUpSubmit) return;
    setIsLoading(true);
    await runWithToast(
      handleSignUpSubmit(values),
      {
        loading: "Realizando o Cadastro...",
        success: () => {
          if(setMustShowVerify) setMustShowVerify(true);
          return "Código de verificação enviado para o e-mail cadastrado!"
        },
        error: () => {
          setIsLoading(false);
          return "Erro ao realizar a criação da conta";
        }
      }
    )
  };

  const onSubmitLogin = async (values: LoginFormDataI) => {
    if (handleLoginSubmit) {
      setIsLoading(true);
      await runWithToast(
        handleLoginSubmit(values),
        {
          loading: "Realizando o Login...",
          success: () => {
            router.push("/events/scti");
            return "Login bem-sucedido!"
          },
          error: () => {
            setIsLoading(false);
            return "Erro ao realizar o login"
          }
        }
      )
    }
  };

  return (
    <div className="w-full">
      {type == "Login" ? (
        <CustomGenericForm<LoginFormDataI>
          schema={loginFormSchema}
          fields={[
            {
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "Coloque seu email",
            },
            {
              name: "password",
              label: "Senha",
              type: "password",
              placeholder: "Coloque sua senha",
            },
          ]}
          defaultValues={{
            email: "",
            password: "",
          }}
          onSubmit={onSubmitLogin}
          submitLabel="Realizar o Login"
          submittingLabel="Logando..."
        />
      ) : (
        <CustomGenericForm<SignUpFormDataI>
          schema={signUpFormSchema}
          fields={[
            {
              name: "name",
              label: "Nome",
              type: "text",
              placeholder: "Coloque seu nome",
            },
            {
              name: "last_name",
              label: "Sobrenome Completo",
              type: "text",
              placeholder: "Coloque seu sobrenome completo",
            },
            {
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "Coloque seu email",
            },
            {
              name: "is_uenf",
              label: "É aluno da UENF",
              type: "switch",
            },
            {
              name: "uenf_semester",
              label: "Em que semestre você está?",
              placeholder: "Selecione o Semestre",
              type: "select",
              options: Array.from({ length: 10 }, (_, i) => ({
                label: `${i + 1}º Semestre`,
                value: String(i + 1),
              })),
              disabledWhen: {
                field: "is_uenf",
                value: false
              },
            },
            {
              name: "password",
              label: "Senha",
              type: "password",
              placeholder: "Coloque sua senha",
            },
            {
              name: "confirm_password",
              label: "Confirme sua senha",
              type: "password",
              placeholder: "Coloque sua senha",
            },
            {
              name: "terms",
              label: "Eu estou ciente que meus dados serão compartilhados com os parceiros deste evento.",
              type: "checkbox",
              isLabelOnRight: true,
              labelClassName: "w-5/6",
              itemClassName: "flex gap-2 flex-wrap"
            }
          ]}
          defaultValues={{
            name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
            is_uenf: false,
            uenf_semester: "1",
            terms: false
          }}
          onSubmit={onSubmitSignUp}
          submitLabel="Realizar o Cadastro"
          submittingLabel="Cadastrando..."
        />
      )}
    </div>
  );
}
