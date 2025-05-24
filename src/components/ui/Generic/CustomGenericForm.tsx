"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm, DefaultValues } from "react-hook-form";
import { ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../input";
import { Switch } from "../switch";

export interface FieldConfig<T> {
  name: keyof T;
  label: string;
  type?: "text" | "number" | "switch" | "price";
  placeholder?: string;
}

interface GenericFormProps<T extends Record<string, any>> {
  schema: ZodSchema<T>;
  fields: FieldConfig<T>[];
  onSubmit: (data: T) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  defaultValues?: DefaultValues<T>;
}

function CustomGenericForm<T extends Record<string, any>>({
  schema,
  fields,
  onSubmit,
  onCancel,
  submitLabel = "Enviar",
  cancelLabel = "Cancelar",
  defaultValues,
}: GenericFormProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<T>({resolver: zodResolver(schema), ...(defaultValues ? { defaultValues } : {})});

  const handle = async (data: T) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handle)} className="flex flex-col gap-4 items-center">
        {fields.map((f) => (
          <FormField
            key={String(f.name)}
            control={form.control}
            name={f.name as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{f.label}</FormLabel>
                <FormControl>
                  {
                  f.type === 'switch' ?
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  : f.type === "number" ?
                    <Input
                      type="number"
                      min={0}
                      placeholder={f.placeholder}
                      value={isNaN(field.value) ? '' : field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  : f.type === "price" ? 
                    <Input
                      type="text"
                      value={
                        typeof field.value === "number"
                          ? (field.value / 100).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : ""
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d]/g, "")
                        field.onChange(parseInt(raw || "0", 10))
                      }}
                      placeholder={f.placeholder}
                    />
                  : 
                    <Input
                      placeholder={f.placeholder}
                      {...field}
                    />
                  }
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex justify-end gap-2 mt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" variant="yellow" disabled={isLoading}>
            {isLoading ? "Enviando..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CustomGenericForm;