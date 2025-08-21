"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type RefObject, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  handleResendVerifyToken,
  handleVerifyToken,
} from "@/actions/auth-actions";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
  origin: "signup" | "profile";
};

const verifyFormSchema = z.object({
  digit_1: z.string().max(1).min(1),
  digit_2: z.string().max(1).min(1),
  digit_3: z.string().max(1).min(1),
  digit_4: z.string().max(1).min(1),
  digit_5: z.string().max(1).min(1),
  digit_6: z.string().max(1).min(1),
});

const VerifyForm = ({ setIsLoading, origin }: Props) => {
  const verifyForm = useForm<z.infer<typeof verifyFormSchema>>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: {
      digit_1: "",
      digit_2: "",
      digit_3: "",
      digit_4: "",
      digit_5: "",
      digit_6: "",
    },
  });

  const router = useRouter();

  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);
  const ref5 = useRef<HTMLInputElement>(null);
  const ref6 = useRef<HTMLInputElement>(null);
  const verifyRef = useRef<HTMLButtonElement>(null);

  const onSubmit = async ({
    digit_1,
    digit_2,
    digit_3,
    digit_4,
    digit_5,
    digit_6,
  }: z.infer<typeof verifyFormSchema>) => {
    const token = digit_1.concat(digit_2, digit_3, digit_4, digit_5, digit_6);
    if(setIsLoading) setIsLoading(true);
    const res = await handleVerifyToken(token);
    if(setIsLoading) setIsLoading(false);

    if (res.status == 200) {
      toast.success("Usuário verificado");
      router.push("/profile");
    }

    if (res.status != 200) {
      toast.error("Código inválido");
      return;
    }
  };

  const verifyAfter = () => {
    toast.message("Autentique a sua conta!", {
      description:
        "Para que consiga utilizar a plataforma da melhor maneira, precisamos que tenha sua conta autenticada. Acesse novamente o formulário de verificação em seu perfil e insira o código enviado em seu e-mail.",
    });
    router.push("/");
  };

  const resendVerifyToken = async () => {
    const res = await handleResendVerifyToken();

    if (res.status == 200) {
      toast.success("Código de verificação enviado re-enviado!");
      return;
    }

    if (res.status !== 200) {
      toast.error("Erro ao reenviar o código!");
    }
  };

  const toNext = (
    e: ChangeEvent<HTMLInputElement>,
    nextStep: RefObject<HTMLInputElement | HTMLButtonElement | null>
  ) => {
    if (e.target.value.length === e.target.maxLength) {
      nextStep?.current?.focus();
    }
  };

  return (
    <div className="flex flex-col justify-around items-center gap-3 max-w-md w-full h-60 p-3 rounded-md">
      <Form {...verifyForm}>
        <form
          className="w-full max-w-[400px] h-full flex flex-col justify-between items-center gap-3"
          onSubmit={verifyForm.handleSubmit(onSubmit)}
        >
          <h2 className="text-foreground uppercase text-2xl">
            Código de Verificação
          </h2>
          <div className="flex justify-around items-center gap-3">
            <FormField
              name="digit_1"
              control={verifyForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      onChange={(e) => {
                        field.onChange(e);
                        toNext(e, ref2);
                      }}
                      required={true}
                      name={field.name}
                      value={field.value}
                      maxLength={1}
                      className={
                        "text-center text-xl border-1 border-secondary text-secondary valid:bg-secondary valid:text-zinc-100 duration-500 selection:text-foreground rounded-md py-6"
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="digit_2"
              control={verifyForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      onChange={(e) => {
                        field.onChange(e);
                        toNext(e, ref3);
                      }}
                      ref={(el) => {
                        field.ref(el);
                        ref2.current = el;
                      }}
                      required={true}
                      name={field.name}
                      value={field.value}
                      maxLength={1}
                      className={
                        "text-center text-xl border-1 border-secondary text-secondary valid:bg-secondary valid:text-zinc-100 duration-500 selection:text-foreground  rounded-md py-6"
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="digit_3"
              control={verifyForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      onChange={(e) => {
                        field.onChange(e);
                        toNext(e, ref4);
                      }}
                      ref={(el) => {
                        field.ref(el);
                        ref3.current = el;
                      }}
                      required={true}
                      name={field.name}
                      value={field.value}
                      maxLength={1}
                      className={
                        "text-center text-xl border-1 border-secondary text-secondary valid:bg-secondary valid:text-zinc-100 duration-500 selection:text-foreground  rounded-md py-6"
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="digit_4"
              control={verifyForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      onChange={(e) => {
                        field.onChange(e);
                        toNext(e, ref5);
                      }}
                      ref={(el) => {
                        field.ref(el);
                        ref4.current = el;
                      }}
                      required={true}
                      name={field.name}
                      value={field.value}
                      maxLength={1}
                      className={
                        "text-center text-xl border-1 border-secondary text-secondary valid:bg-secondary valid:text-zinc-100 duration-500 selection:text-foreground  rounded-md py-6"
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="digit_5"
              control={verifyForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      onChange={(e) => {
                        field.onChange(e);
                        toNext(e, ref6);
                      }}
                      ref={(el) => {
                        field.ref(el);
                        ref5.current = el;
                      }}
                      required={true}
                      name={field.name}
                      value={field.value}
                      maxLength={1}
                      className={
                        "text-center text-xl border-1 border-secondary text-secondary valid:bg-secondary valid:text-zinc-100 duration-500 selection:text-foreground  rounded-md py-6"
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="digit_6"
              control={verifyForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      onChange={(e) => {
                        field.onChange(e);
                        toNext(e, verifyRef);
                      }}
                      ref={(el) => {
                        field.ref(el);
                        ref6.current = el;
                      }}
                      required={true}
                      name={field.name}
                      value={field.value}
                      maxLength={1}
                      className={
                        "text-center text-xl border-1 border-secondary text-secondary valid:bg-secondary valid:text-zinc-100 duration-500 selection:text-foreground  rounded-md py-6"
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button ref={verifyRef}>Verificar</Button>
          {origin == "signup" ? (
            <Button
              type="button"
              variant={"outline"}
              onClick={() => verifyAfter()}
            >
              Deixar para depois
            </Button>
          ) : (
            <Button type="button" onClick={resendVerifyToken}>
              Reenviar Código
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default VerifyForm;
