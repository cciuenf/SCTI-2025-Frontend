import { type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { 
  type LoginFormDataI, 
  loginFormSchema, 
  type SignUpFormDataI, 
  signUpFormSchema 
} from "@/schemas/auth-schema";
import CustomGenericForm from "../ui/Generic/CustomGenericForm";

type LoginFormProps = {
  type: "Login" | "Sign Up";
  handleLoginSubmit?: (values: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; [key: string]: unknown }>;

  handleSignUpSubmit?: (values: {
    name: string;
    last_name: string;
    email: string;
    password: string;
  }) => Promise<string | boolean>;

  setMustShowVerify?: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};


export default function LoginForm({
  type,
  handleLoginSubmit,
  handleSignUpSubmit,
  setMustShowVerify,
  setIsLoading,
}: LoginFormProps) {
  const router = useRouter();

  const onSubmitSignUp = async (values: SignUpFormDataI) => {
    if (!handleSignUpSubmit) return;

    setIsLoading(true);
    const response = await handleSignUpSubmit(values);

    if (typeof response === "string") {
      toast.error(`Erro ao realizar a criação da conta`);
      return;
    } else {
      toast.info("Código de verificação enviado para o e-mail cadastrado!");
    }
    setIsLoading(false);

    if (response === false && setMustShowVerify) setMustShowVerify(true);
  };

  const onSubmitLogin = async (values: LoginFormDataI) => {
    if (handleLoginSubmit) {
      setIsLoading(true);
      try {
        const res = await handleLoginSubmit(values);
        if (!res.success) {
          toast.error("Erro ao realizar login");
        } else {
          router.push("/profile?view=infos");
          toast.success("Login bem-sucedido!");
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
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
              label: "Sobrenome",
              type: "text",
              placeholder: "Coloque seu sobrenome",
            },
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
            name: "",
            last_name: "",
            email: "",
            password: "",
          }}
          onSubmit={onSubmitSignUp}
          submitLabel="Realizar o Cadastro"
          submittingLabel="Cadastrando..."
        />
      )}
    </div>
  );
}
