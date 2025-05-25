"use client";
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
import { handleGetEvents } from "@/actions/event-actions";

type LoginFormProps = {
  type: "Login" | "Sign Up";
  handleLoginSubmit?: (values: {
    email: string;
    password: string;
  }) => Promise<String>;

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
    if (!handleSignUpSubmit) {
      return;
    }

    setIsLoading(true);
    const response = await handleSignUpSubmit(values);
    setIsLoading(false);

    if (typeof response === "string") {
      console.error(response);
      return;
    }

    if (response === false && setMustShowVerify) {
      setMustShowVerify(true);
    }
  };

  const onSubmitLogin = async (values: z.infer<typeof loginFormSchema>) => {
    if (handleLoginSubmit) {
      setIsLoading(true);
      try {
        await handleLoginSubmit(values);
        await handleGetEvents();
      } catch (error) {
        console.error("Login or event fetching failed:", error);
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Put your first name" {...field} />
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
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Put your last name" {...field} />
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
            <Button type="submit">Send!</Button>
          </form>
        </Form>
      )}
    </div>
  );
}
