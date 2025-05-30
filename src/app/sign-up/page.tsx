"use client";
import { handleSignUp } from "@/actions/auth-actions";
import { useState } from "react";

import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import VerifyForm from "@/components/VerifyForm";
import { Loader2 } from "lucide-react";

export default function SignUp() {
  const [mustShowVerify, setMustShowVerify] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-3">
       {isLoading ? (
        <Loader2 className="animate-spin w-10 h-10 text-yellow-300" />
      ) : mustShowVerify ? (
        <VerifyForm setMustShowVerify={setMustShowVerify} setIsLoading={setIsLoading}/>
      ) : (
        <>
          <LoginForm
            type={"Sign Up"}
            handleSignUpSubmit={handleSignUp}
            setMustShowVerify={setMustShowVerify}
            setIsLoading={setIsLoading}
          />
          <Button variant={"outline"} asChild>
            <Link href={"/login"}>Login</Link>
          </Button>
        </>
      )}
    </div>
  );
}
