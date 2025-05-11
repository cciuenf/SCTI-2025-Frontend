import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col gap-4 justify-center items-center font-spartan w-1/2 mx-auto">
      <Image src={"/SCT.svg"} alt="Logo SCT" width={250} height={250} />
      <h2 className="text-foreground">
        Bem vindo ao site da SCT.{" "}
        <span className="text-secondary">
           Ainda estamos finalizando todos os detalhes para te trazer a melhor
          experiência. {" "}
        </span>
        Por hora, aproveite para criar a sua conta ou realizar login!
      </h2>
      <div className="flex w-full justify-around items-center">
        <Button asChild>
          <Link href={"login"}>Login</Link>
        </Button>
        <Button asChild variant={"yellow"}>
          <Link href={"sign-up"}>Cadastre-se</Link>
        </Button>
      </div>
    </div>
  );
}
