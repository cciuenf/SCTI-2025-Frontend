"use client";
import { handleLoginSubmit, handleSignUp } from "@/actions/auth-actions";
import { useState } from "react";

import LoginForm from "@/components/Auth/LoginForm";
import { cn } from "@/lib/utils";
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";
import VerifyForm from "@/components/VerifyForm";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mustShowVerify, setMustShowVerify] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [hasForgottedPassword, setHasForgottedPassword] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingSpinner size="xl" spinnerClassName="border-yellow-300 border-t-transparent border-6"/>
      </div>
    );
  }

  if (hasForgottedPassword) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-3">
        <div className="border-1 border-primary shadow-xs p-5 rounded-md flex flex-col items-center justify-around gap-3 w-[320px] h-[580px] md:w-[440px] lg:w-[480px]">
          <h2 className="text-2xl md:text-3xl lg:text-3xl">Recuperar Senha</h2>
          <p className="text-sm md:text-base lg:text-base">
            Parece que você se esqueceu da sua senha, para recuperá-la, coloque
            seu endereço de e-mail no campo abaixo:
          </p>
          <ForgotPasswordForm />
          <p
            className="cursor-pointer underline"
            onClick={() => setHasForgottedPassword(false)}
          >
            Voltar para a tela de login
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="h-full w-full flex justify-center items-center overflow-hidden p-2">
      <div
        className={cn(
          "relative w-[clamp(320px,88vw,480px)] h-[600px]",
          "flex flex-col justify-start items-center p-5 gap-5",
          "border-1 border-primary shadow-xs rounded-md overflow-y-auto",
        )}
      >
       {mustShowVerify ? (
          <VerifyForm
            setIsLoading={setIsLoading}
            origin="signup"
          />
        ) : (
          <>
            <div className="w-full flex items-center justify-around">
              <div
                className={cn(
                  "w-1/2 text-center cursor-pointer py-3 duration-300 hover:bg-secondary hover:text-zinc-100",
                  "border-1 border-r-0 border-foreground rounded-md rounded-r-none",
                  isLogin && "bg-secondary text-zinc-100"
                )}
                onClick={() => setIsLogin(true)}
              >
                <h2>Login</h2>
              </div>
              <div
                className={cn(
                  "w-1/2 text-center cursor-pointer py-3 duration-300 hover:bg-secondary hover:text-zinc-100",
                  "border-1 border-l-0 border-foreground rounded-md rounded-l-none",
                  !isLogin && "bg-secondary text-zinc-100"
                )}
                onClick={() => setIsLogin(false)}
              >
                <h2>Inscreva-se</h2>
              </div>
            </div>
            {isLogin ? (
              <>
                <h2 className="text-2xl md:text-3xl lg:text-3xl">
                  Faça seu Login!
                </h2>
                <LoginForm
                  key="login-form"
                  type="Login"
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
                <h2 className="text-2xl md:text-3xl lg:text-3xl">
                  Crie sua conta!
                </h2>

                <LoginForm
                  type="Sign Up"
                  handleSignUpSubmit={handleSignUp}
                  setMustShowVerify={setMustShowVerify}
                  setIsLoading={setIsLoading}
                />
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
