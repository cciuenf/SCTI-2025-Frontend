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

enum FormType {
  Login = 0,
  SignUp = 1
}

type LoginFormProps = {
  type: "Login" | "Sign Up";
  handleLoginSubmit?: (
    values: { email: string; password: string }
  ) => Promise<String>;

  handleSignUpSubmit?: (values: {
    name: string;
    last_name: string;
    email: string;
    password: string;
    }) => Promise<string>
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

export default function LoginForm({ type, handleLoginSubmit, handleSignUpSubmit }: LoginFormProps) {

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

  const onSubmitSign = (values: z.infer<typeof formSchema>) => {
    if (handleSignUpSubmit) {
      handleSignUpSubmit(values);
    }
  };

  const onSubmitLogin = async (values: z.infer<typeof loginFormSchema>) => {
    if (handleLoginSubmit) {
     handleLoginSubmit(values)
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
