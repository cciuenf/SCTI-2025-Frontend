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
type Props = {};

const formSchema = z.object({
  name: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  slug: z.string(),
  description: z.string(),
  location: z.string(),
  is_blocked: z.boolean(),
  is_hidden: z.boolean(),
  max_tokens_per_user: z.number().int(),
});

const CreateEventForm = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      start_date: new Date(),
      end_date: new Date(),
      location: "",
      is_blocked: false,
      is_hidden: false,
      max_tokens_per_user: 0,
    },
  });

  return (
    <div>
      <Form {...form}>
        <form className="flex flex-col w-11/12 gap-4 items-center overflow-y-hidden">
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
                <FormLabel>Curso</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Coloque o curso que o evento pertence"
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
                    required={true}
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
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia de início do evento</FormLabel>
                <FormControl>
                  <DateTimePicker />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia de fim do evento</FormLabel>
                <FormControl>
                  <DateTimePicker />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant={"yellow"}>
            Criar
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateEventForm;
