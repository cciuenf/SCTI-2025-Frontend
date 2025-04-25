"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

type LoginFormProps = {
  type: "login" | "sign up";
  handleSubmit: (
    values:
      | { email: string; password: string }
      | {
          username: string;
          email: string;
          password: string;
          confirm_password: string;
        }
  ) => void | Promise<String>;
};

const formSchema = z.object({
  username: z.string().min(2).max(12),
  email: z.string().email(),
  password: z.string().min(8).max(20),
  confirm_password: z.string().min(8).max(20),
});

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

export default function LoginForm({ type, handleSubmit }: LoginFormProps) {
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const signForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmitSign = (values: z.infer<typeof formSchema>) => {};

  const onSubmitLogin = async (values: z.infer<typeof loginFormSchema>) => {
    handleSubmit(values);
  };

  return (
    <>
      {type == "login" ? (
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
                    <Input placeholder="Put your email" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Put your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Send!</Button>
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Put your name" {...field} />
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
                    <Input placeholder="Put your email" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Put your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signForm.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Send!</Button>
          </form>
        </Form>
      )}
    </>
  );
}
