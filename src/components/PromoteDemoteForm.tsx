"use client";

import { useState } from "react";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "./ui/form";
import { z } from "zod";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import {
  handleDemoteUserInEvent,
  handlePromoteUserInEvent,
} from "@/actions/event-actions";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  slug: string;
};

const formSchema = z.object({
  email: z.string().email({ message: "Coloque um email válido!" }),
});

const PromoteDemoteForm = ({ slug }: Props) => {
  const [type, setType] = useState<"promoção" | "despromoção">("promoção");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleOnSubmit = async ({ email }: { email: string }) => {
    if (type === "promoção") {
      await handlePromoteUserInEvent(slug, email);
      return;
    }
    await handleDemoteUserInEvent(slug, email);
    return;
  };

  const handleSwitchFunction = () => {
    if (type === "promoção") {
      setType("despromoção");
      return;
    }

    setType("promoção");
    return;
  };

  return (
    <div className="w-full flex flex-col justify-around items-center gap-3">
      <Button onClick={() => handleSwitchFunction()}>Trocar função</Button>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleOnSubmit)}
          className="w-1/2 flex flex-col justify-around items-center gap-3"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail para {type}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Coloque aqui o e-mail"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {" "}
            {type === "promoção" ? "Promover" : "Despromover"}{" "}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PromoteDemoteForm;
