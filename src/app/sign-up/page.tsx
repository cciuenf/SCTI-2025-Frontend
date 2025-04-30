"use client";
import { handleSignUp } from "@/actions/auth-actions";
import { useState } from "react";

import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";



export default function SignUp() {
    const [isLoading, setIsLoading] = useState(false)
    const [isVerified, setIsVerified] = useState(false)

  return (

    <div className="h-screen flex flex-col justify-center items-center gap-3">

      <LoginForm type={"Sign Up"} handleSignUpSubmit={handleSignUp} />
      <Button variant={"outline"} asChild>
      <Link href={"/login"}>Login</Link>
      </Button>
    </div>

  );
}
