"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleVerifyToken } from "@/actions/auth-actions";
import { Dispatch, SetStateAction } from "react";

type Props = {
    setMustShowVerify: Dispatch<SetStateAction<boolean>>
};

const verifyFormSchema = z.object({
  digit_1: z.string().max(1).min(1),
  digit_2: z.string().max(1).min(1),
  digit_3: z.string().max(1).min(1),
  digit_4: z.string().max(1).min(1),
  digit_5: z.string().max(1).min(1),
  digit_6: z.string().max(1).min(1),
});

const VerifyForm = ({setMustShowVerify}: Props) => {
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

  const onSubmit = async ({
    digit_1,
    digit_2,
    digit_3,
    digit_4,
    digit_5,
    digit_6,
  }: z.infer<typeof verifyFormSchema>) => {
    const token = digit_1.concat(digit_2, digit_3, digit_4, digit_5, digit_6);
    const res = await handleVerifyToken(token)

    if (typeof res === "string") {
      return;
    }

  };
  return (
    <div className="flex flex-col justify-around items-center gap-3 max-w-md w-1/2 h-78 border-bg-zinc-100 border-1 p-3 rounded-md">
      <Form {...verifyForm}>
        <form
          className="w-full max-w-[340px] h-full flex flex-col justify-between items-center gap-3"
          onSubmit={verifyForm.handleSubmit(onSubmit)}
        >
          <h2 className="primary uppercase text-2xl">Verification Form</h2>
          <h3>
            We send to you an e-mail with the verification code. Please, check
            your email and enter the code to access your dashboard!
          </h3>
          <div className="flex justify-around items-center gap-3">
            <FormField
              name="digit_1"
              control={verifyForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={1}
                      className={
                        "text-center border-1 border-primary rounded-md py-2"
                      }
                    />
                  </FormControl>
                  <FormMessage />
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
                      {...field}
                      maxLength={1}
                      className={
                        "text-center border-1 border-primary rounded-md py-2"
                      }
                    />
                  </FormControl>
                  <FormMessage />
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
                      {...field}
                      maxLength={1}
                      className={
                        "text-center border-1 border-primary rounded-md py-2"
                      }
                    />
                  </FormControl>
                  <FormMessage />
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
                      {...field}
                      maxLength={1}
                      className={
                        "text-center border-1 border-primary rounded-md py-2"
                      }
                    />
                  </FormControl>
                  <FormMessage />
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
                      {...field}
                      maxLength={1}
                      className={
                        "text-center border-1 border-primary rounded-md py-2"
                      }
                    />
                  </FormControl>
                  <FormMessage />
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
                      {...field}
                      maxLength={1}
                      className={
                        "text-center border-1 border-primary rounded-md py-2"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Verify</Button>
        </form>
      </Form>
    </div>
  );
};

export default VerifyForm;
