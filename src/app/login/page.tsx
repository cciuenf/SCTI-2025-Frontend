"use client";
import { handleLoginSubmit } from "@/actions/auth-actions";
import { useState } from "react";

import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <>
      {isLoading ? (
        <Loader2 className="animate-spin w-5 h-5 text-yellow-300" />
      ) : (
        <div className="h-screen flex flex-col justify-center items-center gap-3">
          <LoginForm
            type={"Login"}
            handleLoginSubmit={handleLoginSubmit}
            setIsLoading={setIsLoading}
          />
          <Button variant={"outline"} asChild>
            <Link href={"/sign-up"}>Sign Up</Link>
          </Button>
        </div>
      )}
    </>
  );
}
