import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

type LoginFormProps = {
  type: "Login" | "Sign Up";
  handleLoginSubmit?: (values: {
    email: string;
    password: string;
  }) => Promise<any>;

  handleSignUpSubmit?: (values: {
    name: string;
    last_name: string;
    email: string;
    password: string;
  }) => Promise<string | boolean>;

  setMustShowVerify?: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const formSchema = z.object({
  name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

export default function LoginForm({
  type,
  handleLoginSubmit,
  handleSignUpSubmit,
  setMustShowVerify,
  setIsLoading,
}: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const signForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmitSign = async (values: z.infer<typeof formSchema>) => {
    if (!handleSignUpSubmit) return;

    setIsLoading(true);
    const response = await handleSignUpSubmit(values);
    setIsLoading(false);

    if (typeof response === "string") {
      toast.error(`Erro ao realizar a criação da conta`);
      return;
    } else {
      toast.info("Código de verificação enviado para o e-mail cadastrado!");
    }

    if (response === false && setMustShowVerify) setMustShowVerify(true);
  };

  const onSubmitLogin = async (values: z.infer<typeof loginFormSchema>) => {
    if (handleLoginSubmit) {
      setIsLoading(true);
      try {
        const res = await handleLoginSubmit(values);
        if (!res.success) {
          toast.error("Erro ao realizar login");
        } else {
          setIsLoading(false);
          router.push("/dashboard");
          toast.success("Login bem-sucedido!");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      {type == "Login" ? (
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onSubmitLogin)}
            className="flex flex-col gap-5 w-sm items-center"
          >
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Coloque seu email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Coloque sua senha"
                        {...field}
                      />
                      <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-accent" />
                        ) : (
                          <Eye className="h-5 w-5 text-accent" />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Enviar!</Button>
          </form>
        </Form>
      ) : (
        <Form {...signForm}>
          <form
            onSubmit={signForm.handleSubmit(onSubmitSign)}
            className="flex flex-col gap-5 w-sm items-center"
          >
            <FormField
              control={signForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Coloque seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signForm.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobrenome</FormLabel>
                  <FormControl>
                    <Input placeholder="Coloque seu sobrenome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Coloque seu email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Coloque sua senha"
                        {...field}
                      />
                      <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-accent" />
                        ) : (
                          <Eye className="h-5 w-5 text-accent" />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Enviar</Button>
          </form>
        </Form>
      )}
    </div>
  );
}
