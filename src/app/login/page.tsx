"use client";
import { handleLoginSubmit, handleSignUp } from "@/actions/auth-actions";
import { useState } from "react";

import LoginForm from "@/components/Auth/LoginForm";
import VerifyForm from "@/components/VerifyForm";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [mustShowVerify, setMustShowVerify] = useState<boolean>(false);
  const [hasForgottedPassword, setHasForgottedPassword] =
    useState<boolean>(false);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-3">
      <div className="border-1 border-primary shadow-xs p-5 rounded-md flex flex-col items-center justify-around gap-3 w-[320px] h-[480px] md:w-[440px] lg:w-[480px]">
        {hasForgottedPassword ? (
          <>
            <h2 className="text-2xl md:text-3xl lg:text-3xl">Recuperar Senha</h2>
            <p className="text-sm md:text-base lg:text-base">
              Parece que você se esqueceu da sua senha, para recuperá-la,
              coloque seu endereço de e-mail no campo abaixo:
            </p>
            <ForgotPasswordForm/>
            <p
              className="cursor-pointer underline"
              onClick={() => setHasForgottedPassword(false)}
            >
              Voltar para a tela de login
            </p>
          </>
        ) : mustShowVerify ? (
          <VerifyForm
            setMustShowVerify={setMustShowVerify}
            setIsLoading={setIsLoading}
            origin="signup"
          />
        ) : (
          <>
            <div className="w-full flex items-center justify-around border-1 border-foreground">
              <div
                className={cn(
                  "w-1/2 text-center cursor-pointer py-3 duration-300 hover:bg-secondary hover:text-zinc-100",
                  isLogin && "bg-secondary text-zinc-100"
                )}
                onClick={() => setIsLogin(true)}
              >
                <h2>Login</h2>
              </div>
              <Separator orientation="vertical" className="bg-secondary" />
              <div
                className={cn(
                  "w-1/2 text-center cursor-pointer py-3 duration-300 hover:bg-secondary hover:text-zinc-100",
                  !isLogin && "bg-secondary text-zinc-100"
                )}
                onClick={() => setIsLogin(false)}
              >
                <h2>Inscreva-se</h2>
              </div>
            </div>
            {isLoading ? (
              <Loader2 className="animate-spin w-10 h-10 text-yellow-300" />
            ) : isLogin ? (
              <>
                <h2 className="text-2xl md:text-3xl lg:text-3xl">Faça seu Login!</h2>
                <LoginForm
                  key="login-form"
                  type={"Login"}
                  handleLoginSubmit={handleLoginSubmit}
                  setIsLoading={setIsLoading}
                />

                <p
                  className="underline cursor-pointer"
                  onClick={() => setHasForgottedPassword(true)}
                >
                  Esqueceu sua senha?
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl lg:text-3xl">Crie sua conta!</h2>

                <LoginForm
                  type={"Sign Up"}
                  handleSignUpSubmit={handleSignUp}
                  setMustShowVerify={setMustShowVerify}
                  setIsLoading={setIsLoading}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
