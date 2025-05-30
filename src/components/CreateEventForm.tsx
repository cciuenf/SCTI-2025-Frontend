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
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventCredentialsI } from "@/types/event-interfaces";
import { useRouter } from "next/navigation";

type Props = {
  event?: {
    name: string;
    description: string;
    slug: string;
    start_date: string | Date;
    end_date: string | Date;
    location: string;
    is_blocked: boolean;
    is_hidden: boolean;
    max_tokens_per_user: number;
  } | null;
  handleUpdate?: (data: Partial<EventCredentialsI>, slug: string) => any;
  handleCreate?: (data: EventCredentialsI) => any;
  type: "Create" | "Update";
  slug?: string;
};

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

const CreateEventForm = ({
  event,
  handleCreate,
  handleUpdate,
  type,
  slug,
}: Props) => {
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

  const router = useRouter()

  useEffect(() => {
    if (event) {
      form.reset({
        name: event.name,
        start_date: new Date(event.start_date),
        end_date: new Date(event.end_date),
        slug: event.slug,
        description: event.description,
        location: event.location,
        is_blocked: event.is_blocked,
        is_hidden: event.is_hidden,
        max_tokens_per_user: event.max_tokens_per_user.toString(),
      });
    }
  }, []);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const convertedValues = {
      ...values,
      max_tokens_per_user: parseInt(values.max_tokens_per_user),
    };

    if (type === "Update" && slug && handleUpdate) {
      try {
        const result = await handleUpdate(convertedValues, slug);
        if (result.success) {
          console.log("Evento atualizado com sucesso:", result.data.Name);
          router.push(`${result.data.Slug}`)
        } else {
          console.error("Falha na atualização do evento:", result.data.Name);
        }
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
    if (handleCreate && type === "Create") {
      try {
        const result = await handleCreate(convertedValues);
        if (result.success) {
          form.reset();
          console.log("Evento criado com sucesso:", result.data.Name);
        } else {
          console.error("Falha na criação do evento:", result.data.Name);
        }
      } catch (error) {
        console.error("Error creating event:", error);
      }
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
          <Button type="submit" variant={"yellow"}> {type == "Create" ? "Criar" : "Editar"}  </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateEventForm;
