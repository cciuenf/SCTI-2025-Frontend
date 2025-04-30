"use client";
import { handleSignUp } from "@/actions/auth-actions";
import { useState } from "react";

import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import VerifyForm from "@/components/VerifyForm";

export default function SignUp() {
  const [mustShowVerify, setMustShowVerify] = useState(false);
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-3">
      {mustShowVerify ? (
        <VerifyForm setMustShowVerify={setMustShowVerify} />
      ) : (
        <>
          <LoginForm
            type={"Sign Up"}
            handleSignUpSubmit={handleSignUp}
            setMustShowVerify={setMustShowVerify}
          />
          <Button variant={"outline"} asChild>
            <Link href={"/login"}>Login</Link>
          </Button>
        </>
      )}
    </div>
  );
}
