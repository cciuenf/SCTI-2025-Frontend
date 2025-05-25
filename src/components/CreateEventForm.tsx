"use client";
import React from "react";
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
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "./DateTimePicker";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleCreateEvent } from "@/actions/event-actions";
type Props = {};

const formSchema = z
  .object({
    name: z.string(),
    start_date: z.date().or(z.string()),
    end_date: z.date().or(z.string()),
    slug: z.string(),
    description: z.string(),
    location: z.string(),
    is_blocked: z.boolean(),
    is_hidden: z.boolean(),
    max_tokens_per_user: z.string(),
  })
  .refine((data) => data.start_date < data.end_date, {
    message: "A data de início precisa ser anterior a data de fim.",
    path: ["end_date"],
  });

const CreateEventForm = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      start_date: "",
      end_date: "",
      location: "",
      is_blocked: false,
      is_hidden: false,
      max_tokens_per_user: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const convertedValues = {
      ...values,
      max_tokens_per_user: parseInt(values.max_tokens_per_user),
    };
    try {
      const result = await handleCreateEvent(convertedValues);
      if (result.success) {
        // Handle success - maybe reset form or show success message
        form.reset();
        console.log("Event created successfully:", result.createdEventName);
      } else {
        // Handle error - show error message to user
        console.error("Failed to create event:", result);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col w-11/12 gap-4 items-center overflow-y-hidden font-spartan"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Coloque o nome do evento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Coloque a descrição do evento"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Coloque o local que o evento irá acontecer"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sigla</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Coloque a sigla referente ao evento"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max_tokens_per_user"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Tokens Por User</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Coloque o total de tokens por usuário"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_blocked"
            render={({ field }) => (
              <FormItem>
                <FormLabel>O evento será bloqueado?</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_hidden"
            render={({ field }) => (
              <FormItem>
                <FormLabel>O evento será ocultado?</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DateTimePicker
            inputName={"start_date"}
            form={form}
            label={"Coloque a data de início"}
          />
          <DateTimePicker
            inputName={"end_date"}
            form={form}
            label={"Coloque a data de fim"}
          />
          <Button variant={"yellow"}>Criar</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateEventForm;
